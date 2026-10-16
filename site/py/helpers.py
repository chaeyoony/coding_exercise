import io, json, math, sys, traceback, contextlib

_ns = {}
_FILE = "<코드>"


def _cell(x):
    """파이썬 값을 JSON으로 바꿀 수 있는 값으로 정리한다."""
    if x is None:
        return None
    if isinstance(x, (str, bool)):
        return x
    if hasattr(x, "tolist") and not isinstance(x, (list, tuple, dict)):
        try:
            return _cell(x.tolist())
        except Exception:
            pass
    if isinstance(x, int):
        return x
    if isinstance(x, float):
        return None if (math.isnan(x) or math.isinf(x)) else x
    if isinstance(x, (list, tuple)):
        return [_cell(i) for i in x]
    if isinstance(x, (set, frozenset)):
        try:
            return [_cell(i) for i in sorted(x)]
        except TypeError:
            return [_cell(i) for i in x]
    if isinstance(x, dict):
        return {str(k): _cell(v) for k, v in x.items()}
    try:
        import pandas as pd
        if pd.isna(x):
            return None
    except Exception:
        pass
    return str(x)


def _to_table(v):
    import pandas as pd
    if isinstance(v, pd.Series):
        v = v.to_frame(name=v.name if v.name is not None else "value")
    if isinstance(v, pd.DataFrame):
        idx = v.index
        unnamed = all(n is None for n in idx.names)
        if unnamed and str(idx.dtype).startswith(("int", "Int", "uint")):
            v = v.reset_index(drop=True)
        else:
            v = v.reset_index()
        cols = [str(c) for c in v.columns]
        rows = [[_cell(c) for c in r] for r in v.itertuples(index=False, name=None)]
        return {"columns": cols, "rows": rows}
    if isinstance(v, (list, tuple)):
        if v and all(isinstance(r, (list, tuple)) for r in v):
            n = max(len(r) for r in v)
            return {"columns": [f"col{i+1}" for i in range(n)], "rows": [[_cell(c) for c in r] for r in v]}
        return {"columns": ["value"], "rows": [[_cell(c)] for c in v]}
    if hasattr(v, "tolist"):
        return _to_table(v.tolist())
    return {"columns": ["value"], "rows": [[_cell(v)]]}


def _fmt_exc(e):
    if isinstance(e, SyntaxError) and (e.filename == _FILE or e.filename is None):
        txt = (e.text or "").rstrip("\n")
        return f"문법 오류 ({e.lineno}번째 줄): {e.msg}\n    {txt.strip()}"
    tb = traceback.extract_tb(e.__traceback__)
    frames = [f for f in tb if f.filename == _FILE]
    lines = []
    for f in frames:
        src = (f.line or "").strip()
        lines.append(f"  {f.lineno}번째 줄: {src}" if src else f"  {f.lineno}번째 줄")
    head = f"{type(e).__name__}: {e}"
    return ("\n".join(lines) + "\n" if lines else "") + head


def _reset(csvs):
    global _ns
    _ns = {"__name__": "__main__"}
    if csvs:
        import pandas as pd
        for name, text in csvs.items():
            _ns[name] = pd.read_csv(io.StringIO(text))


def _exec_user(code):
    out = io.StringIO()
    err = None
    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):
        try:
            exec(compile(code, _FILE, "exec"), _ns)
        except BaseException as e:  # noqa
            err = _fmt_exc(e)
    return out.getvalue(), err


def run_table(code, csvs_json):
    _reset(json.loads(csvs_json))
    stdout, err = _exec_user(code)
    if err:
        return json.dumps({"ok": False, "error": err, "stdout": stdout})
    if "result" not in _ns:
        return json.dumps({"ok": False, "error": "result 라는 이름의 변수에 정답을 담아 주세요. 예: result = ...", "stdout": stdout})
    try:
        table = _to_table(_ns["result"])
    except Exception as e:  # noqa
        return json.dumps({"ok": False, "error": "result 를 표로 바꾸지 못했습니다: " + str(e), "stdout": stdout})
    return json.dumps({"ok": True, "table": table, "stdout": stdout}, allow_nan=False)


def run_tests(code, calls_json, csvs_json, setup=""):
    _reset(json.loads(csvs_json))
    stdout, err = _exec_user(code)
    if err:
        return json.dumps({"ok": False, "error": err, "stdout": stdout})
    if setup:
        exec(compile(setup, "<보조코드>", "exec"), _ns)   # 채점용 숨은 보조 함수(클래스 문제 등)
    results = []
    for call in json.loads(calls_json):
        out = io.StringIO()
        try:
            with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):
                val = eval(compile(call, "<테스트>", "eval"), _ns)
            results.append({"ok": True, "value": _cell(val), "stdout": out.getvalue()})
        except BaseException as e:  # noqa
            results.append({"ok": False, "error": _fmt_exc(e), "stdout": out.getvalue()})
    return json.dumps({"ok": True, "results": results, "stdout": stdout}, allow_nan=False)
