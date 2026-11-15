const e=`---
id: verteilungen
title: Wichtige Verteilungen
module: stochastik
order: 3
difficulty: fortgeschritten
minutes: 50
summary: Bernoulli-, Binomial-, geometrische und Poisson-Verteilung, stetige Zufallsvariablen mit Dichte, Gleich- und Exponentialverteilung, die Normalverteilung mit Standardisierung und der zentrale Grenzwertsatz.
tags: [Binomialverteilung, Poisson, Geometrische Verteilung, Exponentialverteilung, Normalverteilung, Zentraler Grenzwertsatz]
requires: [zufallsvariablen]
---

## Diskrete Verteilungen

Einige Verteilungen tauchen so oft auf, dass man sie mit Namen, Formeln und Kennzahlen kennen sollte. Alle Werte kannst du im [Verteilungsrechner](#/mathe/labor/verteilungen) nachrechnen und als Diagramm ansehen.

### Bernoulli und Binomial

Ein **Bernoulli-Experiment** hat zwei Ausgänge: Erfolg (Wahrscheinlichkeit $p$) oder Misserfolg ($1 - p$). Wiederholt man es $n$-mal **unabhängig** und zählt die Erfolge, erhält man eine binomialverteilte Zufallsvariable.

> [!SATZ] Binomialverteilung B(n, p)
> Die Anzahl $X$ der Erfolge in $n$ unabhängigen Bernoulli-Versuchen mit Erfolgswahrscheinlichkeit $p$ erfüllt
> $$
> P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}, \\qquad k = 0, 1, \\dots, n,
> $$
> mit $\\E[X] = np$ und $\\Var(X) = np(1-p)$.

> [!BEWEIS]
> Eine bestimmte Folge mit $k$ Erfolgen und $n - k$ Misserfolgen hat wegen der Unabhängigkeit die Wahrscheinlichkeit $p^k(1-p)^{n-k}$. Es gibt $\\binom nk$ Möglichkeiten, die Positionen der Erfolge zu wählen ([[Binomialkoeffizient]]). Für Erwartungswert und Varianz schreibt man $X = X_1 + \\dots + X_n$ mit unabhängigen Bernoulli-Variablen, $\\E[X_i] = p$ und $\\Var(X_i) = p - p^2 = p(1-p)$, und summiert.

> [!BEISPIEL] Paketverluste
> Ein Netzwerk verliert jedes Paket unabhängig mit Wahrscheinlichkeit $p = 0{,}02$. Von $n = 100$ Paketen gehen im Mittel $np = 2$ verloren. Die Wahrscheinlichkeit, dass **keines** verloren geht, ist $0{,}98^{100} \\approx 0{,}133$; dass höchstens zwei verloren gehen:
> $$
> P(X \\le 2) = 0{,}98^{100} + 100 \\cdot 0{,}02 \\cdot 0{,}98^{99} + \\binom{100}{2} 0{,}02^2 \\cdot 0{,}98^{98} \\approx 0{,}677 .
> $$

### Geometrische Verteilung

Wie lange muss man auf den ersten Erfolg warten? Ist $X$ die Nummer des Versuchs mit dem ersten Erfolg, dann
$$
P(X = k) = (1 - p)^{k-1}\\, p, \\qquad k = 1, 2, \\dots, \\qquad \\E[X] = \\frac1p .
$$
Beim Würfeln wartet man im Mittel 6 Würfe auf die erste Sechs. Die geometrische Verteilung ist **gedächtnislos**: $P(X > m + k \\mid X > m) = P(X > k)$ – wer schon zehnmal keine Sechs hatte, hat dadurch keine bessere Chance beim nächsten Wurf.

> [!TIP] Retry mit Wartezeit
> Ein Request gelingt mit Wahrscheinlichkeit $p = 0{,}8$. Mit unabhängigen Wiederholungen braucht man im Mittel $\\frac1{0{,}8} = 1{,}25$ Versuche, und die Wahrscheinlichkeit, dass auch 3 Versuche nicht reichen, ist $0{,}2^3 = 0{,}008$. Die Annahme „unabhängig“ ist bei echten Ausfällen allerdings oft falsch – daher exponentielles Backoff.

### Poisson-Verteilung

> [!SATZ] Poisson-Verteilung
> Eine Zufallsvariable $X$ mit
> $$
> P(X = k) = \\frac{\\lambda^k}{k!}\\e^{-\\lambda}, \\qquad k = 0, 1, 2, \\dots
> $$
> heißt Poisson-verteilt mit Parameter $\\lambda > 0$. Es gilt $\\E[X] = \\Var(X) = \\lambda$.

Sie beschreibt die Anzahl seltener, unabhängiger Ereignisse in einem festen Zeitraum: Anfragen pro Sekunde an einen Server, Tippfehler pro Seite, radioaktive Zerfälle. Sie ist der Grenzfall der Binomialverteilung für großes $n$ und kleines $p$ mit $np = \\lambda$ (Poissonscher Grenzwertsatz). Im Paketbeispiel liefert die Näherung mit $\\lambda = 2$: $P(X = 0) \\approx \\e^{-2} \\approx 0{,}135$ statt exakt $0{,}133$.

> [!BEISPIEL] Lastspitzen
> Ein Server bekommt im Mittel $\\lambda = 4$ Anfragen pro Sekunde. Wie wahrscheinlich sind in einer Sekunde mehr als 8?
> $P(X > 8) = 1 - \\sum_{k=0}^{8} \\frac{4^k}{k!}\\e^{-4} \\approx 1 - 0{,}9786 = 0{,}0214$. In etwa jeder 47. Sekunde – bei der Kapazitätsplanung relevant.

## Stetige Zufallsvariablen

Messwerte, Zeiten und Längen sind kontinuierlich. Für sie ist jede einzelne Zahl unendlich unwahrscheinlich ($P(X = x) = 0$); Wahrscheinlichkeit verteilt sich wie Masse auf einem Stab.

> [!DEFINITION] Dichte
> Eine Zufallsvariable $X$ heißt **stetig** mit **Dichte** $f\\colon \\R \\to [0, \\infty)$, wenn
> $$
> P(a \\le X \\le b) = \\int_a^b f(x) \\dd x \\quad\\text{für alle } a \\le b, \\qquad \\int_{-\\infty}^{\\infty} f(x)\\dd x = 1 .
> $$
> Dann ist $\\E[X] = \\int_{-\\infty}^\\infty x f(x)\\dd x$ und $\\Var(X) = \\int (x - \\mu)^2 f(x)\\dd x$.

Summen werden zu [Integralen](#/mathe/analysis-2/integralrechnung). Eine Dichte ist **keine** Wahrscheinlichkeit und darf größer als 1 sein; nur Flächen unter ihr sind Wahrscheinlichkeiten.

### Gleich- und Exponentialverteilung

- **Gleichverteilung** auf $[a, b]$: $f(x) = \\frac{1}{b - a}$ dort, sonst 0; $\\E[X] = \\frac{a+b}{2}$, $\\Var(X) = \\frac{(b-a)^2}{12}$. \`Math.random()\` liefert (näherungsweise) gleichverteilte Zahlen in $[0, 1)$.
- **Exponentialverteilung** mit Rate $\\lambda > 0$: $f(x) = \\lambda\\e^{-\\lambda x}$ für $x \\ge 0$; $P(X > t) = \\e^{-\\lambda t}$, $\\E[X] = \\frac1\\lambda$, $\\Var(X) = \\frac{1}{\\lambda^2}$. Sie modelliert Wartezeiten zwischen Poisson-Ereignissen und Lebensdauern ohne Alterung – sie ist die stetige gedächtnislose Verteilung.

> [!BEISPIEL] Zeit bis zum nächsten Request
> Bei $\\lambda = 4$ Anfragen pro Sekunde ist die Wartezeit exponentialverteilt mit Mittelwert $0{,}25$ s. $P(\\text{länger als } 1 \\text{ s Ruhe}) = \\e^{-4} \\approx 0{,}018$.

## Die Normalverteilung

> [!DEFINITION] Normalverteilung N(μ, σ²)
> Eine stetige Zufallsvariable mit der Dichte
> $$
> \\varphi_{\\mu,\\sigma}(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} \\exp\\left(-\\frac{(x - \\mu)^2}{2\\sigma^2}\\right)
> $$
> heißt **normalverteilt** mit Erwartungswert $\\mu$ und Varianz $\\sigma^2$. Für $\\mu = 0$, $\\sigma = 1$ spricht man von der **Standardnormalverteilung**; ihre Verteilungsfunktion heißt $\\Phi$.

Die [[Normalverteilung]] ist symmetrisch um $\\mu$, hat Wendepunkte bei $\\mu \\pm \\sigma$ und fällt außerhalb schnell ab. Für $\\Phi$ gibt es keine elementare Formel; man nutzt Tabellen oder numerische Verfahren (im Rechner die Fehlerfunktion).

> [!SATZ] Standardisierung
> Ist $X \\sim N(\\mu, \\sigma^2)$, so ist $Z = \\frac{X - \\mu}{\\sigma} \\sim N(0, 1)$, und
> $$
> P(X \\le x) = \\Phi\\left(\\frac{x - \\mu}{\\sigma}\\right).
> $$

Jede Frage zur Normalverteilung lässt sich damit auf die eine Funktion $\\Phi$ zurückführen. Nützlich: $\\Phi(-z) = 1 - \\Phi(z)$.

| Bereich | Wahrscheinlichkeit |
|---|---|
| $\\mu \\pm \\sigma$ | $\\approx 68{,}3\\,\\%$ |
| $\\mu \\pm 1{,}96\\sigma$ | $\\approx 95\\,\\%$ |
| $\\mu \\pm 2\\sigma$ | $\\approx 95{,}4\\,\\%$ |
| $\\mu \\pm 3\\sigma$ | $\\approx 99{,}7\\,\\%$ |

> [!BEISPIEL] Antwortzeiten
> Antwortzeiten eines Dienstes seien $N(200\\,\\text{ms},\\, 30^2)$. Anteil über 260 ms: $P(X > 260) = 1 - \\Phi\\left(\\frac{260 - 200}{30}\\right) = 1 - \\Phi(2) \\approx 0{,}023$. Welche Zeit wird in 99 % der Fälle nicht überschritten? $x = \\mu + z_{0{,}99}\\sigma \\approx 200 + 2{,}326 \\cdot 30 \\approx 270$ ms – das **99. Perzentil** (P99), eine Standardmetrik im Monitoring.

> [!WARNING] Nicht alles ist normalverteilt
> Echte Latenzen sind meist **rechtsschief** mit langen Ausreißern („long tail“). Mittelwert und Standardabweichung beschreiben sie schlecht; deshalb misst man im Betrieb Perzentile direkt, statt eine Normalverteilung anzunehmen.

## Der zentrale Grenzwertsatz

Warum ist die Normalverteilung so verbreitet? Weil Summen vieler unabhängiger Einflüsse annähernd normalverteilt sind – fast egal, wie die einzelnen Einflüsse verteilt sind.

> [!SATZ] Zentraler Grenzwertsatz
> Seien $X_1, X_2, \\dots$ unabhängig und identisch verteilt mit Erwartungswert $\\mu$ und Varianz $0 < \\sigma^2 < \\infty$, und $S_n = X_1 + \\dots + X_n$. Dann gilt für alle $z \\in \\R$
> $$
> \\lim_{n\\to\\infty} P\\left(\\frac{S_n - n\\mu}{\\sigma\\sqrt n} \\le z\\right) = \\Phi(z) .
> $$

Praktisch heißt das: $S_n$ ist für großes $n$ ungefähr $N(n\\mu, n\\sigma^2)$ und der Mittelwert $\\bar X_n$ ungefähr $N\\!\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$. Darauf beruhen Konfidenzintervalle und Hypothesentests. Für die Binomialverteilung gilt die Faustregel: Bei $np(1-p) > 9$ ist die Näherung durch $N(np, np(1-p))$ gut.

> [!BEISPIEL] Münzwürfe
> 1000 faire Münzwürfe: $S \\approx N(500, 250)$, $\\sigma \\approx 15{,}8$. Mehr als 550-mal Kopf? $P(S > 550) \\approx 1 - \\Phi\\left(\\frac{550{,}5 - 500}{15{,}8}\\right) = 1 - \\Phi(3{,}19) \\approx 0{,}0007$. (Die $0{,}5$ ist die Stetigkeitskorrektur.) Wer 550-mal Kopf wirft, hat sehr wahrscheinlich keine faire Münze.

## Zusammenfassung

| Verteilung | $P(X = k)$ bzw. Dichte | $\\E[X]$ | $\\Var(X)$ |
|---|---|---|---|
| Binomial $B(n, p)$ | $\\binom nk p^k(1-p)^{n-k}$ | $np$ | $np(1-p)$ |
| Geometrisch | $(1-p)^{k-1}p$ | $\\frac1p$ | $\\frac{1-p}{p^2}$ |
| Poisson | $\\frac{\\lambda^k}{k!}\\e^{-\\lambda}$ | $\\lambda$ | $\\lambda$ |
| Gleichverteilung $[a, b]$ | $\\frac{1}{b-a}$ | $\\frac{a+b}{2}$ | $\\frac{(b-a)^2}{12}$ |
| Exponential | $\\lambda \\e^{-\\lambda x}$ | $\\frac1\\lambda$ | $\\frac1{\\lambda^2}$ |
| Normal $N(\\mu, \\sigma^2)$ | $\\frac{1}{\\sigma\\sqrt{2\\pi}}\\e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}$ | $\\mu$ | $\\sigma^2$ |

Standardisieren mit $Z = \\frac{X - \\mu}{\\sigma}$, und Summen vieler unabhängiger Größen sind nach dem zentralen Grenzwertsatz annähernd normalverteilt.
`;export{e as default};
