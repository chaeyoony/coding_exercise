// 파이썬 워크북(1~6장) 연습문제를 바탕으로 만든 코딩 문제.
// 수업 자료의 문제 흐름(입출력 예시, 조건, 난이도 ★)을 따르되, 값과 문장은 새로 바꿨다.
// 입력은 input()으로 받는다고 생각하고 풀면 된다: 각 테스트 케이스가 "키보드 입력을 흉내 내는 코드"를 미리 넣어 주고,
// 입력한 값은 터미널처럼 프롬프트 뒤에 그대로 출력된다. (정답 출력은 build 때 정답 코드를 실행해 자동으로 만든다)
import { o } from './_stdout.mjs';

const W1 = '워크북 1장 Python 소개와 첫 프로그램';
const W2 = '워크북 2장 변수와 자료형';
const W3 = '워크북 3장 입출력과 포맷팅';
const W4 = '워크북 4장 연산자와 조건문';
const W5 = '워크북 5장 반복문';
const W6 = '워크북 6장 문자열';

// 키보드 입력 흉내: input() 이 차례로 값을 돌려주고, 터미널처럼 "프롬프트 + 입력값"을 출력한다
const INP = (...vals) => `_vals = iter(${JSON.stringify(vals.map(String))})\n\n\ndef input(prompt=""):\n    v = next(_vals)\n    print(prompt + v)\n    return v\n`;
const p = (category, level, title, desc, solution, hint, cases, extra = {}) => o({ category, level, title, desc, solution, hint, cases, ...extra });
const IO = '<p class="muted">입력은 <code>input()</code>으로 받는다고 생각하고 풀면 돼요. 아래 "주어진 코드"가 키보드 입력을 흉내 내 주고, 입력한 값은 프롬프트 뒤에 그대로 출력돼요.</p>';
const ex = s => `<pre class="out">${s}</pre>`;

