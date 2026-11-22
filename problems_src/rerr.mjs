// R 오류 처리 단계별 사다리: ① tryCatch 기본 → ② 경고·stop·finally → ③ 입력 검증·작은 프로젝트
// 기존 문제(rmore.mjs)의 tryCatch/경고/stop/finally/재시도 문제도 같은 사다리에 들어간다.
// 길이 1 벡터는 값 하나로 적는다.
import { o } from './_stdout.mjs';

const E1 = 'R 오류 처리 ① tryCatch 기본';
const E2 = 'R 오류 처리 ② 경고·stop·finally';
const E3 = 'R 오류 처리 ③ 검증·작은 프로젝트';

const t = (call, expected, visible = false) => ({ call, expected, visible });
const V = (...xs) => xs.map((x, i) => ({ ...x, visible: i < 2 }));
const rr = (category, level, title, desc, starter, solution, hint, tests) =>
  ({ track: 'r', category, level, title, desc, starter, solution, hint, tests: V(...tests) });
const out = (category, level, title, desc, solution, hint, cases, extra = {}) =>
  o({ category, level, title, desc, solution, hint, cases, track: 'r', ...extra });
const fn = (name, args) => `${name} <- function(${args}) {\n  \n}\n`;

export default [
  // ================= ① tryCatch 기본 =================
  out(E1, 1, '오류가 나도 멈추지 않기', `<p>변수 <code>x</code>가 주어져요. <code>log(x)</code>를 소수 둘째 자리까지 반올림해서 <code>cat()</code>으로 <code>로그: ○</code> 한 줄 출력하세요. 계산 중 오류가 나면(예: 문자열이 들어온 경우) <code>계산할 수 없어요</code>를 한 줄 출력해요.</p><p class="muted">R에서는 <code>tryCatch(실행할 식, error = function(e) 오류일 때 할 일)</code> 로 오류를 잡아요.</p>`,
    `tryCatch({\n  cat("로그:", round(log(x), 2), "\\n")\n}, error = function(e) {\n  cat("계산할 수 없어요\\n")\n})\n`,
    '<p>첫 번째 칸(<code>{ }</code>)에 시도할 코드, <code>error =</code> 뒤에 오류가 났을 때 실행할 함수를 써요. 함수는 <code>function(e) { ... }</code> 모양이에요.</p>',
    ['x <- 100', 'x <- "abc"', 'x <- 1', 'x <- c(1, 10)'], { needs: [['tryCatch', 'tryCatch를 써 보세요']] }),
  rr(E1, 1, '오류가 나는지 확인하기', `<p><code>works(f)</code>를 만드세요. 인수 없는 함수 <code>f</code>를 실행해서 <b>오류 없이 끝나면 <code>TRUE</code></b>, 오류가 나면 <code>FALSE</code>를 돌려줘요.</p>`,
    fn('works', 'f'), `works <- function(f) {\n  tryCatch({\n    f()\n    TRUE\n  }, error = function(e) FALSE)\n}\n`,
    '<p><code>tryCatch</code> 안에서 <code>f()</code>를 실행하고 맨 마지막 값으로 <code>TRUE</code>, 오류 처리 함수에서 <code>FALSE</code>를 돌려주세요. <code>tryCatch</code>는 마지막 값이 결과가 돼요.</p>',
    [t('works(function() log(1))', true), t('works(function() stop("x"))', false), t('works(function() 1 + "a")', false), t('works(function() sqrt(4))', true), t('works(function() log("a"))', false)]),
  rr(E1, 1, '경고가 나면 NA로 바꾸기', `<p><code>safe_sqrt(x)</code>를 만드세요. <code>sqrt(x)</code>를 돌려주되, 음수라서 <b>경고(warning)</b>가 나면 <code>NA</code>를 돌려줘요. (<code>tryCatch(..., warning = function(w) ...)</code>)</p><p class="muted"><code>sqrt(-4)</code>는 오류가 아니라 "NaNs produced" 경고가 나요. 경고는 <code>error =</code>가 아닌 <code>warning =</code>으로 잡아요.</p>`,
    fn('safe_sqrt', 'x'), `safe_sqrt <- function(x) {\n  tryCatch(sqrt(x), warning = function(w) NA)\n}\n`,
    '<p><code>tryCatch(식, warning = function(w) 대신 돌려줄 값)</code>. 오류(error)와 경고(warning)는 다른 종류예요.</p>',
    [t('safe_sqrt(16)', 4), t('is.na(safe_sqrt(-4))', true), t('safe_sqrt(0)', 0), t('safe_sqrt(2.25)', 1.5)]),
  rr(E1, 2, '오류 메시지 꺼내기', `<p><code>get_error(f)</code>를 만드세요. 인수 없는 함수 <code>f</code>를 실행해서, 오류가 나면 <b>오류 메시지 문자열</b>을, 오류가 없으면 <code>"OK"</code>를 돌려줘요.</p><p class="muted">오류 처리 함수의 인수 <code>e</code>에서 <code>conditionMessage(e)</code>로 메시지를 꺼내요.</p>`,
    fn('get_error', 'f'), `get_error <- function(f) {\n  tryCatch({\n    f()\n    "OK"\n  }, error = function(e) conditionMessage(e))\n}\n`,
    '<p><code>error = function(e) conditionMessage(e)</code> — 잡은 오류 객체 <code>e</code>에서 메시지를 꺼내요.</p>',
    [t('get_error(function() stop("boom"))', 'boom'), t('get_error(function() log("a"))', 'non-numeric argument to mathematical function'), t('get_error(function() 1)', 'OK'), t('get_error(function() stop("a", "b"))', 'ab')]),
  rr(E1, 2, '리스트에서 안전하게 꺼내기', `<p><code>safe_get(lst, i, default)</code>를 만드세요. <code>lst[[i]]</code>를 돌려주되, 번호가 범위를 벗어나 오류(<code>subscript out of bounds</code>)가 나면 <code>default</code>를 돌려줘요.</p>`,
    fn('safe_get', 'lst, i, default'), `safe_get <- function(lst, i, default) {\n  tryCatch(lst[[i]], error = function(e) default)\n}\n`,
    '<p><code>tryCatch(lst[[i]], error = function(e) default)</code></p>',
    [t('safe_get(list(10, 20, 30), 2, 0)', 20), t('safe_get(list(1, 2), 5, "none")', 'none'), t('safe_get(list(), 1, -1)', -1), t('safe_get(list("a", "b"), 1, "z")', 'a')]),

  // ================= ② 경고 · stop · finally =================
  rr(E2, 2, '오류인가 경고인가', `<p><code>kind(f)</code>를 만드세요. 인수 없는 함수 <code>f</code>를 실행해서 <b>오류</b>가 나면 <code>"오류"</code>, <b>경고</b>가 나면 <code>"경고"</code>, 아무 문제 없으면 <code>"정상"</code>을 돌려줘요.</p><p class="muted"><code>tryCatch(식, error = ..., warning = ...)</code> 처럼 처리기를 여러 개 넣을 수 있어요.</p>`,
    fn('kind', 'f'), `kind <- function(f) {\n  tryCatch({\n    f()\n    "정상"\n  }, error = function(e) "오류", warning = function(w) "경고")\n}\n`,
    '<p>한 <code>tryCatch</code> 안에 <code>error = </code>와 <code>warning = </code>을 같이 쓸 수 있어요.</p>',
    [t('kind(function() stop("a"))', '오류'), t('kind(function() warning("w"))', '경고'), t('kind(function() 1)', '정상'), t('kind(function() as.integer("x"))', '경고'), t('kind(function() log(-1))', '경고'), t('kind(function() log("a"))', '오류')]),
  rr(E2, 2, 'warning()으로 직접 경고 내기', `<p><code>mean_safe(x)</code>를 만드세요. <code>x</code>가 비어 있으면(길이 0) <code>warning("빈 벡터예요")</code>로 경고를 내고 <code>NA</code>를 돌려줘요. 비어 있지 않으면 평균을 돌려줘요.</p><p class="muted"><code>warning()</code>은 프로그램을 멈추지 않고 "주의하세요"라고 알리는 용도예요. <code>stop()</code>과 달리 계속 실행돼요.</p>`,
    fn('mean_safe', 'x'), `mean_safe <- function(x) {\n  if (length(x) == 0) {\n    warning("빈 벡터예요")\n    return(NA)\n  }\n  mean(x)\n}\n`,
    '<p><code>warning("메시지")</code>를 부른 다음 <code>return(NA)</code>로 값을 돌려줘요.</p>',
    [t('mean_safe(c(1, 2, 3))', 2), t('tryCatch(mean_safe(numeric(0)), warning = function(w) conditionMessage(w))', '빈 벡터예요'), t('suppressWarnings(is.na(mean_safe(numeric(0))))', true), t('mean_safe(c(10, 20))', 15)]),
  rr(E2, 3, '실패한 작업 세기 (try)', `<p><code>count_failures(fs)</code>를 만드세요. <code>fs</code>는 함수들의 리스트예요. 각 함수를 실행해 보고 <b>오류가 난 함수의 개수</b>를 돌려줘요. 오류가 나도 <b>멈추지 않고 끝까지</b> 실행해야 해요.</p><p class="muted"><code>try(식, silent = TRUE)</code>는 오류가 나도 멈추지 않고 <code>"try-error"</code> 클래스의 객체를 돌려줘요. <code>inherits(결과, "try-error")</code>로 확인해요.</p>`,
    fn('count_failures', 'fs'), `count_failures <- function(fs) {\n  n <- 0\n  for (f in fs) {\n    r <- try(f(), silent = TRUE)\n    if (inherits(r, "try-error")) n <- n + 1\n  }\n  n\n}\n`,
    '<p><code>r <- try(f(), silent = TRUE)</code> 후 <code>inherits(r, "try-error")</code>가 <code>TRUE</code>이면 실패예요. (<code>tryCatch</code>로도 풀 수 있어요)</p>',
    [t('count_failures(list(function() 1, function() stop("a"), function() log("x")))', 2), t('count_failures(list())', 0), t('count_failures(list(function() 1, function() 2))', 0), t('count_failures(list(function() stop("a"), function() stop("b"), function() 3))', 2)]),
  out(E2, 2, 'tryCatch에서 finally 쓰기', `<p>숫자 벡터 <code>x</code>가 주어져요. <code>tryCatch</code>로 <code>sum(x)</code>를 구해 <code>합계: ○</code>를 출력하세요. 오류가 나면(문자가 섞인 경우) <code>합계를 구할 수 없어요</code>를 출력해요. 어느 쪽이든 <code>finally</code>에서 마지막에 <code>끝</code>을 출력하세요.</p>`,
    `tryCatch({\n  cat("합계:", sum(x), "\\n")\n}, error = function(e) {\n  cat("합계를 구할 수 없어요\\n")\n}, finally = {\n  cat("끝\\n")\n})\n`,
    '<p><code>finally = { ... }</code>는 성공하든 실패하든 <b>마지막에 항상</b> 실행돼요. (파일 닫기 같은 뒷정리에 써요)</p>',
    ['x <- c(1, 2, 3)', 'x <- c(1, "a")', 'x <- numeric(0)'], { needs: [['finally', 'finally를 써 보세요']] }),

  // ================= ③ 입력 검증 · 작은 프로젝트 =================
  rr(E3, 3, '점수 입력 검증', `<p><code>validate_scores(x)</code>를 만드세요. 점수 벡터 <code>x</code>를 검사한 뒤, 문제가 없으면 평균(소수 둘째 자리 반올림)을 돌려줘요. 검사는 <b>위에서 아래 순서</b>로 해요.</p><ol><li>숫자 벡터가 아니면 <code>stop("숫자가 아니에요")</code></li><li>비어 있으면 <code>stop("점수가 없어요")</code></li><li><code>NA</code>가 있으면 <code>stop("결측치가 있어요")</code></li><li>0~100 범위를 벗어난 값이 있으면 <code>stop("0~100 범위를 벗어났어요")</code></li></ol>`,
    fn('validate_scores', 'x'), `validate_scores <- function(x) {\n  if (!is.numeric(x)) stop("숫자가 아니에요")\n  if (length(x) == 0) stop("점수가 없어요")\n  if (any(is.na(x))) stop("결측치가 있어요")\n  if (any(x < 0 | x > 100)) stop("0~100 범위를 벗어났어요")\n  round(mean(x), 2)\n}\n`,
    '<p>각 검사를 <code>if (조건) stop("메시지")</code> 한 줄씩 위에서부터 써요. <code>any(x &lt; 0 | x &gt; 100)</code> 으로 범위를 한 번에 확인할 수 있어요.</p>',
    [t('validate_scores(c(80, 90, 100))', 90), t('err_msg(function() validate_scores("a"))', '숫자가 아니에요'), t('err_msg(function() validate_scores(numeric(0)))', '점수가 없어요'), t('err_msg(function() validate_scores(c(80, NA)))', '결측치가 있어요'), t('err_msg(function() validate_scores(c(80, 101)))', '0~100 범위를 벗어났어요'), t('validate_scores(c(0, 50.5))', 25.25)]),
  rr(E3, 3, '검증 결과를 문장으로 돌려주기', `<p><code>try_score(x)</code>를 만드세요. 앞 문제의 <code>validate_scores</code>와 같은 규칙으로 검사하되, 오류를 밖으로 내보내지 않고 <b>문자열</b>로 돌려줘요. 정상이면 <code>"평균: ○"</code>(소수 둘째 자리까지 반올림한 평균), 문제가 있으면 <code>"오류: 메시지"</code>예요. (규칙: 숫자가 아니면 <code>숫자가 아니에요</code>, 비어 있으면 <code>점수가 없어요</code>, <code>NA</code>가 있으면 <code>결측치가 있어요</code>)</p>`,
    `try_score <- function(x) {\n  \n}\n`, `try_score <- function(x) {\n  tryCatch({\n    if (!is.numeric(x)) stop("숫자가 아니에요")\n    if (length(x) == 0) stop("점수가 없어요")\n    if (any(is.na(x))) stop("결측치가 있어요")\n    paste0("평균: ", round(mean(x), 2))\n  }, error = function(e) paste0("오류: ", conditionMessage(e)))\n}\n`,
    '<p>검사 코드를 <code>tryCatch({ ... }, error = function(e) ...)</code> 안에 넣고, 오류 처리 함수에서 <code>paste0("오류: ", conditionMessage(e))</code>를 돌려줘요.</p>',
    [t('try_score(c(80, 90))', '평균: 85'), t('try_score("a")', '오류: 숫자가 아니에요'), t('try_score(numeric(0))', '오류: 점수가 없어요'), t('try_score(c(1, NA))', '오류: 결측치가 있어요'), t('try_score(c(70, 85, 90))', '평균: 81.67')]),
  rr(E3, 4, '[프로젝트] 안전한 계산기', `<p><code>calc(expr)</code>를 만드세요. <code>expr</code>는 <code>"3 + 4"</code>처럼 <b>공백으로 구분된 세 조각</b>(숫자 연산자 숫자)이에요. 연산자는 <code>+ - * /</code>예요. 결과는 항상 <b>문자열</b>로 돌려줘요.</p><ul><li>성공: <code>paste0("결과: ", 값)</code> (예: 7 → <code>"결과: 7"</code>, 3.5 → <code>"결과: 3.5"</code>)</li><li>조각이 세 개가 아니면 <code>"오류: 형식이 잘못됐어요"</code></li><li>숫자로 바꿀 수 없으면 <code>"오류: 숫자가 아니에요"</code></li><li>연산자가 낯설면 <code>"오류: 지원하지 않는 연산"</code></li><li>0으로 나누면 <code>"오류: 0으로 나눌 수 없어요"</code></li></ul><p class="muted">힌트: <code>strsplit(expr, " ")[[1]]</code> 로 조각을 나누고, <code>as.numeric()</code>에서 경고가 나면 숫자가 아닌 거예요. R은 <code>5 / 0</code>이 오류가 아니라 <code>Inf</code>이니 직접 검사해야 해요.</p>`,
    `calc <- function(expr) {\n  \n}\n`,
    `calc <- function(expr) {\n  parts <- strsplit(expr, " ")[[1]]\n  if (length(parts) != 3) return("오류: 형식이 잘못됐어요")\n  a <- tryCatch(as.numeric(parts[1]), warning = function(w) NA)\n  b <- tryCatch(as.numeric(parts[3]), warning = function(w) NA)\n  if (is.na(a) || is.na(b)) return("오류: 숫자가 아니에요")\n  op <- parts[2]\n  if (!(op %in% c("+", "-", "*", "/"))) return("오류: 지원하지 않는 연산")\n  if (op == "/" && b == 0) return("오류: 0으로 나눌 수 없어요")\n  value <- switch(op, "+" = a + b, "-" = a - b, "*" = a * b, "/" = a / b)\n  paste0("결과: ", value)\n}\n`,
    '<p>순서대로 검사하세요: ① 조각 수 ② 숫자 변환(<code>tryCatch(as.numeric(...), warning = ...)</code>) ③ 연산자 ④ 0 나누기 ⑤ <code>switch</code>로 계산.</p>',
    [t('calc("3 + 4")', '결과: 7'), t('calc("7 / 2")', '결과: 3.5'), t('calc("5 / 0")', '오류: 0으로 나눌 수 없어요'), t('calc("a * 2")', '오류: 숫자가 아니에요'), t('calc("3 ^ 2")', '오류: 지원하지 않는 연산'), t('calc("3 +")', '오류: 형식이 잘못됐어요'), t('calc("2.5 * 4")', '결과: 10')]),
  rr(E3, 4, '[프로젝트] 점수 줄 읽기: 틀린 줄 모아 보고하기', `<p><code>parse_scores(lines)</code>를 만드세요. <code>lines</code>는 <code>"이름,점수"</code> 모양의 문자열 벡터예요. 잘못된 줄이 있어도 <b>멈추지 않고</b> 끝까지 읽어요.</p><ul><li>정상인 줄의 점수는 정수가 아닌 <b>숫자</b>로 모아 <code>valid</code>(순서 유지)에 담아요</li><li>잘못된 줄의 <b>줄 번호</b>(1부터)는 <code>bad</code>에 담아요</li></ul><p>잘못된 줄: 쉼표로 나눈 조각이 2개가 아니거나, 점수가 숫자가 아니거나, 0~100 범위 밖인 줄. 돌려줄 값은 <code>list(valid = ..., bad = ...)</code>예요. (<code>bad</code>는 정수 벡터, 없으면 <code>integer(0)</code>)</p>`,
    `parse_scores <- function(lines) {\n  \n}\n`,
    `parse_scores <- function(lines) {\n  valid <- numeric(0)\n  bad <- integer(0)\n  for (i in seq_along(lines)) {\n    parts <- strsplit(lines[i], ",")[[1]]\n    score <- NA\n    if (length(parts) == 2) {\n      score <- tryCatch(as.numeric(parts[2]), warning = function(w) NA)\n    }\n    if (is.na(score) || score < 0 || score > 100) {\n      bad <- c(bad, i)\n    } else {\n      valid <- c(valid, score)\n    }\n  }\n  list(valid = valid, bad = bad)\n}\n`,
    '<p>줄마다 하나씩 검사해서 <code>valid</code> 또는 <code>bad</code>에 <code>c()</code>로 붙여 나가요. 숫자 변환은 <code>tryCatch(as.numeric(...), warning = function(w) NA)</code>예요.</p>',
    [t('parse_scores(c("kim,90", "lee,80"))', { valid: [90, 80], bad: [] }), t('parse_scores(c("kim,90", "lee", "park,abc", "choi,120", "han,70"))', { valid: [90, 70], bad: [2, 3, 4] }), t('parse_scores(character(0))', { valid: [], bad: [] }), t('parse_scores(c("a,1,2", "b,50", "c,0"))', { valid: [50, 0], bad: 1 })]),
];
