const e=`---
id: polynome
title: Polynome, Polynomdivision und Nullstellen
module: algebra
order: 4
difficulty: fortgeschritten
minutes: 45
summary: Polynome und ihr Grad, Rechnen mit Polynomen, Polynomdivision mit Rest, das Horner-Schema, Linearfaktoren und Vielfachheiten, rationale Nullstellen und die Faktorisierung über R und C.
tags: [Polynom, Polynomdivision, Horner-Schema, Nullstelle, Linearfaktor, Vielfachheit]
requires: [gleichungen-ungleichungen, komplexe-zahlen]
---

## Polynome

> [!DEFINITION] Polynom
> Ein **Polynom** in der Variablen $x$ ist ein Ausdruck
> $$
> p(x) = a_n x^n + a_{n-1}x^{n-1} + \\dots + a_1 x + a_0 = \\sum_{k=0}^{n} a_k x^k
> $$
> mit Koeffizienten $a_k$ (hier aus $\\R$ oder $\\C$). Ist $a_n \\neq 0$, heißt $n$ der **Grad** $\\deg p$ und $a_n$ der **Leitkoeffizient**; ist $a_n = 1$, heißt $p$ **normiert**.

[[Polynom|Polynome]] sind die einfachsten Funktionen, die man exakt mit endlich vielen Zahlen beschreiben und auswerten kann. Deshalb sind sie überall: Interpolation und Splines in der Grafik, Taylor-Näherungen in der Numerik, Prüfsummen (CRC) als Polynome über $\\set{0, 1}$, Kryptografie über endlichen Körpern und Kurven in Fonts (Bézier).

**Rechnen:** Addition koeffizientenweise; Multiplikation durch Ausmultiplizieren. Für die Grade gilt $\\deg(p + q) \\le \\max(\\deg p, \\deg q)$ und $\\deg(p \\cdot q) = \\deg p + \\deg q$.

> [!TIP] Polynommultiplikation ist Faltung
> Der Koeffizient von $x^k$ in $p \\cdot q$ ist $\\sum_{i + j = k} a_i b_j$ – eine **Faltung** der Koeffizientenfolgen. Genau so multipliziert man große Zahlen (Ziffern = Koeffizienten zur Basis 10). Mit der schnellen Fourier-Transformation gelingt das in $O(n\\log n)$ statt $O(n^2)$.

## Polynomdivision

> [!SATZ] Division mit Rest
> Zu Polynomen $p$ und $q \\neq 0$ gibt es eindeutig bestimmte Polynome $s$ (Quotient) und $r$ (Rest) mit
> $$
> p = s \\cdot q + r \\qquad\\text{und}\\qquad \\deg r < \\deg q \\;\\;(\\text{oder } r = 0).
> $$

Das Verfahren funktioniert wie die schriftliche Division von Zahlen: Höchste Potenzen durcheinander teilen, zurückmultiplizieren, abziehen, wiederholen.

> [!BEISPIEL] Schriftliche Polynomdivision
> $(2x^3 - 3x^2 + 4x - 5) : (x - 2)$:
> $$
> \\begin{aligned}
> 2x^3 : x &= 2x^2, & 2x^3 - 3x^2 + 4x - 5 - 2x^2(x - 2) &= x^2 + 4x - 5,\\\\
> x^2 : x &= x, & x^2 + 4x - 5 - x(x - 2) &= 6x - 5,\\\\
> 6x : x &= 6, & 6x - 5 - 6(x - 2) &= 7 .
> \\end{aligned}
> $$
> Also $2x^3 - 3x^2 + 4x - 5 = (2x^2 + x + 6)(x - 2) + 7$.

### Das Horner-Schema

Das direkte Auswerten von $p(x_0)$ braucht viele Potenzen. Das **Horner-Schema** klammert geschickt aus:
$$
p(x_0) = \\Big(\\big((a_n x_0 + a_{n-1})\\,x_0 + a_{n-2}\\big)\\,x_0 + \\dots\\Big)\\,x_0 + a_0 .
$$
Das sind nur $n$ Multiplikationen und $n$ Additionen – optimal, und numerisch stabiler als die Summe der Potenzen.

> [!BEISPIEL] Horner für p(x) = 2x³ − 3x² + 4x − 5 an x₀ = 2
> | | $2$ | $-3$ | $4$ | $-5$ |
> |---|---|---|---|---|
> | $+$ | | $4$ | $2$ | $12$ |
> | $=$ | $2$ | $1$ | $6$ | $\\mathbf 7$ |
>
> Jede Zahl der unteren Zeile wird mit $x_0 = 2$ multipliziert und unter den nächsten Koeffizienten geschrieben. Das Ergebnis $p(2) = 7$ ist der Rest der Division durch $(x - 2)$, und die übrigen Zahlen $2, 1, 6$ sind die Koeffizienten des Quotienten $2x^2 + x + 6$ – dasselbe wie oben, in einem Bruchteil der Schreibarbeit.

\`\`\`python title="Horner-Schema"
def horner(koeffizienten, x0):
    """Koeffizienten vom höchsten zum niedrigsten Grad."""
    wert = 0
    for a in koeffizienten:
        wert = wert * x0 + a
    return wert

print(horner([2, -3, 4, -5], 2))   # 7
\`\`\`

Dieselbe Schleife wandelt übrigens Ziffernfolgen in Zahlen um (\`int("2345")\` rechnet $((2 \\cdot 10 + 3) \\cdot 10 + 4) \\cdot 10 + 5$) und steckt in Polynom-Hashfunktionen wie dem Rabin-Karp-Algorithmus.

## Nullstellen und Linearfaktoren

> [!SATZ] Abspalten eines Linearfaktors
> $x_0$ ist genau dann Nullstelle von $p$, wenn $(x - x_0)$ ein Teiler von $p$ ist:
> $$
> p(x_0) = 0 \\iff p(x) = (x - x_0)\\,s(x) \\text{ für ein Polynom } s \\text{ mit } \\deg s = \\deg p - 1 .
> $$

> [!BEWEIS]
> Division mit Rest durch $(x - x_0)$ liefert $p(x) = s(x)(x - x_0) + r$ mit einer Konstanten $r$ (Grad kleiner 1). Einsetzen von $x_0$ ergibt $p(x_0) = r$. Also ist der Rest genau dann null, wenn $p(x_0) = 0$.

Daraus folgt: Ein Polynom vom Grad $n \\ge 1$ hat **höchstens $n$ Nullstellen** – jede Nullstelle spaltet einen Faktor ab und senkt den Grad um 1. Über $\\C$ hat es nach dem [Fundamentalsatz der Algebra](#/mathe/algebra/komplexe-zahlen) mit Vielfachheit gezählt sogar **genau** $n$.

> [!DEFINITION] Vielfachheit
> $x_0$ ist eine **$k$-fache** Nullstelle von $p$, wenn $(x - x_0)^k$ ein Teiler von $p$ ist, $(x - x_0)^{k+1}$ aber nicht. Gleichwertig: $p(x_0) = p'(x_0) = \\dots = p^{(k-1)}(x_0) = 0 \\neq p^{(k)}(x_0)$.

Am Graphen: Bei ungerader Vielfachheit wechselt $p$ das Vorzeichen (bei $k \\ge 3$ mit Sattelpunkt), bei gerader Vielfachheit berührt der Graph die $x$-Achse nur.

### Nullstellen finden

- **Grad 2:** Lösungsformel (siehe [Gleichungen](#/mathe/algebra/gleichungen-ungleichungen)).
- **Grad 3 und 4:** Es gibt Formeln (Cardano, Ferrari), praktisch rät man meist eine Nullstelle und dividiert ab.
- **Grad ≥ 5:** Es gibt beweisbar **keine** allgemeine Lösungsformel mit Wurzeln (Abel–Ruffini). Man rechnet numerisch, etwa mit dem [Newton-Verfahren](#/mathe/numerik/nullstellen).

> [!SATZ] Rationale Nullstellen
> Hat $p(x) = a_n x^n + \\dots + a_0$ ganzzahlige Koeffizienten und eine rationale Nullstelle $\\frac uv$ (vollständig gekürzt), so gilt $u \\mid a_0$ und $v \\mid a_n$. Insbesondere sind ganzzahlige Nullstellen eines normierten Polynoms Teiler von $a_0$.

> [!BEISPIEL] Raten und Abspalten
> $p(x) = x^3 - 6x^2 + 11x - 6$. Kandidaten: Teiler von $6$, also $\\pm1, \\pm2, \\pm3, \\pm6$. $p(1) = 1 - 6 + 11 - 6 = 0$ ✓. Horner mit $x_0 = 1$:
>
> | | $1$ | $-6$ | $11$ | $-6$ |
> |---|---|---|---|---|
> | $+$ | | $1$ | $-5$ | $6$ |
> | $=$ | $1$ | $-5$ | $6$ | $0$ |
>
> Also $p(x) = (x - 1)(x^2 - 5x + 6) = (x - 1)(x - 2)(x - 3)$.

## Faktorisierung über R und C

> [!SATZ] Faktorisierung reeller Polynome
> Jedes reelle Polynom lässt sich als Produkt aus seinem Leitkoeffizienten, reellen Linearfaktoren $(x - x_i)$ und quadratischen Faktoren $x^2 + px + q$ **ohne reelle Nullstellen** ($p^2 - 4q < 0$) schreiben.

Grund: Nicht-reelle Nullstellen treten in konjugierten Paaren $z, \\bar z$ auf, und $(x - z)(x - \\bar z) = x^2 - 2\\operatorname{Re}(z)\\,x + \\abs z^2$ ist reell.

> [!BEISPIEL] Über R und über C
> $x^4 - 1 = (x^2 - 1)(x^2 + 1) = (x - 1)(x + 1)(x^2 + 1)$ über $\\R$; über $\\C$ zusätzlich $x^2 + 1 = (x - \\ii)(x + \\ii)$. Die vier Nullstellen $\\pm 1, \\pm\\ii$ sind die vierten [Einheitswurzeln](#/mathe/algebra/komplexe-zahlen).

Diese Zerlegung ist die Grundlage der **Partialbruchzerlegung**, mit der man rationale Funktionen [integriert](#/mathe/analysis-2/integrationstechniken).

## Zusammenfassung

- $\\deg(pq) = \\deg p + \\deg q$; Polynommultiplikation ist eine Faltung der Koeffizienten.
- Division mit Rest $p = sq + r$, $\\deg r < \\deg q$; das Horner-Schema wertet aus und dividiert durch $(x - x_0)$ zugleich.
- $p(x_0) = 0 \\iff (x - x_0) \\mid p$; höchstens $n$ reelle, genau $n$ komplexe Nullstellen (mit Vielfachheit).
- Rationale Nullstellen: Zähler teilt $a_0$, Nenner teilt $a_n$; über $\\R$ bleiben irreduzible quadratische Faktoren.
`;export{e as default};
