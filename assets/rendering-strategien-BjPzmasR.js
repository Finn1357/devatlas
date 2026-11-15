const e=`---
id: rendering-strategien
title: Rendering-Strategien: CSR, SSR, SSG & Hydration
area: web
difficulty: fortgeschritten
minutes: 14
order: 15
summary: Wo und wann das HTML einer Seite entsteht – im Browser, pro Anfrage auf dem Server oder beim Build – und welche Folgen das für Ladezeit, SEO, Kosten und Komplexität hat.
tags: [Rendering, SSR, SSG, CSR, Hydration, Next.js]
related: [react-grundlagen, web-performance, http-grundlagen]
---

## Die zentrale Frage

Jede Webseite besteht am Ende aus HTML im Browser. Die Frage ist: **Wer erzeugt dieses HTML – und wann?** Davon hängen Ladegeschwindigkeit, Suchmaschinenfreundlichkeit, Serverkosten und Komplexität ab.

Was der Browser mit dem HTML anschließend macht, zeigt der Critical Rendering Path:

\`\`\`widget
pipeline:browser-rendering
\`\`\`

## Die Strategien im Überblick

| Strategie | HTML entsteht | Stärken | Schwächen | Typisch für |
|---|---|---|---|---|
| **[[CSR]]** | im Browser per JS | reichhaltige Interaktion, einfaches Hosting | leere Seite bis JS geladen ist, SEO schwieriger | Dashboards, interne Tools |
| **[[SSR]]** | pro Anfrage auf dem Server | schneller erster Inhalt, aktuelle Daten, SEO | Serverlast, Latenz je Anfrage | Shops, personalisierte Seiten |
| **[[SSG]]** | einmal beim Build | extrem schnell, günstig via [[CDN]] | Daten nur so aktuell wie der letzte Build | Doku, Blogs, Marketing |
| **ISR / Revalidierung** | statisch, periodisch neu erzeugt | Mischung aus SSG und Aktualität | Komplexeres Caching | Kataloge, News |
| **Islands / Partial Hydration** | statisch, nur interaktive Teile mit JS | wenig JavaScript | Architekturwechsel | Content-Seiten mit Widgets |

> [!BEGINNER]
> **CSR:** Du bekommst einen IKEA-Bausatz und baust selbst auf. **SSR:** Das Möbelstück wird bei Bestellung frisch gebaut und geliefert. **SSG:** Die Möbel stehen fertig im Lager und gehen sofort raus.

## Hydration

Bei SSR und SSG kommt fertiges HTML an – sichtbar, aber noch nicht interaktiv. Danach lädt das Framework JavaScript, baut den Komponentenbaum im Speicher nach und verbindet Event-Handler mit dem vorhandenen HTML. Diesen Schritt nennt man **[[Hydration]]**.

> [!EXPERT] Kosten der Hydration
> Hydration bedeutet, dass der Browser die Seite praktisch ein zweites Mal „rendert“. Bei großen Seiten verzögert das die Interaktivität (schlechter INP). Moderne Ansätze reduzieren das: **React Server Components** (Komponenten, die nur auf dem Server laufen und kein JS ausliefern), **Islands** (Astro) und **Resumability** (Qwik).

**Hydration-Mismatch:** Unterscheidet sich das Server-HTML vom ersten Client-Render (z. B. durch \`Date.now()\`, zufällige IDs oder \`window\`-Zugriffe), meldet React einen Fehler. Browser-spezifisches gehört in \`useEffect\`.

## Beispiel: Strategien in Next.js (App Router)

\`\`\`tsx title="app/produkte/page.tsx"
// Standardmäßig eine Server Component – läuft nur auf dem Server
export const revalidate = 300;   // statisch erzeugen, alle 5 Minuten neu (ISR)

export default async function Produkte() {
  const res = await fetch('https://api.example.com/produkte');
  const produkte: { id: number; name: string }[] = await res.json();
  return (
    <main>
      <h1>Produkte</h1>
      <ul>{produkte.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
      <WarenkorbButton />  {/* interaktive Client Component */}
    </main>
  );
}
\`\`\`

\`\`\`tsx title="app/produkte/WarenkorbButton.tsx"
'use client';               // ab hier: wird im Browser hydriert
import { useState } from 'react';

export function WarenkorbButton() {
  const [anzahl, setAnzahl] = useState(0);
  return <button onClick={() => setAnzahl((a) => a + 1)}>Warenkorb ({anzahl})</button>;
}
\`\`\`

## Entscheidungshilfe

- **Öffentliche Inhalte, die selten ändern** (Doku, Blog, Landingpages) → SSG.
- **Öffentliche, SEO-relevante Inhalte mit aktuellen Daten** (Produktseiten) → SSR oder ISR.
- **Hinter Login, sehr interaktiv** (Admin-Dashboard) → CSR reicht oft.
- **Gemischt** → Meta-Frameworks wie [[Framework|Next.js, Nuxt oder SvelteKit]] erlauben die Wahl pro Route.

> [!TIP] Diese Seite
> DevAtlas selbst ist eine **CSR-Single-Page-App** mit Hash-Routing – sie lässt sich so ohne Server-Konfiguration als statische Dateien ausliefern.

## Wie geht es weiter?

Wie du die Auswirkungen misst, zeigt [Web-Performance & Core Web Vitals](#/artikel/web-performance).
`;export{e as default};
