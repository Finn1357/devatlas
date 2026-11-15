const e=`---
id: boolesche-algebra
title: Boolesche Algebra und Schaltlogik
module: diskrete-mathematik
order: 4
difficulty: fortgeschritten
minutes: 45
summary: Boolesche Funktionen und ihre Anzahl, die Gesetze der Booleschen Algebra, disjunktive und konjunktive Normalform, Vereinfachen mit Umformungen und KV-Diagrammen, Logikgatter und ein Addierer aus Gattern.
tags: [Boolesche Algebra, Boolesche Funktion, DNF, KNF, KV-Diagramm, Logikgatter, Halbaddierer]
requires: [aussagenlogik, kombinatorik]
---

## Rechnen mit 0 und 1

Die [Aussagenlogik](#/mathe/grundlagen/aussagenlogik) betrachtet Wahrheitswerte von Aussagen. Schreibt man $1$ für wahr und $0$ für falsch, entsteht eine [[Boolesche Algebra|Algebra]], mit der man **rechnen** kann – die Grundlage digitaler Schaltungen, von Bitoperationen und von Suchanfragen. George Boole entwickelte sie 1847; Claude Shannon erkannte 1937, dass sie genau das Verhalten von Relaisschaltungen beschreibt.

In der Schaltungstechnik schreibt man häufig $\\overline{x}$ für $\\lnot x$, $x \\cdot y$ oder $xy$ für $x \\land y$ und $x + y$ für $x \\lor y$. Wir verwenden diese Schreibweise; Vorsicht: $1 + 1 = 1$.

| $x$ | $y$ | $\\overline x$ | $x \\cdot y$ | $x + y$ | $x \\oplus y$ |
|:-:|:-:|:-:|:-:|:-:|:-:|
| 0 | 0 | 1 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 | 1 | 1 |
| 1 | 0 | 0 | 0 | 1 | 1 |
| 1 | 1 | 0 | 1 | 1 | 0 |

## Boolesche Funktionen

> [!DEFINITION] Boolesche Funktion
> Eine **Boolesche Funktion** mit $n$ Eingängen ist eine Abbildung $f\\colon \\set{0, 1}^n \\to \\set{0, 1}$.

Eine solche Funktion ist durch ihre Wahrheitstafel mit $2^n$ Zeilen vollständig bestimmt. Weil jede Zeile unabhängig $0$ oder $1$ sein kann, gibt es
$$
2^{2^n}
$$
verschiedene Boolesche Funktionen mit $n$ Eingängen ([Produktregel](#/mathe/diskrete-mathematik/kombinatorik)): 4 für $n = 1$, 16 für $n = 2$, 256 für $n = 3$ und bereits $2^{32} \\approx 4{,}3$ Milliarden für $n = 5$.

## Die Gesetze

> [!SATZ] Gesetze der Booleschen Algebra
> Für alle $x, y, z \\in \\set{0, 1}$:
>
> | Name | Gesetz | duales Gesetz |
> |---|---|---|
> | Kommutativ | $xy = yx$ | $x + y = y + x$ |
> | Assoziativ | $(xy)z = x(yz)$ | $(x + y) + z = x + (y + z)$ |
> | Distributiv | $x(y + z) = xy + xz$ | $x + yz = (x + y)(x + z)$ |
> | Neutral | $x \\cdot 1 = x$ | $x + 0 = x$ |
> | Dominanz | $x \\cdot 0 = 0$ | $x + 1 = 1$ |
> | Komplement | $x\\overline x = 0$ | $x + \\overline x = 1$ |
> | Idempotenz | $xx = x$ | $x + x = x$ |
> | Absorption | $x(x + y) = x$ | $x + xy = x$ |
> | De Morgan | $\\overline{xy} = \\overline x + \\overline y$ | $\\overline{x + y} = \\overline x\\;\\overline y$ |

Auffällig ist das **Dualitätsprinzip**: Vertauscht man in einem gültigen Gesetz $\\cdot$ mit $+$ und $0$ mit $1$, erhält man wieder ein gültiges Gesetz. Das zweite Distributivgesetz $x + yz = (x + y)(x + z)$ gilt bei Zahlen nicht, in der Booleschen Algebra aber schon (Beweis per Wahrheitstafel oder Fallunterscheidung $x = 0$, $x = 1$).

> [!BEISPIEL] Vereinfachen
> $$
> \\begin{aligned}
> f &= xy + x\\overline y + \\overline x y\\\\
> &= x(y + \\overline y) + \\overline x y && \\text{(Distributiv)}\\\\
> &= x + \\overline x y && \\text{(Komplement, Neutral)}\\\\
> &= (x + \\overline x)(x + y) && \\text{(zweites Distributivgesetz)}\\\\
> &= x + y .
> \\end{aligned}
> $$
> Aus drei UND-Gattern, zwei Invertern und einem ODER-Gatter wird ein einziges ODER-Gatter.

> [!TIP] Bitoperationen
> Programmiersprachen wenden diese Operationen auf alle Bits einer Zahl gleichzeitig an: \`a & b\`, \`a | b\`, \`~a\`, \`a ^ b\`. Typische Tricks folgen direkt aus den Gesetzen: \`x & (x - 1)\` löscht das niedrigste gesetzte Bit, \`x ^ x == 0\`, \`(a ^ b) ^ b == a\` (Grundlage einfacher Verschlüsselung und des XOR-Swap), und Rechte-Masken prüft man mit \`rechte & SCHREIBEN\`.

## Normalformen

Jede Boolesche Funktion lässt sich systematisch als Formel schreiben.

> [!DEFINITION] Minterm und DNF
> Ein **Minterm** ist eine Konjunktion, in der jede Variable genau einmal vorkommt – negiert oder nicht, etwa $\\overline x\\, y\\, z$. Er ist genau in **einer** Zeile der Wahrheitstafel $1$. Die **kanonische disjunktive Normalform** (DNF) ist die Disjunktion der Minterme aller Zeilen, in denen $f = 1$ ist.

> [!DEFINITION] Maxterm und KNF
> Ein **Maxterm** ist eine Disjunktion, in der jede Variable genau einmal vorkommt, etwa $x + \\overline y + z$; er ist genau in einer Zeile $0$. Die **kanonische konjunktive Normalform** (KNF) ist die Konjunktion der Maxterme aller Zeilen, in denen $f = 0$ ist.

> [!BEISPIEL] Mehrheitsfunktion
> $m(x, y, z) = 1$, wenn mindestens zwei Eingänge $1$ sind. Einsen in den Zeilen $011, 101, 110, 111$:
> $$
> m = \\overline x y z + x \\overline y z + x y \\overline z + xyz .
> $$
> Vereinfacht (jeder der drei ersten Minterme lässt sich mit $xyz$ zusammenfassen, Idempotenz erlaubt die Mehrfachverwendung):
> $$
> m = xy + xz + yz .
> $$

Die KNF ist die natürliche Eingabeform für **SAT-Solver**: Eine Formel in KNF ist erfüllbar, wenn sich alle Klauseln gleichzeitig erfüllen lassen. SAT ist NP-vollständig, moderne Solver bewältigen trotzdem Formeln mit Millionen Variablen – etwa zur Hardware-Verifikation oder Paketabhängigkeitsauflösung.

## Vereinfachen mit KV-Diagrammen

Ein **Karnaugh-Veitch-Diagramm** ordnet die Wahrheitstafel so in einem Rechteck an, dass benachbarte Felder sich in **genau einer** Variable unterscheiden (Gray-Code-Reihenfolge $00, 01, 11, 10$, auch über die Ränder hinweg). Benachbarte Einsen lassen sich dann zusammenfassen, weil $a\\,x + a\\,\\overline x = a$.

> [!BEISPIEL] KV-Diagramm mit drei Variablen
> $f(x, y, z)$ sei $1$ in den Zeilen $000, 010, 011, 110, 111$. Zeilen: $x$, Spalten: $yz$ in der Reihenfolge $00, 01, 11, 10$.
>
> | $x \\backslash yz$ | 00 | 01 | 11 | 10 |
> |:-:|:-:|:-:|:-:|:-:|
> | 0 | 1 | 0 | 1 | 1 |
> | 1 | 0 | 0 | 1 | 1 |
>
> - Der Viererblock in den Spalten $11$ und $10$ (beide Zeilen) hat überall $y = 1$: Term $y$.
> - Die Einsen in $000$ und $010$ (Spalten $00$ und $10$ – über den Rand benachbart) haben $x = 0$, $z = 0$: Term $\\overline x\\,\\overline z$.
>
> Ergebnis: $f = y + \\overline x\\,\\overline z$ statt fünf Mintermen mit je drei Literalen.

Regeln: Blöcke müssen rechteckig sein und $1, 2, 4, 8, \\dots$ Felder umfassen; möglichst große Blöcke wählen; jede Eins muss mindestens einmal überdeckt werden. Für mehr als etwa sechs Variablen nutzt man Algorithmen (Quine-McCluskey, Espresso) statt Diagrammen.

## Gatter und Schaltungen

Jede Verknüpfung entspricht einem **Logikgatter**: AND, OR, NOT, XOR, NAND, NOR. Wie in der Aussagenlogik gezeigt, ist schon **NAND allein funktional vollständig** – jede Schaltung lässt sich nur aus NAND-Gattern aufbauen, was die Chipfertigung vereinfacht.

> [!BEISPIEL] Halb- und Volladdierer
> Zwei Bits $a, b$ addiert man zu einer Summe $s$ und einem Übertrag $c$:
>
> | $a$ | $b$ | $c$ | $s$ |
> |:-:|:-:|:-:|:-:|
> | 0 | 0 | 0 | 0 |
> | 0 | 1 | 0 | 1 |
> | 1 | 0 | 0 | 1 |
> | 1 | 1 | 1 | 0 |
>
> Also $s = a \\oplus b$ und $c = a \\cdot b$ – der **Halbaddierer**. Ein **Volladdierer** berücksichtigt zusätzlich einen eingehenden Übertrag $c_{\\text{in}}$:
> $$
> s = a \\oplus b \\oplus c_{\\text{in}}, \\qquad c_{\\text{out}} = ab + c_{\\text{in}}\\,(a \\oplus b) .
> $$
> Reiht man 64 Volladdierer aneinander, erhält man den Addierer eines 64-Bit-Prozessors. (Echte Prozessoren berechnen die Überträge mit „Carry-Lookahead“ parallel, damit nicht 64 Gatterlaufzeiten nacheinander nötig sind.)

Der Übertrag $c_{\\text{out}}$ ist übrigens genau die Mehrheitsfunktion $m(a, b, c_{\\text{in}})$ aus dem Normalformen-Beispiel.

## Zusammenfassung

- Boolesche Algebra: Rechnen mit $0, 1$ und $\\cdot$, $+$, $\\overline{\\phantom{x}}$; es gibt $2^{2^n}$ Funktionen mit $n$ Eingängen.
- Gesetze wie in der Aussagenlogik; zusätzlich gilt $x + yz = (x + y)(x + z)$ und das Dualitätsprinzip.
- DNF aus den Einsen (Minterme), KNF aus den Nullen (Maxterme); KV-Diagramme fassen benachbarte Einsen zusammen.
- NAND ist funktional vollständig; Addierer bestehen aus XOR, AND und OR.
`;export{e as default};
