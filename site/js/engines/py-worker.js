import { loadPyodide } from '../../vendor/pyodide.mjs';

let py = null;
const loaded = new Set();

async function ensurePackages(pkgs) {
  const need = (pkgs || []).filter(p => !loaded.has(p));
  if (!need.length) return;
  await py.loadPackage(need);
  need.forEach(p => loaded.add(p));
}

self.onmessage = async e => {
  const { id, type, payload } = e.data;
  try {
    if (type === 'init') {
      py = await loadPyodide({ indexURL: new URL('../../vendor/', import.meta.url).href });
      const helpers = await (await fetch(new URL('../../py/helpers.py', import.meta.url))).text();
      py.runPython(helpers);
      postMessage({ id, ok: true });
      return;
    }
    const pkgs = [...(payload.packages || [])];
    if (Object.keys(payload.datasets || {}).length) pkgs.push('pandas');
    await ensurePackages(pkgs);
    const fn = py.globals.get(type === 'table' ? 'run_table' : 'run_tests');
    const csvs = JSON.stringify(payload.datasets || {});
    const out = type === 'table'
      ? fn(payload.code, csvs)
      : fn(payload.code, JSON.stringify(payload.calls), csvs, payload.setup || '');
    fn.destroy();
    postMessage({ id, ok: true, result: JSON.parse(out) });
  } catch (err) {
    postMessage({ id, ok: false, error: String(err && err.message || err) });
  }
};
