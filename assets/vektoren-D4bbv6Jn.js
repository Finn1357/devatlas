const e=`---
id: vektoren
title: Vektoren im Rⁿ
module: lineare-algebra
order: 1
difficulty: einsteiger
minutes: 35
summary: Vektoren als Pfeile und als Zahlentupel, Addition und Vielfache, Linearkombinationen, Skalarprodukt, Länge, Winkel und Orthogonalität sowie das Kreuzprodukt im Raum.
tags: [Vektor, Linearkombination, Skalarprodukt, Norm, Winkel, Orthogonal, Kreuzprodukt]
requires: [mengen]
---

## Zwei Sichtweisen auf Vektoren

In der Schule ist ein Vektor ein **Pfeil** mit Richtung und Länge, den man beliebig verschieben darf. In der Informatik ist ein Vektor eine **Liste von Zahlen**: ein Pixel $(r, g, b)$, ein Punkt im 3D-Modell, eine Zeile mit Merkmalen eines Datensatzes oder ein Embedding mit 1536 Komponenten. Die lineare Algebra verbindet beide Sichtweisen.

> [!DEFINITION] Der Raum Rⁿ
> $\\R^n$ ist die Menge aller $n$-Tupel reeller Zahlen, geschrieben als Spalte
> $$
> \\vec v = \\begin{pmatrix} v_1 \\\\ \\vdots \\\\ v_n \\end{pmatrix}, \\qquad v_i \\in \\R .
> $$
> Die $v_i$ heißen **Komponenten** oder Koordinaten. Der **Nullvektor** $\\vec 0$ hat nur Nullen als Komponenten.

## Addition und Vielfache

Vektoren werden **komponentenweise** addiert und mit einer Zahl (einem **Skalar**) multipliziert:
$$
\\vec u + \\vec v = \\begin{pmatrix} u_1 + v_1 \\\\ \\vdots \\\\ u_n + v_n \\end{pmatrix}, \\qquad \\lambda \\vec v = \\begin{pmatrix} \\lambda v_1 \\\\ \\vdots \\\\ \\lambda v_n \\end{pmatrix}.
$$

Geometrisch hängt man bei der Addition die Pfeile aneinander (Parallelogrammregel); $\\lambda \\vec v$ streckt den Pfeil um den Faktor $\\abs\\lambda$ und kehrt ihn für $\\lambda < 0$ um. Der **Verbindungsvektor** von Punkt $P$ nach Punkt $Q$ ist $\\overrightarrow{PQ} = \\vec q - \\vec p$.

Es gelten die vertrauten Rechenregeln: Addition ist kommutativ und assoziativ, $\\vec v + \\vec 0 = \\vec v$, $\\vec v + (-\\vec v) = \\vec 0$, und $\\lambda(\\vec u + \\vec v) = \\lambda \\vec u + \\lambda \\vec v$, $(\\lambda + \\mu)\\vec v = \\lambda\\vec v + \\mu \\vec v$. Genau diese Regeln werden später zur Definition eines allgemeinen [[Vektorraum|Vektorraums]].

> [!TIP] Vektorisierung in NumPy
> \`u + v\` und \`3 * v\` auf NumPy-Arrays sind genau diese komponentenweisen Operationen – ohne Python-Schleife und deshalb um Größenordnungen schneller. „Vektorisieren“ heißt, Algorithmen in solchen Operationen auszudrücken.

## Linearkombinationen

> [!DEFINITION] Linearkombination
> Ein Vektor $\\vec w$ ist **Linearkombination** von $\\vec v_1, \\dots, \\vec v_k$, wenn es Skalare $\\lambda_1, \\dots, \\lambda_k$ gibt mit
> $$
> \\vec w = \\lambda_1 \\vec v_1 + \\dots + \\lambda_k \\vec v_k .
> $$
> Die Menge aller Linearkombinationen heißt **Spann** (lineare Hülle) $\\operatorname{span}(\\vec v_1, \\dots, \\vec v_k)$.

Im $\\R^3$ ist der Spann eines Vektors $\\vec v \\neq \\vec 0$ eine Gerade durch den Ursprung, der Spann zweier nicht paralleler Vektoren eine Ebene durch den Ursprung.

> [!BEISPIEL] Ist w eine Linearkombination?
> Ist $\\vec w = \\begin{pmatrix} 4 \\\\ 7 \\end{pmatrix}$ Linearkombination von $\\vec a = \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}$ und $\\vec b = \\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix}$? Gesucht sind $\\lambda, \\mu$ mit
> $$
> \\lambda + 2\\mu = 4, \\qquad 2\\lambda + \\mu = 7 .
> $$
> Aus der ersten Gleichung $\\lambda = 4 - 2\\mu$, eingesetzt $8 - 4\\mu + \\mu = 7$, also $\\mu = \\tfrac13$ und $\\lambda = \\tfrac{10}{3}$. Die Frage führt also auf ein **lineares Gleichungssystem** – das zentrale Werkzeug der nächsten Lektion.

## Skalarprodukt

> [!DEFINITION] Standardskalarprodukt
> Für $\\vec u, \\vec v \\in \\R^n$ ist
> $$
> \\vec u \\cdot \\vec v = \\langle \\vec u, \\vec v \\rangle = \\sum_{i=1}^{n} u_i v_i = u_1 v_1 + \\dots + u_n v_n .
> $$

Das Ergebnis ist eine **Zahl**, kein Vektor. Rechenregeln: symmetrisch ($\\vec u \\cdot \\vec v = \\vec v \\cdot \\vec u$), linear in jedem Argument ($(\\lambda\\vec u + \\vec w)\\cdot\\vec v = \\lambda\\, \\vec u \\cdot \\vec v + \\vec w \\cdot \\vec v$) und positiv definit ($\\vec v \\cdot \\vec v > 0$ für $\\vec v \\neq \\vec 0$).

### Länge und Abstand

> [!DEFINITION] Norm
> Die (euklidische) **Länge** oder **Norm** von $\\vec v$ ist
> $$
> \\norm{\\vec v} = \\sqrt{\\vec v \\cdot \\vec v} = \\sqrt{v_1^2 + \\dots + v_n^2},
> $$
> der **Abstand** zweier Punkte ist $\\norm{\\vec p - \\vec q}$. Ein Vektor mit Länge 1 heißt **Einheitsvektor**; $\\tfrac{\\vec v}{\\norm{\\vec v}}$ normiert $\\vec v \\neq \\vec 0$.

Im $\\R^2$ ist das genau der Satz des Pythagoras. Beispiel: $\\norm{(3, 4)} = 5$, und $\\tfrac15 (3, 4) = (0{,}6;\\, 0{,}8)$ ist der zugehörige Einheitsvektor.

### Winkel

> [!SATZ] Cauchy-Schwarz und Winkel
> Für alle $\\vec u, \\vec v \\in \\R^n$ gilt die **Cauchy-Schwarz-Ungleichung**
> $$
> \\abs{\\vec u \\cdot \\vec v} \\le \\norm{\\vec u}\\,\\norm{\\vec v}.
> $$
> Für $\\vec u, \\vec v \\neq \\vec 0$ gibt es daher genau einen Winkel $\\varphi \\in [0, \\pi]$ mit
> $$
> \\cos \\varphi = \\frac{\\vec u \\cdot \\vec v}{\\norm{\\vec u}\\,\\norm{\\vec v}} .
> $$

> [!BEWEIS]
> Für $\\vec v = \\vec 0$ sind beide Seiten $0$. Sonst betrachte die Funktion $p(t) = \\norm{\\vec u - t\\vec v}^2 \\ge 0$. Ausmultiplizieren ergibt $p(t) = \\norm{\\vec u}^2 - 2t\\,(\\vec u\\cdot\\vec v) + t^2 \\norm{\\vec v}^2$. Setze $t = \\tfrac{\\vec u\\cdot\\vec v}{\\norm{\\vec v}^2}$ (die Minimalstelle der Parabel):
> $$
> 0 \\le \\norm{\\vec u}^2 - \\frac{(\\vec u\\cdot\\vec v)^2}{\\norm{\\vec v}^2} .
> $$
> Multiplikation mit $\\norm{\\vec v}^2$ und Wurzelziehen liefert die Ungleichung. Damit liegt der Quotient im Intervall $[-1, 1]$, und der Kosinus ist auf $[0, \\pi]$ bijektiv auf dieses Intervall.

Aus Cauchy-Schwarz folgt auch die **Dreiecksungleichung** $\\norm{\\vec u + \\vec v} \\le \\norm{\\vec u} + \\norm{\\vec v}$.

> [!TIP] Kosinus-Ähnlichkeit
> Suchmaschinen, Empfehlungssysteme und RAG-Pipelines vergleichen Texte über ihre Embedding-Vektoren mit genau diesem Quotienten, der **Kosinus-Ähnlichkeit**. Werte nahe 1 bedeuten „zeigen in dieselbe Richtung“ (ähnliche Bedeutung), nahe 0 „unabhängig“. Sind die Vektoren vorab normiert, ist es einfach das Skalarprodukt.

### Orthogonalität

> [!DEFINITION] Orthogonal
> $\\vec u$ und $\\vec v$ heißen **orthogonal** (senkrecht), $\\vec u \\perp \\vec v$, wenn $\\vec u \\cdot \\vec v = 0$.

Für orthogonale Vektoren gilt der **Satz des Pythagoras** in beliebiger Dimension: $\\norm{\\vec u + \\vec v}^2 = \\norm{\\vec u}^2 + \\norm{\\vec v}^2$, denn der gemischte Term $2\\,\\vec u\\cdot\\vec v$ verschwindet.

> [!BEISPIEL] Winkel berechnen
> $\\vec u = (1, 0, 1)$, $\\vec v = (0, 1, 1)$: $\\vec u \\cdot \\vec v = 1$, $\\norm{\\vec u} = \\norm{\\vec v} = \\sqrt 2$, also $\\cos\\varphi = \\tfrac12$ und $\\varphi = 60^\\circ = \\tfrac\\pi3$.

### Projektion

Die **orthogonale Projektion** von $\\vec u$ auf die Richtung von $\\vec v \\neq \\vec 0$ ist
$$
\\operatorname{proj}_{\\vec v}(\\vec u) = \\frac{\\vec u \\cdot \\vec v}{\\vec v \\cdot \\vec v}\\, \\vec v ,
$$
und $\\vec u - \\operatorname{proj}_{\\vec v}(\\vec u)$ steht senkrecht auf $\\vec v$. Diese Zerlegung ist der Kern des Gram-Schmidt-Verfahrens und der Methode der kleinsten Quadrate.

## Das Kreuzprodukt im R³

Nur im dreidimensionalen Raum gibt es zusätzlich ein Produkt, dessen Ergebnis wieder ein Vektor ist:
$$
\\vec u \\times \\vec v = \\begin{pmatrix} u_2 v_3 - u_3 v_2 \\\\ u_3 v_1 - u_1 v_3 \\\\ u_1 v_2 - u_2 v_1 \\end{pmatrix}.
$$

Eigenschaften:
- $\\vec u \\times \\vec v$ steht senkrecht auf $\\vec u$ und $\\vec v$ (Rechte-Hand-Regel für die Richtung).
- $\\norm{\\vec u \\times \\vec v} = \\norm{\\vec u}\\,\\norm{\\vec v} \\sin\\varphi$ ist der **Flächeninhalt** des aufgespannten Parallelogramms.
- $\\vec v \\times \\vec u = -(\\vec u \\times \\vec v)$ (antikommutativ) und $\\vec u \\times \\vec u = \\vec 0$.

> [!TIP] Normalenvektoren in der Grafik
> Für die Beleuchtung eines Dreiecks mit den Ecken $A, B, C$ braucht ein Renderer den **Normalenvektor** $\\vec n = (\\vec b - \\vec a) \\times (\\vec c - \\vec a)$. Die Reihenfolge der Ecken (im oder gegen den Uhrzeigersinn) legt fest, welche Seite „vorn“ ist – das nutzt das Backface Culling.

## Geraden und Ebenen

Eine **Gerade** durch den Punkt $\\vec p$ mit Richtung $\\vec r \\neq \\vec 0$ ist $g = \\set{\\vec p + t \\vec r \\mid t \\in \\R}$ (Parameterform). Eine **Ebene** im $\\R^3$ beschreibt man in Parameterform $\\vec p + s\\vec r_1 + t\\vec r_2$ oder in **Normalenform**
$$
\\vec n \\cdot (\\vec x - \\vec p) = 0 \\iff n_1 x_1 + n_2 x_2 + n_3 x_3 = d \\quad\\text{mit } d = \\vec n \\cdot \\vec p .
$$
Der Abstand eines Punktes $\\vec q$ zur Ebene ist $\\dfrac{\\abs{\\vec n \\cdot \\vec q - d}}{\\norm{\\vec n}}$.

## Zusammenfassung

- Vektoren im $\\R^n$ addiert und skaliert man komponentenweise; Linearkombinationen führen auf Gleichungssysteme.
- Das Skalarprodukt liefert Länge $\\norm{\\vec v} = \\sqrt{\\vec v\\cdot\\vec v}$, Winkel $\\cos\\varphi = \\tfrac{\\vec u\\cdot\\vec v}{\\norm{\\vec u}\\norm{\\vec v}}$ und Orthogonalität $\\vec u\\cdot\\vec v = 0$.
- Cauchy-Schwarz: $\\abs{\\vec u\\cdot\\vec v} \\le \\norm{\\vec u}\\norm{\\vec v}$.
- Das Kreuzprodukt (nur $\\R^3$) steht senkrecht auf beiden Faktoren; seine Länge ist die Parallelogrammfläche.
`;export{e as default};
