// 11강 클래스 심화 사다리: 클래스를 처음 접하는 사람이 단계별로 익히도록 난이도순으로 구성.
// ① 뼈대 → ② 속성 다루기 → ③ 클래스 속성 vs 인스턴스 속성 → ④ 캡슐화·종합
import { o } from './_stdout.mjs';
const A = '11강 단계 ① 클래스 뼈대 익히기';
const B = '11강 단계 ② 속성과 메서드 다루기';
const C = '11강 단계 ③ 클래스·인스턴스 속성 구분';
const D = '11강 단계 ④ 캡슐화와 종합';
const SETUP = `def raises(fn):
    try:
        fn()
    except Exception as e:
        return type(e).__name__
    return None
`;
const t = (call, expected, visible = false) => ({ call, expected, visible });
const V = (...xs) => xs.map((x, i) => ({ ...x, visible: i < 2 }));
const c = (category, level, title, desc, starter, solution, hint, tests) => ({
  track: 'python', category, level, title, desc, starter, solution, hint, tests: V(...tests), setup: SETUP,
});
const p = (category, level, title, desc, solution, hint, cases, extra = {}) => o({ category, level, title, desc, solution, hint, cases, ...extra });

export default [
  // ================= ① 뼈대 =================
  p(A, 1, '클래스 한 줄 만들고 객체 만들기', `<p>클래스는 객체를 찍어내는 <b>틀</b>이에요. 먼저 뼈대만 만들어 봐요.</p><ol><li><code>class Pet:</code> 아래에 <code>pass</code>만 적은 클래스를 만든다</li><li><code>a = Pet()</code>, <code>b = Pet()</code> 객체 두 개를 만든다</li><li><code>print(type(a).__name__)</code>와 <code>print(a is b)</code>를 차례로 출력한다</li></ol><p>두 객체는 같은 틀에서 나왔지만 <b>서로 다른 객체</b>라서 <code>a is b</code>는 <code>False</code>예요.</p>`,
    `class Pet:\n    pass\n\n\na = Pet()\nb = Pet()\nprint(type(a).__name__)\nprint(a is b)\n`,
    '<p><code>class 이름:</code>, 안쪽은 들여쓰기. 객체는 <code>이름()</code>처럼 클래스를 함수처럼 불러서 만들어요.</p>',
    [''], { singleCase: true, starter: '# 1) Pet 클래스를 만드세요 (내용은 pass)\n\n# 2) 객체 a, b를 만드세요\n\n# 3) type(a).__name__ 과 a is b 를 출력하세요\n' }),
  p(A, 1, '클래스 속성 읽기', `<p>변수 <code>sound</code>(동물 소리)가 주어져요. <code>Animal</code> 클래스를 만들고 <b>클래스 속성</b> <code>legs = 4</code>와 <code>cry = sound</code>를 넣으세요. 그런 다음 <b>클래스 이름으로</b> 한 번, <b>객체(<code>x = Animal()</code>)로</b> 한 번 <code>legs</code>와 <code>cry</code>를 한 줄씩 <code>다리 소리</code> 형태(띄어쓰기)로 출력하세요.</p>`,
    `class Animal:\n    legs = 4\n    cry = sound\n\n\nx = Animal()\nprint(Animal.legs, Animal.cry)\nprint(x.legs, x.cry)\n`,
    '<p>클래스 속성은 <code>클래스이름.속성</code>으로도, <code>객체.속성</code>으로도 읽을 수 있어요. 값은 같아요.</p>',
    ['sound = "야옹"', 'sound = "멍멍"', 'sound = "음메"'], { starter: '# 클래스 속성 legs = 4, cry = sound 를 가진 Animal 클래스를 만드세요\n\n# 클래스 이름으로 출력, 객체로 출력\n' }),
  p(A, 1, '__init__으로 이름 저장하기', `<p>변수 <code>name</code>이 주어져요. <code>Dog</code> 클래스를 만드세요. 객체를 만들 때 이름을 받아 <b>인스턴스 속성 <code>name</code></b>으로 저장하는 <code>__init__(self, name)</code>을 넣고, <code>d = Dog(name)</code>의 이름을 출력하세요.</p>`,
    `class Dog:\n    def __init__(self, name):\n        self.name = name\n\n\nd = Dog(name)\nprint(d.name)\n`,
    '<p><code>self</code>는 지금 만들어지는 객체 자신이에요. <code>self.name = name</code> 은 "이 객체의 name에 받은 이름을 넣는다"는 뜻이에요.</p>',
    ['name = "Rex"', 'name = "Coco"', 'name = "바둑이"'], { starter: 'class Dog:\n    def __init__(self, name):\n        # 여기에서 self.name 에 저장하세요\n        pass\n\n\n# d = Dog(name) 을 만들고 d.name 을 출력하세요\n', needs: [['self\\.name\\s*=', 'self.name = ... 으로 저장해 보세요']] }),
  p(A, 1, '속성 두 개 저장하기', `<p>변수 <code>title</code>, <code>year</code>가 주어져요. <code>Movie</code> 클래스를 만드세요. <code>__init__(self, title, year)</code>에서 두 값을 인스턴스 속성으로 저장하고, 객체를 만든 뒤 <code>제목 (연도)</code> 형태로 출력하세요. 예: <code>Parasite (2019)</code></p>`,
    `class Movie:\n    def __init__(self, title, year):\n        self.title = title\n        self.year = year\n\n\nm = Movie(title, year)\nprint(f"{m.title} ({m.year})")\n`,
    '<p>매개변수가 늘어나도 방식은 같아요. 받은 값을 <code>self.이름 = 이름</code>으로 하나씩 저장해요.</p>',
    ['title = "Parasite"\nyear = 2019', 'title = "Oldboy"\nyear = 2003', 'title = "Train"\nyear = 2016'], { needs: [['def\\s+__init__\\(\\s*self', '__init__(self, ...) 를 만들어 보세요']] }),
  p(A, 1, '메서드 처음 만들기', `<p>변수 <code>name</code>이 주어져요. <code>Dog</code> 클래스에 <code>__init__(self, name)</code>과 <b>메서드 <code>bark()</code></b>를 만드세요. <code>bark()</code>는 <code>이름: 멍멍!</code>을 <b>출력</b>해요(<code>print</code>). 객체를 만들고 <code>bark()</code>를 부르세요.</p>`,
    `class Dog:\n    def __init__(self, name):\n        self.name = name\n\n    def bark(self):\n        print(f"{self.name}: 멍멍!")\n\n\nd = Dog(name)\nd.bark()\n`,
    '<p>메서드는 클래스 안에 있는 함수예요. 첫 번째 매개변수는 항상 <code>self</code>. 부를 때는 <code>객체.bark()</code> 처럼 <code>self</code>를 따로 넣지 않아요.</p>',
    ['name = "Rex"', 'name = "Coco"'], { starter: 'class Dog:\n    def __init__(self, name):\n        self.name = name\n\n    # bark 메서드를 만드세요\n\n\n# 객체를 만들고 bark() 를 부르세요\n', needs: [['def\\s+bark\\(\\s*self', 'bark(self) 메서드를 만들어 보세요']] }),
  c(A, 1, '메서드가 값을 돌려주기', `<p><code>Rectangle</code> 클래스를 만드세요. <code>__init__(self, w, h)</code>에서 <code>w</code>, <code>h</code>를 저장하고, 메서드 <code>area()</code>는 넓이(<code>w * h</code>)를 <b>돌려줘요</b>(<code>return</code>).</p>`,
    `class Rectangle:\n    pass\n`, `class Rectangle:\n    def __init__(self, w, h):\n        self.w = w\n        self.h = h\n\n    def area(self):\n        return self.w * self.h\n`,
    '<p>메서드 안에서 객체의 속성은 <code>self.w</code>처럼 읽어요. 계산 결과는 <code>return</code>으로 돌려줘요.</p>',
    [t('Rectangle(3, 4).area()', 12), t('Rectangle(1, 1).area()', 1), t('Rectangle(5, 0).area()', 0), t('Rectangle(2.5, 4).area()', 10), t('(lambda r: (r.area(), r.w, r.h))(Rectangle(2, 3))', [6, 2, 3])]),

  // ================= ② 속성과 메서드 다루기 =================
  c(B, 2, '메서드로 속성 바꾸기', `<p><code>Lamp</code> 클래스를 만드세요. 처음에는 꺼져 있어요(<code>is_on = False</code>, 인스턴스 속성).</p><ul><li><code>turn_on()</code> — 켜기 (<code>is_on</code>을 <code>True</code>로)</li><li><code>turn_off()</code> — 끄기</li><li><code>state()</code> — 켜져 있으면 <code>"ON"</code>, 아니면 <code>"OFF"</code>를 돌려줘요</li></ul>`,
    `class Lamp:\n    pass\n`, `class Lamp:\n    def __init__(self):\n        self.is_on = False\n\n    def turn_on(self):\n        self.is_on = True\n\n    def turn_off(self):\n        self.is_on = False\n\n    def state(self):\n        return "ON" if self.is_on else "OFF"\n`,
    '<p>메서드 안에서 <code>self.속성 = 새 값</code>으로 객체의 상태를 바꿀 수 있어요. 바꾸는 메서드는 보통 아무것도 돌려주지 않아요.</p>',
    [t('Lamp().state()', 'OFF'), t('(lambda l: (l.turn_on(), l.state())[1])(Lamp())', 'ON'), t('(lambda l: (l.turn_on(), l.turn_off(), l.state())[2])(Lamp())', 'OFF'), t('(lambda a, b: (a.turn_on(), b.state())[1])(Lamp(), Lamp())', 'OFF')]),
  c(B, 2, '기본값 매개변수', `<p><code>Pizza</code> 클래스를 만드세요. <code>__init__(self, topping="치즈", size=1)</code> 처럼 <b>기본값</b>이 있어서 값을 안 주면 <code>"치즈"</code>, <code>1</code>이 들어가요. 메서드 <code>label()</code>은 <code>"토핑 x크기"</code> 문자열을 돌려줘요. 예: <code>Pizza("베이컨", 2).label()</code> → <code>"베이컨 x2"</code></p>`,
    `class Pizza:\n    pass\n`, `class Pizza:\n    def __init__(self, topping="치즈", size=1):\n        self.topping = topping\n        self.size = size\n\n    def label(self):\n        return f"{self.topping} x{self.size}"\n`,
    '<p>함수의 기본값 매개변수와 똑같아요. <code>def __init__(self, topping="치즈", size=1):</code></p>',
    [t('Pizza().label()', '치즈 x1'), t('Pizza("베이컨", 2).label()', '베이컨 x2'), t('Pizza(size=3).label()', '치즈 x3'), t('Pizza("a").size', 1)]),
  c(B, 2, '메서드끼리 부르기', `<p><code>Circle</code> 클래스를 만드세요. <code>__init__(self, r)</code>에서 반지름을 저장하고, 메서드 <code>diameter()</code>(지름 = 반지름 × 2)와 <code>describe()</code>를 만들어요. <code>describe()</code>는 <b>같은 객체의 <code>diameter()</code>를 불러서</b> <code>"반지름 ○, 지름 ○"</code> 문자열을 돌려줘요.</p>`,
    `class Circle:\n    pass\n`, `class Circle:\n    def __init__(self, r):\n        self.r = r\n\n    def diameter(self):\n        return self.r * 2\n\n    def describe(self):\n        return f"반지름 {self.r}, 지름 {self.diameter()}"\n`,
    '<p>같은 객체의 다른 메서드는 <code>self.diameter()</code>로 불러요. 그냥 <code>diameter()</code>라고 쓰면 오류가 나요.</p>',
    [t('Circle(3).diameter()', 6), t('Circle(3).describe()', '반지름 3, 지름 6'), t('Circle(0).describe()', '반지름 0, 지름 0'), t('Circle(5).describe()', '반지름 5, 지름 10')]),
  p(B, 2, '속성 수정과 추가', `<p>변수 <code>new_score</code>가 주어져요. <code>Student</code> 클래스(<code>__init__(self, name, score)</code>)를 만들고 <code>s = Student("kim", 50)</code>을 만드세요. 그리고</p><ol><li><code>s.score = new_score</code>로 점수를 바꾼다</li><li><code>s.grade = "pass"</code> 를 <b>새로 추가</b>한다 (<code>new_score</code>가 60 이상이면 <code>"pass"</code>, 아니면 <code>"fail"</code>)</li><li><code>이름 점수 등급</code>을 띄어쓰기로 출력한다</li></ol>`,
    `class Student:\n    def __init__(self, name, score):\n        self.name = name\n        self.score = score\n\n\ns = Student("kim", 50)\ns.score = new_score\ns.grade = "pass" if new_score >= 60 else "fail"\nprint(s.name, s.score, s.grade)\n`,
    '<p>객체의 속성은 <code>객체.속성 = 값</code>으로 바꾸거나 새로 만들 수 있어요. 새로 만든 속성은 그 객체에만 있어요.</p>',
    ['new_score = 85', 'new_score = 40', 'new_score = 60'], { needs: [['s\\.grade\\s*=', 's.grade 를 추가해 보세요']] }),
  p(B, 2, '객체를 리스트로 관리하기', `<p>변수 <code>names</code>, <code>prices</code>(같은 길이의 리스트)가 주어져요. <code>Item</code> 클래스(<code>__init__(self, name, price)</code>)를 만들고, 각 이름·가격으로 객체를 만들어 리스트 <code>items</code>에 담으세요. 그다음 <code>이름: 가격</code>을 한 줄씩 출력하고, 마지막에 <code>합계: ○</code>를 출력하세요.</p>`,
    `class Item:\n    def __init__(self, name, price):\n        self.name = name\n        self.price = price\n\n\nitems = [Item(n, pr) for n, pr in zip(names, prices)]\nfor it in items:\n    print(f"{it.name}: {it.price}")\nprint(f"합계: {sum(it.price for it in items)}")\n`,
    '<p>객체도 리스트에 담을 수 있어요. 반복문으로 하나씩 꺼내 속성을 읽어요. <code>zip(names, prices)</code> 로 짝을 지을 수 있어요.</p>',
    ['names = ["pen", "note"]\nprices = [1200, 3000]', 'names = ["a", "b", "c"]\nprices = [10, 20, 30]', 'names = ["x"]\nprices = [5]'], { needs: [['class\\s+Item', 'Item 클래스를 만들어 주세요']] }),
  c(B, 2, '__init__에서 계산해 저장', `<p><code>Person</code> 클래스를 만드세요. <code>__init__(self, name, height_cm, weight_kg)</code>에서 세 값을 저장하고, 추가로 <b>BMI를 계산해 인스턴스 속성 <code>bmi</code></b>에 저장해요. BMI = 몸무게 ÷ (키(m))², 소수 첫째 자리까지 반올림 (<code>round(..., 1)</code>). 키는 cm 단위로 받아요.</p>`,
    `class Person:\n    pass\n`, `class Person:\n    def __init__(self, name, height_cm, weight_kg):\n        self.name = name\n        self.height_cm = height_cm\n        self.weight_kg = weight_kg\n        self.bmi = round(weight_kg / (height_cm / 100) ** 2, 1)\n`,
    '<p><code>__init__</code> 안에서는 받은 값으로 계산한 결과도 속성으로 저장할 수 있어요. 키를 m로 바꾸려면 <code>/ 100</code>.</p>',
    [t('Person("a", 170, 65).bmi', 22.5), t('Person("b", 180, 81).bmi', 25), t('Person("c", 160, 64).bmi', 25), t('Person("d", 100, 10).bmi', 10), t('Person("e", 170, 65).name', 'e')]),

  // ================= ③ 클래스 속성 vs 인스턴스 속성 =================
  p(C, 3, '클래스 속성 한 번에 바꾸기', `<p>변수 <code>new_tax</code>가 주어져요. <code>Product</code> 클래스에 <b>클래스 속성</b> <code>tax_percent = 10</code>을 두고, <code>__init__(self, name, price)</code>를 만드세요. 객체 <code>a</code>(콜라, 1000), <code>b</code>(과자, 2000)를 만든 뒤</p><ol><li><code>세율: 값 값</code>(a와 b의 <code>tax_percent</code>)을 출력</li><li><code>Product.tax_percent = new_tax</code>로 세율을 바꾼 뒤 다시 <code>세율: 값 값</code>을 출력</li></ol>`,
    `class Product:\n    tax_percent = 10\n\n    def __init__(self, name, price):\n        self.name = name\n        self.price = price\n\n\na = Product("콜라", 1000)\nb = Product("과자", 2000)\nprint("세율:", a.tax_percent, b.tax_percent)\nProduct.tax_percent = new_tax\nprint("세율:", a.tax_percent, b.tax_percent)\n`,
    '<p>모두가 공유하는 값은 클래스 속성이라 <b>한 번만 바꾸면</b> 모든 객체에 반영돼요.</p>',
    ['new_tax = 8', 'new_tax = 15', 'new_tax = 0'], { needs: [['Product\\.tax_percent\\s*=', '클래스 이름으로 세율을 바꿔 보세요']] }),
  p(C, 3, '번호표 발급기', `<p><code>Ticket</code> 클래스를 만드세요. 클래스 속성 <code>count = 0</code>을 두고, 객체를 만들 때마다 <b><code>Ticket.count</code>를 1 올린 뒤 그 값을 자기 번호 <code>self.no</code>로 저장</b>해요. 변수 <code>people</code>(이름 리스트)가 주어져요. 사람마다 티켓을 만들어 <code>이름: 번호</code>를 한 줄씩 출력하고, 마지막에 <code>총 발급: ○</code>(<code>Ticket.count</code>)를 출력하세요.</p>`,
    `class Ticket:\n    count = 0\n\n    def __init__(self, owner):\n        Ticket.count += 1\n        self.no = Ticket.count\n        self.owner = owner\n\n\ntickets = [Ticket(n) for n in people]\nfor tk in tickets:\n    print(f"{tk.owner}: {tk.no}")\nprint(f"총 발급: {Ticket.count}")\n`,
    '<p>번호는 클래스가 공유해서 하나씩 늘리고(<code>Ticket.count += 1</code>), 그 순간의 값을 <b>객체 자신의 속성</b>(<code>self.no</code>)에 복사해 두면 이후에도 번호가 변하지 않아요.</p>',
    ['people = ["kim", "lee", "park"]', 'people = ["a"]', 'people = ["x", "y"]'], { needs: [['Ticket\\.count\\s*\\+=\\s*1', 'Ticket.count += 1 처럼 클래스 이름으로 올려 보세요']] }),
  p(C, 3, '인스턴스 속성이 클래스 속성을 가려요', `<p>변수 <code>special</code>이 주어져요. <code>Cafe</code> 클래스에 클래스 속성 <code>hour_rate = 9500</code>을 두세요. 객체 <code>kim</code>, <code>lee</code>를 만든 뒤 다음을 차례로 출력하세요 (모두 <code>kim lee 클래스</code> 세 값을 띄어쓰기로 한 줄).</p><ol><li>처음 상태</li><li><code>lee.hour_rate = special</code> 후</li><li><code>del lee.hour_rate</code> (lee가 가진 자기 속성을 지움) 후</li></ol>`,
    `class Cafe:\n    hour_rate = 9500\n\n\nkim = Cafe()\nlee = Cafe()\nprint(kim.hour_rate, lee.hour_rate, Cafe.hour_rate)\nlee.hour_rate = special\nprint(kim.hour_rate, lee.hour_rate, Cafe.hour_rate)\ndel lee.hour_rate\nprint(kim.hour_rate, lee.hour_rate, Cafe.hour_rate)\n`,
    '<p>객체에 같은 이름의 속성을 만들면 그 객체에서는 자기 값이 우선이에요. 지우면(<code>del</code>) 다시 클래스 값이 보여요.</p>',
    ['special = 7000', 'special = 12000'], { needs: [['del\\s+lee\\.hour_rate', 'del 로 lee의 속성을 지워 보세요']] }),
  p(C, 3, '오류 고치기: 센 값이 객체마다 따로 있어요', `<p>아래 <code>Visitor</code>는 방문자 수를 <b>모두 함께</b> 세려고 했는데, 객체마다 1이 나와요. <b>한 줄만</b> 고쳐서 <code>[1, 2, 3]</code>과 <code>3</code>이 출력되게 하세요. (<code>number</code>는 각 객체가 만들어질 때의 방문 순번을 저장해요)</p>`,
    `class Visitor:\n    total = 0\n\n    def __init__(self):\n        Visitor.total += 1\n        self.number = Visitor.total\n\n\nv = [Visitor() for _ in range(3)]\nprint([x.number for x in v])\nprint(Visitor.total)\n`,
    '<p><code>self.total += 1</code> 은 클래스 값을 읽어 +1 한 뒤 <b>객체 자기 속성</b>으로 저장해요. 모두가 함께 세려면 한정자를 클래스 이름으로 써야 해요.</p>',
    [''], { singleCase: true, starter: `class Visitor:\n    total = 0\n\n    def __init__(self):\n        self.total += 1\n        self.number = Visitor.total\n\n\nv = [Visitor() for _ in range(3)]\nprint([x.number for x in v])\nprint(Visitor.total)\n`, needs: [['Visitor\\.total\\s*\\+=\\s*1', 'Visitor.total += 1 로 고쳐 보세요']] }),
  p(C, 3, '오류 고치기: 속성 접근 위치', `<p>아래 코드는 <code>AttributeError</code>가 나요. <b><code>print</code> 한 줄만</b> 고쳐서 <code>Nabi cat</code>이 출력되게 하세요. (이름은 객체의 인스턴스 속성, <code>kind</code>는 클래스 속성이에요. 각각 알맞은 방법으로 읽어 보세요)</p>`,
    `class Cat:\n    kind = "cat"\n\n    def __init__(self, name):\n        self.name = name\n\n\nc = Cat("Nabi")\nprint(c.name, Cat.kind)\n`,
    '<p><code>name</code>은 인스턴스 속성이라 객체(<code>c.name</code>)로만 읽을 수 있고, <code>Cat.name</code>은 없어요. <code>kind</code>는 클래스 속성이라 <code>Cat.kind</code>로 읽어요.</p>',
    [''], { singleCase: true, starter: `class Cat:\n    kind = "cat"\n\n    def __init__(self, name):\n        self.name = name\n\n\nc = Cat("Nabi")\nprint(Cat.name, c.kind)\n`, needs: [['c\\.name', '객체 c로 name을 읽어 보세요']] }),
  c(C, 3, '리스트 속성은 객체마다 따로', `<p><code>Basket</code> 클래스를 만드세요. 각 객체가 <b>자기만의 빈 리스트</b> <code>items</code>를 가지고(<code>__init__</code>에서 <code>self.items = []</code>), 메서드 <code>add(x)</code>로 항목을 추가해요. 한 바구니에 담아도 다른 바구니에는 영향이 없어야 해요.</p><p class="muted">클래스 안에 <code>items = []</code>를 쓰면 모든 객체가 <b>같은 리스트를 공유</b>하는 함정이 생겨요!</p>`,
    `class Basket:\n    pass\n`, `class Basket:\n    def __init__(self):\n        self.items = []\n\n    def add(self, x):\n        self.items.append(x)\n`,
    '<p>바꿀 수 있는 값(리스트, 딕셔너리)은 <code>__init__</code> 안에서 <code>self.items = []</code>로 객체마다 새로 만들어야 해요.</p>',
    [t('(lambda a, b: (a.add(1), a.add(2), b.items)[2])(Basket(), Basket())', []), t('(lambda a: (a.add("x"), a.items)[1])(Basket())', ['x']), t('Basket().items', []), t('(lambda a, b: (a.add(1), b.add(2), [a.items, b.items])[2])(Basket(), Basket())', [[1], [2]])]),

  // ================= ④ 캡슐화와 종합 =================
  c(D, 4, '비밀번호 사물함', `<p><code>Locker</code> 클래스를 만드세요. 비밀번호는 <code>self.__pin</code>으로 숨겨서 저장해요(밖에서 <code>locker.__pin</code>은 오류).</p><ul><li><code>__init__(self, pin)</code></li><li><code>open(pin)</code> — 비밀번호가 맞으면 <code>True</code>, 틀리면 <code>False</code></li><li><code>change_pin(old, new)</code> — <code>old</code>가 맞으면 새 비밀번호로 바꾸고 <code>True</code>, 틀리면 바꾸지 않고 <code>False</code></li></ul>`,
    `class Locker:\n    pass\n`, `class Locker:\n    def __init__(self, pin):\n        self.__pin = pin\n\n    def open(self, pin):\n        return pin == self.__pin\n\n    def change_pin(self, old, new):\n        if old == self.__pin:\n            self.__pin = new\n            return True\n        return False\n`,
    '<p>비밀번호는 밖에서 직접 못 보게 숨기고, 맞는지 확인하는 <b>창구 메서드</b>로만 다루는 것이 캡슐화예요.</p>',
    [t('Locker("1234").open("1234")', true), t('Locker("1234").open("0000")', false), t('(lambda l: (l.change_pin("1234", "9999"), l.open("9999"), l.open("1234")))(Locker("1234"))', [true, true, false]), t('(lambda l: (l.change_pin("x", "9"), l.open("1234")))(Locker("1234"))', [false, true]), t('raises(lambda: Locker("1").__pin)', 'AttributeError')]),
  c(D, 4, '게임 캐릭터 체력', `<p><code>Character</code> 클래스를 만드세요.</p><ul><li>클래스 속성 <code>max_hp = 100</code></li><li><code>__init__(self, name)</code> — <code>name</code> 저장, 체력 <code>__hp</code>를 <code>max_hp</code>로 시작 (숨김)</li><li><code>hit(dmg)</code> — 체력을 깎아요 (0 아래로는 내려가지 않음)</li><li><code>heal(amount)</code> — 체력을 회복해요 (<code>max_hp</code>를 넘지 않음)</li><li><code>get_hp()</code> — 체력, <code>is_alive()</code> — 체력이 0보다 크면 <code>True</code></li></ul>`,
    `class Character:\n    pass\n`,
    `class Character:\n    max_hp = 100\n\n    def __init__(self, name):\n        self.name = name\n        self.__hp = Character.max_hp\n\n    def hit(self, dmg):\n        self.__hp = max(0, self.__hp - dmg)\n\n    def heal(self, amount):\n        self.__hp = min(Character.max_hp, self.__hp + amount)\n\n    def get_hp(self):\n        return self.__hp\n\n    def is_alive(self):\n        return self.__hp > 0\n`,
    '<p>범위를 지키는 계산은 <code>max(0, ...)</code>, <code>min(최댓값, ...)</code>로 간단히 할 수 있어요. 체력 숨김 속성은 메서드 안에서만 직접 바꿔요.</p>',
    [t('Character("a").get_hp()', 100), t('(lambda c: (c.hit(30), c.get_hp())[1])(Character("a"))', 70), t('(lambda c: (c.hit(30), c.heal(50), c.get_hp())[2])(Character("a"))', 100), t('(lambda c: (c.hit(150), c.get_hp(), c.is_alive())[1:])(Character("a"))', [0, false]), t('(lambda c: (c.hit(99), c.is_alive())[1])(Character("a"))', true)]),
  c(D, 4, '재고가 있는 상품', `<p><code>Item</code> 클래스를 만드세요. 클래스 속성 <code>created = 0</code>(만들어진 상품 수, 객체 생성마다 +1), 숨긴 인스턴스 속성 <code>__stock</code>(재고)을 가져요.</p><ul><li><code>__init__(self, name, stock)</code></li><li><code>sell(n)</code> — 재고가 부족하면 <code>ValueError</code>, 아니면 재고를 줄여요</li><li><code>restock(n)</code> — 재고를 늘려요</li><li><code>get_stock()</code> — 재고</li></ul>`,
    `class Item:\n    pass\n`,
    `class Item:\n    created = 0\n\n    def __init__(self, name, stock):\n        self.name = name\n        self.__stock = stock\n        Item.created += 1\n\n    def sell(self, n):\n        if n > self.__stock:\n            raise ValueError("재고 부족")\n        self.__stock -= n\n\n    def restock(self, n):\n        self.__stock += n\n\n    def get_stock(self):\n        return self.__stock\n`,
    '<p>클래스 속성(공유 카운트)과 숨긴 인스턴스 속성(개별 재고)을 한 클래스에서 함께 다루는 연습이에요.</p>',
    [t('(lambda i: (i.sell(3), i.get_stock())[1])(Item("a", 10))', 7), t('raises(lambda: Item("a", 2).sell(3))', 'ValueError'), t('(lambda i: (i.restock(5), i.get_stock())[1])(Item("a", 1))', 6), t('(lambda b: (Item("x", 1), Item("y", 1), Item.created - b)[2])(Item.created)', 2), t('(lambda a, b: (a.sell(1), b.get_stock())[1])(Item("a", 5), Item("b", 5))', 5)]),
  c(D, 4, '책 대출 상태 관리', `<p><code>LibraryBook</code> 클래스를 만드세요. <code>__init__(self, title)</code>에서 제목과 <code>is_borrowed = False</code>를 저장해요.</p><ul><li><code>borrow()</code> — 빌릴 수 있으면 상태를 바꾸고 <code>"대출 완료"</code>, 이미 대출 중이면 <code>"이미 대출 중"</code>을 돌려줘요</li><li><code>give_back()</code> — 대출 중이면 반납하고 <code>"반납 완료"</code>, 아니면 <code>"대출 중이 아님"</code>을 돌려줘요</li></ul>`,
    `class LibraryBook:\n    pass\n`,
    `class LibraryBook:\n    def __init__(self, title):\n        self.title = title\n        self.is_borrowed = False\n\n    def borrow(self):\n        if self.is_borrowed:\n            return "이미 대출 중"\n        self.is_borrowed = True\n        return "대출 완료"\n\n    def give_back(self):\n        if not self.is_borrowed:\n            return "대출 중이 아님"\n        self.is_borrowed = False\n        return "반납 완료"\n`,
    '<p>상태(<code>is_borrowed</code>)를 속성으로 두고, 메서드가 그 상태를 확인한 뒤 바꾸면서 결과 문구를 돌려줘요.</p>',
    [t('(lambda b: (b.borrow(), b.borrow()))(LibraryBook("a"))', ['대출 완료', '이미 대출 중']), t('LibraryBook("a").give_back()', '대출 중이 아님'), t('(lambda b: (b.borrow(), b.give_back(), b.borrow()))(LibraryBook("a"))', ['대출 완료', '반납 완료', '대출 완료']), t('(lambda a, b: (a.borrow(), b.borrow())[1])(LibraryBook("a"), LibraryBook("b"))', '대출 완료')]),
  p(D, 4, '종합: 영수증 출력', `<p>변수 <code>names</code>, <code>prices</code>(같은 길이 리스트)가 주어져요. <code>Product</code> 클래스를 만드세요.</p><ul><li>클래스 속성 <code>tax_percent = 10</code></li><li><code>__init__(self, name, price)</code></li><li>메서드 <code>total()</code> — <code>price * (100 + tax_percent) // 100</code> (세금 포함 가격, 정수)</li></ul><p>상품마다 객체를 만들어 <code>이름: 세금 포함 가격</code>을 한 줄씩 출력하고, 마지막에 <code>합계: ○</code>(세금 포함 가격의 합)를 출력하세요.</p>`,
    `class Product:\n    tax_percent = 10\n\n    def __init__(self, name, price):\n        self.name = name\n        self.price = price\n\n    def total(self):\n        return self.price * (100 + Product.tax_percent) // 100\n\n\nproducts = [Product(n, pr) for n, pr in zip(names, prices)]\nfor pd_ in products:\n    print(f"{pd_.name}: {pd_.total()}")\nprint(f"합계: {sum(x.total() for x in products)}")\n`,
    '<p>클래스 속성(세율) + 인스턴스 속성(이름·가격) + 메서드(계산)를 함께 쓰는 종합 문제예요. 합계는 각 객체의 <code>total()</code>을 더해요.</p>',
    ['names = ["콜라", "과자"]\nprices = [1000, 1500]', 'names = ["pen"]\nprices = [300]', 'names = ["a", "b", "c"]\nprices = [100, 200, 350]'], { needs: [['def\\s+total\\(\\s*self', 'total(self) 메서드를 만들어 보세요']] }),
  p(D, 5, '종합: 지갑과 송금', `<p>변수 <code>a_money</code>, <code>b_money</code>, <code>amount</code>가 주어져요. <code>Wallet</code> 클래스를 만드세요.</p><ul><li><code>__init__(self, owner, money)</code> — 주인 이름과 <b>숨긴</b> 잔액 <code>__money</code></li><li><code>get_money()</code> — 잔액</li><li><code>send(other, amount)</code> — 내 잔액이 충분하면 <code>other</code>에게 보내고 <code>True</code>, 부족하면 아무것도 바꾸지 않고 <code>False</code></li></ul><p><code>a = Wallet("A", a_money)</code>, <code>b = Wallet("B", b_money)</code>를 만들고 <code>a.send(b, amount)</code>의 결과와 두 잔액을 <code>결과 A잔액 B잔액</code> 형태(띄어쓰기)로 출력하세요.</p>`,
    `class Wallet:\n    def __init__(self, owner, money):\n        self.owner = owner\n        self.__money = money\n\n    def get_money(self):\n        return self.__money\n\n    def send(self, other, amount):\n        if amount > self.__money:\n            return False\n        self.__money -= amount\n        other._Wallet__money += amount\n        return True\n\n\na = Wallet("A", a_money)\nb = Wallet("B", b_money)\nok = a.send(b, amount)\nprint(ok, a.get_money(), b.get_money())\n`,
    '<p>같은 클래스 안에서는 다른 객체의 숨김 속성도 <code>other.__money</code>로 쓸 수 있어요(클래스 안에서는 이름이 자동으로 같게 바뀌니까요). 또는 받는 쪽에 <code>receive</code> 같은 메서드를 두는 방법도 있어요.</p>',
    ['a_money = 1000\nb_money = 500\namount = 300', 'a_money = 100\nb_money = 0\namount = 300', 'a_money = 300\nb_money = 300\namount = 300'], { needs: [['class\\s+Wallet', 'Wallet 클래스를 만들어 주세요'], ['def\\s+send\\(\\s*self', 'send 메서드를 만들어 보세요']] }),
];
