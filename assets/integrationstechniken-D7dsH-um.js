const n=`---
id: integrationstechniken
title: Integrationstechniken
module: analysis-2
order: 2
difficulty: fortgeschritten
minutes: 50
summary: Substitutionsregel, partielle Integration und Partialbruchzerlegung mit durchgerechneten Beispielen, Strategien zur Wahl der Methode und uneigentliche Integrale.
tags: [Substitution, Partielle Integration, Partialbruchzerlegung, Uneigentliches Integral, Integration]
requires: [integralrechnung]
---

## Integrieren ist schwieriger als Ableiten

Ableiten ist ein Algorithmus: Für jede aus Standardfunktionen zusammengesetzte Funktion liefern Produkt-, Quotienten- und Kettenregel die Ableitung. Für das Integrieren gibt es kein solches Rezept – nur Regeln, die ein Integral in ein **einfacheres** umformen. Die drei wichtigsten sind die Umkehrungen der Ketten- und der Produktregel sowie die Zerlegung rationaler Funktionen.

## Substitutionsregel

> [!SATZ] Substitutionsregel
> Ist $g$ stetig differenzierbar und $f$ stetig, so gilt
> $$
> \\int_a^b f(g(x))\\, g'(x) \\dd x = \\int_{g(a)}^{g(b)} f(u) \\dd u .
> $$

> [!BEWEIS]
> Sei $F$ eine Stammfunktion von $f$. Nach der Kettenregel ist $\\big(F(g(x))\\big)' = f(g(x))\\,g'(x)$. Mit dem Hauptsatz sind beide Seiten gleich $F(g(b)) - F(g(a))$.

**Praktisches Vorgehen:** Man sucht im Integranden eine innere Funktion $u = g(x)$, deren Ableitung (bis auf einen konstanten Faktor) ebenfalls als Faktor vorkommt. Formal ersetzt man $\\frac{\\mathrm du}{\\mathrm dx} = g'(x)$ durch „$\\mathrm du = g'(x) \\dd x$“ und transformiert die Grenzen mit.

> [!BEISPIEL] Substitution
> 1. $\\int 2x \\cos(x^2) \\dd x$: Mit $u = x^2$, $\\mathrm du = 2x \\dd x$ wird daraus $\\int \\cos u \\dd u = \\sin u + C = \\sin(x^2) + C$.
> 2. $\\int_0^1 x\\,\\e^{-x^2} \\dd x$: $u = -x^2$, $\\mathrm du = -2x\\dd x$, also $x\\dd x = -\\frac12 \\mathrm du$; Grenzen $0 \\mapsto 0$, $1 \\mapsto -1$:
> $$
> \\int_0^{-1} -\\tfrac12 \\e^{u} \\dd u = \\tfrac12 \\int_{-1}^{0} \\e^u \\dd u = \\tfrac12\\left(1 - \\e^{-1}\\right).
> $$
> 3. $\\int \\frac{f'(x)}{f(x)} \\dd x = \\ln\\abs{f(x)} + C$ (logarithmische Integration), etwa $\\int \\tan x \\dd x = \\int \\frac{\\sin x}{\\cos x}\\dd x = -\\ln\\abs{\\cos x} + C$.
> 4. Lineare Substitution: $\\int f(ax + b) \\dd x = \\frac1a F(ax + b) + C$, etwa $\\int \\e^{3x - 1}\\dd x = \\frac13 \\e^{3x - 1} + C$.

> [!MISTAKE] Grenzen nicht mittransformieren
> Wer substituiert und dann mit den alten Grenzen in $u$ einsetzt, rechnet falsch. Entweder transformiert man die Grenzen ($x = a \\mapsto u = g(a)$), oder man berechnet zuerst die Stammfunktion in $x$ (rücksubstituieren) und setzt dann die ursprünglichen Grenzen ein.

## Partielle Integration

> [!SATZ] Partielle Integration
> Für stetig differenzierbare $u, v$ gilt
> $$
> \\int_a^b u(x)\\, v'(x) \\dd x = \\Big[u(x)\\, v(x)\\Big]_a^b - \\int_a^b u'(x)\\, v(x) \\dd x .
> $$

> [!BEWEIS]
> Nach der Produktregel ist $(uv)' = u'v + uv'$. Integrieren über $[a, b]$ und der Hauptsatz liefern $\\big[uv\\big]_a^b = \\int_a^b u'v \\dd x + \\int_a^b uv' \\dd x$. Umstellen ergibt die Formel.

Die Kunst ist die Wahl: $u$ soll durch Ableiten **einfacher** werden, $v'$ soll sich leicht integrieren lassen. Eine bewährte Prioritätenregel für $u$ ist **LIATE**: **L**ogarithmen, **i**nverse trigonometrische Funktionen, **a**lgebraische (Polynome), **t**rigonometrische, **E**xponentialfunktionen.

> [!BEISPIEL] Partielle Integration
> 1. $\\int x\\, \\e^x \\dd x$ mit $u = x$, $v' = \\e^x$: $= x\\e^x - \\int 1 \\cdot \\e^x \\dd x = (x - 1)\\e^x + C$.
> 2. $\\int \\ln x \\dd x$ mit dem Trick $u = \\ln x$, $v' = 1$: $= x\\ln x - \\int \\frac1x \\cdot x \\dd x = x\\ln x - x + C$.
> 3. $\\int x^2 \\sin x \\dd x$ – zweimal partiell: $= -x^2\\cos x + \\int 2x \\cos x \\dd x = -x^2\\cos x + 2x\\sin x - \\int 2\\sin x \\dd x = (2 - x^2)\\cos x + 2x \\sin x + C$.

> [!BEISPIEL] Der Kreistrick
> $I = \\int \\e^x \\sin x \\dd x$. Zweimal partiell (jeweils $u$ = trigonometrisch):
> $$
> I = \\e^x \\sin x - \\int \\e^x \\cos x \\dd x = \\e^x\\sin x - \\left(\\e^x \\cos x + \\int \\e^x \\sin x \\dd x\\right) = \\e^x(\\sin x - \\cos x) - I .
> $$
> Das Integral taucht auf der rechten Seite wieder auf. Auflösen: $I = \\frac12 \\e^x(\\sin x - \\cos x) + C$.

## Partialbruchzerlegung

Rationale Funktionen $\\frac{p(x)}{q(x)}$ lassen sich immer elementar integrieren. Das Verfahren:

1. Ist $\\deg p \\ge \\deg q$, zuerst **Polynomdivision**: $\\frac pq = s + \\frac{r}{q}$ mit $\\deg r < \\deg q$.
2. Den Nenner $q$ in Linearfaktoren (und ggf. irreduzible quadratische Faktoren) zerlegen.
3. Ansatz: Für jeden einfachen Faktor $(x - a)$ ein Summand $\\frac{A}{x - a}$; für $(x - a)^k$ die Summanden $\\frac{A_1}{x - a} + \\dots + \\frac{A_k}{(x-a)^k}$.
4. Koeffizienten durch Einsetzen geeigneter $x$-Werte oder Koeffizientenvergleich bestimmen.
5. Summandenweise integrieren.

> [!BEISPIEL] Zwei einfache Nullstellen
> $\\int \\frac{5x - 1}{x^2 - x - 2} \\dd x$. Nenner $= (x - 2)(x + 1)$. Ansatz
> $$
> \\frac{5x - 1}{(x-2)(x+1)} = \\frac{A}{x - 2} + \\frac{B}{x + 1} \\iff 5x - 1 = A(x + 1) + B(x - 2).
> $$
> $x = 2$: $9 = 3A$, also $A = 3$. $x = -1$: $-6 = -3B$, also $B = 2$. Damit
> $$
> \\int \\frac{5x - 1}{x^2 - x - 2}\\dd x = 3\\ln\\abs{x - 2} + 2\\ln\\abs{x + 1} + C .
> $$

> [!BEISPIEL] Doppelte Nullstelle
> $\\frac{x + 3}{(x - 1)^2} = \\frac{A}{x - 1} + \\frac{B}{(x-1)^2}$ führt auf $x + 3 = A(x - 1) + B$. $x = 1$: $B = 4$; Koeffizient von $x$: $A = 1$. Also $\\int \\frac{x+3}{(x-1)^2}\\dd x = \\ln\\abs{x - 1} - \\frac{4}{x - 1} + C$.

Irreduzible quadratische Faktoren wie $x^2 + 1$ führen auf $\\arctan$: $\\int \\frac{1}{x^2 + 1}\\dd x = \\arctan x + C$ und allgemein $\\int \\frac{1}{(x - p)^2 + q^2}\\dd x = \\frac1q \\arctan\\frac{x - p}{q} + C$.

## Strategie

| Integrand enthält … | Versuch |
|---|---|
| eine Funktion und (bis auf Faktor) ihre innere Ableitung, z. B. $x\\,\\e^{x^2}$ | Substitution |
| Produkt Polynom × $\\e^x$, $\\sin$, $\\cos$ | partielle Integration, Polynom als $u$ |
| $\\ln x$, $\\arctan x$ allein oder mal Polynom | partielle Integration mit $u = \\ln x$ bzw. $\\arctan x$ |
| Quotient zweier Polynome | Polynomdivision, Partialbruchzerlegung |
| $\\sin^2 x$, $\\cos^2 x$ | $\\sin^2 x = \\frac12(1 - \\cos 2x)$ |
| $\\sqrt{1 - x^2}$ | Substitution $x = \\sin t$ |

Zur Kontrolle leitet man das Ergebnis ab – das ist immer möglich und schnell.

## Uneigentliche Integrale

Ist das Intervall unbeschränkt oder der Integrand an einer Stelle unbeschränkt, definiert man das Integral als Grenzwert:
$$
\\int_a^\\infty f(x)\\dd x := \\lim_{b\\to\\infty} \\int_a^b f(x)\\dd x, \\qquad \\int_0^1 f(x) \\dd x := \\lim_{\\varepsilon \\to 0^+} \\int_\\varepsilon^1 f(x)\\dd x .
$$
Existiert der Grenzwert, heißt das Integral **konvergent**.

> [!SATZ] Die Vergleichsintegrale
> $$
> \\int_1^\\infty \\frac{1}{x^p}\\dd x \\text{ konvergiert} \\iff p > 1, \\qquad \\int_0^1 \\frac{1}{x^p} \\dd x \\text{ konvergiert} \\iff p < 1 .
> $$

> [!BEWEIS]
> Für $p \\neq 1$ ist $\\int_1^b x^{-p}\\dd x = \\frac{b^{1-p} - 1}{1 - p}$. Für $b \\to \\infty$ geht $b^{1 - p} \\to 0$ genau dann, wenn $p > 1$; dann ist der Wert $\\frac{1}{p - 1}$. Für $p = 1$ ist $\\int_1^b \\frac1x \\dd x = \\ln b \\to \\infty$. Die Aussage über $[0, 1]$ folgt analog mit $\\varepsilon^{1-p} \\to 0 \\iff p < 1$.

> [!BEISPIEL] Exponentieller Zerfall
> $\\int_0^\\infty \\e^{-\\lambda x}\\dd x = \\lim_{b\\to\\infty}\\left[-\\frac1\\lambda \\e^{-\\lambda x}\\right]_0^b = \\frac{1}{\\lambda}$ für $\\lambda > 0$. Das ist die mittlere Lebensdauer bei exponentiellem Zerfall – und der Erwartungswert der Exponentialverteilung.

Das Gaußsche Integral $\\int_{-\\infty}^{\\infty} \\e^{-x^2}\\dd x = \\sqrt\\pi$ ist berühmt, weil es sich ohne Stammfunktion berechnen lässt (über ein Doppelintegral in Polarkoordinaten). Es sorgt dafür, dass die Dichte der Normalverteilung den Normierungsfaktor $\\frac{1}{\\sqrt{2\\pi}}$ hat.

## Zusammenfassung

- Substitution kehrt die Kettenregel um: innere Funktion $u$ wählen, $\\mathrm du = g'(x)\\dd x$, Grenzen mittransformieren.
- Partielle Integration kehrt die Produktregel um: $\\int uv' = uv - \\int u'v$; $u$ nach LIATE wählen.
- Rationale Funktionen: Polynomdivision, Partialbruchzerlegung, dann $\\ln$ und $\\arctan$.
- Uneigentliche Integrale sind Grenzwerte; $\\int_1^\\infty x^{-p}$ konvergiert genau für $p > 1$.
`;export{n as default};
