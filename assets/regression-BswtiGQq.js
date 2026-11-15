const e=`---
id: regression
title: Lineare Regression und kleinste Quadrate
module: optimierung
order: 4
difficulty: fortgeschritten
minutes: 50
summary: Ausgleichsrechnung nach Gauß, die Regressionsgerade mit geschlossener Formel, das Modell in Matrixform, Normalengleichungen als Projektion, Bestimmtheitsmaß, Überanpassung und Regularisierung sowie Lösen per Gradientenabstieg.
tags: [Lineare Regression, Kleinste Quadrate, Normalengleichungen, Projektion, Bestimmtheitsmaß, Ridge, Überanpassung]
requires: [konvexitaet, vektorraeume, zufallsvariablen]
---

## Das Problem: Daten mit Rauschen

Messdaten passen nie exakt auf ein Modell. Gesucht ist trotzdem der Zusammenhang dahinter: Wie hängt die Antwortzeit eines Servers von der Last ab? Wie der Preis einer Wohnung von Fläche und Lage? Die **[[Lineare Regression|lineare Regression]]** passt ein lineares Modell so an, dass die Abweichungen insgesamt möglichst klein sind – das einfachste und am häufigsten eingesetzte Verfahren des maschinellen Lernens.

> [!DEFINITION] Methode der kleinsten Quadrate
> Gegeben sind Datenpunkte $(x_i, y_i)$, $i = 1, \\dots, m$. Gesucht ist die Gerade $\\hat y = a + bx$, die die **Summe der quadrierten Residuen**
> $$
> S(a, b) = \\sum_{i=1}^{m} \\big(y_i - (a + bx_i)\\big)^2
> $$
> minimiert. Das **Residuum** $r_i = y_i - \\hat y_i$ ist der senkrechte Abstand des Punktes von der Geraden.

Warum Quadrate? Sie bestrafen große Abweichungen stärker, machen $S$ differenzierbar und [konvex](#/mathe/optimierung/konvexitaet) – und sind statistisch optimal, wenn die Messfehler unabhängig und normalverteilt sind (Gauß, 1809). Carl Friedrich Gauß sagte damit 1801 die Bahn des verlorenen Zwergplaneten Ceres voraus.

## Die Regressionsgerade

> [!SATZ] Regressionsgerade
> Mit den Mittelwerten $\\bar x = \\frac1m\\sum x_i$ und $\\bar y = \\frac1m\\sum y_i$ ist die eindeutige Lösung (falls nicht alle $x_i$ gleich sind)
> $$
> b = \\frac{\\sum_{i}(x_i - \\bar x)(y_i - \\bar y)}{\\sum_i (x_i - \\bar x)^2}, \\qquad a = \\bar y - b\\,\\bar x .
> $$

> [!BEWEIS]
> $S$ ist ein konvexes quadratisches Polynom in $(a, b)$, das Minimum liegt also dort, wo der Gradient verschwindet. $\\frac{\\partial S}{\\partial a} = -2\\sum (y_i - a - bx_i) = 0$ liefert $\\bar y = a + b\\bar x$ – die Gerade geht durch den **Schwerpunkt** $(\\bar x, \\bar y)$. Einsetzen von $a = \\bar y - b\\bar x$ in $\\frac{\\partial S}{\\partial b} = -2\\sum x_i(y_i - a - bx_i) = 0$ ergibt $\\sum x_i\\big((y_i - \\bar y) - b(x_i - \\bar x)\\big) = 0$. Wegen $\\sum \\bar x(y_i - \\bar y) = 0$ und $\\sum\\bar x(x_i - \\bar x) = 0$ darf man $x_i$ durch $x_i - \\bar x$ ersetzen und erhält die Formel für $b$.

Statistisch ist $b = \\frac{\\Cov(X, Y)}{\\Var(X)}$ – Kovarianz durch Varianz ([Zufallsvariablen](#/mathe/stochastik/zufallsvariablen)).

> [!BEISPIEL] Vier Messpunkte
> $(1, 2)$, $(2, 3)$, $(3, 5)$, $(4, 6)$. Mittelwerte $\\bar x = 2{,}5$, $\\bar y = 4$.
>
> | $x_i - \\bar x$ | $y_i - \\bar y$ | Produkt | $(x_i - \\bar x)^2$ |
> |---|---|---|---|
> | $-1{,}5$ | $-2$ | $3$ | $2{,}25$ |
> | $-0{,}5$ | $-1$ | $0{,}5$ | $0{,}25$ |
> | $0{,}5$ | $1$ | $0{,}5$ | $0{,}25$ |
> | $1{,}5$ | $2$ | $3$ | $2{,}25$ |
> | | **Summe** | $7$ | $5$ |
>
> $b = \\frac75 = 1{,}4$, $a = 4 - 1{,}4 \\cdot 2{,}5 = 0{,}5$. Regressionsgerade $\\hat y = 0{,}5 + 1{,}4x$; Prognose für $x = 6$: $8{,}9$.

\`\`\`widget
plot: 0.5 + 1.4x | -0.5 6.5 -0.5 10
\`\`\`

## Matrixform und Normalengleichungen

Mit mehreren Merkmalen (Fläche, Zimmer, Baujahr …) schreibt man das Modell als $\\hat{\\vec y} = X\\vec w$. Jede Zeile der **Designmatrix** $X \\in \\R^{m \\times n}$ enthält die Merkmale eines Datenpunkts, eine Spalte aus Einsen liefert den Achsenabschnitt. Gesucht ist
$$
\\min_{\\vec w} \\norm{X\\vec w - \\vec y}^2 .
$$

> [!SATZ] Normalengleichungen
> $\\vec w$ minimiert $\\norm{X\\vec w - \\vec y}^2$ genau dann, wenn
> $$
> X^T X\\, \\vec w = X^T \\vec y .
> $$
> Haben die Spalten von $X$ vollen Rang, ist $X^TX$ invertierbar und die Lösung eindeutig: $\\vec w = (X^TX)^{-1}X^T\\vec y$.

> [!BEWEIS] Geometrisch
> $X\\vec w$ durchläuft den Spaltenraum von $X$, einen Unterraum des $\\R^m$ ([Vektorräume](#/mathe/lineare-algebra/vektorraeume)). Der Punkt dieses Unterraums mit kleinstem Abstand zu $\\vec y$ ist die **orthogonale Projektion** von $\\vec y$ – dort steht das Residuum $\\vec y - X\\vec w$ senkrecht auf allen Spalten von $X$:
> $$
> X^T(\\vec y - X\\vec w) = \\vec 0 \\iff X^TX\\vec w = X^T\\vec y .
> $$
> Analytisch: Der Gradient von $\\norm{X\\vec w - \\vec y}^2$ ist $2X^T(X\\vec w - \\vec y)$; sein Nullsetzen liefert dieselbe Gleichung, und die Hesse-Matrix $2X^TX$ ist positiv semidefinit, das Problem also konvex.

Für die Gerade ist $X = \\begin{pmatrix} 1 & x_1 \\\\ \\vdots & \\vdots \\\\ 1 & x_m\\end{pmatrix}$, und die Normalengleichungen ergeben genau die Formeln oben.

> [!WARNING] Nicht so rechnen
> $(X^TX)^{-1}$ explizit zu bilden ist numerisch ungünstig: Die [Kondition](#/mathe/numerik/gleitkomma) von $X^TX$ ist das **Quadrat** der Kondition von $X$. Bibliotheken lösen das Problem stabiler über eine QR-Zerlegung oder die Singulärwertzerlegung von $X$ (\`numpy.linalg.lstsq\`) oder – bei positiv definitem $X^TX$ – per [Cholesky](#/mathe/numerik/lr-zerlegung).

## Wie gut ist das Modell?

> [!DEFINITION] Bestimmtheitsmaß
> $$
> R^2 = 1 - \\frac{\\sum_i (y_i - \\hat y_i)^2}{\\sum_i (y_i - \\bar y)^2} .
> $$
> $R^2 = 1$: alle Punkte liegen auf der Geraden; $R^2 = 0$: das Modell erklärt nicht mehr als der Mittelwert.

Im Beispiel sind die Vorhersagen $1{,}9;\\ 3{,}3;\\ 4{,}7;\\ 6{,}1$, die Residuen $0{,}1;\\ -0{,}3;\\ 0{,}3;\\ -0{,}1$, ihre Quadratsumme $0{,}2$; die Gesamtstreuung ist $\\sum(y_i - \\bar y)^2 = 10$. Also $R^2 = 1 - \\frac{0{,}2}{10} = 0{,}98$.

> [!MISTAKE] Korrelation ist keine Kausalität
> Ein hohes $R^2$ zeigt einen **Zusammenhang**, nicht seine Ursache. Eisverkauf und Sonnenbrände korrelieren stark – beide hängen vom Wetter ab. Außerdem misst die Regression nur **lineare** Zusammenhänge, und außerhalb des Datenbereichs (Extrapolation) kann ein Modell beliebig falsch sein.

## Überanpassung und Regularisierung

„Linear“ bezieht sich auf die **Parameter**, nicht auf die Merkmale: Mit Spalten $1, x, x^2, \\dots, x^d$ passt man Polynome an. Je mehr Parameter, desto kleiner der Fehler auf den Trainingsdaten – bei $d + 1 = m$ geht das Polynom durch alle Punkte ([Interpolation](#/mathe/numerik/interpolation)). Auf neuen Daten wird es dann aber schlecht: **Überanpassung** ([[Overfitting]]). Man bewertet Modelle deshalb auf zurückgehaltenen Testdaten.

**Ridge-Regression** bestraft große Gewichte:
$$
\\min_{\\vec w}\\; \\norm{X\\vec w - \\vec y}^2 + \\alpha\\norm{\\vec w}^2 \\quad\\Longrightarrow\\quad (X^TX + \\alpha I)\\,\\vec w = X^T\\vec y .
$$
Für $\\alpha > 0$ ist $X^TX + \\alpha I$ immer positiv definit und damit invertierbar – die Lösung existiert auch bei mehr Merkmalen als Datenpunkten und ist robuster gegen Rauschen. **Lasso** ($\\alpha\\sum\\abs{w_j}$) setzt zusätzlich viele Gewichte exakt auf null und wählt so Merkmale aus.

## Regression per Gradientenabstieg

Für sehr große Datensätze löst man das Problem iterativ mit [Gradientenabstieg](#/mathe/optimierung/gradientenverfahren) auf dem mittleren quadratischen Fehler:
$$
\\vec w \\leftarrow \\vec w - \\eta\\,\\frac{2}{m} X^T(X\\vec w - \\vec y) .
$$
Weil das Problem konvex ist, konvergiert das Verfahren bei passender Lernrate gegen dieselbe Lösung wie die Normalengleichungen. Ein lineares Modell mit dieser Verlustfunktion ist nichts anderes als ein **neuronales Netz ohne verdeckte Schicht** – fügt man Schichten mit nichtlinearen Aktivierungen hinzu, erhält man Deep Learning, verliert aber die Konvexität.

## Zusammenfassung

- Kleinste Quadrate minimieren $\\sum r_i^2$; die Regressionsgerade geht durch $(\\bar x, \\bar y)$ mit Steigung $b = \\frac{\\sum(x_i - \\bar x)(y_i - \\bar y)}{\\sum(x_i - \\bar x)^2}$.
- Allgemein: Normalengleichungen $X^TX\\vec w = X^T\\vec y$ – die orthogonale Projektion von $\\vec y$ auf den Spaltenraum.
- $R^2$ misst den erklärten Anteil der Streuung; Korrelation ist keine Kausalität.
- Gegen Überanpassung: Testdaten und Regularisierung (Ridge, Lasso); große Daten: Gradientenabstieg.
`;export{e as default};
