// 데이터사이언스 확장 문제: 실무형 pandas(결측·구간·피벗·날짜·이동평균) / 전처리·평가·군집 / 신경망 기초
const T = { track: 'ds' };
const t = (call, expected, visible = false) => ({ call, expected, visible });
const P = '# 데이터프레임이 이미 준비되어 있어요. 정답을 result 변수에 담아 주세요.\n';

export default [
  // ---------------- 데이터 분석 (실무형 pandas) ----------------
  {
    ...T, id: 'ds-009', category: '데이터 분석', level: 2, title: '성별 생존율',
    datasets: ['titanic'],
    desc: `<p>타이타닉 승객 데이터 <code>titanic</code>에서 <b>성별(<code>sex</code>)</b> 생존율을 구하세요. 생존 여부 <code>survived</code>는 1(생존)/0(사망)이라 평균이 곧 생존율이에요. 소수 둘째 자리까지 반올림해 <code>sex</code>, <code>survival_rate</code> 열로 <code>result</code>에 담으세요. <code>sex</code> 알파벳 순서입니다.</p>`,
    starter: P + `result = None\n`, ordered: true,
    solution: `result = titanic.groupby('sex')['survived'].mean().round(2).reset_index(name='survival_rate')`,
    hint: '<p>0/1 값의 평균은 1의 비율이에요. <code>groupby("sex")["survived"].mean()</code></p>',
    cross: { lang: 'sql', code: `SELECT sex, ROUND(AVG(survived), 2) AS survival_rate FROM titanic GROUP BY sex ORDER BY sex;` },
  },
  {
    ...T, id: 'ds-010', category: '데이터 분석', level: 2, title: '객실 등급별 평균 요금',
    datasets: ['titanic'],
    desc: `<p>객실 등급(<code>pclass</code>)별 평균 요금(<code>fare</code>)을 소수 둘째 자리까지 반올림해 <code>pclass</code>, <code>avg_fare</code> 열로 <code>result</code>에 담으세요. 등급 오름차순입니다.</p>`,
    starter: P + `result = None\n`, ordered: true,
    solution: `result = titanic.groupby('pclass')['fare'].mean().round(2).reset_index(name='avg_fare')`,
    hint: '<p><code>groupby("pclass")["fare"].mean()</code> 뒤에 <code>.round(2)</code>와 <code>.reset_index(name=...)</code></p>',
    cross: { lang: 'sql', code: `SELECT pclass, ROUND(AVG(fare), 2) AS avg_fare FROM titanic GROUP BY pclass ORDER BY pclass;` },
  },
  {
    ...T, id: 'ds-011', category: '데이터 분석', level: 2, title: '요금 등급 라벨 붙이기',
    datasets: ['titanic'],
    desc: `<p>요금(<code>fare</code>)이 <b>30 이상</b>이면 <code>'high'</code>, 아니면 <code>'low'</code>인 새 열 <code>fare_level</code>을 만들고, <code>passenger_id</code>와 <code>fare_level</code>을 <code>passenger_id</code> 순서대로 <code>result</code>에 담으세요.</p>`,
    starter: P + `result = None\n`, ordered: true,
    solution: `import numpy as np\n\ndf = titanic.copy()\ndf['fare_level'] = np.where(df['fare'] >= 30, 'high', 'low')\nresult = df[['passenger_id', 'fare_level']]`,
    hint: '<p><code>np.where(조건, 참일 때 값, 거짓일 때 값)</code> 은 조건에 따라 값을 고르는 가장 흔한 방법이에요.</p>',
    cross: { lang: 'sql', code: `SELECT passenger_id, CASE WHEN fare >= 30 THEN 'high' ELSE 'low' END AS fare_level FROM titanic ORDER BY passenger_id;` },
  },
  {
    ...T, id: 'ds-012', category: '데이터 분석', level: 3, title: '결측치 제거 후 연령대별 인원',
    datasets: ['titanic'],
    desc: `<p><code>age</code>에는 비어 있는 값(결측치)이 있어요. 결측치가 있는 행을 <b>제거</b>한 뒤, 10살 단위 연령대(<code>age_group</code>: 0, 10, 20, …)별 승객 수 <code>cnt</code>를 구해 <code>result</code>에 담으세요. 연령대 오름차순입니다.</p>
<p>예: 27세 → 20, 4세 → 0</p>`,
    starter: P + `result = None\n`, ordered: true,
    solution: `df = titanic.dropna(subset=['age']).copy()\ndf['age_group'] = (df['age'] // 10 * 10).astype(int)\nresult = df.groupby('age_group').size().reset_index(name='cnt')`,
    hint: '<p><code>dropna(subset=["age"])</code>로 결측 행을 지우고, <code>//</code>(몫) 연산으로 10 단위를 만들어요: <code>age // 10 * 10</code></p>',
    cross: { lang: 'sql', code: `SELECT (age / 10) * 10 AS age_group, COUNT(*) AS cnt FROM titanic WHERE age IS NOT NULL GROUP BY 1 ORDER BY 1;` },
  },
  {
    ...T, id: 'ds-013', category: '데이터 분석', level: 3, title: '피벗 테이블: 성별 × 등급별 생존자 수',
    datasets: ['titanic'],
    desc: `<p>행은 <code>sex</code>, 열은 <code>pclass</code>(1, 2, 3등급), 값은 <b>생존자 수</b>(<code>survived</code>의 합)인 피벗 테이블을 만들어 <code>result</code>에 담으세요. 해당하는 승객이 없는 칸은 0으로 채우세요. (<code>sex</code> 알파벳 순서)</p>`,
    starter: P + `result = None\n`, ordered: true,
    solution: `result = titanic.pivot_table(index='sex', columns='pclass', values='survived', aggfunc='sum', fill_value=0)`,
    hint: '<p><code>pivot_table(index=행 기준, columns=열 기준, values=값, aggfunc="sum", fill_value=0)</code></p>',
    cross: { lang: 'sql', code: `SELECT sex,\n  SUM(CASE WHEN pclass = 1 THEN survived ELSE 0 END) AS c1,\n  SUM(CASE WHEN pclass = 2 THEN survived ELSE 0 END) AS c2,\n  SUM(CASE WHEN pclass = 3 THEN survived ELSE 0 END) AS c3\nFROM titanic GROUP BY sex ORDER BY sex;` },
  },
  {
    ...T, id: 'ds-014', category: '데이터 분석', level: 3, title: '날짜에서 월 뽑아 도시별 평균 기온',
    datasets: ['weather'],
    desc: `<p><code>weather</code>의 <code>obs_date</code>는 문자열이에요. 날짜로 바꿔 <b>월</b>을 뽑은 뒤, 도시(<code>city</code>)·월(<code>month</code>)별 평균 기온을 소수 둘째 자리까지 반올림해 <code>city</code>, <code>month</code>, <code>avg_temp</code> 열로 <code>result</code>에 담으세요. <code>city</code>, <code>month</code> 오름차순입니다.</p>`,
    starter: P + `import pandas as pd\n\nresult = None\n`, ordered: true,
    solution: `import pandas as pd\n\ndf = weather.copy()\ndf['month'] = pd.to_datetime(df['obs_date']).dt.month\nresult = df.groupby(['city', 'month'])['temp_c'].mean().round(2).reset_index(name='avg_temp')`,
    hint: '<p><code>pd.to_datetime(열)</code>로 날짜형으로 바꾸면 <code>.dt.month</code>, <code>.dt.year</code> 등을 쓸 수 있어요. 그룹 기준은 리스트로: <code>groupby(["city", "month"])</code></p>',
    cross: { lang: 'sql', code: `SELECT city, EXTRACT(MONTH FROM obs_date)::int AS month, ROUND(AVG(temp_c), 2) AS avg_temp FROM weather GROUP BY 1, 2 ORDER BY 1, 2;` },
  },
  {
    ...T, id: 'ds-015', category: '데이터 분석', level: 4, title: '3일 이동평균',
    datasets: ['weather'],
    desc: `<p><b>서울(Seoul)</b> 데이터만 날짜 순서로 놓고, 각 행의 <b>최근 3개 행</b>(자기 자신 포함) 기온의 평균 <code>ma3</code>을 소수 둘째 자리까지 반올림해 <code>obs_date</code>, <code>ma3</code> 열로 <code>result</code>에 담으세요. 처음 두 행은 있는 값만으로 평균을 냅니다.</p>`,
    starter: P + `result = None\n`, ordered: true,
    solution: `df = weather[weather['city'] == 'Seoul'].sort_values('obs_date').copy()\ndf['ma3'] = df['temp_c'].rolling(3, min_periods=1).mean().round(2)\nresult = df[['obs_date', 'ma3']]`,
    hint: '<p><code>열.rolling(3, min_periods=1).mean()</code> 이 이동평균이에요. <code>min_periods=1</code>은 값이 3개 미만이어도 계산하라는 뜻이에요. 먼저 날짜순으로 정렬하는 것 잊지 마세요.</p>',
    cross: { lang: 'sql', code: `SELECT obs_date, ROUND(AVG(temp_c) OVER (ORDER BY obs_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS ma3 FROM weather WHERE city = 'Seoul' ORDER BY obs_date;` },
  },
  {
    ...T, id: 'ds-016', category: '데이터 분석', level: 4, title: '전일 대비 기온 변화',
    datasets: ['weather'],
    desc: `<p><b>서울</b> 데이터를 날짜순으로 놓고, 바로 이전 행과의 기온 차이 <code>change</code>(= 오늘 − 이전 행)를 구해 <code>obs_date</code>, <code>temp_c</code>, <code>change</code> 열로 <code>result</code>에 담으세요. 첫 행은 비교 대상이 없으니 결측값(NaN)으로 둡니다.</p>`,
    starter: P + `result = None\n`, ordered: true,
    solution: `df = weather[weather['city'] == 'Seoul'].sort_values('obs_date').copy()\ndf['change'] = df['temp_c'].diff()\nresult = df[['obs_date', 'temp_c', 'change']]`,
    hint: '<p><code>열.diff()</code>는 이전 행과의 차이를 구해 줘요. 첫 행은 자동으로 NaN이에요.</p>',
    cross: { lang: 'sql', code: `SELECT obs_date, temp_c, temp_c - LAG(temp_c) OVER (ORDER BY obs_date) AS change FROM weather WHERE city = 'Seoul' ORDER BY obs_date;` },
  },
  {
    ...T, id: 'ds-017', category: '데이터 분석', level: 4, title: '도시별 가장 더운 이틀',
    datasets: ['weather'],
    desc: `<p>도시마다 <b>기온이 가장 높은 이틀</b>을 골라 <code>city</code>, <code>obs_date</code>, <code>temp_c</code> 열로 <code>result</code>에 담으세요. 정렬은 <code>city</code> 오름차순, 같은 도시 안에서는 기온 내림차순입니다. (한 도시 안에 같은 기온은 없어요)</p>`,
    starter: P + `result = None\n`, ordered: true,
    solution: `df = weather.sort_values(['city', 'temp_c'], ascending=[True, False])\nresult = df.groupby('city').head(2)[['city', 'obs_date', 'temp_c']]`,
    hint: '<p>먼저 도시 오름차순, 기온 내림차순으로 정렬한 뒤 <code>groupby("city").head(2)</code>를 하면 그룹별 앞 2행만 남아요.</p>',
    cross: { lang: 'sql', code: `SELECT city, obs_date, temp_c FROM (SELECT city, obs_date, temp_c, ROW_NUMBER() OVER (PARTITION BY city ORDER BY temp_c DESC) AS rn FROM weather) x WHERE rn <= 2 ORDER BY city, temp_c DESC;` },
  },

  // ---------------- 머신러닝 (전처리·평가·군집) ----------------
  {
    ...T, id: 'ds-206', category: '머신러닝', level: 2, title: '최소-최대 정규화',
    desc: `<p>값을 0~1 범위로 맞추는 <b>Min-Max 정규화</b>는 (x − 최솟값) ÷ (최댓값 − 최솟값) 이에요. 숫자 리스트를 정규화해서 각 값을 소수 둘째 자리까지 반올림한 리스트를 돌려주는 <code>min_max_scale(nums)</code>를 만드세요. 최댓값과 최솟값은 서로 달라요.</p>`,
    starter: `def min_max_scale(nums):\n    pass\n`,
    solution: `def min_max_scale(nums):\n    lo, hi = min(nums), max(nums)\n    return [round((x - lo) / (hi - lo), 2) for x in nums]\n`,
    hint: '<p><code>min()</code>, <code>max()</code>으로 범위를 구한 뒤 리스트 컴프리헨션으로 모든 값을 변환해요.</p>',
    tests: [t('min_max_scale([1, 2, 3])', [0.0, 0.5, 1.0], true), t('min_max_scale([10, 20, 40])', [0.0, 0.33, 1.0], true), t('min_max_scale([5, 15])', [0.0, 1.0]), t('min_max_scale([-1, 0, 1])', [0.0, 0.5, 1.0])],
  },
  {
    ...T, id: 'ds-207', category: '머신러닝', level: 3, title: '정밀도와 재현율',
    desc: `<p>분류 모델 평가에서 <b>1</b>을 "양성"이라 할 때:</p>
<ul><li>정밀도(precision) = 맞은 양성 예측 ÷ 양성이라고 예측한 전체 개수</li><li>재현율(recall) = 맞은 양성 예측 ÷ 실제 양성 전체 개수</li></ul>
<p><code>precision_recall(y_true, y_pred)</code>는 <b><code>[정밀도, 재현율]</code></b> 리스트를 소수 둘째 자리까지 반올림해 돌려줍니다. 분모가 0이면 그 값은 0.0으로 해요.</p>`,
    starter: `def precision_recall(y_true, y_pred):\n    pass\n`,
    solution: `def precision_recall(y_true, y_pred):\n    tp = fp = fn = 0\n    for a, p in zip(y_true, y_pred):\n        if p == 1 and a == 1:\n            tp += 1\n        elif p == 1 and a == 0:\n            fp += 1\n        elif p == 0 and a == 1:\n            fn += 1\n    precision = tp / (tp + fp) if tp + fp else 0.0\n    recall = tp / (tp + fn) if tp + fn else 0.0\n    return [round(precision, 2), round(recall, 2)]\n`,
    hint: '<p>TP(참 양성), FP(거짓 양성), FN(거짓 음성) 세 개수를 먼저 센 뒤 공식에 넣으세요.</p>',
    tests: [t('precision_recall([1, 1, 0, 0, 1], [1, 0, 0, 1, 1])', [0.67, 0.67], true), t('precision_recall([1, 0, 1, 0], [1, 1, 1, 1])', [0.5, 1.0], true), t('precision_recall([1, 1, 1], [0, 0, 0])', [0.0, 0.0]), t('precision_recall([0, 0, 1, 1], [0, 0, 1, 1])', [1.0, 1.0]), t('precision_recall([1, 1, 0, 0, 1, 1], [1, 0, 0, 0, 0, 1])', [1.0, 0.5])],
  },
  {
    ...T, id: 'ds-208', category: '머신러닝', level: 3, title: '선형회귀로 새 값 예측하기',
    packages: ['scikit-learn'],
    desc: `<p>점들이 한 직선 위에 있을 때, 선형회귀 모델을 학습해 새 값 <code>x_new</code>의 예측값을 소수 둘째 자리까지 반올림해 돌려주는 <code>predict_with_line(xs, ys, x_new)</code>를 만드세요. (<code>LinearRegression</code> 사용)</p>`,
    starter: `from sklearn.linear_model import LinearRegression\n\n\ndef predict_with_line(xs, ys, x_new):\n    pass\n`,
    solution: `from sklearn.linear_model import LinearRegression\n\n\ndef predict_with_line(xs, ys, x_new):\n    model = LinearRegression()\n    model.fit([[x] for x in xs], ys)\n    return round(float(model.predict([[x_new]])[0]), 2)\n`,
    hint: '<p><code>model.fit(X, y)</code> 후 <code>model.predict([[새 값]])</code> 은 배열을 돌려줘요. 첫 값을 꺼내 float으로 바꾸세요.</p>',
    tests: [t('predict_with_line([1, 2, 3], [2, 4, 6], 4)', 8.0, true), t('predict_with_line([1, 2, 3, 4], [3, 5, 7, 9], 10)', 21.0, true), t('predict_with_line([0, 1, 2], [5, 5, 5], 100)', 5.0), t('predict_with_line([1, 2, 3], [10, 8, 6], 5)', 2.0)],
  },
  {
    ...T, id: 'ds-209', category: '머신러닝', level: 4, title: 'K-평균 군집화',
    packages: ['scikit-learn'],
    desc: `<p>점들을 2개의 군집으로 나누는 <b>K-평균(K-Means)</b>을 써 보세요. <code>kmeans_sizes(points)</code>는 <code>KMeans(n_clusters=2, n_init=10, random_state=0)</code>로 군집화한 뒤, <b>각 군집의 크기를 오름차순으로 정렬한 리스트</b>를 돌려줍니다. 점들은 두 덩어리로 뚜렷하게 나뉘어 있어요.</p>`,
    starter: `from sklearn.cluster import KMeans\n\n\ndef kmeans_sizes(points):\n    pass\n`,
    solution: `from sklearn.cluster import KMeans\n\n\ndef kmeans_sizes(points):\n    model = KMeans(n_clusters=2, n_init=10, random_state=0)\n    labels = model.fit_predict(points)\n    sizes = [int((labels == k).sum()) for k in range(2)]\n    return sorted(sizes)\n`,
    hint: '<p><code>labels = model.fit_predict(points)</code> 는 각 점의 군집 번호(0 또는 1) 배열이에요. 번호별로 몇 개인지 세어 정렬하세요.</p>',
    tests: [t('kmeans_sizes([[1, 1], [1.5, 2], [1, 0.5], [8, 8], [9, 9], [8.5, 9.5]])', [3, 3], true), t('kmeans_sizes([[0, 0], [0, 1], [1, 0], [1, 1], [10, 10], [10, 11], [11, 10]])', [3, 4], true), t('kmeans_sizes([[0], [1], [2], [50], [51]])', [2, 3]), t('kmeans_sizes([[0, 0], [1, 1], [20, 20], [21, 21], [22, 22], [23, 23]])', [2, 4])],
  },

  // ---------------- 딥러닝 (신경망 기초) ----------------
  {
    ...T, id: 'ds-307', category: '딥러닝', level: 2, title: '원-핫 인코딩',
    desc: `<p>분류 문제의 정답(클래스 번호)은 보통 <b>원-핫 벡터</b>로 바꿔요. 클래스 번호 리스트 <code>labels</code>와 클래스 개수 <code>n</code>이 주어지면, 각 번호를 "해당 위치만 1, 나머지는 0"인 길이 n 리스트로 바꾼 <b>리스트의 리스트</b>를 돌려주는 <code>one_hot(labels, n)</code>을 만드세요.</p>
<p>예: <code>one_hot([0, 2], 3)</code> → <code>[[1, 0, 0], [0, 0, 1]]</code></p>`,
    starter: `def one_hot(labels, n):\n    pass\n`,
    solution: `def one_hot(labels, n):\n    result = []\n    for label in labels:\n        row = [0] * n\n        row[label] = 1\n        result.append(row)\n    return result\n`,
    hint: '<p><code>[0] * n</code>은 0이 n개인 리스트예요. 그 리스트의 <code>label</code> 위치만 1로 바꾸세요.</p>',
    tests: [t('one_hot([0, 2, 1], 3)', [[1, 0, 0], [0, 0, 1], [0, 1, 0]], true), t('one_hot([1], 2)', [[0, 1]], true), t('one_hot([], 4)', []), t('one_hot([3, 3], 4)', [[0, 0, 0, 1], [0, 0, 0, 1]])],
  },
  {
    ...T, id: 'ds-308', category: '딥러닝', level: 3, title: '크로스 엔트로피 손실',
    packages: ['numpy'],
    desc: `<p>분류 모델이 예측한 확률 리스트 <code>probs</code>(합이 1)와 정답 클래스 번호 <code>true_index</code>가 있을 때, <b>크로스 엔트로피 손실</b>은 −ln(정답 클래스의 확률) 이에요. 소수 넷째 자리까지 반올림해 돌려주는 <code>cross_entropy(probs, true_index)</code>를 만드세요.</p>
<p>정답에 높은 확률을 줄수록 손실이 작아져요.</p>`,
    starter: `import numpy as np\n\n\ndef cross_entropy(probs, true_index):\n    pass\n`,
    solution: `import numpy as np\n\n\ndef cross_entropy(probs, true_index):\n    return round(float(-np.log(probs[true_index])), 4)\n`,
    hint: '<p><code>np.log()</code>는 자연로그예요. 정답 위치의 확률만 꺼내 −log를 취하세요.</p>',
    tests: [t('cross_entropy([0.7, 0.2, 0.1], 0)', 0.3567, true), t('cross_entropy([0.7, 0.2, 0.1], 1)', 1.6094, true), t('cross_entropy([0.5, 0.5], 0)', 0.6931), t('cross_entropy([0.99, 0.01], 0)', 0.0101)],
  },
  {
    ...T, id: 'ds-309', category: '딥러닝', level: 4, title: '2층 신경망 순전파',
    packages: ['numpy'],
    desc: `<p>입력 <code>x</code> → <b>은닉층</b>(ReLU) → <b>출력층</b>(활성화 없음)으로 이어지는 2층 신경망의 순전파를 구현하세요.</p>
<ul><li>은닉층: <code>h = ReLU(x @ W1 + b1)</code></li><li>출력층: <code>out = h @ W2 + b2</code></li></ul>
<p><code>mlp_forward(x, W1, b1, W2, b2)</code>는 <code>out</code>을 소수 넷째 자리까지 반올림한 <b>리스트</b>로 돌려줘요. <code>x</code>는 길이 n 리스트, <code>W1</code>은 n×m, <code>W2</code>는 m×k 크기의 리스트의 리스트입니다.</p>`,
    starter: `import numpy as np\n\n\ndef mlp_forward(x, W1, b1, W2, b2):\n    pass\n`,
    solution: `import numpy as np\n\n\ndef mlp_forward(x, W1, b1, W2, b2):\n    h = np.maximum(0, np.array(x, dtype=float) @ np.array(W1, dtype=float) + np.array(b1, dtype=float))\n    out = h @ np.array(W2, dtype=float) + np.array(b2, dtype=float)\n    return [round(float(v), 4) for v in out]\n`,
    hint: '<p>파이썬에서 행렬 곱은 <code>@</code> 연산자(또는 <code>np.dot</code>)예요. 리스트는 먼저 <code>np.array</code>로 바꿔요.</p>',
    tests: [
      t('mlp_forward([1, 2], [[1, 0], [0, 1]], [0, 0], [[1], [1]], [0])', [3.0], true),
      t('mlp_forward([1, -1], [[1, 2], [3, 4]], [1, 0.5], [[1], [1]], [0.5])', [0.5], true),
      t('mlp_forward([2, 1], [[1, -1], [0.5, 2]], [0, 0], [[2], [3]], [1])', [6.0]),
      t('mlp_forward([1, 1], [[2, 0], [0, 2]], [-1, -3], [[1, 1], [1, 1]], [0, 0.5])', [1.0, 1.5])],
  },
];
