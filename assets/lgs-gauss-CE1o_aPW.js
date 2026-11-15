const e=`---
id: lgs-gauss
title: Lineare Gleichungssysteme und das Gauß-Verfahren
module: lineare-algebra
order: 2
difficulty: einsteiger
minutes: 45
summary: Lineare Gleichungssysteme in Matrixform, elementare Zeilenumformungen, Zeilenstufenform und reduzierte Form, die drei möglichen Lösungsfälle mit Parameterdarstellung und das Rangkriterium.
tags: [LGS, Gauß-Verfahren, Zeilenstufenform, Rang, Lösungsmenge, Parameterdarstellung]
requires: [vektoren]
---

## Das Problem

Ein **lineares Gleichungssystem** (LGS) mit $m$ Gleichungen und $n$ Unbekannten hat die Form
$$
\\begin{aligned}
a_{11} x_1 + a_{12} x_2 + \\dots + a_{1n} x_n &= b_1 \\\\
&\\;\\;\\vdots \\\\
a_{m1} x_1 + a_{m2} x_2 + \\dots + a_{mn} x_n &= b_m .
\\end{aligned}
$$
„Linear“ heißt: Die Unbekannten kommen nur in der ersten Potenz und nicht miteinander multipliziert vor. Kompakt schreibt man $A\\vec x = \\vec b$ mit der **Koeffizientenmatrix** $A = (a_{ij})$ und der rechten Seite $\\vec b$. Für das Rechnen genügt die **erweiterte Koeffizientenmatrix** $(A \\mid \\vec b)$ – die Variablennamen sind nur Platzhalter.

Ist $\\vec b = \\vec 0$, heißt das System **homogen**, sonst inhomogen. Ein homogenes System hat immer die Lösung $\\vec x = \\vec 0$.

> [!TIP] Wo LGS auftauchen
> Stromkreise (Kirchhoff), Gleichgewichte in Netzwerken, Interpolation, die Methode der kleinsten Quadrate, Finite-Elemente-Simulationen, Ranking-Verfahren wie PageRank, Beleuchtungsberechnung (Radiosity) – fast jede numerische Anwendung läuft am Ende auf $A\\vec x = \\vec b$ hinaus, oft mit Millionen Unbekannten.

## Elementare Zeilenumformungen

Die folgenden Umformungen ändern die Lösungsmenge **nicht**, weil man sie jeweils rückgängig machen kann:

1. zwei Zeilen vertauschen: $Z_i \\leftrightarrow Z_j$;
2. eine Zeile mit einer Zahl $c \\neq 0$ multiplizieren: $Z_i \\to c\\, Z_i$;
3. ein Vielfaches einer Zeile zu einer **anderen** addieren: $Z_i \\to Z_i + c\\, Z_j$ ($i \\neq j$).

> [!MISTAKE] Mit 0 multiplizieren
> $Z_i \\to 0 \\cdot Z_i$ ist keine erlaubte Umformung – eine Gleichung würde ersatzlos verschwinden, und die Lösungsmenge kann sich vergrößern. Ebenso darf man nicht $Z_1 \\to Z_1 - Z_2$ und **gleichzeitig** $Z_2 \\to Z_2 - Z_1$ ausführen: Dann werden beide Zeilen aus den alten Zeilen berechnet, und Information geht verloren.

## Zeilenstufenform

> [!DEFINITION] Zeilenstufenform
> Eine Matrix ist in **Zeilenstufenform**, wenn
> - Nullzeilen ganz unten stehen und
> - das erste von Null verschiedene Element (das **Pivotelement**) jeder Zeile echt weiter rechts steht als das der Zeile darüber.
>
> Sie ist in **reduzierter Zeilenstufenform**, wenn zusätzlich jedes Pivotelement $1$ ist und in seiner Spalte sonst nur Nullen stehen.

Das **Gauß-Verfahren** bringt die erweiterte Matrix mit Zeilenumformungen in Zeilenstufenform: Spalte für Spalte wird ein Pivot gewählt (notfalls nach einer Vertauschung), und darunter werden Nullen erzeugt. Anschließend löst man durch **Rückwärtseinsetzen** von unten nach oben. Das **Gauß-Jordan-Verfahren** räumt auch oberhalb der Pivots auf und liest die Lösung direkt ab.

> [!BEISPIEL] Eine eindeutige Lösung
> $$
> \\begin{aligned}
> x_1 + 2x_2 - x_3 &= 3\\\\
> 2x_1 - x_2 + 3x_3 &= 8\\\\
> -x_1 + 3x_2 + 2x_3 &= 5
> \\end{aligned}
> \\qquad
> \\left(\\begin{array}{rrr|r} 1 & 2 & -1 & 3 \\\\ 2 & -1 & 3 & 8 \\\\ -1 & 3 & 2 & 5 \\end{array}\\right)
> $$
> $Z_2 \\to Z_2 - 2Z_1$ und $Z_3 \\to Z_3 + Z_1$:
> $$
> \\left(\\begin{array}{rrr|r} 1 & 2 & -1 & 3 \\\\ 0 & -5 & 5 & 2 \\\\ 0 & 5 & 1 & 8 \\end{array}\\right)
> $$
> $Z_3 \\to Z_3 + Z_2$:
> $$
> \\left(\\begin{array}{rrr|r} 1 & 2 & -1 & 3 \\\\ 0 & -5 & 5 & 2 \\\\ 0 & 0 & 6 & 10 \\end{array}\\right)
> $$
> Rückwärts: $6x_3 = 10 \\Rightarrow x_3 = \\tfrac53$. Dann $-5x_2 + 5 \\cdot \\tfrac53 = 2 \\Rightarrow x_2 = \\tfrac{19}{15}$. Schließlich $x_1 = 3 - 2 \\cdot \\tfrac{19}{15} + \\tfrac53 = \\tfrac{32}{15}$.
>
> **Probe** in der zweiten Gleichung: $2 \\cdot \\tfrac{32}{15} - \\tfrac{19}{15} + 3 \\cdot \\tfrac{25}{15} = \\tfrac{64 - 19 + 75}{15} = 8$. ✓

Jeden Schritt kannst du im [Gauß-Rechner](#/mathe/labor/gauss?m=1,2,-1,3;2,-1,3,8;-1,3,2,5) mit exakten Brüchen nachvollziehen.

## Die drei Lösungsfälle

Nach der Elimination liest man an der Zeilenstufenform ab, welcher Fall vorliegt:

| Situation in der Stufenform | Lösungsmenge |
|---|---|
| eine Zeile $(0 \\; \\cdots \\; 0 \\mid c)$ mit $c \\neq 0$ | **keine** Lösung (Widerspruch $0 = c$) |
| kein Widerspruch, Pivot in jeder Variablenspalte | **genau eine** Lösung |
| kein Widerspruch, mindestens eine Spalte ohne Pivot | **unendlich viele** Lösungen |

Variablen in Spalten **ohne** Pivot heißen **freie Variablen**; man setzt sie gleich Parametern $t_1, t_2, \\dots$ und drückt die übrigen (**gebundenen**) Variablen durch sie aus.

> [!BEISPIEL] Unendlich viele Lösungen
> $$
> \\left(\\begin{array}{rrrr|r} 1 & 2 & 0 & 3 & 4 \\\\ 0 & 0 & 1 & -1 & 2 \\end{array}\\right)
> $$
> ist bereits reduziert. Pivots stehen in den Spalten 1 und 3; $x_2 = s$ und $x_4 = t$ sind frei. Aus den Zeilen: $x_1 = 4 - 2s - 3t$, $x_3 = 2 + t$. Also
> $$
> \\vec x = \\begin{pmatrix} 4 \\\\ 0 \\\\ 2 \\\\ 0 \\end{pmatrix} + s \\begin{pmatrix} -2 \\\\ 1 \\\\ 0 \\\\ 0 \\end{pmatrix} + t \\begin{pmatrix} -3 \\\\ 0 \\\\ 1 \\\\ 1 \\end{pmatrix}, \\qquad s, t \\in \\R .
> $$
> Geometrisch ist die Lösungsmenge eine Ebene im $\\R^4$, die nicht durch den Ursprung geht.

Die Struktur ist kein Zufall:

> [!SATZ] Struktur der Lösungsmenge
> Ist $\\vec x_p$ eine (spezielle, partikuläre) Lösung von $A\\vec x = \\vec b$, so ist die gesamte Lösungsmenge
> $$
> \\mathbb{L} = \\set{\\vec x_p + \\vec x_h \\mid A \\vec x_h = \\vec 0}.
> $$
> Jede Lösung ist „spezielle Lösung plus Lösung des homogenen Systems“.

> [!BEWEIS]
> Ist $A\\vec x_h = \\vec 0$, dann $A(\\vec x_p + \\vec x_h) = A\\vec x_p + A\\vec x_h = \\vec b + \\vec 0 = \\vec b$. Ist umgekehrt $\\vec x$ eine beliebige Lösung, so ist $A(\\vec x - \\vec x_p) = \\vec b - \\vec b = \\vec 0$; also ist $\\vec x_h := \\vec x - \\vec x_p$ homogene Lösung und $\\vec x = \\vec x_p + \\vec x_h$.

Im Beispiel ist $\\vec x_p = (4, 0, 2, 0)^T$, und die beiden Richtungsvektoren spannen die Lösungsmenge des homogenen Systems auf.

## Rang und Lösbarkeit

> [!DEFINITION] Rang
> Der **Rang** $\\Rang A$ einer Matrix ist die Anzahl der Pivotelemente (gleichbedeutend: der Nicht-Nullzeilen) in einer Zeilenstufenform von $A$.

Der Rang hängt nicht davon ab, welche Umformungen man wählt – er ist eine Eigenschaft der Matrix (die Dimension ihres Zeilen- bzw. Spaltenraums, siehe [Vektorräume](#/mathe/lineare-algebra/vektorraeume)).

> [!SATZ] Lösbarkeitskriterium
> Für $A \\in \\R^{m \\times n}$ gilt:
> - $A\\vec x = \\vec b$ ist lösbar $\\iff$ $\\Rang A = \\Rang(A \\mid \\vec b)$.
> - Ist das System lösbar, so hat die Lösungsmenge $n - \\Rang A$ freie Parameter. Insbesondere ist die Lösung genau dann eindeutig, wenn $\\Rang A = n$.

Für **quadratische** Systeme ($m = n$) heißt das: Ist $\\Rang A = n$, hat $A\\vec x = \\vec b$ für **jede** rechte Seite genau eine Lösung – $A$ ist dann invertierbar (siehe [Matrizen](#/mathe/lineare-algebra/matrizen)) und $\\det A \\neq 0$ (siehe [Determinanten](#/mathe/lineare-algebra/determinanten)).

> [!BEISPIEL] Fallunterscheidung mit Parameter
> Für welche $a \\in \\R$ ist das System lösbar?
> $$
> \\left(\\begin{array}{rr|r} 1 & 2 & 3 \\\\ 2 & 4 & a \\end{array}\\right) \\xrightarrow{Z_2 \\to Z_2 - 2Z_1} \\left(\\begin{array}{rr|r} 1 & 2 & 3 \\\\ 0 & 0 & a - 6 \\end{array}\\right)
> $$
> Für $a \\neq 6$ entsteht ein Widerspruch: keine Lösung. Für $a = 6$ ist $\\Rang A = \\Rang(A\\mid\\vec b) = 1 < 2$: unendlich viele Lösungen $x_1 = 3 - 2t$, $x_2 = t$.

## Aufwand und Numerik

Für ein $n \\times n$-System braucht das Gauß-Verfahren etwa $\\tfrac23 n^3$ Multiplikationen – bei $n = 1000$ also rund $7 \\cdot 10^8$ Operationen, für einen Computer eine Sekundensache. Beim Rechnen mit Gleitkommazahlen wählt man als Pivot nicht das erste, sondern das **betragsgrößte** Element der Spalte (Spaltenpivotisierung), um Rundungsfehler klein zu halten. Mehr dazu im Modul [Numerik](#/mathe/numerik).

> [!EXPERT] Exakt oder numerisch?
> Mit Brüchen (wie im Gauß-Rechner) ist das Ergebnis exakt, aber Zähler und Nenner können exponentiell wachsen. Mit Gleitkommazahlen bleibt die Zahlengröße fest, dafür entstehen Rundungsfehler. Bibliotheken wie LAPACK (hinter NumPy, MATLAB, R) verwenden die **LR-Zerlegung mit Pivotisierung**, eine Matrix-Variante des Gauß-Verfahrens, die man für viele rechte Seiten wiederverwenden kann.

## Zusammenfassung

- Ein LGS ist $A\\vec x = \\vec b$; man rechnet mit der erweiterten Matrix $(A\\mid\\vec b)$.
- Zeilen tauschen, mit $c \\neq 0$ multiplizieren und Vielfache anderer Zeilen addieren ändert die Lösungsmenge nicht.
- An der Zeilenstufenform liest man ab: Widerspruch ⇒ keine Lösung; sonst $n - \\Rang A$ freie Parameter.
- Lösungsmenge = spezielle Lösung + Lösungen des homogenen Systems.
`;export{e as default};
