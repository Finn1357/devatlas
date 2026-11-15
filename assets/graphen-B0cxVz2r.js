const e=`---
id: graphen
title: Graphen & Graphalgorithmen: BFS, DFS, Dijkstra & topologische Sortierung
area: algorithmen
difficulty: fortgeschritten
minutes: 22
order: 14
summary: Wie man Netze aus Knoten und Kanten speichert und durchsucht – Breitensuche, Tiefensuche, kürzeste Wege mit Dijkstra und Abhängigkeiten auflösen mit topologischer Sortierung, mit interaktiver Visualisierung.
tags: [Graph, BFS, DFS, Dijkstra, Topologische Sortierung, DAG]
related: [datenstrukturen, baeume-heaps, big-o, rekursion-dp]
---

## Überall Graphen

Ein **[[Graph]]** besteht aus **Knoten** (Vertices) und **Kanten** (Edges), die Knoten verbinden. Erstaunlich viele Probleme sind in Wahrheit Graphprobleme:

| Anwendung | Knoten | Kanten |
|---|---|---|
| Navigation | Kreuzungen | Straßen (gewichtet mit Fahrzeit) |
| Soziales Netzwerk | Personen | Freundschaften |
| Paketmanager, Build-Systeme | Pakete, Aufgaben | „hängt ab von“ |
| Internet-Routing | Router | Leitungen |
| Git | Commits | „Elternteil von“ |
| Webseiten | Seiten | Links |

### Begriffe

- **Gerichtet** (Einbahnstraße, A → B) oder **ungerichtet** (A — B).
- **Gewichtet:** Kanten haben Kosten (Entfernung, Zeit, Preis).
- **Grad:** Anzahl der Kanten eines Knotens.
- **Pfad:** Folge von Knoten, die durch Kanten verbunden sind; **Zyklus:** Pfad, der zum Start zurückführt.
- **[[DAG]]** (Directed Acyclic Graph): gerichteter Graph ohne Zyklen – das Modell für Abhängigkeiten und für die Git-Historie.
- **Zusammenhängend:** Jeder Knoten ist von jedem erreichbar.

## Graphen speichern

| | Adjazenzliste | Adjazenzmatrix |
|---|---|---|
| Idee | Jeder Knoten speichert seine Nachbarn | V×V-Tabelle: 1, wenn Kante existiert |
| Speicher | O(V + E) | O(V²) |
| „Ist A mit B verbunden?“ | O(Grad) | O(1) |
| Alle Nachbarn durchlaufen | O(Grad) | O(V) |
| Gut für | dünne Graphen (fast alle realen) | dichte, kleine Graphen |

\`\`\`python title="Adjazenzliste in Python"
from collections import defaultdict

kanten = [("A", "B", 4), ("A", "C", 2), ("B", "D", 5), ("C", "D", 8), ("D", "E", 3)]

graph: dict[str, list[tuple[str, int]]] = defaultdict(list)
for a, b, gewicht in kanten:
    graph[a].append((b, gewicht))
    graph[b].append((a, gewicht))      # ungerichtet: beide Richtungen eintragen

print(graph["A"])                       # [('B', 4), ('C', 2)]
\`\`\`

## Ausprobieren

Wähle einen Algorithmus und spiele ihn Schritt für Schritt ab. Achte darauf, welche Datenstruktur die „nächsten Kandidaten“ verwaltet – das ist der eigentliche Unterschied.

\`\`\`widget
graph
\`\`\`

## Breitensuche (BFS)

Die **[[Breitensuche]]** erkundet Ebene für Ebene mit einer **Queue**. Dadurch erreicht sie jeden Knoten zuerst über den Weg mit den **wenigsten Kanten** – in ungewichteten Graphen also über den kürzesten Weg.

\`\`\`python title="BFS: kürzester Weg in einem ungewichteten Graphen"
from collections import deque

def kuerzester_weg(graph, start, ziel):
    vorgaenger = {start: None}
    queue = deque([start])
    while queue:
        knoten = queue.popleft()               # O(1) – list.pop(0) wäre O(n)
        if knoten == ziel:
            weg = []
            while knoten is not None:          # Weg rückwärts rekonstruieren
                weg.append(knoten)
                knoten = vorgaenger[knoten]
            return weg[::-1]
        for nachbar, _ in graph[knoten]:
            if nachbar not in vorgaenger:      # = noch nicht entdeckt
                vorgaenger[nachbar] = knoten
                queue.append(nachbar)
    return None                                 # nicht erreichbar
\`\`\`

Typische Einsätze: kürzester Weg in Labyrinthen und Spielfeldern, „Personen, die du kennen könntest“ (Freunde zweiten Grades), Web-Crawler mit Tiefenbegrenzung.

## Tiefensuche (DFS)

Die **[[Tiefensuche]]** geht so tief wie möglich einen Pfad entlang und kehrt erst dann um (Backtracking). Sie nutzt einen **Stack** – explizit oder implizit über Rekursion.

\`\`\`python title="DFS rekursiv und iterativ"
def dfs_rekursiv(graph, knoten, besucht=None):
    besucht = besucht if besucht is not None else set()
    besucht.add(knoten)
    for nachbar, _ in graph[knoten]:
        if nachbar not in besucht:
            dfs_rekursiv(graph, nachbar, besucht)
    return besucht

def dfs_iterativ(graph, start):
    besucht, stack = set(), [start]
    while stack:
        knoten = stack.pop()
        if knoten in besucht:
            continue
        besucht.add(knoten)
        stack.extend(n for n, _ in graph[knoten] if n not in besucht)
    return besucht
\`\`\`

DFS ist die Grundlage für **Zyklenerkennung**, **topologische Sortierung**, das Finden von **Zusammenhangskomponenten** und das Lösen von Rätseln mit Backtracking (Sudoku, Labyrinth).

> [!MISTAKE] Die besuchte Menge vergessen
> Ohne \`besucht\`-Menge läuft BFS oder DFS in einem Graphen mit Zyklen endlos im Kreis. Bei Bäumen fällt das nicht auf – bei echten Graphen sofort.

> [!WARNING] Rekursionstiefe
> Python begrenzt die Rekursionstiefe standardmäßig auf etwa 1000. Bei großen Graphen die iterative Variante verwenden.

## Kürzeste Wege mit Dijkstra

Sind Kanten **gewichtet**, ist der Weg mit den wenigsten Kanten nicht unbedingt der kürzeste. Der **[[Dijkstra-Algorithmus]]** nimmt immer den noch nicht abgeschlossenen Knoten mit der **kleinsten bekannten Distanz** und versucht von dort, die Distanzen seiner Nachbarn zu verbessern („Relaxation“). Dafür nutzt er eine [Prioritätswarteschlange](#/artikel/baeume-heaps).

\`\`\`python title="Dijkstra mit heapq"
import heapq

def dijkstra(graph, start):
    dist = {start: 0}
    vorgaenger = {start: None}
    heap = [(0, start)]                        # (Distanz, Knoten)
    while heap:
        d, knoten = heapq.heappop(heap)        # kleinste Distanz zuerst
        if d > dist[knoten]:
            continue                           # veralteter Eintrag – überspringen
        for nachbar, gewicht in graph[knoten]:
            neu = d + gewicht
            if neu < dist.get(nachbar, float("inf")):
                dist[nachbar] = neu
                vorgaenger[nachbar] = knoten
                heapq.heappush(heap, (neu, nachbar))
    return dist, vorgaenger
\`\`\`

- Laufzeit mit binärem Heap: **O((V + E) log V)**.
- **Keine negativen Gewichte:** Dijkstra setzt voraus, dass ein Weg durch Hinzufügen von Kanten nie kürzer wird. Für negative Gewichte: **Bellman-Ford** (O(V·E)), der auch negative Zyklen erkennt.
- **A\\*** erweitert Dijkstra um eine Schätzung der Restentfernung (z. B. Luftlinie) und durchsucht dadurch zielgerichtet weniger Knoten – Standard in Spielen und Routenplanern.

> [!EXPERT] Warum „veraltete Einträge“?
> \`heapq\` kann die Priorität eines Eintrags nicht ändern. Statt „decrease key“ fügt man einfach einen neuen Eintrag mit kleinerer Distanz ein und ignoriert später den alten. Das ist in der Praxis schneller als eine komplexere Heap-Struktur.

## Topologische Sortierung

In welcher Reihenfolge muss man Aufgaben ausführen, wenn manche von anderen abhängen? Die **[[Topologische Sortierung]]** ordnet die Knoten eines DAG so, dass jede Kante von „früher“ nach „später“ zeigt. Genau das tun Build-Systeme, Paketmanager, CI-Pipelines mit \`needs:\` und Datenbank-Migrationswerkzeuge.

\`\`\`python title="Kahn-Algorithmus"
from collections import deque

abhaengigkeiten = {          # Aufgabe: Liste der Voraussetzungen
    "deploy": ["test", "build"],
    "test": ["build"],
    "build": ["install"],
    "install": [],
    "lint": ["install"],
}

def topo_sort(abh):
    eingrad = {k: len(v) for k, v in abh.items()}
    nachfolger = {k: [] for k in abh}
    for k, voraus in abh.items():
        for v in voraus:
            nachfolger[v].append(k)
    bereit = deque(k for k, g in eingrad.items() if g == 0)
    reihenfolge = []
    while bereit:
        k = bereit.popleft()
        reihenfolge.append(k)
        for n in nachfolger[k]:
            eingrad[n] -= 1
            if eingrad[n] == 0:
                bereit.append(n)
    if len(reihenfolge) != len(abh):
        raise ValueError("Zyklische Abhängigkeit!")
    return reihenfolge

print(topo_sort(abhaengigkeiten))   # ['install', 'build', 'lint', 'test', 'deploy']
\`\`\`

Bleiben Knoten übrig, gibt es einen **Zyklus** – „A braucht B, B braucht A“ ist nicht auflösbar. Genau diese Fehlermeldung kennt man von zirkulären Imports oder Paketabhängigkeiten.

## Weitere wichtige Algorithmen

| Problem | Algorithmus | Laufzeit |
|---|---|---|
| Minimaler Spannbaum (alle Knoten mit minimalen Kosten verbinden) | Kruskal (mit Union-Find), Prim | O(E log E) |
| Kürzeste Wege zwischen allen Paaren | Floyd-Warshall | O(V³) |
| Zusammenhangskomponenten dynamisch | Union-Find (Disjoint Set) | fast O(1) pro Operation |
| Maximaler Fluss | Ford-Fulkerson / Edmonds-Karp | O(V·E²) |
| Wichtigkeit von Webseiten | PageRank | iterativ |

## Überblick

| Algorithmus | Datenstruktur | Findet | Laufzeit |
|---|---|---|---|
| BFS | Queue | kürzesten Weg (ungewichtet) | O(V + E) |
| DFS | Stack / Rekursion | Erreichbarkeit, Zyklen, Reihenfolgen | O(V + E) |
| Dijkstra | Prioritätswarteschlange | kürzeste Wege (Gewichte ≥ 0) | O((V + E) log V) |
| Bellman-Ford | – | kürzeste Wege mit negativen Gewichten | O(V · E) |
| Topologische Sortierung | Queue (Kahn) oder DFS | Ausführungsreihenfolge im DAG | O(V + E) |

## Wie geht es weiter?

Wie Prioritätswarteschlangen intern funktionieren, erklärt [Bäume, Heaps & Tries](#/artikel/baeume-heaps). Die Datenstrukturen selbst kannst du im [Labor](#/labor/datenstrukturen) ausprobieren.

\`\`\`widget
quiz:Algorithmen 3
\`\`\`
`;export{e as default};
