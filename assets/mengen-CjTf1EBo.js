const e=`---
id: mengen
title: Mengenlehre
module: grundlagen
order: 3
difficulty: einsteiger
minutes: 35
summary: Mengen, Teilmengen und Potenzmenge, die Mengenoperationen mit ihren Gesetzen, das kartesische Produkt und das Zählen mit dem Inklusions-Exklusions-Prinzip.
tags: [Mengen, Teilmenge, Potenzmenge, Vereinigung, Schnitt, Kartesisches Produkt, Inklusion-Exklusion]
requires: [aussagenlogik, praedikatenlogik]
---

## Was ist eine Menge?

Fast jedes mathematische Objekt lässt sich als [[Menge]] beschreiben: Zahlbereiche, Lösungen einer Gleichung, die Knoten eines Graphen, die Zeilen einer Datenbanktabelle. Die naive Definition nach Georg Cantor (1895) genügt für das Studium:

> [!DEFINITION] Menge
> Eine **Menge** ist eine Zusammenfassung bestimmter, wohlunterschiedener Objekte zu einem Ganzen. Die Objekte heißen **Elemente**; man schreibt $a \\in M$ („$a$ ist Element von $M$“) bzw. $a \\notin M$.

Entscheidend ist nur, *ob* etwas Element ist: $\\set{1, 2, 3} = \\set{3, 1, 2} = \\set{1, 1, 2, 3}$. Reihenfolge und Vielfachheit spielen keine Rolle – anders als bei Listen oder Tupeln.

### Schreibweisen

- **Aufzählend:** $M = \\set{2, 3, 5, 7}$, auch $\\set{1, 2, \\dots, n}$ oder $\\set{0, 2, 4, \\dots}$, wenn das Muster eindeutig ist.
- **Beschreibend:** $M = \\set{x \\in \\N \\mid x \\text{ ist prim und } x < 10}$ – „die Menge aller $x$ aus $\\N$, für die gilt …“.
- **Leere Menge:** $\\emptyset = \\set{}$ hat kein Element. Achtung: $\\set{\\emptyset}$ ist *nicht* leer, sondern hat ein Element, nämlich $\\emptyset$.

Die Standard-Zahlbereiche: $\\N = \\set{0, 1, 2, \\dots}$ (in manchen Büchern ohne 0; dann schreibt man $\\N_0$ für die Variante mit 0), $\\Z$ (ganze), $\\Q$ (rationale), $\\R$ (reelle) und $\\C$ (komplexe Zahlen).

> [!TIP] Mengen in Programmiersprachen
> Python \`set\`, Java \`HashSet\`, JavaScript \`Set\` speichern ebenfalls jedes Element nur einmal und haben keine feste Reihenfolge. \`{1, 2} == {2, 1}\` ergibt in Python \`True\`. SQL-Ergebnisse sind dagegen **Multimengen** (Duplikate erlaubt) – \`DISTINCT\` und \`UNION\` (ohne \`ALL\`) machen daraus Mengen.

## Teilmengen und Gleichheit

> [!DEFINITION] Teilmenge, Gleichheit
> $A \\subseteq B$ („$A$ ist Teilmenge von $B$“), wenn jedes Element von $A$ auch in $B$ liegt:
> $$
> A \\subseteq B \\;:\\Longleftrightarrow\\; \\forall x: (x \\in A \\to x \\in B).
> $$
> Zwei Mengen sind **gleich**, wenn sie dieselben Elemente haben: $A = B \\;:\\Longleftrightarrow\\; A \\subseteq B \\land B \\subseteq A$. Gilt $A \\subseteq B$ und $A \\neq B$, heißt $A$ **echte** Teilmenge, geschrieben $A \\subsetneq B$.

Die Definition der Gleichheit liefert die Standardmethode für Mengenbeweise: **zwei Inklusionen** zeigen („$\\subseteq$“ und „$\\supseteq$“). Außerdem gilt $\\emptyset \\subseteq A$ für jede Menge $A$, denn die Implikation $x \\in \\emptyset \\to x \\in A$ hat immer eine falsche Prämisse.

## Mengenoperationen

> [!DEFINITION] Operationen
> Für Mengen $A, B$ (innerhalb einer Grundmenge $G$):
> - **Vereinigung** $A \\cup B = \\set{x \\mid x \\in A \\lor x \\in B}$
> - **Durchschnitt** $A \\cap B = \\set{x \\mid x \\in A \\land x \\in B}$
> - **Differenz** $A \\setminus B = \\set{x \\mid x \\in A \\land x \\notin B}$
> - **Komplement** $\\overline{A} = G \\setminus A$
> - **symmetrische Differenz** $A \\,\\triangle\\, B = (A \\setminus B) \\cup (B \\setminus A)$
>
> $A$ und $B$ heißen **disjunkt**, wenn $A \\cap B = \\emptyset$.

Man sieht die enge Verwandtschaft zur Logik: $\\cup$ entspricht $\\lor$, $\\cap$ entspricht $\\land$, das Komplement entspricht $\\lnot$, die symmetrische Differenz dem XOR. Deshalb übertragen sich die logischen Gesetze direkt.

> [!BEISPIEL] Rechnen mit Mengen
> Mit $A = \\set{1, 2, 3, 4}$, $B = \\set{3, 4, 5}$ und $G = \\set{1, \\dots, 6}$:
> $A \\cup B = \\set{1, 2, 3, 4, 5}$, $A \\cap B = \\set{3, 4}$, $A \\setminus B = \\set{1, 2}$, $B \\setminus A = \\set{5}$, $A \\,\\triangle\\, B = \\set{1, 2, 5}$, $\\overline{A} = \\set{5, 6}$.

### Gesetze

| Name | Gesetz |
|---|---|
| Kommutativität | $A \\cup B = B \\cup A$, $\\quad A \\cap B = B \\cap A$ |
| Assoziativität | $(A \\cup B) \\cup C = A \\cup (B \\cup C)$, ebenso für $\\cap$ |
| Distributivität | $A \\cap (B \\cup C) = (A \\cap B) \\cup (A \\cap C)$, $\\quad A \\cup (B \\cap C) = (A \\cup B) \\cap (A \\cup C)$ |
| De Morgan | $\\overline{A \\cup B} = \\overline{A} \\cap \\overline{B}$, $\\quad \\overline{A \\cap B} = \\overline{A} \\cup \\overline{B}$ |
| Differenz | $A \\setminus B = A \\cap \\overline{B}$ |
| Absorption | $A \\cup (A \\cap B) = A$, $\\quad A \\cap (A \\cup B) = A$ |

> [!SATZ] De Morgan für Mengen
> Für Teilmengen $A, B$ einer Grundmenge $G$ gilt $\\overline{A \\cup B} = \\overline{A} \\cap \\overline{B}$.

> [!BEWEIS]
> Wir zeigen beide Inklusionen gleichzeitig durch eine Kette von Äquivalenzen. Für $x \\in G$ gilt:
> $$
> x \\in \\overline{A \\cup B} \\iff \\lnot(x \\in A \\lor x \\in B) \\iff (x \\notin A) \\land (x \\notin B) \\iff x \\in \\overline{A} \\cap \\overline{B}.
> $$
> Der mittlere Schritt ist die Regel von De Morgan der Aussagenlogik. Da die Äquivalenz für jedes $x$ gilt, haben beide Mengen dieselben Elemente.

Dieses Muster – Elementaussage aufschreiben, Logik anwenden, zurückübersetzen – funktioniert für alle Gesetze der Tabelle.

## Potenzmenge

> [!DEFINITION] Potenzmenge
> Die **Potenzmenge** $\\mathcal{P}(A)$ ist die Menge aller Teilmengen von $A$:
> $\\mathcal{P}(A) = \\set{T \\mid T \\subseteq A}$.

Beispiel: $\\mathcal{P}(\\set{a, b}) = \\set{\\emptyset, \\set{a}, \\set{b}, \\set{a, b}}$.

> [!SATZ] Größe der Potenzmenge
> Hat $A$ genau $n$ Elemente, so hat $\\mathcal{P}(A)$ genau $2^n$ Elemente.

> [!BEWEIS]
> Eine Teilmenge $T$ entsteht, indem man für jedes der $n$ Elemente unabhängig entscheidet: „in $T$“ oder „nicht in $T$“. Das sind $2 \\cdot 2 \\cdots 2 = 2^n$ Möglichkeiten, und verschiedene Entscheidungsfolgen liefern verschiedene Teilmengen.

> [!TIP] Bitmasken
> Genau diese Idee nutzt man beim Programmieren: Eine Teilmenge von $\\set{0, \\dots, n-1}$ ist eine Zahl mit $n$ Bits, Bit $i$ gesetzt ⇔ $i \\in T$. Vereinigung ist \`a | b\`, Schnitt \`a & b\`, symmetrische Differenz \`a ^ b\`, Komplement \`~a & ((1 << n) - 1)\`. Alle Teilmengen durchläuft \`for (m = 0; m < (1 << n); m++)\` – das ist Brute Force über $2^n$ Kandidaten.

## Kartesisches Produkt

> [!DEFINITION] Kartesisches Produkt
> $A \\times B = \\set{(a, b) \\mid a \\in A, b \\in B}$ ist die Menge aller **geordneten Paare**. Für Paare gilt $(a, b) = (c, d) \\iff a = c \\land b = d$. Allgemein ist $A_1 \\times \\dots \\times A_n$ die Menge der $n$-Tupel und $A^n = A \\times \\dots \\times A$.

Hier zählt die Reihenfolge: $(1, 2) \\neq (2, 1)$, während $\\set{1, 2} = \\set{2, 1}$. Für endliche Mengen gilt $\\abs{A \\times B} = \\abs{A} \\cdot \\abs{B}$.

Beispiele: $\\R^2$ ist die Ebene, $\\set{0,1}^8$ die Menge aller Bytes ($2^8 = 256$ Elemente). Ein \`CROSS JOIN\` in SQL bildet genau das kartesische Produkt zweier Tabellen; ein \`INNER JOIN\` ist eine Teilmenge davon (siehe [SQL-JOIN-Visualisierer](#/labor/sql-joins)).

## Zählen: Inklusion und Exklusion

Mit $\\abs{A}$ bezeichnen wir die Anzahl der Elemente einer endlichen Menge. Für disjunkte Mengen ist $\\abs{A \\cup B} = \\abs{A} + \\abs{B}$. Überlappen sie, zählt man die gemeinsamen Elemente doppelt und muss sie einmal abziehen.

> [!SATZ] Inklusions-Exklusions-Prinzip
> Für endliche Mengen gilt
> $$
> \\abs{A \\cup B} = \\abs{A} + \\abs{B} - \\abs{A \\cap B}
> $$
> und für drei Mengen
> $$
> \\abs{A \\cup B \\cup C} = \\abs{A} + \\abs{B} + \\abs{C} - \\abs{A \\cap B} - \\abs{A \\cap C} - \\abs{B \\cap C} + \\abs{A \\cap B \\cap C}.
> $$

> [!BEWEIS]
> Für zwei Mengen zerlegt man $A \\cup B$ disjunkt in $A \\setminus B$, $A \\cap B$ und $B \\setminus A$. Dann ist $\\abs{A} = \\abs{A \\setminus B} + \\abs{A \\cap B}$ und ebenso für $B$. Addiert man, wird $\\abs{A \\cap B}$ zweimal gezählt; einmal abziehen ergibt genau $\\abs{A \\cup B}$. Für drei Mengen prüft man, dass jedes Element genau einmal gezählt wird: Ein Element in genau zwei der Mengen wird $2 - 1 = 1$-mal gezählt, eines in allen drei $3 - 3 + 1 = 1$-mal.

> [!BEISPIEL] Teilbarkeit zählen
> Wie viele Zahlen in $\\set{1, \\dots, 100}$ sind durch 2, 3 oder 5 teilbar? Mit $A_d$ = Vielfache von $d$: $\\abs{A_2} = 50$, $\\abs{A_3} = 33$, $\\abs{A_5} = 20$, $\\abs{A_6} = 16$, $\\abs{A_{10}} = 10$, $\\abs{A_{15}} = 6$, $\\abs{A_{30}} = 3$. Also
> $$
> 50 + 33 + 20 - 16 - 10 - 6 + 3 = 74.
> $$

## Mengenfamilien und Russells Paradox

Man kann auch über viele Mengen auf einmal vereinigen: $\\bigcup_{i=1}^{n} A_i$ und $\\bigcap_{i \\in I} A_i$ für eine Indexmenge $I$. Beispiel: $\\bigcap_{n \\ge 1} \\left(0, \\tfrac1n\\right) = \\emptyset$, obwohl jeder einzelne Schnitt endlich vieler dieser Intervalle nichtleer ist.

> [!EXPERT] Warum „naiv“?
> Die Menge $R = \\set{M \\mid M \\notin M}$ („alle Mengen, die sich nicht selbst enthalten“) führt zum Widerspruch: Ist $R \\in R$, dann $R \\notin R$ und umgekehrt. Die axiomatische Mengenlehre (ZFC) verhindert solche Konstruktionen, indem Mengen nur aus bereits vorhandenen Mengen ausgesondert werden dürfen: $\\set{x \\in A \\mid P(x)}$ statt $\\set{x \\mid P(x)}$. Für die Mathematik im Studium bleibt die naive Sicht unbedenklich, solange man diese Regel beachtet.

## Zusammenfassung

- Mengen haben keine Reihenfolge und keine Duplikate; Tupel schon.
- $A = B$ beweist man über zwei Inklusionen oder eine Äquivalenzkette auf Elementebene.
- Mengenoperationen entsprechen den Junktoren; alle Gesetze (insbesondere De Morgan) übertragen sich.
- $\\abs{\\mathcal{P}(A)} = 2^{\\abs{A}}$, $\\abs{A \\times B} = \\abs{A}\\cdot\\abs{B}$, und Überlappungen zählt man mit Inklusion-Exklusion.
`;export{e as default};
