const e=`---
id: nullstellen
title: Nullstellenverfahren
module: numerik
order: 2
difficulty: fortgeschritten
minutes: 45
summary: Bisektion, Newton-Verfahren, Sekantenverfahren und Fixpunktiteration mit Konvergenzordnung, Abbruchkriterien, Fallstricken und Python-Implementierungen.
tags: [Nullstelle, Bisektion, Newton-Verfahren, Sekantenverfahren, Fixpunktiteration, Konvergenzordnung]
requires: [gleitkomma, differentialrechnung]
---

## Das Problem

Viele Fragen führen auf eine Gleichung $f(x) = 0$, die sich nicht nach $x$ auflösen lässt: $\\cos x = x$, $x^5 - x - 1 = 0$ (für Polynome ab Grad 5 gibt es keine allgemeine Lösungsformel), der Zinssatz einer Annuität, das Gleichgewicht eines physikalischen Systems. Numerische Verfahren erzeugen eine **Folge** von Näherungen $x_0, x_1, x_2, \\dots$, die gegen eine Nullstelle $x^*$ konvergiert.

> [!DEFINITION] Konvergenzordnung
> Eine Folge $x_k \\to x^*$ konvergiert mit **Ordnung** $p \\ge 1$ ([[Konvergenzordnung]]), wenn es eine Konstante $C$ gibt mit
> $$
> \\abs{x_{k+1} - x^*} \\le C\\, \\abs{x_k - x^*}^p
> $$
> (für $p = 1$ zusätzlich $C < 1$). Bei $p = 1$ heißt sie **linear**, bei $p = 2$ **quadratisch**.

Anschaulich: Bei linearer Konvergenz kommt pro Schritt ein fester Anteil an korrekten Stellen hinzu; bei quadratischer Konvergenz **verdoppelt** sich die Zahl korrekter Stellen pro Schritt – nach fünf Schritten von 1 auf 32 Stellen.

## Bisektion

Das robusteste Verfahren beruht auf dem Zwischenwertsatz: Ist $f$ stetig und haben $f(a)$ und $f(b)$ verschiedene Vorzeichen, liegt in $[a, b]$ eine Nullstelle.

> [!DEFINITION] Bisektionsverfahren
> Starte mit $[a, b]$, $f(a) f(b) < 0$. Wiederhole: $m = \\frac{a + b}{2}$; ist $f(a) f(m) \\le 0$, setze $b = m$, sonst $a = m$.

Nach $k$ Schritten hat das Intervall die Länge $\\frac{b - a}{2^k}$ – lineare Konvergenz mit $C = \\frac12$, also etwa ein Bit pro Schritt. Für eine Genauigkeit $\\varepsilon$ braucht man
$$
k \\ge \\log_2\\frac{b - a}{\\varepsilon}
$$
Schritte; von $[1, 2]$ auf $10^{-10}$ genau sind das $34$.

\`\`\`python title="Bisektion"
def bisektion(f, a, b, tol=1e-12):
    fa = f(a)
    if fa * f(b) > 0:
        raise ValueError("Kein Vorzeichenwechsel in [a, b]")
    while b - a > tol:
        m = (a + b) / 2
        fm = f(m)
        if fa * fm <= 0:
            b = m
        else:
            a, fa = m, fm
    return (a + b) / 2

import math
print(bisektion(lambda x: math.cos(x) - x, 0, 1))  # 0.7390851332...
\`\`\`

**Vorteile:** konvergiert garantiert, braucht keine Ableitung. **Nachteile:** langsam, braucht ein Startintervall mit Vorzeichenwechsel, findet keine doppelten Nullstellen wie bei $x^2$. Dieselbe Idee steckt in der binären Suche und in \`git bisect\`.

## Das Newton-Verfahren

> [!DEFINITION] Newton-Verfahren
> Ausgehend von einem Startwert $x_0$:
> $$
> x_{k+1} = x_k - \\frac{f(x_k)}{f'(x_k)} .
> $$

Geometrisch ersetzt man $f$ an der Stelle $x_k$ durch die Tangente und nimmt deren Nullstelle als neue Näherung – die [Ableitung](#/mathe/analysis-1/differentialrechnung) als beste lineare Näherung in Aktion. Im Labor [Nullstellenverfahren](#/mathe/labor/nullstellen) lassen sich die Tangentenschritte für eigene Funktionen Schritt für Schritt verfolgen; die Tabelle zeigt dort auch die gemessene Konvergenzordnung.

> [!SATZ] Quadratische Konvergenz
> Ist $f$ zweimal stetig differenzierbar, $f(x^*) = 0$ und $f'(x^*) \\neq 0$, so konvergiert das [[Newton-Verfahren]] für Startwerte hinreichend nahe bei $x^*$ quadratisch:
> $$
> \\abs{x_{k+1} - x^*} \\le C \\abs{x_k - x^*}^2 .
> $$

> [!BEWEIS]
> Taylor um $x_k$ mit Restglied: $0 = f(x^*) = f(x_k) + f'(x_k)(x^* - x_k) + \\tfrac12 f''(\\xi)(x^* - x_k)^2$. Division durch $f'(x_k)$ und Einsetzen der Iterationsvorschrift $x_k - \\frac{f(x_k)}{f'(x_k)} = x_{k+1}$ ergibt
> $$
> x_{k+1} - x^* = \\frac{f''(\\xi)}{2 f'(x_k)}\\,(x_k - x^*)^2 .
> $$
> Nahe $x^*$ ist $f'(x_k)$ von null weg beschränkt und $f''$ beschränkt; der Bruch ist also durch eine Konstante $C$ beschränkt.

> [!BEISPIEL] Wurzelziehen mit Newton
> Für $\\sqrt a$ löst man $f(x) = x^2 - a = 0$: $x_{k+1} = x_k - \\frac{x_k^2 - a}{2x_k} = \\frac12\\left(x_k + \\frac{a}{x_k}\\right)$ – das **Heron-Verfahren**, das schon in Babylon bekannt war. Für $a = 2$, $x_0 = 1$:
>
> | $k$ | $x_k$ | korrekte Stellen |
> |---|---|---|
> | 0 | $1$ | 1 |
> | 1 | $1{,}5$ | 1 |
> | 2 | $1{,}41\\overline{6}$ | 3 |
> | 3 | $1{,}41421568\\ldots$ | 6 |
> | 4 | $1{,}41421356237469\\ldots$ | 12 |
>
> Die Stellenzahl verdoppelt sich ungefähr – quadratische Konvergenz.

\`\`\`python title="Newton-Verfahren mit Abbruchkriterien"
def newton(f, df, x0, tol=1e-12, max_iter=50):
    x = x0
    for _ in range(max_iter):
        d = df(x)
        if d == 0:
            raise ZeroDivisionError("Ableitung 0 – horizontale Tangente")
        schritt = f(x) / d
        x -= schritt
        if abs(schritt) <= tol * max(1.0, abs(x)):
            return x
    raise RuntimeError("Keine Konvergenz – anderen Startwert wählen")

print(newton(lambda x: x**5 - x - 1, lambda x: 5*x**4 - 1, 1.0))  # 1.1673039782...
\`\`\`

### Fallstricke

> [!WARNING] Newton kann scheitern
> - **Schlechter Startwert:** Für $f(x) = \\arctan x$ mit $x_0 = 2$ springen die Iterierten immer weiter weg ($x_1 \\approx -3{,}54$, $x_2 \\approx 13{,}95$, …) und divergieren.
> - **Zyklen:** Für $f(x) = x^3 - 2x + 2$ und $x_0 = 0$ pendelt die Folge zwischen $0$ und $1$.
> - **Flache Stellen:** Ist $f'(x_k) \\approx 0$, wird der Schritt riesig.
> - **Mehrfache Nullstellen** ($f'(x^*) = 0$, etwa $x^2$ bei $0$): Die Konvergenz ist nur noch linear.

Alle vier Fälle sind im Labor als Beispiele hinterlegt – etwa [Divergenz bei arctan](#/mathe/labor/nullstellen?beispiel=arctan), [der Zyklus](#/mathe/labor/nullstellen?beispiel=zyklus) und [die doppelte Nullstelle](#/mathe/labor/nullstellen?beispiel=doppelt), bei der die gemessene Ordnung auf 1 fällt.

Robuste Implementierungen kombinieren daher Newton mit Bisektion: Man hält ein Intervall mit Vorzeichenwechsel fest und akzeptiert einen Newton-Schritt nur, wenn er im Intervall landet (so arbeitet etwa \`scipy.optimize.brentq\` mit einer verwandten Strategie).

## Sekantenverfahren

Ist die Ableitung unbekannt oder teuer, ersetzt man sie durch den Differenzenquotienten der letzten beiden Näherungen:
$$
x_{k+1} = x_k - f(x_k)\\,\\frac{x_k - x_{k-1}}{f(x_k) - f(x_{k-1})} .
$$
Die Konvergenzordnung ist der goldene Schnitt $p = \\frac{1 + \\sqrt 5}{2} \\approx 1{,}618$ (im [Labor](#/mathe/labor/nullstellen?beispiel=cos&verfahren=sekante) nachmessbar) – etwas langsamer als Newton pro Schritt, aber jeder Schritt braucht nur **eine** neue Funktionsauswertung statt zwei ($f$ und $f'$). Pro Funktionsauswertung ist das Sekantenverfahren daher oft sogar effizienter.

## Fixpunktiteration

Viele Verfahren lassen sich als [[Fixpunktiteration]] $x_{k+1} = g(x_k)$ schreiben; ein Fixpunkt $x^* = g(x^*)$ ist dann die Lösung. Newton ist der Fall $g(x) = x - \\frac{f(x)}{f'(x)}$.

> [!SATZ] Banachscher Fixpunktsatz (eindimensional)
> Bildet $g$ ein abgeschlossenes Intervall $I$ in sich ab und gilt $\\abs{g'(x)} \\le L < 1$ auf $I$, so hat $g$ genau einen Fixpunkt $x^* \\in I$, und die Iteration konvergiert für jeden Startwert in $I$ linear:
> $$
> \\abs{x_k - x^*} \\le \\frac{L^k}{1 - L}\\abs{x_1 - x_0} .
> $$

> [!BEISPIEL] cos x = x
> $g(x) = \\cos x$ bildet $[0, 1]$ in sich ab, und $\\abs{g'(x)} = \\abs{\\sin x} \\le \\sin 1 \\approx 0{,}84 < 1$. Also konvergiert $x_{k+1} = \\cos x_k$ gegen die eindeutige Lösung $x^* \\approx 0{,}739085$ – auf jedem Taschenrechner durch wiederholtes Drücken der Cosinus-Taste. Wegen $L \\approx 0{,}67$ am Fixpunkt (dort ist $\\abs{\\sin x^*} \\approx 0{,}67$) braucht man aber rund 60 Schritte für 10 Stellen; Newton braucht 4.

## Abbruchkriterien

Ein Verfahren muss entscheiden, wann es aufhört. Übliche Kriterien, oft kombiniert:

- **Schrittweite:** $\\abs{x_{k+1} - x_k} \\le \\text{tol}\\cdot\\max(1, \\abs{x_{k+1}})$ (relativ und absolut).
- **Residuum:** $\\abs{f(x_k)} \\le \\text{tol}_f$ – Vorsicht bei sehr flachen oder sehr steilen Funktionen.
- **Maximale Iterationszahl** als Sicherung gegen Divergenz und Zyklen.

Genauer als etwa $\\varepsilon_{\\text{mach}} \\cdot \\kappa$ kann keine Rechnung werden (siehe [Gleitkommazahlen](#/mathe/numerik/gleitkomma)); eine Toleranz von $10^{-20}$ bei \`double\` führt nur zu Endlosschleifen.

## Zusammenfassung

| Verfahren | Ordnung | braucht | Konvergenz garantiert? |
|---|---|---|---|
| Bisektion | 1 (halbiert pro Schritt) | Vorzeichenwechsel | ja |
| Newton | 2 | $f'$, guten Startwert | nur lokal |
| Sekante | $\\approx 1{,}618$ | zwei Startwerte | nur lokal |
| Fixpunktiteration | 1 (falls $\\abs{g'} < 1$) | geeignete Umformung $g$ | unter Banach-Bedingung |

In der Praxis: Bisektion für Robustheit, Newton bzw. Sekante für Geschwindigkeit – am besten kombiniert, immer mit maximaler Iterationszahl.
`;export{e as default};
