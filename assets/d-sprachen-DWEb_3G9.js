const r=[{id:"html",name:"HTML",abbr:"HTML",color:"#e34f26",kind:"Markup-Sprache",group:"web",prism:"html",tagline:"Die Struktur- und Bedeutungsschicht jeder Webseite.",year:1993,creator:"Tim Berners-Lee (CERN); heute WHATWG „Living Standard“",paradigms:["deklarativ","Auszeichnung"],typing:"— (keine Programmiersprache)",execution:"Vom Browser geparst und zum DOM aufgebaut",memory:"—",extensions:[".html",".htm"],difficulty:"einsteiger",summary:"HTML (HyperText Markup Language) beschreibt **Struktur und Bedeutung** von Inhalten: Überschriften, Absätze, Listen, Links, Formulare, Bilder, Navigation. HTML ist **keine Programmiersprache** – es gibt keine Variablen, Schleifen oder Logik. Der Browser liest HTML und baut daraus den [[DOM]], den [[CSS]] gestaltet und [[JavaScript]] verändern kann.",usedFor:["Jede Webseite und Web-App","E-Mail-Templates (mit Einschränkungen)","Dokumentation, E-Books (EPUB basiert auf XHTML)","Oberflächen in Electron-/Tauri-Desktop-Apps"],history:"Tim Berners-Lee entwarf HTML 1989–1991 am CERN zusammen mit HTTP und URLs als Grundbausteine des World Wide Web. Nach den „Browserkriegen“ der 1990er brachte HTML5 (W3C-Empfehlung 2014) native Audio/Video-Elemente, semantische Tags und viele APIs. Seit 2019 ist der von der WHATWG gepflegte **HTML Living Standard** maßgeblich – es gibt keine Versionsnummern mehr.",strengths:["Extrem einfacher Einstieg, sofort sichtbare Ergebnisse","Fehlertolerant: Browser rendern auch fehlerhaftes HTML","Semantik liefert Barrierefreiheit und SEO „gratis“","Universell: läuft auf jedem Gerät mit Browser"],weaknesses:["Keine Logik – für Dynamik braucht es JavaScript oder Server-Rendering","Fehlertoleranz verdeckt Fehler","Formulare und komplexe Widgets erfordern Wissen über Barrierefreiheit"],setup:{steps:["Einen Editor installieren (z. B. VS Code).","Eine Datei `index.html` anlegen und das Grundgerüst einfügen.","Datei per Doppelklick im Browser öffnen – oder mit einem lokalen Server (z. B. `npx serve` oder die VS-Code-Erweiterung „Live Server“) für automatisches Neuladen.","Mit dem W3C-Validator (validator.w3.org) oder den Browser-DevTools prüfen."]},tooling:["VS Code (Emmet integriert)","Browser-DevTools (Elements-Panel)","W3C Markup Validator","Lighthouse / axe für Barrierefreiheit"],hello:`<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hallo Welt</title>
</head>
<body>
  <h1>Hallo, Welt!</h1>
  <p>Meine erste Webseite.</p>
</body>
</html>`,example:{title:"Barrierefreies Kontaktformular",lang:"html",code:`<form action="/kontakt" method="post">
  <label for="name">Name</label>
  <input id="name" name="name" autocomplete="name" required>

  <label for="email">E-Mail</label>
  <input id="email" name="email" type="email" autocomplete="email" required>

  <fieldset>
    <legend>Anliegen</legend>
    <label><input type="radio" name="typ" value="frage" checked> Frage</label>
    <label><input type="radio" name="typ" value="feedback"> Feedback</label>
  </fieldset>

  <label for="nachricht">Nachricht</label>
  <textarea id="nachricht" name="nachricht" rows="5" minlength="10" required></textarea>

  <button type="submit">Absenden</button>
</form>`,explanation:"Jedes Feld hat ein verknüpftes `<label>` (Klickfläche + Screenreader-Name), passende `type`-Attribute aktivieren mobile Tastaturen und eingebaute Validierung, `autocomplete` hilft beim Ausfüllen. `fieldset`/`legend` gruppiert zusammengehörige Optionen. Serverseitige Validierung bleibt trotzdem Pflicht."},ecosystem:[{name:"Template-Engines",desc:"Jinja, Twig, Blade, EJS, Thymeleaf erzeugen HTML serverseitig."},{name:"Komponenten-Frameworks",desc:"React (JSX), Vue, Svelte, Angular erzeugen HTML aus Komponenten.",techId:"react"},{name:"Web Components",desc:"Native, wiederverwendbare Custom Elements."},{name:"HTMX",desc:"HTML-Attribute für dynamisches Nachladen ohne eigenes JavaScript."}],bestPractices:["Semantische Elemente verwenden: `<header>`, `<nav>`, `<main>`, `<article>`, `<button>`.","Genau eine `<h1>` pro Seite und eine logische Überschriftenhierarchie ohne Sprünge.",'Jedes Bild braucht ein sinnvolles `alt` (dekorative Bilder: `alt=""`).',"`lang`-Attribut am `<html>`-Element setzen.","Formularfelder immer mit `<label>` verknüpfen.","Skripte mit `defer` laden, damit sie das Parsen nicht blockieren."],mistakes:[{title:"`<div>` als Button",wrong:'<div class="btn" onclick="speichern()">Speichern</div>',right:'<button type="button" onclick="speichern()">Speichern</button>',explanation:"Ein `<div>` ist nicht fokussierbar, reagiert nicht auf Enter/Leertaste und wird von Screenreadern nicht als Schaltfläche angesagt. `<button>` bringt all das mit.",lang:"html"},{title:"Überschriften nach Größe statt Struktur gewählt",wrong:`<h1>Shop</h1>
<h4>Neue Produkte</h4>`,right:`<h1>Shop</h1>
<h2>Neue Produkte</h2>`,explanation:"Überschriften bilden die Gliederung des Dokuments. Die Optik regelt CSS – nicht die Wahl des Tags.",lang:"html"}],interview:[{q:"Was ist der Unterschied zwischen `<section>`, `<article>` und `<div>`?",a:"`<article>` ist eigenständig verständlicher Inhalt (Blogpost, Kommentar), `<section>` ein thematischer Abschnitt mit eigener Überschrift, `<div>` ein bedeutungsloser Container nur für Styling/Layout."},{q:"Was bewirken `defer` und `async` bei `<script>`?",a:"Beide laden parallel zum Parsen. `defer` führt nach dem Parsen in Dokumentreihenfolge aus, `async` sofort nach dem Laden in beliebiger Reihenfolge."}],related:["css","javascript","php"],next:["[CSS lernen](#/sprachen/css)","[Semantisches HTML & Barrierefreiheit](#/artikel/html-semantik)","[JavaScript & DOM](#/artikel/javascript-dom)"]},{id:"css",name:"CSS",abbr:"CSS",color:"#663399",kind:"Stylesheet-Sprache",group:"web",prism:"css",tagline:"Gestaltung, Layout und Animation des Webs.",year:1996,creator:"Håkon Wium Lie und Bert Bos (W3C)",paradigms:["deklarativ","regelbasiert"],typing:"— (Werte haben Einheiten und Typen)",execution:"Vom Browser zum CSSOM geparst und mit dem DOM kombiniert",memory:"—",extensions:[".css"],difficulty:"einsteiger",summary:"CSS (Cascading Style Sheets) legt fest, **wie** HTML-Elemente aussehen: Farben, Schriften, Abstände, Layout, Animationen und Anpassung an Bildschirmgrößen. Eine Regel besteht aus einem **Selektor** und **Deklarationen**. Bei Konflikten entscheidet die **Kaskade** (Herkunft, Spezifität, Reihenfolge). Modernes CSS kann Layouts mit [[Flexbox]] und [[CSS Grid]], Variablen, Container Queries, Verschachtelung und `:has()`.",usedFor:["Design und Layout von Webseiten","Responsive Design","Animationen und Übergänge","Theming (Dark Mode) über Custom Properties","Druckstile"],history:"CSS1 erschien 1996, CSS2 1998. Statt eines monolithischen „CSS3“ wird CSS seither in Modulen weiterentwickelt (Selectors, Flexbox, Grid …). In den letzten Jahren kamen Custom Properties, Grid (2017), Container Queries, `:has()` und native Verschachtelung (2023) breit in allen Browsern an – viele Gründe für Präprozessoren entfallen.",strengths:["Trennung von Inhalt und Darstellung","Mächtige Layoutsysteme (Grid, Flexbox)","Hardwarebeschleunigte Animationen","Viele neue Features ohne JavaScript"],weaknesses:["Globaler Geltungsbereich führt in großen Projekten zu Konflikten","Kaskade und Spezifität sind anfangs schwer zu durchschauen","Browser-Unterschiede bei neuen Features (Baseline beachten)"],setup:{steps:["CSS-Datei `style.css` anlegen.",'Im HTML-`<head>` einbinden: `<link rel="stylesheet" href="style.css">`.',"Mit den Browser-DevTools (Elements → Styles) live experimentieren.","Für Projekte optional: Tailwind CSS, Sass oder PostCSS über einen Bundler wie Vite."]},tooling:["Browser-DevTools (Styles, Computed, Layout-Overlays für Grid/Flex)","Stylelint","PostCSS / Lightning CSS","Tailwind CSS, Sass"],hello:`body {
  font-family: system-ui, sans-serif;
  color: #1e293b;
  background: #f8fafc;
}

h1 {
  color: rebeccapurple;
  font-size: clamp(1.5rem, 4vw, 3rem);
}`,example:{title:"Responsives Kartenraster mit Dark Mode",lang:"css",code:`:root {
  --bg: #ffffff;
  --text: #0f172a;
  --accent: #4f46e5;
}

@media (prefers-color-scheme: dark) {
  :root { --bg: #0b1020; --text: #e2e8f0; --accent: #818cf8; }
}

body { background: var(--bg); color: var(--text); }

.karten {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: 1.5rem;
}

.karte {
  border: 1px solid color-mix(in srgb, var(--text) 15%, transparent);
  border-radius: 12px;
  padding: 1rem;
  transition: transform .2s ease;
}

.karte:hover { transform: translateY(-2px); }

@media (prefers-reduced-motion: reduce) {
  .karte { transition: none; }
}`,explanation:"Custom Properties zentralisieren Farben; `prefers-color-scheme` schaltet automatisch um. `auto-fill` + `minmax` erzeugt ein Raster, das sich ohne Media Queries an jede Breite anpasst. `prefers-reduced-motion` respektiert Nutzer, denen Animationen schaden."},ecosystem:[{name:"Tailwind CSS",desc:"Utility-First-Framework mit vordefinierten Klassen.",techId:"tailwind"},{name:"Sass/SCSS",desc:"Präprozessor mit Mixins, Funktionen und Modulen.",techId:"sass"},{name:"CSS Modules",desc:"Lokal gescopte Klassennamen pro Komponente."},{name:"PostCSS",desc:"Transformations-Pipeline (Autoprefixer, Nesting …)."}],bestPractices:["Mobile-First: Basisstyles für kleine Screens, Media Queries für größere.","Relative Einheiten (`rem`, `%`, `fr`, `clamp()`) statt starrer Pixel für Schrift und Layout.","Spezifität niedrig halten: Klassen statt IDs, `!important` vermeiden.","Farben und Abstände als Custom Properties (Design-Tokens).","Nur `transform` und `opacity` animieren, um Layout-Neuberechnungen zu vermeiden.","Fokuszustände nie entfernen – höchstens mit `:focus-visible` gestalten."],mistakes:[{title:"Fokus-Umrandung entfernt",wrong:"*:focus { outline: none; }",right:`:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}`,explanation:"Ohne sichtbaren Fokus können Tastaturnutzer nicht erkennen, wo sie sich befinden. `:focus-visible` zeigt den Ring nur bei Tastaturbedienung.",lang:"css"},{title:"Feste Höhen für Textcontainer",wrong:".box { height: 200px; }",right:".box { min-height: 200px; }",explanation:"Bei längerem Text, größerer Schrift oder Übersetzungen läuft Inhalt sonst über. `min-height` lässt den Container wachsen.",lang:"css"}],interview:[{q:"Wie berechnet sich die Spezifität?",a:"Als Tupel (IDs, Klassen/Attribute/Pseudoklassen, Elemente/Pseudoelemente). `#nav .item a` = (1,1,1). Inline-Styles und `!important` stehen darüber; bei Gleichstand gewinnt die spätere Regel."},{q:"Wann Flexbox, wann Grid?",a:"Flexbox für eindimensionale Anordnung (eine Zeile/Spalte, Inhalt bestimmt die Größe), Grid für zweidimensionale Layouts mit Zeilen und Spalten. Beide werden oft kombiniert."}],related:["html","javascript"],next:["[Layouts mit Flexbox & Grid](#/artikel/css-layout)","[Flexbox-/Grid-Playground](#/labor/flexbox)","[CSS-Cheatsheet](#/cheatsheets/css)"]},{id:"javascript",name:"JavaScript",abbr:"JS",color:"#f7df1e",kind:"Programmiersprache",group:"web",prism:"javascript",tagline:"Die Sprache des Webs – im Browser, auf dem Server und darüber hinaus.",year:1995,creator:"Brendan Eich (Netscape); standardisiert als ECMAScript (Ecma TC39)",paradigms:["multiparadigmatisch","ereignisgesteuert","funktional","prototypbasiert objektorientiert"],typing:"dynamisch, schwach",execution:"JIT-kompiliert in Engines wie V8, SpiderMonkey, JavaScriptCore",memory:"Garbage Collection",extensions:[".js",".mjs",".cjs"],difficulty:"einsteiger",summary:"JavaScript ist die einzige Programmiersprache, die **nativ in allen Browsern** läuft. Sie macht Webseiten interaktiv, steuert den [[DOM]] und kommuniziert per [[Fetch API]] mit Servern. Mit [[Node.js]], Deno und Bun läuft sie auch auf Servern und im Terminal. JavaScript ist dynamisch typisiert, single-threaded mit einer [[Event Loop]] und behandelt Funktionen als First-Class-Werte.",usedFor:["Interaktive Webseiten und Single Page Apps","Backend-APIs mit Node.js","Desktop-Apps (Electron), Mobile (React Native)","Build-Tools und CLI-Werkzeuge","Serverless-/Edge-Funktionen"],history:"Brendan Eich entwickelte den ersten Prototyp 1995 in rund zehn Tagen bei Netscape. Der Name „JavaScript“ war Marketing – mit Java hat die Sprache wenig gemein. 1997 wurde sie als ECMAScript standardisiert. ES5 (2009) und vor allem **ES2015 (ES6)** mit `let/const`, Klassen, Modulen, Arrow Functions und Promises modernisierten sie grundlegend. Seitdem erscheint jährlich eine neue Version. 2009 brachte Node.js JavaScript auf den Server.",strengths:["Läuft überall, wo ein Browser ist","Riesiges Ökosystem (npm)","Eine Sprache für Frontend und Backend","Sehr schnelle Engines dank JIT","Asynchrones I/O ideal für Netzwerkanwendungen"],weaknesses:['Schwache Typisierung erzeugt überraschendes Verhalten (`"5" + 1`)',"Historische Altlasten (`var`, `==`, `this`-Bindung)","Single-threaded: CPU-lastiger Code blockiert","Schnelllebiges, fragmentiertes Tooling"],setup:{steps:["Im Browser: DevTools öffnen (F12) → Konsole – sofort loslegen.","Für lokale Skripte: Node.js LTS von nodejs.org installieren (oder per Versionsmanager wie fnm/nvm).","Version prüfen (siehe unten), Datei `app.js` anlegen und mit `node app.js` ausführen.","Für Projekte: `npm init -y`, für Frontend-Projekte z. B. `npm create vite@latest`."],verify:`node --version
npm --version`,verifyLang:"bash"},tooling:["VS Code","Browser-DevTools","Node.js / Deno / Bun","ESLint + Prettier","Vite","Vitest / Jest / Playwright"],hello:"console.log('Hallo, Welt!');",example:{title:"Daten laden, filtern und anzeigen",lang:"javascript",code:`// Benutzer von einer API laden und aktive Nutzer alphabetisch anzeigen
async function zeigeAktiveNutzer() {
  const liste = document.querySelector('#nutzer');
  try {
    const res = await fetch('/api/nutzer');
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    const nutzer = await res.json();

    const aktive = nutzer
      .filter((n) => n.aktiv)
      .sort((a, b) => a.name.localeCompare(b.name, 'de'));

    liste.replaceChildren(
      ...aktive.map((n) => {
        const li = document.createElement('li');
        li.textContent = \`\${n.name} (\${n.rolle})\`; // textContent: sicher gegen XSS
        return li;
      }),
    );
  } catch (err) {
    liste.textContent = 'Nutzer konnten nicht geladen werden.';
    console.error(err);
  }
}

zeigeAktiveNutzer();`,explanation:"`async/await` macht asynchronen Code lesbar, `res.ok` fängt HTTP-Fehler ab (fetch wirft dabei nicht von selbst!), `filter`/`sort` arbeiten deklarativ, und `textContent` verhindert [[XSS]], weil Nutzerdaten nie als HTML interpretiert werden."},ecosystem:[{name:"React",desc:"Komponentenbasierte UI-Bibliothek.",techId:"react"},{name:"Vue",desc:"Progressives UI-Framework.",techId:"vue"},{name:"Node.js",desc:"Server-Runtime.",techId:"nodejs"},{name:"Express",desc:"Minimalistisches Web-Framework.",techId:"express"},{name:"Vite",desc:"Schnelles Build-Tool und Dev-Server.",techId:"vite"},{name:"Vitest / Jest",desc:"Test-Frameworks.",techId:"vitest"}],bestPractices:["`const` als Standard, `let` wenn nötig, nie `var`.","Immer `===` statt `==`.","Asynchronen Code mit `async/await` und `try/catch` schreiben; Promises nie „vergessen“ (fehlendes `await`).","ES Modules (`import`/`export`) statt globaler Variablen.","Nutzereingaben nie per `innerHTML` einfügen.","Für größere Projekte TypeScript oder zumindest JSDoc-Typen + `// @ts-check` einsetzen."],mistakes:[{title:"`==` statt `===`",wrong:`0 == ''        // true
null == undefined // true
'1' == 1      // true`,right:`0 === ''       // false
'1' === 1     // false`,explanation:"`==` wandelt Typen implizit um ([[Type Coercion]]) und führt zu schwer vorhersehbaren Ergebnissen. `===` vergleicht Wert UND Typ.",lang:"javascript"},{title:"Vergessenes `await`",wrong:"const daten = fetch(url).json(); // TypeError",right:`const res = await fetch(url);
const daten = await res.json();`,explanation:"`fetch` liefert ein Promise, keine Response. Ohne `await` arbeitet man mit dem Promise-Objekt statt mit dem Ergebnis.",lang:"javascript"},{title:"`this` geht im Callback verloren",wrong:`class Uhr {
  start() {
    setInterval(function () {
      this.tick(); // this ist hier nicht die Uhr
    }, 1000);
  }
}`,right:`class Uhr {
  start() {
    setInterval(() => this.tick(), 1000);
  }
}`,explanation:"Normale Funktionen bestimmen `this` beim Aufruf. Arrow Functions übernehmen `this` aus dem umgebenden Kontext.",lang:"javascript"}],advanced:[{title:"Prototypen",text:"Jedes Objekt hat einen Prototyp, von dem es Eigenschaften erbt. `class` ist syntaktischer Zucker über dieser Prototyp-Kette."},{title:"Event Loop & Microtasks",text:"Promise-Callbacks (Microtasks) laufen vor Timern (Macrotasks). Siehe [Event-Loop-Visualisierung](#/artikel/async-javascript)."},{title:"Closures",text:"Funktionen „merken“ sich ihren Entstehungs-Scope – Grundlage für private Zustände, Factories und React Hooks. Siehe [[Closure]]."},{title:"Iteratoren & Generatoren",text:"`function*` und `yield` erzeugen lazy Sequenzen; `for…of` funktioniert mit allem, was `Symbol.iterator` implementiert."},{title:"Proxy & Reflect",text:"Metaprogrammierung: Zugriffe auf Objekte abfangen – Grundlage der Reaktivität in Vue 3."}],interview:[{q:"Was gibt `console.log(typeof null)` aus?",a:'`"object"` – ein historischer Fehler aus der ersten Implementierung, der aus Kompatibilitätsgründen nie behoben wurde.'},{q:"Unterschied zwischen `let`, `const` und `var`?",a:"`var` ist function-scoped und wird mit `undefined` gehoisted. `let`/`const` sind block-scoped und bis zur Deklaration in der Temporal Dead Zone. `const` verhindert Neuzuweisung, aber nicht die Mutation von Objekten."},{q:"Was ist ein Closure?",a:"Eine Funktion zusammen mit der Umgebung, in der sie definiert wurde. Sie kann auf Variablen dieser Umgebung zugreifen, auch nachdem die äußere Funktion beendet ist."},{q:"In welcher Reihenfolge laufen `setTimeout(f, 0)` und `Promise.resolve().then(g)`?",a:"Zuerst `g` (Microtask), dann `f` (Macrotask) – Microtasks werden vollständig abgearbeitet, bevor der nächste Macrotask startet."}],exercises:[{title:"Wörter zählen",task:"Schreibe eine Funktion `zaehleWoerter(text)`, die ein Objekt mit der Häufigkeit jedes Wortes (kleingeschrieben) zurückgibt.",hint:"Mit `toLowerCase()`, `match(/\\p{L}+/gu)` und `reduce` arbeiten.",solution:`function zaehleWoerter(text) {
  const woerter = text.toLowerCase().match(/\\p{L}+/gu) ?? [];
  return woerter.reduce((acc, w) => {
    acc[w] = (acc[w] ?? 0) + 1;
    return acc;
  }, {});
}

console.log(zaehleWoerter('Der Hund und der Ball'));`},{title:"Debounce",task:"Implementiere `debounce(fn, ms)`: Die zurückgegebene Funktion ruft `fn` erst auf, wenn sie `ms` Millisekunden lang nicht erneut aufgerufen wurde.",hint:"Closure mit einer Timer-Variable, `clearTimeout` bei jedem Aufruf.",solution:`function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

const log = debounce((x) => console.log("Suche:", x), 300);
log("a"); log("ab"); log("abc"); // nur "abc" wird ausgegeben`}],related:["typescript","html","css","python"],next:["[TypeScript](#/sprachen/typescript)","[Asynchrones JavaScript & Event Loop](#/artikel/async-javascript)","[React-Grundlagen](#/artikel/react-grundlagen)","[Node.js-API mit Express](#/artikel/node-express-api)"]},{id:"typescript",name:"TypeScript",abbr:"TS",color:"#3178c6",kind:"Programmiersprache",group:"web",prism:"typescript",tagline:"JavaScript mit statischen Typen – für große, wartbare Codebasen.",year:2012,creator:"Microsoft (Anders Hejlsberg)",paradigms:["multiparadigmatisch","objektorientiert","funktional"],typing:"statisch, strukturell, graduell (optional)",execution:"Transpiliert zu JavaScript; Typen werden entfernt (Type Erasure)",memory:"Garbage Collection (der JS-Runtime)",extensions:[".ts",".tsx",".mts",".cts"],difficulty:"fortgeschritten",summary:"TypeScript ist eine **Obermenge von JavaScript**: Jeder gültige JS-Code ist auch gültiges TypeScript. Dazu kommen **statische Typen**, die der Compiler vor der Ausführung prüft. Das Typsystem ist **strukturell** – es zählt die Form eines Objekts, nicht sein Name. Zur Laufzeit existieren keine Typen mehr; externe Daten (APIs, Formulare) müssen deshalb weiterhin validiert werden.",usedFor:["Große Frontend-Anwendungen (Angular ist komplett TS)","Backends mit Node.js/NestJS","Bibliotheken mit guter Editor-Unterstützung","Full-Stack-Projekte mit geteilten Typen"],history:"Microsoft veröffentlichte TypeScript 2012, um JavaScript für große Teams beherrschbar zu machen. Mit Angular 2 (2016), VS Code und der Übernahme durch React-, Vue- und Node-Projekte wurde es zum De-facto-Standard. Node.js kann seit Version 23.6 einfache TS-Dateien ohne Build ausführen (Type Stripping). Der Compiler wurde in Go neu implementiert („TypeScript 7“) und ist dadurch um ein Vielfaches schneller.",strengths:["Fehler werden vor der Ausführung gefunden","Hervorragende Autovervollständigung und sichere Refactorings","Typen dienen als lebende Dokumentation","Schrittweise einführbar in JS-Projekte"],weaknesses:["Zusätzlicher Build-/Prüfschritt","Typen können komplex werden (Conditional/Mapped Types)","Falsches Sicherheitsgefühl: `any` und Casts hebeln Prüfungen aus","Keine Laufzeitprüfung"],setup:{steps:["Node.js installieren.","Im Projekt: `npm install -D typescript` und `npx tsc --init` (erzeugt `tsconfig.json`).",'In der `tsconfig.json` `"strict": true` aktiviert lassen.',"Kompilieren mit `npx tsc` oder direkt über Vite/esbuild bzw. `node datei.ts` (Type Stripping, nur „erasable“ Syntax)."],verify:"npx tsc --version",verifyLang:"bash"},tooling:["VS Code (TS-Language-Service integriert)","tsc","Vite, esbuild, SWC","ESLint mit typescript-eslint","Zod / Valibot für Laufzeitvalidierung"],hello:`const gruss: string = 'Hallo, Welt!';
console.log(gruss);`,example:{title:"Typsicherer API-Client mit Laufzeitvalidierung",lang:"typescript",code:`import { z } from 'zod';

// Schema = Laufzeitprüfung UND Quelle für den statischen Typ
const Produkt = z.object({
  id: z.number().int(),
  name: z.string(),
  preis: z.number().nonnegative(),
  kategorie: z.enum(['buch', 'technik', 'kleidung']),
});
type Produkt = z.infer<typeof Produkt>;

type Ergebnis<T> = { ok: true; daten: T } | { ok: false; fehler: string };

async function ladeProdukte(): Promise<Ergebnis<Produkt[]>> {
  const res = await fetch('/api/produkte');
  if (!res.ok) return { ok: false, fehler: \`HTTP \${res.status}\` };
  const geparst = z.array(Produkt).safeParse(await res.json());
  return geparst.success
    ? { ok: true, daten: geparst.data }
    : { ok: false, fehler: 'Unerwartetes Datenformat' };
}

const r = await ladeProdukte();
if (r.ok) {
  // TypeScript weiß hier: r.daten ist Produkt[]
  console.log(r.daten.map((p) => p.name));
} else {
  console.error(r.fehler);
}`,explanation:"Ein **Discriminated Union** (`ok: true | false`) zwingt dazu, den Fehlerfall zu behandeln – der Compiler verengt den Typ nach `if (r.ok)`. Zod validiert die API-Antwort zur Laufzeit und leitet daraus den statischen Typ ab, sodass Typ und Prüfung nie auseinanderlaufen."},ecosystem:[{name:"Angular",desc:"Vollständiges Framework, komplett in TS.",techId:"angular"},{name:"NestJS",desc:"Strukturiertes Node-Backend-Framework.",techId:"nestjs"},{name:"Next.js",desc:"React-Framework mit erstklassigem TS-Support.",techId:"nextjs"},{name:"Zod",desc:"Schema-Validierung mit Typinferenz."},{name:"Prisma / Drizzle",desc:"Typsichere ORMs."}],bestPractices:['`"strict": true` – ohne Strict-Modus verschenkt man den Großteil des Nutzens.',"`any` vermeiden; für Unbekanntes `unknown` verwenden und per Type Guard eingrenzen.","Typen inferieren lassen, wo es eindeutig ist; explizite Typen an Schnittstellen (Funktionsparameter, Exporte).","Discriminated Unions statt optionaler Felder für Zustände.","Externe Daten zur Laufzeit validieren (Zod, Valibot).","`as`-Casts sparsam einsetzen – sie sind Behauptungen, keine Prüfungen."],mistakes:[{title:"`any` als Ausweg",wrong:`function verarbeite(daten: any) {
  return daten.nutzer.name; // keine Prüfung
}`,right:`function verarbeite(daten: unknown) {
  if (typeof daten === "object" && daten !== null && "nutzer" in daten) {
    // eingegrenzt …
  }
}`,explanation:"`any` schaltet die Typprüfung komplett ab und „infiziert“ alles, was damit in Berührung kommt. `unknown` erzwingt eine Prüfung vor der Verwendung.",lang:"typescript"},{title:"Typen für Laufzeitschutz halten",wrong:"const user = (await res.json()) as User; // ungeprüft",right:"const user = UserSchema.parse(await res.json());",explanation:"Typen verschwinden beim Kompilieren. Ein Cast prüft nichts – liefert die API andere Daten, crasht der Code später an unerwarteter Stelle.",lang:"typescript"}],advanced:[{title:"Generics mit Constraints",text:"`function prop<T, K extends keyof T>(obj: T, key: K): T[K]` – typsicherer Zugriff auf beliebige Eigenschaften."},{title:"Utility Types",text:"`Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, V>`, `ReturnType<F>`, `Awaited<T>`."},{title:"Conditional & Mapped Types",text:"`type NichtNull<T> = T extends null | undefined ? never : T` und `{ [K in keyof T]: … }` erlauben Typ-Transformationen."},{title:"Template Literal Types",text:"`type Event = `on${Capitalize<string>}`` – String-Muster auf Typebene."},{title:"`satisfies`",text:"Prüft, dass ein Wert zu einem Typ passt, ohne den inferierten (präziseren) Typ zu verlieren."}],interview:[{q:"Unterschied zwischen `interface` und `type`?",a:"Beide beschreiben Objektformen. `interface` kann erweitert und per Declaration Merging ergänzt werden; `type` kann zusätzlich Unions, Tupel, Conditional und Mapped Types ausdrücken. Für Objekt-APIs oft `interface`, sonst `type`."},{q:"Was ist strukturelle Typisierung?",a:"Kompatibilität hängt von der Form ab: Ein Objekt mit `{ name: string; alter: number }` ist überall gültig, wo `{ name: string }` erwartet wird – unabhängig vom deklarierten Namen."},{q:"Was ist `never`?",a:"Der leere Typ – kein Wert hat ihn. Er entsteht z. B. nach vollständiger Fallunterscheidung und eignet sich für Exhaustiveness-Checks."}],related:["javascript","csharp","java"],next:["[Syntax-Vergleich: Generics](#/syntax/generics)","[React-Grundlagen](#/artikel/react-grundlagen)","[TypeScript-Cheatsheet](#/cheatsheets/typescript)"]},{id:"php",name:"PHP",abbr:"PHP",color:"#777bb4",kind:"Programmiersprache",group:"web",prism:"php",tagline:"Pragmatische Server-Sprache, auf der ein großer Teil des Webs läuft.",year:1995,creator:"Rasmus Lerdorf; heute PHP Foundation & Community",paradigms:["imperativ","objektorientiert","funktional"],typing:"dynamisch, optional deklarierte Typen (seit PHP 7 zunehmend strikt)",execution:"Interpretiert (Zend Engine, Opcache, seit PHP 8 optional JIT)",memory:"Reference Counting + Zyklensammler",extensions:[".php"],difficulty:"einsteiger",summary:"PHP ist eine serverseitige Skriptsprache, die speziell für Webanwendungen entstand. Klassisch wird pro HTTP-Anfrage ein Skript ausgeführt, das HTML oder JSON erzeugt („Shared-Nothing“-Architektur). Modernes PHP (8.x) hat ein ausgereiftes Typsystem, Enums, Attribute, Match-Ausdrücke und Readonly-Eigenschaften – und mit Laravel und Symfony zwei sehr produktive Frameworks.",usedFor:["Websites und CMS (WordPress, Drupal, TYPO3)","Web-Backends und APIs mit Laravel oder Symfony","E-Commerce (Shopware, Magento/Adobe Commerce, WooCommerce)"],history:"Rasmus Lerdorf schrieb 1994/95 „Personal Home Page Tools“ für seine eigene Website. PHP 5 (2004) brachte echte Objektorientierung, PHP 7 (2015) verdoppelte die Performance und führte skalare Typdeklarationen ein, PHP 8 (2020) einen JIT-Compiler, Union Types und Named Arguments. Seit 2021 finanziert die PHP Foundation die Weiterentwicklung.",strengths:["Sehr einfaches Hosting, fast jeder Webhoster unterstützt PHP","Riesige Verbreitung und Community","Hervorragende Frameworks (Laravel, Symfony)","Shared-Nothing vereinfacht Skalierung"],weaknesses:["Historisch inkonsistente Standardbibliothek (Parameter-Reihenfolgen, Funktionsnamen)","Schlechter Ruf durch viel veralteten Code im Netz","Klassisches Request-Modell weniger geeignet für langlebige Verbindungen (WebSockets erfordern Zusatz-Server)"],setup:{steps:["PHP installieren (Linux: Paketmanager, macOS: Homebrew, Windows: windows.php.net oder Laragon/XAMPP).","Composer (Paketmanager) installieren: getcomposer.org.","Eingebauten Entwicklungsserver starten: `php -S localhost:8000`.","Für Laravel: `composer create-project laravel/laravel app`."],verify:`php --version
composer --version`,verifyLang:"bash"},tooling:["PhpStorm, VS Code (Intelephense)","Composer","PHPUnit / Pest","PHPStan / Psalm (statische Analyse)","Xdebug"],hello:`<?php

echo 'Hallo, Welt!';`,example:{title:"Sichere Datenbankabfrage mit PDO",lang:"php",code:`<?php
declare(strict_types=1);

enum Status: string {
    case Aktiv = 'aktiv';
    case Gesperrt = 'gesperrt';
}

final class NutzerRepository
{
    public function __construct(private readonly PDO $pdo) {}

    /** @return list<array{id:int,name:string}> */
    public function findeNachStatus(Status $status): array
    {
        $stmt = $this->pdo->prepare('SELECT id, name FROM nutzer WHERE status = :status');
        $stmt->execute(['status' => $status->value]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

$pdo = new PDO('sqlite:app.db', options: [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
$repo = new NutzerRepository($pdo);

foreach ($repo->findeNachStatus(Status::Aktiv) as $n) {
    echo htmlspecialchars($n['name'], ENT_QUOTES, 'UTF-8'), PHP_EOL;
}`,explanation:"`strict_types` verhindert stille Typumwandlungen, ein Backed Enum ersetzt „magische Strings“, Constructor Property Promotion spart Boilerplate. **Prepared Statements** schützen vor [[SQL Injection]], `htmlspecialchars` vor [[XSS]]."},ecosystem:[{name:"Laravel",desc:"Sehr produktives Full-Stack-Framework.",techId:"laravel"},{name:"Symfony",desc:"Modulares Enterprise-Framework und Komponenten."},{name:"WordPress",desc:"Meistgenutztes CMS der Welt."},{name:"Composer / Packagist",desc:"Paketmanager und Registry."}],bestPractices:["`declare(strict_types=1);` in jeder Datei.","Immer PDO/Prepared Statements bzw. ein ORM – nie SQL per String-Verkettung.","Ausgaben mit `htmlspecialchars` bzw. Template-Engine-Escaping kodieren.","Passwörter mit `password_hash()` / `password_verify()` speichern.","PSR-Standards (PSR-4 Autoloading, PSR-12 Codestil) einhalten.","Statische Analyse (PHPStan) in die CI integrieren."],mistakes:[{title:"SQL per String-Verkettung",wrong:`$sql = "SELECT * FROM nutzer WHERE email = '" . $_GET['email'] . "'";`,right:`$stmt = $pdo->prepare('SELECT * FROM nutzer WHERE email = ?');
$stmt->execute([$_GET['email']]);`,explanation:"Ermöglicht SQL Injection. Prepared Statements trennen Befehl und Daten.",lang:"php"},{title:"Lockerer Vergleich mit `==`",wrong:"if ($token == 0) { /* … */ }",right:"if ($token === '0') { /* … */ }",explanation:"Seit PHP 8 sind String-Zahl-Vergleiche zwar sicherer, `==` bleibt dennoch fehleranfällig. `===` prüft auch den Typ.",lang:"php"}],related:["javascript","python","ruby"],next:["[Laravel](#/tech/laravel)","[SQL Injection verstehen](#/artikel/injection)","[REST-API-Design](#/artikel/rest-api-design)"]}],i=[{id:"python",name:"Python",abbr:"Py",color:"#3776ab",kind:"Programmiersprache",group:"universal",prism:"python",tagline:"Lesbar, vielseitig und die Lingua franca von Data Science und KI.",year:1991,creator:"Guido van Rossum; heute Python Software Foundation",paradigms:["multiparadigmatisch","objektorientiert","imperativ","funktional"],typing:"dynamisch, stark; optionale Type Hints",execution:"CPython kompiliert zu Bytecode und interpretiert ihn; Alternativen: PyPy (JIT)",memory:"Reference Counting + Zyklensammler",extensions:[".py",".pyi",".ipynb"],difficulty:"einsteiger",summary:"Python ist eine universelle Sprache mit Fokus auf **Lesbarkeit**: Einrückung ist Teil der Syntax, der Code liest sich fast wie Pseudocode. Die riesige Standardbibliothek („Batteries included“) und Pakete wie NumPy, pandas, PyTorch, Django und FastAPI machen Python zur ersten Wahl für Automatisierung, Datenanalyse, Machine Learning und Web-Backends.",usedFor:["Data Science und Machine Learning","Web-Backends und APIs (Django, FastAPI, Flask)","Automatisierung und Skripte","Wissenschaftliches Rechnen","DevOps-Werkzeuge, Testautomatisierung","Lehre und Einstieg ins Programmieren"],history:"Guido van Rossum begann 1989 als Hobbyprojekt; Version 0.9 erschien 1991. Der Name bezieht sich auf Monty Python, nicht auf die Schlange. Python 3 (2008) brach bewusst mit Python 2 (u. a. Unicode-Strings standardmäßig) – die Migration dauerte über ein Jahrzehnt, Python 2 ist seit 2020 abgekündigt. Neuere Versionen brachten deutliche Geschwindigkeitsgewinne, `match`-Statements (3.10), bessere Fehlermeldungen und experimentelle Builds ohne Global Interpreter Lock (3.13).",strengths:["Sehr lesbar und schnell zu lernen","Riesiges Ökosystem für Daten, KI, Web, Automatisierung","Interaktives Arbeiten (REPL, Jupyter)","Hervorragend als „Klebstoff“ zwischen Systemen"],weaknesses:["Langsamer als kompilierte Sprachen bei reinem Python-Code","GIL begrenzt Thread-Parallelität (Workarounds: Multiprocessing, native Bibliotheken, Free-Threaded-Builds)","Dynamische Typen → Fehler oft erst zur Laufzeit","Packaging historisch zersplittert (pip, venv, Poetry, uv …)"],setup:{steps:["Python 3 von python.org installieren (Windows: Option „Add python.exe to PATH“ anhaken) oder per Paketmanager. Alternativ verwaltet `uv` Python-Versionen selbst.","Pro Projekt eine virtuelle Umgebung anlegen: `python -m venv .venv` und aktivieren (`source .venv/bin/activate` bzw. `.venv\\Scripts\\activate`).","Pakete installieren: `pip install requests` – oder moderner mit `uv add requests`.","Skript ausführen: `python app.py`."],verify:`python --version
pip --version`,verifyLang:"bash"},tooling:["VS Code (Python-Extension, Pylance)","PyCharm","Jupyter","uv / pip / Poetry","Ruff (Linter + Formatter)","mypy / Pyright","pytest"],hello:"print('Hallo, Welt!')",example:{title:"CSV auswerten: Umsatz pro Kategorie",lang:"python",code:`from collections import defaultdict
from csv import DictReader
from pathlib import Path


def umsatz_pro_kategorie(pfad: Path) -> dict[str, float]:
    """Summiert menge * preis je Kategorie aus einer CSV-Datei."""
    summen: defaultdict[str, float] = defaultdict(float)
    with pfad.open(encoding="utf-8", newline="") as f:
        for zeile in DictReader(f):
            try:
                summen[zeile["kategorie"]] += int(zeile["menge"]) * float(zeile["preis"])
            except (KeyError, ValueError) as e:
                print(f"Überspringe fehlerhafte Zeile {zeile}: {e}")
    return dict(sorted(summen.items(), key=lambda kv: kv[1], reverse=True))


if __name__ == "__main__":
    for kategorie, summe in umsatz_pro_kategorie(Path("verkaeufe.csv")).items():
        print(f"{kategorie:<12} {summe:>10.2f} €")`,explanation:'`pathlib` statt String-Pfaden, `with` schließt die Datei sicher, explizites `encoding`, `defaultdict` spart Existenzprüfungen, Type Hints dokumentieren die Schnittstelle, fehlerhafte Zeilen werden gezielt abgefangen statt das ganze Programm abzubrechen. `if __name__ == "__main__"` erlaubt den Import als Modul ohne Seiteneffekte.'},ecosystem:[{name:"FastAPI",desc:"Moderne, typbasierte API-Entwicklung.",techId:"fastapi"},{name:"Django",desc:"Full-Stack-Web-Framework „mit Batterien“.",techId:"django"},{name:"Flask",desc:"Minimalistisches Web-Framework.",techId:"flask"},{name:"NumPy / pandas",desc:"Numerik und tabellarische Daten.",techId:"pandas"},{name:"PyTorch",desc:"Deep-Learning-Framework.",techId:"pytorch"},{name:"pytest",desc:"De-facto-Standard für Tests.",techId:"pytest"},{name:"uv",desc:"Sehr schneller Paket- und Projektmanager.",techId:"uv"}],bestPractices:["PEP 8 einhalten – automatisiert mit Ruff oder Black.","Pro Projekt eine virtuelle Umgebung; Abhängigkeiten in `pyproject.toml` + Lockfile.","Type Hints an Funktionsschnittstellen und mit mypy/Pyright prüfen.","`with` für Dateien, Locks, Verbindungen (Context Manager).","Keine veränderlichen Default-Argumente (`def f(x=None)` statt `def f(x=[])`).","Spezifische Exceptions fangen, nie nacktes `except:`.","f-Strings für Formatierung, `pathlib` für Pfade."],mistakes:[{title:"Veränderliches Default-Argument",wrong:`def hinzufuegen(x, liste=[]):
    liste.append(x)
    return liste

hinzufuegen(1)  # [1]
hinzufuegen(2)  # [1, 2] – Überraschung!`,right:`def hinzufuegen(x, liste=None):
    if liste is None:
        liste = []
    liste.append(x)
    return liste`,explanation:"Default-Werte werden **einmal** bei der Definition ausgewertet. Die Liste wird daher zwischen allen Aufrufen geteilt.",lang:"python"},{title:"Nacktes `except`",wrong:`try:
    wert = int(eingabe)
except:
    wert = 0`,right:`try:
    wert = int(eingabe)
except ValueError:
    wert = 0`,explanation:"Ein nacktes `except` fängt auch `KeyboardInterrupt`, `SystemExit` und echte Programmierfehler – Bugs werden unsichtbar.",lang:"python"},{title:"Liste beim Iterieren verändern",wrong:`for x in zahlen:
    if x < 0:
        zahlen.remove(x)  # überspringt Elemente`,right:"zahlen = [x for x in zahlen if x >= 0]",explanation:"Das Entfernen verschiebt die Indizes, sodass die Schleife Elemente auslässt. Besser eine neue Liste per List Comprehension erzeugen.",lang:"python"}],advanced:[{title:"Generatoren & Iteratoren",text:"`yield` erzeugt lazy Sequenzen – ideal für große Dateien und Datenströme."},{title:"Decorators",text:"Funktionen, die Funktionen umhüllen: `@functools.cache`, `@app.get(...)`, eigene Logging- oder Retry-Decorators."},{title:"Context Manager",text:"`__enter__`/`__exit__` oder `@contextlib.contextmanager` für sicheres Ressourcen-Management."},{title:"asyncio",text:"Kooperatives Multitasking mit `async def`/`await` für viele gleichzeitige I/O-Operationen."},{title:"Dataclasses & Protocols",text:"`@dataclass` erzeugt Boilerplate automatisch; `typing.Protocol` ermöglicht strukturelle Typisierung („Duck Typing“ mit Typprüfung)."},{title:"GIL & Parallelität",text:"Für CPU-Last `multiprocessing` oder `concurrent.futures.ProcessPoolExecutor`; für I/O Threads oder asyncio."}],interview:[{q:"Was ist der Unterschied zwischen einer Liste und einem Tupel?",a:"Listen sind veränderlich, Tupel unveränderlich. Tupel sind hashbar (wenn ihre Elemente es sind) und können daher als Dict-Schlüssel dienen."},{q:"Was macht `is` im Unterschied zu `==`?",a:"`==` vergleicht Werte (`__eq__`), `is` prüft Identität (dasselbe Objekt). `is` nur für Singletons wie `None` verwenden."},{q:"Was ist der GIL?",a:"Der Global Interpreter Lock in CPython lässt immer nur einen Thread gleichzeitig Python-Bytecode ausführen. Threads helfen daher bei I/O, nicht bei CPU-lastiger Arbeit. Seit 3.13 gibt es experimentelle Builds ohne GIL."},{q:"Was sind `*args` und `**kwargs`?",a:"Sie sammeln beliebig viele Positions- bzw. Schlüsselwortargumente als Tupel bzw. Dict."}],exercises:[{title:"Palindrom-Prüfung",task:"Schreibe `ist_palindrom(s)`, die Groß-/Kleinschreibung, Leerzeichen und Satzzeichen ignoriert.",hint:"Mit `str.isalnum()` filtern und mit dem umgekehrten String `[::-1]` vergleichen.",solution:`def ist_palindrom(s: str) -> bool:
    zeichen = [c.lower() for c in s if c.isalnum()]
    return zeichen == zeichen[::-1]

print(ist_palindrom("Ein Esel lese nie!"))  # True`},{title:"Häufigste Wörter",task:"Gib die drei häufigsten Wörter eines Textes aus.",hint:"`collections.Counter` hat `most_common(n)`.",solution:`import re
from collections import Counter

text = "der hund jagt den ball und der hund bellt"
woerter = re.findall(r"\\w+", text.lower())
print(Counter(woerter).most_common(3))`}],related:["javascript","r","julia","ruby"],next:["[FastAPI-Tutorial](#/artikel/fastapi-tutorial)","[Python im Labor ausführen](#/labor/python)","[Python-Cheatsheet](#/cheatsheets/python)","[Lernpfad Python Developer](#/lernpfade/python-developer)"]},{id:"java",name:"Java",abbr:"Java",color:"#e76f00",kind:"Programmiersprache",group:"universal",prism:"java",tagline:"Robuste, plattformunabhängige Sprache für Enterprise, Backend und Android.",year:1995,creator:"James Gosling (Sun Microsystems); heute Oracle & OpenJDK-Community",paradigms:["objektorientiert","imperativ","funktional (seit Java 8)"],typing:"statisch, stark, nominal",execution:"Kompiliert zu JVM-Bytecode, ausgeführt mit JIT (HotSpot); optional AOT (GraalVM Native Image)",memory:"Garbage Collection (G1, ZGC, Shenandoah …)",extensions:[".java",".jar"],difficulty:"fortgeschritten",summary:"Java kompiliert zu [[Bytecode]], der auf der **Java Virtual Machine (JVM)** läuft – „Write once, run anywhere“. Die Sprache ist statisch typisiert, klassenbasiert objektorientiert und für Stabilität und Abwärtskompatibilität bekannt. Modernes Java (17, 21, 25 LTS) bietet Records, Sealed Classes, Pattern Matching, Text Blocks und virtuelle Threads.",usedFor:["Enterprise-Backends (Banken, Versicherungen, Behörden)","Microservices mit Spring Boot, Quarkus, Micronaut","Big Data (Hadoop, Kafka, Spark-Ökosystem)","Android (historisch; heute oft Kotlin)"],history:"Ein Team um James Gosling bei Sun entwickelte die Sprache ab 1991 (ursprünglich „Oak“) für Unterhaltungselektronik; 1995 erschien Java 1.0. 2009 übernahm Oracle Sun. Seit 2017 erscheint alle sechs Monate eine neue Version, alle zwei Jahre eine LTS-Version. OpenJDK ist die freie Referenzimplementierung (Builds u. a. von Eclipse Temurin, Amazon Corretto, Microsoft).",strengths:["Sehr ausgereiftes Ökosystem und Tooling","Hohe Performance durch JIT und moderne GCs","Strikte Abwärtskompatibilität","Große Arbeitsmarktnachfrage","Virtuelle Threads (Java 21) für hochskalierbare Server"],weaknesses:["Mehr Boilerplate als Kotlin oder Python","Langsamerer Start und höherer Speicherbedarf der JVM (AOT mildert das)","Null-Referenzen ohne Null-Safety im Typsystem"],setup:{steps:["Ein JDK installieren (z. B. Eclipse Temurin 21 oder 25 LTS) – per Installer, Paketmanager oder SDKMAN!.","`JAVA_HOME` setzen bzw. prüfen.","Einzeldateien direkt starten: `java Hallo.java` (seit Java 11).","Projekte mit Maven oder Gradle anlegen, z. B. über start.spring.io."],verify:`java --version
javac --version`,verifyLang:"bash"},tooling:["IntelliJ IDEA","Eclipse","VS Code (Extension Pack for Java)","Maven / Gradle","JUnit 5, Mockito","VisualVM, JDK Flight Recorder"],hello:`public class Hallo {
    public static void main(String[] args) {
        System.out.println("Hallo, Welt!");
    }
}`,example:{title:"Modernes Java: Records, Streams, Pattern Matching",lang:"java",code:`import java.util.*;
import java.util.stream.*;

public class Bestellungen {

    sealed interface Zahlung permits Karte, Rechnung {}
    record Karte(String letzteVier) implements Zahlung {}
    record Rechnung(int zahlungszielTage) implements Zahlung {}

    record Bestellung(String kunde, double betrag, Zahlung zahlung) {}

    static String beschreibe(Zahlung z) {
        return switch (z) {
            case Karte k -> "Karte •••• " + k.letzteVier();
            case Rechnung r -> "Rechnung, " + r.zahlungszielTage() + " Tage";
        };
    }

    public static void main(String[] args) {
        var bestellungen = List.of(
            new Bestellung("Ada", 120.0, new Karte("4242")),
            new Bestellung("Linus", 80.5, new Rechnung(14)),
            new Bestellung("Ada", 42.0, new Rechnung(30)));

        Map<String, Double> summeProKunde = bestellungen.stream()
            .collect(Collectors.groupingBy(Bestellung::kunde,
                     TreeMap::new, Collectors.summingDouble(Bestellung::betrag)));

        summeProKunde.forEach((k, s) -> System.out.printf("%s: %.2f €%n", k, s));
        bestellungen.forEach(b -> System.out.println(beschreibe(b.zahlung())));
    }
}`,explanation:"**Records** sind unveränderliche Datenklassen ohne Boilerplate. Ein **sealed interface** legt alle Varianten fest, sodass das `switch` mit Pattern Matching vollständig geprüft wird (kein `default` nötig). Die Stream-API gruppiert und summiert deklarativ."},ecosystem:[{name:"Spring Boot",desc:"Das dominierende Backend-Framework.",techId:"springboot"},{name:"Maven / Gradle",desc:"Build- und Abhängigkeitsmanagement.",techId:"maven"},{name:"Hibernate / JPA",desc:"ORM-Standard."},{name:"JUnit 5",desc:"Test-Framework.",techId:"junit"},{name:"Quarkus / Micronaut",desc:"Cloud-native Frameworks mit schnellem Start."}],bestPractices:["Aktuelle LTS-Version nutzen (21 oder 25).","Records für Datenträger, `final` und unveränderliche Collections (`List.of`) bevorzugen.","`Optional` als Rückgabetyp für „vielleicht kein Ergebnis“ – nicht für Felder oder Parameter.","Abhängigkeiten per Konstruktor injizieren.","try-with-resources für alles, was `AutoCloseable` ist.","Checked Exceptions nicht verschlucken; gezielt in fachliche Exceptions übersetzen."],mistakes:[{title:"Strings mit `==` vergleichen",wrong:'if (eingabe == "ja") { … }',right:'if ("ja".equals(eingabe)) { … }',explanation:'`==` vergleicht Referenzen, nicht Inhalte. Dass es manchmal „funktioniert“, liegt am String-Pool. Die Schreibweise `"ja".equals(...)` ist zusätzlich null-sicher.',lang:"java"},{title:"Ressourcen nicht schließen",wrong:`BufferedReader r = new BufferedReader(new FileReader(pfad));
String zeile = r.readLine();`,right:`try (var r = Files.newBufferedReader(Path.of(pfad))) {
    String zeile = r.readLine();
}`,explanation:"try-with-resources schließt die Ressource garantiert – auch bei Exceptions.",lang:"java"}],advanced:[{title:"JVM & Garbage Collection",text:"Generationelle Collector, G1 als Standard, ZGC für sehr kurze Pausen. Tuning über Heap-Größe und GC-Wahl."},{title:"Virtuelle Threads",text:"Seit Java 21: Millionen leichtgewichtiger Threads, blockierender Code skaliert wie asynchroner."},{title:"Generics & Type Erasure",text:"Typparameter existieren nur zur Compile-Zeit; `List<String>` und `List<Integer>` sind zur Laufzeit dieselbe Klasse."},{title:"Streams & Collectors",text:"Deklarative Datenverarbeitung, optional parallel – aber Parallel Streams nur nach Messung einsetzen."}],interview:[{q:"Was ist der Vertrag zwischen `equals` und `hashCode`?",a:"Gleiche Objekte (`equals` true) müssen denselben `hashCode` haben. Wer `equals` überschreibt, muss `hashCode` mitüberschreiben, sonst funktionieren HashMap/HashSet falsch. Records erledigen das automatisch."},{q:"Unterschied zwischen Checked und Unchecked Exceptions?",a:"Checked Exceptions (z. B. `IOException`) müssen deklariert oder behandelt werden, Unchecked (`RuntimeException`-Subklassen) nicht."},{q:"Was bedeutet `final` bei Variablen, Methoden und Klassen?",a:"Variable: keine Neuzuweisung. Methode: nicht überschreibbar. Klasse: nicht ableitbar."}],related:["kotlin","csharp","scala"],next:["[Spring Boot](#/tech/springboot)","[Syntax-Vergleich Java ↔ Kotlin](#/vergleich?l=java,kotlin)","[Design Patterns](#/artikel/design-patterns)"]},{id:"csharp",name:"C#",abbr:"C#",color:"#68217a",kind:"Programmiersprache",group:"universal",prism:"csharp",tagline:"Moderne, vielseitige .NET-Sprache für Web, Desktop, Cloud und Spiele.",year:2e3,creator:"Microsoft (Anders Hejlsberg)",paradigms:["objektorientiert","funktional","komponentenorientiert"],typing:"statisch, stark, nominal; Nullable Reference Types",execution:"Kompiliert zu CIL, ausgeführt mit JIT der .NET-Runtime; optional Native AOT",memory:"Garbage Collection (generationell)",extensions:[".cs",".csproj"],difficulty:"fortgeschritten",summary:"C# ist die Hauptsprache der **.NET-Plattform** – plattformübergreifend (Windows, Linux, macOS) und Open Source. Sie kombiniert ein starkes Typsystem mit sehr ausdrucksstarken Features: LINQ, `async/await` (C# hat es populär gemacht), Records, Pattern Matching und Nullable Reference Types. Mit ASP.NET Core zählt C# zu den schnellsten Web-Stacks; mit Unity ist es die verbreitetste Sprache in der Spieleentwicklung.",usedFor:["Web-APIs und Webanwendungen (ASP.NET Core, Blazor)","Spieleentwicklung (Unity)","Desktop-Apps (WPF, WinUI, .NET MAUI, Avalonia)","Cloud-Dienste und Azure Functions","Enterprise-Anwendungen"],history:"C# erschien 2000 mit dem .NET Framework, entworfen von Anders Hejlsberg (zuvor Turbo Pascal und Delphi). 2016 kam das plattformübergreifende, quelloffene .NET Core; seit .NET 5 gibt es eine vereinheitlichte Plattform mit jährlichen Releases (gerade Versionen sind LTS). C# 5 führte `async/await` ein, das später JavaScript, Python, Rust und viele andere übernahmen.",strengths:["Sehr ausgereifte Sprache mit hohem Entwicklungstempo","Exzellentes Tooling (Visual Studio, Rider)","Hohe Performance (ASP.NET Core, Span<T>, Native AOT)","LINQ für elegante Datenabfragen","Ein Ökosystem für Web, Desktop, Mobile, Cloud, Spiele"],weaknesses:["Sprachumfang wächst stark – viele Wege, dasselbe zu tun","Historisch Windows-zentriert (Image wirkt nach)","Einige Desktop-Frameworks nur unter Windows"],setup:{steps:[".NET SDK von dot.net herunterladen (LTS-Version) oder per Paketmanager (winget, Homebrew, apt).","Neues Projekt: `dotnet new console -n Hallo` bzw. `dotnet new webapi`.","Starten: `dotnet run` im Projektordner.","Pakete hinzufügen: `dotnet add package <Name>` (NuGet)."],verify:`dotnet --version
dotnet --list-sdks`,verifyLang:"bash"},tooling:["Visual Studio","JetBrains Rider","VS Code (C# Dev Kit)","dotnet CLI, NuGet","xUnit / NUnit / MSTest"],hello:'Console.WriteLine("Hallo, Welt!");',example:{title:"Minimal API mit Validierung und LINQ",lang:"csharp",code:`var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var produkte = new List<Produkt>
{
    new(1, "Tastatur", 49.90m, "Technik"),
    new(2, "Roman", 14.00m, "Buch"),
    new(3, "Maus", 24.50m, "Technik"),
};

app.MapGet("/produkte", (string? kategorie) =>
    produkte
        .Where(p => kategorie is null || p.Kategorie == kategorie)
        .OrderBy(p => p.Preis));

app.MapGet("/produkte/{id:int}", (int id) =>
    produkte.FirstOrDefault(p => p.Id == id) is { } p
        ? Results.Ok(p)
        : Results.NotFound());

app.Run();

record Produkt(int Id, string Name, decimal Preis, string Kategorie);`,explanation:"Top-Level-Statements und Minimal APIs machen kleine Services sehr knapp. `decimal` ist der richtige Typ für Geldbeträge. LINQ (`Where`, `OrderBy`) filtert deklarativ, das Property-Pattern `is { } p` prüft auf „nicht null“ und bindet die Variable in einem Schritt."},ecosystem:[{name:"ASP.NET Core",desc:"Web-Framework für APIs, MVC, Blazor.",techId:"aspnetcore"},{name:"Entity Framework Core",desc:"ORM von Microsoft."},{name:"Unity",desc:"Spiele-Engine mit C#-Scripting."},{name:".NET MAUI",desc:"Plattformübergreifende App-UI."},{name:"xUnit",desc:"Verbreitetes Test-Framework."}],bestPractices:["Nullable Reference Types aktivieren (`<Nullable>enable</Nullable>`) und Warnungen ernst nehmen.","`async`/`await` durchgängig nutzen – nie `.Result` oder `.Wait()` (Deadlock-Gefahr).","Dependency Injection des Frameworks verwenden.","`decimal` für Geld, `DateTimeOffset` für Zeitpunkte.","`using`-Deklarationen für `IDisposable`.","Records für unveränderliche Datenobjekte."],mistakes:[{title:"Blockieren auf asynchronen Code",wrong:"var daten = client.GetStringAsync(url).Result;",right:"var daten = await client.GetStringAsync(url);",explanation:"`.Result` blockiert den Thread und kann in UI- oder älteren ASP.NET-Kontexten zu Deadlocks führen.",lang:"csharp"},{title:"Neuer `HttpClient` pro Anfrage",wrong:`using var client = new HttpClient();
await client.GetAsync(url);`,right:`// Program.cs
builder.Services.AddHttpClient();
// im Service: IHttpClientFactory injizieren`,explanation:"Kurzlebige `HttpClient`-Instanzen können Sockets erschöpfen. `IHttpClientFactory` verwaltet Verbindungen korrekt.",lang:"csharp"}],advanced:[{title:"LINQ & Expression Trees",text:"Dieselbe Abfrage läuft gegen Listen (IEnumerable) oder wird in SQL übersetzt (IQueryable, EF Core)."},{title:"Span<T> & Memory<T>",text:"Allokationsfreie Arbeit auf Speicherbereichen für High-Performance-Code."},{title:"Source Generators",text:"Code-Generierung zur Compile-Zeit statt Reflection – Grundlage für Native-AOT-Kompatibilität."}],interview:[{q:"Unterschied zwischen `struct` und `class`?",a:"`struct` ist ein Werttyp (wird kopiert, meist auf dem Stack oder inline), `class` ein Referenztyp auf dem Heap."},{q:"Was ist `IEnumerable` vs. `IQueryable`?",a:"`IEnumerable` führt LINQ im Speicher aus, `IQueryable` baut einen Ausdrucksbaum, den ein Provider (z. B. EF Core) in SQL übersetzt."}],related:["java","typescript","kotlin"],next:["[ASP.NET Core](#/tech/aspnetcore)","[Async/Await im Vergleich](#/syntax/async)","[Clean Architecture](#/artikel/architekturstile)"]},{id:"go",name:"Go",abbr:"Go",color:"#00add8",kind:"Programmiersprache",group:"universal",prism:"go",tagline:"Einfach, schnell, nebenläufig – die Sprache der Cloud-Infrastruktur.",year:2009,creator:"Robert Griesemer, Rob Pike, Ken Thompson (Google)",paradigms:["imperativ","nebenläufig (CSP)","strukturell typisiert über Interfaces"],typing:"statisch, stark; Interfaces implizit (strukturell)",execution:"Kompiliert zu nativem Maschinencode (statisch gelinkte Binaries)",memory:"Garbage Collection (nebenläufig, niedrige Latenz)",extensions:[".go"],difficulty:"einsteiger",summary:"Go wurde bei Google entwickelt, um große Server-Software **einfach, schnell kompilierbar und gut wartbar** zu machen. Die Sprache ist bewusst klein: keine Klassen, keine Vererbung, keine Exceptions. Stattdessen Structs, implizite Interfaces, explizite Fehlerwerte und eingebaute Nebenläufigkeit mit [[Goroutine|Goroutinen]] und Channels. Docker, Kubernetes, Terraform und Prometheus sind in Go geschrieben.",usedFor:["Cloud-native Infrastruktur (Kubernetes, Docker, Terraform)","Microservices und APIs","CLI-Werkzeuge (einzelne Binary, plattformübergreifend)","Netzwerkdienste und Proxies"],history:"Griesemer, Pike und Thompson (Mitentwickler von Unix und C) begannen 2007 – frustriert von langen C++-Kompilierzeiten. Open Source seit 2009, Version 1.0 mit Kompatibilitätsversprechen 2012. Generics kamen nach langer Diskussion erst mit Go 1.18 (2022).",strengths:["Sehr schnelle Kompilierung, eine statische Binary ohne Abhängigkeiten","Nebenläufigkeit als Sprachfeature","Kleine, leicht erlernbare Sprache; einheitlicher Stil durch `gofmt`","Starke Standardbibliothek (HTTP-Server, JSON, Kryptografie)"],weaknesses:["Wiederholtes `if err != nil` wirkt geschwätzig","Weniger Ausdrucksmittel (bewusst): kein Pattern Matching, keine Enums im engeren Sinn","Generics noch vergleichsweise eingeschränkt"],setup:{steps:["Go von go.dev/dl installieren.","Projekt anlegen: `mkdir hallo && cd hallo && go mod init example.com/hallo`.","Datei `main.go` schreiben, starten mit `go run .`.","Binary bauen: `go build` (Cross-Compile z. B. mit `GOOS=linux GOARCH=arm64 go build`)."],verify:"go version",verifyLang:"bash"},tooling:["VS Code (Go-Extension, gopls)","GoLand","go fmt / go vet","golangci-lint","go test (eingebaut)","Delve (Debugger)"],hello:`package main

import "fmt"

func main() {
	fmt.Println("Hallo, Welt!")
}`,example:{title:"Parallele HTTP-Checks mit Goroutinen",lang:"go",code:`package main

import (
	"context"
	"fmt"
	"net/http"
	"sync"
	"time"
)

type Ergebnis struct {
	URL    string
	Status int
	Err    error
}

func pruefe(ctx context.Context, url string) Ergebnis {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return Ergebnis{URL: url, Err: err}
	}
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return Ergebnis{URL: url, Err: err}
	}
	defer res.Body.Close()
	return Ergebnis{URL: url, Status: res.StatusCode}
}

func main() {
	urls := []string{"https://go.dev", "https://example.com", "https://gibt-es-nicht.invalid"}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var wg sync.WaitGroup
	ergebnisse := make(chan Ergebnis, len(urls))
	for _, u := range urls {
		wg.Add(1)
		go func() {
			defer wg.Done()
			ergebnisse <- pruefe(ctx, u)
		}()
	}
	wg.Wait()
	close(ergebnisse)

	for e := range ergebnisse {
		if e.Err != nil {
			fmt.Printf("✗ %s: %v\\n", e.URL, e.Err)
			continue
		}
		fmt.Printf("✓ %s: %d\\n", e.URL, e.Status)
	}
}`,explanation:"Jede URL wird in einer eigenen Goroutine geprüft; ein gepufferter Channel sammelt die Ergebnisse, eine `WaitGroup` wartet auf alle. `context.WithTimeout` bricht hängende Anfragen ab, `defer` schließt Bodies zuverlässig. Seit Go 1.22 erhält jede Schleifeniteration eine eigene Variable `u` – die klassische Closure-Falle ist damit behoben."},ecosystem:[{name:"net/http",desc:"Produktionsreifer HTTP-Server in der Standardbibliothek (mit Routing-Mustern seit 1.22)."},{name:"Gin / Echo / Chi",desc:"Beliebte Web-Frameworks bzw. Router."},{name:"Cobra",desc:"Framework für CLI-Tools (nutzen kubectl, Hugo …)."},{name:"Kubernetes, Docker, Terraform",desc:"Prominente in Go geschriebene Projekte.",techId:"kubernetes"}],bestPractices:['Fehler immer prüfen und mit Kontext versehen: `fmt.Errorf("lade config: %w", err)`.',"`context.Context` als ersten Parameter für alles, was abbrechbar sein soll.","Kleine Interfaces beim Verbraucher definieren („Accept interfaces, return structs“).","Goroutinen nie „verwaisen“ lassen – Lebensdauer über Context steuern.","`go vet`, `gofmt` und den Race Detector (`go test -race`) nutzen."],mistakes:[{title:"Fehler ignorieren",wrong:'daten, _ := os.ReadFile("config.json")',right:`daten, err := os.ReadFile("config.json")
if err != nil {
	return fmt.Errorf("config lesen: %w", err)
}`,explanation:"Der Blank Identifier `_` verwirft den Fehler stillschweigend – das Programm arbeitet dann mit leeren Daten weiter.",lang:"go"},{title:"Data Race auf geteilter Map",wrong:`zaehler := map[string]int{}
for _, w := range woerter {
	go func() { zaehler[w]++ }()
}`,right:`var mu sync.Mutex
zaehler := map[string]int{}
for _, w := range woerter {
	go func() {
		mu.Lock()
		zaehler[w]++
		mu.Unlock()
	}()
}`,explanation:"Maps sind nicht threadsicher; gleichzeitige Schreibzugriffe führen zum Absturz („concurrent map writes“). Mutex oder Channels verwenden – und auf alle Goroutinen warten.",lang:"go"}],advanced:[{title:"Channels & select",text:"`select` wartet auf mehrere Channels gleichzeitig – Grundlage für Timeouts, Fan-in/Fan-out und Worker-Pools."},{title:"Interfaces & Embedding",text:"Implizite Erfüllung von Interfaces und Struct-Embedding ersetzen Vererbung."},{title:"Generics",text:"Typparameter mit Constraints wie `[T cmp.Ordered]` für generische Datenstrukturen."},{title:"Profiling",text:"`pprof` ist eingebaut: CPU-, Speicher- und Goroutine-Profile direkt aus laufenden Services."}],interview:[{q:"Was ist der Unterschied zwischen gepufferten und ungepufferten Channels?",a:"Ungepufferte Channels synchronisieren Sender und Empfänger (Übergabe nur, wenn beide bereit sind). Gepufferte Channels erlauben bis zur Kapazität Senden ohne wartenden Empfänger."},{q:"Wie implementiert ein Typ ein Interface?",a:"Implizit: Er muss nur alle Methoden des Interfaces besitzen – kein `implements`-Schlüsselwort."}],related:["rust","c","python"],next:["[Go vs. Rust vergleichen](#/vergleich?l=go,rust)","[Docker-Grundlagen](#/artikel/docker-grundlagen)","[Nebenläufigkeit im Syntax-Vergleich](#/syntax/futures)"]}],a=[{id:"rust",name:"Rust",abbr:"Rs",color:"#ce412b",kind:"Programmiersprache",group:"system",prism:"rust",tagline:"Speichersicher ohne Garbage Collector – Systemprogrammierung ohne Angst.",year:2015,creator:"Graydon Hoare (ab 2006), Mozilla; heute Rust Foundation",paradigms:["multiparadigmatisch","funktional","imperativ","nebenläufig"],typing:"statisch, stark, mit Typinferenz",execution:"Kompiliert zu nativem Maschinencode (LLVM)",memory:"Ownership & Borrowing (zur Compile-Zeit geprüft), kein GC",extensions:[".rs"],difficulty:"profi",summary:"Rust verbindet die Performance und Kontrolle von C/C++ mit **Speichersicherheit**: Das [[Ownership]]-System und der Borrow Checker verhindern Use-after-free, Data Races und Null-Pointer-Fehler bereits beim Kompilieren – ganz ohne [[Garbage Collection]]. Dazu kommen algebraische Datentypen (`enum`), Pattern Matching, Traits und mit Cargo eines der besten Build- und Paketsysteme überhaupt.",usedFor:["Systemsoftware, Betriebssystemkomponenten (Linux-Kernel-Treiber, Windows)","Performance-kritische Backends und Netzwerkdienste","CLI-Tools (ripgrep, fd, uv, Ruff)","WebAssembly","Embedded-Systeme","Blockchain-Infrastruktur"],history:"Graydon Hoare begann Rust 2006 als Privatprojekt, Mozilla sponserte es ab 2009 (u. a. für die Browser-Engine Servo). Version 1.0 erschien 2015 mit Stabilitätsgarantie. Seit 2021 betreut die Rust Foundation die Sprache. Rust wurde jahrelang in Umfragen zur „beliebtesten Sprache“ gewählt; seit 2022 ist es neben C im Linux-Kernel zugelassen.",strengths:["Speicher- und Thread-Sicherheit zur Compile-Zeit","Performance auf C/C++-Niveau, vorhersagbar ohne GC-Pausen","Ausdrucksstarkes Typsystem (`Option`, `Result`, `enum`, Traits)","Cargo, crates.io, rustfmt, Clippy – exzellentes Tooling","Sehr hilfreiche Compiler-Fehlermeldungen"],weaknesses:["Steile Lernkurve (Ownership, Lifetimes)","Längere Kompilierzeiten","Manche Muster (Graphen, Self-Referenzen) sind umständlich","Async-Ökosystem komplex"],setup:{steps:["rustup von rustup.rs installieren (verwaltet Toolchains).","Neues Projekt: `cargo new hallo && cd hallo`.","Starten: `cargo run`, Release-Build: `cargo build --release`.","Abhängigkeit hinzufügen: `cargo add serde`."],verify:`rustc --version
cargo --version`,verifyLang:"bash"},tooling:["VS Code + rust-analyzer","RustRover","Cargo","Clippy (Linter)","rustfmt","cargo test"],hello:`fn main() {
    println!("Hallo, Welt!");
}`,example:{title:"Fehlerbehandlung mit Result und dem ?-Operator",lang:"rust",code:`use std::collections::HashMap;
use std::fs;
use std::num::ParseIntError;

#[derive(Debug)]
enum ImportFehler {
    Datei(std::io::Error),
    Format { zeile: usize, quelle: ParseIntError },
}

impl From<std::io::Error> for ImportFehler {
    fn from(e: std::io::Error) -> Self { ImportFehler::Datei(e) }
}

/// Liest Zeilen der Form "name;punkte" und summiert pro Name.
fn lade_punkte(pfad: &str) -> Result<HashMap<String, u32>, ImportFehler> {
    let inhalt = fs::read_to_string(pfad)?; // ? wandelt io::Error per From um
    let mut summen = HashMap::new();
    for (nr, zeile) in inhalt.lines().enumerate() {
        let Some((name, punkte)) = zeile.split_once(';') else { continue };
        let punkte: u32 = punkte
            .trim()
            .parse()
            .map_err(|quelle| ImportFehler::Format { zeile: nr + 1, quelle })?;
        *summen.entry(name.to_string()).or_insert(0) += punkte;
    }
    Ok(summen)
}

fn main() {
    match lade_punkte("punkte.csv") {
        Ok(summen) => {
            for (name, p) in &summen {
                println!("{name}: {p}");
            }
        }
        Err(e) => eprintln!("Import fehlgeschlagen: {e:?}"),
    }
}`,explanation:"Fehler sind Werte: `Result<T, E>` zwingt den Aufrufer, Erfolg und Fehler zu behandeln. Der `?`-Operator gibt Fehler früh zurück und konvertiert sie über `From`. `let … else` und `split_once` machen das Parsen kompakt, `entry().or_insert()` vermeidet doppelte Hash-Lookups."},ecosystem:[{name:"Tokio",desc:"Asynchrone Runtime für Netzwerkdienste."},{name:"Serde",desc:"Serialisierung (JSON, YAML, TOML …)."},{name:"Axum / Actix Web",desc:"Web-Frameworks."},{name:"Clap",desc:"Kommandozeilen-Parser."},{name:"Tauri",desc:"Desktop-Apps mit Web-Frontend."}],bestPractices:["Clippy-Warnungen beheben – sie sind fast immer berechtigt.","`unwrap()`/`expect()` nur in Tests oder bei echten Invarianten; sonst `?` und eigene Fehlertypen (thiserror/anyhow).","Borrowen (`&T`) statt klonen, wo möglich – aber `clone()` ist besser als unlesbarer Lifetime-Code.","Typen nutzen, um ungültige Zustände unrepräsentierbar zu machen.","`unsafe` minimieren, kapseln und dokumentieren."],mistakes:[{title:"Wert nach dem Verschieben benutzen",wrong:`let s = String::from("hallo");
let t = s;
println!("{s}"); // error[E0382]: borrow of moved value`,right:`let s = String::from("hallo");
let t = &s;          // ausleihen statt verschieben
println!("{s} {t}");`,explanation:"Zuweisung verschiebt die Ownership. Danach ist `s` ungültig. Mit einer Referenz (`&s`) oder `s.clone()` bleibt `s` nutzbar.",lang:"rust"},{title:"`unwrap()` überall",wrong:'let zahl: i32 = eingabe.parse().unwrap(); // Panic bei "abc"',right:`let zahl: i32 = match eingabe.parse() {
    Ok(z) => z,
    Err(_) => return Err("Keine Zahl".into()),
};`,explanation:"`unwrap()` bricht das Programm bei Fehlern ab (Panic). Fehler sollten bewusst behandelt oder weitergereicht werden.",lang:"rust"}],advanced:[{title:"Lifetimes",text:"Annotationen wie `'a` beschreiben, wie lange Referenzen gültig sein müssen; meist inferiert der Compiler sie."},{title:"Traits & Generics",text:"Statischer Dispatch via Monomorphisierung (`impl Trait`, `T: Trait`) oder dynamisch via `dyn Trait`."},{title:"Smart Pointer",text:"`Box<T>` (Heap), `Rc<T>`/`Arc<T>` (geteilte Ownership), `RefCell<T>`/`Mutex<T>` (innere Veränderlichkeit)."},{title:"Fearless Concurrency",text:"Die Traits `Send` und `Sync` sorgen dafür, dass Data Races nicht kompilieren."}],interview:[{q:"Was sind die Borrowing-Regeln?",a:"Zu jedem Zeitpunkt entweder beliebig viele unveränderliche Referenzen (`&T`) oder genau eine veränderliche (`&mut T`), und Referenzen dürfen ihren Besitzer nicht überleben."},{q:"Unterschied `String` vs. `&str`?",a:"`String` ist ein besitzender, wachsender UTF-8-Puffer auf dem Heap; `&str` ist eine geliehene Sicht (Slice) auf UTF-8-Daten."}],related:["cpp","c","go"],next:["[Ownership im Lexikon](#/lexikon/ownership)","[Rust vs. Go](#/vergleich?l=rust,go)","[Speicherverwaltung verstehen](#/artikel/compiler-interpreter-runtime)"]},{id:"c",name:"C",abbr:"C",color:"#5c6bc0",kind:"Programmiersprache",group:"system",prism:"c",tagline:"Die Mutter vieler Sprachen – nah an der Hardware, minimal und überall.",year:1972,creator:"Dennis Ritchie (Bell Labs)",paradigms:["imperativ","prozedural"],typing:"statisch, schwach",execution:"Kompiliert zu nativem Maschinencode",memory:"Manuell (`malloc`/`free`)",extensions:[".c",".h"],difficulty:"fortgeschritten",summary:"C ist eine kleine, sehr effiziente Sprache, die direkt auf Speicheradressen arbeitet ([[Pointer]]). Betriebssysteme (Linux, Teile von Windows und macOS), Datenbanken (SQLite, PostgreSQL), Interpreter (CPython) und unzählige Embedded-Systeme sind in C geschrieben. C lehrt, wie Computer wirklich funktionieren – verlangt aber höchste Sorgfalt, weil Speicherfehler nicht automatisch verhindert werden.",usedFor:["Betriebssysteme und Treiber","Embedded-Systeme und Mikrocontroller","Laufzeitumgebungen und Interpreter","Hochperformante Bibliotheken mit Bindings für andere Sprachen"],history:"Dennis Ritchie entwickelte C 1972 bei Bell Labs, um Unix portabel neu zu schreiben. „The C Programming Language“ (Kernighan & Ritchie, 1978) prägte Generationen. Standards: C89/C90, C99, C11, C17, C23.",strengths:["Maximale Kontrolle und Performance","Läuft auf praktisch jeder Hardware","Stabile ABI – Lingua franca für Bibliotheks-Schnittstellen","Kleiner Sprachumfang"],weaknesses:["Keine Speichersicherheit: Buffer Overflows, Use-after-free, Speicherlecks","Undefiniertes Verhalten an vielen Stellen","Wenig Abstraktionen (keine Generics, Klassen, Namespaces)","Kein Standard-Paketmanager"],setup:{steps:["Compiler installieren: Linux `sudo apt install build-essential`, macOS `xcode-select --install`, Windows MSYS2 (gcc) oder Visual Studio (MSVC).","Kompilieren: `gcc -Wall -Wextra -g hallo.c -o hallo`.","Ausführen: `./hallo`.","Für Projekte: Make oder CMake."],verify:"gcc --version",verifyLang:"bash"},tooling:["GCC, Clang, MSVC","GDB / LLDB","Valgrind, AddressSanitizer","Make, CMake","clang-format, clang-tidy"],hello:`#include <stdio.h>

int main(void) {
    printf("Hallo, Welt!\\n");
    return 0;
}`,example:{title:"Dynamisches Array mit sauberer Speicherverwaltung",lang:"c",code:`#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *daten;
    size_t laenge;
    size_t kapazitaet;
} IntListe;

int liste_anhaengen(IntListe *l, int wert) {
    if (l->laenge == l->kapazitaet) {
        size_t neu = l->kapazitaet ? l->kapazitaet * 2 : 4;
        int *p = realloc(l->daten, neu * sizeof *p);
        if (p == NULL) return -1;          /* alter Speicher bleibt gültig */
        l->daten = p;
        l->kapazitaet = neu;
    }
    l->daten[l->laenge++] = wert;
    return 0;
}

int main(void) {
    IntListe l = {0};
    for (int i = 1; i <= 10; i++) {
        if (liste_anhaengen(&l, i * i) != 0) {
            fprintf(stderr, "Kein Speicher\\n");
            free(l.daten);
            return 1;
        }
    }
    for (size_t i = 0; i < l.laenge; i++) printf("%d ", l.daten[i]);
    printf("\\n");
    free(l.daten);   /* jeder malloc/realloc braucht genau ein free */
    return 0;
}`,explanation:"So funktionieren dynamische Arrays wie Pythons `list` intern: Kapazität verdoppeln (amortisiert O(1) beim Anhängen). `realloc` kann scheitern – deshalb das Ergebnis erst einer temporären Variable zuweisen, sonst geht der alte Zeiger verloren (Speicherleck)."},ecosystem:[{name:"glibc / musl",desc:"C-Standardbibliotheken unter Linux."},{name:"SQLite",desc:"Eingebettete Datenbank, in C geschrieben.",techId:"sqlite"},{name:"CMake",desc:"Verbreitetes Build-System."}],bestPractices:["Immer mit Warnungen kompilieren (`-Wall -Wextra -Werror`) und Sanitizer (`-fsanitize=address,undefined`) in Tests nutzen.","Längen immer mitführen; sichere Varianten wie `snprintf` statt `sprintf`.","Rückgabewerte von `malloc`, `fopen` usw. prüfen.","Jeder Allokation genau eine Freigabe zuordnen – klare Besitzverhältnisse dokumentieren.","Zeiger nach `free` auf `NULL` setzen."],mistakes:[{title:"Buffer Overflow mit `strcpy`",wrong:`char name[8];
strcpy(name, eingabe); // schreibt über das Array hinaus`,right:`char name[8];
snprintf(name, sizeof name, "%s", eingabe); // kürzt sicher`,explanation:"`strcpy` prüft keine Längen. Überlange Eingaben überschreiben benachbarten Speicher – eine klassische Sicherheitslücke.",lang:"c"}],interview:[{q:"Was ist undefiniertes Verhalten?",a:"Situationen, für die der Standard keine Vorgaben macht (z. B. Zugriff außerhalb von Array-Grenzen, Signed-Integer-Überlauf). Der Compiler darf annehmen, dass sie nie auftreten – das Ergebnis ist unvorhersehbar."}],related:["cpp","rust","assembly"],next:["[Pointer verstehen](#/lexikon/pointer)","[Wie Computer funktionieren](#/artikel/wie-computer-funktionieren)","[C++](#/sprachen/cpp)"]},{id:"cpp",name:"C++",abbr:"C++",color:"#00599c",kind:"Programmiersprache",group:"system",prism:"cpp",tagline:"Zero-Cost-Abstraktionen für Spiele, Engines und Hochleistungssoftware.",year:1985,creator:"Bjarne Stroustrup (Bell Labs)",paradigms:["multiparadigmatisch","objektorientiert","generisch","prozedural"],typing:"statisch, stark (mit C-kompatiblen Ausnahmen)",execution:"Kompiliert zu nativem Maschinencode",memory:"Manuell bzw. RAII mit Smart Pointern",extensions:[".cpp",".hpp",".cc",".h"],difficulty:"profi",summary:"C++ erweitert C um Klassen, Templates, Ausnahmen und eine umfangreiche Standardbibliothek (Container, Algorithmen). Das Leitprinzip: **Zero-Cost-Abstraktionen** – was man nicht nutzt, kostet nichts. Modernes C++ (ab C++11, aktuell C++20/23) setzt auf **RAII**, Smart Pointer und Move-Semantik statt manuellem `new`/`delete`.",usedFor:["Spiele und Game-Engines (Unreal Engine)","Browser (Chromium), Datenbanken, Compiler (LLVM)","Hochfrequenzhandel, Simulationen","Embedded und Automotive","Grafik-, Audio-, Videosoftware"],history:"Bjarne Stroustrup begann 1979 mit „C with Classes“; 1985 erschien C++. Nach C++98 und C++03 brachte C++11 eine Revolution (auto, Lambdas, Move-Semantik, Smart Pointer). Seitdem gibt es alle drei Jahre einen Standard; C++20 brachte Concepts, Ranges, Coroutines und Module.",strengths:["Maximale Performance mit hohen Abstraktionen","Riesige Codebasen und Bibliotheken","Feinste Kontrolle über Speicher und Layout","Templates ermöglichen generische, effiziente Bibliotheken"],weaknesses:["Sehr komplex, viele historische Altlasten","Speichersicherheit nicht garantiert","Lange Kompilierzeiten, kryptische Template-Fehler","Kein einheitlicher Paketmanager (vcpkg, Conan)"],setup:{steps:["Compiler installieren (g++/clang++ oder Visual Studio mit „Desktopentwicklung mit C++“).","Kompilieren: `g++ -std=c++20 -Wall -Wextra main.cpp -o main`.","Projekte mit CMake strukturieren, Abhängigkeiten mit vcpkg oder Conan."],verify:`g++ --version
cmake --version`,verifyLang:"bash"},tooling:["Visual Studio, CLion, VS Code (clangd)","CMake, Ninja","vcpkg, Conan","GoogleTest, Catch2","Sanitizer, Valgrind"],hello:`#include <iostream>

int main() {
    std::cout << "Hallo, Welt!\\n";
}`,example:{title:"RAII, Smart Pointer und STL-Algorithmen",lang:"cpp",code:`#include <algorithm>
#include <iostream>
#include <memory>
#include <string>
#include <vector>

struct Form {
    virtual ~Form() = default;
    virtual double flaeche() const = 0;
    virtual std::string name() const = 0;
};

struct Kreis : Form {
    double r;
    explicit Kreis(double r) : r(r) {}
    double flaeche() const override { return 3.14159265 * r * r; }
    std::string name() const override { return "Kreis"; }
};

struct Rechteck : Form {
    double b, h;
    Rechteck(double b, double h) : b(b), h(h) {}
    double flaeche() const override { return b * h; }
    std::string name() const override { return "Rechteck"; }
};

int main() {
    std::vector<std::unique_ptr<Form>> formen;
    formen.push_back(std::make_unique<Kreis>(1.5));
    formen.push_back(std::make_unique<Rechteck>(2, 3));

    std::ranges::sort(formen, {}, [](const auto& f) { return f->flaeche(); });

    for (const auto& f : formen)
        std::cout << f->name() << ": " << f->flaeche() << '\\n';
}   // unique_ptr gibt den Speicher automatisch frei (RAII)`,explanation:"`std::unique_ptr` besitzt das Objekt exklusiv und gibt es beim Verlassen des Gültigkeitsbereichs frei – kein manuelles `delete`. Ein virtueller Destruktor ist Pflicht bei polymorphen Basisklassen. `std::ranges::sort` mit Projektion sortiert nach Fläche (C++20)."},ecosystem:[{name:"Standardbibliothek (STL)",desc:"Container, Algorithmen, Smart Pointer, Threads."},{name:"Boost",desc:"Umfangreiche, peer-reviewte Bibliotheken."},{name:"Qt",desc:"Plattformübergreifendes GUI-Framework."},{name:"Unreal Engine",desc:"Game-Engine."}],bestPractices:["Kein rohes `new`/`delete` – `std::make_unique`/`make_shared` und Container verwenden.","RAII für jede Ressource (Dateien, Locks, Sockets).","Rule of Zero: Klassen so entwerfen, dass keine eigenen Kopier-/Move-Operationen nötig sind.","`const` überall, wo möglich; Referenzen statt Zeiger, wenn nie null.","C++ Core Guidelines folgen; Sanitizer und clang-tidy nutzen."],mistakes:[{title:"Rohes `new` ohne `delete`",wrong:`void f() {
    auto* p = new Puffer(1024);
    verarbeite(*p);   // wirft evtl. → Speicherleck
    delete p;
}`,right:`void f() {
    auto p = std::make_unique<Puffer>(1024);
    verarbeite(*p);   // Freigabe garantiert
}`,explanation:"Wirft `verarbeite` eine Exception, wird `delete` nie erreicht. Smart Pointer räumen in jedem Fall auf.",lang:"cpp"}],interview:[{q:"Was ist RAII?",a:"„Resource Acquisition Is Initialization“: Ressourcen werden im Konstruktor erworben und im Destruktor freigegeben. Da Destruktoren beim Verlassen des Scopes garantiert laufen, sind Ressourcen auch bei Exceptions sicher."},{q:"Was bewirkt Move-Semantik?",a:"Statt teuer zu kopieren, „stiehlt“ ein Objekt die Ressourcen eines temporären Objekts (Rvalue). Ermöglicht effizientes Zurückgeben großer Objekte."}],related:["c","rust","csharp"],next:["[C++ vs. Rust](#/vergleich?l=cpp,rust)","[Design Patterns](#/artikel/design-patterns)"]},{id:"kotlin",name:"Kotlin",abbr:"Kt",color:"#7f52ff",kind:"Programmiersprache",group:"universal",prism:"kotlin",tagline:"Moderne, null-sichere JVM-Sprache – erste Wahl für Android.",year:2011,creator:"JetBrains (Andrey Breslav u. a.)",paradigms:["objektorientiert","funktional"],typing:"statisch, stark, Null-Safety im Typsystem",execution:"JVM-Bytecode; außerdem Kotlin/Native und Kotlin/JS bzw. Wasm",memory:"Garbage Collection (JVM)",extensions:[".kt",".kts"],difficulty:"fortgeschritten",summary:"Kotlin ist eine präzise, pragmatische Sprache von JetBrains, die vollständig mit Java interoperiert. Sie bringt [[Null-Safety]] ins Typsystem, Data Classes, Extension Functions, Coroutines und ausdrucksstarke Collections. Google erklärte Kotlin 2019 zur bevorzugten Sprache für Android; auf dem Server läuft sie mit Spring Boot oder Ktor, und Kotlin Multiplatform teilt Logik zwischen Android, iOS, Desktop und Web.",usedFor:["Android-Apps (Jetpack Compose)","Backends mit Spring Boot oder Ktor","Kotlin Multiplatform (geteilte Logik für Mobile/Desktop)","Build-Skripte (Gradle Kotlin DSL)"],history:"2011 angekündigt, 1.0 im Jahr 2016. Seit 2017 offiziell für Android unterstützt, seit 2019 „Kotlin first“. Kotlin 2.0 (2024) brachte den neuen K2-Compiler.",strengths:["Null-Safety verhindert viele Laufzeitfehler","Deutlich weniger Boilerplate als Java","100 % Java-Interoperabilität","Coroutines für lesbaren asynchronen Code"],weaknesses:["Kompilierzeiten länger als bei Java","Mehrere Wege für dasselbe (Scope-Funktionen) können Code uneinheitlich machen","Kleineres Ökosystem außerhalb von Android/JVM"],setup:{steps:["IntelliJ IDEA oder Android Studio installieren (Kotlin integriert).","Alternativ Kommandozeilen-Compiler via SDKMAN! (`sdk install kotlin`).","Projekte mit Gradle anlegen (Kotlin DSL)."],verify:"kotlin -version",verifyLang:"bash"},tooling:["IntelliJ IDEA, Android Studio","Gradle (Kotlin DSL)","ktlint, detekt","kotlin.test, JUnit, Kotest"],hello:`fun main() {
    println("Hallo, Welt!")
}`,example:{title:"Data Classes, Sealed Interfaces und Null-Safety",lang:"kotlin",code:`data class Nutzer(val name: String, val email: String?, val alter: Int)

sealed interface Ergebnis {
    data class Erfolg(val nutzer: List<Nutzer>) : Ergebnis
    data class Fehler(val grund: String) : Ergebnis
}

fun filtereVolljaehrige(nutzer: List<Nutzer>): Ergebnis =
    if (nutzer.isEmpty()) Ergebnis.Fehler("Keine Nutzer")
    else Ergebnis.Erfolg(nutzer.filter { it.alter >= 18 }.sortedBy { it.name })

fun main() {
    val liste = listOf(
        Nutzer("Ada", "ada@example.org", 36),
        Nutzer("Tim", null, 15),
        Nutzer("Grace", "grace@example.org", 45),
    )
    when (val r = filtereVolljaehrige(liste)) {
        is Ergebnis.Erfolg -> r.nutzer.forEach {
            println("\${it.name}: \${it.email?.lowercase() ?: "keine E-Mail"}")
        }
        is Ergebnis.Fehler -> println("Fehler: \${r.grund}")
    }
}`,explanation:"`String?` erlaubt null, `?.` und `?:` (Elvis) behandeln den Fall elegant. `data class` erzeugt `equals`, `hashCode`, `toString` und `copy`. `when` über ein sealed Interface ist vollständig – fehlt ein Fall, meldet der Compiler einen Fehler. `it` ist der implizite Lambda-Parameter."},ecosystem:[{name:"Jetpack Compose",desc:"Deklaratives Android-UI."},{name:"Ktor",desc:"Asynchrones Web-Framework von JetBrains."},{name:"Spring Boot",desc:"Unterstützt Kotlin offiziell.",techId:"springboot"},{name:"kotlinx.coroutines",desc:"Coroutines-Bibliothek."}],bestPractices:["`val` statt `var` bevorzugen.","Den `!!`-Operator vermeiden – er wirft bei null eine Exception.","Sealed Classes/Interfaces für Zustände und Ergebnisse.","Structured Concurrency: Coroutines immer in einem Scope starten."],mistakes:[{title:"`!!` als Abkürzung",wrong:"val laenge = name!!.length",right:"val laenge = name?.length ?: 0",explanation:"`!!` hebelt die Null-Safety aus und wirft eine NullPointerException – genau das, was Kotlin verhindern soll.",lang:"kotlin"}],related:["java","swift","scala"],next:["[Java ↔ Kotlin vergleichen](#/vergleich?l=java,kotlin)","[Null-Safety im Vergleich](#/syntax/null)"]},{id:"swift",name:"Swift",abbr:"Sw",color:"#f05138",kind:"Programmiersprache",group:"universal",prism:"swift",tagline:"Apples moderne Sprache für iOS, macOS und mehr.",year:2014,creator:"Apple (Chris Lattner u. a.)",paradigms:["protokollorientiert","objektorientiert","funktional"],typing:"statisch, stark, Optionals",execution:"Kompiliert zu nativem Code (LLVM)",memory:"ARC (Automatic Reference Counting)",extensions:[".swift"],difficulty:"fortgeschritten",summary:"Swift ersetzt Objective-C als Hauptsprache für Apple-Plattformen. Sie ist sicher (Optionals, keine impliziten Typumwandlungen), schnell (nativ kompiliert) und modern (Protokolle mit Default-Implementierungen, Enums mit Werten, `async/await`, Actors). Mit SwiftUI entstehen Oberflächen deklarativ. Swift ist Open Source und läuft auch unter Linux und Windows.",usedFor:["iOS-, iPadOS-, macOS-, watchOS-, visionOS-Apps","Server-Swift (Vapor)","Kommandozeilen-Tools"],history:"Apple stellte Swift 2014 vor, Open Source seit 2015. Swift 5 (2019) brachte ABI-Stabilität, Swift 5.5 `async/await` und Actors, Swift 6 strikte Concurrency-Prüfung gegen Data Races.",strengths:["Sicher durch Optionals und starkes Typsystem","Hohe Performance","SwiftUI und hervorragende Apple-Integration","Gut lesbare Syntax"],weaknesses:["Stark an das Apple-Ökosystem gebunden","Xcode nur auf macOS","Schnelle Sprachentwicklung erforderte Migrationen"],setup:{steps:["macOS: Xcode aus dem App Store installieren.","Linux/Windows: Toolchain von swift.org.","Paket anlegen: `swift package init --type executable`, starten mit `swift run`."],verify:"swift --version",verifyLang:"bash"},tooling:["Xcode","Swift Package Manager","VS Code + Swift-Extension","XCTest / Swift Testing"],hello:'print("Hallo, Welt!")',ecosystem:[{name:"SwiftUI",desc:"Deklaratives UI-Framework."},{name:"Vapor",desc:"Server-Framework."},{name:"Swift Package Manager",desc:"Paket- und Build-System."}],bestPractices:["Optionals mit `if let`/`guard let` entpacken statt mit `!`.","`struct` (Werttyp) vor `class` bevorzugen.","Protokolle für Abstraktion nutzen.","Strikte Concurrency-Prüfungen aktivieren."],mistakes:[{title:"Force-Unwrap",wrong:"let zahl = Int(eingabe)!",right:`guard let zahl = Int(eingabe) else {
    print("Keine Zahl")
    return
}`,explanation:"`!` stürzt ab, wenn der Wert `nil` ist. `guard let` behandelt den Fall sauber.",lang:"swift"}],related:["kotlin","rust","dart"],next:["[Null-Safety im Vergleich](#/syntax/null)","[Swift vs. Kotlin](#/vergleich?l=swift,kotlin)"]},{id:"ruby",name:"Ruby",abbr:"Rb",color:"#cc342d",kind:"Programmiersprache",group:"universal",prism:"ruby",tagline:"Für Entwicklerglück optimiert – und Heimat von Ruby on Rails.",year:1995,creator:"Yukihiro „Matz“ Matsumoto",paradigms:["objektorientiert (alles ist ein Objekt)","funktional","imperativ"],typing:"dynamisch, stark (Duck Typing)",execution:"Interpretiert (YARV-VM), optional JIT (YJIT)",memory:"Garbage Collection",extensions:[".rb"],difficulty:"einsteiger",summary:"Ruby ist eine elegante, durchgehend objektorientierte Skriptsprache – selbst Zahlen und `nil` sind Objekte. Blöcke, offene Klassen und Metaprogrammierung erlauben ausdrucksstarke DSLs. Bekannt wurde Ruby durch **Ruby on Rails**, das Konventionen wie „Convention over Configuration“ populär machte.",usedFor:["Webanwendungen mit Ruby on Rails (z. B. GitHub, Shopify)","Skripte und Automatisierung","DevOps-Werkzeuge (historisch Chef, Puppet, Vagrant)","DSLs (z. B. Homebrew-Formeln)"],history:"Matz veröffentlichte Ruby 1995 in Japan mit dem Ziel, Programmierer glücklich zu machen. 2004 erschien Rails von David Heinemeier Hansson. Ruby 3 (2020) brachte deutliche Performance-Verbesserungen; YJIT (von Shopify) beschleunigt seit 3.1.",strengths:["Sehr lesbare, ausdrucksstarke Syntax","Rails ermöglicht extrem schnelle Entwicklung","Starke Testkultur (RSpec, Minitest)"],weaknesses:["Langsamer als kompilierte Sprachen","Metaprogrammierung kann Code schwer nachvollziehbar machen","Kleinerer Arbeitsmarkt als früher"],setup:{steps:["Ruby über einen Versionsmanager installieren (rbenv, asdf, mise) bzw. unter Windows RubyInstaller.","Gems installieren: `gem install rails`.","Abhängigkeiten pro Projekt mit Bundler (`Gemfile`, `bundle install`)."],verify:"ruby --version",verifyLang:"bash"},tooling:["RubyMine, VS Code (Ruby LSP)","Bundler, RubyGems","RSpec, Minitest","RuboCop"],hello:'puts "Hallo, Welt!"',ecosystem:[{name:"Ruby on Rails",desc:"Full-Stack-Web-Framework.",techId:"rails"},{name:"Sinatra",desc:"Minimalistisches Web-Framework."},{name:"RSpec",desc:"Behavior-Driven Testing."}],bestPractices:["Ruby Style Guide und RuboCop verwenden.","Blöcke und Enumerable-Methoden (`map`, `select`, `reduce`) statt manueller Schleifen.","Monkey Patching vermeiden oder mit Refinements kapseln."],mistakes:[{title:"`nil` unbedacht verketten",wrong:"nutzer.adresse.stadt # NoMethodError, wenn adresse nil ist",right:"nutzer.adresse&.stadt # Safe Navigation Operator",explanation:"Der Safe-Navigation-Operator `&.` liefert `nil`, statt einen Fehler zu werfen.",lang:"ruby"}],related:["python","php","perl"],next:["[Ruby on Rails](#/tech/rails)","[Ruby vs. Python](#/vergleich?l=ruby,python)"]},{id:"dart",name:"Dart",abbr:"Dt",color:"#0175c2",kind:"Programmiersprache",group:"universal",prism:"dart",tagline:"Die Sprache hinter Flutter – eine Codebasis für Mobile, Web und Desktop.",year:2011,creator:"Google (Lars Bak, Kasper Lund)",paradigms:["objektorientiert","funktional"],typing:"statisch, stark, Sound Null Safety",execution:"JIT (Entwicklung, Hot Reload) und AOT zu nativem Code; Kompilierung nach JavaScript/Wasm",memory:"Garbage Collection",extensions:[".dart"],difficulty:"einsteiger",summary:"Dart ist eine klientoptimierte Sprache von Google. Ihre Stärke: **Hot Reload** während der Entwicklung (JIT) und schnelle native Apps in Produktion (AOT). Bekannt ist sie vor allem durch **Flutter**, mit dem man aus einer Codebasis Apps für iOS, Android, Web und Desktop baut. Seit Dart 3 sind Null Safety, Records und Pattern Matching fester Bestandteil.",usedFor:["Plattformübergreifende Apps mit Flutter","Web-Frontends","Kommandozeilen-Tools und Server (seltener)"],history:"2011 vorgestellt, ursprünglich als JavaScript-Alternative im Browser gedacht. Mit Flutter (1.0 im Jahr 2018) fand Dart seine Nische. Dart 3 (2023) erzwingt Sound Null Safety.",strengths:["Hot Reload für sehr schnelle UI-Entwicklung","Vertraute, C-ähnliche Syntax","Sound Null Safety","Eine Codebasis für viele Plattformen (Flutter)"],weaknesses:["Außerhalb von Flutter wenig verbreitet","Kleineres Ökosystem als JS oder Kotlin"],setup:{steps:["Flutter SDK installieren (enthält Dart) oder nur das Dart SDK von dart.dev.","Projekt anlegen: `dart create hallo` bzw. `flutter create app`.","Starten: `dart run` bzw. `flutter run`."],verify:"dart --version",verifyLang:"bash"},tooling:["VS Code, Android Studio (Flutter/Dart-Plugins)","pub (Paketmanager, pub.dev)","dart analyze, dart format","package:test"],hello:`void main() {
  print('Hallo, Welt!');
}`,ecosystem:[{name:"Flutter",desc:"UI-Toolkit für Multiplattform-Apps."},{name:"Riverpod / Bloc",desc:"State Management für Flutter."}],bestPractices:["`final` und `const` großzügig nutzen (const-Widgets sparen Rebuilds).","Lints aktivieren (`package:lints`/`flutter_lints`).","`async`/`await` mit sauberer Fehlerbehandlung."],mistakes:[{title:"Null-Check-Operator missbrauchen",wrong:"final laenge = name!.length;",right:"final laenge = name?.length ?? 0;",explanation:"`!` wirft zur Laufzeit, wenn der Wert null ist.",lang:"dart"}],related:["kotlin","swift","javascript"],next:["[Null-Safety im Vergleich](#/syntax/null)"]},{id:"scala",name:"Scala",abbr:"Sc",color:"#dc322f",kind:"Programmiersprache",group:"universal",prism:"scala",tagline:"Funktionale und objektorientierte Programmierung auf der JVM.",year:2004,creator:"Martin Odersky (EPFL)",paradigms:["funktional","objektorientiert"],typing:"statisch, stark, ausgeprägte Typinferenz",execution:"JVM-Bytecode; außerdem Scala.js und Scala Native",memory:"Garbage Collection (JVM)",extensions:[".scala",".sc"],difficulty:"profi",summary:"Scala vereint funktionale und objektorientierte Programmierung mit einem sehr mächtigen Typsystem. Unveränderliche Collections, Pattern Matching, Case Classes und höherwertige Funktionen sind zentral. Apache Spark ist in Scala geschrieben, was Scala im Data Engineering bekannt machte. Scala 3 vereinfachte Syntax und Typsystem deutlich.",usedFor:["Big Data mit Apache Spark","Verteilte, nebenläufige Systeme (Akka/Pekko)","Funktionale Backends (ZIO, Cats Effect)"],history:"Martin Odersky, der zuvor an Java-Generics mitwirkte, veröffentlichte Scala 2004. Scala 3 erschien 2021 mit neuem Compiler (Dotty).",strengths:["Sehr ausdrucksstark und typsicher","Hervorragend für Datenverarbeitung","Java-Interoperabilität"],weaknesses:["Steile Lernkurve","Lange Kompilierzeiten","Migration von Scala 2 auf 3 in großen Codebasen aufwendig"],setup:{steps:["Coursier installieren und `cs setup` ausführen (installiert JDK, Scala, sbt).","Projekt mit sbt oder scala-cli: `scala-cli run hallo.scala`."],verify:"scala --version",verifyLang:"bash"},tooling:["IntelliJ IDEA (Scala-Plugin), Metals für VS Code","sbt, Mill, scala-cli","ScalaTest, MUnit"],hello:`@main def hallo(): Unit =
  println("Hallo, Welt!")`,ecosystem:[{name:"Apache Spark",desc:"Verteilte Datenverarbeitung."},{name:"Akka / Apache Pekko",desc:"Actor-Modell für Nebenläufigkeit."},{name:"ZIO, Cats Effect",desc:"Funktionale Effekt-Systeme."}],bestPractices:["Unveränderliche Datenstrukturen (`val`, Case Classes).","`Option` und `Either` statt `null` und Exceptions.","Implizite Magie (Givens) sparsam und nachvollziehbar einsetzen."],mistakes:[{title:"`null` statt `Option`",wrong:"def finde(id: Int): Nutzer = if (gefunden) nutzer else null",right:"def finde(id: Int): Option[Nutzer] = nutzer.find(_.id == id)",explanation:"`Option` macht das mögliche Fehlen im Typ sichtbar und erzwingt die Behandlung.",lang:"scala"}],related:["java","kotlin"],next:["[Funktionale Programmierung im Lexikon](#/lexikon/funktionale-programmierung)"]},{id:"lua",name:"Lua",abbr:"Lua",color:"#2c2d72",kind:"Programmiersprache",group:"spezial",prism:"lua",tagline:"Winzige, schnelle Skriptsprache zum Einbetten in Spiele und Anwendungen.",year:1993,creator:"Roberto Ierusalimschy, Luiz Henrique de Figueiredo, Waldemar Celes (PUC-Rio)",paradigms:["imperativ","prozedural","funktional","prototypbasiert (über Metatables)"],typing:"dynamisch, stark",execution:"Bytecode-Interpreter; LuaJIT als sehr schneller JIT",memory:"Garbage Collection (inkrementell/generationell)",extensions:[".lua"],difficulty:"einsteiger",summary:"Lua ist extrem klein (der Interpreter umfasst nur einige hundert KB), schnell und für das **Einbetten** in andere Programme gemacht. Die einzige Datenstruktur ist die **Table**, mit der sich Arrays, Dictionaries, Objekte und Module bauen lassen. Viele Spiele (Roblox nutzt den Dialekt Luau, World of Warcraft-Add-ons), Neovim, Nginx/OpenResty und Redis nutzen Lua als Skriptsprache.",usedFor:["Skripting in Spielen und Game-Engines","Konfiguration und Plugins (Neovim, Wireshark)","Webserver-Logik (OpenResty)","Embedded-Geräte"],history:"1993 an der Päpstlichen Katholischen Universität Rio de Janeiro entstanden; „Lua“ bedeutet auf Portugiesisch „Mond“.",strengths:["Sehr klein und einfach einzubetten","Schnell (besonders LuaJIT)","Leicht zu erlernen"],weaknesses:["Arrays beginnen bei Index 1","Kleine Standardbibliothek","Variablen sind standardmäßig global (`local` vergessen)"],setup:{steps:["Lua über Paketmanager installieren (`apt install lua5.4`, `brew install lua`).","Skript starten: `lua hallo.lua`.","Pakete mit LuaRocks."],verify:"lua -v",verifyLang:"bash"},tooling:["VS Code (Lua Language Server)","LuaRocks","busted (Tests)"],hello:'print("Hallo, Welt!")',ecosystem:[{name:"LuaJIT",desc:"JIT-Compiler."},{name:"LÖVE",desc:"2D-Game-Framework."},{name:"OpenResty",desc:"Nginx mit Lua."}],bestPractices:["Immer `local` verwenden.","Arrays bei 1 beginnen lassen und `ipairs` nutzen.","Module als zurückgegebene Tables strukturieren."],mistakes:[{title:"Vergessenes `local`",wrong:`function zaehle()
  n = 0   -- globale Variable!
end`,right:`local function zaehle()
  local n = 0
end`,explanation:"Ohne `local` landen Variablen im globalen Namensraum und können sich gegenseitig überschreiben.",lang:"lua"}],related:["python","javascript"],next:["[Syntax-Vergleich: Schleifen](#/syntax/for)"]},{id:"perl",name:"Perl",abbr:"Pl",color:"#39457e",kind:"Programmiersprache",group:"spezial",prism:"perl",tagline:"Das „Schweizer Taschenmesser“ der Textverarbeitung.",year:1987,creator:"Larry Wall",paradigms:["imperativ","prozedural","objektorientiert","funktional"],typing:"dynamisch, schwach (Kontext bestimmt Interpretation)",execution:"Interpretiert (intern zu Opcodes kompiliert)",memory:"Reference Counting",extensions:[".pl",".pm"],difficulty:"fortgeschritten",summary:"Perl wurde für Berichte und Textverarbeitung entwickelt und ist berühmt für seine tief integrierten [[Regulärer Ausdruck|regulären Ausdrücke]] – die PCRE-Bibliothek („Perl Compatible Regular Expressions“) prägt Regex-Syntax bis heute. Das Motto „There’s more than one way to do it“ macht Perl flexibel, aber Code oft schwer lesbar. Perl ist auf fast jedem Unix-System vorinstalliert.",usedFor:["Textverarbeitung und Log-Auswertung","Systemadministration, Legacy-Skripte","Bioinformatik (historisch)","Ältere Webanwendungen (CGI)"],history:"Larry Wall veröffentlichte Perl 1987. Perl 5 (1994) ist bis heute die gepflegte Linie; das als Perl 6 geplante Projekt wurde 2019 in „Raku“ umbenannt und ist eine eigenständige Sprache.",strengths:["Unschlagbar bei Regex und Textmanipulation","Fast überall verfügbar","CPAN: riesiges Modularchiv"],weaknesses:["Oft schwer lesbarer Code („write-only“)","Sinkende Verbreitung","Kontextabhängige Semantik verwirrt Einsteiger"],setup:{steps:["Unter Linux/macOS meist vorinstalliert; Windows: Strawberry Perl.","Skript starten: `perl skript.pl`.","Module mit `cpanm` installieren."],verify:"perl -v",verifyLang:"bash"},tooling:["VS Code (Perl Navigator)","cpanm","Perl::Critic, Perl::Tidy"],hello:`use strict;
use warnings;

print "Hallo, Welt!\\n";`,ecosystem:[{name:"CPAN",desc:"Comprehensive Perl Archive Network."},{name:"Mojolicious",desc:"Modernes Web-Framework."}],bestPractices:["Immer `use strict; use warnings;`.","Lesbarkeit vor Kürze – Regex mit `/x` kommentieren.","Perl::Critic zur Stilprüfung."],mistakes:[{title:"Ohne `strict`",wrong:`$zaehler = 1;
print $zahler; # Tippfehler bleibt unbemerkt`,right:`use strict;
use warnings;
my $zaehler = 1;
print $zaehler;`,explanation:"`use strict` erzwingt Deklarationen mit `my` und fängt Tippfehler in Variablennamen ab.",lang:"perl"}],related:["bash","ruby","python"],next:["[Regex-Labor](#/labor/regex)"]}],s=[{id:"sql",name:"SQL",abbr:"SQL",color:"#e38c00",kind:"Abfragesprache",group:"daten",prism:"sql",tagline:"Die Sprache relationaler Datenbanken – seit 50 Jahren unverzichtbar.",year:1974,creator:"Donald D. Chamberlin und Raymond F. Boyce (IBM); ISO/IEC 9075",paradigms:["deklarativ","mengenorientiert"],typing:"statisch je Spalte (Schema), dialektabhängig",execution:"Vom DBMS geparst, optimiert (Query Planner) und ausgeführt",memory:"Vom Datenbanksystem verwaltet",extensions:[".sql"],difficulty:"einsteiger",summary:"SQL (Structured Query Language) ist **deklarativ**: Du beschreibst, *welche* Daten du willst, und der Query Planner der Datenbank entscheidet, *wie* sie gefunden werden. SQL umfasst Abfragen (`SELECT`), Datenänderungen (`INSERT`, `UPDATE`, `DELETE`), Schemadefinition (`CREATE TABLE`), Rechte und Transaktionen. Der Kern ist standardisiert, jedes System (PostgreSQL, MySQL, SQLite, SQL Server, Oracle) hat aber eigene Erweiterungen.",usedFor:["Abfragen und Auswerten von Geschäftsdaten","Backends jeder Art (über Treiber oder ORMs)","Datenanalyse, Reporting, BI","Data Engineering (Data Warehouses, dbt)"],history:"Auf Basis von Edgar F. Codds relationalem Modell (1970) entwickelten Chamberlin und Boyce bei IBM 1974 „SEQUEL“, später SQL. Oracle brachte 1979 die erste kommerzielle SQL-Datenbank. Seit 1986 ist SQL ein ANSI/ISO-Standard; neuere Versionen ergänzten u. a. Window Functions, JSON und Property-Graph-Abfragen (SQL:2023).",strengths:["Deklarativ und sehr mächtig für Mengenoperationen","Standardisiert und extrem verbreitet","Datenbank optimiert die Ausführung automatisch","Transaktionen und Integrität eingebaut"],weaknesses:["Dialektunterschiede zwischen Systemen","NULL-Logik (dreiwertig) ist fehleranfällig","Komplexe Abfragen werden schnell unübersichtlich (CTEs helfen)"],setup:{steps:["Ohne Installation: im [SQL-Labor](#/labor/sql) direkt im Browser üben (SQLite via WebAssembly).","Lokal: SQLite (`sqlite3 shop.db`) oder PostgreSQL per Docker: `docker run -e POSTGRES_PASSWORD=geheim -p 5432:5432 postgres:17`.","Mit einem Client verbinden: `psql`, DBeaver, DataGrip oder pgAdmin."],verify:`sqlite3 --version
psql --version`,verifyLang:"bash"},tooling:["DBeaver, DataGrip, pgAdmin","psql, sqlite3, mysql CLI","sqlfluff (Linter)","EXPLAIN / EXPLAIN ANALYZE"],hello:"SELECT 'Hallo, Welt!' AS gruss;",example:{title:"Top-Kunden mit CTE und Window Function",lang:"sql",code:`WITH umsatz AS (
  SELECT k.id, k.name, k.stadt,
         SUM(p.menge * p.einzelpreis) AS gesamt
  FROM kunden k
  JOIN bestellungen b      ON b.kunde_id = k.id
  JOIN bestellpositionen p ON p.bestellung_id = b.id
  GROUP BY k.id, k.name, k.stadt
)
SELECT name, stadt, gesamt,
       RANK() OVER (PARTITION BY stadt ORDER BY gesamt DESC) AS rang_in_stadt
FROM umsatz
ORDER BY stadt, rang_in_stadt;`,explanation:"Die **CTE** (`WITH`) benennt ein Zwischenergebnis und macht die Abfrage lesbar. Die **Window Function** `RANK() OVER (PARTITION BY …)` berechnet den Rang je Stadt, ohne die Zeilen zusammenzufassen – mit `GROUP BY` allein wäre das nicht möglich. Probiere es im SQL-Labor aus!"},ecosystem:[{name:"PostgreSQL",desc:"Leistungsfähigste Open-Source-RDBMS.",techId:"postgresql"},{name:"MySQL / MariaDB",desc:"Weit verbreitet im Web.",techId:"mysql"},{name:"SQLite",desc:"Eingebettete Datenbank in einer Datei.",techId:"sqlite"},{name:"dbt",desc:"SQL-basierte Datentransformation."}],bestPractices:["Parameter immer über Prepared Statements übergeben – nie per String-Verkettung.","Explizite Spaltenlisten statt `SELECT *` in Anwendungscode.","Fremdschlüssel und Constraints definieren – die Datenbank ist die letzte Verteidigungslinie für Datenqualität.","Abfragen mit `EXPLAIN` prüfen und Indizes gezielt anlegen.","Mehrere zusammengehörige Änderungen in eine Transaktion packen.","Mit `NULL` immer per `IS NULL` vergleichen."],mistakes:[{title:"Vergleich mit NULL",wrong:"SELECT * FROM kunden WHERE email = NULL;  -- liefert nie Zeilen",right:"SELECT * FROM kunden WHERE email IS NULL;",explanation:"NULL bedeutet „unbekannt“. Jeder Vergleich mit NULL ergibt UNKNOWN, nicht TRUE.",lang:"sql"},{title:"Aggregat im WHERE",wrong:`SELECT stadt, COUNT(*) FROM kunden
WHERE COUNT(*) > 2
GROUP BY stadt;`,right:`SELECT stadt, COUNT(*) FROM kunden
GROUP BY stadt
HAVING COUNT(*) > 2;`,explanation:"`WHERE` filtert Zeilen vor der Gruppierung, `HAVING` Gruppen danach.",lang:"sql"},{title:"UPDATE ohne WHERE",wrong:"UPDATE produkte SET preis = 0;  -- alle Produkte!",right:`BEGIN;
UPDATE produkte SET preis = 0 WHERE id = 42;
-- prüfen …
COMMIT;`,explanation:"Ohne `WHERE` betrifft die Änderung jede Zeile. In Transaktionen arbeiten und vorher ein `SELECT` mit derselben Bedingung ausführen.",lang:"sql"}],advanced:[{title:"Window Functions",text:"`ROW_NUMBER`, `RANK`, `LAG`, `LEAD`, laufende Summen mit `SUM(...) OVER (ORDER BY ...)`."},{title:"Rekursive CTEs",text:"`WITH RECURSIVE` für Hierarchien (Organigramme, Kategoriebäume)."},{title:"Isolation Levels & Locks",text:"Read Committed, Repeatable Read, Serializable – siehe [Indizes & Transaktionen](#/artikel/indizes-transaktionen)."},{title:"Indexdesign",text:"Zusammengesetzte Indizes, Covering Indexes, partielle Indizes."}],interview:[{q:"Unterschied zwischen INNER JOIN und LEFT JOIN?",a:"INNER JOIN liefert nur Zeilen mit Treffern auf beiden Seiten; LEFT JOIN liefert alle Zeilen der linken Tabelle und füllt fehlende Treffer rechts mit NULL."},{q:"Was ist die logische Ausführungsreihenfolge einer SELECT-Abfrage?",a:"FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT/OFFSET."},{q:"Wann schadet ein Index?",a:"Bei schreibintensiven Tabellen (jeder Insert/Update muss den Index pflegen), bei sehr geringer Selektivität und als zusätzlicher Speicherbedarf."}],exercises:[{title:"Kunden ohne Bestellung",task:"Finde alle Kunden, die noch nie bestellt haben.",hint:"LEFT JOIN und auf NULL prüfen – oder NOT EXISTS.",solution:`SELECT k.name
FROM kunden k
LEFT JOIN bestellungen b ON b.kunde_id = k.id
WHERE b.id IS NULL;`}],related:["python","graphql"],next:["[SQL-Labor mit Aufgaben](#/labor/sql)","[SQL-Grundlagen](#/artikel/sql-grundlagen)","[SQL-Cheatsheet](#/cheatsheets/sql)"]},{id:"r",name:"R",abbr:"R",color:"#276dc3",kind:"Programmiersprache",group:"daten",prism:"r",tagline:"Statistik und Datenvisualisierung von Statistikern für Statistiker.",year:1993,creator:"Ross Ihaka und Robert Gentleman (Universität Auckland)",paradigms:["funktional","vektororientiert","objektorientiert (S3, S4, R6)"],typing:"dynamisch",execution:"Interpretiert",memory:"Garbage Collection",extensions:[".R",".Rmd",".qmd"],difficulty:"fortgeschritten",summary:"R ist auf Statistik, Datenanalyse und Visualisierung spezialisiert. Operationen arbeiten standardmäßig auf ganzen **Vektoren**. Das Tidyverse (dplyr, ggplot2, tidyr) bietet eine konsistente, lesbare Grammatik für Datenaufbereitung und Grafiken. CRAN enthält über 20.000 Pakete, darunter viele modernste statistische Verfahren.",usedFor:["Statistische Analysen und Forschung","Datenvisualisierung (ggplot2)","Reports und Dashboards (R Markdown, Quarto, Shiny)","Biostatistik, Epidemiologie, Ökonometrie"],history:"R entstand als freie Implementierung der Sprache S (Bell Labs). Version 1.0 erschien 2000. RStudio (heute Posit) machte die Sprache ab 2011 deutlich zugänglicher.",strengths:["Riesige Auswahl statistischer Methoden","Exzellente Grafiken mit ggplot2","Reproduzierbare Berichte"],weaknesses:["Eigenwillige Syntax (z. B. `<-`, 1-basierte Indizes)","Für allgemeine Softwareentwicklung weniger geeignet","Performance bei Schleifen (Vektorisierung nötig)"],setup:{steps:["R von cran.r-project.org installieren.","RStudio oder Positron als IDE installieren.",'Pakete: `install.packages("tidyverse")`.'],verify:"R --version",verifyLang:"bash"},tooling:["RStudio, Positron","CRAN","Quarto, R Markdown","testthat"],hello:'print("Hallo, Welt!")',example:{title:"Daten gruppieren und visualisieren",lang:"r",code:`library(dplyr)
library(ggplot2)

verkaeufe <- tibble(
  monat = rep(1:6, 2),
  region = rep(c("Nord", "Süd"), each = 6),
  umsatz = c(10, 12, 15, 14, 18, 21, 8, 9, 13, 16, 17, 19)
)

verkaeufe |>
  group_by(region) |>
  summarise(gesamt = sum(umsatz), mittel = mean(umsatz))

ggplot(verkaeufe, aes(monat, umsatz, colour = region)) +
  geom_line(linewidth = 1) +
  labs(title = "Umsatz pro Monat", x = "Monat", y = "Umsatz (Tsd. €)")`,explanation:"Der native Pipe-Operator `|>` verkettet Schritte lesbar. `group_by` + `summarise` aggregieren; ggplot2 baut Grafiken schichtweise aus Daten, Ästhetik-Zuordnungen (`aes`) und Geometrien."},ecosystem:[{name:"Tidyverse",desc:"dplyr, ggplot2, tidyr, readr …"},{name:"Shiny",desc:"Interaktive Web-Apps in R."},{name:"Quarto",desc:"Reproduzierbare Berichte."}],bestPractices:["Vektorisiert statt mit Schleifen arbeiten.","Projekte mit `renv` reproduzierbar machen.","Code in Funktionen und Pakete strukturieren."],mistakes:[{title:"Wachsende Vektoren in Schleifen",wrong:`x <- c()
for (i in 1:10000) x <- c(x, i^2)`,right:"x <- (1:10000)^2",explanation:"Jedes `c(x, …)` kopiert den gesamten Vektor (O(n²)). Vektorisierte Operationen sind um Größenordnungen schneller.",lang:"r"}],related:["python","julia","matlab","sql"],next:["[R vs. Python](#/vergleich?l=r,python)","[Lernpfad Data Engineer](#/lernpfade/data-engineer)"]},{id:"bash",name:"Bash",abbr:"sh",color:"#4eaa25",kind:"Shell-Sprache",group:"spezial",prism:"bash",tagline:"Die Standard-Shell unter Linux – für Terminal und Automatisierung.",year:1989,creator:"Brian Fox (GNU-Projekt); heute Chet Ramey",paradigms:["imperativ","prozedural"],typing:"untypisiert (alles sind Strings; Integer-Arithmetik möglich)",execution:"Interpretiert",memory:"—",extensions:[".sh",".bash"],difficulty:"einsteiger",summary:"Bash („Bourne Again Shell“) ist interaktive [[Shell]] und Skriptsprache zugleich. Ihre Stärke ist das **Verbinden von Programmen**: Pipes (`|`) leiten Ausgaben weiter, Umleitungen (`>`, `2>`) schreiben in Dateien, [[Exit Code|Exit-Codes]] steuern den Ablauf. Bash-Skripte automatisieren Deployments, Backups und Build-Schritte und laufen in fast jedem Container und CI-System.",usedFor:["Interaktive Arbeit im Terminal","Automatisierung und Systemadministration","CI/CD-Schritte, Entrypoint-Skripte in Containern","Werkzeuge verketten (grep, sed, awk, jq, curl)"],history:"Brian Fox schrieb Bash 1989 als freien Ersatz für die Bourne Shell (sh). Bash ist Standard-Shell vieler Linux-Distributionen; macOS nutzt seit 2019 standardmäßig Zsh.",strengths:["Überall verfügbar (Linux, Container, CI, WSL, Git Bash)","Ideal zum Verketten vorhandener Tools","Keine Installation nötig"],weaknesses:["Fehleranfällig: Leerzeichen in Variablen, fehlende Quotes, stille Fehler","Keine echten Datenstrukturen jenseits einfacher Arrays","Für komplexe Logik besser Python verwenden"],setup:{steps:["Linux/macOS: Terminal öffnen – Bash bzw. Zsh ist vorhanden.","Windows: WSL (`wsl --install`) oder Git Bash.","Skript ausführbar machen: `chmod +x skript.sh`, starten: `./skript.sh`.","Skripte mit ShellCheck prüfen."],verify:"bash --version",verifyLang:"bash"},tooling:["ShellCheck (unverzichtbar)","shfmt","VS Code (Bash IDE)","bats (Tests)"],hello:`#!/usr/bin/env bash
echo "Hallo, Welt!"`,example:{title:"Robustes Backup-Skript",lang:"bash",code:`#!/usr/bin/env bash
set -euo pipefail          # bei Fehlern, undefinierten Variablen und Pipe-Fehlern abbrechen

QUELLE="\${1:?Aufruf: $0 <verzeichnis>}"
ZIEL="\${BACKUP_DIR:-$HOME/backups}"
STEMPEL="$(date +%Y-%m-%d_%H%M%S)"
ARCHIV="$ZIEL/$(basename "$QUELLE")_$STEMPEL.tar.gz"

mkdir -p "$ZIEL"

aufraeumen() { echo "Abbruch – unvollständiges Archiv wird gelöscht" >&2; rm -f "$ARCHIV"; }
trap aufraeumen ERR

tar -czf "$ARCHIV" -C "$(dirname "$QUELLE")" "$(basename "$QUELLE")"
echo "Backup erstellt: $ARCHIV ($(du -h "$ARCHIV" | cut -f1))"

# Nur die 7 neuesten Backups behalten
ls -1t "$ZIEL"/*.tar.gz | tail -n +8 | xargs -r rm --`,explanation:"`set -euo pipefail` ist der wichtigste Schutz gegen stille Fehler. **Alle Variablen in doppelten Anführungszeichen**, sonst zerbrechen Pfade mit Leerzeichen. `${1:?…}` erzwingt ein Argument, `${VAR:-default}` setzt Standardwerte, `trap` räumt bei Fehlern auf."},ecosystem:[{name:"coreutils",desc:"ls, cp, mv, sort, cut, …"},{name:"grep, sed, awk",desc:"Textverarbeitung."},{name:"jq",desc:"JSON auf der Kommandozeile."},{name:"curl",desc:"HTTP-Anfragen."}],bestPractices:["`set -euo pipefail` am Skriptanfang.",'Variablen immer quoten: `"$var"`.',"`$(...)` statt Backticks.","`[[ … ]]` statt `[ … ]` in Bash.","ShellCheck in Editor und CI.","Ab ~100 Zeilen oder komplexer Logik zu Python wechseln."],mistakes:[{title:"Ungequotete Variablen",wrong:`datei="Mein Bericht.txt"
rm $datei   # versucht "Mein" und "Bericht.txt" zu löschen`,right:`datei="Mein Bericht.txt"
rm -- "$datei"`,explanation:"Ohne Anführungszeichen trennt die Shell an Leerzeichen (Word Splitting) und wertet Wildcards aus. `--` beendet zudem die Optionsverarbeitung.",lang:"bash"},{title:"Leerzeichen um `=`",wrong:'name = "Ada"   # Fehler: Befehl "name" nicht gefunden',right:'name="Ada"',explanation:"Bei Zuweisungen darf um das Gleichheitszeichen kein Leerzeichen stehen.",lang:"bash"}],related:["powershell","perl","python"],next:["[Linux-Cheatsheet](#/cheatsheets/linux)","[Command Explorer](#/befehle)","[Linux-Server, SSH & Nginx](#/artikel/linux-server-nginx)"]},{id:"powershell",name:"PowerShell",abbr:"PS",color:"#5391fe",kind:"Shell-Sprache",group:"spezial",prism:"powershell",tagline:"Objektorientierte Shell und Automatisierungssprache von Microsoft.",year:2006,creator:"Jeffrey Snover (Microsoft)",paradigms:["imperativ","objektorientiert","pipeline-orientiert"],typing:"dynamisch, optional typisiert (.NET-Typen)",execution:"Interpretiert/kompiliert auf .NET",memory:"Garbage Collection (.NET)",extensions:[".ps1",".psm1",".psd1"],difficulty:"einsteiger",summary:"Anders als klassische Shells reicht PowerShell **Objekte** statt Text durch die Pipeline. Befehle (Cmdlets) folgen dem Muster **Verb-Nomen** (`Get-Process`, `Stop-Service`). Dadurch lassen sich Eigenschaften direkt filtern und sortieren, ohne Text zu parsen. PowerShell 7 ist plattformübergreifend (Windows, Linux, macOS) und Open Source; Windows PowerShell 5.1 ist die ältere, mitgelieferte Version.",usedFor:["Windows- und Active-Directory-Administration","Microsoft 365, Azure, Exchange automatisieren","Plattformübergreifende Skripte","CI/CD auf Windows-Runnern"],history:"Jeffrey Snover beschrieb 2002 im „Monad Manifesto“ eine objektbasierte Shell; 2006 erschien Windows PowerShell 1.0. 2016 wurde PowerShell Open Source und plattformübergreifend (PowerShell Core, heute PowerShell 7).",strengths:["Objekte statt Text: kein fragiles Parsen","Konsistente, auffindbare Befehle (`Get-Command`, `Get-Help`)","Voller Zugriff auf .NET","Tiefe Integration in Microsoft-Produkte"],weaknesses:["Ausführlichere Syntax","Unterschiede zwischen Windows PowerShell 5.1 und PowerShell 7","Ausführungsrichtlinien verwirren Einsteiger"],setup:{steps:["Windows: PowerShell 7 per `winget install Microsoft.PowerShell`.","macOS/Linux: per Paketmanager (`brew install powershell`).","Starten mit `pwsh`.","Hilfe: `Get-Help Get-Process -Examples`."],verify:"$PSVersionTable.PSVersion",verifyLang:"powershell"},tooling:["VS Code (PowerShell-Extension)","PSScriptAnalyzer","Pester (Tests)","PowerShell Gallery"],hello:'Write-Output "Hallo, Welt!"',example:{title:"Speicherfresser finden und als CSV exportieren",lang:"powershell",code:`# Die 5 Prozesse mit dem höchsten Arbeitsspeicher
$top = Get-Process |
    Sort-Object -Property WorkingSet64 -Descending |
    Select-Object -First 5 Name, Id,
        @{ Name = "RAM_MB"; Expression = { [math]::Round($_.WorkingSet64 / 1MB, 1) } }

$top | Format-Table -AutoSize
$top | Export-Csv -Path ".\\top-prozesse.csv" -NoTypeInformation -Encoding utf8

# Große Dateien im Downloads-Ordner
Get-ChildItem -Path "$HOME\\Downloads" -File -Recurse |
    Where-Object Length -gt 100MB |
    Sort-Object Length -Descending |
    Select-Object FullName, @{ n = "GB"; e = { "{0:N2}" -f ($_.Length / 1GB) } }`,explanation:"Jedes Cmdlet erhält **Objekte** mit Eigenschaften (`WorkingSet64`, `Length`) – sortieren und filtern funktioniert ohne Text-Parsing. Berechnete Eigenschaften (`@{ Name=…; Expression=… }`) formen die Ausgabe, `Export-Csv` schreibt strukturierte Daten."},ecosystem:[{name:"PowerShell Gallery",desc:"Modul-Registry (`Install-Module`)."},{name:"Az / Microsoft.Graph",desc:"Azure- und Microsoft-365-Module."},{name:"Pester",desc:"Test-Framework."}],bestPractices:["Vollständige Cmdlet-Namen in Skripten (keine Aliase wie `ls`, `%`).","Mit `-WhatIf` gefahrlos testen, was ein Befehl ändern würde.","`[CmdletBinding()]` und typisierte Parameter in Funktionen.","Fehler mit `try/catch` und `-ErrorAction Stop` behandeln."],mistakes:[{title:"Text parsen statt Objekte nutzen",wrong:'Get-Process | Out-String | Select-String "chrome"',right:"Get-Process -Name chrome",explanation:"Wer Objekte in Text umwandelt und dann parst, verliert den größten Vorteil von PowerShell.",lang:"powershell"}],related:["bash","csharp"],next:["[PowerShell-Cheatsheet](#/cheatsheets/powershell)","[Automatisierung](#/artikel/automatisierung)"]},{id:"matlab",name:"MATLAB",abbr:"M",color:"#e16737",kind:"Programmiersprache",group:"daten",prism:"matlab",tagline:"Matrizenbasiertes Rechnen für Ingenieurwesen und Wissenschaft.",year:1984,creator:"Cleve Moler; vermarktet von MathWorks",paradigms:["imperativ","array-orientiert","objektorientiert"],typing:"dynamisch",execution:"Interpretiert mit JIT",memory:"Automatisch (Copy-on-Write)",extensions:[".m",".mlx"],difficulty:"einsteiger",summary:"MATLAB („MATrix LABoratory“) ist eine kommerzielle Umgebung für numerisches Rechnen, in der **Matrizen** der grundlegende Datentyp sind. Zahlreiche Toolboxen (Signalverarbeitung, Regelungstechnik, Bildverarbeitung) und Simulink für modellbasierte Entwicklung machen MATLAB in Ingenieurwissenschaften und Industrie zum Standard. Freie Alternative mit weitgehend kompatibler Syntax: GNU Octave.",usedFor:["Signal- und Bildverarbeitung","Regelungstechnik und Simulation (Simulink)","Numerische Mathematik in Lehre und Forschung","Automotive und Luftfahrt (Codegenerierung)"],history:"Cleve Moler schrieb Ende der 1970er ein Werkzeug, mit dem Studierende LINPACK/EISPACK ohne Fortran nutzen konnten. 1984 gründeten Jack Little, Steve Bangert und Moler MathWorks.",strengths:["Sehr kompakte Matrizen-Syntax","Hervorragende Toolboxen und Dokumentation","Simulink für Systemmodellierung"],weaknesses:["Teure Lizenzen","Weniger geeignet für allgemeine Softwareentwicklung","Indizes beginnen bei 1"],setup:{steps:["Lizenz über Hochschule/Firma oder MATLAB Online im Browser nutzen.","Alternativ GNU Octave installieren (frei)."]},tooling:["MATLAB Desktop, MATLAB Online","Simulink","GNU Octave"],hello:"disp('Hallo, Welt!')",ecosystem:[{name:"Simulink",desc:"Grafische Simulation und Codegenerierung."},{name:"Toolboxen",desc:"Signal Processing, Control System, Deep Learning …"}],bestPractices:["Vektorisieren statt Schleifen.","Arrays vorab allokieren (`zeros(n, 1)`).","Funktionen statt langer Skripte."],mistakes:[{title:"Matrix- vs. elementweise Multiplikation",wrong:`a = [1 2 3];
b = [4 5 6];
c = a * b   % Fehler: Dimensionen passen nicht`,right:"c = a .* b  % elementweise: [4 10 18]",explanation:"`*` ist die Matrixmultiplikation, `.*` multipliziert elementweise.",lang:"matlab"}],related:["julia","python","r"],next:["[Julia als moderne Alternative](#/sprachen/julia)"]},{id:"julia",name:"Julia",abbr:"jl",color:"#9558b2",kind:"Programmiersprache",group:"daten",prism:"julia",tagline:"Schnell wie C, einfach wie Python – für wissenschaftliches Rechnen.",year:2012,creator:"Jeff Bezanson, Stefan Karpinski, Viral B. Shah, Alan Edelman",paradigms:["multiple dispatch","funktional","imperativ"],typing:"dynamisch mit optionalen Typannotationen; Typinferenz für Performance",execution:"JIT-kompiliert (LLVM)",memory:"Garbage Collection",extensions:[".jl"],difficulty:"fortgeschritten",summary:"Julia löst das „Zwei-Sprachen-Problem“: Prototypen in einer einfachen Sprache, Produktionscode in C/Fortran. Dank JIT-Kompilierung und **Multiple Dispatch** (Funktionen werden anhand der Typen *aller* Argumente ausgewählt) erreicht Julia oft C-ähnliche Geschwindigkeit bei hoher Lesbarkeit.",usedFor:["Wissenschaftliche Simulationen","Numerische Optimierung","Differentialgleichungen (DifferentialEquations.jl)","Hochleistungsrechnen"],history:"Am MIT entwickelt, 2012 vorgestellt, 1.0 im Jahr 2018.",strengths:["Hohe Performance ohne Sprachwechsel","Multiple Dispatch ermöglicht sehr komponierbare Pakete","Unicode-Mathematiknotation"],weaknesses:["Lange Wartezeit beim ersten Ausführen („Time to First Plot“) – deutlich verbessert seit 1.9","Kleineres Ökosystem","1-basierte Indizes"],setup:{steps:["Über juliaup installieren (julialang.org).","REPL starten mit `julia`, Paketmodus mit `]`."],verify:"julia --version",verifyLang:"bash"},tooling:["VS Code (Julia-Extension)","Pluto.jl, Jupyter","Pkg (Paketmanager)"],hello:'println("Hallo, Welt!")',ecosystem:[{name:"DifferentialEquations.jl",desc:"Leistungsstarke DGL-Löser."},{name:"Flux.jl",desc:"Machine Learning."},{name:"Makie / Plots.jl",desc:"Visualisierung."}],bestPractices:["Code in Funktionen packen (globale Variablen sind langsam).","Typstabilität anstreben (`@code_warntype`).","Broadcasting mit `.` nutzen: `sin.(x)`."],mistakes:[{title:"Performance-kritischer Code im globalen Scope",wrong:`x = rand(10^6)
s = 0.0
for v in x
    global s += v
end`,right:`function summe(x)
    s = 0.0
    for v in x
        s += v
    end
    s
end
summe(rand(10^6))`,explanation:"Globale Variablen haben keinen festen Typ – der Compiler kann nicht optimieren. In Funktionen wird der Code spezialisiert und schnell.",lang:"julia"}],related:["python","matlab","r"],next:["[Julia vs. Python](#/vergleich?l=julia,python)"]},{id:"assembly",name:"Assembly",abbr:"ASM",color:"#6e4c13",kind:"Assemblersprache",group:"system",prism:"nasm",tagline:"Menschenlesbarer Maschinencode – direkt mit der CPU sprechen.",year:1947,creator:"Konzept u. a. von Kathleen Booth; heute je Architektur eigene Assembler",paradigms:["imperativ","maschinennah"],typing:"keine (Register und Speicheradressen)",execution:"Vom Assembler 1:1 in Maschinencode übersetzt",memory:"Vollständig manuell",extensions:[".asm",".s",".S"],difficulty:"profi",summary:"Assembly ist keine einzelne Sprache, sondern eine Familie: Für jede Befehlssatzarchitektur (x86-64, ARM64, RISC-V) gibt es eigene Befehle und Register. Jede Zeile entspricht meist genau einem Maschinenbefehl. Heute schreibt man selten ganze Programme in Assembly – aber das Lesen von Assembly hilft beim Debugging, bei Performance-Optimierung, Reverse Engineering und beim Verständnis von [[Compiler|Compilern]].",usedFor:["Bootloader, Betriebssystem-Kernstücke","Hochoptimierte Routinen (Kryptografie, Codecs)","Mikrocontroller mit sehr wenig Speicher","Reverse Engineering und Sicherheitsforschung"],history:"Kathleen Booth beschrieb 1947 eine frühe Assemblersprache; ab den 1950ern verbreiteten sich Assembler als Alternative zur direkten Eingabe von Zahlencodes. Hochsprachen wie Fortran und C verdrängten Assembly weitgehend.",strengths:["Maximale Kontrolle über Hardware","Verständnis, was Compiler erzeugen"],weaknesses:["Nicht portabel","Sehr aufwendig und fehleranfällig","Moderne Compiler optimieren meist besser als Menschen"],setup:{steps:["NASM installieren (`apt install nasm`).","Assemblieren und linken (Linux, x86-64): `nasm -f elf64 hallo.asm && ld hallo.o -o hallo`.","Compiler-Ausgabe ansehen: `gcc -S -O2 datei.c` oder Compiler Explorer (godbolt.org)."]},tooling:["NASM, GNU as","GDB","Compiler Explorer (godbolt.org)","objdump"],hello:`; Linux x86-64, NASM-Syntax
section .data
    msg db "Hallo, Welt!", 10
    len equ $ - msg

section .text
    global _start
_start:
    mov rax, 1        ; Syscall 1 = write
    mov rdi, 1        ; Dateideskriptor 1 = stdout
    mov rsi, msg      ; Adresse des Textes
    mov rdx, len      ; Länge
    syscall
    mov rax, 60       ; Syscall 60 = exit
    xor rdi, rdi      ; Exit-Code 0
    syscall`,ecosystem:[{name:"Compiler Explorer",desc:"Zeigt Assembly-Ausgabe von C, C++, Rust, Go … live."}],bestPractices:["Assembly nur für eng begrenzte Hotspots – sonst Compiler-Intrinsics nutzen.","Aufrufkonventionen (System V / Microsoft x64) einhalten.","Ausführlich kommentieren."],mistakes:[{title:"Callee-saved Register überschreiben",wrong:`meine_funktion:
    mov rbx, 42   ; rbx muss laut ABI erhalten bleiben
    ret`,right:`meine_funktion:
    push rbx
    mov rbx, 42
    pop rbx
    ret`,explanation:"Nach der System-V-Aufrufkonvention müssen u. a. rbx, rbp und r12–r15 von der aufgerufenen Funktion wiederhergestellt werden.",lang:"nasm"}],related:["c","cpp","rust"],next:["[Wie Computer funktionieren](#/artikel/wie-computer-funktionieren)","[Vom Quellcode zum Maschinencode](#/artikel/compiler-interpreter-runtime)"]},{id:"solidity",name:"Solidity",abbr:"Sol",color:"#636363",kind:"Smart-Contract-Sprache",group:"spezial",prism:"solidity",tagline:"Smart Contracts für Ethereum und kompatible Blockchains.",year:2014,creator:"Gavin Wood (Konzept), Christian Reitwiessner u. a. (Ethereum)",paradigms:["objektorientiert (Contracts)","imperativ"],typing:"statisch, stark",execution:"Kompiliert zu EVM-Bytecode, ausgeführt von allen Knoten der Blockchain",memory:"Storage (persistent, teuer), Memory, Calldata",extensions:[".sol"],difficulty:"profi",summary:"Solidity ist eine an JavaScript und C++ angelehnte Sprache für **Smart Contracts** – Programme, die auf einer Blockchain laufen und dort unveränderlich gespeichert werden. Jede Operation kostet „Gas“ (Gebühren), und Fehler sind nach dem Deployment kaum korrigierbar. Sicherheit ist deshalb das oberste Gebot: Reentrancy, Integer-Probleme und Zugriffskontrolle haben schon Schäden in Milliardenhöhe verursacht.",usedFor:["Token (ERC-20, ERC-721)","Dezentrale Finanzanwendungen (DeFi)","DAOs und Abstimmungen"],history:"2014 von Gavin Wood vorgeschlagen, vom Ethereum-Team entwickelt. Seit Version 0.8 sind arithmetische Überläufe standardmäßig geprüft.",strengths:["Großes Ökosystem (OpenZeppelin, Foundry, Hardhat)","Vertraute Syntax"],weaknesses:["Fehler sind teuer und oft irreversibel","Gas-Kosten beeinflussen das Design stark","Viele subtile Sicherheitsfallen"],setup:{steps:["Im Browser mit Remix IDE (remix.ethereum.org) beginnen.","Lokal: Foundry (`forge init`) oder Hardhat.","Nur auf Testnetzen deployen, bis Audits erfolgt sind."]},tooling:["Remix IDE","Foundry, Hardhat","OpenZeppelin Contracts","Slither (statische Analyse)"],hello:`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Hallo {
    string public gruss = "Hallo, Welt!";
}`,ecosystem:[{name:"OpenZeppelin",desc:"Geprüfte Contract-Bibliotheken."},{name:"Foundry",desc:"Schnelles Test- und Deployment-Toolkit."}],bestPractices:["Geprüfte Bibliotheken (OpenZeppelin) statt Eigenbau.","Checks-Effects-Interactions-Muster gegen Reentrancy.","Umfassende Tests, Fuzzing und externe Audits vor Mainnet-Deployment."],mistakes:[{title:"Reentrancy",wrong:`function auszahlen() external {
    uint betrag = guthaben[msg.sender];
    (bool ok, ) = msg.sender.call{value: betrag}("");
    require(ok);
    guthaben[msg.sender] = 0;   // zu spät!
}`,right:`function auszahlen() external {
    uint betrag = guthaben[msg.sender];
    guthaben[msg.sender] = 0;   // erst Zustand ändern
    (bool ok, ) = msg.sender.call{value: betrag}("");
    require(ok);
}`,explanation:"Der externe Aufruf kann zurück in den Contract springen, bevor das Guthaben auf 0 gesetzt wurde, und mehrfach abheben. Erst Zustand ändern, dann externe Aufrufe.",lang:"solidity"}],related:["javascript","cpp","rust"],next:["[Secure Coding](#/bereich/security)"]},{id:"graphql",name:"GraphQL",abbr:"GQL",color:"#e10098",kind:"Abfragesprache",group:"web",prism:"graphql",tagline:"Abfragesprache für APIs: Der Client bestimmt, welche Daten er bekommt.",year:2015,creator:"Facebook (Lee Byron, Dan Schafer, Nick Schrock); heute GraphQL Foundation",paradigms:["deklarativ"],typing:"statisch, stark (Schema Definition Language)",execution:"Vom GraphQL-Server gegen das Schema validiert und von Resolvern ausgeführt",memory:"—",extensions:[".graphql",".gql"],difficulty:"fortgeschritten",summary:"GraphQL ist eine **Abfragesprache für APIs** – keine Datenbanksprache. Ein typisiertes Schema beschreibt alle verfügbaren Daten; Clients schicken Abfragen an einen einzigen Endpoint und erhalten genau die angeforderten Felder als JSON. Mutations ändern Daten, Subscriptions liefern Echtzeit-Updates. Auf dem Server liefern **Resolver** die Daten aus Datenbanken oder anderen Diensten.",usedFor:["APIs für Web- und Mobile-Apps mit vielen unterschiedlichen Ansichten","Aggregation mehrerer Backends (Federation)","Öffentliche Entwickler-APIs (z. B. GitHub)"],history:"Facebook entwickelte GraphQL 2012 für seine Mobile-Apps und veröffentlichte die Spezifikation 2015. Seit 2018 betreut die GraphQL Foundation (Linux Foundation) den Standard.",strengths:["Kein Over-/Underfetching","Starkes Typsystem und Introspection (selbstdokumentierend)","Ein Endpoint, viele Ansichten"],weaknesses:["HTTP-Caching schwieriger als bei REST","Teure oder bösartige Abfragen müssen begrenzt werden","N+1-Probleme in Resolvern (DataLoader nötig)"],setup:{steps:["Server-Bibliothek wählen: Apollo Server, GraphQL Yoga, Strawberry (Python), HotChocolate (.NET).","Schema definieren und Resolver implementieren.","Abfragen im Browser mit GraphiQL testen."]},tooling:["GraphiQL, Apollo Studio","GraphQL Code Generator","DataLoader"],hello:`query {
  gruss
}`,example:{title:"Schema, Query und Mutation",lang:"graphql",code:`# Schema (Server)
type Produkt {
  id: ID!
  name: String!
  preis: Float!
  bewertungen(limit: Int = 3): [Bewertung!]!
}

type Bewertung {
  sterne: Int!
  text: String
}

type Query {
  produkt(id: ID!): Produkt
}

type Mutation {
  bewerte(produktId: ID!, sterne: Int!, text: String): Bewertung!
}

# Abfrage (Client) – liefert genau diese Felder
query ProduktSeite($id: ID!) {
  produkt(id: $id) {
    name
    preis
    bewertungen(limit: 2) { sterne text }
  }
}`,explanation:"`!` bedeutet „nicht null“. Der Client fordert nur `name`, `preis` und zwei Bewertungen an – nicht mehr, nicht weniger. Variablen (`$id`) werden getrennt übergeben, ähnlich wie Parameter bei Prepared Statements."},ecosystem:[{name:"Apollo",desc:"Client und Server."},{name:"Relay",desc:"React-Client von Meta."},{name:"Hasura / PostGraphile",desc:"GraphQL direkt über Datenbanken."}],bestPractices:["Abfragetiefe und Komplexität begrenzen.","DataLoader gegen N+1-Abfragen.","Autorisierung in der Geschäftslogik, nicht nur im Schema.","Introspection in Produktion bewusst entscheiden."],mistakes:[{title:"Unbegrenzte Verschachtelung erlauben",wrong:"query { nutzer { freunde { freunde { freunde { freunde { name } } } } } }",right:"# Server: Tiefenlimit (z. B. 5) und Kostenanalyse konfigurieren",explanation:"Tief verschachtelte Abfragen können den Server mit exponentiell vielen Resolver-Aufrufen lahmlegen.",lang:"graphql"}],related:["sql","javascript","typescript"],next:["[API-Stile im Vergleich](#/artikel/api-stile)","[REST-API-Design](#/artikel/rest-api-design)"]}],l={html:{advanced:[{title:"Formulare ohne JavaScript",text:'Attribute wie `required`, `type="email"`, `minlength`, `pattern` und `autocomplete` liefern Validierung und Autovervollständigung ohne eine Zeile Skript. Über die Constraint Validation API (`form.checkValidity()`, `setCustomValidity()`) lässt sich das Verhalten gezielt erweitern. Serverseitige Prüfung bleibt trotzdem Pflicht.'},{title:"Responsive Bilder",text:'`srcset` und `sizes` lassen den Browser die passende Auflösung wählen; `<picture>` mit `<source type="image/avif">` liefert moderne Formate mit Fallback. `width`/`height` reservieren Platz und verhindern Layoutverschiebungen (CLS), `loading="lazy"` lädt Bilder außerhalb des Sichtbereichs erst bei Bedarf.'},{title:"Dialog, Popover und Details",text:"`<dialog>` mit `showModal()` bringt Fokusverwaltung und Esc-Taste mit, das `popover`-Attribut erzeugt Menüs und Tooltips ohne JavaScript-Bibliothek, `<details>`/`<summary>` ergibt aufklappbare Bereiche – alle barrierearm und ohne eigene Tastaturbehandlung."}],interview:[{q:"Worin unterscheiden sich `<section>` und `<div>`?",a:"`<div>` ist ein bedeutungsloser Container für Layout. `<section>` gruppiert einen thematischen Abschnitt, der normalerweise eine Überschrift hat; mit zugänglichem Namen (z. B. `aria-labelledby`) wird er für Screenreader zur Region."},{q:"Was bewirken `defer` und `async` bei `<script>`?",a:'Beide laden das Skript parallel zum Parsen. `defer` führt es nach dem Parsen des Dokuments in der Reihenfolge der Einbindung aus; `async` sofort nach dem Laden, ohne garantierte Reihenfolge. `type="module"` verhält sich standardmäßig wie `defer`.'}],exercises:[{title:"Barrierefreies Kontaktformular",task:"Baue ein Formular mit Name, E-Mail (Pflicht) und Nachricht. Jedes Feld braucht ein verknüpftes Label, die E-Mail soll vom Browser validiert werden.",hint:'`<label for>` + `id`, `type="email"`, `required`, `autocomplete`.',solution:`<form action="/kontakt" method="post">
  <label for="name">Name</label>
  <input id="name" name="name" autocomplete="name">

  <label for="email">E-Mail (Pflicht)</label>
  <input id="email" name="email" type="email" autocomplete="email" required>

  <label for="nachricht">Nachricht</label>
  <textarea id="nachricht" name="nachricht" rows="5" required></textarea>

  <button type="submit">Senden</button>
</form>`}],mistakes:[{title:"Nichtssagender Alternativtext",wrong:'<img src="umsatz.png" alt="Bild">',right:`<img src="umsatz.png" alt="Umsatz 2026: Anstieg von 1,2 auf 1,8 Mio. €">
<img src="deko-linie.svg" alt="">`,explanation:'`alt` beschreibt die Aussage des Bildes. Rein dekorative Bilder bekommen ein leeres `alt=""`, damit Screenreader sie überspringen – fehlt das Attribut ganz, wird oft der Dateiname vorgelesen.',lang:"html"}]},css:{advanced:[{title:"Custom Properties & Theming",text:"CSS-Variablen (`--farbe: #2563eb;`, Verwendung mit `var(--farbe)`) folgen der Kaskade und lassen sich in Media Queries oder per Klasse umschalten – die Grundlage für Dark Mode mit `@media (prefers-color-scheme: dark)` und für Designsysteme."},{title:"Container Queries",text:"Mit `container-type: inline-size` auf einem Elternelement reagieren Kinder per `@container (min-width: 400px)` auf die Breite ihres Containers statt des Viewports. Komponenten werden so in Seitenleiste und Hauptbereich gleichermaßen responsiv."},{title:"Kaskadenebenen und :has()",text:"`@layer reset, basis, komponenten;` legt fest, welche Regelgruppen Vorrang haben – unabhängig von der Spezifität. `:has()` wählt Elemente nach ihrem Inhalt aus, etwa `.karte:has(img)` oder `form:has(:invalid)`. Beides ist in allen aktuellen Browsern verfügbar."}],interview:[{q:"Wie wird die Spezifität eines Selektors berechnet?",a:"Gezählt werden drei Stufen: IDs; Klassen, Attribute und Pseudoklassen; Elemente und Pseudoelemente. Höhere Stufen schlagen jede Menge niedrigerer. Bei Gleichstand gewinnt die spätere Regel. Darüber stehen Inline-Styles und `!important`; Kaskadenebenen (`@layer`) werden vor der Spezifität ausgewertet."},{q:"Was ist der Unterschied zwischen `em` und `rem`?",a:"`rem` bezieht sich immer auf die Schriftgröße des Wurzelelements und ist damit vorhersehbar. `em` bezieht sich auf die Schriftgröße des Elements selbst (bei `font-size` auf die des Elternelements) und verstärkt sich bei Verschachtelung."}],exercises:[{title:"Responsives Kartenraster",task:"Ordne beliebig viele Karten in einem Raster an: so viele Spalten wie passen, jede mindestens 240 px breit, mit 1 rem Abstand – ohne Media Queries.",hint:"`grid-template-columns` mit `repeat(auto-fill, minmax(…))`.",solution:`.raster {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}`}],mistakes:[{title:"`z-index` wirkt nicht",wrong:".overlay { z-index: 9999; }   /* bleibt trotzdem hinter dem Header */",right:`.overlay {
  position: relative;   /* oder: Flex-/Grid-Kind */
  z-index: 10;
}`,explanation:"`z-index` wirkt nur auf positionierte Elemente sowie Flex- und Grid-Kinder – und immer nur innerhalb des eigenen Stacking Context. Eigenschaften wie `transform`, `opacity < 1` oder `filter` am Elternelement erzeugen einen neuen Kontext, aus dem auch 9999 nicht herauskommt.",lang:"css"}]},typescript:{exercises:[{title:"Typsicheres groupBy",task:"Schreibe `groupBy(items, schluessel)`, das Elemente nach dem Ergebnis einer Funktion gruppiert. Der Rückgabetyp soll Schlüssel- und Elementtyp kennen.",hint:"Zwei Typparameter: `T` für die Elemente und `K extends PropertyKey` für den Schlüssel.",solution:`function groupBy<T, K extends PropertyKey>(items: readonly T[], schluessel: (item: T) => K): Partial<Record<K, T[]>> {
  const ergebnis: Partial<Record<K, T[]>> = {};
  for (const item of items) {
    const k = schluessel(item);
    (ergebnis[k] ??= []).push(item);
  }
  return ergebnis;
}

const nachStadt = groupBy([{ name: 'Ada', stadt: 'London' }, { name: 'Linus', stadt: 'Helsinki' }], (p) => p.stadt);
// Typ: Partial<Record<string, { name: string; stadt: string }[]>>`},{title:"Vollständige Fallunterscheidung",task:"Modelliere Formen (Kreis, Rechteck, Dreieck) als Discriminated Union und schreibe `flaeche()`, das bei einer neuen, unbehandelten Form einen Compilefehler erzeugt.",solution:`type Form =
  | { art: 'kreis'; r: number }
  | { art: 'rechteck'; b: number; h: number }
  | { art: 'dreieck'; g: number; h: number };

function flaeche(f: Form): number {
  switch (f.art) {
    case 'kreis': return Math.PI * f.r ** 2;
    case 'rechteck': return f.b * f.h;
    case 'dreieck': return (f.g * f.h) / 2;
    default: {
      const unbehandelt: never = f;   // Compilefehler, sobald eine Variante fehlt
      throw new Error(\`Unbekannte Form: \${JSON.stringify(unbehandelt)}\`);
    }
  }
}`}],mistakes:[{title:"`Object.keys` als `keyof` erwarten",wrong:`const preise = { maus: 20, tastatur: 90 };
for (const k of Object.keys(preise)) {
  console.log(preise[k]);   // Fehler: string kann nicht für den Index verwendet werden
}`,right:`for (const [name, preis] of Object.entries(preise)) {
  console.log(name, preis);
}`,explanation:"`Object.keys` liefert bewusst `string[]`: Wegen der strukturellen Typisierung kann ein Objekt zur Laufzeit mehr Eigenschaften haben, als sein Typ verrät. `Object.entries` oder eine explizite, begründete Typzusicherung sind die sauberen Wege.",lang:"typescript"}]},php:{advanced:[{title:"Modernes PHP (8.x)",text:"`declare(strict_types=1);` aktiviert strikte Typprüfung für Skalare. Dazu kommen Constructor Property Promotion, `match`-Ausdrücke, benannte Argumente, Nullsafe-Operator `?->` (8.0), Enums und `readonly`-Eigenschaften (8.1), `readonly`-Klassen (8.2) und Property Hooks (8.4)."},{title:"Composer & Autoloading",text:'Composer verwaltet Abhängigkeiten (`composer require monolog/monolog`) und erzeugt einen Autoloader. Mit PSR-4 (`"autoload": {"psr-4": {"App\\\\": "src/"}}` in `composer.json`) werden Klassen automatisch aus dem passenden Pfad geladen – `require_once` für eigene Klassen entfällt.'},{title:"Ausführungsmodell",text:"Klassisch startet PHP-FPM jede Anfrage mit leerem Zustand („share nothing“) – einfach und robust, OPcache hält den kompilierten Bytecode vor. Langlebige Worker (FrankenPHP, RoadRunner, Swoole) halten die Anwendung im Speicher und sparen Startzeit, erfordern aber Sorgfalt mit globalem Zustand."}],interview:[{q:"Wie unterscheiden sich `==` und `===` in PHP?",a:'`==` vergleicht nach Typumwandlung, `===` vergleicht Typ und Wert. Seit PHP 8 sind Vergleiche zwischen Zahl und nicht-numerischem String vernünftiger (`0 == "a"` ist jetzt `false`), trotzdem ist `===` die sichere Wahl.'},{q:"Wie verhindert man SQL-Injection in PHP?",a:'Mit Prepared Statements über PDO oder mysqli: `$stmt = $pdo->prepare("SELECT * FROM nutzer WHERE email = ?"); $stmt->execute([$email]);`. Werte werden getrennt vom SQL übertragen und nie als Code interpretiert. Tabellen- und Spaltennamen lassen sich nicht binden – dafür eine feste Allowlist verwenden.'}],exercises:[{title:"Worthäufigkeit mit Unicode",task:"Schreibe eine Funktion, die die drei häufigsten Wörter eines Textes liefert – auch mit Umlauten und unabhängig von Groß-/Kleinschreibung.",hint:"`mb_strtolower`, `preg_split` mit dem Modifikator `u`, `array_count_values`, `arsort`.",solution:`<?php
declare(strict_types=1);

function haeufigsteWoerter(string $text, int $anzahl = 3): array
{
    $woerter = preg_split('/[^\\p{L}]+/u', mb_strtolower($text), -1, PREG_SPLIT_NO_EMPTY);
    $zaehlung = array_count_values($woerter);
    arsort($zaehlung);
    return array_slice($zaehlung, 0, $anzahl, true);
}

print_r(haeufigsteWoerter('Der Bär und der Hund. DER Bär schläft.'));
// [der => 3, bär => 2, und => 1]`}],mistakes:[{title:"Ausgabe ohne Escaping",wrong:"<p>Hallo <?= $_GET['name'] ?></p>",right:"<p>Hallo <?= htmlspecialchars($_GET['name'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>",explanation:"Unescaped ausgegebene Benutzereingaben ermöglichen Cross-Site Scripting. Template-Engines wie Twig oder Blade escapen standardmäßig; in reinem PHP muss `htmlspecialchars` konsequent verwendet werden.",lang:"php"}]},java:{exercises:[{title:"Wörter zählen mit Streams",task:"Zähle mit der Stream-API, wie oft jedes Wort in einem Text vorkommt (ohne Groß-/Kleinschreibung, Umlaute korrekt), und gib die drei häufigsten aus.",hint:"`Collectors.groupingBy` mit `Collectors.counting()`, danach nach Wert sortieren.",solution:`import java.util.*;
import java.util.stream.*;

public class Woerter {
    public static void main(String[] args) {
        String text = "Der Bär und der Hund. DER Bär schläft.";
        Map<String, Long> haeufigkeit = Arrays.stream(text.toLowerCase(Locale.ROOT).split("[^\\\\p{L}]+"))
                .filter(w -> !w.isBlank())
                .collect(Collectors.groupingBy(w -> w, Collectors.counting()));

        haeufigkeit.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(3)
                .forEach(e -> System.out.println(e.getKey() + ": " + e.getValue()));
    }
}`},{title:"Records, Sealed Interfaces & Pattern Matching",task:"Modelliere Formen als `sealed interface` mit Records und berechne die Fläche mit einem `switch`-Ausdruck ohne `default`-Zweig (Java 21).",solution:`sealed interface Form permits Kreis, Rechteck {}
record Kreis(double r) implements Form {}
record Rechteck(double b, double h) implements Form {}

static double flaeche(Form f) {
    return switch (f) {
        case Kreis k -> Math.PI * k.r() * k.r();
        case Rechteck(double b, double h) -> b * h;   // Record Pattern
    };   // kein default nötig: der Compiler kennt alle Untertypen
}`}],mistakes:[{title:"`Optional.get()` ohne Prüfung",wrong:"String name = nutzerRepo.findById(id).get();   // NoSuchElementException, wenn leer",right:`String name = nutzerRepo.findById(id)
        .map(Nutzer::name)
        .orElseThrow(() -> new NutzerNichtGefunden(id));`,explanation:"`Optional` soll das Fehlen eines Werts sichtbar machen. `get()` ohne Prüfung macht daraus wieder eine Laufzeitexception – nur mit schlechterer Fehlermeldung. `orElse`, `orElseThrow` mit eigener Exception oder `map` nutzen.",lang:"java"}]},csharp:{exercises:[{title:"Top-Kunden mit LINQ",task:"Gegeben ist eine Liste von Bestellungen (Kunde, Betrag). Ermittle die drei Kunden mit dem höchsten Gesamtumsatz.",solution:`record Bestellung(string Kunde, decimal Betrag);

var bestellungen = new List<Bestellung> {
    new("Ada", 49.90m), new("Linus", 120m), new("Ada", 19.90m), new("Grace", 80m),
};

var top = bestellungen
    .GroupBy(b => b.Kunde)
    .Select(g => new { Kunde = g.Key, Umsatz = g.Sum(b => b.Betrag) })
    .OrderByDescending(x => x.Umsatz)
    .Take(3);

foreach (var t in top) Console.WriteLine($"{t.Kunde}: {t.Umsatz:C}");`}],mistakes:[{title:"`async void`",wrong:"public async void SpeichereAsync() { await _repo.SaveAsync(); }",right:"public async Task SpeichereAsync() { await _repo.SaveAsync(); }",explanation:"`async void`-Methoden lassen sich nicht abwarten, und Exceptions darin können nicht vom Aufrufer gefangen werden – sie landen im Synchronisationskontext und können den Prozess beenden. `async void` nur für Event-Handler verwenden, sonst immer `Task` bzw. `Task<T>`.",lang:"csharp"}]},go:{exercises:[{title:"Mehrere URLs nebenläufig abrufen",task:"Rufe eine Liste von URLs gleichzeitig ab und brich ab, sobald ein Fehler auftritt. Nutze `errgroup` mit Kontext.",hint:"`golang.org/x/sync/errgroup` – `errgroup.WithContext`, `g.Go`, `g.Wait`.",solution:`package main

import (
	"context"
	"fmt"
	"net/http"

	"golang.org/x/sync/errgroup"
)

func ladeAlle(ctx context.Context, urls []string) error {
	g, ctx := errgroup.WithContext(ctx)
	for _, url := range urls {
		g.Go(func() error {
			req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
			if err != nil {
				return err
			}
			res, err := http.DefaultClient.Do(req)
			if err != nil {
				return fmt.Errorf("%s: %w", url, err)
			}
			defer res.Body.Close()
			fmt.Println(url, res.StatusCode)
			return nil
		})
	}
	return g.Wait() // erster Fehler; ctx wird dann für alle anderen abgebrochen
}`}],mistakes:[{title:"In eine nil-Map schreiben",wrong:`var zaehler map[string]int
zaehler["go"]++   // panic: assignment to entry in nil map`,right:`zaehler := make(map[string]int)
zaehler["go"]++`,explanation:"Der Nullwert einer Map ist `nil`: Lesen liefert Nullwerte, Schreiben löst eine Panic aus. Maps immer mit `make` oder einem Literal (`map[string]int{}`) anlegen.",lang:"go"}]},rust:{exercises:[{title:"Wörter zählen mit der Entry-API",task:"Zähle Wörter in einem Text mit `HashMap` und gib die drei häufigsten aus.",hint:"`*map.entry(wort).or_insert(0) += 1;`",solution:`use std::collections::HashMap;

fn main() {
    let text = "der Bär und der Hund der Bär schläft";
    let mut zaehlung: HashMap<&str, usize> = HashMap::new();
    for wort in text.split_whitespace() {
        *zaehlung.entry(wort).or_insert(0) += 1;
    }
    let mut liste: Vec<_> = zaehlung.into_iter().collect();
    liste.sort_by(|a, b| b.1.cmp(&a.1).then(a.0.cmp(b.0)));
    for (wort, anzahl) in liste.iter().take(3) {
        println!("{wort}: {anzahl}");
    }
}`},{title:"Eigener Fehlertyp mit `?`",task:"Lies eine Zahl aus einer Datei. Fehler beim Lesen und beim Parsen sollen in einen eigenen Fehlertyp umgewandelt werden, damit `?` funktioniert.",solution:`use std::{fmt, fs, num::ParseIntError, io};

#[derive(Debug)]
enum KonfigFehler {
    Lesen(io::Error),
    Parsen(ParseIntError),
}

impl fmt::Display for KonfigFehler {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            KonfigFehler::Lesen(e) => write!(f, "Datei nicht lesbar: {e}"),
            KonfigFehler::Parsen(e) => write!(f, "Keine gültige Zahl: {e}"),
        }
    }
}
impl From<io::Error> for KonfigFehler { fn from(e: io::Error) -> Self { Self::Lesen(e) } }
impl From<ParseIntError> for KonfigFehler { fn from(e: ParseIntError) -> Self { Self::Parsen(e) } }

fn lies_port(pfad: &str) -> Result<u16, KonfigFehler> {
    let inhalt = fs::read_to_string(pfad)?;   // io::Error → KonfigFehler
    Ok(inhalt.trim().parse::<u16>()?)         // ParseIntError → KonfigFehler
}`}],mistakes:[{title:"`String` statt `&str` als Parameter",wrong:`fn begruesse(name: String) { println!("Hallo {name}"); }
begruesse(nutzer.name.clone());   // unnötige Kopie`,right:`fn begruesse(name: &str) { println!("Hallo {name}"); }
begruesse(&nutzer.name);`,explanation:"Eine Funktion, die einen Text nur liest, sollte ihn ausleihen (`&str`). Dann akzeptiert sie `&String`, String-Literale und Teilstrings ohne Kopie. `String` als Parameter nur, wenn die Funktion den Besitz wirklich übernehmen muss.",lang:"rust"}]},c:{advanced:[{title:"Zeiger und Arrays",text:"Ein Array „zerfällt“ bei der Übergabe an eine Funktion zu einem Zeiger auf sein erstes Element – die Länge geht verloren und muss separat übergeben werden. `a[i]` ist gleichbedeutend mit `*(a + i)`. Zeigerarithmetik rechnet in Elementgrößen, nicht in Bytes."},{title:"Undefined Behavior",text:"Vorzeichenbehafteter Überlauf, Zugriffe außerhalb von Arrays, uninitialisierte Variablen oder Dereferenzieren von `NULL` sind undefiniert: Der Compiler darf annehmen, dass sie nie passieren, und entsprechend optimieren. Sanitizer (`-fsanitize=address,undefined`) und Warnungen (`-Wall -Wextra`) machen solche Fehler sichtbar."},{title:"Vom Quelltext zum Programm",text:"Präprozessor (Makros, `#include`) → Compiler (C zu Assembler/Objektcode) → Linker (Objektdateien und Bibliotheken zum Programm). Fehler wie „undefined reference“ stammen vom Linker, nicht vom Compiler. Größere Projekte nutzen Make, CMake oder Meson."}],interview:[{q:"Was ist ein Dangling Pointer?",a:"Ein Zeiger, der auf Speicher zeigt, der bereits freigegeben wurde oder nicht mehr gültig ist – etwa nach `free()` oder wenn eine Funktion die Adresse einer lokalen Variable zurückgibt. Zugriffe darauf sind undefiniertes Verhalten; nach `free(p)` daher `p = NULL` setzen."},{q:"Wann landen Daten auf dem Stack, wann auf dem Heap?",a:"Lokale Variablen fester Größe liegen auf dem Stack und verschwinden mit dem Ende der Funktion. Daten, deren Größe erst zur Laufzeit feststeht oder die länger leben sollen, werden mit `malloc` auf dem Heap angelegt und müssen mit `free` freigegeben werden."}],exercises:[{title:"String in-place umkehren",task:"Schreibe `void umkehren(char *s)`, das einen nullterminierten String ohne zusätzlichen Speicher umkehrt.",hint:"Zwei Indizes von außen nach innen laufen lassen und Zeichen tauschen.",solution:`#include <string.h>

void umkehren(char *s) {
    size_t i = 0, j = strlen(s);
    if (j == 0) return;
    for (j--; i < j; i++, j--) {
        char tmp = s[i];
        s[i] = s[j];
        s[j] = tmp;
    }
}
/* Achtung: kehrt Bytes um – Mehrbyte-Zeichen (UTF-8) werden dabei zerstört. */`}],mistakes:[{title:"`sizeof` auf einen Array-Parameter",wrong:`void drucke(int zahlen[]) {
    size_t n = sizeof(zahlen) / sizeof(zahlen[0]);   // Größe eines Zeigers!
}`,right:`void drucke(const int *zahlen, size_t n) {
    for (size_t i = 0; i < n; i++) printf("%d\\n", zahlen[i]);
}`,explanation:"Im Parameter ist `int zahlen[]` nur ein Zeiger. `sizeof` liefert dort die Größe des Zeigers (meist 8), nicht die des Arrays. Die Länge muss als eigener Parameter übergeben werden.",lang:"c"}]},cpp:{advanced:[{title:"Move-Semantik",text:"Rvalue-Referenzen (`T&&`) erlauben es, Ressourcen von temporären Objekten zu „stehlen“, statt sie zu kopieren – etwa den Puffer eines `std::vector`. `std::move` markiert ein Objekt als verschiebbar. Mit der „Rule of Zero“ (nur Standardtypen und Smart Pointer als Member) erzeugt der Compiler korrekte Kopier- und Move-Operationen selbst."},{title:"Templates und Concepts",text:"Templates erzeugen zur Compilezeit Code für jeden verwendeten Typ. C++20-Concepts beschreiben Anforderungen an Typparameter (`template <std::integral T>`) und liefern verständliche Fehlermeldungen statt seitenlanger Template-Fehler."},{title:"Moderne Standardbibliothek",text:"`std::optional`, `std::variant`, `std::string_view` (C++17), Ranges und `std::span` (C++20), `std::expected` und `std::print` (C++23) ersetzen viele fehleranfällige Eigenbauten. Für Container gilt meist: `std::vector` zuerst, wegen Cache-Lokalität oft schneller als verkettete Listen."}],interview:[{q:"Was besagen die Rule of Three, Five und Zero?",a:"Verwaltet eine Klasse eine Ressource selbst, braucht sie Destruktor, Kopierkonstruktor und Kopierzuweisung (Three) sowie Move-Konstruktor und Move-Zuweisung (Five). Besser ist die Rule of Zero: Ressourcen in RAII-Typen (Smart Pointer, Container) kapseln, dann sind keine eigenen Sonderfunktionen nötig."},{q:"Warum ist `std::vector` oft schneller als `std::list`, obwohl Einfügen in der Mitte O(n) kostet?",a:"Ein Vektor liegt zusammenhängend im Speicher; CPUs laden benachbarte Daten in den Cache und lesen sie extrem schnell. Listen verstreuen ihre Knoten über den Heap, jeder Zugriff kann ein Cache-Miss sein. Bei realistischen Größen überwiegt das oft den asymptotischen Vorteil."}],exercises:[{title:"Wörter zählen",task:"Lies Wörter von `std::cin`, zähle sie in einer `std::unordered_map` und gib die drei häufigsten aus.",solution:`#include <algorithm>
#include <iostream>
#include <ranges>
#include <string>
#include <unordered_map>
#include <vector>

int main() {
    std::unordered_map<std::string, int> zaehlung;
    for (std::string wort; std::cin >> wort;) ++zaehlung[wort];

    std::vector<std::pair<std::string, int>> liste(zaehlung.begin(), zaehlung.end());
    std::ranges::sort(liste, [](const auto& a, const auto& b) { return a.second > b.second; });
    for (const auto& [wort, n] : liste | std::views::take(3)) std::cout << wort << ": " << n << '\\n';
}`}],mistakes:[{title:"Iterator nach `erase` weiterverwenden",wrong:`for (auto it = v.begin(); it != v.end(); ++it) {
    if (*it < 0) v.erase(it);   // it ist danach ungültig
}`,right:`std::erase_if(v, [](int x) { return x < 0; });   // C++20
// vorher: v.erase(std::remove_if(v.begin(), v.end(), pred), v.end());`,explanation:"`erase` macht den übergebenen Iterator (bei `std::vector` auch alle folgenden) ungültig. Weiterzählen ist undefiniertes Verhalten. `std::erase_if` oder das Erase-Remove-Idiom lösen das korrekt und effizient.",lang:"cpp"}]},kotlin:{advanced:[{title:"Null-Sicherheit und Smart Casts",text:"Typen sind standardmäßig nicht nullbar; `String?` muss explizit geprüft werden. Nach `if (x != null)` oder `x is String` behandelt der Compiler `x` automatisch als passenden Typ (Smart Cast). `?.`, `?:` (Elvis) und `let` machen Nullprüfungen kompakt."},{title:"Coroutines und Flow",text:"`suspend`-Funktionen pausieren, ohne einen Thread zu blockieren. Structured Concurrency (`coroutineScope`, `viewModelScope`) sorgt dafür, dass gestartete Coroutines abgebrochen werden, wenn ihr Bereich endet. `Flow` modelliert asynchrone Datenströme, etwa für UI-Zustände."},{title:"Data, Sealed und Extension",text:"`data class` erzeugt `equals`, `hashCode`, `toString` und `copy`. `sealed interface` begrenzt Untertypen, sodass `when` vollständig geprüft wird. Extension Functions (`fun String.istEmail(): Boolean`) erweitern bestehende Typen, ohne sie zu ändern."}],interview:[{q:"Was ist der Unterschied zwischen `val`, `var` und `const val`?",a:"`var` ist neu zuweisbar, `val` nur einmal zuweisbar (die Referenz – das Objekt selbst kann veränderlich sein). `const val` ist eine Compile-Zeit-Konstante für primitive Typen und Strings auf oberster Ebene oder in `object`s."},{q:"Wie unterscheiden sich `launch` und `async`?",a:"`launch` startet eine Coroutine ohne Ergebnis und liefert einen `Job`; `async` liefert ein `Deferred<T>`, dessen Ergebnis man mit `await()` abholt. Beide sollten in einem strukturierten Scope gestartet werden."}],exercises:[{title:"Gruppieren und zählen",task:"Zähle die Wörter eines Textes (ohne Groß-/Kleinschreibung) und gib die drei häufigsten aus.",solution:`fun main() {
    val text = "Der Bär und der Hund. DER Bär schläft."
    text.lowercase()
        .split(Regex("[^\\\\p{L}]+"))
        .filter { it.isNotBlank() }
        .groupingBy { it }
        .eachCount()
        .entries
        .sortedByDescending { it.value }
        .take(3)
        .forEach { (wort, anzahl) -> println("$wort: $anzahl") }
}`}],mistakes:[{title:"`GlobalScope.launch`",wrong:"GlobalScope.launch { ladeDaten() }   // läuft weiter, auch wenn der Bildschirm längst geschlossen ist",right:`viewModelScope.launch { ladeDaten() }   // Android
// allgemein: suspend fun … = coroutineScope { launch { … } }`,explanation:"Coroutines in `GlobalScope` gehören zu keinem Lebenszyklus: Sie werden nicht abgebrochen, können Speicherlecks verursachen und ihre Fehler gehen leicht verloren. Structured Concurrency bindet Coroutines an einen Scope mit klarer Lebensdauer.",lang:"kotlin"}]},swift:{advanced:[{title:"Optionals und guard",text:"`String?` kann einen Wert oder `nil` enthalten. `if let`, `guard let` und `??` entpacken sicher; `guard` eignet sich für frühe Ausstiege und hält den Hauptpfad unverschachtelt. Force-Unwrap (`!`) nur, wenn ein `nil` ein Programmierfehler wäre."},{title:"Werttypen und Referenztypen",text:"`struct` und `enum` sind Werttypen: Zuweisung kopiert (dank Copy-on-Write günstig). `class` ist ein Referenztyp mit gemeinsamer Identität. Swift bevorzugt Structs; Klassen nutzt man für geteilten, veränderlichen Zustand oder Vererbung."},{title:"Swift Concurrency",text:"`async`/`await`, `async let` und Task Groups strukturieren Nebenläufigkeit; Actors schützen veränderlichen Zustand. Mit Swift 6 prüft der Compiler im strikten Modus, ob Daten sicher zwischen Tasks geteilt werden (`Sendable`) – Data Races werden zu Compilefehlern."}],interview:[{q:"Wann `struct`, wann `class`?",a:"Standardmäßig `struct` – einfacher zu verstehen, keine ungewollten geteilten Änderungen, thread-freundlicher. `class`, wenn Identität wichtig ist (dasselbe Objekt an mehreren Stellen), für Vererbung oder Interoperabilität mit Objective-C-APIs."},{q:"Was ist ARC, und wie entstehen Retain Cycles?",a:"Automatic Reference Counting gibt Objekte frei, sobald keine starken Referenzen mehr existieren. Zeigen zwei Objekte stark aufeinander (oft: ein Objekt hält eine Closure, die `self` stark einfängt), wird der Zähler nie 0. Lösung: `weak` oder `unowned` Referenzen, z. B. `[weak self]` in Closures."}],exercises:[{title:"Wörter zählen",task:"Zähle die Wörter eines Textes und gib die drei häufigsten aus.",solution:`let text = "der Bär und der Hund der Bär schläft"
let zaehlung = text
    .lowercased()
    .split(whereSeparator: { !$0.isLetter })
    .reduce(into: [String: Int]()) { $0[String($1), default: 0] += 1 }

for (wort, anzahl) in zaehlung.sorted(by: { $0.value > $1.value }).prefix(3) {
    print("\\(wort): \\(anzahl)")
}`}],mistakes:[{title:"Retain Cycle durch Closure",wrong:`class Laden {
    var beiFertig: (() -> Void)?
    func start() {
        beiFertig = { self.aktualisiere() }   // self hält Closure, Closure hält self
    }
}`,right:`beiFertig = { [weak self] in
    self?.aktualisiere()
}`,explanation:"Speichert ein Objekt eine Closure, die `self` stark einfängt, halten sich beide gegenseitig am Leben – ein Speicherleck. Die Capture-Liste `[weak self]` bricht den Zyklus.",lang:"swift"}]}},o={ruby:{advanced:[{title:"Blöcke, Procs und Lambdas",text:"Blöcke (`do … end` bzw. `{ … }`) sind das Herz von Ruby: `each`, `map`, `File.open` nehmen einen Block entgegen, den die Methode mit `yield` aufruft. `Proc.new` und `lambda`/`->` machen Blöcke zu Objekten; Lambdas prüfen die Argumentanzahl und kehren mit `return` nur aus sich selbst zurück."},{title:"Enumerable als Mixin",text:"Wer in einer eigenen Klasse `each` implementiert und `include Enumerable` schreibt, erhält über 50 Methoden geschenkt: `map`, `select`, `sort_by`, `tally`, `each_slice`, `group_by` … Ein Paradebeispiel für Duck Typing und Mixins."},{title:"Metaprogrammierung – mit Bedacht",text:"`define_method`, `method_missing`, `send` und offene Klassen ermöglichen DSLs wie Rails-Routen oder RSpec. Der Preis: schwer auffindbarer Code und Überraschungen. Seit Ruby 2.0 begrenzen Refinements Monkey-Patches auf einen Gültigkeitsbereich."}],interview:[{q:"Was ist der Unterschied zwischen Symbol und String?",a:"Ein Symbol (`:name`) ist ein unveränderlicher, eindeutiger Bezeichner – jedes gleichnamige Symbol ist dasselbe Objekt. Strings sind (ohne `frozen_string_literal`) veränderlich und eigenständige Objekte. Symbole eignen sich als Hash-Schlüssel und Namen, Strings für Text."},{q:"Was macht `yield`?",a:"`yield` ruft den Block auf, der der Methode übergeben wurde, und kann ihm Argumente mitgeben. Mit `block_given?` prüft man, ob überhaupt ein Block vorhanden ist."}],exercises:[{title:"Häufigste Wörter",task:"Gib die drei häufigsten Wörter eines Textes mit ihrer Anzahl aus (Umlaute korrekt, ohne Groß-/Kleinschreibung).",hint:"`scan(/\\p{L}+/)` und `tally` (ab Ruby 2.7).",solution:`text = "Der Bär und der Hund. DER Bär schläft."
text.downcase
    .scan(/\\p{L}+/)
    .tally
    .max_by(3) { |_, anzahl| anzahl }
    .each { |wort, anzahl| puts "#{wort}: #{anzahl}" }`}],mistakes:[{title:"N+1-Abfragen in Rails",wrong:`Artikel.all.each do |a|
  puts a.autor.name     # eine zusätzliche Abfrage pro Artikel
end`,right:`Artikel.includes(:autor).each do |a|
  puts a.autor.name     # Autoren werden in einer Abfrage vorgeladen
end`,explanation:"Jeder Zugriff auf eine nicht geladene Assoziation löst eine eigene Datenbankabfrage aus – bei 100 Artikeln 101 Abfragen. `includes` (bzw. `preload`/`eager_load`) lädt sie gebündelt. Das Gem „bullet“ erkennt solche Muster automatisch.",lang:"ruby"}]},dart:{advanced:[{title:"Sound Null Safety",text:"Seit Dart 2.12 ist ein Typ ohne `?` garantiert nie `null` – zur Compile- und zur Laufzeit. `late` verschiebt die Initialisierung, `required` macht benannte Parameter verpflichtend. Type Promotion grenzt lokale Variablen nach Prüfungen automatisch ein."},{title:"Event Loop und Isolates",text:"Dart führt Code in einem Thread pro Isolate mit Event Loop aus (Microtasks vor Events, ähnlich JavaScript). Für CPU-lastige Arbeit startet `Isolate.run` ein eigenes Isolate mit separatem Speicher; Daten werden per Nachricht übertragen. In Flutter verhindert das ruckelnde Oberflächen."},{title:"Records und Patterns (Dart 3)",text:"Records bündeln mehrere Werte ohne eigene Klasse: `(String, int) ladePaar()`. Patterns zerlegen sie: `final (name, alter) = ladePaar();`. Mit `sealed`-Klassen und `switch`-Ausdrücken prüft der Compiler, ob alle Fälle behandelt sind."}],interview:[{q:"Was ist der Unterschied zwischen `final` und `const`?",a:"`final` wird genau einmal zugewiesen, der Wert darf zur Laufzeit entstehen. `const` muss zur Compilezeit feststehen und ist tief unveränderlich; gleiche `const`-Werte sind dasselbe Objekt. In Flutter sparen `const`-Widgets Neuaufbauten."},{q:"Wie unterscheiden sich Future und Stream?",a:"Ein `Future<T>` liefert irgendwann genau einen Wert oder Fehler; ein `Stream<T>` liefert eine Folge von Werten über die Zeit. Futures wartet man mit `await` ab, Streams durchläuft man mit `await for` oder abonniert sie mit `listen`."}],exercises:[{title:"JSON in typisierte Objekte",task:"Wandle eine JSON-Liste von Produkten (`id`, `name`, `preis`) in eine `List<Produkt>` um und berechne die Gesamtsumme.",solution:`import 'dart:convert';

class Produkt {
  const Produkt({required this.id, required this.name, required this.preis});
  final int id;
  final String name;
  final double preis;

  factory Produkt.fromJson(Map<String, dynamic> j) => Produkt(
        id: j['id'] as int,
        name: j['name'] as String,
        preis: (j['preis'] as num).toDouble(),
      );
}

void main() {
  const roh = '[{"id": 1, "name": "Maus", "preis": 19.9}, {"id": 2, "name": "Tastatur", "preis": 89}]';
  final produkte = (jsonDecode(roh) as List).map((e) => Produkt.fromJson(e as Map<String, dynamic>)).toList();
  final summe = produkte.fold<double>(0, (s, p) => s + p.preis);
  print(summe.toStringAsFixed(2));   // 108.90
}`}],mistakes:[{title:"`BuildContext` nach `await` verwenden",wrong:`onPressed: () async {
  await speichere();
  Navigator.of(context).pop();   // Widget evtl. schon entfernt
}`,right:`onPressed: () async {
  await speichere();
  if (!context.mounted) return;
  Navigator.of(context).pop();
}`,explanation:"Während des `await` kann der Nutzer den Bildschirm verlassen haben. Ein veralteter `BuildContext` führt dann zu Fehlern. Nach jedem `await` mit `context.mounted` (in State-Klassen: `mounted`) prüfen.",lang:"dart"}]},scala:{advanced:[{title:"Case Classes und Pattern Matching",text:"`case class` erzeugt unveränderliche Datentypen mit `equals`, `copy` und Extraktoren. Zusammen mit `sealed trait` bzw. Scala-3-`enum` entstehen algebraische Datentypen, deren `match`-Ausdrücke der Compiler auf Vollständigkeit prüft."},{title:"Givens und Using (Scala 3)",text:"Kontextparameter (`using`) werden automatisch aus passenden `given`-Instanzen befüllt – etwa ein `Ordering[T]` zum Sortieren oder ein Execution Context. In Scala 2 hieß das Konzept `implicit`. Grundlage für Typklassen wie in Cats."},{title:"Collections und for-Comprehensions",text:"Standard-Collections sind unveränderlich; `map`, `flatMap`, `filter`, `foldLeft` und `groupMapReduce` decken die meisten Aufgaben ab. Eine `for`-Comprehension ist syntaktischer Zucker für `flatMap`/`map` und funktioniert ebenso mit `Option`, `Either`, `Future` und Effekttypen."}],interview:[{q:"Was ist der Unterschied zwischen `val`, `var`, `lazy val` und `def`?",a:"`val` wird einmal ausgewertet und ist unveränderlich, `var` ist neu zuweisbar, `lazy val` wird erst beim ersten Zugriff ausgewertet (dann gecacht), `def` bei jedem Zugriff neu."},{q:"Wozu dienen `Option` und `Either`?",a:"`Option[A]` steht für einen Wert, der fehlen kann (`Some`/`None`) – statt `null`. `Either[E, A]` steht für Erfolg (`Right`) oder Fehler (`Left`) mit Fehlerinformation – statt Exceptions im normalen Kontrollfluss."}],exercises:[{title:"Wörter zählen",task:"Zähle die Wörter eines Textes und gib die drei häufigsten aus.",solution:`@main def woerter(): Unit =
  val text = "Der Bär und der Hund. DER Bär schläft."
  text.toLowerCase
    .split("[^\\\\p{L}]+")
    .filter(_.nonEmpty)
    .groupMapReduce(identity)(_ => 1)(_ + _)
    .toSeq
    .sortBy(-_._2)
    .take(3)
    .foreach((wort, n) => println(s"$wort: $n"))`}],mistakes:[{title:"`Await.result` im Produktionscode",wrong:`def ladeNutzer(id: Int): Nutzer =
  Await.result(nutzerDienst.lade(id), 5.seconds)   // blockiert einen Thread`,right:`def ladeNutzer(id: Int): Future[Nutzer] =
  nutzerDienst.lade(id).map(normalisiere)`,explanation:"Blockierendes Warten auf Futures bindet Threads des Execution Context – unter Last droht Thread-Erschöpfung bis hin zum Deadlock. Futures kombinieren (`map`, `flatMap`, `for`) und erst am äußersten Rand des Programms (Framework, Test) abwarten.",lang:"scala"}]},lua:{advanced:[{title:"Metatables und Metamethoden",text:"Eine Metatable verändert das Verhalten einer Tabelle: `__index` (fehlende Schlüssel nachschlagen – Grundlage für Klassen und Vererbung), `__newindex`, `__add`/`__eq` (Operatoren überladen), `__call` (Tabelle aufrufbar machen), `__gc` und `__close` (Aufräumen)."},{title:"Lua als eingebettete Sprache",text:"Lua ist klein (wenige hundert KB) und über eine schlanke C-API einbettbar. Deshalb steckt es in Spielen und Engines (Roblox mit Luau, World of Warcraft, Defold), in Nginx (OpenResty), Redis (Skripte), Neovim und Netzwerkgeräten. LuaJIT erreicht durch JIT-Kompilierung sehr hohe Geschwindigkeit."},{title:"Varargs und mehrere Rückgabewerte",text:'Funktionen können mehrere Werte zurückgeben (`return a, b`) und beliebig viele Argumente annehmen (`...`, mit `select("#", ...)` gezählt, mit `table.pack(...)` gesammelt). `pcall` nutzt das: erster Rückgabewert ist der Erfolg, danach Ergebnis oder Fehlermeldung.'}],interview:[{q:"Was ist der Unterschied zwischen `.` und `:` beim Methodenaufruf?",a:"`obj:methode(x)` ist Kurzform für `obj.methode(obj, x)` – das Objekt wird als erstes Argument `self` übergeben. Entsprechend definiert `function Klasse:methode(x)` einen impliziten Parameter `self`."},{q:"Warum ist `local` so wichtig?",a:"Variablen ohne `local` sind global – sichtbar im ganzen Programm, langsamer im Zugriff und Quelle schwer auffindbarer Fehler, wenn zwei Teile denselben Namen verwenden. Lokale Variablen sind schneller und auf ihren Block beschränkt."}],exercises:[{title:"Wörter zählen",task:"Zähle die Wörter eines (ASCII-)Textes und gib alle Wörter sortiert nach Häufigkeit aus.",hint:'`gmatch("%a+")` liefert alle Buchstabenfolgen; `table.sort` mit eigener Vergleichsfunktion.',solution:`local text = "der hund und der ball und der baum"
local zaehlung = {}
for wort in text:lower():gmatch("%a+") do
  zaehlung[wort] = (zaehlung[wort] or 0) + 1
end

local liste = {}
for wort, n in pairs(zaehlung) do liste[#liste + 1] = { wort = wort, n = n } end
table.sort(liste, function(a, b) return a.n > b.n or (a.n == b.n and a.wort < b.wort) end)

for _, e in ipairs(liste) do print(e.wort, e.n) end
-- %a ist ASCII- bzw. locale-abhängig; für UTF-8-Wörter z. B. die Bibliothek luautf8 nutzen`}],mistakes:[{title:"`#` bei Tabellen mit Lücken",wrong:`local t = { 1, 2, nil, 4 }
print(#t)   -- 4 oder 2 – beides ist erlaubt!`,right:`local t = { n = 4, 1, 2, nil, 4 }   -- Länge selbst mitführen
-- oder: table.pack(…) setzt das Feld n automatisch`,explanation:"Der Längenoperator ist nur für Sequenzen (lückenlose Indizes 1…n) definiert. Mit `nil`-Lücken darf `#` jede „Grenze“ liefern. Wer Lücken braucht, speichert die Länge separat.",lang:"lua"}]},perl:{advanced:[{title:"Skalarer und Listenkontext",text:"Ausdrücke verhalten sich je nach Kontext unterschiedlich: `my @zeilen = <$fh>;` liest alle Zeilen, `my $zeile = <$fh>;` nur eine; ein Array im skalaren Kontext liefert seine Länge. Wer Perl liest, muss den Kontext mitdenken."},{title:"Reguläre Ausdrücke als Sprachkern",text:"Perls Regex-Syntax wurde zum Vorbild für PCRE, Python, JavaScript und viele andere. `=~ m/…/` sucht, `s/…/…/` ersetzt, benannte Gruppen landen in `%+`. Modifikatoren wie `/x` erlauben kommentierte, mehrzeilige Muster."},{title:"Modernes Perl",text:"`use v5.36;` aktiviert `strict`, `warnings`, `say` und Funktionssignaturen (`sub addiere($a, $b) { … }`). Module kommen aus CPAN, verwaltet mit `cpanm` oder Carton. Perl 5 wird aktiv weiterentwickelt; Raku (früher Perl 6) ist eine eigenständige Sprache."}],interview:[{q:"Was bedeuten die Sigils `$`, `@` und `%`?",a:"`$` kennzeichnet einen Skalar (ein Wert), `@` ein Array, `%` einen Hash. Beim Zugriff auf ein einzelnes Element wird das Sigil zu `$`: `$liste[0]`, `$alter{Ada}` – man greift auf einen Skalar zu."},{q:"Was ist `$_`?",a:"Die Standardvariable: Viele Funktionen und Schleifen verwenden sie implizit (`for (@liste) { print }`, `while (<STDIN>) { chomp; … }`). Praktisch in Einzeilern, in längerem Code lieber benannte Variablen verwenden."}],exercises:[{title:"Wörter zählen",task:"Lies Text von der Standardeingabe und gib die zehn häufigsten Wörter aus.",solution:`#!/usr/bin/env perl
use v5.36;

my %zaehlung;
while (my $zeile = <STDIN>) {
    $zaehlung{lc $1}++ while $zeile =~ /(\\w+)/g;
}
my @top = (sort { $zaehlung{$b} <=> $zaehlung{$a} } keys %zaehlung)[0 .. 9];
say "$_: $zaehlung{$_}" for grep { defined } @top;`}],mistakes:[{title:"Zwei-Argument-`open` mit Bareword-Handle",wrong:"open(FH, $datei) or die;   # Modus steckt im Dateinamen – manipulierbar",right:`open(my $fh, '<', $datei) or die "Kann $datei nicht öffnen: $!";`,explanation:"Beim Zwei-Argument-`open` interpretiert Perl Zeichen wie `>` oder `|` im Dateinamen als Modus – ein Dateiname aus Benutzereingaben kann so Befehle ausführen. Die Drei-Argument-Form mit lexikalischem Handle trennt Modus und Name sauber.",lang:"perl"}]},r:{advanced:[{title:"Vektorisierung",text:"Fast alle Operationen arbeiten elementweise auf ganzen Vektoren: `x * 2`, `log(x)`, `x[x > 0]`. Vektorisierter Code ist kürzer und um Größenordnungen schneller als Schleifen, weil die Arbeit in optimiertem C-Code stattfindet."},{title:"Tidyverse und Pipes",text:"dplyr (`filter`, `mutate`, `group_by`, `summarise`), tidyr und ggplot2 bilden eine konsistente Grammatik für Datenanalyse. Der native Pipe-Operator `|>` (seit R 4.1) verkettet Schritte lesbar; im Tidyverse ist auch `%>%` verbreitet."},{title:"Faktoren und fehlende Werte",text:"Faktoren speichern kategoriale Daten mit festen Stufen – wichtig für Modelle und Diagramme. `NA` markiert fehlende Werte und „infiziert“ Berechnungen (`mean(c(1, NA))` ist `NA`), bis man es mit `na.rm = TRUE` oder `is.na()` explizit behandelt."}],interview:[{q:"Was ist der Unterschied zwischen Vektor und Liste?",a:"Ein atomarer Vektor enthält Elemente eines einzigen Typs (`c(1, 2, 3)`); gemischte Werte werden umgewandelt. Eine Liste kann beliebige Objekte enthalten, auch andere Listen oder Data Frames. Ein Data Frame ist eine Liste gleich langer Spaltenvektoren."},{q:"Wie unterscheiden sich `NA` und `NULL`?",a:"`NA` ist ein fehlender Wert innerhalb eines Vektors und hat eine Position (Länge 1). `NULL` ist die Abwesenheit eines Objekts (Länge 0); `c(1, NULL, 2)` ergibt `c(1, 2)`."}],exercises:[{title:"Gruppenauswertung",task:"Berechne mit dplyr für den eingebauten Datensatz `mtcars` den durchschnittlichen Verbrauch (`mpg`) und die Anzahl der Fahrzeuge je Zylinderzahl (`cyl`), absteigend sortiert nach Verbrauch.",solution:`library(dplyr)

mtcars |>
  group_by(cyl) |>
  summarise(anzahl = n(), mpg_schnitt = mean(mpg)) |>
  arrange(desc(mpg_schnitt))`}],mistakes:[{title:"Faktor direkt in Zahl umwandeln",wrong:`f <- factor(c("10", "5", "20"))
as.numeric(f)   # 1 3 2 – die internen Stufencodes!`,right:`as.numeric(as.character(f))   # 10 5 20
# effizienter bei vielen Werten: as.numeric(levels(f))[f]`,explanation:"Intern speichert ein Faktor ganze Zahlen, die auf die Stufen verweisen. `as.numeric` liefert diese Codes, nicht die dargestellten Werte – ein klassischer, stiller Fehler beim Einlesen von Daten.",lang:"r"}]},bash:{advanced:[{title:"Strikter Modus und Aufräumen",text:"`set -euo pipefail` bricht bei Fehlern, ungesetzten Variablen und fehlgeschlagenen Pipeline-Teilen ab. `trap 'aufraeumen' EXIT` sorgt dafür, dass temporäre Dateien auch bei Abbruch entfernt werden. Details und Ausnahmen im Artikel [Bash-Scripting](#/artikel/bash-scripting)."},{title:"Umleitungen und Prozesssubstitution",text:"`2>&1` leitet stderr auf stdout um, `&>` beides in eine Datei, `<<<` übergibt einen String als Eingabe. Prozesssubstitution `<(befehl)` stellt die Ausgabe eines Befehls als Datei bereit: `diff <(sort a.txt) <(sort b.txt)`."},{title:"Arrays richtig verwenden",text:'Indizierte Arrays (`liste=(a "b c" d)`) und assoziative Arrays (`declare -A alter=([Ada]=36)`) vermeiden Probleme mit Leerzeichen, die man mit Strings hätte. Expansion immer gequotet: `"${liste[@]}"` liefert jedes Element als eigenes Wort.'}],interview:[{q:'Was ist der Unterschied zwischen `"$@"` und `"$*"`?',a:'`"$@"` expandiert zu allen Argumenten als einzelne, korrekt gequotete Wörter – richtig zum Weiterreichen. `"$*"` fügt alle Argumente zu einem einzigen String zusammen (getrennt durch das erste Zeichen von `IFS`).'},{q:"Warum `[[ … ]]` statt `[ … ]`?",a:"`[[` ist ein Bash-Schlüsselwort: Variablen darin werden nicht an Leerzeichen getrennt, `&&`, `||`, Muster (`==`) und reguläre Ausdrücke (`=~`) sind erlaubt. `[` ist ein normaler Befehl mit allen Quoting-Fallen – aber POSIX-kompatibel für `/bin/sh`-Skripte."}],exercises:[{title:"Top-5-IP-Adressen aus einem Access-Log",task:"Ermittle aus einem Nginx-Access-Log (`access.log`, IP-Adresse ist das erste Feld) die fünf IP-Adressen mit den meisten Anfragen.",hint:"`awk`, `sort`, `uniq -c`, `sort -rn`, `head`.",solution:`awk '{ print $1 }' access.log | sort | uniq -c | sort -rn | head -n 5

# Variante nur mit awk:
awk '{ n[$1]++ } END { for (ip in n) print n[ip], ip }' access.log | sort -rn | head -n 5`}],mistakes:[{title:"`cd` ohne Fehlerprüfung",wrong:`cd /var/app/tmp
rm -rf ./*      # schlägt cd fehl, wird im AKTUELLEN Verzeichnis gelöscht`,right:`cd /var/app/tmp || exit 1
rm -rf ./*
# oder: rm -rf -- /var/app/tmp/*`,explanation:"Existiert das Verzeichnis nicht, bleibt das Skript im aktuellen Verzeichnis – und löscht dort. Kritische `cd`-Befehle immer absichern (oder `set -e`) bzw. mit absoluten Pfaden arbeiten.",lang:"bash"}]},powershell:{advanced:[{title:"Die Objekt-Pipeline",text:"Cmdlets geben .NET-Objekte weiter, keinen Text. `Get-Process | Where-Object CPU -gt 100 | Sort-Object CPU -Descending | Select-Object -First 5 Name, CPU` filtert und sortiert über Eigenschaften – ohne Spalten zu parsen. `Get-Member` zeigt, welche Eigenschaften ein Objekt hat."},{title:"Fehlerbehandlung",text:"Viele Cmdlet-Fehler sind „nicht beendend“: Sie werden ausgegeben, das Skript läuft weiter, und `try/catch` greift nicht. `-ErrorAction Stop` (oder `$ErrorActionPreference = 'Stop'`) macht sie zu beendenden Fehlern. Bei externen Programmen den Exit Code über `$LASTEXITCODE` prüfen."},{title:"PowerShell 7 und Windows PowerShell",text:"Windows PowerShell 5.1 ist in Windows enthalten und basiert auf .NET Framework; PowerShell 7 (`pwsh`) ist plattformübergreifend (Windows, Linux, macOS), basiert auf modernem .NET und bringt u. a. `??`, `?.`, Ternäroperator und `ForEach-Object -Parallel`."}],interview:[{q:"Was ist der Unterschied zwischen `Write-Host` und `Write-Output`?",a:"`Write-Output` schreibt Objekte in die Pipeline – sie können weiterverarbeitet, gespeichert oder umgeleitet werden. `Write-Host` schreibt direkt in die Konsole (seit 5.0 in den Information-Stream) und eignet sich nur für reine Anzeige."},{q:"Was ist Splatting?",a:"Parameter werden als Hashtable gesammelt und mit `@` übergeben: `$p = @{ Path = 'C:\\Logs'; Filter = '*.log' }; Get-ChildItem @p`. Das macht lange Aufrufe lesbar und Parameter bedingt kombinierbar."}],exercises:[{title:"Größte Dateien finden",task:"Finde die zehn größten Dateien unterhalb des aktuellen Verzeichnisses und gib Pfad und Größe in MB (eine Nachkommastelle) aus.",solution:`Get-ChildItem -Recurse -File -ErrorAction SilentlyContinue |
    Sort-Object Length -Descending |
    Select-Object -First 10 FullName, @{ Name = 'MB'; Expression = { [math]::Round($_.Length / 1MB, 1) } } |
    Format-Table -AutoSize`}],mistakes:[{title:"`$null` rechts im Vergleich",wrong:`$ergebnis = @('a', $null, 'b')
if ($ergebnis -eq $null) { 'leer' }   # filtert das Array, statt zu vergleichen`,right:"if ($null -eq $ergebnis) { 'leer' }",explanation:"Steht links ein Array, wirkt `-eq` als Filter und liefert die passenden Elemente – das Ergebnis ist dann ein Array statt eines Wahrheitswerts. Mit `$null` auf der linken Seite ist der Vergleich eindeutig. PSScriptAnalyzer warnt davor.",lang:"powershell"}]},matlab:{advanced:[{title:"Vektorisierung und Vorbelegung",text:"Operationen auf ganzen Matrizen (`y = x.^2 + 3*x`) sind schneller und klarer als Schleifen. Wo Schleifen nötig sind, Ergebnisarrays vorab anlegen (`y = zeros(1, n)`) – wachsende Arrays werden bei jedem Schritt kopiert."},{title:"Indizierung",text:"MATLAB indiziert ab 1, `end` bezeichnet das letzte Element. Logische Indizierung (`x(x > 0)`) filtert, lineare Indizierung behandelt Matrizen als Spaltenvektor. `A(:, 2)` ist die zweite Spalte, `A(2, :)` die zweite Zeile."},{title:"Implizite Erweiterung",text:"Seit R2016b werden Arrays kompatibler Größe automatisch erweitert: `X - mean(X)` zieht von jeder Spalte ihren Mittelwert ab, ohne `repmat` oder `bsxfun`."}],interview:[{q:"Worin unterscheiden sich `*` und `.*`?",a:"`*` ist die Matrixmultiplikation (Zeilen mal Spalten, Dimensionen müssen passen), `.*` multipliziert elementweise. Entsprechend `/` vs. `./` und `^` vs. `.^`."},{q:"Wann Zell-Array, wann Struct?",a:"Zell-Arrays (`{}`) speichern Elemente beliebigen Typs und beliebiger Größe in einer indizierten Anordnung, etwa Texte unterschiedlicher Länge. Structs gruppieren benannte Felder (`p.name`, `p.alter`). Für tabellarische Daten ist `table` meist die beste Wahl."}],exercises:[{title:"Spalten standardisieren",task:"Standardisiere jede Spalte einer Matrix `X` (Mittelwert 0, Standardabweichung 1) ohne Schleife.",solution:`X = [1 10; 2 20; 3 30; 4 40];
Z = (X - mean(X)) ./ std(X);   % implizite Erweiterung (ab R2016b)
disp(mean(Z));                 % ≈ [0 0]
disp(std(Z));                  % [1 1]`}],mistakes:[{title:"Array in der Schleife wachsen lassen",wrong:`for k = 1:100000
    quadrate(k) = k^2;   % Array wächst bei jedem Schritt
end`,right:`quadrate = zeros(1, 100000);
for k = 1:100000
    quadrate(k) = k^2;
end
% oder vektorisiert: quadrate = (1:100000).^2;`,explanation:"Wächst ein Array, muss MATLAB wiederholt neuen Speicher anlegen und kopieren. Vorbelegung mit `zeros` oder direkte Vektorisierung ist um ein Vielfaches schneller; der Editor markiert solche Stellen mit einer Warnung.",lang:"matlab"}]},julia:{advanced:[{title:"Multiple Dispatch",text:"Julia wählt die aufzurufende Methode anhand der Typen **aller** Argumente. `kollision(a::Asteroid, b::Schiff)` und `kollision(a::Schiff, b::Schiff)` sind getrennte Methoden derselben Funktion. Pakete können so Funktionen anderer Pakete für eigene Typen erweitern – ein Grund für das gut zusammenspielende Ökosystem."},{title:"Typstabilität",text:"Code ist schnell, wenn der Compiler den Rückgabetyp aus den Argumenttypen ableiten kann. Eine Funktion, die mal `Int` und mal `Float64` zurückgibt, ist typinstabil und langsamer. `@code_warntype` macht solche Stellen sichtbar; `BenchmarkTools.@btime` misst zuverlässig."},{title:"Broadcasting",text:"Ein Punkt macht jede Funktion elementweise: `sin.(x)`, `x .+ 1`, `@. y = 2x^2 + 3x`. Mehrere gepunktete Operationen werden zu einer einzigen Schleife verschmolzen, ohne Zwischenarrays."}],interview:[{q:"Was ist Multiple Dispatch, und wie unterscheidet es sich von OOP-Methoden?",a:"In klassischer OOP entscheidet nur der Typ des Objekts vor dem Punkt (`obj.methode()`), welche Implementierung läuft. Bei Multiple Dispatch entscheiden die Typen aller Argumente; Methoden gehören zu Funktionen, nicht zu Klassen."},{q:"Warum ist der erste Aufruf einer Funktion oft langsam?",a:"Julia kompiliert eine Methode beim ersten Aufruf für die konkreten Argumenttypen (JIT). Diese „Time to first X“ wurde seit Julia 1.9 durch das Zwischenspeichern von nativem Code in Paketen stark reduziert; Folgeaufrufe laufen mit voller Geschwindigkeit."}],exercises:[{title:"Eigener Typ mit Operatoren",task:"Definiere einen 2D-Vektortyp, für den `+` und `*` (mit einer Zahl) funktionieren, sowie eine Funktion für die Länge.",solution:`struct Vektor2
    x::Float64
    y::Float64
end

Base.:+(a::Vektor2, b::Vektor2) = Vektor2(a.x + b.x, a.y + b.y)
Base.:*(k::Real, v::Vektor2) = Vektor2(k * v.x, k * v.y)
laenge(v::Vektor2) = hypot(v.x, v.y)

v = Vektor2(3, 4) + Vektor2(0, 0)
println(laenge(2 * v))   # 10.0`}],mistakes:[{title:"Indizes ab 0",wrong:`werte = [10, 20, 30]
werte[0]   # BoundsError`,right:`werte[1]        # erstes Element
werte[end]      # letztes Element
for i in eachindex(werte) … end`,explanation:"Julia indiziert wie MATLAB, R und Fortran ab 1. Mit `eachindex`, `firstindex`/`lastindex` und `end` bleibt Code unabhängig davon korrekt – auch für Arrays mit abweichenden Indizes (OffsetArrays).",lang:"julia"}]},assembly:{advanced:[{title:"Register und Aufrufkonventionen",text:"Unter Linux/macOS (System V AMD64) werden die ersten sechs Ganzzahlargumente in `rdi`, `rsi`, `rdx`, `rcx`, `r8`, `r9` übergeben, der Rückgabewert steht in `rax`. Windows x64 nutzt `rcx`, `rdx`, `r8`, `r9`. Die Konvention legt auch fest, welche Register eine Funktion erhalten muss (callee-saved)."},{title:"Stack und Stack Frames",text:"`call` legt die Rücksprungadresse auf den Stack und springt, `ret` nimmt sie wieder herunter. Lokale Variablen liegen relativ zu `rsp` bzw. `rbp`. Vor einem `call` muss der Stack in System V auf 16 Byte ausgerichtet sein."},{title:"Compiler-Ausgabe lesen",text:"Assembly wird heute vor allem gelesen: zum Verstehen von Optimierungen, für Performance-Analysen, Reverse Engineering und Sicherheitsforschung. Der Compiler Explorer (godbolt.org) zeigt live, was `gcc -O2` oder `clang -O2` aus C-, C++- oder Rust-Code macht."}],interview:[{q:"Was passiert bei `call` und `ret`?",a:"`call ziel` legt die Adresse des nächsten Befehls auf den Stack und setzt den Befehlszeiger auf `ziel`. `ret` holt diese Adresse vom Stack und springt dorthin zurück. Wird der Stack dazwischen beschädigt (Buffer Overflow), springt `ret` an eine falsche Adresse – die Grundlage klassischer Exploits."},{q:"Warum schreibt man heute selten ganze Programme in Assembly?",a:"Moderne Compiler erzeugen in der Regel ebenso guten oder besseren Code, und Assembly ist nicht portabel, schwer zu warten und fehleranfällig. Handgeschriebenes Assembly bleibt für Bootloader, Betriebssystemkerne, kryptografische Routinen, SIMD-Optimierungen und eingebettete Systeme relevant."}],exercises:[{title:"Funktion für C schreiben",task:"Schreibe in NASM-Syntax (x86-64, System V) eine Funktion `long addiere(long a, long b)`, die aus C aufgerufen werden kann.",solution:`; addiere.asm – assemblieren: nasm -f elf64 addiere.asm
global addiere
section .text
addiere:
    lea rax, [rdi + rsi]   ; rax = a + b (a in rdi, b in rsi)
    ret

; C-Seite:  long addiere(long a, long b);
;           gcc main.c addiere.o -o app`}],mistakes:[{title:"Stack vor `call` nicht ausgerichtet",wrong:`push rbx          ; Stack jetzt um 8 Byte verschoben
call printf       ; kann mit SSE-Befehlen abstürzen`,right:`push rbx
sub rsp, 8        ; wieder auf 16 Byte ausrichten
call printf
add rsp, 8
pop rbx`,explanation:"Die System-V-Konvention verlangt, dass `rsp` beim `call` ein Vielfaches von 16 ist. Bibliotheksfunktionen nutzen ausgerichtete SSE-Befehle; ein falsch ausgerichteter Stack führt zu sporadischen Abstürzen.",lang:"nasm"}]},solidity:{advanced:[{title:"Gas und Speicherorte",text:"Jede Operation kostet Gas; Schreiben in `storage` (dauerhaft auf der Blockchain) ist besonders teuer, `memory` existiert nur während des Aufrufs, `calldata` ist schreibgeschützte Eingabe und am günstigsten für externe Parameter. Schleifen über wachsende Arrays können Funktionen unbrauchbar teuer machen."},{title:"Checks-Effects-Interactions",text:"Erst Bedingungen prüfen, dann den eigenen Zustand ändern, zuletzt externe Verträge aufrufen oder Ether senden. Diese Reihenfolge – ergänzt um `ReentrancyGuard` aus OpenZeppelin – verhindert Reentrancy-Angriffe wie beim DAO-Hack 2016."},{title:"Unveränderlichkeit und Upgrades",text:"Ein veröffentlichter Vertrag lässt sich nicht ändern. Upgrade-Muster (Proxy mit austauschbarer Implementierung, z. B. UUPS) erlauben Fehlerbehebungen, führen aber Vertrauens- und Komplexitätsfragen ein. Deshalb gehören Audits, umfangreiche Tests (Foundry, Hardhat) und bewährte Bibliotheken zum Standard."}],interview:[{q:"Was ist der Unterschied zwischen `view` und `pure`?",a:"`view`-Funktionen lesen den Zustand, ändern ihn aber nicht; `pure`-Funktionen lesen ihn nicht einmal. Werden sie von außen (nicht aus einer Transaktion) aufgerufen, kosten sie kein Gas."},{q:"Warum darf man `tx.origin` nicht zur Autorisierung nutzen?",a:"`tx.origin` ist der Account, der die Transaktion ursprünglich gestartet hat, `msg.sender` der unmittelbare Aufrufer. Ruft ein Opfer einen bösartigen Vertrag auf, der wiederum deinen Vertrag aufruft, ist `tx.origin` das Opfer – Prüfungen darauf lassen sich so umgehen. Immer `msg.sender` prüfen."}],exercises:[{title:"Minimaler Token",task:"Schreibe einen Vertrag mit Guthaben je Adresse, einem Startguthaben für den Ersteller und einer `transfer`-Funktion mit Prüfungen und Event.",hint:"Seit Solidity 0.8 werfen Über- und Unterläufe automatisch. Für echte Tokens den ERC-20-Standard von OpenZeppelin verwenden.",solution:`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EinfacherToken {
    mapping(address => uint256) public guthaben;
    event Transfer(address indexed von, address indexed an, uint256 betrag);

    constructor(uint256 anfangsbestand) {
        guthaben[msg.sender] = anfangsbestand;
    }

    function transfer(address an, uint256 betrag) external {
        require(an != address(0), "Ungueltige Adresse");
        require(guthaben[msg.sender] >= betrag, "Guthaben zu gering");
        guthaben[msg.sender] -= betrag;      // Effects vor Interactions
        guthaben[an] += betrag;
        emit Transfer(msg.sender, an, betrag);
    }
}`}],mistakes:[{title:"`tx.origin` zur Autorisierung",wrong:'require(tx.origin == besitzer, "Nicht berechtigt");',right:`require(msg.sender == besitzer, "Nicht berechtigt");
// besser: OpenZeppelin Ownable bzw. AccessControl`,explanation:"Über einen zwischengeschalteten bösartigen Vertrag kann ein Angreifer Aktionen im Namen des eigentlichen Besitzers auslösen, weil `tx.origin` weiterhin dessen Adresse ist. `msg.sender` ist der direkte Aufrufer.",lang:"solidity"}]},graphql:{advanced:[{title:"Schema-Design und Nullbarkeit",text:"Felder sind standardmäßig nullbar; `!` macht sie verpflichtend. Weil ein Fehler in einem Non-Null-Feld bis zum nächsten nullbaren Elternfeld „hochblubbert“, sollte man `!` bewusst setzen. Schema zuerst entwerfen (Schema First) und nach Anwendungsfällen statt nach Datenbanktabellen schneiden."},{title:"N+1 und DataLoader",text:"Resolver laufen pro Feld und Objekt – eine Liste von 50 Artikeln mit Autor erzeugt naiv 51 Datenbankabfragen. Ein DataLoader sammelt alle Autor-IDs eines Durchlaufs und lädt sie in einer gebündelten Abfrage; zusätzlich cacht er pro Anfrage."},{title:"Sicherheit und Betrieb",text:"Clients können beliebig verschachtelte, teure Abfragen stellen. Gegenmittel: Tiefen- und Komplexitätslimits, Paginierung mit Obergrenze, Timeouts, Persisted Queries (nur vorab registrierte Abfragen zulassen) und Autorisierung auf Feldebene. Introspection in Produktion abwägen."}],interview:[{q:"Wann GraphQL, wann REST?",a:"GraphQL spielt seine Stärken aus, wenn viele Clients (Web, Apps) unterschiedliche Ausschnitte derselben, stark vernetzten Daten brauchen – ohne Over- und Underfetching. REST ist einfacher, nutzt HTTP-Caching direkt und passt gut zu ressourcenorientierten, öffentlichen APIs."},{q:"Was ist ein Resolver?",a:"Eine Funktion, die den Wert eines Felds im Schema liefert. Sie erhält das Elternobjekt, die Argumente, einen Kontext (z. B. angemeldeter Nutzer, DataLoader) und Infos zur Abfrage. Felder ohne eigenen Resolver lesen standardmäßig die gleichnamige Eigenschaft des Elternobjekts."}],exercises:[{title:"Abfrage mit Variablen und Fragment",task:"Schreibe eine Abfrage, die zu einer Produkt-ID Name, Preis und die ersten drei Bewertungen (mit Autorname) lädt. Die ID soll als Variable übergeben werden; die Autorfelder als wiederverwendbares Fragment.",solution:`fragment AutorInfo on Nutzer {
  id
  name
}

query Produkt($id: ID!) {
  produkt(id: $id) {
    name
    preis
    bewertungen(first: 3) {
      sterne
      text
      autor { ...AutorInfo }
    }
  }
}

# Variablen: { "id": "p-42" }`}],mistakes:[{title:"Listen ohne Begrenzung",wrong:`type Query {
  produkte: [Produkt!]!          # liefert ALLE Produkte
}`,right:`type Query {
  produkte(first: Int = 20, after: String): ProduktConnection!
}
# Server begrenzt first z. B. auf maximal 100`,explanation:"Eine unbegrenzte Liste wird mit wachsendem Datenbestand zum Performance- und DoS-Problem. Cursor-basierte Paginierung (Connections nach Relay-Spezifikation) mit serverseitiger Obergrenze ist der übliche Weg.",lang:"graphql"}]}},d={swift:{example:{title:"Typisierter API-Client mit async/await und Codable",lang:"swift",filename:"ProduktAPI.swift",code:`import Foundation

struct Produkt: Codable, Identifiable {
    let id: Int
    let name: String
    let preis: Double
}

enum APIFehler: Error {
    case ungueltigeAntwort(status: Int)
}

struct ProduktAPI {
    let basis = URL(string: "https://api.example.com")!

    func alle() async throws -> [Produkt] {
        let url = basis.appending(path: "produkte")
        let (daten, antwort) = try await URLSession.shared.data(from: url)
        guard let http = antwort as? HTTPURLResponse else { throw APIFehler.ungueltigeAntwort(status: -1) }
        guard (200..<300).contains(http.statusCode) else { throw APIFehler.ungueltigeAntwort(status: http.statusCode) }
        return try JSONDecoder().decode([Produkt].self, from: daten)
    }
}

// Aufruf, z. B. in einer SwiftUI-View:
// .task { produkte = (try? await ProduktAPI().alle()) ?? [] }`,explanation:"`Codable` erzeugt das Dekodieren aus JSON automatisch, sofern die Feldnamen übereinstimmen. `async throws` macht Netzwerkfehler und Statusprüfung explizit, ohne Callback-Verschachtelung. `.task` in SwiftUI startet den Aufruf beim Erscheinen der View und bricht ihn automatisch ab, wenn sie verschwindet."}},ruby:{example:{title:"CSV-Bericht: Umsatz je Kategorie",lang:"ruby",filename:"bericht.rb",code:`require "csv"

# verkaeufe.csv:
# datum,kategorie,betrag
# 2026-11-01,Technik,89.90
# 2026-11-01,Buch,34.90
# 2026-11-02,Technik,24.50

zeilen = CSV.read("verkaeufe.csv", headers: true, converters: :numeric)

umsatz = zeilen
  .group_by { |z| z["kategorie"] }
  .transform_values { |gruppe| gruppe.sum { |z| z["betrag"] } }
  .sort_by { |_, summe| -summe }

umsatz.each do |kategorie, summe|
  puts format("%-10s %10.2f €", kategorie, summe)
end`,explanation:"`headers: true` liefert Zeilen, auf die man per Spaltenname zugreift; `converters: :numeric` wandelt Zahlen automatisch um. `group_by`, `transform_values` und `sort_by` zeigen den typischen Ruby-Stil: Datenumformung als Kette von Blöcken."}},dart:{example:{title:"Flutter: Liste aus einer API laden",lang:"dart",filename:"produkt_liste.dart",code:`import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

Future<List<String>> ladeProdukte() async {
  final antwort = await http.get(Uri.parse('https://api.example.com/produkte'));
  if (antwort.statusCode != 200) throw Exception('HTTP \${antwort.statusCode}');
  return (jsonDecode(antwort.body) as List).map((p) => p['name'] as String).toList();
}

class ProduktListe extends StatefulWidget {
  const ProduktListe({super.key});
  @override
  State<ProduktListe> createState() => _ProduktListeState();
}

class _ProduktListeState extends State<ProduktListe> {
  late final Future<List<String>> _produkte = ladeProdukte();   // nur einmal starten

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<String>>(
      future: _produkte,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) return Center(child: Text('Fehler: \${snapshot.error}'));
        final namen = snapshot.data!;
        return ListView.builder(
          itemCount: namen.length,
          itemBuilder: (context, i) => ListTile(title: Text(namen[i])),
        );
      },
    );
  }
}`,explanation:"Das `Future` wird einmal im State angelegt – würde man `ladeProdukte()` direkt in `build` aufrufen, startete jeder Neuaufbau eine neue Anfrage. `FutureBuilder` zeigt Ladeanzeige, Fehler oder Ergebnis. `ListView.builder` erzeugt nur die sichtbaren Einträge und bleibt auch bei langen Listen flüssig."}},scala:{example:{title:"Bestellungen auswerten mit Case Classes",lang:"scala",filename:"Auswertung.scala",code:`enum Status:
  case Offen, Bezahlt, Storniert

case class Position(produkt: String, menge: Int, einzelpreis: BigDecimal)
case class Bestellung(id: Int, kunde: String, status: Status, positionen: List[Position]):
  def summe: BigDecimal = positionen.map(p => p.einzelpreis * p.menge).sum

@main def auswertung(): Unit =
  val bestellungen = List(
    Bestellung(1, "Ada", Status.Bezahlt, List(Position("Maus", 2, 24.50), Position("Kabel", 1, 9.90))),
    Bestellung(2, "Linus", Status.Storniert, List(Position("Monitor", 1, 329))),
    Bestellung(3, "Ada", Status.Bezahlt, List(Position("Tastatur", 1, 89.90))),
  )

  val umsatzJeKunde = bestellungen
    .filter(_.status == Status.Bezahlt)
    .groupMapReduce(_.kunde)(_.summe)(_ + _)

  umsatzJeKunde.toSeq.sortBy(-_._2).foreach((kunde, umsatz) => println(f"$kunde%-8s $umsatz%8.2f €"))`,explanation:"Ein Scala-3-`enum` modelliert den Status typsicher, `case class`es die Daten. `BigDecimal` vermeidet Rundungsfehler bei Geld. `groupMapReduce` gruppiert, bildet ab und fasst in einem Schritt zusammen – ohne veränderliche Variablen."}},lua:{example:{title:"Klassen mit Metatables: ein Bankkonto",lang:"lua",filename:"konto.lua",code:`local Konto = {}
Konto.__index = Konto

function Konto.neu(inhaber, start)
  return setmetatable({ inhaber = inhaber, saldo = start or 0 }, Konto)
end

function Konto:einzahlen(betrag)
  assert(betrag > 0, "Betrag muss positiv sein")
  self.saldo = self.saldo + betrag
end

function Konto:abheben(betrag)
  if betrag > self.saldo then
    return false, "Deckung nicht ausreichend"
  end
  self.saldo = self.saldo - betrag
  return true
end

Konto.__tostring = function(k)
  return string.format("%s: %.2f €", k.inhaber, k.saldo)
end

local k = Konto.neu("Ada", 100)
k:einzahlen(50)
local ok, fehler = k:abheben(500)
if not ok then print("Abgelehnt: " .. fehler) end
print(k)   -- Ada: 150.00 €`,explanation:"`__index` lässt Instanzen ihre Methoden in der Tabelle `Konto` finden; `__tostring` bestimmt die Ausgabe von `print`. Das idiomatische Fehlermuster in Lua: `nil`/`false` plus Fehlermeldung zurückgeben statt einer Exception – `assert` nur für Programmierfehler."}},perl:{example:{title:"Logdatei auswerten: Fehler pro Stunde",lang:"perl",filename:"fehler_pro_stunde.pl",code:`#!/usr/bin/env perl
use v5.36;

# Zeilen wie: 2026-11-05T14:03:22Z ERROR Zahlung fehlgeschlagen (bestellung=1001)
my %pro_stunde;
my %meldungen;

while (my $zeile = <>) {
    next unless $zeile =~ /^(?<datum>\\d{4}-\\d{2}-\\d{2})T(?<stunde>\\d{2}):\\d{2}:\\d{2}Z\\s+ERROR\\s+(?<text>.+?)\\s*(?:\\(|$)/;
    $pro_stunde{"$+{datum} $+{stunde}:00"}++;
    $meldungen{$+{text}}++;
}

say "Fehler pro Stunde:";
say sprintf("  %s  %4d", $_, $pro_stunde{$_}) for sort keys %pro_stunde;

say "Häufigste Meldungen:";
my @top = sort { $meldungen{$b} <=> $meldungen{$a} } keys %meldungen;
say sprintf("  %4d  %s", $meldungen{$_}, $_) for @top[0 .. ($#top < 4 ? $#top : 4)];

# Aufruf: perl fehler_pro_stunde.pl app.log`,explanation:"Der Diamant-Operator `<>` liest alle als Argument übergebenen Dateien (oder die Standardeingabe). Benannte Gruppen landen im Hash `%+`. So entsteht in wenigen Zeilen eine Auswertung, für die man sonst mehrere Shell-Werkzeuge kombinieren müsste."}},matlab:{example:{title:"Messreihe glätten und darstellen",lang:"matlab",filename:"glaetten.m",code:`% Verrauschte Messreihe erzeugen
t = 0:0.01:10;                        % Zeit in Sekunden
signal = sin(2*pi*0.5*t);             % 0,5-Hz-Sinus
messung = signal + 0.3*randn(size(t));

% Gleitender Mittelwert über 25 Werte
geglaettet = movmean(messung, 25);

% Kennzahlen
abweichung = rms(geglaettet - signal);
fprintf('RMS-Abweichung nach Glättung: %.3f\\n', abweichung);

% Darstellung
plot(t, messung, '.', 'Color', [0.7 0.7 0.7]); hold on
plot(t, geglaettet, 'LineWidth', 2);
plot(t, signal, '--k'); hold off
legend('Messung', 'Gleitender Mittelwert', 'Originalsignal')
xlabel('Zeit (s)'); ylabel('Amplitude'); grid on`,explanation:"Alle Berechnungen arbeiten auf ganzen Vektoren – ohne Schleife. `movmean` (ab R2016a) glättet, `rms` misst die verbleibende Abweichung. `hold on` legt mehrere Linien in dieselbe Grafik."}},julia:{example:{title:"Monte-Carlo-Schätzung von π mit Threads",lang:"julia",filename:"pi.jl",code:`using Base.Threads

function treffer(n::Int)
    t = 0
    for _ in 1:n
        x, y = rand(), rand()
        t += (x^2 + y^2 <= 1.0)
    end
    return t
end

function pi_schaetzen(n::Int)
    k = nthreads()
    pro_task = cld(n, k)
    tasks = [Threads.@spawn treffer(pro_task) for _ in 1:k]   # jeder Task zählt eigene Treffer
    gesamt = sum(fetch.(tasks))
    return 4 * gesamt / (pro_task * k)
end

@time println(pi_schaetzen(100_000_000))
# Start mit mehreren Threads: julia --threads=auto pi.jl`,explanation:"Jeder Task arbeitet mit einem eigenen Zähler – es gibt keinen geteilten Zustand und daher keine Race Condition. Die Ergebnisse werden erst am Ende zusammengeführt. Die Funktion `treffer` ist typstabil, weshalb Julia daraus eine schnelle Schleife kompiliert."}},assembly:{example:{title:"Hallo Welt mit Linux-Systemaufrufen (x86-64)",lang:"nasm",filename:"hallo.asm",code:`; Assemblieren und linken:
;   nasm -f elf64 hallo.asm && ld hallo.o -o hallo && ./hallo

section .data
    text    db "Hallo, Welt!", 10      ; 10 = Zeilenumbruch
    laenge  equ $ - text                ; Länge zur Assemblierzeit berechnen

section .text
    global _start

_start:
    mov rax, 1          ; Systemaufruf 1 = write
    mov rdi, 1          ; Dateideskriptor 1 = stdout
    lea rsi, [rel text] ; Adresse des Textes
    mov rdx, laenge     ; Anzahl Bytes
    syscall

    mov rax, 60         ; Systemaufruf 60 = exit
    xor rdi, rdi        ; Exit Code 0
    syscall`,explanation:"Ohne C-Bibliothek spricht das Programm direkt mit dem Linux-Kernel: Nummer des Systemaufrufs in `rax`, Argumente in `rdi`, `rsi`, `rdx`, dann `syscall`. Genau das passiert intern, wenn ein C-Programm `printf` und `return 0` ausführt."}},solidity:{example:{title:"Einfache Abstimmung",lang:"solidity",filename:"Abstimmung.sol",code:`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Abstimmung {
    struct Vorschlag {
        string name;
        uint256 stimmen;
    }

    address public immutable leitung;
    Vorschlag[] public vorschlaege;
    mapping(address => bool) public berechtigt;
    mapping(address => bool) public hatGewaehlt;

    event StimmeAbgegeben(address indexed waehler, uint256 vorschlag);

    constructor(string[] memory namen) {
        leitung = msg.sender;
        for (uint256 i = 0; i < namen.length; i++) {
            vorschlaege.push(Vorschlag({name: namen[i], stimmen: 0}));
        }
    }

    function berechtige(address waehler) external {
        require(msg.sender == leitung, "Nur die Leitung");
        berechtigt[waehler] = true;
    }

    function waehle(uint256 vorschlag) external {
        require(berechtigt[msg.sender], "Nicht stimmberechtigt");
        require(!hatGewaehlt[msg.sender], "Bereits abgestimmt");
        require(vorschlag < vorschlaege.length, "Unbekannter Vorschlag");
        hatGewaehlt[msg.sender] = true;
        vorschlaege[vorschlag].stimmen += 1;
        emit StimmeAbgegeben(msg.sender, vorschlag);
    }
}`,explanation:"Jede Regel wird mit `require` geprüft, bevor sich der Zustand ändert. `immutable` setzt die Leitung einmalig im Konstruktor. Achtung: Alle Daten auf einer öffentlichen Blockchain sind einsehbar – wer wie abgestimmt hat, ist hier öffentlich. Geheime Wahlen erfordern kryptografische Verfahren (z. B. Commit-Reveal oder Zero-Knowledge-Beweise)."}}},t={...l,...o};for(const[e,n]of Object.entries(d))t[e]={...t[e],...n};function u(e){const n=t[e.id];return n?{...e,advanced:[...e.advanced??[],...n.advanced??[]],interview:[...e.interview??[],...n.interview??[]],exercises:[...e.exercises??[],...n.exercises??[]],mistakes:[...e.mistakes,...n.mistakes??[]],example:e.example??n.example}:e}const c=[...r,...i,...a,...s].map(u),h=Object.fromEntries(c.map(e=>[e.id,e])),m={web:"Webentwicklung",universal:"Universell",system:"Systemnah",daten:"Daten & Wissenschaft",spezial:"Shell & Spezialgebiete"};export{c as a,m as g,h as l};
