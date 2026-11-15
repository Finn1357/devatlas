const e=`---
id: clean-code-solid
title: Clean Code, SOLID, DRY, KISS & YAGNI
area: architektur
difficulty: fortgeschritten
minutes: 18
order: 10
summary: Prinzipien für Code, der auch in Jahren noch verständlich und änderbar ist – mit Vorher-nachher-Beispielen, den fünf SOLID-Prinzipien und dem Umgang mit technischen Schulden.
tags: [Clean Code, SOLID, DRY, KISS, YAGNI, Refactoring]
related: [design-patterns, architekturstile, testing, refactoring-code-smells]
---

## Warum Lesbarkeit wichtiger ist als Cleverness

Code wird **viel öfter gelesen als geschrieben** – von Kolleginnen, Reviewern und deinem zukünftigen Ich. [[Clean Code]] ist Code, den man schnell versteht und gefahrlos ändern kann. Die folgenden Prinzipien sind **Heuristiken**, keine Gesetze: Sie helfen, Entscheidungen zu begründen, ersetzen aber nicht das Nachdenken.

## Namen

\`\`\`python title="Vorher"
def calc(d, t):
    r = []
    for x in d:
        if x[2] > t:
            r.append(x)
    return r
\`\`\`

\`\`\`python title="Nachher"
def bestellungen_ueber_betrag(bestellungen: list[Bestellung], mindestbetrag: float) -> list[Bestellung]:
    return [b for b in bestellungen if b.summe > mindestbetrag]
\`\`\`

- Namen beschreiben **Absicht**, nicht Typ (\`kunden\` statt \`list1\`).
- Funktionen heißen nach dem, was sie tun (\`sende_rechnung\`), Booleans als Frage (\`ist_aktiv\`, \`hat_rabatt\`).
- Keine magischen Zahlen: \`if alter >= VOLLJAEHRIG\` statt \`if alter >= 18\`.
- Konsistent bleiben: nicht \`holeKunde\`, \`fetchUser\` und \`loadClient\` im selben Projekt.

## Funktionen

- **Klein und fokussiert:** eine Aufgabe auf einer Abstraktionsebene.
- **Wenige Parameter:** Viele Parameter deuten auf ein fehlendes Objekt hin.
- **Guard Clauses** statt tiefer Verschachtelung:

\`\`\`typescript title="Früh aussteigen statt verschachteln"
function versandkosten(bestellung: Bestellung): number {
  if (bestellung.positionen.length === 0) throw new Error('Leere Bestellung');
  if (bestellung.kunde.istPremium) return 0;
  if (bestellung.summe >= 50) return 0;
  return bestellung.land === 'DE' ? 4.9 : 12.9;
}
\`\`\`

- **Seiteneffekte sichtbar machen:** Eine Funktion \`pruefePasswort\` sollte nicht nebenbei die Session initialisieren ([[Seiteneffekt]]).

## Kommentare

Gute Kommentare erklären das **Warum** – Entscheidungen, Randbedingungen, nicht offensichtliche Zusammenhänge. Das **Was** sollte der Code selbst ausdrücken.

\`\`\`javascript
// ❌ erhöht i um 1
i++;

// ✅ Der Zahlungsanbieter lehnt Beträge unter 0,50 € ab (Fehlercode 4012).
if (betrag < 0.5) return zahleSpaeter(bestellung);
\`\`\`

## DRY, KISS, YAGNI

- **[[DRY]] – Don’t Repeat Yourself:** Jedes Stück *Wissen* (eine Geschäftsregel, eine Formel) gehört an genau eine Stelle. Achtung: Zwei Codestellen, die zufällig gleich aussehen, aber unterschiedliche Gründe haben sich zu ändern, sind **keine** Duplikation. Vorschnelle Abstraktion ist oft schlimmer als ein wenig Wiederholung („Rule of Three“: erst beim dritten Mal abstrahieren).
- **[[KISS]] – Keep It Simple:** Die einfachste Lösung, die die Anforderungen erfüllt. Komplexität ist der größte Kostentreiber.
- **[[YAGNI]] – You Aren’t Gonna Need It:** Baue nichts für hypothetische zukünftige Anforderungen. Die Zukunft kommt meist anders.

## SOLID

[[SOLID]] fasst fünf Prinzipien für objektorientierten Entwurf zusammen.

### S – Single Responsibility

Eine Klasse/ein Modul sollte **einen Grund haben, sich zu ändern**.

\`\`\`typescript title="Vorher: drei Verantwortlichkeiten in einer Klasse"
class RechnungService {
  berechne(b: Bestellung) { /* Steuern, Rabatte … */ }
  alsPdf(r: Rechnung) { /* Layout, Schriften … */ }
  perMailSenden(r: Rechnung) { /* SMTP … */ }
}
\`\`\`

Ändert sich das Steuerrecht, das Layout oder der Mail-Anbieter, muss dieselbe Klasse angefasst werden. Besser: \`RechnungsRechner\`, \`RechnungsPdf\`, \`RechnungsVersand\`.

### O – Open/Closed

Offen für **Erweiterung**, geschlossen für **Änderung**: Neues Verhalten durch neuen Code hinzufügen, statt bestehenden zu ändern.

\`\`\`typescript title="Neue Zahlungsart = neue Klasse, kein neues else-if"
interface Zahlungsart { bezahle(betrag: number): Promise<Quittung>; }
class Kreditkarte implements Zahlungsart { /* … */ }
class Rechnung implements Zahlungsart { /* … */ }
class Paypal implements Zahlungsart { /* … */ }   // Erweiterung ohne Änderung am Checkout

async function checkout(b: Bestellung, zahlung: Zahlungsart) {
  return zahlung.bezahle(b.summe);
}
\`\`\`

### L – Liskov Substitution

Ein Subtyp muss überall dort funktionieren, wo der Basistyp erwartet wird – ohne Überraschungen. Klassisches Gegenbeispiel: \`Quadrat extends Rechteck\`, bei dem \`setBreite\` plötzlich auch die Höhe ändert. Code, der mit \`Rechteck\` arbeitet, bricht.

### I – Interface Segregation

Lieber mehrere kleine, spezifische [[Interface|Interfaces]] als ein großes. Ein \`Drucker\`, der \`faxen()\` implementieren muss, obwohl er nicht faxen kann, ist ein Warnsignal.

### D – Dependency Inversion

Höhere Module hängen von **Abstraktionen** ab, nicht von konkreten Implementierungen. Konkrete Abhängigkeiten werden von außen hereingereicht ([[Dependency Injection]]):

\`\`\`python
class BestellService:
    def __init__(self, repo: BestellRepository, mail: MailVersand):   # Abstraktionen
        self.repo = repo
        self.mail = mail

# Produktion:  BestellService(PostgresRepo(...), SmtpVersand(...))
# Test:        BestellService(InMemoryRepo(), FakeMail())
\`\`\`

## Code Smells erkennen

| [[Code Smell]] | Hinweis auf |
|---|---|
| Lange Funktion / große Klasse | zu viele Verantwortlichkeiten |
| Lange Parameterliste | fehlendes Objekt |
| Shotgun Surgery (eine Änderung → viele Dateien) | verstreute Verantwortung |
| Feature Envy (Methode nutzt fast nur Daten einer anderen Klasse) | Methode sitzt am falschen Ort |
| Primitive Obsession (\`string\` für E-Mail, Geld, IBAN) | fehlende Wertobjekte |
| Kommentar erklärt verwirrenden Code | Code umbenennen/aufteilen |

## Refactoring und technische Schulden

[[Refactoring]] verbessert die Struktur, **ohne das Verhalten zu ändern** – in kleinen Schritten und mit [Tests](#/artikel/testing) als Sicherheitsnetz. „Pfadfinderregel“: Hinterlasse Code etwas besser, als du ihn vorgefunden hast.

[[Technische Schulden]] entstehen, wenn man bewusst oder unbewusst schnelle statt saubere Lösungen wählt. Bewusste Schulden können sinnvoll sein (Prototyp, Deadline) – wenn sie **dokumentiert** und **zurückgezahlt** werden. Sonst zahlt man „Zinsen“: Jede Änderung dauert länger und wird riskanter.

## Wie geht es weiter?

Bewährte Lösungen für wiederkehrende Entwurfsprobleme zeigt [Design Patterns](#/artikel/design-patterns); die Struktur ganzer Systeme [Architekturstile](#/artikel/architekturstile).
`;export{e as default};
