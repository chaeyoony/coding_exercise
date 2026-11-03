// 파이썬 프로젝트 문제: 배운 문법(함수·딕셔너리·클래스·예외·표준 라이브러리 등)을 조합해서 작은 프로그램을 만든다.
// 채점은 만든 함수·클래스를 불러서 쓰는 식(테스트)으로 하고, 숨은 보조 함수 run_ops / raises / err_msg 를 쓴다.
const P1 = '프로젝트 ① 텍스트·데이터 처리';
const P2 = '프로젝트 ② 게임·시뮬레이션';
const P3 = '프로젝트 ③ 시스템 만들기';

const SETUP = `def run_ops(obj, steps):
    out = []
    for step in steps:
        name, *args = step
        if name == "attr":
            out.append(getattr(obj, args[0]))
        elif name == "set":
            setattr(obj, args[0], args[1])
        else:
            r = getattr(obj, name)(*args)
            if r is not None:
                out.append(r)
    return out


def raises(fn):
    try:
        fn()
    except Exception as e:
        return type(e).__name__
    return None


def err_msg(fn):
    try:
        fn()
    except Exception as e:
        return str(e)
    return None
`;

const t = (call, expected, visible = false) => ({ call, expected, visible });
const V = (...xs) => xs.map((x, i) => ({ ...x, visible: i < 2 }));
const w = (category, level, title, desc, starter, solution, hint, tests) => ({
  track: 'python', category, level, title, desc, starter, solution, hint, tests: V(...tests), setup: SETUP,
});
const NOTE = '<p class="muted">채점 방식: 만든 클래스로 객체를 만들고 메서드를 차례로 불러 보며 확인해요. (<code>[["메서드", 인수…]]</code>)</p>';

