const e=`---
id: javascript-dom
title: JavaScript im Browser: DOM & Events
area: web
difficulty: einsteiger
minutes: 15
order: 12
summary: Wie JavaScript die Seite über den DOM-Baum liest und verändert, wie Events, Event-Delegation und Formulare funktionieren – und wie du dabei XSS vermeidest.
tags: [JavaScript, DOM, Events, Browser-APIs]
related: [async-javascript, html-semantik, xss-csrf-cors, react-grundlagen, typescript-praxis]
---

## Was ist der DOM?

Wenn der Browser HTML lädt, baut er daraus den **[[DOM]]** (Document Object Model): einen [[Baum]] aus Objekten, der die Seite im Speicher repräsentiert. [[JavaScript]] kann diesen Baum lesen und verändern – und der Browser aktualisiert die Darstellung entsprechend.

\`\`\`html
<ul id="liste">
  <li>Äpfel</li>
  <li>Birnen</li>
</ul>
\`\`\`

wird zum Baum \`document → html → body → ul#liste → li → "Äpfel"\`. Jeder Knoten ist ein Objekt mit Eigenschaften (\`textContent\`, \`classList\`, \`children\`) und Methoden (\`append\`, \`remove\`).

## Elemente finden

\`\`\`javascript
const liste = document.querySelector('#liste');          // erstes Element per CSS-Selektor
const punkte = document.querySelectorAll('#liste li');   // alle Treffer (NodeList)
const button = document.getElementById('speichern');

for (const li of punkte) console.log(li.textContent);
const erstes = liste.querySelector('li');                // Suche innerhalb eines Elements
const karte = button.closest('.karte');                  // nächster Vorfahre, der passt
\`\`\`

## Elemente verändern

\`\`\`javascript
const li = document.createElement('li');
li.textContent = 'Kirschen';        // Text – sicher, kein HTML
li.classList.add('neu');
li.dataset.id = '42';               // data-id="42"
liste.append(li);

liste.firstElementChild.remove();
button.disabled = true;
button.setAttribute('aria-busy', 'true');
document.body.style.setProperty('--akzent', 'tomato');
\`\`\`

> [!DANGER] \`innerHTML\` mit Nutzerdaten = XSS
> \`el.innerHTML = kommentar\` interpretiert den Text als HTML. Enthält der Kommentar \`<img src=x onerror="…">\`, wird fremder Code ausgeführt ([[XSS]]). Für Text immer \`textContent\` verwenden; wenn HTML nötig ist, mit einer Bibliothek wie DOMPurify bereinigen.

## Events

Nutzeraktionen (Klicks, Eingaben, Tastendrücke) lösen **Events** aus, auf die du mit \`addEventListener\` reagierst.

\`\`\`javascript
const zaehler = document.querySelector('#zaehler');
let anzahl = 0;

document.querySelector('#plus').addEventListener('click', (event) => {
  anzahl++;
  zaehler.textContent = anzahl;
  console.log('geklickt auf', event.target);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') schliesseDialog();
});
\`\`\`

### Bubbling und Event-Delegation

Events „steigen“ vom Ziel-Element zu seinen Vorfahren auf (**Bubbling**). Statt jedem Listeneintrag einen eigenen Listener zu geben, hängst du einen einzigen an den Container – das funktioniert auch für später hinzugefügte Elemente:

\`\`\`javascript title="Event-Delegation"
document.querySelector('#aufgaben').addEventListener('click', (e) => {
  const button = e.target.closest('button[data-aktion]');
  if (!button) return;
  const eintrag = button.closest('li');
  if (button.dataset.aktion === 'loeschen') eintrag.remove();
  if (button.dataset.aktion === 'erledigt') eintrag.classList.toggle('erledigt');
});
\`\`\`

## Formulare verarbeiten

\`\`\`javascript
const form = document.querySelector('#kontakt');
form.addEventListener('submit', async (e) => {
  e.preventDefault();                          // kein Neuladen der Seite
  const daten = Object.fromEntries(new FormData(form));
  if (!form.checkValidity()) {                 // eingebaute HTML-Validierung nutzen
    form.reportValidity();
    return;
  }
  const res = await fetch('/api/kontakt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(daten),
  });
  form.querySelector('[role="status"]').textContent = res.ok ? 'Danke!' : 'Fehler beim Senden.';
});
\`\`\`

> [!TIP]
> Client-Validierung ist Komfort für Nutzer. **Validieren muss immer der Server**, denn jede Anfrage lässt sich auch ohne dein Formular senden.

## Ein vollständiges Mini-Beispiel

Probiere es im Playground aus – es ist dort im HTML-Modus voreingestellt:

\`\`\`javascript title="Klickzähler"
let anzahl = 0;
const ausgabe = document.querySelector('#anzahl');
document.querySelector('#plus').addEventListener('click', () => {
  anzahl++;
  ausgabe.textContent = anzahl;
});
\`\`\`

[Im HTML-Playground öffnen →](#/labor/playground)

## Weitere wichtige Browser-APIs

| API | Zweck |
|---|---|
| [[Fetch API]] | HTTP-Anfragen |
| [[Web Storage|localStorage / sessionStorage]] | kleine Datenmengen im Browser speichern |
| \`IntersectionObserver\` | erkennen, wann ein Element sichtbar wird (Lazy Loading, Scrollspy) |
| \`history.pushState\` | URL ändern ohne Neuladen ([[Client-Side Routing]]) |
| \`navigator.clipboard\` | Zwischenablage |
| Web Workers | JavaScript im Hintergrund-Thread |
| \`<dialog>\` + \`showModal()\` | barrierearme modale Dialoge |

## Typische Fehler

> [!MISTAKE] Skript läuft, bevor das HTML da ist
> \`document.querySelector\` liefert \`null\`, wenn das Skript im \`<head>\` ohne \`defer\` steht. Lösung: \`<script src="app.js" defer>\` oder Skripte als \`type="module"\` laden (die sind automatisch deferred).

> [!MISTAKE] Layout-Thrashing
> Abwechselnd Layout lesen (\`offsetHeight\`) und schreiben (\`style.height\`) in einer Schleife zwingt den Browser zu ständigem Neuberechnen. Erst alles lesen, dann alles schreiben.

## Wie geht es weiter?

Lerne, wie [asynchrones JavaScript und die Event Loop](#/artikel/async-javascript) funktionieren, und warum Frameworks wie [React](#/artikel/react-grundlagen) die DOM-Manipulation für dich übernehmen.
`;export{e as default};
