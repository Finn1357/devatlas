/* DevAtlas – JavaScript-Runner (Web Worker).
 * Führt Code aus dem Playground aus: ohne DOM, ohne localStorage, ohne Zugriff auf die Seite.
 * Die Seite beendet den Worker nach einem Zeitlimit (Schutz vor Endlosschleifen).
 * Als eigene Datei (statt Blob), damit die strenge Content Security Policy der Hauptseite
 * nicht für Benutzercode gilt – und die Hauptseite selbst kein eval benötigt.
 */
const fmt = (v) => {
  try {
    if (typeof v === 'string') return v;
    if (v instanceof Error) return v.name + ': ' + v.message;
    if (typeof v === 'function') return v.toString();
    if (v instanceof Map) return 'Map(' + v.size + ') ' + JSON.stringify([...v]);
    if (v instanceof Set) return 'Set(' + v.size + ') ' + JSON.stringify([...v]);
    const s = JSON.stringify(v, (k, x) => (typeof x === 'bigint' ? x.toString() + 'n' : x === undefined ? '__undef__' : x), 2);
    return s === undefined ? String(v) : s.replace(/"__undef__"/g, 'undefined');
  } catch (e) {
    return String(v);
  }
};
const send = (type, args) => self.postMessage({ type, text: args.map(fmt).join(' ') });
console.log = (...a) => send('log', a);
console.info = (...a) => send('info', a);
console.warn = (...a) => send('warn', a);
console.error = (...a) => send('error', a);
console.table = (d) => send('log', [d]);
self.addEventListener('unhandledrejection', (e) => send('error', ['Unbehandelte Promise-Ablehnung: ', e.reason]));
self.onmessage = async (e) => {
  try {
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    await new AsyncFunction(String(e.data))();
  } catch (err) {
    send('error', [err]);
  }
  self.postMessage({ type: 'done' });
};
