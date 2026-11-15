const e=`---
id: barrierefreiheit
title: Barrierefreiheit im Web: WCAG, Tastatur, Screenreader & ARIA
area: web
difficulty: fortgeschritten
minutes: 20
order: 20
summary: Warum digitale Barrierefreiheit Pflicht und Qualitätsmerkmal ist, die WCAG-Prinzipien, semantisches HTML, Tastaturbedienung und Fokus, Kontraste, Formulare, ARIA richtig einsetzen, barrierefreie Dialoge – und wie man testet.
tags: [Barrierefreiheit, Accessibility, a11y, WCAG, ARIA, Screenreader]
related: [html-semantik, css-layout, frontend-frameworks, web-performance]
---

## Für wen – und warum?

**[[Barrierefreiheit]]** (Accessibility, kurz **a11y**) bedeutet, dass Menschen eine Anwendung unabhängig von ihren Fähigkeiten nutzen können:

- **Sehen:** Blindheit (Screenreader), Sehschwäche (Vergrößerung, hohe Kontraste), Farbenblindheit.
- **Motorik:** Bedienung nur per Tastatur, Sprachsteuerung, Schaltern oder Augensteuerung.
- **Hören:** Untertitel und Transkripte für Audio und Video.
- **Kognition:** klare Sprache, vorhersehbare Bedienung, genug Zeit.

Dazu kommen **situative** Einschränkungen: Sonnenlicht auf dem Display, ein gebrochener Arm, ein lautes Großraumbüro. Barrierefreiheit verbessert die Nutzbarkeit für alle – und hilft nebenbei Suchmaschinen und automatisierten Tests, die Seite zu verstehen.

> [!INFO] Rechtliche Lage
> Der **European Accessibility Act** verpflichtet seit dem 28. Juni 2025 viele private Anbieter – u. a. im Onlinehandel, bei Bankdienstleistungen und E-Books – zu barrierefreien digitalen Angeboten. In Deutschland setzt das **Barrierefreiheitsstärkungsgesetz (BFSG)** dies um; für öffentliche Stellen gelten schon länger BITV 2.0 bzw. EN 301 549. Technische Grundlage sind jeweils die **WCAG**.

## WCAG: Die Richtlinien

Die **[[WCAG]]** (Web Content Accessibility Guidelines, aktuell Version 2.2) gliedern sich in vier Prinzipien – **POUR**:

| Prinzip | Bedeutung | Beispiele |
|---|---|---|
| **Wahrnehmbar** (Perceivable) | Inhalte müssen wahrnehmbar sein | Alternativtexte, Untertitel, ausreichende Kontraste |
| **Bedienbar** (Operable) | Bedienung muss möglich sein | Tastaturbedienung, genug Zeit, keine blinkenden Inhalte |
| **Verständlich** (Understandable) | Inhalte und Bedienung müssen verständlich sein | klare Sprache, vorhersehbares Verhalten, Hilfe bei Fehlern |
| **Robust** | Inhalte funktionieren mit Hilfstechnologien | valides, semantisches HTML, korrekte ARIA-Werte |

Jedes Erfolgskriterium hat eine Stufe **A**, **AA** oder **AAA**. Gesetzlich gefordert ist in der Regel **AA**.

## Semantisches HTML zuerst

Die wichtigste Maßnahme kostet nichts: die **richtigen HTML-Elemente**. Sie bringen Tastaturbedienung, Fokus und die richtige Ansage im Screenreader automatisch mit.

\`\`\`html title="So nicht – und so"
<!-- ❌ nicht fokussierbar, keine Tastaturbedienung, Screenreader sagt nur "Speichern" -->
<div class="btn" onclick="speichern()">Speichern</div>

<!-- ✅ fokussierbar, Enter und Leertaste funktionieren, wird als "Schaltfläche" angesagt -->
<button type="button" onclick="speichern()">Speichern</button>
\`\`\`

| Zweck | Richtiges Element |
|---|---|
| Aktion auslösen | \`<button>\` |
| Zu einer anderen Seite/Adresse navigieren | \`<a href="…">\` |
| Seitenstruktur | \`<header>\`, \`<nav>\`, \`<main>\`, \`<aside>\`, \`<footer>\` (Landmarks) |
| Überschriften-Hierarchie | \`<h1>\`–\`<h6>\` ohne Ebenen zu überspringen |
| Listen | \`<ul>\`, \`<ol>\` |
| Tabellendaten | \`<table>\` mit \`<th scope="col">\` |
| Dialog | \`<dialog>\` |

Screenreader-Nutzer springen häufig über **Überschriften** und **Landmarks** durch eine Seite – eine saubere Struktur ist ihr Inhaltsverzeichnis. Mehr dazu in [HTML-Semantik](#/artikel/html-semantik).

## Tastaturbedienung und Fokus

Alles, was mit der Maus geht, muss auch mit der **Tastatur** gehen: \`Tab\`/\`Shift+Tab\` zum Navigieren, \`Enter\`/\`Leertaste\` zum Auslösen, Pfeiltasten in Menüs und Listen, \`Esc\` zum Schließen.

\`\`\`css title="Fokus sichtbar machen – nie ersatzlos entfernen"
/* ❌ */
:focus { outline: none; }

/* ✅ Fokusring für Tastaturnutzer, nicht bei Mausklick */
:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
\`\`\`

- **Tab-Reihenfolge** folgt der DOM-Reihenfolge – Layout per CSS nicht so umsortieren, dass sie unlogisch wird.
- \`tabindex="0"\` macht ein Element fokussierbar, \`tabindex="-1"\` per Skript fokussierbar. **Positive Werte** (\`tabindex="5"\`) vermeiden – sie zerstören die natürliche Reihenfolge.
- **Skip-Link** als erstes Element: \`<a href="#inhalt" class="skip-link">Zum Inhalt springen</a>\` – erspart das Durchtabben der Navigation auf jeder Seite.
- **Keine Tastaturfallen:** Aus jedem Bereich muss man per Tastatur wieder herauskommen.

### Fokus in Single-Page-Anwendungen

Bei einem Seitenwechsel ohne Neuladen bekommt ein Screenreader nichts mit. Nach der Navigation den Fokus auf die neue Hauptüberschrift setzen (mit \`tabindex="-1"\`) oder die Änderung über eine Live-Region ansagen.

## Barrierefreier Dialog

Das native \`<dialog>\`-Element erledigt das Schwierigste von selbst: Mit \`showModal()\` wird der Rest der Seite inaktiv, der Fokus wandert in den Dialog, \`Esc\` schließt ihn.

\`\`\`html
<button type="button" id="oeffnen">Konto löschen</button>

<dialog id="bestaetigung" aria-labelledby="dialog-titel">
  <h2 id="dialog-titel">Konto wirklich löschen?</h2>
  <p>Alle Daten werden unwiderruflich entfernt.</p>
  <form method="dialog">
    <button value="abbrechen" autofocus>Abbrechen</button>
    <button value="loeschen">Endgültig löschen</button>
  </form>
</dialog>

<script>
  const dialog = document.getElementById('bestaetigung');
  const ausloeser = document.getElementById('oeffnen');
  ausloeser.addEventListener('click', () => dialog.showModal());
  dialog.addEventListener('close', () => {
    if (dialog.returnValue === 'loeschen') kontoLoeschen();
    ausloeser.focus();                     // Fokus zurück zum auslösenden Element
  });
<\/script>
\`\`\`

## Bilder und Medien

\`\`\`html
<img src="umsatz-2026.png" alt="Umsatz 2026: von 1,2 Mio. € im Januar auf 1,8 Mio. € im Oktober gestiegen">
<img src="trenner.svg" alt="">                      <!-- dekorativ: leeres alt, wird übersprungen -->
<button aria-label="Menü öffnen"><svg aria-hidden="true">…</svg></button>   <!-- Icon-Button -->
\`\`\`

- Der **Alternativtext** beschreibt den **Zweck** bzw. die Aussage, nicht das Aussehen („Diagramm“ allein hilft niemandem).
- Rein **dekorative** Bilder: \`alt=""\` – nicht weglassen, sonst liest der Screenreader den Dateinamen vor.
- **Videos** brauchen Untertitel, reine Audioinhalte ein Transkript.

## Farbe und Kontrast

| Element | Mindestkontrast (AA) |
|---|---|
| Normaler Text | **4,5 : 1** |
| Großer Text (ab 24 px bzw. 18,66 px fett) | **3 : 1** |
| UI-Komponenten und Grafiken (Rahmen von Eingabefeldern, Icons, Fokusring) | **3 : 1** |

**Information nie nur über Farbe** vermitteln: Ein rot umrandetes Feld allein reicht nicht – zusätzlich ein Fehlertext und ggf. ein Icon. Rund 8 % der Männer haben eine Rot-Grün-Sehschwäche.

## Formulare

\`\`\`html
<label for="email">E-Mail-Adresse</label>
<input id="email" type="email" autocomplete="email" required
       aria-invalid="true" aria-describedby="email-hinweis email-fehler">
<p id="email-hinweis">Wir senden dir einen Bestätigungslink.</p>
<p id="email-fehler">Bitte gib eine E-Mail-Adresse im Format name@beispiel.de ein.</p>
\`\`\`

- Jedes Feld hat ein **verknüpftes \`<label>\`** (Klick auf das Label fokussiert das Feld – größere Klickfläche).
- Zusammengehörige Felder (Radio-Buttons) in \`<fieldset>\` mit \`<legend>\`.
- **Fehlermeldungen** konkret formulieren, mit dem Feld verknüpfen (\`aria-describedby\`) und \`aria-invalid\` setzen. Bei vielen Fehlern: Zusammenfassung oben mit Links zu den Feldern.
- \`autocomplete\`-Attribute erleichtern das Ausfüllen enorm – nicht nur für Menschen mit motorischen Einschränkungen.

## ARIA: Mit Bedacht

**[[ARIA]]** (Accessible Rich Internet Applications) ergänzt HTML um Rollen, Zustände und Eigenschaften für Hilfstechnologien.

> [!WARNING] Die erste Regel von ARIA
> **Verwende kein ARIA, wenn es ein natives HTML-Element gibt**, das die Aufgabe erfüllt. ARIA ändert nur, was Hilfstechnologien *ansagen* – nicht das Verhalten. Ein \`<div role="button">\` braucht trotzdem \`tabindex="0"\` und eigene Tastaturbehandlung für Enter und Leertaste. Falsches ARIA ist schlimmer als keines.

Sinnvolle Einsätze:

| Attribut | Zweck |
|---|---|
| \`aria-label\`, \`aria-labelledby\` | Namen für Elemente ohne sichtbaren Text (Icon-Buttons) |
| \`aria-describedby\` | zusätzliche Beschreibung (Hinweise, Fehler) |
| \`aria-expanded\` | Zustand von Aufklapp-Elementen (\`true\`/\`false\`) |
| \`aria-current="page"\` | aktuelle Seite in der Navigation |
| \`aria-hidden="true"\` | rein dekorative Elemente vor Screenreadern verbergen |
| \`aria-live="polite"\` / \`role="status"\` | dynamische Meldungen ansagen („3 Ergebnisse gefunden“, „Gespeichert“) |
| \`role="alert"\` | dringende Meldungen sofort ansagen |

Für komplexe Komponenten (Tabs, Combobox, Baumansichten) beschreibt das **ARIA Authoring Practices Guide** des W3C, welche Rollen und Tastaturbedienung erwartet werden. Bewährte Bibliotheken wie Radix UI, React Aria, Headless UI oder Angular CDK setzen das bereits korrekt um.

## Bewegung und Zoom

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
\`\`\`

- Nutzer, die in ihrem System „Bewegung reduzieren“ aktiviert haben, reagieren oft mit Schwindel oder Übelkeit auf Animationen.
- Inhalte müssen bei **200 % Zoom** und bei **320 CSS-Pixeln Breite** ohne horizontales Scrollen nutzbar bleiben (Reflow). Relative Einheiten (\`rem\`) und flexible Layouts helfen.
- Klickflächen ausreichend groß machen (WCAG 2.2 fordert für AA mindestens 24 × 24 CSS-Pixel bzw. ausreichend Abstand).

## Testen

1. **Automatisch:** axe (Browser-Erweiterung, \`@axe-core/playwright\`, \`jest-axe\`), Lighthouse, \`eslint-plugin-jsx-a11y\`. Findet erfahrungsgemäß nur einen Teil der Probleme – etwa fehlende Labels, Kontraste, ungültige ARIA-Werte.
2. **Tastatur:** Maus weglegen und die wichtigsten Abläufe durchgehen. Ist der Fokus immer sichtbar? Ist die Reihenfolge logisch?
3. **Screenreader:** NVDA (Windows, kostenlos), VoiceOver (macOS/iOS, eingebaut), TalkBack (Android). Schon ein paar Minuten zeigen viel.
4. **Zoom** auf 200 % und schmales Fenster.
5. **Menschen mit Behinderungen** in Nutzertests einbeziehen – durch nichts zu ersetzen.

\`\`\`typescript title="Automatischer Barrierefreiheitstest mit Playwright und axe"
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Startseite hat keine erkennbaren a11y-Verstöße', async ({ page }) => {
  await page.goto('/');
  const ergebnis = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(ergebnis.violations).toEqual([]);
});
\`\`\`

## Wie geht es weiter?

Die Grundlage sind semantische Elemente – siehe [HTML-Semantik](#/artikel/html-semantik). Wie Frameworks Formulare und Fokus handhaben, steht in [Frontend-Frameworks](#/artikel/frontend-frameworks).
`;export{e as default};
