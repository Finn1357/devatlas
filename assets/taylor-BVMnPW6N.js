const e=`---
id: taylor
title: Taylor-Polynome und Potenzreihen
module: analysis-1
order: 6
difficulty: profi
minutes: 50
summary: Funktionen lokal durch Polynome annähern, Taylor-Polynom und Restglied nach Lagrange, Fehlerabschätzungen, Potenzreihen von exp, sin, cos und ln, Konvergenzradius und wie Taschenrechner und Mathebibliotheken Funktionen berechnen.
tags: [Taylor-Polynom, Restglied, Potenzreihe, Konvergenzradius, Approximation, Exponentialreihe]
requires: [differentialrechnung, reihen]
---

## Die Idee: Funktionen durch Polynome ersetzen

Polynome sind leicht zu berechnen – nur Additionen und Multiplikationen. Funktionen wie $\\e^x$, $\\sin x$ oder $\\ln x$ dagegen nicht. Die Tangente aus der [Differentialrechnung](#/mathe/analysis-1/differentialrechnung) ist die beste **lineare** Näherung einer Funktion an einer Stelle. [[Taylor-Reihe|Taylor-Polynome]] setzen diese Idee fort: Sie stimmen mit $f$ nicht nur im Wert und in der Steigung überein, sondern auch in der Krümmung und allen weiteren Ableitungen bis zu einer gewählten Ordnung.

> [!DEFINITION] Taylor-Polynom
> Ist $f$ in $x_0$ $n$-mal differenzierbar, so heißt
> $$
> T_n(x) = \\sum_{k=0}^{n} \\frac{f^{(k)}(x_0)}{k!}\\,(x - x_0)^k = f(x_0) + f'(x_0)(x - x_0) + \\frac{f''(x_0)}{2}(x - x_0)^2 + \\dots
> $$
> das **Taylor-Polynom** $n$-ten Grades von $f$ um den **Entwicklungspunkt** $x_0$.

Es ist das einzige Polynom vom Grad $\\le n$ mit $T_n^{(k)}(x_0) = f^{(k)}(x_0)$ für $k = 0, \\dots, n$: Die Fakultät im Nenner gleicht genau den Faktor aus, der beim $k$-maligen Ableiten von $(x - x_0)^k$ entsteht.

> [!BEISPIEL] Exponentialfunktion um 0
> Alle Ableitungen von $\\e^x$ sind $\\e^x$, an der Stelle $0$ also $1$:
> $$
> T_n(x) = 1 + x + \\frac{x^2}{2} + \\frac{x^3}{6} + \\dots + \\frac{x^n}{n!} .
> $$
> Für $x = 1$: $T_4(1) = 1 + 1 + 0{,}5 + 0{,}1\\overline 6 + 0{,}041\\overline 6 = 2{,}708\\overline 3$, verglichen mit $\\e \\approx 2{,}71828$.

\`\`\`widget
plot: sin(x); x; x - x^3/6; x - x^3/6 + x^5/120 | -6 6 -3 3
\`\`\`

Im Plot nähern die Taylor-Polynome vom Grad 1, 3 und 5 den Sinus um $0$ immer besser an – je höher der Grad, desto größer der Bereich, in dem kein Unterschied zu sehen ist.

## Wie groß ist der Fehler?

> [!SATZ] Satz von Taylor mit Lagrange-Restglied
> Ist $f$ auf einem Intervall um $x_0$ $(n+1)$-mal differenzierbar, so gibt es zu jedem $x$ ein $\\xi$ zwischen $x_0$ und $x$ mit
> $$
> f(x) = T_n(x) + R_n(x), \\qquad R_n(x) = \\frac{f^{(n+1)}(\\xi)}{(n+1)!}\\,(x - x_0)^{n+1} .
> $$

Für $n = 0$ ist das genau der [Mittelwertsatz](#/mathe/analysis-1/differentialrechnung). Das Restglied sieht aus wie der nächste Summand, nur mit der Ableitung an einer unbekannten Zwischenstelle $\\xi$. Kennt man eine Schranke $\\abs{f^{(n+1)}} \\le M$, folgt die **Fehlerabschätzung**
$$
\\abs{f(x) - T_n(x)} \\le \\frac{M}{(n+1)!}\\abs{x - x_0}^{n+1} .
$$

> [!BEISPIEL] Wie viele Summanden für e?
> Für $\\e = \\e^1$ mit $T_n(1)$: Auf $[0, 1]$ ist $\\abs{(\\e^x)^{(n+1)}} \\le \\e < 3$, also $\\abs{R_n(1)} \\le \\frac{3}{(n+1)!}$. Für einen Fehler unter $10^{-6}$ braucht man $(n+1)! > 3 \\cdot 10^6$, also $n + 1 = 10$ ($10! = 3\\,628\\,800$), $n = 9$. Fakultäten wachsen so schnell, dass die Reihe rasant konvergiert.

> [!BEISPIEL] Kleinwinkelnäherung
> Für kleine $x$ ist $\\sin x \\approx x$ – das Taylor-Polynom vom Grad 1 (und sogar 2, da der quadratische Term fehlt). Der Fehler ist höchstens $\\frac{\\abs x^3}{6}$: Für $x = 0{,}1$ (etwa $5{,}7°$) also unter $0{,}000167$, relativ etwa $0{,}17\\,\\%$. Die Physik benutzt das beim Fadenpendel, die Grafik bei kleinen Rotationen.

## Taylor-Reihen

Lässt man $n \\to \\infty$ gehen, erhält man eine [Reihe](#/mathe/analysis-1/reihen). Konvergiert das Restglied gegen $0$, stellt sie die Funktion dar.

> [!SATZ] Wichtige Potenzreihen
> $$
> \\begin{aligned}
> \\e^x &= \\sum_{k=0}^\\infty \\frac{x^k}{k!} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\dots && (x \\in \\R)\\\\
> \\sin x &= \\sum_{k=0}^\\infty \\frac{(-1)^k x^{2k+1}}{(2k+1)!} = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\dots && (x \\in \\R)\\\\
> \\cos x &= \\sum_{k=0}^\\infty \\frac{(-1)^k x^{2k}}{(2k)!} = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\dots && (x \\in \\R)\\\\
> \\ln(1 + x) &= \\sum_{k=1}^\\infty \\frac{(-1)^{k+1} x^k}{k} = x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\dots && (-1 < x \\le 1)\\\\
> \\frac{1}{1 - x} &= \\sum_{k=0}^\\infty x^k = 1 + x + x^2 + \\dots && (\\abs x < 1)
> \\end{aligned}
> $$

Setzt man $\\ii x$ in die Exponentialreihe ein und sortiert, erhält man genau die Reihen von $\\cos$ und $\\ii\\sin$ – die [Eulersche Formel](#/mathe/algebra/komplexe-zahlen) $\\e^{\\ii x} = \\cos x + \\ii\\sin x$.

### Konvergenzradius

Eine **Potenzreihe** $\\sum a_k (x - x_0)^k$ konvergiert in einem symmetrischen Bereich um $x_0$:

> [!SATZ] Konvergenzradius
> Zu jeder Potenzreihe gibt es ein $R \\in [0, \\infty]$, sodass sie für $\\abs{x - x_0} < R$ (absolut) konvergiert und für $\\abs{x - x_0} > R$ divergiert. Existiert der Grenzwert, so ist
> $$
> R = \\lim_{k \\to \\infty}\\left\\lvert\\frac{a_k}{a_{k+1}}\\right\\rvert .
> $$

Die Formel folgt aus dem [Quotientenkriterium](#/mathe/analysis-1/reihen). Für $\\e^x$ ist $R = \\lim (k + 1) = \\infty$, für $\\ln(1 + x)$ ist $R = \\lim\\frac{k+1}{k} = 1$. Am Rand ($\\abs{x - x_0} = R$) muss man einzeln prüfen: Die $\\ln$-Reihe konvergiert bei $x = 1$ (Leibniz, Wert $\\ln 2$), divergiert aber bei $x = -1$ (harmonische Reihe).

> [!WARNING] Konvergent heißt nicht gut
> Die Reihe für $\\ln(1 + x)$ konvergiert bei $x = 1$ extrem langsam (Fehler $\\approx \\frac1n$). Und eine glatte Funktion muss nicht durch ihre Taylor-Reihe dargestellt werden: Für $f(x) = \\e^{-1/x^2}$ (mit $f(0) = 0$) sind alle Ableitungen in $0$ gleich $0$ – die Taylor-Reihe ist die Nullfunktion, $f$ aber nicht.

## Wie Computer Funktionen berechnen

Eine Mathebibliothek berechnet $\\sin x$ nicht mit der ganzen Reihe, sondern in drei Schritten:
1. **Argumentreduktion:** $x$ mit Hilfe der Periodizität und Symmetrie auf ein kleines Intervall wie $\\left[-\\frac\\pi4, \\frac\\pi4\\right]$ abbilden. (Dafür braucht man $\\pi$ auf viele Stellen genau, sonst entsteht bei großen $x$ Auslöschung.)
2. **Polynomnäherung** auf dem kleinen Intervall. Ein Grad um 13 genügt für volle \`double\`-Genauigkeit. Man verwendet nicht das Taylor-Polynom selbst, sondern ein **Minimax-Polynom**, das den maximalen Fehler auf dem ganzen Intervall minimiert, statt nur in der Mitte exakt zu sein.
3. **Auswertung mit dem Horner-Schema** ([Polynome](#/mathe/algebra/polynome)).

\`\`\`python title="exp über Argumentreduktion und Taylor-Polynom"
import math

def mein_exp(x, n=12):
    # Argumentreduktion: e^x = (e^(x / 2^k))^(2^k), damit |x / 2^k| <= 0.5
    k = 0
    while abs(x) > 0.5:
        x /= 2
        k += 1
    # Taylor-Polynom vom Grad n mit Horner
    summe = 1.0
    for i in range(n, 0, -1):
        summe = 1 + x * summe / i
    for _ in range(k):
        summe *= summe
    return summe

for x in [0.5, 1.0, 5.0, -3.0]:
    print(x, mein_exp(x), math.exp(x), abs(mein_exp(x) / math.exp(x) - 1))
\`\`\`

Die verschachtelte Schleife wertet $1 + x\\left(1 + \\frac x2\\left(1 + \\frac x3(\\dots)\\right)\\right)$ aus – das Taylor-Polynom im Horner-Schema. Das wiederholte Quadrieren am Ende verstärkt kleine Fehler (Faktor $2^k$ relativ), deshalb arbeiten echte Bibliotheken mit einer anderen Reduktion ($\\e^x = 2^m \\e^r$).

## Taylor in der Numerik

Taylor-Entwicklungen sind das Werkzeug, mit dem man numerische Verfahren analysiert:
- Der zentrale Differenzenquotient $\\frac{f(x + h) - f(x - h)}{2h}$ hat Fehler $O(h^2)$, weil sich in den Taylor-Reihen von $f(x \\pm h)$ die geraden Terme aufheben.
- Das [Newton-Verfahren](#/mathe/numerik/nullstellen) konvergiert quadratisch – Beweis über das Taylor-Restglied zweiter Ordnung.
- Die Fehlerordnungen der [Quadraturregeln](#/mathe/numerik/numerische-integration) und des [Euler-Verfahrens](#/mathe/analysis-2/differentialgleichungen) folgen aus Taylor-Entwicklungen.

## Zusammenfassung

- $T_n(x) = \\sum_{k=0}^{n}\\frac{f^{(k)}(x_0)}{k!}(x - x_0)^k$ stimmt mit $f$ in den ersten $n$ Ableitungen überein.
- Restglied $R_n = \\frac{f^{(n+1)}(\\xi)}{(n+1)!}(x - x_0)^{n+1}$ – daraus Fehlerschranken.
- $\\e^x$, $\\sin$, $\\cos$ haben Konvergenzradius $\\infty$, $\\ln(1 + x)$ und $\\frac1{1-x}$ den Radius $1$.
- Bibliotheken: Argumentreduktion, Polynomnäherung, Horner-Auswertung.
`;export{e as default};
