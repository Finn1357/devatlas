const e=`---
id: web-performance
title: Web-Performance & Core Web Vitals
area: web
difficulty: fortgeschritten
minutes: 14
order: 16
summary: Was „schnell“ im Web messbar bedeutet (LCP, INP, CLS), wie du Engpässe findest und welche Maßnahmen am meisten bringen – von Bildern über Caching bis Code Splitting.
tags: [Performance, Core Web Vitals, Caching, Lighthouse, Optimierung]
related: [rendering-strategien, html-semantik, caching-queues]
---

## Warum Performance zählt

Langsame Seiten kosten Nutzer, Umsatz und Suchmaschinen-Ranking. Vor allem auf Mobilgeräten mit schwacher CPU und wackeliger Verbindung ist jede Sekunde spürbar. Performance ist außerdem eine Frage der Fairness: Nicht jeder hat das neueste Smartphone.

## Messbar machen: Core Web Vitals

Die [[Core Web Vitals]] fassen Nutzererfahrung in drei Kennzahlen (Bewertung am 75. Perzentil echter Nutzer):

| Metrik | Misst | Gut | Häufige Ursachen für schlechte Werte |
|---|---|---|---|
| **LCP** – Largest Contentful Paint | Wann ist der größte Inhalt sichtbar? | ≤ 2,5 s | große Bilder, langsamer Server, render-blockierendes CSS/JS |
| **INP** – Interaction to Next Paint | Wie schnell reagiert die Seite auf Eingaben? | ≤ 200 ms | lange JavaScript-Tasks, teure Re-Renders |
| **CLS** – Cumulative Layout Shift | Wie stark springt das Layout? | ≤ 0,1 | Bilder ohne Maße, nachgeladene Werbung, Webfonts |

**Laborwerte** (Lighthouse, DevTools) helfen bei der Analyse; **Felddaten** echter Nutzer (Real User Monitoring, Chrome UX Report) zeigen die Realität.

## Werkzeuge

- **Chrome DevTools → Performance:** Aufzeichnung mit Flame Chart; lange Tasks (> 50 ms) sind rot markiert.
- **Lighthouse:** Bewertung und konkrete Empfehlungen.
- **Network-Tab:** Größen, Reihenfolge, Caching-Header, Wasserfall.
- **\`web-vitals\`-Bibliothek:** Metriken echter Nutzer erfassen.

## Die wirksamsten Maßnahmen

### 1. Bilder

Bilder sind oft der größte Teil des Datenvolumens.

\`\`\`html
<img
  src="hero-800.webp"
  srcset="hero-400.webp 400w, hero-800.webp 800w, hero-1600.webp 1600w"
  sizes="(max-width: 48rem) 100vw, 50vw"
  width="1600" height="900"
  alt="Team am Whiteboard"
  fetchpriority="high">                       <!-- LCP-Bild priorisieren -->

<img src="galerie-1.avif" alt="…" width="400" height="300" loading="lazy" decoding="async">
\`\`\`

- Moderne Formate (AVIF, WebP) und passende Größen (\`srcset\`).
- \`width\`/\`height\` oder \`aspect-ratio\` gegen Layout-Sprünge (CLS).
- \`loading="lazy"\` für Bilder außerhalb des sichtbaren Bereichs – aber **nicht** für das LCP-Bild.

### 2. Weniger und späteres JavaScript

- **[[Code Splitting]]:** pro Route nur laden, was gebraucht wird (\`import()\`).
- **[[Tree Shaking]]** wirkt nur mit ES Modules; große Bibliotheken gezielt importieren.
- Skripte mit \`defer\` oder \`type="module"\`; Drittanbieter-Skripte kritisch prüfen.
- Lange Tasks aufteilen (\`await scheduler.yield()\` bzw. \`setTimeout\`) oder in Web Worker auslagern – das verbessert INP.

### 3. Caching

\`\`\`http
# Gehashte Dateinamen (app.3f9a1c.js) dürfen „ewig“ gecacht werden:
Cache-Control: public, max-age=31536000, immutable

# HTML immer frisch prüfen:
Cache-Control: no-cache
\`\`\`

Build-Tools wie [Vite](#/tech/vite) erzeugen gehashte Dateinamen automatisch. Ein [[CDN]] bringt Inhalte geografisch näher an die Nutzer. Mehr in [Caching & Queues](#/artikel/caching-queues).

### 4. Schriften

\`\`\`css
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-latin.woff2") format("woff2");
  font-display: swap;              /* Text sofort mit Fallback zeigen */
  unicode-range: U+0000-00FF;      /* nur benötigte Zeichen laden */
}
\`\`\`

Wenige Schnitte, WOFF2, selbst gehostet, wichtige Fonts per \`<link rel="preload">\`.

### 5. Server und Netzwerk

- Kurze **Time to First Byte**: Caching, effiziente Datenbankabfragen (siehe [Indizes](#/artikel/indizes-transaktionen)), Server nah an den Nutzern.
- Kompression (Brotli/gzip), HTTP/2 oder HTTP/3.
- Weniger Roundtrips: \`preconnect\` zu wichtigen Drittanbieter-Origins.

### 6. Rendering

- Animationen mit \`transform\`/\`opacity\` statt \`top\`/\`width\` (laufen auf dem Compositor).
- Lange Listen virtualisieren (nur sichtbare Zeilen rendern).
- In React: unnötige Re-Renders mit Profiler finden, State lokal halten, \`memo\`/\`useMemo\` gezielt einsetzen.

## Performance-Budget

Lege messbare Grenzen fest – z. B. „maximal 170 KB komprimiertes JavaScript für die Startseite“, „LCP < 2,5 s auf einem Mittelklasse-Handy“ – und prüfe sie in [CI/CD](#/artikel/ci-cd) (z. B. mit Lighthouse CI). Was nicht gemessen wird, verschlechtert sich schleichend.

## Typische Fehler

> [!MISTAKE] Nur auf dem Entwickler-Laptop testen
> Ein schneller Rechner mit Glasfaser verbirgt fast alle Probleme. In den DevTools CPU- und Netzwerk-Drosselung aktivieren oder auf echten Mittelklasse-Geräten testen.

> [!MISTAKE] Lazy Loading für das Hero-Bild
> Das wichtigste Bild der Seite verzögert zu laden, verschlechtert LCP deutlich.

## Wie geht es weiter?

Die Grundlagen der Auslieferung findest du in [HTTP-Grundlagen](#/artikel/http-grundlagen), die Wahl der Rendering-Strategie in [Rendering-Strategien](#/artikel/rendering-strategien).
`;export{e as default};
