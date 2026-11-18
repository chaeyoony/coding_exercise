// 파이썬 워크북 1~6장 개념 퀴즈. 정답 번호는 빌드할 때 코드를 실제로 실행해서 자동으로 정한다(직접 적지 않는다).
//  - 중간고사 대비 ①~④: 시험에 나왔던 유형(OX, 출력 고르기, 오류 고르기, 빈칸 고르기)을 값과 문장만 바꿔 다시 만든 문제
//  - 7·9·10·11강 개념 퀴즈: 강의 개념을 묻는 같은 형식의 문제
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pre = code => `<pre class="out">${esc(code)}</pre>`;
const base = (category, level, title, desc, extra) => ({ track: 'python', category, level, title, quiz: true, desc, ...extra });
// OX: claim 은 True/False 를 출력하는 코드 (그 값이 "설명이 맞는가"와 같아야 한다)
const ox = (category, level, title, statement, claim, explain, hint, shown) => base(category, level, title,
  `<p>다음 설명이 맞는지 판단하세요.</p><p class="qstate">${statement}</p>`,
  { choices: ['참', '거짓'], verify: { claim }, code: shown ?? claim, explain, hint });
// 출력 고르기: choices 가 곧 실행 결과(한 줄). 여러 줄이면 outs 로 실제 출력을 따로 준다
const out = (category, level, title, question, code, choices, explain, hint, outs, vcode) => base(category, level, title,
  `<p>${question}</p>${pre(code)}`, { choices, verify: { outs: outs ?? choices, ...(vcode ? { code: vcode } : {}) }, code, explain, hint });
// 빈칸 고르기: template 의 {X} 자리에 보기를 넣고 실행한 결과가 expect 와 같은 보기가 정답
const fill = (category, level, title, question, template, choices, expect, explain, hint) => base(category, level, title,
  `<p>${question}</p>${pre(template.replace('{X}', '__________'))}`,
  { choices, verify: { codes: choices.map(c => template.replace('{X}', c)), expect }, code: template.replace('{X}', 'None   # 보기를 여기에 넣어 실행해 보세요'), explain, hint });
// 오류 고르기: 보기를 각각 실행해서 오류가 나는 것이 정답
const err = (category, level, title, question, choices, explain, hint, pre0 = '') => base(category, level, title,
  `<p>${question}</p>${pre0 ? pre(pre0) : ''}`,
  { choices, verify: { codes: choices.map(c => pre0 + c), expect: 'error' }, code: `${pre0}# 보기를 하나씩 실행해 보세요 (앞의 # 를 지우고 실행)\n${choices.map(c => '# ' + c).join('\n')}\n`, explain, hint });


// 개념 문제: 정답을 코드로 확인할 수 없는 서술형 보기. 맨 앞 보기가 정답이고, 보기 순서는 build 때 섞는다.
const mc = (category, level, title, question, choices, explain, hint, shown) => base(category, level, title,
  `<p>${question}</p>${shown ? pre(shown) : ''}`, { choices, verify: { manual: 0 }, explain, hint });
// 어떤 오류 이름이 나는 보기를 고르기: 보기를 각각 실행해서 예외 이름이 name 인 것이 정답
const indent = c => c.split('\n').map(l => '    ' + l).join('\n');
const errname = (category, level, title, question, choices, name, explain, hint, pre0 = '') => base(category, level, title,
  `<p>${question}</p>${pre0 ? pre(pre0) : ''}`,
  { choices, verify: { codes: choices.map(c => `${pre0}try:\n${indent(c)}\nexcept Exception as e:\n    print(type(e).__name__)`), expect: name },
    code: `${pre0}# 보기를 하나씩 실행해 보세요 (앞의 # 를 지우고 실행)\n${choices.map(c => '# ' + c.split('\n').join('\n# ')).join('\n')}\n`, explain, hint });
// 코드 보기 중 오류 없이 expect 를 출력하는 것을 고르기
const codeOut = (category, level, title, question, choices, expect, explain, hint) => base(category, level, title, `<p>${question}</p>`,
  { choices, verify: { codes: choices, expect }, code: `# 보기를 하나씩 실행해 보세요\n${choices.map(c => '# ' + c.split('\n').join('\n# ')).join('\n')}\n`, explain, hint });

const W1 = '워크북 1장 개념 퀴즈';
const W2 = '워크북 2장 개념 퀴즈';
const W3 = '워크북 3장 개념 퀴즈';
const W4 = '워크북 4장 개념 퀴즈';
const W5 = '워크북 5장 개념 퀴즈';
const W6 = '워크북 6장 개념 퀴즈';

