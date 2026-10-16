// 파이썬 문제 원본. 정답은 사람이 손으로 계산한 expected 값과 정답 코드를 대조해서 검증한다.
const T = { track: 'python' };
const t = (call, expected, visible = false) => ({ call, expected, visible });

export default [
  {
    ...T, id: 'py-001', category: '기초 문법', level: 1, title: '두 수의 합',
    desc: `<p>두 수 <code>a</code>, <code>b</code>를 받아 합을 돌려주는 함수 <code>add(a, b)</code>를 완성하세요.</p>
<p>결과는 <code>print</code>가 아니라 <code>return</code> 으로 돌려줘야 해요.</p>`,
    starter: `def add(a, b):\n    # 여기에 코드를 작성하세요\n    pass\n`,
    solution: `def add(a, b):\n    return a + b\n`,
    hint: '<p><code>return a + b</code> 한 줄이면 돼요.</p>',
    tests: [t('add(2, 3)', 5, true), t('add(-1, 1)', 0, true), t('add(0, 0)', 0), t('add(10, 25)', 35), t('add(1.5, 2.5)', 4)],
  },
  {
    ...T, id: 'py-002', category: '기초 문법', level: 1, title: '짝수 판별',
    desc: `<p>정수 <code>n</code>이 짝수이면 <code>True</code>, 아니면 <code>False</code>를 돌려주는 함수 <code>is_even(n)</code>을 만드세요.</p>
<p>힌트: 나머지를 구하는 연산자는 <code>%</code> 입니다.</p>`,
    starter: `def is_even(n):\n    pass\n`,
    solution: `def is_even(n):\n    return n % 2 == 0\n`,
    hint: '<p><code>n % 2</code>가 0이면 짝수예요. 비교 결과(<code>True/False</code>)를 그대로 return 하면 됩니다.</p>',
    tests: [t('is_even(4)', true, true), t('is_even(7)', false, true), t('is_even(0)', true), t('is_even(-2)', true), t('is_even(-3)', false), t('is_even(101)', false)],
  },
  {
    ...T, id: 'py-003', category: '기초 문법', level: 1, title: '세 수 중 가장 큰 수',
    desc: `<p>세 수 <code>a</code>, <code>b</code>, <code>c</code> 중 가장 큰 수를 돌려주는 함수 <code>biggest(a, b, c)</code>를 만드세요.</p>
<p><code>max()</code> 함수를 써도 되고, <code>if</code> 문으로 직접 비교해도 좋아요.</p>`,
    starter: `def biggest(a, b, c):\n    pass\n`,
    solution: `def biggest(a, b, c):\n    return max(a, b, c)\n`,
    hint: '<p><code>max(a, b, c)</code>를 써보세요. 연습 삼아 <code>if</code> 로도 풀어보면 좋아요.</p>',
    tests: [t('biggest(1, 2, 3)', 3, true), t('biggest(9, 2, 3)', 9, true), t('biggest(1, 8, 3)', 8), t('biggest(-5, -2, -9)', -2), t('biggest(4, 4, 4)', 4)],
  },
  {
    ...T, id: 'py-004', category: '기초 문법', level: 2, title: '1부터 n까지의 합',
    desc: `<p><code>sum_to_n(n)</code>은 1부터 <code>n</code>까지 모든 정수의 합을 돌려줍니다. <code>n</code>이 0이면 0이에요.</p>
<p>반복문(<code>for</code>)으로 풀어 보세요.</p>`,
    starter: `def sum_to_n(n):\n    total = 0\n    # for 문으로 1부터 n까지 더해 보세요\n    return total\n`,
    solution: `def sum_to_n(n):\n    total = 0\n    for i in range(1, n + 1):\n        total += i\n    return total\n`,
    hint: '<p><code>range(1, n + 1)</code>은 1부터 n까지 숫자를 만들어요. (끝 숫자는 포함되지 않아서 n+1)</p>',
    tests: [t('sum_to_n(5)', 15, true), t('sum_to_n(1)', 1, true), t('sum_to_n(0)', 0), t('sum_to_n(10)', 55), t('sum_to_n(100)', 5050)],
  },
  {
    ...T, id: 'py-005', category: '문자열·리스트', level: 2, title: '모음 개수 세기',
    desc: `<p>문자열 <code>s</code>에 들어 있는 모음(<code>a, e, i, o, u</code>)의 개수를 돌려주는 <code>count_vowels(s)</code>를 만드세요. 대문자도 모음으로 세요.</p>`,
    starter: `def count_vowels(s):\n    pass\n`,
    solution: `def count_vowels(s):\n    count = 0\n    for ch in s.lower():\n        if ch in "aeiou":\n            count += 1\n    return count\n`,
    hint: '<p>먼저 <code>s.lower()</code>로 소문자로 바꾸면 대문자를 따로 신경 쓰지 않아도 돼요.</p>',
    tests: [t('count_vowels("hello")', 2, true), t('count_vowels("PYTHON")', 1, true), t('count_vowels("")', 0), t('count_vowels("rhythm")', 0), t('count_vowels("AEIOU aeiou")', 10)],
  },
  {
    ...T, id: 'py-006', category: '문자열·리스트', level: 2, title: '단어 순서 뒤집기',
    desc: `<p>공백으로 구분된 문장에서 <b>단어의 순서</b>를 뒤집는 <code>reverse_words(sentence)</code>를 만드세요.</p>
<p>예: <code>"hello world"</code> → <code>"world hello"</code></p>`,
    starter: `def reverse_words(sentence):\n    pass\n`,
    solution: `def reverse_words(sentence):\n    words = sentence.split()\n    return " ".join(reversed(words))\n`,
    hint: '<p><code>split()</code>으로 단어 리스트를 만들고, 뒤집은 뒤 <code>" ".join(...)</code>으로 다시 합쳐요.</p>',
    tests: [t('reverse_words("hello world")', 'world hello', true), t('reverse_words("a b c")', 'c b a', true), t('reverse_words("single")', 'single'), t('reverse_words("one two three four")', 'four three two one')],
  },
  {
    ...T, id: 'py-007', category: '문자열·리스트', level: 3, title: '짝수만 제곱해서 모으기',
    desc: `<p>정수 리스트 <code>nums</code>에서 <b>짝수만</b> 골라 각각 제곱한 값을 <b>원래 순서대로</b> 리스트로 돌려주는 <code>square_evens(nums)</code>를 만드세요.</p>
<p>리스트 컴프리헨션을 써보면 좋아요.</p>`,
    starter: `def square_evens(nums):\n    pass\n`,
    solution: `def square_evens(nums):\n    return [n * n for n in nums if n % 2 == 0]\n`,
    hint: '<p><code>[식 for n in nums if 조건]</code> 형태예요.</p>',
    tests: [t('square_evens([1, 2, 3, 4])', [4, 16], true), t('square_evens([])', []), t('square_evens([1, 3, 5])', []), t('square_evens([2, 4, 6])', [4, 16, 36]), t('square_evens([-2, 3, 0])', [4, 0])],
  },
  {
    ...T, id: 'py-008', category: '문자열·리스트', level: 2, title: 'FizzBuzz',
    desc: `<p><code>fizzbuzz(n)</code>은 1부터 <code>n</code>까지의 숫자를 다음 규칙으로 바꾼 <b>문자열 리스트</b>를 돌려줍니다.</p>
<ul><li>3과 5의 배수: <code>"FizzBuzz"</code></li><li>3의 배수: <code>"Fizz"</code></li><li>5의 배수: <code>"Buzz"</code></li><li>그 외: 숫자를 문자열로 (<code>"7"</code>)</li></ul>`,
    starter: `def fizzbuzz(n):\n    result = []\n    # 1부터 n까지 반복하며 규칙에 맞는 문자열을 result 에 추가하세요\n    return result\n`,
    solution: `def fizzbuzz(n):\n    result = []\n    for i in range(1, n + 1):\n        if i % 15 == 0:\n            result.append("FizzBuzz")\n        elif i % 3 == 0:\n            result.append("Fizz")\n        elif i % 5 == 0:\n            result.append("Buzz")\n        else:\n            result.append(str(i))\n    return result\n`,
    hint: '<p>15의 배수(= 3과 5의 공배수)를 <b>가장 먼저</b> 검사해야 해요.</p>',
    tests: [t('fizzbuzz(5)', ['1', '2', 'Fizz', '4', 'Buzz'], true), t('fizzbuzz(1)', ['1']), t('fizzbuzz(15)', ['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz']), t('fizzbuzz(0)', [])],
  },
  {
    ...T, id: 'py-009', category: '딕셔너리', level: 3, title: '단어 빈도수',
    desc: `<p>문자열 <code>text</code>에서 각 단어가 몇 번 나오는지 세어 딕셔너리로 돌려주는 <code>word_count(text)</code>를 만드세요.</p>
<ul><li>공백으로 단어를 나누고, <b>소문자로 통일</b>해서 세요.</li><li>예: <code>"a B a"</code> → <code>{"a": 2, "b": 1}</code></li></ul>`,
    starter: `def word_count(text):\n    counts = {}\n    return counts\n`,
    solution: `def word_count(text):\n    counts = {}\n    for word in text.lower().split():\n        counts[word] = counts.get(word, 0) + 1\n    return counts\n`,
    hint: '<p><code>counts.get(word, 0) + 1</code> 은 "없으면 0, 있으면 현재 값에 1을 더하기"라는 뜻이에요.</p>',
    tests: [t('word_count("a B a")', { a: 2, b: 1 }, true), t('word_count("")', {}), t('word_count("go go go")', { go: 3 }), t('word_count("The the THE cat")', { the: 3, cat: 1 }, true)],
  },
  {
    ...T, id: 'py-010', category: '딕셔너리', level: 3, title: '가장 많이 나온 값',
    desc: `<p>리스트 <code>items</code>에서 <b>가장 많이 등장한 값</b>을 돌려주는 <code>most_common(items)</code>를 만드세요. 가장 많은 값이 여러 개라면 <b>리스트에서 먼저 등장한 값</b>을 돌려주세요. 리스트는 비어 있지 않아요.</p>`,
    starter: `def most_common(items):\n    pass\n`,
    solution: `def most_common(items):\n    counts = {}\n    for x in items:\n        counts[x] = counts.get(x, 0) + 1\n    best = items[0]\n    for x in items:\n        if counts[x] > counts[best]:\n            best = x\n    return best\n`,
    hint: '<p>먼저 딕셔너리로 개수를 세고, 리스트를 앞에서부터 보면서 더 많은 값이 나올 때만 갱신해요.</p>',
    tests: [t('most_common([1, 2, 2, 3])', 2, true), t('most_common(["a", "b", "b", "a"])', 'a', true), t('most_common([5])', 5), t('most_common([3, 3, 1, 1, 1])', 1), t('most_common(["x", "y", "y", "x", "z"])', 'x')],
  },
  {
    ...T, id: 'py-011', category: '알고리즘', level: 3, title: '회문 판별',
    desc: `<p>문자열 <code>s</code>가 회문(앞에서 읽어도 뒤에서 읽어도 같은 문자열)이면 <code>True</code>를 돌려주는 <code>is_palindrome(s)</code>를 만드세요.</p>
<p><b>알파벳과 숫자만</b> 보고, 대소문자는 구분하지 않아요. (공백·기호 무시)</p>`,
    starter: `def is_palindrome(s):\n    pass\n`,
    solution: `def is_palindrome(s):\n    cleaned = [ch.lower() for ch in s if ch.isalnum()]\n    return cleaned == cleaned[::-1]\n`,
    hint: '<p>먼저 알파벳/숫자만 남긴 리스트를 만들고(<code>ch.isalnum()</code>), 뒤집은 것(<code>[::-1]</code>)과 비교해요.</p>',
    tests: [t('is_palindrome("level")', true, true), t('is_palindrome("hello")', false, true), t('is_palindrome("A man, a plan, a canal: Panama")', true), t('is_palindrome("")', true), t('is_palindrome("ab")', false), t('is_palindrome("No lemon, no melon")', true)],
  },
  {
    ...T, id: 'py-012', category: '알고리즘', level: 3, title: '피보나치 수',
    desc: `<p><code>fibonacci(n)</code>은 n번째 피보나치 수를 돌려줍니다. <code>fibonacci(0)=0</code>, <code>fibonacci(1)=1</code>이고, 그 이후는 앞의 두 수의 합이에요.</p>
<p>수열: 0, 1, 1, 2, 3, 5, 8, 13, …</p>`,
    starter: `def fibonacci(n):\n    pass\n`,
    solution: `def fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n`,
    hint: '<p>변수 두 개(<code>a, b = 0, 1</code>)를 두고 n번 반복하며 <code>a, b = b, a + b</code> 로 한 칸씩 밀어요.</p>',
    tests: [t('fibonacci(0)', 0, true), t('fibonacci(1)', 1, true), t('fibonacci(2)', 1), t('fibonacci(7)', 13), t('fibonacci(10)', 55), t('fibonacci(30)', 832040)],
  },
  {
    ...T, id: 'py-013', category: '알고리즘', level: 3, title: '소수 판별',
    desc: `<p>정수 <code>n</code>이 소수이면 <code>True</code>, 아니면 <code>False</code>를 돌려주는 <code>is_prime(n)</code>을 만드세요. 1 이하의 수는 소수가 아니에요.</p>`,
    starter: `def is_prime(n):\n    pass\n`,
    solution: `def is_prime(n):\n    if n < 2:\n        return False\n    i = 2\n    while i * i <= n:\n        if n % i == 0:\n            return False\n        i += 1\n    return True\n`,
    hint: '<p>2부터 <code>i * i &lt;= n</code> 인 동안만 나눠 보면 충분해요. 나누어떨어지는 수가 있으면 소수가 아니에요.</p>',
    tests: [t('is_prime(2)', true, true), t('is_prime(9)', false, true), t('is_prime(1)', false), t('is_prime(0)', false), t('is_prime(97)', true), t('is_prime(100)', false), t('is_prime(7919)', true)],
  },
  {
    ...T, id: 'py-014', category: '알고리즘', level: 4, title: '두 수의 합 (Two Sum)',
    desc: `<p>정수 리스트 <code>nums</code>와 정수 <code>target</code>이 주어집니다. 더해서 <code>target</code>이 되는 <b>두 수의 위치(인덱스)</b>를 <code>[i, j]</code> (i &lt; j) 리스트로 돌려주는 <code>two_sum(nums, target)</code>을 만드세요. 답은 항상 정확히 하나 존재해요.</p>`,
    starter: `def two_sum(nums, target):\n    pass\n`,
    solution: `def two_sum(nums, target):\n    seen = {}\n    for j, x in enumerate(nums):\n        need = target - x\n        if need in seen:\n            return [seen[need], j]\n        seen[x] = j\n`,
    hint: '<p>반복하면서 "지금까지 본 숫자 → 위치"를 딕셔너리에 저장해 두면, 짝이 되는 수(<code>target - x</code>)가 이미 있는지 바로 알 수 있어요.</p>',
    tests: [t('two_sum([2, 7, 11, 15], 9)', [0, 1], true), t('two_sum([3, 2, 4], 6)', [1, 2], true), t('two_sum([3, 3], 6)', [0, 1]), t('two_sum([1, 5, 8, 3], 11)', [2, 3]), t('two_sum([-1, -2, -3, -4, -5], -8)', [2, 4])],
  },
];
