const n=`---
id: rekurrenzen-asymptotik
title: Asymptotik und Rekurrenzen
module: diskrete-mathematik
order: 2
difficulty: fortgeschritten
minutes: 50
summary: O-, Ω- und Θ-Notation präzise definiert, Rechenregeln und Wachstumshierarchie, lineare Rekurrenzen mit charakteristischer Gleichung, Divide-and-Conquer-Rekurrenzen und das Master-Theorem.
tags: [O-Notation, Theta, Asymptotik, Rekurrenz, Master-Theorem, Divide and Conquer, Fibonacci]
requires: [kombinatorik, folgen-grenzwerte]
---

## Laufzeiten vergleichen

Wie schnell ein Programm ist, hängt von Hardware, Compiler und Eingabe ab. Um Algorithmen **unabhängig** davon zu vergleichen, zählt man elementare Schritte als Funktion der Eingabegröße $n$ und betrachtet nur das **Wachstum** für große $n$. Konstante Faktoren und Terme niedrigerer Ordnung werden ignoriert. Das leisten die Landau-Symbole, die du aus dem Artikel [Big-O](#/artikel/big-o) kennst – hier präzise.

> [!DEFINITION] Landau-Symbole
> Für Funktionen $f, g\\colon \\N \\to \\R_{\\ge 0}$:
> - $f \\in O(g)$, wenn es $c > 0$ und $n_0$ gibt mit $f(n) \\le c \\cdot g(n)$ für alle $n \\ge n_0$ („$f$ wächst höchstens so schnell wie $g$“);
> - $f \\in \\Omega(g)$, wenn es $c > 0$ und $n_0$ gibt mit $f(n) \\ge c \\cdot g(n)$ für alle $n \\ge n_0$ („mindestens so schnell“);
> - $f \\in \\Theta(g)$, wenn $f \\in O(g)$ und $f \\in \\Omega(g)$ („genau so schnell“, bis auf Konstanten).

Man schreibt oft $f = O(g)$; gemeint ist immer die Mengenzugehörigkeit. $O$ ist also eine **obere Schranke** – „Quicksort ist $O(n^2)$“ ist richtig, „Mergesort ist $O(n^2)$“ auch (wenn auch wenig informativ). Wer die genaue Größenordnung meint, sagt $\\Theta$.

> [!BEISPIEL] Eine Definition anwenden
> $f(n) = 3n^2 + 10n + 7 \\in \\Theta(n^2)$: Für $n \\ge 1$ ist $f(n) \\le 3n^2 + 10n^2 + 7n^2 = 20n^2$ (also $c = 20$, $n_0 = 1$), und $f(n) \\ge 3n^2$ (also $c = 3$). Allgemein ist jedes Polynom vom Grad $d$ mit positivem Leitkoeffizienten in $\\Theta(n^d)$.

### Grenzwertkriterium und Rechenregeln

Oft ist es bequemer, den Quotienten zu betrachten:
$$
\\lim_{n\\to\\infty}\\frac{f(n)}{g(n)} = L \\quad\\Longrightarrow\\quad \\begin{cases} f \\in \\Theta(g), & 0 < L < \\infty,\\\\ f \\in O(g),\\; f \\notin \\Theta(g), & L = 0, \\\\ f \\in \\Omega(g),\\; f \\notin \\Theta(g), & L = \\infty. \\end{cases}
$$

Rechenregeln:
- **Konstanten fallen weg:** $c \\cdot f \\in \\Theta(f)$ für $c > 0$.
- **Summen:** $O(f) + O(g) = O(\\max(f, g))$ – hintereinander ausgeführte Programmteile; der teuerste dominiert.
- **Produkte:** $O(f) \\cdot O(g) = O(f \\cdot g)$ – verschachtelte Schleifen.
- **Logarithmen:** $\\log_a n \\in \\Theta(\\log_b n)$ für alle Basen $a, b > 1$, denn $\\log_a n = \\frac{\\log_b n}{\\log_b a}$. Deshalb lässt man die Basis weg.

Die Wachstumshierarchie aus [Folgen und Grenzwerte](#/mathe/analysis-1/folgen-grenzwerte):
$$
1 \\ll \\log n \\ll \\sqrt n \\ll n \\ll n \\log n \\ll n^2 \\ll n^3 \\ll 2^n \\ll n! \\ll n^n .
$$

> [!MISTAKE] Exponentialfunktionen sind nicht gleich
> Bei Logarithmen ist die Basis egal, bei Exponentialfunktionen **nicht**: $3^n \\notin O(2^n)$, denn $\\frac{3^n}{2^n} = 1{,}5^n \\to \\infty$. Und $2^{2n} = 4^n \\notin O(2^n)$.

## Rekurrenzen

Rekursive Algorithmen führen auf **Rekurrenzgleichungen** für ihre Laufzeit: Die Laufzeit für Größe $n$ wird durch Laufzeiten kleinerer Instanzen ausgedrückt.

### Lineare Rekurrenzen

> [!SATZ] Lineare homogene Rekurrenz zweiter Ordnung
> Gesucht ist $a_n = c_1 a_{n-1} + c_2 a_{n-2}$ mit gegebenen Startwerten. Hat die **charakteristische Gleichung** $\\lambda^2 = c_1\\lambda + c_2$ zwei verschiedene Lösungen $\\lambda_1 \\neq \\lambda_2$, so ist
> $$
> a_n = A\\lambda_1^n + B\\lambda_2^n,
> $$
> wobei $A, B$ aus den Startwerten bestimmt werden. Bei einer doppelten Lösung $\\lambda$ ist $a_n = (A + Bn)\\lambda^n$.

> [!BEWEIS] Ansatz
> Setzt man $a_n = \\lambda^n$ ein, erhält man $\\lambda^n = c_1\\lambda^{n-1} + c_2\\lambda^{n-2}$, nach Division durch $\\lambda^{n-2}$ die charakteristische Gleichung. Jede ihrer Lösungen liefert also eine Lösungsfolge, und Linearkombinationen von Lösungen sind wieder Lösungen. Zwei Startwerte legen $A$ und $B$ eindeutig fest (ein lineares Gleichungssystem mit von null verschiedener Determinante $\\lambda_2 - \\lambda_1$), und die Startwerte bestimmen die ganze Folge.

> [!BEISPIEL] Fibonacci
> $F_n = F_{n-1} + F_{n-2}$, $F_0 = 0$, $F_1 = 1$. Charakteristische Gleichung $\\lambda^2 = \\lambda + 1$ mit $\\lambda_{1,2} = \\frac{1 \\pm \\sqrt5}{2}$. Aus $F_0 = A + B = 0$ und $F_1 = A\\lambda_1 + B\\lambda_2 = 1$ folgt $A = -B = \\frac{1}{\\sqrt 5}$:
> $$
> F_n = \\frac{1}{\\sqrt 5}\\left(\\left(\\tfrac{1 + \\sqrt 5}{2}\\right)^n - \\left(\\tfrac{1 - \\sqrt 5}{2}\\right)^n\\right).
> $$
> Also $F_n \\in \\Theta(\\varphi^n)$ mit $\\varphi \\approx 1{,}618$ – derselbe Ausdruck wie über die [Eigenwerte](#/mathe/lineare-algebra/eigenwerte).

Die naive rekursive Fibonacci-Funktion braucht $T(n) = T(n-1) + T(n-2) + 1$ Aufrufe – ebenfalls $\\Theta(\\varphi^n)$, exponentiell. Mit **Memoisierung** oder einer Schleife sinkt der Aufwand auf $\\Theta(n)$, mit Matrixpotenzen und schnellem Potenzieren sogar auf $\\Theta(\\log n)$ Multiplikationen.

### Divide and Conquer

Viele effiziente Algorithmen teilen ein Problem der Größe $n$ in $a$ Teilprobleme der Größe $\\frac nb$ und kombinieren die Ergebnisse mit Aufwand $f(n)$:
$$
T(n) = a\\,T\\!\\left(\\frac nb\\right) + f(n) .
$$

| Algorithmus | Rekurrenz | Laufzeit |
|---|---|---|
| Binäre Suche | $T(n) = T(n/2) + O(1)$ | $\\Theta(\\log n)$ |
| Mergesort | $T(n) = 2T(n/2) + \\Theta(n)$ | $\\Theta(n \\log n)$ |
| Karatsuba-Multiplikation | $T(n) = 3T(n/2) + \\Theta(n)$ | $\\Theta(n^{\\log_2 3}) \\approx \\Theta(n^{1{,}585})$ |
| Strassen (Matrizen) | $T(n) = 7T(n/2) + \\Theta(n^2)$ | $\\Theta(n^{\\log_2 7}) \\approx \\Theta(n^{2{,}807})$ |
| Baum-Traversierung (balanciert) | $T(n) = 2T(n/2) + O(1)$ | $\\Theta(n)$ |

> [!SATZ] Master-Theorem
> Sei $T(n) = a\\,T(n/b) + f(n)$ mit $a \\ge 1$, $b > 1$, und sei $c^* = \\log_b a$ der **kritische Exponent**.
> 1. Ist $f(n) \\in O(n^{c})$ für ein $c < c^*$, so ist $T(n) \\in \\Theta(n^{c^*})$.
> 2. Ist $f(n) \\in \\Theta(n^{c^*})$, so ist $T(n) \\in \\Theta(n^{c^*}\\log n)$.
> 3. Ist $f(n) \\in \\Omega(n^{c})$ für ein $c > c^*$ und gilt die Regularitätsbedingung $a f(n/b) \\le k f(n)$ für ein $k < 1$, so ist $T(n) \\in \\Theta(f(n))$.

Die Intuition liefert der **Rekursionsbaum**: Auf Ebene $i$ gibt es $a^i$ Teilprobleme der Größe $\\frac{n}{b^i}$, die Ebene kostet also $a^i f\\!\\left(\\frac n{b^i}\\right)$. Es gibt $\\log_b n$ Ebenen und $a^{\\log_b n} = n^{\\log_b a}$ Blätter.
- Fall 1: Die Kosten **wachsen** nach unten – die Blätter dominieren: $\\Theta(n^{c^*})$.
- Fall 2: Jede Ebene kostet gleich viel – Kosten pro Ebene mal Anzahl der Ebenen: $\\Theta(n^{c^*} \\log n)$.
- Fall 3: Die Kosten **fallen** nach unten – die Wurzel dominiert: $\\Theta(f(n))$.

> [!BEISPIEL] Master-Theorem anwenden
> - Mergesort: $a = 2$, $b = 2$, $c^* = 1$, $f(n) = \\Theta(n) = \\Theta(n^{c^*})$: Fall 2, $\\Theta(n\\log n)$.
> - $T(n) = 4T(n/2) + n$: $c^* = \\log_2 4 = 2 > 1$: Fall 1, $\\Theta(n^2)$.
> - $T(n) = 2T(n/2) + n^2$: $c^* = 1 < 2$, Regularität $2 \\cdot \\frac{n^2}{4} = \\frac12 n^2$: Fall 3, $\\Theta(n^2)$.
> - Binäre Suche: $a = 1$, $b = 2$, $c^* = 0$, $f(n) = \\Theta(1) = \\Theta(n^0)$: Fall 2, $\\Theta(\\log n)$.

> [!WARNING] Grenzen des Master-Theorems
> Es deckt nicht alle Rekurrenzen ab: $T(n) = 2T(n/2) + n\\log n$ fällt zwischen Fall 2 und 3 (Lösung $\\Theta(n\\log^2 n)$), $T(n) = T(n-1) + n$ hat keine Form $T(n/b)$ (Lösung $\\Theta(n^2)$, etwa Quicksort im schlechtesten Fall). Dann helfen Rekursionsbaum, Einsetzen oder die allgemeinere Akra-Bazzi-Methode.

## Zusammenfassung

- $O$ ist obere, $\\Omega$ untere Schranke, $\\Theta$ beides; Konstanten und niedrigere Terme fallen weg; die Basis von Logarithmen ist egal.
- Lineare Rekurrenzen löst der Ansatz $a_n = \\lambda^n$ über die charakteristische Gleichung.
- Divide-and-Conquer-Rekurrenzen $T(n) = aT(n/b) + f(n)$ löst das Master-Theorem durch Vergleich von $f$ mit $n^{\\log_b a}$.
`;export{n as default};
