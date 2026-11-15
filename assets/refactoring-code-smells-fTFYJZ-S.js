const e=`---
id: refactoring-code-smells
title: Refactoring & Code Smells
area: architektur
difficulty: fortgeschritten
minutes: 18
order: 15
summary: Code verbessern, ohne sein Verhalten zu ändern – die häufigsten Code Smells mit konkreten Vorher-nachher-Beispielen, sichere Arbeitsweise in kleinen Schritten, Strategien für Legacy-Code und der Umgang mit technischen Schulden.
tags: [Refactoring, Code Smells, Legacy Code, Technische Schulden, Clean Code]
related: [clean-code-solid, testing, design-patterns, domain-driven-design]
---

## Was Refactoring ist – und was nicht

**[[Refactoring]]** bedeutet, die **innere Struktur** von Code zu verbessern, **ohne sein äußeres Verhalten zu ändern** (Martin Fowler). Ziel: Code leichter verständlich und leichter änderbar machen.

Kein Refactoring ist: neue Funktionen einbauen, Fehler beheben oder „alles neu schreiben“. Diese Dinge sind wichtig – aber vermischt man sie mit Refactoring, weiß niemand mehr, ob eine Verhaltensänderung gewollt war.

## Sicher refaktorieren

1. **Sicherheitsnetz:** [Tests](#/artikel/testing), die das aktuelle Verhalten absichern. Ohne Tests ist Refactoring Glücksspiel.
2. **Kleine Schritte:** eine Umbenennung, eine extrahierte Funktion – dann Tests ausführen.
3. **Werkzeuge nutzen:** IDEs refaktorieren automatisch und zuverlässig (Umbenennen, Funktion extrahieren, Parameter hinzufügen, Datei verschieben).
4. **Getrennt committen:** Refactoring-Commits ohne Verhaltensänderung erleichtern das Review.

> [!TIP] Zwei Hüte
> Kent Beck vergleicht es mit zwei Hüten: Mit dem einen fügst du Funktionen hinzu, mit dem anderen refaktorierst du. Trage nie beide gleichzeitig. Oft lautet der beste Weg: „Erst den Code so umbauen, dass die Änderung einfach wird – dann die einfache Änderung machen.“

## Häufige Code Smells

Ein **[[Code Smell]]** ist ein Hinweis auf ein tieferliegendes Strukturproblem – kein Fehler, aber ein Grund, genauer hinzusehen.

| Smell | Erkennbar an | Typisches Refactoring |
|---|---|---|
| **Lange Funktion** | scrollen nötig, Kommentare als Abschnittsüberschriften | Funktion extrahieren |
| **Duplizierter Code** | gleiche Logik an mehreren Stellen | gemeinsame Funktion extrahieren |
| **Lange Parameterliste** | \`f(a, b, c, d, e, f)\` | Parameterobjekt einführen |
| **Primitive Obsession** | Geld als \`float\`, E-Mail als \`str\`, Status als magischer String | Value Object, Enum |
| **Magische Zahlen** | \`if alter > 17\`, \`* 1.19\` | benannte Konstante |
| **Tiefe Verschachtelung** | \`if\` in \`if\` in \`for\` in \`if\` | Guard Clauses, Funktion extrahieren |
| **Switch über Typen** | dasselbe \`switch (typ)\` an vielen Stellen | Polymorphie, Strategie-Muster |
| **Feature Envy** | Methode nutzt fast nur Daten eines anderen Objekts | Methode verschieben |
| **Große Klasse / God Object** | Hunderte Zeilen, viele unabhängige Aufgaben | Klasse aufteilen (Single Responsibility) |
| **Shotgun Surgery** | eine fachliche Änderung erfordert Änderungen in zehn Dateien | Zusammengehöriges zusammenführen |
| **Toter Code** | nie aufgerufene Funktionen, auskommentierte Blöcke | löschen – Git vergisst nichts |
| **Spekulative Allgemeinheit** | Abstraktionen „für später“, die nie gebraucht werden | vereinfachen (YAGNI) |
| **Erklärende Kommentare** | Kommentar erklärt, *was* unverständlicher Code tut | Code verständlich machen, Kommentar für das *Warum* |

## Vorher – nachher

### Tiefe Verschachtelung → Guard Clauses

\`\`\`python title="Vorher"
def versandkosten(bestellung):
    if bestellung is not None:
        if bestellung.positionen:
            if bestellung.land == "DE":
                if bestellung.summe >= 50:
                    return 0
                else:
                    return 4.90
            else:
                return 14.90
        else:
            raise ValueError("Leere Bestellung")
    else:
        raise ValueError("Keine Bestellung")
\`\`\`

\`\`\`python title="Nachher"
KOSTENLOS_AB = 50
VERSAND_INLAND = 4.90
VERSAND_AUSLAND = 14.90

def versandkosten(bestellung):
    if bestellung is None:
        raise ValueError("Keine Bestellung")
    if not bestellung.positionen:
        raise ValueError("Leere Bestellung")
    if bestellung.land != "DE":
        return VERSAND_AUSLAND
    return 0 if bestellung.summe >= KOSTENLOS_AB else VERSAND_INLAND
\`\`\`

Sonderfälle werden früh behandelt und verlassen die Funktion; der Normalfall steht ohne Einrückung am Ende. Die magischen Zahlen haben Namen.

### Lange Funktion → Funktionen extrahieren

\`\`\`typescript title="Vorher: eine Funktion, vier Aufgaben"
async function registriere(daten: { email: string; passwort: string; name: string }) {
  // Validierung
  if (!/^[^@\\s]+@[^@\\s]+$/.test(daten.email)) throw new Error('Ungültige E-Mail');
  if (daten.passwort.length < 12) throw new Error('Passwort zu kurz');
  // Prüfen, ob vorhanden
  const vorhanden = await db.query('SELECT 1 FROM nutzer WHERE email = $1', [daten.email]);
  if (vorhanden.rowCount) throw new Error('E-Mail bereits registriert');
  // Speichern
  const hash = await argon2.hash(daten.passwort);
  const nutzer = await db.query('INSERT INTO nutzer (email, hash, name) VALUES ($1, $2, $3) RETURNING id', [daten.email, hash, daten.name]);
  // Willkommensmail
  await mailer.send(daten.email, 'Willkommen!', \`Hallo \${daten.name}, schön, dass du da bist.\`);
  return nutzer.rows[0].id;
}
\`\`\`

\`\`\`typescript title="Nachher: die Funktion liest sich wie die Fachlichkeit"
async function registriere(daten: Registrierung) {
  pruefeEingaben(daten);
  await stelleSicherDassEmailFrei(daten.email);
  const id = await legeNutzerAn(daten);
  await sendeWillkommensmail(daten);
  return id;
}
\`\`\`

Die Kommentare von vorher sind zu Funktionsnamen geworden. Jede Teilfunktion ist einzeln verständlich und testbar.

### Switch über Typen → Polymorphie

\`\`\`typescript title="Vorher: dieser switch steht an fünf Stellen im Code"
function flaeche(f: { typ: string; r?: number; b?: number; h?: number }) {
  switch (f.typ) {
    case 'kreis': return Math.PI * f.r! ** 2;
    case 'rechteck': return f.b! * f.h!;
    default: throw new Error('Unbekannte Form');
  }
}
\`\`\`

\`\`\`typescript title="Nachher: neue Formen erfordern keine Änderung bestehender Funktionen"
interface Form { flaeche(): number; umfang(): number }

class Kreis implements Form {
  constructor(private r: number) {}
  flaeche() { return Math.PI * this.r ** 2; }
  umfang() { return 2 * Math.PI * this.r; }
}
class Rechteck implements Form {
  constructor(private b: number, private h: number) {}
  flaeche() { return this.b * this.h; }
  umfang() { return 2 * (this.b + this.h); }
}
\`\`\`

Das ist das **Open-Closed-Prinzip** aus [SOLID](#/artikel/clean-code-solid). Hinweis: Wenn sich eher die **Operationen** ändern als die Typen, ist der umgekehrte Weg (Discriminated Union mit vollständigem \`switch\`, siehe [Typsysteme](#/artikel/typsysteme-paradigmen)) oft besser – kein Muster passt immer.

## Legacy-Code

Michael Feathers definiert Legacy-Code als **Code ohne Tests**. Bevor man ihn ändert:

1. **Charakterisierungstests** schreiben: nicht prüfen, was der Code tun *sollte*, sondern festhalten, was er *tatsächlich* tut – inklusive seltsamer Ergebnisse. Snapshot-Tests helfen dabei.
2. **Nahtstellen finden** (Seams): Stellen, an denen sich Abhängigkeiten ersetzen lassen, etwa durch einen Parameter statt eines fest verdrahteten Datenbankaufrufs.
3. **Kleine, sichere Schritte** – auch wenn das Gesamtziel groß ist.

> [!WARNING] Der große Neuschrieb
> „Wir schreiben alles neu“ unterschätzt fast immer das Wissen, das im alten Code steckt (Sonderfälle, behobene Fehler). Sicherer ist das **Strangler-Fig-Muster**: Neue Funktionen entstehen neben dem alten System; Teil für Teil wird umgeleitet, bis das Alte abgeschaltet werden kann.

## Technische Schulden

**[[Technische Schulden]]** sind Abkürzungen, die heute Zeit sparen und später Zinsen kosten: jede Änderung dauert länger. Bewusst eingegangene Schulden (z. B. für einen Messetermin) können sinnvoll sein – wenn man sie dokumentiert und zurückzahlt.

Praktische Regeln:
- **Pfadfinderregel:** Hinterlasse Code etwas besser, als du ihn vorgefunden hast – in dem Bereich, an dem du ohnehin arbeitest.
- Refactoring als Teil der normalen Arbeit, nicht als separates „Refactoring-Projekt“ ohne Fachnutzen.
- Schulden sichtbar machen (Tickets, Architekturentscheidungen als ADRs dokumentieren).
- Werkzeuge: [Linter](#/artikel/paketmanager-buildtools), statische Analyse (SonarQube, CodeQL), Komplexitätsmetriken – als Hinweisgeber, nicht als Selbstzweck.

## Wie geht es weiter?

Die Prinzipien hinter gutem Code beschreibt [Clean Code & SOLID](#/artikel/clean-code-solid); bewährte Lösungsstrukturen [Design Patterns](#/artikel/design-patterns).
`;export{e as default};
