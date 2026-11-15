const e=`---
id: gleichungen-ungleichungen
title: Gleichungen, Ungleichungen und Beträge
module: algebra
order: 2
difficulty: einsteiger
minutes: 40
summary: Äquivalenz- und Folgerungsumformungen, quadratische Gleichungen, Wurzelgleichungen mit Probe, Rechenregeln für Ungleichungen, quadratische und Bruchungleichungen sowie Betragsgleichungen und -ungleichungen mit Fallunterscheidung.
tags: [Gleichung, Ungleichung, Betrag, Fallunterscheidung, Quadratische Gleichung, Wurzelgleichung]
requires: [potenzen-logarithmen, beweistechniken]
---

## Lösen heißt umformen

Eine Gleichung zu lösen heißt, ihre **Lösungsmenge** $\\mathbb L$ zu bestimmen: alle Werte aus der Grundmenge, die sie erfüllen. Dazu formt man sie schrittweise in einfachere Gleichungen um. Entscheidend ist, welche Art von Umformung man verwendet.

> [!DEFINITION] Äquivalenz- und Folgerungsumformung
> Eine Umformung heißt **Äquivalenzumformung** ($\\iff$), wenn die neue Gleichung genau dieselbe Lösungsmenge hat. Sie heißt **Folgerungsumformung** ($\\Rightarrow$), wenn jede Lösung der alten Gleichung auch die neue erfüllt – die neue Gleichung aber zusätzliche Lösungen haben kann.

| Umformung | Art |
|---|---|
| auf beiden Seiten denselben Term addieren | Äquivalenz |
| mit einer Zahl $c \\neq 0$ multiplizieren | Äquivalenz |
| mit einem Term multiplizieren, der $0$ werden kann | Folgerung (neue Lösungen möglich) |
| durch einen Term dividieren, der $0$ werden kann | **Lösungen gehen verloren** |
| quadrieren | Folgerung (neue Lösungen möglich) |
| eine streng monotone Funktion anwenden ($\\e^x$, $\\ln$, $\\sqrt[3]{\\cdot}$) | Äquivalenz (auf dem Definitionsbereich) |

> [!MISTAKE] Durch x teilen
> Aus $x^2 = 3x$ „folgt“ durch Teilen durch $x$ die Lösung $x = 3$ – die Lösung $x = 0$ ist verloren. Richtig: $x^2 - 3x = 0 \\iff x(x - 3) = 0 \\iff x = 0 \\lor x = 3$. Ein Produkt ist genau dann null, wenn ein Faktor null ist (**Satz vom Nullprodukt**).

## Quadratische Gleichungen

Für $ax^2 + bx + c = 0$ mit $a \\neq 0$ liefert die quadratische Ergänzung die Lösungsformel
$$
x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}, \\qquad D = b^2 - 4ac .
$$
Die **Diskriminante** $D$ entscheidet: $D > 0$ zwei reelle Lösungen, $D = 0$ eine doppelte, $D < 0$ keine reelle (aber zwei konjugiert [komplexe](#/mathe/algebra/komplexe-zahlen)).

> [!SATZ] Satz von Vieta
> Sind $x_1, x_2$ die Lösungen von $x^2 + px + q = 0$, so gilt
> $$
> x_1 + x_2 = -p, \\qquad x_1 \\cdot x_2 = q .
> $$

> [!BEWEIS]
> Mit den Lösungen gilt $x^2 + px + q = (x - x_1)(x - x_2) = x^2 - (x_1 + x_2)x + x_1x_2$. Koeffizientenvergleich liefert beide Formeln.

Vieta hilft beim Raten ganzzahliger Lösungen ($x^2 - 5x + 6 = 0$: Produkt 6, Summe 5, also $2$ und $3$) und – wie in der Lektion [Gleitkommazahlen](#/mathe/numerik/gleitkomma) gezeigt – beim numerisch stabilen Berechnen der kleineren Lösung.

## Wurzelgleichungen: Probe ist Pflicht

> [!BEISPIEL] Eine Scheinlösung
> $\\sqrt{x + 7} = x + 1$. Quadrieren (Folgerungsumformung!): $x + 7 = x^2 + 2x + 1$, also $x^2 + x - 6 = 0$ und $x \\in \\set{2, -3}$.
>
> **Probe:** $x = 2$: $\\sqrt9 = 3 = 2 + 1$ ✓. $x = -3$: $\\sqrt 4 = 2$, aber $-3 + 1 = -2$ ✗.
>
> Also $\\mathbb L = \\set{2}$. Die Scheinlösung entstand, weil auch $-\\sqrt{x+7} = x + 1$ nach dem Quadrieren dieselbe Gleichung liefert.

Allgemein: Nach jeder Folgerungsumformung müssen alle Kandidaten in die **ursprüngliche** Gleichung eingesetzt werden. Beim Testen von Software gilt dasselbe Prinzip – ein Ergebnis wird an der ursprünglichen Spezifikation geprüft, nicht an einer Zwischenform.

## Ungleichungen

Ungleichungen werden fast wie Gleichungen umgeformt – mit einer wesentlichen Ausnahme.

> [!SATZ] Rechenregeln für Ungleichungen
> Für reelle Zahlen gilt:
> 1. $a < b \\iff a + c < b + c$.
> 2. Für $c > 0$: $a < b \\iff ac < bc$.
> 3. Für $c < 0$: $a < b \\iff ac > bc$ – **das Zeichen dreht sich um**.
> 4. Für $a, b > 0$: $a < b \\iff \\frac1a > \\frac1b$.
> 5. Ist $f$ streng monoton wachsend, gilt $a < b \\iff f(a) < f(b)$; für streng fallendes $f$ dreht sich das Zeichen um.

> [!MISTAKE] Mit einer Variablen multiplizieren
> $\\frac{1}{x} < 2$ ist **nicht** äquivalent zu $1 < 2x$, denn für $x < 0$ dreht sich das Zeichen. Richtig mit Fallunterscheidung: Für $x > 0$ folgt $x > \\frac12$; für $x < 0$ ist $\\frac1x < 0 < 2$ immer erfüllt. Also $\\mathbb L = (-\\infty, 0) \\cup \\left(\\frac12, \\infty\\right)$.

### Quadratische Ungleichungen

Man bestimmt die Nullstellen und liest das Vorzeichen an der Parabel ab:

> [!BEISPIEL] Parabel als Vorzeichentabelle
> $x^2 - x - 6 \\le 0$. Nullstellen $x = -2$ und $x = 3$, also $x^2 - x - 6 = (x + 2)(x - 3)$. Die Parabel ist nach oben geöffnet und daher **zwischen** den Nullstellen negativ:
> $$
> \\mathbb L = [-2, 3] .
> $$
> Bei $> 0$ wäre die Lösung der Bereich **außerhalb**: $(-\\infty, -2) \\cup (3, \\infty)$.

### Bruchungleichungen

Man bringt alles auf eine Seite, schreibt es als **einen** Bruch und untersucht die Vorzeichen von Zähler und Nenner:

> [!BEISPIEL] Vorzeichenwechsel an Nullstellen und Polen
> $\\dfrac{x + 1}{x - 2} \\ge 0$. Kritische Stellen: Zählernullstelle $x = -1$, Polstelle $x = 2$.
>
> | Bereich | $x + 1$ | $x - 2$ | Bruch |
> |---|:-:|:-:|:-:|
> | $x < -1$ | $-$ | $-$ | $+$ |
> | $-1 \\le x < 2$ | $+$ (oder 0) | $-$ | $-$ (oder 0) |
> | $x > 2$ | $+$ | $+$ | $+$ |
>
> Also $\\mathbb L = (-\\infty, -1] \\cup (2, \\infty)$. Die $-1$ gehört dazu (Bruch $= 0$), die $2$ nicht (nicht definiert).

## Beträge

> [!DEFINITION] Betrag
> $$
> \\abs x = \\begin{cases} x, & x \\ge 0,\\\\ -x, & x < 0. \\end{cases}
> $$
> Geometrisch ist $\\abs{x - a}$ der **Abstand** von $x$ und $a$ auf der Zahlengeraden.

Wichtige Eigenschaften: $\\abs x \\ge 0$, $\\abs{xy} = \\abs x\\abs y$, $\\abs{x}^2 = x^2$, $\\sqrt{x^2} = \\abs x$ und die [Dreiecksungleichung](#/mathe/grundlagen/beweistechniken) $\\abs{x + y} \\le \\abs x + \\abs y$.

### Betragsgleichungen

> [!BEISPIEL] Fallunterscheidung
> $\\abs{2x - 3} = 5$. Entweder $2x - 3 = 5$, also $x = 4$, oder $2x - 3 = -5$, also $x = -1$. $\\mathbb L = \\set{-1, 4}$.

> [!BEISPIEL] Zwei Beträge
> $\\abs{x - 1} + \\abs{x + 2} = 5$. Die Knickstellen $x = 1$ und $x = -2$ teilen die Zahlengerade in drei Bereiche:
> - $x < -2$: $-(x - 1) - (x + 2) = -2x - 1 = 5 \\Rightarrow x = -3$ ✓ (liegt im Bereich).
> - $-2 \\le x < 1$: $-(x - 1) + (x + 2) = 3 = 5$ – Widerspruch, keine Lösung.
> - $x \\ge 1$: $(x - 1) + (x + 2) = 2x + 1 = 5 \\Rightarrow x = 2$ ✓.
>
> $\\mathbb L = \\set{-3, 2}$. Geometrisch: Die Summe der Abstände zu $1$ und $-2$ ist mindestens $3$; den Wert $5$ erreicht man nur außerhalb des Intervalls.

### Betragsungleichungen

> [!SATZ] Betragsungleichungen
> Für $r > 0$ gilt
> $$
> \\abs{x - a} < r \\iff a - r < x < a + r, \\qquad \\abs{x - a} > r \\iff x < a - r \\;\\lor\\; x > a + r .
> $$

Die erste Form ist die **$\\varepsilon$-Umgebung**, die in der Definition des [Grenzwerts](#/mathe/analysis-1/folgen-grenzwerte) auftaucht: $\\abs{a_n - a} < \\varepsilon$ heißt „$a_n$ liegt im Intervall $(a - \\varepsilon, a + \\varepsilon)$“. Toleranzangaben in der Technik („$20 \\pm 0{,}05$ mm“) haben dieselbe Form: $\\abs{x - 20} \\le 0{,}05$.

> [!BEISPIEL] Toleranz
> $\\abs{3x + 1} \\le 8 \\iff -8 \\le 3x + 1 \\le 8 \\iff -9 \\le 3x \\le 7 \\iff -3 \\le x \\le \\frac73$.

## Zusammenfassung

- Äquivalenzumformungen erhalten die Lösungsmenge; Quadrieren und Multiplizieren mit Termen sind nur Folgerungen – dann ist die Probe Pflicht.
- Nicht durch Terme teilen, die null werden können; stattdessen ausklammern (Satz vom Nullprodukt).
- Multiplikation mit negativen Zahlen dreht Ungleichungen um; bei Variablen Fallunterscheidung oder Vorzeichentabelle.
- Betrag = Abstand: $\\abs{x - a} < r$ ist ein Intervall um $a$; mehrere Beträge über die Knickstellen in Bereiche zerlegen.
`;export{e as default};
