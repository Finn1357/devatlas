const e=`---
id: security-methodik
title: Methodik für Sicherheitsrätsel: systematisch statt raten
area: security
difficulty: einsteiger
minutes: 14
order: 22
summary: Ein Vorgehen, das bei CTF-Aufgaben und echten Sicherheitsprüfungen trägt – verstehen, Informationen sammeln, Hypothesen bilden, gezielt prüfen und alles dokumentieren. Dazu eine Notizvorlage, Strategien gegen das Feststecken, Regeln für Writeups und wie du echte Lücken verantwortungsvoll meldest.
tags: [Methodik, CTF, Notizen, Writeup, Responsible Disclosure, Lernen]
related: [ctf-einstieg, owasp-top-10, secure-development, logs-forensik-einstieg, kodierungen-hashes-erkennen]
---

## Warum Methodik wichtiger ist als Werkzeuge

Einsteiger verlieren die meiste Zeit nicht, weil ihnen ein Werkzeug fehlt, sondern weil sie **ziellos** probieren: dasselbe zweimal, Wichtiges übersehen, keine Ahnung mehr, was schon versucht wurde. Erfahrene Leute arbeiten in einer festen Schleife – und schreiben alles auf. Das gilt für CTF-Rätsel genauso wie für Penetrationstests, Fehlersuche oder Code-Reviews.

## Die Schleife

1. **Verstehen:** Was ist das Ziel? Was ist erlaubt (Scope)? Was ist gegeben – eine Datei, eine Webseite, eine Adresse im Übungsnetz?
2. **Informationen sammeln ([[Reconnaissance]]):** Was gibt es hier? Welche Dateien, Dienste, Versionen, Seiten, Eingabefelder, Parameter? Noch nichts bewerten – nur erfassen.
3. **Hypothesen bilden:** „Die Seite zeigt Daten zu \`?id=3\` – prüft sie, ob ich \`id=4\` sehen darf?“ „Diese Zeichenkette endet auf \`=\` – Base64?“
4. **Gezielt prüfen:** eine Hypothese, ein kleiner Test, ein eindeutiges Ergebnis. Nicht zehn Dinge gleichzeitig ändern.
5. **Auswerten und notieren:** Was hat das Ergebnis gezeigt? Was folgt daraus? Zurück zu Schritt 2 oder 3.

> [!TIP] Die zwei Leitfragen
> Bei allem, was du siehst: **Was ist das?** und **Wer kontrolliert es?** Daten, die du als Nutzer verändern kannst – URL-Parameter, Formularfelder, Cookies, Header, hochgeladene Dateien –, sind die Stellen, an denen Anwendungen am häufigsten Fehler machen. Welche Fehlerklassen dort typisch sind, erklärt [OWASP Top 10](#/artikel/owasp-top-10).

## Eine Notizvorlage

\`\`\`markdown title="notizen.md"
# Aufgabe: <Name> (<Plattform>, <Datum>)

## Ziel und Scope
- Was ist gesucht? Was ist erlaubt?

## Beobachtungen
- (Fakten, ohne Bewertung: Dienste, Versionen, Seiten, Dateien, auffällige Zeichenketten)

## Hypothesen
- [ ] H1: …
- [ ] H2: …

## Versuche
| Was | Warum | Ergebnis |
|---|---|---|

## Funde
- …

## Offene Fragen
- …

## Gelernt / Wie hätte man es verhindert?
- …
\`\`\`

Der letzte Abschnitt ist der wertvollste: Zu **jedem** Fund notierst du, wie ein Entwickler oder Admin ihn verhindert hätte. So wird aus jedem Rätsel Wissen für sichere Software – mit Bezug auf [Sicherheit im Entwicklungsprozess](#/artikel/secure-development).

## Recherchieren

- **Dokumentation zuerst:** Wie funktioniert der Dienst, das Format, die Funktion normalerweise? Viele Rätsel lösen sich, sobald man das „normale“ Verhalten kennt.
- **Versionen nachschlagen:** Zu bekannten Schwachstellen gibt es [[CVE]]-Einträge in der National Vulnerability Database (NVD) und Hinweise der Hersteller. Lies, **was** der Fehler ist und **warum** er auftritt.
- **Quellcode lesen**, wenn er verfügbar ist – in Rätseln häufig der Schlüssel.
- **Kleine Experimente** in einer eigenen Testumgebung: Wie reagiert eine Funktion auf ungewöhnliche Eingaben?

## Wenn du feststeckst

- **Zurück zu Schritt 2:** Fast immer wurde etwas übersehen. Gehe die Beobachtungen noch einmal vollständig durch.
- **Annahmen aufschreiben** und jede einzeln prüfen: „Ich gehe davon aus, dass …“
- **Erklären:** Beschreibe das Problem jemandem – oder einer Gummiente. Beim Formulieren fällt die Lücke oft selbst auf.
- **Pause:** Nach einer halben Stunde ohne Fortschritt hilft Abstand mehr als weitere Versuche.
- **Hinweise dosiert:** Erst nach fester eigener Zeit einen Hinweis holen, der die Richtung zeigt, nicht die Lösung.
- **Nach dem Lösen** (oder nach dem Aufgeben bei einer beendeten Aufgabe): ein Writeup lesen und **nachbauen**, nicht nur lesen.

## Writeups schreiben

Ein Writeup ist die nachvollziehbare Beschreibung deines Lösungswegs – für dich, für andere und als Nachweis deiner Fähigkeiten.

- **Aufbau:** Überblick → Informationen sammeln → Fund → Ausnutzung bzw. Lösung in Worten → **Abhilfe** → Gelerntes.
- **Auch die Sackgassen** kurz erwähnen – sie zeigen das Denken.
- **Regeln beachten:** Writeups zu **aktiven** Aufgaben nicht veröffentlichen; viele Plattformen erlauben es erst nach dem Ruhestand einer Aufgabe. Flaggen nie veröffentlichen.

## Vom Rätsel zur echten Welt: verantwortungsvoll melden

Irgendwann fällt dir vielleicht außerhalb eines CTF etwas auf – eine Seite, die fremde Daten anzeigt, eine offen liegende Datei. Dann gilt:

> [!DANGER] Nicht weiter testen
> Außerhalb eines freigegebenen Scopes testest du nicht weiter – auch nicht „um es zu beweisen“. Das Ausnutzen einer Lücke ohne Erlaubnis ist strafbar, selbst mit guten Absichten.

So meldest du eine Lücke ([[Responsible Disclosure]]):

1. **Kontakt finden:** \`/.well-known/security.txt\` der Website, eine Sicherheits-E-Mail-Adresse oder ein Bug-Bounty-Programm.
2. **Sachlich beschreiben:** Was ist dir aufgefallen, wo, wann, welche Daten sind betroffen? Keine fremden Daten herunterladen oder weitergeben.
3. **Zeit geben:** Üblich sind Wochen bis Monate, bis Details veröffentlicht werden – abgestimmt mit dem Betreiber.
4. **Bei Bug-Bounty-Programmen** gelten deren Regeln: Nur der dort beschriebene Scope ist freigegeben.

Wer keine Antwort bekommt, kann sich an Koordinationsstellen wenden – in Deutschland etwa an das CERT des BSI.

## Typische Fehler

> [!MISTAKE] Werkzeug-Ausgaben ungelesen weiterverarbeiten
> Werkzeuge liefern Hinweise, keine Wahrheiten. Ein „möglicherweise verwundbar“ ist eine Hypothese, die du verstehen und prüfen musst – nicht die Lösung.

- **Mehrere Dinge gleichzeitig ändern** – dann weißt du nicht, was gewirkt hat.
- **Keine Notizen** – und nach einer Pause beginnt alles von vorn.
- **Lösungen abschreiben**, statt sie nachzuvollziehen.
- **Scope vergessen** – auch im CTF gehört nur das freigegebene Ziel dazu.

\`\`\`widget
quiz:CTF-Grundlagen 3
\`\`\`

## Übungsfragen

> 1. Wie unterscheiden sich Beobachtung und Hypothese in deinen Notizen? Gib je ein Beispiel.
> 2. Du findest auf einer echten Website zufällig eine öffentlich abrufbare Backup-Datei. Welche Schritte gehst du – und welche nicht?
> 3. Warum lohnt es sich, zu jedem Fund aufzuschreiben, wie er hätte verhindert werden können?

## Wie geht es weiter?

Wende die Schleife direkt im [Rätsel-Labor](#/labor/raetsel) an. Für das Fundament sorgen [Linux für Security-Einsteiger](#/artikel/linux-security-grundlagen) und [Dienste & Angriffsfläche](#/artikel/dienste-ports-angriffsflaeche); welche Fehler Anwendungen typischerweise machen, steht in [OWASP Top 10](#/artikel/owasp-top-10) und [Injection](#/artikel/injection).
`;export{e as default};
