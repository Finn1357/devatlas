const e=`---
id: markow-ketten
title: Markow-Ketten und PageRank
module: stochastik
order: 5
difficulty: fortgeschritten
minutes: 50
summary: Zufallsprozesse ohne Gedächtnis – Übergangsmatrix, Chapman-Kolmogorow, stationäre Verteilung, Konvergenzsatz, Absorption und Treffzeiten bis zu PageRank mit Dämpfung und der Potenzmethode.
tags: [Markow-Kette, Übergangsmatrix, Stationäre Verteilung, PageRank, Irrfahrt, Absorption, Potenzmethode]
requires: [wahrscheinlichkeitsraeume, matrizen, eigenwerte]
---

## Zufall mit kurzem Gedächtnis

Viele Systeme springen zufällig zwischen endlich vielen Zuständen: ein Server ist verfügbar oder gestört, ein Surfer liest eine von Milliarden Webseiten, eine Warteschlange enthält 0, 1 oder 2 Jobs, ein Spieler hat 0 bis 4 Euro. Wie es weitergeht, hängt oft nur vom **aktuellen** Zustand ab, nicht von der Vorgeschichte. Genau diese Annahme macht solche Prozesse berechenbar – mit den Werkzeugen der [Matrizen](#/mathe/lineare-algebra/matrizen) und [Eigenwerte](#/mathe/lineare-algebra/eigenwerte).

> [!DEFINITION] Markow-Kette
> Eine Folge von Zufallsvariablen $X_0, X_1, X_2, \\dots$ mit Werten in einer endlichen Zustandsmenge $S = \\{1, \\dots, n\\}$ heißt (homogene) **[[Markow-Kette]]**, wenn für alle $k$ und alle Zustände
> $$
> P(X_{k+1} = j \\mid X_k = i, X_{k-1} = i_{k-1}, \\dots, X_0 = i_0) = P(X_{k+1} = j \\mid X_k = i) = p_{ij} .
> $$
> Die Zahlen $p_{ij}$ hängen nicht von $k$ ab. Die Matrix $P = (p_{ij})$ heißt **Übergangsmatrix**.

Jede Zeile von $P$ ist eine Wahrscheinlichkeitsverteilung: $p_{ij} \\ge 0$ und $\\sum_j p_{ij} = 1$. Solche Matrizen heißen **stochastisch**. Anschaulich ist eine Markow-Kette ein gerichteter [Graph](#/mathe/diskrete-mathematik/graphen), dessen Kanten mit Übergangswahrscheinlichkeiten beschriftet sind.

> [!BEISPIEL] Wetter in zwei Zuständen
> Auf einen sonnigen Tag folgt mit Wahrscheinlichkeit $0{,}9$ wieder Sonne, auf einen Regentag mit Wahrscheinlichkeit $0{,}5$ Sonne. Mit der Reihenfolge (Sonne, Regen):
> $$
> P = \\begin{pmatrix} 0{,}9 & 0{,}1 \\\\ 0{,}5 & 0{,}5 \\end{pmatrix} .
> $$
> Die Zeilen summieren sich zu $1$; die Spalten müssen das nicht.

## Mehrere Schritte: Matrixpotenzen

Die Verteilung zur Zeit $k$ schreiben wir als **Zeilenvektor** $\\mu_k = \\big(P(X_k = 1), \\dots, P(X_k = n)\\big)$. Nach dem Satz von der totalen Wahrscheinlichkeit ist $P(X_{k+1} = j) = \\sum_i P(X_k = i)\\, p_{ij}$, also
$$
\\mu_{k+1} = \\mu_k P \\qquad\\text{und damit}\\qquad \\mu_k = \\mu_0 P^k .
$$

> [!SATZ] Chapman-Kolmogorow-Gleichung
> Die Wahrscheinlichkeit, in genau $m$ Schritten von $i$ nach $j$ zu kommen, ist der Eintrag $(P^m)_{ij}$. Insbesondere gilt
> $$
> (P^{m + l})_{ij} = \\sum_{s \\in S} (P^m)_{is}\\,(P^l)_{sj} .
> $$

> [!BEWEIS]
> Induktion über $m$; der Fall $m = 1$ ist die Definition. Zerlegt man nach dem Zustand $s$ nach $m$ Schritten und nutzt die Markow-Eigenschaft (die Zukunft ab $s$ hängt nicht davon ab, wie man nach $s$ kam), folgt
> $$
> P(X_{m+l} = j \\mid X_0 = i) = \\sum_s P(X_m = s \\mid X_0 = i)\\, P(X_{m+l} = j \\mid X_m = s),
> $$
> und das ist genau der Eintrag $(i, j)$ des Matrixprodukts $P^m P^l$.

> [!BEISPIEL] Übermorgen Regen?
> Im Wettermodell ist
> $$
> P^2 = \\begin{pmatrix} 0{,}86 & 0{,}14 \\\\ 0{,}70 & 0{,}30 \\end{pmatrix} .
> $$
> Ist heute Sonne, regnet es übermorgen mit Wahrscheinlichkeit $0{,}9 \\cdot 0{,}1 + 0{,}1 \\cdot 0{,}5 = 0{,}14$ – der Weg über einen Sonnen- und der über einen Regentag werden addiert.

## Stationäre Verteilung

Rechnet man $P^k$ für wachsendes $k$ aus, werden die Zeilen einander immer ähnlicher: Nach langer Zeit spielt der Startzustand keine Rolle mehr. Die Grenzverteilung erfüllt eine einfache Gleichung.

> [!DEFINITION] Stationäre Verteilung
> Ein Zeilenvektor $\\pi = (\\pi_1, \\dots, \\pi_n)$ mit $\\pi_i \\ge 0$ und $\\sum_i \\pi_i = 1$ heißt **stationär**, wenn
> $$
> \\pi P = \\pi .
> $$
> Startet die Kette mit Verteilung $\\pi$, hat sie zu jedem Zeitpunkt die Verteilung $\\pi$.

$\\pi$ ist also ein **Linkseigenvektor** von $P$ zum Eigenwert $1$ – äquivalent ein Eigenvektor von $P^{\\mathsf T}$. Den Eigenwert $1$ hat jede stochastische Matrix, denn $P\\mathbf 1 = \\mathbf 1$ für den Einsvektor. In der Lektion über [Eigenwerte](#/mathe/lineare-algebra/eigenwerte) steht PageRank in der transponierten Schreibweise mit Spaltensummen $1$ und $P\\vec r = \\vec r$; inhaltlich ist es dasselbe.

> [!SATZ] Zwei Zustände
> Für $P = \\begin{pmatrix} 1 - a & a \\\\ b & 1 - b \\end{pmatrix}$ mit $0 < a + b$ ist
> $$
> \\pi = \\left(\\frac{b}{a + b},\\ \\frac{a}{a + b}\\right),
> $$
> und $P$ hat die Eigenwerte $1$ und $1 - a - b$.

> [!BEWEIS]
> $\\pi P = \\pi$ bedeutet in der ersten Komponente $\\pi_1(1 - a) + \\pi_2 b = \\pi_1$, also $a\\pi_1 = b\\pi_2$: Der Fluss von Zustand 1 nach 2 ist im Gleichgewicht so groß wie der Rückfluss. Mit $\\pi_1 + \\pi_2 = 1$ folgt die Formel. Die Spur ist $2 - a - b$, die Summe der Eigenwerte also $1 + (1 - a - b)$.

Für das Wetter ($a = 0{,}1$, $b = 0{,}5$) ergibt sich $\\pi = \\left(\\frac56, \\frac16\\right)$: Langfristig ist jeder sechste Tag ein Regentag. Der zweite Eigenwert $1 - a - b = 0{,}4$ bestimmt die Geschwindigkeit: Der Abstand $\\mu_k - \\pi$ schrumpft pro Tag um den Faktor $0{,}4$.

> [!MERKE] Mittlere Rückkehrzeit
> Für eine irreduzible Kette mit stationärer Verteilung $\\pi$ ist die erwartete Zeit bis zur Rückkehr in den Startzustand $i$ gleich $\\frac{1}{\\pi_i}$. Nach einem Regentag dauert es im Mittel $6$ Tage bis zum nächsten.

### Gleichgewicht der Flüsse

Bei Ketten, die nur zwischen Nachbarzuständen springen (Geburts- und Todesprozesse wie Warteschlangen), genügt oft die **detaillierte Bilanz** $\\pi_i p_{ij} = \\pi_j p_{ji}$ für alle Nachbarn. Für eine Warteschlange mit $0$, $1$ oder $2$ Jobs und
$$
P = \\begin{pmatrix} \\frac12 & \\frac12 & 0 \\\\ \\frac14 & \\frac12 & \\frac14 \\\\ 0 & \\frac12 & \\frac12 \\end{pmatrix}
$$
liefert sie $\\pi_0 \\cdot \\frac12 = \\pi_1 \\cdot \\frac14$ und $\\pi_1 \\cdot \\frac14 = \\pi_2 \\cdot \\frac12$, also $\\pi = \\left(\\frac14, \\frac12, \\frac14\\right)$. Startet man leer, $\\mu_0 = (1, 0, 0)$, so ist $\\mu_1 = \\left(\\frac12, \\frac12, 0\\right)$, $\\mu_2 = \\left(\\frac38, \\frac12, \\frac18\\right)$, $\\mu_3 = \\left(\\frac{5}{16}, \\frac12, \\frac{3}{16}\\right)$ – ab dem ersten Schritt halbiert sich der Abstand zu $\\pi$ mit jedem weiteren, passend zu den Eigenwerten $1$, $\\frac12$ und $0$ von $P$.

## Wann konvergiert die Kette?

Zwei Dinge können die Konvergenz verhindern.

> [!DEFINITION] Irreduzibel und aperiodisch
> Eine Kette heißt **irreduzibel**, wenn man von jedem Zustand jeden anderen mit positiver Wahrscheinlichkeit erreicht (der Übergangsgraph ist stark zusammenhängend). Die **Periode** eines Zustands ist der größte gemeinsame Teiler aller $m \\ge 1$ mit $(P^m)_{ii} > 0$; ist sie $1$, heißt der Zustand **aperiodisch**.

- **Reduzibel:** Zerfällt der Graph in Teile, die sich nicht gegenseitig erreichen, gibt es mehrere stationäre Verteilungen, und welche man erreicht, hängt vom Start ab.
- **Periodisch:** Für $P = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$ springt die Kette stur hin und her. $\\pi = \\left(\\frac12, \\frac12\\right)$ ist stationär, aber $P^k$ wechselt zwischen $I$ und $P$ und konvergiert nicht.

> [!SATZ] Konvergenzsatz für endliche Markow-Ketten
> Ist die Kette irreduzibel und aperiodisch, so gibt es genau eine stationäre Verteilung $\\pi$, alle $\\pi_i$ sind positiv, und für **jede** Startverteilung gilt
> $$
> \\mu_0 P^k \\xrightarrow{\\;k \\to \\infty\\;} \\pi .
> $$
> Ohne Aperiodizität (nur irreduzibel) bleibt $\\pi$ eindeutig, und der Anteil der Zeit, den die Kette in Zustand $i$ verbringt, strebt fast sicher gegen $\\pi_i$ (Ergodensatz).

Der Beweis nutzt den Satz von Perron-Frobenius: Für eine solche Matrix ist $1$ ein einfacher Eigenwert, und alle anderen Eigenwerte haben Betrag kleiner $1$. Die Konvergenzgeschwindigkeit bestimmt der betragsmäßig zweitgrößte Eigenwert $\\abs{\\lambda_2}$: Der Fehler fällt etwa wie $\\abs{\\lambda_2}^k$ – dieselbe Rechnung wie bei den Matrixpotenzen $A^k = SD^kS^{-1}$ in der Eigenwert-Lektion.

## Absorption und Treffzeiten

Manche Zustände verlässt man nie mehr: Ein Spieler ist pleite, ein Paket wurde zugestellt, ein Algorithmus hat terminiert. Ein Zustand mit $p_{ii} = 1$ heißt **absorbierend**. Die entscheidenden Fragen sind dann: *Wo* wird die Kette absorbiert, und *wann*?

> [!SATZ] Analyse des ersten Schritts
> Sei $A$ eine Menge absorbierender Zielzustände und $h_i$ die Wahrscheinlichkeit, von $i$ aus $A$ zu erreichen. Dann ist $h_i = 1$ für $i \\in A$, $h_i = 0$ für die übrigen absorbierenden Zustände, und für alle anderen Zustände gilt
> $$
> h_i = \\sum_j p_{ij}\\, h_j .
> $$
> Ebenso erfüllen die erwarteten Schritte $k_i$ bis zur Absorption $k_i = 0$ auf absorbierenden Zuständen und sonst $k_i = 1 + \\sum_j p_{ij}\\, k_j$.

> [!BEWEIS]
> Man bedingt auf den ersten Schritt: Von $i$ geht es mit Wahrscheinlichkeit $p_{ij}$ nach $j$, und wegen der Markow-Eigenschaft ist die Chance, von dort $A$ zu erreichen, wieder $h_j$. Totale Wahrscheinlichkeit liefert die Gleichung. Für $k_i$ kommt der eine gemachte Schritt hinzu, danach wird der Erwartungswert ab $j$ fortgesetzt.

> [!BEISPIEL] Ruinproblem
> Du hast $k$ Euro, setzt in jeder Runde $1$ Euro, gewinnst mit Wahrscheinlichkeit $p$ und verlierst mit $q = 1 - p$. Das Spiel endet bei $0$ oder bei $N$ Euro. Die Gleichungen lauten $h_k = p\\,h_{k+1} + q\\,h_{k-1}$ mit $h_0 = 0$, $h_N = 1$.
>
> - Für $p = \\frac12$ ist $h$ linear: $h_k = \\frac{k}{N}$. Die erwartete Spieldauer ist $k(N - k)$, denn $f(k) = k(N - k)$ erfüllt $f(k) = 1 + \\frac12\\big(f(k-1) + f(k+1)\\big)$.
> - Für $p \\neq \\frac12$ ist mit $r = \\frac qp$
> $$
> h_k = \\frac{r^k - 1}{r^N - 1} .
> $$
> Mit $p = 0{,}4$, $k = 2$, $N = 4$ ist $r = \\frac32$ und $h_2 = \\frac{9/4 - 1}{81/16 - 1} = \\frac{5/4}{65/16} = \\frac{4}{13} \\approx 0{,}308$ – deutlich weniger als die $\\frac12$ eines fairen Spiels. Darauf beruht der Vorteil jedes Casinos.

## PageRank

Wie wichtig ist eine Webseite? Die Idee von Brin und Page: Ein **zufälliger Surfer** klickt auf jeder Seite einen der ausgehenden Links mit gleicher Wahrscheinlichkeit. Wichtig ist eine Seite, wenn der Surfer langfristig oft dort ist – ihre Wichtigkeit ist ihr Eintrag in der stationären Verteilung.

> [!BEISPIEL] Drei Seiten
> Seite $A$ verlinkt auf $B$ und $C$, Seite $B$ auf $C$, Seite $C$ auf $A$:
> $$
> P = \\begin{pmatrix} 0 & \\frac12 & \\frac12 \\\\ 0 & 0 & 1 \\\\ 1 & 0 & 0 \\end{pmatrix} .
> $$
> Aus $\\pi P = \\pi$ folgt $\\pi_A = \\pi_C$, $\\pi_B = \\frac12\\pi_A$ und mit der Normierung $\\pi = \\left(\\frac25, \\frac15, \\frac25\\right)$. $A$ ist so wichtig wie $C$, obwohl $A$ nur einen eingehenden Link hat: Er kommt von der wichtigen Seite $C$, die ihre ganze Wichtigkeit an $A$ weitergibt.

Im echten Web scheitert das naive Modell: Seiten ohne ausgehende Links (Sackgassen) haben Nullzeilen, und abgeschlossene Seitengruppen machen die Kette reduzibel. Die Lösung ist die **Dämpfung**: Mit Wahrscheinlichkeit $d$ (typisch $0{,}85$) folgt der Surfer einem Link, sonst springt er auf eine zufällige der $n$ Seiten:
$$
G = d\\,P + \\frac{1 - d}{n}\\,\\mathbf 1\\mathbf 1^{\\mathsf T}, \\qquad \\pi G = \\pi .
$$
Sackgassen ersetzt man vorher durch Gleichverteilungszeilen. Alle Einträge von $G$ sind positiv, also ist die Kette irreduzibel und aperiodisch, und der Konvergenzsatz garantiert eine eindeutige Rangfolge.

> [!BEISPIEL] Drei Seiten mit Dämpfung
> Mit $d = \\frac{17}{20}$ lauten die Gleichungen $\\pi_A = \\frac1{20} + \\frac{17}{20}\\pi_C$, $\\pi_B = \\frac1{20} + \\frac{17}{40}\\pi_A$ und $\\pi_C = \\frac1{20} + \\frac{17}{40}\\pi_A + \\frac{17}{20}\\pi_B$. Einsetzen ergibt exakt
> $$
> \\pi = \\frac{1}{1769}\\,(686,\\ 380,\\ 703) \\approx (0{,}3878;\\ 0{,}2148;\\ 0{,}3974) .
> $$
> Jetzt liegt $C$ knapp vor $A$: Durch die zufälligen Sprünge landet der Surfer öfter auf $B$ ($0{,}2148$ statt $0{,}2$), und $B$ gibt alles an $C$ weiter; $A$ erhält dagegen nur den gedämpften Anteil von $C$.

### Die Potenzmethode

Für Milliarden Seiten löst niemand ein Gleichungssystem. Die [[Potenzmethode]] startet mit der Gleichverteilung und multipliziert wiederholt: $\\mu_{k+1} = \\mu_k G$. Die übrigen Eigenwerte von $G$ sind $d\\lambda_2, \\dots, d\\lambda_n$ (mit den Eigenwerten $\\lambda_i$ von $P$), also hat jeder Betrag höchstens $d$. Noch direkter: Der Fehler $e_k = \\mu_k - \\pi$ hat die Komponentensumme $0$, deshalb fällt der Sprunganteil weg, und es gilt $e_{k+1} = e_k G = d\\,e_k P$. Da $P$ Zeilensummen $1$ hat, wächst die Summe der Beträge bei Multiplikation mit $P$ nicht – der Fehler schrumpft in dieser Norm in **jedem** Schritt mindestens um den Faktor $d = 0{,}85$, unabhängig von der Größe des Webs. Im Drei-Seiten-Beispiel hat $P$ die Eigenwerte $1$ und $-\\frac12 \\pm \\frac12\\mathrm{i}$ mit Betrag $\\frac{1}{\\sqrt2}$; der Fehler fällt daher pro Schritt sogar um etwa $0{,}85 \\cdot 0{,}707 \\approx 0{,}6$.

\`\`\`python title="PageRank mit der Potenzmethode"
import numpy as np

def pagerank(P, d=0.85, tol=1e-12, max_iter=1000):
    n = P.shape[0]
    P = P.copy()
    P[P.sum(axis=1) == 0] = 1 / n          # Sackgassen: zufälliger Sprung
    G = d * P + (1 - d) / n                 # alle Einträge positiv
    pi = np.full(n, 1 / n)
    for _ in range(max_iter):
        neu = pi @ G                        # Zeilenvektor mal Matrix
        if np.abs(neu - pi).sum() < tol:
            return neu
        pi = neu
    raise RuntimeError("keine Konvergenz")

P = np.array([[0, .5, .5], [0, 0, 1], [1, 0, 0]])
print(pagerank(P))   # [0.38779 0.21481 0.39740]
\`\`\`

Der gespeicherte Vektor hat nur $n$ Einträge, und $\\mu_k P$ kostet bei dünn besetztem $P$ nur so viele Operationen, wie es Links gibt. $G$ selbst wird nie als volle Matrix gebildet: $\\mu G = d\\,\\mu P + \\frac{1-d}{n}\\mathbf 1^{\\mathsf T}$, weil $\\mu$ die Summe $1$ hat.

## Markow-Ketten in der Informatik

- **Suchmaschinen und Empfehlungen:** PageRank, Graph-basierte Rankings, zufällige Irrfahrten auf sozialen Netzen.
- **Sprachmodelle:** Ein $n$-Gramm-Modell ist eine Markow-Kette über Wortfolgen. Hidden-Markov-Modelle verbinden eine verborgene Kette mit der [Bayes-Formel](#/mathe/stochastik/wahrscheinlichkeitsraeume) und erkennen so Sprache oder Gene.
- **Sampling:** Markov Chain Monte Carlo (Metropolis-Hastings) konstruiert eine Kette, deren stationäre Verteilung die gewünschte Zielverteilung ist.
- **Leistungsanalyse:** Warteschlangen, Ausfall- und Reparaturmodelle für Server, Verfügbarkeit von Clustern.
- **Reinforcement Learning:** Markow-Entscheidungsprozesse erweitern Ketten um Aktionen und Belohnungen.
- **Algorithmen:** Die erwartete Laufzeit randomisierter Algorithmen (etwa des Zufallsalgorithmus für 2-SAT) folgt aus Treffzeiten von Irrfahrten.

## Zusammenfassung

- Markow-Eigenschaft: Die Zukunft hängt nur vom aktuellen Zustand ab. Übergangsmatrix $P$ mit Zeilensummen $1$.
- Verteilungen sind Zeilenvektoren: $\\mu_k = \\mu_0 P^k$; $(P^m)_{ij}$ ist die $m$-Schritt-Wahrscheinlichkeit.
- Stationäre Verteilung: $\\pi P = \\pi$, Linkseigenvektor zum Eigenwert $1$. Bei zwei Zuständen $\\pi = \\left(\\frac{b}{a+b}, \\frac{a}{a+b}\\right)$; mittlere Rückkehrzeit $\\frac1{\\pi_i}$.
- Irreduzibel und aperiodisch ⇒ eindeutiges $\\pi$ und Konvergenz von jedem Start; Tempo $\\abs{\\lambda_2}^k$.
- Absorption und Treffzeiten über die Analyse des ersten Schritts: $h_i = \\sum_j p_{ij} h_j$, $k_i = 1 + \\sum_j p_{ij} k_j$.
- PageRank ist die stationäre Verteilung der gedämpften Kette $G = dP + \\frac{1-d}{n}\\mathbf 1\\mathbf 1^{\\mathsf T}$, berechnet mit der Potenzmethode.
`;export{e as default};
