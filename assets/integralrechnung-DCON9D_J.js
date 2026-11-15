const e=`---
id: integralrechnung
title: Das Integral und der Hauptsatz
module: analysis-2
order: 1
difficulty: fortgeschritten
minutes: 45
summary: Flächen als Grenzwert von Riemann-Summen, Eigenschaften des bestimmten Integrals, Stammfunktionen, der Hauptsatz der Differential- und Integralrechnung und typische Anwendungen.
tags: [Integral, Riemann-Summe, Stammfunktion, Hauptsatz, Flächenberechnung, Mittelwert]
requires: [differentialrechnung]
---

## Fläche unter einer Kurve

Die Ableitung beantwortet „Wie schnell ändert sich etwas?“. Das **[[Integral]]** beantwortet die umgekehrte Frage: „Wie viel hat sich insgesamt angesammelt?“ Aus der Geschwindigkeit wird der zurückgelegte Weg, aus der Leistung die Energie, aus einer Wahrscheinlichkeitsdichte eine Wahrscheinlichkeit.

Geometrisch suchen wir die Fläche zwischen dem Graphen einer Funktion $f$ und der $x$-Achse über dem Intervall $[a, b]$. Die Idee: in schmale Streifen zerlegen, jeden Streifen durch ein Rechteck ersetzen, aufsummieren und die Streifen immer schmaler machen.

> [!DEFINITION] Riemann-Summe
> Zerlege $[a, b]$ in $n$ gleich breite Teilintervalle der Breite $\\Delta x = \\frac{b - a}{n}$ mit Teilpunkten $x_k = a + k\\Delta x$. Wähle in jedem Teilintervall eine Stützstelle $\\xi_k \\in [x_{k-1}, x_k]$. Dann heißt
> $$
> S_n = \\sum_{k=1}^{n} f(\\xi_k)\\, \\Delta x
> $$
> eine **Riemann-Summe**. Konvergieren alle diese Summen für $n \\to \\infty$ gegen denselben Wert, heißt $f$ **integrierbar** und
> $$
> \\int_a^b f(x) \\dd x = \\lim_{n \\to \\infty} S_n
> $$
> das **bestimmte Integral** von $f$ über $[a, b]$.

Jede stetige Funktion auf $[a, b]$ ist integrierbar, ebenso jede monotone und jede beschränkte Funktion mit endlich vielen Sprungstellen. Im Labor [Riemann-Summen & Quadratur](#/mathe/labor/integration) kannst du für beliebige Funktionen zusehen, wie linke, rechte und Mittelpunkt-Summen mit wachsendem $n$ gegen das Integral laufen.

> [!BEISPIEL] Ein Integral aus der Definition
> $\\int_0^1 x^2 \\dd x$ mit rechten Endpunkten $\\xi_k = \\frac kn$:
> $$
> S_n = \\sum_{k=1}^{n} \\left(\\frac kn\\right)^2 \\frac1n = \\frac{1}{n^3}\\sum_{k=1}^{n} k^2 = \\frac{1}{n^3} \\cdot \\frac{n(n+1)(2n+1)}{6} \\longrightarrow \\frac{2}{6} = \\frac13 .
> $$
> Hier wird die Summenformel aus der Lektion [Vollständige Induktion](#/mathe/grundlagen/vollstaendige-induktion) gebraucht. Für allgemeine Funktionen ist der Weg über Grenzwerte mühsam – der Hauptsatz liefert eine Abkürzung.

> [!WARNING] Orientierte Fläche
> Das Integral zählt Flächen **unterhalb** der $x$-Achse negativ: $\\int_0^{2\\pi} \\sin x \\dd x = 0$, obwohl die Fläche zwischen Graph und Achse $4$ ist. Für die geometrische Fläche integriert man $\\abs{f}$ bzw. teilt an den Nullstellen auf.

## Eigenschaften des Integrals

Für integrierbare $f, g$ und $c \\in \\R$ gilt:

| Eigenschaft | Formel |
|---|---|
| Linearität | $\\int_a^b (c f + g) \\dd x = c\\int_a^b f \\dd x + \\int_a^b g \\dd x$ |
| Intervalladditivität | $\\int_a^b f \\dd x + \\int_b^c f \\dd x = \\int_a^c f \\dd x$ |
| Orientierung | $\\int_b^a f \\dd x = -\\int_a^b f \\dd x$, $\\quad\\int_a^a f \\dd x = 0$ |
| Monotonie | $f \\le g$ auf $[a, b]$ $\\Rightarrow$ $\\int_a^b f \\dd x \\le \\int_a^b g \\dd x$ |
| Dreiecksungleichung | $\\left\\lvert\\int_a^b f \\dd x\\right\\rvert \\le \\int_a^b \\abs f \\dd x$ |

> [!SATZ] Mittelwertsatz der Integralrechnung
> Ist $f$ auf $[a, b]$ stetig, so gibt es ein $\\xi \\in [a, b]$ mit
> $$
> \\int_a^b f(x) \\dd x = f(\\xi)\\,(b - a) .
> $$
> Die Zahl $\\bar f = \\frac{1}{b - a}\\int_a^b f(x)\\dd x$ heißt **Mittelwert** von $f$ auf $[a, b]$.

Der Mittelwert einer Funktion verallgemeinert den Durchschnitt endlich vieler Zahlen. Beispiel: Die mittlere Temperatur eines Tages ist das Integral der Temperaturkurve geteilt durch 24 Stunden.

## Stammfunktionen

> [!DEFINITION] Stammfunktion
> $F$ heißt **Stammfunktion** von $f$ auf einem Intervall $I$, wenn $F'(x) = f(x)$ für alle $x \\in I$. Die Menge aller Stammfunktionen schreibt man als **unbestimmtes Integral** $\\int f(x) \\dd x = F(x) + C$.

> [!SATZ] Stammfunktionen unterscheiden sich um Konstanten
> Sind $F$ und $G$ Stammfunktionen von $f$ auf einem Intervall, so ist $F - G$ konstant.

> [!BEWEIS]
> $(F - G)' = f - f = 0$ auf dem Intervall. Nach dem Mittelwertsatz der Differentialrechnung ist eine Funktion mit Ableitung $0$ auf einem Intervall konstant.

Jede Ableitungsregel liefert, rückwärts gelesen, eine Integrationsregel:

| $f(x)$ | Stammfunktion $F(x)$ |
|---|---|
| $x^r$, $r \\neq -1$ | $\\frac{x^{r+1}}{r+1}$ |
| $\\frac1x$ | $\\ln\\abs x$ |
| $\\e^{x}$ | $\\e^{x}$ |
| $\\e^{kx}$, $k \\ne 0$ | $\\frac1k \\e^{kx}$ |
| $\\sin x$ | $-\\cos x$ |
| $\\cos x$ | $\\sin x$ |
| $\\frac{1}{1 + x^2}$ | $\\arctan x$ |
| $\\frac{1}{\\sqrt{1 - x^2}}$ | $\\arcsin x$ |

## Der Hauptsatz

Die zentrale Entdeckung von Newton und Leibniz: Integrieren und Differenzieren sind Umkehroperationen.

> [!SATZ] Hauptsatz der Differential- und Integralrechnung
> Sei $f\\colon [a, b] \\to \\R$ stetig.
> 1. Die **Integralfunktion** $F(x) = \\int_a^x f(t) \\dd t$ ist differenzierbar mit $F'(x) = f(x)$. Insbesondere hat jede stetige Funktion eine Stammfunktion.
> 2. Ist $G$ irgendeine Stammfunktion von $f$, so gilt
> $$
> \\int_a^b f(x) \\dd x = G(b) - G(a) =: \\Big[G(x)\\Big]_a^b .
> $$

> [!BEWEIS]
> **Teil 1.** Für $h \\neq 0$ ist nach Intervalladditivität und dem Mittelwertsatz der Integralrechnung
> $$
> \\frac{F(x + h) - F(x)}{h} = \\frac1h \\int_x^{x+h} f(t) \\dd t = f(\\xi_h)
> $$
> für ein $\\xi_h$ zwischen $x$ und $x + h$. Für $h \\to 0$ geht $\\xi_h \\to x$, und wegen der Stetigkeit von $f$ folgt $f(\\xi_h) \\to f(x)$.
>
> **Teil 2.** $F$ und $G$ sind beide Stammfunktionen, also $G = F + C$. Dann ist $G(b) - G(a) = F(b) - F(a) = \\int_a^b f \\dd t - 0$.

> [!BEISPIEL] Integrale mit dem Hauptsatz
> - $\\int_0^1 x^2 \\dd x = \\left[\\frac{x^3}{3}\\right]_0^1 = \\frac13$ – dasselbe Ergebnis wie oben, ohne Grenzwert.
> - $\\int_0^\\pi \\sin x \\dd x = \\Big[-\\cos x\\Big]_0^\\pi = -(-1) - (-1) = 2$.
> - $\\int_1^{\\e} \\frac1x \\dd x = \\Big[\\ln x\\Big]_1^{\\e} = 1 - 0 = 1$.
> - $\\int_{-1}^{2} (3x^2 - 2x + 1) \\dd x = \\Big[x^3 - x^2 + x\\Big]_{-1}^{2} = (8 - 4 + 2) - (-1 - 1 - 1) = 9$.

> [!MISTAKE] Definitionslücken übersehen
> $\\int_{-1}^{1} \\frac{1}{x^2} \\dd x$ ist **nicht** $\\left[-\\frac1x\\right]_{-1}^{1} = -2$ – das wäre sogar negativ, obwohl der Integrand positiv ist. Der Integrand ist in $0$ nicht definiert und unbeschränkt; der Hauptsatz verlangt Stetigkeit auf dem ganzen Intervall. Solche **uneigentlichen** Integrale muss man als Grenzwert untersuchen; dieses divergiert.

## Anwendungen

### Fläche zwischen zwei Kurven

Die Fläche zwischen $f$ und $g$ über $[a, b]$ ist $\\int_a^b \\abs{f(x) - g(x)} \\dd x$. Praktisch bestimmt man die Schnittpunkte und integriert zwischen ihnen „obere minus untere“ Funktion.

> [!BEISPIEL] Parabel und Gerade
> $f(x) = x$ und $g(x) = x^2$ schneiden sich bei $x = 0$ und $x = 1$; dazwischen liegt $f$ oben. Fläche:
> $$
> \\int_0^1 (x - x^2) \\dd x = \\left[\\frac{x^2}{2} - \\frac{x^3}{3}\\right]_0^1 = \\frac12 - \\frac13 = \\frac16 .
> $$

### Weg aus Geschwindigkeit

Ist $v(t)$ die Geschwindigkeit, so ist $\\int_{t_0}^{t_1} v(t) \\dd t$ die **Ortsveränderung** und $\\int_{t_0}^{t_1} \\abs{v(t)} \\dd t$ der zurückgelegte **Weg**. Genau so integrieren Physik-Engines in Spielen die Bewegungsgleichungen – numerisch, in kleinen Zeitschritten (siehe [Numerik](#/mathe/numerik)).

### Wahrscheinlichkeiten

Für eine stetige Zufallsgröße mit Dichte $f$ ist $P(a \\le X \\le b) = \\int_a^b f(x) \\dd x$. Die Gesamtfläche unter einer Dichte ist $1$. Mehr dazu in der [Stochastik](#/mathe/stochastik).

### Integralfunktion ableiten

Teil 1 des Hauptsatzes erlaubt, Integrale mit variabler Grenze abzuleiten, ohne sie auszurechnen. Mit der Kettenregel gilt allgemein
$$
\\frac{\\mathrm d}{\\mathrm dx} \\int_a^{u(x)} f(t)\\dd t = f(u(x))\\, u'(x).
$$
Beispiel: $\\frac{\\mathrm d}{\\mathrm dx}\\int_0^{x^2} \\e^{-t^2}\\dd t = \\e^{-x^4} \\cdot 2x$ – obwohl $\\e^{-t^2}$ keine elementare Stammfunktion hat.

> [!EXPERT] Nicht jede Stammfunktion ist elementar
> $\\e^{-x^2}$, $\\frac{\\sin x}{x}$ oder $\\frac{1}{\\ln x}$ haben Stammfunktionen (Hauptsatz, Teil 1), aber diese lassen sich **nicht** aus Polynomen, Exponential-, Logarithmus- und trigonometrischen Funktionen zusammensetzen (Satz von Liouville). Die Stammfunktion von $\\e^{-x^2}$ ist bis auf Faktoren die Fehlerfunktion $\\operatorname{erf}$, die man für die Normalverteilung braucht und numerisch berechnet.

## Zusammenfassung

- Das bestimmte Integral ist der Grenzwert von Riemann-Summen – eine orientierte Fläche.
- Stammfunktionen erfüllen $F' = f$ und unterscheiden sich nur um Konstanten.
- Hauptsatz: $\\int_a^b f\\dd x = F(b) - F(a)$ für stetiges $f$; und $\\frac{\\mathrm d}{\\mathrm dx}\\int_a^x f\\dd t = f(x)$.
- Vor dem Einsetzen prüfen, ob $f$ auf dem ganzen Intervall stetig ist.
`;export{e as default};
