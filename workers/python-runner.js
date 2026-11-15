/* DevAtlas – Python-Runner (Modul-Worker mit Pyodide/WebAssembly).
 * Interpreter und Standardbibliothek liegen in der App bzw. im Build unter pyodide/v<version>/ (siehe devatlasPyodide
 * in vite.config.ts) – das Python-Labor startet ohne Internet. NumPy ist ebenfalls mitgeliefert; alle anderen
 * Zusatzpakete werden bei Bedarf von cdn.jsdelivr.net geladen (absolute Adressen in der mitgelieferten pyodide-lock.json).
 *
 * Protokoll: zuerst { type: 'init', version }, danach Python-Code als String.
 * Die Version kommt bewusst per Nachricht und nicht über die Worker-URL: Liefert der Service Worker das Skript
 * aus dem Cache, verliert self.location den Query-String.
 */
let py;
let ready = null;
let pyBase = null;

function start(version) {
  if (!/^\d+\.\d+\.\d+$/.test(String(version))) throw new Error('Ungültige Pyodide-Version');
  const base = new URL(`../pyodide/v${version}/`, self.location.href).href;
  pyBase = base;
  return (async () => {
    const { loadPyodide } = await import(`${base}pyodide.mjs`);
    py = await loadPyodide({
      indexURL: base,
      stdout: (t) => postMessage({ type: 'log', text: t }),
      stderr: (t) => postMessage({ type: 'error', text: t }),
    });
    postMessage({ type: 'ready', text: 'Python ' + py.runPython('import sys; sys.version.split()[0]') + ' (Pyodide ' + py.version + ') bereit.' });
  })().catch((e) => postMessage({ type: 'fatal', text: String(e) }));
}

/** Welche noch nicht geladenen Pakete (inkl. Abhängigkeiten) braucht der Code, die NICHT mitgeliefert sind? */
let lockPackages = null;
async function remotePackages(code) {
  try {
    if (!lockPackages) lockPackages = (await (await fetch(pyBase + 'pyodide-lock.json')).json()).packages;
    const byImport = new Map();
    for (const [name, p] of Object.entries(lockPackages)) for (const imp of p.imports ?? []) byImport.set(imp, name);
    const imports = py.pyodide_py.code.find_imports(code).toJs();
    const needed = new Set();
    const visit = (name) => {
      if (!name || needed.has(name) || py.loadedPackages[name]) return;
      needed.add(name);
      for (const d of lockPackages[name]?.depends ?? []) visit(d);
    };
    for (const imp of imports) visit(byImport.get(imp));
    return [...needed].filter((n) => /^https?:/.test(lockPackages[n]?.file_name ?? ''));
  } catch {
    return [];
  }
}

self.onmessage = async (e) => {
  const data = e.data;
  if (data && typeof data === 'object' && data.type === 'init') {
    try {
      ready = start(data.version);
    } catch (err) {
      postMessage({ type: 'fatal', text: String(err) });
    }
    return;
  }
  if (!ready) return postMessage({ type: 'fatal', text: 'Python-Laufzeit nicht initialisiert' });
  await ready;
  if (!py) return;
  try {
    const remote = await remotePackages(data);
    if (remote.length) postMessage({ type: 'system', text: `Lade Zusatzpaket aus dem Internet (cdn.jsdelivr.net): ${remote.join(', ')} …` });
    await py.loadPackagesFromImports(data, {
      messageCallback: (msg) => postMessage({ type: 'system', text: msg }),
      errorCallback: (msg) => postMessage({ type: 'error', text: msg }),
    });
    const r = await py.runPythonAsync(data);
    if (r !== undefined && r !== null) postMessage({ type: 'info', text: String(r) });
  } catch (err) {
    postMessage({ type: 'error', text: String(err) });
  }
  postMessage({ type: 'done' });
};
