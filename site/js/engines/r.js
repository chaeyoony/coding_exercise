import { WebR, ChannelType } from '../../vendor/webr/webr.js';

const TIMEOUT = 30000;
let webR = null, ready = null;
const installed = new Set();
const enc = new TextEncoder();

async function init(status) {
  status?.('R 엔진을 불러오는 중… (처음 한 번은 1분 가까이 걸릴 수 있어요)');
  webR = new WebR({
    baseUrl: new URL('../../vendor/webr/', import.meta.url).href,
    channelType: ChannelType.PostMessage,
    repoUrl: new URL('../../vendor/webr-repo/', import.meta.url).href,   // dplyr 등 패키지는 사이트 안에 포함
  });
  await webR.init();
  const helpers = await (await fetch(new URL('../../r/helpers.R', import.meta.url))).text();
  await webR.evalRVoid(helpers);
  try { await webR.FS.mkdir('/tmp/data'); } catch (e) { /* 이미 있음 */ }
}

async function writeData(datasets) {
  const old = (await webR.FS.lookupPath('/tmp/data')).contents ?? {};
  for (const name of Object.keys(old)) { try { await webR.FS.unlink('/tmp/data/' + name); } catch (e) { /* ignore */ } }
  for (const [name, text] of Object.entries(datasets || {})) {
    await webR.FS.writeFile(`/tmp/data/${name}.csv`, enc.encode(text));
  }
}

const rq = s => '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';

async function run(kind, p, status) {
  try {
    if (!webR) ready = init(status);
    await ready;
    const need = (p.packages || []).filter(x => !installed.has(x));
    if (need.length) {
      status?.(`R 패키지(${need.join(', ')})를 불러오는 중… (처음 한 번만)`);
      await webR.installPackages(need, { quiet: true });
      need.forEach(x => installed.add(x));
    }
    status?.('실행 중…');
    const job = (async () => {
      await writeData(p.datasets);
      await webR.FS.writeFile('/tmp/user.R', enc.encode(p.code));
      let call;
      if (kind === 'table') call = `.run_table("/tmp/data", "/tmp/user.R")`;
      else {
        await webR.FS.writeFile('/tmp/calls.txt', enc.encode(p.calls.join('\n')));
        call = `.run_tests("/tmp/data", "/tmp/user.R", "/tmp/calls.txt")`;
      }
      return JSON.parse(await webR.evalRString(call));
    })();
    const timer = new Promise((_, rej) => setTimeout(() => rej(new Error('TIMEOUT')), TIMEOUT));
    const r = await Promise.race([job, timer]);
    if (r.error) return { ok: false, error: r.error, stdout: r.stdout };
    return { ok: true, ...r };
  } catch (e) {
    if (e.message === 'TIMEOUT') {
      try { webR.close(); } catch (x) { /* ignore */ }
      webR = null; ready = null; installed.clear();
      return { ok: false, error: '실행 시간이 너무 오래 걸려요. 무한 반복이 있는지 확인해 보세요. (엔진을 다시 시작했어요)', stdout: '' };
    }
    return { ok: false, error: '엔진 오류: ' + (e.message || e), stdout: '' };
  }
}

export const rEngine = {
  label: 'R 엔진',
  async ensure(status) { if (!webR) ready = init(status); await ready; },
  runTable: (p, status) => run('table', p, status),
  runTests: (p, status) => run('tests', p, status),
};
