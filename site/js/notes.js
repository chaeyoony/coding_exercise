// 기초 노트: 문제를 풀다가 막힐 때 펼쳐 보는 코드 정리. 문제 화면에서 단원(카테고리)에 맞는 노트로 연결된다.
const n = (id, track, title, html) => ({ id, track, title, html });

export const NOTES = [
  // ================= 파이썬 =================
  n('py-basics', 'python', '변수·자료형·입출력', `
<h3>변수와 자료형</h3>
<pre class="out">x = 10            # int (정수)
pi = 3.14         # float (실수)
name = "Kim"      # str (문자열)
ok = True         # bool (참/거짓)
print(type(x))    # &lt;class 'int'&gt;</pre>
<h3>연산자</h3>
<pre class="out">7 + 2, 7 - 2, 7 * 2     # 9 5 14
7 / 2                   # 3.5  (나눗셈은 항상 실수)
7 // 2, 7 % 2           # 3 1  (몫, 나머지)
2 ** 10                 # 1024 (거듭제곱)
a == b, a != b, a &lt; b    # 비교 → True/False
a and b, a or b, not a  # 논리 연산</pre>
<h3>출력과 입력</h3>
<pre class="out">print("a", "b", sep="-")      # a-b
print("끝", end="")           # 줄바꿈 없이
n = int(input())              # 입력은 문자열 → int()로 변환
print(f"{name}님은 {x}살")    # f-string: {} 안에 변수/식</pre>
<p class="muted">변수 이름으로 <code>sum</code>, <code>max</code>, <code>list</code> 같은 내장 함수 이름을 쓰면 내장 함수가 가려져요.</p>`),
  n('py-str', 'python', '문자열 다루기', `
<pre class="out">s = "Hello, World"
len(s)              # 12
s[0], s[-1]         # 'H' 'd'   (인덱스는 0부터, 음수는 뒤에서)
s[0:5]              # 'Hello'   (슬라이싱: 시작 이상 끝 미만)
s[::-1]             # 'dlroW ,olleH' (뒤집기)
s.upper(), s.lower(), s.title()
s.strip()           # 양쪽 공백 제거
s.split(", ")       # ['Hello', 'World']
"-".join(["a","b"]) # 'a-b'
s.replace("l", "L") # 'HeLLo, WorLd'
s.find("o")         # 4 (없으면 -1)
"lo" in s           # True
s.startswith("He"), s.endswith("d")
"abc".isalpha(), "123".isdigit(), "a1".isalnum()
f"{3.14159:.2f}"    # '3.14'  (소수 둘째 자리)
f"{7:03d}"          # '007'   (3자리, 0으로 채움)</pre>
<p class="muted">문자열은 <b>바꿀 수 없어요(불변)</b>. 메서드는 새 문자열을 돌려줘요.</p>`),
  n('py-containers', 'python', '리스트·튜플·집합·딕셔너리', `
<h3>리스트 list — 순서 O, 변경 O</h3>
<pre class="out">a = [3, 1, 2]
a.append(4); a.insert(0, 9); a.extend([7, 8])
a.pop()            # 마지막 꺼내기, a.pop(0)은 첫 번째
a.remove(1)        # 값으로 지우기
a.sort(); a.reverse()   # 제자리 정렬 (None을 돌려줌!)
sorted(a)          # 새 리스트로 정렬
a[1:3], a[::-1], len(a), sum(a), min(a), max(a)
a.count(2), a.index(2)</pre>
<h3>튜플 tuple — 변경 X</h3>
<pre class="out">t = (1, 2)
x, y = t           # 언패킹
x, y = y, x        # 두 값 바꾸기</pre>
<h3>집합 set — 중복 X, 순서 X</h3>
<pre class="out">s = {1, 2, 3}; s.add(4); s.discard(9)
{1,2} | {2,3}   # 합집합 {1,2,3}
{1,2} &amp; {2,3}   # 교집합 {2}
{1,2} - {2,3}   # 차집합 {1}</pre>
<h3>딕셔너리 dict — 키: 값</h3>
<pre class="out">d = {"a": 1, "b": 2}
d["c"] = 3                  # 추가/수정
d.get("z", 0)               # 없으면 기본값 0 (KeyError 안 남)
"a" in d                    # 키 존재 확인
d.keys(), d.values(), d.items()
for k, v in d.items(): ...
d.setdefault("k", []).append(1)   # 키가 없으면 빈 리스트부터
del d["a"]</pre>`),
  n('py-flow', 'python', '조건문·반복문', `
<pre class="out">if x &gt; 0:
    ...
elif x == 0:
    ...
else:
    ...

for i in range(5):          # 0,1,2,3,4
    ...
for i in range(2, 10, 3):   # 2,5,8 (시작, 끝 미만, 간격)
    ...
for ch in "abc": ...
for i, v in enumerate(["a","b"], start=1): ...   # 번호와 값
for a, b in zip([1,2], ["x","y"]): ...           # 짝지어 순회

while n &gt; 0:
    n -= 1
    if n == 3: continue     # 이번 차례 건너뛰기
    if n == 1: break        # 반복 끝내기
else:
    ...                     # break 없이 끝나면 실행

x = "큼" if n &gt; 5 else "작음"   # 조건 표현식</pre>
<p class="muted">0, 빈 문자열, 빈 리스트, <code>None</code>은 거짓(False)으로 취급돼요.</p>`),
  n('py-func', 'python', '함수 만들기', `
<pre class="out">def add(a, b=0):          # b는 기본값 인수
    return a + b          # 값을 돌려줌 (print와 다름!)

add(1, 2); add(1); add(b=5, a=1)   # 위치/키워드 인수

def total(*nums):         # 여러 개를 튜플로
    return sum(nums)
def show(**opts):         # 키워드를 딕셔너리로
    return opts

def min_max(xs):
    return min(xs), max(xs)        # 튜플로 여러 값
lo, hi = min_max([3, 1, 2])

x = 10
def f():
    global x              # 바깥 변수를 바꾸려면 global
    x += 1</pre>
<ul><li><code>return</code>이 없으면 <code>None</code>을 돌려줘요.</li><li>리스트 같은 가변 객체를 함수에 넘기면 함수 안 수정이 밖에도 반영돼요.</li><li>기본값에 <code>[]</code>를 쓰지 말고 <code>None</code>으로 받은 뒤 함수 안에서 새로 만드세요.</li></ul>
<h3>재귀</h3>
<pre class="out">def fact(n):
    if n &lt;= 1:      # 기저 조건(멈추는 조건) 꼭 필요
        return 1
    return n * fact(n - 1)</pre>`),
  n('py-comp', 'python', '컴프리헨션·정렬·내장 함수', `
<pre class="out">[x * x for x in range(5)]               # [0,1,4,9,16]
[x for x in nums if x % 2 == 0]         # 조건으로 거르기
[[0] * 3 for _ in range(2)]             # 2×3 격자 (행마다 새 리스트)
{w: len(w) for w in words}              # 딕셔너리 컴프리헨션
{x % 3 for x in nums}                   # 집합 컴프리헨션

sorted(xs, reverse=True)
sorted(words, key=len)                   # 길이순
sorted(people, key=lambda p: (-p[1], p[0]))   # 점수 큰 순, 이름 순
any(x &gt; 3 for x in xs), all(x &gt; 0 for x in xs)
sum(1 for x in xs if x &gt; 3)             # 조건에 맞는 개수
list(map(str, [1, 2])), list(filter(None, [0, 1, 2]))</pre>
<p class="muted">컴프리헨션은 "결과식 for 변수 in 반복대상 if 조건" 순서예요.</p>`),
  n('py-lambda', 'python', '람다(lambda)', `
<pre class="out">square = lambda x: x ** 2          # def square(x): return x ** 2
add = lambda a, b=0: a + b          # 기본값도 가능
sign = lambda x: "양수" if x &gt; 0 else "아님"   # if문 대신 조건 표현식
(lambda x: x + 1)(5)                # 즉시 실행 → 6</pre>
<h3>자주 쓰는 자리</h3>
<pre class="out">list(map(lambda x: x * 2, [1, 2, 3]))        # [2,4,6]
list(filter(lambda x: x % 2 == 0, [1,2,3,4])) # [2,4]
sorted(words, key=lambda w: len(w))
max(items, key=lambda p: p["price"])
from functools import reduce
reduce(lambda a, b: a * b, [1, 2, 3, 4], 1)   # 24 (누적)</pre>
<h3>함수를 돌려주는 함수 (클로저)</h3>
<pre class="out">def make_adder(n):
    return lambda x: x + n
add3 = make_adder(3); add3(4)       # 7

# 반복문 안 람다는 현재 값을 기본값으로 붙잡아야 해요
fs = [lambda x, i=i: x * i for i in range(3)]</pre>
<p class="muted">람다에는 <code>return</code>, 대입문, 여러 줄이 올 수 없어요. 복잡하면 <code>def</code>를 쓰세요.</p>`),
  n('py-class', 'python', '클래스', `
<pre class="out">class PartTimer:
    hour_rate = 9500              # 클래스 속성 (모든 객체가 공유)

    def __init__(self, name):     # 객체를 만들 때 자동 실행
        self.nickname = name      # 인스턴스 속성 (객체마다 따로)
        self.whours = 0

    def work(self, hours):        # 메서드: 첫 번째 매개변수는 항상 self
        self.whours += hours

    def pay(self):
        return self.whours * self.hour_rate

kim = PartTimer("neo")            # 객체(인스턴스) 만들기
kim.work(3); kim.pay()            # 메서드 호출 (self는 자동으로 전달)</pre>
<h3>클래스 속성 vs 인스턴스 속성</h3>
<ul>
<li><code>PartTimer.hour_rate = 10000</code> → 클래스 속성을 바꿔요. 모든 객체에 반영(자기 값을 따로 가진 객체 제외)</li>
<li><code>kim.hour_rate = 7000</code> → kim만의 속성이 새로 생겨 클래스 값을 가려요</li>
<li><code>self.count += 1</code> 은 클래스 값을 읽어 +1 한 뒤 <b>객체 속성</b>으로 저장해요. 모두가 세려면 <code>클래스이름.count += 1</code></li>
<li>리스트 같은 가변 값은 클래스에 두지 말고 <code>__init__</code>에서 <code>self.items = []</code></li>
</ul>
<h3>캡슐화 (이름 숨기기)</h3>
<pre class="out">class Account:
    def __init__(self):
        self.__balance = 0        # 밖에서 acc.__balance 는 AttributeError
    def get(self):
        return self.__balance
# 실제 이름: acc._Account__balance (네임 맹글링)</pre>
<h3>상속·특수 메서드</h3>
<pre class="out">class Dog(Animal):                 # Animal을 상속
    def speak(self):
        return super().speak() + " 멍멍"   # 부모 메서드 호출
    def __str__(self): return "Dog"        # str(obj)
    def __eq__(self, o): ...               # ==
    def __add__(self, o): ...              # +
    def __len__(self): ...                 # len(obj)
isinstance(d, Animal)</pre>`),
  n('py-err-lib', 'python', '예외·파일·표준 라이브러리', `
<h3>예외 처리</h3>
<pre class="out">try:
    x = int(s)
except ValueError as e:      # 특정 오류만
    x = 0
except (KeyError, IndexError):
    ...
else:
    ...                      # 오류 없을 때
finally:
    ...                      # 항상 실행

raise ValueError("메시지")   # 직접 오류 일으키기
class MyError(Exception): pass   # 사용자 정의 예외</pre>
<h3>파일</h3>
<pre class="out">with open("a.txt", "w", encoding="utf-8") as f:
    f.write("안녕\\n")
with open("a.txt", encoding="utf-8") as f:
    for line in f: print(line.strip())
text = open("a.txt").read()</pre>
<h3>자주 쓰는 라이브러리</h3>
<pre class="out">import math; math.sqrt(2), math.pi, math.ceil(2.1)
from collections import Counter, defaultdict, OrderedDict
Counter("aab").most_common(1)       # [('a', 2)]
import itertools; list(itertools.product([1,2],[3,4]))
import re; re.findall(r"\\d+", "a12b3")   # ['12','3']
import random; random.seed(0); random.randint(1, 6)
from dataclasses import dataclass
@dataclass
class P:
    x: int
    y: int = 0</pre>`),
  n('py-iter-deco', 'python', '이터레이터·제너레이터·데코레이터', `
<h3>제너레이터 (yield)</h3>
<pre class="out">def count_up(n):
    i = 1
    while i &lt;= n:
        yield i          # 값을 하나 내주고 멈췄다가 다음에 이어서
        i += 1
list(count_up(3))        # [1, 2, 3]
sum(x * x for x in range(10))   # 제너레이터 식 (괄호 안 for)
it = iter([1, 2]); next(it)     # 이터레이터 직접 다루기</pre>
<h3>클로저</h3>
<pre class="out">def counter():
    c = 0
    def inc():
        nonlocal c        # 바깥 함수의 변수를 바꿀 때
        c += 1
        return c
    return inc</pre>
<h3>데코레이터</h3>
<pre class="out">def twice(f):
    def wrapper(*args, **kwargs):
        f(*args, **kwargs); return f(*args, **kwargs)
    return wrapper

@twice               # greet = twice(greet) 와 같아요
def greet(): print("hi")</pre>`),

  // ================= 데이터사이언스 =================
  n('ds-numpy', 'ds', 'NumPy 기초', `
<pre class="out">import numpy as np
a = np.array([1, 2, 3]); m = np.array([[1, 2], [3, 4]])
a.shape, a.ndim, a.size, m.shape        # (3,) 1 3 (2, 2)
a * 2, a + a, a ** 2, a &gt; 1             # 원소별 연산 (브로드캐스팅)
m @ m, m.T                              # 행렬곱, 전치
np.zeros((2, 3)), np.ones(3), np.arange(5), np.linspace(0, 1, 5)
m.reshape(1, -1)                        # -1: 나머지는 알아서
m.sum(), m.mean(axis=0), m.mean(axis=1) # axis=0 열별, axis=1 행별
m.max(), m.argmax(), np.argmax(m, axis=1)
a[a &gt; 1]                                # 조건 인덱싱
np.round(x, 2).tolist()                 # 소수 반올림 → 파이썬 리스트
np.linalg.norm(a), np.linalg.lstsq(A, y, rcond=None)
rng = np.random.default_rng(0); rng.integers(0, 5, size=3)</pre>
<p class="muted">axis=0은 "행들을 가로질러 모은다 → 열별 결과", axis=1은 "행마다 하나씩"이에요.</p>`),
  n('ds-pandas', 'ds', 'pandas 기초', `
<pre class="out">import pandas as pd
df.head(), df.shape, df.dtypes, df.describe()
df["col"], df[["a", "b"]]                  # 열 선택
df[df["price"] &gt; 100]                      # 행 거르기
df[(df.a &gt; 1) &amp; (df.b == "x")]             # 여러 조건은 &amp; | 와 괄호
df.sort_values("price", ascending=False)
df["new"] = df["a"] * 2                    # 열 추가
df.groupby("city")["amount"].sum().reset_index()
df.groupby("c").agg(total=("a", "sum"), n=("a", "count"))
df.merge(other, on="id", how="left")       # 조인
df["x"].value_counts(), df["x"].nunique()
df.isna().sum(), df.dropna(), df.fillna(0)
df["d"].mean(), .median(), .std()
df.nlargest(5, "price"), df.rename(columns={"a": "b"})
df.apply(lambda r: r.a + r.b, axis=1)
pd.cut(df.age, bins=[0, 20, 60, 100], labels=["Y", "M", "S"])</pre>`),
  n('ds-stats-py', 'ds', '통계 계산 (파이썬)', `
<pre class="out">import numpy as np
x = np.array([2, 4, 4, 4, 5, 5, 7, 9])
x.mean(), np.median(x)
x.std(), x.std(ddof=1)        # 모집단 / 표본(n-1) 표준편차
x.var(ddof=1)
np.percentile(x, [25, 75])    # 사분위수
z = (x - x.mean()) / x.std()  # z-점수(표준화)
np.corrcoef(x, y)[0, 1]       # 상관계수
se = x.std(ddof=1) / np.sqrt(len(x))     # 표준오차</pre>
<ul><li>표본이 작거나 모분산을 모르면 신뢰구간에 <b>t 분포</b>를 써요: 평균 ± t임계값 × 표준오차.</li><li>상관계수 r은 −1~1, r²는 설명되는 변동의 비율이에요.</li></ul>`),
  n('ds-ml', 'ds', '머신러닝 개념과 scikit-learn', `
<h3>기본 흐름</h3>
<pre class="out">from sklearn.model_selection import train_test_split
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)
from sklearn.linear_model import LinearRegression, LogisticRegression
model = LogisticRegression()    # ① 모델 만들기
model.fit(X_tr, y_tr)           # ② 학습
pred = model.predict(X_te)      # ③ 예측
model.score(X_te, y_te)         # 정확도(분류) / R²(회귀)</pre>
<h3>핵심 개념</h3>
<ul>
<li><b>과소적합</b>: 학습 점수도 낮음 / <b>과대적합</b>: 학습은 높고 검증이 낮음 → 규제(릿지 L2, 라쏘 L1), 단순한 모델, 더 많은 데이터</li>
<li><b>교차검증</b>: 데이터를 k개로 나눠 돌아가며 평가 <code>cross_val_score(model, X, y, cv=5)</code></li>
<li><b>그리드 서치</b>: 하이퍼파라미터 조합을 모두 시도 <code>GridSearchCV</code></li>
<li><b>분류 지표</b>: 정확도, 정밀도(P) = TP/(TP+FP), 재현율(R) = TP/(TP+FN), F1 = 2PR/(P+R), ROC-AUC</li>
<li><b>회귀 지표</b>: MSE, MAE, RMSE, R²</li>
<li><b>표준화</b>: (x − 평균) / 표준편차 — 거리·경사하강법 기반 모델 전에 꼭</li>
</ul>
<h3>알고리즘 한눈에</h3>
<ul>
<li><b>KNN</b>: 가까운 k개 이웃의 다수결 · <b>SVM</b>: 마진이 가장 큰 경계 · <b>나이브 베이즈</b>: 사전확률 × 우도</li>
<li><b>결정 트리</b>: 지니 불순도 1−Σp² 또는 엔트로피 −Σp·log₂p가 가장 줄어드는 분할을 반복 · <b>랜덤 포레스트</b>: 부트스트랩 + 무작위 특성 트리들의 투표(배깅) · <b>부스팅</b>: 틀린 샘플에 가중치를 주며 순서대로 보완</li>
<li><b>K-평균</b>: 중심 배정 ↔ 중심 갱신 반복 (inertia, 실루엣 점수로 k 선택) · <b>계층적 군집</b>, <b>DBSCAN</b>(밀도 기반)</li>
<li><b>PCA</b>: 공분산 행렬의 고유벡터 방향(분산이 큰 축)으로 투영해 차원 축소 (설명된 분산 비율)</li>
<li><b>추천</b>: 코사인 유사도 = a·b / (|a||b|), 사용자 기반 협업 필터링은 비슷한 사람의 평점을 유사도로 가중 평균</li>
</ul>
<pre class="out">from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score, accuracy_score
KMeans(n_clusters=3, n_init=10, random_state=0).fit_predict(X)
PCA(n_components=2).fit(X).explained_variance_ratio_</pre>`),
  n('ds-dl', 'ds', '딥러닝 개념 정리', `
<h3>뉴런과 층</h3>
<pre class="out">z = x @ W + b          # 선형 결합 (Dense 층)
a = relu(z)            # 활성화: relu = max(0,z), sigmoid = 1/(1+e^-z), tanh
softmax(z) = e^z / Σ e^z       # 다중 분류 출력 (합이 1)</pre>
<h3>학습</h3>
<ul>
<li>손실: 회귀 MSE, 이진 분류 로그 손실(크로스 엔트로피), 다중 분류 소프트맥스 + 크로스 엔트로피 (로짓에 대한 기울기 = p − 정답 원-핫)</li>
<li>경사하강법: <code>w ← w − lr × 기울기</code>. 모멘텀·Adam은 이전 기울기를 활용해 보폭을 조절</li>
<li>역전파: 연쇄 법칙으로 출력 쪽에서 입력 쪽으로 기울기를 전달. 덧셈은 그대로, 곱셈은 상대 값을 곱해서</li>
<li>미니배치, 에폭, 학습률 감쇠, 드롭아웃, 배치 정규화</li>
</ul>
<h3>대표 네트워크</h3>
<ul>
<li><b>CNN</b>: 합성곱(필터를 밀며 곱해 더함)+풀링. 출력 크기 = (n + 2·pad − k)//stride + 1. 파라미터 = 출력채널 × (입력채널·k·k + 1)</li>
<li><b>RNN</b>: 순서가 있는 데이터. <code>h = tanh(x·Wx + h·Wh + b)</code> 를 시간 순서로 반복</li>
<li><b>어텐션/트랜스포머</b>: <code>softmax(Q·Kᵀ/√d)·V</code>, 위치 인코딩(sin/cos)으로 순서 정보 추가</li>
</ul>`),
  n('ds-dl-frameworks', 'ds', 'TensorFlow·PyTorch 대응표', `
<p class="muted">이 사이트에서는 두 라이브러리를 직접 실행할 수 없어서 같은 개념을 넘파이로 만들어요. 실제로 쓸 때의 코드는 아래처럼 대응돼요.</p>
<table class="t"><thead><tr><th>개념</th><th>이 사이트(NumPy)</th><th>TensorFlow / Keras</th><th>PyTorch</th></tr></thead><tbody>
<tr><td>텐서 만들기</td><td><code>np.array(...)</code></td><td><code>tf.constant(...)</code></td><td><code>torch.tensor(...)</code></td></tr>
<tr><td>모양</td><td><code>a.shape</code></td><td><code>t.shape</code></td><td><code>t.shape</code></td></tr>
<tr><td>모양 바꾸기</td><td><code>a.reshape(3, -1)</code></td><td><code>tf.reshape(t, (3, -1))</code></td><td><code>t.view(3, -1)</code></td></tr>
<tr><td>행렬곱</td><td><code>a @ b</code></td><td><code>tf.matmul(a, b)</code></td><td><code>a @ b</code></td></tr>
<tr><td>평균(축)</td><td><code>a.mean(axis=0)</code></td><td><code>tf.reduce_mean(t, axis=0)</code></td><td><code>t.mean(dim=0)</code></td></tr>
<tr><td>완전연결 층</td><td><code>Dense</code> 클래스</td><td><code>layers.Dense(10, activation="relu")</code></td><td><code>nn.Linear(n_in, n_out)</code></td></tr>
<tr><td>모델 쌓기</td><td><code>Sequential</code> 클래스</td><td><code>keras.Sequential([...])</code></td><td><code>nn.Sequential(...)</code></td></tr>
<tr><td>학습</td><td>직접 만든 루프</td><td><code>model.compile(...)</code>, <code>model.fit(X, y, epochs=5)</code></td><td>for 루프 직접 작성</td></tr>
<tr><td>자동 미분</td><td><code>Value.backward()</code></td><td><code>tf.GradientTape()</code></td><td><code>loss.backward()</code></td></tr>
<tr><td>배치 로더</td><td><code>BatchLoader</code></td><td><code>tf.data.Dataset.batch(32)</code></td><td><code>DataLoader(ds, batch_size=32)</code></td></tr>
</tbody></table>
<h3>PyTorch 학습 루프 모양</h3>
<pre class="out">for epoch in range(epochs):
    for xb, yb in loader:
        optimizer.zero_grad()      # 기울기 비우기
        loss = loss_fn(model(xb), yb)
        loss.backward()            # 역전파
        optimizer.step()           # 파라미터 갱신</pre>
<h3>Keras 모양</h3>
<pre class="out">model = keras.Sequential([layers.Dense(16, activation="relu"), layers.Dense(1)])
model.compile(optimizer="adam", loss="mse")
model.fit(X, y, epochs=10, batch_size=32)</pre>`),

  // ================= R =================
  n('r-basics', 'r', 'R 기초 문법', `
<pre class="out">x &lt;- 10; name &lt;- "Kim"; ok &lt;- TRUE     # 대입은 &lt;-
x %% 3; x %/% 3; 2^10                  # 나머지, 몫, 거듭제곱 (%% 와 %/% 주의)
print(x); cat("x는", x, "\\n")          # cat은 줄바꿈을 직접 넣어야 해요
paste("a", 1, sep = "-"); paste0("a", 1)
if (x &gt; 5) { ... } else if (x == 5) { ... } else { ... }
for (i in 1:3) { ... }                 # 1:0 은 c(1, 0) 이라 조심 → seq_len(n)
while (n &gt; 0) { n &lt;- n - 1 }
next; break                            # continue/break
f &lt;- function(a, b = 2) { a + b }      # 마지막 식이 반환값 (return은 선택)
sapply(1:3, function(i) i^2)           # 반복 적용</pre>
<ul><li>R의 인덱스는 <b>1부터</b> 시작해요.</li><li>숫자 하나도 길이 1 벡터예요.</li><li><code>stop("메시지")</code>로 오류를, <code>tryCatch(식, error = function(e) 값)</code>으로 오류를 잡아요.</li></ul>`),
  n('r-vector', 'r', '벡터·리스트·문자열', `
<pre class="out">v &lt;- c(3, 1, 2); length(v); v[2]; v[-1]; v[v &gt; 1]; v[c(TRUE, FALSE, TRUE)]
1:5; seq(0, 1, by = 0.25); rep(c("a","b"), times = 2); rev(v); sort(v)
sum(v); mean(v); median(v); sd(v); round(x, 2); which(v &gt; 1); which.max(v)
names(v) &lt;- c("a","b","c"); v["a"]
v %in% c(1, 2)               # 포함 여부
ifelse(v &gt; 1, "큼", "작음")   # 벡터 전체에 조건 적용

l &lt;- list(a = 1, b = "x"); l$a; l[["b"]]; names(l)
toupper(s); nchar(s); substr(s, 1, 3); strsplit(s, " ")[[1]]
gsub("a", "b", s); sub("a", "b", s); grepl("a", s); trimws(s)
sprintf("%.2f", 3.14159)

m &lt;- matrix(1:6, nrow = 2); m %*% t(m); apply(m, 1, sum)
Map(function(a, b) a + b, 1:3, 4:6); Filter(function(x) x &gt; 1, v); Reduce(\`+\`, 1:4)</pre>`),
  n('r-df', 'r', '데이터프레임 (base R)', `
<pre class="out">df &lt;- data.frame(name = c("a","b"), score = c(80, 90))
nrow(df); ncol(df); names(df); str(df); summary(df); head(df)
df$score; df[["score"]]; df[df$score &gt; 85, ]; df[order(-df$score), ]
subset(df, score &gt; 85, select = c(name, score))
df$grade &lt;- ifelse(df$score &gt;= 90, "A", "B")           # 열 추가
aggregate(score ~ grade, data = df, FUN = mean)       # 집단별 계산
tapply(df$score, df$grade, mean)
merge(df1, df2, by = "id")                            # 조인
colSums(is.na(df)); na.omit(df); df[, !(names(df) %in% c("x"))]
factor(x, levels = c(1, 2), labels = c("Male", "Female"))   # 범주형(첫 레벨 = 기준)
cut(x, breaks = c(0, 8, 12, 18), labels = c("Y", "M", "S"))
set.seed(1); sample(nrow(df), 3)                      # 재현 가능한 표본</pre>`),
  n('r-dplyr', 'r', 'dplyr·tidyr·stringr·lubridate', `
<pre class="out">library(dplyr)
df %&gt;% filter(score &gt; 80) %&gt;% select(name, score) %&gt;% arrange(desc(score))
df %&gt;% mutate(pass = score &gt;= 60)
df %&gt;% group_by(class) %&gt;% summarise(avg = mean(score), n = n())
df %&gt;% count(class, sort = TRUE)
left_join(a, b, by = "id"); inner_join(a, b, by = "id")
df %&gt;% distinct(city); df %&gt;% slice_max(score, n = 3)
df %&gt;% mutate(rank = row_number(desc(score)), prev = lag(score))

library(tidyr)
pivot_longer(df, cols = c(math, eng), names_to = "subject", values_to = "score")
pivot_wider(long, names_from = subject, values_from = score)
drop_na(df); replace_na(df, list(x = 0)); separate(df, col, into = c("a","b"), sep = "-")

library(stringr)
str_detect(s, "ab"); str_sub(s, 1, 3); str_replace_all(s, "a", "b"); str_count(s, "a")
library(lubridate)
ymd("2024-03-01"); year(d); month(d); wday(d); d2 - d1</pre>`),
  n('r-oop-err', 'r', 'R의 클래스·오류 처리·환경', `
<h3>S3 (가장 흔한 방식)</h3>
<pre class="out">dog &lt;- structure(list(name = "Rex"), class = "dog")
speak &lt;- function(x) UseMethod("speak")      # 일반 함수
speak.dog &lt;- function(x) "멍멍"                # 메서드: 함수이름.클래스
print.dog &lt;- function(x, ...) cat("Dog:", x$name, "\\n")
# 상속: class = c("student", "person") + NextMethod()</pre>
<h3>R5 (setRefClass)</h3>
<pre class="out">Counter &lt;- setRefClass("Counter", fields = list(count = "numeric"),
  methods = list(
    initialize = function(...) { count &lt;&lt;- 0; callSuper(...) },
    add = function(n = 1) { count &lt;&lt;- count + n; invisible(.self) }))
k &lt;- Counter$new(); k$add(); k$count   # 객체는 참조로 전달돼요</pre>
<h3>오류 처리·클로저</h3>
<pre class="out">tryCatch({ stop("x") }, error = function(e) conditionMessage(e), finally = cat("끝\\n"))
tryCatch(as.numeric("a"), warning = function(w) -1)
make_counter &lt;- function() { c &lt;- 0; function() { c &lt;&lt;- c + 1; c } }   # &lt;&lt;- 는 바깥 변수 변경
e &lt;- new.env(); e$x &lt;- 1       # 환경은 참조로 전달</pre>`),
  n('r-stats', 'r', 'R 통계 분석 정리', `
<h3>데이터 준비</h3>
<pre class="out">colnames(df) &lt;- new_names
colSums(is.na(df)); na.omit(df); subset(df, height &gt;= 100 &amp; height &lt;= 220)
df$gender &lt;- factor(df$gender, levels = c(1, 2), labels = c("Male", "Female"))
df$bmi &lt;- df$weight / (df$height / 100)^2
set.seed(2026); df[sample(nrow(df), 500), ]</pre>
<h3>신뢰구간·t-검정</h3>
<pre class="out">se &lt;- sd(x) / sqrt(length(x)); qt(0.975, df = length(x) - 1)   # t 임계값
t.test(x)$conf.int                      # 평균의 95% 신뢰구간
t.test(y ~ g, data = d)                 # 두 집단 비교 (기본 Welch)
t.test(y ~ g, data = d, var.equal = TRUE)   # Student (등분산)
r &lt;- t.test(...); r$p.value; r$statistic; r$parameter; r$conf.int</pre>
<ul><li>p값 &lt; 0.05 → 귀무가설 기각. 신뢰구간에 0이 없으면 같은 결론(쌍대성).</li><li>표본이 아주 크면 작은 차이도 유의해져요 → 효과 크기(Cohen의 d)도 함께 봐요.</li></ul>
<h3>ANOVA·사후검정</h3>
<pre class="out">fit &lt;- aov(y ~ g, data = d); summary(fit)       # F 값, p값
summary(fit)[[1]][["F value"]][1]
TukeyHSD(fit)                                      # 모든 쌍 비교(1종 오류 통제)
pairwise.t.test(d$y, d$g, p.adjust.method = "bonferroni")
# F = (집단 간 변동/(k-1)) / (집단 내 변동/(N-k)),  Bonferroni: 유의수준 / 비교 쌍 수</pre>
<h3>상관·회귀</h3>
<pre class="out">cor(x, y); cor.test(x, y)$p.value; cor(df[, c("a","b","c")])
m &lt;- lm(y ~ x1 + x2 + g, data = d); summary(m)
coef(m); summary(m)$r.squared; summary(m)$adj.r.squared
predict(m, newdata = data.frame(x1 = 1, x2 = 2, g = "Male"))
residuals(m); cooks.distance(m)
anova(m_small, m_big)                              # 편 F-검정(모형 비교)
relevel(factor(g), ref = "Male")                   # 기준집단 바꾸기</pre>
<p class="muted">범주형 변수의 회귀계수는 "기준집단보다 얼마나 다른가"예요. 기준은 팩터의 첫 레벨이에요.</p>`),

  // ================= SQL =================
  n('sql-basics', 'sql', 'SQL 기본 조회', `
<pre class="out">SELECT name, salary * 12 AS annual
FROM employees
WHERE dept_id = 10 AND salary &gt;= 3000
  AND name LIKE 'K%' AND city IN ('Seoul','Busan') AND bonus IS NOT NULL
ORDER BY salary DESC, name
LIMIT 5;

SELECT DISTINCT city FROM employees;
SELECT COUNT(*), SUM(x), AVG(x), MIN(x), MAX(x) FROM t;
SELECT CASE WHEN score &gt;= 90 THEN 'A' ELSE 'B' END AS grade FROM t;
SELECT COALESCE(bonus, 0) FROM t;         -- NULL 대체
SELECT ROUND(AVG(x), 2), x::int, CAST(x AS text) FROM t;</pre>
<p class="muted">NULL은 <code>= NULL</code>이 아니라 <code>IS NULL</code>로 비교해요. 문자열은 작은따옴표를 써요.</p>`),
  n('sql-join-agg', 'sql', '집계와 조인', `
<pre class="out">SELECT city, COUNT(*) AS n, ROUND(AVG(amount), 2) AS avg
FROM orders
WHERE amount &gt; 0              -- 그룹 만들기 전에 행을 거름
GROUP BY city
HAVING COUNT(*) &gt;= 3          -- 그룹을 만든 뒤 거름
ORDER BY n DESC;

SELECT c.name, o.amount
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id      -- 양쪽에 있는 것만
LEFT JOIN  orders o2 ON c.id = o2.customer_id    -- 왼쪽은 모두 (없으면 NULL)
WHERE o2.id IS NULL;                              -- 주문 없는 고객 찾기</pre>
<p class="muted">실행 순서: FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT</p>`),
  n('sql-sub-window', 'sql', '서브쿼리·윈도우 함수', `
<pre class="out">SELECT * FROM employees
WHERE salary &gt; (SELECT AVG(salary) FROM employees);          -- 스칼라 서브쿼리
WHERE dept_id IN (SELECT id FROM departments WHERE loc='X')
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)

WITH t AS (SELECT dept_id, AVG(salary) AS avg FROM employees GROUP BY dept_id)
SELECT * FROM t WHERE avg &gt; 3000;                              -- CTE

SELECT name, dept_id, salary,
  RANK()       OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk,
  ROW_NUMBER() OVER (ORDER BY salary DESC) AS rn,
  SUM(salary)  OVER (PARTITION BY dept_id) AS dept_total,
  LAG(salary)  OVER (ORDER BY hire_date) AS prev_salary,
  AVG(salary)  OVER (ORDER BY hire_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moving_avg
FROM employees;</pre>
<p class="muted">윈도우 함수는 행을 합치지 않고, 각 행 옆에 "그룹 안에서의 계산 결과"를 붙여요.</p>`),
];

