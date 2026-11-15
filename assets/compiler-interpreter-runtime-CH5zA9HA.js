const e=`---
id: compiler-interpreter-runtime
title: Compiler, Interpreter, Runtime & Speicherverwaltung
area: grundlagen
difficulty: fortgeschritten
minutes: 18
order: 11
summary: Wie aus Quellcode ausführbare Befehle werden, was JIT-Compiler und Bytecode sind, wie Stack und Heap funktionieren und wie Garbage Collection, manuelle Verwaltung und Ownership Speicher freigeben.
tags: [Compiler, Interpreter, JIT, Bytecode, Stack, Heap, Garbage Collection]
related: [wie-computer-funktionieren, zahlensysteme-encoding, big-o, speicherverwaltung, typsysteme-paradigmen]
---

## Vom Text zum Programm

Die CPU versteht nur [[Maschinencode]]. Dein [[Quellcode]] muss also übersetzt werden – entweder **vorab** (Compiler) oder **während der Ausführung** (Interpreter), in der Praxis meist eine Mischung.

\`\`\`widget
pipeline:compiler
\`\`\`

## Compiler

Ein [[Compiler]] übersetzt das gesamte Programm vor der Ausführung. Er prüft dabei Syntax und – bei statisch typisierten Sprachen – Typen, und optimiert den Code (Konstanten vorab berechnen, Funktionen einbetten, unnötigen Code entfernen).

\`\`\`c title="C wird zu Maschinencode kompiliert"
int quadrat(int x) { return x * x; }
\`\`\`

\`\`\`bash
gcc -O2 -c quadrat.c && objdump -d quadrat.o
# quadrat:
#   mov  eax, edi        ; Parameter x
#   imul eax, edi        ; x * x
#   ret
\`\`\`

Ahead-of-Time kompiliert werden u. a. C, C++, [Rust](#/sprachen/rust), [Go](#/sprachen/go), Swift.

## Interpreter

Ein [[Interpreter]] liest den Code und führt ihn direkt aus. Moderne Interpreter übersetzen den Quelltext zunächst in **[[Bytecode]]** – eine kompakte Zwischendarstellung für eine virtuelle Maschine – und führen diesen aus.

\`\`\`python title="Python-Bytecode ansehen"
import dis

def quadrat(x):
    return x * x

dis.dis(quadrat)
#  LOAD_FAST   x
#  LOAD_FAST   x
#  BINARY_OP   * (multiply)
#  RETURN_VALUE
\`\`\`

## JIT: das Beste aus beiden Welten

Ein **[[JIT-Compiler]]** (Just-in-Time) beobachtet das laufende Programm und kompiliert **häufig ausgeführte** Stellen („Hot Paths“) zur Laufzeit in optimierten Maschinencode. Er kann dabei Informationen nutzen, die vorab unbekannt sind – z. B. dass eine Funktion praktisch immer mit Ganzzahlen aufgerufen wird.

| Sprache | Übersetzung |
|---|---|
| C, C++, Rust, Go | AOT → Maschinencode |
| Java, Kotlin, Scala | Compiler → JVM-Bytecode → Interpreter + JIT (HotSpot) |
| C# | Compiler → CIL → JIT (RyuJIT), optional AOT |
| JavaScript | Engine (V8, SpiderMonkey) parst → Bytecode → mehrstufige JITs |
| Python (CPython) | → Bytecode → Interpreter (seit 3.13 experimenteller JIT) |
| TypeScript | [[Transpiler|Transpiliert]] zu JavaScript |

> [!INFO] „Kompiliert vs. interpretiert“ ist eine Eigenschaft der Implementierung
> Nicht der Sprache. Es gibt Python mit JIT (PyPy), C-Interpreter und Java mit AOT-Kompilierung (GraalVM Native Image).

## Die Runtime

Die **[[Runtime]]** (Laufzeitumgebung) ist alles, was ein Programm während der Ausführung braucht: Speicherverwaltung, Standardbibliothek, Thread-Scheduler, ggf. Interpreter und JIT. Beispiele: JVM, .NET CLR, [[Node.js]] (V8 + libuv), CPython. Auch Go und Rust haben eine (kleine) Runtime.

## Stack und Heap

Programme nutzen zwei grundverschiedene Speicherbereiche:

| | [[Call Stack|Stack]] | [[Heap]] |
|---|---|---|
| Inhalt | Funktionsaufrufe: lokale Variablen, Parameter, Rücksprungadresse | Dynamisch erzeugte Objekte |
| Verwaltung | automatisch, LIFO – Frame wird beim Return entfernt | manuell, per GC oder per Ownership |
| Geschwindigkeit | sehr schnell (nur ein Zeiger wird verschoben) | langsamer (Allokator, Fragmentierung) |
| Größe | klein, pro [[Thread]] (oft 1–8 MB) | groß |
| Typischer Fehler | Stack Overflow (zu tiefe Rekursion) | Speicherleck, Use-after-free |

\`\`\`javascript title="Stack Overflow durch Rekursion ohne Basisfall"
function endlos(n) {
  return endlos(n + 1);   // jeder Aufruf legt einen neuen Frame auf den Stack
}
endlos(0);                // RangeError: Maximum call stack size exceeded
\`\`\`

## Speicher freigeben: drei Strategien

### 1. Manuell (C, C++ ohne Smart Pointer)

\`\`\`c
int *werte = malloc(100 * sizeof(int));
/* … */
free(werte);   // vergessen → Speicherleck; doppelt → Absturz; danach benutzen → Sicherheitslücke
\`\`\`

Maximale Kontrolle, aber die Quelle eines großen Teils schwerer Sicherheitslücken in Systemsoftware.

### 2. Garbage Collection (Java, C#, Go, Python, JavaScript)

Der [[Garbage Collection|Garbage Collector]] findet Objekte, die vom Programm aus **nicht mehr erreichbar** sind, und gibt ihren Speicher frei.

- **Reference Counting** (CPython): Jedes Objekt zählt seine Verweise; bei 0 wird es sofort freigegeben. Zyklen findet ein zusätzlicher Collector.
- **Tracing / Mark-and-Sweep:** Von „Wurzeln“ (Stack, globale Variablen) aus alles Erreichbare markieren, den Rest freigeben.
- **Generationell:** Die meisten Objekte sterben jung – junge Objekte werden häufig und billig gesammelt, alte selten.

> [!WARNING] Speicherlecks gibt es trotzdem
> Ein GC gibt nur frei, was unerreichbar ist. Ein globaler Cache ohne Größenlimit, nie entfernte Event-Listener oder Closures, die große Objekte festhalten, führen auch in Java oder JavaScript zu [[Speicherleck|Speicherlecks]].

### 3. Ownership (Rust)

Rust prüft zur **Compile-Zeit**, wem jeder Wert gehört. Endet der Gültigkeitsbereich des Besitzers, wird freigegeben – ohne GC-Pausen und ohne manuelle Fehler ([[Ownership]]). C++ erreicht Ähnliches mit RAII und Smart Pointern.

\`\`\`rust
fn main() {
    let name = String::from("Ada");   // Speicher auf dem Heap
    begruesse(&name);                 // ausleihen
    println!("{name}");
}                                     // name verlässt den Scope → automatisch freigegeben

fn begruesse(n: &str) { println!("Hallo {n}"); }
\`\`\`

## Wie geht es weiter?

Sieh dir an, wie unterschiedliche Sprachen das in der Praxis lösen – z. B. im Vergleich [Rust vs. Go](#/vergleich?l=rust,go) – und wie Zahlen im Speicher aussehen in [Zahlensysteme & Encoding](#/artikel/zahlensysteme-encoding).
`;export{e as default};
