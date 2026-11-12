// 11강 클래스(Part 1) 수업 자료 기반 연습: 클래스와 객체, 클래스 속성, 인스턴스 속성(__init__, self), 한정자, 캡슐화(네임 맹글링)
// 슬라이드의 카페 아르바이트생(PartTimer) 예제를 바탕으로 직접 코드를 짜 보는 문제들. (원문 그대로가 아니라 새로 만든 문제)
import { o } from './_stdout.mjs';
const CAT = '11강 클래스 Part 1';
const SETUP = `def raises(fn):
    try:
        fn()
    except Exception as e:
        return type(e).__name__
    return None
`;
const t = (call, expected, visible = false) => ({ call, expected, visible });
const V = (...xs) => xs.map((x, i) => ({ ...x, visible: i < 2 }));
const c = (level, title, desc, starter, solution, hint, tests) => ({
  track: 'python', category: CAT, level, title, desc, starter, solution, hint, tests: V(...tests), setup: SETUP,
});
const p = (level, title, desc, solution, hint, cases, extra = {}) => o({ category: CAT, level, title, desc, solution, hint, cases, ...extra });

export default [
  c(1, '클래스와 객체 만들기', `<p>카페 아르바이트생을 나타내는 클래스 <code>PartTimer</code>를 만들고(내용은 아직 없어도 돼요: <code>pass</code>), 이 클래스로 <b>서로 다른 객체</b>를 만들 수 있게 하세요.</p><p>채점은 <code>PartTimer()</code>로 객체를 만들어 보는 식으로 해요.</p>`,
    `class PartTimer:\n    pass\n`, `class PartTimer:\n    pass\n`,
    '<p><code>class 이름:</code> 아래 들여쓴 줄에 내용을 적어요. 내용이 없으면 <code>pass</code>. 객체는 <code>이름()</code> 으로 만들어요.</p>',
    [t('type(PartTimer()).__name__', 'PartTimer'), t('PartTimer() is PartTimer()', false), t('isinstance(PartTimer(), PartTimer)', true), t('type(PartTimer).__name__', 'type')]),
  c(1, '클래스 속성: 시급', `<p><code>PartTimer</code> 클래스에 <b>클래스 속성</b> <code>hour_rate</code>를 만들고 값을 <code>9500</code>으로 하세요. 클래스 이름으로도, 만든 객체로도 읽을 수 있어야 해요.</p>`,
    `class PartTimer:\n    pass\n`, `class PartTimer:\n    hour_rate = 9500\n`,
    '<p>클래스 안(메서드 밖)에서 <code>이름 = 값</code> 으로 적으면 클래스 속성이에요.</p>',
    [t('PartTimer.hour_rate', 9500), t('PartTimer().hour_rate', 9500), t('[PartTimer().hour_rate, PartTimer().hour_rate]', [9500, 9500]), t('hasattr(PartTimer, "hour_rate")', true)]),
  p(2, '한 명만 시급 바꾸기', `<p>변수 <code>new_rate</code>가 주어져요. 다음을 순서대로 하세요.</p><ol><li><code>hour_rate = 9500</code> 클래스 속성이 있는 <code>PartTimer</code> 클래스를 만든다</li><li>객체 <code>kim</code>, <code>lee</code>를 만든다</li><li><b>lee 객체에서만</b> 시급을 <code>new_rate</code>로 바꾼다 (<code>lee.hour_rate = new_rate</code>)</li><li>한 줄에 <code>kim 시급, lee 시급, 클래스 시급</code>을 띄어쓰기로 출력한다</li></ol>`,
    `class PartTimer:\n    hour_rate = 9500\n\n\nkim = PartTimer()\nlee = PartTimer()\nlee.hour_rate = new_rate\nprint(kim.hour_rate, lee.hour_rate, PartTimer.hour_rate)\n`,
    '<p>객체에 값을 넣으면 <b>그 객체만의 인스턴스 속성</b>이 새로 생겨서 클래스 속성을 가려요. kim과 클래스 값은 그대로예요.</p>',
    ['new_rate = 7000', 'new_rate = 12000', 'new_rate = 9500'], { needs: [['class\\s+PartTimer', 'PartTimer 클래스를 만들어 주세요']] }),
  p(2, '클래스 이름으로 시급 바꾸기', `<p>변수 <code>raise_to</code>가 주어져요. <code>hour_rate = 9500</code>인 <code>PartTimer</code> 클래스를 만들고 다음을 하세요.</p><ol><li><code>kim</code>, <code>lee</code> 객체를 만든다</li><li><b>lee</b>의 시급만 <code>7000</code>으로 바꾼다 (<code>lee.hour_rate = 7000</code>)</li><li><code>park</code> 객체를 새로 만든다</li><li><b>클래스 이름으로</b> 시급을 <code>raise_to</code>로 바꾼다 (<code>PartTimer.hour_rate = raise_to</code>)</li><li>kim, lee, park의 시급을 한 줄에 띄어쓰기로 출력한다</li></ol>`,
    `class PartTimer:\n    hour_rate = 9500\n\n\nkim = PartTimer()\nlee = PartTimer()\nlee.hour_rate = 7000\npark = PartTimer()\nPartTimer.hour_rate = raise_to\nprint(kim.hour_rate, lee.hour_rate, park.hour_rate)\n`,
    '<p>클래스 속성을 바꾸면 그 속성을 <b>공유하는 객체 모두</b>에 반영돼요. 단, lee는 자기만의 <code>hour_rate</code>(7000)를 따로 가지고 있어서 그대로예요.</p>',
    ['raise_to = 10000', 'raise_to = 9800', 'raise_to = 11000'], { needs: [['PartTimer\\.hour_rate\\s*=', '클래스 이름으로 시급을 바꿔 보세요']] }),
  p(2, '클래스 속성 나중에 추가하기', `<p>변수 <code>cafe</code>(카페 이름)가 주어져요. 속성이 없는 <code>PartTimer</code> 클래스를 만든 뒤, <b>클래스를 만든 다음에</b> <code>PartTimer.cafe_name = cafe</code>로 클래스 속성을 추가하세요. <code>kim</code>, <code>lee</code> 객체를 만들어 각각의 <code>cafe_name</code>을 한 줄에 하나씩 출력하세요.</p>`,
    `class PartTimer:\n    pass\n\n\nPartTimer.cafe_name = cafe\nkim = PartTimer()\nlee = PartTimer()\nprint(kim.cafe_name)\nprint(lee.cafe_name)\n`,
    '<p>파이썬은 클래스를 만든 뒤에도 <code>클래스이름.새속성 = 값</code>으로 속성을 추가할 수 있어요. 이미 만든 객체도 읽을 수 있어요.</p>',
    ['cafe = "느티나무 카페"', 'cafe = "Blue Bottle"'], { needs: [['PartTimer\\.cafe_name\\s*=', '클래스 이름으로 cafe_name을 추가해 보세요']] }),
  c(2, '인스턴스 속성: 닉네임과 근무 시간', `<p><code>PartTimer</code> 클래스를 만드세요.</p><ul><li>클래스 속성: <code>hour_rate = 9500</code></li><li>객체를 만들 때 이름 하나를 받아서 인스턴스 속성 <code>nickname</code>에 저장하고, 근무 시간 <code>whours</code>는 <code>0</code>으로 시작해요 (<code>__init__</code> 사용)</li></ul><p>예: <code>kim = PartTimer("neo")</code> → <code>kim.nickname</code>은 <code>"neo"</code>, <code>kim.whours</code>는 <code>0</code></p>`,
    `class PartTimer:\n    pass\n`, `class PartTimer:\n    hour_rate = 9500\n\n    def __init__(self, name):\n        self.nickname = name\n        self.whours = 0\n`,
    '<p>인스턴스 속성은 <code>__init__(self, ...)</code> 안에서 <code>self.속성 = 값</code>으로 만들어요. 클래스 속성은 <code>__init__</code> 밖에 그대로 둬요.</p>',
    [t('PartTimer("neo").nickname', 'neo'), t('PartTimer("a").whours', 0), t('PartTimer.hour_rate', 9500), t('(lambda a, b: [a.nickname, b.nickname])(PartTimer("x"), PartTimer("y"))', ['x', 'y'])]),
  c(2, '객체마다 따로 있는 속성', `<p>앞 문제의 <code>PartTimer</code>(클래스 속성 <code>hour_rate = 9500</code>, 인스턴스 속성 <code>nickname</code>, <code>whours = 0</code>)를 다시 만드세요. 한 객체의 <code>whours</code>를 바꿔도 <b>다른 객체에는 영향이 없어야</b> 해요. 채점이 이를 확인해요.</p>`,
    `class PartTimer:\n    pass\n`, `class PartTimer:\n    hour_rate = 9500\n\n    def __init__(self, name):\n        self.nickname = name\n        self.whours = 0\n`,
    '<p><code>self.whours</code>는 객체마다 따로 저장돼요. 클래스 안에서 <code>whours = 0</code>처럼 적었다면 모두가 공유하는 클래스 속성이라 달라져요.</p>',
    [t('(lambda a, b: (setattr(a, "whours", 5), [a.whours, b.whours])[1])(PartTimer("a"), PartTimer("b"))', [5, 0]), t('(lambda a: (setattr(a, "whours", 3), a.whours)[1])(PartTimer("a"))', 3), t('PartTimer("z").whours', 0), t('"whours" in vars(PartTimer("z"))', true)]),
  c(2, '객체에 속성 덧붙이기', `<p><code>PartTimer</code> 클래스(<code>__init__(self, name)</code>에서 <code>nickname</code>과 <code>whours = 0</code> 설정)를 만드세요. 그리고 함수 <code>add_email(person, email)</code>를 만들어, 받은 객체에 <b>인스턴스 속성 <code>email</code></b>을 추가하고 그 객체를 돌려주세요.</p>`,
    `class PartTimer:\n    pass\n\n\ndef add_email(person, email):\n    pass\n`,
    `class PartTimer:\n    def __init__(self, name):\n        self.nickname = name\n        self.whours = 0\n\n\ndef add_email(person, email):\n    person.email = email\n    return person\n`,
    '<p><code>person.email = email</code> 처럼 객체에 새 이름으로 값을 넣으면 그 객체에만 속성이 생겨요. 다른 객체나 클래스에는 생기지 않아요.</p>',
    [t('add_email(PartTimer("neo"), "neo@kfriends.kr").email', 'neo@kfriends.kr'), t('hasattr(PartTimer("x"), "email")', false), t('(lambda a, b: (add_email(a, "a@x"), hasattr(b, "email"))[1])(PartTimer("a"), PartTimer("b"))', false), t('hasattr(PartTimer, "email")', false)]),
  c(3, '한정자: __init__ 안에서 클래스 속성 만들기', `<p>속성 앞의 <b>한정자</b>가 클래스 이름이면 클래스 속성, <code>self</code>이면 인스턴스 속성이에요. <code>PartTimer</code> 클래스를 <b><code>__init__</code> 안에서만</b> 속성을 만드는 방식으로 작성하세요.</p><ul><li><code>__init__(self, name)</code> 안에서 <code>PartTimer.cafe_name = "느티나무 카페"</code>, <code>PartTimer.hour_rate = 9500</code> (클래스 속성)</li><li>같은 곳에서 <code>self.nickname = name</code>, <code>self.whours = 0</code> (인스턴스 속성)</li></ul>`,
    `class PartTimer:\n    def __init__(self, name):\n        pass\n`,
    `class PartTimer:\n    def __init__(self, name):\n        PartTimer.cafe_name = "느티나무 카페"\n        PartTimer.hour_rate = 9500\n        self.nickname = name\n        self.whours = 0\n`,
    '<p><code>PartTimer.속성 = 값</code>은 클래스 속성, <code>self.속성 = 값</code>은 인스턴스 속성이에요. 선언 위치(어디에 적었는지)가 아니라 <b>앞에 붙은 한정자</b>가 속성의 종류를 정해요.</p>',
    [t('(lambda p: [PartTimer.cafe_name, PartTimer.hour_rate, p.nickname, p.whours])(PartTimer("neo"))', ['느티나무 카페', 9500, 'neo', 0]), t('(lambda p: "nickname" in vars(p))(PartTimer("x"))', true), t('(lambda p: "hour_rate" in vars(p))(PartTimer("x"))', false), t('(lambda p: PartTimer("a").cafe_name)(0)', '느티나무 카페')]),
  p(3, 'self 빠뜨린 오류 고치기', `<p>아래 코드는 <code>PartTimer("neo")</code>를 만들 때 오류가 나요. <b>두 곳</b>을 고쳐서 <code>neo 0</code>이 출력되게 하세요. (<code>nickname</code>과 <code>whours</code>를 인스턴스 속성으로 제대로 저장)</p>`,
    `class PartTimer:\n    def __init__(self, name):\n        self.nickname = name\n        self.whours = 0\n\n\nlee = PartTimer("neo")\nprint(lee.nickname, lee.whours)\n`,
    '<p>메서드의 첫 번째 매개변수는 항상 <code>self</code>이고, 속성은 <code>self.이름</code>으로 저장해야 객체에 남아요.</p>',
    [''], { singleCase: true, starter: `class PartTimer:\n    def __init__(name):\n        nickname = name\n        self.whours = 0\n\n\nlee = PartTimer("neo")\nprint(lee.nickname, lee.whours)\n`, needs: [['def\\s+__init__\\(\\s*self', '__init__의 첫 번째 매개변수는 self예요'], ['self\\.nickname', 'self.nickname 으로 저장해 보세요']] }),
  c(3, '클래스 속성으로 세기: 몇 명 만들었나', `<p><code>PartTimer</code> 클래스를 만드세요. 클래스 속성 <code>counter = 0</code>을 두고, 객체를 만들 때마다 <b>클래스 속성</b> <code>counter</code>를 <code>1</code> 늘려요(<code>PartTimer.counter += 1</code>). 객체는 이름(<code>nickname</code>)을 받아요.</p><p>모든 객체가 같은 값을 공유하므로 <code>x.counter</code>도 같은 값을 보여줘요.</p>`,
    `class PartTimer:\n    pass\n`, `class PartTimer:\n    counter = 0\n\n    def __init__(self, name):\n        self.nickname = name\n        PartTimer.counter += 1\n`,
    '<p>한정자를 <b>클래스 이름</b>으로 써야 모두가 공유하는 값이 바뀌어요: <code>PartTimer.counter += 1</code>.</p>',
    [t('(lambda b: (PartTimer("a"), PartTimer("b"), PartTimer.counter - b)[2])(PartTimer.counter)', 2), t('(lambda x: (PartTimer("z"), x.counter == PartTimer.counter)[1])(PartTimer("y"))', true), t('(lambda b: (PartTimer("a"), PartTimer.counter - b)[1])(PartTimer.counter)', 1), t('PartTimer("q").nickname', 'q')]),
  p(3, 'self.counter += 1 의 함정', `<p>변수 <code>names</code>(이름 리스트)가 주어져요. 다음 클래스를 만드세요: 클래스 속성 <code>counter = 0</code>, 그리고 <code>__init__(self, name)</code>에서 <code>self.nickname = name</code>, <b><code>self.counter += 1</code></b>.</p><p><code>names</code>의 이름마다 객체를 만들어 리스트에 모은 뒤, <b>각 객체의 <code>counter</code> 값 리스트</b>와 <b>클래스의 <code>counter</code></b>를 한 줄씩 출력하세요. (<code>print(리스트)</code>, <code>print(클래스.counter)</code>)</p><p>어떤 값이 나오는지 보고, 왜 <code>PartTimer.counter += 1</code>과 다른지 생각해 보세요.</p>`,
    `class MyClass:\n    counter = 0\n\n    def __init__(self, name):\n        self.nickname = name\n        self.counter += 1\n\n\nobjs = [MyClass(n) for n in names]\nprint([x.counter for x in objs])\nprint(MyClass.counter)\n`,
    '<p><code>self.counter += 1</code> 은 "클래스 속성 값(0)을 읽어서 +1 한 뒤, <b>그 객체의 인스턴스 속성</b> <code>counter</code>로 새로 저장"해요. 클래스 속성은 그대로 0이에요.</p>',
    ['names = ["a", "b", "c"]', 'names = ["x", "y"]', 'names = ["only"]'], { needs: [['self\\.counter\\s*\\+=\\s*1', 'self.counter += 1 을 사용해 보세요']] }),
  c(3, '학생 클래스 모델링', `<p>수업 슬라이드의 예처럼 <b>모두가 공유하는 값은 클래스 속성</b>, <b>개별 값은 인스턴스 속성</b>으로 모델링해 보세요. <code>Student</code> 클래스를 만드세요.</p><ul><li>클래스 속성: <code>school = "Python High"</code></li><li>인스턴스 속성: <code>name</code>, <code>score</code> (객체를 만들 때 받아요)</li></ul>`,
    `class Student:\n    pass\n`, `class Student:\n    school = "Python High"\n\n    def __init__(self, name, score):\n        self.name = name\n        self.score = score\n`,
    '<p>학교 이름은 모든 학생이 같으니 클래스 속성, 이름·성적은 학생마다 다르니 인스턴스 속성이에요.</p>',
    [t('Student("kim", 90).name', 'kim'), t('Student("kim", 90).score', 90), t('Student.school', 'Python High'), t('(lambda a, b: [a.school, b.school])(Student("a", 1), Student("b", 2))', ['Python High', 'Python High']), t('"school" in vars(Student("a", 1))', false)]),
  c(3, '객체의 속성 한눈에 보기', `<p>함수 <code>describe(obj)</code>를 만드세요. 객체가 가진 <b>인스턴스 속성들을 딕셔너리</b>로 돌려줘요. (<code>vars(obj)</code>를 써 보세요) 단 이 함수를 쓸 수 있도록 <code>PartTimer</code> 클래스(<code>hour_rate = 9500</code> 클래스 속성, <code>__init__(self, name)</code>에서 <code>nickname</code>, <code>whours = 0</code>)도 함께 만드세요.</p><p>예: <code>describe(PartTimer("neo"))</code> → <code>{"nickname": "neo", "whours": 0}</code> (클래스 속성은 들어가지 않아요)</p>`,
    `class PartTimer:\n    pass\n\n\ndef describe(obj):\n    pass\n`,
    `class PartTimer:\n    hour_rate = 9500\n\n    def __init__(self, name):\n        self.nickname = name\n        self.whours = 0\n\n\ndef describe(obj):\n    return dict(vars(obj))\n`,
    '<p><code>vars(객체)</code> 는 그 객체의 인스턴스 속성을 딕셔너리로 보여줘요. 클래스 속성은 객체가 아니라 클래스에 들어 있어요.</p>',
    [t('describe(PartTimer("neo"))', { nickname: 'neo', whours: 0 }), t('describe(PartTimer(""))', { nickname: '', whours: 0 }), t('(lambda p: (setattr(p, "email", "a@b"), describe(p))[1])(PartTimer("x"))', { nickname: 'x', whours: 0, email: 'a@b' }), t('"hour_rate" in describe(PartTimer("x"))', false)]),
  c(4, '캡슐화: 숨긴 잔액', `<p><code>Account</code> 클래스를 만드세요. 객체를 만들 때 시작 잔액을 받아 <b>이름 앞에 밑줄 두 개를 붙인 인스턴스 속성</b> <code>__balance</code>에 저장하세요. 그러면 밖에서 <code>acc.__balance</code>로 바로 읽으려 하면 오류가 나요. (네임 맹글링) 읽을 수 있도록 메서드 <code>get_balance()</code>도 만드세요.</p>`,
    `class Account:\n    pass\n`, `class Account:\n    def __init__(self, balance):\n        self.__balance = balance\n\n    def get_balance(self):\n        return self.__balance\n`,
    '<p><code>self.__balance</code> 는 실제로 <code>_Account__balance</code> 라는 이름으로 저장돼서 <code>acc.__balance</code>로는 찾을 수 없어요. 클래스 안의 메서드에서는 <code>self.__balance</code>로 그대로 쓸 수 있어요.</p>',
    [t('Account(100).get_balance()', 100), t('raises(lambda: Account(5).__balance)', 'AttributeError'), t('Account(7)._Account__balance', 7), t('"_Account__balance" in vars(Account(1))', true)]),
  c(4, '캡슐화: 입금과 출금 규칙', `<p>앞 문제의 <code>Account</code>를 확장하세요. 잔액 <code>__balance</code>는 밖에서 바로 바꾸지 못하게 숨기고, 아래 메서드로만 다루게 해요.</p><ul><li><code>deposit(amount)</code> — 입금 (<code>amount</code>가 0 이하면 <code>ValueError</code>)</li><li><code>withdraw(amount)</code> — 출금 (잔액보다 크면 <code>ValueError</code>)</li><li><code>get_balance()</code> — 잔액</li></ul>`,
    `class Account:\n    pass\n`,
    `class Account:\n    def __init__(self, balance=0):\n        self.__balance = balance\n\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError("입금액은 양수")\n        self.__balance += amount\n\n    def withdraw(self, amount):\n        if amount > self.__balance:\n            raise ValueError("잔액 부족")\n        self.__balance -= amount\n\n    def get_balance(self):\n        return self.__balance\n`,
    '<p>잘못된 값은 <code>raise ValueError(...)</code> 로 막고, 검사를 통과해야 잔액을 바꿔요. 이렇게 "규칙을 지키는 창구(메서드)"만 열어 두는 것이 캡슐화예요.</p>',
    [t('(lambda a: (a.deposit(50), a.get_balance())[1])(Account(100))', 150), t('(lambda a: (a.withdraw(30), a.get_balance())[1])(Account(100))', 70), t('raises(lambda: Account(10).withdraw(11))', 'ValueError'), t('raises(lambda: Account(10).deposit(0))', 'ValueError'), t('Account().get_balance()', 0)]),
  c(4, '아르바이트생 급여 계산', `<p><code>PartTimer</code>를 완성하세요.</p><ul><li>클래스 속성 <code>hour_rate = 9500</code></li><li><code>__init__(self, name)</code> — <code>nickname</code>, <code>whours = 0</code></li><li><code>work(hours)</code> — 근무 시간을 누적(<code>whours</code>에 더하기)</li><li><code>pay()</code> — <code>whours * 시급</code>을 돌려줘요. 시급은 <code>self.hour_rate</code>로 읽어요</li></ul>`,
    `class PartTimer:\n    pass\n`,
    `class PartTimer:\n    hour_rate = 9500\n\n    def __init__(self, name):\n        self.nickname = name\n        self.whours = 0\n\n    def work(self, hours):\n        self.whours += hours\n\n    def pay(self):\n        return self.whours * self.hour_rate\n`,
    '<p>메서드 안에서 시급을 <code>self.hour_rate</code>로 읽으면, 객체가 자기만의 시급을 가지고 있으면 그 값을, 없으면 클래스 값을 자동으로 써요.</p>',
    [t('(lambda p: (p.work(3), p.work(2), p.pay())[2])(PartTimer("a"))', 47500), t('PartTimer("a").pay()', 0), t('(lambda p: (setattr(p, "hour_rate", 7000), p.work(2), p.pay())[2])(PartTimer("a"))', 14000), t('(lambda a, b: (a.work(1), b.pay())[1])(PartTimer("a"), PartTimer("b"))', 0), t('(lambda p: (p.work(1), setattr(PartTimer, "hour_rate", 10000), p.pay())[2])(PartTimer("a"))', 10000)]),
  p(3, '객체 여러 개 한 번에 만들어 출력하기', `<p>변수 <code>names</code>(이름 리스트)가 주어져요. 시급 <code>hour_rate = 9500</code> 클래스 속성과 <code>nickname</code>, <code>whours = 0</code> 인스턴스 속성을 가진 <code>PartTimer</code> 클래스를 만들고, <code>names</code>의 이름마다 객체를 만든 뒤 <b>이름과 시급을 <code>이름: 시급</code> 형태로 한 줄씩</b> 출력하세요.</p>`,
    `class PartTimer:\n    hour_rate = 9500\n\n    def __init__(self, name):\n        self.nickname = name\n        self.whours = 0\n\n\nstaff = [PartTimer(n) for n in names]\nfor s in staff:\n    print(f"{s.nickname}: {s.hour_rate}")\n`,
    '<p>반복문(또는 리스트 컴프리헨션)으로 객체를 여러 개 만들 수 있어요. 클래스는 한 번만 정의해 두면 돼요.</p>',
    ['names = ["kim", "lee", "park"]', 'names = ["neo"]', 'names = ["a", "b"]'], { needs: [['class\\s+PartTimer', 'PartTimer 클래스를 만들어 주세요']] }),
];
