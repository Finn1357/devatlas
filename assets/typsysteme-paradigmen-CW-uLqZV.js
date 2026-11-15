const e=`---
id: typsysteme-paradigmen
title: Typsysteme & Programmierparadigmen
area: grundlagen
difficulty: einsteiger
minutes: 18
order: 17
summary: Statisch oder dynamisch, stark oder schwach, nominal oder strukturell – was Typsysteme leisten und wie sie sich unterscheiden. Dazu die großen Paradigmen imperativ, objektorientiert, funktional und deklarativ, jeweils am selben Beispiel.
tags: [Typsystem, Statische Typisierung, Dynamische Typisierung, OOP, Funktionale Programmierung, Paradigma]
related: [compiler-interpreter-runtime, clean-code-solid, design-patterns, speicherverwaltung]
---

## Wozu Typen?

Ein **[[Typsystem]]** legt fest, welche Arten von Werten es gibt (Zahl, Text, Liste, Kunde …) und welche Operationen damit erlaubt sind. Es verhindert sinnlose Operationen wie „Datum geteilt durch Farbe“ – entweder **vor** dem Programmstart (statisch) oder **während** der Ausführung (dynamisch). Zusätzlich dienen Typen als **Dokumentation** und ermöglichen Editoren präzise Autovervollständigung und sicheres Umbenennen.

## Statisch vs. dynamisch

| | **[[Statische Typisierung]]** | **[[Dynamische Typisierung]]** |
|---|---|---|
| Wann wird geprüft? | beim Kompilieren / vor dem Start | zur Laufzeit, wenn die Zeile ausgeführt wird |
| Typfehler fällt auf | sofort, im Editor | erst, wenn der Code läuft (ggf. beim Kunden) |
| Typen stehen an | Variablen und Werten | nur an Werten |
| Beispiele | Java, C#, Go, Rust, Kotlin, Swift, C++, TypeScript | Python, JavaScript, Ruby, PHP, Lua |

\`\`\`python title="Python: dynamisch – der Fehler fällt erst beim Aufruf auf"
def verdopple(x):
    return x * 2

print(verdopple(21))      # 42
print(verdopple("ab"))    # "abab" – auch erlaubt
print(verdopple(None))    # TypeError – erst zur Laufzeit
\`\`\`

\`\`\`typescript title="TypeScript: statisch – der Fehler fällt vor dem Start auf"
function verdopple(x: number): number {
  return x * 2;
}
verdopple(21);        // ok
verdopple('ab');      // Compilefehler: Argument of type 'string' is not assignable to parameter of type 'number'
\`\`\`

### Gradual Typing

Viele dynamische Sprachen haben optionale Typannotationen nachgerüstet: **Python Type Hints** (geprüft von mypy oder Pyright), **TypeScript** für JavaScript, **PHP** seit Version 7 mit Typdeklarationen, **Sorbet/RBS** für Ruby. So kann man schrittweise Typsicherheit einführen.

\`\`\`python
def verdopple(x: int) -> int:     # Python ignoriert das zur Laufzeit – mypy prüft es vorab
    return x * 2
\`\`\`

## Stark vs. schwach

Diese Achse beschreibt, wie bereitwillig eine Sprache Typen **implizit umwandelt** (Type Coercion). Die Begriffe sind nicht streng definiert – es ist eher ein Spektrum.

\`\`\`javascript title="JavaScript: wandelt bereitwillig um (eher schwach)"
'5' - 2       // 3      (String → Zahl)
'5' + 2       // '52'   (Zahl → String)
[] + {}       // '[object Object]'
0 == ''       // true   – deshalb immer === verwenden
\`\`\`

\`\`\`python title="Python: wandelt nicht implizit um (stark)"
"5" + 2       # TypeError: can only concatenate str (not "int") to str
int("5") + 2  # 7 – explizite Umwandlung
\`\`\`

| | statisch | dynamisch |
|---|---|---|
| **eher stark** | Rust, Java, C#, Go, Kotlin, Swift, Haskell | Python, Ruby |
| **eher schwach** | C, C++ (implizite Zahlen- und Zeigerumwandlungen) | JavaScript, PHP, Perl |

## Nominal vs. strukturell

- **Nominal** (Java, C#, Rust, Swift): Typen sind kompatibel, wenn sie **ausdrücklich** in Beziehung stehen (\`implements\`, \`extends\`). Gleiche Felder reichen nicht.
- **Strukturell** (TypeScript, Go-Interfaces): Kompatibel ist, was die passende **Form** hat.

\`\`\`typescript title="TypeScript: strukturelle Typisierung"
interface Punkt { x: number; y: number }
function zeichne(p: Punkt) { /* … */ }

const pixel = { x: 3, y: 4, farbe: 'rot' };
zeichne(pixel);    // erlaubt: pixel hat x und y – der Name "Punkt" spielt keine Rolle
\`\`\`

**Duck Typing** ist das dynamische Gegenstück: „Wenn es wie eine Ente läuft und quakt …“ – in Python zählt nur, ob ein Objekt die aufgerufene Methode hat.

## Typinferenz

Statische Typisierung heißt nicht, überall Typen hinschreiben zu müssen. Mit **[[Typinferenz]]** leitet der Compiler sie ab:

\`\`\`rust
let zahlen = vec![1, 2, 3];                         // Vec<i32> – abgeleitet
let summe: i32 = zahlen.iter().sum();               // hier ist eine Angabe nötig (sum ist generisch)
let quadrate: Vec<_> = zahlen.iter().map(|z| z * z).collect();
\`\`\`

Ebenso \`var\` in Java (ab 10) und C#, \`val\` in Kotlin, \`let\` in Swift, \`:=\` in Go, \`const\` in TypeScript.

## Ausdrucksstarke Typen

Moderne Typsysteme können fachliche Regeln abbilden und so ganze Fehlerklassen ausschließen:

\`\`\`typescript title="Discriminated Union: jeder Zustand hat genau seine Daten"
type Ladezustand =
  | { status: 'laden' }
  | { status: 'fertig'; daten: string[] }
  | { status: 'fehler'; meldung: string };

function anzeigen(z: Ladezustand): string {
  switch (z.status) {
    case 'laden':  return 'Bitte warten …';
    case 'fertig': return z.daten.join(', ');     // daten existiert nur hier
    case 'fehler': return \`Fehler: \${z.meldung}\`;
  }
}
\`\`\`

Dieselbe Idee heißt in Rust und Swift \`enum\` mit Daten, in Kotlin \`sealed class\`, in F#/Haskell **algebraische Datentypen**. Verwandt ist die **Null-Sicherheit**: In Kotlin, Swift, Dart, Rust und TypeScript (\`strictNullChecks\`) muss „kann fehlen“ im Typ stehen (\`String?\`, \`Option<String>\`), und der Compiler erzwingt die Prüfung.

## Programmierparadigmen

Ein **[[Programmierparadigma]]** ist ein grundlegender Denkstil. Die meisten modernen Sprachen sind **multiparadigmatisch**. Dasselbe Problem – *Summe der Quadrate aller geraden Zahlen* – in verschiedenen Stilen:

### Imperativ / prozedural

*Wie* wird es Schritt für Schritt gemacht? Zustand wird verändert.

\`\`\`python
summe = 0
for z in [1, 2, 3, 4, 5, 6]:
    if z % 2 == 0:
        summe += z * z
print(summe)   # 56
\`\`\`

### Objektorientiert

Daten und zugehöriges Verhalten werden in **Objekten** gebündelt. Kernideen: **Kapselung** (interne Details verbergen), **Vererbung** bzw. Komposition, **Polymorphie** (gleiche Schnittstelle, unterschiedliches Verhalten).

\`\`\`java
class Zahlenreihe {
    private final List<Integer> werte;
    Zahlenreihe(List<Integer> werte) { this.werte = List.copyOf(werte); }

    int summeGeraderQuadrate() {
        int summe = 0;
        for (int z : werte) if (z % 2 == 0) summe += z * z;
        return summe;
    }
}
new Zahlenreihe(List.of(1, 2, 3, 4, 5, 6)).summeGeraderQuadrate();   // 56
\`\`\`

### Funktional

*Was* soll berechnet werden? Funktionen ohne Seiteneffekte (**reine Funktionen**), **unveränderliche Daten**, Funktionen als Werte (**Higher-Order Functions**).

\`\`\`javascript
const summe = [1, 2, 3, 4, 5, 6]
  .filter((z) => z % 2 === 0)
  .map((z) => z * z)
  .reduce((a, b) => a + b, 0);   // 56
\`\`\`

\`\`\`haskell
summe = sum [z * z | z <- [1..6], even z]   -- 56
\`\`\`

Vorteile: leicht testbar (gleiche Eingabe → gleiche Ausgabe), gut parallelisierbar, weniger versteckte Zustandsfehler. Funktionale Elemente sind heute in fast allen Sprachen Standard (Lambdas, \`map\`/\`filter\`, Streams in Java, LINQ in C#).

### Deklarativ

Man beschreibt das **gewünschte Ergebnis**, nicht den Weg dorthin. Das System entscheidet, wie es erreicht wird.

\`\`\`sql
SELECT SUM(z * z) FROM zahlen WHERE z % 2 = 0;
\`\`\`

Weitere deklarative Sprachen: HTML (Struktur), CSS (Aussehen), Terraform und Kubernetes-YAML (gewünschter Infrastrukturzustand), React-JSX (UI als Funktion des Zustands), reguläre Ausdrücke.

### Weitere Paradigmen

| Paradigma | Idee | Beispiele |
|---|---|---|
| Logisch | Fakten und Regeln; das System sucht Lösungen | Prolog, Datalog |
| Ereignisgesteuert | Code reagiert auf Ereignisse (Klicks, Nachrichten) | JavaScript im Browser, GUIs |
| Reaktiv | Datenströme, die sich automatisch weiterverbreiten | RxJS, Kotlin Flow, Signals in Frameworks |
| Nebenläufig / Actor-basiert | isolierte Prozesse mit Nachrichten | Erlang, Elixir |

## Wie geht es weiter?

Jede Sprache ist im [Sprachvergleich](#/vergleich) mit ihren Paradigmen und ihrem Typsystem beschrieben; die [Syntax-Bibliothek](#/syntax) zeigt dieselben Konzepte in 20 Sprachen nebeneinander.
`;export{e as default};
