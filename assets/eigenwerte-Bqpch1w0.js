const e=`---
id: eigenwerte
title: Eigenwerte und Eigenvektoren
module: lineare-algebra
order: 7
difficulty: profi
minutes: 50
summary: Eigenwerte und Eigenvektoren, das charakteristische Polynom, Eigenräume, Diagonalisierung und ihre Anwendungen von Matrixpotenzen über Fibonacci bis PageRank.
tags: [Eigenwert, Eigenvektor, Charakteristisches Polynom, Diagonalisierung, Spektralsatz, PageRank]
requires: [determinanten, vektorraeume]
---

## Richtungen, die nur gestreckt werden

Eine Matrix bildet die meisten Vektoren in eine neue Richtung ab. Manche Richtungen aber bleiben erhalten – die Vektoren werden nur gestreckt, gestaucht oder umgedreht. Diese Richtungen verraten, was die Abbildung „eigentlich“ tut.

> [!DEFINITION] Eigenwert und Eigenvektor
> Sei $A \\in \\R^{n\\times n}$. Eine Zahl $\\lambda$ heißt **[[Eigenwert]]** von $A$, wenn es einen Vektor $\\vec v \\neq \\vec 0$ gibt mit
> $$
> A \\vec v = \\lambda \\vec v .
> $$
> Jedes solche $\\vec v$ heißt **Eigenvektor** zum Eigenwert $\\lambda$.

Der Nullvektor ist ausgeschlossen, weil $A\\vec 0 = \\lambda\\vec 0$ für jedes $\\lambda$ gilt. Im Labor [Matrix-Transformationen](#/mathe/labor/transformation) werden die Eigenrichtungen jeder $2 \\times 2$-Matrix als gestrichelte Geraden angezeigt – sie bleiben bei der Abbildung als einzige Geraden durch den Ursprung an ihrem Platz. Vielfache eines Eigenvektors ($\\ne \\vec 0$) sind wieder Eigenvektoren zum selben Eigenwert.

> [!BEISPIEL] Geometrische Beispiele
> - Die Spiegelung an der $x$-Achse, $A = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$, hat den Eigenwert $1$ mit Eigenvektor $\\vec e_1$ (bleibt fest) und $-1$ mit Eigenvektor $\\vec e_2$ (wird umgedreht).
> - Die Projektion auf die $x$-Achse hat die Eigenwerte $1$ ($\\vec e_1$) und $0$ ($\\vec e_2$ wird auf $\\vec 0$ abgebildet).
> - Eine Drehung um $90^\\circ$ in der Ebene hat **keinen** reellen Eigenwert – jede Richtung wird gedreht. (Über $\\C$ hat sie die Eigenwerte $\\pm\\ii$.)

## Das charakteristische Polynom

Wie findet man Eigenwerte? Die Gleichung $A\\vec v = \\lambda\\vec v$ ist äquivalent zu
$$
(A - \\lambda I)\\vec v = \\vec 0 .
$$
Dieses homogene System hat genau dann eine Lösung $\\vec v \\neq \\vec 0$, wenn $A - \\lambda I$ singulär ist, also wenn die Determinante verschwindet.

> [!SATZ] Eigenwerte als Nullstellen
> $\\lambda$ ist genau dann Eigenwert von $A$, wenn
> $$
> \\chi_A(\\lambda) := \\det(A - \\lambda I) = 0 .
> $$
> $\\chi_A$ ist ein Polynom vom Grad $n$, das **charakteristische Polynom**. Eine $n\\times n$-Matrix hat daher höchstens $n$ verschiedene Eigenwerte.

**Rezept:**
1. $\\chi_A(\\lambda) = \\det(A - \\lambda I)$ berechnen und die Nullstellen bestimmen.
2. Für jeden Eigenwert $\\lambda$ das homogene LGS $(A - \\lambda I)\\vec v = \\vec 0$ lösen. Die Lösungsmenge ist der **Eigenraum** $E_\\lambda = \\Kern(A - \\lambda I)$.

> [!BEISPIEL] Vollständige Rechnung
> $A = \\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$.
>
> **Polynom:** $\\chi_A(\\lambda) = (4 - \\lambda)(3 - \\lambda) - 2 = \\lambda^2 - 7\\lambda + 10 = (\\lambda - 2)(\\lambda - 5)$. Eigenwerte $\\lambda_1 = 2$, $\\lambda_2 = 5$.
>
> **Eigenvektoren zu $\\lambda_1 = 2$:** $A - 2I = \\begin{pmatrix} 2 & 1 \\\\ 2 & 1 \\end{pmatrix}$, also $2v_1 + v_2 = 0$, etwa $\\vec v_1 = \\begin{pmatrix} 1 \\\\ -2 \\end{pmatrix}$.
>
> **Zu $\\lambda_2 = 5$:** $A - 5I = \\begin{pmatrix} -1 & 1 \\\\ 2 & -2 \\end{pmatrix}$, also $v_1 = v_2$, etwa $\\vec v_2 = \\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix}$.
>
> **Probe:** $A\\vec v_2 = (5, 5)^T = 5\\vec v_2$. ✓

Zwei Kontrollen sparen viel Ärger:

> [!SATZ] Spur und Determinante
> Sind $\\lambda_1, \\dots, \\lambda_n$ die (komplexen, mit Vielfachheit gezählten) Eigenwerte von $A$, so gilt
> $$
> \\lambda_1 + \\dots + \\lambda_n = \\spur A = a_{11} + \\dots + a_{nn}, \\qquad \\lambda_1 \\cdots \\lambda_n = \\det A .
> $$

Im Beispiel: $2 + 5 = 7 = 4 + 3$ und $2 \\cdot 5 = 10 = 12 - 2$. ✓ Für $2 \\times 2$-Matrizen folgt daraus sofort $\\chi_A(\\lambda) = \\lambda^2 - (\\spur A)\\lambda + \\det A$.

Für Dreiecksmatrizen sind die Eigenwerte die Diagonaleinträge, denn $\\det(A - \\lambda I)$ ist dann das Produkt der Diagonale.

## Vielfachheiten

Ein Eigenwert hat zwei Vielfachheiten:
- die **algebraische** Vielfachheit: Vielfachheit als Nullstelle von $\\chi_A$;
- die **geometrische** Vielfachheit: $\\dim E_\\lambda$, die Anzahl linear unabhängiger Eigenvektoren.

Stets gilt $1 \\le$ geometrisch $\\le$ algebraisch.

> [!BEISPIEL] Zu wenige Eigenvektoren
> $J = \\begin{pmatrix} 2 & 1 \\\\ 0 & 2 \\end{pmatrix}$ hat $\\chi_J(\\lambda) = (2 - \\lambda)^2$, also den Eigenwert $2$ mit algebraischer Vielfachheit 2. Aber $J - 2I = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0\\end{pmatrix}$ hat einen eindimensionalen Kern ($v_2 = 0$): geometrische Vielfachheit 1. Diese Scherung hat nur **eine** Eigenrichtung.

## Diagonalisierung

> [!SATZ] Diagonalisierbarkeit
> $A \\in \\R^{n\\times n}$ ist genau dann **diagonalisierbar**, wenn es eine Basis des $\\R^n$ aus Eigenvektoren gibt. Dann gilt mit $S = (\\vec v_1 \\mid \\dots \\mid \\vec v_n)$ (Eigenvektoren als Spalten) und $D = \\operatorname{diag}(\\lambda_1, \\dots, \\lambda_n)$:
> $$
> A = S D S^{-1} \\qquad\\text{bzw.}\\qquad S^{-1}AS = D .
> $$

> [!BEWEIS]
> Die Gleichungen $A\\vec v_i = \\lambda_i \\vec v_i$ lauten zusammengefasst $AS = SD$, denn die $i$-te Spalte von $AS$ ist $A\\vec v_i$ und die von $SD$ ist $\\lambda_i \\vec v_i$. Bilden die $\\vec v_i$ eine Basis, ist $S$ invertierbar, und Multiplikation mit $S^{-1}$ von rechts liefert $A = SDS^{-1}$. Umgekehrt liest man aus $AS = SD$ mit invertierbarem $S$ ab, dass die Spalten von $S$ eine Eigenbasis bilden.

Hinreichend ist zum Beispiel: $A$ hat $n$ **verschiedene** Eigenwerte (Eigenvektoren zu verschiedenen Eigenwerten sind immer linear unabhängig). Die Scherung $J$ oben ist nicht diagonalisierbar.

### Anwendung: Matrixpotenzen

Aus $A = SDS^{-1}$ folgt
$$
A^k = S D S^{-1} S D S^{-1} \\cdots S D S^{-1} = S D^k S^{-1}, \\qquad D^k = \\operatorname{diag}(\\lambda_1^k, \\dots, \\lambda_n^k).
$$
Statt $k$ Matrixmultiplikationen genügt es, $n$ Zahlen zu potenzieren. Vor allem sieht man das **Langzeitverhalten**: Der betragsgrößte Eigenwert dominiert $A^k\\vec x$ für große $k$.

> [!BEISPIEL] Fibonacci-Zahlen in geschlossener Form
> Mit $\\vec f_n = (F_{n+1}, F_n)^T$ gilt $\\vec f_{n} = A \\vec f_{n-1}$ für $A = \\begin{pmatrix} 1 & 1 \\\\ 1 & 0\\end{pmatrix}$, also $\\vec f_n = A^n \\vec f_0$. Das charakteristische Polynom $\\lambda^2 - \\lambda - 1$ hat die Nullstellen $\\varphi = \\tfrac{1 + \\sqrt5}{2}$ und $\\psi = \\tfrac{1 - \\sqrt 5}{2}$. Diagonalisieren liefert die **Formel von Binet**
> $$
> F_n = \\frac{\\varphi^n - \\psi^n}{\\sqrt 5}.
> $$
> Wegen $\\abs\\psi < 1$ ist $F_n$ die auf eine ganze Zahl gerundete Zahl $\\tfrac{\\varphi^n}{\\sqrt 5}$ – das Wachstum ist exponentiell mit Basis $\\varphi \\approx 1{,}618$.

## Symmetrische Matrizen

> [!SATZ] Spektralsatz
> Jede symmetrische Matrix $A = A^T \\in \\R^{n\\times n}$ hat nur reelle Eigenwerte und besitzt eine **Orthonormalbasis** aus Eigenvektoren. Es gilt also $A = Q D Q^T$ mit einer orthogonalen Matrix $Q$ ($Q^TQ = I$).

Symmetrische Matrizen sind daher immer diagonalisierbar, und Eigenvektoren zu verschiedenen Eigenwerten stehen senkrecht aufeinander. Symmetrische Matrizen sind überall: Kovarianzmatrizen in der Statistik, Hesse-Matrizen in der Optimierung, Adjazenzmatrizen ungerichteter Graphen.

> [!TIP] Hauptkomponentenanalyse (PCA)
> Die Eigenvektoren der Kovarianzmatrix eines Datensatzes zeigen in die Richtungen größter Streuung, die Eigenwerte geben die Varianz in diesen Richtungen an. Projiziert man Daten auf die Eigenvektoren mit den größten Eigenwerten, reduziert man die Dimension bei minimalem Informationsverlust – ein Standardschritt im Machine Learning.

## PageRank: ein Eigenvektor im Web

Googles ursprünglicher PageRank-Algorithmus fasst das Web als Markow-Kette auf: Ein zufälliger Surfer folgt von jeder Seite einem zufälligen Link. Die Übergangsmatrix $P$ hat Spaltensummen 1. Die **Wichtigkeit** der Seiten ist der Vektor $\\vec r$ mit
$$
P\\vec r = \\vec r ,
$$
also ein Eigenvektor zum Eigenwert $1$. Bei Milliarden Seiten berechnet man ihn nicht über das charakteristische Polynom, sondern mit der **Potenzmethode**: $\\vec r_{k+1} = P\\vec r_k$, bis sich nichts mehr ändert. Sie konvergiert gegen den Eigenvektor zum betragsgrößten Eigenwert – dieselbe Idee wie bei den Matrixpotenzen oben. Warum der Eigenvektor eindeutig ist, wie die Dämpfung Sackgassen im Web behandelt und wie schnell die Iteration konvergiert, zeigt die Lektion [Markow-Ketten und PageRank](#/mathe/stochastik/markow-ketten).

> [!EXPERT] Numerische Eigenwertberechnung
> Das charakteristische Polynom ist für die numerische Praxis ungeeignet: Nullstellen von Polynomen hohen Grades reagieren extrem empfindlich auf Rundungsfehler. Bibliotheken (LAPACK, \`numpy.linalg.eig\`) verwenden den **QR-Algorithmus**, der $A$ durch orthogonale Ähnlichkeitstransformationen schrittweise auf (Block-)Dreiecksform bringt, an der die Eigenwerte abzulesen sind.

## Zusammenfassung

- $A\\vec v = \\lambda\\vec v$ mit $\\vec v \\neq \\vec 0$; Eigenwerte sind die Nullstellen von $\\det(A - \\lambda I)$, Eigenvektoren die Lösungen von $(A - \\lambda I)\\vec v = \\vec 0$.
- Kontrolle: Summe der Eigenwerte $= \\spur A$, Produkt $= \\det A$.
- Diagonalisierbar ⇔ Eigenbasis existiert; dann $A = SDS^{-1}$ und $A^k = SD^kS^{-1}$.
- Symmetrische Matrizen sind orthogonal diagonalisierbar (Spektralsatz) – Grundlage von PCA.
`;export{e as default};
