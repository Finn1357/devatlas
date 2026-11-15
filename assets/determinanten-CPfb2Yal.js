const e=`---
id: determinanten
title: Determinanten
module: lineare-algebra
order: 4
difficulty: fortgeschritten
minutes: 40
summary: Die Determinante als Volumenfaktor, Formeln für 2×2 und 3×3 (Sarrus), Laplace-Entwicklung, Rechenregeln, effiziente Berechnung mit dem Gauß-Verfahren und die Cramersche Regel.
tags: [Determinante, Sarrus, Laplace-Entwicklung, Volumen, Invertierbarkeit, Cramersche Regel]
requires: [matrizen]
---

## Die Idee: ein Volumen-Streckfaktor

Eine quadratische Matrix $A$ bildet das Einheitsquadrat (bzw. den Einheitswürfel) auf ein Parallelogramm (bzw. Parallelepiped) ab, das von den Spalten von $A$ aufgespannt wird. Die **[[Determinante]]** $\\det A$ ist dessen **orientierter Flächeninhalt bzw. Volumen**: Der Betrag gibt an, um welchen Faktor $A$ Flächen oder Volumen streckt, das Vorzeichen, ob die Orientierung erhalten bleibt (positiv) oder gespiegelt wird (negativ).

Daraus ergibt sich sofort die wichtigste Eigenschaft: $\\det A = 0$ genau dann, wenn das Bild „plattgedrückt“ ist – die Spalten liegen in einer niedrigeren Dimension, und $A$ ist nicht invertierbar.

## Kleine Formate

> [!DEFINITION] Determinante einer 2×2-Matrix
> $$
> \\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = \\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc .
> $$

Beispiel: Die Spalten $(3, 1)$ und $(1, 2)$ spannen ein Parallelogramm mit Fläche $\\abs{3 \\cdot 2 - 1 \\cdot 1} = 5$ auf.

> [!SATZ] Regel von Sarrus (nur 3×3)
> $$
> \\begin{vmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{vmatrix}
> = a_{11}a_{22}a_{33} + a_{12}a_{23}a_{31} + a_{13}a_{21}a_{32} - a_{13}a_{22}a_{31} - a_{11}a_{23}a_{32} - a_{12}a_{21}a_{33} .
> $$
> Merkhilfe: die ersten beiden Spalten rechts daneben schreiben; drei Hauptdiagonalen addieren, drei Nebendiagonalen subtrahieren.

> [!BEISPIEL] Sarrus
> $$
> \\begin{vmatrix} 2 & -1 & 0 \\\\ 1 & 3 & 2 \\\\ 0 & 1 & 4 \\end{vmatrix} = 2\\cdot3\\cdot4 + (-1)\\cdot2\\cdot0 + 0\\cdot1\\cdot1 - 0\\cdot3\\cdot0 - 2\\cdot2\\cdot1 - (-1)\\cdot1\\cdot4 = 24 - 4 + 4 = 24 .
> $$

> [!MISTAKE] Sarrus für 4×4
> Die Regel von Sarrus gilt **nur** für $3 \\times 3$. Eine $4 \\times 4$-Determinante hat $4! = 24$ Summanden, Sarrus liefert nur 8 davon.

## Laplace-Entwicklung

Für größere Matrizen führt man die Determinante rekursiv auf kleinere zurück. $A_{ij}$ bezeichne die Matrix, die durch Streichen von Zeile $i$ und Spalte $j$ entsteht.

> [!SATZ] Laplacescher Entwicklungssatz
> Für jede Zeile $i$ gilt
> $$
> \\det A = \\sum_{j=1}^{n} (-1)^{i+j}\\, a_{ij} \\det A_{ij},
> $$
> und ebenso die Entwicklung nach jeder Spalte $j$: $\\det A = \\sum_{i=1}^{n} (-1)^{i+j}\\, a_{ij} \\det A_{ij}$.

Die Vorzeichen $(-1)^{i+j}$ bilden ein Schachbrettmuster $\\begin{smallmatrix} + & - & + \\\\ - & + & - \\\\ + & - & + \\end{smallmatrix}$. Man entwickelt am besten nach einer Zeile oder Spalte mit vielen Nullen.

> [!BEISPIEL] Entwicklung nach der ersten Spalte
> $$
> \\begin{vmatrix} 2 & -1 & 0 \\\\ 1 & 3 & 2 \\\\ 0 & 1 & 4 \\end{vmatrix} = 2 \\begin{vmatrix} 3 & 2 \\\\ 1 & 4 \\end{vmatrix} - 1 \\begin{vmatrix} -1 & 0 \\\\ 1 & 4 \\end{vmatrix} + 0 = 2 \\cdot 10 - 1 \\cdot (-4) = 24 .
> $$

> [!WARNING] Laplace ist für große n unbrauchbar
> Die vollständige Entwicklung hat $n!$ Summanden. Für $n = 20$ sind das etwa $2{,}4 \\cdot 10^{18}$ – zu viele für jeden Computer. Das Gauß-Verfahren braucht dagegen nur etwa $\\tfrac23 n^3$ Operationen.

## Rechenregeln

> [!SATZ] Eigenschaften der Determinante
> Für $A, B \\in \\R^{n \\times n}$ und $\\lambda \\in \\R$:
> 1. Vertauschen zweier Zeilen ändert das Vorzeichen.
> 2. Multipliziert man **eine** Zeile mit $\\lambda$, wird $\\det$ mit $\\lambda$ multipliziert; daher $\\det(\\lambda A) = \\lambda^n \\det A$.
> 3. Addiert man ein Vielfaches einer Zeile zu einer anderen, ändert sich $\\det$ **nicht**.
> 4. Hat $A$ eine Nullzeile oder zwei gleiche Zeilen, ist $\\det A = 0$.
> 5. Für Dreiecksmatrizen ist $\\det A$ das Produkt der Diagonalelemente.
> 6. $\\det(A^T) = \\det A$ – alle Regeln gelten daher auch für Spalten.
> 7. **Multiplikationssatz:** $\\det(AB) = \\det A \\cdot \\det B$.
> 8. $A$ ist genau dann invertierbar, wenn $\\det A \\neq 0$; dann ist $\\det(A^{-1}) = \\dfrac{1}{\\det A}$.

Regel 7 passt zur geometrischen Deutung: Erst um den Faktor $\\det B$ strecken, dann um $\\det A$ – insgesamt um das Produkt. Regel 8 folgt aus 7: $\\det A \\cdot \\det A^{-1} = \\det I = 1$.

> [!MISTAKE] Keine Additivität
> Im Allgemeinen ist $\\det(A + B) \\neq \\det A + \\det B$. Beispiel: $\\det I_2 + \\det I_2 = 2$, aber $\\det(2 I_2) = 4$.

## Berechnung mit dem Gauß-Verfahren

Die Regeln 1, 3 und 5 ergeben das effiziente Verfahren: Man bringt $A$ mit Zeilenvertauschungen und Additionen von Vielfachen auf obere Dreiecksform $R$. Dann ist
$$
\\det A = (-1)^{s} \\cdot r_{11} r_{22} \\cdots r_{nn},
$$
wobei $s$ die Anzahl der Zeilenvertauschungen ist. Skaliert man unterwegs Zeilen, muss man die Faktoren berücksichtigen.

> [!BEISPIEL] Eine 4×4-Determinante
> $$
> \\begin{vmatrix} 1 & 2 & 0 & 1 \\\\ 2 & 4 & 1 & 3 \\\\ 0 & 1 & 1 & 0 \\\\ 1 & 3 & 2 & 2 \\end{vmatrix}
> \\overset{\\substack{Z_2 - 2Z_1\\\\ Z_4 - Z_1}}{=}
> \\begin{vmatrix} 1 & 2 & 0 & 1 \\\\ 0 & 0 & 1 & 1 \\\\ 0 & 1 & 1 & 0 \\\\ 0 & 1 & 2 & 1 \\end{vmatrix}
> \\overset{Z_2 \\leftrightarrow Z_3}{=}
> -\\begin{vmatrix} 1 & 2 & 0 & 1 \\\\ 0 & 1 & 1 & 0 \\\\ 0 & 0 & 1 & 1 \\\\ 0 & 1 & 2 & 1 \\end{vmatrix}
> $$
> $$
> \\overset{Z_4 - Z_2}{=}
> -\\begin{vmatrix} 1 & 2 & 0 & 1 \\\\ 0 & 1 & 1 & 0 \\\\ 0 & 0 & 1 & 1 \\\\ 0 & 0 & 1 & 1 \\end{vmatrix}
> = 0,
> $$
> denn die letzten beiden Zeilen sind gleich (Regel 4). Die Matrix ist singulär – für ihre Zeilen gilt $Z_4 = Z_2 + Z_3 - Z_1$.

Der [Gauß-Rechner](#/mathe/labor/gauss?modus=det) zeigt diesen Weg Schritt für Schritt.

## Anwendungen

### Invertierbarkeit mit Parameter

> [!BEISPIEL] Für welche t ist A invertierbar?
> $$
> \\det \\begin{pmatrix} 1 & t \\\\ t & 4 \\end{pmatrix} = 4 - t^2 = (2 - t)(2 + t).
> $$
> $A$ ist genau dann invertierbar, wenn $t \\neq \\pm 2$. Für $t = \\pm 2$ sind die Zeilen Vielfache voneinander.

### Cramersche Regel

> [!SATZ] Cramersche Regel
> Ist $\\det A \\neq 0$, so ist die eindeutige Lösung von $A\\vec x = \\vec b$ gegeben durch
> $$
> x_i = \\frac{\\det A_i}{\\det A},
> $$
> wobei $A_i$ aus $A$ entsteht, indem man die $i$-te Spalte durch $\\vec b$ ersetzt.

> [!BEISPIEL] Cramer im 2×2-Fall
> $2x + y = 5$, $x - 3y = -1$: $\\det A = -6 - 1 = -7$, $\\det A_1 = \\begin{vmatrix} 5 & 1 \\\\ -1 & -3 \\end{vmatrix} = -14$, $\\det A_2 = \\begin{vmatrix} 2 & 5 \\\\ 1 & -1 \\end{vmatrix} = -7$. Also $x = 2$, $y = 1$.

Für Handrechnungen mit $2 \\times 2$ oder $3 \\times 3$ ist die Regel bequem; für große Systeme ist sie wegen der vielen Determinanten ineffizient.

### Flächen und Volumen

- Fläche des Dreiecks mit Ecken $P, Q, R$ in der Ebene: $\\tfrac12 \\abs{\\det(\\vec q - \\vec p, \\; \\vec r - \\vec p)}$.
- Volumen des von $\\vec u, \\vec v, \\vec w$ aufgespannten Spats: $\\abs{\\det(\\vec u, \\vec v, \\vec w)} = \\abs{\\vec u \\cdot (\\vec v \\times \\vec w)}$.
- Bei der **Substitutionsregel** für Mehrfachintegrale ist der Betrag der Jacobi-Determinante der lokale Flächenfaktor – daher das $r$ in $\\dd x \\dd y = r \\dd r \\dd \\varphi$ bei Polarkoordinaten.

### Eigenwerte

Die Eigenwerte einer Matrix sind die Nullstellen von $\\det(A - \\lambda I)$ – Thema der Lektion [Eigenwerte und Eigenvektoren](#/mathe/lineare-algebra/eigenwerte).

## Zusammenfassung

- $\\det A$ ist der orientierte Volumenfaktor; $\\det A = 0$ ⇔ $A$ singulär.
- $2\\times2$: $ad - bc$; $3 \\times 3$: Sarrus; allgemein: Laplace (nur bei vielen Nullen) oder Gauß.
- Zeilentausch kehrt das Vorzeichen um, Addieren von Vielfachen ändert nichts, Skalieren einer Zeile skaliert die Determinante.
- $\\det(AB) = \\det A\\det B$, $\\det A^T = \\det A$, aber $\\det(A + B) \\neq \\det A + \\det B$.
`;export{e as default};
