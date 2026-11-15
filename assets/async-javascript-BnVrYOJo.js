const e=`---
id: async-javascript
title: Asynchrones JavaScript: Event Loop, Promises & async/await
area: web
difficulty: fortgeschritten
minutes: 18
order: 13
summary: Warum JavaScript mit einem Thread Tausende Anfragen gleichzeitig bewältigt, wie Call Stack, Microtasks und Macrotasks zusammenspielen und wie du Promises und async/await sicher einsetzt.
tags: [JavaScript, Event Loop, Promise, async/await, Nebenläufigkeit]
related: [javascript-dom, node-express-api, react-grundlagen, nebenlaeufigkeit]
---

## Das Problem: ein Thread, viele Wartezeiten

JavaScript führt Code auf **einem einzigen Thread** aus. Würde \`fetch\` warten, bis die Antwort da ist, wäre die ganze Seite eingefroren – kein Scrollen, kein Klicken. Stattdessen arbeitet JavaScript **nicht-blockierend**: Langsame Operationen (Netzwerk, Timer, Dateien in Node.js) werden an die Umgebung abgegeben, und ihr Ergebnis kommt später als Aufgabe zurück. Die [[Event Loop]] verteilt diese Aufgaben.

> [!BEGINNER]
> Ein Kellner (der Thread) nimmt eine Bestellung auf, gibt sie an die Küche (die Umgebung) und bedient sofort den nächsten Tisch. Ist ein Gericht fertig, ruft die Küche – und der Kellner bringt es, sobald er gerade nichts anderes tut.

## Die Event Loop Schritt für Schritt

Beobachte, in welcher Reihenfolge die Ausgaben erscheinen – und warum:

\`\`\`widget
eventloop
\`\`\`

Die Regeln:

1. **Synchroner Code** läuft komplett auf dem [[Call Stack]].
2. Ist der Stack leer, werden **alle Microtasks** abgearbeitet (Promise-Callbacks, \`queueMicrotask\`, Fortsetzungen nach \`await\`).
3. Dann folgt **ein Macrotask** (Timer, I/O, UI-Events) – danach wieder alle Microtasks.
4. Im Browser kann zwischen den Macrotasks gerendert werden.

## Callbacks → Promises → async/await

**[[Callback|Callbacks]]** waren der ursprüngliche Weg – verschachtelt wurden sie schnell unübersichtlich („Callback Hell“):

\`\`\`javascript title="Früher: verschachtelte Callbacks"
ladeNutzer(id, (err, nutzer) => {
  if (err) return zeigeFehler(err);
  ladeBestellungen(nutzer.id, (err, bestellungen) => {
    if (err) return zeigeFehler(err);
    zeige(bestellungen);
  });
});
\`\`\`

Ein **[[Promise]]** repräsentiert ein zukünftiges Ergebnis mit drei Zuständen: *pending*, *fulfilled*, *rejected*. Promises lassen sich verketten:

\`\`\`javascript
ladeNutzer(id)
  .then((nutzer) => ladeBestellungen(nutzer.id))
  .then(zeige)
  .catch(zeigeFehler)
  .finally(() => spinner.hidden = true);
\`\`\`

**[[Async/Await]]** ist syntaktischer Zucker darüber und liest sich wie synchroner Code:

\`\`\`javascript
async function zeigeBestellungen(id) {
  try {
    const nutzer = await ladeNutzer(id);
    const bestellungen = await ladeBestellungen(nutzer.id);
    zeige(bestellungen);
  } catch (err) {
    zeigeFehler(err);
  } finally {
    spinner.hidden = true;
  }
}
\`\`\`

> [!EXPERT]
> Eine \`async\`-Funktion gibt **immer** ein Promise zurück. \`await\` pausiert nur diese Funktion; der Rest der Funktion wird als Microtask eingeplant, sobald das erwartete Promise erfüllt ist. Der Thread ist in der Zwischenzeit frei.

## Parallel statt nacheinander

Unabhängige Operationen sollten parallel laufen:

\`\`\`javascript
// ❌ langsam: zweite Anfrage startet erst nach der ersten
const a = await fetch('/api/a');
const b = await fetch('/api/b');

// ✅ parallel: beide starten sofort
const [ra, rb] = await Promise.all([fetch('/api/a'), fetch('/api/b')]);
\`\`\`

| Kombinator | Ergebnis |
|---|---|
| \`Promise.all\` | Alle Ergebnisse – oder Abbruch beim ersten Fehler |
| \`Promise.allSettled\` | Alle Ergebnisse inkl. Fehlern als \`{status, value/reason}\` |
| \`Promise.race\` | Das erste fertige (Erfolg oder Fehler) |
| \`Promise.any\` | Der erste Erfolg |

Probiere den Geschwindigkeitsunterschied im [Playground (Preset „Async & Promises“)](#/labor/playground) aus.

## Abbrechen und Timeouts

\`\`\`javascript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000);

try {
  const res = await fetch('/api/langsam', { signal: controller.signal });
  // kürzer: fetch(url, { signal: AbortSignal.timeout(5000) })
} catch (e) {
  if (e.name === 'AbortError') console.warn('Abgebrochen');
} finally {
  clearTimeout(timeout);
}
\`\`\`

## Fehlerbehandlung

- Jedes Promise braucht einen Fehlerpfad (\`catch\` oder \`try/catch\` um \`await\`).
- Unbehandelte Ablehnungen erscheinen im Browser als Warnung und **beenden in Node.js den Prozess**.
- \`fetch\` lehnt nur bei Netzwerkfehlern ab – HTTP-Fehler wie 404 musst du über \`res.ok\` selbst prüfen.

## Typische Fehler

> [!MISTAKE] \`await\` in \`forEach\`
> \`arr.forEach(async (x) => await speichere(x))\` wartet **nicht** – \`forEach\` ignoriert zurückgegebene Promises. Verwende \`for…of\` (nacheinander) oder \`Promise.all(arr.map(…))\` (parallel).

> [!MISTAKE] Vergessenes \`await\`
> \`const daten = ladeDaten();\` liefert ein Promise, nicht die Daten. TypeScript und der Lint-Regelsatz \`no-floating-promises\` finden solche Stellen.

> [!MISTAKE] CPU-Arbeit auf dem Haupt-Thread
> Eine Schleife über 100 Millionen Elemente blockiert die Event Loop – auch mit \`async\`. Asynchronität hilft bei **Wartezeiten**, nicht bei Rechenlast. Dafür gibt es Web Workers bzw. \`worker_threads\`.

## Wie geht es weiter?

Vergleiche Asynchronität in anderen Sprachen in der [Syntax-Bibliothek](#/syntax/async) und nutze sie serverseitig mit [Node.js & Express](#/artikel/node-express-api).

\`\`\`widget
quiz:JavaScript 3
\`\`\`
`;export{e as default};
