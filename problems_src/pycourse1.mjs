// 수업 연습문제 대응 1: 7강 리스트 (출력 채점 문제)
// 수업 자료의 연습문제와 같은 개념을 연습하도록, 값과 문장을 바꿔서 다시 만들었다.
import { o } from './_stdout.mjs';

const C = '7강 리스트';

export default [
  o({
    category: C, level: 1, title: '리스트 만들고 개수와 첫 원소 출력', singleCase: true,
    desc: `<p>색깔 3개 <code>"red"</code>, <code>"green"</code>, <code>"blue"</code>를 이 순서대로 담은 리스트 <code>colors</code>를 만드세요. 그리고 <b>리스트의 길이</b>와 <b>맨 앞 원소</b>를 한 줄에 하나씩 출력하세요.</p>`,
    solution: `colors = ["red", "green", "blue"]\nprint(len(colors))\nprint(colors[0])\n`,
    hint: '<p><code>len(리스트)</code>는 개수, <code>리스트[0]</code>은 첫 번째 원소예요.</p>',
    cases: [{ pre: '' }],
  }),
  o({
    category: C, level: 2, title: '문자열과 리스트: 바꿀 수 있는가', singleCase: true,
    desc: `<p>문자열은 한 번 만들면 글자를 바꿀 수 없고(<b>immutable</b>), 리스트는 바꿀 수 있어요(<b>mutable</b>). 이 차이를 코드로 확인해 보세요.</p>
<ol><li><code>s = "hello"</code> 의 첫 글자를 <code>"j"</code>로 바꾸려고 시도하세요 (<code>s[0] = "j"</code>). 오류가 나므로 <code>try / except TypeError</code>로 잡아서 <code>문자열은 바꿀 수 없어요</code>를 출력하세요.</li>
<li><code>L = ["h", "e", "l", "l", "o"]</code> 의 첫 원소를 <code>"j"</code>로 바꾼 뒤, <code>"".join(L)</code>을 출력하세요.</li></ol>`,
    solution: `s = "hello"\ntry:\n    s[0] = "j"\nexcept TypeError:\n    print("문자열은 바꿀 수 없어요")\nL = ["h", "e", "l", "l", "o"]\nL[0] = "j"\nprint("".join(L))\n`,
    hint: '<p><code>try:</code> 안에 오류가 날 코드를 쓰고, <code>except TypeError:</code> 아래에 출력 코드를 써요.</p>',
    cases: [{ pre: '' }],
  }),
  o({
    category: C, level: 1, title: 'range로 홀수 리스트 만들기',
    desc: `<p>변수 <code>n</code>이 주어져요. <code>range</code>를 이용해 <b>1부터 n까지의 홀수만</b> 담은 리스트를 만들어 출력하세요. (예: n이 7이면 <code>[1, 3, 5, 7]</code>)</p>`,
    solution: `print(list(range(1, n + 1, 2)))\n`,
    hint: '<p><code>range(시작, 끝, 간격)</code> 에서 끝은 포함되지 않아서 <code>n + 1</code>을 써요. 홀수는 1부터 2칸씩이에요.</p>',
    cases: ['n = 20', 'n = 9', 'n = 1', 'n = 16'],
  }),
  o({
    category: C, level: 1, title: '날짜 문자열을 나눠 합 구하기',
    desc: `<p>변수 <code>date</code>에 <code>"2026-10-16"</code> 처럼 <b>연-월-일</b> 형태의 문자열이 들어 있어요. <code>split()</code>으로 나눠 연·월·일을 정수로 바꾼 뒤, 세 수의 <b>합</b>을 출력하세요.</p>`,
    solution: `parts = date.split("-")\nprint(int(parts[0]) + int(parts[1]) + int(parts[2]))\n`,
    hint: '<p><code>date.split("-")</code>은 <code>["2026", "10", "16"]</code> 같은 문자열 리스트를 만들어요. <code>int()</code>로 정수로 바꾸세요.</p>',
    cases: ['date = "2026-10-16"', 'date = "1999-01-02"', 'date = "2000-12-31"'],
  }),
  o({
    category: C, level: 2, title: '줄어드는 리스트를 두 가지 방법으로',
    singleCase: true,
    desc: `<p>1000부터 200까지 <b>200씩 줄어드는</b> 리스트를 두 가지 방법으로 만들어 비교하세요.</p>
<ol><li><code>range</code>와 <code>list</code>로 만든 리스트를 출력</li><li>값을 직접 나열해서 만든 리스트를 출력</li><li>두 리스트가 같은지(<code>==</code>) 결과(<code>True</code>/<code>False</code>)를 출력</li></ol><p>총 3줄이 출력돼야 해요.</p>`,
    solution: `a = list(range(1000, 100, -200))\nb = [1000, 800, 600, 400, 200]\nprint(a)\nprint(b)\nprint(a == b)\n`,
    hint: '<p>간격이 음수이면 끝 값을 포함하지 않은 채 <b>끝 값보다 큰 쪽</b>까지만 만들어요. 200까지 나오게 하려면 끝에 200보다 작은 수를 써요.</p>',
    cases: [{ pre: '' }],
  }),
  o({
    category: C, level: 1, title: '양수·음수 인덱스로 처음과 마지막 꺼내기',
    desc: `<p>리스트 <code>L</code>이 주어져요. 아래 4개를 <b>한 줄에 하나씩, 이 순서대로</b> 출력하세요.</p>
<ol><li>양수 인덱스로 첫 번째 원소</li><li>음수 인덱스로 첫 번째 원소 (리스트의 길이를 이용해 계산)</li><li>양수 인덱스로 마지막 원소 (<code>len(L)</code>을 이용해 계산)</li><li>음수 인덱스로 마지막 원소</li></ol>`,
    solution: `print(L[0])\nprint(L[-len(L)])\nprint(L[len(L) - 1])\nprint(L[-1])\n`,
    hint: '<p>길이가 n이면 양수 인덱스는 <code>0 ~ n-1</code>, 음수 인덱스는 <code>-n ~ -1</code>이에요.</p>',
    cases: ['L = [3, 6, 9, 12, 15]', 'L = ["a", "b"]', 'L = [7, 8, 9, 10, 11, 12, 13]'],
  }),
  o({
    category: C, level: 2, title: '여러 종류가 섞인 리스트에서 꺼내기',
    desc: `<p>리스트 <code>data</code>는 <code>[숫자, 소수, 문자열, [숫자, 숫자]]</code> 모양이에요. 아래 3줄을 출력하세요.</p>
<ol><li><code>data</code>의 길이</li><li>뒤에서 두 번째 원소와 마지막 원소 (<code>print(a, b)</code> 처럼 한 줄에 공백으로 구분)</li><li>마지막 원소(리스트)의 첫 번째 값과, 세 번째 원소(문자열)의 두 번째 글자 (한 줄에 공백으로 구분)</li></ol>`,
    solution: `print(len(data))\nprint(data[-2], data[-1])\nprint(data[3][0], data[2][1])\n`,
    hint: '<p>리스트 안의 리스트는 <code>data[3][0]</code> 처럼 <code>[ ]</code>를 이어서 써요. 문자열도 같은 방식으로 글자를 꺼낼 수 있어요.</p>',
    cases: ['data = [1, 2.2, "Mickey", [8, 4]]', 'data = [10, 3.5, "Donald", [7, 9]]', 'data = [0, 0.5, "Goofy", [1, 0]]'],
  }),
  o({
    category: C, level: 2, title: '인덱스로 값 바꾸고 오류 확인',
    desc: `<p>리스트 <code>lst</code>가 주어져요(길이는 3 이상).</p>
<ol><li>인덱스 1의 값을 <code>6</code>으로 바꾸고, 바뀐 리스트를 출력하세요.</li><li>범위를 벗어난 인덱스 <code>lst[len(lst)]</code>를 읽으면 오류가 나요. <code>try / except</code>로 잡아서 <b>오류 이름</b>(<code>type(e).__name__</code>)을 출력하세요.</li></ol>`,
    solution: `lst[1] = 6\nprint(lst)\ntry:\n    lst[len(lst)]\nexcept Exception as e:\n    print(type(e).__name__)\n`,
    hint: '<p><code>except Exception as e:</code> 로 오류를 잡으면 <code>type(e).__name__</code> 이 오류 이름(<code>IndexError</code> 등)이에요.</p>',
    cases: ['lst = [0, 4, 5, 0, 1]', 'lst = [9, 9, 9, 9]', 'lst = [1, 2, 3]'],
  }),
  o({
    category: C, level: 2, title: '중첩 리스트와 문자열 인덱싱',
    desc: `<p>리스트 <code>A</code>는 <code>[연도, [요일, 과목], "교시"]</code> 모양이에요. 예: <code>[2022, ["목요일", "CT"], "5-6교시"]</code></p>
<p>아래 2줄을 출력하세요.</p><ol><li><code>A</code>의 세 번째 원소(문자열)의 <b>첫 글자</b></li><li><code>A</code>의 두 번째 원소(리스트)의 첫 번째 값(요일 문자열)의 <b>마지막 글자</b></li></ol>`,
    solution: `print(A[2][0])\nprint(A[1][0][-1])\n`,
    hint: '<p>마지막 글자는 음수 인덱스 <code>-1</code>이 편해요. <code>[ ]</code>를 이어 쓰며 안쪽으로 들어가세요.</p>',
    cases: ['A = [2022, ["목요일", "CT"], "5-6교시"]', 'A = [2026, ["금요일", "AI"], "7-8교시"]', 'A = [2025, ["월요일", "DB"], "1-2교시"]'],
  }),
  o({
    category: C, level: 1, title: '슬라이싱 연습 (양수 step)',
    desc: `<p>리스트 <code>A</code>(길이 9 이상)가 주어져요. 아래 4개를 한 줄에 하나씩 출력하세요.</p>
<ol><li><code>A</code>의 앞에서 5개</li><li>인덱스 4부터 끝까지</li><li>처음부터 인덱스 5까지 2칸씩 (<code>A[:6:2]</code>)</li><li>인덱스 1부터 6까지 2칸씩 (<code>A[1:7:2]</code>)</li></ol>`,
    solution: `print(A[:5])\nprint(A[4:])\nprint(A[:6:2])\nprint(A[1:7:2])\n`,
    hint: '<p><code>A[start:end:step]</code> 에서 <code>end</code>는 포함되지 않아요. 생략하면 처음/끝/1칸이에요.</p>',
    cases: ['A = list(range(9))', 'A = list(range(10, 19))', 'A = list("abcdefghi")'],
  }),
  o({
    category: C, level: 2, title: '슬라이싱 연습 (음수 step)',
    desc: `<p>같은 리스트 <code>A</code>(길이 9)에서 아래 4개를 한 줄에 하나씩 출력하세요.</p>
<ol><li><code>A[7:2:-2]</code></li><li><code>A[::-4]</code></li><li><code>A[-3:-7:-2]</code></li><li><code>A[-8:-5:-1]</code></li></ol>
<p>마지막 것이 <b>빈 리스트 <code>[]</code></b>가 되는 이유를 생각해 보세요. (step이 음수이면 start가 end보다 커야 해요)</p>`,
    solution: `print(A[7:2:-2])\nprint(A[::-4])\nprint(A[-3:-7:-2])\nprint(A[-8:-5:-1])\n`,
    hint: '<p>step이 음수이면 start에서 end 쪽(왼쪽)으로 거꾸로 가요. <code>A[-8:-5:-1]</code>은 시작이 끝보다 앞쪽이라 가져올 게 없어요.</p>',
    cases: ['A = list(range(9))', 'A = list(range(20, 29))', 'A = list("abcdefghi")'],
  }),
  o({
    category: C, level: 2, title: '슬라이싱으로 삭제·끼워넣기·끝에 붙이기',
    desc: `<p>리스트 <code>A</code>(길이 5 이상)에 아래 연산을 <b>차례로</b> 적용하고, 각 연산 직후에 <code>A</code>를 출력하세요. (총 3줄)</p>
<ol><li><code>A[1:3] = []</code> — 인덱스 1, 2 삭제</li><li><code>A[1:1] = ["a", "b"]</code> — 인덱스 1 자리에 끼워 넣기</li><li><code>A[len(A):len(A)] = [10]</code> — 맨 끝에 추가</li></ol>`,
    solution: `A[1:3] = []\nprint(A)\nA[1:1] = ["a", "b"]\nprint(A)\nA[len(A):len(A)] = [10]\nprint(A)\n`,
    hint: '<p>좌변이 슬라이싱이고 우변이 리스트이면, 그 구간이 우변의 내용으로 통째로 교체돼요.</p>',
    cases: ['A = [0, 1, 2, 3, 4]', 'A = [5, 6, 7, 8, 9, 10]', 'A = list("vwxyz")'],
  }),
  o({
    category: C, level: 2, title: '홀수 인덱스를 모두 9로 바꾸기',
    desc: `<p>리스트 <code>A</code>가 주어져요.</p>
<ol><li><b>홀수 인덱스(1, 3, 5, …)의 원소를 모두 9로</b> 바꾸고 <code>A</code>를 출력하세요. (슬라이싱 <code>A[1::2]</code>에 대입. 개수를 맞춰야 해요)</li><li>이번에는 <code>A[1::2] = [0]</code> 처럼 <b>개수가 맞지 않게</b> 대입해 보세요. 나는 오류의 <b>이름</b>(<code>type(e).__name__</code>)을 출력하세요.</li></ol>`,
    solution: `A[1::2] = [9] * len(A[1::2])\nprint(A)\ntry:\n    A[1::2] = [0]\nexcept Exception as e:\n    print(type(e).__name__)\n`,
    hint: '<p>step이 있는 확장 슬라이싱은 좌우 개수가 같아야 해요. 개수는 <code>len(A[1::2])</code> 로 구할 수 있어요.</p>',
    cases: ['A = [0, 1, 2, 3, 4]', 'A = [5, 5, 5, 5, 5, 5]', 'A = list("abcdefg")'],
  }),
  o({
    category: C, level: 3, title: '복사와 참조의 차이',
    desc: `<p>리스트 <code>a</code>가 주어져요. 아래를 순서대로 하세요.</p>
<ol><li><code>b</code>는 <code>a</code>의 <b>복사본</b>(<code>a[:]</code>), <code>c</code>는 <code>a</code>와 <b>같은 리스트</b>(<code>c = a</code>)로 만드세요.</li><li><code>a[0] = 10</code> 을 실행하세요.</li><li><code>a</code>, <code>b</code>, <code>c</code>를 한 줄에 하나씩 출력하세요.</li></ol><p>누가 바뀌고 누가 안 바뀌는지, 이유를 생각해 보세요.</p>`,
    solution: `b = a[:]\nc = a\na[0] = 10\nprint(a)\nprint(b)\nprint(c)\n`,
    hint: '<p><code>c = a</code>는 새 리스트를 만드는 게 아니라 같은 리스트에 이름을 하나 더 붙이는 거예요.</p>',
    cases: ['a = [0, 1, 2, 3, 4]', 'a = [5, 6]', 'a = [7, 7, 7]'],
  }),
  o({
    category: C, level: 1, title: '리스트 연결과 반복',
    desc: `<p>리스트 <code>L1</code>, <code>L2</code>가 주어져요. 아래 2줄을 출력하세요.</p><ol><li><code>L1</code>과 <code>L2</code>를 <b>연결</b>한 리스트</li><li><code>L1</code>을 <b>3번 반복</b>한 리스트</li></ol>`,
    solution: `print(L1 + L2)\nprint(L1 * 3)\n`,
    hint: '<p>리스트에서 <code>+</code>는 연결, <code>*</code>는 반복이에요.</p>',
    cases: ['L1 = [1, 3, 5]\nL2 = [2, 4, 6]', 'L1 = ["a"]\nL2 = ["b", "c"]', 'L1 = [0, 0]\nL2 = []'],
  }),
  o({
    category: C, level: 2, title: '길이 n의 0 리스트와 in 연산',
    desc: `<p>변수 <code>n</code>(리스트 길이)과 <code>target</code>(찾을 값)이 주어져요.</p><ol><li>0으로 채워진 길이 <code>n</code>의 리스트를 <b>한 줄로</b>(곱셈 이용) 만들어 출력하세요.</li><li>그 리스트에 <code>target</code>이 들어 있는지 <code>True</code>/<code>False</code>로 출력하세요.</li></ol>`,
    solution: `zeros = [0] * n\nprint(zeros)\nprint(target in zeros)\n`,
    hint: '<p><code>[0] * 5</code> 는 <code>[0, 0, 0, 0, 0]</code>, 포함 여부는 <code>값 in 리스트</code>예요.</p>',
    cases: ['n = 5\ntarget = 7', 'n = 3\ntarget = 0', 'n = 1\ntarget = 1', 'n = 8\ntarget = 0'],
  }),
  o({
    category: C, level: 2, title: '이름이 있는지 확인하기',
    desc: `<p>이름 리스트 <code>names</code>와 찾을 이름 <code>who</code>가 주어져요. <code>who</code>가 리스트에 <b>있으면 <code>있음</code></b>, 없으면 <b><code>없음</code></b>을 출력하세요.</p>`,
    solution: `if who in names:\n    print("있음")\nelse:\n    print("없음")\n`,
    hint: '<p><code>in</code> 연산의 결과(<code>True/False</code>)를 <code>if</code> 조건으로 쓰면 돼요.</p>',
    cases: ['names = ["민수", "지아", "현우"]\nwho = "지아"', 'names = ["민수", "지아", "현우"]\nwho = "서연"', 'names = []\nwho = "a"', 'names = ["Kim", "Lee"]\nwho = "Lee"'],
  }),
  o({
    category: C, level: 1, title: 'append · insert · extend 차례로 적용',
    desc: `<p>리스트 <code>x</code>(길이 2 이상)가 주어져요. 아래를 <b>차례로</b> 적용한 뒤 <code>x</code>를 출력하세요.</p>
<ol><li><code>x.append(5)</code></li><li><code>x.insert(2, 10)</code></li><li><code>x.extend(["a", "b"])</code></li></ol>`,
    solution: `x.append(5)\nx.insert(2, 10)\nx.extend(["a", "b"])\nprint(x)\n`,
    hint: '<p><code>append</code>는 원소 하나를 끝에, <code>insert(위치, 값)</code>은 중간에, <code>extend</code>는 리스트의 원소들을 하나씩 끝에 붙여요.</p>',
    cases: ['x = [1, 2, 3, 4]', 'x = [9, 8]', 'x = list("pq")'],
  }),
  o({
    category: C, level: 2, title: 'pop · remove · count',
    desc: `<p>리스트 <code>x</code>가 주어져요(7이 하나 이상 들어 있어요). 아래를 순서대로 하세요.</p>
<ol><li>마지막 원소를 꺼내(<code>pop</code>) 변수 <code>last</code>에 저장하세요.</li><li>값이 <code>7</code>인 <b>첫 번째</b> 원소를 지우세요 (<code>remove</code>).</li><li><code>last</code>, <code>x</code>, <code>x.count(3)</code>을 한 줄에 하나씩 출력하세요.</li></ol>`,
    solution: `last = x.pop()\nx.remove(7)\nprint(last)\nprint(x)\nprint(x.count(3))\n`,
    hint: '<p><code>pop()</code>은 꺼낸 값을 돌려주고, <code>remove(값)</code>은 값이 같은 첫 원소만 지워요.</p>',
    cases: ['x = [1, 3, 5, 7, 1, 3, 5, 7]', 'x = [7, 3, 3, 7, 3]', 'x = [3, 7, 9]'],
  }),
  o({
    category: C, level: 2, title: '내림차순 정렬 vs 거꾸로 뒤집기',
    desc: `<p>리스트 <code>b</code>가 주어져요. 원본이 바뀌지 않도록 복사해서 아래 두 리스트를 만들고, 한 줄에 하나씩 출력하세요.</p>
<ol><li>복사본을 <b>내림차순으로 정렬</b>한 리스트 (<code>sort(reverse=True)</code>)</li><li>복사본을 <b>순서만 거꾸로 뒤집은</b> 리스트 (<code>reverse()</code>)</li></ol><p>두 결과가 왜 다른지 확인해 보세요.</p>`,
    solution: `s = b.copy()\ns.sort(reverse=True)\nr = b.copy()\nr.reverse()\nprint(s)\nprint(r)\n`,
    hint: '<p><code>sort()</code>와 <code>reverse()</code>는 둘 다 리스트를 직접 바꾸고 <code>None</code>을 돌려줘요. 그래서 복사본을 만든 뒤 호출하고, 복사본을 출력해요.</p>',
    cases: ['b = [1, 3, 5, 4, 2]', 'b = [10, 30, 20]', 'b = [5, 1, 5, 2]'],
  }),
  o({
    category: C, level: 3, title: '참조와 복사 (is 비교)',
    desc: `<p>리스트 <code>L</code>이 주어져요(길이 3 이상). <code>M = L</code>, <code>N = L.copy()</code>를 만든 뒤 <code>L[2] = 100</code>을 실행하세요. 그리고 아래 4줄을 출력하세요.</p>
<ol><li><code>L</code></li><li><code>M</code></li><li><code>N</code></li><li><code>M is L</code> 과 <code>N is L</code> 의 결과를 한 줄에 공백으로 구분해서 (예: <code>True False</code>)</li></ol>`,
    solution: `M = L\nN = L.copy()\nL[2] = 100\nprint(L)\nprint(M)\nprint(N)\nprint(M is L, N is L)\n`,
    hint: '<p><code>is</code>는 두 이름이 <b>같은 객체</b>를 가리키는지 확인해요. <code>==</code>(값이 같은가)와 달라요.</p>',
    cases: ['L = [1, 3, 5, 7, 9]', 'L = [0, 0, 0]', 'L = list("abcd")'],
  }),
  o({
    category: C, level: 3, title: '정렬은 하되 원본은 그대로',
    desc: `<p>문자열 리스트 <code>words</code>가 주어져요. 아래 3줄을 출력하세요.</p>
<ol><li>알파벳(가나다) 순으로 정렬한 <b>새 리스트</b> (<code>sorted</code>)</li><li><code>words</code> 자체 (원본이 그대로여야 해요)</li><li><code>words.sort()</code> 를 호출한 <b>반환값</b>을 출력 (<code>None</code>이 나와요. 단, 이 호출 때문에 <code>words</code>가 정렬되어 버려요)</li></ol>`,
    solution: `print(sorted(words))\nprint(words)\nprint(words.sort())\n`,
    hint: '<p><code>sorted()</code>는 새 리스트를 돌려주고, <code>sort()</code>는 제자리에서 정렬하며 <code>None</code>을 돌려줘요. 그래서 <code>x = x.sort()</code> 라고 쓰면 x가 <code>None</code>이 돼요.</p>',
    cases: ['words = ["banana", "peach", "apple", "orange"]', 'words = ["c", "a", "b"]', 'words = ["zebra", "ant"]'],
  }),
  o({
    category: C, level: 2, title: '슬라이싱·insert·pop 종합',
    desc: `<p>리스트 <code>A</code>(길이 5 이상)가 주어져요. 아래를 <b>차례로</b> 실행하세요.</p>
<ol><li><code>A[1:3] = [0]</code></li><li><code>A.insert(1, 5)</code></li></ol><p>그 뒤 아래 3줄을 출력하세요.</p><ol><li><code>A</code></li><li><code>A[::2]</code></li><li><code>A.pop()</code>의 반환값과 그 뒤의 <code>len(A)</code> (한 줄에 공백으로 구분: <code>print(A.pop(), len(A))</code>)</li></ol>`,
    solution: `A[1:3] = [0]\nA.insert(1, 5)\nprint(A)\nprint(A[::2])\nprint(A.pop(), len(A))\n`,
    hint: '<p>한 줄씩 직접 따라가 보세요. 슬라이싱 대입으로 2개가 1개로 줄고, insert로 하나가 늘어요.</p>',
    cases: ['A = [10, 20, 30, 40, 50, 60]', 'A = [1, 2, 3, 4, 5]', 'A = list(range(7))'],
  }),
  o({
    category: C, level: 2, title: '짝수 인덱스 원소의 합 (한 줄)',
    desc: `<p>숫자 리스트 <code>nums</code>가 주어져요. <b>인덱스가 짝수(0, 2, 4, …)인 원소의 합</b>을, 슬라이싱과 <code>sum</code>을 이용해 <b>한 줄</b>로 출력하세요.</p>`,
    solution: `print(sum(nums[::2]))\n`,
    hint: '<p><code>nums[::2]</code> 는 인덱스 0부터 2칸씩 건너뛴 원소들이에요.</p>',
    cases: ['nums = [4, 8, 15, 16, 23, 42]', 'nums = [1, 2, 3]', 'nums = [10]', 'nums = [5, 5, 5, 5]'],
  }),
  o({
    category: C, level: 3, title: '쉼표 문자열에서 개수·위치·정렬',
    desc: `<p>쉼표로 구분된 문자열 <code>text</code>와 찾을 항목 <code>item</code>이 주어져요. <code>split(",")</code>으로 리스트를 만든 뒤 아래 3줄을 출력하세요.</p>
<ol><li><code>item</code>이 몇 번 나오는지</li><li><code>item</code>이 <b>처음 나오는 위치</b>(인덱스)</li><li>항목들을 가나다(알파벳) 순으로 정렬한 리스트</li></ol>`,
    solution: `items = text.split(",")\nprint(items.count(item))\nprint(items.index(item))\nprint(sorted(items))\n`,
    hint: '<p><code>count(값)</code>, <code>index(값)</code>, <code>sorted(리스트)</code>를 써요.</p>',
    cases: ['text = "사과,바나나,딸기,바나나,포도"\nitem = "바나나"', 'text = "a,b,a,c,a"\nitem = "a"', 'text = "x,y,z"\nitem = "z"'],
  }),
];
