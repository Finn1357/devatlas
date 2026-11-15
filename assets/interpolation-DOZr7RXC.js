const e=`---
id: interpolation
title: Polynominterpolation und Splines
module: numerik
order: 3
difficulty: fortgeschritten
minutes: 45
summary: Interpolationsaufgabe, Existenz und Eindeutigkeit des Interpolationspolynoms, Lagrange- und Newton-Form mit dividierten Differenzen, Fehlerabschätzung, das Runge-Phänomen, Tschebyschow-Knoten und kubische Splines.
tags: [Interpolation, Lagrange-Polynom, Newton-Form, Dividierte Differenzen, Runge-Phänomen, Spline]
requires: [polynome, gleitkomma]
---

## Die Aufgabe

Gegeben sind Messwerte oder teuer zu berechnende Funktionswerte an endlich vielen Stellen. Gesucht ist eine einfache Funktion – bei der [[Polynominterpolation]] ein Polynom –, die **durch alle Punkte geht** und dazwischen sinnvolle Werte liefert: Animationen zwischen Keyframes, Glätten von Kurven in Grafikprogrammen, Tabellenwerte von Sinus oder Logarithmus, Resampling von Audio und Bildern.

> [!DEFINITION] Interpolationsaufgabe
> Gegeben sind $n + 1$ paarweise verschiedene **Stützstellen** $x_0, \\dots, x_n$ und Werte $y_0, \\dots, y_n$. Gesucht ist ein Polynom $p$ vom Grad höchstens $n$ mit
> $$
> p(x_i) = y_i \\qquad\\text{für } i = 0, \\dots, n .
> $$

> [!SATZ] Existenz und Eindeutigkeit
> Die Interpolationsaufgabe hat **genau eine** Lösung.

> [!BEWEIS]
> **Eindeutigkeit:** Sind $p$ und $q$ Lösungen, so hat $p - q$ den Grad höchstens $n$ und die $n + 1$ Nullstellen $x_0, \\dots, x_n$. Ein Polynom vom Grad $\\le n$ mit mehr als $n$ Nullstellen ist das Nullpolynom ([Polynome](#/mathe/algebra/polynome)), also $p = q$.
>
> **Existenz:** Die Lagrange-Form unten gibt das Polynom explizit an.

Man könnte die Koeffizienten auch über ein lineares Gleichungssystem mit der **Vandermonde-Matrix** $V_{ij} = x_i^j$ bestimmen. Diese Matrix ist aber für viele Stützstellen extrem schlecht [konditioniert](#/mathe/numerik/gleitkomma); man nutzt deshalb die folgenden Darstellungen.

## Lagrange-Form

> [!DEFINITION] Lagrange-Basispolynome
> $$
> L_i(x) = \\prod_{\\substack{j = 0 \\\\ j \\neq i}}^{n} \\frac{x - x_j}{x_i - x_j}, \\qquad i = 0, \\dots, n .
> $$
> Es gilt $L_i(x_i) = 1$ und $L_i(x_j) = 0$ für $j \\neq i$.

Damit ist die Lösung sofort hinschreibbar:
$$
p(x) = \\sum_{i=0}^{n} y_i\\, L_i(x) .
$$

> [!BEISPIEL] Drei Punkte
> Durch $(0, 1)$, $(1, 3)$, $(2, 2)$:
> $$
> L_0 = \\frac{(x - 1)(x - 2)}{(0 - 1)(0 - 2)} = \\frac{(x-1)(x-2)}{2}, \\quad L_1 = \\frac{x(x - 2)}{1 \\cdot (-1)} = -x(x - 2), \\quad L_2 = \\frac{x(x - 1)}{2 \\cdot 1} .
> $$
> $$
> p(x) = 1 \\cdot \\frac{(x-1)(x-2)}{2} - 3x(x - 2) + 2\\cdot\\frac{x(x-1)}{2} = -\\frac32 x^2 + \\frac72 x + 1 .
> $$
> Probe: $p(1) = -\\frac32 + \\frac72 + 1 = 3$ ✓, $p(2) = -6 + 7 + 1 = 2$ ✓.

Die Lagrange-Form ist ideal für Beweise und wenn sich nur die $y$-Werte ändern. Kommt ein neuer Punkt hinzu, müssen aber alle Basispolynome neu berechnet werden.

> [!TIP] Secret Sharing
> Shamirs Geheimnisteilung (1979) versteckt ein Geheimnis $s$ als $p(0)$ eines zufälligen Polynoms vom Grad $k - 1$ über einem endlichen Körper und verteilt die Werte $p(1), p(2), \\dots$ an verschiedene Personen. Je $k$ Personen können $p$ – und damit $s$ – per Lagrange-Interpolation rekonstruieren; $k - 1$ Personen erfahren nichts. Dasselbe Prinzip steckt in Reed-Solomon-Codes ([Algebraische Strukturen](#/mathe/algebra/algebraische-strukturen)).

## Newton-Form und dividierte Differenzen

Die Newton-Form baut das Polynom schrittweise auf:
$$
p(x) = c_0 + c_1(x - x_0) + c_2(x - x_0)(x - x_1) + \\dots + c_n(x - x_0)\\cdots(x - x_{n-1}) .
$$
Ein neuer Punkt fügt nur einen Summanden hinzu. Die Koeffizienten sind die **dividierten Differenzen**:

> [!DEFINITION] Dividierte Differenzen
> $$
> [y_i] = y_i, \\qquad [y_i, \\dots, y_{i+k}] = \\frac{[y_{i+1}, \\dots, y_{i+k}] - [y_i, \\dots, y_{i+k-1}]}{x_{i+k} - x_i},
> $$
> und $c_k = [y_0, \\dots, y_k]$.

> [!BEISPIEL] Dieselben drei Punkte in Newton-Form
> | $x_i$ | $y_i$ | 1. Differenz | 2. Differenz |
> |---|---|---|---|
> | 0 | **1** | | |
> | | | $\\frac{3 - 1}{1 - 0} = $ **2** | |
> | 1 | 3 | | $\\frac{-1 - 2}{2 - 0} = $ **$-\\frac32$** |
> | | | $\\frac{2 - 3}{2 - 1} = -1$ | |
> | 2 | 2 | | |
>
> $p(x) = 1 + 2x - \\frac32\\,x(x - 1)$ – ausmultipliziert dasselbe Polynom wie oben, wie die Eindeutigkeit verlangt.

Ausgewertet wird die Newton-Form mit einem Horner-ähnlichen Schema in $O(n)$; die Tabelle der dividierten Differenzen kostet einmalig $O(n^2)$.

## Wie gut ist die Näherung?

Interpoliert man eine Funktion $f$, ist der Fehler zwischen den Stützstellen nicht null.

> [!SATZ] Interpolationsfehler
> Ist $f$ $(n + 1)$-mal stetig differenzierbar und $p$ das Interpolationspolynom an $x_0, \\dots, x_n$, so gibt es zu jedem $x$ ein $\\xi$ im kleinsten Intervall, das $x$ und alle Stützstellen enthält, mit
> $$
> f(x) - p(x) = \\frac{f^{(n+1)}(\\xi)}{(n + 1)!}\\,\\prod_{i=0}^{n} (x - x_i) .
> $$

Der Fehler hängt also von zwei Dingen ab: wie „wild“ $f$ ist (höhere Ableitungen) und wie das **Knotenpolynom** $\\prod (x - x_i)$ sich verhält – und das hängt nur von der Lage der Stützstellen ab.

### Das Runge-Phänomen

Mehr Stützstellen bedeuten nicht automatisch eine bessere Näherung. Carl Runge zeigte 1901: Interpoliert man $f(x) = \\frac{1}{1 + 25x^2}$ auf $[-1, 1]$ an **gleichabständigen** Stellen, schwingt das Polynom an den Rändern immer stärker – der maximale Fehler wächst gegen unendlich.

\`\`\`widget
plot: 1/(1 + 25x^2); 1 - 13.203035x^2 + 61.367206x^4 - 102.815011x^6 + 53.689301x^8 | -1.1 1.1 -1.2 1.4
\`\`\`

Die zweite Kurve ist das (exakt berechnete) Interpolationspolynom vom Grad 8 an den neun Stellen $-1, -0{,}75, \\dots, 1$: In der Mitte passt es gut, zwischen den äußeren Stützstellen schwingt es weit aus – bei $x = 0{,}9$ liefert es etwa $-0{,}96$ statt $0{,}047$; der maximale Fehler liegt bei rund $1{,}05$. Mit 17 gleichabständigen Stellen wird es noch schlimmer.

**Abhilfe 1 – Tschebyschow-Knoten:** Wählt man die Stützstellen am Rand dichter, nämlich $x_i = \\cos\\frac{(2i + 1)\\pi}{2n + 2}$, wird das Knotenpolynom gleichmäßig klein, und die Interpolation konvergiert für glatte Funktionen.

**Abhilfe 2 – stückweise interpolieren:** Statt eines Polynoms hohen Grades viele Polynome niedrigen Grades verwenden.

## Splines

> [!DEFINITION] Kubischer Spline
> Ein **kubischer Spline** zu den Stützstellen $x_0 < x_1 < \\dots < x_n$ ist eine Funktion $s$, die
> 1. auf jedem Teilintervall $[x_{i-1}, x_i]$ ein Polynom vom Grad höchstens 3 ist,
> 2. die Daten interpoliert: $s(x_i) = y_i$,
> 3. auf ganz $[x_0, x_n]$ **zweimal stetig differenzierbar** ist.
>
> Mit zwei Randbedingungen, etwa $s''(x_0) = s''(x_n) = 0$ („natürlicher“ Spline), ist $s$ eindeutig bestimmt.

Die Glattheitsbedingungen führen auf ein lineares Gleichungssystem mit **Tridiagonalmatrix**, das sich in $O(n)$ lösen lässt. Der natürliche Spline hat eine schöne Optimalitätseigenschaft: Unter allen zweimal differenzierbaren interpolierenden Funktionen minimiert er $\\int (s'')^2\\dd x$, also näherungsweise die Biegeenergie – daher der Name nach den biegsamen Holzlatten (engl. *spline*) der Schiffbauer.

> [!TIP] Kurven in Grafik und Animation
> Vektorgrafiken, Schriften (TrueType, OpenType), CSS-Animationen (\`cubic-bezier\`) und Pfade in Spielen verwenden stückweise kubische Kurven. **Bézier-Kurven** interpolieren dabei nur die Endpunkte und werden von Kontrollpunkten „angezogen“; **Catmull-Rom-Splines** gehen durch alle Punkte und eignen sich für Kamerafahrten zwischen Keyframes.

## Zusammenfassung

- Durch $n + 1$ Punkte mit verschiedenen $x_i$ geht genau ein Polynom vom Grad $\\le n$.
- Lagrange-Form $p = \\sum y_i L_i$ für Theorie; Newton-Form mit dividierten Differenzen zum Rechnen und Erweitern.
- Fehler $\\frac{f^{(n+1)}(\\xi)}{(n+1)!}\\prod(x - x_i)$; gleichabständige Knoten führen bei hohem Grad zum Runge-Phänomen.
- Abhilfe: Tschebyschow-Knoten oder kubische Splines (stückweise, zweimal stetig differenzierbar).
`;export{e as default};
