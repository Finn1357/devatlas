const e=`---
id: relationen
title: Relationen, Äquivalenz und Ordnung
module: grundlagen
order: 6
difficulty: fortgeschritten
minutes: 40
summary: Relationen als Mengen von Paaren, ihre Eigenschaften (reflexiv, symmetrisch, antisymmetrisch, transitiv), Äquivalenzrelationen mit Klassen und Zerlegungen, Ordnungsrelationen und Hasse-Diagramme.
tags: [Relation, Äquivalenzrelation, Äquivalenzklasse, Kongruenz, Halbordnung, Totalordnung, Hasse-Diagramm]
requires: [mengen]
---

## Relationen als Mengen

Beziehungen wie „ist kleiner als“, „teilt“, „ist befreundet mit“ oder „hat dieselbe Postleitzahl wie“ haben eine gemeinsame Struktur: Für jedes Paar von Objekten steht fest, ob es in Beziehung steht oder nicht.

> [!DEFINITION] Relation
> Eine (zweistellige) **[[Relation]]** zwischen Mengen $A$ und $B$ ist eine Teilmenge $R \\subseteq A \\times B$. Statt $(a, b) \\in R$ schreibt man $a \\, R \\, b$. Ist $A = B$, spricht man von einer Relation **auf** $A$.

Beispiele auf $A = \\set{1, 2, 3}$:

- $\\le$ ist die Menge $\\set{(1,1), (1,2), (1,3), (2,2), (2,3), (3,3)}$.
- „teilt“ ist $\\set{(1,1), (1,2), (1,3), (2,2), (3,3)}$.
- Die **Gleichheit** (Diagonale) ist $\\Delta_A = \\set{(1,1), (2,2), (3,3)}$.

> [!TIP] Relationen in Datenbanken
> Der Name „relationale Datenbank“ kommt genau daher: Eine Tabelle mit den Spalten \`student_id\` und \`kurs_id\` ist eine Relation zwischen Studierenden und Kursen. Ein \`JOIN\` über die gemeinsame Spalte ist die Verkettung zweier Relationen.

### Darstellungen

Eine Relation auf einer endlichen Menge lässt sich als **gerichteter Graph** zeichnen (Pfeil $a \\to b$ für $a \\, R \\, b$) oder als **Adjazenzmatrix** mit $M_{ij} = 1$ genau dann, wenn $a_i \\, R \\, a_j$. Beide Darstellungen kennst du aus der Graphentheorie.

## Eigenschaften von Relationen

> [!DEFINITION] Eigenschaften
> Eine Relation $R$ auf $A$ heißt
> - **reflexiv**, wenn $a \\, R \\, a$ für alle $a \\in A$;
> - **symmetrisch**, wenn aus $a \\, R \\, b$ stets $b \\, R \\, a$ folgt;
> - **antisymmetrisch**, wenn aus $a \\, R \\, b$ und $b \\, R \\, a$ stets $a = b$ folgt;
> - **transitiv**, wenn aus $a \\, R \\, b$ und $b \\, R \\, c$ stets $a \\, R \\, c$ folgt;
> - **total** (vergleichbar), wenn für alle $a, b$ gilt: $a \\, R \\, b$ oder $b \\, R \\, a$.

| Relation | reflexiv | symmetrisch | antisymmetrisch | transitiv |
|---|:-:|:-:|:-:|:-:|
| $=$ auf $\\R$ | ✓ | ✓ | ✓ | ✓ |
| $\\le$ auf $\\R$ | ✓ | – | ✓ | ✓ |
| $<$ auf $\\R$ | – | – | ✓ | ✓ |
| „teilt“ auf $\\N$ | ✓ | – | ✓ | ✓ |
| „teilt“ auf $\\Z$ | ✓ | – | – | ✓ |
| $\\equiv \\pmod 3$ auf $\\Z$ | ✓ | ✓ | – | ✓ |
| „ist befreundet mit“ | – | ✓ | – | – |

Zwei Einträge verdienen einen Blick: $<$ ist antisymmetrisch, weil die Voraussetzung „$a < b$ und $b < a$“ nie erfüllt ist (die Implikation ist dann leer wahr). Und „teilt“ ist auf $\\Z$ nicht antisymmetrisch, weil $2 \\mid -2$ und $-2 \\mid 2$, aber $2 \\neq -2$.

> [!MISTAKE] Antisymmetrisch ist nicht „nicht symmetrisch“
> Die Gleichheit ist symmetrisch **und** antisymmetrisch. Die Relation $\\set{(1,2), (2,1), (2,3)}$ auf $\\set{1,2,3}$ ist weder symmetrisch (es fehlt $(3,2)$) noch antisymmetrisch ($1 \\neq 2$, obwohl beide Richtungen vorkommen).

## Äquivalenzrelationen

> [!DEFINITION] Äquivalenzrelation
> Eine Relation $\\sim$ auf $A$ heißt **Äquivalenzrelation**, wenn sie reflexiv, symmetrisch und transitiv ist. Für $a \\in A$ heißt
> $$
> [a] = \\set{x \\in A \\mid x \\sim a}
> $$
> die **Äquivalenzklasse** von $a$; jedes Element einer Klasse ist ein **Repräsentant** dieser Klasse. Die Menge aller Klassen heißt **Quotientenmenge** $A/{\\sim}$.

Äquivalenzrelationen formalisieren „ist in gewisser Hinsicht gleich“: gleiche Farbe, gleiches Geburtsjahr, gleicher Rest.

> [!BEISPIEL] Kongruenz modulo n
> Für $n \\ge 1$ sei $a \\equiv b \\pmod n$, wenn $n \\mid (a - b)$. Das ist eine Äquivalenzrelation auf $\\Z$:
> - reflexiv: $n \\mid 0 = a - a$;
> - symmetrisch: aus $a - b = kn$ folgt $b - a = (-k)n$;
> - transitiv: aus $a - b = kn$ und $b - c = ln$ folgt $a - c = (k + l)n$.
>
> Für $n = 3$ gibt es genau drei Klassen: $[0] = \\set{\\dots, -3, 0, 3, 6, \\dots}$, $[1] = \\set{\\dots, -2, 1, 4, \\dots}$, $[2] = \\set{\\dots, -1, 2, 5, \\dots}$. Die Quotientenmenge $\\Z/3\\Z$ ist die Grundlage der [modularen Arithmetik](#/mathe/zahlentheorie/modulare-arithmetik).

> [!SATZ] Äquivalenzklassen zerlegen die Menge
> Ist $\\sim$ eine Äquivalenzrelation auf $A$, so gilt für alle $a, b \\in A$: Entweder $[a] = [b]$ oder $[a] \\cap [b] = \\emptyset$. Außerdem ist jedes Element in seiner eigenen Klasse. Die Klassen bilden also eine **Zerlegung** (Partition) von $A$: nichtleere, paarweise disjunkte Teilmengen, deren Vereinigung $A$ ist.

> [!BEWEIS]
> Wegen Reflexivität ist $a \\in [a]$, also ist jede Klasse nichtleer und jedes Element liegt in einer Klasse.
>
> Angenommen, $[a] \\cap [b] \\neq \\emptyset$, etwa $c \\in [a] \\cap [b]$, also $c \\sim a$ und $c \\sim b$. Wir zeigen $[a] \\subseteq [b]$: Für $x \\in [a]$ gilt $x \\sim a$. Aus $c \\sim a$ folgt mit Symmetrie $a \\sim c$, mit Transitivität $x \\sim c$ und dann mit $c \\sim b$ auch $x \\sim b$, also $x \\in [b]$. Aus Symmetriegründen gilt ebenso $[b] \\subseteq [a]$, insgesamt $[a] = [b]$.

Umgekehrt definiert jede Zerlegung eine Äquivalenzrelation („liegt im selben Teil“). Äquivalenzrelationen und Zerlegungen sind also zwei Sichtweisen auf dasselbe.

> [!TIP] Union-Find
> Die Datenstruktur **Union-Find** (Disjoint Set Union) verwaltet genau eine solche Zerlegung: \`find(x)\` liefert einen Repräsentanten der Klasse, \`union(x, y)\` verschmilzt zwei Klassen. Sie steckt im Kruskal-Algorithmus für minimale Spannbäume und beim Bestimmen von Zusammenhangskomponenten.

### Weitere Beispiele

- Auf der Menge der Brüche $\\set{(p, q) \\mid p \\in \\Z, q \\in \\Z \\setminus \\set{0}}$ ist $(p, q) \\sim (p', q') :\\iff pq' = p'q$ eine Äquivalenzrelation. Die Klassen **sind** die rationalen Zahlen: $\\tfrac12 = \\tfrac24 = \\tfrac{-3}{-6}$.
- Zwei Programme heißen äquivalent, wenn sie für jede Eingabe dieselbe Ausgabe liefern – Compiler-Optimierungen müssen innerhalb einer solchen Klasse bleiben.

## Ordnungsrelationen

> [!DEFINITION] Halbordnung und Totalordnung
> Eine Relation $\\preceq$ auf $A$ heißt **Halbordnung** (partielle Ordnung), wenn sie reflexiv, antisymmetrisch und transitiv ist. Ist sie zusätzlich total, heißt sie **Totalordnung** (lineare Ordnung). Das Paar $(A, \\preceq)$ heißt (halb)geordnete Menge.

- $\\le$ auf $\\R$ ist eine Totalordnung.
- „teilt“ auf $\\N$ ist eine Halbordnung, aber nicht total: Weder $2 \\mid 3$ noch $3 \\mid 2$.
- $\\subseteq$ auf der Potenzmenge $\\mathcal P(M)$ ist eine Halbordnung; für $\\abs M \\ge 2$ nicht total.
- Die **lexikografische Ordnung** auf Wörtern (wie im Wörterbuch) ist eine Totalordnung – genau die, nach der \`sort()\` Strings sortiert.

### Hasse-Diagramme

Eine endliche Halbordnung zeichnet man sparsam als **Hasse-Diagramm**: Man zeichnet $b$ oberhalb von $a$ und verbindet sie nur, wenn $a \\prec b$ und es kein $c$ mit $a \\prec c \\prec b$ gibt („$b$ ist direkter Nachfolger von $a$“). Reflexive und transitiv folgende Kanten werden weggelassen.

> [!BEISPIEL] Teiler von 12
> Auf $T = \\set{1, 2, 3, 4, 6, 12}$ mit „teilt“: Unten steht $1$, darüber $2$ und $3$, darüber $4$ (über $2$) und $6$ (über $2$ und $3$), ganz oben $12$ (über $4$ und $6$). Die Kante $1$–$4$ fehlt, weil sie über $2$ läuft.

### Besondere Elemente

In einer halbgeordneten Menge $(A, \\preceq)$ heißt $m$
- **minimal**, wenn es kein $x \\neq m$ mit $x \\preceq m$ gibt;
- **kleinstes Element**, wenn $m \\preceq x$ für alle $x$ gilt.

Ein kleinstes Element ist eindeutig und minimal; minimale Elemente kann es mehrere geben. In $\\set{2, 3, 4, 6}$ mit „teilt“ sind $2$ und $3$ minimal, ein kleinstes Element gibt es nicht.

> [!TIP] Topologisches Sortieren
> Abhängigkeiten zwischen Build-Schritten, Kursen oder Paketen bilden eine Halbordnung („muss vor … kommen“). Ein **topologisches Sortieren** erweitert sie zu einer Totalordnung – eine Reihenfolge, die alle Abhängigkeiten respektiert. Das geht genau dann, wenn der Abhängigkeitsgraph keine Zyklen hat.

## Hüllen

Fehlt einer Relation eine Eigenschaft, kann man sie oft minimal ergänzen. Die **transitive Hülle** $R^+$ enthält $(a, c)$, wenn es einen Pfad $a \\, R \\, b_1 \\, R \\, b_2 \\cdots R \\, c$ gibt. In Graphen ist das die **Erreichbarkeit**; der Warshall-Algorithmus berechnet sie in $O(n^3)$. Die reflexiv-transitive Hülle $R^*$ nimmt zusätzlich die Diagonale hinzu.

## Zusammenfassung

- Relationen sind Mengen von Paaren; auf endlichen Mengen sind sie Graphen bzw. 0-1-Matrizen.
- Äquivalenzrelation = reflexiv + symmetrisch + transitiv; ihre Klassen zerlegen die Menge.
- Halbordnung = reflexiv + antisymmetrisch + transitiv; total ist sie, wenn alles vergleichbar ist.
- Antisymmetrisch ≠ nicht symmetrisch; minimal ≠ kleinstes Element.
`;export{e as default};
