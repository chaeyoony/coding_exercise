# 코딩 연습장

SQL · 파이썬 · 데이터사이언스(분석/통계/머신러닝/딥러닝) · R 을 문제로 연습하는 개인용 사이트.
서버 없이 **브라우저 안에서** 코드를 실행합니다. (PC, 아이패드 모두 사용 가능)

| 트랙 | 실행 엔진 |
|---|---|
| SQL | PGlite (브라우저용 PostgreSQL) |
| 파이썬 / 데이터사이언스 | Pyodide (pandas, numpy, scikit-learn 포함) |
| R | WebR (R 4.6 + dplyr·tidyr·stringr·lubridate·purrr·tibble·readr·forcats) |

## 내 컴퓨터에서 실행
```
npm run serve        # http://localhost:8080
```

## 문제 추가하기
1. `problems_src/` 안의 해당 파일(`sql.mjs`, `python.mjs`, `ds.mjs`, `r.mjs`)에 문제를 추가합니다.
   - **표 문제**(SQL, pandas, R 데이터): `solution`(정답 코드)과 `cross`(다른 방식으로 푼 검증 코드)를 함께 적습니다.
     정답 표는 `solution`을 실제로 실행해서 자동으로 만들고, `cross` 결과와 같은지 확인합니다.
   - **함수 문제**(파이썬, R 기초, 통계·ML·DL): `tests`에 `호출식`과 `기대값`을 직접 계산해서 적습니다.
     정답 코드가 그 값을 만들어내는지 자동으로 확인합니다.
2. 검증하고 사이트 문제 파일을 만듭니다. (Playwright 필요: `npm i` 후 실행)
   ```
   npm run build                       # 전체
   node tools/build.mjs --only sql-001 # 일부만
   ```
   하나라도 검증에 실패하면 사이트 파일을 갱신하지 않습니다.
3. `node tools/e2e.mjs` 로 실제 화면에서 제출 동작을 점검할 수 있습니다.

## 폴더 구조
- `site/` — 배포되는 사이트 전부 (GitHub Pages에 이 폴더를 올리면 됩니다)
  - `vendor/` — 실행 엔진(Pyodide, WebR, PGlite)과 R 패키지 저장소. 인터넷 없이도 동작하도록 직접 포함
  - `datasets/` — 연습용 CSV 데이터
  - `problems/` — 빌드로 생성되는 문제 파일 (직접 수정하지 마세요)
- `problems_src/` — 문제 원본
- `tools/` — 서버, 빌드/검증, 화면 테스트

## 알려진 한계
- 딥러닝은 PyTorch/TensorFlow 를 브라우저에서 돌릴 수 없어서 numpy 로 원리를 직접 구현하는 문제로 구성했습니다.
- R 패키지는 `site/vendor/webr-repo/` 에 미리 받아 둔 것만 쓸 수 있습니다. (ggplot2 등은 미포함) 새 패키지를 넣으려면 `https://repo.r-wasm.org/bin/emscripten/contrib/4.6/` 에서 해당 `.tgz` 와 의존 패키지를 받아 같은 폴더에 두고 `PACKAGES`, `PACKAGES.gz` 에 항목을 추가합니다.
- 첫 실행은 엔진을 불러오느라 느립니다. (R 은 특히 오래 걸림)