export default [
  // ================= 1장 개념 =================
  mc(W1, 3, '알고리즘의 세 조건', '알고리즘은 <b>명확·효과적·유한</b>의 세 조건을 만족해야 한다. 아래 절차는 어느 조건을 어기는가?', ['유한성 (제한된 횟수의 단계 후에 끝나야 한다)', '명확성 (모호하지 않아야 한다)', '효과성 (각 단계가 실제로 실행 가능해야 한다)', '정확성 (항상 같은 결과를 내야 한다)', '단순성 (코드가 짧아야 한다)'],
    '<code>while True:</code>는 조건이 항상 참이라 영원히 끝나지 않아요. 알고리즘은 <b>유한한 단계 후에 반드시 끝나야</b> 하는데, 이 절차는 그렇지 않아요(유한성 위반).', '<p>"끝나는가?"를 물어보면 어떤 조건인지 알 수 있어요.', 'n = 1\nwhile True:\n    n = n + 1'),
  mc(W1, 2, '개발 과정에서 코딩은?', '소프트웨어 개발 과정은 <b>요구사항 명세 → 시스템 분석 → 시스템 설계 → ( ? ) → 테스트 → 배포 → 유지보수</b>이다. 우리가 코드를 작성하는 프로그래밍(코딩)은 어느 단계인가?', ['구현', '요구사항 명세', '시스템 분석', '시스템 설계', '유지보수'],
    '설계한 내용을 프로그래밍 언어로 실제 만드는 단계가 <b>구현</b>이에요. 코딩은 개발 과정 중 구현 단계에 해당해요.', '<p>설계를 "코드로 옮기는" 단계예요.'),
  mc(W1, 3, '폰 노이만 구조', '오늘날 대부분의 컴퓨터가 쓰는 <b>폰 노이만 구조</b>의 설명으로 알맞은 것은?', ['프로그램(명령어)도 데이터처럼 메모리에 저장해 두고, CPU가 하나씩 꺼내 실행한 뒤 결과를 다시 메모리에 쓴다', '프로그램은 CPU 안에만 저장하고, 데이터만 메모리에 저장한다', '프로그램은 하드디스크에서 읽으면서 직접 실행하며 메모리는 쓰지 않는다', '입력 장치가 계산을 대신하고 CPU는 화면에 출력만 한다', '운영체제가 있으면 메모리 없이도 계산할 수 있다'],
    '폰 노이만 구조의 핵심은 <b>프로그램과 데이터가 같이 메모리에 저장</b>된다는 점이에요. 그래서 <code>y = x + 3</code> 같은 코드도 메모리에서 꺼내 CPU가 계산한 뒤 결과를 다시 메모리에 저장해요.', '<p>"프로그램도 데이터처럼" 메모리에 있다는 점이 핵심이에요.'),
  err(W1, 3, '들여쓰기 오류가 나는 코드', '다음 코드를 각각 독립적으로 실행할 때, <b>들여쓰기 오류(IndentationError)가 발생하는 것</b>은?',
    ['if True:\nprint(1)', 'if True:\n    print(1)', 'for i in range(2):\n    print(i)', 'x = 1\nprint(x)', 'def f():\n    return 1'], '콜론(<code>:</code>)으로 끝나는 줄 다음에는 안쪽 줄을 <b>들여써야</b> 해요. 첫 번째 코드는 <code>if True:</code> 다음 줄이 들여쓰기가 없어서 <code>IndentationError</code>예요.', '<p>들여쓰기는 파이썬에서 "어디까지가 안쪽인지"를 정하는 문법이에요.'),
  out(W1, 3, '메모리와 CPU 흐름 따라가기', '다음 코드의 출력 결과로 알맞은 것은?', 'x = 5\ny = x + 3\nx = y * 2\nprint(x, y)', ['16 8', '10 8', '16 16', '5 8', '16 3'],
    '<code>y = 5 + 3 = 8</code>, 그다음 <code>x = 8 * 2 = 16</code>. <code>y</code>는 이미 계산된 값 8을 저장하고 있어서 x가 바뀌어도 변하지 않아요.', '<p>한 줄씩 변수에 어떤 값이 저장되는지 적어 보세요.'),

  // ================= 2장 개념 =================
  codeOut(W2, 3, 'NameError 없이 실행되는 코드', '다음 중 <b>오류 없이 <code>5</code>를 출력하는 코드</b>는?',
    ['print(total)\ntotal = 5', 'total = 5\nprint(Total)', 'total = 5\nprint(total)', 'total == 5\nprint(total)', 'print(tota1)\ntotal = 5'], '5',
    'NameError는 (1) 값을 넣기 전에 쓰거나 (2) 철자·<b>대소문자</b>가 다르거나 (3) 실행 순서가 바뀌었을 때 나요. 세 번째 코드만 넣은 뒤(<code>total = 5</code>) 같은 이름으로 읽어요.', '<p>변수 이름은 대소문자를 구분하고, 값을 넣은 <b>뒤</b>에만 쓸 수 있어요.'),
  codeOut(W2, 3, '변수 이름으로 쓸 수 있는 것', '다음 중 <b>변수 이름으로 쓸 수 있는 것</b>(오류 없이 대입되는 것)은?',
    ['2nd_score = 1', 'my-score = 1', 'class = 1', '_score2 = 1', 'total score = 1'], '',
    '변수 이름은 영문자·숫자·밑줄만 쓰고 <b>숫자로 시작할 수 없고</b>, 하이픈·공백은 안 되며, <code>class</code> 같은 <b>예약어</b>는 쓸 수 없어요. <code>_score2</code>만 가능해요.', '<p>규칙: 문자·숫자·밑줄, 숫자로 시작 금지, 예약어 금지.'),
  ox(W2, 3, '대문자 If는 예약어일까?', '<code>if</code>는 예약어라서 변수 이름으로 쓸 수 없지만, 대문자로 시작하는 <code>If</code>는 예약어가 아니라서 변수 이름으로 쓸 수 있다.',
    `If = 3\nprint(If == 3)`, '파이썬은 <b>대소문자를 구분</b>해요. 예약어는 <code>if</code>(소문자)뿐이라서 <code>If = 3</code>은 문법상 가능해요. 다만 헷갈리니 쓰지 않는 게 좋아요.', '<p><code>If = 3</code>을 실행해 보세요.'),
  ox(W2, 4, '내장 함수 이름 덮어쓰기', '<code>sum = 10</code>을 실행한 뒤에도 <code>sum([1, 2, 3])</code>은 <code>6</code>을 돌려준다.',
    `sum = 10\ntry:\n    r = sum([1, 2, 3]) == 6\nexcept TypeError:\n    r = False\nprint(r)`, '<code>sum = 10</code>은 내장 함수 이름 <code>sum</code>을 숫자 10으로 <b>덮어써요</b>. 그 뒤 <code>sum([1, 2, 3])</code>은 <code>TypeError: \'int\' object is not callable</code>이에요. 변수 이름으로 <code>sum</code>, <code>max</code>, <code>list</code> 같은 내장 이름을 쓰지 마세요.', '<p>변수 이름은 내장 함수 이름과 겹치지 않게 지어요 (예: <code>total</code>).'),
  out(W2, 3, 'type()으로 자료형 확인', '다음 코드의 출력 결과로 알맞은 것은?', 'print(type(3), type(3.0), type("3"), type(True), type(None))',
    ["<class 'int'> <class 'float'> <class 'str'> <class 'bool'> <class 'NoneType'>", "<class 'int'> <class 'int'> <class 'str'> <class 'bool'> <class 'NoneType'>", "<class 'int'> <class 'float'> <class 'int'> <class 'bool'> <class 'None'>", "<class 'int'> <class 'float'> <class 'str'> <class 'int'> <class 'NoneType'>", "<class 'float'> <class 'float'> <class 'str'> <class 'bool'> <class 'NoneType'>"],
    '<code>3</code>은 int, <code>3.0</code>은 float, <code>"3"</code>은 str, <code>True</code>는 bool, <code>None</code>은 NoneType이에요. 따옴표나 소수점이 있으면 자료형이 달라져요.', '<p>값의 모양(따옴표, 소수점)이 자료형을 정해요.'),
  out(W2, 4, 'bool은 정수처럼 계산된다', '다음 코드의 출력 결과로 알맞은 것은?', 'print(True + True, False * 5, int(True), True == 1, type(True + 1))',
    ["2 0 1 True <class 'int'>", "True 0 1 True <class 'bool'>", "2 False 1 True <class 'int'>", "2 0 True True <class 'bool'>", "2 0 1 False <class 'int'>"], '<code>bool</code>은 <code>int</code>의 한 종류라서 <code>True</code>는 1, <code>False</code>는 0처럼 계산돼요. <code>True + True = 2</code>, <code>True + 1</code>은 <code>int</code>.', '<p><code>True</code>는 1, <code>False</code>는 0으로 계산돼요.'),
  out(W2, 4, 'int()와 float()의 변환', '다음 코드의 출력 결과로 알맞은 것은?', 'print(int(3.99), int(-3.99), int("42"), float("3"), int(round(3.5)))',
    ['3 -3 42 3.0 4', '4 -4 42 3 4', '3 -4 42 3.0 4', '3 -3 42 3 3', '3 -3 "42" 3.0 4'], '<code>int()</code>는 소수점 아래를 <b>버려요</b>(0 쪽으로): 3.99→3, -3.99→-3. 문자열 <code>"42"</code>는 42, <code>float("3")</code>은 3.0, <code>round(3.5)</code>는 짝수 쪽 반올림으로 4.', '<p><code>int()</code>는 반올림이 아니라 <b>버림</b>이에요.'),
  errname(W2, 4, 'ValueError가 나는 변환', '다음 중 <b><code>ValueError</code>가 발생하는 것</b>은? (다른 보기는 오류가 없거나 다른 오류예요)',
    ['int("abc")', '"3" + 4', 'len(5)', 'int([1])', 'float(None)'], 'ValueError',
    '<code>int("abc")</code>는 자료형(문자열)은 맞지만 <b>값이 변환할 수 없어서</b> <code>ValueError</code>예요. 나머지는 자료형이 맞지 않아 <code>TypeError</code>(문자열 + 정수, 정수의 길이, 리스트나 None의 변환)예요.', '<p>TypeError = 자료형이 안 맞음, ValueError = 자료형은 맞는데 값이 안 맞음.'),
  out(W2, 3, '어떤 오류일까?', '다음 코드를 실행하면 발생하는 오류의 이름은?', 'total = 10\nprint(totl)', ['NameError', 'TypeError', 'ValueError', 'SyntaxError', 'IndexError'],
    '<code>totl</code>은 정의된 적 없는 이름(오타)이라 <code>NameError: name \'totl\' is not defined</code>예요.', '<p>"그런 이름을 모른다"는 오류예요.', undefined, 'total = 10\ntry:\n    print(totl)\nexcept Exception as e:\n    print(type(e).__name__)'),
  out(W2, 4, '대입할 때마다 자료형이 바뀐다', '다음 코드의 출력 결과로 알맞은 것은?', 'x = 5\nprint(type(x))\nx = x / 2\nprint(type(x))\nx = str(x)\nprint(type(x), x)',
    ["<class 'int'> 다음 줄 <class 'float'> 다음 줄 <class 'str'> 2.5", "<class 'int'> 다음 줄 <class 'int'> 다음 줄 <class 'str'> 2", "<class 'int'> 다음 줄 <class 'float'> 다음 줄 <class 'str'> 2", "<class 'int'> 다음 줄 <class 'float'> 다음 줄 <class 'float'> 2.5", "<class 'float'> 다음 줄 <class 'float'> 다음 줄 <class 'str'> 2.5"],
    '파이썬 변수는 대입할 때마다 <b>값의 자료형을 따라가요</b>. 5(int) → <code>5 / 2 = 2.5</code>(float) → <code>str(2.5)</code>인 <code>"2.5"</code>(str).', '<p>변수에는 자료형이 고정되어 있지 않고, 들어 있는 값이 자료형을 정해요.',
    ["<class 'int'>\n<class 'float'>\n<class 'str'> 2.5", "<class 'int'>\n<class 'int'>\n<class 'str'> 2", "<class 'int'>\n<class 'float'>\n<class 'str'> 2", "<class 'int'>\n<class 'float'>\n<class 'float'> 2.5", "<class 'float'>\n<class 'float'>\n<class 'str'> 2.5"]),
  out(W2, 3, '연속 대입', '다음 코드의 출력 결과로 알맞은 것은?', 'a = b = c = 4\na += 1\nb = b + 10\nprint(a, b, c)', ['5 14 4', '5 5 5', '14 14 14', '5 14 14', '4 4 4'], '<code>a = b = c = 4</code>는 세 이름에 같은 값 4를 붙여요. 정수는 불변이라 <code>a += 1</code>, <code>b = b + 10</code>은 각각 <b>그 이름만</b> 새 값에 연결해요. c는 그대로 4.', '<p>정수를 바꾸는 것이 아니라 이름이 다른 값을 가리키게 되는 거예요.'),

  // ================= 3장 개념 =================
  ox(W3, 3, 'input()으로 받은 숫자', '<code>n = input()</code>에 사용자가 <code>15</code>를 입력하면 <code>n + 1</code>은 <code>16</code>이다.',
    `input = lambda: "15"   # 키보드 입력을 흉내 냄\nn = input()\ntry:\n    r = (n + 1 == 16)\nexcept TypeError:\n    r = False\nprint(r)`, '<code>input()</code>은 항상 <b>문자열</b>을 돌려줘요. <code>"15" + 1</code>은 <code>TypeError</code>예요. 계산하려면 <code>int(n) + 1</code>처럼 바꿔야 해요.', '<p>입력은 숫자처럼 보여도 문자열이에요. <code>type(n)</code>을 찍어 보세요.'),
  out(W3, 3, 'print와 문자열 이어 붙이기', '다음 코드의 출력 결과로 알맞은 것은?', 'print("점수: " + str(90) + "점", "점수:", 90, "점")',
    ['점수: 90점 점수: 90 점', '점수: 90점 점수:90점', '점수: 90 점 점수: 90 점', '점수: 90점점수: 90점', '오류 발생'], '<code>+</code>는 문자열끼리 <b>붙여서</b> 한 문자열을 만들고, 쉼표로 준 여러 값은 <b>공백으로 이어서</b> 출력해요. 숫자는 <code>str()</code>로 바꿔야 문자열과 <code>+</code>할 수 있어요.', '<p><code>+</code>는 붙여서 하나로, 쉼표는 각각 출력(사이에 공백).'),
  out(W3, 3, 'sep와 end 조합', '다음 코드의 출력 결과로 알맞은 것은?', 'print("A" + "B", 3 * "C", sep="/", end="!")\nprint("D")', ['AB/CCC!D', 'AB/CCC! D', 'AB/CCC!\nD', 'A B/CCC!D', 'AB CCC!D'], '첫 <code>print</code>는 <code>sep="/"</code>로 값 사이를 잇고, 줄바꿈 대신 <code>end="!"</code>를 붙여서 같은 줄에 <code>D</code>가 이어져요.', '<p><code>end</code>가 기본값(줄바꿈)이 아니면 다음 출력이 같은 줄에 이어져요.',
    ['AB/CCC!D', 'AB/CCC! D', 'AB/CCC!\nD', 'A B/CCC!D', 'AB CCC!D']),
  out(W3, 4, '% 서식의 폭과 정렬', '다음 코드의 출력 결과로 알맞은 것은?', 'print("[%5d][%-5d][%05d][%5.1f]" % (42, 42, 42, 3.14159))',
    ['[   42][42   ][00042][  3.1]', '[42   ][   42][00042][3.1  ]', '[   42][   42][00042][  3.1]', '[   42][42   ][     42][  3.1]', '[   42][42   ][00042][3.14159]'], '<code>%5d</code>는 폭 5 오른쪽 정렬, <code>%-5d</code>는 <b>왼쪽 정렬</b>, <code>%05d</code>는 0으로 채움, <code>%5.1f</code>는 폭 5에 소수 한 자리예요.', '<p><code>-</code>는 왼쪽 정렬, <code>0</code>은 0 채우기.'),
  out(W3, 3, 'str.format의 번호와 이름', '다음 코드의 출력 결과로 알맞은 것은?', 'print("{0}-{1}-{0}".format("a", "b"), "{x}+{y}".format(y=2, x=1))', ['a-b-a 1+2', 'a-b-b 1+2', 'a-b-a 2+1', 'a-b-a x+y', 'b-a-b 1+2'], '<code>{0}</code>, <code>{1}</code>은 <code>format</code>에 준 값의 <b>순서</b>(같은 번호는 여러 번 쓸 수 있음), <code>{x}</code>는 <b>이름</b>으로 찾아서 채워요.', '<p><code>{번호}</code>는 0부터, <code>{이름}</code>은 <code>이름=값</code>으로 넘겨요.'),
  errname(W3, 4, 'format 인수가 모자라면', '다음 중 <b><code>IndexError</code>가 발생하는 것</b>은?', ['"{} {}".format(1)', '"{} {}".format(1, 2)', '"{0} {0}".format(1)', '"{a}".format(a=1)', '"{}".format(1, 2)'], 'IndexError',
    '자리 표시가 2개인데 값이 1개뿐이면 채울 값이 없어서 <code>IndexError</code>예요. 값이 남는 것(<code>"{}".format(1, 2)</code>)은 오류가 아니에요.', '<p>자리 표시 개수 &gt; 값의 개수면 오류예요.'),
  out(W3, 5, 'f-string 서식 종합', '다음 코드의 출력 결과로 알맞은 것은?', 'x = 1234567.891\nprint(f"{x:>14,.2f}|{x:,.0f}|{x:.2e}")', ['  1,234,567.89|1,234,568|1.23e+06', '1,234,567.89|1,234,568|1.23e+06', '  1,234,567.89|1,234,567|1.23e+06', '  1234567.89|1234568|1.23e+06', '  1,234,567.89|1,234,568|1.234568e+06'], '<code>&gt;14,.2f</code>는 폭 14 오른쪽 정렬 + 천 단위 쉼표 + 소수 둘째 자리, <code>,.0f</code>는 소수 없이 반올림, <code>.2e</code>는 지수 표기(소수 둘째 자리).', '<p>f-string 서식은 <code>{값:[정렬][폭][,][.자릿수][형식]}</code> 순서예요.'),
  out(W3, 4, '문자열 정렬 메소드', '다음 코드의 출력 결과로 알맞은 것은?', 's = "ewha"\nprint(s.rjust(8, "*"), s.ljust(8, "-"), s.center(9, "."), s.zfill(6))', ['****ewha ewha---- ...ewha.. 00ewha', '****ewha ewha---- ..ewha... 00ewha', 'ewha**** ----ewha ...ewha.. ewha00', '****ewha ewha---- ...ewha.. ewha00', '***ewha* ewha---- ...ewha.. 00ewha'], '<code>rjust</code>는 오른쪽 정렬(앞을 채움), <code>ljust</code>는 왼쪽 정렬(뒤를 채움), <code>center</code>는 가운데(홀수 남는 칸은 왼쪽에 하나 더), <code>zfill</code>은 앞을 0으로 채워요.', '<p><code>rjust</code> = 글자를 오른쪽에 붙임(앞에 채움).'),

  // ================= 4장 개념 =================
  out(W4, 4, '실수는 ==로 비교하지 마세요', '다음 코드의 출력 결과로 알맞은 것은?', 'print(0.1 + 0.2 == 0.3, abs(0.1 + 0.2 - 0.3) < 1e-9, round(0.1 + 0.2, 2) == 0.3, 3 * 0.1 == 0.3)', ['False True True False', 'True True True True', 'False False True False', 'False True False False', 'True True True False'], '소수는 2진수로 정확히 저장되지 않아 <code>0.1 + 0.2</code>는 0.30000000000000004예요. 그래서 <code>==</code> 비교는 False, <b>차이가 아주 작은지</b> 보거나 <code>round()</code>로 맞춰 비교해야 해요.', '<p>실수 비교는 "충분히 가까운가?"로 해요.'),
  out(W4, 5, 'round의 5 처리', '다음 코드의 출력 결과로 알맞은 것은?', 'print(round(0.5), round(1.5), round(2.5), round(3.14159, 3), round(-0.5))', ['0 2 2 3.142 0', '1 2 3 3.142 -1', '0 2 3 3.142 0', '1 2 2 3.141 -1', '0 2 2 3.142 -0'], '파이썬의 <code>round()</code>는 정확히 .5인 값을 <b>가장 가까운 짝수</b>로 보내요: 0.5→0, 1.5→2, 2.5→2, -0.5→0. "5이면 올림"이 아니에요.', '<p>.5는 짝수 쪽으로(은행가 반올림).'),
  out(W4, 4, '우선순위와 거듭제곱', '다음 코드의 출력 결과로 알맞은 것은?', 'print(2 + 3 * -4 ** 2, (2 ** 2) ** 3, 2 ** 2 ** 3, 7 - 2 * 3 // 2 % 2)', ['-46 64 256 6', '46 64 64 6', '-46 64 64 4', '-46 256 64 6', '-98 64 256 6'], '<code>-4 ** 2</code>는 <code>-(4 ** 2) = -16</code>이라 <code>2 + 3 * -16 = -46</code>. <code>**</code>는 <b>오른쪽부터</b> 계산해서 <code>2 ** 2 ** 3 = 2 ** 8 = 256</code>. 마지막은 <code>2 * 3 // 2 % 2 = 3 % 2 = 1</code>, <code>7 - 1 = 6</code>.', '<p>우선순위: <code>**</code> &gt; 단항 <code>-</code>(<code>**</code> 왼쪽일 때는 <code>**</code>가 먼저) &gt; <code>* / // %</code> &gt; <code>+ -</code>.'),
  out(W4, 4, '나눗셈 연산자의 차이', '다음 코드의 출력 결과로 알맞은 것은?', 'print(10 / 4 * 2, 10 // 4 * 2, 10 % 4 * 2, -10 // 4, 10 // -4)', ['5.0 4 4 -3 -3', '5 4 4 -2 -2', '5.0 4 4 -2 -3', '5.0 5 4 -3 -3', '5.0 4 2 -3 -3'], '<code>/</code>는 실수 2.5라 <code>2.5 * 2 = 5.0</code>, <code>//</code>는 몫(2)이라 <code>2 * 2 = 4</code>, <code>%</code>는 나머지(2)이라 4. 음수의 <code>//</code>는 <b>내림</b>이라 -2.5 → -3.', '<p><code>/</code>(실수), <code>//</code>(내림 몫), <code>%</code>(나머지).'),
  out(W4, 4, '관계·논리 연산 종합', '다음 코드의 출력 결과로 알맞은 것은?', 'print(10 > 5 and 3 > 4, 10 > 5 or 3 > 4, not (10 > 5), 5 == 5.0, "5" == 5, "a" < "b" < "c", 1 < 2 < 3 < 2)', ['False True False True False True False', 'False True False False False True True', 'True True False True False True False', 'False True True True False True False', 'False True False True True True False'], '<code>5 == 5.0</code>은 값이 같아 True, <code>"5" == 5</code>는 문자열과 정수라 False. 연결 비교 <code>1 &lt; 2 &lt; 3 &lt; 2</code>는 마지막 <code>3 &lt; 2</code>가 거짓이라 False.', '<p>파이썬은 <code>a &lt; b &lt; c</code>처럼 비교를 이어 쓸 수 있어요(각 쌍이 모두 참이어야 True).'),
  out(W4, 3, '복합 연산자', '다음 코드의 출력 결과로 알맞은 것은?', 'x = 12\nx -= 2\nx *= 3\nx //= 4\nx **= 2\nx %= 5\nprint(x)', ['4', '0', '9', '2', '49'], '12 → 10 → 30 → <code>30 // 4 = 7</code> → <code>7 ** 2 = 49</code> → <code>49 % 5 = 4</code>.', '<p>한 줄씩 값을 적어 가세요. <code>x //= 4</code>는 <code>x = x // 4</code>예요.'),
  out(W4, 4, 'bool() 변환', '다음 코드의 출력 결과로 알맞은 것은?', 'print(bool(0), bool(0.0), bool(""), bool(" "), bool([]), bool("False"), bool(None))', ['False False False True False True False', 'False False False False False False False', 'False False True True False True False', 'False False False True False False False', 'False True False True False True False'], '"비어 있거나 0이면 False"예요. 빈 문자열 <code>""</code>은 False지만 공백 <code>" "</code>이나 글자 <code>"False"</code>가 들어 있으면 <b>비어 있지 않아서 True</b>예요.', '<p>문자열은 내용이 아니라 "비어 있는지"만 봐요.'),
  out(W4, 3, '조건의 순서가 중요하다', '다음 코드의 출력 결과로 알맞은 것은?', 'n = 12\nif n % 2 == 0:\n    print("2의 배수")\nelif n % 3 == 0:\n    print("3의 배수")\nelif n % 6 == 0:\n    print("6의 배수")\nelse:\n    print("기타")', ['2의 배수', '3의 배수', '6의 배수', '기타', '2의 배수 그리고 6의 배수'], '<code>if-elif-else</code>는 위에서부터 검사해 <b>처음 참인 하나만</b> 실행해요. 12는 첫 조건(2의 배수)이 참이라 거기서 끝나고, 6의 배수 조건에는 도달하지 못해요. 더 좁은 조건(6의 배수)을 <b>먼저</b> 검사해야 해요.', '<p>더 구체적인 조건을 앞에 두어야 해요.'),
  fill(W4, 4, '윤년 조건식', '연도 <code>year</code>가 <b>윤년</b>(4의 배수이면서 100의 배수가 아니거나, 400의 배수)일 때만 <code>True</code>가 되는 식은?',
    'import calendar\nleap = lambda year: ({X})\nprint(all(leap(y) == calendar.isleap(y) for y in range(1, 2500)))',
    ['year % 4 == 0 and year % 100 != 0 or year % 400 == 0', 'year % 4 == 0 or year % 100 != 0 and year % 400 == 0', 'year % 4 == 0 and (year % 100 != 0 or year % 400 != 0)', 'year % 400 == 0 and year % 4 == 0', 'year % 4 == 0 and year % 100 == 0 or year % 400 == 0'], 'True',
    '<code>and</code>가 <code>or</code>보다 먼저 계산돼요. "<code>(4의 배수 and 100의 배수 아님)</code> <b>or</b> <code>400의 배수</code>"가 윤년 조건이에요.', '<p>2000은 윤년, 2100은 평년, 2028은 윤년인지 대입해 보세요.'),
  out(W4, 3, 'elif 체인 읽기', '다음 코드의 출력 결과로 알맞은 것은?', 'age = 17\nmember = True\nif age >= 19:\n    print("A")\nelif age >= 13 and member:\n    print("B")\nelif age >= 13:\n    print("C")\nelse:\n    print("D")', ['B', 'A', 'C', 'D', 'B 그리고 C'], '17은 19 이상이 아니라 첫 조건이 거짓이고, <code>age &gt;= 13 and member</code>가 참이라 B를 출력하고 끝나요.', '<p>위에서부터 참이 되는 첫 분기만 실행돼요.'),

  // ================= 5장 개념 =================
  out(W5, 3, 'range 세 가지 모양', '다음 코드의 출력 결과로 알맞은 것은?', 'for i in range(2, 10, 3):\n    print(i, end=" ")\nprint()\nfor i in range(10, 0, -3):\n    print(i, end=" ")\nprint()\nfor i in range(5, 5):\n    print("never")\nprint("end")',
    ['2 5 8 / 10 7 4 1 / end', '2 5 8 / 10 7 4 / end', '2 5 8 10 / 10 7 4 1 / end', '2 5 8 / 10 7 4 1 / never end', '3 6 9 / 10 7 4 1 / end'], '<code>range(2, 10, 3)</code>은 2, 5, 8. <code>range(10, 0, -3)</code>은 10, 7, 4, 1(끝값 0 제외). <code>range(5, 5)</code>는 비어 있어서 반복이 한 번도 일어나지 않아요.', '<p>끝값은 포함하지 않고, 시작과 끝이 같으면 빈 범위예요.',
    ['2 5 8\n10 7 4 1\nend', '2 5 8\n10 7 4\nend', '2 5 8 10\n10 7 4 1\nend', '2 5 8\n10 7 4 1\nnever\nend', '3 6 9\n10 7 4 1\nend']),
  out(W5, 3, '중첩 for의 실행 순서', '다음 코드의 출력 결과로 알맞은 것은?', 'for i in range(2):\n    for j in range(3):\n        print(i, j, end="; ")', ['0 0; 0 1; 0 2; 1 0; 1 1; 1 2;', '0 0; 1 0; 0 1; 1 1; 0 2; 1 2;', '0 0; 0 1; 1 0; 1 1; 2 0; 2 1;', '0 0; 0 1; 0 2;', '0 1; 0 2; 0 3; 1 1; 1 2; 1 3;'], '바깥 반복이 한 번 돌 때마다 안쪽 반복이 <b>처음부터 끝까지</b> 돌아요. i=0일 때 j=0, 1, 2, 그다음 i=1일 때 j=0, 1, 2.', '<p>바깥 한 번 = 안쪽 전부.'),
  out(W5, 3, 'continue로 건너뛰며 더하기', '다음 코드의 출력 결과로 알맞은 것은?', 'total = 0\nfor n in range(1, 11):\n    if n % 3 == 0:\n        continue\n    total += n\nprint(total)', ['37', '55', '18', '45', '27'], '1~10의 합 55에서 3의 배수(3, 6, 9)의 합 18을 뺀 37이에요. <code>continue</code>는 그 차례의 나머지 코드를 건너뛰어 더하지 않아요.', '<p><code>continue</code> = 이번 차례만 건너뛰기.'),
  out(W5, 3, 'while로 팩토리얼', '다음 코드의 출력 결과로 알맞은 것은?', 'n = 5\nf = 1\nwhile n > 1:\n    f *= n\n    n -= 1\nprint(f, n)', ['120 1', '120 0', '24 1', '120 5', '5 120'], '5 × 4 × 3 × 2 = 120을 곱하고, n이 1이 되는 순간 조건이 거짓이 되어 멈춰요. 그래서 f는 120, n은 1이에요.', '<p>반복할 때마다 n이 줄어드는 것을 따라가 보세요.'),
  out(W5, 4, '피보나치 수열', '다음 코드의 출력 결과로 알맞은 것은?', 'a, b = 0, 1\nfor _ in range(7):\n    a, b = b, a + b\nprint(a, b)', ['13 21', '8 13', '21 34', '13 8', '21 13'], '<code>a, b = b, a + b</code>를 7번 하면 (a, b)는 (1,1) → (1,2) → (2,3) → (3,5) → (5,8) → (8,13) → (13,21).', '<p>한 줄에서 오른쪽을 모두 계산한 뒤 왼쪽에 넣는 점이 중요해요.'),
  out(W5, 4, '변수 이름 sum의 함정', '다음 코드의 마지막 줄(<code>print(sum([1, 2]))</code>)을 실행하면 발생하는 오류의 이름은?', 'sum = 0\nfor i in range(1, 4):\n    sum += i\nprint(sum)\nprint(sum([1, 2]))', ['TypeError', 'NameError', 'ValueError', 'SyntaxError', 'IndexError'],
    '앞에서 <code>sum = 0</code>으로 내장 함수 이름을 <b>정수로 덮어썼기</b> 때문에 <code>sum([1, 2])</code>는 "정수를 함수처럼 호출"해서 <code>TypeError: \'int\' object is not callable</code>이에요.', '<p>변수 이름으로 내장 함수 이름(<code>sum</code>, <code>max</code> 등)을 쓰지 마세요.', undefined,
    'sum = 0\nfor i in range(1, 4):\n    sum += i\nprint(sum)\ntry:\n    print(sum([1, 2]))\nexcept Exception as e:\n    print(type(e).__name__)'.replace('print(sum)\n', '')),
  mc(W5, 3, 'for와 while 선택하기', '다음 중 <b><code>while</code> 문이 더 알맞은</b> 상황은?', ['사용자가 0을 입력할 때까지 메뉴를 계속 보여 준다', '1부터 100까지 더한다', '리스트의 원소를 하나씩 출력한다', '구구단 9단을 출력한다', '문자열의 글자를 하나씩 센다'],
    '<b>반복 횟수를 미리 모르고 조건에 따라</b> 끝나는 경우는 <code>while</code>이 알맞아요. 횟수가 정해져 있거나 원소를 하나씩 도는 경우는 <code>for</code>가 더 간단해요.', '<p>"몇 번 돌지 모르겠다 → while", "정해진 범위/원소 → for".'),

  // ================= 6장 개념 =================
  mc(W6, 3, '군집 자료형 구별', '다음 설명에 해당하는 자료형은? "<b>값들을 중복 없이 모으며, 순서(인덱스)가 없다</b>"', ['집합(set)', '문자열(str)', '리스트(list)', '튜플(tuple)', '딕셔너리(dict) 전체'],
    '집합은 <b>중복을 허용하지 않고 순서가 없어요</b>. 문자열·리스트·튜플은 순서(인덱스)가 있고, 딕셔너리는 키로 값을 찾아요.', '<p>중복 제거에 자주 쓰이는 자료형이에요.'),
  out(W6, 3, '문자열 연산', '다음 코드의 출력 결과로 알맞은 것은?', 's = "ab"\nprint(s + "cd", s * 3, "b" in s, "ba" in s, len(s * 2))', ['abcd ababab True False 4', 'abcd ababab True True 4', 'ab cd ababab True False 4', 'abcd 6 True False 4', 'abcd ababab True False 2'], '<code>+</code>는 이어 붙이기, <code>*</code>는 반복, <code>in</code>은 <b>부분 문자열이 연속으로 들어 있는지</b> 검사해요(<code>"ba"</code>는 없음). <code>len("abab")</code>는 4.', '<p>문자열 + 문자열, 문자열 * 정수만 가능해요.'),
  out(W6, 4, '인덱싱과 슬라이싱', '다음 코드의 출력 결과로 알맞은 것은?', 'w = "Python"\nprint(w[0], w[-1], w[2:4], w[:2] + w[-2:], w[::2], w[::-1][:3])', ['P n th Pyon Pto noh', 'P n yt Pyon Pto noh', 'P n th Pyon yhn noh', 'P n th Pyno Pto noh', 'P o th Pyon Pto noh'], '<code>w[2:4]</code>는 "th", <code>w[:2] + w[-2:]</code>는 "Py" + "on", <code>w[::2]</code>는 한 칸 건너뛰어 "Pto", <code>w[::-1][:3]</code>은 뒤집은 "nohtyP"의 앞 3글자 "noh".', '<p>P0 y1 t2 h3 o4 n5 로 적어 두고 따라가세요.'),
  err(W6, 3, '문자열은 바꿀 수 없다', '다음 코드를 각각 실행할 때(<code>s = "abc"</code>), <b>오류가 발생하는 것</b>은?', ['s[0] = "X"', 's = "X" + s[1:]', 't = s.replace("a", "X")', 't = list(s)\nt[0] = "X"', 's += "d"'],
    '문자열은 <b>immutable(불변)</b>이라 인덱스로 글자를 바꾸면 <code>TypeError: \'str\' object does not support item assignment</code>예요. 바꾸려면 슬라이싱·<code>replace</code>로 <b>새 문자열을 만들거나</b> 리스트로 바꿔 수정해요.', '<p>문자열은 새로 만들어서 다시 이름에 붙이는 방식으로 "바꿔요".', 's = "abc"\n'),
  out(W6, 4, '메소드는 원본을 바꾸지 않는다', '다음 코드의 출력 결과로 알맞은 것은?', 's = " Hello "\nt = s.strip().upper()\nprint(repr(s), t, len(s))', ["' Hello ' HELLO 7", "'Hello' HELLO 5", "' HELLO ' HELLO 7", "' Hello ' HELLO 5", "'Hello' HELLO 7"], '문자열 메소드는 <b>새 문자열을 돌려줄 뿐 원본을 바꾸지 않아요</b>. <code>s</code>는 그대로 <code>" Hello "</code>(길이 7)이고 <code>t</code>만 <code>"HELLO"</code>예요.', '<p>메소드 결과를 변수에 담지 않으면 원본은 그대로예요.'),
  out(W6, 4, 'find, count, replace', '다음 코드의 출력 결과로 알맞은 것은?', 's = "banana"\nprint(s.find("n"), s.find("x"), s.count("an"), s.replace("an", "AN", 1), s.index("n"))', ['2 -1 2 bANana 2', '2 -1 2 bANANa 2', '3 -1 2 bANana 3', '2 0 2 bANana 2', '2 -1 3 bANana 2'], '<code>find("n")</code>은 처음 위치 2, 없으면 -1. <code>count("an")</code>은 겹치지 않게 2번. <code>replace("an", "AN", 1)</code>은 <b>처음 1개만</b> 바꿔 <code>bANana</code>. <code>index</code>는 <code>find</code>와 같지만 없으면 오류.', '<p>b0 a1 n2 a3 n4 a5.'),
  errname(W6, 4, 'find와 index의 차이', '다음 중 <b><code>ValueError</code>가 발생하는 것</b>은? (<code>s = "banana"</code>)', ['s.index("x")', 's.find("x")', 's.count("x")', 's.replace("x", "y")', 's.startswith("x")'], 'ValueError',
    '<code>find</code>는 없으면 <code>-1</code>을 돌려주지만, <code>index</code>는 없으면 <code>ValueError: substring not found</code>를 일으켜요. 나머지는 오류 없이 값을 돌려줘요.', '<p>"없을 때 -1을 주는가, 오류를 내는가"가 차이예요.', 's = "banana"\n'),
  out(W6, 4, '확장자 걸러내기', '다음 코드의 출력 결과로 알맞은 것은?', 'names = ["a.py", "b.txt", "c.PY", "d.pyc"]\nprint([n for n in names if n.lower().endswith(".py")])', ["['a.py', 'c.PY']", "['a.py']", "['a.py', 'c.PY', 'd.pyc']", "['a.py', 'b.txt', 'c.PY']", "['c.PY']"], '<code>lower()</code>로 소문자로 바꾼 뒤 <code>endswith(".py")</code>를 검사해서, 대소문자와 상관없이 <code>.py</code>로 <b>끝나는</b> 파일만 남아요. <code>d.pyc</code>는 <code>.pyc</code>로 끝나서 제외.', '<p>검사에는 소문자 복사본을 쓰고, 결과에는 원래 이름을 남겨요.'),
  out(W6, 4, '문자열의 대소 비교', '다음 코드의 출력 결과로 알맞은 것은?', 'print("A" < "a", "가" < "나", "Z" < "a", ord("A"), chr(97), "apple" < "apricot")', ['True True True 65 a True', 'True True False 65 a True', 'False True True 65 a True', 'True True True 97 A True', 'True True True 65 a False'], '문자열은 <b>문자 코드값</b>으로 비교해요. <code>ord("A") = 65</code>, <code>"a"</code>는 97이라 대문자가 더 작아요. <code>"apple"</code>과 <code>"apricot"</code>은 세 번째 글자 <code>p</code>와 <code>r</code>에서 갈려 apple이 작아요.', '<p><code>ord()</code>는 글자 → 코드, <code>chr()</code>는 코드 → 글자.'),
];
