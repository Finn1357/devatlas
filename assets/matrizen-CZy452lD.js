const e=`---
id: matrizen
title: Matrizen und Matrixrechnung
module: lineare-algebra
order: 3
difficulty: fortgeschritten
minutes: 40
summary: Matrizen addieren und multiplizieren, Transponierte, Einheitsmatrix, Rechenregeln, Invertierbarkeit und das Berechnen der Inversen mit Gauß-Jordan.
tags: [Matrix, Matrixmultiplikation, Transponierte, Inverse, Einheitsmatrix, Gauß-Jordan]
requires: [lgs-gauss]
---

## Matrizen als Rechenobjekte

> [!DEFINITION] Matrix
> Eine $m \\times n$-**[[Matrix]]** über $\\R$ ist ein rechteckiges Schema $A = (a_{ij})$ mit $m$ Zeilen und $n$ Spalten; $a_{ij}$ steht in Zeile $i$, Spalte $j$. Die Menge aller solchen Matrizen ist $\\R^{m \\times n}$. Spaltenvektoren sind $n \\times 1$-Matrizen.

Addition und Vielfache funktionieren eintragsweise wie bei Vektoren: $(A + B)_{ij} = a_{ij} + b_{ij}$ (nur bei gleichem Format) und $(\\lambda A)_{ij} = \\lambda a_{ij}$.

## Matrix mal Vektor

$A\\vec x$ ist die Linearkombination der **Spalten** von $A$ mit den Koeffizienten aus $\\vec x$:
$$
\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\\\ 5 & 6 \\end{pmatrix} \\begin{pmatrix} 7 \\\\ 8 \\end{pmatrix} = 7 \\begin{pmatrix} 1 \\\\ 3 \\\\ 5 \\end{pmatrix} + 8 \\begin{pmatrix} 2 \\\\ 4 \\\\ 6 \\end{pmatrix} = \\begin{pmatrix} 23 \\\\ 53 \\\\ 83 \\end{pmatrix}.
$$
Gleichwertig ist die **Zeilensicht**: Der $i$-te Eintrag ist das Skalarprodukt der $i$-ten Zeile mit $\\vec x$, etwa $3 \\cdot 7 + 4 \\cdot 8 = 53$. Damit ist ein LGS genau die Frage: Welche Linearkombination der Spalten ergibt $\\vec b$?

## Matrixmultiplikation

> [!DEFINITION] Matrixprodukt
> Für $A \\in \\R^{m \\times n}$ und $B \\in \\R^{n \\times p}$ ist $AB \\in \\R^{m \\times p}$ mit
> $$
> (AB)_{ij} = \\sum_{k=1}^{n} a_{ik} b_{kj} \\qquad\\text{(Zeile } i \\text{ von } A \\text{ mal Spalte } j \\text{ von } B\\text{)}.
> $$
> Die **Spaltenzahl von $A$** muss mit der **Zeilenzahl von $B$** übereinstimmen.

> [!BEISPIEL] Produkt berechnen
> $$
> \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix} \\begin{pmatrix} 3 & 0 \\\\ 1 & 2 \\end{pmatrix} = \\begin{pmatrix} 1\\cdot3 + 2\\cdot1 & 1\\cdot0 + 2\\cdot2 \\\\ 0\\cdot3 + 1\\cdot1 & 0\\cdot0 + 1\\cdot2 \\end{pmatrix} = \\begin{pmatrix} 5 & 4 \\\\ 1 & 2 \\end{pmatrix},
> $$
> aber in umgekehrter Reihenfolge
> $$
> \\begin{pmatrix} 3 & 0 \\\\ 1 & 2 \\end{pmatrix} \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix} = \\begin{pmatrix} 3 & 6 \\\\ 1 & 4 \\end{pmatrix}.
> $$

**Warum diese seltsame Definition?** Weil sie zur Verkettung passt: Beschreibt $B$ die Abbildung $\\vec x \\mapsto B\\vec x$ und $A$ die Abbildung $\\vec y \\mapsto A\\vec y$, dann ist $A(B\\vec x) = (AB)\\vec x$. Das Matrixprodukt ist die Matrix der verketteten Abbildung „erst $B$, dann $A$“.

### Rechenregeln

| gilt | gilt **nicht** allgemein |
|---|---|
| $(AB)C = A(BC)$ (assoziativ) | $AB = BA$ |
| $A(B + C) = AB + AC$, $(A+B)C = AC + BC$ | $AB = 0 \\Rightarrow A = 0$ oder $B = 0$ |
| $\\lambda(AB) = (\\lambda A)B = A(\\lambda B)$ | $AB = AC \\Rightarrow B = C$ |
| $I_m A = A = A I_n$ | $(A + B)^2 = A^2 + 2AB + B^2$ |

Dabei ist $I_n$ die **Einheitsmatrix** mit Einsen auf der Diagonale und sonst Nullen. Ein Beispiel für Nullteiler: $\\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}^2 = 0$, obwohl die Matrix nicht null ist. Und $(A+B)^2 = A^2 + AB + BA + B^2$ – die binomische Formel braucht $AB = BA$.

> [!TIP] Transformationen in 3D-Grafik
> Spiele-Engines stapeln Transformationen als Matrizen: $M = P \\cdot V \\cdot T \\cdot R \\cdot S$ (Projektion, Kamera, Verschiebung, Drehung, Skalierung). Weil die Multiplikation assoziativ ist, berechnet man $M$ einmal und wendet es auf Millionen Eckpunkte an. Weil sie nicht kommutativ ist, macht die Reihenfolge einen Unterschied: Erst drehen, dann verschieben ist nicht dasselbe wie umgekehrt.

### Aufwand

Das Produkt zweier $n \\times n$-Matrizen braucht mit der Definition $n^3$ Multiplikationen. Strassen (1969) kam mit $O(n^{2{,}81})$ aus; theoretisch geht es noch schneller, praktisch dominieren aber cache-optimierte $O(n^3)$-Implementierungen (BLAS) und Grafikkarten, die Tausende Skalarprodukte parallel berechnen. Das Training neuronaler Netze besteht im Kern aus Matrixmultiplikationen.

## Transponierte

> [!DEFINITION] Transponierte
> Die **Transponierte** $A^T \\in \\R^{n\\times m}$ von $A \\in \\R^{m\\times n}$ entsteht durch Spiegeln an der Diagonale: $(A^T)_{ij} = a_{ji}$. Gilt $A^T = A$, heißt $A$ **symmetrisch**.

Regeln: $(A^T)^T = A$, $(A + B)^T = A^T + B^T$ und – mit umgekehrter Reihenfolge – $(AB)^T = B^T A^T$. Das Skalarprodukt lässt sich als Matrixprodukt schreiben: $\\vec u \\cdot \\vec v = \\vec u^T \\vec v$. Für jede Matrix ist $A^TA$ symmetrisch; sie taucht in der Ausgleichsrechnung auf.

## Inverse Matrix

> [!DEFINITION] Invertierbar
> Eine quadratische Matrix $A \\in \\R^{n\\times n}$ heißt **invertierbar** (regulär), wenn es $B \\in \\R^{n\\times n}$ gibt mit $AB = BA = I_n$. Dann ist $B$ eindeutig und heißt **Inverse** $A^{-1}$. Nicht invertierbare Matrizen heißen **singulär**.

Mit der Inversen löst man $A\\vec x = \\vec b$ formal durch $\\vec x = A^{-1}\\vec b$. Praktisch berechnet man $A^{-1}$ aber selten: Das Gauß-Verfahren für ein einzelnes System ist billiger und numerisch stabiler.

> [!SATZ] Kriterien für Invertierbarkeit
> Für $A \\in \\R^{n \\times n}$ sind äquivalent:
> 1. $A$ ist invertierbar.
> 2. $\\Rang A = n$.
> 3. $A\\vec x = \\vec 0$ hat nur die Lösung $\\vec x = \\vec 0$.
> 4. $A\\vec x = \\vec b$ ist für jedes $\\vec b$ eindeutig lösbar.
> 5. Die Spalten (und ebenso die Zeilen) von $A$ sind linear unabhängig.
> 6. $\\det A \\neq 0$.

Die Äquivalenzen 2–4 folgen direkt aus dem Lösbarkeitskriterium der [vorigen Lektion](#/mathe/lineare-algebra/lgs-gauss); Punkt 5 behandelt [Vektorräume](#/mathe/lineare-algebra/vektorraeume), Punkt 6 die [Determinanten](#/mathe/lineare-algebra/determinanten).

### Inverse mit Gauß-Jordan

Man schreibt $(A \\mid I_n)$ und formt um, bis links $I_n$ steht. Rechts steht dann $A^{-1}$. Bleibt links eine Nullzeile, ist $A$ singulär.

> [!BEISPIEL] Eine 2×2-Inverse
> $$
> \\left(\\begin{array}{rr|rr} 2 & 1 & 1 & 0 \\\\ 5 & 3 & 0 & 1 \\end{array}\\right)
> \\xrightarrow{Z_1 \\to \\frac12 Z_1}
> \\left(\\begin{array}{rr|rr} 1 & \\frac12 & \\frac12 & 0 \\\\ 5 & 3 & 0 & 1 \\end{array}\\right)
> \\xrightarrow{Z_2 \\to Z_2 - 5Z_1}
> \\left(\\begin{array}{rr|rr} 1 & \\frac12 & \\frac12 & 0 \\\\ 0 & \\frac12 & -\\frac52 & 1 \\end{array}\\right)
> $$
> $$
> \\xrightarrow{Z_2 \\to 2 Z_2}
> \\left(\\begin{array}{rr|rr} 1 & \\frac12 & \\frac12 & 0 \\\\ 0 & 1 & -5 & 2 \\end{array}\\right)
> \\xrightarrow{Z_1 \\to Z_1 - \\frac12 Z_2}
> \\left(\\begin{array}{rr|rr} 1 & 0 & 3 & -1 \\\\ 0 & 1 & -5 & 2 \\end{array}\\right)
> $$
> Also $A^{-1} = \\begin{pmatrix} 3 & -1 \\\\ -5 & 2 \\end{pmatrix}$. Probe: $\\begin{pmatrix} 2 & 1 \\\\ 5 & 3 \\end{pmatrix}\\begin{pmatrix} 3 & -1 \\\\ -5 & 2 \\end{pmatrix} = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$. ✓

Für $2 \\times 2$-Matrizen gibt es eine geschlossene Formel:

> [!SATZ] Inverse einer 2×2-Matrix
> $$
> \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}^{-1} = \\frac{1}{ad - bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}, \\qquad\\text{falls } ad - bc \\neq 0 .
> $$

> [!BEWEIS]
> Nachrechnen: $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix} = \\begin{pmatrix} ad - bc & 0 \\\\ 0 & ad - bc \\end{pmatrix} = (ad - bc) I_2$. Teilen durch $ad - bc$ liefert $I_2$; das Produkt in umgekehrter Reihenfolge ergibt dasselbe.

Die Zahl $ad - bc$ ist die Determinante von $A$.

### Regeln für Inverse

$(A^{-1})^{-1} = A$, $(A^T)^{-1} = (A^{-1})^T$ und
$$
(AB)^{-1} = B^{-1} A^{-1},
$$
wieder mit umgekehrter Reihenfolge: $(AB)(B^{-1}A^{-1}) = A (BB^{-1}) A^{-1} = AA^{-1} = I$.

> [!MISTAKE] Durch eine Matrix teilen
> „$\\tfrac{A}{B}$“ ist nicht definiert. Aus $AX = B$ folgt $X = A^{-1}B$ (von **links** multiplizieren), aus $XA = B$ dagegen $X = BA^{-1}$. Da die Multiplikation nicht kommutativ ist, muss man die Seite beachten.

## Besondere Matrizen

- **Diagonalmatrizen** $D = \\operatorname{diag}(d_1, \\dots, d_n)$ wirken komponentenweise; $D^k = \\operatorname{diag}(d_1^k, \\dots, d_n^k)$, und $D^{-1}$ existiert, wenn kein $d_i = 0$ ist.
- **Dreiecksmatrizen** (nur auf und über bzw. unter der Diagonale besetzt) sind das Ergebnis des Gauß-Verfahrens; Systeme mit ihnen löst man durch Einsetzen in $O(n^2)$.
- **Orthogonale Matrizen** erfüllen $Q^TQ = I$, also $Q^{-1} = Q^T$; sie beschreiben Drehungen und Spiegelungen und erhalten Längen und Winkel.
- **Permutationsmatrizen** vertauschen Zeilen; sie entstehen aus $I$ durch Zeilentausch.

## Zusammenfassung

- $(AB)_{ij}$ = Zeile $i$ von $A$ mal Spalte $j$ von $B$; das Produkt entspricht der Verkettung von Abbildungen.
- Matrixmultiplikation ist assoziativ und distributiv, aber nicht kommutativ und hat Nullteiler.
- $(AB)^T = B^TA^T$ und $(AB)^{-1} = B^{-1}A^{-1}$ – die Reihenfolge kehrt sich um.
- $A$ invertierbar ⇔ Rang $n$ ⇔ $\\det A \\neq 0$; berechnen mit Gauß-Jordan an $(A \\mid I)$.
`;export{e as default};
