const e=`---
id: abbildungen
title: Abbildungen und Mächtigkeit
module: grundlagen
order: 7
difficulty: fortgeschritten
minutes: 40
summary: Abbildungen mit Definitions- und Zielmenge, Bild und Urbild, Injektivität, Surjektivität und Bijektivität, Verkettung und Umkehrabbildung sowie abzählbare und überabzählbare Mengen.
tags: [Abbildung, Funktion, Injektiv, Surjektiv, Bijektiv, Umkehrabbildung, Abzählbarkeit, Cantor]
requires: [mengen, relationen]
---

## Was ist eine Abbildung?

> [!DEFINITION] Abbildung
> Eine **[[Abbildung]]** (Funktion) $f\\colon A \\to B$ ordnet jedem Element $a$ der **Definitionsmenge** $A$ **genau ein** Element $f(a)$ der **Zielmenge** $B$ zu. Man schreibt $a \\mapsto f(a)$. Formal ist $f$ eine Relation $f \\subseteq A \\times B$, bei der es zu jedem $a \\in A$ genau ein $b$ mit $(a, b) \\in f$ gibt.

Zu einer Abbildung gehören immer drei Dinge: Definitionsmenge, Zielmenge und Zuordnungsvorschrift. $f\\colon \\R \\to \\R$, $x \\mapsto x^2$ und $g\\colon \\R \\to [0, \\infty)$, $x \\mapsto x^2$ sind daher **verschiedene** Abbildungen – $g$ ist surjektiv, $f$ nicht.

Keine Abbildungen sind „$x \\mapsto \\pm\\sqrt{x}$“ (zwei Werte) oder $x \\mapsto \\tfrac1x$ auf ganz $\\R$ (für $0$ kein Wert).

> [!TIP] Funktionen im Code
> Eine reine Funktion \`int f(int x)\` ist eine Abbildung von der Menge der \`int\`-Werte in sich selbst. Eine Funktion, die für manche Eingaben eine Exception wirft, ist mathematisch nur auf der kleineren Menge der „erlaubten“ Eingaben definiert. Typsignaturen wie \`(a: A) => B\` sind genau die Angabe von Definitions- und Zielmenge.

## Bild und Urbild

> [!DEFINITION] Bild und Urbild
> Für $f\\colon A \\to B$, $M \\subseteq A$ und $N \\subseteq B$ heißen
> $$
> f(M) = \\set{f(a) \\mid a \\in M} \\quad\\text{das Bild von } M, \\qquad f^{-1}(N) = \\set{a \\in A \\mid f(a) \\in N} \\quad\\text{das Urbild von } N.
> $$
> $f(A)$ heißt Bild (Wertebereich) von $f$.

Das Urbild $f^{-1}(N)$ ist **immer** definiert – auch wenn $f$ keine Umkehrabbildung hat. Beispiel: Für $f(x) = x^2$ auf $\\R$ ist $f^{-1}(\\set{4}) = \\set{-2, 2}$ und $f^{-1}(\\set{-1}) = \\emptyset$.

## Injektiv, surjektiv, bijektiv

> [!DEFINITION] Eigenschaften von Abbildungen
> $f\\colon A \\to B$ heißt
> - **injektiv**, wenn verschiedene Elemente verschiedene Bilder haben:
> $\\forall a, a' \\in A: f(a) = f(a') \\Rightarrow a = a'$;
> - **surjektiv**, wenn jedes Element von $B$ getroffen wird: $\\forall b \\in B \\;\\exists a \\in A: f(a) = b$, also $f(A) = B$;
> - **bijektiv**, wenn $f$ injektiv und surjektiv ist.

Anschaulich: Injektiv heißt „keine zwei Pfeile treffen dasselbe Ziel“, surjektiv „jedes Ziel wird mindestens einmal getroffen“, bijektiv „jedes Ziel genau einmal“.

> [!BEISPIEL] Dieselbe Vorschrift, verschiedene Eigenschaften
> | Abbildung | injektiv | surjektiv |
> |---|:-:|:-:|
> | $\\R \\to \\R$, $x \\mapsto x^2$ | nein ($f(-1) = f(1)$) | nein ($-1$ wird nicht getroffen) |
> | $[0, \\infty) \\to \\R$, $x \\mapsto x^2$ | ja | nein |
> | $\\R \\to [0, \\infty)$, $x \\mapsto x^2$ | nein | ja |
> | $[0, \\infty) \\to [0, \\infty)$, $x \\mapsto x^2$ | ja | ja |

### Wie beweist man das?

- **Injektivität:** Nimm $f(a) = f(a')$ an und folgere $a = a'$. Beispiel $f(x) = 3x - 5$ auf $\\R$: $3a - 5 = 3a' - 5 \\Rightarrow a = a'$.
- **Surjektivität:** Zu beliebigem $b \\in B$ ein Urbild angeben. Für $f(x) = 3x - 5$: Zu $b \\in \\R$ ist $a = \\tfrac{b + 5}{3}$ ein Urbild, denn $f(a) = b$.
- **Nicht injektiv / nicht surjektiv:** ein konkretes Gegenbeispiel.

> [!SATZ] Endliche Mengen gleicher Größe
> Sind $A$ und $B$ endlich mit $\\abs A = \\abs B$, so gilt für $f\\colon A \\to B$: $f$ injektiv $\\iff$ $f$ surjektiv $\\iff$ $f$ bijektiv.

> [!BEWEIS]
> Ist $f$ injektiv, so hat das Bild $f(A)$ genau $\\abs A = \\abs B$ Elemente. Als Teilmenge von $B$ mit gleich vielen Elementen ist $f(A) = B$, also ist $f$ surjektiv. Ist umgekehrt $f$ surjektiv, aber nicht injektiv, so träfen die $\\abs A$ Elemente höchstens $\\abs A - 1$ verschiedene Ziele, im Widerspruch zu $f(A) = B$.

Daraus folgt das **Schubfachprinzip**: Gibt es mehr Objekte als Schubfächer ($\\abs A > \\abs B$), kann keine Abbildung $A \\to B$ injektiv sein – mindestens ein Fach enthält zwei Objekte. Für Hashfunktionen bedeutet das: Bildet man beliebig lange Eingaben auf 256 Bit ab, **muss** es Kollisionen geben.

## Verkettung und Umkehrabbildung

> [!DEFINITION] Verkettung
> Für $f\\colon A \\to B$ und $g\\colon B \\to C$ ist die **Verkettung** $g \\circ f\\colon A \\to C$ definiert durch $(g \\circ f)(a) = g(f(a))$ – „erst $f$, dann $g$“.

Die Verkettung ist assoziativ, $h \\circ (g \\circ f) = (h \\circ g) \\circ f$, aber im Allgemeinen **nicht kommutativ**: Für $f(x) = x + 1$, $g(x) = 2x$ ist $(g \\circ f)(x) = 2x + 2$, aber $(f \\circ g)(x) = 2x + 1$. Matrizenmultiplikation ist gerade die Verkettung linearer Abbildungen – deshalb ist auch sie nicht kommutativ.

> [!SATZ] Umkehrabbildung
> $f\\colon A \\to B$ ist genau dann bijektiv, wenn es eine Abbildung $g\\colon B \\to A$ gibt mit
> $$
> g \\circ f = \\mathrm{id}_A \\quad\\text{und}\\quad f \\circ g = \\mathrm{id}_B .
> $$
> Diese ist dann eindeutig und heißt **Umkehrabbildung** $f^{-1}$.

> [!BEWEIS]
> „$\\Rightarrow$“: Ist $f$ bijektiv, gibt es zu jedem $b \\in B$ genau ein $a$ mit $f(a) = b$ (Existenz aus Surjektivität, Eindeutigkeit aus Injektivität). Setze $g(b) := a$. Dann gilt $f(g(b)) = b$ und $g(f(a)) = a$.
>
> „$\\Leftarrow$“: Aus $f(a) = f(a')$ folgt $a = g(f(a)) = g(f(a')) = a'$, also ist $f$ injektiv. Für $b \\in B$ ist $a := g(b)$ ein Urbild, denn $f(a) = f(g(b)) = b$; also ist $f$ surjektiv.
>
> Eindeutigkeit: Erfüllen $g$ und $g'$ beide Bedingungen, ist $g = g \\circ \\mathrm{id}_B = g \\circ (f \\circ g') = (g \\circ f) \\circ g' = g'$.

> [!BEISPIEL] Umkehrfunktion berechnen
> $f\\colon \\R \\to (0, \\infty)$, $f(x) = 2 \\e^{3x}$ ist bijektiv. Auflösen von $y = 2\\e^{3x}$ nach $x$: $\\e^{3x} = \\tfrac y2$, also $x = \\tfrac13 \\ln \\tfrac y2$. Damit ist $f^{-1}(y) = \\tfrac13 \\ln\\tfrac y2$ für $y > 0$.

Verkettungen erhalten die Eigenschaften: Sind $f$ und $g$ injektiv (surjektiv, bijektiv), so auch $g \\circ f$; im bijektiven Fall ist $(g \\circ f)^{-1} = f^{-1} \\circ g^{-1}$ – die Reihenfolge dreht sich um, wie beim Ausziehen von Socken und Schuhen.

## Mächtigkeit: Wie groß ist unendlich?

Zwei Mengen heißen **gleichmächtig**, wenn es eine Bijektion zwischen ihnen gibt. Für endliche Mengen heißt das: gleich viele Elemente. Für unendliche Mengen führt die Definition zu überraschenden Ergebnissen.

> [!DEFINITION] Abzählbar
> Eine Menge heißt **abzählbar unendlich**, wenn sie gleichmächtig zu $\\N$ ist – wenn man ihre Elemente also als Folge $a_0, a_1, a_2, \\dots$ ohne Wiederholung aufzählen kann, in der jedes Element vorkommt. **Abzählbar** heißt endlich oder abzählbar unendlich; sonst **überabzählbar**.

- $\\Z$ ist abzählbar: $0, 1, -1, 2, -2, 3, \\dots$ Formal ist $f\\colon \\N \\to \\Z$ mit $f(2k) = -k$ und $f(2k - 1) = k$ eine Bijektion. Eine echte Teilmenge kann also gleichmächtig zur ganzen Menge sein.
- $\\N \\times \\N$ ist abzählbar: Man durchläuft die Paare entlang der Diagonalen $(0,0), (0,1), (1,0), (0,2), (1,1), (2,0), \\dots$ (Cantors Paarungsfunktion). Daraus folgt: **$\\Q$ ist abzählbar.**

> [!SATZ] Cantor
> Die Menge $\\R$ der reellen Zahlen ist überabzählbar.

> [!BEWEIS]
> Es genügt zu zeigen, dass schon das Intervall $(0, 1)$ nicht abzählbar ist. Angenommen, $x_0, x_1, x_2, \\dots$ wäre eine Aufzählung aller Zahlen in $(0, 1)$ in Dezimaldarstellung $x_i = 0{,}d_{i0} d_{i1} d_{i2} \\dots$ (ohne Neunerperioden). Definiere $y = 0{,}e_0 e_1 e_2 \\dots$ mit $e_i = 5$, falls $d_{ii} \\neq 5$, und $e_i = 4$, falls $d_{ii} = 5$. Dann liegt $y$ in $(0,1)$, unterscheidet sich aber von jedem $x_i$ an der $i$-ten Nachkommastelle, kommt also in der Aufzählung nicht vor – Widerspruch.

Dieses **Diagonalargument** taucht in der theoretischen Informatik wieder auf: Es gibt abzählbar viele Programme, aber überabzählbar viele Funktionen $\\N \\to \\set{0, 1}$ – also sind die meisten Funktionen nicht berechenbar. Auch der Beweis der Unentscheidbarkeit des **Halteproblems** ist eine Diagonalisierung.

## Zusammenfassung

- Eine Abbildung hat Definitions- und Zielmenge und ordnet jedem Argument genau einen Wert zu.
- Injektiv: $f(a) = f(a') \\Rightarrow a = a'$. Surjektiv: jedes Ziel hat ein Urbild. Bijektiv: beides ⇔ Umkehrabbildung existiert.
- Das Urbild $f^{-1}(N)$ existiert immer, die Umkehrabbildung $f^{-1}$ nur bei Bijektionen.
- $\\N$, $\\Z$, $\\Q$ sind abzählbar, $\\R$ ist überabzählbar (Diagonalargument).
`;export{e as default};
