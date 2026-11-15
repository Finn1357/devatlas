/* DevAtlas Service Worker – wird beim Build aus pwa/service-worker.template.js erzeugt.
 *
 * Strategie
 * - Precache: alle Build-Dateien dieser Version (App, Inhalte, Schriften, SQLite-WASM) → komplette
 *   Lernplattform offline nutzbar. Cache-Name enthält die Version → saubere Updates.
 * - Navigation: immer die index.html der installierten Version (Hash-Router, keine Server-Routen).
 * - Pyodide (Python-Labor) vom CDN: nach dem ersten Laden im Laufzeit-Cache → danach offline.
 * - Alle anderen fremden Anfragen (z. B. aus dem HTTP-Request-Builder) werden NICHT abgefangen
 *   und nie gecacht – Antworten fremder APIs landen nicht im Speicher.
 * - Updates: neue Version wartet, bis die Nutzerin/der Nutzer „Aktualisieren“ wählt (SKIP_WAITING).
 * Lernstände liegen in localStorage/IndexedDB und werden vom Service Worker nie verändert.
 */
const VERSION = "1.2.0-3dfa74229e";
const PRECACHE = 'devatlas-precache-' + VERSION;
const RUNTIME = 'devatlas-runtime-v1';
const PRECACHE_URLS = [
 "./",
 "./assets/Algo-BZdOm1S9.js",
 "./assets/AppInfo-jfNsar-V.js",
 "./assets/Article-BGtatNff.js",
 "./assets/Callout-BxIvYL_N.js",
 "./assets/Catalog-DVFepSgB.js",
 "./assets/CheatTable-sabwMMGd.js",
 "./assets/CodeBlock-DjqvnBKo.js",
 "./assets/CodeEditor-Dym91sJ7.js",
 "./assets/CommandPalette-ADEUjei4.js",
 "./assets/DataStructures-CcYzR0lw.js",
 "./assets/Diagrams-CH1hkWYF.js",
 "./assets/Explore-62qQHaTt.js",
 "./assets/Flashcards-suOBBw14.js",
 "./assets/GitGraph-BF8KyU-M.js",
 "./assets/Glossary-Cv16nCvv.js",
 "./assets/HttpLab-BHoWK_gY.js",
 "./assets/Interactive-BikjRKaK.js",
 "./assets/KaTeX_AMS-Regular-BQhdFMY1.woff2",
 "./assets/KaTeX_Caligraphic-Bold-Dq_IR9rO.woff2",
 "./assets/KaTeX_Caligraphic-Regular-Di6jR-x-.woff2",
 "./assets/KaTeX_Fraktur-Bold-CL6g_b3V.woff2",
 "./assets/KaTeX_Fraktur-Regular-CTYiF6lA.woff2",
 "./assets/KaTeX_Main-Bold-Cx986IdX.woff2",
 "./assets/KaTeX_Main-BoldItalic-DxDJ3AOS.woff2",
 "./assets/KaTeX_Main-Italic-NWA7e6Wa.woff2",
 "./assets/KaTeX_Main-Regular-B22Nviop.woff2",
 "./assets/KaTeX_Math-BoldItalic-CZnvNsCZ.woff2",
 "./assets/KaTeX_Math-Italic-t53AETM-.woff2",
 "./assets/KaTeX_SansSerif-Bold-D1sUS0GD.woff2",
 "./assets/KaTeX_SansSerif-Italic-C3H0VqGB.woff2",
 "./assets/KaTeX_SansSerif-Regular-DDBCnlJ7.woff2",
 "./assets/KaTeX_Script-Regular-D3wIWfF6.woff2",
 "./assets/KaTeX_Size1-Regular-mCD8mA8B.woff2",
 "./assets/KaTeX_Size2-Regular-Dy4dx90m.woff2",
 "./assets/KaTeX_Size4-Regular-Dl5lxZxV.woff2",
 "./assets/KaTeX_Typewriter-Regular-CO6r4hn1.woff2",
 "./assets/Kubernetes-cw3m4NA4.js",
 "./assets/Lab-QvgunJX5.js",
 "./assets/Languages-B8F61SVW.js",
 "./assets/Learning-pjOT77g1.js",
 "./assets/Legal-Dw7A8i3U.js",
 "./assets/Mathe-1_kOu2sQ.js",
 "./assets/MatheLabor-2UVtBQ-P.js",
 "./assets/MatheTraining-yNVtzFIX.js",
 "./assets/MistakeView-ofDTYLOs.js",
 "./assets/Onboarding-CTUAtzU_.js",
 "./assets/PageTools-BUjyb26V.js",
 "./assets/Personal--FZxQYM7.js",
 "./assets/Playground-DWi-zY9u.js",
 "./assets/Plotter-0t165LIp.js",
 "./assets/QuizRunner-HSroJhJo.js",
 "./assets/Reference-BtmWnNs0.js",
 "./assets/Review-By8nElrx.js",
 "./assets/SearchPage-C_Nv2F2z.js",
 "./assets/SearchResults-Ya3DOPWa.js",
 "./assets/SequenceFlow-DroGXkF7.js",
 "./assets/Settings-CFKKfCPl.js",
 "./assets/SqlLab-UwvipntB.js",
 "./assets/StreamWindow-DDXf7A7S.js",
 "./assets/Syntax-DV5fGRAr.js",
 "./assets/SyntaxCompare-D6SzWqjl.js",
 "./assets/TaskCard-DSlu5EEr.js",
 "./assets/TermOfDay-B5pVQ36K.js",
 "./assets/Tools-C0JEag9d.js",
 "./assets/Topics-DE-kOjJ5.js",
 "./assets/abbildungen-BqE1P3Ki.js",
 "./assets/algebraische-strukturen-BqKe9eLW.js",
 "./assets/android-kotlin-compose-BhjGZKyW.js",
 "./assets/apache-airflow-orchestrierung-DucIQ8Da.js",
 "./assets/apache-spark-B9fFNp-t.js",
 "./assets/api-stile-B-a7G6jA.js",
 "./assets/architekturstile-15Cf2MuV.js",
 "./assets/arrow-left-D49Gk2cM.js",
 "./assets/async-javascript-BnVrYOJo.js",
 "./assets/aussagenlogik-DyxDjzzG.js",
 "./assets/authentifizierung-C56O0PBE.js",
 "./assets/automatisierung-D7b42OOT.js",
 "./assets/baeume-heaps-CoYI4Bnp.js",
 "./assets/barrierefreiheit-BbDskMd0.js",
 "./assets/bash-scripting-D0YZVoOk.js",
 "./assets/betriebssysteme-prozesse-BhfUdaUI.js",
 "./assets/beweistechniken-X_B0urZ9.js",
 "./assets/big-o-BunbLMfF.js",
 "./assets/boolesche-algebra-C79yTaur.js",
 "./assets/builder-CegktLiH.js",
 "./assets/caching-queues-DMuO56bb.js",
 "./assets/capacitor-CiGIljSf.js",
 "./assets/check-BQg2LVNM.js",
 "./assets/chevron-down-BJUQ1bh4.js",
 "./assets/chevron-left-B8-D4Siw.js",
 "./assets/chevron-right-B67P9i2U.js",
 "./assets/ci-cd-DEdKURJZ.js",
 "./assets/circle-dashed-BTFK9esN.js",
 "./assets/circle-x-C30CnQOy.js",
 "./assets/clean-code-solid-gaE7Cjjb.js",
 "./assets/cloud-grundlagen-DvEmXQ7c.js",
 "./assets/cloud-warehouses-DqDSabPU.js",
 "./assets/compiler-interpreter-runtime-CH5zA9HA.js",
 "./assets/core-B5XOlJRJ.js",
 "./assets/css-layout-HsvhB0ac.js",
 "./assets/d-lernen-DTUNe89R.js",
 "./assets/d-lexikon-D6GcBuG7.js",
 "./assets/d-mathe-DJwTZbOp.js",
 "./assets/d-quiz-DoCnmAeA.js",
 "./assets/d-referenz-Bsnwy0W5.js",
 "./assets/d-sprachen-DWEb_3G9.js",
 "./assets/d-syntax-Bv7DNdhU.js",
 "./assets/d-tech-BbE7j-BF.js",
 "./assets/data-engineering-grundlagen-C2VAuVQ5.js",
 "./assets/data-pipeline-praxisprojekt-dJ3552QN.js",
 "./assets/data-warehouse-lake-lakehouse-ZGtf4THn.js",
 "./assets/datenmodellierung-normalisierung-DitPmjA7.js",
 "./assets/datenqualitaet-monitoring-McZGj1Mu.js",
 "./assets/datenstrukturen-Blk2QRo8.js",
 "./assets/debugging-DbxpznSU.js",
 "./assets/design-patterns-CsMpF2r2.js",
 "./assets/determinanten-CPfb2Yal.js",
 "./assets/differentialgleichungen-CchbhvjH.js",
 "./assets/differentialrechnung-DehYHqtY.js",
 "./assets/docker-compose-BigdHOf1.js",
 "./assets/docker-grundlagen-C2FtHOtm.js",
 "./assets/docker-sicherheit-BLmr5csi.js",
 "./assets/docker-volumes-netzwerke-C3S5lfxx.js",
 "./assets/dockerfile-Br7Qe11P.js",
 "./assets/domain-driven-design-ButB-6-u.js",
 "./assets/download-DciQsEWv.js",
 "./assets/eigenwerte-Bqpch1w0.js",
 "./assets/embeddings-rag-CvxoIMBR.js",
 "./assets/expr-CmT4nB82.js",
 "./assets/external-link-CnLgzBpJ.js",
 "./assets/eye-D2W1220u.js",
 "./assets/fastapi-tutorial-C3FM6DXh.js",
 "./assets/flutter-dart-CC1UqQab.js",
 "./assets/folgen-grenzwerte-ZN_TsKLi.js",
 "./assets/fourier-reihen-CNNoz7l4.js",
 "./assets/frontend-frameworks-ANYnw_ZL.js",
 "./assets/git-fortgeschritten-EVldCBfD.js",
 "./assets/git-grundlagen-eVd3vdKv.js",
 "./assets/gleichungen-ungleichungen-BPFzow5v.js",
 "./assets/gleitkomma-DXJDyrYz.js",
 "./assets/gradientenverfahren-D9Gi0-RP.js",
 "./assets/graphen-B0cxVz2r.js",
 "./assets/graphen-CxwL32vz.js",
 "./assets/grpc-grundlagen-82rcpgke.js",
 "./assets/grpc-praxis-3t7Wwoa9.js",
 "./assets/grpc-streaming-CWdu4nUJ.js",
 "./assets/hashing-hashtabellen-DK5bnqeC.js",
 "./assets/hashing-pruefsummen-W75l--AA.js",
 "./assets/html-semantik-Qa2sDP_C.js",
 "./assets/http-grundlagen-B6igvwdh.js",
 "./assets/http2-http3-tls-CnnxiORC.js",
 "./assets/https-security-header-2F6i2ltJ.js",
 "./assets/index-C-5S1rwA.css",
 "./assets/index-DVNrh-RC.js",
 "./assets/indizes-transaktionen-BAlm7p1f.js",
 "./assets/infrastructure-as-code-Dh39b6oY.js",
 "./assets/injection-CdS7p_Ik.js",
 "./assets/integralrechnung-DCON9D_J.js",
 "./assets/integrationstechniken-D7dsH-um.js",
 "./assets/inter-greek-ext-wght-normal-CGAr0uHJ.woff2",
 "./assets/inter-greek-wght-normal-CaVNZxsx.woff2",
 "./assets/inter-latin-ext-wght-normal-CFHvXkgd.woff2",
 "./assets/inter-latin-wght-normal-C2S99t-D.woff2",
 "./assets/interpolation-DOZr7RXC.js",
 "./assets/javascript-dom-dUJleqOG.js",
 "./assets/jetbrains-mono-greek-wght-normal-Bw9x6K1M.woff2",
 "./assets/jetbrains-mono-latin-ext-wght-normal-DBQx-q_a.woff2",
 "./assets/jetbrains-mono-latin-wght-normal-B9CIFXIH.woff2",
 "./assets/kafka-stream-processing-ouGsg4lk.js",
 "./assets/katex-BmCdDcHO.js",
 "./assets/katex-DxB02YXk.css",
 "./assets/ki-grundlagen-Cxn_N_1d.js",
 "./assets/kombinatorik-B0pmrvCj.js",
 "./assets/komplexe-zahlen-BS0oGVdR.js",
 "./assets/konvexitaet-Br8OWnQ5.js",
 "./assets/kotlin-multiplatform-CisZuoWW.js",
 "./assets/kubernetes-grundlagen-B5t0UK-6.js",
 "./assets/kubernetes-praxis-CqVn9IfA.js",
 "./assets/kurvendiskussion-ci0Lq8f_.js",
 "./assets/lagrange-eVBFguW4.js",
 "./assets/layout-grid-BpPhQqgT.js",
 "./assets/lektionen-DmfDhaUy.js",
 "./assets/lgs-gauss-CE1o_aPW.js",
 "./assets/lineare-abbildungen-QMhPV4fS.js",
 "./assets/link-2-WBT_ZP8P.js",
 "./assets/linux-server-nginx-Db8uoa5e.js",
 "./assets/llm-grundlagen-CVaE0sUj.js",
 "./assets/lr-zerlegung-C4caDZ6W.js",
 "./assets/markdown-Uu5HEZrY.js",
 "./assets/marked-BOcXoNEU.js",
 "./assets/markow-ketten-CSoEqbeE.js",
 "./assets/matrizen-CZy452lD.js",
 "./assets/mehrere-variablen-B7rynAOB.js",
 "./assets/mehrfachintegrale-Cx0bbTC7.js",
 "./assets/mengen-CjTf1EBo.js",
 "./assets/message-broker-events-DW6d9FHW.js",
 "./assets/minus-D5tfkHPU.js",
 "./assets/mobile-architektur-navigation-B348tpcG.js",
 "./assets/mobile-daten-api-BDq85MrI.js",
 "./assets/mobile-deployment-NZyzhHr0.js",
 "./assets/mobile-entwicklung-yydEPqy5.js",
 "./assets/mobile-sicherheit-testing-cwOVw4kP.js",
 "./assets/modulare-arithmetik-CU3pDeVU.js",
 "./assets/monitoring-observability-BkMmkJKn.js",
 "./assets/nebenlaeufigkeit-DzyKoFJz.js",
 "./assets/netzwerke-tcp-ip-dns-DOvtGlar.js",
 "./assets/node-express-api-BcuY5w-k.js",
 "./assets/nosql-D7-fd4UI.js",
 "./assets/nullstellen-D1e2vY6q.js",
 "./assets/numerische-integration-DbACjyPi.js",
 "./assets/oauth-oidc-keX85YYk.js",
 "./assets/ode-verfahren-DrLmEsUg.js",
 "./assets/orm-migrationen-elRqGIkG.js",
 "./assets/orthogonalitaet-B40xfA5D.js",
 "./assets/owasp-top-10-BmysOIEu.js",
 "./assets/paketmanager-buildtools-B8vAWL0T.js",
 "./assets/palette-CeeIHQzK.js",
 "./assets/passwoerter-kryptografie-COIyZWCi.js",
 "./assets/pause-BJEPdIrO.js",
 "./assets/plus-CApQrP20.js",
 "./assets/polynome-B9beoGPK.js",
 "./assets/potenzen-logarithmen-BoLoQqYy.js",
 "./assets/praedikatenlogik-BqGmcz8j.js",
 "./assets/prism-A2v5VugZ.js",
 "./assets/prism-CI-NtRBo.js",
 "./assets/progress-wAlqRyKs.js",
 "./assets/publisher-Djmjp6DP.js",
 "./assets/react-BfaOU4vi.js",
 "./assets/react-grundlagen-BZV7hlI9.js",
 "./assets/react-native-CKBTB3IB.js",
 "./assets/refactoring-code-smells-fTFYJZ-S.js",
 "./assets/regression-BswtiGQq.js",
 "./assets/regulaere-ausdruecke-DWSX6hLG.js",
 "./assets/reihen-CB9ug12F.js",
 "./assets/rekurrenzen-asymptotik-B6RPvia2.js",
 "./assets/rekursion-dp-BDJxuDpy.js",
 "./assets/relationale-datenbanken-AhMW-tzi.js",
 "./assets/relationen-m3H32sep.js",
 "./assets/rendering-strategien-BjPzmasR.js",
 "./assets/replikation-sharding-backups-BZ3C6fom.js",
 "./assets/resilienz-muster-B5-g22FQ.js",
 "./assets/rest-api-design-D_Q_4luO.js",
 "./assets/rotate-ccw-BuzF12h4.js",
 "./assets/rsa-Dcc0E0DY.js",
 "./assets/scroll-BuSZRTur.js",
 "./assets/scroll-text-DODJYuTJ.js",
 "./assets/secure-development-eH23GzJN.js",
 "./assets/skip-forward-DxbmjJXe.js",
 "./assets/sortieren-suchen-BYDjEmgF.js",
 "./assets/speicherverwaltung-DjnV-Jqd.js",
 "./assets/spring-boot-C8hEtKSw.js",
 "./assets/sql-fortgeschritten-Cgyj4k3v.js",
 "./assets/sql-grundlagen-CQdVJUmJ.js",
 "./assets/sql-wasm-C1U8OeUW.wasm",
 "./assets/statistik-Ntt8lRxa.js",
 "./assets/stetigkeit-brO3sEsJ.js",
 "./assets/swiftui-ios-BuLtw97r.js",
 "./assets/system-design-C2DL4iXU.js",
 "./assets/taylor-BVMnPW6N.js",
 "./assets/teilbarkeit-euklid--tSUVWEb.js",
 "./assets/testing-CsIie6pq.js",
 "./assets/tex-DTIGYwlD.js",
 "./assets/tool-calling-agents-mcp-C8f8Jrw8.js",
 "./assets/trash-2-V25kiCII.js",
 "./assets/typescript-praxis-DiIjg8Aj.js",
 "./assets/typsysteme-paradigmen-CW-uLqZV.js",
 "./assets/vektoren-D4bbv6Jn.js",
 "./assets/vektorraeume-BHiM5m8v.js",
 "./assets/verteilte-systeme-DAE19N9z.js",
 "./assets/verteilungen-CWx7brw-.js",
 "./assets/vollstaendige-induktion-DlEUqLn0.js",
 "./assets/wahrscheinlichkeitsraeume-C6MFsKbw.js",
 "./assets/web-performance-CxZnDXYa.js",
 "./assets/websockets-echtzeit-CZmLrJOf.js",
 "./assets/wie-computer-funktionieren-DHJN2SBh.js",
 "./assets/wifi-off-BP7N9-QE.js",
 "./assets/xss-csrf-cors-DFpQIaky.js",
 "./assets/zahlensysteme-encoding-D9sbUJOX.js",
 "./assets/zufallsvariablen-CN44EMbI.js",
 "./assets/zugriffskontrolle-Bb8AjcDP.js",
 "./favicon.svg",
 "./icons/apple-touch-icon.png",
 "./icons/icon-192.png",
 "./icons/icon-512.png",
 "./icons/maskable-512.png",
 "./manifest.webmanifest",
 "./rechtliches/datenschutz.html",
 "./rechtliches/impressum.html",
 "./sandbox.html",
 "./theme-init.js",
 "./workers/js-runner.js",
 "./workers/python-runner.js"
];
const CDN_PREFIXES = ['https://cdn.jsdelivr.net/pyodide/'];
/** Ordner der mitgelieferten Python-Laufzeit dieser Version (z. B. pyodide/v0.27.7/) */
const PYODIDE_DIR = "pyodide/v0.27.7/";
/** Alle Dateien der mitgelieferten Python-Laufzeit (nicht im Precache, ≈ 16 MB) */
const PYODIDE_FILES = ["./pyodide/v0.27.7/pyodide.mjs","./pyodide/v0.27.7/pyodide.asm.js","./pyodide/v0.27.7/pyodide.asm.wasm","./pyodide/v0.27.7/python_stdlib.zip","./pyodide/v0.27.7/pyodide-lock.json","./pyodide/v0.27.7/numpy-2.0.2-cp312-cp312-pyodide_2024_0_wasm32.whl"];
const PYODIDE_CORE = /\/(pyodide\.m?js|pyodide\.asm\.(js|wasm)|python_stdlib\.zip|pyodide-lock\.json)$/;

