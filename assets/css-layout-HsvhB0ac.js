const e=`---
id: css-layout
title: CSS-Layout mit Flexbox, Grid & Responsive Design
area: web
difficulty: einsteiger
minutes: 16
order: 11
summary: Box-Modell, Flexbox für eine Dimension, Grid für zwei, responsive Techniken von Media Queries bis Container Queries – mit interaktivem Playground.
tags: [CSS, Flexbox, Grid, Responsive, Layout]
related: [html-semantik, web-performance, react-grundlagen]
---

## Das Box-Modell

Jedes Element ist eine Box aus **Inhalt**, **Innenabstand** (\`padding\`), **Rahmen** (\`border\`) und **Außenabstand** (\`margin\`). Standardmäßig bezieht sich \`width\` nur auf den Inhalt – Padding und Rahmen kommen dazu. Fast alle Projekte setzen deshalb:

\`\`\`css
*, *::before, *::after {
  box-sizing: border-box;   /* width enthält Padding und Border */
}
\`\`\`

## Flexbox: Anordnung in einer Dimension

[[Flexbox]] ordnet Elemente **in einer Zeile oder Spalte** an und verteilt den verfügbaren Platz. Ideal für Navigationsleisten, Button-Gruppen, Karten-Inhalte und Zentrierung.

\`\`\`css title="Navigationsleiste"
.nav {
  display: flex;
  align-items: center;            /* Querachse: vertikal zentrieren */
  justify-content: space-between; /* Hauptachse: Platz zwischen den Elementen */
  gap: 1rem;
}
.nav .suche { flex: 1; }          /* nimmt den restlichen Platz */
\`\`\`

Probiere die Eigenschaften direkt aus:

\`\`\`widget
layout
\`\`\`

| Eigenschaft (Container) | Wirkung |
|---|---|
| \`flex-direction\` | Richtung der Hauptachse: \`row\`, \`column\` |
| \`justify-content\` | Verteilung auf der Hauptachse |
| \`align-items\` | Ausrichtung auf der Querachse |
| \`flex-wrap\` | Umbruch erlauben |
| \`gap\` | Abstand zwischen Elementen |

| Eigenschaft (Element) | Wirkung |
|---|---|
| \`flex: 1\` | wächst und nimmt freien Platz ein |
| \`flex: 0 0 200px\` | feste Basis 200px, wächst/schrumpft nicht |
| \`align-self\` | eigene Querachsen-Ausrichtung |
| \`order\` | visuelle Reihenfolge (Achtung: nicht für Screenreader!) |

> [!TIP] Perfekt zentrieren
> \`display: grid; place-items: center;\` oder \`display: flex; justify-content: center; align-items: center;\` – das jahrelange Zentrierungsproblem ist gelöst.

## Grid: Layout in zwei Dimensionen

[[CSS Grid]] definiert **Zeilen und Spalten** und platziert Elemente darin. Ideal für Seitenlayouts, Kartenraster und Galerien.

\`\`\`css title="Responsives Kartenraster ohne Media Query"
.karten {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: 1.5rem;
}
\`\`\`

\`minmax(16rem, 1fr)\` heißt: jede Spalte mindestens 16rem breit, ansonsten gleichmäßig verteilt. \`auto-fill\` erzeugt so viele Spalten, wie hineinpassen.

\`\`\`css title="Seitenlayout mit benannten Bereichen"
.seite {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "kopf   kopf"
    "nav    inhalt"
    "fuss   fuss";
  min-height: 100dvh;
}
header { grid-area: kopf; }
nav    { grid-area: nav; }
main   { grid-area: inhalt; }
footer { grid-area: fuss; }

@media (max-width: 48rem) {
  .seite {
    grid-template-columns: 1fr;
    grid-template-areas: "kopf" "inhalt" "nav" "fuss";
  }
}
\`\`\`

## Responsive Design

[[Responsive Design]] passt das Layout an Bildschirmgröße, Eingabegerät und Nutzerpräferenzen an. Moderne Werkzeuge:

- **Mobile-First:** Basisstyles für kleine Screens, mit \`@media (min-width: …)\` für größere ergänzen.
- **Fluide Größen:** \`clamp(1rem, 2.5vw, 1.5rem)\` für Schrift und Abstände.
- **Relative Einheiten:** \`rem\` (relativ zur Root-Schriftgröße – respektiert Nutzereinstellungen), \`%\`, \`fr\`, \`vw\`/\`dvh\`.
- **Container Queries:** Komponenten reagieren auf die Größe ihres Containers statt des Viewports:

\`\`\`css
.karten-wrapper { container-type: inline-size; }

@container (min-width: 30rem) {
  .karte { display: grid; grid-template-columns: 8rem 1fr; }
}
\`\`\`

- **Nutzerpräferenzen:** \`prefers-color-scheme\` (Dark Mode), \`prefers-reduced-motion\` (weniger Animation), \`prefers-contrast\`.
- **Viewport-Meta-Tag** im HTML nicht vergessen: \`<meta name="viewport" content="width=device-width, initial-scale=1">\`.

## Moderne CSS-Features

\`\`\`css
:root { --akzent: oklch(62% 0.19 265); }      /* Custom Properties, moderne Farbräume */
.karte:has(img) { padding-top: 0; }          /* :has() – „Elternselektor“ */
.nav { & a { color: var(--akzent); } }       /* natives Nesting */
.text { text-wrap: balance; }                /* ausgewogene Zeilenumbrüche für Überschriften */
\`\`\`

## Typische Fehler

> [!MISTAKE] Feste Höhen
> \`height: 300px\` für Textcontainer führt zu Überlauf bei längerem Text oder größerer Schrift. \`min-height\` oder gar keine Höhe verwenden.

> [!MISTAKE] Layout mit \`float\` oder Tabellen
> Floats sind für Text, der um Bilder fließt. Für Layouts gibt es Flexbox und Grid.

> [!MISTAKE] Pixelwerte für Schrift
> \`font-size: 14px\` ignoriert die vom Nutzer eingestellte Schriftgröße. Verwende \`rem\`.

## Wie geht es weiter?

Nutze den [Flexbox-/Grid-Playground](#/labor/flexbox), das [CSS-Cheatsheet](#/cheatsheets/css) und lerne mit [JavaScript & DOM](#/artikel/javascript-dom), Seiten interaktiv zu machen.
`;export{e as default};
