const e=`---
id: vektorraeume
title: Vektorräume, Basis und Dimension
module: lineare-algebra
order: 5
difficulty: fortgeschritten
minutes: 45
summary: Vektorraumaxiome, Untervektorräume, lineare Unabhängigkeit, Erzeugendensysteme, Basis und Dimension, Koordinaten sowie Zeilen-, Spalten- und Nullraum einer Matrix.
tags: [Vektorraum, Unterraum, Lineare Unabhängigkeit, Basis, Dimension, Koordinaten, Kern]
requires: [lgs-gauss, matrizen]
---

## Abstraktion: Was macht einen Vektorraum aus?

Pfeile in der Ebene, Zahlentupel, Polynome, Funktionen, Matrizen, Audiosignale – all diese Objekte kann man addieren und mit Zahlen strecken, und dabei gelten dieselben Rechenregeln. Die lineare Algebra beweist ihre Sätze deshalb einmal für einen abstrakten **[[Vektorraum]]** und wendet sie dann überall an.

> [!DEFINITION] Vektorraum
> Ein **reeller Vektorraum** ist eine Menge $V$ mit einer Addition $V \\times V \\to V$ und einer Skalarmultiplikation $\\R \\times V \\to V$, sodass für alle $\\vec u, \\vec v, \\vec w \\in V$ und $\\lambda, \\mu \\in \\R$ gilt:
> 1. $(\\vec u + \\vec v) + \\vec w = \\vec u + (\\vec v + \\vec w)$ und $\\vec u + \\vec v = \\vec v + \\vec u$;
> 2. es gibt einen Nullvektor $\\vec 0$ mit $\\vec v + \\vec 0 = \\vec v$;
> 3. zu jedem $\\vec v$ gibt es $-\\vec v$ mit $\\vec v + (-\\vec v) = \\vec 0$;
> 4. $\\lambda(\\mu \\vec v) = (\\lambda\\mu)\\vec v$ und $1 \\cdot \\vec v = \\vec v$;
> 5. $\\lambda(\\vec u + \\vec v) = \\lambda\\vec u + \\lambda\\vec v$ und $(\\lambda + \\mu)\\vec v = \\lambda\\vec v + \\mu\\vec v$.

Beispiele: $\\R^n$; der Raum $\\R^{m \\times n}$ der Matrizen; der Raum $\\mathcal P_n$ der Polynome vom Grad höchstens $n$; der Raum aller Funktionen $\\R \\to \\R$ mit $(f + g)(x) = f(x) + g(x)$. Statt $\\R$ kann man jeden Körper verwenden – etwa $\\set{0, 1}$ mit Rechnen modulo 2, die Grundlage fehlerkorrigierender Codes.

## Untervektorräume

> [!DEFINITION] Untervektorraum
> Eine Teilmenge $U \\subseteq V$ heißt **Untervektorraum** (Unterraum), wenn
> 1. $\\vec 0 \\in U$,
> 2. $\\vec u + \\vec v \\in U$ für alle $\\vec u, \\vec v \\in U$ (abgeschlossen unter Addition),
> 3. $\\lambda \\vec u \\in U$ für alle $\\vec u \\in U$, $\\lambda \\in \\R$ (abgeschlossen unter Vielfachen).

Die Axiome gelten dann automatisch, weil sie in $V$ gelten.

> [!BEISPIEL] Unterraum oder nicht?
> - $U_1 = \\set{(x, y, z) \\in \\R^3 \\mid x + 2y - z = 0}$ ist ein Unterraum (eine Ebene durch $\\vec 0$): Summen und Vielfache von Lösungen einer homogenen Gleichung sind wieder Lösungen.
> - $U_2 = \\set{(x, y) \\mid x + y = 1}$ ist **keiner**, denn $\\vec 0 \\notin U_2$.
> - $U_3 = \\set{(x, y) \\mid xy \\ge 0}$ (1. und 3. Quadrant) ist **keiner**: $(1, 0) + (0, -1) = (1, -1) \\notin U_3$.
> - Die Lösungsmenge jedes homogenen LGS $A\\vec x = \\vec 0$ ist ein Unterraum, der **Kern** oder **Nullraum** von $A$.

Unterräume des $\\R^3$ sind genau: $\\set{\\vec 0}$, Geraden durch $\\vec 0$, Ebenen durch $\\vec 0$ und $\\R^3$ selbst. Der Spann beliebiger Vektoren ist immer ein Unterraum – der kleinste, der sie enthält.

## Lineare Unabhängigkeit

> [!DEFINITION] Linear unabhängig
> Vektoren $\\vec v_1, \\dots, \\vec v_k$ heißen **linear unabhängig**, wenn
> $$
> \\lambda_1 \\vec v_1 + \\dots + \\lambda_k \\vec v_k = \\vec 0 \\quad\\Longrightarrow\\quad \\lambda_1 = \\dots = \\lambda_k = 0 .
> $$
> Andernfalls heißen sie **linear abhängig**.

Gleichwertig: Keiner der Vektoren ist Linearkombination der übrigen. Linear abhängig heißt also: Mindestens ein Vektor ist „überflüssig“, weil er sich aus den anderen bauen lässt.

> [!BEISPIEL] Unabhängigkeit prüfen
> Sind $\\vec v_1 = (1, 2, 3)$, $\\vec v_2 = (0, 1, 1)$, $\\vec v_3 = (2, 3, 5)$ linear unabhängig? Gesucht sind die Lösungen von $\\lambda_1 \\vec v_1 + \\lambda_2\\vec v_2 + \\lambda_3\\vec v_3 = \\vec 0$ – ein homogenes LGS mit den Vektoren als **Spalten**:
> $$
> \\begin{pmatrix} 1 & 0 & 2 \\\\ 2 & 1 & 3 \\\\ 3 & 1 & 5 \\end{pmatrix}
> \\to \\begin{pmatrix} 1 & 0 & 2 \\\\ 0 & 1 & -1 \\\\ 0 & 1 & -1 \\end{pmatrix}
> \\to \\begin{pmatrix} 1 & 0 & 2 \\\\ 0 & 1 & -1 \\\\ 0 & 0 & 0 \\end{pmatrix}.
> $$
> Der Rang ist $2 < 3$, also gibt es nichttriviale Lösungen, etwa $\\lambda_3 = 1$, $\\lambda_2 = 1$, $\\lambda_1 = -2$: $-2\\vec v_1 + \\vec v_2 + \\vec v_3 = \\vec 0$. Die Vektoren sind **linear abhängig**.

> [!MERKE]
> $k$ Vektoren im $\\R^n$ sind genau dann linear unabhängig, wenn die Matrix mit ihnen als Spalten den Rang $k$ hat. Insbesondere sind mehr als $n$ Vektoren im $\\R^n$ immer linear abhängig.

## Basis und Dimension

> [!DEFINITION] Basis
> Eine Familie $(\\vec b_1, \\dots, \\vec b_n)$ in $V$ heißt **Basis** von $V$, wenn sie
> 1. **linear unabhängig** ist und
> 2. $V$ **erzeugt**: $\\operatorname{span}(\\vec b_1, \\dots, \\vec b_n) = V$.

Die **Standardbasis** des $\\R^n$ besteht aus den Einheitsvektoren $\\vec e_1 = (1, 0, \\dots, 0)$, …, $\\vec e_n = (0, \\dots, 0, 1)$. Eine Basis von $\\mathcal P_2$ ist $(1, x, x^2)$.

> [!SATZ] Eindeutige Koordinaten
> Ist $(\\vec b_1, \\dots, \\vec b_n)$ eine Basis von $V$, so lässt sich jedes $\\vec v \\in V$ **eindeutig** schreiben als $\\vec v = \\lambda_1 \\vec b_1 + \\dots + \\lambda_n\\vec b_n$. Die $\\lambda_i$ heißen **Koordinaten** von $\\vec v$ bezüglich der Basis.

> [!BEWEIS]
> Existenz: Die Basis erzeugt $V$. Eindeutigkeit: Gilt auch $\\vec v = \\mu_1\\vec b_1 + \\dots + \\mu_n \\vec b_n$, so liefert Subtraktion $\\vec 0 = (\\lambda_1 - \\mu_1)\\vec b_1 + \\dots + (\\lambda_n - \\mu_n)\\vec b_n$. Wegen der linearen Unabhängigkeit sind alle Differenzen $0$, also $\\lambda_i = \\mu_i$.

> [!SATZ] Dimension
> Je zwei Basen eines Vektorraums $V$ haben gleich viele Elemente. Diese Anzahl heißt **Dimension** $\\dim V$.

Damit ist $\\dim \\R^n = n$, $\\dim \\R^{m\\times n} = mn$ und $\\dim \\mathcal P_n = n + 1$. Der Raum aller Polynome hat keine endliche Basis; er ist unendlichdimensional.

Nützliche Folgerungen für $\\dim V = n$:
- Jede linear unabhängige Familie hat höchstens $n$ Elemente und lässt sich zu einer Basis **ergänzen**.
- Jedes Erzeugendensystem hat mindestens $n$ Elemente und enthält eine Basis.
- $n$ linear unabhängige Vektoren bilden automatisch eine Basis – man muss das Erzeugen nicht mehr prüfen (und umgekehrt).
- Für einen Unterraum $U \\subseteq V$ gilt $\\dim U \\le \\dim V$, mit Gleichheit genau für $U = V$.

> [!BEISPIEL] Basis eines Lösungsraums
> Der Kern von $A = \\begin{pmatrix} 1 & 2 & 0 & 3 \\\\ 0 & 0 & 1 & -1 \\end{pmatrix}$: Freie Variablen $x_2 = s$, $x_4 = t$ ergeben
> $$
> \\vec x = s\\begin{pmatrix} -2 \\\\ 1 \\\\ 0 \\\\ 0\\end{pmatrix} + t\\begin{pmatrix} -3 \\\\ 0 \\\\ 1 \\\\ 1\\end{pmatrix}.
> $$
> Die beiden Vektoren sind linear unabhängig (jeder hat eine $1$ an einer Stelle, an der der andere $0$ hat) und erzeugen den Kern: eine Basis, $\\dim \\Kern A = 2$.

## Die vier Räume einer Matrix

Zu $A \\in \\R^{m \\times n}$ gehören:

| Raum | Definition | liegt in | Dimension |
|---|---|---|---|
| Spaltenraum (Bild) | $\\operatorname{span}$ der Spalten $= \\set{A\\vec x}$ | $\\R^m$ | $\\Rang A$ |
| Zeilenraum | $\\operatorname{span}$ der Zeilen | $\\R^n$ | $\\Rang A$ |
| Kern (Nullraum) | $\\set{\\vec x \\mid A\\vec x = \\vec 0}$ | $\\R^n$ | $n - \\Rang A$ |
| Linker Nullraum | $\\set{\\vec y \\mid A^T\\vec y = \\vec 0}$ | $\\R^m$ | $m - \\Rang A$ |

Dass Zeilen- und Spaltenraum dieselbe Dimension haben („Zeilenrang = Spaltenrang“), ist einer der überraschendsten Sätze der linearen Algebra. Die Beziehung $\\dim \\Kern A + \\Rang A = n$ heißt **Dimensionsformel** (Rangsatz); sie erklärt die Zahl der freien Parameter in der [Lösungsmenge eines LGS](#/mathe/lineare-algebra/lgs-gauss).

> [!TIP] Wie man Basen praktisch bestimmt
> - **Spaltenraum:** Gauß-Verfahren auf $A$; die Spalten **der ursprünglichen Matrix** an den Pivotpositionen bilden eine Basis.
> - **Zeilenraum:** die Nicht-Nullzeilen der Zeilenstufenform.
> - **Kern:** reduzierte Zeilenstufenform, freie Variablen als Parameter, je ein Basisvektor pro Parameter.

## Basiswechsel

Bezüglich verschiedener Basen hat derselbe Vektor verschiedene Koordinaten. Bilden die Spalten einer invertierbaren Matrix $B$ eine Basis, so hängen Standardkoordinaten $\\vec x$ und Koordinaten $\\vec c$ bezüglich $B$ über
$$
\\vec x = B\\vec c \\quad\\iff\\quad \\vec c = B^{-1}\\vec x
$$
zusammen. Das Prinzip begegnet dir in der Grafik (Welt- vs. Objektkoordinaten), in der Signalverarbeitung (Zeit- vs. Frequenzbasis bei der Fourier-Transformation) und bei der Hauptkomponentenanalyse, die Daten in einer an die Varianz angepassten Basis darstellt.

## Zusammenfassung

- Ein Vektorraum ist alles, was man addieren und skalieren kann, sodass die üblichen Regeln gelten; Unterräume enthalten $\\vec 0$ und sind abgeschlossen.
- Linear unabhängig ⇔ nur die triviale Linearkombination ergibt $\\vec 0$; geprüft mit dem Rang der Spaltenmatrix.
- Basis = linear unabhängiges Erzeugendensystem; Koordinaten sind eindeutig; alle Basen gleich groß (Dimension).
- Rangsatz: $\\dim\\Kern A + \\Rang A = n$.
`;export{e as default};