export default [
  // ================= 1장 =================
  p(W1, 2, '자기소개 한 줄 만들기', `<p>이름, 학과, 취미를 <code>input()</code>으로 차례로 입력받아(프롬프트는 각각 <code>"이름: "</code>, <code>"학과: "</code>, <code>"취미: "</code>) 마지막에 <code>자기소개 -&gt; 이름 / 학과 / 취미</code> 한 줄을 출력하세요.</p>${IO}<b>실행 예시</b>${ex('이름: 김이화\n학과: 데이터사이언스\n취미: 독서\n자기소개 -> 김이화 / 데이터사이언스 / 독서')}`,
    `name = input("이름: ")\nmajor = input("학과: ")\nhobby = input("취미: ")\nprint("자기소개 ->", name, major, hobby, sep=" / ")\n`, '<p><code>print(a, b, c, sep=" / ")</code>처럼 <code>sep</code>으로 값 사이의 글자를 정할 수 있어요. 첫 값 <code>"자기소개 ->"</code>와 다음 값 사이도 같은 구분자가 들어가는 점에 주의하세요.</p>',
    [INP('김이화', '데이터사이언스', '독서'), INP('Mina', 'Statistics', 'running'), INP('박서연', 'AI', '영화 감상')]),
  p(W1, 2, '세 식의 값 한 번에 출력', `<p>다음 세 식의 값을 <b><code>print()</code> 한 번</b>으로, 공백으로 구분해 출력하세요: <code>2 ** 8</code>, <code>9 * 6 - 4</code>, <code>(3 + 7) * 5</code></p><b>출력 예시</b>${ex('256 50 50')}`,
    `print(2 ** 8, 9 * 6 - 4, (3 + 7) * 5)\n`, '<p>식은 쉼표로 이어서 한 번에 줄 수 있어요. <code>**</code>는 거듭제곱이에요.</p>', [''], { singleCase: true }),
  p(W1, 2, '이름을 받아 인사하기', `<p>이름을 입력받아(<code>"이름을 입력하세요: "</code>) <code>안녕하세요, ○○님!</code>을 출력하세요.</p>${IO}${ex('이름을 입력하세요: 이화\n안녕하세요, 이화님!')}`,
    `name = input("이름을 입력하세요: ")\nprint(f"안녕하세요, {name}님!")\n`, '<p><code>input("안내 문구")</code>는 문구를 보여 주고 입력받은 <b>문자열</b>을 돌려줘요. f-string <code>f"...{name}..."</code>으로 문장에 끼워 넣을 수 있어요.</p>',
    [INP('이화'), INP('Alex'), INP('김 서 연')]),
  p(W1, 2, '두 정수의 합', `<p>두 정수를 한 줄씩 입력받아(프롬프트 <code>"첫 번째 수: "</code>, <code>"두 번째 수: "</code>) <code>합: ○○</code>을 출력하세요.</p>${IO}${ex('첫 번째 수: 15\n두 번째 수: 27\n합: 42')}`,
    `a = int(input("첫 번째 수: "))\nb = int(input("두 번째 수: "))\nprint("합:", a + b)\n`, '<p><code>input()</code>은 항상 문자열을 돌려주니까 계산하려면 <code>int()</code>로 바꿔야 해요. 안 바꾸면 <code>"15" + "27"</code>이 <code>"1527"</code>이 돼요.</p>',
    [INP(15, 27), INP(-3, 10), INP(100, 0)]),
  p(W1, 2, '합격 여부 판정', `<p>변수 <code>score</code>가 주어져요. 60 이상이면 <code>합격</code>과 <code>축하합니다</code>를 두 줄로, 아니면 <code>불합격</code>을 한 줄로 출력하세요.</p>`,
    `if score >= 60:\n    print("합격")\n    print("축하합니다")\nelse:\n    print("불합격")\n`, '<p><code>if 조건:</code> 아래에 <b>들여쓰기</b>한 줄들이 조건이 참일 때 실행돼요. <code>else:</code>도 마찬가지예요.</p>',
    ['score = 72', 'score = 55', 'score = 60', 'score = 91']),
  p(W1, 2, '들여쓰기 오류 고치기', `<p>아래 코드는 실행하면 <code>IndentationError</code>가 나요. 고쳐서 <code>x는 5보다 큽니다</code>가 출력되게 하세요.</p>`,
    `x = 10\nif x > 5:\n    print("x는 5보다 큽니다")\n`, '<p>콜론(<code>:</code>)으로 끝나는 줄 다음에는 그 안에 속하는 줄을 <b>한 단계 들여써야</b> 해요(보통 공백 4칸).</p>',
    [''], { singleCase: true, starter: 'x = 10\nif x > 5:\nprint("x는 5보다 큽니다")\n' }),

  // ================= 2장 =================
  p(W2, 2, '학생 정보를 변수에 담아 출력', `<p>이름, 학번, 학과, 학년을 각각 변수 <code>name</code>, <code>student_id</code>, <code>major</code>, <code>grade</code>에 저장하고 <code>print()</code>로 한 줄씩 순서대로 출력하세요. 값은 이름 <code>"Hana"</code>, 학번 <code>2566001</code>, 학과 <code>"Data Science"</code>, 학년 <code>2</code>예요.</p><b>출력 예시</b>${ex('Hana\n2566001\nData Science\n2')}`,
    `name = "Hana"\nstudent_id = 2566001\nmajor = "Data Science"\ngrade = 2\nprint(name)\nprint(student_id)\nprint(major)\nprint(grade)\n`, '<p><code>변수이름 = 값</code>으로 담아요. 문자열은 따옴표로, 숫자는 따옴표 없이 써요.</p>',
    [''], { singleCase: true, needs: [['student_id\\s*=', '변수 student_id에 학번을 담아 보세요']] }),
  p(W2, 3, '따옴표와 여러 줄 출력', `<p>다음 세 가지를 각각 하나의 <code>print()</code>로 출력하세요. <b>줄바꿈 기호 <code>\\n</code>은 쓰지 않아요.</b></p><ol><li><code>Hello, Ewha!</code></li><li><code>She said "Hi" and I'm fine</code> (큰따옴표와 작은따옴표가 모두 들어 있어요)</li><li>아래처럼 세 줄(가운데 빈 줄 포함)<pre class="out">Line1\n\nLine3</pre></li></ol>`,
    `print("Hello, Ewha!")\nprint('She said "Hi" and I\\'m fine')\nprint("""Line1\n\nLine3""")\n`, '<p>문자열 안에 따옴표가 있으면 <b>다른 종류의 따옴표로 감싸거나</b> <code>\\\'</code>처럼 앞에 역슬래시를 붙여요. 여러 줄은 삼중따옴표 <code>""" """</code>를 쓰면 돼요.</p>',
    [''], { singleCase: true, forbids: [['\\\\n', '줄바꿈 기호 \\n은 쓰지 않고 삼중따옴표를 써 보세요']] }),
  p(W2, 2, '덧셈·나눗셈 결과와 자료형', `<p>변수 <code>a</code>, <code>b</code>(정수)가 주어져요. 덧셈과 나눗셈의 결과와 <b>결과의 자료형</b>을 아래 형식으로 출력하세요. (<code>type()</code> 사용)</p>${ex("21 + 6 = 27 <class 'int'>\n21 / 6 = 3.5 <class 'float'>")}`,
    `print(a, "+", b, "=", a + b, type(a + b))\nprint(a, "/", b, "=", a / b, type(a / b))\n`, '<p><code>/</code> 나눗셈은 나누어떨어져도 항상 실수(<code>float</code>)가 돼요. <code>print</code>에 값을 쉼표로 주면 공백으로 이어져요.</p>',
    ['a = 21\nb = 6', 'a = 15\nb = 4', 'a = 8\nb = 2'], { needs: [['type\\s*\\(', 'type()으로 자료형을 확인해 보세요']] }),
  p(W2, 3, '문자열로 된 단가와 수량으로 총액', `<p>물품 이름 <code>item</code>, 단가 <code>price</code>, 수량 <code>qty</code>가 <b>모두 문자열</b>로 주어져요. 총 가격(단가 × 수량)을 계산해 변수 <code>total</code>에 저장하고, <b>소수점 아래는 버려서 정수로</b> 물품 이름과 총 가격을 두 줄로 출력하세요.</p>${ex('Pen\n3922')}`,
    `total = int(float(price) * int(qty))\nprint(item)\nprint(total)\n`, '<p>단가는 소수일 수 있어서 <code>float()</code>, 수량은 <code>int()</code>로 바꿔요. 소수점을 버리려면 결과를 <code>int()</code>로 감싸요. (<code>int("980.5")</code>는 오류예요)</p>',
    ['item = "Pen"\nprice = "980.5"\nqty = "4"', 'item = "Bag"\nprice = "1250.5"\nqty = "3"', 'item = "Gum"\nprice = "300"\nqty = "7"']),
  p(W2, 2, '임시 변수 없이 값 바꾸기', `<p>변수 <code>a</code>, <code>b</code>가 주어져요. <b>임시 변수를 쓰지 않고</b> 두 값을 서로 바꾼 뒤 <code>a = ○ b = ○</code> 형태로 출력하세요.</p>${ex('a = 8  b = 3')}`,
    `a, b = b, a\nprint("a =", a, " b =", b)\n`, '<p>파이썬은 <code>a, b = b, a</code>처럼 한 줄로 값을 바꿀 수 있어요. 오른쪽을 모두 계산한 뒤에 왼쪽에 넣기 때문이에요.</p>',
    ['a = 3\nb = 8', 'a = 10\nb = -2', 'a = "x"\nb = "y"']),
  p(W2, 3, '초를 시·분·초로 바꾸기', `<p>초(seconds)를 정수로 입력받아(<code>"초를 입력하세요: "</code>) <code>○ 시간 ○ 분 ○ 초</code> 형태로 출력하세요.</p>${IO}${ex('초를 입력하세요: 3725\n1 시간 2 분 5 초')}`,
    `sec = int(input("초를 입력하세요: "))\nprint(sec // 3600, "시간", sec % 3600 // 60, "분", sec % 60, "초")\n`, '<p>몫은 <code>//</code>, 나머지는 <code>%</code>예요. 시간 = <code>sec // 3600</code>, 남은 초에서 분 = <code>sec % 3600 // 60</code>, 초 = <code>sec % 60</code>.</p>',
    [INP(3725), INP(59), INP(86399), INP(3600)]),
  p(W2, 3, 'BMI 계산', `<p>키(cm)와 몸무게(kg)를 실수로 입력받아(<code>"키(cm): "</code>, <code>"몸무게(kg): "</code>) BMI(= 몸무게 ÷ (키(m))²)를 <b>소수 첫째 자리까지 반올림</b>해 <code>BMI: ○</code>로 출력하세요.</p>${IO}${ex('키(cm): 175\n몸무게(kg): 68\nBMI: 22.2')}`,
    `h = float(input("키(cm): "))\nw = float(input("몸무게(kg): "))\nbmi = w / (h / 100) ** 2\nprint("BMI:", round(bmi, 1))\n`, '<p>키는 cm를 m로 바꾸려면 100으로 나눠요. <code>round(값, 1)</code>은 소수 첫째 자리까지 반올림해요.</p>',
    [INP(175, 68), INP(160, 50), INP(182, 90.5)]),

  // ================= 3장 =================
  p(W3, 3, '% 포맷으로 성적표 만들기', `<p>이름, 중간고사, 기말고사 점수를 입력받아(프롬프트 <code>"이름: "</code>, <code>"중간고사: "</code>, <code>"기말고사: "</code>) 아래 형식으로 출력하세요. 점수는 <b>3자리 정수</b>(빈 자리는 공백), 평균은 두 점수의 평균(정수 몫)이에요. <code>%</code> 포맷팅을 쓰세요.</p>${IO}${ex('이름: Gildong\n중간고사: 85\n기말고사: 92\n이름: Gildong\n중간:  85\n기말:  92\n평균:  88')}`,
    `name = input("이름: ")\nmid = int(input("중간고사: "))\nfinal = int(input("기말고사: "))\nprint("이름: %s" % name)\nprint("중간: %3d" % mid)\nprint("기말: %3d" % final)\nprint("평균: %3d" % ((mid + final) // 2))\n`, '<p><code>%s</code>는 문자열, <code>%3d</code>는 <b>폭 3칸의 정수</b>(앞을 공백으로 채움)예요. 값이 여러 개면 <code>"..." % (값1, 값2)</code>처럼 튜플로 줘요.</p>',
    [INP('Gildong', 85, 92), INP('Hana', 100, 7), INP('Min', 60, 61)], { needs: [['%\\s*\\d*d', '% 포맷(%3d 같은)을 사용해 보세요']] }),
  p(W3, 3, '이름 기반 format 으로 연체료 안내', `<p>도서 제목, 대출자, 연체 일수, 하루 연체료를 입력받아(프롬프트 <code>"도서 제목: "</code>, <code>"대출자: "</code>, <code>"연체 일수: "</code>, <code>"하루 연체료: "</code>) 마지막에 <b><code>format()</code>을 한 번만 써서</b> 아래 한 줄을 출력하세요. 자리 표시는 인덱스 대신 <b>이름</b>(<code>{user}</code>, <code>{title}</code>, <code>{total}</code>)을 쓰세요.</p>${IO}${ex('대출자: Gildong | 도서: Python Basics | 총 연체료: 3500')}`,
    `title = input("도서 제목: ")\nuser = input("대출자: ")\ndays = int(input("연체 일수: "))\nfee = int(input("하루 연체료: "))\nprint("대출자: {user} | 도서: {title} | 총 연체료: {total}".format(user=user, title=title, total=days * fee))\n`, '<p><code>"{name}...".format(name=값)</code>처럼 이름을 붙여 넘기면 순서에 상관없이 채워져요. 총 연체료는 <code>일수 × 하루 연체료</code>.</p>',
    [INP('Python Basics', 'Gildong', 7, 500), INP('R Cookbook', 'Hana', 3, 300), INP('SQL', 'Min', 0, 500)], { needs: [['\\.format\\s*\\(', 'str.format()을 사용해 보세요']] }),
  p(W3, 3, 'f-string 으로 할인 가격 출력', `<p>상품명, 단가(실수), 수량, 할인율(%)을 입력받아(프롬프트 <code>"상품명: "</code>, <code>"단가: "</code>, <code>"수량: "</code>, <code>"할인율(%): "</code>) 할인된 최종 가격(<b>소수점 아래 버림</b>)을 <b>오른쪽 정렬 10칸</b>으로 출력하세요. <code>f-string</code>을 쓰세요.</p>${IO}${ex('상품명: Notebook\n단가: 1250.5\n수량: 3\n할인율(%): 10\n상품: Notebook\n최종 가격:       3376')}`,
    `name = input("상품명: ")\nprice = float(input("단가: "))\nqty = int(input("수량: "))\nrate = int(input("할인율(%): "))\ntotal = int(price * qty * (100 - rate) / 100)\nprint(f"상품: {name}")\nprint(f"최종 가격: {total:>10}")\n`, '<p>최종 가격 = 단가 × 수량 × (100 − 할인율) ÷ 100. 정수로 버리려면 <code>int()</code>. f-string의 <code>{값:&gt;10}</code>은 폭 10 오른쪽 정렬이에요.</p>',
    [INP('Notebook', 1250.5, 3, 10), INP('Pen', 980.5, 4, 25), INP('Bag', 20000, 2, 0)], { needs: [['f["\']', 'f-string을 사용해 보세요']] }),
  p(W3, 2, 'sep와 end 활용', `<p><code>print()</code>의 <code>sep</code>와 <code>end</code>를 사용해 아래 두 줄을 출력하세요. (<code>print()</code> 호출 횟수는 자유)</p>${ex('2027-3-5\n4 5 6 끝')}<ul><li>첫 줄: 2027, 3, 5를 <code>-</code>로 이어서</li><li>둘째 줄: 4 5 6을 공백으로 이은 뒤, <b>줄을 바꾸지 않고</b> 같은 줄에 <code>끝</code>을 이어서</li></ul>`,
    `print(2027, 3, 5, sep="-")\nprint(4, 5, 6, end=" ")\nprint("끝")\n`, '<p><code>sep</code>는 값 사이 글자, <code>end</code>는 마지막에 붙는 글자(기본은 줄바꿈)예요. 줄을 바꾸지 않으려면 <code>end=" "</code>.</p>', [''], { singleCase: true, needs: [['sep\\s*=', 'sep를 사용해 보세요'], ['end\\s*=', 'end를 사용해 보세요']] }),
  p(W3, 2, '한 줄에 두 정수, 합·차·곱', `<p>한 줄에 입력된 두 정수(<code>"두 정수: "</code>)의 합, 차, 곱을 각각 <code>합: </code>, <code>차: </code>, <code>곱: </code> 형태로 세 줄에 출력하세요.</p>${IO}${ex('두 정수: 12 5\n합: 17\n차: 7\n곱: 60')}`,
    `line = input("두 정수: ")\na, b = map(int, line.split())\nprint("합:", a + b)\nprint("차:", a - b)\nprint("곱:", a * b)\n`, '<p>한 줄 입력은 <code>split()</code>으로 나눠서 <code>map(int, ...)</code>로 정수로 바꿔 두 변수에 풀어 담을 수 있어요.</p>',
    [INP('12 5'), INP('7 7'), INP('-4 9')]),
  p(W3, 3, '영수증 정렬 출력', `<p>변수 <code>items</code>(<code>(품목, 단가, 수량)</code> 튜플의 리스트)가 주어져요. 아래처럼 영수증을 출력하세요.</p><ul><li>품목은 <b>왼쪽 정렬 6칸</b>, 단가는 <b>오른쪽 정렬 8칸(천 단위 쉼표)</b>, 수량은 오른쪽 4칸, 금액(단가×수량)은 오른쪽 10칸(천 단위 쉼표)</li><li>첫 줄은 머리글 <code>품목</code>, <code>단가</code>, <code>수량</code>, <code>금액</code>(같은 칸 폭)</li><li>마지막 줄은 <code>합계</code>(왼쪽 6칸) 뒤에 전체 합계를 <b>오른쪽 22칸(쉼표)</b>으로</li></ul>${ex('품목          단가  수량        금액\n사과       1,200   5     6,000\n우유       2,500   2     5,000\n빵        3,000   3     9,000\n합계                    20,000')}`,
    `print(f"{'품목':<6}{'단가':>8}{'수량':>4}{'금액':>10}")\ntotal = 0\nfor name, price, qty in items:\n    amount = price * qty\n    total += amount\n    print(f"{name:<6}{price:>8,}{qty:>4}{amount:>10,}")\nprint(f"{'합계':<6}{total:>22,}")\n`, '<p>f-string 서식: <code>{값:&lt;6}</code> 왼쪽 6칸, <code>{값:&gt;8,}</code> 오른쪽 8칸에 천 단위 쉼표. 문자열 리터럴을 f-string 안에 쓸 때는 바깥 따옴표와 다른 종류를 써요.</p>',
    ['items = [("사과", 1200, 5), ("우유", 2500, 2), ("빵", 3000, 3)]', 'items = [("펜", 800, 10), ("공책", 1500, 4)]', 'items = [("물", 1000, 1)]']),
  p(W3, 3, '이름·나이·키 한 줄 입력, 두 가지 포맷', `<p>한 줄에 <code>이름 나이 키(cm)</code>가 입력돼요(<code>"이름 나이 키: "</code>). 첫째 줄은 <b><code>str.format()</code></b>으로, 둘째 줄은 <b>f-string</b>으로 출력하세요.</p><ul><li>첫째 줄: <code>이름: ○ | 나이: ○세 | 키: ○cm</code> — 이름은 왼쪽 8칸, 나이는 오른쪽 3칸, 키는 오른쪽 6칸 소수 첫째 자리</li><li>둘째 줄: <code>내년 나이: ○, 키(m): ○</code> — 키는 m로 바꿔 소수 둘째 자리</li></ul>${IO}${ex('이름 나이 키: 이화 21 163.456\n이름: 이화      | 나이:  21세 | 키:  163.5cm\n내년 나이: 22, 키(m): 1.63')}`,
    `line = input("이름 나이 키: ")\nname, age, height = line.split()\nage = int(age)\nheight = float(height)\nprint("이름: {:<8}| 나이: {:>3}세 | 키: {:>6.1f}cm".format(name, age, height))\nprint(f"내년 나이: {age + 1}, 키(m): {height / 100:.2f}")\n`, '<p>한 줄에 세 값이니 <code>split()</code>으로 나눠 풀어 담고, 나이는 <code>int</code>, 키는 <code>float</code>로 바꿔요. 포맷의 <code>{:&gt;6.1f}</code>는 폭 6, 소수 첫째 자리예요.</p>',
    [INP('이화 21 163.456'), INP('Kim 30 180.04'), INP('박 7 121.37')]),

  // ================= 4장 =================
  p(W4, 3, '두 도시의 온도 차이', `<p>첫 번째 도시의 온도는 <b>섭씨</b>, 두 번째 도시의 온도는 <b>화씨</b>로 입력돼요(<code>"첫번째 도시의 섭씨 온도: "</code>, <code>"두번째 도시의 화씨 온도: "</code>). 두 도시의 <b>섭씨 온도 차이</b>와 <b>화씨 온도 차이</b>(둘 다 절댓값)를 소수 둘째 자리까지 출력하세요. (화씨 = 섭씨 × 9/5 + 32)</p>${IO}${ex('첫번째 도시의 섭씨 온도: 30\n두번째 도시의 화씨 온도: 32\n섭씨 온도 차이 = 30.00\n화씨 온도 차이 = 54.00')}`,
    `c1 = float(input("첫번째 도시의 섭씨 온도: "))\nf2 = float(input("두번째 도시의 화씨 온도: "))\nf1 = c1 * 9 / 5 + 32\nc2 = (f2 - 32) * 5 / 9\nprint("섭씨 온도 차이 = %.2f" % abs(c1 - c2))\nprint("화씨 온도 차이 = %.2f" % abs(f1 - f2))\n`, '<p>한 도시를 다른 도시의 단위로 맞춘 뒤 비교해요. 차이는 <code>abs()</code>로 절댓값을 구해요. 소수 둘째 자리 출력: <code>"%.2f" % 값</code>.</p>',
    [INP(30, 32), INP(-5, 50), INP(25.5, 80)]),
  p(W4, 4, '학점과 결석 패널티', `<p>점수(0~100)와 결석 횟수를 입력받아(<code>"점수: "</code>, <code>"결석 횟수: "</code>) 학점을 출력하세요.</p><ul><li>90 이상 A, 80~89 B, 70~79 C, 60~69 D, 그 외 F</li><li>결석이 2회까지는 패널티 없음, <b>3회부터는 학점을 한 단계 강등</b>(A→B, B→C, C→D, D→F, F는 그대로 F)</li></ul>${IO}${ex('점수: 86\n결석 횟수: 3\n학점: C')}`,
    `score = int(input("점수: "))\nabsent = int(input("결석 횟수: "))\ngrades = ["A", "B", "C", "D", "F"]\nif score >= 90:\n    i = 0\nelif score >= 80:\n    i = 1\nelif score >= 70:\n    i = 2\nelif score >= 60:\n    i = 3\nelse:\n    i = 4\nif absent >= 3:\n    i = min(i + 1, 4)\nprint("학점:", grades[i])\n`, '<p>먼저 점수로 기본 학점을 정하고, 그다음 결석이 3회 이상이면 한 단계 내려요. 학점을 번호(0~4)로 두면 "한 단계 강등"이 +1로 간단해져요(F를 넘지 않게 주의).</p>',
    [INP(86, 2), INP(86, 3), INP(58, 3), INP(95, 5), INP(60, 0)]),
  p(W4, 2, '짝수·홀수와 3의 배수', `<p>정수를 입력받아(<code>"정수: "</code>) 짝수인지 홀수인지, 그리고 3의 배수인지 아닌지를 각각 한 줄로 출력하세요. (<code>짝수</code>/<code>홀수</code>, <code>3의 배수</code>/<code>3의 배수 아님</code>)</p>${IO}${ex('정수: 12\n짝수\n3의 배수')}`,
    `n = int(input("정수: "))\nif n % 2 == 0:\n    print("짝수")\nelse:\n    print("홀수")\nif n % 3 == 0:\n    print("3의 배수")\nelse:\n    print("3의 배수 아님")\n`, '<p>두 판정은 <b>서로 독립</b>이라 <code>if-else</code>를 두 번 따로 써요. <code>%</code>로 나머지가 0인지 확인해요.</p>', [INP(12), INP(7), INP(9), INP(-4)]),
  p(W4, 3, '세 수 중 가장 큰 수 (max 없이)', `<p>정수 세 개를 한 줄에 하나씩 입력받아(<code>"첫 번째 수: "</code>, <code>"두 번째 수: "</code>, <code>"세 번째 수: "</code>) 가장 큰 수를 <code>가장 큰 수: ○</code>로 출력하세요. <b><code>max()</code>는 쓰지 마세요.</b></p>${IO}${ex('첫 번째 수: 14\n두 번째 수: 27\n세 번째 수: 9\n가장 큰 수: 27')}`,
    `a = int(input("첫 번째 수: "))\nb = int(input("두 번째 수: "))\nc = int(input("세 번째 수: "))\nbiggest = a\nif b > biggest:\n    biggest = b\nif c > biggest:\n    biggest = c\nprint("가장 큰 수:", biggest)\n`, '<p>"지금까지 가장 큰 값"을 변수에 두고 하나씩 비교해 더 크면 바꾸는 방식(최댓값 찾기)이에요.</p>',
    [INP(14, 27, 9), INP(5, 5, 5), INP(-3, -8, -1), INP(100, 99, 101)], { forbids: [['\\bmax\\s*\\(', 'max()를 쓰지 말고 비교로 풀어 보세요']] }),
  p(W4, 3, '윤년 판정', `<p>연도를 입력받아(<code>"연도: "</code>) 윤년인지 평년인지 <code>○년은 윤년</code> / <code>○년은 평년</code>으로 출력하세요. (윤년: 4의 배수이면서 100의 배수가 아니거나, 400의 배수)</p>${IO}${ex('연도: 2100\n2100년은 평년')}`,
    `year = int(input("연도: "))\nif (year % 4 == 0 and year % 100 != 0) or year % 400 == 0:\n    print(f"{year}년은 윤년")\nelse:\n    print(f"{year}년은 평년")\n`, '<p>조건은 <code>(4의 배수 and 100의 배수 아님) or 400의 배수</code>. 괄호로 묶으면 읽기 쉬워요.</p>', [INP(2100), INP(2000), INP(2028), INP(1999)]),
  p(W4, 4, '놀이공원 입장료 계산', `<p>나이와 주말 여부(<code>y</code>/<code>n</code>)를 입력받아(<code>"나이: "</code>, <code>"주말입니까? (y/n): "</code>) 입장료를 계산해 <code>입장료: ○,○○○원</code>(천 단위 쉼표)으로 출력하세요.</p><ul><li>7세 이하와 65세 이상은 무료</li><li>8~18세는 3,000원, 19~64세는 5,000원</li><li>주말이면 <b>요금이 있는 사람에게만</b> 1,000원을 더해요</li></ul>${IO}${ex('나이: 25\n주말입니까? (y/n): y\n입장료: 6,000원')}`,
    `age = int(input("나이: "))\nweekend = input("주말입니까? (y/n): ")\nif age <= 7 or age >= 65:\n    fee = 0\nelif age <= 18:\n    fee = 3000\nelse:\n    fee = 5000\nif weekend == "y" and fee > 0:\n    fee += 1000\nprint(f"입장료: {fee:,}원")\n`, '<p>먼저 나이로 기본 요금을 정하고, 주말 추가금은 <b>요금이 0보다 클 때만</b> 더해요. 쉼표 출력은 <code>{fee:,}</code>.</p>',
    [INP(25, 'y'), INP(7, 'y'), INP(15, 'n'), INP(70, 'n'), INP(40, 'n')]),
  p(W4, 4, '삼각형 판정', `<p>세 변의 길이를 한 줄에 입력받아(<code>"세 변의 길이: "</code>) 삼각형이 되는지 판단하세요. 되면 <code>정삼각형</code>, <code>이등변삼각형</code>, <code>일반 삼각형</code> 중 하나를, 안 되면 <code>삼각형이 아닙니다</code>를 출력하세요. (삼각형 조건: 어느 두 변의 합이 나머지 한 변보다 커야 해요)</p>${IO}${ex('세 변의 길이: 5 5 8\n이등변삼각형')}`,
    `a, b, c = map(int, input("세 변의 길이: ").split())\nif a + b <= c or a + c <= b or b + c <= a:\n    print("삼각형이 아닙니다")\nelif a == b == c:\n    print("정삼각형")\nelif a == b or b == c or a == c:\n    print("이등변삼각형")\nelse:\n    print("일반 삼각형")\n`, '<p>먼저 삼각형이 <b>되는지</b>부터 확인하고, 그다음 정삼각형(셋 다 같음) → 이등변(둘만 같음) → 일반 순서로 검사해요. 정삼각형을 이등변보다 먼저 검사해야 해요.</p>',
    [INP('5 5 8'), INP('3 3 3'), INP('3 4 5'), INP('1 2 3'), INP('7 7 2')]),

  // ================= 5장 =================
  p(W5, 3, '합이 처음 N 이상이 되는 k', `<p>자연수 N을 입력받아(<code>"자연수 N을 입력하세요: "</code>) <code>1 + 2 + ... + k</code>가 <b>처음으로 N 이상</b>이 되는 k를 <code>k = ○</code>로 출력하세요. (항상 해가 있다고 가정)</p>${IO}${ex('자연수 N을 입력하세요: 1000\nk = 45')}`,
    `n = int(input("자연수 N을 입력하세요: "))\ntotal = 0\nk = 0\nwhile total < n:\n    k += 1\n    total += k\nprint("k =", k)\n`, '<p>횟수를 모를 때는 <code>while</code>이 알맞아요. k를 하나 올리며 합을 쌓다가 합이 N 이상이 되면 멈춰요.</p>', [INP(1000), INP(1), INP(10), INP(5050)]),
  p(W5, 4, '표에서 음수를 만나면 그 행은 건너뛰기', `<p>첫 줄에 행과 열의 수(예: <code>3 5</code>)가, 이어서 각 행의 정수들이 입력돼요(프롬프트 <code>"행과 열을 입력하세요: "</code>, <code>"1번째 행을 입력하세요: "</code>, <code>"2번째 행을 입력하세요: "</code> …). 첫 행부터 왼쪽에서 오른쪽으로 더하다가 <b>음수를 만나면 그 행의 나머지는 처리하지 않고 다음 행으로</b> 넘어가요. 모든 행의 합을 <code>결과: ○</code>로 출력하세요.</p>${IO}${ex('행과 열을 입력하세요: 3 5\n1번째 행을 입력하세요: 1 2 3 -1 5\n2번째 행을 입력하세요: 0 4 8 2 1\n3번째 행을 입력하세요: 5 -2 7 7 7\n결과: 26')}`,
    `rows, cols = map(int, input("행과 열을 입력하세요: ").split())\ntotal = 0\nfor i in range(1, rows + 1):\n    nums = list(map(int, input(f"{i}번째 행을 입력하세요: ").split()))\n    for n in nums:\n        if n < 0:\n            break\n        total += n\nprint("결과:", total)\n`, '<p>안쪽 반복에서 음수를 만나면 <code>break</code>로 <b>그 행의 반복만</b> 끝내면, 바깥 반복이 다음 행으로 넘어가요.</p>',
    [INP('3 5', '1 2 3 -1 5', '0 4 8 2 1', '5 -2 7 7 7'), INP('2 4', '2 4 -1 9', '3 3 3 3'), INP('2 3', '-5 8 8', '-1 -1 -1')]),
  p(W5, 4, '은행 계좌 메뉴 프로그램', `<p>잔액 10,000원인 계좌에서 아래 메뉴를 <b>0을 입력할 때까지</b> 반복하는 프로그램을 만드세요. 메뉴 프롬프트는 <code>"메뉴 선택 (1: 조회, 2: 입금, 3: 출금, 0: 종료): "</code>예요.</p><ul><li>1 조회: <code>잔액: ○</code> 출력</li><li>2 입금: <code>"입금액: "</code>을 입력받아 더한 뒤 <code>잔액: ○</code> 출력</li><li>3 출금: <code>"출금액: "</code>을 입력받아, 잔액이 모자라면 <code>잔액 부족</code>을 출력하고 잔액은 그대로, 아니면 뺀다. 그다음 <code>잔액: ○</code> 출력</li><li>0 종료: <code>감사합니다</code>를 출력하고 끝</li></ul>${IO}`,
    `balance = 10000\nwhile True:\n    menu = int(input("메뉴 선택 (1: 조회, 2: 입금, 3: 출금, 0: 종료): "))\n    if menu == 0:\n        print("감사합니다")\n        break\n    if menu == 1:\n        print("잔액:", balance)\n    elif menu == 2:\n        amount = int(input("입금액: "))\n        balance += amount\n        print("잔액:", balance)\n    elif menu == 3:\n        amount = int(input("출금액: "))\n        if amount > balance:\n            print("잔액 부족")\n        else:\n            balance -= amount\n        print("잔액:", balance)\n`, '<p>횟수를 모르는 메뉴 반복은 <code>while True:</code> 안에서 입력을 받고, 0이면 <code>break</code>로 빠져나가는 패턴이 대표적이에요.</p>',
    [INP(1, 2, 5000, 3, 17000, 0), INP(3, 4000, 3, 7000, 0), INP(0)]),
  p(W5, 2, '원하는 단 구구단', `<p>원하는 단을 입력받아(<code>"원하는 단: "</code>) <code>7 x 1 = 7</code> 형태로 1부터 9까지 <code>for</code> 문으로 출력하세요.</p>${IO}${ex('원하는 단: 7\n7 x 1 = 7\n7 x 2 = 14\n...\n7 x 9 = 63')}`,
    `dan = int(input("원하는 단: "))\nfor i in range(1, 10):\n    print(dan, "x", i, "=", dan * i)\n`, '<p><code>for i in range(1, 10):</code>은 1부터 9까지예요(끝값 10은 제외).</p>', [INP(7), INP(2), INP(9)]),
  p(W5, 2, '1부터 N까지 홀수의 합', `<p>자연수 N을 입력받아(<code>"N: "</code>) 1부터 N까지의 <b>홀수만</b> 더한 값을 <code>1부터 ○ 까지 홀수의 합: ○</code>로 출력하세요. <code>range()</code>를 사용하세요.</p>${IO}${ex('N: 10\n1부터 10 까지 홀수의 합: 25')}`,
    `n = int(input("N: "))\ntotal = 0\nfor i in range(1, n + 1, 2):\n    total += i\nprint("1부터", n, "까지 홀수의 합:", total)\n`, '<p><code>range(1, n + 1, 2)</code>는 1, 3, 5…처럼 2씩 건너뛰어요. 누적합은 변수에 계속 더해 가요. (변수 이름을 <code>sum</code>으로 하지 마세요)</p>', [INP(10), INP(1), INP(7), INP(100)], { needs: [['range\\s*\\(', 'range()를 사용해 보세요']] }),
  p(W5, 3, '가운데 정렬 별 삼각형', `<p>높이 n을 입력받아(<code>"높이: "</code>) 아래처럼 <b>가운데 정렬</b>된 별 삼각형을 출력하세요. i번째 줄에는 별이 <code>2i - 1</code>개 있어요. (줄 끝에 공백은 넣지 않아요)</p>${IO}${ex('높이: 4\n   *\n  ***\n *****\n*******')}`,
    `n = int(input("높이: "))\nfor i in range(1, n + 1):\n    print(" " * (n - i) + "*" * (2 * i - 1))\n`, '<p>i번째 줄은 앞에 공백 <code>n - i</code>개 + 별 <code>2 * i - 1</code>개예요. 문자열에 정수를 곱하면 반복이에요.</p>', [INP(4), INP(1), INP(5)]),
  p(W5, 3, '소수 판별 (제곱근까지만 확인)', `<p>2 이상의 정수를 입력받아(<code>"2 이상의 정수: "</code>) <code>○ 소수</code> 또는 <code>○ 합성수</code>로 판별해 출력하세요. 약수 후보는 <b>√n까지만</b> 확인해도 충분해요 (<code>i * i &lt;= n</code>).</p>${IO}${ex('2 이상의 정수: 29\n29 소수')}`,
    `n = int(input("2 이상의 정수: "))\nis_prime = True\ni = 2\nwhile i * i <= n:\n    if n % i == 0:\n        is_prime = False\n        break\n    i += 1\nprint(n, "소수" if is_prime else "합성수")\n`, '<p>나누어떨어지는 수를 하나라도 찾으면 <code>break</code>로 바로 끝내요. 끝까지 못 찾으면 소수예요. 2와 3 같은 작은 수도 확인해 보세요.</p>', [INP(29), INP(28), INP(2), INP(97), INP(91)]),
  p(W5, 3, '숫자 맞히기 게임', `<p>비밀 숫자 <code>secret</code>이 주어져요. 숫자를 입력받아(<code>"숫자를 맞혀 보세요: "</code>) 비밀 숫자보다 크면 <code>너무 큽니다</code>, 작으면 <code>너무 작습니다</code>를 알려 주고, 맞히면 <code>정답! ○번 만에 맞혔어요</code>를 출력하고 끝내세요.</p>${IO}${ex('숫자를 맞혀 보세요: 3\n너무 작습니다\n숫자를 맞혀 보세요: 10\n너무 큽니다\n숫자를 맞혀 보세요: 7\n정답! 3번 만에 맞혔어요')}`,
    `tries = 0\nwhile True:\n    guess = int(input("숫자를 맞혀 보세요: "))\n    tries += 1\n    if guess > secret:\n        print("너무 큽니다")\n    elif guess < secret:\n        print("너무 작습니다")\n    else:\n        print(f"정답! {tries}번 만에 맞혔어요")\n        break\n`, '<p>시도 횟수를 세는 변수를 두고, 입력할 때마다 1씩 올려요. 맞히면 <code>break</code>.</p>',
    ['secret = 7\n' + INP(3, 10, 7), 'secret = 4\n' + INP(4), 'secret = 12\n' + INP(5, 20, 15, 12)]),
  p(W5, 4, '복리로 2배가 되는 데 걸리는 햇수', `<p>원금 <code>principal</code>원을 연 <code>rate</code>% <b>복리</b>로 예금해요. 원금이 처음으로 <b>2배 이상</b>이 되는 데 몇 년이 걸리는지 <code>while</code> 문으로 구하고, 그때의 금액(소수점 아래 버림)을 천 단위 쉼표로 <code>○년 후 ○원</code> 형태로 출력하세요. (1년마다 금액에 <code>(1 + rate/100)</code>을 곱해요)</p>${ex('15년 후 2,078,928원')}`,
    `amount = principal\nyears = 0\nwhile amount < principal * 2:\n    amount *= 1 + rate / 100\n    years += 1\nprint(f"{years}년 후 {int(amount):,}원")\n`, '<p>목표는 <code>amount &gt;= principal * 2</code>가 될 때까지 반복하는 거예요. 반복할 때마다 금액을 곱해 갱신하고 햇수를 1 올려요. 쉼표는 <code>{값:,}</code>.</p>',
    ['principal = 1000000\nrate = 5', 'principal = 2000000\nrate = 7', 'principal = 500000\nrate = 10']),

  // ================= 6장 =================
  p(W6, 3, '단어 순서 뒤집기', `<p>문장을 입력받아(<code>"문장: "</code>) <b>단어 단위</b>로 순서를 뒤집어 출력하세요. (글자를 뒤집는 것이 아니에요)</p>${IO}${ex('문장: Python is very fun\nfun very is Python')}`,
    `sentence = input("문장: ")\nwords = sentence.split()\nprint(" ".join(words[::-1]))\n`, '<p><code>split()</code>으로 단어 리스트를 만들고 <code>[::-1]</code>로 뒤집은 뒤 <code>" ".join(...)</code>으로 다시 이어요.</p>', [INP('Python is very fun'), INP('one'), INP('data science is fun')]),
  p(W6, 4, '로그인 로그 마스킹', `<p>한 줄 로그를 입력받아(<code>"로그: "</code>) 아래처럼 개인정보를 가려 출력하세요. 입력 형식은 <code>YYYY-MM-DD user=&lt;ID&gt; ip=&lt;A.B.C.D&gt;</code>예요.</p><ul><li><code>연도: </code> — 날짜에서 연도(YYYY)만</li><li><code>ID: </code> — <b>첫 2글자만 남기고</b> 나머지를 <code>*</code>로 (길이는 같게)</li><li><code>IP: </code> — 마지막 숫자만 <code>***</code>로 (10.3.5.77 → 10.3.5.***)</li></ul>${IO}${ex('로그: 2026-02-10 user=alice99 ip=10.3.5.77\n연도: 2026\nID: al*****\nIP: 10.3.5.***')}`,
    `line = input("로그: ")\ndate, uid, ip = line.split()\nyear = date.split("-")[0]\nuid = uid.split("=")[1]\nip = ip.split("=")[1]\nmasked = uid[:2] + "*" * (len(uid) - 2)\nparts = ip.split(".")\nprint("연도:", year)\nprint("ID:", masked)\nprint("IP:", ".".join(parts[:3] + ["***"]))\n`, '<p>① 공백으로 세 덩어리 → ② 각각 <code>=</code>나 <code>-</code>, <code>.</code>으로 쪼개기 → ③ 가려서 다시 <code>join</code>. 한 단계씩 변수에 담아 출력해 보며 만들어 보세요.</p>',
    [INP('2026-02-10 user=alice99 ip=10.3.5.77'), INP('2025-12-31 user=bob ip=192.168.0.1'), INP('2024-01-05 user=yuna_kim ip=8.8.4.200')]),
  p(W6, 3, '중복 글자 제거(순서 유지)', `<p>문자열을 입력받아(<code>"문자열: "</code>) 중복된 글자를 제거하되 <b>처음 나온 순서는 유지</b>한 결과를 출력하세요. (힌트: 결과 문자열을 비워 두고, 반복하면서 "결과에 없는 글자만" 붙여요)</p>${IO}${ex('문자열: banana\nban')}`,
    `text = input("문자열: ")\nresult = ""\nfor ch in text:\n    if ch not in result:\n        result += ch\nprint(result)\n`, '<p><code>ch not in result</code>로 이미 붙인 글자인지 확인해요. 문자열은 <code>+=</code>로 이어 붙일 수 있어요.</p>', [INP('banana'), INP('mississippi'), INP('abc'), INP('aaaa')]),
  p(W6, 3, '슬라이싱 여섯 가지', `<p>문자열 <code>s</code>가 주어져요. 다음을 순서대로 한 줄씩 출력하세요.</p><ol><li>첫 글자와 마지막 글자 (공백으로 구분해 한 줄)</li><li>처음 6글자</li><li>거꾸로 뒤집은 문자열</li><li>한 글자 건너 하나씩 뽑은 문자열</li><li>7번 인덱스부터 끝까지</li><li><code>"Pro"</code>가 처음 나오는 위치와 공백(<code>" "</code>)의 개수 (공백으로 구분해 한 줄, 없으면 <code>-1</code>)</li></ol>`,
    `print(s[0], s[-1])\nprint(s[:6])\nprint(s[::-1])\nprint(s[::2])\nprint(s[7:])\nprint(s.find("Pro"), s.count(" "))\n`, '<p>슬라이스 <code>[시작:끝:간격]</code>: 앞 6글자는 <code>s[:6]</code>, 뒤집기는 <code>s[::-1]</code>, 건너뛰기는 <code>s[::2]</code>, 7번부터 끝까지는 <code>s[7:]</code>. 위치는 <code>find</code>, 개수는 <code>count</code>.</p>',
    ['s = "Python Programming"', 's = "Data Science Project Lab"', 's = "Hello World"']),
  p(W6, 3, '전화번호 가공', `<p>변수 <code>phone</code>(예: <code>"010-1234-5678"</code>)이 주어져요. 다음 세 줄을 출력하세요.</p><ol><li>하이픈(<code>-</code>)을 제거한 번호</li><li>마지막 4자리</li><li>가운데 4자리를 <code>****</code>로 가린 번호 (<code>010-****-5678</code>)</li></ol>`,
    `print(phone.replace("-", ""))\nprint(phone[-4:])\nprint(phone[:4] + "****" + phone[8:])\n`, '<p><code>replace("-", "")</code>로 하이픈을 지우고, 뒤 4자리는 <code>[-4:]</code>, 가운데는 앞부분 + <code>"****"</code> + 뒷부분으로 이어요. (문자열은 바꿀 수 없으니 새로 만들어요)</p>',
    ['phone = "010-1234-5678"', 'phone = "010-9876-5432"', 'phone = "010-0000-1111"']),
  p(W6, 4, '이메일 분해하기', `<p>이메일을 입력받아(<code>"이메일: "</code>) 아래를 출력하세요. 이메일 아이디는 <code>이름.성</code> 형태예요.</p><ul><li><code>아이디: </code> — 아이디 전체를 대문자로</li><li><code>도메인: </code> — <code>@</code> 뒤쪽</li><li><code>성+이름: </code> — <b>성 이름</b> 순서로, 각각 첫 글자만 대문자</li></ul>${IO}${ex('이메일: gildong.hong@ewha.ac.kr\n아이디: GILDONG.HONG\n도메인: ewha.ac.kr\n성+이름: Hong Gildong')}`,
    `email = input("이메일: ")\nlocal, domain = email.split("@")\nfirst, last = local.split(".")\nprint("아이디:", local.upper())\nprint("도메인:", domain)\nprint("성+이름:", last.capitalize(), first.capitalize())\n`, '<p><code>split("@")</code>로 아이디와 도메인을 나누고, 아이디를 <code>split(".")</code>로 이름과 성으로 다시 나눠요. <code>capitalize()</code>는 첫 글자만 대문자로 바꿔요.</p>',
    [INP('gildong.hong@ewha.ac.kr'), INP('mina.kim@example.com'), INP('jun.park@univ.edu')]),
  p(W6, 3, '회문 판별', `<p>문장을 입력받아(<code>"문장: "</code>) <b>공백을 없애고 소문자로</b> 바꾼 뒤 앞뒤로 읽어도 같은지 판별해 <code>회문입니다</code> / <code>회문이 아닙니다</code>를 출력하세요.</p>${IO}${ex('문장: A man a plan a canal Panama\n회문입니다')}`,
    `sentence = input("문장: ")\ncleaned = sentence.replace(" ", "").lower()\nif cleaned == cleaned[::-1]:\n    print("회문입니다")\nelse:\n    print("회문이 아닙니다")\n`, '<p>정리한 문자열이 <code>[::-1]</code>(뒤집은 것)과 같은지 비교하면 돼요.</p>', [INP('A man a plan a canal Panama'), INP('Python'), INP('Never odd or even'), INP('abcba')]),
  p(W6, 3, '글자 종류별 개수 세기', `<p>문장을 입력받아(<code>"문장: "</code>) 대문자, 소문자, 숫자, 공백의 개수를 세어 <code>대문자 ○, 소문자 ○, 숫자 ○, 공백 ○</code>로 출력하세요.</p>${IO}${ex('문장: Hello World 2026\n대문자 2, 소문자 8, 숫자 4, 공백 2')}`,
    `text = input("문장: ")\nupper = lower = digit = space = 0\nfor ch in text:\n    if ch.isupper():\n        upper += 1\n    elif ch.islower():\n        lower += 1\n    elif ch.isdigit():\n        digit += 1\n    elif ch.isspace():\n        space += 1\nprint(f"대문자 {upper}, 소문자 {lower}, 숫자 {digit}, 공백 {space}")\n`, '<p>글자를 하나씩 보면서 <code>isupper()</code>, <code>islower()</code>, <code>isdigit()</code>, <code>isspace()</code>로 종류를 구별해 해당 개수를 1씩 올려요.</p>', [INP('Hello World 2026'), INP('Python 3'), INP('ABC abc 123 !?')]),
  p(W6, 4, '시저 암호', `<p>문장을 입력받아(<code>"문장: "</code>) <b>소문자만</b> 알파벳 순서로 3칸씩 뒤로 밀어 출력하세요. <code>z</code> 다음은 <code>a</code>로 돌아가고, 소문자가 아닌 글자(공백, 대문자, 숫자 등)는 그대로 두세요.</p>${IO}${ex('문장: hello world\nkhoor zruog')}`,
    `text = input("문장: ")\nresult = ""\nfor ch in text:\n    if "a" <= ch <= "z":\n        result += chr((ord(ch) - ord("a") + 3) % 26 + ord("a"))\n    else:\n        result += ch\nprint(result)\n`, '<p><code>ord(글자)</code>는 글자의 코드값, <code>chr(코드)</code>는 그 반대예요. <code>(번호 + 3) % 26</code>으로 z 다음에 a로 돌아가게 해요.</p>', [INP('hello world'), INP('xyz abc'), INP('Hi 5 z!')]),
];
