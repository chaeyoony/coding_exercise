// 예외 처리 단계별 사다리 (파이썬): 오류 읽기·try-except → 여러 오류·as e → else·finally·raise → 입력 검증·작은 프로젝트
// 기존 '예외 처리' 문제 5개(0으로 나누기, 숫자 변환, KeyError, else/finally, raise)도 같은 사다리에 들어간다. (pybasic.mjs)
import { o, pr } from './_stdout.mjs';

const X1 = '예외 처리 ① try-except 기본';
const X2 = '예외 처리 ② 여러 오류·as e';
const X3 = '예외 처리 ③ else·finally·raise';
const X4 = '예외 처리 ④ 입력 검증·작은 프로젝트';
const XQ = '예외 처리 출력 예측 퀴즈';   // 출력 예측은 코드를 짜는 문제가 아니라 퀴즈로 분류된다

const SETUP = `def raises(fn):
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

const INP = (...vals) => `_vals = iter(${JSON.stringify(vals.map(String))})\n\n\ndef input(prompt=""):\n    v = next(_vals)\n    print(prompt + v)\n    return v\n`;
const t = (call, expected, visible = false) => ({ call, expected, visible });
const V = (...xs) => xs.map((x, i) => ({ ...x, visible: i < 2 }));
const w = (category, level, title, desc, starter, solution, hint, tests, extra = {}) => ({
  track: 'python', category, level, title, desc, starter, solution, hint, tests: V(...tests), setup: SETUP, ...extra,
});
const f = sig => `def ${sig}:\n    pass\n`;
const ex = s => `<pre class="out">${s}</pre>`;

export default [
  // ================= ① try-except 기본 =================
  o({ category: X1, level: 1, title: '숫자로 바꿔 보기',
    desc: `<p>문자열 변수 <code>s</code>가 주어져요. <code>int(s)</code>로 정수로 바꿔 보고, 성공하면 <code>변환 성공: ○</code>, <code>ValueError</code>가 나면 <code>숫자가 아니에요</code>를 출력하세요. (<code>try</code> / <code>except ValueError</code>)</p><p class="muted">오류가 나면 프로그램이 멈춰요. <code>try</code> 안에서 오류가 나면 <code>except</code>로 넘어가서 계속 실행돼요.</p>`,
    solution: `try:\n    n = int(s)\n    print("변환 성공:", n)\nexcept ValueError:\n    print("숫자가 아니에요")\n`,
    hint: '<p>오류가 날 수 있는 코드를 <code>try:</code> 아래에 들여써서 넣고, <code>except ValueError:</code> 아래에 오류일 때 할 일을 써요.</p>',
    cases: ['s = "42"', 's = "abc"', 's = ""', 's = "-7"', 's = "3.5"'], needs: [['try\\s*:', 'try 를 써 보세요'], ['except', 'except 를 써 보세요']] }),
  o({ category: X1, level: 1, title: '0으로 나누기 막기',
    desc: `<p>숫자 <code>a</code>, <code>b</code>가 주어져요. <code>a / b</code>를 계산해 <code>결과: ○</code>를 출력하세요. <code>b</code>가 0이라서 <code>ZeroDivisionError</code>가 나면 <code>0으로 나눌 수 없어요</code>를 출력해요.</p>`,
    solution: `try:\n    print("결과:", a / b)\nexcept ZeroDivisionError:\n    print("0으로 나눌 수 없어요")\n`,
    hint: '<p><code>except ZeroDivisionError:</code> 로 0으로 나누는 오류만 잡아요. (<code>if b == 0</code> 으로 미리 검사하는 방법도 있지만, 여기서는 <code>try</code>를 연습해요)</p>',
    cases: ['a = 10\nb = 4', 'a = 7\nb = 0', 'a = 0\nb = 5', 'a = -9\nb = 3'], needs: [['try\\s*:', 'try 를 써 보세요']] }),
  w(X1, 1, '리스트에서 안전하게 꺼내기', `<p><code>get_item(lst, i)</code>를 만드세요. <code>lst[i]</code>를 돌려주되, 번호가 범위를 벗어나서 <code>IndexError</code>가 나면 <code>None</code>을 돌려줘요.</p>`,
    f('get_item(lst, i)'), `def get_item(lst, i):\n    try:\n        return lst[i]\n    except IndexError:\n        return None\n`,
    '<p><code>try:</code> 안에서 <code>return lst[i]</code>, <code>except IndexError:</code> 안에서 <code>return None</code>.</p>',
    [t('get_item([10, 20, 30], 1)', 20), t('get_item([10, 20, 30], 5)', null), t('get_item([], 0)', null), t('get_item([1, 2], -1)', 2), t('get_item([1, 2], -3)', null)]),
  w(X1, 2, '정수로 바꾸고 못 바꾸면 기본값', `<p><code>to_int(s, default)</code>를 만드세요. 문자열 <code>s</code>를 정수로 바꿔 돌려주고, 바꿀 수 없으면 <code>default</code>를 돌려줘요.</p>`,
    f('to_int(s, default)'), `def to_int(s, default):\n    try:\n        return int(s)\n    except ValueError:\n        return default\n`,
    '<p><code>int("abc")</code>는 <code>ValueError</code>예요. <code>except ValueError:</code> 에서 <code>default</code>를 돌려주세요.</p>',
    [t('to_int("12", 0)', 12), t('to_int("x", -1)', -1), t('to_int("", 99)', 99), t('to_int(" 8 ", 0)', 8), t('to_int("1.5", 0)', 0)]),
  o({ category: X1, level: 2, title: '올바른 숫자가 나올 때까지 다시 입력받기',
    desc: `<p>정수를 입력받는 프로그램이에요. <code>input("정수: ")</code>로 입력받아 정수로 바꿔 보고, 실패하면 <code>다시 입력하세요</code>를 출력하고 <b>다시 입력</b>받아요. 성공하면 반복을 끝내고 <code>입력한 수: ○</code>를 출력하세요. (<code>while True</code> + <code>try</code> + <code>break</code>)</p><p class="muted">입력은 <code>input()</code>으로 받는다고 생각하고 풀어요. 아래 "주어진 코드"가 키보드 입력을 흉내 내 줘요.</p><b>실행 예시</b>${ex('정수: abc\n다시 입력하세요\n정수: 12\n입력한 수: 12')}`,
    solution: `while True:\n    s = input("정수: ")\n    try:\n        n = int(s)\n        break\n    except ValueError:\n        print("다시 입력하세요")\nprint("입력한 수:", n)\n`,
    hint: '<p>성공했을 때 <code>break</code>로 반복을 빠져나와요. <code>except</code>에서는 안내만 출력하고 반복이 계속돼요.</p>',
    cases: [INP('abc', '12'), INP('7'), INP('', '3.5', 'x', '-4')], needs: [['while', 'while 반복을 써 보세요'], ['try\\s*:', 'try 를 써 보세요']] }),
  pr({ category: XQ, level: 1, title: '출력 예측: 오류가 나면 어디로 갈까?',
    code: `print("시작")\ntry:\n    print("A")\n    x = 10 / 0\n    print("B")\nexcept ZeroDivisionError:\n    print("C")\nprint("끝")\n`,
    explain: '<p><code>10 / 0</code>에서 오류가 나는 순간 <code>try</code> 블록의 <b>나머지(B)는 건너뛰고</b> <code>except</code>로 가요. 그 뒤는 정상적으로 이어져서 <code>끝</code>이 출력돼요.</p>' }),
  pr({ category: XQ, level: 2, title: '출력 예측: except가 맞지 않으면?',
    code: `def show(x):\n    try:\n        print(10 // x)\n    except ZeroDivisionError:\n        print("zero")\n    print("done", x)\n\nshow(5)\nshow(0)\nshow(3)\n`,
    explain: '<p><code>show(0)</code>은 <code>ZeroDivisionError</code>를 잡아서 <code>zero</code>를 출력하고, <code>try</code> 문이 끝난 뒤 <code>done 0</code>이 이어서 출력돼요. 함수 밖으로 오류가 나가지 않으니 <code>show(3)</code>도 실행돼요.</p>' }),

  // ================= ② 여러 오류 · as e =================
  w(X2, 2, '오류 이름 알려주기', `<p><code>error_name(fn)</code>을 만드세요. 인수 없는 함수 <code>fn</code>을 실행해서, 오류가 나면 <b>오류의 이름</b>(<code>"ValueError"</code> 같은 문자열)을, 오류가 없으면 <code>"OK"</code>를 돌려줘요.</p><p class="muted">힌트: <code>except Exception as e:</code> 로 오류 객체를 받고, <code>type(e).__name__</code> 이 오류 이름이에요.</p>`,
    f('error_name(fn)'), `def error_name(fn):\n    try:\n        fn()\n    except Exception as e:\n        return type(e).__name__\n    return "OK"\n`,
    '<p><code>as e</code> 는 잡은 오류를 변수 <code>e</code>로 받는 문법이에요. <code>type(e).__name__</code> 으로 이름을 얻어요.</p>',
    [t('error_name(lambda: 1 / 0)', 'ZeroDivisionError'), t('error_name(lambda: int("x"))', 'ValueError'), t('error_name(lambda: [][0])', 'IndexError'), t('error_name(lambda: {}["a"])', 'KeyError'), t('error_name(lambda: None + 1)', 'TypeError'), t('error_name(lambda: 5)', 'OK')]),
  w(X2, 2, '오류 메시지 꺼내기', `<p><code>try_int(s)</code>를 만드세요. <code>int(s)</code>가 성공하면 그 정수를, <code>ValueError</code>가 나면 <b>파이썬이 만든 오류 메시지 문자열</b>(<code>str(e)</code>)을 돌려줘요.</p>`,
    f('try_int(s)'), `def try_int(s):\n    try:\n        return int(s)\n    except ValueError as e:\n        return str(e)\n`,
    '<p><code>except ValueError as e:</code> 로 받으면 <code>str(e)</code> 가 오류 메시지예요. 사용자에게 이유를 알려 줄 때 써요.</p>',
    [t('try_int("5")', 5), t('try_int("abc")', "invalid literal for int() with base 10: 'abc'"), t('try_int("")', "invalid literal for int() with base 10: ''"), t('try_int("-2")', -2)]),
  w(X2, 2, '두 오류를 한 번에 처리', `<p><code>safe_len(x)</code>를 만드세요. <code>len(x)</code>를 돌려주는데, 길이를 잴 수 없는 값(예: 숫자 <code>5</code> → <code>TypeError</code>)이면 <code>-1</code>을 돌려줘요.</p>`,
    f('safe_len(x)'), `def safe_len(x):\n    try:\n        return len(x)\n    except TypeError:\n        return -1\n`,
    '<p><code>len(5)</code> 는 <code>TypeError</code>예요.</p>',
    [t('safe_len("abc")', 3), t('safe_len([1, 2])', 2), t('safe_len(5)', -1), t('safe_len(None)', -1), t('safe_len({})', 0)]),
  w(X2, 3, '오류마다 다른 대답 (안전한 계산)', `<p><code>safe_calc(a, op, b)</code>를 만드세요. <code>op</code>는 <code>"+"</code>, <code>"-"</code>, <code>"*"</code>, <code>"/"</code> 중 하나예요.</p><ul><li>정상이면 계산 결과를 돌려줘요</li><li>0으로 나누면 <code>"0으로 나눌 수 없어요"</code></li><li>숫자가 아닌 값이 들어와 <code>TypeError</code>가 나면 <code>"숫자가 아니에요"</code></li><li><code>op</code>가 위 네 가지가 아니면 <code>"지원하지 않는 연산"</code></li></ul><p class="muted">여러 오류를 <code>except</code> 여러 개로 나눠 처리해 보세요.</p>`,
    f('safe_calc(a, op, b)'), `def safe_calc(a, op, b):\n    try:\n        if op == "+":\n            return a + b\n        elif op == "-":\n            return a - b\n        elif op == "*":\n            return a * b\n        elif op == "/":\n            return a / b\n        else:\n            raise ValueError\n    except ZeroDivisionError:\n        return "0으로 나눌 수 없어요"\n    except TypeError:\n        return "숫자가 아니에요"\n    except ValueError:\n        return "지원하지 않는 연산"\n`,
    '<p><code>except</code>는 여러 개 이어 쓸 수 있어요. 위에서부터 맞는 것 하나만 실행돼요. 지원하지 않는 연산은 <code>raise ValueError</code> 로 일으킨 뒤 <code>except ValueError</code>에서 처리하면 깔끔해요.</p>',
    [t('safe_calc(6, "+", 4)', 10), t('safe_calc(6, "/", 0)', '0으로 나눌 수 없어요'), t('safe_calc(6, "+", "a")', '숫자가 아니에요'), t('safe_calc(6, "%", 4)', '지원하지 않는 연산'), t('safe_calc(9, "/", 3)', 3), t('safe_calc("a", "+", 1)', '숫자가 아니에요')]),
  w(X2, 3, '중첩 딕셔너리에서 안전하게 꺼내기', `<p><code>get_path(d, keys)</code>를 만드세요. 딕셔너리 <code>d</code>에서 <code>keys</code>(리스트)를 차례로 따라가며 값을 꺼내요. 예: <code>get_path({"a": {"b": 5}}, ["a", "b"])</code> → <code>5</code>. 중간에 키가 없거나(<code>KeyError</code>) 딕셔너리가 아닌 값을 또 열려고 하면(<code>TypeError</code>) <code>None</code>을 돌려줘요.</p>`,
    f('get_path(d, keys)'), `def get_path(d, keys):\n    try:\n        for k in keys:\n            d = d[k]\n        return d\n    except (KeyError, TypeError):\n        return None\n`,
    '<p>두 오류를 한 번에 잡으려면 튜플로 묶어요: <code>except (KeyError, TypeError):</code></p>',
    [t('get_path({"a": {"b": 5}}, ["a", "b"])', 5), t('get_path({"a": 1}, ["b"])', null), t('get_path({"a": 1}, ["a", "b"])', null), t('get_path({"a": {"b": {"c": 0}}}, ["a", "b", "c"])', 0), t('get_path({"a": 1}, [])', { a: 1 })]),
  pr({ category: XQ, level: 3, title: '출력 예측: 어느 except가 실행될까?',
    code: `def run(x):\n    try:\n        return 10 / int(x)\n    except ZeroDivisionError:\n        return "zero"\n    except ValueError as e:\n        return "bad"\n    except Exception:\n        return "other"\n\nprint(run("2"))\nprint(run("0"))\nprint(run("a"))\nprint(run(None))\n`,
    explain: '<p><code>run("2")</code>는 정상이라 <code>5.0</code>. <code>"0"</code>은 <code>ZeroDivisionError</code>라서 <code>zero</code>. <code>"a"</code>는 <code>int("a")</code>가 <code>ValueError</code>라서 <code>bad</code>. <code>None</code>은 <code>int(None)</code>이 <code>TypeError</code>인데, 앞 두 except에 안 맞으니 마지막 <code>Exception</code>에서 잡혀 <code>other</code>가 나와요.</p>' }),

  // ================= ③ else · finally · raise =================
  o({ category: X3, level: 2, title: '성공했을 때만 따로 처리 (else)',
    desc: `<p>문자열 리스트 <code>items</code>가 주어져요. 각 원소를 <code>int()</code>로 바꿔 보고,</p><ul><li>성공하면 <code>else</code> 블록에서 <code>변환: ○</code> 출력</li><li><code>ValueError</code>가 나면 <code>건너뜀: ○</code> 출력</li><li>어느 쪽이든 <code>finally</code> 블록에서 <code>--</code> 출력</li></ul>`,
    solution: `for item in items:\n    try:\n        n = int(item)\n    except ValueError:\n        print("건너뜀:", item)\n    else:\n        print("변환:", n)\n    finally:\n        print("--")\n`,
    hint: '<p>순서는 <code>try</code> → <code>except</code> → <code>else</code>(오류가 없을 때만) → <code>finally</code>(언제나)예요.</p>',
    cases: ['items = ["1", "x", "3"]', 'items = ["a"]', 'items = ["10", "20"]'], needs: [['else\\s*:', 'else 를 써 보세요'], ['finally\\s*:', 'finally 를 써 보세요']] }),
  w(X3, 3, 'raise로 직접 오류 내기: 나이 검사', `<p><code>check_age(age)</code>를 만드세요.</p><ul><li><code>age</code>가 정수가 아니면 <code>TypeError("정수가 아니에요")</code></li><li>음수이면 <code>ValueError("나이는 음수일 수 없어요")</code></li><li>150보다 크면 <code>ValueError("나이가 너무 커요")</code></li><li>그 외에는 <code>age</code>를 그대로 돌려줘요</li></ul>`,
    f('check_age(age)'), `def check_age(age):\n    if not isinstance(age, int):\n        raise TypeError("정수가 아니에요")\n    if age < 0:\n        raise ValueError("나이는 음수일 수 없어요")\n    if age > 150:\n        raise ValueError("나이가 너무 커요")\n    return age\n`,
    '<p><code>raise 오류종류("메시지")</code> 로 직접 오류를 일으켜요. 검사는 위에서 아래로 차례로 해요.</p>',
    [t('check_age(20)', 20), t('raises(lambda: check_age("a"))', 'TypeError'), t('err_msg(lambda: check_age(-1))', '나이는 음수일 수 없어요'), t('err_msg(lambda: check_age(200))', '나이가 너무 커요'), t('check_age(0)', 0), t('check_age(150)', 150)]),
  w(X3, 3, '오류를 일으키는 함수 + 잡는 함수', `<p>두 함수를 만드세요.</p><ol><li><code>find_user(users, name)</code> — 딕셔너리 <code>users</code>에 <code>name</code>이 있으면 그 값을, 없으면 <code>KeyError(name)</code>을 <b>직접 일으켜요</b>.</li><li><code>greet(users, name)</code> — <code>find_user</code>를 불러서 성공하면 <code>"안녕하세요, ○○님"</code>(○○는 찾은 값), 사용자가 없으면 <code>"등록되지 않은 사용자예요"</code>를 돌려줘요.</li></ol>`,
    `def find_user(users, name):\n    pass\n\n\ndef greet(users, name):\n    pass\n`,
    `def find_user(users, name):\n    if name not in users:\n        raise KeyError(name)\n    return users[name]\n\n\ndef greet(users, name):\n    try:\n        value = find_user(users, name)\n    except KeyError:\n        return "등록되지 않은 사용자예요"\n    return f"안녕하세요, {value}님"\n`,
    '<p>오류는 함수 밖으로 전달돼요. 오류를 <b>일으키는 쪽</b>(<code>raise</code>)과 <b>처리하는 쪽</b>(<code>try/except</code>)을 나누면 코드가 깔끔해져요.</p>',
    [t('greet({"kim": "김이화"}, "kim")', '안녕하세요, 김이화님'), t('greet({"kim": "김이화"}, "lee")', '등록되지 않은 사용자예요'), t('raises(lambda: find_user({}, "a"))', 'KeyError'), t('find_user({"a": 1}, "a")', 1)]),
  w(X3, 3, 'finally로 반드시 기록 남기기', `<p><code>safe_div_logged(a, b, log)</code>를 만드세요. <code>a / b</code>를 계산해 돌려주고, <code>b</code>가 0이면 <code>None</code>을 돌려줘요. 그리고 <b>성공이든 실패든 항상</b> 리스트 <code>log</code>에 <code>"done"</code>을 <code>append</code>해야 해요. (<code>finally</code> 사용)</p>`,
    f('safe_div_logged(a, b, log)'), `def safe_div_logged(a, b, log):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return None\n    finally:\n        log.append("done")\n`,
    '<p><code>finally</code>는 <code>return</code>으로 함수를 나가기 직전에도 실행돼요.</p>',
    [t('safe_div_logged(6, 3, [])', 2), t('safe_div_logged(1, 0, [])', null), t('(lambda L: (safe_div_logged(1, 0, L), safe_div_logged(4, 2, L), L))([])', [null, 2, ['done', 'done']]), t('(lambda L: (safe_div_logged(8, 2, L), L))([])[1]', ['done'])]),
  pr({ category: XQ, level: 3, title: '출력 예측: return과 finally',
    code: `def f(n):\n    try:\n        if n < 0:\n            raise ValueError("neg")\n        return "ok"\n    except ValueError:\n        return "error"\n    finally:\n        print("finally", n)\n\nprint(f(1))\nprint(f(-1))\n`,
    explain: '<p><code>f(1)</code>: <code>return "ok"</code>로 나가기 <b>직전에</b> <code>finally</code>가 실행돼 <code>finally 1</code>이 먼저 출력되고, 그 다음 <code>print</code>가 <code>ok</code>를 출력해요. <code>f(-1)</code>도 같은 순서로 <code>finally -1</code> → <code>error</code>예요.</p>' }),

  // ================= ④ 입력 검증 · 작은 프로젝트 =================
  w(X4, 3, '비밀번호 검증 함수', `<p><code>validate_password(pw)</code>를 만드세요. 검사 규칙을 <b>위에서 아래 순서로</b> 확인하고, 처음 걸리는 규칙에서 <code>ValueError</code>를 일으켜요. 모두 통과하면 <code>True</code>를 돌려줘요.</p><ol><li>길이가 8 미만 → <code>"8자 이상이어야 해요"</code></li><li>숫자가 하나도 없음 → <code>"숫자가 필요해요"</code></li><li>공백이 들어 있음 → <code>"공백은 쓸 수 없어요"</code></li></ol>`,
    f('validate_password(pw)'), `def validate_password(pw):\n    if len(pw) < 8:\n        raise ValueError("8자 이상이어야 해요")\n    if not any(ch.isdigit() for ch in pw):\n        raise ValueError("숫자가 필요해요")\n    if " " in pw:\n        raise ValueError("공백은 쓸 수 없어요")\n    return True\n`,
    '<p>숫자 포함 여부는 <code>any(ch.isdigit() for ch in pw)</code> 로 확인할 수 있어요.</p>',
    [t('validate_password("abcd1234")', true), t('err_msg(lambda: validate_password("abc12"))', '8자 이상이어야 해요'), t('err_msg(lambda: validate_password("abcdefgh"))', '숫자가 필요해요'), t('err_msg(lambda: validate_password("abcd 1234"))', '공백은 쓸 수 없어요'), t('validate_password("12345678")', true)]),
  w(X4, 3, '검증 결과를 문자열로 돌려주기', `<p>앞 문제처럼 검증하되, 오류를 밖으로 내보내지 않는 함수 <code>check_signup(name, age)</code>를 만드세요. 문제가 있으면 <code>"오류: 메시지"</code> 문자열을, 문제가 없으면 <code>"가입 완료: ○○ (○세)"</code>를 돌려줘요.</p><ul><li><code>name</code>이 빈 문자열(공백만 있는 경우 포함) → 메시지 <code>이름을 입력하세요</code></li><li><code>age</code>가 문자열이면 <code>int</code>로 바꿔요. 바꿀 수 없으면 <code>나이는 숫자여야 해요</code></li><li>나이가 0 미만 또는 120 초과 → <code>나이 범위가 올바르지 않아요</code></li></ul>`,
    f('check_signup(name, age)'), `def check_signup(name, age):\n    try:\n        if not name.strip():\n            raise ValueError("이름을 입력하세요")\n        try:\n            age = int(age)\n        except ValueError:\n            raise ValueError("나이는 숫자여야 해요")\n        if age < 0 or age > 120:\n            raise ValueError("나이 범위가 올바르지 않아요")\n    except ValueError as e:\n        return f"오류: {e}"\n    return f"가입 완료: {name} ({age}세)"\n`,
    '<p>검사 규칙마다 <code>raise ValueError("메시지")</code>로 일으키고, 맨 바깥 <code>except ValueError as e:</code> 에서 <code>f"오류: {e}"</code>로 모아서 돌려줘요. 안쪽 <code>try</code>로 <code>int()</code> 변환 오류를 더 알기 쉬운 메시지로 바꿀 수 있어요.</p>',
    [t('check_signup("김이화", "20")', '가입 완료: 김이화 (20세)'), t('check_signup("  ", 20)', '오류: 이름을 입력하세요'), t('check_signup("김이화", "abc")', '오류: 나이는 숫자여야 해요'), t('check_signup("김이화", 130)', '오류: 나이 범위가 올바르지 않아요'), t('check_signup("Mina", 0)', '가입 완료: Mina (0세)')]),
  w(X4, 4, '[프로젝트] 안전한 계산기', `<p><code>calc(expr)</code>를 만드세요. <code>expr</code>는 <code>"3 + 4"</code>처럼 <b>공백으로 구분된 세 조각</b>(숫자 연산자 숫자)이에요. 연산자는 <code>+ - * /</code>예요. 결과는 항상 <b>문자열</b>로 돌려줘요.</p><ul><li>성공: <code>"결과: ○"</code> — 값은 <code>f"{value:g}"</code> 형식 (예: <code>7.0</code> → <code>7</code>, <code>2.5</code> → <code>2.5</code>)</li><li>조각이 세 개가 아니면 <code>"오류: 형식이 잘못됐어요"</code></li><li>숫자로 바꿀 수 없으면 (<code>float()</code> 실패) <code>"오류: 숫자가 아니에요"</code></li><li>연산자가 낯설면 <code>"오류: 지원하지 않는 연산"</code></li><li>0으로 나누면 <code>"오류: 0으로 나눌 수 없어요"</code></li></ul>`,
    f('calc(expr)'), `def calc(expr):\n    parts = expr.split()\n    if len(parts) != 3:\n        return "오류: 형식이 잘못됐어요"\n    try:\n        a = float(parts[0])\n        b = float(parts[2])\n    except ValueError:\n        return "오류: 숫자가 아니에요"\n    op = parts[1]\n    try:\n        if op == "+":\n            value = a + b\n        elif op == "-":\n            value = a - b\n        elif op == "*":\n            value = a * b\n        elif op == "/":\n            value = a / b\n        else:\n            return "오류: 지원하지 않는 연산"\n    except ZeroDivisionError:\n        return "오류: 0으로 나눌 수 없어요"\n    return f"결과: {value:g}"\n`,
    '<p>순서대로 검사하세요: ① <code>split()</code> 한 조각 수 ② <code>float()</code> 변환(<code>try/except ValueError</code>) ③ 연산자 분기 ④ 0 나누기(<code>try/except ZeroDivisionError</code>).</p>',
    [t('calc("3 + 4")', '결과: 7'), t('calc("7 / 2")', '결과: 3.5'), t('calc("5 / 0")', '오류: 0으로 나눌 수 없어요'), t('calc("a * 2")', '오류: 숫자가 아니에요'), t('calc("3 ^ 2")', '오류: 지원하지 않는 연산'), t('calc("3 +")', '오류: 형식이 잘못됐어요'), t('calc("2.5 * 4")', '결과: 10')]),
  w(X4, 4, '[프로젝트] 점수 줄 읽기: 틀린 줄 모아 보고하기', `<p><code>parse_scores(lines)</code>를 만드세요. <code>lines</code>는 <code>"이름,점수"</code> 모양의 문자열 리스트예요. 모든 줄을 처리하되, 잘못된 줄이 있어도 <b>멈추지 않고</b> 끝까지 읽어요.</p><ul><li>정상인 줄은 딕셔너리 <code>ok</code>에 <code>이름: 점수(정수)</code>로 저장해요</li><li>잘못된 줄은 리스트 <code>errors</code>에 <code>[줄 번호(1부터), 이유]</code>로 모아요</li></ul><p>이유는 순서대로 검사해요: 쉼표로 나눈 조각이 2개가 아니면 <code>"형식 오류"</code>, 점수를 <code>int</code>로 바꿀 수 없으면 <code>"숫자가 아니에요"</code>, 0~100 밖이면 <code>"범위 오류"</code>. 돌려줄 값은 <code>{"ok": ..., "errors": ...}</code> 딕셔너리예요.</p>`,
    f('parse_scores(lines)'), `def parse_scores(lines):\n    ok = {}\n    errors = []\n    for no, line in enumerate(lines, start=1):\n        try:\n            parts = line.split(",")\n            if len(parts) != 2:\n                raise ValueError("형식 오류")\n            name = parts[0].strip()\n            try:\n                score = int(parts[1])\n            except ValueError:\n                raise ValueError("숫자가 아니에요")\n            if score < 0 or score > 100:\n                raise ValueError("범위 오류")\n            ok[name] = score\n        except ValueError as e:\n            errors.append([no, str(e)])\n    return {"ok": ok, "errors": errors}\n`,
    '<p>줄마다 <code>try/except</code>를 반복문 <b>안</b>에 두면 한 줄이 틀려도 다음 줄로 넘어가요. 줄 번호는 <code>enumerate(lines, start=1)</code>로 얻어요.</p>',
    [t('parse_scores(["kim,90", "lee,80"])', { ok: { kim: 90, lee: 80 }, errors: [] }), t('parse_scores(["kim,90", "lee", "park,abc", "choi,120"])', { ok: { kim: 90 }, errors: [[2, '형식 오류'], [3, '숫자가 아니에요'], [4, '범위 오류']] }), t('parse_scores([])', { ok: {}, errors: [] }), t('parse_scores(["a,1,2"])', { ok: {}, errors: [[1, '형식 오류']] }), t('parse_scores([" han , 77 "])', { ok: { han: 77 }, errors: [] })]),
];
