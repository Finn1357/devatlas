const e=`---
id: speicherverwaltung
title: Speicherverwaltung: Stack, Heap, Garbage Collection & Ownership
area: grundlagen
difficulty: fortgeschritten
minutes: 20
order: 15
summary: Wo Variablen im Speicher liegen, warum manuelle Speicherverwaltung zu Sicherheitslücken führt, wie Garbage Collector und Referenzzählung arbeiten, was Rusts Ownership-Modell anders macht – und wie Speicherlecks auch in Java oder JavaScript entstehen.
tags: [Speicher, Stack, Heap, Garbage Collection, Ownership, Memory Leak, RAII]
related: [betriebssysteme-prozesse, compiler-interpreter-runtime, typsysteme-paradigmen, injection]
---

## Zwei Speicherbereiche: Stack und Heap

Innerhalb eines Prozesses gibt es zwei wichtige Bereiche für Daten:

| | **Stack** | **Heap** |
|---|---|---|
| Inhalt | lokale Variablen, Funktionsparameter, Rücksprungadressen | dynamisch erzeugte Objekte beliebiger Größe und Lebensdauer |
| Verwaltung | automatisch: wächst beim Funktionsaufruf, schrumpft beim Rücksprung | explizit (C), per Garbage Collector (Java, JS) oder Ownership (Rust) |
| Geschwindigkeit | sehr schnell (nur ein Zeiger wird verschoben) | langsamer (freien Platz suchen, Fragmentierung) |
| Größe | klein (oft 1–8 MB pro Thread) | groß (bis zum verfügbaren Speicher) |
| Lebensdauer | bis zum Ende der Funktion | bis zur Freigabe |

\`\`\`text
 Stack (wächst nach unten)                 Heap
 ┌──────────────────────────┐             ┌───────────────────────────┐
 │ main():  liste ──────────┼────────────►│ [1, 2, 3, 4, …]           │
 │ summe():  n = 4          │             │                           │
 │           ergebnis = 10  │             │ {"name": "Ada", …}        │
 └──────────────────────────┘             └───────────────────────────┘
\`\`\`

Jeder Funktionsaufruf legt einen **Stack Frame** an. Endlose Rekursion füllt den Stack, bis er überläuft: **[[Stack Overflow]]** (\`RecursionError\` in Python, \`StackOverflowError\` in Java, „Maximum call stack size exceeded“ in JavaScript).

> [!BEGINNER]
> Der Stack ist wie ein Notizblock, auf dem jede Funktion oben ein Blatt bekommt und es beim Verlassen abreißt. Der Heap ist ein großes Lager: Man kann dort beliebig große Dinge beliebig lange abstellen – muss aber irgendwann wieder aufräumen.

## Manuelle Speicherverwaltung (C)

In C fordert man Heap-Speicher mit \`malloc\` an und gibt ihn mit \`free\` zurück. Das gibt volle Kontrolle – und öffnet die Tür für eine ganze Klasse von Fehlern:

\`\`\`c title="Typische Speicherfehler in C – so NICHT"
char *name = malloc(8);
strcpy(name, "Margaret Hamilton");   // Buffer Overflow: 18 Bytes in 8 – überschreibt fremden Speicher
free(name);
printf("%s", name);                  // Use-after-free: Speicher gehört schon jemand anderem
free(name);                          // Double free: beschädigt die Heap-Verwaltung

char *puffer = malloc(1024);
return;                              // Memory Leak: puffer wird nie freigegeben
\`\`\`

| Fehler | Folge |
|---|---|
| **Buffer Overflow** | Überschreiben benachbarter Daten – klassischer Einstiegspunkt für Angriffe |
| **Use-after-free** | Lesen/Schreiben von Speicher, der inzwischen anders genutzt wird |
| **Double Free** | Beschädigung der Heap-Strukturen, oft ausnutzbar |
| **Memory Leak** | Speicherverbrauch wächst, bis der Prozess abstürzt |
| **Null-Dereferenzierung** | Absturz |

> [!DANGER] Speichersicherheit ist Sicherheit
> Microsoft und das Chromium-Projekt haben berichtet, dass rund 70 % ihrer schwerwiegenden Sicherheitslücken auf Speicherfehler zurückgehen. Behörden wie die US-amerikanische CISA empfehlen daher speichersichere Sprachen für neue Projekte.

## RAII und Smart Pointer (C++)

C++ bindet Ressourcen an die Lebensdauer von Objekten (**RAII** – Resource Acquisition Is Initialization): Der Destruktor gibt die Ressource frei, sobald das Objekt seinen Gültigkeitsbereich verlässt – auch bei Exceptions.

\`\`\`cpp
#include <memory>
#include <vector>

void verarbeite() {
    auto puffer = std::make_unique<std::vector<int>>(1000);   // genau ein Besitzer
    auto geteilt = std::make_shared<std::string>("Ada");      // Referenzzählung
    auto kopie = geteilt;                                      // Zähler = 2
}   // hier werden beide automatisch freigegeben – kein delete nötig
\`\`\`

## Garbage Collection

Die meisten modernen Sprachen geben Speicher automatisch frei. Zwei Grundverfahren:

### Referenzzählung

Jedes Objekt zählt, wie viele Verweise auf es zeigen. Fällt der Zähler auf 0, wird es sofort freigegeben. Genutzt von **Python** (CPython), **Swift** und **Objective-C** (ARC), C++ \`shared_ptr\`, Rust \`Rc\`/\`Arc\`.

\`\`\`python
import sys
liste = [1, 2, 3]
alias = liste
print(sys.getrefcount(liste))   # meist 3: liste, alias und das temporäre Argument (versionsabhängig)
\`\`\`

**Schwäche: Zyklen.** Zeigen zwei Objekte aufeinander, wird ihr Zähler nie 0. Python ergänzt daher einen Zyklendetektor; Swift verlangt \`weak\`-Referenzen, um Zyklen zu brechen.

### Tracing Garbage Collector

Der [[Garbage Collection|Garbage Collector]] (GC) sucht periodisch, ausgehend von „Wurzeln“ (Stack-Variablen, globale Variablen), alle **erreichbaren** Objekte. Alles andere ist Müll (**Mark & Sweep**). Genutzt von **Java**, **C#**, **JavaScript**, **Go**, **Kotlin**, **Dart**.

Moderne GCs sind **generationell**: Die meisten Objekte sterben jung, daher wird der Bereich für neue Objekte häufig und schnell aufgeräumt, langlebige Objekte seltener. Sie arbeiten weitgehend **nebenläufig** zum Programm, sodass Pausen kurz bleiben (Java ZGC und Shenandoah: Pausen meist unter einer Millisekunde).

| | Referenzzählung | Tracing GC |
|---|---|---|
| Freigabezeitpunkt | sofort, vorhersehbar | später, wenn der GC läuft |
| Zyklen | Problem (Zusatzmechanismus nötig) | kein Problem |
| Overhead | bei jeder Zuweisung | periodisch, teilweise Pausen |

## Ownership in Rust

Rust erreicht Speichersicherheit **ohne Garbage Collector** – durch Regeln, die der Compiler prüft:

1. Jeder Wert hat genau **einen Besitzer** (Owner).
2. Verlässt der Besitzer seinen Gültigkeitsbereich, wird der Wert freigegeben.
3. Man kann Werte **ausleihen** (Borrowing): beliebig viele lesende Referenzen \`&T\` **oder** genau eine schreibende \`&mut T\` – nie beides gleichzeitig.

\`\`\`rust
fn laenge(s: &String) -> usize {   // leiht nur aus, übernimmt nicht den Besitz
    s.len()
}

fn main() {
    let name = String::from("Ada");
    let n = laenge(&name);          // ausleihen: name bleibt gültig
    let uebernommen = name;         // Besitz wird verschoben (Move)
    // println!("{name}");          // Compilefehler: name wurde verschoben
    println!("{uebernommen} hat {n} Zeichen");
}   // uebernommen wird hier automatisch freigegeben
\`\`\`

Die Regel „eine schreibende **oder** viele lesende Referenzen“ verhindert nebenbei auch **Data Races** zur Compilezeit – siehe [Nebenläufigkeit](#/artikel/nebenlaeufigkeit).

## Werte und Referenzen

Ob eine Zuweisung den Wert **kopiert** oder nur einen **Verweis** auf dasselbe Objekt erzeugt, ist eine der häufigsten Fehlerquellen:

\`\`\`python
a = [1, 2]
b = a              # b zeigt auf DASSELBE Objekt
b.append(3)
print(a)           # [1, 2, 3]

import copy
c = copy.deepcopy(a)   # echte Kopie, auch verschachtelter Objekte
\`\`\`

\`\`\`javascript
const original = { name: 'Ada', adresse: { stadt: 'London' } };
const flach = { ...original };            // flache Kopie: adresse wird geteilt!
const tief = structuredClone(original);   // tiefe Kopie
flach.adresse.stadt = 'Paris';
console.log(original.adresse.stadt);      // 'Paris'
\`\`\`

In Go, C#, Swift und Rust gibt es zusätzlich echte **Werttypen** (Structs), die bei Zuweisung vollständig kopiert werden.

## Speicherlecks trotz Garbage Collector

Ein GC gibt nur **unerreichbare** Objekte frei. Hält das Programm versehentlich Verweise, wächst der Speicher trotzdem:

- **Wachsende Caches und globale Maps** ohne Größenlimit oder Ablaufzeit.
- **Event-Listener**, die nie entfernt werden (z. B. in React-Komponenten ohne Cleanup in \`useEffect\`).
- **Closures**, die große Objekte festhalten.
- **Timer** (\`setInterval\`) ohne \`clearInterval\`.
- **Statische Collections** in Java, die nur befüllt werden.

\`\`\`python title="Speicherverbrauch untersuchen (Python)"
import tracemalloc

tracemalloc.start()
# … verdächtigen Code ausführen …
for statistik in tracemalloc.take_snapshot().statistics("lineno")[:5]:
    print(statistik)          # die 5 Codezeilen mit den meisten Allokationen
\`\`\`

Weitere Werkzeuge: Heap-Snapshots in den Chrome DevTools (Memory-Tab), VisualVM und Java Flight Recorder, \`dotnet-counters\`/\`dotnet-gcdump\`, Valgrind und AddressSanitizer für C/C++.

## Überblick nach Sprache

| Sprache | Verfahren |
|---|---|
| C | manuell (\`malloc\`/\`free\`) |
| C++ | manuell + RAII, Smart Pointer |
| Rust | Ownership & Borrowing (Compiler) |
| Swift, Objective-C | automatische Referenzzählung (ARC) |
| Python | Referenzzählung + Zyklendetektor |
| Java, Kotlin, C#, Go, JavaScript, Dart | Tracing GC (generationell, nebenläufig) |

## Wie geht es weiter?

Wie sich mehrere Threads Speicher teilen, ohne sich in die Quere zu kommen, zeigt [Nebenläufigkeit & Parallelität](#/artikel/nebenlaeufigkeit).
`;export{e as default};
