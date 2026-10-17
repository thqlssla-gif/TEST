/* Python interpreter runs away from the UI thread, so long-running code can be stopped. */
'use strict';
const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/';
let engine;
let setupPromise = (async () => {
  try {
    importScripts(PYODIDE_CDN + 'pyodide.js');
    engine = await loadPyodide({ indexURL: PYODIDE_CDN });
    postMessage({ type: 'ready' });
  } catch (error) {
    postMessage({ type: 'boot-error', message: String(error?.message || error) });
    throw error;
  }
})();

const RUNNER = String.raw`
import sys, io, json, traceback, contextlib
_payload = json.loads(_payload_json)
_scope = {"__name__": "__main__"}
_stdout = io.StringIO()
_error = None
_tests = []
try:
    with contextlib.redirect_stdout(_stdout), contextlib.redirect_stderr(_stdout):
        exec(compile(_payload["source"], "내 코드", "exec"), _scope)
except BaseException as _ex:
    _error = "".join(traceback.format_exception_only(type(_ex), _ex)).strip()
    if isinstance(_ex, SyntaxError):
        _error += f"\n문제 위치: {_ex.lineno}번째 줄"

if _error is None and _payload.get("grade"):
    for _test in _payload.get("tests", []):
        try:
            _test_scope = dict(_scope)
            _test_scope["output"] = _stdout.getvalue()
            _ok = bool(eval(_test["expr"], _test_scope))
            _tests.append({"name": _test["name"], "passed": _ok})
        except BaseException:
            _tests.append({"name": _test["name"], "passed": False})

_final_json = json.dumps({"output": _stdout.getvalue(), "error": _error, "tests": _tests}, ensure_ascii=False)
`;

self.onmessage = async (event) => {
  if (event.data?.type !== 'run') return;
  const { id, source, grade, tests } = event.data;
  try {
    await setupPromise;
    engine.globals.set('_payload_json', JSON.stringify({ source, grade, tests }));
    engine.runPython(RUNNER);
    const raw = engine.globals.get('_final_json');
    postMessage({ type: 'result', id, ...JSON.parse(String(raw)) });
  } catch (error) {
    postMessage({ type: 'result', id, output: '', error: String(error?.message || error), tests: [] });
  } finally {
    try { engine?.globals.delete('_payload_json'); engine?.globals.delete('_final_json'); } catch (_) {}
  }
};