const n=`---
id: potenzen-logarithmen
title: Potenzen, Wurzeln und Logarithmen
module: algebra
order: 1
difficulty: einsteiger
minutes: 40
summary: Potenzgesetze für ganze und rationale Exponenten, Wurzeln, Logarithmen als Umkehrung der Exponentialfunktion, Logarithmengesetze, Basiswechsel sowie Exponential- und Logarithmusgleichungen mit Anwendungen aus der Informatik.
tags: [Potenzgesetze, Wurzel, Logarithmus, Basiswechsel, Exponentialgleichung, Bits]
requires: [abbildungen]
---

## Potenzen

Für eine reelle Zahl $a$ und $n \\in \\N$ ist $a^n = a \\cdot a \\cdots a$ ($n$ Faktoren) und $a^0 = 1$. Die Definition wird schrittweise erweitert, und zwar so, dass die Rechengesetze gültig bleiben:

> [!DEFINITION] Potenzen mit ganzen und rationalen Exponenten
> Für $a \\neq 0$ und $n \\in \\N$ ist $a^{-n} = \\frac{1}{a^n}$. Für $a > 0$, $m \\in \\Z$ und $n \\in \\N$, $n \\ge 1$, ist
> $$
> a^{1/n} = \\sqrt[n]{a} \\qquad\\text{und}\\qquad a^{m/n} = \\left(\\sqrt[n]{a}\\right)^m = \\sqrt[n]{a^m} .
> $$
> Dabei ist $\\sqrt[n]a$ die eindeutige positive Zahl $x$ mit $x^n = a$.

> [!SATZ] Potenzgesetze
> Für $a, b > 0$ und reelle Exponenten $r, s$ gilt
> $$
> a^r a^s = a^{r+s}, \\qquad \\frac{a^r}{a^s} = a^{r - s}, \\qquad (a^r)^s = a^{rs}, \\qquad (ab)^r = a^r b^r, \\qquad \\left(\\frac ab\\right)^r = \\frac{a^r}{b^r} .
> $$

> [!MISTAKE] Häufige Fehler
> - $(a + b)^2 \\neq a^2 + b^2$ – es fehlt $2ab$. Ebenso $\\sqrt{a + b} \\neq \\sqrt a + \\sqrt b$.
> - $a^{r} \\cdot b^{s}$ lässt sich nur zusammenfassen, wenn die Basen **oder** die Exponenten gleich sind.
> - $\\sqrt{x^2} = \\abs x$, nicht $x$: $\\sqrt{(-3)^2} = 3$.
> - $2^{3^2} = 2^9 = 512$, nicht $(2^3)^2 = 64$ – Potenztürme werden von oben ausgewertet.

> [!BEISPIEL] Vereinfachen
> $$
> \\frac{\\sqrt[3]{x^2} \\cdot x^{-1/2}}{\\sqrt{x}^{\\,3}} = \\frac{x^{2/3} \\cdot x^{-1/2}}{x^{3/2}} = x^{\\frac23 - \\frac12 - \\frac32} = x^{-4/3} = \\frac{1}{\\sqrt[3]{x^4}} \\qquad (x > 0).
> $$
> Der Trick: alle Wurzeln in Potenzen umschreiben und Exponenten addieren.

## Logarithmen

Die Exponentialfunktion $x \\mapsto a^x$ ist für $a > 0$, $a \\neq 1$ eine Bijektion von $\\R$ auf $(0, \\infty)$ (siehe [Abbildungen](#/mathe/grundlagen/abbildungen)). Ihre Umkehrfunktion ist der Logarithmus.

> [!DEFINITION] Logarithmus
> Für $a > 0$, $a \\neq 1$ und $x > 0$ ist $\\log_a x$ die eindeutige Zahl $y$ mit $a^y = x$:
> $$
> \\log_a x = y \\iff a^y = x .
> $$
> Besondere Basen: $\\ln x = \\log_\\e x$ (natürlicher Logarithmus), $\\lg x = \\log_{10} x$ (Zehnerlogarithmus), $\\operatorname{ld} x = \\log_2 x$ (Zweierlogarithmus, in der Informatik meist $\\log$).

Beispiele: $\\log_2 1024 = 10$, $\\log_{10} 0{,}001 = -3$, $\\ln \\e^5 = 5$, $\\log_a 1 = 0$, $\\log_a a = 1$. Logarithmen negativer Zahlen oder von $0$ sind (im Reellen) nicht definiert.

> [!SATZ] Logarithmengesetze
> Für $x, y > 0$ und $r \\in \\R$:
> $$
> \\log_a(xy) = \\log_a x + \\log_a y, \\qquad \\log_a\\frac xy = \\log_a x - \\log_a y, \\qquad \\log_a(x^r) = r\\log_a x .
> $$

> [!BEWEIS]
> Mit $u = \\log_a x$ und $v = \\log_a y$ ist $x = a^u$ und $y = a^v$. Dann ist $xy = a^u a^v = a^{u+v}$, also $\\log_a(xy) = u + v$. Ebenso $x^r = (a^u)^r = a^{ru}$, also $\\log_a(x^r) = r u$. Die Quotientenregel folgt aus beiden.

Logarithmen verwandeln Multiplikation in Addition – das war der Grund für ihre Erfindung (Rechenschieber, Logarithmentafeln) und ist bis heute nützlich: Wahrscheinlichkeiten vieler unabhängiger Ereignisse multipliziert man numerisch stabiler als Summe ihrer Logarithmen („Log-Likelihood“), weil das Produkt sonst unter die kleinste darstellbare Gleitkommazahl fällt.

> [!SATZ] Basiswechsel
> $$
> \\log_a x = \\frac{\\log_b x}{\\log_b a} = \\frac{\\ln x}{\\ln a} .
> $$

Programmiersprachen bieten meist nur \`log\` (natürlich), \`log10\` und \`log2\`; jede andere Basis erhält man mit dieser Formel. Weil Logarithmen verschiedener Basen sich nur um einen konstanten Faktor unterscheiden, schreibt man in der [O-Notation](#/mathe/diskrete-mathematik/rekurrenzen-asymptotik) einfach $O(\\log n)$.

## Logarithmen in der Informatik

| Frage | Antwort |
|---|---|
| Wie viele Bits braucht die Zahl $n \\ge 1$? | $\\lfloor\\log_2 n\\rfloor + 1$ |
| Wie viele Halbierungen bis zur Größe 1 (binäre Suche)? | $\\lceil\\log_2 n\\rceil$ |
| Höhe eines vollständigen Binärbaums mit $n$ Knoten | $\\lfloor\\log_2 n\\rfloor$ |
| Wie viele Dezimalstellen hat $2^{64}$? | $\\lfloor 64 \\lg 2\\rfloor + 1 = 20$ |
| Informationsgehalt eines Ereignisses mit Wahrscheinlichkeit $p$ | $-\\log_2 p$ Bit |

> [!BEISPIEL] Binäre Suche
> In einer sortierten Liste mit einer Milliarde Einträgen findet die binäre Suche jedes Element nach höchstens $\\lceil \\log_2 10^9 \\rceil = 30$ Vergleichen, denn $2^{30} \\approx 1{,}07 \\cdot 10^9$. Eine lineare Suche bräuchte im Mittel eine halbe Milliarde.

## Exponential- und Logarithmusgleichungen

**Exponentialgleichungen** löst man durch Logarithmieren:

> [!BEISPIEL] Verdopplungszeit
> Ein Datenbestand wächst um 7 % pro Jahr. Wann hat er sich verdoppelt? Gesucht ist $t$ mit $1{,}07^t = 2$:
> $$
> t = \\log_{1{,}07} 2 = \\frac{\\ln 2}{\\ln 1{,}07} \\approx \\frac{0{,}6931}{0{,}06766} \\approx 10{,}24 \\text{ Jahre}.
> $$
> Faustregel („Regel von 72“): Verdopplungszeit $\\approx \\frac{72}{\\text{Prozentsatz}} = \\frac{72}{7} \\approx 10{,}3$.

> [!BEISPIEL] Gleiche Basis herstellen
> $4^{x} = 8^{x - 1}$: Mit $4 = 2^2$ und $8 = 2^3$ ist $2^{2x} = 2^{3x - 3}$, also $2x = 3x - 3$ und $x = 3$.

**Logarithmusgleichungen** löst man durch Exponenzieren – und muss danach den Definitionsbereich prüfen:

> [!BEISPIEL] Probe nicht vergessen
> $\\log_2(x) + \\log_2(x - 2) = 3$. Zusammenfassen: $\\log_2\\big(x(x-2)\\big) = 3$, also $x^2 - 2x = 8$, $x^2 - 2x - 8 = 0$, $x \\in \\set{4, -2}$. Aber $\\log_2(-2)$ ist nicht definiert – nur $x = 4$ ist Lösung. (Probe: $\\log_2 4 + \\log_2 2 = 2 + 1 = 3$ ✓.) Das Zusammenfassen der Logarithmen hat den Definitionsbereich vergrößert.

## Zusammenfassung

- $a^{m/n} = \\sqrt[n]{a^m}$; Potenzgesetze gelten für positive Basen und beliebige reelle Exponenten.
- $\\log_a x = y \\iff a^y = x$; Logarithmen machen aus Produkten Summen und aus Potenzen Faktoren.
- Basiswechsel: $\\log_a x = \\frac{\\ln x}{\\ln a}$ – deshalb ist die Basis in $O(\\log n)$ egal.
- Exponentialgleichungen logarithmieren, Logarithmusgleichungen exponenzieren – und den Definitionsbereich prüfen.
`;export{n as default};
