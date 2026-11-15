const e=`---
id: konvexitaet
title: Konvexe Mengen und Funktionen
module: optimierung
order: 1
difficulty: fortgeschritten
minutes: 40
summary: Optimierungsprobleme, konvexe Mengen und Funktionen, Kriterien über Ableitungen und Hesse-Matrix, warum bei konvexen Problemen jedes lokale Minimum global ist und welche Verlustfunktionen im Machine Learning konvex sind.
tags: [Optimierung, Konvexität, Konvexe Funktion, Hesse-Matrix, Globales Minimum, Verlustfunktion]
requires: [kurvendiskussion, vektoren]
---

## Optimierungsprobleme

Ein **Optimierungsproblem** sucht unter allen zulässigen Punkten einen mit minimalem Wert einer Zielfunktion:
$$
\\min_{x \\in X} f(x) .
$$
$f\\colon \\R^n \\to \\R$ heißt **Zielfunktion** (im Machine Learning: Verlustfunktion, Loss), $X \\subseteq \\R^n$ die **zulässige Menge**. Maximieren ist dasselbe wie das Minimieren von $-f$.

Beispiele aus der Informatik: die Parameter eines neuronalen Netzes so wählen, dass der Fehler auf den Trainingsdaten minimal wird; Server so auf Rechenzentren verteilen, dass die Latenz minimal ist und Kapazitäten eingehalten werden; die kürzeste Route, das günstigste Portfolio, die beste Kompression.

Die zentrale Schwierigkeit: Algorithmen sehen nur **lokale** Information – Funktionswert und Ableitungen an einzelnen Punkten. Ob ein gefundenes lokales Minimum auch das **globale** ist, lässt sich im Allgemeinen nicht feststellen. Es gibt aber eine große Klasse von Problemen, bei denen diese Sorge entfällt: die konvexen.

## Konvexe Mengen

> [!DEFINITION] Konvexe Menge
> Eine Menge $X \\subseteq \\R^n$ heißt **konvex**, wenn mit je zwei Punkten auch ihre Verbindungsstrecke in $X$ liegt:
> $$
> x, y \\in X,\\; \\lambda \\in [0, 1] \\quad\\Longrightarrow\\quad \\lambda x + (1 - \\lambda) y \\in X .
> $$

Konvex sind etwa Kugeln, Würfel, Halbräume $\\set{x \\mid \\vec a \\cdot x \\le b}$, Geraden, Ebenen und Durchschnitte konvexer Mengen. Die zulässige Menge eines **linearen Programms** – endlich viele lineare Ungleichungen – ist als Durchschnitt von Halbräumen immer konvex (ein Polyeder). Nicht konvex sind etwa ein Ring, ein Halbmond oder die Menge $\\set{0, 1}$ der ganzzahligen Entscheidungen – deshalb ist ganzzahlige Optimierung so viel schwerer.

## Konvexe Funktionen

> [!DEFINITION] Konvexe Funktion
> Sei $X$ konvex. $f\\colon X \\to \\R$ heißt **[[Konvexe Funktion|konvex]]**, wenn für alle $x, y \\in X$ und $\\lambda \\in [0, 1]$ gilt
> $$
> f\\big(\\lambda x + (1 - \\lambda) y\\big) \\le \\lambda f(x) + (1 - \\lambda) f(y) .
> $$
> Gilt für $x \\neq y$ und $\\lambda \\in (0, 1)$ sogar „$<$“, heißt $f$ **streng konvex**. $f$ heißt **konkav**, wenn $-f$ konvex ist.

Geometrisch: Der Graph liegt nie oberhalb der Sehne zwischen zwei seiner Punkte – eine „Schüssel“. Beispiele: $x^2$, $\\e^x$, $\\abs x$, $-\\ln x$ (auf $x > 0$), jede Norm $\\norm{x}$, jede affine Funktion $\\vec a \\cdot x + b$ (konvex und konkav zugleich). Nicht konvex: $\\sin x$, $x^3$, $-x^2$.

### Kriterien über Ableitungen

> [!SATZ] Kriterien für Konvexität
> Sei $X \\subseteq \\R^n$ offen und konvex.
> 1. Ist $f$ differenzierbar, so ist $f$ genau dann konvex, wenn der Graph **oberhalb jeder Tangente** liegt:
> $$
> f(y) \\ge f(x) + \\nabla f(x) \\cdot (y - x) \\qquad \\text{für alle } x, y \\in X .
> $$
> 2. Ist $f$ zweimal differenzierbar, so ist $f$ genau dann konvex, wenn die **Hesse-Matrix** $\\nabla^2 f(x)$ überall **positiv semidefinit** ist. Im Eindimensionalen heißt das einfach $f''(x) \\ge 0$.

Eine symmetrische Matrix $H$ heißt positiv semidefinit, wenn $\\vec v^T H \\vec v \\ge 0$ für alle $\\vec v$ – gleichbedeutend: alle [Eigenwerte](#/mathe/lineare-algebra/eigenwerte) sind $\\ge 0$. Bei $2 \\times 2$-Matrizen genügt: $h_{11} \\ge 0$, $h_{22} \\ge 0$ und $\\det H \\ge 0$.

> [!BEISPIEL] Konvexität prüfen
> - $f(x) = x^4$: $f''(x) = 12x^2 \\ge 0$ – konvex (sogar streng, obwohl $f''(0) = 0$).
> - $f(x, y) = x^2 + xy + y^2$: $\\nabla^2 f = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$ mit Eigenwerten $1$ und $3$ – positiv definit, also streng konvex.
> - $f(x, y) = x^2 - y^2$: Eigenwerte $2$ und $-2$ – nicht konvex. Der Ursprung ist ein **Sattelpunkt**: Minimum in $x$-Richtung, Maximum in $y$-Richtung.

### Konvexität bleibt erhalten

Konvexität ist bequem, weil man sie aus Bausteinen zusammensetzen kann:
- Summen konvexer Funktionen und positive Vielfache sind konvex.
- Das Maximum konvexer Funktionen ist konvex (etwa $\\max(0, 1 - y\\,\\vec w\\cdot\\vec x)$, der Hinge-Loss).
- Konvex verkettet mit affin ist konvex: $f(A\\vec x + \\vec b)$, etwa $\\norm{A\\vec x - \\vec b}^2$.

## Der Hauptsatz der konvexen Optimierung

> [!SATZ] Lokal ist global
> Sei $X$ konvex und $f\\colon X \\to \\R$ konvex. Dann ist jedes lokale Minimum von $f$ auf $X$ ein globales Minimum. Ist $f$ streng konvex, gibt es höchstens ein Minimum.

> [!BEWEIS]
> Sei $x$ ein lokales Minimum, und angenommen, es gibt $y \\in X$ mit $f(y) < f(x)$. Für $\\lambda \\in (0, 1]$ liegt $z_\\lambda = (1 - \\lambda)x + \\lambda y$ in $X$, und wegen Konvexität ist
> $$
> f(z_\\lambda) \\le (1 - \\lambda) f(x) + \\lambda f(y) < f(x) .
> $$
> Für $\\lambda \\to 0$ kommt $z_\\lambda$ beliebig nahe an $x$, mit kleinerem Funktionswert – Widerspruch zur lokalen Minimalität. Bei strenger Konvexität: Wären $x \\ne y$ zwei Minimalstellen mit Wert $m$, so wäre $f\\left(\\frac{x+y}{2}\\right) < m$ – Widerspruch.

> [!SATZ] Optimalitätsbedingung
> Ist $f$ konvex und differenzierbar auf $\\R^n$, so gilt:
> $$
> x^* \\text{ ist globales Minimum} \\iff \\nabla f(x^*) = \\vec 0 .
> $$

Im allgemeinen (nicht konvexen) Fall ist $\\nabla f = \\vec 0$ nur notwendig – Sattelpunkte und lokale Maxima erfüllen es auch. Bei konvexen Funktionen ist die Bedingung zusätzlich **hinreichend** für ein globales Minimum. Das folgt direkt aus dem Tangentenkriterium: $f(y) \\ge f(x^*) + \\vec 0 \\cdot (y - x^*) = f(x^*)$.

## Konvexität im Machine Learning

| Modell | Verlustfunktion | konvex in den Parametern? |
|---|---|---|
| Lineare Regression | mittlerer quadratischer Fehler $\\frac1n\\norm{X\\vec w - \\vec y}^2$ | ja |
| Logistische Regression | Kreuzentropie | ja |
| Support Vector Machine | Hinge-Loss + $\\lambda\\norm{\\vec w}^2$ | ja |
| Neuronales Netz mit verdeckten Schichten | Kreuzentropie, MSE | **nein** |

Für die ersten drei findet ein Optimierer zuverlässig das globale Optimum. Bei neuronalen Netzen ist die Verlustlandschaft nicht konvex; trotzdem funktioniert [Gradientenabstieg](#/mathe/optimierung/gradientenverfahren) in der Praxis erstaunlich gut, weil in hohen Dimensionen die meisten kritischen Punkte Sattelpunkte statt schlechter lokaler Minima sind. Eine vollständige Theorie dafür gibt es noch nicht.

> [!TIP] Regularisierung macht konvex(er)
> Ein Term $\\lambda\\norm{\\vec w}^2$ (Ridge, „Weight Decay“) ist streng konvex. Addiert man ihn zu einer konvexen Verlustfunktion, wird das Problem streng konvex und hat eine **eindeutige** Lösung – nützlich, wenn es sonst viele gleich gute Parameter gäbe (etwa bei mehr Merkmalen als Datenpunkten).

## Zusammenfassung

- Konvexe Menge: Verbindungsstrecken bleiben drin. Konvexe Funktion: Graph unter jeder Sehne, über jeder Tangente.
- Kriterien: $f'' \\ge 0$ bzw. Hesse-Matrix positiv semidefinit (alle Eigenwerte $\\ge 0$).
- Bei konvexen Problemen ist jedes lokale Minimum global, und $\\nabla f(x^*) = \\vec 0$ ist hinreichend.
- Lineare und logistische Regression sind konvex, tiefe neuronale Netze nicht.
`;export{e as default};
