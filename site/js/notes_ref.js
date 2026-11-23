// 기초 노트 보충: "함수 사전" 모음. 문제에서 자주 쓰이는데 본문 노트에 없던 함수·메서드를 한곳에 모았다.
// 표기: 코드 뒤 주석은 실행 결과예요.
const n = (id, track, title, html) => ({ id, track, title, html });

export const REF_NOTES = [
  // ================= 파이썬 =================
  n('py-ref-builtin', 'python', '[사전] 내장 함수·문자열·컬렉션 메서드', `
<h3>숫자 관련 내장 함수</h3>
<pre class="out">abs(-3)            # 3        절댓값
round(3.14159, 2)  # 3.14     반올림 (round(2.5) 는 2 — 짝수 쪽으로 반올림!)
divmod(17, 5)      # (3, 2)   (몫, 나머지)
pow(2, 10)         # 1024     2 ** 10 과 같음. pow(2, 10, 7) 은 2**10 % 7
sum([1, 2, 3]); min(3, 1, 2); max([4, 9, 2])
bin(5); hex(255); oct(8)   # '0b101' '0xff' '0o10'
int("101", 2)      # 5        2진 문자열 → 정수</pre>
<h3>문자 ↔ 숫자, 변환·형식</h3>
<pre class="out">ord("A")           # 65       문자 → 코드 번호
chr(97)            # 'a'      코드 번호 → 문자
format(3.14159, ".2f")   # '3.14'
format(1234567, ",")     # '1,234,567'
f"{7:03d} {0.256:.1%} {'x':&gt;5}"   # '007 25.6%     x'</pre>
<h3>순회·정렬·검사 내장 함수</h3>
<pre class="out">list(reversed([1, 2, 3]))        # [3, 2, 1]   (원본을 안 바꿈)
sorted([3, 1, 2], reverse=True)  # [3, 2, 1]
list(enumerate("ab", start=1))   # [(1,'a'), (2,'b')]
list(zip([1, 2], "ab"))          # [(1,'a'), (2,'b')]
any([0, 0, 1]); all([1, 1, 0])   # True False
isinstance(3, int); issubclass(bool, int)   # True True
callable(len)                    # True  (호출할 수 있는가)</pre>
<h3>객체를 들여다보는 함수</h3>
<pre class="out">hasattr(obj, "name")       # 속성이 있나?
getattr(obj, "name", None) # 속성 값 (없으면 기본값)
setattr(obj, "name", "x")  # 속성 설정
vars(obj)                  # 객체의 속성을 딕셔너리로
dir(obj)                   # 쓸 수 있는 이름 목록
id(x)                      # 객체의 고유 번호 (같은 객체인지 비교할 때)</pre>
<h3>문자열 메서드 더 보기</h3>
<pre class="out">"hello".capitalize()   # 'Hello'
"Hello".swapcase()     # 'hELLO'
"  hi  ".lstrip() / .rstrip()   # 왼쪽 / 오른쪽 공백만 제거
"a-b-c".rsplit("-", 1) # ['a-b', 'c']  오른쪽에서부터 나눔
"banana".rfind("a")    # 5            오른쪽에서 처음 찾은 위치
"AB".isupper(); "ab".islower(); "  ".isspace()
"7".zfill(3)           # '007'
"hi".center(6, "*")    # '**hi**'
"hi".ljust(4, ".") ; "hi".rjust(4, ".")   # 'hi..' '..hi'
"a\\nb\\nc".splitlines()  # ['a','b','c']
"a=b".partition("=")   # ('a', '=', 'b')
"한".encode("utf-8")   # b'\\xed\\x95\\x9c'  문자열 → 바이트 (b.decode("utf-8") 로 되돌림)</pre>
<h3>리스트·딕셔너리·집합 메서드 더 보기</h3>
<pre class="out">a = [3, 1, 2]
b = a.copy()          # 얕은 복사 (a[:] 와 같음)
a.clear()             # 전부 비우기

d = {"x": 1}
d.update({"y": 2, "x": 9})      # {'x': 9, 'y': 2}  (겹치면 덮어씀)
dict.fromkeys(["a", "b"], 0)    # {'a': 0, 'b': 0}
d.popitem()                     # 마지막에 넣은 (키, 값)을 꺼내 삭제
d.setdefault("z", []).append(1) # 없으면 만들고 꺼냄

A, B = {1, 2, 3}, {2, 3, 4}
A | B  # == A.union(B)               {1,2,3,4}
A &amp; B  # == A.intersection(B)        {2,3}
A - B  # == A.difference(B)          {1}
A ^ B  # == A.symmetric_difference(B) {1,4}
{2, 3}.issubset(A)    # True   (부분집합인가)
A.update({9}); A.discard(100)   # 추가 / 없어도 오류 없는 삭제</pre>`),

  n('py-ref-lib', 'python', '[사전] 표준 라이브러리 (collections·itertools·functools·math·random·datetime·re·json·csv)', `
<h3>collections</h3>
<pre class="out">from collections import Counter, defaultdict, deque, namedtuple
Counter("abca")                       # Counter({'a': 2, 'b': 1, 'c': 1})
dd = defaultdict(list); dd["k"].append(1)   # 없는 키는 빈 리스트로 시작
q = deque([1, 2, 3]); q.append(4); q.appendleft(0); q.popleft()   # 양쪽 끝에서 빠르게 넣고 뺌
Point = namedtuple("Point", "x y"); p = Point(1, 2); p.x   # 1</pre>
<h3>heapq (우선순위 큐)·bisect (정렬된 리스트 탐색)</h3>
<pre class="out">import heapq, bisect
h = []
heapq.heappush(h, 5); heapq.heappush(h, 1); heapq.heappush(h, 3)
heapq.heappop(h)                 # 1   (항상 가장 작은 값이 먼저)
heapq.nlargest(2, [4, 9, 1, 7])  # [9, 7]

s = [10, 20, 30, 40]
bisect.bisect_left(s, 25)        # 2   (25를 넣을 위치)
bisect.insort(s, 25)             # [10, 20, 25, 30, 40]</pre>
<h3>itertools</h3>
<pre class="out">import itertools as it
list(it.permutations([1, 2, 3], 2))   # 순서 있는 2개: (1,2),(1,3),(2,1)...
list(it.combinations([1, 2, 3], 2))   # 순서 없는 2개: (1,2),(1,3),(2,3)
list(it.product("ab", [1, 2]))        # 모든 짝: ('a',1),('a',2),('b',1),('b',2)
list(it.accumulate([1, 2, 3, 4]))     # [1, 3, 6, 10]  누적합
list(it.chain([1, 2], [3]))           # [1, 2, 3]
list(it.islice(it.count(5), 3))       # [5, 6, 7]  (앞에서 3개)
list(it.zip_longest([1, 2, 3], "a", fillvalue="-"))   # [(1,'a'),(2,'-'),(3,'-')]
[(k, list(g)) for k, g in it.groupby("aabbb")]   # [('a',['a','a']), ('b',['b','b','b'])]  (붙어 있는 것끼리만 묶음)</pre>
<h3>functools</h3>
<pre class="out">from functools import reduce, lru_cache, partial, wraps
reduce(lambda a, b: a * b, [1, 2, 3, 4])   # 24
@lru_cache(maxsize=None)         # 결과를 기억해 두는 캐시 (메모이제이션)
def fib(n): return n if n &lt; 2 else fib(n - 1) + fib(n - 2)
square = partial(lambda b, e: b ** e, e=2); square(5)   # 25  (인수 하나를 미리 고정)
# wraps: 데코레이터가 원래 함수의 이름·설명을 잃지 않게 해 줌 → @wraps(func) 를 wrapper 위에</pre>
<h3>math · random</h3>
<pre class="out">import math, random
math.floor(2.7); math.ceil(2.1)        # 2 3
math.gcd(12, 18); math.factorial(5)    # 6 120
math.log(8, 2); math.log10(1000); math.pi
random.seed(0)                         # 같은 순서로 재현
random.choice(["a", "b"]); random.shuffle(lst)   # 하나 뽑기 / 제자리 섞기
random.sample(range(10), 3)            # 겹치지 않게 3개
random.randint(1, 6); random.random()  # 정수(양끝 포함) / 0~1 실수</pre>
<h3>datetime</h3>
<pre class="out">from datetime import date, datetime, timedelta
d = date.fromisoformat("2024-03-01")        # 문자열 → 날짜
d + timedelta(days=30)                      # date(2024, 3, 31)
(date(2024, 12, 25) - date(2024, 1, 1)).days   # 359
d.strftime("%Y/%m/%d %A")                   # '2024/03/01 Friday'  날짜 → 문자열
datetime.strptime("2024-03-01 09:30", "%Y-%m-%d %H:%M")   # 문자열 → datetime
d.weekday()                                 # 0=월요일 … 6=일요일</pre>
<h3>re (정규표현식)</h3>
<pre class="out">import re
re.findall(r"\\d+", "a12b3")          # ['12', '3']
re.sub(r"\\s+", " ", "a   b  c")      # 'a b c'   (바꾸기)
re.search(r"(\\d+)-(\\d+)", "tel 02-123").groups()   # ('02', '123')  (처음 찾은 것)
re.match(r"[a-z]+", "abc123")         # 문자열 "맨 앞"에서만 찾음
pat = re.compile(r"\\d{3}"); pat.findall("1234567")   # 미리 컴파일해 재사용</pre>
<h3>statistics · string · operator · enum · calendar</h3>
<pre class="out">import statistics, string, calendar
statistics.mean([1, 2, 4]); statistics.median([1, 3, 2]); statistics.stdev([1, 2, 3])   # 평균·중앙값·표본표준편차
statistics.mode([1, 2, 2, 3]); statistics.pstdev([1, 2, 3])                            # 최빈값·모표준편차
string.ascii_lowercase; string.ascii_uppercase; string.digits; string.punctuation   # 문자 모음 상수
calendar.isleap(2024); calendar.monthrange(2024, 2)   # True (3, 29): (1일의 요일 번호 0=월…, 그 달의 일수)

from operator import itemgetter, attrgetter
sorted([("a", 3), ("b", 1)], key=itemgetter(1))    # 두 번째 값으로 정렬 (lambda x: x[1] 과 같음)
sorted(people, key=attrgetter("age"))              # 객체의 속성으로 정렬

from enum import Enum
class Color(Enum):                  # 이름 붙은 상수 모음
    RED = 1
    BLUE = 2
Color.RED.name; Color.RED.value; Color(2)   # 'RED' 1 Color.BLUE</pre>
<h3>json · csv · sys · time</h3>
<pre class="out">import json, csv, sys, time
s = json.dumps({"a": [1, 2]}, ensure_ascii=False)   # 파이썬 → JSON 문자열
json.loads(s)                          # JSON 문자열 → 파이썬
with open("a.csv", newline="", encoding="utf-8") as f:
    for row in csv.reader(f): ...      # 한 줄씩 리스트로
    # csv.DictReader(f) 는 헤더를 키로 쓰는 딕셔너리로
sys.argv                               # 명령줄 인수 목록
time.sleep(0.5); time.time()           # 쉬기 / 현재 시각(초)</pre>`),

  n('py-ref-error', 'python', '[사전] 예외 종류·오류 읽기·as e·type(e).__name__', `
<h3>오류 객체 다루기: as e</h3>
<pre class="out">try:
    int("abc")
except ValueError as e:        # 잡은 오류를 변수 e 로 받음
    print(type(e).__name__)    # 'ValueError'      오류의 "이름(종류)"
    print(str(e))              # "invalid literal for int() with base 10: 'abc'"   오류 메시지
    print(e.args)              # ("invalid literal ...",)   raise 할 때 넣은 값들의 튜플
    print(repr(e))             # ValueError("invalid literal ...")  (이름까지 포함한 표현)

try:
    {}["k"]
except Exception as e:         # 모든 일반 오류의 부모 → 종류를 가리지 않고 잡음
    print(type(e).__name__, e) # KeyError 'k'</pre>
<h3>자주 만나는 오류와 원인</h3>
<pre class="out">ZeroDivisionError   1 / 0, 5 % 0
ValueError          int("abc"), float("x") — 타입은 맞는데 "값"이 이상함
TypeError           1 + "a", len(5), None + 1 — "타입"이 맞지 않음
IndexError          [1, 2][5] — 리스트 번호 범위 밖
KeyError            {}["k"] — 없는 딕셔너리 키
AttributeError      None.upper() — 그런 속성/메서드가 없음
NameError           정의하지 않은 변수 이름을 씀
UnboundLocalError   함수 안에서 바깥 변수를 바꾸려다 "지역 변수"로 취급됨 (→ global / nonlocal)
FileNotFoundError   없는 파일을 open
StopIteration       next() 로 더 줄 게 없을 때 (반복의 끝 신호)
RuntimeError        그 밖의 실행 중 문제 (직접 raise 할 때도 씀)
NotImplementedError "자식 클래스가 구현해야 해요"라는 표시로 직접 일으킴
RecursionError      재귀가 너무 깊음
AssertionError      assert 조건이 거짓
SyntaxError / IndentationError   문법·들여쓰기가 틀림 (실행 전에 나는 오류라 try 로 잡을 수 없어요)</pre>
<h3>오류의 가족 관계 (아래가 자식)</h3>
<pre class="out">BaseException
 └ Exception
    ├ ArithmeticError ─ ZeroDivisionError
    ├ LookupError ─ IndexError, KeyError
    ├ ValueError
    ├ TypeError
    ├ OSError ─ FileNotFoundError
    └ RuntimeError ─ NotImplementedError, RecursionError
# except 부모클래스 는 자식 오류도 함께 잡아요: except LookupError 는 IndexError 와 KeyError 모두</pre>
<h3>raise 의 여러 모양</h3>
<pre class="out">raise ValueError("메시지")        # 새로 일으키기
raise ValueError                  # 클래스만 써도 됨 (메시지 없음)
try: ...
except ValueError:
    print("로그 남기기")
    raise                         # 인수 없이 raise → 잡은 오류를 "그대로 다시" 던짐
try: int("x")
except ValueError as e:
    raise RuntimeError("설정 읽기 실패") from e   # 원인(e)을 이어 붙여 새 오류로 바꿈
def todo(): raise NotImplementedError("아직 안 만들었어요")</pre>
<h3>finally · else · 우선순위</h3>
<pre class="out">def f():
    try:
        return "try"
    finally:
        print("항상 실행")     # return 하기 직전에 실행됨
# except 는 위에서부터 처음 맞는 것 하나만 실행 → 구체적인 오류를 먼저, Exception 은 맨 뒤에
try: ...
except (KeyError, IndexError) as e: ...   # 튜플로 묶어 한 번에
except Exception as e: ...</pre>
<h3>with 와 오류 · 오류 위치 보기</h3>
<pre class="out">with open("a.txt") as f:     # 오류가 나도 파일이 자동으로 닫힘
    data = f.read()
import traceback
try: 1 / 0
except ZeroDivisionError:
    print(traceback.format_exc())   # "어느 줄에서 났는지"까지 문자열로
import warnings
warnings.warn("곧 사라질 기능이에요")   # 프로그램을 멈추지 않는 경고</pre>
<h3>dataclass 와 불변 객체의 오류</h3>
<pre class="out">from dataclasses import dataclass, FrozenInstanceError
@dataclass(frozen=True)          # 만든 뒤에는 값을 바꿀 수 없음
class P:
    x: int
p = P(1)
try: p.x = 2
except FrozenInstanceError: print("바꿀 수 없어요")</pre>`),

  n('py-ref-oop', 'python', '[사전] 클래스 보충: 특수 메서드·데코레이터·dataclass·assert', `
<h3>특수(매직) 메서드</h3>
<pre class="out">class Vec:
    def __init__(self, x, y): self.x, self.y = x, y
    def __repr__(self): return f"Vec({self.x}, {self.y})"   # 개발자용 표현 (print 와 리스트 출력에 쓰임)
    def __str__(self): return f"({self.x}, {self.y})"       # print(객체) 에 쓰임
    def __add__(self, o): return Vec(self.x + o.x, self.y + o.y)   # a + b
    def __eq__(self, o): return (self.x, self.y) == (o.x, o.y)    # a == b
    def __lt__(self, o): return self.x &lt; o.x                      # a &lt; b  (sorted 에서도 쓰임)
    def __len__(self): return 2                                    # len(a)
    def __getitem__(self, i): return (self.x, self.y)[i]           # a[0]
    def __iter__(self): return iter((self.x, self.y))              # for v in a
    def __call__(self, k): return Vec(self.x * k, self.y * k)      # a(3) 처럼 함수처럼 호출</pre>
<h3>연산자 특수 메서드 더 보기</h3>
<pre class="out">class V:
    def __init__(self, x): self.x = x
    def __sub__(self, o): return V(self.x - o.x)      # a - b
    def __mul__(self, o): return V(self.x * (o.x if isinstance(o, V) else o))   # a * b  (b 가 숫자여도 되게)
    def __rmul__(self, o): return self * o            # 3 * a  ("오른쪽 피연산자" 버전: 왼쪽이 숫자라 int.__mul__ 이 실패했을 때 호출)
    def __radd__(self, o): return V(self.x + o)       # 3 + a  /  sum([a, b]) 가 0 + a 로 시작하므로 필요
    def __pow__(self, k): return V(self.x ** k)       # a ** 2
    def __neg__(self): return V(-self.x)              # -a
    def __contains__(self, v): return v == self.x     # v in a
# 이름 앞에 r 이 붙은 메서드(__radd__ 등)는 "오른쪽에 있는 객체"가 처리하는 버전
# 자동 미분(autograd) 같은 계산 그래프 클래스를 만들 때 이 연산자들을 한꺼번에 정의해요

class Cell:
    pass
Cell.__name__       # 'Cell'   클래스 이름 문자열. 오류에는 type(e).__name__ 으로 사용
# if __name__ == "__main__":  → "이 파일을 직접 실행했을 때만" 아래 코드 실행</pre>
<h3>반복자 규약과 with 규약</h3>
<pre class="out">class Count:                       # for 문에서 쓸 수 있는 반복자
    def __init__(self, n): self.i, self.n = 0, n
    def __iter__(self): return self
    def __next__(self):
        if self.i &gt;= self.n: raise StopIteration   # "끝" 신호
        self.i += 1; return self.i

class Timer:                       # with 문에서 쓸 수 있는 객체
    def __enter__(self): print("시작"); return self
    def __exit__(self, exc_type, exc, tb): print("끝"); return False   # True 를 돌려주면 오류를 삼킴</pre>
<h3>staticmethod · classmethod · property</h3>
<pre class="out">class Circle:
    count = 0
    def __init__(self, r): self._r = r; Circle.count += 1

    @staticmethod
    def pi(): return 3.14159            # self 도 cls 도 안 받는 보통 함수

    @classmethod
    def unit(cls): return cls(1)        # cls = 클래스 자신 → 객체를 만드는 "대체 생성자"

    @property
    def area(self): return Circle.pi() * self._r ** 2   # 괄호 없이 c.area 로 읽음

    @property
    def r(self): return self._r
    @r.setter
    def r(self, v):
        if v &lt;= 0: raise ValueError("양수만")
        self._r = v                     # c.r = 5 로 대입할 때 검증</pre>
<h3>dataclass의 __post_init__</h3>
<pre class="out">from dataclasses import dataclass
@dataclass
class Rect:
    w: int
    h: int
    def __post_init__(self):          # __init__ 이 값을 채운 "직후" 자동으로 불림 → 검증·파생 값 계산
        if self.w &lt;= 0 or self.h &lt;= 0: raise ValueError("양수만")
        self.area = self.w * self.h</pre>
<h3>dataclass의 field · 상속 확인</h3>
<pre class="out">from dataclasses import dataclass, field
@dataclass
class Cart:
    owner: str
    items: list = field(default_factory=list)   # 리스트 같은 가변 기본값은 반드시 field 로!
issubclass(bool, int); isinstance(True, int)   # True True</pre>
<h3>assert · 그 밖의 문법</h3>
<pre class="out">assert n &gt; 0, "n은 양수여야 해요"   # 조건이 거짓이면 AssertionError (메시지 포함)
global total      # 함수 안에서 바깥(전역) 변수를 바꾸려고 할 때
nonlocal count    # 바로 바깥 함수의 변수를 바꾸려고 할 때 (클로저)
del lst[0]        # 요소/변수 삭제
yield from other  # 다른 반복 가능한 것의 값을 그대로 내보냄</pre>`),

  // ================= 데이터사이언스 =================
  n('ds-ref-numpy', 'ds', '[사전] NumPy 함수 모음', `
<h3>배열 만들기·모양 바꾸기</h3>
<pre class="out">import numpy as np
a = np.array([[1, 2, 3], [4, 5, 6]])
a.ravel(); a.flatten()      # 1차원으로 펴기  [1 2 3 4 5 6]  (ravel 은 가능하면 같은 메모리를 봄)
a.reshape(3, 2); a.reshape(-1, 2)   # -1 은 "나머지는 알아서"
a.T                         # 전치 (행↔열)
np.zeros((2, 2)); np.ones(3); np.eye(3); np.full((2, 2), 7)
np.arange(0, 10, 3)         # [0 3 6 9]
np.linspace(0, 1, 5)        # [0. .25 .5 .75 1.]  양 끝 포함 5개</pre>
<h3>합치기·쪼개기</h3>
<pre class="out">x, y = np.array([1, 2]), np.array([3, 4])
np.concatenate([x, y])      # [1 2 3 4]
np.vstack([x, y])           # [[1 2],[3 4]]   세로로 쌓기
np.hstack([x, y])           # [1 2 3 4]      가로로 붙이기
np.stack([x, y], axis=1)    # [[1 3],[2 4]]  새 축을 만들어 쌓기
np.split(np.arange(6), 3)   # [array([0,1]), array([2,3]), array([4,5])]</pre>
<h3>계산·누적·비교</h3>
<pre class="out">v = np.array([3, -1, 2])
np.abs(v); np.sqrt([4, 9]); np.exp(0); np.log(1)
np.cumsum(v); np.cumprod(v)          # [3 2 4]  [3 -3 -6]
np.dot(np.array([1, 2]), np.array([3, 4]))   # 11  (내적, 행렬곱은 a @ b)
np.maximum(v, 0)                     # [3 0 2]  원소끼리 큰 값 (ReLU 가 이 모양)
np.minimum(v, 0)                     # [0 -1 0]
np.clip(v, 0, 2)                     # [2 0 2]  범위 밖은 끝값으로
np.cov(x, y); np.corrcoef(x, y)      # 공분산 행렬 / 상관계수 행렬
np.percentile([1, 2, 3, 4], 50)      # 2.5</pre>
<h3>정렬·검색·조건</h3>
<pre class="out">v = np.array([3, 1, 2])
np.sort(v)                  # [1 2 3]
np.argsort(v)               # [1 2 0]  "정렬했을 때의 원래 위치"
v.argmin(); v.argmax()      # 1 0
np.where(v &gt; 1, "big", "small")   # ['big' 'small' 'big']   조건 ? 참 : 거짓
np.where(v &gt; 1)             # (array([0, 2]),)  조건이 참인 위치
np.select([v &lt; 2, v &lt; 3], ["a", "b"], default="c")   # 조건을 차례로 확인하는 다중 분기
np.unique([2, 1, 2], return_counts=True)   # (array([1,2]), array([1,2]))</pre>
<h3>결측·난수</h3>
<pre class="out">z = np.array([1.0, np.nan, 3.0])
np.isnan(z)                 # [False True False]
np.nanmean(z)               # 2.0  (NaN 을 빼고 평균)
np.nan_to_num(z, nan=0)     # [1. 0. 3.]
rng = np.random.default_rng(0)       # 요즘 권장 방식 (재현 가능한 난수 생성기)
rng.normal(0, 1, 3); rng.integers(0, 10, 3); rng.choice([1, 2, 3], 2)
np.random.seed(0); np.random.randn(2)   # 옛 방식 (표준정규분포)</pre>`),

  n('ds-ref-pandas', 'ds', '[사전] pandas 함수 모음', `
<h3>만들기·읽기·살펴보기</h3>
<pre class="out">import pandas as pd
df = pd.DataFrame({"name": ["a", "b", "c"], "score": [90, 80, 70]})
s = pd.Series([1, 2, 3], index=["x", "y", "z"])
df = pd.read_csv("file.csv")
df.head(2); df.tail(2)      # 앞 / 뒤 몇 행
df.info()                   # 열별 타입·결측 개수 요약
df.describe(); df.shape; df.dtypes; df.columns</pre>
<h3>선택 (loc / iloc / query)</h3>
<pre class="out">df.loc[0, "score"]              # 라벨(이름)로: 행 라벨 0, 열 "score"
df.loc[df.score &gt;= 80, ["name"]]  # 조건 + 열 선택
df.iloc[0, 1]; df.iloc[:2, :]   # 위치(번호)로
df.query("score &gt;= 80 and name != 'a'")   # 조건을 문자열로
df[df["name"].isin(["a", "b"])]
df[df.score.between(75, 85)]    # 범위 (양 끝 포함)</pre>
<h3>결측치·중복·형 변환</h3>
<pre class="out">df.isna() / df.isnull()         # 결측 여부 (True/False 표)
df.notna()                      # 결측이 아닌가
df["score"].fillna(0); df.dropna()
df.drop_duplicates(subset=["name"])      # 중복 행 제거
df["score"].astype(float)       # 열의 자료형 바꾸기
df2 = df.copy()                 # 복사본 (원본을 안 건드리려고)
df.assign(pass_=df.score &gt;= 75) # 새 열을 추가한 "새" 데이터프레임 (체이닝에 편함)
df["g"] = df["score"].apply(lambda v: "A" if v &gt;= 85 else "B")
df["g"].map({"A": 1, "B": 0}); df.map(str)   # 값 하나씩 변환 (map 은 Series 용, 표 전체는 DataFrame.map — 옛 버전 이름은 applymap)</pre>
<h3>정렬·순위·누적</h3>
<pre class="out">df.sort_values("score", ascending=False)
df.sort_index()                 # 행 라벨 순으로
df["score"].rank(ascending=False)    # 순위 (동점은 평균 순위)
df["score"].cumsum()            # 누적합
df["score"].diff()              # 바로 앞 행과의 차이
df["score"].shift(1)            # 한 칸 밀기 (전날 값 보기)
df["score"].rolling(2).mean()   # 이동평균 (창 크기 2)
df["score"].quantile(0.5)       # 분위수 (중앙값)
df["score"].idxmax(); df["score"].idxmin()   # 최댓값/최솟값의 "라벨"
df.nlargest(2, "score"); df.nsmallest(1, "score")</pre>
<h3>그룹·표 모양 바꾸기·합치기</h3>
<pre class="out">df.groupby("g")["score"].agg(["mean", "max"])
df.groupby("g")["score"].transform("mean")    # 그룹 평균을 "원래 행 수 그대로" 붙임
pd.pivot_table(df, index="g", values="score", aggfunc="mean")
df.pivot(index="id", columns="subject", values="score")    # 긴 표 → 넓은 표
df.melt(id_vars="name", var_name="subject", value_name="score")   # 넓은 표 → 긴 표
pd.crosstab(df.g, df.name)      # 빈도표
pd.concat([df1, df2], axis=0)   # 위아래로 (axis=1 은 옆으로)
pd.merge(a, b, on="id", how="left")</pre>
<h3>범주화·날짜·문자열·더미</h3>
<pre class="out">pd.cut(df.score, [0, 60, 80, 100], labels=["하", "중", "상"])   # 구간 직접 지정
pd.qcut(df.score, 4)            # 분위수로 같은 개수씩
df["d"] = pd.to_datetime(df["d"])
df["d"].dt.year; df["d"].dt.month; df["d"].dt.day_name()
df["name"].str.contains("a"); df["name"].str.replace("a", "A"); df["name"].str.split("-", expand=True)
pd.get_dummies(df["g"])         # 원-핫 인코딩 (범주 → 0/1 열)
df["score"].clip(0, 100)        # 범위 밖은 끝값으로</pre>`),

  n('ds-ref-sklearn', 'ds', '[사전] scikit-learn 전처리·평가 함수', `
<h3>데이터 나누기·전처리</h3>
<pre class="out">from sklearn.model_selection import train_test_split
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)

from sklearn.preprocessing import StandardScaler, MinMaxScaler
sc = StandardScaler()                 # (x - 평균) / 표준편차
X_tr_s = sc.fit_transform(X_tr)       # 훈련 데이터로 "기준을 배우고(fit)" 바로 변환
X_te_s = sc.transform(X_te)           # 시험 데이터는 같은 기준으로 변환만! (fit 다시 금지)
MinMaxScaler().fit_transform(X)       # 0~1 범위로</pre>
<h3>분류 모델</h3>
<pre class="out">from sklearn.neighbors import KNeighborsClassifier
knn = KNeighborsClassifier(n_neighbors=3).fit(X_tr, y_tr)   # 가까운 3개의 다수결
pred = knn.predict(X_te)
proba = knn.predict_proba(X_te)       # 클래스별 확률 (각 행의 합 = 1)</pre>
<h3>그 밖의 모델 (같은 fit / predict 모양)</h3>
<pre class="out">from sklearn.svm import SVC
from sklearn.linear_model import Ridge, Lasso
SVC(kernel="rbf", C=1.0).fit(X_tr, y_tr)   # 서포트 벡터 머신: 두 클래스 사이의 "여백(margin)"이 가장 넓은 경계
Ridge(alpha=1.0).fit(X_tr, y_tr)           # 회귀 + L2 규제 (계수를 작게 눌러 과적합을 줄임)
Lasso(alpha=0.1).fit(X_tr, y_tr)           # 회귀 + L1 규제 (쓸모없는 계수를 0으로 만듦)</pre>
<h3>분류 평가 지표</h3>
<pre class="out">from sklearn.metrics import accuracy_score, confusion_matrix, precision_score, recall_score, f1_score
accuracy_score(y_te, pred)            # 맞춘 비율
confusion_matrix(y_te, pred)          # [[TN, FP], [FN, TP]]  (행=실제, 열=예측)
precision_score(y_te, pred)           # TP / (TP + FP)  "양성이라 한 것 중 진짜 양성"
recall_score(y_te, pred)              # TP / (TP + FN)  "진짜 양성 중 찾아낸 비율"
f1_score(y_te, pred)                  # 정밀도와 재현율의 조화평균</pre>
<h3>회귀 평가 지표</h3>
<pre class="out">from sklearn.metrics import mean_squared_error, r2_score
mean_squared_error(y_te, pred)        # 오차 제곱의 평균 (루트를 씌우면 RMSE)
r2_score(y_te, pred)                  # 결정계수 R²  (1에 가까울수록 좋음)</pre>`),

  // ================= R =================
  n('r-ref-base', 'r', '[사전] base R 함수 모음', `
<h3>수치·누적·집합</h3>
<pre class="out">min(x); max(x); range(x)       # 최소·최대·(최소, 최대)
abs(-3); exp(1); log(8, base = 2)
cumsum(1:4); prod(1:5)         # 1 3 6 10 / 120
floor(2.7); ceiling(2.1)       # 2 3
choose(5, 2); factorial(5)     # 10 120   (조합 / 팩토리얼)
unique(c(1, 2, 2)); duplicated(c(1, 2, 2))   # 1 2 / FALSE FALSE TRUE
table(c("a", "b", "a"))        # 빈도표: a=2 b=1
tabulate(c(1, 2, 2))           # 1 2   (정수의 개수)
which.min(c(3, 1, 2))          # 2   (최솟값의 위치)
append(1:3, 99, after = 1)     # 1 99 2 3
tail(1:5, 2)                   # 4 5</pre>
<h3>검사 함수</h3>
<pre class="out">any(x &gt; 3); all(x &gt; 0)
is.null(NULL); is.numeric(3); is.character("a"); is.function(sum); is.na(NA)
identical(c(1, 2), c(1, 2))    # TRUE   (완전히 같은가)
all.equal(0.1 + 0.2, 0.3)      # TRUE   (부동소수점 오차를 무시하고 비교)
inherits(obj, "myclass")       # 클래스 상속 관계 확인
exists("x")                    # 변수가 있나?</pre>
<h3>형 변환·문자열</h3>
<pre class="out">as.character(12); as.integer("7"); as.numeric("3.5")
as.Date("2024-03-01")          # 날짜 (+30 하면 30일 뒤)
format(3.1, nsmall = 2)           # "3.10"
format(Sys.Date(), "%Y/%m/%d")
format(1234567, big.mark = ",")   # "1,234,567"
sprintf("%05.1f", 3.14159)        # "003.1"
tolower("AB"); toupper("ab")
substring("abcdef", 1:3, 3:5)     # "abc" "bcd" "cde"
startsWith("hello", "he"); endsWith("hello", "lo")   # TRUE TRUE
regmatches("a12b3", gregexpr("[0-9]+", "a12b3"))[[1]]   # "12" "3"  (패턴에 맞는 부분 꺼내기)
strtoi("101", base = 2)           # 5
Sys.time()                        # 현재 시각</pre>
<h3>리스트·apply 계열·분기·반복</h3>
<pre class="out">unlist(list(a = 1, b = 2))              # 이름 있는 벡터 c(a=1, b=2) ("납작하게 펴기")
unname(c(a = 1, b = 2))                 # 이름 떼기  1 2
setNames(1:2, c("x", "y"))              # 이름 붙이기
lapply(1:3, function(i) i^2)            # 항상 리스트로
vapply(1:3, function(i) i^2, numeric(1))   # 결과 타입을 못박음 (더 안전한 sapply)
mapply(function(a, b) a + b, 1:3, 4:6)  # 여러 벡터를 짝지어 5 7 9
do.call(rbind, list(1:2, 3:4))          # 리스트의 원소들을 인수로 풀어 함수 호출
Reduce(\`+\`, 1:4, accumulate = TRUE)     # 1 3 6 10
Find(function(v) v &gt; 2, 1:5)            # 3  (조건 맞는 첫 원소)
Position(function(v) v &gt; 2, 1:5)        # 3  (그 위치)
Negate(is.na)                           # 조건을 뒤집은 함수
switch("b", a = "A", b = "B", "기타")    # "B" (마지막은 기본값)
seq_along(c("a", "b")); seq_len(0)      # 1 2 / integer(0)  (빈 경우에도 안전한 반복용)
repeat { i <- i + 1; if (i &gt; 3) break }  # 무한 반복 + break</pre>
<h3>문자열·변환 보충</h3>
<pre class="out">strrep("ab", 3)                    # "ababab"  (문자열 반복)
formatC(3.14159, digits = 2, format = "f")   # "3.14"
formatC(7, width = 3, flag = "0")  # "007"
chartr("abc", "xyz", "aabbcc")     # "xxyyzz"  (글자 하나씩 바꾸기: a→x, b→y, c→z)
weekdays(as.Date("2024-03-01"))    # "금요일"  (사용 환경의 언어로 나와요)
as.list(1:3); as.vector(m)         # 벡터→리스트 / 행렬→벡터
as.data.frame(m)                   # 행렬 → 데이터프레임
rownames(df); rownames(df) &lt;- c("a", "b")   # 행 이름 읽기/바꾸기
is.list(x); is.factor(x); is.logical(x)    # 타입 검사
nlevels(factor(c("a", "b", "a")))  # 2  (범주 개수)
capture.output(print(1:3))         # 출력된 글자를 문자열로 붙잡기
suppressWarnings(as.numeric("a"))  # 경고 메시지를 안 보이게 (NA 는 그대로)
ave(c(1, 2, 3, 4), c("a", "a", "b", "b"))   # 1.5 1.5 3.5 3.5  (그룹 평균을 원래 길이로 붙임)
Find(function(v) v &gt; 2, 1:5)       # 3 (조건에 맞는 첫 원소)</pre>
<h3>S3 메서드 이름 규칙</h3>
<pre class="out">speak &lt;- function(x, ...) UseMethod("speak")     # 일반 함수
speak.cat &lt;- function(x, ...) cat("야옹\n")      # "일반함수.클래스" 이름이 메서드
speak.default &lt;- function(x, ...) cat("...\n")   # 맞는 클래스가 없을 때
print.person &lt;- function(x, ...) cat("사람:", x$name, "\n")   # print(obj) 가 자동으로 이걸 부름
class(obj) &lt;- c("student", "person")             # 앞에 있는 클래스부터 찾음(상속)</pre>
<h3>행렬·데이터프레임 보충</h3>
<pre class="out">m <- matrix(1:6, nrow = 2)
dim(m); nrow(m); ncol(m); t(m)          # 모양 / 행 수 / 열 수 / 전치
cbind(1:2, 3:4); rbind(1:2, 3:4)        # 열로 붙이기 / 행으로 붙이기
rowSums(m); colMeans(m); rowMeans(m)
diag(2); solve(matrix(c(2, 0, 0, 2), 2))   # 단위행렬 / 역행렬
outer(1:3, 1:3)                         # 곱셈표 (외적)
with(df, mean(score))                   # df$ 를 반복해서 안 쓰게 해 줌
within(df, { double <- score * 2 })     # 새 열을 만들며 df 를 돌려줌</pre>`),

  n('r-ref-tidy', 'r', '[사전] tidyverse 함수 모음', `
<h3>dplyr: 행·열 다루기</h3>
<pre class="out">library(dplyr)
df %&gt;% rename(점수 = score)              # 열 이름 바꾸기 (새이름 = 옛이름)
df %&gt;% relocate(score, .before = name)   # 열 위치 옮기기
df %&gt;% distinct(dept)                    # 중복 제거
df %&gt;% slice_head(n = 3); slice_max(df, score, n = 2)   # 앞 3행 / 값이 큰 상위 2행
df %&gt;% mutate(g = case_when(score &gt;= 90 ~ "A", score &gt;= 80 ~ "B", TRUE ~ "C"))   # 위에서부터 첫 참
df %&gt;% filter(between(score, 70, 90))   # 범위 (양 끝 포함)
df %&gt;% mutate(across(c(a, b), ~ .x * 2)) # 여러 열에 같은 계산
df %&gt;% mutate(r = dense_rank(desc(score)), r2 = min_rank(desc(score)))   # 동점 순위 방식 차이</pre>
<h3>집계·그룹</h3>
<pre class="out">df %&gt;% group_by(dept) %&gt;% summarize(n = n(), kinds = n_distinct(job), avg = mean(pay))
# summarize == summarise (같은 함수)
df %&gt;% group_by(dept) %&gt;% mutate(share = pay / sum(pay)) %&gt;% ungroup()   # 그룹 풀기 (이후 계산이 그룹 단위로 되는 걸 방지)
df %&gt;% count(dept, sort = TRUE)           # group_by + n() 한 번에</pre>
<h3>합치기 (조인·붙이기)</h3>
<pre class="out">left_join(a, b, by = "id"); inner_join(a, b, by = "id"); full_join(a, b, by = "id")
semi_join(a, b, by = "id")   # b 에 짝이 "있는" a 의 행만 (열은 a 것만)
anti_join(a, b, by = "id")   # b 에 짝이 "없는" a 의 행만
bind_rows(df1, df2)          # 위아래로 (열 이름 기준)
bind_cols(df1, df3)          # 옆으로</pre>
<h3>tidyr · stringr · lubridate 보충</h3>
<pre class="out">library(tidyr); library(stringr); library(lubridate)
unite(df, "full", first, last, sep = " ")        # 열 합치기
separate(df, full, into = c("first", "last"), sep = " ")
pivot_longer(df, cols = c(a, b), names_to = "k", values_to = "v")   # 넓은 → 긴
pivot_wider(df, names_from = k, values_from = v)                    # 긴 → 넓은
drop_na(df); replace_na(df, list(score = 0))
str_length("hello"); str_to_upper("a"); str_split("a-b-c", "-")[[1]]; str_c("a", "b", sep = "-")
str_detect("apple", "pp"); str_replace("aaa", "a", "b"); str_sub("abcdef", 2, 4)   # TRUE "baa" "bcd"
ymd("2024-03-01"); mdy("03/01/2024"); today(); year(today())
difftime(ymd("2024-12-25"), ymd("2024-01-01"), units = "days")   # 359 days</pre>`),

  n('r-ref-stat', 'r', '[사전] R 난수·통계 검정·객체 보충', `
<h3>난수와 분포</h3>
<pre class="out">set.seed(1)                    # 같은 난수를 재현
rnorm(3, mean = 0, sd = 1)     # 정규분포 난수
runif(2, 0, 10)                # 균등분포 난수
rbinom(3, size = 10, prob = 0.5)   # 이항분포 (10번 중 성공 횟수)
sample(1:10, 3)                # 겹치지 않게 3개 뽑기
quantile(x, c(.25, .75))       # 분위수 (사분위수)</pre>
<h3>통계 검정 함수</h3>
<pre class="out">shapiro.test(x)                # 정규성 검정 (p &gt; 0.05 이면 정규성을 기각 못 함)
var.test(a, b)                 # 두 집단의 분산이 같은가 (등분산 검정)
t.test(a, b, var.equal = TRUE) # 두 집단 평균 비교
chisq.test(table(df$a, df$b))  # 범주형 두 변수가 독립인가 (카이제곱 검정)
cor.test(x, y)                 # 상관계수가 0인지 검정</pre>
<h3>환경·클래스 보충</h3>
<pre class="out">e <- new.env(); assign("k", 5, envir = e); get("k", envir = e); exists("k", envir = e)
local({ y <- 1; y + 1 })       # 이 안에서만 쓰는 임시 변수 공간
attr(x, "unit") <- "cm"        # 객체에 속성 붙이기
setClass("P", representation(name = "character"))      # S4 클래스 정의
setMethod("show", "P", function(object) cat(object@name, "\\n"))   # S4 메서드
Recall(n - 1)                  # 함수가 자기 자신을 부를 때 (재귀)</pre>`),

  // ================= SQL =================
  n('sql-ref', 'sql', '[사전] SQL 함수·구문 모음 (PostgreSQL 기준)', `
<h3>숫자·문자열 함수</h3>
<pre class="out">ABS(-3)  CEIL(2.1)  FLOOR(2.9)  ROUND(3.14159, 2)  MOD(7, 3)
LENGTH('hello')                -- 5   글자 수
UPPER('ab')  LOWER('AB')
SUBSTR('abcdef', 2, 3)         -- 'bcd'   (2번째부터 3글자. SUBSTRING 도 같음)
TRIM('  hi  ')                 -- 'hi'
REPLACE('a-b', '-', '+')       -- 'a+b'
CONCAT('a', 'b')  또는  'a' || 'b'
POSITION('b' IN 'abc')         -- 2   (문자가 처음 나오는 위치. STRPOS 도 같음)
LPAD('7', 3, '0')              -- '007'
SPLIT_PART('a-b-c', '-', 2)    -- 'b'   (구분자로 나눈 n번째 조각)
NULLIF(a, 0)                   -- a 가 0 이면 NULL (0으로 나누기 방지에 사용)
COALESCE(x, 0)                 -- x 가 NULL 이면 0  (IFNULL 은 PostgreSQL 에 없고 COALESCE 를 써요)</pre>
<h3>날짜 함수</h3>
<pre class="out">EXTRACT(YEAR FROM d)  EXTRACT(MONTH FROM d)  EXTRACT(DOW FROM d)   -- 연·월·요일(0=일요일)
DATE_TRUNC('month', d)         -- 그 달의 1일로 내림 (월별 집계에 편함)
TO_CHAR(d, 'YYYY-MM')          -- 날짜를 형식 문자열로  '2024-03'
d + INTERVAL '7 days'          -- 7일 뒤
d2 - d1                        -- 날짜 차이 (일 수)
CURRENT_DATE</pre>
<h3>집계 보충</h3>
<pre class="out">COUNT(*)  COUNT(col)  COUNT(DISTINCT col)
SUM(x)  AVG(x)  MIN(x)  MAX(x)
STRING_AGG(name, ', ' ORDER BY name)   -- 그룹의 문자열을 쉼표로 이어 붙임
ARRAY_AGG(x)                           -- 그룹의 값을 배열로 모음
COUNT(*) FILTER (WHERE x &gt; 10)         -- 조건에 맞는 행만 세기 (CASE WHEN 보다 간단)
SUM(CASE WHEN x &gt; 10 THEN 1 ELSE 0 END)  -- 같은 일을 CASE 로</pre>
<h3>윈도우 함수 보충</h3>
<pre class="out">ROW_NUMBER() OVER (PARTITION BY dept ORDER BY pay DESC)   -- 1,2,3…  동점도 다른 번호
RANK()       OVER (ORDER BY pay DESC)    -- 1,1,3   (동점은 같은 순위, 다음 번호를 건너뜀)
DENSE_RANK() OVER (ORDER BY pay DESC)    -- 1,1,2   (건너뛰지 않음)
NTILE(4)     OVER (ORDER BY pay)         -- 행을 4개 그룹으로 균등하게 나눔 (사분위)
LAG(pay)  OVER (ORDER BY d)              -- 바로 앞 행의 값
LEAD(pay) OVER (ORDER BY d)              -- 바로 뒤 행의 값
FIRST_VALUE(pay) OVER (PARTITION BY dept ORDER BY pay DESC)   -- 그룹의 첫 값
LAST_VALUE(pay) OVER (ORDER BY d ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)   -- 끝 값은 범위를 지정해야 해요
SUM(x) OVER (ORDER BY d)                 -- 누적합</pre>
<h3>집합 연산·조인 보충·반복 생성</h3>
<pre class="out">SELECT a FROM t1 UNION SELECT a FROM t2        -- 합집합 (중복 제거, UNION ALL 은 그대로)
SELECT a FROM t1 INTERSECT SELECT a FROM t2    -- 교집합
SELECT a FROM t1 EXCEPT SELECT a FROM t2       -- 차집합 (t1 에만 있는 것)
SELECT * FROM a RIGHT JOIN b ON a.id = b.id    -- b 를 모두 살림
SELECT * FROM a FULL JOIN b ON a.id = b.id     -- 양쪽 모두 살림
SELECT * FROM a CROSS JOIN b                   -- 모든 짝 (곱집합)
x &gt; ANY (SELECT ...)   x &gt; ALL (SELECT ...)      -- 하나라도 / 전부보다 큰가
LIMIT 5 OFFSET 10                              -- 11번째부터 5개
SELECT * FROM generate_series(1, 5)            -- 1~5 숫자 표 만들기

WITH RECURSIVE n(i) AS (                       -- 재귀 CTE: 1부터 5까지
  SELECT 1 UNION ALL SELECT i + 1 FROM n WHERE i &lt; 5
)
SELECT * FROM n;</pre>
<h3>데이터 만들기·바꾸기</h3>
<pre class="out">CREATE TABLE t (id INT PRIMARY KEY, name TEXT, pay INT);
INSERT INTO t (id, name, pay) VALUES (1, 'a', 100), (2, 'b', 200);
UPDATE t SET pay = pay + 10 WHERE name = 'a';
DELETE FROM t WHERE pay &lt; 100;</pre>`),
];