// 단원(카테고리) → 참고 노트
const P = ['py-basics'], S = ['py-str'], C = ['py-containers'];
export const CATEGORY_NOTES = {
  // SQL
  '기초 조회': ['sql-basics'], '집계': ['sql-basics', 'sql-join-agg'], '조인': ['sql-join-agg'],
  '서브쿼리·응용': ['sql-sub-window'], '윈도우 함수': ['sql-sub-window'],
  // 파이썬
  '기초 문법': ['py-basics', 'r-basics'], '기초 출력·조건·반복': ['py-basics', 'py-flow', 'r-basics'], '문자열 다루기': S,
  '7강 리스트': ['py-containers'], '9강 튜플·집합': C, '9강 딕셔너리': C,
  '10강 함수': ['py-func'], '10강 람다·변수 범위': ['py-lambda', 'py-func'], '중첩 리스트·컴프리헨션': ['py-comp', 'py-containers'], '예외 처리': ['py-err-lib'],
  '함수 만들기 ① 기본': ['py-func'], '함수 만들기 ② 조건·반복·리스트': ['py-func', 'py-flow'], '함수 만들기 ③ 함수 조합·고급 인수': ['py-func', 'py-lambda'], '함수 오류 고치기': ['py-func'],
  '이터레이터·제너레이터': ['py-iter-deco'], '데코레이터·클로저': ['py-iter-deco', 'py-lambda'], '예외 처리 심화': ['py-err-lib'], '모듈·표준 라이브러리': ['py-err-lib'], '파일 입출력': ['py-err-lib'], 'dataclass·타입 힌트': ['py-err-lib', 'py-class'],
  '프로젝트 ① 텍스트·데이터 처리': ['py-str', 'py-containers', 'py-comp'], '프로젝트 ② 게임·시뮬레이션': ['py-flow', 'py-containers'], '프로젝트 ③ 시스템 만들기': ['py-class', 'py-err-lib'],
  '문자열·리스트': ['py-str', 'py-containers'], '딕셔너리': C, '재귀·자료구조': ['py-func'], '함수·클래스': ['py-func', 'py-class'], '알고리즘': ['py-flow', 'py-comp'],
  '11강 클래스 Part 1': ['py-class'], '11강 단계 ① 클래스 뼈대 익히기': ['py-class'], '11강 단계 ② 속성과 메서드 다루기': ['py-class'], '11강 단계 ③ 클래스·인스턴스 속성 구분': ['py-class'], '11강 단계 ④ 캡슐화와 종합': ['py-class'],
  '클래스 ① 객체와 속성': ['py-class'], '클래스 ② 메서드 만들기': ['py-class'], '클래스 ③ 객체 여러 개·클래스 변수': ['py-class'], '클래스 ④ 상속': ['py-class'], '클래스 ⑤ 특수 메서드·property': ['py-class'], '클래스 ⑥ 작은 프로젝트': ['py-class', 'py-err-lib'],
  '람다 ① 기초 문법': ['py-lambda'], '람다 ② map·filter': ['py-lambda'], '람다 ③ 정렬·min·max의 key': ['py-lambda', 'py-comp'], '람다 ④ 응용': ['py-lambda', 'py-iter-deco'],
  // 데이터사이언스
  '데이터 분석': ['ds-pandas'], '데이터 정제': ['ds-pandas'], '통계': ['ds-stats-py', 'ds-numpy'], '머신러닝': ['ds-ml', 'ds-numpy'], '딥러닝': ['ds-dl', 'ds-numpy'],
  'ML ① 머신러닝 기본기': ['ds-ml', 'ds-numpy'], 'ML ② 기본 지도 학습 알고리즘': ['ds-ml'], 'ML ③ 모델 평가와 튜닝': ['ds-ml'], 'ML ④ 결정 트리와 앙상블': ['ds-ml'], 'ML ⑤ 클러스터링': ['ds-ml', 'ds-numpy'], 'ML ⑥ 차원 축소 (PCA)': ['ds-ml', 'ds-numpy'], 'ML ⑦ 추천 시스템': ['ds-ml', 'ds-numpy'],
  'DL ① 딥러닝 기본기': ['ds-dl', 'ds-numpy'], 'DL ② 대표 딥러닝 네트워크 (CNN·RNN·어텐션)': ['ds-dl', 'ds-numpy'], 'DL ③ TensorFlow 기초 (텐서·층·모델)': ['ds-dl-frameworks', 'ds-numpy', 'py-class'], 'DL ④ PyTorch 기초 (autograd·학습 루프)': ['ds-dl-frameworks', 'py-class', 'ds-dl'],
  // R
  '벡터·문자열': ['r-vector'], '함수·재귀': ['r-basics'], 'base R 데이터': ['r-df'], 'dplyr 기초': ['r-dplyr'], 'dplyr 집계·조인': ['r-dplyr'], 'tidyr·stringr·lubridate': ['r-dplyr'],
  'R 출력·조건·반복': ['r-basics'], '오류 처리·환경': ['r-oop-err'], '함수형 도구': ['r-vector'], 'S3 클래스': ['r-oop-err'], 'R5 클래스': ['r-oop-err'],
  'R 프로젝트 ① 데이터 처리': ['r-vector', 'r-df'], 'R 프로젝트 ② 게임·시뮬레이션': ['r-basics', 'r-vector'], 'R 프로젝트 ③ 시스템 만들기': ['r-oop-err'],
  'R 통계 ① 데이터 준비': ['r-df', 'r-stats'], 'R 통계 ② 기술통계·신뢰구간': ['r-stats'], 'R 통계 ③ 두 집단 비교 (t-검정)': ['r-stats'], 'R 통계 ④ 세 집단 비교 (ANOVA)': ['r-stats'], 'R 통계 ⑤ 상관분석': ['r-stats'], 'R 통계 ⑥ 회귀분석': ['r-stats'],
};

// 같은 이름의 카테고리가 파이썬과 R에 모두 있는 경우(기초 문법 등)를 위해 트랙에 맞는 노트만 고른다
export function notesFor(problem) {
  const ids = CATEGORY_NOTES[problem.category] || [];
  const byTrack = ids.map(id => NOTES.find(x => x.id === id)).filter(Boolean);
  const same = byTrack.filter(x => x.track === problem.track || (problem.track === 'ds' && x.track === 'python'));
  return same.length ? same : byTrack.slice(0, 1);
}
