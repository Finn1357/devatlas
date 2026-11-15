const e=`---
id: zufallsvariablen
title: Zufallsvariablen, Erwartungswert und Varianz
module: stochastik
order: 2
difficulty: fortgeschritten
minutes: 45
summary: Diskrete Zufallsvariablen und ihre Verteilung, Erwartungswert und seine Linearität, Varianz und Standardabweichung, Unabhängigkeit, Kovarianz und die Ungleichung von Tschebyschow.
tags: [Zufallsvariable, Erwartungswert, Varianz, Standardabweichung, Kovarianz, Tschebyschow]
requires: [wahrscheinlichkeitsraeume]
---

## Zahlen aus dem Zufall

Meist interessiert nicht das Ergebnis eines Experiments selbst, sondern eine **Zahl**, die davon abhängt: die Augensumme zweier Würfel, die Anzahl defekter Teile in einer Lieferung, die Laufzeit eines randomisierten Algorithmus, der Gewinn bei einem Spiel.

> [!DEFINITION] Zufallsvariable
> Eine **Zufallsvariable** ist eine Abbildung $X\\colon \\Omega \\to \\R$. Sie heißt **diskret**, wenn sie nur endlich oder abzählbar viele Werte $x_1, x_2, \\dots$ annimmt. Ihre **Verteilung** ist durch die Wahrscheinlichkeiten
> $$
> p_i = P(X = x_i) = P\\big(\\set{\\omega \\in \\Omega \\mid X(\\omega) = x_i}\\big)
> $$
> gegeben, mit $p_i \\ge 0$ und $\\sum_i p_i = 1$. Die Funktion $F_X(x) = P(X \\le x)$ heißt **Verteilungsfunktion**.

> [!BEISPIEL] Augensumme
> $X$ = Augensumme zweier fairer Würfel nimmt die Werte $2, \\dots, 12$ an mit
> $$
> P(X = k) = \\frac{6 - \\abs{k - 7}}{36}, \\qquad k = 2, \\dots, 12 .
> $$
> Also $P(X = 7) = \\frac{6}{36}$, $P(X = 2) = P(X = 12) = \\frac1{36}$.

## Erwartungswert

> [!DEFINITION] Erwartungswert
> Der **[[Erwartungswert]]** einer diskreten Zufallsvariable ist
> $$
> \\E[X] = \\sum_i x_i \\, P(X = x_i),
> $$
> sofern die Reihe absolut konvergiert.

Der Erwartungswert ist der **Schwerpunkt** der Verteilung und der Wert, um den sich der Durchschnitt vieler unabhängiger Wiederholungen stabilisiert (Gesetz der großen Zahlen). Beim fairen Würfel ist $\\E[X] = \\frac{1 + 2 + \\dots + 6}{6} = 3{,}5$ – ein Wert, der nie gewürfelt wird.

> [!BEISPIEL] Lohnt sich das Spiel?
> Einsatz 2 €. Man würfelt; bei einer Sechs bekommt man 10 € ausgezahlt, sonst nichts. Der Gewinn $G$ ist $8$ € mit Wahrscheinlichkeit $\\frac16$ und $-2$ € mit $\\frac56$:
> $$
> \\E[G] = 8 \\cdot \\tfrac16 - 2 \\cdot \\tfrac56 = \\tfrac{8 - 10}{6} = -\\tfrac13 .
> $$
> Pro Spiel verliert man im Mittel etwa 33 Cent.

> [!SATZ] Linearität des Erwartungswerts
> Für Zufallsvariablen $X, Y$ und Zahlen $a, b$ gilt
> $$
> \\E[aX + bY] = a\\,\\E[X] + b\\,\\E[Y] .
> $$
> Das gilt **immer** – auch wenn $X$ und $Y$ abhängig sind.

> [!BEWEIS]
> Für endliches $\\Omega$ ist $\\E[X] = \\sum_{\\omega} X(\\omega)\\,P(\\set\\omega)$ (gruppiere nach Werten). Dann
> $$
> \\E[aX + bY] = \\sum_\\omega \\big(aX(\\omega) + bY(\\omega)\\big) P(\\set\\omega) = a\\sum_\\omega X(\\omega)P(\\set\\omega) + b \\sum_\\omega Y(\\omega) P(\\set\\omega).
> $$

Die Linearität ist das mächtigste Werkzeug zum Berechnen von Erwartungswerten: Man zerlegt eine komplizierte Größe in eine Summe einfacher **Indikatorvariablen** $\\mathbf 1_A$ (Wert 1, wenn $A$ eintritt, sonst 0) mit $\\E[\\mathbf 1_A] = P(A)$.

> [!BEISPIEL] Fixpunkte einer Zufallspermutation
> $n$ Personen ziehen zufällig ihre eigenen Hüte. Wie viele bekommen im Mittel ihren eigenen? Mit $X_i = 1$, falls Person $i$ den eigenen Hut zieht: $\\E[X_i] = \\frac1n$. Also
> $$
> \\E[X_1 + \\dots + X_n] = n \\cdot \\frac1n = 1 .
> $$
> Erstaunlich: Unabhängig von $n$ bekommt im Mittel genau eine Person den eigenen Hut – obwohl die $X_i$ voneinander abhängen.

> [!TIP] Erwartete Laufzeit von Quicksort
> Die mittlere Anzahl Vergleiche von Quicksort mit zufälligem Pivot berechnet man genau so: Für jedes Paar $i < j$ der sortierten Elemente ist der Indikator „$i$ und $j$ werden verglichen“ mit Wahrscheinlichkeit $\\frac{2}{j - i + 1}$ gleich 1. Summieren ergibt $\\E[\\text{Vergleiche}] \\approx 2n\\ln n = O(n\\log n)$.

### Funktionen von Zufallsvariablen

Für eine Funktion $g$ gilt $\\E[g(X)] = \\sum_i g(x_i)\\, P(X = x_i)$. Achtung: Im Allgemeinen ist $\\E[g(X)] \\neq g(\\E[X])$, zum Beispiel $\\E[X^2] \\neq \\E[X]^2$.

## Varianz und Standardabweichung

Der Erwartungswert sagt nichts über die **Streuung**: Eine sichere 0 und ein Münzwurf um $\\pm 1000$ € haben beide Erwartungswert 0.

> [!DEFINITION] Varianz
> Die **Varianz** von $X$ ist die mittlere quadratische Abweichung vom Erwartungswert $\\mu = \\E[X]$:
> $$
> \\Var(X) = \\E\\big[(X - \\mu)^2\\big] .
> $$
> Die **Standardabweichung** ist $\\sigma_X = \\sqrt{\\Var(X)}$; sie hat dieselbe Einheit wie $X$.

> [!SATZ] Verschiebungssatz und Rechenregeln
> $$
> \\Var(X) = \\E[X^2] - \\E[X]^2, \\qquad \\Var(aX + b) = a^2 \\Var(X) .
> $$

> [!BEWEIS]
> Mit Linearität: $\\E[(X - \\mu)^2] = \\E[X^2] - 2\\mu\\E[X] + \\mu^2 = \\E[X^2] - \\mu^2$. Für die zweite Regel: $aX + b$ hat Erwartungswert $a\\mu + b$, also $\\Var(aX + b) = \\E[(aX - a\\mu)^2] = a^2\\Var(X)$. Die Verschiebung $b$ ändert die Streuung nicht.

> [!BEISPIEL] Varianz des Würfels
> $\\E[X^2] = \\frac{1 + 4 + 9 + 16 + 25 + 36}{6} = \\frac{91}{6}$, also $\\Var(X) = \\frac{91}{6} - 3{,}5^2 = \\frac{91}{6} - \\frac{49}{4} = \\frac{35}{12} \\approx 2{,}92$ und $\\sigma \\approx 1{,}71$.

## Mehrere Zufallsvariablen

> [!DEFINITION] Unabhängigkeit und Kovarianz
> Diskrete Zufallsvariablen $X, Y$ heißen **unabhängig**, wenn $P(X = x, Y = y) = P(X = x)\\,P(Y = y)$ für alle Werte $x, y$. Die **Kovarianz** ist
> $$
> \\Cov(X, Y) = \\E\\big[(X - \\E X)(Y - \\E Y)\\big] = \\E[XY] - \\E[X]\\,\\E[Y] .
> $$

> [!SATZ] Varianz einer Summe
> $$
> \\Var(X + Y) = \\Var(X) + \\Var(Y) + 2\\Cov(X, Y) .
> $$
> Sind $X$ und $Y$ unabhängig, so ist $\\E[XY] = \\E[X]\\E[Y]$, also $\\Cov(X, Y) = 0$ und $\\Var(X + Y) = \\Var(X) + \\Var(Y)$.

Daraus folgt eine zentrale Tatsache der Statistik: Der Mittelwert $\\bar X_n = \\frac1n\\sum X_i$ von $n$ unabhängigen, gleich verteilten Messungen mit Varianz $\\sigma^2$ hat die Varianz $\\frac{\\sigma^2}{n}$, also die Standardabweichung $\\frac{\\sigma}{\\sqrt n}$. Viermal so viele Messungen halbieren die Unsicherheit.

> [!MISTAKE] Kovarianz 0 heißt nicht unabhängig
> Sei $X$ gleichverteilt auf $\\set{-1, 0, 1}$ und $Y = X^2$. Dann ist $\\E[XY] = \\E[X^3] = 0 = \\E[X]\\E[Y]$, also $\\Cov(X, Y) = 0$. Trotzdem ist $Y$ durch $X$ vollständig bestimmt. Kovarianz misst nur **lineare** Zusammenhänge.

Normiert man die Kovarianz, erhält man den **Korrelationskoeffizienten** $\\rho = \\frac{\\Cov(X,Y)}{\\sigma_X\\sigma_Y} \\in [-1, 1]$ – die Cauchy-Schwarz-Ungleichung aus der [Vektorrechnung](#/mathe/lineare-algebra/vektoren) in stochastischer Form.

## Die Ungleichung von Tschebyschow

Wie wahrscheinlich sind große Abweichungen vom Erwartungswert? Ohne die Verteilung zu kennen, liefert die Varianz eine Schranke:

> [!SATZ] Ungleichung von Tschebyschow
> Für jede Zufallsvariable mit Erwartungswert $\\mu$ und Varianz $\\sigma^2$ und jedes $k > 0$ gilt
> $$
> P\\big(\\abs{X - \\mu} \\ge k\\big) \\le \\frac{\\sigma^2}{k^2} .
> $$

> [!BEWEIS]
> Sei $A$ das Ereignis $\\abs{X - \\mu} \\ge k$. Auf $A$ ist $(X - \\mu)^2 \\ge k^2$, außerhalb ist $(X - \\mu)^2 \\ge 0$. Also $(X - \\mu)^2 \\ge k^2 \\mathbf 1_A$, und mit Erwartungswerten $\\sigma^2 \\ge k^2 P(A)$.

Mit $k = c\\sigma$: Höchstens $\\frac1{c^2}$ der Wahrscheinlichkeitsmasse liegt mehr als $c$ Standardabweichungen entfernt – mindestens 75 % liegen innerhalb von $\\mu \\pm 2\\sigma$, **für jede Verteilung**. Für konkrete Verteilungen wie die Normalverteilung ist die Schranke grob (dort sind es 95 %), dafür gilt sie immer. Auf dieser Ungleichung beruht der Beweis des schwachen Gesetzes der großen Zahlen.

## Zusammenfassung

- Eine Zufallsvariable ordnet Ergebnissen Zahlen zu; ihre Verteilung sind die Werte $P(X = x_i)$.
- $\\E[X] = \\sum x_i P(X = x_i)$ ist linear – auch bei Abhängigkeit; Indikatorvariablen machen das nutzbar.
- $\\Var(X) = \\E[X^2] - \\E[X]^2$, $\\Var(aX + b) = a^2\\Var X$; bei Unabhängigkeit addieren sich Varianzen.
- Tschebyschow: $P(\\abs{X - \\mu} \\ge k) \\le \\frac{\\sigma^2}{k^2}$ für jede Verteilung.
`;export{e as default};
