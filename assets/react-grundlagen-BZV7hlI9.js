const e=`---
id: react-grundlagen
title: React-Grundlagen: Komponenten, Props, State & Hooks
area: web
difficulty: fortgeschritten
minutes: 20
order: 14
summary: Wie React Oberflächen als Funktion des Zustands beschreibt, wie Komponenten, Props und State zusammenspielen, wann useEffect nötig ist – und welche Fehler fast alle am Anfang machen.
tags: [React, Komponenten, Hooks, State, JSX]
related: [rendering-strategien, async-javascript, javascript-dom, web-performance, frontend-frameworks, typescript-praxis]
---

## Was ist React?

[React](#/tech/react) ist eine Bibliothek zum Bauen von Benutzeroberflächen aus **[[Komponente|Komponenten]]**. Die Kernidee: Du beschreibst, *wie* die Oberfläche für einen bestimmten Zustand aussehen soll – React kümmert sich darum, den [[DOM]] effizient anzupassen, wenn sich der Zustand ändert.

\`\`\`text
UI = f(state)
\`\`\`

> [!BEGINNER]
> Statt dem Browser Schritt für Schritt zu sagen „füge hier ein Element ein, ändere dort den Text“ (imperativ), sagst du nur: „Bei 3 Artikeln im Warenkorb sieht das so aus.“ React erledigt den Rest (deklarativ).

## Komponenten und JSX

Eine Komponente ist eine Funktion, die **JSX** zurückgibt – eine HTML-ähnliche Syntax, die zu JavaScript-Aufrufen kompiliert wird.

\`\`\`tsx
type ProduktProps = { name: string; preis: number; reduziert?: boolean };

function ProduktKarte({ name, preis, reduziert = false }: ProduktProps) {
  return (
    <article className="karte">
      <h3>{name}</h3>
      <p>{preis.toFixed(2)} €{reduziert && <strong> – Angebot!</strong>}</p>
    </article>
  );
}

export function ProduktListe({ produkte }: { produkte: ProduktProps[] }) {
  if (produkte.length === 0) return <p>Keine Produkte gefunden.</p>;
  return (
    <ul>
      {produkte.map((p) => (
        <li key={p.name}><ProduktKarte {...p} /></li>
      ))}
    </ul>
  );
}
\`\`\`

- Komponentennamen beginnen mit Großbuchstaben.
- \`{…}\` bettet JavaScript-Ausdrücke ein; \`className\` statt \`class\`.
- Listen brauchen einen stabilen, eindeutigen **\`key\`** (nicht den Index, wenn sich die Reihenfolge ändern kann).

## Props: Daten von oben nach unten

[[Props]] sind die Eingaben einer Komponente – vergleichbar mit Funktionsparametern. Sie fließen **nur von Eltern zu Kindern** und sind für das Kind schreibgeschützt. Möchte ein Kind etwas ändern, ruft es eine Funktion auf, die es als Prop bekommen hat.

## State: das Gedächtnis einer Komponente

[[State]] ist Zustand, der sich über die Zeit ändert. Ändert er sich, rendert React die Komponente neu.

\`\`\`tsx
import { useState } from 'react';

export function Zaehler() {
  const [anzahl, setAnzahl] = useState(0);
  return (
    <div>
      <p>Klicks: {anzahl}</p>
      <button onClick={() => setAnzahl((a) => a + 1)}>+1</button>
      <button onClick={() => setAnzahl(0)} disabled={anzahl === 0}>Zurücksetzen</button>
    </div>
  );
}
\`\`\`

> [!EXPERT] Funktionale Updates
> \`setAnzahl(anzahl + 1)\` nutzt den Wert aus dem aktuellen Render. Mehrere Updates im selben Event würden sich überschreiben. \`setAnzahl((a) => a + 1)\` arbeitet immer mit dem neuesten Wert.

### Zustand richtig modellieren

- **Abgeleitete Werte berechnen, nicht speichern:** \`const gesamt = artikel.reduce(…)\` statt eines zweiten States, der synchron gehalten werden muss.
- **State so lokal wie möglich**, nur bei Bedarf „nach oben heben“ (zum gemeinsamen Elternteil).
- **Unveränderlich aktualisieren:** neue Objekte/Arrays erzeugen statt zu mutieren.

\`\`\`tsx
setAufgaben((alt) => [...alt, neueAufgabe]);                               // hinzufügen
setAufgaben((alt) => alt.map((a) => (a.id === id ? { ...a, erledigt: true } : a)));  // ändern
setAufgaben((alt) => alt.filter((a) => a.id !== id));                       // entfernen
\`\`\`

## Hooks

[[Hook|Hooks]] sind Funktionen, die mit \`use\` beginnen und Komponenten Fähigkeiten geben.

| Hook | Zweck |
|---|---|
| \`useState\` | lokaler Zustand |
| \`useEffect\` | Synchronisation mit externen Systemen (Netzwerk, Timer, Browser-APIs) |
| \`useMemo\` / \`useCallback\` | teure Berechnungen bzw. Funktionsreferenzen cachen |
| \`useRef\` | veränderlicher Wert ohne Re-Render, Zugriff auf DOM-Elemente |
| \`useContext\` | Werte tief im Baum ohne Prop-Weitergabe |
| eigene Hooks | wiederverwendbare Logik, z. B. \`useLocalStorage\` |

**Regeln:** Hooks nur auf oberster Ebene einer Komponente oder eines eigenen Hooks aufrufen – nie in Bedingungen, Schleifen oder verschachtelten Funktionen.

### Daten laden mit useEffect

\`\`\`tsx
import { useEffect, useState } from 'react';

export function NutzerProfil({ id }: { id: number }) {
  const [nutzer, setNutzer] = useState<{ name: string } | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(\`/api/nutzer/\${id}\`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(\`HTTP \${r.status}\`))))
      .then(setNutzer)
      .catch((e) => { if (e.name !== 'AbortError') setFehler(e.message); });
    return () => controller.abort();           // Aufräumen bei Unmount oder neuer id
  }, [id]);                                    // Abhängigkeiten: erneut ausführen, wenn id sich ändert

  if (fehler) return <p role="alert">Fehler: {fehler}</p>;
  if (!nutzer) return <p>Lade …</p>;
  return <h2>{nutzer.name}</h2>;
}
\`\`\`

> [!TIP]
> In echten Projekten übernehmen Bibliotheken wie **TanStack Query** oder **SWR** bzw. Framework-Features (Server Components, Loader in Next.js/React Router) das Laden, Cachen und Neuladen von Server-Daten – mit weniger Fehlerquellen als eigener \`useEffect\`-Code.

## Wie React rendert

1. State ändert sich → React ruft die Komponente erneut auf.
2. Das Ergebnis wird mit dem vorherigen verglichen ([[Virtual DOM|Reconciliation]]).
3. Nur die Unterschiede werden in den DOM übertragen.

Re-Rendern ist meist billig. Komponenten müssen beim Rendern **[[Pure Function|rein]]** sein: keine Seiteneffekte, keine Mutation externer Variablen.

## Typische Fehler

> [!MISTAKE] State direkt mutieren
> \`aufgaben.push(neu); setAufgaben(aufgaben);\` – React erkennt keine Änderung, weil es dieselbe Array-Referenz ist. Immer neue Arrays/Objekte erzeugen.

> [!MISTAKE] \`useEffect\` für abgeleitete Werte
> Einen State per Effect aus einem anderen State zu berechnen, erzeugt doppelte Renders und Inkonsistenzen. Berechne direkt beim Rendern (bei Bedarf mit \`useMemo\`).

> [!MISTAKE] Fehlende Abhängigkeiten
> Ein Effect, der \`id\` nutzt, aber \`[]\` als Abhängigkeiten hat, lädt bei einer neuen \`id\` nicht neu. Die ESLint-Regel \`react-hooks/exhaustive-deps\` warnt davor.

## Wie geht es weiter?

Lerne die [Rendering-Strategien](#/artikel/rendering-strategien) (CSR, SSR, SSG) und wie [Next.js](#/tech/nextjs) sie umsetzt. Alternativen zu React findest du im [Katalog](#/katalog?kind=framework).
`;export{e as default};