/** Laufzeit-Cache aufräumen: alte Python-Laufzeiten (eigene und früher vom CDN geladene). Zusatzpakete bleiben. */
async function cleanRuntime() {
  const cache = await caches.open(RUNTIME);
  const current = scopeUrl(PYODIDE_DIR);
  for (const req of await cache.keys()) {
    const u = req.url;
    const ownOld = u.startsWith(scopeUrl('pyodide/')) && !u.startsWith(current);
    const cdnCore = CDN_PREFIXES.some((p) => u.startsWith(p)) && PYODIDE_CORE.test(new URL(u).pathname);
    if (ownOld || cdnCore) await cache.delete(req);
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE);
      // einzeln laden, damit eine fehlende Datei nicht die ganze Installation verhindert
      const results = await Promise.allSettled(
        PRECACHE_URLS.map(async (url) => {
          const res = await fetch(new Request(url, { cache: 'reload' }));
          if (!res.ok) throw new Error(url + ' → ' + res.status);
          await cache.put(url, res);
        }),
      );
      const failed = results.filter((r) => r.status === 'rejected');
      if (failed.length > PRECACHE_URLS.length * 0.1) throw new Error('Precache unvollständig: ' + failed.length + ' Dateien fehlen');
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith('devatlas-precache-') && k !== PRECACHE).map((k) => caches.delete(k)));
      await cleanRuntime().catch(() => {});
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'SKIP_WAITING') self.skipWaiting();
  // Python-Labor: Laufzeit nach dem ersten Start vollständig ablegen – auch wenn diese Seite beim Laden noch nicht
  // vom Service Worker gesteuert wurde (allererster Besuch). Nur die festen Dateien dieser Version, keine fremden URLs.
  if (data.type === 'CACHE_PYODIDE') {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(RUNTIME);
        for (const path of PYODIDE_FILES) {
          const url = scopeUrl(path);
          if (await cache.match(url, { ignoreSearch: true, ignoreVary: true })) continue;
          try {
            const res = await fetch(url);
            if (res.ok) await cache.put(url, res);
          } catch {
            /* offline – beim nächsten Start erneut */
          }
        }
      })(),
    );
  }
  if (data.type === 'GET_VERSION' && event.ports[0]) {
    caches.open(PRECACHE).then(async (c) => {
      const n = (await c.keys()).length;
      event.ports[0].postMessage({ version: VERSION, cached: n, total: PRECACHE_URLS.length });
    });
  }
});

