const e=`---
id: html-semantik
title: Semantisches HTML & Barrierefreiheit
area: web
difficulty: einsteiger
minutes: 14
order: 10
summary: Warum die richtige Wahl der HTML-Elemente über Zugänglichkeit, SEO und Wartbarkeit entscheidet – mit Dokumentstruktur, Formularen, Alternativtexten und einer praktischen Prüfliste.
tags: [HTML, Semantik, Barrierefreiheit, a11y, ARIA, SEO]
related: [css-layout, javascript-dom, web-performance, barrierefreiheit]
---

## Was ist semantisches HTML?

[[HTML]] beschreibt nicht, wie etwas aussieht, sondern **was es ist**. [[Semantisches HTML]] bedeutet, für jeden Inhalt das Element zu wählen, das seine Bedeutung ausdrückt: eine Navigation ist \`<nav>\`, eine Schaltfläche ist \`<button>\`, eine Überschrift ist \`<h2>\`. Das Aussehen regelt [[CSS]].

> [!BEGINNER]
> Für das Auge sehen ein \`<div>\` mit Rahmen und ein \`<button>\` gleich aus. Für einen Screenreader, eine Suchmaschine oder jemanden, der nur mit der Tastatur navigiert, sind sie grundverschieden.

## Warum ist das wichtig?

- **[[Barrierefreiheit]]:** Screenreader nutzen die Struktur, um Überschriften, Landmarken, Listen und Formulare anzusagen und anspringbar zu machen. In Deutschland nutzen Menschen mit Seh-, motorischen oder kognitiven Einschränkungen das Web genauso – und in der EU sind viele digitale Produkte seit Juni 2025 durch den European Accessibility Act zur Barrierefreiheit verpflichtet.
- **Bedienbarkeit gratis:** \`<button>\` ist fokussierbar und reagiert auf Enter und Leertaste – ohne eine Zeile JavaScript.
- **SEO:** Suchmaschinen verstehen Struktur und Gewichtung von Inhalten besser.
- **Wartbarkeit:** \`<article>\` sagt mehr als \`<div class="box-3">\`.

## Die Dokumentstruktur

\`\`\`html title="Grundgerüst mit Landmarken"
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Produkte – Beispielshop</title>
</head>
<body>
  <header>
    <a href="/">Beispielshop</a>
    <nav aria-label="Hauptnavigation">
      <ul>
        <li><a href="/produkte" aria-current="page">Produkte</a></li>
        <li><a href="/kontakt">Kontakt</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <h1>Produkte</h1>
    <article>
      <h2>Mechanische Tastatur</h2>
      <p>Langlebig, leise, mit deutschem Layout.</p>
    </article>
  </main>

  <footer>
    <p>&copy; 2026 Beispielshop</p>
  </footer>
</body>
</html>
\`\`\`

| Element | Bedeutung |
|---|---|
| \`<header>\`, \`<footer>\` | Kopf- bzw. Fußbereich (der Seite oder eines Abschnitts) |
| \`<nav>\` | Navigationsblock |
| \`<main>\` | Hauptinhalt – genau einmal pro Seite |
| \`<article>\` | Eigenständiger Inhalt (Beitrag, Produkt, Kommentar) |
| \`<section>\` | Thematischer Abschnitt mit Überschrift |
| \`<aside>\` | Ergänzender Inhalt (Seitenleiste, Hinweis) |
| \`<h1>\`–\`<h6>\` | Überschriftenhierarchie ohne Sprünge |
| \`<button>\` | Aktion auf der Seite |
| \`<a href>\` | Navigation zu einer anderen Seite/Stelle |

> [!TIP] Button oder Link?
> Führt es woanders hin (neue URL)? → \`<a href>\`. Löst es eine Aktion aus (Speichern, Menü öffnen, Formular senden)? → \`<button>\`.

## Formulare richtig bauen

\`\`\`html title="Zugängliches Anmeldeformular"
<form action="/login" method="post" novalidate>
  <label for="email">E-Mail-Adresse</label>
  <input id="email" name="email" type="email" autocomplete="username" required
         aria-describedby="email-hilfe">
  <p id="email-hilfe">Wir senden keine Werbung.</p>

  <label for="pw">Passwort</label>
  <input id="pw" name="password" type="password" autocomplete="current-password" required>

  <button type="submit">Anmelden</button>
</form>
\`\`\`

- Jedes Feld braucht ein sichtbares **\`<label>\`** – Platzhaltertext ist kein Ersatz.
- Passende **\`type\`**-Attribute (\`email\`, \`tel\`, \`number\`, \`date\`) zeigen auf dem Handy die richtige Tastatur.
- **\`autocomplete\`** hilft Passwortmanagern und spart Tipparbeit.
- Fehlermeldungen per \`aria-describedby\` mit dem Feld verknüpfen und nicht nur farblich kennzeichnen.

## Bilder und Medien

\`\`\`html
<img src="tastatur.webp" alt="Schwarze mechanische Tastatur mit beleuchteten Tasten" width="800" height="500">
<img src="trenner.svg" alt="">  <!-- dekorativ: leerer Alternativtext -->
\`\`\`

\`alt\` beschreibt, was das Bild **vermittelt**, nicht „Bild von …“. Dekorative Bilder bekommen \`alt=""\`, damit Screenreader sie überspringen. \`width\`/\`height\` verhindern Layout-Sprünge (siehe [Web-Performance](#/artikel/web-performance)).

## ARIA – nur wenn nötig

[[ARIA]] ergänzt Rollen und Zustände, wenn es kein passendes HTML-Element gibt (z. B. Tabs, komplexe Widgets). Die erste Regel lautet: **Kein ARIA ist besser als falsches ARIA.**

\`\`\`html title="Aufklappbereich – einfachste Lösung zuerst"
<!-- Nativ, ohne JavaScript, barrierefrei: -->
<details>
  <summary>Versandkosten</summary>
  <p>Ab 50 € versandkostenfrei.</p>
</details>

<!-- Eigenes Widget: Zustand per ARIA mitteilen -->
<button aria-expanded="false" aria-controls="menue">Menü</button>
<ul id="menue" hidden>…</ul>
\`\`\`

## Typische Fehler

> [!MISTAKE] Klickbare \`div\`s
> \`<div onclick>\` ist für Tastatur und Screenreader unsichtbar. Verwende \`<button>\`. Falls es wirklich ein \`div\` sein muss, brauchst du \`role="button"\`, \`tabindex="0"\` und Tastatur-Handler – also nimm den Button.

> [!MISTAKE] Fokusring entfernen
> \`outline: none\` ohne Ersatz macht Tastaturbedienung unmöglich. Gestalte ihn lieber mit \`:focus-visible\`.

> [!MISTAKE] Information nur über Farbe
> „Pflichtfelder sind rot markiert“ hilft Menschen mit Farbsehschwäche nicht. Ergänze Text oder Symbole.

## Prüfliste

- [x] \`lang\`-Attribut, aussagekräftiger \`<title>\`
- [x] Eine \`<h1>\`, logische Überschriftenhierarchie
- [x] Landmarken: \`header\`, \`nav\`, \`main\`, \`footer\`
- [x] Alle Funktionen per Tastatur erreichbar, sichtbarer Fokus
- [x] Formularfelder mit Labels, Fehler verständlich beschrieben
- [x] Sinnvolle Alternativtexte
- [x] Ausreichende Kontraste (WCAG: mind. 4,5:1 für normalen Text)
- [x] Mit Screenreader (NVDA, VoiceOver) und Lighthouse/axe getestet

## Wie geht es weiter?

Gestalte die Struktur mit [Flexbox & Grid](#/artikel/css-layout) und mache sie interaktiv mit [JavaScript & DOM](#/artikel/javascript-dom).
`;export{e as default};
