// 딥러닝 사다리 (4단계): 기본기 → 대표 네트워크(CNN·RNN·어텐션) → TensorFlow식 텐서·층·모델 → PyTorch식 autograd·학습 루프
// TensorFlow, PyTorch 는 이 브라우저(Pyodide)에서 실행할 수 없어서 같은 개념을 NumPy 와 파이썬으로 직접 만들어 본다.
import VAL from './dsdl_values.mjs';
const D1 = 'DL ① 딥러닝 기본기';
const D2 = 'DL ② 대표 딥러닝 네트워크 (CNN·RNN·어텐션)';
const D3 = 'DL ③ TensorFlow 기초 (텐서·층·모델)';
const D4 = 'DL ④ PyTorch 기초 (autograd·학습 루프)';
const t = (call, expected) => ({ call, expected: expected !== undefined ? expected : VAL[call], visible: false });
const V = (...xs) => xs.map((x, i) => ({ ...x, visible: i < 2 }));
const NP = ['numpy'];
const IMP = 'import numpy as np\n\n\n';
const f = (category, level, title, sig, desc, solution, hint, tests, extra = {}) => ({
  track: 'ds', category, level, title, desc, solution, hint, tests: V(...tests), packages: NP,
  starter: `import numpy as np\n\n\n${sig.startsWith('class') ? sig + ':\n    pass\n' : 'def ' + sig + ':\n    pass\n'}`, ...extra,
});
const NOTE_TF = '<p class="muted">TensorFlow는 이 브라우저에서 실행할 수 없어요. 대신 같은 <b>개념</b>(텐서, 층, 모델)을 넘파이로 직접 만들어 보면서 익혀요. 나중에 TensorFlow/Keras를 쓸 때 이름만 바꿔 그대로 이해할 수 있어요.</p>';
const NOTE_PT = '<p class="muted">PyTorch도 이 브라우저에서 실행할 수 없어요. 대신 PyTorch의 핵심인 <b>자동 미분(autograd)</b>과 <b>학습 루프</b>를 파이썬으로 직접 만들어 봐요.</p>';

// autograd 문제 채점용 숨은 보조 코드
const SETUP_GRAD = `def run_grad(fn, vals):
    vs = [Value(v) for v in vals]
    out = fn(*vs)
    out.backward()
    return [round(out.data, 4)] + [round(v.grad, 4) for v in vs]


class P:
    def __init__(self, data, grad=0.0):
        self.data = data
        self.grad = grad
`;
const VALUE_BASE = `class Value:
    def __init__(self, data, _children=(), _op=""):
        self.data = data
        self.grad = 0.0
        self._backward = lambda: None
        self._prev = set(_children)

    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data + other.data, (self, other), "+")

        def _backward():
            self.grad += out.grad
            other.grad += out.grad

        out._backward = _backward
        return out

    def __mul__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data * other.data, (self, other), "*")

        def _backward():
            self.grad += other.data * out.grad
            other.grad += self.data * out.grad

        out._backward = _backward
        return out

    def __pow__(self, k):
        out = Value(self.data ** k, (self,), "**")

        def _backward():
            self.grad += k * (self.data ** (k - 1)) * out.grad

        out._backward = _backward
        return out

    def __neg__(self):
        return self * -1

    def __sub__(self, other):
        return self + (-other if isinstance(other, Value) else Value(-other))

    def __radd__(self, other):
        return self + other

    def __rmul__(self, other):
        return self * other

    def backward(self):
        topo, seen = [], set()

        def build(v):
            if v not in seen:
                seen.add(v)
                for c in v._prev:
                    build(c)
                topo.append(v)

        build(self)
        self.grad = 1.0
        for v in reversed(topo):
            v._backward()
`;