function scopeUrl(path) {
  return new URL(path, self.registration.scope).href;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Seitenaufrufe der App → App-Shell dieser Version. Nur für die Startadresse (die App nutzt Hash-Routing);
  // eigenständige Seiten wie rechtliches/datenschutz.html oder download/ werden normal ausgeliefert.
  const inScope = url.origin === self.location.origin && url.href.startsWith(self.registration.scope);
  const rel = inScope ? url.pathname.slice(new URL(self.registration.scope).pathname.length) : null;
  if (req.mode === 'navigate' && inScope && (rel === '' || rel === 'index.html')) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(PRECACHE);
        const shell = (await cache.match(scopeUrl('./index.html'), { ignoreVary: true })) || (await cache.match(scopeUrl('./'), { ignoreVary: true }));
        if (shell) return shell;
        return fetch(req);
      })(),
    );
    return;
  }

  // eigene Dateien: Cache zuerst, sonst Netz (und gleichnamige Dateien für später merken)
  if (url.origin === self.location.origin) {
    event.respondWith(
      (async () => {
        // ignoreVary: Server antworten oft mit „Vary: Origin“; Modul-Anfragen senden andere Header als der Precache
        const hit = await caches.match(req, { ignoreSearch: true, ignoreVary: true });
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(RUNTIME).then((c) => c.put(req, copy));
        }
        return res;
      })(),
    );
    return;
  }

  // Pyodide: versionierte, unveränderliche Dateien → Cache zuerst
  if (CDN_PREFIXES.some((p) => req.url.startsWith(p))) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME);
        const hit = await cache.match(req, { ignoreVary: true });
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      })(),
    );
  }
  // alles andere: nicht abfangen (Browser-Standardverhalten, kein Caching)
});
