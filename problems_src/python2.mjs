// 파이썬 확장: 자료구조(스택·재귀) / 탐색 / 동적 계획법 맛보기
const T = { track: 'python' };
const t = (call, expected, visible = false) => ({ call, expected, visible });

export default [
  {
    ...T, id: 'py-015', category: '문자열·리스트', level: 2, title: '중복 제거 (순서 유지)',
    desc: `<p>리스트 <code>items</code>에서 중복을 없애되, <b>처음 등장한 순서</b>는 그대로 유지한 새 리스트를 돌려주는 <code>unique_keep_order(items)</code>를 만드세요.</p>`,
    starter: `def unique_keep_order(items):\n    pass\n`,
    solution: `def unique_keep_order(items):\n    seen = set()\n    result = []\n    for x in items:\n        if x not in seen:\n            seen.add(x)\n            result.append(x)\n    return result\n`,
    hint: '<p><code>set()</code>에 "이미 본 값"을 기록해 두고, 처음 보는 값만 결과에 추가해요. (<code>set(items)</code> 만 쓰면 순서가 사라져요)</p>',
    tests: [t('unique_keep_order([3, 1, 3, 2, 1])', [3, 1, 2], true), t('unique_keep_order([])', []), t('unique_keep_order(["a", "b", "a"])', ['a', 'b']), t('unique_keep_order([1, 1, 1])', [1])],
  },
  {
    ...T, id: 'py-016', category: '문자열·리스트', level: 3, title: '두 번째로 큰 수',
    desc: `<p>정수 리스트 <code>nums</code>에서 <b>두 번째로 큰 값</b>을 돌려주는 <code>second_largest(nums)</code>를 만드세요. 같은 값이 여러 번 나와도 하나로 봐요. 서로 다른 값이 최소 2개는 있어요.</p>`,
    starter: `def second_largest(nums):\n    pass\n`,
    solution: `def second_largest(nums):\n    return sorted(set(nums), reverse=True)[1]\n`,
    hint: '<p>중복을 없애고(<code>set</code>) 큰 순서로 정렬(<code>sorted(..., reverse=True)</code>)한 뒤 인덱스 1을 꺼내요.</p>',
    tests: [t('second_largest([3, 1, 4, 1, 5])', 4, true), t('second_largest([10, 10, 9])', 9, true), t('second_largest([1, 2])', 1), t('second_largest([5, 5, 5, 4])', 4), t('second_largest([-1, -5, -3])', -3)],
  },
  {
    ...T, id: 'py-017', category: '재귀·자료구조', level: 3, title: '팩토리얼 (재귀)',
    desc: `<p><code>factorial(n)</code>은 n! (= 1×2×…×n)을 돌려줍니다. 0! = 1 이에요. <b>재귀 함수</b>(자기 자신을 호출하는 함수)로 만들어 보세요.</p>`,
    starter: `def factorial(n):\n    pass\n`,
    solution: `def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n`,
    hint: '<p>재귀에는 <b>멈추는 조건</b>이 꼭 필요해요: n이 0이나 1이면 1을 돌려주고, 아니면 <code>n * factorial(n - 1)</code>.</p>',
    tests: [t('factorial(0)', 1, true), t('factorial(5)', 120, true), t('factorial(1)', 1), t('factorial(10)', 3628800), t('factorial(15)', 1307674368000)],
  },
  {
    ...T, id: 'py-018', category: '재귀·자료구조', level: 3, title: '중첩 리스트 펼치기',
    desc: `<p>리스트 안에 리스트가 여러 겹 들어 있어도 모든 값을 <b>한 줄로 펼친</b> 리스트를 돌려주는 <code>flatten(nested)</code>를 만드세요. 값의 순서는 그대로예요.</p>
<p>예: <code>[1, [2, [3, 4]], 5]</code> → <code>[1, 2, 3, 4, 5]</code></p>`,
    starter: `def flatten(nested):\n    pass\n`,
    solution: `def flatten(nested):\n    result = []\n    for item in nested:\n        if isinstance(item, list):\n            result.extend(flatten(item))\n        else:\n            result.append(item)\n    return result\n`,
    hint: '<p>각 원소가 리스트인지 <code>isinstance(item, list)</code> 로 확인하고, 리스트면 <b>자기 자신(flatten)을 다시 호출</b>해서 그 결과를 이어 붙이세요.</p>',
    tests: [t('flatten([1, [2, [3, 4]], 5])', [1, 2, 3, 4, 5], true), t('flatten([])', []), t('flatten([[1], [2]])', [1, 2]), t('flatten([[[]]])', []), t('flatten(["a", ["b"]])', ['a', 'b'])],
  },
  {
    ...T, id: 'py-019', category: '재귀·자료구조', level: 3, title: '괄호 짝 맞추기 (스택)',
    desc: `<p>문자열 <code>s</code>에는 <code>()</code>, <code>[]</code>, <code>{}</code> 괄호만 들어 있어요. 모든 괄호가 올바른 짝으로 닫혀 있으면 <code>True</code>, 아니면 <code>False</code>를 돌려주는 <code>is_balanced(s)</code>를 만드세요. 빈 문자열은 <code>True</code>예요.</p>`,
    starter: `def is_balanced(s):\n    pass\n`,
    solution: `def is_balanced(s):\n    pairs = {")": "(", "]": "[", "}": "{"}\n    stack = []\n    for ch in s:\n        if ch in "([{":\n            stack.append(ch)\n        else:\n            if not stack or stack.pop() != pairs[ch]:\n                return False\n    return not stack\n`,
    hint: '<p><b>스택</b>(리스트의 <code>append</code>/<code>pop</code>)을 쓰세요. 여는 괄호는 쌓고, 닫는 괄호가 나오면 맨 위 것과 짝이 맞는지 확인해요. 끝났을 때 스택이 비어 있어야 해요.</p>',
    tests: [t('is_balanced("()")', true, true), t('is_balanced("([)]")', false, true), t('is_balanced("{[()]}")', true), t('is_balanced("")', true), t('is_balanced("((")', false), t('is_balanced("())")', false)],
  },
  {
    ...T, id: 'py-020', category: '알고리즘', level: 3, title: '이진 탐색',
    desc: `<p>오름차순으로 정렬된 리스트 <code>nums</code>에서 <code>target</code>의 <b>인덱스</b>를 찾는 <code>binary_search(nums, target)</code>를 만드세요. 없으면 <code>-1</code>. 값은 중복되지 않아요.</p>
<p>리스트를 처음부터 끝까지 훑지 말고, 가운데 값과 비교하며 범위를 절반씩 줄이는 <b>이진 탐색</b>으로 풀어 보세요.</p>`,
    starter: `def binary_search(nums, target):\n    pass\n`,
    solution: `def binary_search(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1\n`,
    hint: '<p><code>lo</code>, <code>hi</code> 두 위치를 두고 가운데(<code>mid</code>)와 target을 비교해요. target이 더 크면 <code>lo = mid + 1</code>, 작으면 <code>hi = mid - 1</code>.</p>',
    tests: [t('binary_search([1, 3, 5, 7, 9], 7)', 3, true), t('binary_search([1, 3, 5, 7, 9], 4)', -1, true), t('binary_search([], 1)', -1), t('binary_search([2], 2)', 0), t('binary_search([1, 3, 5, 7, 9], 1)', 0), t('binary_search([1, 3, 5, 7, 9], 9)', 4)],
  },
  {
    ...T, id: 'py-021', category: '알고리즘', level: 4, title: '애너그램 묶기',
    desc: `<p>글자 순서만 바꾸면 같아지는 단어(애너그램)끼리 묶는 <code>group_anagrams(words)</code>를 만드세요.</p>
<ul><li>각 묶음 안의 단어는 <b>알파벳 순</b>으로 정렬</li><li>묶음들은 <b>각 묶음의 첫 단어 기준 알파벳 순</b>으로 정렬</li></ul>
<p>예: <code>["eat", "tea", "tan", "ate", "nat", "bat"]</code> → <code>[["ate", "eat", "tea"], ["bat"], ["nat", "tan"]]</code></p>`,
    starter: `def group_anagrams(words):\n    pass\n`,
    solution: `def group_anagrams(words):\n    groups = {}\n    for w in words:\n        key = "".join(sorted(w))\n        groups.setdefault(key, []).append(w)\n    result = [sorted(g) for g in groups.values()]\n    return sorted(result, key=lambda g: g[0])\n`,
    hint: '<p>애너그램은 글자를 정렬하면 같아져요. <code>"".join(sorted(단어))</code>를 딕셔너리의 키로 쓰면 같은 키끼리 모을 수 있어요.</p>',
    tests: [t('group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"])', [['ate', 'eat', 'tea'], ['bat'], ['nat', 'tan']], true), t('group_anagrams([])', []), t('group_anagrams(["a"])', [['a']]), t('group_anagrams(["ab", "ba", "cd"])', [['ab', 'ba'], ['cd']])],
  },
  {
    ...T, id: 'py-022', category: '알고리즘', level: 4, title: '파스칼의 삼각형',
    desc: `<p>파스칼의 삼각형은 각 숫자가 바로 윗줄의 왼쪽·오른쪽 숫자의 합인 삼각형이에요. 위에서부터 0번째 줄을 <code>[1]</code>이라 할 때, <code>pascal_row(n)</code>은 n번째 줄을 리스트로 돌려줍니다.</p>
<pre>0번째:       1
1번째:      1 1
2번째:     1 2 1
3번째:    1 3 3 1
4번째:   1 4 6 4 1</pre>`,
    starter: `def pascal_row(n):\n    pass\n`,
    solution: `def pascal_row(n):\n    row = [1]\n    for _ in range(n):\n        row = [1] + [row[i] + row[i + 1] for i in range(len(row) - 1)] + [1]\n    return row\n`,
    hint: '<p>이전 줄(<code>row</code>)이 있으면 다음 줄은 "양 끝은 1, 가운데는 이웃한 두 값의 합"이에요. 이것을 n번 반복해요.</p>',
    tests: [t('pascal_row(0)', [1], true), t('pascal_row(4)', [1, 4, 6, 4, 1], true), t('pascal_row(1)', [1, 1]), t('pascal_row(5)', [1, 5, 10, 10, 5, 1]), t('pascal_row(6)', [1, 6, 15, 20, 15, 6, 1])],
  },
  {
    ...T, id: 'py-023', category: '알고리즘', level: 4, title: '최소 동전 개수 (동적 계획법)',
    desc: `<p>동전 종류 리스트 <code>coins</code>로 금액 <code>amount</code>를 만들 때 필요한 <b>최소 동전 개수</b>를 돌려주는 <code>min_coins(coins, amount)</code>를 만드세요. 각 동전은 무한히 쓸 수 있고, 만들 수 없으면 <code>-1</code>을 돌려줘요. 금액이 0이면 0개예요.</p>
<p>큰 동전부터 쓰는 방법(그리디)은 틀릴 수 있어요. 예: 동전 [1, 3, 4]로 6 → 3+3 (2개), 그리디는 4+1+1 (3개)</p>`,
    starter: `def min_coins(coins, amount):\n    pass\n`,
    solution: `def min_coins(coins, amount):\n    INF = float("inf")\n    best = [0] + [INF] * amount\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c <= a and best[a - c] + 1 < best[a]:\n                best[a] = best[a - c] + 1\n    return -1 if best[amount] == INF else best[amount]\n`,
    hint: '<p><code>best[a]</code> = 금액 a를 만드는 최소 동전 수로 두고, 1원부터 amount까지 차례로 채워요. <code>best[a] = min(best[a - 동전] + 1)</code> 입니다.</p>',
    tests: [t('min_coins([1, 2, 5], 11)', 3, true), t('min_coins([2], 3)', -1, true), t('min_coins([1], 0)', 0), t('min_coins([1, 3, 4], 6)', 2), t('min_coins([5, 10], 15)', 2), t('min_coins([2, 4], 7)', -1)],
  },
];
