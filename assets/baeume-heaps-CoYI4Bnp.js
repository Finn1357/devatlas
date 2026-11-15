const e=`---
id: baeume-heaps
title: Bäume, Heaps & Tries: Hierarchische Datenstrukturen
area: algorithmen
difficulty: fortgeschritten
minutes: 19
order: 16
summary: Binäre Suchbäume und warum sie ausbalanciert sein müssen, Traversierungen, B-Bäume in Datenbanken, Heaps als Prioritätswarteschlange und Tries für Autovervollständigung – mit interaktivem Suchbaum.
tags: [Baum, Binärbaum, BST, Heap, Prioritätswarteschlange, Trie, B-Baum]
related: [datenstrukturen, graphen, indizes-transaktionen, hashing-hashtabellen]
---

## Bäume sind überall

Ein **[[Baum]]** ist ein Graph ohne Zyklen mit einer **Wurzel**, von der aus jeder Knoten über genau einen Weg erreichbar ist. Bäume begegnen dir ständig: das [[DOM]] einer Webseite, das Dateisystem, der Abstract Syntax Tree im [Compiler](#/artikel/compiler-interpreter-runtime), JSON-Dokumente, Organigramme, Datenbankindizes.

**Begriffe:** Wurzel (oben), Blätter (Knoten ohne Kinder), Eltern/Kinder, Tiefe (Abstand zur Wurzel), **Höhe** (längster Weg von der Wurzel zu einem Blatt), Teilbaum.

## Binäre Suchbäume

Ein **[[Binärer Suchbaum]]** (BST) ist ein Baum, in dem jeder Knoten höchstens zwei Kinder hat und gilt: **links alles Kleinere, rechts alles Größere**. Beim Suchen entscheidet jeder Vergleich, in welcher Hälfte es weitergeht – wie bei der binären Suche, aber mit schnellem Einfügen.

\`\`\`widget
datastructures:bst
\`\`\`

\`\`\`python title="Binärer Suchbaum in Python"
from dataclasses import dataclass

@dataclass
class Knoten:
    wert: int
    links: "Knoten | None" = None
    rechts: "Knoten | None" = None

def einfuegen(wurzel: Knoten | None, wert: int) -> Knoten:
    if wurzel is None:
        return Knoten(wert)
    if wert < wurzel.wert:
        wurzel.links = einfuegen(wurzel.links, wert)
    elif wert > wurzel.wert:
        wurzel.rechts = einfuegen(wurzel.rechts, wert)
    return wurzel

def enthaelt(wurzel: Knoten | None, wert: int) -> bool:
    while wurzel:
        if wert == wurzel.wert:
            return True
        wurzel = wurzel.links if wert < wurzel.wert else wurzel.rechts
    return False

def in_order(k: Knoten | None):           # liefert die Werte sortiert
    if k:
        yield from in_order(k.links)
        yield k.wert
        yield from in_order(k.rechts)
\`\`\`

### Traversierungen

| Reihenfolge | Ablauf | Anwendung |
|---|---|---|
| **In-Order** | links → Knoten → rechts | sortierte Ausgabe eines BST |
| **Pre-Order** | Knoten → links → rechts | Baum kopieren/serialisieren |
| **Post-Order** | links → rechts → Knoten | Baum löschen, Ausdrücke auswerten (Kinder zuerst) |
| **Level-Order** | Ebene für Ebene (BFS) | Baum ebenenweise anzeigen |

### Das Problem: Entartung

Fügt man bereits **sortierte** Daten ein, hängt jeder neue Knoten rechts am vorherigen – der Baum wird zur Liste, Suchen kostet O(n). Probiere im Widget oben „Sortiert einfügen“.

**Selbstbalancierende Bäume** korrigieren das automatisch durch Rotationen und garantieren eine Höhe von O(log n):

- **AVL-Baum:** streng balanciert (Höhenunterschied der Teilbäume ≤ 1), sehr schnelle Suche.
- **Rot-Schwarz-Baum:** etwas lockerer, dafür weniger Umbauten beim Einfügen. Verwendet in Java \`TreeMap\`, C++ \`std::map\`, dem Linux-Scheduler (CFS).

| Operation | BST unbalanciert (schlimmster Fall) | balanciert |
|---|---|---|
| Suchen | O(n) | O(log n) |
| Einfügen | O(n) | O(log n) |
| Löschen | O(n) | O(log n) |
| Min/Max, Vorgänger/Nachfolger | O(n) | O(log n) |
| Bereichsabfrage (alle zwischen a und b) | – | O(log n + k) |

> [!TIP] Baum oder Hashtabelle?
> [Hashtabellen](#/artikel/hashing-hashtabellen) sind für einzelne Zugriffe schneller (O(1)). Bäume halten die Daten **sortiert** und können Bereiche („alle Bestellungen zwischen März und Mai“), Minimum, Maximum und „nächstgrößerer Wert“ effizient beantworten.

## B-Bäume: Bäume für die Festplatte

Datenbanken speichern Indizes als **[[B-Baum|B-Bäume]]** (genauer meist B+-Bäume). Statt zwei Kindern hat jeder Knoten Hunderte – ein Knoten entspricht einer Speicherseite (z. B. 8 KB in PostgreSQL, 16 KB in InnoDB). Dadurch ist der Baum sehr **flach**: Eine Tabelle mit hundert Millionen Zeilen braucht nur 3–4 Ebenen, also 3–4 Seitenzugriffe pro Suche. In B+-Bäumen liegen alle Daten in den Blättern, die zusätzlich verkettet sind – ideal für Bereichsabfragen und \`ORDER BY\`.

Mehr dazu in [Indizes & Transaktionen](#/artikel/indizes-transaktionen).

## Heaps und Prioritätswarteschlangen

Ein **[[Heap]]** ist ein fast vollständiger Binärbaum mit einer einfacheren Regel als der BST: **Jeder Elternknoten ist kleiner (Min-Heap) bzw. größer (Max-Heap) als seine Kinder.** Das kleinste Element steht also immer an der Wurzel.

Der Clou: Ein Heap passt lückenlos in ein **Array** – ohne Zeiger:

\`\`\`text
Index:    0   1   2   3   4   5   6
Wert:    [2,  5,  3,  9,  6,  8,  4]

Kinder von i:  2i + 1 und 2i + 2       Eltern von i:  (i - 1) // 2

            2
         /     \\
        5       3
       / \\     / \\
      9   6   8   4
\`\`\`

| Operation | Laufzeit |
|---|---|
| Minimum ansehen | O(1) |
| Einfügen (ans Ende, dann „hochblubbern“) | O(log n) |
| Minimum entnehmen (letztes Element an die Wurzel, „heruntersickern“) | O(log n) |
| Heap aus n Elementen bauen | O(n) |

Damit ist der Heap die Standardimplementierung einer **[[Prioritätswarteschlange]]**: Aufgaben nach Dringlichkeit abarbeiten, Dijkstras nächsten Knoten wählen, Timer und Scheduler, „die 10 größten Werte aus einem Datenstrom“.

\`\`\`python title="heapq: Pythons Min-Heap"
import heapq

aufgaben = []
heapq.heappush(aufgaben, (2, "E-Mails beantworten"))
heapq.heappush(aufgaben, (1, "Produktionsfehler beheben"))
heapq.heappush(aufgaben, (3, "Dokumentation"))

while aufgaben:
    prio, aufgabe = heapq.heappop(aufgaben)    # immer die kleinste Priorität zuerst
    print(prio, aufgabe)

# Top-k effizient: O(n log k) statt Sortieren in O(n log n)
print(heapq.nlargest(3, [5, 1, 9, 3, 7, 2]))   # [9, 7, 5]
\`\`\`

In Java: \`PriorityQueue\`, in C++: \`std::priority_queue\` (Max-Heap), in Go: \`container/heap\`. **Heapsort** sortiert in O(n log n) ohne zusätzlichen Speicher, ist aber in der Praxis meist langsamer als Quicksort oder Timsort.

## Tries: Bäume für Präfixe

Ein **[[Trie]]** (Präfixbaum) speichert Strings Zeichen für Zeichen: Jeder Pfad von der Wurzel bildet ein Präfix. Alle Wörter, die mit „pro“ beginnen, liegen im selben Teilbaum.

\`\`\`python title="Trie für Autovervollständigung"
class Trie:
    def __init__(self):
        self.kinder: dict[str, "Trie"] = {}
        self.ende = False

    def einfuegen(self, wort: str) -> None:
        knoten = self
        for zeichen in wort:
            knoten = knoten.kinder.setdefault(zeichen, Trie())
        knoten.ende = True

    def vorschlaege(self, praefix: str) -> list[str]:
        knoten = self
        for zeichen in praefix:
            if zeichen not in knoten.kinder:
                return []
            knoten = knoten.kinder[zeichen]
        ergebnis = []
        def sammle(k: "Trie", pfad: str):
            if k.ende:
                ergebnis.append(pfad)
            for z, kind in sorted(k.kinder.items()):
                sammle(kind, pfad + z)
        sammle(knoten, praefix)
        return ergebnis

t = Trie()
for w in ["python", "programm", "prozess", "php", "pointer"]:
    t.einfuegen(w)
print(t.vorschlaege("pro"))   # ['programm', 'prozess']
\`\`\`

Suche und Einfügen kosten O(Länge des Wortes) – unabhängig davon, wie viele Wörter gespeichert sind. Einsatz: Autovervollständigung, Rechtschreibprüfung, IP-Routing-Tabellen (längster Präfix), Wörterbücher.

## Überblick

| Struktur | Stärke | Typischer Einsatz |
|---|---|---|
| Binärer Suchbaum (balanciert) | sortiert, Bereichsabfragen | geordnete Maps, Sets |
| B-/B+-Baum | sehr flach, seitenweise | Datenbank- und Dateisystemindizes |
| Heap | Minimum/Maximum in O(1) | Prioritätswarteschlangen, Scheduler, Top-k |
| Trie | Präfixsuche | Autovervollständigung, Routing |

## Wie geht es weiter?

Die Grundlagen zu Arrays, Listen, Stacks und Queues stehen in [Datenstrukturen](#/artikel/datenstrukturen); wie Heaps bei der Wegsuche helfen, zeigt [Graphen & Graphalgorithmen](#/artikel/graphen).
`;export{e as default};
