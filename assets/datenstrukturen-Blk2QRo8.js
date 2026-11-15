const e=`---
id: datenstrukturen
title: Datenstrukturen: Arrays, Listen, Stacks, Queues, Hashtabellen, Bäume & Graphen
area: algorithmen
difficulty: fortgeschritten
minutes: 22
order: 11
summary: Die wichtigsten Datenstrukturen mit ihren Stärken, Schwächen und Laufzeiten – und wie du sie in Python, JavaScript & Co. einsetzt.
tags: [Datenstrukturen, Array, Hashtabelle, Baum, Graph, Stack, Queue]
related: [big-o, sortieren-suchen, rekursion-dp, graphen, baeume-heaps, hashing-hashtabellen]
---

## Warum Datenstrukturen?

Eine [[Datenstruktur]] legt fest, wie Daten im Speicher organisiert sind – und damit, welche Operationen schnell und welche langsam sind. Die richtige Wahl macht aus einer Minute Rechenzeit oft eine Millisekunde. Faustregel: **Überlege, welche Operation am häufigsten vorkommt** (suchen? einfügen? sortiert durchlaufen?), und wähle danach.

## Überblick

| Struktur | Zugriff | Suchen | Einfügen | Löschen | Typischer Einsatz |
|---|---|---|---|---|---|
| [[Array]] / dynamische Liste | O(1) | O(n) | O(1)* am Ende, O(n) sonst | O(n) | Standard für geordnete Daten |
| [[Linked List]] | O(n) | O(n) | O(1) an bekannter Stelle | O(1) an bekannter Stelle | Spezialfälle, LRU-Caches |
| [[Stack]] | – | – | O(1) push | O(1) pop | Undo, Klammerprüfung, DFS |
| [[Queue]] | – | – | O(1) enqueue | O(1) dequeue | Aufgabenwarteschlangen, BFS |
| [[Hashtabelle]] | – | O(1)** | O(1)** | O(1)** | Nachschlagen per Schlüssel |
| [[Binärer Suchbaum]] (balanciert) | – | O(log n) | O(log n) | O(log n) | sortierte Daten, Bereichsabfragen |
| Heap | O(1) min/max | O(n) | O(log n) | O(log n) | Prioritätswarteschlangen |
| [[Graph]] | – | O(V + E) | – | – | Netzwerke, Routen, Abhängigkeiten |

\\* amortisiert · \\*\\* im Mittel

## Arrays und dynamische Listen

Elemente liegen **zusammenhängend im Speicher** – daher Indexzugriff in O(1) und hervorragende Cache-Lokalität. Einfügen in der Mitte verschiebt alle folgenden Elemente (O(n)). Dynamische Arrays (Python-\`list\`, JS-\`Array\`, Java-\`ArrayList\`, Rust-\`Vec\`) verdoppeln bei Bedarf ihre Kapazität, weshalb Anhängen amortisiert O(1) ist.

## Verkettete Listen

Jeder Knoten zeigt auf den nächsten. Einfügen und Entfernen an bekannter Stelle ist O(1), aber um zum i-ten Element zu kommen, muss man i Zeiger verfolgen.

\`\`\`python title="Einfach verkettete Liste umkehren – ein Interview-Klassiker"
class Knoten:
    def __init__(self, wert, naechster=None):
        self.wert, self.naechster = wert, naechster

def umkehren(kopf: Knoten | None) -> Knoten | None:
    vorher = None
    while kopf:
        kopf.naechster, vorher, kopf = vorher, kopf, kopf.naechster
    return vorher
\`\`\`

## Stack und Queue

\`\`\`python
stapel = []            # Stack (LIFO)
stapel.append(1); stapel.append(2)
stapel.pop()           # 2

from collections import deque
schlange = deque()     # Queue (FIFO) – list.pop(0) wäre O(n)!
schlange.append("a"); schlange.append("b")
schlange.popleft()     # "a"
\`\`\`

\`\`\`javascript
const stack = []; stack.push(1); stack.pop();
// JS hat keine eingebaute Queue mit O(1)-shift; für große Queues eine Ringpuffer-Implementierung nutzen
\`\`\`

Ein Stack eignet sich für alles, was „in umgekehrter Reihenfolge“ abgearbeitet wird – z. B. [Klammerprüfung](#/quiz?tab=challenges) oder der [[Call Stack]] selbst.

### Stack und Queue zum Anfassen

Lege Werte ab und nimm sie wieder heraus – und beobachte den Unterschied zwischen LIFO und FIFO. Über die Reiter erreichst du auch Hashtabelle und binären Suchbaum.

\`\`\`widget
datastructures:stack
\`\`\`

## Hashtabellen

Eine [[Hashfunktion]] berechnet aus dem Schlüssel eine Position im internen Array – deshalb ist Nachschlagen im Mittel O(1), unabhängig von der Größe.

\`\`\`python
alter = {"Ada": 36, "Linus": 28}      # dict
alter["Grace"] = 45
"Ada" in alter                          # O(1)
tags = {"python", "web"}               # set
"web" in tags                           # O(1)
\`\`\`

> [!EXPERT] Kollisionen
> Zwei Schlüssel können auf dieselbe Position fallen. Lösungen: **Chaining** (Liste pro Position) oder **Open Addressing** (nächste freie Position suchen). Bei zu hoher Füllung wird die Tabelle vergrößert und alle Einträge neu verteilt. Schlüssel müssen **hashbar und unveränderlich** sein – darum kann eine Python-Liste kein Dict-Schlüssel sein, ein Tupel schon.

## Bäume

Ein [[Baum]] ist hierarchisch: eine Wurzel, Kinder, Blätter. Du kennst Bäume aus Dateisystemen, dem [[DOM]] und JSON-Dokumenten.

**Binäre Suchbäume** halten links kleinere und rechts größere Werte – Suchen geht in O(Höhe). Bleibt der Baum **balanciert** (AVL, Rot-Schwarz), ist die Höhe O(log n). Darauf basieren z. B. Javas \`TreeMap\` und – als B-Bäume mit vielen Kindern pro Knoten – fast alle [Datenbank-Indizes](#/artikel/indizes-transaktionen).

\`\`\`python title="Rekursive Baumtraversierung"
def tiefe(knoten) -> int:
    if knoten is None:
        return 0
    return 1 + max(tiefe(knoten.links), tiefe(knoten.rechts))

def inorder(knoten):          # liefert einen BST in sortierter Reihenfolge
    if knoten:
        yield from inorder(knoten.links)
        yield knoten.wert
        yield from inorder(knoten.rechts)
\`\`\`

**Heaps** sind Bäume, bei denen jeder Knoten kleiner (Min-Heap) als seine Kinder ist – das kleinste Element ist immer oben. Ideal für Prioritätswarteschlangen:

\`\`\`python
import heapq
aufgaben = []
heapq.heappush(aufgaben, (2, "Mails beantworten"))
heapq.heappush(aufgaben, (1, "Server-Ausfall beheben"))
heapq.heappop(aufgaben)    # (1, 'Server-Ausfall beheben')
\`\`\`

## Graphen

Ein [[Graph]] besteht aus Knoten und Kanten – gerichtet oder ungerichtet, gewichtet oder ungewichtet. Straßennetze, soziale Netzwerke, Abhängigkeiten zwischen Paketen, Links im Web.

\`\`\`python title="Adjazenzliste und Breitensuche (kürzester Weg in Kanten)"
from collections import deque

netz = {
    "Berlin": ["Hamburg", "Leipzig"],
    "Hamburg": ["Berlin", "Bremen"],
    "Leipzig": ["Berlin", "München"],
    "Bremen": ["Hamburg"],
    "München": ["Leipzig"],
}

def kuerzester_weg(start: str, ziel: str) -> list[str] | None:
    vorgaenger = {start: None}
    q = deque([start])
    while q:
        ort = q.popleft()
        if ort == ziel:
            weg = []
            while ort is not None:
                weg.append(ort)
                ort = vorgaenger[ort]
            return weg[::-1]
        for nachbar in netz[ort]:
            if nachbar not in vorgaenger:
                vorgaenger[nachbar] = ort
                q.append(nachbar)
    return None

print(kuerzester_weg("Bremen", "München"))  # ['Bremen', 'Hamburg', 'Berlin', 'Leipzig', 'München']
\`\`\`

| Algorithmus | Zweck |
|---|---|
| [[BFS]] (Breitensuche) | kürzester Weg in ungewichteten Graphen |
| [[DFS]] (Tiefensuche) | Zusammenhang, Zyklen, topologische Sortierung |
| Dijkstra | kürzeste Wege mit nichtnegativen Gewichten |
| Topologische Sortierung | Reihenfolge von Abhängigkeiten (Build-Systeme, Paketmanager) |

## Die richtige Wahl

- Daten in Reihenfolge, Zugriff per Position → **Liste/Array**
- „Kommt X vor?“ oder Zuordnung Schlüssel → Wert → **Set/Map**
- Immer das kleinste/dringendste zuerst → **Heap**
- Sortiert halten und Bereiche abfragen → **balancierter Baum** (oder sortierte Liste + binäre Suche)
- Beziehungen zwischen Dingen → **Graph**

## Wie geht es weiter?

Wie man Daten sortiert und durchsucht, zeigt [Sortieren & Suchen](#/artikel/sortieren-suchen); wie Rekursion Bäume und Graphen elegant durchläuft, [Rekursion & Dynamic Programming](#/artikel/rekursion-dp).
`;export{e as default};
