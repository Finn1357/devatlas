const e=`---
id: graphen
title: Graphentheorie
module: diskrete-mathematik
order: 3
difficulty: fortgeschritten
minutes: 50
summary: Graphen, Grad und Handschlaglemma, Wege, Kreise und Zusammenhang, Bäume und ihre Charakterisierungen, Euler- und Hamiltonkreise, bipartite Graphen und Darstellungen im Speicher.
tags: [Graph, Knotengrad, Handschlaglemma, Zusammenhang, Baum, Eulerkreis, Hamiltonkreis, Bipartit]
requires: [relationen, vollstaendige-induktion]
---

## Graphen modellieren Beziehungen

Straßennetze, soziale Netzwerke, Abhängigkeiten zwischen Paketen, Links zwischen Webseiten, Zustände eines Automaten, Leiterbahnen auf einer Platine – überall gibt es Objekte und Verbindungen zwischen ihnen – einen [[Graph|Graphen]]. Die **Graphentheorie** liefert dafür eine gemeinsame Sprache und viele Sätze, die die Grundlage von Graphalgorithmen bilden (siehe [Artikel Graphen](#/artikel/graphen) und [Datenstrukturen-Labor](#/labor/datenstrukturen)).

> [!DEFINITION] Graph
> Ein (einfacher, ungerichteter) **Graph** $G = (V, E)$ besteht aus einer Menge $V$ von **Knoten** (vertices) und einer Menge $E$ von **Kanten**, wobei jede Kante eine zweielementige Teilmenge $\\set{u, v} \\subseteq V$ ist. $u$ und $v$ heißen dann **benachbart** (adjazent).
>
> Bei einem **gerichteten** Graphen sind Kanten geordnete Paare $(u, v)$; bei **gewichteten** Graphen trägt jede Kante eine Zahl (Länge, Kosten, Kapazität).

Ein gerichteter Graph ist nichts anderes als eine [Relation](#/mathe/grundlagen/relationen) auf $V$; ein ungerichteter eine symmetrische, irreflexive Relation.

## Knotengrad und Handschlaglemma

> [!DEFINITION] Grad
> Der **Grad** $\\deg(v)$ eines Knotens ist die Anzahl der Kanten, die ihn enthalten. Ein Knoten mit Grad 0 heißt isoliert.

> [!SATZ] Handschlaglemma
> In jedem Graphen gilt
> $$
> \\sum_{v \\in V} \\deg(v) = 2\\,\\abs E .
> $$
> Folglich ist die Anzahl der Knoten mit **ungeradem** Grad stets gerade.

> [!BEWEIS]
> Doppeltes Abzählen: Jede Kante $\\set{u, v}$ trägt genau zweimal zur Gradsumme bei – einmal bei $u$, einmal bei $v$. Für die Folgerung: Die Summe der geraden Grade ist gerade; damit die Gesamtsumme $2\\abs E$ gerade ist, muss auch die Summe der ungeraden Grade gerade sein, also gibt es eine gerade Anzahl ungerader Summanden.

> [!BEISPIEL] Wer gibt wem die Hand?
> Auf einer Feier mit 9 Personen soll jede genau 3 anderen die Hand geben. Unmöglich: Die Gradsumme wäre $9 \\cdot 3 = 27$, also ungerade.

Der **vollständige Graph** $K_n$ verbindet je zwei von $n$ Knoten; er hat $\\binom n2 = \\frac{n(n-1)}{2}$ Kanten – mehr kann ein einfacher Graph nicht haben. Graphen mit $\\abs E$ in der Größenordnung von $\\abs V^2$ heißen **dicht**, solche mit $\\abs E = O(\\abs V)$ **dünn** (die meisten realen Netzwerke).

## Wege, Kreise und Zusammenhang

> [!DEFINITION] Weg, Kreis, zusammenhängend
> Ein **Weg** der Länge $k$ ist eine Folge von Knoten $v_0, v_1, \\dots, v_k$, in der aufeinanderfolgende Knoten benachbart sind und kein Knoten doppelt vorkommt. Ein **Kreis** ist ein Weg mit $k \\ge 2$ plus der Kante $\\set{v_k, v_0}$. $G$ heißt **zusammenhängend**, wenn je zwei Knoten durch einen Weg verbunden sind.

„Durch einen Weg verbunden“ ist eine Äquivalenzrelation; ihre Klassen heißen **Zusammenhangskomponenten**. Breitensuche (BFS) und Tiefensuche (DFS) bestimmen sie in $O(\\abs V + \\abs E)$, ebenso Union-Find ([Relationen](#/mathe/grundlagen/relationen)).

Der **Abstand** $d(u, v)$ ist die Länge eines kürzesten Weges. In ungewichteten Graphen liefert ihn die Breitensuche, in gewichteten mit nichtnegativen Gewichten der Algorithmus von Dijkstra.

## Bäume

> [!DEFINITION] Baum
> Ein **Baum** ist ein zusammenhängender Graph ohne Kreise. Ein Graph ohne Kreise heißt **Wald** (seine Komponenten sind Bäume). Knoten mit Grad 1 heißen **Blätter**.

> [!SATZ] Charakterisierungen von Bäumen
> Für einen Graphen $G$ mit $n$ Knoten sind äquivalent:
> 1. $G$ ist ein Baum (zusammenhängend und kreisfrei).
> 2. Zwischen je zwei Knoten gibt es **genau einen** Weg.
> 3. $G$ ist zusammenhängend und hat genau $n - 1$ Kanten.
> 4. $G$ ist kreisfrei und hat genau $n - 1$ Kanten.
> 5. $G$ ist **minimal zusammenhängend**: Entfernt man irgendeine Kante, zerfällt er.

> [!BEWEIS] Ein Baum hat n − 1 Kanten (Induktion)
> **Hilfssatz:** Jeder Baum mit $n \\ge 2$ Knoten hat ein Blatt. Denn ein längster Weg $v_0, \\dots, v_k$ endet in einem Knoten $v_k$, dessen Nachbarn alle auf dem Weg liegen müssten (sonst wäre der Weg verlängerbar); ein Nachbar $v_i$ mit $i < k - 1$ ergäbe einen Kreis – also hat $v_k$ nur den Nachbarn $v_{k-1}$.
>
> **Induktion über $n$:** Für $n = 1$ gibt es $0$ Kanten. Für $n \\ge 2$ entferne ein Blatt mit seiner einzigen Kante. Der Rest ist wieder zusammenhängend und kreisfrei, also ein Baum mit $n - 1$ Knoten und nach Induktionsvoraussetzung $n - 2$ Kanten. Zusammen mit der entfernten Kante sind es $n - 1$.

Bäume sind die minimalen Strukturen, die alles verbinden. Ein **Spannbaum** eines zusammenhängenden Graphen ist ein Baum, der alle Knoten enthält; ein **minimaler Spannbaum** (Kruskal, Prim) verbindet etwa alle Standorte eines Netzwerks mit minimaler Kabellänge. In der Informatik begegnen Bäume als Dateisysteme, DOM, Syntaxbäume, Suchbäume und Heaps.

> [!TIP] Höhe binärer Bäume
> Ein Binärbaum der Höhe $h$ hat höchstens $1 + 2 + \\dots + 2^h = 2^{h+1} - 1$ Knoten ([geometrische Summe](#/mathe/grundlagen/vollstaendige-induktion)). Umgekehrt braucht ein Binärbaum mit $n$ Knoten mindestens die Höhe $\\lceil\\log_2(n + 1)\\rceil - 1$. Balancierte Suchbäume (AVL, Rot-Schwarz) halten die Höhe in $O(\\log n)$ – deshalb sind Suchen, Einfügen und Löschen dort logarithmisch.

## Euler- und Hamiltonkreise

Die Graphentheorie begann 1736 mit einem Rätsel: Kann man in Königsberg einen Spaziergang machen, der jede der sieben Brücken genau einmal überquert und zum Start zurückkehrt?

> [!DEFINITION] Eulerkreis
> Ein **Eulerkreis** ist ein geschlossener Kantenzug, der **jede Kante genau einmal** benutzt (Knoten dürfen mehrfach besucht werden).

> [!SATZ] Euler
> Ein zusammenhängender Graph besitzt genau dann einen Eulerkreis, wenn **jeder Knoten geraden Grad** hat. Er besitzt genau dann einen offenen Eulerweg (Start ≠ Ziel), wenn genau zwei Knoten ungeraden Grad haben – diese sind dann Start und Ziel.

Notwendig ist die Bedingung, weil man jeden Knoten genauso oft betritt wie verlässt. In Königsberg hatten alle vier Landteile ungeraden Grad – ein solcher Spaziergang ist unmöglich. Das „Haus vom Nikolaus“ hat genau zwei Knoten mit ungeradem Grad; man muss daher unten links oder unten rechts anfangen. Ein Eulerkreis lässt sich in $O(\\abs E)$ finden (Algorithmus von Hierholzer) – relevant für Straßenreinigung, Postzustellung und DNA-Sequenzierung.

> [!DEFINITION] Hamiltonkreis
> Ein **Hamiltonkreis** ist ein Kreis, der **jeden Knoten genau einmal** besucht.

So ähnlich die Frage klingt, so verschieden ist ihre Schwierigkeit: Für Hamiltonkreise ist **kein** effizientes Kriterium bekannt; das Entscheidungsproblem ist NP-vollständig. Das berühmte Problem des Handlungsreisenden (TSP) sucht einen kürzesten Hamiltonkreis – bei $n$ Städten gibt es $\\frac{(n-1)!}{2}$ Rundreisen ([Kombinatorik](#/mathe/diskrete-mathematik/kombinatorik)).

## Bipartite Graphen

> [!DEFINITION] Bipartit
> $G$ heißt **bipartit**, wenn sich $V$ so in zwei Mengen $A \\cup B$ zerlegen lässt, dass jede Kante einen Knoten aus $A$ mit einem aus $B$ verbindet.

Beispiele: Studierende und Kurse, Bewerber und Stellen, Nutzer und Produkte in einem Empfehlungssystem.

> [!SATZ] Kriterium
> Ein Graph ist genau dann bipartit, wenn er **keinen Kreis ungerader Länge** enthält.

Praktisch prüft man das mit einer Breitensuche, die die Knoten abwechselnd mit zwei Farben färbt; findet sie eine Kante zwischen gleichfarbigen Knoten, gibt es einen ungeraden Kreis. Auf bipartiten Graphen lassen sich **Zuordnungsprobleme** (maximales Matching) effizient lösen.

## Graphen im Speicher

| Darstellung | Speicher | Kante $\\set{u,v}$ prüfen | alle Nachbarn von $v$ |
|---|---|---|---|
| Adjazenzmatrix $A_{uv} \\in \\set{0,1}$ | $\\Theta(\\abs V^2)$ | $O(1)$ | $\\Theta(\\abs V)$ |
| Adjazenzliste | $\\Theta(\\abs V + \\abs E)$ | $O(\\deg u)$ | $O(\\deg v)$ |

Für dünne Graphen ist die Adjazenzliste fast immer besser. Die Adjazenzmatrix hat dafür eine algebraische Eigenschaft: Der Eintrag $(A^k)_{uv}$ zählt die **Kantenfolgen der Länge $k$** von $u$ nach $v$ – Matrixmultiplikation ([Matrizen](#/mathe/lineare-algebra/matrizen)) wird zu Wegezählung. Die [Eigenwerte](#/mathe/lineare-algebra/eigenwerte) der Adjazenzmatrix verraten viel über die Struktur des Graphen; PageRank ist ein Eigenvektor einer verwandten Matrix.

## Zusammenfassung

- Graph = Knoten + Kanten; Gradsumme $= 2\\abs E$, ungerade Grade kommen in gerader Anzahl vor.
- Baum: zusammenhängend, kreisfrei, $n - 1$ Kanten, genau ein Weg zwischen je zwei Knoten.
- Eulerkreis ⇔ zusammenhängend und alle Grade gerade; Hamiltonkreise sind NP-schwer.
- Bipartit ⇔ keine ungeraden Kreise; Adjazenzliste für dünne, Matrix für dichte Graphen.
`;export{e as default};
