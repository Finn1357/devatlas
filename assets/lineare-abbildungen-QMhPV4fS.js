const e=`---
id: lineare-abbildungen
title: Lineare Abbildungen
module: lineare-algebra
order: 6
difficulty: fortgeschritten
minutes: 45
summary: Linearität, die Matrix einer linearen Abbildung aus den Bildern der Basisvektoren, Drehung, Spiegelung, Scherung und Projektion, Kern und Bild, die Dimensionsformel, Verkettung als Matrixprodukt und homogene Koordinaten für Verschiebungen.
tags: [Lineare Abbildung, Darstellungsmatrix, Kern, Bild, Dimensionsformel, Drehmatrix, Homogene Koordinaten]
requires: [vektorraeume, matrizen]
---

## Abbildungen, die Struktur erhalten

Drehungen, Spiegelungen, Streckungen und Projektionen haben eine gemeinsame Eigenschaft: Sie bilden Geraden auf Geraden ab und lassen den Ursprung fest. Algebraisch heißt das: Sie sind [[Lineare Abbildung|linear]] – sie vertragen sich mit Addition und Vielfachen.

> [!DEFINITION] Lineare Abbildung
> Eine [Abbildung](#/mathe/grundlagen/abbildungen) $F\\colon V \\to W$ zwischen Vektorräumen heißt **linear**, wenn für alle $\\vec u, \\vec v \\in V$ und $\\lambda \\in \\R$ gilt
> $$
> F(\\vec u + \\vec v) = F(\\vec u) + F(\\vec v) \\qquad\\text{und}\\qquad F(\\lambda\\vec v) = \\lambda F(\\vec v) .
> $$

Folgerungen: $F(\\vec 0) = \\vec 0$, und $F$ erhält Linearkombinationen: $F\\left(\\sum \\lambda_i \\vec v_i\\right) = \\sum \\lambda_i F(\\vec v_i)$.

> [!BEISPIEL] Linear oder nicht?
> - $F(x, y) = (2x - y,\\; x + 3y)$ ist linear.
> - $F(x, y) = (x + 1,\\; y)$ ist **nicht** linear: $F(0, 0) = (1, 0) \\neq \\vec 0$. Verschiebungen sind nicht linear (sondern *affin*).
> - $F(x, y) = (x^2, y)$ ist nicht linear: $F(2\\cdot(1, 0)) = (4, 0) \\neq 2F(1, 0) = (2, 0)$.
> - Ableiten $p \\mapsto p'$ ist eine lineare Abbildung auf dem Raum der Polynome, ebenso das bestimmte Integral $f \\mapsto \\int_a^b f\\dd x$.

## Jede lineare Abbildung ist eine Matrix

> [!SATZ] Darstellungsmatrix
> Zu jeder linearen Abbildung $F\\colon \\R^n \\to \\R^m$ gibt es genau eine Matrix $A \\in \\R^{m \\times n}$ mit $F(\\vec x) = A\\vec x$ für alle $\\vec x$. Ihre **Spalten sind die Bilder der Einheitsvektoren**:
> $$
> A = \\big(F(\\vec e_1) \\mid F(\\vec e_2) \\mid \\dots \\mid F(\\vec e_n)\\big) .
> $$

> [!BEWEIS]
> Jedes $\\vec x = x_1\\vec e_1 + \\dots + x_n\\vec e_n$. Wegen der Linearität ist $F(\\vec x) = x_1F(\\vec e_1) + \\dots + x_nF(\\vec e_n)$ – genau die Linearkombination der Spalten von $A$ mit den Koeffizienten $x_i$, also $A\\vec x$ ([Matrizen](#/mathe/lineare-algebra/matrizen)). Eindeutig, weil die Spalten durch $A\\vec e_j$ festgelegt sind.

Dieser Satz ist das Rezept zum Aufstellen von Matrizen: **Wohin gehen die Basisvektoren?** Das schreibt man als Spalten hin. Im Labor [Matrix-Transformationen](#/mathe/labor/transformation) siehst du für jede $2 \\times 2$-Matrix, wohin die Einheitsvektoren, das Einheitsquadrat und das ganze Raster der Ebene abgebildet werden.

### Geometrische Grundtypen im R²

| Abbildung | Bild von $\\vec e_1$, $\\vec e_2$ | Matrix |
|---|---|---|
| Drehung um Winkel $\\varphi$ | $(\\cos\\varphi, \\sin\\varphi)$, $(-\\sin\\varphi, \\cos\\varphi)$ | $\\begin{pmatrix} \\cos\\varphi & -\\sin\\varphi \\\\ \\sin\\varphi & \\cos\\varphi \\end{pmatrix}$ |
| Spiegelung an der $x$-Achse | $(1, 0)$, $(0, -1)$ | $\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$ |
| Streckung | $(s_x, 0)$, $(0, s_y)$ | $\\begin{pmatrix} s_x & 0 \\\\ 0 & s_y \\end{pmatrix}$ |
| Scherung | $(1, 0)$, $(k, 1)$ | $\\begin{pmatrix} 1 & k \\\\ 0 & 1 \\end{pmatrix}$ |
| Projektion auf die $x$-Achse | $(1, 0)$, $(0, 0)$ | $\\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$ |

> [!BEISPIEL] Spiegelung an der Winkelhalbierenden
> Die Spiegelung an der Geraden $y = x$ vertauscht die Koordinaten: $\\vec e_1 \\mapsto \\vec e_2$, $\\vec e_2 \\mapsto \\vec e_1$. Also $A = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$. Ihre [Determinante](#/mathe/lineare-algebra/determinanten) ist $-1$: Spiegelungen erhalten Flächen, kehren aber die Orientierung um. Drehmatrizen haben Determinante $\\cos^2\\varphi + \\sin^2\\varphi = 1$.

## Verkettung = Matrixprodukt

Führt man erst $G$ (Matrix $B$) und dann $F$ (Matrix $A$) aus, ist $F(G(\\vec x)) = A(B\\vec x) = (AB)\\vec x$. Die Verkettung linearer Abbildungen entspricht dem Matrixprodukt – deshalb ist es so definiert, wie es definiert ist.

> [!BEISPIEL] Additionstheoreme aus Matrizen
> Zwei Drehungen um $\\alpha$ und $\\beta$ ergeben eine Drehung um $\\alpha + \\beta$. Multipliziert man die Drehmatrizen aus, steht oben links $\\cos\\alpha\\cos\\beta - \\sin\\alpha\\sin\\beta$ – und das muss $\\cos(\\alpha + \\beta)$ sein. Die Additionstheoreme des Sinus und Kosinus folgen also direkt aus der Linearen Algebra.

Weil Matrixmultiplikation nicht kommutativ ist, kommt es auf die Reihenfolge an: Erst um $90°$ drehen und dann an der $x$-Achse spiegeln ist eine andere Abbildung als umgekehrt.

## Kern und Bild

> [!DEFINITION] Kern und Bild
> Für eine lineare Abbildung $F\\colon V \\to W$ heißen
> $$
> \\Kern F = \\set{\\vec v \\in V \\mid F(\\vec v) = \\vec 0} \\qquad\\text{und}\\qquad \\Bild F = \\set{F(\\vec v) \\mid \\vec v \\in V}
> $$
> **Kern** und **Bild**. Beide sind Untervektorräume.

Für $F(\\vec x) = A\\vec x$ ist der Kern die Lösungsmenge von $A\\vec x = \\vec 0$ und das Bild der Spaltenraum von $A$ ([Vektorräume](#/mathe/lineare-algebra/vektorraeume)).

> [!SATZ] Dimensionsformel
> Für eine lineare Abbildung $F\\colon V \\to W$ mit $\\dim V = n$ gilt
> $$
> \\dim \\Kern F + \\dim \\Bild F = n .
> $$

Anschaulich: Jede Dimension des Ausgangsraums wird entweder „plattgedrückt“ (landet im Kern) oder bleibt im Bild erhalten. Für Matrizen ist das der Rangsatz $\\dim\\Kern A + \\Rang A = n$.

> [!SATZ] Injektiv, surjektiv, bijektiv
> Für lineares $F\\colon V \\to W$ gilt:
> - $F$ ist **injektiv** $\\iff$ $\\Kern F = \\set{\\vec 0}$.
> - $F$ ist **surjektiv** $\\iff$ $\\dim\\Bild F = \\dim W$.
> - Ist $\\dim V = \\dim W$, so sind injektiv, surjektiv und bijektiv **gleichwertig** (wie bei endlichen Mengen gleicher Größe).

> [!BEWEIS] Injektivität über den Kern
> Ist $F$ injektiv und $F(\\vec v) = \\vec 0 = F(\\vec 0)$, so folgt $\\vec v = \\vec 0$. Ist umgekehrt $\\Kern F = \\set{\\vec 0}$ und $F(\\vec u) = F(\\vec v)$, so ist $F(\\vec u - \\vec v) = \\vec 0$, also $\\vec u - \\vec v = \\vec 0$.

> [!BEISPIEL] Projektion auf eine Ebene
> Die Projektion $P(x, y, z) = (x, y, 0)$ hat $\\Kern P = \\set{(0, 0, z)}$ (die $z$-Achse, Dimension 1) und $\\Bild P = \\set{(x, y, 0)}$ (die $xy$-Ebene, Dimension 2). $1 + 2 = 3$ ✓. Sie ist weder injektiv noch surjektiv, und es gilt $P \\circ P = P$ – zweimal projizieren ändert nichts mehr. Eine 3D-Szene auf den Bildschirm zu bringen ist im Kern genau so eine Projektion: Die Tiefeninformation landet im Kern und geht verloren.

## Basiswechsel

Dieselbe lineare Abbildung hat bezüglich verschiedener Basen verschiedene Matrizen. Bilden die Spalten von $S$ eine neue Basis, so ist die Matrix von $F$ in dieser Basis
$$
A' = S^{-1}AS .
$$
Matrizen $A$ und $S^{-1}AS$ heißen **ähnlich**; sie beschreiben dieselbe Abbildung und haben dieselbe Determinante, Spur und dieselben Eigenwerte. Das Ziel der [Diagonalisierung](#/mathe/lineare-algebra/eigenwerte) ist eine Basis, in der $A'$ diagonal ist – dort wirkt die Abbildung wie eine reine Streckung entlang der Achsen.

## Verschiebungen: homogene Koordinaten

Verschiebungen $\\vec x \\mapsto \\vec x + \\vec t$ sind nicht linear, werden in der Grafik aber ständig mit Drehungen kombiniert. Der Trick: Man hängt eine Koordinate $1$ an und arbeitet eine Dimension höher.
$$
\\begin{pmatrix} x' \\\\ y' \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} a & b & t_x \\\\ c & d & t_y \\\\ 0 & 0 & 1 \\end{pmatrix}\\begin{pmatrix} x \\\\ y \\\\ 1 \\end{pmatrix} .
$$
Jetzt sind Drehung, Streckung **und** Verschiebung Matrixprodukte und lassen sich zu einer einzigen Matrix zusammenfassen. Deshalb arbeiten OpenGL, WebGL, Unity und CSS-Transformationen (\`matrix3d\`) mit $4 \\times 4$-Matrizen für den 3D-Raum.

> [!TIP] Transformationen in CSS und Canvas
> \`transform: rotate(30deg) translate(100px, 0)\` multipliziert intern zwei $3 \\times 3$-Matrizen in homogenen Koordinaten. Weil die Reihenfolge zählt, bewegt \`translate(100px, 0) rotate(30deg)\` das Element an eine andere Stelle. Im Browser kannst du mit \`getComputedStyle(el).transform\` die resultierende Matrix auslesen.

## Zusammenfassung

- Linear heißt: verträglich mit $+$ und Vielfachen; insbesondere $F(\\vec 0) = \\vec 0$.
- Die Matrix entsteht aus den Bildern der Einheitsvektoren als Spalten; Verkettung = Matrixprodukt.
- $\\Kern F$ und $\\Bild F$ sind Unterräume mit $\\dim\\Kern + \\dim\\Bild = n$; injektiv $\\iff$ Kern $= \\set{\\vec 0}$.
- Basiswechsel $S^{-1}AS$; Verschiebungen werden mit homogenen Koordinaten zu Matrizen.
`;export{e as default};
