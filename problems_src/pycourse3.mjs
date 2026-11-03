// 수업 연습문제 대응 3: 10강 함수 (출력 채점 문제)
// 수업 자료의 연습문제와 같은 개념을 연습하도록, 값과 문장을 바꿔서 다시 만들었다.
import { o } from './_stdout.mjs';

const FN = '10강 함수';
const LM = '10강 람다·변수 범위';

export default [
  // ================= 함수 =================
  o({
    category: FN, level: 1, title: '내장 함수 5개 적용하기',
    desc: `<p>숫자 리스트 <code>L</code>이 주어져요. 내장 함수 <code>len</code>, <code>max</code>, <code>min</code>, <code>sum</code>, <code>sorted</code>를 차례로 적용한 결과를 <b>한 줄에 하나씩</b>(5줄) 출력하세요.</p>`,
    solution: `print(len(L))\nprint(max(L))\nprint(min(L))\nprint(sum(L))\nprint(sorted(L))\n`,
    hint: '<p>내장 함수는 <code>import</code> 없이 바로 쓸 수 있어요.</p>',
    cases: ['L = [3, 9, 1, 7]', 'L = [10]', 'L = [5, -2, 8, 0, 8]'],
  }),
  o({
    category: FN, level: 1, title: 'math 라이브러리 사용하기',
    desc: `<p>변수 <code>n</code>(양수)과 <code>x</code>(소수)가 주어져요. <code>math</code> 라이브러리를 <code>import</code>해서 아래 3줄을 출력하세요.</p>
<ol><li><code>n</code>의 제곱근 (<code>sqrt</code>)</li><li><code>x</code>를 올림한 값 (<code>ceil</code>)</li><li>원주율 (<code>pi</code>)</li></ol>`,
    solution: `import math\nprint(math.sqrt(n))\nprint(math.ceil(x))\nprint(math.pi)\n`,
    hint: '<p><code>import math</code> 뒤에 <code>math.sqrt(...)</code>, <code>math.ceil(...)</code>, <code>math.pi</code>를 써요.</p>',
    cases: ['n = 10\nx = 3.2', 'n = 16\nx = -1.5', 'n = 2\nx = 7.0'],
    needs: [['import\\s+math|from\\s+math\\s+import', 'math를 import해야 해요']],
  }),
  o({
    category: FN, level: 2, title: 'print의 반환값은 무엇일까',
    desc: `<p>변수 <code>msg</code>가 주어져요. <code>r = print(msg)</code> 처럼 <b><code>print</code>의 결과를 변수 <code>r</code>에 담고</b>, 이어서 <code>r</code>과 <code>type(r)</code>을 각각 출력하세요. (<code>print</code>는 값을 돌려주지 않아요)</p><p>총 3줄이 출력돼요: <code>msg</code> 자체(첫 번째 print가 출력), <code>r</code>, <code>type(r)</code></p>`,
    solution: `r = print(msg)\nprint(r)\nprint(type(r))\n`,
    hint: '<p>화면에 보여 주는 것(<code>print</code>)과 값을 돌려주는 것(<code>return</code>)은 달라요. 돌려주는 값이 없으면 <code>None</code>이에요.</p>',
    cases: ['msg = "Hi"', 'msg = "안녕"', 'msg = "hello world"'],
  }),
  o({
    category: FN, level: 1, title: '구간 합을 구하는 함수',
    desc: `<p><code>get_total(start, end)</code> 함수를 만드세요. <code>start</code>부터 <code>end</code>까지(<b>end 포함</b>) 모든 정수의 합을 <b>반환</b>해요.</p>
<p>변수 <code>a</code>, <code>b</code>, <code>c</code>가 주어져요. <code>get_total(1, a)</code>, <code>get_total(1, b)</code>, <code>get_total(1, c)</code>의 결과를 한 줄에 하나씩 출력하세요.</p>`,
    solution: `def get_total(start, end):\n    total = 0\n    for i in range(start, end + 1):\n        total += i\n    return total\n\nprint(get_total(1, a))\nprint(get_total(1, b))\nprint(get_total(1, c))\n`,
    hint: '<p><code>range(start, end + 1)</code>로 끝값까지 포함해요. 결과는 <code>print</code>가 아니라 <code>return</code>으로 돌려주세요.</p>',
    cases: ['a = 10\nb = 20\nc = 100', 'a = 1\nb = 5\nc = 50', 'a = 3\nb = 0\nc = 7'],
    needs: [['def\\s+get_total\\s*\\(', 'get_total 함수를 정의해야 해요'], ['return', '결과를 return으로 돌려줘야 해요']],
  }),
  o({
    category: FN, level: 1, title: '두 수를 더해 돌려주는 함수',
    desc: `<p>두 수를 받아 <b>합을 반환</b>하는 함수 <code>add(a, b)</code>를 만드세요. 변수 <code>x</code>, <code>y</code>가 주어져요. <code>add(x, y)</code>의 결과를 변수 <code>result</code>에 담고, <code>result</code>를 출력하세요.</p>`,
    solution: `def add(a, b):\n    return a + b\n\nresult = add(x, y)\nprint(result)\n`,
    hint: '<p>함수를 <b>정의</b>만 해서는 아무 일도 일어나지 않아요. 호출해야 실행돼요.</p>',
    cases: ['x = 3\ny = 4', 'x = -5\ny = 5', 'x = 1.5\ny = 2'],
    needs: [['def\\s+add\\s*\\(', 'add 함수를 정의해야 해요']],
  }),
  o({
    category: FN, level: 1, title: '입력도 반환도 없는 함수 (두 번 호출)', singleCase: true,
    desc: `<p>입력(인수)도 반환값도 없이 <code>"안녕하세요"</code>를 <b>한 번 출력</b>하는 함수 <code>say_hi()</code>를 만드세요. 그리고 이 함수를 <b>2번 호출</b>하세요. (함수 안에서 한 번 출력, 호출 2번 → 총 2줄)</p>`,
    solution: `def say_hi():\n    print("안녕하세요")\n\nsay_hi()\nsay_hi()\n`,
    hint: '<p>함수 이름 뒤에 빈 괄호 <code>()</code>를 붙여야 호출돼요.</p>',
    cases: [{ pre: '' }],
    needs: [['def\\s+say_hi\\s*\\(\\s*\\)', 'say_hi() 함수를 정의해야 해요']],
  }),
  o({
    category: FN, level: 2, title: '메시지를 n번 출력하는 함수 (위치·키워드 인수)',
    desc: `<p><code>n_println(message, n)</code> 함수를 만드세요. <code>message</code>를 <code>n</code>번(한 줄에 하나씩) 출력해요. 변수 <code>msg</code>, <code>k</code>가 주어져요.</p>
<ol><li>(가) 위치 인수로 <code>n_println(msg, k)</code> 호출</li><li>(나) <b>순서를 바꿔서</b> 키워드 인수로 <code>n_println(n=k, message=msg)</code> 호출</li></ol>`,
    solution: `def n_println(message, n):\n    for i in range(n):\n        print(message)\n\nn_println(msg, k)\nn_println(n=k, message=msg)\n`,
    hint: '<p>키워드 인수(<code>이름=값</code>)로 부르면 인수의 순서가 달라도 돼요.</p>',
    cases: ['msg = "안녕"\nk = 2', 'msg = "go"\nk = 3', 'msg = "x"\nk = 1'],
    needs: [['def\\s+n_println\\s*\\(', 'n_println 함수를 정의해야 해요'], ['n\\s*=\\s*k', '키워드 인수 n=k 로도 호출해 보세요']],
  }),
  o({
    category: FN, level: 2, title: '기본값이 있는 인수',
    singleCase: true,
    desc: `<p><code>mix(a, b, c=10)</code> 함수를 만드세요. <code>(a + b) * c</code>를 <b>반환</b>해요(<code>c</code>의 기본값은 10). 그리고 아래 3개의 결과를 한 줄에 하나씩 출력하세요.</p>
<ol><li><code>mix(2, 3)</code></li><li><code>mix(1, 2, 3)</code></li><li><code>mix(c=2, a=4, b=1)</code> (키워드 인수, 순서 자유)</li></ol>`,
    solution: `def mix(a, b, c=10):\n    return (a + b) * c\n\nprint(mix(2, 3))\nprint(mix(1, 2, 3))\nprint(mix(c=2, a=4, b=1))\n`,
    hint: '<p>기본값이 있는 매개변수는 <b>기본값 없는 매개변수 뒤</b>에 써야 해요. 호출할 때 생략하면 기본값을 써요.</p>',
    cases: [{ pre: '' }],
    needs: [['def\\s+mix\\s*\\(', 'mix 함수를 정의해야 해요']],
  }),
  o({
    category: FN, level: 2, title: '가변 인자로 모두 더하기',
    singleCase: true,
    desc: `<p>인수를 <b>몇 개든</b> 받아서 모두 더한 값을 <code>합계: 값</code> 형태로 <b>출력</b>하는 함수 <code>show_total(*nums)</code>를 만드세요. (변수 이름으로 <code>sum</code>은 쓰지 마세요) 그리고 아래 2번 호출하세요.</p>
<ol><li><code>show_total()</code> (인수 없음)</li><li><code>show_total(1, 2, 3, 4, 5)</code></li></ol><p>출력 예: <code>합계: 0</code>, <code>합계: 15</code></p>`,
    solution: `def show_total(*nums):\n    total = 0\n    for n in nums:\n        total += n\n    print("합계:", total)\n\nshow_total()\nshow_total(1, 2, 3, 4, 5)\n`,
    hint: '<p><code>*nums</code> 는 받은 인수들을 튜플로 묶어 줘요. 인수가 없으면 빈 튜플이에요.</p>',
    cases: [{ pre: '' }],
    needs: [['def\\s+show_total\\s*\\(\\s*\\*', '매개변수에 *nums 를 써야 해요']],
    forbids: [['\\bsum\\s*=', '변수 이름으로 sum을 쓰지 마세요 (내장 함수 sum이 가려져요)']],
  }),
  o({
    category: FN, level: 2, title: '두 수 중 큰 수 (return 두 번)',
    desc: `<p>두 수 중 큰 수를 <b>반환</b>하는 함수 <code>get_larger(a, b)</code>를 만드세요. <code>if</code>/<code>else</code>를 써서 <code>return</code>이 <b>두 번</b> 나오게 하세요. 변수 <code>p</code>, <code>q</code>가 주어져요. <code>get_larger(p, q)</code>의 결과를 출력하세요. (변수 이름으로 <code>max</code>는 쓰지 마세요)</p>`,
    solution: `def get_larger(a, b):\n    if a > b:\n        return a\n    else:\n        return b\n\nprint(get_larger(p, q))\n`,
    hint: '<p><code>return</code>을 만나면 그 자리에서 값을 돌려주고 함수가 끝나요.</p>',
    cases: ['p = 10\nq = 20', 'p = 7\nq = 7', 'p = -3\nq = -8'],
    needs: [['def\\s+get_larger\\s*\\(', 'get_larger 함수를 정의해야 해요'], ['return[\\s\\S]*return', 'return을 두 번 써 보세요']],
    forbids: [['\\bmax\\s*=', '변수 이름으로 max를 쓰지 마세요']],
  }),
  o({
    category: FN, level: 3, title: '최솟값과 최댓값을 함께 반환',
    desc: `<p>리스트를 받아 <b>최솟값과 최댓값을 함께 반환</b>하는 함수 <code>min_max(nums)</code>를 만드세요. (튜플 반환) 숫자 리스트 <code>data</code>가 주어져요. 결과를 두 변수 <code>lo</code>, <code>hi</code>에 <b>나눠 담아서</b> <code>print(lo, hi)</code> 로 출력하세요.</p>`,
    solution: `def min_max(nums):\n    return min(nums), max(nums)\n\nlo, hi = min_max(data)\nprint(lo, hi)\n`,
    hint: '<p><code>return a, b</code> 는 튜플 하나를 돌려주는 것이고, 받는 쪽에서 <code>lo, hi = ...</code> 로 풀어(unpacking) 담아요.</p>',
    cases: ['data = [3, 9, 1, 7]', 'data = [5]', 'data = [-2, 4, 0]'],
    needs: [['def\\s+min_max\\s*\\(', 'min_max 함수를 정의해야 해요']],
  }),
  o({
    category: FN, level: 3, title: '평균·분산·표준편차를 한꺼번에 반환',
    desc: `<p>숫자 리스트를 받아 <b>평균, 분산, 표준편차</b>를 한꺼번에 반환하는 함수 <code>describe(nums)</code>를 만드세요.</p>
<ul><li>분산은 모분산: 각 값과 평균의 차이를 제곱한 값들의 평균</li><li>표준편차는 분산의 제곱근 (<code>** 0.5</code>)</li></ul>
<p>숫자 리스트 <code>data</code>가 주어져요. 결과를 세 변수로 풀어 담고 <code>print(mean, var, std)</code> 로 출력하세요.</p>`,
    solution: `def describe(nums):\n    mean = sum(nums) / len(nums)\n    var = sum((x - mean) ** 2 for x in nums) / len(nums)\n    std = var ** 0.5\n    return mean, var, std\n\nmean, var, std = describe(data)\nprint(mean, var, std)\n`,
    hint: '<p>평균 → 분산 → 표준편차 순서로 구하고 <code>return mean, var, std</code> 로 세 개를 한 번에 돌려줘요.</p>',
    cases: ['data = [2, 4, 4, 4, 5, 5, 7, 9]', 'data = [1, 2, 3, 4, 5]', 'data = [10, 10, 10]'],
    needs: [['def\\s+describe\\s*\\(', 'describe 함수를 정의해야 해요']],
  }),
  o({
    category: FN, level: 2, title: '점수를 학점으로 바꾸는 함수와 map',
    desc: `<p>점수를 받아 학점을 <b>반환</b>하는 함수 <code>to_grade(score)</code>를 만드세요: <b>90 이상 <code>"A"</code>, 80 이상 <code>"B"</code>, 70 이상 <code>"C"</code>, 나머지 <code>"F"</code></b>. 점수 리스트 <code>scores</code>가 주어져요. <code>map</code>으로 전체에 적용한 학점 <b>리스트</b>를 출력하세요.</p>`,
    solution: `def to_grade(score):\n    if score >= 90:\n        return "A"\n    elif score >= 80:\n        return "B"\n    elif score >= 70:\n        return "C"\n    else:\n        return "F"\n\nprint(list(map(to_grade, scores)))\n`,
    hint: '<p><code>map(함수, 리스트)</code> 의 결과는 map 객체라서 <code>list( )</code>로 감싸야 값을 볼 수 있어요.</p>',
    cases: ['scores = [95, 82, 71, 55]', 'scores = [100, 90, 89, 80, 79, 70, 69]', 'scores = []'],
    needs: [['def\\s+to_grade\\s*\\(', 'to_grade 함수를 정의해야 해요'], ['map\\s*\\(', 'map을 사용해야 해요']],
  }),
  o({
    category: FN, level: 3, title: '단어 수를 세는 함수',
    desc: `<p>문자열을 받아 <b>단어별 등장 횟수</b>를 딕셔너리로 반환하는 함수 <code>word_count(text)</code>를 만드세요. (공백으로 단어를 나누고, 딕셔너리 <code>get</code>을 활용해 보세요) 문자열 <code>line</code>이 주어져요. <code>word_count(line)</code>의 결과를 출력하세요. (단어가 처음 나온 순서)</p>`,
    solution: `def word_count(text):\n    counts = {}\n    for w in text.split():\n        counts[w] = counts.get(w, 0) + 1\n    return counts\n\nprint(word_count(line))\n`,
    hint: '<p><code>text.split()</code>으로 단어 리스트를 만들고, 앞에서 연습한 글자 세기와 같은 방식으로 세요.</p>',
    cases: ['line = "a b a c b a"', 'line = "go go go"', 'line = "one two three"'],
    needs: [['def\\s+word_count\\s*\\(', 'word_count 함수를 정의해야 해요']],
  }),
  o({
    category: FN, level: 2, title: '출력하는 함수 vs 값을 돌려주는 함수',
    desc: `<p>정수 <code>n</code>이 주어져요. 두 함수를 만드세요.</p>
<ul><li><code>square_print(n)</code> — <code>n * n</code>을 <b>출력만</b> 해요 (return 없음)</li><li><code>square_ret(n)</code> — <code>n * n</code>을 <b>반환</b>만 해요 (출력 없음)</li></ul>
<p>그리고 아래 3줄이 출력되게 하세요.</p><ol><li><code>print(square_ret(n))</code></li><li><code>x = square_print(n)</code> (함수 안에서 한 줄 출력됨)</li><li><code>print(x)</code> — 반환값이 없어서 <code>None</code>이에요</li></ol>`,
    solution: `def square_print(n):\n    print(n * n)\n\ndef square_ret(n):\n    return n * n\n\nprint(square_ret(n))\nx = square_print(n)\nprint(x)\n`,
    hint: '<p>값을 다시 계산에 쓰려면 <code>print</code>가 아니라 <code>return</code>을 써야 해요.</p>',
    cases: ['n = 4', 'n = -3', 'n = 0'],
    needs: [['def\\s+square_print', 'square_print 함수를 정의해야 해요'], ['def\\s+square_ret', 'square_ret 함수를 정의해야 해요']],
  }),
  o({
    category: FN, level: 2, title: 'return을 만나면 함수가 끝난다',
    desc: `<p>수를 받아 <b>양수이면 <code>"양수"</code>, 아니면 <code>"0 이하"</code></b>를 반환하는 함수 <code>check(n)</code>을 만드세요. 첫 번째 <code>return</code> 뒤에는 코드가 실행되지 않아요. 변수 <code>a</code>, <code>b</code>가 주어져요. <code>check(a)</code>, <code>check(b)</code>를 한 줄에 하나씩 출력하세요.</p>`,
    solution: `def check(n):\n    if n > 0:\n        return "양수"\n    return "0 이하"\n\nprint(check(a))\nprint(check(b))\n`,
    hint: '<p><code>if</code> 안에서 <code>return</code>을 만나면 그 뒤는 실행되지 않으니, <code>else</code> 없이도 나머지 경우를 처리할 수 있어요.</p>',
    cases: ['a = 5\nb = -1', 'a = 0\nb = 100', 'a = -7\nb = -8'],
    needs: [['def\\s+check\\s*\\(', 'check 함수를 정의해야 해요']],
  }),
  o({
    category: FN, level: 2, title: '함수는 호출하기 전에 정의해야 한다', singleCase: true,
    desc: `<p>함수는 <b>호출하기 전에 정의</b>되어 있어야 해요. 아래를 순서대로 하세요.</p>
<ol><li>아직 정의하지 않은 <code>hello()</code>를 <code>try / except NameError</code> 안에서 호출하고, 오류가 나면 <code>NameError</code>를 출력</li><li><code>"hello world"</code>를 출력하는 함수 <code>hello()</code>를 <b>정의</b></li><li><code>hello()</code>를 호출</li></ol><p>출력은 2줄: <code>NameError</code>, <code>hello world</code></p>`,
    solution: `try:\n    hello()\nexcept NameError:\n    print("NameError")\n\ndef hello():\n    print("hello world")\n\nhello()\n`,
    hint: '<p>파이썬은 위에서 아래로 한 줄씩 실행해서, 호출이 정의보다 앞에 있으면 아직 그 이름을 몰라요.</p>',
    cases: [{ pre: '' }],
  }),

  // ================= 람다 · 변수 범위 · 참조 =================
  o({
    category: LM, level: 2, title: 'map: 제곱 리스트 (일반 함수와 lambda)',
    desc: `<p>숫자 리스트 <code>lst</code>가 주어져요. 각 원소를 <b>제곱</b>한 리스트를 두 가지 방법으로 만들어 한 줄에 하나씩 출력하세요.</p>
<ol><li>(가) <code>def square(n)</code> 으로 만든 일반 함수와 <code>map</code></li><li>(나) <code>lambda</code>와 <code>map</code></li></ol>`,
    solution: `def square(n):\n    return n * n\n\nprint(list(map(square, lst)))\nprint(list(map(lambda x: x * x, lst)))\n`,
    hint: '<p>lambda는 이름 없는 함수예요: <code>lambda 매개변수: 반환식</code> (return을 쓰지 않아요).</p>',
    cases: ['lst = [1, 2, 3, 4, 5]', 'lst = [0, -2, 10]', 'lst = []'],
    needs: [['lambda', 'lambda를 사용해야 해요'], ['def\\s+square', 'square 함수를 정의해야 해요'], ['map\\s*\\(', 'map을 사용해야 해요']],
  }),
  o({
    category: LM, level: 2, title: 'filter: 기준보다 작은 값만 (일반 함수와 lambda)',
    desc: `<p>숫자 리스트 <code>lst</code>와 기준값 <code>limit</code>이 주어져요. <b><code>limit</code>보다 작은 원소</b>만 골라 리스트로 만들어 한 줄에 하나씩 두 번 출력하세요.</p>
<ol><li>(가) <code>def</code>로 만든 일반 함수와 <code>filter</code></li><li>(나) <code>lambda</code>와 <code>filter</code></li></ol>`,
    solution: `def small(n):\n    return n < limit\n\nprint(list(filter(small, lst)))\nprint(list(filter(lambda x: x < limit, lst)))\n`,
    hint: '<p><code>filter(함수, 리스트)</code>는 함수가 <code>True</code>를 돌려주는 원소만 남겨요.</p>',
    cases: ['lst = [1, 2, 3, 4, 5]\nlimit = 3', 'lst = [10, 20, 30]\nlimit = 25', 'lst = [5, 6]\nlimit = 0'],
    needs: [['lambda', 'lambda를 사용해야 해요'], ['filter\\s*\\(', 'filter를 사용해야 해요'], ['def\\s+\\w+', '일반 함수(def)도 만들어 보세요']],
  }),
  o({
    category: LM, level: 3, title: 'filter와 map을 함께 쓰기',
    desc: `<p>숫자 리스트 <code>nums</code>가 주어져요. <b>짝수만 골라서 각각 10을 곱한</b> 리스트를 <code>filter</code>와 <code>map</code>을 함께 써서 만들고 출력하세요.</p>`,
    solution: `print(list(map(lambda x: x * 10, filter(lambda x: x % 2 == 0, nums))))\n`,
    hint: '<p>먼저 <code>filter</code>로 짝수만 고르고, 그 결과를 <code>map</code>에 넘겨요. 바깥쪽 <code>list( )</code>로 한 번만 감싸면 돼요.</p>',
    cases: ['nums = [1, 2, 3, 4, 5, 6]', 'nums = [7, 9]', 'nums = [10, 15, 20]'],
    needs: [['map\\s*\\(', 'map을 사용해야 해요'], ['filter\\s*\\(', 'filter를 사용해야 해요']],
  }),
  o({
    category: LM, level: 2, title: 'lambda를 정렬 기준으로 쓰기',
    desc: `<p>(이름, 점수) 튜플의 리스트 <code>students</code>가 주어져요. <b>점수가 높은 순서</b>로 정렬한 리스트를 <code>sorted</code>와 <code>key=lambda ...</code>로 만들어 출력하세요. (점수는 서로 달라요)</p>`,
    solution: `print(sorted(students, key=lambda s: s[1], reverse=True))\n`,
    hint: '<p><code>key</code>는 "무엇을 기준으로 비교할지"를 알려주는 함수예요. 튜플의 두 번째 값(<code>s[1]</code>)이 점수예요.</p>',
    cases: ['students = [("철수", 80), ("영희", 95), ("민수", 70)]', 'students = [("a", 1)]', 'students = [("x", 30), ("y", 10), ("z", 20)]'],
    needs: [['lambda', 'lambda를 사용해야 해요']],
  }),
  o({
    category: LM, level: 2, title: '지역 변수는 전역 변수를 바꾸지 않는다',
    desc: `<p>전역 변수 <code>a</code>가 주어져요. 아래를 하세요.</p>
<ol><li>함수 <code>test()</code>를 만들어, 안에서 <b>지역 변수</b> <code>a = 200</code>을 만들고 출력하세요.</li><li><code>test()</code>를 호출한 뒤, 바깥(전역)의 <code>a</code>를 출력하세요.</li></ol><p>출력은 2줄이에요: 함수 안의 <code>a</code>(200), 그 다음 전역 <code>a</code>.</p>`,
    solution: `def test():\n    a = 200\n    print(a)\n\ntest()\nprint(a)\n`,
    hint: '<p>함수 안에서 값을 <b>할당</b>하면 같은 이름이어도 새 지역 변수가 만들어져요. 바깥의 전역 변수는 그대로예요.</p>',
    cases: ['a = 100', 'a = 7', 'a = "hello"'],
    needs: [['def\\s+test\\s*\\(', 'test 함수를 정의해야 해요']],
  }),
  o({
    category: LM, level: 1, title: '함수 안에서 전역 변수 읽기',
    desc: `<p>전역 변수 <code>menu</code>(문자열)가 주어져요. 인수 없이 <b>전역 변수 <code>menu</code>를 출력</b>하는 함수 <code>order()</code>를 만들고 호출하세요. (함수 안에서 읽기만 하는 것은 괜찮아요)</p>`,
    solution: `def order():\n    print(menu)\n\norder()\n`,
    hint: '<p>함수 안에서 이름을 찾을 때는 지역 변수 → 전역 변수 순서로 찾아요.</p>',
    cases: ['menu = "아메리카노 주세요!"', 'menu = "latte"', 'menu = "tea please"'],
    needs: [['def\\s+order\\s*\\(\\s*\\)', 'order() 함수를 정의해야 해요']],
  }),
  o({
    category: LM, level: 3, title: 'global로 전역 변수 바꾸기',
    desc: `<p>전역 변수 <code>count</code>가 주어져요. 함수가 호출될 때마다 <b>전역 변수 <code>count</code>를 1씩 늘리는</b> 함수 <code>click()</code>을 <code>global</code> 선언을 사용해 만드세요. <code>click()</code>을 <b>3번 호출</b>한 뒤 <code>count</code>를 출력하세요.</p>`,
    solution: `def click():\n    global count\n    count += 1\n\nclick()\nclick()\nclick()\nprint(count)\n`,
    hint: '<p>함수 안에서 전역 변수를 <b>바꾸려면</b> <code>global 변수이름</code> 선언이 필요해요. 선언하지 않으면 새 지역 변수를 만들려다 오류가 나요.</p>',
    cases: ['count = 0', 'count = 10', 'count = -2'],
    needs: [['def\\s+click\\s*\\(', 'click 함수를 정의해야 해요'], ['\\bglobal\\b', 'global 선언을 사용해야 해요']],
  }),
  o({
    category: LM, level: 3, title: '읽기 전에 할당하면 UnboundLocalError',
    desc: `<p>전역 변수 <code>menu</code>가 주어져요. 아래처럼 동작하는 함수 <code>order()</code>를 만드세요.</p>
<ol><li>먼저 <code>print(menu)</code> 를 하고</li><li>그 다음 줄에서 <code>menu = "새 메뉴"</code> 를 할당</li></ol><p>이 함수를 <code>try / except</code>로 호출해서 오류가 나면 <b>오류 이름</b>(<code>type(e).__name__</code>)을 출력하세요. (같은 함수 안에 할당문이 있으면 그 이름 전체가 <b>지역 변수</b>로 취급되기 때문이에요)</p>`,
    solution: `def order():\n    print(menu)\n    menu = "새 메뉴"\n\ntry:\n    order()\nexcept Exception as e:\n    print(type(e).__name__)\n`,
    hint: '<p>함수 안 어디에든 <code>menu = ...</code> 할당이 있으면, 파이썬은 <code>menu</code>를 지역 변수로 봐요. 그래서 할당 <b>전에</b> 읽으면 아직 값이 없다는 오류가 나요.</p>',
    cases: ['menu = "아메리카노"', 'menu = "tea"'],
    needs: [['def\\s+order\\s*\\(', 'order 함수를 정의해야 해요']],
  }),
  o({
    category: LM, level: 3, title: '원본을 건드리지 않고 새 리스트 반환',
    desc: `<p>리스트를 받아 <b>모든 원소에 100을 더한 새 리스트</b>를 반환하는 함수 <code>add100(L)</code>을 만드세요. <b>원본은 바뀌면 안 돼요.</b> 숫자 리스트 <code>nums</code>가 주어져요. <code>add100(nums)</code>의 결과와, 호출 후의 <code>nums</code> 원본을 한 줄에 하나씩(2줄) 출력하세요.</p>`,
    solution: `def add100(L):\n    return [x + 100 for x in L]\n\nprint(add100(nums))\nprint(nums)\n`,
    hint: '<p>새 리스트를 만들어 돌려주면(컴프리헨션 등) 원본은 그대로예요. 반복문에서 <code>L[i] += 100</code>처럼 바꾸면 원본이 바뀌어요.</p>',
    cases: ['nums = [1, 2, 3]', 'nums = []', 'nums = [10, 20]'],
    needs: [['def\\s+add100\\s*\\(', 'add100 함수를 정의해야 해요']],
  }),
  o({
    category: LM, level: 3, title: '리스트를 인수로 줄 때: 수정 vs 재할당',
    desc: `<p>리스트를 함수에 넘기면 <b>같은 리스트</b>를 가리켜요. 숫자 리스트 <code>L</code>(길이 2 이상)이 주어져요. 두 함수를 만드세요.</p>
<ul><li><code>modify_in(a)</code> — <code>a[0] = 0</code> 으로 <b>내용을 수정</b></li><li><code>modify_re(a)</code> — <code>a = [9, 9]</code> 로 <b>새 리스트를 재할당</b></li></ul>
<p>아래 2줄을 출력하세요.</p><ol><li><code>modify_re(L)</code> 호출 뒤의 <code>L</code></li><li>이어서 <code>modify_in(L)</code> 호출 뒤의 <code>L</code></li></ol>`,
    solution: `def modify_in(a):\n    a[0] = 0\n\ndef modify_re(a):\n    a = [9, 9]\n\nmodify_re(L)\nprint(L)\nmodify_in(L)\nprint(L)\n`,
    hint: '<p>재할당은 함수 안의 이름 <code>a</code>만 다른 리스트로 옮겨 가요. 바깥 <code>L</code>은 그대로예요. 반면 내용 수정은 같은 리스트를 바꾸니 바깥에서도 보여요.</p>',
    cases: ['L = [1, 2, 3]', 'L = [5, 6]', 'L = [7, 7, 7, 7]'],
    needs: [['def\\s+modify_in', 'modify_in 함수를 정의해야 해요'], ['def\\s+modify_re', 'modify_re 함수를 정의해야 해요']],
  }),
  o({
    category: LM, level: 3, title: '복사본을 넘기면 원본은 안전하다',
    desc: `<p>숫자 리스트 <code>L</code>(길이 3 이상)이 주어져요. 함수 <code>bump(M)</code>은 <code>M[1] += 100</code>, <code>M[2] += 100</code>으로 내용을 수정해요. 아래 2줄을 출력하세요.</p>
<ol><li><code>bump(L[:])</code> (<b>복사본</b>을 넘김) 호출 뒤의 <code>L</code></li><li><code>bump(L)</code> (원본을 넘김) 호출 뒤의 <code>L</code></li></ol>`,
    solution: `def bump(M):\n    M[1] += 100\n    M[2] += 100\n\nbump(L[:])\nprint(L)\nbump(L)\nprint(L)\n`,
    hint: '<p><code>L[:]</code> 는 새 리스트(복사본)를 만들어요. 복사본을 바꿔도 원본 <code>L</code>은 그대로예요.</p>',
    cases: ['L = [10, 20, 30]', 'L = [0, 0, 0, 0]', 'L = [1, 2, 3, 4, 5]'],
    needs: [['def\\s+bump\\s*\\(', 'bump 함수를 정의해야 해요']],
  }),
  o({
    category: LM, level: 3, title: 'global 없이 누적하기 (인수와 return)',
    desc: `<p>리스트 <code>items</code>(숫자)가 주어져요. <b><code>global</code>을 쓰지 말고</b> 인수와 <code>return</code>만으로 누적합을 구하세요.</p>
<ul><li><code>add(total, n)</code> 함수는 <code>total + n</code>을 <b>반환</b>해요</li><li><code>total = 0</code>에서 시작해 <code>items</code>의 각 값 <code>i</code>에 대해 <code>total = add(total, i)</code></li></ul><p>마지막에 <code>total</code>을 출력하세요.</p>`,
    solution: `def add(total, n):\n    return total + n\n\ntotal = 0\nfor i in items:\n    total = add(total, i)\nprint(total)\n`,
    hint: '<p>값을 바꿀 일이 있으면 "인수로 받고 return으로 돌려주는" 방식이 추적하기도 쉽고 안전해요.</p>',
    cases: ['items = [1, 2, 3]', 'items = []', 'items = [10, -4, 6]'],
    needs: [['def\\s+add\\s*\\(', 'add 함수를 정의해야 해요']],
    forbids: [['\\bglobal\\b', 'global을 쓰지 말고 인수와 return으로 풀어 보세요']],
  }),
  o({
    category: LM, level: 3, title: '정렬된 새 리스트 vs 제자리 정렬',
    desc: `<p>숫자 리스트 <code>L</code>이 주어져요. 두 함수를 만드세요.</p>
<ul><li><code>sorted_copy(L)</code> — 원본을 <b>바꾸지 않고</b> 정렬된 <b>새 리스트를 반환</b></li><li><code>sort_inplace(L)</code> — 원본을 <b>직접 정렬</b>하고 아무것도 반환하지 않음</li></ul>
<p>아래 4줄을 출력하세요.</p><ol><li><code>sorted_copy(L)</code></li><li>그 뒤의 <code>L</code> (원본 그대로)</li><li><code>sort_inplace(L)</code>의 반환값 (<code>None</code>)</li><li>그 뒤의 <code>L</code> (정렬됨)</li></ol>`,
    solution: `def sorted_copy(L):\n    return sorted(L)\n\ndef sort_inplace(L):\n    L.sort()\n\nprint(sorted_copy(L))\nprint(L)\nprint(sort_inplace(L))\nprint(L)\n`,
    hint: '<p><code>sorted()</code>는 새 리스트, <code>list.sort()</code>는 제자리 정렬(반환값 <code>None</code>)이에요.</p>',
    cases: ['L = [3, 1, 2]', 'L = [9, 8, 7, 6]', 'L = [1]'],
    needs: [['def\\s+sorted_copy', 'sorted_copy 함수를 정의해야 해요'], ['def\\s+sort_inplace', 'sort_inplace 함수를 정의해야 해요']],
  }),
  o({
    category: LM, level: 2, title: 'lambda를 변수에 담아 쓰기',
    desc: `<p>이름 없는 함수 <code>lambda</code>를 변수에 담아 이름처럼 쓸 수 있어요. 수 <code>x</code>, <code>y</code>가 주어져요. 두 수를 더하는 lambda를 변수 <code>add</code>에 담고, <code>add(x, y)</code>의 결과를 출력하세요.</p>`,
    solution: `add = lambda a, b: a + b\nprint(add(x, y))\n`,
    hint: '<p>형식: <code>이름 = lambda 매개변수들: 반환식</code></p>',
    cases: ['x = 3\ny = 4', 'x = -1\ny = 1', 'x = 2.5\ny = 2.5'],
    needs: [['add\\s*=\\s*lambda', 'add = lambda ... 형태로 만들어 보세요']],
  }),
  o({
    category: LM, level: 2, title: 'map으로 글자 수 리스트 만들기',
    desc: `<p>단어 리스트 <code>words</code>가 주어져요. 각 단어의 <b>글자 수</b>를 담은 리스트를 <code>map</code>과 내장 함수 <code>len</code>으로 만들어 출력하세요.</p>`,
    solution: `print(list(map(len, words)))\n`,
    hint: '<p><code>map</code>에는 내장 함수도 그대로 넘길 수 있어요. 괄호 없이 함수 이름만: <code>map(len, words)</code></p>',
    cases: ['words = ["apple", "fig", "banana"]', 'words = ["a"]', 'words = []'],
    needs: [['map\\s*\\(', 'map을 사용해야 해요']],
  }),
  o({
    category: LM, level: 3, title: '함수를 인수로 받는 함수',
    desc: `<p>함수 <code>f</code>와 값 <code>x</code>를 받아 <b><code>f</code>를 두 번 적용</b>한 결과 <code>f(f(x))</code>를 반환하는 함수 <code>apply_twice(f, x)</code>를 만드세요. 수 <code>n</code>이 주어져요. <code>lambda</code>로 "2배" 함수를 만들어 <code>apply_twice</code>에 넘기고 결과를 출력하세요. (<code>n</code>을 두 번 2배 → 4배)</p>`,
    solution: `def apply_twice(f, x):\n    return f(f(x))\n\nprint(apply_twice(lambda v: v * 2, n))\n`,
    hint: '<p>함수도 값처럼 다른 함수의 인수로 넘길 수 있어요. 안에서 <code>f(...)</code>로 호출해요.</p>',
    cases: ['n = 5', 'n = 0', 'n = -3'],
    needs: [['def\\s+apply_twice\\s*\\(', 'apply_twice 함수를 정의해야 해요'], ['lambda', 'lambda를 사용해 보세요']],
  }),
];
