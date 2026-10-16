// SQL 중급: 서브쿼리 / CASE / 날짜·문자열 함수 / 윈도우 응용 (pandas 로 교차검증)
const S = '-- 여기에 쿼리를 작성하세요\n';
const T = { track: 'sql' };

export default [
  {
    ...T, id: 'sql-014', category: '집계', level: 2, title: '고객이 2명 이상인 도시',
    datasets: ['customers'],
    desc: `<p><code>customers</code>에서 고객이 <b>2명 이상</b>인 도시(<code>city</code>)와 고객 수를 조회하세요.</p>
<p>열: <code>city</code>, <code>customer_count</code> / <code>city</code> 오름차순</p>`,
    starter: S, ordered: true,
    solution: `SELECT city, COUNT(*) AS customer_count\nFROM customers\nGROUP BY city\nHAVING COUNT(*) >= 2\nORDER BY city;`,
    hint: '<p>그룹별 개수에 대한 조건은 <code>HAVING COUNT(*) &gt;= 2</code> 로 써요.</p>',
    cross: { lang: 'py', code: `g = customers.groupby('city').size().reset_index(name='customer_count')\nresult = g[g.customer_count >= 2].sort_values('city')` },
  },
  {
    ...T, id: 'sql-015', category: '집계', level: 3, title: '입사 연도별 직원 수',
    datasets: ['employees'],
    desc: `<p>입사 연도(<code>hire_date</code>의 연도)별 직원 수를 구하세요.</p>
<p>열: <code>hire_year</code>, <code>cnt</code> / 연도 오름차순</p>`,
    starter: S, ordered: true,
    solution: `SELECT EXTRACT(YEAR FROM hire_date)::int AS hire_year, COUNT(*) AS cnt\nFROM employees\nGROUP BY 1\nORDER BY 1;`,
    hint: '<p><code>EXTRACT(YEAR FROM 날짜)</code>로 연도를 뽑아요. 결과는 소수 형태일 수 있어 <code>::int</code> 로 정수로 바꾸면 깔끔해요.</p>',
    cross: { lang: 'py', code: `df = employees.assign(hire_year=employees.hire_date.str[:4].astype(int))\nresult = df.groupby('hire_year').size().reset_index(name='cnt')` },
  },
  {
    ...T, id: 'sql-016', category: '서브쿼리·응용', level: 3, title: '평균보다 급여가 높은 직원',
    datasets: ['employees'],
    desc: `<p>전체 직원의 <b>평균 급여보다 급여가 높은</b> 직원의 이름과 급여를 조회하세요.</p>
<p>열: <code>name</code>, <code>salary</code></p>`,
    starter: S, ordered: false,
    solution: `SELECT name, salary\nFROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees);`,
    hint: '<p><code>WHERE</code> 안에 괄호로 <code>SELECT</code>를 한 번 더 쓰는 것이 서브쿼리예요. 평균을 구하는 쿼리를 비교 값으로 사용해요.</p>',
    cross: { lang: 'py', code: `result = employees[employees.salary > employees.salary.mean()][['name', 'salary']]` },
  },
  {
    ...T, id: 'sql-017', category: '서브쿼리·응용', level: 3, title: '급여 등급 라벨 (CASE)',
    datasets: ['employees'],
    desc: `<p>급여가 <b>5000 이상</b>이면 <code>'high'</code>, <b>4000 이상</b>이면 <code>'mid'</code>, 그 외는 <code>'low'</code>인 급여 등급을 직원마다 붙여 조회하세요.</p>
<p>열: <code>name</code>, <code>salary_level</code></p>`,
    starter: S, ordered: false,
    solution: `SELECT name,\n       CASE\n         WHEN salary >= 5000 THEN 'high'\n         WHEN salary >= 4000 THEN 'mid'\n         ELSE 'low'\n       END AS salary_level\nFROM employees;`,
    hint: '<p><code>CASE WHEN 조건 THEN 값 ... ELSE 값 END</code> 는 위에서부터 차례로 조건을 검사해요.</p>',
    cross: { lang: 'py', code: `def level(s):\n    if s >= 5000:\n        return 'high'\n    if s >= 4000:\n        return 'mid'\n    return 'low'\n\nresult = employees.assign(salary_level=employees.salary.apply(level))[['name', 'salary_level']]` },
  },
  {
    ...T, id: 'sql-018', category: '서브쿼리·응용', level: 3, title: '이름을 성과 이름으로 나누기',
    datasets: ['employees'],
    desc: `<p>직원의 <code>name</code>은 "이름 성" 형태(예: <code>Minjun Kim</code>)예요. 공백을 기준으로 앞부분을 <code>first_name</code>, 뒷부분을 <code>last_name</code>으로 나눠 조회하세요.</p>
<p>열: <code>id</code>, <code>first_name</code>, <code>last_name</code></p>`,
    starter: S, ordered: false,
    solution: `SELECT id,\n       SPLIT_PART(name, ' ', 1) AS first_name,\n       SPLIT_PART(name, ' ', 2) AS last_name\nFROM employees;`,
    hint: "<p>PostgreSQL의 <code>SPLIT_PART(문자열, 구분자, 번째)</code>를 써요. 번째는 1부터 시작해요.</p>",
    cross: { lang: 'py', code: `import pandas as pd\n\nparts = employees.name.str.split(' ', expand=True)\nresult = pd.DataFrame({'id': employees.id, 'first_name': parts[0], 'last_name': parts[1]})` },
  },
  {
    ...T, id: 'sql-019', category: '서브쿼리·응용', level: 3, title: '주문이 4번 이상인 고객',
    datasets: ['customers', 'orders'],
    desc: `<p>주문 건수가 <b>4건 이상</b>인 고객의 이름과 주문 건수를 조회하세요.</p>
<p>열: <code>name</code>, <code>order_count</code> / 이름 오름차순</p>`,
    starter: S, ordered: true,
    solution: `SELECT c.name, COUNT(*) AS order_count\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.customer_id, c.name\nHAVING COUNT(*) >= 4\nORDER BY c.name;`,
    hint: '<p>조인한 뒤 고객별로 묶고(<code>GROUP BY</code>) 개수에 조건(<code>HAVING</code>)을 걸어요.</p>',
    cross: { lang: 'py', datasets: ['customers', 'orders'], code: `m = orders.merge(customers, on='customer_id')\ng = m.groupby('name').size().reset_index(name='order_count')\nresult = g[g.order_count >= 4].sort_values('name')` },
  },
  {
    ...T, id: 'sql-020', category: '서브쿼리·응용', level: 4, title: '각 부서의 평균보다 높은 급여',
    datasets: ['employees'],
    desc: `<p>자기가 속한 <b>부서의 평균 급여보다 급여가 높은</b> 직원을 조회하세요. (부서가 NULL인 직원은 제외)</p>
<p>열: <code>name</code>, <code>department_id</code>, <code>salary</code> / <code>department_id</code>, <code>salary</code> 내림차순</p>`,
    starter: S, ordered: true,
    solution: `SELECT name, department_id, salary\nFROM (\n  SELECT name, department_id, salary,\n         AVG(salary) OVER (PARTITION BY department_id) AS dept_avg\n  FROM employees\n  WHERE department_id IS NOT NULL\n) t\nWHERE salary > dept_avg\nORDER BY department_id, salary DESC;`,
    hint: '<p><code>AVG(salary) OVER (PARTITION BY department_id)</code> 로 각 행 옆에 부서 평균을 붙인 뒤, 바깥 쿼리에서 비교해요.</p>',
    cross: { lang: 'py', code: `e = employees.dropna(subset=['department_id']).copy()\ne['dept_avg'] = e.groupby('department_id')['salary'].transform('mean')\nresult = e[e.salary > e.dept_avg].sort_values(['department_id', 'salary'], ascending=[True, False])[['name', 'department_id', 'salary']]` },
  },
  {
    ...T, id: 'sql-021', category: '윈도우 함수', level: 4, title: '고객별 첫 주문 제품',
    datasets: ['orders'],
    desc: `<p>고객마다 <b>가장 먼저 주문한 제품</b>을 조회하세요. (고객별 주문일은 겹치지 않아요)</p>
<p>열: <code>customer_id</code>, <code>product</code> / <code>customer_id</code> 오름차순</p>`,
    starter: S, ordered: true,
    solution: `SELECT customer_id, product\nFROM (\n  SELECT customer_id, product,\n         ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) AS rn\n  FROM orders\n) t\nWHERE rn = 1\nORDER BY customer_id;`,
    hint: '<p><code>ROW_NUMBER() OVER (PARTITION BY 고객 ORDER BY 날짜)</code> 로 고객별 순번을 매기고, 순번이 1인 행만 남겨요.</p>',
    cross: { lang: 'py', code: `df = orders.sort_values('order_date').groupby('customer_id').head(1)\nresult = df.sort_values('customer_id')[['customer_id', 'product']]` },
  },
  {
    ...T, id: 'sql-022', category: '윈도우 함수', level: 4, title: '월별 매출 전월 대비 증감률',
    datasets: ['orders'],
    desc: `<p>월별 매출(<code>quantity × unit_price</code>의 합)과 <b>전월 대비 증감률(%)</b>을 구하세요. 증감률 = (이번 달 − 전월) ÷ 전월 × 100, 소수 첫째 자리까지 반올림합니다. 첫 달은 전월이 없으니 NULL이에요.</p>
<p>열: <code>month</code>, <code>revenue</code>, <code>growth_pct</code> / 월 오름차순</p>`,
    starter: S, ordered: true,
    solution: `WITH monthly AS (\n  SELECT TO_CHAR(order_date, 'YYYY-MM') AS month, SUM(quantity * unit_price) AS revenue\n  FROM orders\n  GROUP BY 1\n)\nSELECT month, revenue,\n       ROUND((revenue - LAG(revenue) OVER (ORDER BY month)) / LAG(revenue) OVER (ORDER BY month) * 100, 1) AS growth_pct\nFROM monthly\nORDER BY month;`,
    hint: '<p><code>LAG(revenue) OVER (ORDER BY month)</code> 는 바로 이전 행의 값을 가져와요. 월별 합계는 <code>WITH</code>로 먼저 만들어 두세요.</p>',
    cross: { lang: 'py', code: `o = orders.assign(month=orders.order_date.str[:7], revenue=orders.quantity * orders.unit_price)\ng = o.groupby('month')['revenue'].sum().reset_index()\ng['growth_pct'] = (g['revenue'].pct_change() * 100).round(1)\nresult = g` },
  },
];
