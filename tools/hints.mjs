// 힌트 3단계 만들기: ① 개념·문법 설명(문제에 적힌 hint) ② 코드 뼈대(핵심을 ___ 로 가림) ③ 완성 코드
// p.hints 에 직접 쓴 3개가 있으면 그걸 쓰고, 없으면 hint + 정답 코드에서 자동으로 만든다.
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const depthDelta = (line, braces = true) => {
  let d = 0, q = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) { if (ch === '\\') i++; else if (ch === q) q = null; continue; }
    if (ch === '"' || ch === "'") { q = ch; continue; }
    if (ch === '#') break;
    const open = braces ? '([{' : '([';
    const close = braces ? ')]}' : ')]';
    if (open.includes(ch)) d++;
    else if (close.includes(ch)) d--;
  }
  return d;
};

function collapse(lines) {
  const out = [];
  for (const l of lines) {
    if (l.trim() === '___' && out.length && out[out.length - 1].trim() === '___') continue;
    out.push(l);
  }
  return out;
}

function maskPython(code) {
  const out = [];
  let depth = 0, inTriple = false;
  for (const raw of code.replace(/\s+$/, '').split('\n')) {
    const tq = (raw.match(/"""|'''/g) || []).length;
    if (inTriple) { if (tq % 2 === 1) inTriple = false; continue; }
    if (depth > 0) { depth += depthDelta(raw); continue; }
    if (tq % 2 === 1) inTriple = true;
    const ind = raw.match(/^\s*/)[0];
    const s = raw.trim();
    let m;
    const push = x => out.push(ind + x);
    if (s === '' || s.startsWith('#')) { out.push(raw); continue; }
    if (/^(def|class|else|try|finally|import|from|@)\b|^(else|try|finally):|^except\b|^with\b/.test(s)) { out.push(raw); depth += depthDelta(raw); continue; }
    if ((m = s.match(/^(for\s+.+?\s+in)\s+.+:$/))) push(`${m[1]} ___:`);
    else if ((m = s.match(/^(while|if|elif)\b.*:$/))) push(`${m[1]} ___:`);
    else if ((m = s.match(/^(return|yield|raise|assert|del)\b/))) push(`${m[1]} ___`);
    else if ((m = s.match(/^([^=()]+?)\s*([-+*/%]|\/\/|\*\*)?=(?!=)\s*.+$/))) push(`${m[1].trim()} ${m[2] || ''}= ___`.replace(' =', m[2] ? ' ' + m[2] + '=' : ' ='));
    else if ((m = s.match(/^([\w.]+)\(/))) push(`${m[1]}(___)`);
    else push('___');
    depth += depthDelta(raw);
    if (depth < 0) depth = 0;
  }
  return collapse(out).join('\n');
}

function maskR(code) {
  const out = [];
  let depth = 0, cont = false;
  for (const raw of code.replace(/\s+$/, '').split('\n')) {
    if (depth > 0 || cont) {
      depth = Math.max(0, depth + depthDelta(raw, false));
      cont = /(%>%|\|>|[+,\-*/|&]|<-)\s*$/.test(raw.trim());
      continue;
    }
    const ind = raw.match(/^\s*/)[0];
    const s = raw.trim();
    let m;
    const push = x => out.push(ind + x);
    if (s === '' || s.startsWith('#')) { out.push(raw); continue; }
    if (/^[})\]]/.test(s) && !/^}\s*else/.test(s)) { out.push(raw); continue; }
    if (/^library\(|^set\.seed\(/.test(s)) { out.push(raw); continue; }
    const fn = s.match(/^([\w.]+)\s*<-\s*function\s*\(.*\)\s*\{?\s*$/);
    if (fn) { out.push(raw); continue; }
    if ((m = s.match(/^(\}\s*)?else\s+if\s*\(/))) push(`${m[1] || ''}else if (___) {`);
    else if ((m = s.match(/^(\}\s*)?else\b/))) push(`${m[1] || ''}else {`);
    else if ((m = s.match(/^(if|while)\s*\(/))) push(`${m[1]} (___) {`);
    else if ((m = s.match(/^for\s*\(\s*([\w.]+)\s+in\b/))) push(`for (${m[1]} in ___) {`);
    else if ((m = s.match(/^(return|stop|invisible|print|cat)\s*\(/))) push(`${m[1]}(___)`);
    else if ((m = s.match(/^([^<()]+?)\s*(<<-|<-|=)\s*.+$/))) push(`${m[1].trim()} ${m[2]} ___`);
    else if ((m = s.match(/^([\w.]+)\(/))) push(`${m[1]}(___)`);
    else push('___');
    depth += depthDelta(raw, false);
    cont = /(%>%|\|>|[+,\-*/|&]|<-)\s*$/.test(s);
    if (depth < 0) depth = 0;
  }
  return collapse(out).join('\n');
}

function maskSql(code) {
  const text = code.replace(/--.*$/gm, '').replace(/\s+/g, ' ').trim().replace(/;$/, '');
  const KW = ['WITH', 'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET', 'UNION ALL', 'UNION', 'INTERSECT', 'EXCEPT',
    'LEFT OUTER JOIN', 'RIGHT OUTER JOIN', 'FULL OUTER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'CROSS JOIN', 'FULL JOIN', 'JOIN', 'ON', 'USING', 'WINDOW'];
  const out = [];
  let i = 0, depth = 0, q = null, buf = '';
  const flush = () => { if (buf) { out.push(buf); buf = ''; } };
  while (i < text.length) {
    const ch = text[i];
    if (q) { if (ch === q) q = null; i++; continue; }
    if (ch === "'" || ch === '"') { q = ch; i++; continue; }
    if (ch === '(') { depth++; i++; continue; }
    if (ch === ')') { depth--; i++; continue; }
    if (depth === 0 && (i === 0 || text[i - 1] === ' ')) {
      const rest = text.slice(i).toUpperCase();
      const k = KW.find(w => rest.startsWith(w + ' ') || rest === w);
      if (k) { flush(); buf = text.slice(i, i + k.length) + (k === 'WITH' ? '' : ' ___'); i += k.length; continue; }
    }
    i++;
  }
  flush();
  return out.join('\n');
}

export function skeleton(p) {
  const code = p.solution || '';
  if (p.track === 'sql') return maskSql(code);
  if (p.track === 'r') return maskR(code);
  return maskPython(code);
}

export function makeHints(p) {
  if (Array.isArray(p.hints) && p.hints.length === 3) return p.hints;
  if (p.predict || !p.solution) return null;
  const h1 = p.hint || '<p>문제 설명을 한 번 더 읽고, 필요한 값이 무엇인지부터 정리해 보세요.</p>';
  const h2 = `<p>코드의 <b>뼈대</b>예요. <code>___</code> 자리에 들어갈 내용을 직접 채워 보세요.</p><pre class="out">${esc(skeleton(p))}</pre>`;
  const h3 = `<p>거의 정답이에요. 코드를 읽고 <b>왜 이렇게 되는지</b> 이해한 뒤, 닫고 직접 다시 써 보세요.</p><pre class="out">${esc(p.solution)}</pre>`;
  return [h1, h2, h3];
}
