const e=`---
id: mehrere-variablen
title: Funktionen mehrerer Variablen
module: analysis-2
order: 3
difficulty: profi
minutes: 50
summary: Funktionen von R^n nach R, Höhenlinien, partielle Ableitungen, Gradient und totale Differenzierbarkeit, Jacobi-Matrix und mehrdimensionale Kettenregel, Hesse-Matrix und die Klassifikation lokaler Extrema.
tags: [Partielle Ableitung, Gradient, Jacobi-Matrix, Hesse-Matrix, Kettenregel, Extrema, Sattelpunkt]
requires: [differentialrechnung, kurvendiskussion, eigenwerte]
---

## Funktionen mit mehreren Eingaben

Die meisten Größen hängen von mehr als einer Variablen ab: die Temperatur vom Ort $(x, y, z)$ und der Zeit, der Verlust eines Machine-Learning-Modells von Millionen Gewichten, der Gewinn von Preis und Werbebudget. Wir betrachten Funktionen $f\\colon D \\to \\R$ mit $D \\subseteq \\R^n$.

Für $n = 2$ ist der Graph eine **Fläche** im Raum. Anschaulicher sind oft die **Höhenlinien** $\\set{(x, y) \\mid f(x, y) = c}$ – wie auf einer Wanderkarte. Für $f(x, y) = x^2 + y^2$ sind es Kreise um den Ursprung, für $f(x, y) = x^2 - y^2$ Hyperbeln.

## Partielle Ableitungen

> [!DEFINITION] Partielle Ableitung
> Die **partielle Ableitung** von $f$ nach $x_i$ im Punkt $\\vec x$ ist
> $$
> \\frac{\\partial f}{\\partial x_i}(\\vec x) = \\lim_{h \\to 0} \\frac{f(\\vec x + h\\vec e_i) - f(\\vec x)}{h},
> $$
> also die gewöhnliche Ableitung nach $x_i$, wenn alle anderen Variablen festgehalten werden. Kurzschreibweisen: $f_{x_i}$, $\\partial_i f$.

> [!BEISPIEL] Rechnen wie gewohnt
> $f(x, y) = x^3 y^2 + \\sin(xy)$:
> $$
> \\frac{\\partial f}{\\partial x} = 3x^2 y^2 + y\\cos(xy), \\qquad \\frac{\\partial f}{\\partial y} = 2x^3 y + x\\cos(xy) .
> $$

Die partiellen Ableitungen bilden den **[[Gradient|Gradienten]]**
$$
\\nabla f(\\vec x) = \\left(\\frac{\\partial f}{\\partial x_1}(\\vec x), \\dots, \\frac{\\partial f}{\\partial x_n}(\\vec x)\\right)^T .
$$
Er zeigt in die Richtung des steilsten Anstiegs und steht senkrecht auf den Höhenlinien; die Richtungsableitung in Richtung eines Einheitsvektors $\\vec u$ ist $\\nabla f \\cdot \\vec u$. Diese Eigenschaften und ihre Anwendung im Gradientenabstieg behandelt die Lektion [Gradientenverfahren](#/mathe/optimierung/gradientenverfahren).

### Totale Differenzierbarkeit

Partielle Ableitungen sehen nur in Achsenrichtungen. Die eigentlich nützliche Eigenschaft ist die lineare Näherung in **alle** Richtungen:

> [!DEFINITION] Total differenzierbar
> $f$ heißt in $\\vec x_0$ **(total) differenzierbar**, wenn
> $$
> f(\\vec x_0 + \\vec h) = f(\\vec x_0) + \\nabla f(\\vec x_0) \\cdot \\vec h + r(\\vec h) \\quad\\text{mit}\\quad \\frac{r(\\vec h)}{\\norm{\\vec h}} \\xrightarrow{\\vec h \\to \\vec 0} 0 .
> $$
> Geometrisch: Der Graph hat in $\\vec x_0$ eine **Tangentialebene**.

> [!SATZ] Hinreichendes Kriterium
> Existieren alle partiellen Ableitungen in einer Umgebung von $\\vec x_0$ und sind sie dort **stetig**, so ist $f$ in $\\vec x_0$ total differenzierbar.

> [!WARNING] Partiell differenzierbar reicht nicht
> $f(x, y) = \\frac{xy}{x^2 + y^2}$ (mit $f(0, 0) = 0$) hat im Ursprung beide partiellen Ableitungen ($f$ ist auf den Achsen konstant $0$), ist dort aber nicht einmal stetig: Auf der Diagonale $x = y$ ist $f = \\frac12$. Für die Funktionen dieses Kurses – zusammengesetzt aus Polynomen, $\\e^x$, $\\sin$, … – ist das Kriterium aber erfüllt.

## Vektorwertige Funktionen und die Jacobi-Matrix

Für $\\vec f\\colon \\R^n \\to \\R^m$ mit Komponenten $f_1, \\dots, f_m$ sammelt man alle partiellen Ableitungen in einer Matrix.

> [!DEFINITION] Jacobi-Matrix
> $$
> J_{\\vec f}(\\vec x) = \\begin{pmatrix} \\frac{\\partial f_1}{\\partial x_1} & \\cdots & \\frac{\\partial f_1}{\\partial x_n} \\\\ \\vdots & & \\vdots \\\\ \\frac{\\partial f_m}{\\partial x_1} & \\cdots & \\frac{\\partial f_m}{\\partial x_n} \\end{pmatrix} \\in \\R^{m \\times n} .
> $$
> Zeile $i$ ist der (transponierte) Gradient der Komponente $f_i$.

Sie ist die beste lineare Näherung: $\\vec f(\\vec x_0 + \\vec h) \\approx \\vec f(\\vec x_0) + J_{\\vec f}(\\vec x_0)\\,\\vec h$ – eine [Matrix](#/mathe/lineare-algebra/matrizen) ersetzt die Zahl $f'(x_0)$.

> [!BEISPIEL] Polarkoordinaten
> $\\vec f(r, \\varphi) = (r\\cos\\varphi,\\; r\\sin\\varphi)$:
> $$
> J = \\begin{pmatrix} \\cos\\varphi & -r\\sin\\varphi \\\\ \\sin\\varphi & r\\cos\\varphi \\end{pmatrix}, \\qquad \\det J = r\\cos^2\\varphi + r\\sin^2\\varphi = r .
> $$
> Die [Determinante](#/mathe/lineare-algebra/determinanten) $r$ ist der lokale Flächen-Streckfaktor – daher das $r$ in $\\mathrm dx\\,\\mathrm dy = r\\,\\mathrm dr\\,\\mathrm d\\varphi$. Wie man damit über Kreise und Kugeln integriert, zeigt die Lektion [Mehrfachintegrale](#/mathe/analysis-2/mehrfachintegrale).

### Die mehrdimensionale Kettenregel

> [!SATZ] Kettenregel
> Sind $\\vec g\\colon \\R^n \\to \\R^m$ und $\\vec f\\colon \\R^m \\to \\R^k$ differenzierbar, so gilt
> $$
> J_{\\vec f \\circ \\vec g}(\\vec x) = J_{\\vec f}\\big(\\vec g(\\vec x)\\big) \\cdot J_{\\vec g}(\\vec x) .
> $$
> Die Ableitung einer Verkettung ist das **Matrixprodukt** der Ableitungen.

Ein häufiger Spezialfall: Ist $\\vec x(t)$ eine Kurve und $f$ eine skalare Funktion, so ist
$$
\\frac{\\mathrm d}{\\mathrm dt} f\\big(\\vec x(t)\\big) = \\nabla f\\big(\\vec x(t)\\big) \\cdot \\dot{\\vec x}(t) = \\sum_{i=1}^n \\frac{\\partial f}{\\partial x_i}\\,\\frac{\\mathrm dx_i}{\\mathrm dt} .
$$

> [!BEISPIEL] Entlang einer Kurve
> $f(x, y) = x^2 y$ entlang $\\vec x(t) = (\\cos t, \\sin t)$: $\\nabla f = (2xy, x^2)$, $\\dot{\\vec x} = (-\\sin t, \\cos t)$. Also
> $$
> \\frac{\\mathrm d}{\\mathrm dt} f = 2\\cos t\\sin t \\cdot(-\\sin t) + \\cos^2 t \\cdot \\cos t = \\cos^3 t - 2\\cos t\\sin^2 t .
> $$

Backpropagation in neuronalen Netzen ist genau diese Regel: Jede Schicht ist eine Abbildung $\\R^{n_\\ell} \\to \\R^{n_{\\ell+1}}$, und der Gradient des Verlusts entsteht als Produkt der Jacobi-Matrizen – von hinten nach vorn ausgewertet, weil dann jedes Zwischenergebnis nur ein Vektor ist.

## Die Hesse-Matrix

> [!DEFINITION] Hesse-Matrix
> Die Matrix der zweiten partiellen Ableitungen
> $$
> H_f(\\vec x) = \\nabla^2 f(\\vec x) = \\left(\\frac{\\partial^2 f}{\\partial x_i \\partial x_j}(\\vec x)\\right)_{i,j}
> $$
> heißt **Hesse-Matrix**.

> [!SATZ] Satz von Schwarz
> Sind die zweiten partiellen Ableitungen stetig, so ist die Reihenfolge der Ableitungen egal: $\\frac{\\partial^2 f}{\\partial x_i\\partial x_j} = \\frac{\\partial^2 f}{\\partial x_j \\partial x_i}$. Die Hesse-Matrix ist dann **symmetrisch**.

Damit erhält man die Taylor-Näherung zweiter Ordnung
$$
f(\\vec x_0 + \\vec h) \\approx f(\\vec x_0) + \\nabla f(\\vec x_0)\\cdot\\vec h + \\tfrac12\\, \\vec h^T H_f(\\vec x_0)\\,\\vec h,
$$
das mehrdimensionale Gegenstück zu $f(x_0) + f'(x_0)h + \\frac12 f''(x_0)h^2$.

## Lokale Extrema

> [!SATZ] Notwendige Bedingung
> Hat $f$ in einem inneren Punkt $\\vec x_0$ ein lokales Extremum und ist dort differenzierbar, so gilt $\\nabla f(\\vec x_0) = \\vec 0$.

Punkte mit $\\nabla f = \\vec 0$ heißen **kritisch** oder stationär. Ob ein Minimum, Maximum oder **Sattelpunkt** vorliegt, entscheidet die Hesse-Matrix – über die Vorzeichen ihrer [Eigenwerte](#/mathe/lineare-algebra/eigenwerte):

> [!SATZ] Hinreichende Bedingung
> Sei $\\nabla f(\\vec x_0) = \\vec 0$ und $H = H_f(\\vec x_0)$.
> - Alle Eigenwerte von $H$ positiv ($H$ **positiv definit**): lokales **Minimum**.
> - Alle Eigenwerte negativ (negativ definit): lokales **Maximum**.
> - Positive und negative Eigenwerte (indefinit): **Sattelpunkt**.
> - Ein Eigenwert ist $0$ und die übrigen haben gleiches Vorzeichen: keine Aussage möglich.

Für $n = 2$ gibt es eine bequeme Form: Mit $\\det H = f_{xx} f_{yy} - f_{xy}^2$ gilt

| Bedingung | Ergebnis |
|---|---|
| $\\det H > 0$, $f_{xx} > 0$ | lokales Minimum |
| $\\det H > 0$, $f_{xx} < 0$ | lokales Maximum |
| $\\det H < 0$ | Sattelpunkt |
| $\\det H = 0$ | keine Aussage |

Grund: $\\det H$ ist das Produkt der beiden Eigenwerte. Ist es negativ, haben sie verschiedene Vorzeichen; ist es positiv, haben sie dasselbe Vorzeichen wie $f_{xx}$.

> [!BEISPIEL] Kritische Punkte klassifizieren
> $f(x, y) = x^3 - 3x + y^2$.
>
> **Kritische Punkte:** $f_x = 3x^2 - 3 = 0 \\Rightarrow x = \\pm 1$, $f_y = 2y = 0 \\Rightarrow y = 0$. Also $(1, 0)$ und $(-1, 0)$.
>
> **Hesse-Matrix:** $H = \\begin{pmatrix} 6x & 0 \\\\ 0 & 2 \\end{pmatrix}$.
> - In $(1, 0)$: $H = \\operatorname{diag}(6, 2)$, positiv definit – **lokales Minimum** mit $f(1, 0) = -2$.
> - In $(-1, 0)$: $H = \\operatorname{diag}(-6, 2)$, indefinit – **Sattelpunkt**.
>
> Ein globales Minimum gibt es nicht: $f(x, 0) = x^3 - 3x \\to -\\infty$ für $x \\to -\\infty$.

> [!TIP] Sattelpunkte im Deep Learning
> In hochdimensionalen Verlustlandschaften sind die meisten kritischen Punkte Sattelpunkte, nicht lokale Minima: Dass **alle** von Millionen Eigenwerten positiv sind, ist sehr unwahrscheinlich. Gradientenverfahren mit Rauschen (SGD) verlassen Sattelpunkte meist von selbst.

Extrema **unter Nebenbedingungen** – etwa auf einem Kreis oder bei festem Budget – findet man mit der Methode der Lagrange-Multiplikatoren (siehe [Optimierung mit Nebenbedingungen](#/mathe/optimierung/lagrange)).

## Zusammenfassung

- Partielle Ableitungen halten alle anderen Variablen fest; der Gradient sammelt sie und zeigt bergauf.
- Totale Differenzierbarkeit = lineare Näherung in alle Richtungen; stetige partielle Ableitungen genügen.
- Jacobi-Matrix für $\\R^n \\to \\R^m$; Kettenregel = Produkt der Jacobi-Matrizen (Backpropagation).
- Kritische Punkte: $\\nabla f = \\vec 0$; Hesse-Matrix positiv definit ⇒ Minimum, negativ definit ⇒ Maximum, indefinit ⇒ Sattelpunkt.
`;export{e as default};
