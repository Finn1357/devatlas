const n=`---
id: folgen-grenzwerte
title: Folgen und Grenzwerte
module: analysis-1
order: 1
difficulty: fortgeschritten
minutes: 45
summary: Folgen, die Epsilon-Definition der Konvergenz, Rechenregeln für Grenzwerte, Monotonie und Beschränktheit, wichtige Standardgrenzwerte und bestimmte Divergenz.
tags: [Folge, Grenzwert, Konvergenz, Epsilon, Monotonie, Beschränktheit, Eulersche Zahl]
requires: [praedikatenlogik, vollstaendige-induktion]
---

## Folgen

> [!DEFINITION] Folge
> Eine (reelle) **Folge** ist eine Abbildung $\\N \\to \\R$, $n \\mapsto a_n$. Man schreibt $(a_n)_{n \\in \\N}$ oder kurz $(a_n)$; $a_n$ heißt $n$-tes **Folgenglied**.

Folgen können explizit gegeben sein, etwa $a_n = \\tfrac{1}{n+1}$ oder $a_n = (-1)^n$, oder **rekursiv**, etwa $a_0 = 1$, $a_{n+1} = \\tfrac12\\left(a_n + \\tfrac{2}{a_n}\\right)$ – das Heron-Verfahren, das sehr schnell gegen $\\sqrt 2$ läuft. Iterative Algorithmen erzeugen genau solche Folgen: Näherungswerte, Fehler pro Iteration, Laufzeiten für wachsende Eingaben.

## Konvergenz

Intuitiv konvergiert $(a_n)$ gegen $a$, wenn die Glieder „irgendwann beliebig nahe“ bei $a$ liegen. Die Präzisierung dieses „beliebig nahe“ war eine der großen Leistungen der Mathematik des 19. Jahrhunderts.

> [!DEFINITION] Grenzwert
> Die Folge $(a_n)$ **konvergiert** gegen $a \\in \\R$, wenn
> $$
> \\forall \\varepsilon > 0 \\;\\; \\exists N \\in \\N \\;\\; \\forall n \\ge N: \\; \\abs{a_n - a} < \\varepsilon .
> $$
> Dann heißt $a$ **[[Grenzwert]]** (Limes), und man schreibt $\\lim_{n\\to\\infty} a_n = a$ oder $a_n \\to a$. Eine Folge, die gegen keine Zahl konvergiert, heißt **divergent**.

Lies die Definition als Spiel: Ein Gegner gibt eine Toleranz $\\varepsilon$ vor; du musst einen Index $N$ finden, ab dem **alle** Glieder im Streifen $(a - \\varepsilon, a + \\varepsilon)$ liegen. Gelingt das für jedes $\\varepsilon$, konvergiert die Folge. Endlich viele Ausreißer am Anfang spielen keine Rolle.

> [!BEISPIEL] Ein Epsilon-Beweis
> **Behauptung:** $a_n = \\frac{2n + 1}{n + 3} \\to 2$.
>
> **Vorüberlegung:** $\\abs{a_n - 2} = \\left\\lvert \\frac{2n + 1 - 2n - 6}{n + 3} \\right\\rvert = \\frac{5}{n + 3} < \\frac5n$.
>
> **Beweis:** Sei $\\varepsilon > 0$. Wähle $N \\in \\N$ mit $N > \\frac5\\varepsilon$ (das geht, weil $\\N$ nach oben unbeschränkt ist). Für alle $n \\ge N$ gilt dann $\\abs{a_n - 2} < \\frac5n \\le \\frac5N < \\varepsilon$.

Typisch ist die Vorüberlegung „rückwärts“: Man schätzt $\\abs{a_n - a}$ durch einen einfachen Ausdruck in $n$ ab und liest ab, wie groß $N$ sein muss.

> [!SATZ] Eindeutigkeit des Grenzwerts
> Eine Folge hat höchstens einen Grenzwert.

> [!BEWEIS]
> Angenommen, $a_n \\to a$ und $a_n \\to b$ mit $a \\neq b$. Setze $\\varepsilon = \\tfrac{\\abs{a - b}}{2} > 0$. Ab einem $N_1$ ist $\\abs{a_n - a} < \\varepsilon$, ab einem $N_2$ ist $\\abs{a_n - b} < \\varepsilon$. Für $n \\ge \\max(N_1, N_2)$ folgt mit der Dreiecksungleichung
> $$
> \\abs{a - b} \\le \\abs{a - a_n} + \\abs{a_n - b} < 2\\varepsilon = \\abs{a - b},
> $$
> ein Widerspruch.

> [!BEISPIEL] Divergenz
> $a_n = (-1)^n$ divergiert: Wäre $a$ der Grenzwert, müssten für $\\varepsilon = 1$ ab einem Index alle Glieder in $(a - 1, a + 1)$ liegen. Dieses Intervall hat die Länge 2, kann also nicht gleichzeitig $1$ und $-1$ enthalten (deren Abstand ist 2 und die Intervallgrenzen gehören nicht dazu).

## Beschränktheit und Monotonie

> [!DEFINITION] Beschränkt, monoton
> $(a_n)$ heißt **beschränkt**, wenn es $C$ gibt mit $\\abs{a_n} \\le C$ für alle $n$. Sie heißt **monoton wachsend**, wenn $a_{n+1} \\ge a_n$ für alle $n$ (streng: $>$), und entsprechend **monoton fallend**.

> [!SATZ] Konvergente Folgen sind beschränkt
> Jede konvergente Folge ist beschränkt.

> [!BEWEIS]
> Sei $a_n \\to a$. Zu $\\varepsilon = 1$ gibt es $N$ mit $\\abs{a_n - a} < 1$, also $\\abs{a_n} < \\abs a + 1$ für $n \\ge N$. Dann ist $C = \\max(\\abs{a_0}, \\dots, \\abs{a_{N-1}}, \\abs a + 1)$ eine Schranke für alle Glieder.

Die Umkehrung gilt nicht – $(-1)^n$ ist beschränkt, aber divergent. Kommt aber Monotonie dazu, erzwingt das Konvergenz:

> [!SATZ] Monotoniekriterium
> Jede monoton wachsende, nach oben beschränkte Folge konvergiert (gegen das Supremum ihrer Glieder). Ebenso konvergiert jede monoton fallende, nach unten beschränkte Folge.

Dieser Satz beruht auf der **Vollständigkeit** der reellen Zahlen: Jede nach oben beschränkte nichtleere Menge reeller Zahlen hat eine kleinste obere Schranke. In $\\Q$ gilt er nicht – das Heron-Verfahren erzeugt nur rationale Glieder, deren Grenzwert $\\sqrt 2$ aber nicht rational ist. Das Monotoniekriterium ist oft der einzige Weg, Konvergenz zu zeigen, **ohne** den Grenzwert zu kennen.

## Rechenregeln

> [!SATZ] Grenzwertsätze
> Gilt $a_n \\to a$ und $b_n \\to b$, so folgt
> $$
> a_n \\pm b_n \\to a \\pm b, \\qquad a_n b_n \\to ab, \\qquad \\frac{a_n}{b_n} \\to \\frac ab \\;\\;(\\text{falls } b \\neq 0), \\qquad \\abs{a_n} \\to \\abs a .
> $$
> Außerdem bleiben Ungleichungen erhalten: Aus $a_n \\le b_n$ für alle $n$ folgt $a \\le b$.

> [!MISTAKE] Strikte Ungleichungen
> Aus $a_n < b_n$ folgt nur $a \\le b$, nicht $a < b$: $\\tfrac1n > 0$ für alle $n \\ge 1$, aber $\\lim \\tfrac1n = 0$.

Mit den Rechenregeln erledigt man Quotienten von Polynomen durch Ausklammern der höchsten Potenz:
$$
\\frac{3n^2 - n + 7}{5n^2 + 2} = \\frac{3 - \\frac1n + \\frac{7}{n^2}}{5 + \\frac{2}{n^2}} \\longrightarrow \\frac{3 - 0 + 0}{5 + 0} = \\frac35 .
$$

**Merkregel für Polynomquotienten:** Ist der Zählergrad kleiner als der Nennergrad, ist der Grenzwert $0$; sind die Grade gleich, ist er der Quotient der Leitkoeffizienten; ist der Zählergrad größer, divergiert die Folge.

> [!SATZ] Einschließungskriterium (Sandwich)
> Gilt $a_n \\le c_n \\le b_n$ ab einem Index und $a_n \\to L$, $b_n \\to L$, so folgt $c_n \\to L$.

> [!BEISPIEL] Sandwich
> $\\frac{\\sin n}{n} \\to 0$, denn $-\\frac1n \\le \\frac{\\sin n}{n} \\le \\frac1n$ und beide Schranken gehen gegen $0$. Allgemein gilt: **Nullfolge mal beschränkte Folge ist Nullfolge.**

## Standardgrenzwerte

| Folge | Grenzwert | Bedingung |
|---|---|---|
| $\\frac{1}{n^\\alpha}$ | $0$ | $\\alpha > 0$ |
| $q^n$ | $0$ | $\\abs q < 1$ |
| $\\sqrt[n]{a}$ | $1$ | $a > 0$ |
| $\\sqrt[n]{n}$ | $1$ | |
| $\\frac{n^k}{q^n}$ | $0$ | $q > 1$, $k$ beliebig |
| $\\frac{q^n}{n!}$ | $0$ | $q$ beliebig |
| $\\left(1 + \\frac1n\\right)^n$ | $\\e \\approx 2{,}71828$ | |
| $\\left(1 + \\frac xn\\right)^n$ | $\\e^x$ | $x \\in \\R$ |

Die Zeilen 5 und 6 bilden eine **Wachstumshierarchie**: Für große $n$ gilt
$$
\\log n \\ll n^k \\ll q^n \\ll n! \\ll n^n \\qquad (k > 0, \\; q > 1),
$$
wobei $f \\ll g$ heißt: $\\frac{f(n)}{g(n)} \\to 0$. Genau diese Hierarchie steckt hinter der Einordnung von Laufzeiten mit der [Big-O-Notation](#/artikel/big-o) – ein Algorithmus in $O(n^3)$ schlägt einen in $O(2^n)$ ab einer gewissen Eingabegröße immer.

> [!BEISPIEL] Zinseszins und e
> Ein Kapital von 1 € mit 100 % Jahreszins wächst bei $n$ Verzinsungen pro Jahr auf $\\left(1 + \\frac1n\\right)^n$ €: jährlich 2 €, monatlich $\\approx 2{,}613$ €, täglich $\\approx 2{,}7146$ €. Bei „stetiger“ Verzinsung ist der Grenzwert $\\e$ – so entsteht die Eulersche Zahl.

## Bestimmte Divergenz

> [!DEFINITION] Uneigentliche Grenzwerte
> $(a_n)$ **divergiert bestimmt** gegen $+\\infty$, wenn $\\forall C \\in \\R \\;\\exists N\\;\\forall n \\ge N: a_n > C$. Man schreibt $a_n \\to \\infty$. Analog für $-\\infty$.

$n^2 \\to \\infty$ und $-2^n \\to -\\infty$, aber $(-1)^n n$ divergiert unbestimmt (die Glieder springen zwischen großen positiven und negativen Werten). Für die Rechenregeln gilt: $\\infty$ ist **keine Zahl**. Ausdrücke wie $\\infty - \\infty$, $\\tfrac\\infty\\infty$, $0 \\cdot \\infty$ sind **unbestimmt** und müssen im Einzelfall untersucht werden.

> [!BEISPIEL] Unbestimmter Ausdruck ∞ − ∞
> $\\sqrt{n^2 + n} - n$: Erweitern mit $\\sqrt{n^2 + n} + n$ ergibt
> $$
> \\frac{(n^2 + n) - n^2}{\\sqrt{n^2 + n} + n} = \\frac{n}{\\sqrt{n^2 + n} + n} = \\frac{1}{\\sqrt{1 + \\frac1n} + 1} \\longrightarrow \\frac12 .
> $$

## Zusammenfassung

- $a_n \\to a$ heißt: Für jedes $\\varepsilon > 0$ liegen ab einem $N$ alle Glieder näher als $\\varepsilon$ bei $a$.
- Grenzwerte sind eindeutig; konvergente Folgen sind beschränkt; monoton + beschränkt ⇒ konvergent.
- Grenzwertsätze, Ausklammern der höchsten Potenz und das Sandwich-Kriterium erledigen die meisten Fälle.
- Wachstumshierarchie $\\log n \\ll n^k \\ll q^n \\ll n!$ – die Grundlage der asymptotischen Laufzeitanalyse.
`;export{n as default};
