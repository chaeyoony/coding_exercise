// 수업 연습문제 대응 2: 9강 튜플·집합·딕셔너리 (출력 채점 문제)
// 수업 자료의 연습문제와 같은 개념을 연습하도록, 값과 문장을 바꿔서 다시 만들었다.
// 집합은 출력 순서가 일정하지 않으므로, 항상 sorted()로 정렬해서 출력하게 한다.
import { o } from './_stdout.mjs';

const TS = '9강 튜플·집합';
const DI = '9강 딕셔너리';

export default [
  // ================= 튜플 =================
  o({
    category: TS, level: 1, title: '원소가 하나뿐인 튜플', singleCase: true,
    desc: `<p>원소가 하나뿐인 튜플은 <b>쉼표</b>가 꼭 필요해요.</p>
<ol><li><code>a</code>: 괄호를 써서 정수 <code>7</code> 하나만 담은 튜플</li><li><code>b</code>: 괄호 없이 쉼표만으로 문자열 <code>"x"</code> 하나만 담은 튜플</li><li><code>c = (7)</code> (쉼표를 빼먹은 경우)</li></ol>
<p><code>a</code>, <code>b</code>, <code>c</code>의 <code>type</code>을 한 줄에 하나씩 출력하세요. <code>c</code>는 튜플이 아니라는 것을 확인해요.</p>`,
    solution: `a = (7,)\nb = "x",\nc = (7)\nprint(type(a))\nprint(type(b))\nprint(type(c))\n`,
    hint: '<p>괄호가 아니라 <b>쉼표</b>가 튜플을 만들어요. <code>(7)</code>은 그냥 괄호로 묶은 정수예요.</p>',
    cases: [{ pre: '' }],
  }),
  o({
    category: TS, level: 1, title: '튜플 풀어서 담기 (unpacking)',
    desc: `<p>튜플 <code>student</code>가 <code>(이름, 나이, 전공)</code> 순서로 주어져요. 세 값을 변수 <code>name</code>, <code>age</code>, <code>major</code>에 <b>한 줄로 풀어서(unpacking)</b> 담고, <code>print(name, age, major)</code> 로 출력하세요.</p>`,
    solution: `name, age, major = student\nprint(name, age, major)\n`,
    hint: '<p>변수의 개수와 튜플 원소의 개수가 같아야 해요. <code>a, b, c = 튜플</code></p>',
    cases: ['student = ("Mina", 20, "AI")', 'student = ("철수", 19, "CS")', 'student = ("Lee", 23, "Stats")'],
  }),
  o({
    category: TS, level: 1, title: '튜플로 두 값 바꾸기 (swap)',
    desc: `<p>변수 <code>x</code>, <code>y</code>에 값이 들어 있어요. <b>임시 변수 없이</b> 한 줄로 두 값을 서로 바꾼 뒤, <code>print(x, y)</code>로 출력하세요.</p>`,
    solution: `x, y = y, x\nprint(x, y)\n`,
    hint: '<p>우변이 튜플 <code>(y, x)</code>로 만들어진 뒤 좌변에 풀어서 담기는 거예요.</p>',
    cases: ['x = 10\ny = 20', 'x = "a"\ny = "b"', 'x = 0\ny = -5'],
    needs: [['x\\s*,\\s*y\\s*=\\s*y\\s*,\\s*x', '튜플로 한 줄에 바꿔 보세요: x, y = y, x']],
  }),
  o({
    category: TS, level: 2, title: '튜플의 index · count · 슬라이싱 · 길이',
    desc: `<p>튜플 <code>T</code>와 값 <code>x</code>가 주어져요(<code>x</code>는 <code>T</code>에 들어 있어요). 아래 4줄을 출력하세요.</p>
<ol><li><code>x</code>가 <b>처음 나오는 위치</b></li><li><code>x</code>의 <b>개수</b></li><li><code>T[2:6]</code></li><li><code>T</code>의 길이</li></ol>`,
    solution: `print(T.index(x))\nprint(T.count(x))\nprint(T[2:6])\nprint(len(T))\n`,
    hint: '<p>튜플의 메서드는 <code>index</code>와 <code>count</code> 두 개뿐이에요.</p>',
    cases: ['T = (4, 3, 5, 7, 6, 5, 7, 4, 7, 2)\nx = 7', 'T = (1, 1, 2, 2, 2, 3, 3)\nx = 2', 'T = ("a", "b", "c", "a", "d", "e")\nx = "a"'],
  }),
  o({
    category: TS, level: 2, title: '튜플의 원소를 바꾼 새 튜플 만들기',
    desc: `<p>튜플은 원소를 바꿀 수 없지만, <b>슬라이싱과 연결(<code>+</code>)</b>로 "바꾼 것과 같은" 새 튜플을 만들 수 있어요. 튜플 <code>T</code>(길이 3 이상)가 주어져요. <b>두 번째 원소(인덱스 1)를 <code>10</code>으로 바꾼</b> 새 튜플을 만들어 출력하세요.</p>`,
    solution: `new_t = T[:1] + (10,) + T[2:]\nprint(new_t)\n`,
    hint: '<p>앞부분 <code>T[:1]</code>, 새 원소 <code>(10,)</code>, 뒷부분 <code>T[2:]</code>을 <code>+</code>로 이어요. 원소 하나짜리 튜플의 쉼표를 잊지 마세요!</p>',
    cases: ['T = (1, 3, 5, 7, 9)', 'T = ("a", "b", "c")', 'T = (0, 0, 0, 0)'],
  }),
  o({
    category: TS, level: 3, title: '튜플 안의 리스트는 바꿀 수 있다',
    desc: `<p>튜플 <code>t</code>는 <code>(정수, 문자열, 리스트)</code> 모양이에요. 아래 2줄을 출력하세요.</p>
<ol><li><code>t</code>의 세 번째 원소(리스트)에 <code>99</code>를 <code>append</code>한 뒤의 <code>t</code></li><li><code>t[0] = 0</code> 을 시도하면 나는 오류의 <b>이름</b>(<code>try / except</code>로 잡아서 <code>type(e).__name__</code>)</li></ol>`,
    solution: `t[2].append(99)\nprint(t)\ntry:\n    t[0] = 0\nexcept Exception as e:\n    print(type(e).__name__)\n`,
    hint: '<p>튜플은 "어떤 칸이 무엇을 가리키는지"를 고정해요. 칸이 가리키는 리스트의 <b>내용</b>은 바꿀 수 있어요.</p>',
    cases: ['t = (1, "a", [2, 3])', 't = (5, "z", [])', 't = (0, "q", [7])'],
  }),
  o({
    category: TS, level: 1, title: '튜플의 연결 · 반복 · in',
    desc: `<p>튜플 <code>T</code>, <code>M</code>과 값 <code>x</code>가 주어져요. 아래 3줄을 출력하세요.</p><ol><li><code>T + M</code></li><li><code>M * 2</code></li><li><code>x in T</code></li></ol>`,
    solution: `print(T + M)\nprint(M * 2)\nprint(x in T)\n`,
    hint: '<p>튜플도 리스트처럼 <code>+</code>(연결), <code>*</code>(반복), <code>in</code>을 쓸 수 있고, 결과는 새 튜플이에요.</p>',
    cases: ['T = (1, 3, 5, 7, 9)\nM = (2, 4)\nx = 7', 'T = ("a",)\nM = ("b", "c")\nx = "z"', 'T = (0, 1)\nM = ()\nx = 0'],
  }),

  // ================= 집합 =================
  o({
    category: TS, level: 1, title: '중복 제거와 원소 개수',
    desc: `<p>리스트 <code>L</code>이 주어져요. <b>중복을 제거한 집합</b>을 만들고, 그 집합의 <b>원소 개수</b>를 출력하세요.</p>`,
    solution: `s = set(L)\nprint(len(s))\n`,
    hint: '<p><code>set(리스트)</code>는 중복을 없앤 집합을 만들어요.</p>',
    cases: ['L = [3, 1, 2, 3, 1, 4]', 'L = [5, 5, 5]', 'L = list("hello world")', 'L = []'],
  }),
  o({
    category: TS, level: 1, title: '합집합 · 교집합 · 차집합 · 대칭차집합',
    desc: `<p>집합 <code>s1</code>, <code>s2</code>가 주어져요. 아래 5개를 <b>연산자</b>(<code>|  &amp;  -  ^</code>)로 구해, 각각 <code>sorted()</code>로 정렬한 리스트로 한 줄에 하나씩 출력하세요.</p>
<ol><li>합집합 <code>s1 | s2</code></li><li>교집합 <code>s1 &amp; s2</code></li><li>차집합 <code>s1 - s2</code></li><li>차집합 <code>s2 - s1</code></li><li>대칭차집합 <code>s1 ^ s2</code></li></ol>`,
    solution: `print(sorted(s1 | s2))\nprint(sorted(s1 & s2))\nprint(sorted(s1 - s2))\nprint(sorted(s2 - s1))\nprint(sorted(s1 ^ s2))\n`,
    hint: '<p>집합은 출력 순서가 일정하지 않을 수 있어서 <code>sorted()</code>로 정렬해 출력해요. 대칭차집합은 "한쪽에만 있는 원소"예요.</p>',
    cases: ['s1 = {1, 2, 3, 4, 5, 6}\ns2 = {4, 5, 6, 7, 8, 9}', 's1 = {1, 2}\ns2 = {3}', 's1 = {"a", "b", "c"}\ns2 = {"b", "c", "d"}'],
  }),
  o({
    category: TS, level: 2, title: '두 행사 참석자 비교',
    desc: `<p>두 행사의 참석자 집합 <code>A</code>, <code>B</code>가 주어져요. 아래 3줄을 출력하세요. (명단은 <code>sorted()</code>로 정렬)</p>
<ol><li>두 행사에 <b>모두</b> 참석한 사람</li><li><code>A</code>에만 참석한 사람</li><li>한 행사라도 참석한 사람의 <b>수</b></li></ol>`,
    solution: `print(sorted(A & B))\nprint(sorted(A - B))\nprint(len(A | B))\n`,
    hint: '<p>모두 → 교집합, A에만 → 차집합, 한 번이라도 → 합집합이에요.</p>',
    cases: ['A = {"Park", "Kim", "Lee", "Na"}\nB = {"Park", "Choi", "Cho", "Gang", "Na"}', 'A = {"a", "b"}\nB = {"c"}', 'A = {1, 2, 3}\nB = {2, 3, 4, 5}'],
  }),
  o({
    category: TS, level: 2, title: 'remove와 discard의 차이',
    desc: `<p>정수 집합 <code>s</code>가 주어져요(<code>2</code>와 <code>4</code>가 들어 있어요). 아래를 순서대로 하세요.</p>
<ol><li><code>s.remove(2)</code>, <code>s.discard(4)</code>를 실행하고 <code>sorted(s)</code>를 출력</li><li>집합에 <b>없는</b> 값 <code>99</code>에 대해 <code>s.discard(99)</code>를 실행(오류 없이 넘어가요). 다시 <code>sorted(s)</code>를 출력</li><li>없는 값 <code>99</code>에 대해 <code>s.remove(99)</code>를 실행하면 오류가 나요. <code>try / except</code>로 잡아서 오류 <b>이름</b>을 출력</li></ol>`,
    solution: `s.remove(2)\ns.discard(4)\nprint(sorted(s))\ns.discard(99)\nprint(sorted(s))\ntry:\n    s.remove(99)\nexcept Exception as e:\n    print(type(e).__name__)\n`,
    hint: '<p>없는 원소를 지울 때 <code>remove</code>는 <code>KeyError</code>, <code>discard</code>는 아무 일도 없어요.</p>',
    cases: ['s = {1, 2, 3, 4, 5}', 's = {2, 4, 6, 8}', 's = {10, 4, 2, 1}'],
  }),
  o({
    category: TS, level: 2, title: '서로 다른 글자 찾기',
    desc: `<p>문자열 <code>word</code>가 주어져요. 이 문자열에 나오는 <b>서로 다른 글자</b>를 <code>sorted()</code>로 정렬한 리스트와, 서로 다른 글자의 <b>개수</b>를 한 줄에 하나씩 출력하세요.</p>`,
    solution: `letters = set(word)\nprint(sorted(letters))\nprint(len(letters))\n`,
    hint: '<p>문자열도 <code>set()</code>에 넣으면 글자들의 집합이 돼요.</p>',
    cases: ['word = "mississippi"', 'word = "banana"', 'word = "abc"'],
  }),
  o({
    category: TS, level: 3, title: '세 집합의 공통 · 한 곳에만',
    desc: `<p>집합 <code>A</code>, <code>B</code>, <code>C</code>가 주어져요. 아래 2줄을 출력하세요. (모두 <code>sorted()</code>로 정렬한 리스트)</p>
<ol><li>세 집합 <b>모두</b>에 들어 있는 원소</li><li>세 집합 중 <b>딱 한 집합에만</b> 들어 있는 원소</li></ol>`,
    solution: `print(sorted(A & B & C))\nall_items = A | B | C\nonly_one = [x for x in all_items if (x in A) + (x in B) + (x in C) == 1]\nprint(sorted(only_one))\n`,
    hint: '<p>"딱 한 곳"은 각 원소가 몇 개의 집합에 들어 있는지 세면 편해요. <code>(x in A) + (x in B) + (x in C)</code> 는 True를 1로 세어 더해요.</p>',
    cases: ['A = {1, 2, 3}\nB = {2, 3, 4}\nC = {3, 4, 5}', 'A = {"a", "b"}\nB = {"b", "c"}\nC = {"b", "d"}', 'A = {1}\nB = {2}\nC = {3}'],
  }),
  o({
    category: TS, level: 1, title: '빈 집합과 빈 딕셔너리', singleCase: true,
    desc: `<p><code>{}</code>는 빈 집합이 아니라 <b>빈 딕셔너리</b>예요. 빈 집합은 <code>set()</code>으로 만들어요. 아래 2줄을 출력해 확인하세요.</p>
<ol><li><code>set()</code>의 <code>type</code></li><li><code>{}</code>의 <code>type</code></li></ol>`,
    solution: `print(type(set()))\nprint(type({}))\n`,
    hint: '<p><code>type(값)</code>을 그대로 <code>print</code>하면 돼요.</p>',
    cases: [{ pre: '' }],
  }),
  o({
    category: TS, level: 2, title: '집합에 추가하기: add와 update',
    desc: `<p>정수 집합 <code>s</code>가 주어져요. 아래를 순서대로 하세요.</p>
<ol><li><code>s.add(4)</code>, 이미 있을 수 있는 값 <code>s.add(3)</code>, <code>s.update([5, 6])</code>을 차례로 실행하고, <code>sorted(s)</code>를 출력</li><li><b>리스트</b> <code>[7, 8]</code>을 집합에 <code>add</code>하려고 하면 오류가 나요(리스트는 바뀔 수 있어서 집합의 원소가 될 수 없어요). <code>try / except</code>로 잡아 오류 <b>이름</b>을 출력</li></ol>`,
    solution: `s.add(4)\ns.add(3)\ns.update([5, 6])\nprint(sorted(s))\ntry:\n    s.add([7, 8])\nexcept Exception as e:\n    print(type(e).__name__)\n`,
    hint: '<p>집합의 원소는 바뀌지 않는 값(숫자, 문자열, 튜플)만 가능해요. 리스트를 넣으면 <code>TypeError: unhashable type</code>이 나요.</p>',
    cases: ['s = {1, 2, 3}', 's = {10}', 's = set()'],
  }),
  o({
    category: TS, level: 2, title: '부분집합 · 상위집합 · 서로소',
    desc: `<p>집합 <code>A</code>, <code>B</code>가 주어져요. 아래 3줄을 <code>True</code>/<code>False</code>로 출력하세요.</p>
<ol><li><code>A</code>가 <code>B</code>의 부분집합인가 (<code>issubset</code>)</li><li><code>A</code>가 <code>B</code>의 상위집합인가 (<code>issuperset</code>)</li><li><code>A</code>와 <code>B</code>가 서로소(공통 원소가 없음)인가 (<code>isdisjoint</code>)</li></ol>`,
    solution: `print(A.issubset(B))\nprint(A.issuperset(B))\nprint(A.isdisjoint(B))\n`,
    hint: '<p>세 메서드 모두 <code>True/False</code>를 돌려줘요.</p>',
    cases: ['A = {1, 2}\nB = {1, 2, 3}', 'A = {1, 2, 3}\nB = {1, 2}', 'A = {1, 2}\nB = {3, 4}', 'A = {1, 2}\nB = {1, 2}'],
  }),
  o({
    category: TS, level: 2, title: '중복 제거하면서 처음 나온 순서 유지',
    desc: `<p>리스트 <code>L</code>이 주어져요. 아래 2줄을 출력하세요.</p>
<ol><li><code>sorted(set(L))</code> — 정렬된 중복 없는 값들</li><li><b>처음 나온 순서를 유지</b>하면서 중복을 제거한 리스트 (<code>list(dict.fromkeys(L))</code>)</li></ol>`,
    solution: `print(sorted(set(L)))\nprint(list(dict.fromkeys(L)))\n`,
    hint: '<p>집합은 순서가 없지만, 딕셔너리는 넣은 순서를 기억해요. <code>dict.fromkeys(L)</code>의 키들은 중복 없이 처음 나온 순서예요.</p>',
    cases: ['L = ["b", "a", "b", "c", "a"]', 'L = [3, 1, 3, 2, 1]', 'L = [1, 2, 3]'],
  }),

  // ================= 딕셔너리 =================
  o({
    category: DI, level: 1, title: '분반별 학생 수 다루기',
    desc: `<p>딕셔너리 <code>PG</code>는 <b>분반 번호 → 학생 수</b>예요(1, 2, 3분반). 아래 3줄을 출력하세요.</p>
<ol><li>2분반의 학생 수</li><li>4분반(학생 수 <code>28</code>)을 <code>PG</code>에 추가한 뒤의 <code>PG</code> 전체</li><li>전체 학생 수의 합 (<code>sum(PG.values())</code>)</li></ol>`,
    solution: `print(PG[2])\nPG[4] = 28\nprint(PG)\nprint(sum(PG.values()))\n`,
    hint: '<p><code>D[키] = 값</code> 으로 새 쌍을 추가해요. <code>D.values()</code>는 값들만 모아 줘요.</p>',
    cases: ['PG = {1: 25, 2: 30, 3: 27}', 'PG = {1: 10, 2: 11, 3: 12}', 'PG = {1: 0, 2: 5, 3: 0}'],
  }),
  o({
    category: DI, level: 1, title: '연락처 수정 · 추가 · 삭제',
    desc: `<p>딕셔너리 <code>contacts</code>에 <code>name</code>, <code>phone</code>, <code>birth</code> 키가 있어요. 아래를 순서대로 하고 마지막에 <code>contacts</code>를 출력하세요.</p>
<ol><li><code>birth</code>의 값을 <code>"1224"</code>로 바꾸기</li><li><code>gender</code> 키를 만들고 값을 <code>"male"</code>로 추가하기</li><li><code>phone</code> 쌍을 삭제하기 (<code>del</code>)</li></ol>`,
    solution: `contacts["birth"] = "1224"\ncontacts["gender"] = "male"\ndel contacts["phone"]\nprint(contacts)\n`,
    hint: '<p>이미 있는 키에 대입하면 값을 덮어쓰고, 없는 키에 대입하면 새 쌍이 추가돼요. 삭제는 <code>del D[키]</code>.</p>',
    cases: ['contacts = {"name": "mirae", "phone": "010-1234-5678", "birth": "1118"}', 'contacts = {"name": "sun", "phone": "010-0000-0000", "birth": "0101"}'],
  }),
  o({
    category: DI, level: 2, title: 'key: value 형태로 한 줄씩 출력',
    desc: `<p>딕셔너리 <code>contacts</code>(이름 → 전화번호)가 주어져요. <code>for</code> 문과 <code>items()</code>를 사용해서 <code>이름: 전화번호</code> 형태로 <b>한 줄에 하나씩</b> 출력하세요. (콜론 뒤에 공백 하나)</p>`,
    solution: `for name, phone in contacts.items():\n    print(name + ": " + phone)\n`,
    hint: '<p><code>items()</code>는 (키, 값) 튜플을 차례로 돌려줘요. <code>for 키, 값 in D.items():</code> 로 풀어서 받을 수 있어요.</p>',
    cases: ['contacts = {"Kim": "010-1234-5678", "Park": "010-1236-4568", "Lee": "010-1238-4569"}', 'contacts = {"a": "1"}', 'contacts = {"x": "10", "y": "20"}'],
    needs: [['\\.items\\(\\)', 'items()를 사용해야 해요']],
  }),
  o({
    category: DI, level: 2, title: 'update로 합치기',
    desc: `<p>딕셔너리 <code>contacts</code>와 <code>new</code>가 주어져요. <code>contacts.update(new)</code>를 실행한 뒤 아래 2줄을 출력하세요.</p>
<ol><li><code>contacts</code> 전체</li><li><code>contacts</code>의 쌍 개수</li></ol><p>같은 키는 새 값으로 <b>갱신</b>되고, 없던 키는 <b>추가</b>돼요.</p>`,
    solution: `contacts.update(new)\nprint(contacts)\nprint(len(contacts))\n`,
    hint: '<p><code>A.update(B)</code> 는 B의 쌍들을 A에 합쳐요. 키가 겹치면 B의 값이 이겨요.</p>',
    cases: ['contacts = {"Kim": "010-1234-5678", "Park": "010-1236-4568", "Lee": "010-1238-4569"}\nnew = {"Kim": "010-5678-1234", "Choi": "010-1111-5555"}', 'contacts = {"a": 1}\nnew = {"a": 2, "b": 3}', 'contacts = {}\nnew = {"z": 0}'],
  }),
  o({
    category: DI, level: 2, title: '글자별 개수 세기 (get)',
    desc: `<p>문자열 <code>text</code>가 주어져요. 각 글자가 몇 번 나오는지 센 딕셔너리 <code>counts</code>를 만들어 출력하세요. (글자가 <b>처음 나온 순서</b>대로) <b><code>get</code> 메서드</b>를 사용해 보세요.</p><p>예: <code>"banana"</code> → <code>{'b': 1, 'a': 3, 'n': 2}</code></p>`,
    solution: `counts = {}\nfor ch in text:\n    counts[ch] = counts.get(ch, 0) + 1\nprint(counts)\n`,
    hint: '<p><code>counts.get(ch, 0)</code> 은 키가 없으면 0을 돌려줘서, "없으면 0에서 시작해 1을 더하기"를 한 줄로 쓸 수 있어요.</p>',
    cases: ['text = "banana"', 'text = "hello"', 'text = "aabbcc"', 'text = ""'],
    needs: [['\\.get\\(', 'get 메서드를 사용해야 해요']],
  }),
  o({
    category: DI, level: 3, title: '딕셔너리에 내장 함수 적용하기',
    desc: `<p>딕셔너리 <code>d1</code>(키 → 정수 값, 값은 모두 서로 다름)이 주어져요. 아래 5줄을 출력하세요.</p>
<ol><li><code>len(d1)</code></li><li><code>sorted(d1)</code> (키를 정렬한 리스트)</li><li><code>list(d1)</code> (키들의 리스트, 넣은 순서대로)</li><li><code>tuple(d1)</code></li><li><b>값(value)이 큰 순서</b>대로 정렬한 <code>(키, 값)</code> 튜플의 리스트 (<code>sorted(d1.items(), key=..., reverse=True)</code>)</li></ol>`,
    solution: `print(len(d1))\nprint(sorted(d1))\nprint(list(d1))\nprint(tuple(d1))\nprint(sorted(d1.items(), key=lambda kv: kv[1], reverse=True))\n`,
    hint: '<p>딕셔너리를 <code>sorted()</code>, <code>list()</code>, <code>tuple()</code>에 넣으면 <b>키</b>만 대상이 돼요. 값 기준 정렬은 <code>key=lambda kv: kv[1]</code> 로 (키, 값) 쌍의 두 번째를 기준으로 해요.</p>',
    cases: ['d1 = {1: 10, 5: 50, 3: 30, 2: 20}', 'd1 = {"b": 2, "a": 9, "c": 5}', 'd1 = {10: 1, 20: 3, 30: 2}'],
  }),
  o({
    category: DI, level: 3, title: '두 딕셔너리의 키 비교와 합치기',
    desc: `<p>딕셔너리 <code>a</code>, <code>b</code>가 주어져요(공통 키로 <code>"y"</code>가 있어요). 아래 4줄을 출력하세요.</p>
<ol><li><code>a</code>와 <code>b</code>에 <b>모두</b> 있는 키 (<code>sorted</code>로 정렬한 리스트, 키들을 집합처럼 <code>&amp;</code>로 구하기)</li><li><code>a</code>에만 있는 키 (<code>sorted</code>, 키들의 차집합)</li><li><code>a.update(b)</code> 를 실행한 뒤의 <code>a</code></li><li>그때 <code>a["y"]</code>의 값</li></ol>`,
    solution: `print(sorted(a.keys() & b.keys()))\nprint(sorted(a.keys() - b.keys()))\na.update(b)\nprint(a)\nprint(a["y"])\n`,
    hint: '<p><code>D.keys()</code>는 집합처럼 <code>&amp;</code>, <code>-</code> 연산을 쓸 수 있어요. 값이 어느 쪽으로 합쳐지는지는 <code>update</code>의 방향(<code>b</code>가 이김)을 생각하세요.</p>',
    cases: ['a = {"x": 1, "y": 2}\nb = {"y": 3, "z": 4}', 'a = {"y": 0, "k": 5}\nb = {"y": 9}', 'a = {"x": 1, "y": 1, "w": 1}\nb = {"y": 2, "v": 2}'],
  }),
  o({
    category: DI, level: 3, title: '점수 딕셔너리 분석',
    desc: `<p>학생 점수 딕셔너리 <code>score</code>(이름 → 점수)가 주어져요. 아래 3줄을 출력하세요.</p>
<ol><li><b>최고점</b>을 받은 학생 이름들 (<code>sorted</code>로 정렬한 리스트)</li><li>점수를 <b>중복 없이</b> 모은 집합을 <code>sorted</code>로 정렬한 리스트</li><li>전체 평균 점수를 <b>소수 첫째 자리까지 반올림</b> (<code>round(값, 1)</code>)</li></ol>`,
    solution: `top = max(score.values())\nprint(sorted(n for n, s in score.items() if s == top))\nprint(sorted(set(score.values())))\nprint(round(sum(score.values()) / len(score), 1))\n`,
    hint: '<p>최고점을 먼저 구하고, 그 점수를 가진 이름을 <code>items()</code>로 찾아요.</p>',
    cases: ['score = {"철수": 80, "영희": 95, "민수": 70, "지아": 95}', 'score = {"a": 50}', 'score = {"x": 60, "y": 70, "z": 60}'],
  }),
  o({
    category: DI, level: 3, title: '단어 빈도수 종합',
    desc: `<p>단어 리스트 <code>words</code>가 주어져요. 아래 3줄을 출력하세요.</p>
<ol><li>서로 다른 단어의 수</li><li>단어별 개수 딕셔너리 (단어가 <b>처음 나온 순서</b>대로)</li><li>가장 많이 나온 단어 (여러 개면 <b>먼저 나온</b> 단어)</li></ol>`,
    solution: `counts = {}\nfor w in words:\n    counts[w] = counts.get(w, 0) + 1\nprint(len(counts))\nprint(counts)\nbest = None\nfor w, c in counts.items():\n    if best is None or c > counts[best]:\n        best = w\nprint(best)\n`,
    hint: '<p>먼저 개수를 센 딕셔너리를 만들고, 그 딕셔너리를 차례로 훑으며 가장 큰 개수의 단어를 기억해요. 더 클 때만 바꾸면 먼저 나온 단어가 남아요.</p>',
    cases: ['words = ["a", "b", "a", "c", "b", "a"]', 'words = ["x", "y", "x", "y"]', 'words = ["one"]'],
  }),
  o({
    category: DI, level: 2, title: '없는 키를 안전하게 읽기',
    desc: `<p>딕셔너리 <code>d</code>와 키 <code>k</code>가 주어져요(<code>k</code>는 <code>d</code>에 없어요). 아래 3줄을 출력하세요.</p>
<ol><li><code>d.get(k)</code> 의 결과 (키가 없으면 <code>None</code>)</li><li><code>d.get(k, 0)</code> 의 결과 (기본값 0)</li><li><code>d[k]</code> 로 읽으면 나는 오류의 <b>이름</b> (<code>try / except</code>로 잡아서 <code>type(e).__name__</code>)</li></ol>`,
    solution: `print(d.get(k))\nprint(d.get(k, 0))\ntry:\n    d[k]\nexcept Exception as e:\n    print(type(e).__name__)\n`,
    hint: '<p><code>D[키]</code>는 키가 없으면 <code>KeyError</code>, <code>D.get(키)</code>는 <code>None</code>을 돌려줘요.</p>',
    cases: ['d = {"a": 1}\nk = "b"', 'd = {}\nk = 7', 'd = {"x": 1, "y": 2}\nk = "z"'],
  }),
  o({
    category: DI, level: 2, title: 'pop으로 꺼내고 지우기',
    desc: `<p>딕셔너리 <code>d</code>와 키 <code>k</code>(들어 있어요)가 주어져요. 아래 3줄을 출력하세요.</p>
<ol><li><code>d.pop(k)</code> 가 돌려주는 <b>값</b></li><li>그 뒤의 <code>d</code></li><li>이미 지운 키 <code>k</code>를 <b>기본값 <code>"없음"</code></b>을 주고 다시 <code>pop</code>한 결과 (오류가 나지 않아요)</li></ol>`,
    solution: `print(d.pop(k))\nprint(d)\nprint(d.pop(k, "없음"))\n`,
    hint: '<p><code>D.pop(키, 기본값)</code> 은 키가 없어도 오류 없이 기본값을 돌려줘요.</p>',
    cases: ['d = {"Kim": "010-1", "Park": "010-2"}\nk = "Kim"', 'd = {"x": 1}\nk = "x"', 'd = {1: "a", 2: "b", 3: "c"}\nk = 2'],
  }),
  o({
    category: DI, level: 2, title: '코드값을 이름으로 바꾸기 (조회 테이블)',
    desc: `<p>딕셔너리 <code>grade</code>는 등급 코드 → 이름이에요. 코드 리스트 <code>rows</code>의 각 코드를 <b>이름으로 바꾼 리스트</b>를 만들어 출력하세요. (리스트 컴프리헨션이나 반복문 모두 좋아요)</p><p>예: <code>{"A": "우수", "B": "보통"}</code>, <code>["B", "A"]</code> → <code>['보통', '우수']</code></p>`,
    solution: `print([grade[r] for r in rows])\n`,
    hint: '<p>딕셔너리는 "코드 → 이름" 같은 변환표로 아주 많이 써요. 각 코드를 키로 값을 꺼내면 돼요.</p>',
    cases: ['grade = {"A": "우수", "B": "보통", "C": "미흡"}\nrows = ["B", "A", "C", "A"]', 'grade = {1: "one", 2: "two"}\nrows = [2, 2, 1]', 'grade = {"x": "X"}\nrows = []'],
  }),
  o({
    category: DI, level: 3, title: '키와 값 뒤집기',
    desc: `<p>값이 모두 서로 다른 딕셔너리 <code>d</code>가 주어져요. <b>키와 값을 서로 바꾼</b> 딕셔너리를 만들어 출력하세요. (반복문이나 딕셔너리 컴프리헨션 <code>{새키: 새값 for ... in ...}</code>)</p>`,
    solution: `print({v: k for k, v in d.items()})\n`,
    hint: '<p><code>for k, v in d.items()</code> 로 쌍을 풀어 받아서, <code>v: k</code> 순서로 새 딕셔너리를 만들어요.</p>',
    cases: ['d = {"a": "x", "b": "y"}', 'd = {1: "one", 2: "two", 3: "three"}', 'd = {}'],
  }),
  o({
    category: DI, level: 2, title: '중첩 딕셔너리 읽기',
    desc: `<p>딕셔너리 <code>student</code>는 <code>{"name": 이름, "scores": {"math": 점수, "eng": 점수}}</code> 모양이에요. 아래 2줄을 출력하세요.</p>
<ol><li>수학 점수</li><li>수학과 영어 점수의 <b>합</b></li></ol>`,
    solution: `print(student["scores"]["math"])\nprint(student["scores"]["math"] + student["scores"]["eng"])\n`,
    hint: '<p>딕셔너리 안의 딕셔너리는 <code>[ ][ ]</code>를 이어서 꺼내요.</p>',
    cases: ['student = {"name": "Ann", "scores": {"math": 90, "eng": 85}}', 'student = {"name": "Bo", "scores": {"math": 70, "eng": 60}}', 'student = {"name": "Cy", "scores": {"math": 0, "eng": 100}}'],
  }),
];
