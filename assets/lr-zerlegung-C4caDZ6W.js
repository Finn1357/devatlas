const e=`---
id: lr-zerlegung
title: LR-Zerlegung und iterative Verfahren
module: numerik
order: 5
difficulty: profi
minutes: 50
summary: Das Gauß-Verfahren als Matrixzerlegung A = LR, Vorwärts- und Rückwärtseinsetzen, Spaltenpivotisierung mit PA = LR, Aufwand, Cholesky-Zerlegung und iterative Verfahren wie Jacobi und Gauß-Seidel für große dünn besetzte Systeme.
tags: [LR-Zerlegung, LU-Zerlegung, Pivotisierung, Cholesky, Jacobi-Verfahren, Gauß-Seidel, Dünn besetzt]
requires: [lgs-gauss, matrizen, gleitkomma]
---

## Gauß als Zerlegung

Beim [Gauß-Verfahren](#/mathe/lineare-algebra/lgs-gauss) wird die Matrix $A$ durch Zeilenumformungen in eine obere Dreiecksmatrix $R$ überführt. Merkt man sich dabei die verwendeten Multiplikatoren, erhält man eine **Zerlegung** von $A$, die sich für beliebig viele rechte Seiten wiederverwenden lässt.

> [!DEFINITION] LR-Zerlegung
> Eine **[[LR-Zerlegung]]** (englisch LU decomposition) von $A \\in \\R^{n\\times n}$ ist eine Darstellung
> $$
> A = L\\,R
> $$
> mit einer **unteren** Dreiecksmatrix $L$ mit Einsen auf der Diagonale und einer **oberen** Dreiecksmatrix $R$.

Die Einträge von $L$ unterhalb der Diagonale sind genau die Multiplikatoren $\\ell_{ik} = \\frac{a_{ik}}{a_{kk}}$, mit denen beim Eliminieren Zeile $k$ von Zeile $i$ abgezogen wird.

> [!BEISPIEL] Eine 3×3-Zerlegung
> $$
> A = \\begin{pmatrix} 2 & 1 & 1 \\\\ 4 & 3 & 3 \\\\ 8 & 7 & 9 \\end{pmatrix}.
> $$
> Spalte 1: $Z_2 - 2Z_1$, $Z_3 - 4Z_1$ ergibt $\\begin{pmatrix} 2 & 1 & 1 \\\\ 0 & 1 & 1 \\\\ 0 & 3 & 5 \\end{pmatrix}$; Multiplikatoren $\\ell_{21} = 2$, $\\ell_{31} = 4$.
> Spalte 2: $Z_3 - 3Z_2$ ergibt $R$; Multiplikator $\\ell_{32} = 3$.
> $$
> L = \\begin{pmatrix} 1 & 0 & 0 \\\\ 2 & 1 & 0 \\\\ 4 & 3 & 1 \\end{pmatrix}, \\qquad R = \\begin{pmatrix} 2 & 1 & 1 \\\\ 0 & 1 & 1 \\\\ 0 & 0 & 2 \\end{pmatrix}.
> $$
> Probe: Zeile 3 von $LR$ ist $4 \\cdot (2, 1, 1) + 3 \\cdot (0, 1, 1) + 1 \\cdot (0, 0, 2) = (8, 7, 9)$ ✓.

## Lösen mit der Zerlegung

Aus $A\\vec x = \\vec b$ wird $L(R\\vec x) = \\vec b$. Man löst in zwei Schritten:
1. **Vorwärtseinsetzen:** $L\\vec y = \\vec b$ von oben nach unten: $y_i = b_i - \\sum_{j < i} \\ell_{ij} y_j$.
2. **Rückwärtseinsetzen:** $R\\vec x = \\vec y$ von unten nach oben: $x_i = \\frac{1}{r_{ii}}\\left(y_i - \\sum_{j > i} r_{ij} x_j\\right)$.

> [!BEISPIEL] Mit der Zerlegung von oben
> $\\vec b = (4, 10, 24)^T$. Vorwärts: $y_1 = 4$, $y_2 = 10 - 2 \\cdot 4 = 2$, $y_3 = 24 - 4 \\cdot 4 - 3 \\cdot 2 = 2$. Rückwärts: $x_3 = \\frac22 = 1$, $x_2 = 2 - 1 = 1$, $x_1 = \\frac{4 - 1 - 1}{2} = 1$. Also $\\vec x = (1, 1, 1)^T$ – Probe: Die Zeilensummen von $A$ sind $4, 10, 24$ ✓.

**Aufwand:** Die Zerlegung kostet etwa $\\frac23 n^3$ Operationen, jedes Einsetzen nur $n^2$. Bei vielen rechten Seiten – etwa in einer Simulation mit fester Matrix und wechselnden Lasten – zerlegt man einmal und löst dann jedes System in $O(n^2)$. Die Inverse $A^{-1}$ zu berechnen wäre teurer und ungenauer; deshalb gilt in der Numerik die Regel: **Niemals invertieren, immer zerlegen.**

Nebenbei liefert die Zerlegung die [Determinante](#/mathe/lineare-algebra/determinanten): $\\det A = \\det L \\cdot \\det R = r_{11} r_{22}\\cdots r_{nn}$, im Beispiel $2 \\cdot 1 \\cdot 2 = 4$.

## Pivotisierung

Nicht jede invertierbare Matrix hat eine LR-Zerlegung: Für $\\begin{pmatrix} 0 & 1 \\\\ 1 & 0\\end{pmatrix}$ ist schon das erste Pivotelement null. Noch wichtiger ist die Numerik: **Kleine** Pivotelemente erzeugen riesige Multiplikatoren, und Rundungsfehler werden verstärkt.

> [!BEISPIEL] Ein winziges Pivot
> $$
> \\begin{pmatrix} 10^{-20} & 1 \\\\ 1 & 1 \\end{pmatrix}\\vec x = \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}, \\qquad \\text{exakt } \\vec x \\approx (1, 1) .
> $$
> Ohne Pivotisierung: $\\ell_{21} = 10^{20}$, also $r_{22} = 1 - 10^{20}$, in \`double\` gerundet zu $-10^{20}$. Rückwärtseinsetzen liefert $x_2 = 1$ und dann $x_1 = \\frac{1 - 1}{10^{-20}} = 0$ – völlig falsch. Vertauscht man zuerst die Zeilen, ist der Multiplikator $10^{-20}$ und das Ergebnis korrekt auf alle Stellen.

> [!SATZ] LR-Zerlegung mit Spaltenpivotisierung
> Für jede invertierbare Matrix $A$ gibt es eine **Permutationsmatrix** $P$ (sie vertauscht Zeilen), sodass
> $$
> PA = LR .
> $$
> Wählt man in jeder Spalte das **betragsgrößte** Element als Pivot, sind alle Multiplikatoren betragsmäßig $\\le 1$; das Verfahren ist in der Praxis stabil ([Stabilität](#/mathe/numerik/gleitkomma)).

Zum Lösen von $A\\vec x = \\vec b$ wendet man die Vertauschungen auch auf $\\vec b$ an: $LR\\vec x = P\\vec b$. So arbeiten \`numpy.linalg.solve\`, \`scipy.linalg.lu_factor\` und MATLABs Backslash-Operator (über LAPACK).

## Cholesky-Zerlegung

Ist $A$ **symmetrisch und positiv definit** (alle [Eigenwerte](#/mathe/lineare-algebra/eigenwerte) positiv) – etwa eine Kovarianzmatrix oder die Matrix $A^TA$ der Ausgleichsrechnung –, gibt es eine besonders effiziente Zerlegung:
$$
A = G\\,G^T
$$
mit einer unteren Dreiecksmatrix $G$ mit positiver Diagonale. Sie braucht nur halb so viele Operationen wie die LR-Zerlegung, keine Pivotisierung und ist stets stabil. Gelingt die Cholesky-Zerlegung nicht (eine Wurzel aus einer negativen Zahl wäre nötig), ist die Matrix nicht positiv definit – ein praktischer Test.

> [!TIP] Zufallsvektoren mit Korrelation
> Um normalverteilte Zufallsvektoren mit Kovarianzmatrix $\\Sigma$ zu erzeugen, berechnet man $\\Sigma = GG^T$ und bildet $\\vec x = G\\vec z$ aus unabhängigen Standardnormalverteilten $\\vec z$. Dann ist $\\operatorname{Cov}(\\vec x) = G\\,I\\,G^T = \\Sigma$. So simulieren Monte-Carlo-Modelle korrelierte Aktienkurse oder Sensordaten.

## Iterative Verfahren für große Systeme

Bei Simulationen auf Gittern (Wärmeleitung, Strömung, Finite Elemente) oder bei Graphen mit Millionen Knoten ist $A$ riesig, aber **dünn besetzt**: In jeder Zeile stehen nur wenige Nicht-Null-Einträge. Eine LR-Zerlegung würde diese Struktur zerstören („Fill-in“) und unbezahlbar viel Speicher brauchen. Iterative Verfahren nutzen nur Matrix-Vektor-Produkte, die bei dünnen Matrizen billig sind.

> [!DEFINITION] Jacobi- und Gauß-Seidel-Verfahren
> Löse die $i$-te Gleichung nach $x_i$ auf und setze die aktuellen Näherungen ein:
> $$
> \\text{Jacobi: } x_i^{(k+1)} = \\frac{1}{a_{ii}}\\Big(b_i - \\sum_{j \\neq i} a_{ij}\\,x_j^{(k)}\\Big),
> $$
> $$
> \\text{Gauß-Seidel: } x_i^{(k+1)} = \\frac{1}{a_{ii}}\\Big(b_i - \\sum_{j < i} a_{ij}\\,x_j^{(k+1)} - \\sum_{j > i} a_{ij}\\,x_j^{(k)}\\Big).
> $$
> Gauß-Seidel verwendet schon berechnete neue Werte sofort.

> [!SATZ] Konvergenzkriterium
> Ist $A$ **strikt diagonaldominant**, also $\\abs{a_{ii}} > \\sum_{j \\ne i}\\abs{a_{ij}}$ für jede Zeile, so konvergieren Jacobi- und Gauß-Seidel-Verfahren für jeden Startvektor gegen die Lösung.

Beide sind [Fixpunktiterationen](#/mathe/numerik/nullstellen) $\\vec x^{(k+1)} = M\\vec x^{(k)} + \\vec c$; die Diagonaldominanz sorgt dafür, dass $M$ kontrahiert. Für große symmetrisch positiv definite Systeme ist heute das **CG-Verfahren** (konjugierte Gradienten) Standard – verwandt mit dem [Gradientenabstieg](#/mathe/optimierung/gradientenverfahren), aber mit klug gewählten Suchrichtungen, die in exakter Arithmetik nach höchstens $n$ Schritten das Ergebnis liefern.

> [!BEISPIEL] Jacobi von Hand
> $\\begin{pmatrix} 4 & 1 \\\\ 2 & 5 \\end{pmatrix}\\vec x = \\begin{pmatrix} 9 \\\\ 12 \\end{pmatrix}$ (Lösung $x = (\\frac{11}{6}, \\frac53)$, also etwa $(1{,}833;\\, 1{,}667)$). Start bei $(0, 0)$:
> - Schritt 1: $x_1 = \\frac94 = 2{,}25$, $x_2 = \\frac{12}{5} = 2{,}4$.
> - Schritt 2: $x_1 = \\frac{9 - 2{,}4}{4} = 1{,}65$, $x_2 = \\frac{12 - 4{,}5}{5} = 1{,}5$.
> - Schritt 3: $x_1 = \\frac{9 - 1{,}5}{4} = 1{,}875$, $x_2 = \\frac{12 - 3{,}3}{5} = 1{,}74$.
>
> Die Näherungen pendeln sich auf die Lösung ein; die Matrix ist strikt diagonaldominant ($4 > 1$, $5 > 2$).

## Zusammenfassung

- Gauß = Zerlegung $A = LR$; Lösen durch Vorwärts- und Rückwärtseinsetzen in $O(n^2)$ pro rechter Seite.
- Niemals invertieren, immer zerlegen; $\\det A = \\prod r_{ii}$ fällt nebenbei ab.
- Spaltenpivotisierung ($PA = LR$) verhindert kleine Pivots und macht das Verfahren stabil.
- Symmetrisch positiv definit: Cholesky $A = GG^T$; groß und dünn besetzt: iterative Verfahren (Jacobi, Gauß-Seidel, CG).
`;export{e as default};