export default [
  // ================= 프로젝트 ① 텍스트·데이터 처리 =================
  w(P1, 3, '[프로젝트] 글 분석기', `<p>글 전체를 분석하는 함수 <code>analyze_text(text, n)</code>을 만드세요. <b>딕셔너리 하나</b>를 돌려줘요.</p>
<ul><li><code>"words"</code> — 전체 단어 수</li><li><code>"unique"</code> — 서로 다른 단어의 수</li><li><code>"top"</code> — 가장 많이 나온 단어 상위 <code>n</code>개를 <code>[단어, 횟수]</code> 리스트로 (횟수가 같으면 먼저 나온 단어가 앞)</li></ul>
<p>규칙: <b>소문자로 통일</b>하고, 문장부호(<code>. , ! ? ; : " ' ( )</code>)는 <b>없애고</b> 공백으로 나눠요.</p>
<p>예: <code>analyze_text("The cat. The dog! the end?", 2)</code> → <code>{"words": 6, "unique": 4, "top": [["the", 3], ["cat", 1]]}</code></p>`,
    `def analyze_text(text, n):\n    pass\n`,
    `import re\nfrom collections import Counter\n\n\ndef analyze_text(text, n):\n    cleaned = re.sub(r"[.,!?;:\\"'()]", "", text.lower())\n    words = cleaned.split()\n    counts = Counter(words)\n    return {"words": len(words), "unique": len(counts), "top": [[w, c] for w, c in counts.most_common(n)]}\n`,
    '<p>① 소문자 + 문장부호 제거 → ② <code>split()</code> → ③ <code>Counter</code>로 개수 세기 → ④ 결과 딕셔너리로 정리. 각 단계를 따로 확인하며 만들어 보세요.</p>',
    [t('analyze_text("The cat. The dog! the end?", 2)', { words: 6, unique: 4, top: [['the', 3], ['cat', 1]] }), t('analyze_text("a b a", 1)', { words: 3, unique: 2, top: [['a', 2]] }), t('analyze_text("", 2)', { words: 0, unique: 0, top: [] }), t('analyze_text("Hi, hi! HI?", 1)', { words: 3, unique: 1, top: [['hi', 3]] })]),
  w(P1, 3, '[프로젝트] 로그 분석기', `<p>서버 로그를 분석하는 함수 <code>parse_log(lines)</code>를 만드세요. 각 줄은 <code>"날짜 시각 레벨 메시지"</code> 형태예요. 예: <code>"2024-03-01 10:01 ERROR db failed"</code> (메시지에는 공백이 있을 수 있어요)</p>
<p>딕셔너리를 돌려줘요.</p><ul><li><code>"counts"</code> — 레벨별 줄 수 딕셔너리 (키는 <b>알파벳 순</b>)</li><li><code>"errors"</code> — 레벨이 <code>ERROR</code>인 줄의 <b>메시지</b> 리스트 (나온 순서)</li></ul>`,
    `def parse_log(lines):\n    pass\n`,
    `def parse_log(lines):\n    counts = {}\n    errors = []\n    for line in lines:\n        date, time, level, message = line.split(" ", 3)\n        counts[level] = counts.get(level, 0) + 1\n        if level == "ERROR":\n            errors.append(message)\n    return {"counts": dict(sorted(counts.items())), "errors": errors}\n`,
    '<p><code>line.split(" ", 3)</code> 은 공백으로 <b>최대 3번만</b> 잘라서 메시지의 공백은 그대로 남겨 줘요.</p>',
    [t('parse_log(["2024-03-01 10:00 INFO start", "2024-03-01 10:01 ERROR db failed", "2024-03-01 10:02 ERROR disk is full", "2024-03-01 10:03 WARN slow"])', { counts: { ERROR: 2, INFO: 1, WARN: 1 }, errors: ['db failed', 'disk is full'] }), t('parse_log([])', { counts: {}, errors: [] }), t('parse_log(["2024-01-01 00:00 INFO a"])', { counts: { INFO: 1 }, errors: [] }), t('parse_log(["d t ERROR x y z"])["errors"]', ['x y z'])]),
  w(P1, 3, '[프로젝트] CSV 읽기', `<p>CSV 형태의 문자열을 읽어 <b>딕셔너리의 리스트</b>로 돌려주는 함수 <code>parse_csv(text)</code>를 만드세요.</p><ul><li>첫 줄은 <b>머리글(열 이름)</b>이에요</li><li>값이 <b>정수 모양</b>(예: <code>"20"</code>, <code>"-5"</code>)이면 <code>int</code>로, 아니면 문자열 그대로 둬요</li><li>빈 줄은 건너뛰어요. 데이터 줄이 없으면 빈 리스트예요</li></ul>
<p>예: <code>"name,age\\nAnn,20\\nBo,x"</code> → <code>[{"name": "Ann", "age": 20}, {"name": "Bo", "age": "x"}]</code></p>`,
    `def parse_csv(text):\n    pass\n`,
    `def parse_csv(text):\n    lines = [ln for ln in text.split("\\n") if ln.strip()]\n    if not lines:\n        return []\n    header = lines[0].split(",")\n    rows = []\n    for ln in lines[1:]:\n        values = ln.split(",")\n        row = {}\n        for key, v in zip(header, values):\n            row[key] = int(v) if v.lstrip("-").isdigit() else v\n        rows.append(row)\n    return rows\n`,
    '<p>정수 모양 확인: <code>v.lstrip("-").isdigit()</code>. <code>zip(header, values)</code> 로 열 이름과 값을 짝지어 딕셔너리를 만들어요.</p>',
    [t('parse_csv("name,age\\nAnn,20\\nBo,x")', [{ name: 'Ann', age: 20 }, { name: 'Bo', age: 'x' }]), t('parse_csv("a\\n1\\n2")', [{ a: 1 }, { a: 2 }]), t('parse_csv("")', []), t('parse_csv("x,y\\n")', []), t('parse_csv("t,n\\nk,-5\\n\\nj,7")', [{ t: 'k', n: -5 }, { t: 'j', n: 7 }])]),
  w(P1, 3, '[프로젝트] 열의 통계 (CSV와 함께)', `<p>딕셔너리 리스트 <code>rows</code>(앞 문제의 <code>parse_csv</code> 결과 모양)와 열 이름 <code>col</code>이 주어져요. 그 열의 <b>숫자 값들</b>에 대해 <code>{"min": 최소, "max": 최대, "avg": 평균(소수 둘째 자리 반올림)}</code> 딕셔너리를 돌려주는 함수 <code>column_stats(rows, col)</code>을 만드세요. 숫자가 아닌 값(문자열)은 <b>무시</b>하고, 숫자가 하나도 없으면 <code>None</code>을 돌려줘요.</p>`,
    `def column_stats(rows, col):\n    pass\n`,
    `def column_stats(rows, col):\n    nums = [r[col] for r in rows if isinstance(r.get(col), (int, float))]\n    if not nums:\n        return None\n    return {"min": min(nums), "max": max(nums), "avg": round(sum(nums) / len(nums), 2)}\n`,
    '<p><code>isinstance(값, (int, float))</code> 로 숫자인지 확인해요. 열이 없는 행은 <code>r.get(col)</code>이 <code>None</code>이라 자연스럽게 걸러져요.</p>',
    [t('column_stats([{"a": 1}, {"a": 4}, {"a": 10}], "a")', { min: 1, max: 10, avg: 5 }), t('column_stats([{"a": "x"}, {"a": 3}], "a")', { min: 3, max: 3, avg: 3 }), t('column_stats([], "a")', null), t('column_stats([{"b": 1}], "a")', null), t('column_stats([{"a": 1}, {"a": 2}], "a")', { min: 1, max: 2, avg: 1.5 })]),
  w(P1, 3, '[프로젝트] 영수증 만들기', `<p>주문 목록으로 영수증을 만드는 함수 <code>receipt(items)</code>를 만드세요. <code>items</code>는 <code>(상품명, 단가, 수량)</code> 튜플의 리스트예요. 딕셔너리를 돌려줘요.</p>
<ul><li><code>"lines"</code> — 줄마다 <code>"상품명 x수량 = 금액"</code> 문자열 (금액 = 단가 × 수량)</li><li><code>"subtotal"</code> — 금액의 합</li><li><code>"tax"</code> — 부가세 = 합계의 10%를 <b>소수점 아래 버림</b> (<code>//</code> 사용)</li><li><code>"total"</code> — 합계 + 부가세</li></ul>`,
    `def receipt(items):\n    pass\n`,
    `def receipt(items):\n    lines = []\n    subtotal = 0\n    for name, price, qty in items:\n        amount = price * qty\n        lines.append(f"{name} x{qty} = {amount}")\n        subtotal += amount\n    tax = subtotal // 10\n    return {"lines": lines, "subtotal": subtotal, "tax": tax, "total": subtotal + tax}\n`,
    '<p>한 번 반복하면서 줄 문자열과 합계를 함께 만들면 돼요. 튜플은 <code>for name, price, qty in items</code> 로 풀어 받아요.</p>',
    [t('receipt([("콜라", 1000, 2), ("과자", 1500, 1)])', { lines: ['콜라 x2 = 2000', '과자 x1 = 1500'], subtotal: 3500, tax: 350, total: 3850 }), t('receipt([])', { lines: [], subtotal: 0, tax: 0, total: 0 }), t('receipt([("a", 5, 1)])', { lines: ['a x1 = 5'], subtotal: 5, tax: 0, total: 5 }), t('receipt([("x", 99, 3)])["tax"]', 29)]),
  w(P1, 4, '[프로젝트] 비즈네르 암호', `<p>키워드로 글자마다 다르게 미는 <b>비즈네르 암호</b> 함수 <code>vigenere(text, key, decrypt=False)</code>를 만드세요.</p>
<ul><li>알파벳 글자만 변환하고, <b>대소문자는 유지</b>해요. 알파벳이 아닌 글자(공백, 기호)는 그대로 두고 <b>키도 소모하지 않아요</b></li><li>키 <code>key</code>는 소문자 알파벳이고, 글자마다 <code>a</code>=0, <code>b</code>=1, … 만큼 밀어요. 키는 끝나면 처음부터 다시 써요</li><li><code>decrypt=True</code>이면 반대로 밀어서 <b>복호화</b></li></ul>
<p>예: <code>vigenere("ATTACKATDAWN", "lemon")</code> → <code>"LXFOPVEFRNHR"</code></p>`,
    `def vigenere(text, key, decrypt=False):\n    pass\n`,
    `def vigenere(text, key, decrypt=False):\n    result = []\n    k = 0\n    for ch in text:\n        if ch.isalpha():\n            shift = ord(key[k % len(key)].lower()) - ord("a")\n            if decrypt:\n                shift = -shift\n            base = ord("A") if ch.isupper() else ord("a")\n            result.append(chr((ord(ch) - base + shift) % 26 + base))\n            k += 1\n        else:\n            result.append(ch)\n    return "".join(result)\n`,
    '<p>시저 암호(글자 밀기)를 글자마다 <b>밀 칸 수만 다르게</b> 하는 거예요. 알파벳을 만났을 때만 키 위치(<code>k</code>)를 한 칸 옮겨요.</p>',
    [t('vigenere("ATTACKATDAWN", "lemon")', 'LXFOPVEFRNHR'), t('vigenere("LXFOPVEFRNHR", "lemon", decrypt=True)', 'ATTACKATDAWN'), t('vigenere("Hello, World!", "key")', 'Rijvs, Uyvjn!'), t('vigenere("abc", "a")', 'abc'), t('vigenere(vigenere("Python is fun!", "secret"), "secret", True)', 'Python is fun!')]),
  w(P1, 3, '[프로젝트] 문자열 압축 (RLE)', `<p>같은 글자가 연속되면 <b>"횟수 + 글자"</b>로 줄이는 <b>런 길이 인코딩</b>을 만드세요. 두 함수예요.</p><ol><li><code>rle_encode(s)</code> — 예: <code>"aaabcc"</code> → <code>"3a1b2c"</code> (한 번만 나와도 <code>1</code>을 붙여요)</li><li><code>rle_decode(s)</code> — 예: <code>"3a1b2c"</code> → <code>"aaabcc"</code> (횟수는 한 자리 이상의 숫자)</li></ol><p>원본 문자열에는 숫자가 없다고 가정해요.</p>`,
    `def rle_encode(s):\n    pass\n\n\ndef rle_decode(s):\n    pass\n`,
    `def rle_encode(s):\n    if not s:\n        return ""\n    out = []\n    current, count = s[0], 1\n    for ch in s[1:]:\n        if ch == current:\n            count += 1\n        else:\n            out.append(str(count) + current)\n            current, count = ch, 1\n    out.append(str(count) + current)\n    return "".join(out)\n\n\ndef rle_decode(s):\n    out = []\n    digits = ""\n    for ch in s:\n        if ch.isdigit():\n            digits += ch\n        else:\n            out.append(ch * int(digits))\n            digits = ""\n    return "".join(out)\n`,
    '<p>압축은 "현재 글자와 연속 횟수"를 기억하다가 글자가 바뀌면 기록해요. 해제는 숫자를 모으다가 글자를 만나면 그만큼 반복해요.</p>',
    [t('rle_encode("aaabcc")', '3a1b2c'), t('rle_decode("3a1b2c")', 'aaabcc'), t('rle_encode("")', ''), t('rle_decode(rle_encode("zzzzzzzzzzzzabab"))', 'zzzzzzzzzzzzabab'), t('rle_encode("a" * 12)', '12a')]),
  w(P1, 4, '[프로젝트] 계산기 (연산 순서)', `<p>문자열로 된 수식을 계산하는 함수 <code>calc(expr)</code>을 만드세요. (<code>eval</code>을 쓰지 마세요)</p><ul><li>수와 연산자 <code>+ - * /</code>가 있고, <b>곱셈·나눗셈이 덧셈·뺄셈보다 먼저</b> 계산돼요</li><li>같은 순위는 <b>왼쪽부터</b> 계산해요</li><li>수는 소수일 수 있고, 공백이 섞여 있을 수 있어요. 괄호와 음수 기호는 없어요</li></ul>
<p>예: <code>"1+2*3"</code> → <code>7</code>, <code>"10/4"</code> → <code>2.5</code></p>`,
    `def calc(expr):\n    pass\n`,
    `import re\n\n\ndef calc(expr):\n    tokens = re.findall(r"\\d+\\.?\\d*|[-+*/]", expr.replace(" ", ""))\n    # 1단계: 곱셈·나눗셈 먼저\n    stack = [float(tokens[0])]\n    i = 1\n    while i < len(tokens):\n        op, num = tokens[i], float(tokens[i + 1])\n        if op == "*":\n            stack[-1] *= num\n        elif op == "/":\n            stack[-1] /= num\n        else:\n            stack.append(op)\n            stack.append(num)\n        i += 2\n    # 2단계: 남은 덧셈·뺄셈을 왼쪽부터\n    result = stack[0]\n    for j in range(1, len(stack), 2):\n        if stack[j] == "+":\n            result += stack[j + 1]\n        else:\n            result -= stack[j + 1]\n    return result\n`,
    '<p>수식을 <b>토큰</b>(수와 연산자)으로 쪼갠 뒤, 먼저 <code>*</code>, <code>/</code>를 처리해 값을 줄이고, 남은 <code>+</code>, <code>-</code>를 왼쪽부터 계산하는 2단계로 풀 수 있어요. 정규식 <code>re.findall</code>이 토큰 쪼개기에 편해요.</p>',
    [t('calc("1+2*3")', 7), t('calc("10/4")', 2.5), t('calc("2*3+4*5")', 26), t('calc("100-1-1")', 98), t('calc(" 7 ")', 7), t('calc("8/2/2")', 2)]),
  w(P1, 5, '[도전] 괄호가 있는 계산기', `<p>앞 문제를 확장해서, <b>괄호</b>도 처리하는 <code>calc_paren(expr)</code>을 만드세요. 괄호 안이 먼저 계산돼요. 괄호는 중첩될 수 있어요. (<code>eval</code> 금지, 음수 기호는 없어요)</p>
<p>예: <code>"(1+2)*3"</code> → <code>9</code>, <code>"2*(3+(4-1))"</code> → <code>12</code></p>`,
    `def calc_paren(expr):\n    pass\n`,
    `import re\n\n\ndef calc_paren(expr):\n    tokens = re.findall(r"\\d+\\.?\\d*|[-+*/()]", expr.replace(" ", ""))\n    pos = [0]\n\n    def parse_expr():\n        value = parse_term()\n        while pos[0] < len(tokens) and tokens[pos[0]] in "+-":\n            op = tokens[pos[0]]\n            pos[0] += 1\n            rhs = parse_term()\n            value = value + rhs if op == "+" else value - rhs\n        return value\n\n    def parse_term():\n        value = parse_factor()\n        while pos[0] < len(tokens) and tokens[pos[0]] in "*/":\n            op = tokens[pos[0]]\n            pos[0] += 1\n            rhs = parse_factor()\n            value = value * rhs if op == "*" else value / rhs\n        return value\n\n    def parse_factor():\n        tok = tokens[pos[0]]\n        pos[0] += 1\n        if tok == "(":\n            value = parse_expr()\n            pos[0] += 1  # 닫는 괄호\n            return value\n        return float(tok)\n\n    return parse_expr()\n`,
    '<p>"식 → 항 → 인자" 세 단계로 나눠 재귀로 푸는 방법(재귀 하강 파서)이 가장 깔끔해요. 식은 항들의 합/차, 항은 인자들의 곱/나눗셈, 인자는 수이거나 <b>괄호로 감싼 식</b>이에요. 괄호를 만나면 식 해석을 <b>다시 호출</b>해요.</p>',
    [t('calc_paren("(1+2)*3")', 9), t('calc_paren("2*(3+(4-1))")', 12), t('calc_paren("10/(2+3)")', 2), t('calc_paren("((7))")', 7), t('calc_paren("1+2*3")', 7), t('calc_paren("(8-2)/(1+1)")', 3)]),
  w(P1, 2, '[프로젝트] 가계부 집계', `<p><code>(분류, 금액)</code> 튜플의 리스트 <code>records</code>가 주어져요. <b>분류별 합계</b>를 구해 <code>[분류, 합계]</code> 리스트를 <b>합계가 큰 순서</b>(같으면 분류 이름 알파벳 순서)로 돌려주는 함수 <code>summarize_expenses(records)</code>를 만드세요.</p>`,
    `def summarize_expenses(records):\n    pass\n`,
    `def summarize_expenses(records):\n    totals = {}\n    for category, amount in records:\n        totals[category] = totals.get(category, 0) + amount\n    ordered = sorted(totals.items(), key=lambda kv: (-kv[1], kv[0]))\n    return [[c, a] for c, a in ordered]\n`,
    '<p>① 딕셔너리로 분류별 합계 → ② <code>sorted(..., key=lambda kv: (-합계, 이름))</code> 으로 정렬해요.</p>',
    [t('summarize_expenses([("식비", 5000), ("교통", 1500), ("식비", 3000), ("취미", 8500)])', [['식비', 8000], ['취미', 8500]].reverse().concat([['교통', 1500]])), t('summarize_expenses([])', []), t('summarize_expenses([("b", 1), ("a", 1)])', [['a', 1], ['b', 1]]), t('summarize_expenses([("x", 5), ("x", -2)])', [['x', 3]])]),
  w(P1, 4, '[프로젝트] 전화번호부 명령 처리기', `<p>명령 문자열 리스트를 차례로 처리하고, <b>각 명령의 출력</b>을 모은 리스트를 돌려주는 함수 <code>run_commands(cmds)</code>를 만드세요. 처음에는 전화번호부가 비어 있어요.</p>
<table class="t"><thead><tr><th>명령</th><th>하는 일</th><th>출력</th></tr></thead><tbody>
<tr><td><code>add 이름 번호</code></td><td>이름이 새로우면 추가, 이미 있으면 번호를 바꿔요</td><td><code>추가: 이름</code> 또는 <code>수정: 이름</code></td></tr>
<tr><td><code>find 이름</code></td><td>번호를 찾아요</td><td>번호, 없으면 <code>없음</code></td></tr>
<tr><td><code>del 이름</code></td><td>지워요</td><td><code>삭제: 이름</code>, 없으면 <code>없음</code></td></tr>
<tr><td><code>list</code></td><td>이름들을 알파벳 순으로 쉼표로 이어요</td><td>이름들, 비었으면 <code>비어 있음</code></td></tr></tbody></table>`,
    `def run_commands(cmds):\n    pass\n`,
    `def run_commands(cmds):\n    book = {}\n    out = []\n    for cmd in cmds:\n        parts = cmd.split()\n        action = parts[0]\n        if action == "add":\n            name, number = parts[1], parts[2]\n            out.append(("수정: " if name in book else "추가: ") + name)\n            book[name] = number\n        elif action == "find":\n            out.append(book.get(parts[1], "없음"))\n        elif action == "del":\n            if parts[1] in book:\n                del book[parts[1]]\n                out.append("삭제: " + parts[1])\n            else:\n                out.append("없음")\n        elif action == "list":\n            out.append(",".join(sorted(book)) if book else "비어 있음")\n    return out\n`,
    '<p>명령 한 줄을 <code>split()</code>으로 나눠 첫 단어로 종류를 구분하고, 딕셔너리 하나로 전화번호부를 관리해요. "입력을 받아 처리하는 프로그램"의 기본 뼈대예요.</p>',
    [t('run_commands(["add Kim 010-1", "add Lee 010-2", "find Kim", "add Kim 010-9", "find Kim", "del Lee", "del Lee", "list"])', ['추가: Kim', '추가: Lee', '010-1', '수정: Kim', '010-9', '삭제: Lee', '없음', 'Kim']), t('run_commands(["list"])', ['비어 있음']), t('run_commands(["find x", "add b 1", "add a 2", "list"])', ['없음', '추가: b', '추가: a', 'a,b']), t('run_commands([])', [])]),
  w(P1, 4, '[프로젝트] 일정 겹침과 합치기', `<p>일정은 <code>[시작, 끝]</code>(시각 숫자) 리스트예요. 두 함수를 만드세요.</p><ol><li><code>has_conflict(events)</code> — 서로 <b>겹치는 일정이 하나라도</b> 있으면 <code>True</code>. 한 일정의 끝과 다른 일정의 시작이 같으면 겹치지 <b>않아요</b> (<code>[1,3]</code>, <code>[3,5]</code>는 안 겹침)</li><li><code>merge_intervals(intervals)</code> — 겹치거나 <b>맞닿은</b> 구간을 합쳐서 시작 순서로 정렬한 리스트를 돌려줘요. 예: <code>[[1,3],[2,6],[8,10]]</code> → <code>[[1,6],[8,10]]</code></li></ol>`,
    `def has_conflict(events):\n    pass\n\n\ndef merge_intervals(intervals):\n    pass\n`,
    `def has_conflict(events):\n    ordered = sorted(events)\n    for i in range(len(ordered) - 1):\n        if ordered[i][1] > ordered[i + 1][0]:\n            return True\n    return False\n\n\ndef merge_intervals(intervals):\n    merged = []\n    for start, end in sorted(intervals):\n        if merged and start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n    return merged\n`,
    '<p>둘 다 <b>시작 시각 순으로 정렬</b>하는 것이 출발점이에요. 정렬하면 이웃한 구간끼리만 비교하면 돼요.</p>',
    [t('has_conflict([[1, 3], [3, 5]])', false), t('has_conflict([[1, 4], [3, 5]])', true), t('merge_intervals([[1, 3], [2, 6], [8, 10], [15, 18]])', [[1, 6], [8, 10], [15, 18]]), t('merge_intervals([[1, 4], [4, 5]])', [[1, 5]]), t('merge_intervals([])', []), t('has_conflict([])', false)]),
  w(P1, 4, '[프로젝트] 설정 합치기 (깊은 병합)', `<p>설정(딕셔너리) <code>a</code>에 <code>b</code>를 덮어 합치는 함수 <code>deep_merge(a, b)</code>를 만드세요. <b>새 딕셔너리</b>를 돌려주고, <code>a</code>와 <code>b</code>는 바꾸지 않아요.</p><ul><li>같은 키의 값이 <b>둘 다 딕셔너리</b>이면 <b>안쪽까지 재귀로</b> 합쳐요</li><li>그 외에는 <code>b</code>의 값이 이겨요 (리스트도 통째로 교체)</li></ul>`,
    `def deep_merge(a, b):\n    pass\n`,
    `def deep_merge(a, b):\n    result = dict(a)\n    for key, value in b.items():\n        if key in result and isinstance(result[key], dict) and isinstance(value, dict):\n            result[key] = deep_merge(result[key], value)\n        else:\n            result[key] = value\n    return result\n`,
    '<p>일단 <code>a</code>를 복사하고, <code>b</code>의 키를 하나씩 넣어요. 양쪽이 딕셔너리면 같은 함수를 다시 불러 합쳐요(재귀).</p>',
    [t('deep_merge({"a": 1}, {"b": 2})', { a: 1, b: 2 }), t('deep_merge({"db": {"host": "x", "port": 1}}, {"db": {"port": 2}})', { db: { host: 'x', port: 2 } }), t('deep_merge({"l": [1]}, {"l": [2]})', { l: [2] }), t('(lambda a, b: (deep_merge(a, b), a)[1])({"k": {"z": 1}}, {"k": {"z": 2}})', { k: { z: 1 } }), t('deep_merge({}, {})', {})]),
  w(P1, 3, '[프로젝트] 해시태그와 멘션 뽑기', `<p>글에서 <code>#태그</code>와 <code>@멘션</code>을 뽑는 함수 <code>extract_tags(text)</code>를 만드세요. <code>{"hashtags": [...], "mentions": [...]}</code> 딕셔너리를 돌려줘요.</p><ul><li><code>#</code>이나 <code>@</code>는 <b>빼고</b> 뒤의 글자(영문자·숫자·밑줄·한글)만 담아요</li><li>같은 것이 여러 번 나오면 <b>처음 한 번만</b>, 나온 순서대로</li></ul>`,
    `def extract_tags(text):\n    pass\n`,
    `import re\n\n\ndef extract_tags(text):\n    def unique(items):\n        seen = []\n        for x in items:\n            if x not in seen:\n                seen.append(x)\n        return seen\n\n    return {\n        "hashtags": unique(re.findall(r"#(\\w+)", text)),\n        "mentions": unique(re.findall(r"@(\\w+)", text)),\n    }\n`,
    '<p><code>re.findall(r"#(\\w+)", text)</code> 로 태그를 꺼내고, 중복은 따로 걸러내요. 걸러내는 부분을 작은 함수로 만들면 두 번 재사용할 수 있어요.</p>',
    [t('extract_tags("오늘 #맛집 @kim 과 #맛집 #여행 @lee @kim")', { hashtags: ['맛집', '여행'], mentions: ['kim', 'lee'] }), t('extract_tags("no tags")', { hashtags: [], mentions: [] }), t('extract_tags("#a#b @c")', { hashtags: ['a', 'b'], mentions: ['c'] }), t('extract_tags("")', { hashtags: [], mentions: [] })]),
  w(P1, 3, '[프로젝트] 마크다운 목차 만들기', `<p>마크다운 글에서 제목(<code>#</code>, <code>##</code>, …로 시작하는 줄)만 뽑아 <b>목차</b>를 만드는 함수 <code>make_toc(md)</code>를 만드세요. 제목 줄마다 <b>(레벨 − 1) × 2칸의 공백 + 제목 글자</b> 문자열을 만들어 리스트로 돌려줘요. 제목이 아닌 줄은 무시해요. (<code>#</code>들과 제목 사이에는 공백 하나)</p><p>예: <code>"# A\\ntext\\n## B\\n### C\\n# D"</code> → <code>["A", "  B", "    C", "D"]</code></p>`,
    `def make_toc(md):\n    pass\n`,
    `def make_toc(md):\n    toc = []\n    for line in md.split("\\n"):\n        if line.startswith("#"):\n            hashes, _, title = line.partition(" ")\n            level = len(hashes)\n            toc.append("  " * (level - 1) + title)\n    return toc\n`,
    '<p><code>line.partition(" ")</code> 은 첫 공백을 기준으로 (앞, 공백, 뒤) 셋으로 나눠 줘요. 앞부분 <code>#</code>의 개수가 레벨이에요.</p>',
    [t('make_toc("# A\\ntext\\n## B\\n### C\\n# D")', ['A', '  B', '    C', 'D']), t('make_toc("")', []), t('make_toc("plain text only")', []), t('make_toc("## Sub only")', ['  Sub only'])]),
  w(P1, 2, '[프로젝트] 퀴즈 채점기', `<p>정답 리스트 <code>key</code>와 제출한 답 리스트 <code>answers</code>(길이가 같아요)로 채점하는 함수 <code>grade_quiz(answers, key)</code>를 만드세요. 딕셔너리를 돌려줘요.</p><ul><li><code>"score"</code> — 맞힌 개수</li><li><code>"wrong"</code> — 틀린 문제의 <b>번호</b>(1부터) 리스트</li></ul>`,
    `def grade_quiz(answers, key):\n    pass\n`,
    `def grade_quiz(answers, key):\n    score = 0\n    wrong = []\n    for i, (a, k) in enumerate(zip(answers, key), start=1):\n        if a == k:\n            score += 1\n        else:\n            wrong.append(i)\n    return {"score": score, "wrong": wrong}\n`,
    '<p><code>zip(answers, key)</code> 로 짝지어 비교하고, <code>enumerate(..., start=1)</code> 로 문제 번호를 붙여요.</p>',
    [t('grade_quiz(["a", "b", "c"], ["a", "c", "c"])', { score: 2, wrong: [2] }), t('grade_quiz([], [])', { score: 0, wrong: [] }), t('grade_quiz([1, 2], [2, 1])', { score: 0, wrong: [1, 2] }), t('grade_quiz(["x"], ["x"])', { score: 1, wrong: [] })]),
  w(P1, 3, '[프로젝트] 로마 숫자 변환', `<p>두 함수를 만드세요. 범위는 1~3999예요.</p><ol><li><code>to_roman(n)</code> — 정수를 로마 숫자 문자열로 (예: <code>1994</code> → <code>"MCMXCIV"</code>)</li><li><code>from_roman(s)</code> — 로마 숫자 문자열을 정수로</li></ol><p>값: I=1, V=5, X=10, L=50, C=100, D=500, M=1000. 작은 값이 큰 값 <b>앞에</b> 오면 뺄셈이에요 (IV=4, IX=9, XL=40, XC=90, CD=400, CM=900).</p>`,
    `def to_roman(n):\n    pass\n\n\ndef from_roman(s):\n    pass\n`,
    `PAIRS = [(1000, "M"), (900, "CM"), (500, "D"), (400, "CD"), (100, "C"), (90, "XC"), (50, "L"), (40, "XL"), (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")]\n\n\ndef to_roman(n):\n    out = []\n    for value, symbol in PAIRS:\n        while n >= value:\n            out.append(symbol)\n            n -= value\n    return "".join(out)\n\n\ndef from_roman(s):\n    values = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}\n    total = 0\n    for i, ch in enumerate(s):\n        if i + 1 < len(s) and values[ch] < values[s[i + 1]]:\n            total -= values[ch]\n        else:\n            total += values[ch]\n    return total\n`,
    '<p>변환: 큰 값부터 (900=CM, 400=CD 같은 <b>뺄셈 조합도 표에 넣어 두고</b>) 뺄 수 있는 만큼 빼며 기호를 붙여요. 역변환: 현재 글자가 다음 글자보다 작으면 빼고, 아니면 더해요.</p>',
    [t('to_roman(1994)', 'MCMXCIV'), t('from_roman("MCMXCIV")', 1994), t('to_roman(4)', 'IV'), t('to_roman(3999)', 'MMMCMXCIX'), t('from_roman("LVIII")', 58), t('from_roman(to_roman(2024))', 2024)]),
  w(P1, 3, '[프로젝트] 줄바꿈 맞추기 (word wrap)', `<p>문장을 <b>한 줄이 <code>width</code>글자를 넘지 않도록</b> 단어 단위로 나누는 함수 <code>word_wrap(text, width)</code>를 만드세요. 줄들을 리스트로 돌려줘요.</p><ul><li>단어는 공백으로 구분하고, 한 줄 안에서 단어 사이는 공백 하나</li><li>단어가 <code>width</code>보다 길어도 <b>쪼개지 않고 혼자 한 줄</b>을 차지해요</li><li>단어가 없으면 빈 리스트</li></ul>`,
    `def word_wrap(text, width):\n    pass\n`,
    `def word_wrap(text, width):\n    lines = []\n    current = ""\n    for word in text.split():\n        if current == "":\n            current = word\n        elif len(current) + 1 + len(word) <= width:\n            current += " " + word\n        else:\n            lines.append(current)\n            current = word\n    if current:\n        lines.append(current)\n    return lines\n`,
    '<p>지금 줄(<code>current</code>)에 <b>공백 1 + 단어</b>를 붙여도 폭을 안 넘으면 붙이고, 넘으면 지금 줄을 확정하고 새 줄을 시작해요. 마지막 줄을 잊지 마세요.</p>',
    [t('word_wrap("the quick brown fox", 10)', ['the quick', 'brown fox']), t('word_wrap("a b c", 1)', ['a', 'b', 'c']), t('word_wrap("", 5)', []), t('word_wrap("hello world", 20)', ['hello world']), t('word_wrap("extraordinary day", 5)', ['extraordinary', 'day'])]),
  w(P1, 3, '[프로젝트] 진법 변환기', `<p>문자열로 된 수를 <code>from_base</code>진법에서 <code>to_base</code>진법으로 바꾸는 함수 <code>base_convert(s, from_base, to_base)</code>를 만드세요. 진법은 2~36이고, 숫자는 <code>0-9</code>와 소문자 <code>a-z</code>(10~35)로 써요. 결과도 소문자 문자열이에요. 입력은 0 이상의 정수예요. (<code>int(s, base)</code>는 써도 되지만 결과 문자열은 직접 만들어 보세요)</p>`,
    `def base_convert(s, from_base, to_base):\n    pass\n`,
    `def base_convert(s, from_base, to_base):\n    digits = "0123456789abcdefghijklmnopqrstuvwxyz"\n    n = int(s, from_base)\n    if n == 0:\n        return "0"\n    out = []\n    while n > 0:\n        out.append(digits[n % to_base])\n        n //= to_base\n    return "".join(reversed(out))\n`,
    '<p>① 십진수로 바꾸고(<code>int(s, from_base)</code>) ② 목표 진법으로 계속 나눠 나머지를 모으면 돼요(나머지를 뒤집어 읽기).</p>',
    [t('base_convert("ff", 16, 2)', '11111111'), t('base_convert("101", 2, 10)', '5'), t('base_convert("z", 36, 10)', '35'), t('base_convert("0", 10, 2)', '0'), t('base_convert("255", 10, 16)', 'ff')]),

  // ================= 프로젝트 ② 게임·시뮬레이션 =================
  w(P2, 3, '[게임] 숫자 야구 판정', `<p>숫자 야구에서 비밀 숫자 <code>secret</code>과 추측 <code>guess</code>(모두 <b>서로 다른 숫자 3개</b>로 된 문자열)를 비교해 <b><code>[스트라이크, 볼]</code></b> 리스트를 돌려주는 함수 <code>judge(secret, guess)</code>를 만드세요.</p><ul><li>스트라이크: 숫자와 <b>자리</b>가 모두 같음</li><li>볼: 숫자는 있지만 <b>자리가 다름</b></li></ul>`,
    `def judge(secret, guess):\n    pass\n`,
    `def judge(secret, guess):\n    strikes = 0\n    balls = 0\n    for i, ch in enumerate(guess):\n        if ch == secret[i]:\n            strikes += 1\n        elif ch in secret:\n            balls += 1\n    return [strikes, balls]\n`,
    '<p>추측의 글자를 하나씩 보면서: 같은 자리 글자와 같으면 스트라이크, 아니고 비밀 숫자 어딘가에 있으면 볼이에요.</p>',
    [t('judge("123", "123")', [3, 0]), t('judge("123", "321")', [1, 2]), t('judge("123", "456")', [0, 0]), t('judge("123", "132")', [1, 2]), t('judge("789", "978")', [0, 3])]),
  w(P2, 3, '[게임] 행맨 화면 만들기', `<p>글자 맞히기 게임(행맨)에서 필요한 두 함수를 만드세요. <code>guessed</code>는 지금까지 추측한 글자들의 리스트예요.</p><ol><li><code>reveal(word, guessed)</code> — 맞힌 글자는 그대로, 아직 못 맞힌 글자는 <code>_</code>로 바꾸고 글자 사이를 <b>공백 하나</b>로 이은 문자열. 예: <code>reveal("apple", ["a", "p"])</code> → <code>"a p p _ _"</code></li><li><code>is_won(word, guessed)</code> — 단어의 모든 글자를 맞혔으면 <code>True</code></li></ol>`,
    `def reveal(word, guessed):\n    pass\n\n\ndef is_won(word, guessed):\n    pass\n`,
    `def reveal(word, guessed):\n    return " ".join(ch if ch in guessed else "_" for ch in word)\n\n\ndef is_won(word, guessed):\n    return all(ch in guessed for ch in word)\n`,
    '<p>글자마다 "맞힌 글자면 그대로, 아니면 <code>_</code>"를 고르고 <code>" ".join(...)</code>으로 이어요. <code>all(...)</code>은 모두 참인지 확인해 줘요.</p>',
    [t('reveal("apple", ["a", "p"])', 'a p p _ _'), t('reveal("apple", [])', '_ _ _ _ _'), t('is_won("aa", ["a"])', true), t('is_won("abc", ["a", "b"])', false), t('reveal("", ["a"])', '')]),
  w(P2, 4, '[게임] 생명 게임 다음 세대', `<p>콘웨이의 <b>생명 게임</b>의 다음 세대를 계산하는 함수 <code>next_generation(grid)</code>를 만드세요. <code>grid</code>는 0(죽음)과 1(삶)의 2차원 리스트이고, <b>격자 바깥은 모두 죽은 칸</b>으로 봐요. 새 격자를 돌려줘요(원본은 바꾸지 않아요).</p><ul><li>살아 있는 칸: 이웃(가로·세로·대각선 8칸) 중 <b>살아 있는 칸이 2~3개</b>이면 살아남고, 아니면 죽어요</li><li>죽은 칸: 이웃 중 살아 있는 칸이 <b>정확히 3개</b>이면 태어나요</li></ul>`,
    `def next_generation(grid):\n    pass\n`,
    `def next_generation(grid):\n    rows = len(grid)\n    cols = len(grid[0]) if rows else 0\n    result = []\n    for r in range(rows):\n        row = []\n        for c in range(cols):\n            alive = 0\n            for dr in (-1, 0, 1):\n                for dc in (-1, 0, 1):\n                    if (dr, dc) == (0, 0):\n                        continue\n                    nr, nc = r + dr, c + dc\n                    if 0 <= nr < rows and 0 <= nc < cols:\n                        alive += grid[nr][nc]\n            if grid[r][c] == 1:\n                row.append(1 if alive in (2, 3) else 0)\n            else:\n                row.append(1 if alive == 3 else 0)\n        result.append(row)\n    return result\n`,
    '<p>칸마다 이웃 8칸을 세는 함수 부분을 먼저 만들고(범위를 벗어난 칸은 건너뛰기), 규칙대로 새 값을 계산해 <b>새 격자</b>에 담아요. 원본을 바로 바꾸면 계산이 꼬이니 주의!</p>',
    [t('next_generation([[0, 1, 0], [0, 1, 0], [0, 1, 0]])', [[0, 0, 0], [1, 1, 1], [0, 0, 0]]), t('next_generation([[0, 0], [0, 0]])', [[0, 0], [0, 0]]), t('next_generation([[1, 1], [1, 1]])', [[1, 1], [1, 1]]), t('next_generation([[0, 0, 0], [0, 1, 0], [0, 0, 0]])', [[0, 0, 0], [0, 0, 0], [0, 0, 0]]), t('next_generation([])', [])]),
  w(P2, 3, '[게임] 로봇 이동 시뮬레이션', `<p>격자(크기 <code>size</code> × <code>size</code>, 좌표는 <code>0</code>~<code>size-1</code>)의 <code>(0, 0)</code>에서 출발한 로봇이 명령 문자열을 차례로 따라 움직여요. <code>U</code>(위, y+1), <code>D</code>(아래, y−1), <code>R</code>(오른쪽, x+1), <code>L</code>(왼쪽, x−1). <b>격자 밖으로 나가는 명령은 무시</b>해요. 마지막 위치를 <code>[x, y]</code>로 돌려주는 함수 <code>move_robot(commands, size)</code>를 만드세요.</p>`,
    `def move_robot(commands, size):\n    pass\n`,
    `def move_robot(commands, size):\n    x = y = 0\n    moves = {"U": (0, 1), "D": (0, -1), "R": (1, 0), "L": (-1, 0)}\n    for ch in commands:\n        dx, dy = moves[ch]\n        nx, ny = x + dx, y + dy\n        if 0 <= nx < size and 0 <= ny < size:\n            x, y = nx, ny\n    return [x, y]\n`,
    '<p>방향별 이동 값을 딕셔너리로 정리해 두면 <code>if/elif</code>가 필요 없어요. 움직인 뒤의 위치가 범위 안일 때만 받아들여요.</p>',
    [t('move_robot("RRU", 5)', [2, 1]), t('move_robot("LLL", 5)', [0, 0]), t('move_robot("UUUU", 3)', [0, 2]), t('move_robot("", 3)', [0, 0]), t('move_robot("RURDLL", 2)', [0, 0])]),
  w(P2, 3, '[게임] 블랙잭 점수', `<p>카드 리스트 <code>cards</code>(<code>"2"</code>~<code>"10"</code>, <code>"J"</code>, <code>"Q"</code>, <code>"K"</code>, <code>"A"</code>)의 <b>패의 점수</b>를 돌려주는 함수 <code>hand_value(cards)</code>를 만드세요.</p><ul><li>숫자 카드는 그 숫자, <code>J Q K</code>는 10</li><li><code>A</code>는 <b>11 또는 1</b> 중 합이 <b>21을 넘지 않는 가장 큰 쪽</b>으로 (모두 1로 해도 넘으면 어쩔 수 없이 큰 값)</li></ul>`,
    `def hand_value(cards):\n    pass\n`,
    `def hand_value(cards):\n    total = 0\n    aces = 0\n    for card in cards:\n        if card == "A":\n            total += 11\n            aces += 1\n        elif card in ("J", "Q", "K"):\n            total += 10\n        else:\n            total += int(card)\n    while total > 21 and aces > 0:\n        total -= 10\n        aces -= 1\n    return total\n`,
    '<p>먼저 에이스를 모두 11로 계산하고, 21을 넘으면 에이스 하나씩을 1로 바꿔(10을 빼서) 넘지 않을 때까지 반복해요.</p>',
    [t('hand_value(["A", "K"])', 21), t('hand_value(["A", "A", "9"])', 21), t('hand_value(["5", "6", "K"])', 21), t('hand_value(["A", "5", "K"])', 16), t('hand_value(["K", "Q", "5"])', 25), t('hand_value([])', 0)]),
  w(P2, 3, '[게임] 가위바위보 토너먼트', `<p>두 함수를 만드세요. 손은 <code>"가위"</code>, <code>"바위"</code>, <code>"보"</code>예요.</p><ol><li><code>rps_winner(a, b)</code> — 이긴 쪽을 <code>"a"</code> 또는 <code>"b"</code>로, 비기면 <code>"draw"</code>로 돌려줘요 (가위&lt;바위&lt;보&lt;가위)</li><li><code>tournament(rounds)</code> — <code>(a의 손, b의 손)</code> 튜플 리스트를 받아 <code>{"a": a가 이긴 횟수, "b": b가 이긴 횟수, "draw": 비긴 횟수}</code>를 돌려줘요</li></ol>`,
    `def rps_winner(a, b):\n    pass\n\n\ndef tournament(rounds):\n    pass\n`,
    `BEATS = {"가위": "보", "바위": "가위", "보": "바위"}\n\n\ndef rps_winner(a, b):\n    if a == b:\n        return "draw"\n    return "a" if BEATS[a] == b else "b"\n\n\ndef tournament(rounds):\n    tally = {"a": 0, "b": 0, "draw": 0}\n    for a, b in rounds:\n        tally[rps_winner(a, b)] += 1\n    return tally\n`,
    '<p>"무엇이 무엇을 이기는지"를 딕셔너리로 정리해 두면 조건문이 짧아져요. <code>tournament</code>는 <code>rps_winner</code>를 다시 사용해요.</p>',
    [t('rps_winner("가위", "보")', 'a'), t('rps_winner("가위", "바위")', 'b'), t('rps_winner("보", "보")', 'draw'), t('tournament([("가위", "보"), ("바위", "보"), ("보", "보"), ("보", "바위")])', { a: 2, b: 1, draw: 1 }), t('tournament([])', { a: 0, b: 0, draw: 0 })]),
  w(P2, 4, '[게임] 지뢰찾기 숫자 계산', `<p>지뢰찾기 판 <code>board</code>는 문자열 리스트예요(<code>"*"</code>=지뢰, <code>"."</code>=빈칸). 빈칸마다 <b>이웃 8칸의 지뢰 수</b>를 숫자 글자로 바꾼 새 판(문자열 리스트)을 돌려주는 함수 <code>minesweeper(board)</code>를 만드세요. 지뢰 칸은 <code>"*"</code>그대로예요. 이웃에 지뢰가 없는 빈칸도 <code>"0"</code>이에요.</p>`,
    `def minesweeper(board):\n    pass\n`,
    `def minesweeper(board):\n    rows = len(board)\n    result = []\n    for r in range(rows):\n        cols = len(board[r])\n        line = ""\n        for c in range(cols):\n            if board[r][c] == "*":\n                line += "*"\n                continue\n            count = 0\n            for dr in (-1, 0, 1):\n                for dc in (-1, 0, 1):\n                    nr, nc = r + dr, c + dc\n                    if 0 <= nr < rows and 0 <= nc < len(board[nr]) and board[nr][nc] == "*":\n                        count += 1\n            line += str(count)\n        result.append(line)\n    return result\n`,
    '<p>칸마다 8방향 이웃을 훑으며 지뢰를 세요. 범위를 벗어난 칸을 먼저 걸러야 해요. 자기 자신 칸(<code>dr = dc = 0</code>)은 지뢰가 아니라서 세어도 괜찮아요.</p>',
    [t('minesweeper(["*..", "...", "..*"])', ['*10', '121', '01*']), t('minesweeper(["."])', ['0']), t('minesweeper(["*"])', ['*']), t('minesweeper(["*.*"])', ['*2*']), t('minesweeper([])', [])]),
  w(P2, 4, '[게임] 님(Nim) 게임의 필승 수', `<p><b>님 게임</b>: 돌 더미 여러 개 중 하나를 골라 돌을 1개 이상 가져가요. <b>마지막 돌을 가져가는 사람이 이겨요</b>. 모든 더미의 돌 수를 <b>XOR(<code>^</code>)</b> 했을 때 0이 되도록 만들면 이기는 위치예요.</p>
<p>돌 더미 리스트 <code>piles</code>가 주어질 때, 내 차례에 <b>이기는 수</b> <code>[더미 번호(0부터), 가져갈 개수]</code>를 돌려주는 함수 <code>nim_move(piles)</code>를 만드세요. 이미 XOR가 0이라 이길 수 없으면 <code>None</code>. 이기는 수가 여러 개면 <b>번호가 가장 작은 더미</b>를 골라요.</p>
<p>방법: 전체 XOR를 <code>x</code>라 할 때, <code>더미 ^ x &lt; 더미</code> 인 첫 더미에서 <code>더미 - (더미 ^ x)</code>개를 가져가요.</p>`,
    `def nim_move(piles):\n    pass\n`,
    `def nim_move(piles):\n    x = 0\n    for p in piles:\n        x ^= p\n    if x == 0:\n        return None\n    for i, p in enumerate(piles):\n        if p ^ x < p:\n            return [i, p - (p ^ x)]\n    return None\n`,
    '<p>XOR는 같은 수끼리 만나면 0이 돼요. 전체 XOR <code>x</code>가 0이 아니면, 어떤 더미를 줄여서 XOR를 0으로 만들 수 있어요.</p>',
    [t('nim_move([3, 4, 5])', [0, 2]), t('nim_move([1, 1])', null), t('nim_move([5])', [0, 5]), t('nim_move([1, 2, 3])', null), t('nim_move([7, 3])', [0, 4])]),
  w(P2, 5, '[도전] 볼링 점수 계산', `<p>볼링 한 게임(10프레임)의 총점을 구하는 함수 <code>bowling_score(rolls)</code>를 만드세요. <code>rolls</code>는 던진 공마다 넘어뜨린 핀 수 리스트예요(유효한 게임이라고 가정).</p>
<ul><li>프레임당 공 2번. 첫 공으로 10개를 모두 넘어뜨리면 <b>스트라이크</b>(그 프레임은 공 1번)</li><li>스트라이크: 10점 + <b>다음 두 번</b>의 공 점수</li><li>스페어(두 번째 공까지 합쳐 10): 10점 + <b>다음 한 번</b>의 공 점수</li><li>그 외: 두 공의 합</li><li>10프레임은 보너스 공이 있을 수 있어요. 보너스 점수는 <b>따로 더하지 않고</b> 앞 프레임의 보너스로만 쓰여요</li></ul>
<p>예: 전부 스트라이크 <code>[10]*12</code> → <code>300</code>, 전부 0 → <code>0</code></p>`,
    `def bowling_score(rolls):\n    pass\n`,
    `def bowling_score(rolls):\n    score = 0\n    i = 0\n    for frame in range(10):\n        if rolls[i] == 10:\n            score += 10 + rolls[i + 1] + rolls[i + 2]\n            i += 1\n        elif rolls[i] + rolls[i + 1] == 10:\n            score += 10 + rolls[i + 2]\n            i += 2\n        else:\n            score += rolls[i] + rolls[i + 1]\n            i += 2\n    return score\n`,
    '<p>프레임 10개만큼 반복하면서 <b>공 위치 <code>i</code></b>를 따로 관리해요(스트라이크면 1칸, 아니면 2칸 전진). 보너스 계산은 <code>rolls[i+1]</code>, <code>rolls[i+2]</code> 같은 <b>뒤의 공</b>을 미리 보면 돼요.</p>',
    [t('bowling_score([10] * 12)', 300), t('bowling_score([0] * 20)', 0), t('bowling_score([9, 0] * 10)', 90), t('bowling_score([5, 5] * 10 + [5])', 150), t('bowling_score([10, 9, 1, 5, 5, 7, 2, 10, 10, 10, 9, 0, 8, 2, 9, 1, 10])', 187)]),

  // ================= 프로젝트 ③ 시스템 만들기 (클래스) =================
  w(P3, 4, '[시스템] 도서관: 회원과 책', `<p>도서관 시스템 <code>LibrarySystem</code>을 만드세요. 처음에는 책도 회원도 없어요. 한 회원은 <b>최대 2권</b>까지 빌릴 수 있어요. 모든 메서드의 반환값은 <b>문자열 메시지</b>예요.</p>
<ul><li><code>add_book(title)</code> — 책 등록 (돌려주지 않음)</li><li><code>borrow(member, title)</code> — 아래 순서로 검사해서 해당하는 메시지를 돌려줘요 (회원은 처음 빌릴 때 자동으로 생겨요)
<ol><li>등록되지 않은 책 → <code>"없는 책"</code></li><li>이미 누군가 빌려 간 책 → <code>"대출 중"</code></li><li>그 회원이 이미 2권 빌림 → <code>"한도 초과"</code></li><li>성공 → <code>"대출 완료"</code></li></ol></li>
<li><code>return_book(member, title)</code> — 그 회원이 빌린 책이면 반납하고 <code>"반납 완료"</code>, 아니면 <code>"빌린 책 아님"</code></li><li><code>borrowed_by(member)</code> — 그 회원이 빌린 책 제목들을 <b>알파벳 순</b> 리스트로 (없으면 빈 리스트)</li></ul>${NOTE}`,
    `class LibrarySystem:\n    pass\n`,
    `class LibrarySystem:\n    def __init__(self):\n        self.books = set()\n        self.loans = {}  # 책 제목 -> 빌린 회원\n\n    def add_book(self, title):\n        self.books.add(title)\n\n    def borrow(self, member, title):\n        if title not in self.books:\n            return "없는 책"\n        if title in self.loans:\n            return "대출 중"\n        if len(self.borrowed_by(member)) >= 2:\n            return "한도 초과"\n        self.loans[title] = member\n        return "대출 완료"\n\n    def return_book(self, member, title):\n        if self.loans.get(title) == member:\n            del self.loans[title]\n            return "반납 완료"\n        return "빌린 책 아님"\n\n    def borrowed_by(self, member):\n        return sorted(t for t, m in self.loans.items() if m == member)\n`,
    '<p>"책 제목 → 빌린 회원" 딕셔너리 하나만 있으면 모든 질문에 답할 수 있어요. 검사 순서를 문제에 적힌 대로 지키세요.</p>',
    [t('run_ops(LibrarySystem(), [["add_book", "a"], ["add_book", "b"], ["add_book", "c"], ["borrow", "kim", "a"], ["borrow", "lee", "a"], ["borrow", "kim", "b"], ["borrow", "kim", "c"], ["borrowed_by", "kim"]])', ['대출 완료', '대출 중', '대출 완료', '한도 초과', ['a', 'b']]), t('run_ops(LibrarySystem(), [["borrow", "kim", "x"], ["return_book", "kim", "x"], ["borrowed_by", "kim"]])', ['없는 책', '빌린 책 아님', []]), t('run_ops(LibrarySystem(), [["add_book", "a"], ["borrow", "kim", "a"], ["return_book", "lee", "a"], ["return_book", "kim", "a"], ["borrow", "lee", "a"]])', ['대출 완료', '빌린 책 아님', '반납 완료', '대출 완료']), t('run_ops(LibrarySystem(), [["add_book", "a"], ["borrow", "kim", "a"], ["return_book", "kim", "a"], ["borrowed_by", "kim"]])', ['대출 완료', '반납 완료', []])]),
  w(P3, 4, '[시스템] 은행: 계좌 이체', `<p>은행 시스템 <code>Bank</code>를 만드세요. 두 개의 <b>사용자 정의 예외</b>를 함께 만들어야 해요(둘 다 <code>Exception</code>을 상속).</p>
<ul><li><code>InsufficientFunds</code> — 잔액이 부족할 때</li><li><code>AccountNotFound</code> — 없는 계좌일 때</li></ul>
<p><code>Bank</code>의 메서드:</p>
<ul><li><code>open(name, deposit=0)</code> — 계좌를 열어요 (돌려주지 않음). 이미 있는 이름이면 <code>ValueError</code></li><li><code>balance(name)</code> — 잔액. 없는 계좌면 <code>AccountNotFound</code></li><li><code>transfer(src, dst, amount)</code> — <code>src</code>에서 <code>dst</code>로 이체 (돌려주지 않음). 두 계좌가 모두 있어야 하고(없으면 <code>AccountNotFound</code>), <code>src</code>의 잔액이 부족하면 <code>InsufficientFunds</code>. <b>실패하면 아무 계좌도 바뀌지 않아요</b></li></ul>`,
    `class InsufficientFunds:\n    pass\n\n\nclass AccountNotFound:\n    pass\n\n\nclass Bank:\n    pass\n`,
    `class InsufficientFunds(Exception):\n    pass\n\n\nclass AccountNotFound(Exception):\n    pass\n\n\nclass Bank:\n    def __init__(self):\n        self.accounts = {}\n\n    def open(self, name, deposit=0):\n        if name in self.accounts:\n            raise ValueError("이미 있는 계좌")\n        self.accounts[name] = deposit\n\n    def balance(self, name):\n        if name not in self.accounts:\n            raise AccountNotFound(name)\n        return self.accounts[name]\n\n    def transfer(self, src, dst, amount):\n        if src not in self.accounts or dst not in self.accounts:\n            raise AccountNotFound(src if src not in self.accounts else dst)\n        if self.accounts[src] < amount:\n            raise InsufficientFunds(src)\n        self.accounts[src] -= amount\n        self.accounts[dst] += amount\n`,
    '<p>이체는 <b>검사를 모두 끝낸 뒤에</b> 돈을 옮기세요. 그래야 실패했을 때 중간 상태가 남지 않아요. 시작 코드의 두 예외 클래스를 <code>(Exception)</code> 상속으로 고치세요.</p>',
    [t('run_ops(Bank(), [["open", "a", 100], ["open", "b"], ["transfer", "a", "b", 30], ["balance", "a"], ["balance", "b"]])', [70, 30]), t('raises(lambda: (lambda b: (b.open("a", 10), b.open("b"), b.transfer("a", "b", 50)))(Bank()))', 'InsufficientFunds'), t('raises(lambda: Bank().balance("x"))', 'AccountNotFound'), t('raises(lambda: (lambda b: (b.open("a"), b.open("a")))(Bank()))', 'ValueError'), t('(lambda b: (b.open("a", 10), raises(lambda: b.transfer("a", "zzz", 5)), b.balance("a"))[2])(Bank())', 10)]),
  w(P3, 4, '[시스템] 수강 신청 (대기자 명단)', `<p><code>Course(name, capacity)</code> 클래스를 만드세요.</p>
<ul><li><code>enroll(student)</code> — 정원이 남았으면 등록하고 <code>"등록"</code>, 꽉 찼으면 <b>대기 명단 맨 뒤</b>에 넣고 <code>"대기"</code>. 이미 등록했거나 대기 중인 학생이면 <code>"중복"</code></li><li><code>drop(student)</code> — 등록된 학생이면 취소하고, <b>대기 1순위 학생이 있으면 자동으로 등록</b>해요(돌려주지 않음). 대기 중이던 학생이면 대기에서 빼요. 어디에도 없으면 <code>ValueError</code></li><li><code>roster()</code> — 등록된 학생 리스트 (등록된 순서)</li><li><code>waitlist()</code> — 대기 중인 학생 리스트 (대기 순서)</li></ul>${NOTE}`,
    `class Course:\n    pass\n`,
    `class Course:\n    def __init__(self, name, capacity):\n        self.name = name\n        self.capacity = capacity\n        self.students = []\n        self.waiting = []\n\n    def enroll(self, student):\n        if student in self.students or student in self.waiting:\n            return "중복"\n        if len(self.students) < self.capacity:\n            self.students.append(student)\n            return "등록"\n        self.waiting.append(student)\n        return "대기"\n\n    def drop(self, student):\n        if student in self.students:\n            self.students.remove(student)\n            if self.waiting:\n                self.students.append(self.waiting.pop(0))\n        elif student in self.waiting:\n            self.waiting.remove(student)\n        else:\n            raise ValueError("없는 학생")\n\n    def roster(self):\n        return list(self.students)\n\n    def waitlist(self):\n        return list(self.waiting)\n`,
    '<p>리스트 두 개(등록, 대기)로 관리해요. 취소하면 대기 명단의 맨 앞(<code>pop(0)</code>)을 등록 명단으로 옮겨요.</p>',
    [t('run_ops(Course("x", 2), [["enroll", "a"], ["enroll", "b"], ["enroll", "c"], ["enroll", "d"], ["enroll", "a"], ["roster"], ["waitlist"]])', ['등록', '등록', '대기', '대기', '중복', ['a', 'b'], ['c', 'd']]), t('run_ops(Course("x", 1), [["enroll", "a"], ["enroll", "b"], ["drop", "a"], ["roster"], ["waitlist"]])', ['등록', '대기', [ 'b' ], []]), t('run_ops(Course("x", 1), [["enroll", "a"], ["enroll", "b"], ["enroll", "c"], ["drop", "b"], ["waitlist"]])', ['등록', '대기', '대기', ['c']]), t('raises(lambda: Course("x", 1).drop("z"))', 'ValueError')]),
  w(P3, 4, '[시스템] 영화관 좌석 예매', `<p><code>Theater(rows, cols)</code> 클래스를 만드세요. 좌석 이름은 <b>행 알파벳(A부터) + 열 번호(1부터)</b>예요. 예: <code>Theater(3, 4)</code>는 <code>A1 … A4</code>, <code>B1 … B4</code>, <code>C1 … C4</code>.</p>
<ul><li><code>book(seat)</code> — 존재하고 비어 있는 좌석이면 예매하고 <code>True</code>, 아니면 <code>False</code></li><li><code>cancel(seat)</code> — 예매된 좌석이면 취소하고 <code>True</code>, 아니면 <code>False</code></li><li><code>available_count()</code> — 남은 좌석 수</li><li><code>booked()</code> — 예매된 좌석 이름을 <b>정렬한</b> 리스트</li></ul>${NOTE}`,
    `class Theater:\n    pass\n`,
    `class Theater:\n    def __init__(self, rows, cols):\n        self.seats = {f"{chr(ord('A') + r)}{c + 1}" for r in range(rows) for c in range(cols)}\n        self.taken = set()\n\n    def book(self, seat):\n        if seat in self.seats and seat not in self.taken:\n            self.taken.add(seat)\n            return True\n        return False\n\n    def cancel(self, seat):\n        if seat in self.taken:\n            self.taken.remove(seat)\n            return True\n        return False\n\n    def available_count(self):\n        return len(self.seats) - len(self.taken)\n\n    def booked(self):\n        return sorted(self.taken)\n`,
    '<p>전체 좌석 이름의 집합과 예매된 좌석의 집합 두 개로 관리하면 모든 질문에 답할 수 있어요. 행 알파벳은 <code>chr(ord("A") + 행번호)</code> 로 만들어요.</p>',
    [t('run_ops(Theater(2, 3), [["book", "A1"], ["book", "A1"], ["book", "C1"], ["book", "B3"], ["available_count"], ["booked"]])', [true, false, false, true, 4, ['A1', 'B3']]), t('run_ops(Theater(1, 1), [["cancel", "A1"], ["book", "A1"], ["cancel", "A1"], ["available_count"]])', [false, true, true, 1]), t('run_ops(Theater(3, 4), [["available_count"]])', [12]), t('run_ops(Theater(2, 2), [["book", "B2"], ["book", "A1"], ["booked"]])', [true, true, ['A1', 'B2']])]),
  w(P3, 4, '[시스템] 되돌리기가 되는 편집기', `<p><code>Editor</code> 클래스를 만드세요. 처음에는 글이 비어 있어요(<code>""</code>).</p>
<ul><li><code>insert(text)</code> — 글 <b>끝에</b> <code>text</code>를 붙여요 (돌려주지 않음)</li><li><code>delete(n)</code> — 글 <b>끝에서 n글자</b>를 지워요 (글자가 n개보다 적으면 전부 지워요, 돌려주지 않음)</li><li><code>undo()</code> — <b>직전 <code>insert</code>/<code>delete</code>를 취소</b>해요. 취소할 게 없으면 아무 일도 없어요 (돌려주지 않음)</li><li><code>redo()</code> — 방금 취소한 작업을 <b>다시 실행</b>해요. 다시 할 게 없으면 아무 일도 없어요. 새 <code>insert</code>/<code>delete</code>를 하면 다시 할 수 있는 작업은 사라져요 (돌려주지 않음)</li><li><code>text()</code> — 지금 글</li></ul>${NOTE}`,
    `class Editor:\n    pass\n`,
    `class Editor:\n    def __init__(self):\n        self.current = ""\n        self.undo_stack = []\n        self.redo_stack = []\n\n    def _change(self, new_text):\n        self.undo_stack.append(self.current)\n        self.redo_stack = []\n        self.current = new_text\n\n    def insert(self, text):\n        self._change(self.current + text)\n\n    def delete(self, n):\n        self._change(self.current[:max(0, len(self.current) - n)])\n\n    def undo(self):\n        if self.undo_stack:\n            self.redo_stack.append(self.current)\n            self.current = self.undo_stack.pop()\n\n    def redo(self):\n        if self.redo_stack:\n            self.undo_stack.append(self.current)\n            self.current = self.redo_stack.pop()\n\n    def text(self):\n        return self.current\n`,
    '<p>"되돌리기 스택"과 "다시하기 스택" 두 개에 <b>글 전체의 이전 상태</b>를 저장하면 쉬워요. 새 작업을 하면 다시하기 스택을 비워요.</p>',
    [t('run_ops(Editor(), [["insert", "hello"], ["insert", " world"], ["undo"], ["text"], ["redo"], ["text"]])', ['hello', 'hello world']), t('run_ops(Editor(), [["insert", "abc"], ["delete", 2], ["text"], ["undo"], ["text"]])', ['a', 'abc']), t('run_ops(Editor(), [["insert", "a"], ["undo"], ["insert", "b"], ["redo"], ["text"]])', ['b']), t('run_ops(Editor(), [["undo"], ["redo"], ["delete", 5], ["text"]])', ['']), t('run_ops(Editor(), [["insert", "ab"], ["undo"], ["undo"], ["redo"], ["redo"], ["text"]])', ['ab'])]),
  w(P3, 4, '[시스템] 우선순위 작업 스케줄러', `<p><code>TaskScheduler</code> 클래스를 만드세요. <code>heapq</code> 모듈을 써 보세요.</p>
<ul><li><code>add(name, priority)</code> — 작업을 추가해요. <b>우선순위 숫자가 작을수록 먼저</b> 처리해요 (돌려주지 않음)</li><li><code>next_task()</code> — 가장 먼저 처리할 작업의 이름을 꺼내서(목록에서 지우고) 돌려줘요. 우선순위가 같으면 <b>먼저 추가한 것</b>이 먼저예요. 작업이 없으면 <code>None</code></li><li><code>size()</code> — 남은 작업 수</li></ul>${NOTE}`,
    `class TaskScheduler:\n    pass\n`,
    `import heapq\n\n\nclass TaskScheduler:\n    def __init__(self):\n        self.heap = []\n        self.counter = 0\n\n    def add(self, name, priority):\n        heapq.heappush(self.heap, (priority, self.counter, name))\n        self.counter += 1\n\n    def next_task(self):\n        if not self.heap:\n            return None\n        return heapq.heappop(self.heap)[2]\n\n    def size(self):\n        return len(self.heap)\n`,
    '<p>힙에 <code>(우선순위, 들어온 순번, 이름)</code> 튜플을 넣으면, 튜플 비교 규칙(앞에서부터)이 "우선순위 → 먼저 들어온 순서"를 자동으로 보장해요.</p>',
    [t('run_ops(TaskScheduler(), [["add", "c", 3], ["add", "a", 1], ["add", "b", 2], ["next_task"], ["next_task"], ["size"]])', ['a', 'b', 1]), t('run_ops(TaskScheduler(), [["add", "x", 1], ["add", "y", 1], ["add", "z", 1], ["next_task"], ["next_task"], ["next_task"]])', ['x', 'y', 'z']), t('run_ops(TaskScheduler(), [["next_task"], ["size"]])', [0]), t('run_ops(TaskScheduler(), [["add", "late", 5], ["add", "now", 0], ["next_task"]])', ['now'])]),
  w(P3, 5, '[도전] LRU 캐시', `<p><b>LRU 캐시</b>는 용량이 가득 차면 <b>가장 오래 사용하지 않은</b> 항목부터 버리는 저장소예요. <code>LRUCache(capacity)</code> 클래스를 만드세요.</p>
<ul><li><code>get(key)</code> — 값을 돌려주고, 그 항목을 <b>"방금 사용함"</b>으로 표시해요. 없으면 <code>-1</code></li><li><code>put(key, value)</code> — 값을 저장해요(돌려주지 않음). 이미 있는 키면 값을 갱신하고 "방금 사용함". 용량을 넘으면 <b>가장 오래 사용하지 않은 항목</b>을 버려요</li></ul>
<p>힌트: <code>collections.OrderedDict</code>의 <code>move_to_end</code>, <code>popitem(last=False)</code>가 편해요.</p>${NOTE}`,
    `class LRUCache:\n    pass\n`,
    `from collections import OrderedDict\n\n\nclass LRUCache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.data = OrderedDict()\n\n    def get(self, key):\n        if key not in self.data:\n            return -1\n        self.data.move_to_end(key)\n        return self.data[key]\n\n    def put(self, key, value):\n        if key in self.data:\n            self.data.move_to_end(key)\n        self.data[key] = value\n        if len(self.data) > self.capacity:\n            self.data.popitem(last=False)\n`,
    '<p><code>OrderedDict</code>는 항목의 순서를 기억해요. 맨 앞 = 가장 오래 안 쓴 것, 맨 뒤 = 방금 쓴 것으로 유지하면 돼요. 사용할 때마다 <code>move_to_end</code>로 맨 뒤로 보내요.</p>',
    [t('run_ops(LRUCache(2), [["put", 1, 1], ["put", 2, 2], ["get", 1], ["put", 3, 3], ["get", 2], ["put", 4, 4], ["get", 1], ["get", 3], ["get", 4]])', [1, -1, -1, 3, 4]), t('run_ops(LRUCache(1), [["put", "a", 1], ["put", "b", 2], ["get", "a"], ["get", "b"]])', [-1, 2]), t('run_ops(LRUCache(2), [["put", 1, 1], ["put", 1, 10], ["get", 1]])', [10]), t('run_ops(LRUCache(2), [["get", 5]])', [-1])]),
  w(P3, 4, '[시스템] 이벤트 알림 시스템 (옵저버)', `<p><code>EventBus</code> 클래스를 만드세요. "무슨 일이 생기면 알려 달라"고 미리 등록해 두는 구조예요.</p>
<ul><li><code>subscribe(event, handler)</code> — 이벤트 이름 <code>event</code>에 처리 함수 <code>handler</code>를 등록해요 (돌려주지 않음). 같은 이벤트에 여러 개 등록할 수 있어요</li><li><code>emit(event, data)</code> — 그 이벤트에 등록된 처리 함수들을 <b>등록한 순서대로</b> <code>handler(data)</code>로 호출하고, <b>반환값들을 리스트로</b> 돌려줘요. 등록된 게 없으면 빈 리스트예요</li></ul>${NOTE}`,
    `class EventBus:\n    pass\n`,
    `class EventBus:\n    def __init__(self):\n        self.handlers = {}\n\n    def subscribe(self, event, handler):\n        self.handlers.setdefault(event, []).append(handler)\n\n    def emit(self, event, data):\n        return [h(data) for h in self.handlers.get(event, [])]\n`,
    '<p>이벤트 이름 → 처리 함수 리스트 딕셔너리예요. 함수도 값이라서 리스트에 담아 둘 수 있어요.</p>',
    [t('run_ops(EventBus(), [["subscribe", "greet", lambda n: "hi " + n], ["subscribe", "greet", lambda n: "yo " + n], ["emit", "greet", "ann"]])', [['hi ann', 'yo ann']]), t('run_ops(EventBus(), [["emit", "none", 1]])', [[]]), t('run_ops(EventBus(), [["subscribe", "a", lambda x: x * 2], ["subscribe", "b", lambda x: x + 1], ["emit", "a", 5], ["emit", "b", 5]])', [[10], [6]]), t('run_ops(EventBus(), [["subscribe", "e", len], ["emit", "e", "abcd"], ["emit", "e", ""]])', [[4], [0]])]),
  w(P3, 4, '[시스템] 스택 기계 인터프리터', `<p>간단한 <b>스택 기계</b>를 흉내 내는 함수 <code>run_program(lines)</code>를 만드세요. 명령 문자열 리스트를 차례로 실행하고, <code>PRINT</code>로 <b>출력된 값들의 리스트</b>를 돌려줘요.</p>
<table class="t"><thead><tr><th>명령</th><th>동작</th></tr></thead><tbody>
<tr><td><code>PUSH n</code></td><td>정수 <code>n</code>을 스택에 쌓아요</td></tr>
<tr><td><code>ADD</code> / <code>SUB</code> / <code>MUL</code></td><td>위에서 두 개를 꺼내 계산해 결과를 쌓아요. <code>SUB</code>는 <b>(아래 − 위)</b></td></tr>
<tr><td><code>DUP</code></td><td>맨 위 값을 복제해서 쌓아요</td></tr>
<tr><td><code>SWAP</code></td><td>맨 위 두 개의 순서를 바꿔요</td></tr>
<tr><td><code>PRINT</code></td><td>맨 위 값을 <b>꺼내서</b> 출력 목록에 추가해요</td></tr></tbody></table>`,
    `def run_program(lines):\n    pass\n`,
    `def run_program(lines):\n    stack = []\n    out = []\n    for line in lines:\n        parts = line.split()\n        op = parts[0]\n        if op == "PUSH":\n            stack.append(int(parts[1]))\n        elif op in ("ADD", "SUB", "MUL"):\n            top = stack.pop()\n            below = stack.pop()\n            if op == "ADD":\n                stack.append(below + top)\n            elif op == "SUB":\n                stack.append(below - top)\n            else:\n                stack.append(below * top)\n        elif op == "DUP":\n            stack.append(stack[-1])\n        elif op == "SWAP":\n            stack[-1], stack[-2] = stack[-2], stack[-1]\n        elif op == "PRINT":\n            out.append(stack.pop())\n    return out\n`,
    '<p>스택(리스트)과 출력 목록 두 개를 두고, 명령마다 <code>if/elif</code>로 동작을 나눠요. <code>SUB</code>는 먼저 꺼낸 것이 <b>뒤의 수</b>예요(<code>아래 - 위</code>).</p>',
    [t('run_program(["PUSH 3", "PUSH 4", "ADD", "PRINT"])', [7]), t('run_program(["PUSH 10", "PUSH 3", "SUB", "PRINT"])', [7]), t('run_program(["PUSH 5", "DUP", "MUL", "PRINT"])', [25]), t('run_program(["PUSH 1", "PUSH 2", "SWAP", "PRINT", "PRINT"])', [1, 2]), t('run_program([])', [])]),
  w(P3, 4, '[시스템] 회원 가입 검증', `<p><code>UserRegistry</code> 클래스를 만드세요.</p>
<ul><li><code>register(name, email, password)</code> — 가입시켜요(돌려주지 않음). 아래 순서로 검사해서 걸리면 <code>ValueError</code>를 일으켜요. 메시지는 정확히 아래와 같아요.
<ol><li>이름이 빈 문자열이면 <code>"이름이 비었어요"</code></li><li>이미 있는 이름이면 <code>"이미 가입한 이름"</code></li><li>이메일에 <code>@</code>가 없거나, <code>@</code> 뒤에 <code>.</code>이 없으면 <code>"이메일 형식 오류"</code></li><li>비밀번호가 8글자 미만이면 <code>"비밀번호가 너무 짧아요"</code></li></ol></li>
<li><code>login(name, password)</code> — 이름과 비밀번호가 맞으면 <code>True</code>, 아니면(없는 이름 포함) <code>False</code></li><li><code>count()</code> — 가입자 수</li></ul>${NOTE}`,
    `class UserRegistry:\n    pass\n`,
    `class UserRegistry:\n    def __init__(self):\n        self.users = {}\n\n    def register(self, name, email, password):\n        if name == "":\n            raise ValueError("이름이 비었어요")\n        if name in self.users:\n            raise ValueError("이미 가입한 이름")\n        if "@" not in email or "." not in email.split("@", 1)[1]:\n            raise ValueError("이메일 형식 오류")\n        if len(password) < 8:\n            raise ValueError("비밀번호가 너무 짧아요")\n        self.users[name] = password\n\n    def login(self, name, password):\n        return self.users.get(name) == password\n\n    def count(self):\n        return len(self.users)\n`,
    '<p>검사를 문제에 적힌 <b>순서대로</b> 하나씩 하고, 모두 통과하면 마지막에 저장해요. 실패한 가입은 흔적을 남기지 않아요.</p>',
    [t('run_ops(UserRegistry(), [["register", "ann", "a@b.com", "password1"], ["login", "ann", "password1"], ["login", "ann", "x"], ["login", "zed", "password1"], ["count"]])', [true, false, false, 1]), t('err_msg(lambda: UserRegistry().register("", "a@b.com", "password1"))', '이름이 비었어요'), t('err_msg(lambda: UserRegistry().register("ann", "abc", "password1"))', '이메일 형식 오류'), t('err_msg(lambda: UserRegistry().register("ann", "a@b", "password1"))', '이메일 형식 오류'), t('err_msg(lambda: UserRegistry().register("ann", "a@b.com", "short"))', '비밀번호가 너무 짧아요'), t('err_msg(lambda: (lambda r: (r.register("ann", "a@b.com", "password1"), r.register("ann", "c@d.com", "password2")))(UserRegistry()))', '이미 가입한 이름')]),
  w(P3, 5, '[도전] 미니 데이터베이스', `<p><b>미니 데이터베이스</b> <code>Table</code> 클래스를 만드세요. 행은 딕셔너리예요.</p>
<ul><li><code>insert(row)</code> — 행(딕셔너리)을 추가해요 (돌려주지 않음)</li><li><code>where(**conds)</code> — 모든 조건(<code>열=값</code>)에 맞는 행들을 <b>새 <code>Table</code></b>로 돌려줘요 (원본은 그대로)</li><li><code>order_by(col, desc=False)</code> — <code>col</code> 기준으로 정렬한 <b>새 <code>Table</code></b>을 돌려줘요 (<code>desc=True</code>이면 내림차순)</li><li><code>select(*cols)</code> — 지정한 열만 남긴 행(딕셔너리)들의 <b>리스트</b>를 돌려줘요</li><li><code>count()</code> — 행 수</li></ul>
<p>그래서 <code>t.where(city="Seoul").order_by("age").select("name")</code> 처럼 <b>이어서</b> 쓸 수 있어요.</p>`,
    `class Table:\n    pass\n`,
    `class Table:\n    def __init__(self, rows=None):\n        self.rows = list(rows) if rows else []\n\n    def insert(self, row):\n        self.rows.append(dict(row))\n\n    def where(self, **conds):\n        kept = [r for r in self.rows if all(r.get(k) == v for k, v in conds.items())]\n        return Table(kept)\n\n    def order_by(self, col, desc=False):\n        return Table(sorted(self.rows, key=lambda r: r[col], reverse=desc))\n\n    def select(self, *cols):\n        return [{c: r[c] for c in cols} for r in self.rows]\n\n    def count(self):\n        return len(self.rows)\n`,
    '<p>"조건에 맞는 새 표를 돌려주기"를 반복하는 구조(메서드 체이닝)예요. <code>where</code>와 <code>order_by</code>는 자기 자신을 바꾸지 않고 <b>새 Table</b>을 만들어 돌려줘야 이어 쓸 수 있어요.</p>',
    [t('(lambda t: (t.insert({"name": "a", "city": "Seoul", "age": 30}), t.insert({"name": "b", "city": "Busan", "age": 20}), t.insert({"name": "c", "city": "Seoul", "age": 25}), t.where(city="Seoul").order_by("age").select("name"))[3])(Table())', [{ name: 'c' }, { name: 'a' }]), t('(lambda t: (t.insert({"x": 1}), t.insert({"x": 2}), t.where(x=9).count())[2])(Table())', 0), t('(lambda t: (t.insert({"n": 2}), t.insert({"n": 1}), t.insert({"n": 3}), [r["n"] for r in t.order_by("n", desc=True).select("n")])[3])(Table())', [3, 2, 1]), t('(lambda t: (t.insert({"a": 1, "b": 2}), t.where(a=1, b=3).count(), t.where(a=1, b=2).count())[1:])(Table())', [0, 1]), t('(lambda t: (t.insert({"k": 1}), t.where(k=1), t.count())[2])(Table())', 1)]),
  w(P3, 4, '[시스템] 분수 계산기', `<p>분수를 다루는 클래스 <code>Frac(num, den)</code>을 만드세요. 분모는 0이 아니에요.</p>
<ul><li>만들 때 <b>기약분수</b>로 줄이고(<code>gcd</code>), 분모는 항상 <b>양수</b>로 맞춰요 (예: <code>Frac(2, 4)</code> → 1/2, <code>Frac(1, -2)</code> → -1/2)</li><li>속성 <code>num</code>(분자), <code>den</code>(분모)</li><li><code>+</code>, <code>*</code> 연산(<code>__add__</code>, <code>__mul__</code>) — 결과도 기약분수 <code>Frac</code></li><li><code>==</code> 비교(<code>__eq__</code>) — 값이 같으면 같아요</li><li><code>str()</code>(<code>__str__</code>) — <code>"분자/분모"</code> 형태. 분모가 1이면 <b>분자만</b> (예: <code>"3"</code>)</li></ul>`,
    `class Frac:\n    pass\n`,
    `from math import gcd\n\n\nclass Frac:\n    def __init__(self, num, den):\n        if den < 0:\n            num, den = -num, -den\n        g = gcd(abs(num), den) or 1\n        self.num = num // g\n        self.den = den // g\n\n    def __add__(self, other):\n        return Frac(self.num * other.den + other.num * self.den, self.den * other.den)\n\n    def __mul__(self, other):\n        return Frac(self.num * other.num, self.den * other.den)\n\n    def __eq__(self, other):\n        return self.num == other.num and self.den == other.den\n\n    def __str__(self):\n        return str(self.num) if self.den == 1 else f"{self.num}/{self.den}"\n`,
    '<p>분모가 음수면 부호를 분자로 옮기고, 분자·분모를 최대공약수로 나눠요. 계산 결과는 <b>항상 <code>Frac(...)</code>로 만들어 돌려주면</b> 자동으로 약분돼요.</p>',
    [t('str(Frac(1, 2) + Frac(1, 3))', '5/6'), t('str(Frac(2, 4))', '1/2'), t('str(Frac(3, 1))', '3'), t('str(Frac(1, -2))', '-1/2'), t('Frac(1, 2) == Frac(2, 4)', true), t('str(Frac(2, 3) * Frac(3, 4))', '1/2'), t('str(Frac(0, 5))', '0')]),
];
