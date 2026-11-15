const e=`---
id: orthogonalitaet
title: Orthogonalität, Gram-Schmidt und QR
module: lineare-algebra
order: 8
difficulty: profi
minutes: 50
summary: Orthogonal- und Orthonormalbasen, Koordinaten per Skalarprodukt, orthogonale Projektion auf Unterräume, das Gram-Schmidt-Verfahren, orthogonale Matrizen und die QR-Zerlegung mit Anwendung auf Ausgleichsprobleme.
tags: [Orthonormalbasis, Gram-Schmidt, Orthogonale Projektion, Orthogonale Matrix, QR-Zerlegung, Ausgleichsrechnung]
requires: [vektoren, vektorraeume, lineare-abbildungen]
---

## Warum senkrechte Basen so praktisch sind

In einer beliebigen Basis muss man zum Bestimmen der Koordinaten eines Vektors ein Gleichungssystem lösen. Stehen die Basisvektoren dagegen paarweise senkrecht und haben Länge 1, liefert ein einziges [Skalarprodukt](#/mathe/lineare-algebra/vektoren) jede Koordinate. Diese Eigenschaft macht [[Orthonormalbasis|orthonormale Basen]] zum Rückgrat von Computergrafik, Signalverarbeitung (Fourier), Datenkompression (JPEG, PCA) und numerisch stabilen Algorithmen.

> [!DEFINITION] Orthogonal- und Orthonormalbasis
> Vektoren $\\vec q_1, \\dots, \\vec q_k$ heißen **orthogonal**, wenn $\\vec q_i \\cdot \\vec q_j = 0$ für $i \\neq j$, und **orthonormal**, wenn zusätzlich $\\norm{\\vec q_i} = 1$ für alle $i$. Kurz:
> $$
> \\vec q_i \\cdot \\vec q_j = \\delta_{ij} = \\begin{cases} 1, & i = j,\\\\ 0, & i \\neq j. \\end{cases}
> $$
> Eine Basis aus orthonormalen Vektoren heißt **Orthonormalbasis** (ONB).

> [!SATZ] Orthogonale Vektoren sind linear unabhängig
> Sind $\\vec q_1, \\dots, \\vec q_k \\neq \\vec 0$ paarweise orthogonal, so sind sie linear unabhängig.

> [!BEWEIS]
> Aus $\\lambda_1\\vec q_1 + \\dots + \\lambda_k\\vec q_k = \\vec 0$ folgt durch Skalarprodukt mit $\\vec q_j$: Alle Summanden außer dem $j$-ten fallen weg, also $\\lambda_j\\,\\norm{\\vec q_j}^2 = 0$ und damit $\\lambda_j = 0$.

> [!SATZ] Koordinaten in einer ONB
> Ist $\\vec q_1, \\dots, \\vec q_n$ eine Orthonormalbasis, so gilt für jeden Vektor
> $$
> \\vec v = \\sum_{i=1}^{n} (\\vec v \\cdot \\vec q_i)\\,\\vec q_i \\qquad\\text{und}\\qquad \\norm{\\vec v}^2 = \\sum_{i=1}^{n} (\\vec v \\cdot \\vec q_i)^2 .
> $$

Der zweite Teil ist der Satz des Pythagoras in $n$ Dimensionen (Parseval). In der Fourier-Analyse sind die Basisvektoren Sinus- und Kosinusschwingungen, und die Koordinaten sind die Frequenzanteile eines Signals.

## Orthogonale Projektion auf Unterräume

> [!SATZ] Projektion
> Sei $U$ ein Unterraum mit Orthonormalbasis $\\vec q_1, \\dots, \\vec q_k$. Dann ist
> $$
> P_U(\\vec v) = \\sum_{i=1}^{k} (\\vec v \\cdot \\vec q_i)\\,\\vec q_i
> $$
> der Punkt von $U$ mit dem **kleinsten Abstand** zu $\\vec v$, und $\\vec v - P_U(\\vec v)$ steht senkrecht auf $U$.

Mit $Q = (\\vec q_1 \\mid \\dots \\mid \\vec q_k)$ lautet die Projektionsmatrix $P = QQ^T$. Sie erfüllt $P^2 = P$ (zweimal projizieren ändert nichts) und $P^T = P$. Genau diese Projektion löst das Problem der kleinsten Quadrate in der [linearen Regression](#/mathe/optimierung/regression): $X\\vec w$ ist die Projektion von $\\vec y$ auf den Spaltenraum von $X$.

## Das Gram-Schmidt-Verfahren

Aus jeder Basis lässt sich schrittweise eine Orthonormalbasis desselben Raums machen: Von jedem neuen Vektor zieht man die Anteile in Richtung der bereits fertigen Vektoren ab und normiert den Rest.

> [!SATZ] Gram-Schmidt
> Seien $\\vec a_1, \\dots, \\vec a_k$ linear unabhängig. Setze für $j = 1, \\dots, k$:
> $$
> \\vec u_j = \\vec a_j - \\sum_{i=1}^{j-1} (\\vec a_j \\cdot \\vec q_i)\\,\\vec q_i, \\qquad \\vec q_j = \\frac{\\vec u_j}{\\norm{\\vec u_j}} .
> $$
> Dann ist $\\vec q_1, \\dots, \\vec q_k$ orthonormal, und für jedes $j$ spannen $\\vec q_1, \\dots, \\vec q_j$ denselben Raum auf wie $\\vec a_1, \\dots, \\vec a_j$.

> [!BEISPIEL] Zwei Vektoren im R³
> $\\vec a_1 = (1, 1, 0)$, $\\vec a_2 = (1, 0, 1)$.
>
> **Schritt 1:** $\\norm{\\vec a_1} = \\sqrt2$, also $\\vec q_1 = \\frac{1}{\\sqrt2}(1, 1, 0)$.
>
> **Schritt 2:** $\\vec a_2 \\cdot \\vec q_1 = \\frac{1}{\\sqrt2}$. Damit
> $$
> \\vec u_2 = (1, 0, 1) - \\frac{1}{\\sqrt2}\\cdot\\frac{1}{\\sqrt2}(1, 1, 0) = \\left(\\tfrac12, -\\tfrac12, 1\\right), \\qquad \\norm{\\vec u_2} = \\sqrt{\\tfrac14 + \\tfrac14 + 1} = \\sqrt{\\tfrac32} .
> $$
> $\\vec q_2 = \\frac{1}{\\sqrt6}(1, -1, 2)$. **Probe:** $\\vec q_1 \\cdot \\vec q_2 = \\frac{1}{\\sqrt{12}}(1 - 1 + 0) = 0$ ✓.

> [!WARNING] Numerisch instabil
> Das klassische Verfahren verliert bei fast parallelen Eingabevektoren durch Rundungsfehler die Orthogonalität. Das **modifizierte** Gram-Schmidt-Verfahren (die Projektion von jedem Zwischenergebnis abziehen statt vom Original) und vor allem **Householder-Spiegelungen** sind stabiler – sie werden in Bibliotheken verwendet.

## Orthogonale Matrizen

> [!DEFINITION] Orthogonale Matrix
> Eine quadratische Matrix $Q$ heißt **orthogonal**, wenn ihre Spalten eine Orthonormalbasis bilden, gleichwertig
> $$
> Q^TQ = I \\qquad\\text{also}\\qquad Q^{-1} = Q^T .
> $$

Orthogonale Matrizen sind ein Glücksfall:
- Die **Inverse** kostet nichts – man transponiert.
- Sie erhalten **Längen und Winkel**: $\\norm{Q\\vec x} = \\norm{\\vec x}$ und $Q\\vec x \\cdot Q\\vec y = \\vec x \\cdot \\vec y$. Es sind genau die Drehungen und Spiegelungen ([lineare Abbildungen](#/mathe/lineare-algebra/lineare-abbildungen)).
- $\\det Q = \\pm 1$ ($+1$ Drehung, $-1$ mit Spiegelung).
- Sie verstärken keine Rundungsfehler: Ihre Kondition ist $1$ – das Ideal der [Numerik](#/mathe/numerik/gleitkomma).

> [!TIP] Rotationsmatrizen in Spielen
> Nach vielen kleinen Rotationen ist eine Kamera-Matrix durch Rundungsfehler nicht mehr exakt orthogonal – Objekte werden leicht gestaucht oder geschert. Engines **re-orthonormalisieren** die Matrix deshalb regelmäßig (Gram-Schmidt auf die drei Achsen) oder speichern Rotationen als Quaternionen.

## Die QR-Zerlegung

Schreibt man Gram-Schmidt als Matrixgleichung, erhält man eine Zerlegung von $A$:

> [!SATZ] QR-Zerlegung
> Jede Matrix $A \\in \\R^{m\\times n}$ mit linear unabhängigen Spalten lässt sich schreiben als
> $$
> A = QR
> $$
> mit $Q \\in \\R^{m \\times n}$ mit orthonormalen Spalten und einer oberen Dreiecksmatrix $R \\in \\R^{n\\times n}$ mit positiver Diagonale.

Die Spalten von $Q$ sind die $\\vec q_j$ aus Gram-Schmidt, und $r_{ij} = \\vec a_j \\cdot \\vec q_i$ für $i < j$, $r_{jj} = \\norm{\\vec u_j}$. Im Beispiel oben ist $R = \\begin{pmatrix} \\sqrt2 & \\frac{1}{\\sqrt2} \\\\ 0 & \\sqrt{3/2}\\end{pmatrix}$.

**Anwendung Ausgleichsrechnung:** Statt der Normalengleichungen $A^TA\\vec x = A^T\\vec b$ (deren Kondition das Quadrat der Kondition von $A$ ist) löst man mit $A = QR$:
$$
A^TA\\vec x = A^T\\vec b \\iff R^TQ^TQR\\vec x = R^TQ^T\\vec b \\iff R\\vec x = Q^T\\vec b,
$$
ein Dreieckssystem, durch Rückwärtseinsetzen lösbar. So arbeiten \`numpy.linalg.lstsq\` und die meisten Statistikpakete.

**Anwendung Eigenwerte:** Der QR-Algorithmus zerlegt wiederholt $A_k = Q_kR_k$ und bildet $A_{k+1} = R_kQ_k$ – eine Folge [ähnlicher](#/mathe/lineare-algebra/lineare-abbildungen) Matrizen, die gegen eine Dreiecksform mit den [Eigenwerten](#/mathe/lineare-algebra/eigenwerte) auf der Diagonale konvergiert.

**Funktionen als Vektoren:** Dieselben Begriffe tragen in unendlich viele Dimensionen. Mit dem Skalarprodukt $\\frac1\\pi\\int_{-\\pi}^{\\pi} f g\\,\\mathrm dx$ sind $\\cos nx$ und $\\sin nx$ orthonormal; Koeffizienten sind Skalarprodukte, Partialsummen orthogonale Projektionen – das ist die Theorie der [Fourier-Reihen](#/mathe/analysis-2/fourier-reihen).

## Zusammenfassung

- Orthonormal: $\\vec q_i\\cdot\\vec q_j = \\delta_{ij}$; Koordinaten sind Skalarprodukte, $\\norm{\\vec v}^2 = \\sum (\\vec v\\cdot\\vec q_i)^2$.
- Projektion auf $U$: $\\sum (\\vec v\\cdot\\vec q_i)\\vec q_i = QQ^T\\vec v$ – der nächste Punkt, Grundlage der kleinsten Quadrate.
- Gram-Schmidt: Anteile der fertigen Vektoren abziehen, normieren; numerisch besser modifiziert oder mit Householder.
- Orthogonale Matrizen: $Q^{-1} = Q^T$, längen- und winkeltreu, Kondition 1; $A = QR$ löst Ausgleichs- und Eigenwertprobleme stabil.
`;export{e as default};