export default [
  // ================= ① 딥러닝 기본기 =================
  f(D1, 2, '가중치 초기화: 자비에 표준편차', 'xavier_std(n_in, n_out)',
    `<p>신경망의 가중치를 너무 크거나 작게 초기화하면 학습이 잘 안 돼요. <b>Xavier(Glorot) 초기화</b>는 정규분포의 표준편차를 <code>√(2 / (입력 개수 + 출력 개수))</code>로 정해요. 소수 넷째 자리까지 반올림해 돌려주는 <code>xavier_std(n_in, n_out)</code>를 만드세요.</p>`,
    IMP + `def xavier_std(n_in, n_out):\n    return round(float(np.sqrt(2 / (n_in + n_out))), 4)\n`, '<p>층의 크기가 클수록 표준편차를 작게 해서 출력이 폭주하지 않게 해요. <code>np.sqrt</code>를 써요.</p>',
    [t('xavier_std(100, 100)', 0.1), t('xavier_std(2, 2)', 0.7071), t('xavier_std(784, 256)', 0.0439), t('xavier_std(1, 1)', 1)]),
  f(D1, 3, '모멘텀 경사하강법 한 스텝', 'momentum_step(w, v, grad, lr, beta)',
    `<p>모멘텀은 "이전 이동 방향(속도)"을 기억해서 더 부드럽고 빠르게 내려가요. 속도 <code>v ← beta·v − lr·grad</code>, 가중치 <code>w ← w + v</code> 순서로 갱신한 <code>[새 w, 새 v]</code>를 소수 여섯째 자리까지 반올림해 돌려주는 <code>momentum_step(w, v, grad, lr, beta)</code>를 만드세요.</p>`,
    `def momentum_step(w, v, grad, lr, beta):\n    v = beta * v - lr * grad\n    w = w + v\n    return [round(w, 6), round(v, 6)]\n`, '<p>먼저 <b>속도 v</b>를 갱신하고, 그 새 속도로 w를 움직여요. 순서를 바꾸지 마세요.</p>',
    [t('momentum_step(1.0, 0.0, 0.5, 0.1, 0.9)', [0.95, -0.05]), t('momentum_step(0.95, -0.05, 0.5, 0.1, 0.9)', [0.855, -0.095]), t('momentum_step(2.0, 0.0, 0.0, 0.1, 0.9)', [2, 0]), t('momentum_step(0.0, 1.0, 0.0, 0.1, 0.5)', [0.5, 0.5])]),
  f(D1, 4, 'Adam 한 스텝', 'adam_step(w, m, v, g, t, lr=0.001, b1=0.9, b2=0.999, eps=1e-8)',
    `<p>Adam은 기울기의 평균(m)과 제곱 평균(v)을 함께 써서 스스로 보폭을 조절해요. <code>t</code>번째 스텝(1부터)에서</p><ol><li><code>m ← b1·m + (1−b1)·g</code>, <code>v ← b2·v + (1−b2)·g²</code></li><li>보정: <code>m̂ = m / (1 − b1^t)</code>, <code>v̂ = v / (1 − b2^t)</code></li><li><code>w ← w − lr · m̂ / (√v̂ + eps)</code></li></ol><p><code>[새 w, 새 m, 새 v]</code>를 소수 여섯째 자리까지 반올림해 돌려주는 <code>adam_step</code>을 만드세요.</p>`,
    `import math\n\n\ndef adam_step(w, m, v, g, t, lr=0.001, b1=0.9, b2=0.999, eps=1e-8):\n    m = b1 * m + (1 - b1) * g\n    v = b2 * v + (1 - b2) * g ** 2\n    m_hat = m / (1 - b1 ** t)\n    v_hat = v / (1 - b2 ** t)\n    w = w - lr * m_hat / (math.sqrt(v_hat) + eps)\n    return [round(w, 6), round(m, 6), round(v, 6)]\n`, '<p>식을 위에서 아래로 그대로 코드로 옮기면 돼요. 처음 몇 스텝에서는 m, v가 0에서 시작해 작게 나오는데, 보정(<code>1 − b^t</code>로 나누기)이 이를 바로잡아요.</p>',
    [t('adam_step(1.0, 0.0, 0.0, 2.0, 1)', [0.999, 0.2, 0.004]), t('adam_step(0.5, 0.0, 0.0, -1.0, 1)', [0.501, -0.1, 0.001]), t('adam_step(3.0, 0.0, 0.0, 0.0, 1)', [3, 0, 0]), t('adam_step(1.0, 0.0, 0.0, 5.0, 1, lr=0.1)', [0.9, 0.5, 0.025])]),
  f(D1, 3, '소프트맥스 + 크로스 엔트로피의 기울기', 'softmax_ce_grad(logits, label)',
    `<p>분류 신경망에서 소프트맥스 출력과 정답 클래스의 크로스 엔트로피 손실을 <b>로짓(logits)</b>으로 미분하면 놀랄 만큼 간단해요: <code>(소프트맥스 확률) − (원-핫 정답)</code>. 로짓 리스트 <code>logits</code>와 정답 클래스 번호 <code>label</code>이 주어질 때 이 기울기를 소수 넷째 자리까지 반올림한 리스트로 돌려주는 <code>softmax_ce_grad(logits, label)</code>를 만드세요.</p>`,
    IMP + `def softmax_ce_grad(logits, label):\n    z = np.array(logits, dtype=float)\n    e = np.exp(z - z.max())\n    p = e / e.sum()\n    p[label] -= 1\n    return np.round(p, 4).tolist()\n`, '<p>① 소프트맥스(<code>z − max</code>를 빼면 오버플로가 안 생겨요) → ② 정답 클래스 자리에서만 1을 빼요. 정답 클래스의 값은 음수가 되고, 나머지는 양수예요.</p>',
    [t('softmax_ce_grad([0, 0], 0)', [-0.5, 0.5]), t('softmax_ce_grad([1, 2, 3], 2)', [0.09, 0.2447, -0.3348]), t('softmax_ce_grad([10, 0], 0)', [0, 0]), t('abs(sum(softmax_ce_grad([1, 2, 3], 0))) < 0.001', true)]),
  f(D1, 3, '수치 미분으로 기울기 확인', 'numerical_grad(f, x, h=1e-5)',
    `<p>역전파가 맞게 구현됐는지 확인할 때 <b>수치 미분</b>을 써요. 함수 <code>f</code>의 점 <code>x</code>에서의 기울기를 <b>중앙 차분</b> <code>(f(x+h) − f(x−h)) / (2h)</code>로 구해 소수 넷째 자리까지 반올림해 돌려주는 <code>numerical_grad(f, x, h=1e-5)</code>를 만드세요.</p>`,
    `def numerical_grad(f, x, h=1e-5):\n    return round((f(x + h) - f(x - h)) / (2 * h), 4)\n`, '<p>함수 <code>f</code>를 인수로 받아 <code>f(x + h)</code>처럼 호출해요. 앞뒤로 조금씩 움직여 본 변화량이 곧 기울기예요.</p>',
    [t('numerical_grad(lambda x: x ** 2, 3)', 6), t('numerical_grad(lambda x: x ** 3, 2)', 12), t('numerical_grad(lambda x: 3 * x + 1, 10)', 3), t('numerical_grad(lambda x: 5, 1)', 0)]),
  f(D1, 2, '학습률 줄이기 (스케줄)', 'lr_decay(lr0, decay, epoch)',
    `<p>학습이 진행될수록 학습률을 줄이면 안정적으로 수렴해요. 두 함수를 한 파일에 만드세요. (소수 여섯째 자리까지 반올림)</p><ol><li><code>lr_decay(lr0, decay, epoch)</code> — 시간 감쇠: <code>lr0 / (1 + decay × epoch)</code></li><li><code>step_decay(lr0, drop, every, epoch)</code> — 계단 감쇠: <code>lr0 × drop ** (epoch // every)</code></li></ol>`,
    `def lr_decay(lr0, decay, epoch):\n    return round(lr0 / (1 + decay * epoch), 6)\n\n\ndef step_decay(lr0, drop, every, epoch):\n    return round(lr0 * drop ** (epoch // every), 6)\n`, '<p><code>//</code>는 몫만 구하는 나눗셈이에요. 에폭이 <code>every</code>의 배수에 도달할 때마다 학습률이 <code>drop</code>배로 줄어요.</p>',
    [t('lr_decay(0.1, 0.5, 2)', 0.05), t('step_decay(0.1, 0.5, 10, 25)', 0.025), t('lr_decay(0.1, 0.5, 0)', 0.1), t('step_decay(0.1, 0.5, 10, 9)', 0.1)],
    { starter: 'def lr_decay(lr0, decay, epoch):\n    pass\n\n\ndef step_decay(lr0, drop, every, epoch):\n    pass\n' }),
  f(D1, 2, '로짓에서 정확도 구하기', 'accuracy_logits(logits, labels)',
    `<p>분류 신경망의 출력(로짓) 행렬 <code>logits</code>(샘플마다 클래스 점수 한 줄)과 정답 번호 리스트 <code>labels</code>가 있어요. 각 샘플에서 <b>점수가 가장 큰 클래스</b>(<code>argmax</code>)가 정답과 같은 비율(정확도)을 소수 넷째 자리까지 반올림해 돌려주는 <code>accuracy_logits(logits, labels)</code>를 만드세요.</p>`,
    IMP + `def accuracy_logits(logits, labels):\n    pred = np.argmax(np.array(logits, dtype=float), axis=1)\n    return round(float(np.mean(pred == np.array(labels))), 4)\n`, '<p><code>np.argmax(행렬, axis=1)</code>은 행마다 가장 큰 값의 위치를 줘요. 예측과 정답을 <code>==</code>로 비교하면 True/False 배열이 되고, 그 평균이 정확도예요.</p>',
    [t('accuracy_logits([[2, 1], [0, 3]], [0, 1])', 1), t('accuracy_logits([[2, 1], [0, 3]], [1, 1])', 0.5), t('accuracy_logits([[0.1, 0.2, 0.7]], [2])', 1), t('accuracy_logits([[1, 0], [1, 0], [0, 1], [0, 1]], [0, 1, 1, 0])', 0.5)]),

  // ================= ② 대표 딥러닝 네트워크 =================
  f(D2, 2, '합성곱 출력 크기', 'conv_output_size(n, k, stride=1, pad=0)',
    `<p>CNN에서 입력 크기 <code>n</code>, 필터 크기 <code>k</code>, 보폭(stride), 패딩(pad)이면 출력 크기는 <code>(n + 2·pad − k) // stride + 1</code>이에요. 이를 계산하는 <code>conv_output_size(n, k, stride=1, pad=0)</code>를 만드세요.</p>`,
    `def conv_output_size(n, k, stride=1, pad=0):\n    return (n + 2 * pad - k) // stride + 1\n`, '<p>필터가 입력 위를 한 칸(stride)씩 움직이며 놓일 수 있는 위치의 개수예요. 패딩을 두르면 가장자리에서 줄어드는 크기를 막을 수 있어요.</p>',
    [t('conv_output_size(28, 3)', 26), t('conv_output_size(32, 5, 2, 2)', 16), t('conv_output_size(28, 3, 1, 1)', 28), t('conv_output_size(7, 7)', 1)]),
  f(D2, 3, '2차원 합성곱 직접 구현', 'conv2d(image, kernel)',
    `<p>합성곱은 작은 필터(커널)를 이미지 위에서 한 칸씩 옮기며 <b>겹친 칸끼리 곱해 모두 더한 값</b>을 모아요. 보폭 1, 패딩 없음(valid)으로 계산한 결과를 2차원 리스트로 돌려주는 <code>conv2d(image, kernel)</code>를 만드세요. (뒤집지 않는 상관 연산 방식이에요)</p><p>예: 이미지 <code>[[1,2,3],[4,5,6],[7,8,9]]</code>, 커널 <code>[[1,0],[0,1]]</code> → <code>[[6, 8], [12, 14]]</code></p>`,
    IMP + `def conv2d(image, kernel):\n    img = np.array(image, dtype=float)\n    ker = np.array(kernel, dtype=float)\n    kh, kw = ker.shape\n    out_h = img.shape[0] - kh + 1\n    out_w = img.shape[1] - kw + 1\n    out = np.zeros((out_h, out_w))\n    for i in range(out_h):\n        for j in range(out_w):\n            out[i, j] = np.sum(img[i:i + kh, j:j + kw] * ker)\n    return out.tolist()\n`, '<p>출력의 한 칸 <code>(i, j)</code>은 이미지의 <code>img[i:i+kh, j:j+kw]</code> 조각과 커널을 곱해 합한 값이에요. 이중 반복으로 모든 위치를 훑어요.</p>',
    [t('conv2d([[1, 2, 3], [4, 5, 6], [7, 8, 9]], [[1, 0], [0, 1]])', [[6, 8], [12, 14]]), t('conv2d([[1, 2], [3, 4]], [[1, 1], [1, 1]])', [[10]]), t('conv2d([[1, 0, 1], [0, 1, 0], [1, 0, 1]], [[1]])', [[1, 0, 1], [0, 1, 0], [1, 0, 1]]), t('conv2d([[1, 2, 3, 4]], [[1, -1]])', [[-1, -1, -1]])]),
  f(D2, 3, '최대 풀링', 'maxpool2d(image, size)',
    `<p>풀링은 이미지를 작게 줄여요. <b>최대 풀링</b>은 <code>size × size</code> 칸씩 겹치지 않게 나눠 각 칸의 <b>최댓값</b>만 남겨요. (이미지 크기는 size로 나누어떨어진다고 가정) 2차원 리스트로 돌려주는 <code>maxpool2d(image, size)</code>를 만드세요.</p>`,
    IMP + `def maxpool2d(image, size):\n    img = np.array(image, dtype=float)\n    h, w = img.shape\n    out = np.zeros((h // size, w // size))\n    for i in range(h // size):\n        for j in range(w // size):\n            out[i, j] = img[i * size:(i + 1) * size, j * size:(j + 1) * size].max()\n    return out.tolist()\n`, '<p>출력 칸마다 해당하는 <code>size×size</code> 조각을 슬라이싱해서 <code>.max()</code>를 구해요. 위치가 조금 흔들려도 특징이 유지되는 효과가 있어요.</p>',
    [t('maxpool2d([[1, 3, 2, 4], [5, 6, 7, 8], [3, 2, 1, 0], [1, 2, 3, 4]], 2)', [[6, 8], [3, 4]]), t('maxpool2d([[1, 2], [3, 4]], 2)', [[4]]), t('maxpool2d([[5, 1], [2, 0]], 1)', [[5, 1], [2, 0]]), t('maxpool2d([[-1, -2], [-3, -4]], 2)', [[-1]])]),
  f(D2, 3, '모델의 파라미터 수 세기', 'count_params(layers)',
    `<p>층마다 학습해야 할 가중치가 몇 개인지 세어 보면 모델의 크기를 알 수 있어요. <code>layers</code>는 층 설명의 리스트예요.</p><ul><li><code>("conv", 입력채널, 출력채널, k)</code> — 파라미터 = 출력채널 × (입력채널 × k × k + 1)</li><li><code>("dense", 입력수, 출력수)</code> — 파라미터 = 입력수 × 출력수 + 출력수</li></ul><p>전체 파라미터 수를 돌려주는 <code>count_params(layers)</code>를 만드세요. 예: <code>[("conv", 1, 8, 3), ("dense", 200, 10)]</code> → <code>2090</code></p>`,
    `def count_params(layers):\n    total = 0\n    for layer in layers:\n        if layer[0] == "conv":\n            _, c_in, c_out, k = layer\n            total += c_out * (c_in * k * k + 1)\n        else:\n            _, n_in, n_out = layer\n            total += n_in * n_out + n_out\n    return total\n`, '<p>"+1"과 "+ 출력수"는 편향(bias)이에요. 층 종류(<code>layer[0]</code>)로 나눠 계산하고 모두 더해요.</p>',
    [t('count_params([("conv", 1, 8, 3), ("dense", 200, 10)])', 2090), t('count_params([("dense", 784, 128), ("dense", 128, 10)])', 101770), t('count_params([("conv", 3, 16, 3)])', 448), t('count_params([])', 0)],
    { starter: 'def count_params(layers):\n    pass\n' }),
  f(D2, 4, 'RNN 한 스텝', 'rnn_step(x, h, Wx, Wh, b)',
    `<p>순환 신경망(RNN)은 "지금 입력"과 "이전 기억(은닉 상태)"을 함께 써서 새 기억을 만들어요: <code>h_new = tanh(x·Wx + h·Wh + b)</code>. <code>x</code>(길이 d_in), <code>h</code>(길이 d_h), <code>Wx</code>(d_in×d_h), <code>Wh</code>(d_h×d_h), <code>b</code>(길이 d_h)로 새 은닉 상태를 소수 넷째 자리까지 반올림한 리스트로 돌려주는 <code>rnn_step</code>을 만드세요.</p>`,
    IMP + `def rnn_step(x, h, Wx, Wh, b):\n    x = np.array(x, dtype=float)\n    h = np.array(h, dtype=float)\n    out = np.tanh(x @ np.array(Wx, dtype=float) + h @ np.array(Wh, dtype=float) + np.array(b, dtype=float))\n    return np.round(out, 4).tolist()\n`, '<p>두 행렬곱(입력 쪽, 기억 쪽)을 더하고 편향을 더한 뒤 <code>np.tanh</code>를 씌워요. tanh 덕분에 값이 −1~1 사이로 눌려요.</p>',
    [t('rnn_step([1], [0], [[1]], [[0.5]], [0])', [0.7616]), t('rnn_step([1], [1], [[1]], [[0.5]], [0])', [0.9051]), t('rnn_step([0], [0], [[1]], [[1]], [0])', [0]), t('rnn_step([1, 0], [0, 0], [[1, 0], [0, 1]], [[0, 0], [0, 0]], [0, 0])', [0.7616, 0])]),
  f(D2, 4, 'RNN으로 시퀀스 읽기', 'rnn_forward(xs, Wx, Wh, b)',
    `<p>입력 시퀀스 <code>xs</code>(시간 순서대로 벡터들)를 한 칸씩 읽으며 <code>h = tanh(x·Wx + h·Wh + b)</code>를 반복해서 <b>마지막 은닉 상태</b>를 소수 넷째 자리까지 반올림한 리스트로 돌려주는 <code>rnn_forward(xs, Wx, Wh, b)</code>를 만드세요. 처음 은닉 상태는 0들이에요. 은닉 크기는 <code>b</code>의 길이예요.</p>`,
    IMP + `def rnn_forward(xs, Wx, Wh, b):\n    Wx = np.array(Wx, dtype=float)\n    Wh = np.array(Wh, dtype=float)\n    b = np.array(b, dtype=float)\n    h = np.zeros(len(b))\n    for x in xs:\n        h = np.tanh(np.array(x, dtype=float) @ Wx + h @ Wh + b)\n    return np.round(h, 4).tolist()\n`, '<p>한 스텝 함수를 시간 순서대로 반복 호출하면서 <code>h</code>를 계속 덮어써요. 앞에서 읽은 내용이 <code>h</code>에 쌓여 다음 계산에 쓰이는 것이 "기억"이에요.</p>',
    [t('rnn_forward([[1], [1]], [[1]], [[0.5]], [0])', [0.8811]), t('rnn_forward([[0], [0]], [[1]], [[1]], [0])', [0]), t('rnn_forward([[1]], [[2]], [[0]], [0])', [0.964]), t('len(rnn_forward([[1, 2], [3, 4], [5, 6]], [[0.1, 0.2], [0.3, 0.4]], [[0.5, 0], [0, 0.5]], [0, 0]))', 2)]),
  f(D2, 5, '어텐션 (Scaled Dot-Product)', 'attention(Q, K, V)',
    `<p>트랜스포머의 핵심인 <b>어텐션</b>은 "질문(Q)과 키(K)가 얼마나 맞는지"로 값(V)을 섞어요: <code>softmax(Q·Kᵀ / √d) · V</code> (d는 K의 열 개수, 소프트맥스는 <b>행마다</b>). 결과를 소수 넷째 자리까지 반올림한 2차원 리스트로 돌려주는 <code>attention(Q, K, V)</code>를 만드세요.</p>`,
    IMP + `def attention(Q, K, V):\n    Q = np.array(Q, dtype=float)\n    K = np.array(K, dtype=float)\n    V = np.array(V, dtype=float)\n    scores = Q @ K.T / np.sqrt(K.shape[1])\n    e = np.exp(scores - scores.max(axis=1, keepdims=True))\n    weights = e / e.sum(axis=1, keepdims=True)\n    return np.round(weights @ V, 4).tolist()\n`, '<p>① 점수 <code>Q @ K.T / sqrt(d)</code> ② 행마다 소프트맥스(<code>keepdims=True</code>로 모양을 유지하면 나눗셈이 편해요) ③ 가중치로 V를 섞기 <code>weights @ V</code>.</p>',
    [t('attention([[1, 0]], [[1, 0], [0, 1]], [[1, 2], [3, 4]])'), t('attention([[0, 0]], [[1, 0], [0, 1]], [[2, 0], [0, 2]])', [[1, 1]]), t('attention([[100, 0]], [[1, 0], [0, 1]], [[1, 2], [3, 4]])', [[1, 2]]), t('attention([[1, 1]], [[1, 1]], [[5, 6]])', [[5, 6]])]),
  f(D2, 5, '위치 인코딩', 'positional_encoding(pos, d)',
    `<p>트랜스포머는 단어 순서를 모르기 때문에 위치 정보를 더해 줘요. 위치 <code>pos</code>의 <b>사인·코사인 위치 인코딩</b> 벡터(길이 <code>d</code>, d는 짝수)를 소수 넷째 자리까지 반올림한 리스트로 돌려주는 <code>positional_encoding(pos, d)</code>를 만드세요.</p><ul><li>짝수 인덱스 <code>i</code>: <code>sin(pos / 10000^(i/d))</code></li><li>홀수 인덱스 <code>i</code>: <code>cos(pos / 10000^((i−1)/d))</code></li></ul>`,
    IMP + `def positional_encoding(pos, d):\n    out = []\n    for i in range(d):\n        angle = pos / (10000 ** ((i - i % 2) / d))\n        out.append(np.sin(angle) if i % 2 == 0 else np.cos(angle))\n    return np.round(out, 4).tolist()\n`, '<p>짝수/홀수 모두 지수의 분자가 "짝수 쪽 번호"예요: <code>i - i % 2</code>. 인덱스가 커질수록 주기가 길어져 서로 다른 위치를 구분해요.</p>',
    [t('positional_encoding(0, 4)', [0, 1, 0, 1]), t('positional_encoding(1, 2)', [0.8415, 0.5403]), t('positional_encoding(1, 4)', [0.8415, 0.5403, 0.01, 1]), t('positional_encoding(2, 2)', [0.9093, -0.4161])]),

  // ================= ③ TensorFlow 기초 =================
  f(D3, 1, '텐서의 모양 알아보기', 'tensor_info(t)',
    `${NOTE_TF}<p>텐서는 숫자가 담긴 N차원 배열이에요. 리스트 <code>t</code>를 넘파이 배열로 바꿔 <code>[차원 수(rank), 모양(shape 리스트), 원소 총 개수]</code>를 돌려주는 <code>tensor_info(t)</code>를 만드세요. 예: <code>[[1,2,3],[4,5,6]]</code> → <code>[2, [2, 3], 6]</code></p>`,
    IMP + `def tensor_info(t):\n    arr = np.array(t)\n    return [arr.ndim, list(arr.shape), int(arr.size)]\n`, '<p><code>arr.ndim</code>(차원 수), <code>arr.shape</code>(모양 튜플), <code>arr.size</code>(전체 원소 수)를 써요. 숫자 하나(스칼라)는 0차원이에요.</p>',
    [t('tensor_info([[1, 2, 3], [4, 5, 6]])', [2, [2, 3], 6]), t('tensor_info([1, 2, 3])', [1, [3], 3]), t('tensor_info([[[1], [2]]])', [3, [1, 2, 1], 2]), t('tensor_info(5)', [0, [], 1])]),
  f(D3, 2, '텐서 모양 바꾸기 (reshape)', 'reshape_batch(t, batch)',
    `${NOTE_TF}<p>납작한 리스트 <code>t</code>를 <b><code>batch</code>개의 행</b>(배치)로 나눈 2차원 리스트로 바꿔 돌려주는 <code>reshape_batch(t, batch)</code>를 만드세요. 열 개수는 자동으로 정해져요. (<code>reshape(batch, -1)</code>)</p>`,
    IMP + `def reshape_batch(t, batch):\n    return np.array(t).reshape(batch, -1).tolist()\n`, '<p><code>-1</code>은 "나머지는 알아서 맞춰 줘"라는 뜻이에요. 전체 원소 수가 행 개수로 나누어떨어져야 해요.</p>',
    [t('reshape_batch(list(range(12)), 3)', [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]]), t('reshape_batch([1, 2, 3, 4], 2)', [[1, 2], [3, 4]]), t('reshape_batch([1, 2, 3], 1)', [[1, 2, 3]]), t('reshape_batch([1, 2, 3], 3)', [[1], [2], [3]])]),
  f(D3, 2, '브로드캐스팅', 'broadcast_add(a, b)',
    `${NOTE_TF}<p>모양이 다른 텐서끼리도 연산할 수 있어요(브로드캐스팅). 2차원 리스트 <code>a</code>(n×m)의 <b>모든 행에 1차원 리스트 <code>b</code>(길이 m)를 더한</b> 결과를 2차원 리스트로 돌려주는 <code>broadcast_add(a, b)</code>를 만드세요. 신경망에서 편향(bias)을 더할 때 쓰는 연산이에요.</p>`,
    IMP + `def broadcast_add(a, b):\n    return (np.array(a) + np.array(b)).tolist()\n`, '<p>넘파이는 뒤쪽 모양이 맞으면 알아서 반복해서 더해 줘요. 직접 반복문을 쓸 필요가 없어요.</p>',
    [t('broadcast_add([[1, 2, 3], [4, 5, 6]], [10, 20, 30])', [[11, 22, 33], [14, 25, 36]]), t('broadcast_add([[0, 0]], [1, 2])', [[1, 2]]), t('broadcast_add([[1], [2]], [5])', [[6], [7]]), t('broadcast_add([[1, 1], [2, 2]], [0, 0])', [[1, 1], [2, 2]])]),
  f(D3, 2, '축 방향으로 평균 내기', 'reduce_mean(t, axis)',
    `${NOTE_TF}<p>텐서의 평균을 <code>axis</code> 방향으로 구하는 <code>reduce_mean(t, axis)</code>를 만드세요. <code>axis=0</code>이면 열마다(세로로 모아서), <code>axis=1</code>이면 행마다, <code>axis=None</code>이면 전체 평균이에요. 소수 넷째 자리까지 반올림한 리스트(전체 평균은 숫자 하나)로 돌려줘요.</p>`,
    IMP + `def reduce_mean(t, axis):\n    arr = np.array(t, dtype=float)\n    return np.round(arr.mean(axis=axis), 4).tolist()\n`, '<p><code>axis=0</code>은 "행들을 가로질러" 모으는 방향이라 열별 결과가 나와요. 헷갈리면 작은 예로 직접 실행해 보세요.</p>',
    [t('reduce_mean([[1, 2], [3, 4]], 0)', [2, 3]), t('reduce_mean([[1, 2], [3, 4]], 1)', [1.5, 3.5]), t('reduce_mean([[1, 2], [3, 4]], None)', 2.5), t('reduce_mean([[2, 4, 6]], 1)', [4])]),
  f(D3, 2, '미니배치 나누기', 'mini_batches(X, batch_size)',
    `${NOTE_TF}<p>딥러닝은 데이터를 한꺼번에 쓰지 않고 <b>미니배치</b>로 나눠 학습해요. 리스트 <code>X</code>를 앞에서부터 <code>batch_size</code>개씩 묶은 리스트의 리스트로 돌려주는 <code>mini_batches(X, batch_size)</code>를 만드세요. 마지막 묶음은 모자랄 수 있어요. 예: <code>[1,2,3,4,5]</code>, 2 → <code>[[1,2],[3,4],[5]]</code></p>`,
    `def mini_batches(X, batch_size):\n    return [X[i:i + batch_size] for i in range(0, len(X), batch_size)]\n`, '<p><code>range(0, len(X), batch_size)</code>로 시작 위치를 건너뛰며 돌고, 각 위치에서 <code>X[i:i+batch_size]</code>를 잘라요. 슬라이스는 끝을 넘어가도 오류가 안 나요.</p>',
    [t('mini_batches([1, 2, 3, 4, 5], 2)', [[1, 2], [3, 4], [5]]), t('mini_batches([1, 2, 3, 4], 2)', [[1, 2], [3, 4]]), t('mini_batches([], 3)', []), t('mini_batches([1, 2], 5)', [[1, 2]])],
    { starter: 'def mini_batches(X, batch_size):\n    pass\n' }),
  f(D3, 3, 'Dense 층 만들기', 'class Dense',
    `${NOTE_TF}<p>Keras의 <code>Dense</code> 층과 같은 클래스를 만드세요.</p><ul><li><code>Dense(weights, bias, activation=None)</code> — 가중치 행렬(<code>n_in × n_out</code>), 편향(길이 <code>n_out</code>), 활성화 이름(<code>None</code>, <code>"relu"</code>, <code>"sigmoid"</code>)을 저장해요. 가중치는 <code>self.W</code>, 편향은 <code>self.b</code>(넘파이 배열)로 저장하세요</li><li>객체를 함수처럼 호출하면(<code>layer(x)</code>) <code>x</code>(배치 × n_in 2차원 리스트)를 계산해 <b>소수 넷째 자리까지 반올림한 2차원 리스트</b>로 돌려줘요: <code>활성화(x·W + b)</code></li></ul>`,
    IMP + `class Dense:\n    def __init__(self, weights, bias, activation=None):\n        self.W = np.array(weights, dtype=float)\n        self.b = np.array(bias, dtype=float)\n        self.activation = activation\n\n    def __call__(self, x):\n        z = np.array(x, dtype=float) @ self.W + self.b\n        if self.activation == "relu":\n            z = np.maximum(0, z)\n        elif self.activation == "sigmoid":\n            z = 1 / (1 + np.exp(-z))\n        return np.round(z, 4).tolist()\n`, '<p>객체를 함수처럼 부르려면 <code>__call__(self, x)</code> 메서드를 만들어요. 활성화는 <code>if/elif</code>로 이름에 따라 고르면 돼요.</p>',
    [t('Dense([[1, 0], [0, 1]], [0, 0])([[1, 2]])', [[1, 2]]), t('Dense([[1, -1], [2, 2]], [0, -1], "relu")([[1, 1]])', [[3, 0]]), t('Dense([[1]], [0], "sigmoid")([[0]])', [[0.5]]), t('Dense([[2], [3]], [1])([[1, 1], [0, 2]])', [[6], [7]])]),
  f(D3, 4, 'Sequential 모델 만들기', 'class Sequential',
    `${NOTE_TF}<p>Keras의 <code>Sequential</code>처럼 <b>층을 순서대로 이어 붙이는</b> 모델을 만드세요. 아래 <code>Dense</code> 층을 같이 정의해 주세요(그대로 써도 돼요).</p><pre class="out">class Dense:\n    def __init__(self, weights, bias, activation=None):\n        self.W = np.array(weights, dtype=float)\n        self.b = np.array(bias, dtype=float)\n        self.activation = activation\n\n    def __call__(self, x):\n        z = np.array(x, dtype=float) @ self.W + self.b\n        if self.activation == "relu":\n            z = np.maximum(0, z)\n        return z</pre><ul><li><code>Sequential(layers)</code></li><li><code>model(x)</code> — 입력을 첫 층부터 마지막 층까지 차례로 통과시킨 <b>결과를 소수 넷째 자리까지 반올림한 2차원 리스트</b>로</li><li><code>model.count_params()</code> — 모든 층의 <code>W</code>, <code>b</code> 원소 개수의 합</li></ul>`,
    IMP + `class Dense:\n    def __init__(self, weights, bias, activation=None):\n        self.W = np.array(weights, dtype=float)\n        self.b = np.array(bias, dtype=float)\n        self.activation = activation\n\n    def __call__(self, x):\n        z = np.array(x, dtype=float) @ self.W + self.b\n        if self.activation == "relu":\n            z = np.maximum(0, z)\n        return z\n\n\nclass Sequential:\n    def __init__(self, layers):\n        self.layers = layers\n\n    def __call__(self, x):\n        for layer in self.layers:\n            x = layer(x)\n        return np.round(np.array(x, dtype=float), 4).tolist()\n\n    def count_params(self):\n        return sum(layer.W.size + layer.b.size for layer in self.layers)\n`, '<p>층들을 리스트로 들고 있다가, 입력을 <code>x = layer(x)</code>로 계속 덮어쓰며 통과시키면 돼요. 파라미터 수는 각 층의 <code>W.size + b.size</code>를 더해요.</p>',
    [t('Sequential([Dense([[1, 1]], [0], "relu"), Dense([[1], [1]], [0])])([[2]])', [[4]]), t('Sequential([Dense([[1, 1]], [0, -5], "relu"), Dense([[1], [1]], [0])])([[2]])', [[2]]), t('Sequential([Dense([[0, 0, 0], [0, 0, 0]], [0, 0, 0]), Dense([[0], [0], [0]], [0])]).count_params()', 13), t('Sequential([]).count_params()', 0)],
    { starter: 'import numpy as np\n\n\nclass Dense:\n    def __init__(self, weights, bias, activation=None):\n        self.W = np.array(weights, dtype=float)\n        self.b = np.array(bias, dtype=float)\n        self.activation = activation\n\n    def __call__(self, x):\n        z = np.array(x, dtype=float) @ self.W + self.b\n        if self.activation == "relu":\n            z = np.maximum(0, z)\n        return z\n\n\nclass Sequential:\n    pass\n' }),
  f(D3, 4, '모델 학습 루프 (fit)', 'fit_linear_gd(x, y, lr, epochs)',
    `${NOTE_TF}<p>Keras의 <code>model.fit()</code>이 속으로 하는 일을 직접 해 봐요. 직선 <code>ŷ = w·x + b</code>를 평균제곱오차(MSE)를 줄이는 <b>경사하강법</b>으로 학습해요. <code>w = 0</code>, <code>b = 0</code>에서 시작해서 <code>epochs</code>번 아래를 반복하고 <code>[w, b]</code>를 소수 넷째 자리까지 반올림해 돌려주는 <code>fit_linear_gd(x, y, lr, epochs)</code>를 만드세요.</p><ul><li>예측 <code>ŷ = w·x + b</code>, 오차 <code>e = ŷ − y</code></li><li>기울기: <code>dw = 2·평균(e·x)</code>, <code>db = 2·평균(e)</code></li><li>갱신: <code>w ← w − lr·dw</code>, <code>b ← b − lr·db</code></li></ul>`,
    IMP + `def fit_linear_gd(x, y, lr, epochs):\n    x = np.array(x, dtype=float)\n    y = np.array(y, dtype=float)\n    w, b = 0.0, 0.0\n    for _ in range(epochs):\n        e = w * x + b - y\n        dw = 2 * np.mean(e * x)\n        db = 2 * np.mean(e)\n        w -= lr * dw\n        b -= lr * db\n    return [round(float(w), 4), round(float(b), 4)]\n`, '<p>"예측 → 오차 → 기울기 → 갱신"을 에폭만큼 반복하는 것이 모든 딥러닝 학습의 기본 뼈대예요. 한 에폭에서 w와 b는 <b>같은 오차</b>로 함께 갱신해요.</p>',
    [t('fit_linear_gd([1, 2, 3], [2, 4, 6], 0.1, 1)', [1.8667, 0.8]), t('fit_linear_gd([1, 2], [3, 5], 0.1, 1)', [1.3, 0.8]), t('fit_linear_gd([1, 2], [3, 5], 0.5, 1)', [6.5, 4]), t('fit_linear_gd([1, 2, 3], [2, 4, 6], 0.1, 0)', [0, 0])]),

  // ================= ④ PyTorch 기초 =================
  f(D4, 2, '값을 감싸는 Value 클래스 (순전파)', 'class Value',
    `${NOTE_PT}<p>PyTorch의 텐서는 값과 함께 <b>기울기(grad)</b>도 들고 다녀요. 먼저 숫자 하나를 감싸는 <code>Value</code> 클래스의 <b>순전파</b> 부분을 만드세요.</p><ul><li><code>Value(data)</code> — 속성 <code>data</code>(값), <code>grad</code>(기울기, 처음 <code>0.0</code>)</li><li><code>+</code>, <code>*</code>, <code>-</code>(빼기), <code>**</code>(정수 거듭제곱) 연산 — 결과도 <code>Value</code>예요. 일반 숫자와도 계산돼야 해요 (<code>Value(2) * 3</code>, <code>3 * Value(2)</code>, <code>1 + Value(2)</code>)</li></ul>`,
    `class Value:\n    def __init__(self, data):\n        self.data = data\n        self.grad = 0.0\n\n    def __add__(self, other):\n        other = other if isinstance(other, Value) else Value(other)\n        return Value(self.data + other.data)\n\n    def __mul__(self, other):\n        other = other if isinstance(other, Value) else Value(other)\n        return Value(self.data * other.data)\n\n    def __pow__(self, k):\n        return Value(self.data ** k)\n\n    def __neg__(self):\n        return Value(-self.data)\n\n    def __sub__(self, other):\n        other = other if isinstance(other, Value) else Value(other)\n        return Value(self.data - other.data)\n\n    def __radd__(self, other):\n        return self + other\n\n    def __rmul__(self, other):\n        return self * other\n`, '<p><code>__add__</code>, <code>__mul__</code> 같은 특수 메서드를 만들면 <code>+</code>, <code>*</code>가 동작해요. 숫자와 Value를 함께 쓸 수 있게 <code>isinstance</code>로 감싸 주고, 왼쪽이 숫자인 경우(<code>3 * v</code>)는 <code>__rmul__</code>이 처리해요.</p>',
    [t('(Value(2) * 3 + Value(1)).data', 7), t('(Value(3) ** 2).data', 9), t('(Value(5) - Value(2)).data', 3), t('(2 * Value(4) + 1).data', 9), t('Value(1).grad', 0)]),
  f(D4, 4, '역전파 만들기 (더하기와 곱하기)', 'class Value',
    `${NOTE_PT}<p>PyTorch의 <code>loss.backward()</code>가 하는 일이 <b>역전파</b>예요. 연산 그래프를 거꾸로 거슬러 올라가며 각 값이 결과에 미치는 영향(기울기)을 계산해요. <code>Value</code> 클래스에 아래를 추가하세요.</p><ul><li>결과 <code>Value</code>가 <b>어떤 값들에서 나왔는지</b> 기억하고(<code>_prev</code>), 각 연산이 기울기를 되돌려 주는 <code>_backward</code>를 가져요</li><li>덧셈: 두 입력 모두 <code>out.grad</code>를 더해 받아요 (<code>+=</code>)</li><li>곱셈: 각 입력은 <code>상대 값 × out.grad</code>를 더해 받아요</li><li><code>backward()</code> — 결과의 <code>grad</code>를 1로 두고, 그래프를 위상 정렬한 순서의 <b>역순</b>으로 <code>_backward</code>를 실행</li></ul><p>시작 코드에 이미 <code>+</code>, <code>*</code>, 순전파는 들어 있어요. <b><code>__add__</code>, <code>__mul__</code>의 <code>_backward</code>와 <code>backward()</code></b>를 채워 주세요.</p>`,
    VALUE_BASE, '<p>핵심 규칙: ① 덧셈 → 기울기를 그대로 전달 ② 곱셈 → 상대방 값을 곱해서 전달 ③ 같은 값이 여러 번 쓰이면 기울기를 <b>더해야(+=)</b> 해요. 위상 정렬(topo)은 "자식을 먼저 방문한 뒤 나를 추가"하는 DFS로 만들어요.</p>',
    [t('run_grad(lambda a, b, c: a * b + c, [2, 3, 4])', [10, 3, 2, 1]), t('run_grad(lambda a: a * a, [3])', [9, 6]), t('run_grad(lambda a, b: (a + b) * (a + b), [1, 2])', [9, 6, 6]), t('run_grad(lambda a, b: a * 3 + b * 2, [1, 1])', [5, 3, 2]), t('run_grad(lambda a: a * a * a, [2])', [8, 12])],
    { setup: SETUP_GRAD, starter: VALUE_BASE.replace(/    def __add__[\s\S]*?    def __pow__/, `    def __add__(self, other):\n        other = other if isinstance(other, Value) else Value(other)\n        out = Value(self.data + other.data, (self, other), "+")\n        # 여기에 out._backward 를 만들어 주세요\n        return out\n\n    def __mul__(self, other):\n        other = other if isinstance(other, Value) else Value(other)\n        out = Value(self.data * other.data, (self, other), "*")\n        # 여기에 out._backward 를 만들어 주세요\n        return out\n\n    def __pow__`).replace(/    def backward\(self\):[\s\S]*$/, `    def backward(self):\n        # 1) 위상 정렬  2) 결과 grad = 1  3) 역순으로 _backward 실행\n        pass\n`) }),
  f(D4, 4, '활성화 함수의 미분: tanh, ReLU, 거듭제곱', 'class Value',
    `${NOTE_PT}<p>앞에서 만든 역전파 위에 <b>비선형 연산</b>을 올려요. 시작 코드에는 <code>+</code>, <code>*</code>, <code>-</code>, <code>**</code>와 <code>backward()</code>가 완성되어 있어요. 여기에 두 메서드를 추가하세요.</p><ul><li><code>tanh()</code> — 값 <code>t = tanh(data)</code>, 역전파: <code>self.grad += (1 − t²) × out.grad</code></li><li><code>relu()</code> — 값 <code>max(0, data)</code>, 역전파: <code>data &gt; 0</code>이면 <code>out.grad</code>를, 아니면 0을 전달</li></ul><p>(참고: 거듭제곱 <code>x**k</code>의 역전파는 <code>k·x^(k−1)</code>이고 이미 들어 있어요)</p>`,
    VALUE_BASE.replace("    def backward(self):", `    def tanh(self):\n        import math\n        t = math.tanh(self.data)\n        out = Value(t, (self,), "tanh")\n\n        def _backward():\n            self.grad += (1 - t ** 2) * out.grad\n\n        out._backward = _backward\n        return out\n\n    def relu(self):\n        out = Value(max(0, self.data), (self,), "relu")\n\n        def _backward():\n            self.grad += (out.data > 0) * out.grad\n\n        out._backward = _backward\n        return out\n\n    def backward(self):`), '<p>합성함수의 미분(연쇄 법칙): "내 입력에 대한 기울기 = (내 연산의 미분) × (뒤에서 들어온 기울기 out.grad)". 새 연산마다 "내 연산의 미분"만 알면 돼요. tanh의 미분은 1 − tanh²예요.</p>',
    [t('run_grad(lambda x: x.tanh(), [0])', [0, 1]), t('run_grad(lambda x: x.relu(), [3])', [3, 1]), t('run_grad(lambda x: x.relu(), [-2])', [0, 0]), t('run_grad(lambda x: x.tanh(), [0.5])', [0.4621, 0.7864]), t('run_grad(lambda x, w: (x * w + 1).tanh(), [1, 1])', [0.964, 0.0707, 0.0707]), t('run_grad(lambda a: a ** 3, [2])', [8, 12])],
    { setup: SETUP_GRAD, starter: VALUE_BASE.replace(/\n    def backward\(self\):[\s\S]*$/, `\n    def backward(self):\n        topo, seen = [], set()\n\n        def build(v):\n            if v not in seen:\n                seen.add(v)\n                for c in v._prev:\n                    build(c)\n                topo.append(v)\n\n        build(self)\n        self.grad = 1.0\n        for v in reversed(topo):\n            v._backward()\n\n    # 여기에 tanh() 와 relu() 를 추가하세요\n`) }),
  f(D4, 3, '옵티마이저: SGD 클래스', 'class SGD',
    `${NOTE_PT}<p>PyTorch의 <code>torch.optim.SGD</code>처럼 <b>파라미터를 기울기 방향으로 움직이는</b> 클래스를 만드세요. 파라미터 객체는 <code>.data</code>, <code>.grad</code> 속성을 가진 객체예요(앞의 <code>Value</code>와 같아요).</p><ul><li><code>SGD(params, lr)</code></li><li><code>step()</code> — 모든 파라미터에 대해 <code>data -= lr × grad</code></li><li><code>zero_grad()</code> — 모든 파라미터의 <code>grad</code>를 0으로 (기울기는 계속 쌓이기 때문에 매 스텝 전에 비워야 해요)</li></ul>`,
    `class SGD:\n    def __init__(self, params, lr):\n        self.params = params\n        self.lr = lr\n\n    def step(self):\n        for p in self.params:\n            p.data -= self.lr * p.grad\n\n    def zero_grad(self):\n        for p in self.params:\n            p.grad = 0.0\n`, '<p>PyTorch 학습 한 스텝은 <code>optimizer.zero_grad()</code> → <code>loss.backward()</code> → <code>optimizer.step()</code> 세 줄이에요. 기울기를 비우지 않으면 이전 스텝의 기울기가 더해져서 틀려요.</p>',
    [t('(lambda p: (SGD([p], 0.1).step(), p.data)[1])(P(1.0, 2.0))', 0.8), t('(lambda p: (SGD([p], 0.1).zero_grad(), p.grad)[1])(P(1.0, 2.0))', 0), t('(lambda a, b: (SGD([a, b], 0.5).step(), [a.data, b.data])[1])(P(1.0, 1.0), P(2.0, -2.0))', [0.5, 3]), t('(lambda p: (SGD([p], 1.0).step(), p.data)[1])(P(5.0, 0.0))', 5)],
    { setup: SETUP_GRAD }),
  f(D4, 3, 'nn.Module 흉내: Linear 층', 'class Linear',
    `${NOTE_PT}<p>PyTorch의 <code>nn.Linear</code>처럼 <b>파라미터를 스스로 관리하는 층</b>을 만드세요.</p><ul><li><code>Linear(n_in, n_out, W=None, b=None)</code> — <code>W</code>(<code>n_in × n_out</code>)와 <code>b</code>(길이 <code>n_out</code>)가 주어지면 그 값을 쓰고, 없으면 모두 0으로 채워요 (넘파이 배열로 저장)</li><li><code>parameters()</code> — <code>[W, b]</code> 리스트를 돌려줘요</li><li>호출(<code>layer(x)</code>) — <code>x·W + b</code>를 소수 넷째 자리까지 반올림한 2차원 리스트로</li></ul>`,
    IMP + `class Linear:\n    def __init__(self, n_in, n_out, W=None, b=None):\n        self.W = np.zeros((n_in, n_out)) if W is None else np.array(W, dtype=float)\n        self.b = np.zeros(n_out) if b is None else np.array(b, dtype=float)\n\n    def parameters(self):\n        return [self.W, self.b]\n\n    def __call__(self, x):\n        return np.round(np.array(x, dtype=float) @ self.W + self.b, 4).tolist()\n`, '<p>"파라미터를 들고 있는 객체 + <code>parameters()</code> + 호출 가능"이 PyTorch 모듈의 기본 모양이에요. 기본값 <code>None</code>인지 <code>is None</code>으로 확인해요.</p>',
    [t('Linear(2, 1, W=[[1], [2]], b=[1])([[1, 1]])', [[4]]), t('len(Linear(3, 2).parameters())', 2), t('Linear(2, 3)([[5, 6]])', [[0, 0, 0]]), t('[p.shape for p in Linear(2, 3).parameters()]', [[2, 3], [3]])]),
  f(D4, 3, 'DataLoader 흉내: 배치 반복자', 'class BatchLoader',
    `${NOTE_PT}<p>PyTorch의 <code>DataLoader</code>처럼 데이터를 <b>배치 단위로 꺼내 주는</b> 클래스를 만드세요.</p><ul><li><code>BatchLoader(X, y, batch_size)</code> — 섞지 않아요</li><li><code>for xb, yb in loader:</code>로 반복하면 <code>(X의 batch_size개, y의 batch_size개)</code> 튜플을 차례로 내줘요 (<code>__iter__</code>). 마지막 배치는 모자랄 수 있어요</li><li><code>len(loader)</code> — 배치의 개수 (<code>__len__</code>)</li></ul>`,
    `class BatchLoader:\n    def __init__(self, X, y, batch_size):\n        self.X = X\n        self.y = y\n        self.batch_size = batch_size\n\n    def __iter__(self):\n        for i in range(0, len(self.X), self.batch_size):\n            yield self.X[i:i + self.batch_size], self.y[i:i + self.batch_size]\n\n    def __len__(self):\n        return (len(self.X) + self.batch_size - 1) // self.batch_size\n`, '<p><code>__iter__</code> 안에서 <code>yield</code>를 쓰면 제너레이터가 되어 <code>for</code>문에서 하나씩 꺼낼 수 있어요. 배치 개수는 올림 나눗셈 <code>(n + b - 1) // b</code>로 구해요.</p>',
    [t('list(BatchLoader([1, 2, 3, 4, 5], [0, 1, 0, 1, 0], 2))', [[[1, 2], [0, 1]], [[3, 4], [0, 1]], [[5], [0]]]), t('len(BatchLoader([1, 2, 3, 4, 5], [0, 1, 0, 1, 0], 2))', 3), t('len(BatchLoader([1, 2, 3, 4], [0, 0, 0, 0], 2))', 2), t('list(BatchLoader([], [], 3))', [])]),
  { ...f(D4, 5, '[종합] 자동 미분으로 직선 학습', 'def fit_values(xs, ys, lr, epochs)',
    `${NOTE_PT}<p>지금까지의 조각을 모아 <b>PyTorch 방식 학습 루프</b>를 만들어요. 시작 코드에는 완성된 <code>Value</code>(자동 미분)가 들어 있어요. 이것을 이용해 <code>fit_values(xs, ys, lr, epochs)</code>를 만드세요. 직선 <code>ŷ = w·x + b</code>를 <code>w = 0</code>, <code>b = 0</code>(<code>Value</code>)에서 시작해 <code>epochs</code>번 반복해요.</p><ol><li>기울기 비우기: <code>w.grad = 0.0</code>, <code>b.grad = 0.0</code></li><li>손실 = 평균( (w·x + b − y)² ) 를 <code>Value</code> 연산으로 계산 (샘플별 오차제곱을 더한 뒤 <code>1/n</code>을 곱해요)</li><li><code>loss.backward()</code></li><li>갱신: <code>w.data -= lr × w.grad</code>, <code>b.data -= lr × b.grad</code></li></ol><p><code>[w.data, b.data]</code>를 소수 넷째 자리까지 반올림해 돌려줘요. (앞의 <code>fit_linear_gd</code>와 같은 값이 나와요!)</p>`,
    VALUE_BASE + `\n\ndef fit_values(xs, ys, lr, epochs):\n    w = Value(0.0)\n    b = Value(0.0)\n    n = len(xs)\n    for _ in range(epochs):\n        w.grad = 0.0\n        b.grad = 0.0\n        loss = Value(0.0)\n        for x, y in zip(xs, ys):\n            err = w * x + b - y\n            loss = loss + err ** 2\n        loss = loss * (1 / n)\n        loss.backward()\n        w.data -= lr * w.grad\n        b.data -= lr * b.grad\n    return [round(w.data, 4), round(b.data, 4)]\n`, '<p>"기울기 비우기 → 순전파(손실) → backward → 갱신"이 PyTorch 학습 루프 그대로예요. 손실을 만들 때 <code>Value</code> 연산만 쓰면 자동으로 그래프가 만들어져서 <code>backward()</code> 한 번으로 모든 기울기가 구해져요.</p>',
    [t('fit_values([1, 2, 3], [2, 4, 6], 0.1, 1)', [1.8667, 0.8]), t('fit_values([1, 2], [3, 5], 0.1, 1)', [1.3, 0.8]), t('fit_values([1, 2], [3, 5], 0.5, 1)', [6.5, 4]), t('fit_values([1, 2, 3], [2, 4, 6], 0.1, 0)', [0, 0]), t('fit_values([1, 2, 3], [2, 4, 6], 0.1, 2) == fit_linear_gd([1, 2, 3], [2, 4, 6], 0.1, 2)', true)]),
    starter: VALUE_BASE + '\n\ndef fit_values(xs, ys, lr, epochs):\n    pass\n',
    setup: `def fit_linear_gd(x, y, lr, epochs):\n    n = len(x)\n    w = b = 0.0\n    for _ in range(epochs):\n        e = [w * xi + b - yi for xi, yi in zip(x, y)]\n        dw = 2 * sum(ei * xi for ei, xi in zip(e, x)) / n\n        db = 2 * sum(e) / n\n        w -= lr * dw\n        b -= lr * db\n    return [round(w, 4), round(b, 4)]\n` },
];
