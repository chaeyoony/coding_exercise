// SQL 문제 원본. expected(정답 표)는 build 때 정답 쿼리를 실제로 실행해서 만들고,
// cross(pandas)로 한 번 더 따로 계산해서 둘이 같은지 확인한다.
const S = '-- 여기에 쿼리를 작성하세요\n';
const T = { track: 'sql' };

export default [
  {
    ...T, id: 'sql-001', category: '기초 조회', level: 1, title: '직원 이름과 급여 조회',
    datasets: ['employees'],
    desc: `<p><code>employees</code> 테이블에서 모든 직원의 <b>이름(name)</b>과 <b>급여(salary)</b>를 조회하세요.</p>
<p>열 순서는 <code>name</code>, <code>salary</code> 입니다.</p>`,
    starter: S, ordered: false,
    solution: `SELECT name, salary\nFROM employees;`,
    hint: '<p><code>SELECT 열1, 열2 FROM 테이블;</code> 형태예요.</p>',
    cross: { lang: 'py', code: `result = employees[['name','salary']]` },
  },
  {
    ...T, id: 'sql-002', category: '기초 조회', level: 1, title: '높은 급여 순서대로',
    datasets: ['employees'],
    desc: `<p>급여가 <b>4000 이상</b>인 직원의 이름과 급여를 <b>급여가 높은 순서</b>로 조회하세요.</p>
<p>열: <code>name</code>, <code>salary</code></p>`,
    starter: S, ordered: true,
    solution: `SELECT name, salary\nFROM employees\nWHERE salary >= 4000\nORDER BY salary DESC;`,
    hint: '<p><code>WHERE</code>로 조건을 걸고 <code>ORDER BY 열 DESC</code>로 내림차순 정렬해요.</p>',
    cross: { lang: 'py', code: `result = employees[employees.salary >= 4000][['name','salary']].sort_values('salary', ascending=False)` },
  },
  {
    ...T, id: 'sql-003', category: '기초 조회', level: 1, title: '서울에 있는 부서',
    datasets: ['departments'],
    desc: `<p><code>departments</code> 테이블에서 위치(location)가 <code>'Seoul'</code>인 부서의 <b>이름(name)</b>을 조회하세요.</p>`,
    starter: S, ordered: false,
    solution: `SELECT name\nFROM departments\nWHERE location = 'Seoul';`,
    hint: "<p>문자열은 작은따옴표로 감싸요: <code>location = 'Seoul'</code></p>",
    cross: { lang: 'py', code: `result = departments[departments.location == 'Seoul'][['name']]` },
  },
  {
    ...T, id: 'sql-004', category: '기초 조회', level: 2, title: '2021년 이후 입사자',
    datasets: ['employees'],
    desc: `<p>입사일(<code>hire_date</code>)이 <b>2021-01-01 이후</b>인 직원의 이름과 입사일을 <b>입사일이 빠른 순서</b>로 조회하세요.</p>
<p>열: <code>name</code>, <code>hire_date</code></p>`,
    starter: S, ordered: true,
    solution: `SELECT name, hire_date\nFROM employees\nWHERE hire_date >= '2021-01-01'\nORDER BY hire_date;`,
    hint: "<p>날짜도 <code>'2021-01-01'</code>처럼 문자열 모양으로 비교할 수 있어요.</p>",
    cross: { lang: 'py', code: `result = employees[employees.hire_date >= '2021-01-01'][['name','hire_date']].sort_values('hire_date')` },
  },
  {
    ...T, id: 'sql-005', category: '집계', level: 2, title: '부서별 직원 수',
    datasets: ['employees'],
    desc: `<p>부서(<code>department_id</code>)별 직원 수를 구하세요. 부서가 없는 직원(<code>department_id</code>가 NULL)은 <b>제외</b>합니다.</p>
<p>열: <code>department_id</code>, <code>cnt</code> / <code>department_id</code> 오름차순</p>`,
    starter: S, ordered: true,
    solution: `SELECT department_id, COUNT(*) AS cnt\nFROM employees\nWHERE department_id IS NOT NULL\nGROUP BY department_id\nORDER BY department_id;`,
    hint: '<p><code>GROUP BY</code>로 묶고 <code>COUNT(*)</code>로 개수를 세요. NULL 확인은 <code>IS NOT NULL</code>.</p>',
    cross: { lang: 'py', code: `result = employees.dropna(subset=['department_id']).groupby('department_id').size().reset_index(name='cnt')` },
  },
  {
    ...T, id: 'sql-006', category: '집계', level: 2, title: '평균 급여가 높은 부서',
    datasets: ['employees'],
    desc: `<p>부서별 <b>평균 급여</b>를 소수 둘째 자리까지 반올림해 구하고, 평균이 <b>3600 이상</b>인 부서만 조회하세요. (부서가 NULL인 직원은 제외)</p>
<p>열: <code>department_id</code>, <code>avg_salary</code> / <code>department_id</code> 오름차순</p>`,
    starter: S, ordered: true,
    solution: `SELECT department_id, ROUND(AVG(salary), 2) AS avg_salary\nFROM employees\nWHERE department_id IS NOT NULL\nGROUP BY department_id\nHAVING AVG(salary) >= 3600\nORDER BY department_id;`,
    hint: '<p>그룹을 만든 <b>뒤</b>의 조건은 <code>WHERE</code>가 아니라 <code>HAVING</code>에 써요.</p>',
    cross: { lang: 'py', code: `g = employees.groupby('department_id')['salary'].mean().round(2).reset_index()\nresult = g[g.salary >= 3600]` },
  },
  {
    ...T, id: 'sql-007', category: '집계', level: 2, title: '구매 금액 상위 3명',
    datasets: ['orders'],
    desc: `<p><code>orders</code> 테이블에서 고객별 총 주문 금액(<code>quantity × unit_price</code>의 합)을 구하고, <b>금액이 큰 상위 3명</b>을 조회하세요.</p>
<p>열: <code>customer_id</code>, <code>total</code> / 금액이 큰 순서</p>`,
    starter: S, ordered: true,
    solution: `SELECT customer_id, SUM(quantity * unit_price) AS total\nFROM orders\nGROUP BY customer_id\nORDER BY total DESC\nLIMIT 3;`,
    hint: '<p>합계를 <code>total</code>이라는 이름으로 만든 뒤 <code>ORDER BY total DESC LIMIT 3</code>.</p>',
    cross: { lang: 'py', code: `o = orders.assign(total=orders.quantity * orders.unit_price)\nresult = o.groupby('customer_id')['total'].sum().sort_values(ascending=False).head(3).reset_index()` },
  },
  {
    ...T, id: 'sql-008', category: '집계', level: 3, title: '월별 매출',
    datasets: ['orders'],
    desc: `<p>주문일(<code>order_date</code>) 기준 <b>월별 매출</b>(<code>quantity × unit_price</code>의 합)을 구하세요.</p>
<p>열: <code>month</code>(예: <code>2024-01</code>), <code>revenue</code> / 월 오름차순</p>`,
    starter: S, ordered: true,
    solution: `SELECT TO_CHAR(order_date, 'YYYY-MM') AS month, SUM(quantity * unit_price) AS revenue\nFROM orders\nGROUP BY TO_CHAR(order_date, 'YYYY-MM')\nORDER BY month;`,
    hint: "<p>PostgreSQL에서는 <code>TO_CHAR(날짜, 'YYYY-MM')</code>으로 월을 뽑을 수 있어요. (MySQL의 DATE_FORMAT과 비슷)</p>",
    cross: { lang: 'py', code: `o = orders.assign(month=orders.order_date.str[:7], revenue=orders.quantity * orders.unit_price)\nresult = o.groupby('month')['revenue'].sum().reset_index()` },
  },
  {
    ...T, id: 'sql-009', category: '조인', level: 3, title: '직원과 부서 이름 (부서 없는 직원 포함)',
    datasets: ['employees', 'departments'],
    desc: `<p>모든 직원의 <b>이름</b>과 <b>소속 부서 이름</b>을 조회하세요. 부서가 없는 직원도 포함하고, 이때 부서 이름은 NULL로 나와야 해요.</p>
<p>열: <code>name</code>, <code>department</code></p>`,
    starter: S, ordered: false,
    solution: `SELECT e.name, d.name AS department\nFROM employees e\nLEFT JOIN departments d ON e.department_id = d.id;`,
    hint: '<p>한쪽 테이블의 행을 모두 남기려면 <code>LEFT JOIN</code>을 써요. 테이블에 별칭(e, d)을 붙이면 편해요.</p>',
    cross: { lang: 'py', datasets: ['employees', 'departments'], code: `m = employees.merge(departments, left_on='department_id', right_on='id', how='left', suffixes=('', '_d'))\nresult = m[['name', 'name_d']]` },
  },
  {
    ...T, id: 'sql-010', category: '조인', level: 3, title: '주문이 없는 고객',
    datasets: ['customers', 'orders'],
    desc: `<p>한 번도 주문하지 않은 고객의 <b>이름(name)</b>을 조회하세요.</p>`,
    starter: S, ordered: false,
    solution: `SELECT c.name\nFROM customers c\nLEFT JOIN orders o ON c.customer_id = o.customer_id\nWHERE o.order_id IS NULL;`,
    hint: '<p><code>LEFT JOIN</code> 후 오른쪽 테이블의 값이 NULL인 행만 남기면 "짝이 없는" 행이에요.</p>',
    cross: { lang: 'py', datasets: ['customers', 'orders'], code: `result = customers[~customers.customer_id.isin(orders.customer_id)][['name']]` },
  },
  {
    ...T, id: 'sql-011', category: '조인', level: 3, title: '직원과 직속 상사',
    datasets: ['employees'],
    desc: `<p>각 직원의 이름과 <b>직속 상사 이름</b>을 조회하세요. 상사가 없는 직원은 상사 이름이 NULL이에요. (<code>manager_id</code>는 같은 테이블 직원의 <code>id</code>)</p>
<p>열: <code>name</code>, <code>manager</code></p>`,
    starter: S, ordered: false,
    solution: `SELECT e.name, m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;`,
    hint: '<p>같은 테이블을 두 번 쓰는 "자기 조인"이에요. 별칭을 다르게 주세요 (e, m).</p>',
    cross: { lang: 'py', code: `m = employees.merge(employees, left_on='manager_id', right_on='id', how='left', suffixes=('', '_m'))\nresult = m[['name', 'name_m']]` },
  },
  {
    ...T, id: 'sql-012', category: '윈도우 함수', level: 4, title: '부서별 급여 순위',
    datasets: ['employees'],
    desc: `<p>부서(NULL 제외) 안에서 급여가 높은 순서대로 <b>순위</b>를 매기세요. 급여가 같으면 같은 순위예요 (<code>RANK</code>).</p>
<p>열: <code>name</code>, <code>department_id</code>, <code>salary</code>, <code>rnk</code> / 정렬: <code>department_id</code>, <code>rnk</code>, <code>name</code> 오름차순</p>`,
    starter: S, ordered: true,
    solution: `SELECT name, department_id, salary,\n       RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rnk\nFROM employees\nWHERE department_id IS NOT NULL\nORDER BY department_id, rnk, name;`,
    hint: '<p><code>RANK() OVER (PARTITION BY 그룹열 ORDER BY 정렬열 DESC)</code> 형태예요.</p>',
    cross: { lang: 'py', code: `e = employees.dropna(subset=['department_id']).copy()\ne['rnk'] = e.groupby('department_id')['salary'].rank(method='min', ascending=False).astype(int)\nresult = e.sort_values(['department_id', 'rnk', 'name'])[['name', 'department_id', 'salary', 'rnk']]` },
  },
  {
    ...T, id: 'sql-013', category: '윈도우 함수', level: 4, title: '월별 누적 매출',
    datasets: ['orders'],
    desc: `<p>월별 매출과 함께 <b>누적 매출</b>을 구하세요. (월별 매출 = <code>quantity × unit_price</code>의 합)</p>
<p>열: <code>month</code>, <code>revenue</code>, <code>cumulative</code> / 월 오름차순</p>`,
    starter: S, ordered: true,
    solution: `WITH monthly AS (\n  SELECT TO_CHAR(order_date, 'YYYY-MM') AS month, SUM(quantity * unit_price) AS revenue\n  FROM orders\n  GROUP BY TO_CHAR(order_date, 'YYYY-MM')\n)\nSELECT month, revenue, SUM(revenue) OVER (ORDER BY month) AS cumulative\nFROM monthly\nORDER BY month;`,
    hint: '<p>먼저 월별 합계를 <code>WITH</code>로 만들고, 그 위에서 <code>SUM(revenue) OVER (ORDER BY month)</code>를 쓰면 누적합이 돼요.</p>',
    cross: { lang: 'py', code: `o = orders.assign(month=orders.order_date.str[:7], revenue=orders.quantity * orders.unit_price)\ng = o.groupby('month')['revenue'].sum().reset_index()\ng['cumulative'] = g['revenue'].cumsum()\nresult = g` },
  },
];
