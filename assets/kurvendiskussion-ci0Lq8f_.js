const e=`---
id: kurvendiskussion
title: Extrema, Krümmung und Kurvendiskussion
module: analysis-1
order: 5
difficulty: fortgeschritten
minutes: 45
summary: Lokale und globale Extrema, notwendige und hinreichende Bedingungen, Monotonie- und Krümmungsverhalten, Wendepunkte, Optimierungsaufgaben und die Regel von L'Hospital.
tags: [Extremum, Maximum, Minimum, Wendepunkt, Krümmung, Optimierung, L'Hospital]
requires: [differentialrechnung]
---

## Extrema

> [!DEFINITION] Lokales und globales Extremum
> $f\\colon D \\to \\R$ hat in $x_0 \\in D$ ein **lokales Maximum**, wenn es ein $\\delta > 0$ gibt mit $f(x) \\le f(x_0)$ für alle $x \\in D$ mit $\\abs{x - x_0} < \\delta$. Gilt $f(x) \\le f(x_0)$ sogar für **alle** $x \\in D$, ist es ein **globales** Maximum. Minima analog; Maxima und Minima heißen zusammen **Extrema**.

Extrema sind der Kern jeder Optimierung: kürzeste Wege, minimale Kosten, maximaler Gewinn, kleinster Fehler eines Modells.

> [!SATZ] Notwendige Bedingung (Fermat)
> Hat $f$ in einem **inneren** Punkt $x_0$ seines Definitionsbereichs ein lokales Extremum und ist dort differenzierbar, so gilt $f'(x_0) = 0$.

> [!BEWEIS]
> Sei $x_0$ ein lokales Maximum. Für kleine $h > 0$ ist $f(x_0 + h) - f(x_0) \\le 0$, also $\\frac{f(x_0+h) - f(x_0)}{h} \\le 0$ und im Grenzwert $f'(x_0) \\le 0$. Für kleine $h < 0$ ist der Quotient $\\ge 0$ (negativer Zähler durch negativen Nenner), also $f'(x_0) \\ge 0$. Zusammen $f'(x_0) = 0$.

Punkte mit $f'(x_0) = 0$ heißen **kritische** oder **stationäre** Punkte. Die Bedingung ist nur **notwendig**: $f(x) = x^3$ hat $f'(0) = 0$, aber in $0$ kein Extremum (ein **Sattelpunkt**).

> [!WARNING] Wo Extrema noch liegen können
> Kandidaten für Extrema sind nicht nur die Nullstellen von $f'$, sondern auch
> - **Randpunkte** des Definitionsbereichs (bei abgeschlossenen Intervallen) und
> - Stellen, an denen $f$ **nicht differenzierbar** ist (wie $\\abs x$ in $0$).

## Hinreichende Bedingungen

> [!SATZ] Vorzeichenwechsel von f′
> Ist $f'(x_0) = 0$ und wechselt $f'$ in $x_0$ das Vorzeichen von $+$ nach $-$, so liegt ein lokales Maximum vor; bei einem Wechsel von $-$ nach $+$ ein lokales Minimum. Ohne Vorzeichenwechsel liegt kein Extremum vor.

> [!SATZ] Zweite Ableitung
> Ist $f'(x_0) = 0$ und $f''(x_0) < 0$, so hat $f$ in $x_0$ ein lokales **Maximum**; bei $f''(x_0) > 0$ ein lokales **Minimum**. Bei $f''(x_0) = 0$ ist keine Aussage möglich.

Merkhilfe: $f'' > 0$ heißt „links gekrümmt“, der Graph ist eine nach oben offene Schale – am tiefsten Punkt liegt ein Minimum. Den Fall $f''(x_0) = 0$ zeigen $x^4$ (Minimum), $-x^4$ (Maximum) und $x^3$ (kein Extremum): Alle haben $f'(0) = f''(0) = 0$.

## Krümmung und Wendepunkte

> [!DEFINITION] Konvex, konkav, Wendepunkt
> $f$ heißt auf einem Intervall **konvex** (linksgekrümmt), wenn $f''\\ge 0$ dort gilt, und **konkav** (rechtsgekrümmt) bei $f'' \\le 0$. Ein Punkt, an dem das Krümmungsverhalten wechselt, heißt **Wendepunkt**.

Notwendig für einen Wendepunkt ist $f''(x_0) = 0$, hinreichend zum Beispiel $f''(x_0) = 0$ und $f'''(x_0) \\neq 0$ oder ein Vorzeichenwechsel von $f''$. Konvexität hat eine wichtige geometrische Bedeutung: Der Graph liegt **oberhalb jeder Tangente** und **unterhalb jeder Sekante**. Für die Optimierung ist das Gold wert – bei einer konvexen Funktion ist jedes lokale Minimum global (siehe [Konvexität](#/mathe/optimierung/konvexitaet)).

## Kurvendiskussion als Verfahren

Eine vollständige Untersuchung einer Funktion folgt einem festen Schema:

1. **Definitionsbereich**, Symmetrie ($f(-x) = f(x)$ gerade, $f(-x) = -f(x)$ ungerade)
2. **Nullstellen** und Schnittpunkt mit der $y$-Achse
3. **Verhalten am Rand** und bei Definitionslücken (Grenzwerte, Asymptoten)
4. **Ableitungen** $f', f'', f'''$
5. **Extrema**: $f'(x) = 0$ lösen, mit $f''$ oder Vorzeichenwechsel klassifizieren
6. **Wendepunkte**: $f''(x) = 0$ lösen, prüfen
7. **Monotonie- und Krümmungsintervalle**, Wertebereich, Skizze

> [!BEISPIEL] f(x) = x³ − 3x
> 1. $D = \\R$, $f(-x) = -f(x)$: punktsymmetrisch zum Ursprung.
> 2. Nullstellen: $x(x^2 - 3) = 0 \\Rightarrow x \\in \\set{0, \\pm\\sqrt3}$.
> 3. $f(x) \\to \\pm\\infty$ für $x \\to \\pm\\infty$.
> 4. $f'(x) = 3x^2 - 3$, $f''(x) = 6x$, $f'''(x) = 6$.
> 5. $f'(x) = 0 \\iff x = \\pm 1$. $f''(-1) = -6 < 0$: **Maximum** $(-1, 2)$. $f''(1) = 6 > 0$: **Minimum** $(1, -2)$.
> 6. $f''(x) = 0 \\iff x = 0$, $f'''(0) \\neq 0$: **Wendepunkt** $(0, 0)$ mit Steigung $f'(0) = -3$.
> 7. Streng wachsend auf $(-\\infty, -1]$ und $[1, \\infty)$, fallend auf $[-1, 1]$; konkav für $x < 0$, konvex für $x > 0$.

\`\`\`widget
plot: x^3 - 3x; 3x^2 - 3; 6x | -2.5 2.5 -5 5
\`\`\`

Im Plot sieht man den Zusammenhang direkt: Die Nullstellen von $f'$ (zweite Kurve) liegen unter den Extrema von $f$, die Nullstelle von $f''$ (dritte Kurve) unter dem Wendepunkt.

## Globale Extrema auf Intervallen

> [!SATZ] Extremwertsatz
> Eine auf einem abgeschlossenen, beschränkten Intervall $[a, b]$ stetige Funktion nimmt dort ein globales Maximum und ein globales Minimum an.

**Rezept:** Berechne $f$ an allen kritischen Punkten in $(a, b)$, an Stellen ohne Ableitung und an den Rändern $a$, $b$. Der größte dieser Werte ist das globale Maximum, der kleinste das globale Minimum.

> [!BEISPIEL] Global auf [0, 3]
> $f(x) = x^3 - 3x$ auf $[0, 3]$: kritischer Punkt im Inneren nur $x = 1$ mit $f(1) = -2$; Ränder $f(0) = 0$, $f(3) = 18$. Globales Minimum $-2$ bei $x = 1$, globales Maximum $18$ am **Rand** $x = 3$ – kein Punkt mit $f' = 0$.

## Optimierungsaufgaben

> [!BEISPIEL] Die Dose mit minimaler Oberfläche
> Eine zylindrische Dose soll $V = 1$ Liter $= 1000\\,\\text{cm}^3$ fassen. Für welchen Radius $r$ ist der Materialverbrauch (Oberfläche) minimal?
>
> **Zielfunktion:** $O = 2\\pi r^2 + 2\\pi r h$. **Nebenbedingung:** $\\pi r^2 h = 1000$, also $h = \\frac{1000}{\\pi r^2}$. Einsetzen:
> $$
> O(r) = 2\\pi r^2 + \\frac{2000}{r}, \\qquad r > 0 .
> $$
> $O'(r) = 4\\pi r - \\frac{2000}{r^2} = 0 \\iff r^3 = \\frac{500}{\\pi} \\iff r = \\sqrt[3]{\\frac{500}{\\pi}} \\approx 5{,}42\\,\\text{cm}$.
>
> $O''(r) = 4\\pi + \\frac{4000}{r^3} > 0$: Minimum. Dann ist $h = \\frac{1000}{\\pi r^2} = 2r$ – die optimale Dose ist so hoch wie breit. (Echte Dosen sind höher, weil Deckel und Boden dicker sind als die Wand.)

Das Schema: Zielgröße als Funktion aufschreiben, Nebenbedingungen nutzen, um auf **eine** Variable zu reduzieren, Definitionsbereich festlegen, Extremum bestimmen und Ränder prüfen. Bei mehreren Variablen mit Nebenbedingungen hilft die Methode der [Lagrange-Multiplikatoren](#/mathe/optimierung/lagrange).

## Die Regel von L'Hospital

Mit Ableitungen lassen sich auch unbestimmte Grenzwerte berechnen.

> [!SATZ] Regel von L'Hospital
> Seien $f, g$ in einer Umgebung von $x_0$ differenzierbar (außer evtl. in $x_0$), $g'(x) \\neq 0$, und gelte entweder $f(x), g(x) \\to 0$ oder $f(x), g(x) \\to \\pm\\infty$ für $x \\to x_0$. Existiert $\\lim_{x\\to x_0} \\frac{f'(x)}{g'(x)}$, so ist
> $$
> \\lim_{x \\to x_0} \\frac{f(x)}{g(x)} = \\lim_{x \\to x_0} \\frac{f'(x)}{g'(x)} .
> $$
> Das gilt auch für $x_0 = \\pm\\infty$.

> [!BEISPIEL] Drei Grenzwerte
> - $\\lim\\limits_{x\\to0} \\frac{\\sin x}{x} \\overset{0/0}{=} \\lim\\limits_{x\\to0}\\frac{\\cos x}{1} = 1$.
> - $\\lim\\limits_{x\\to\\infty} \\frac{\\ln x}{x} \\overset{\\infty/\\infty}{=} \\lim\\limits_{x\\to\\infty} \\frac{1/x}{1} = 0$ – der Logarithmus wächst langsamer als jede Gerade.
> - $\\lim\\limits_{x \\to 0^+} x \\ln x$: Umschreiben als $\\frac{\\ln x}{1/x}$ (Typ $\\infty/\\infty$), dann $\\lim \\frac{1/x}{-1/x^2} = \\lim(-x) = 0$.

> [!MISTAKE] L'Hospital ohne Prüfung
> Die Regel gilt **nur** bei $\\tfrac00$ oder $\\tfrac\\infty\\infty$. $\\lim_{x\\to0}\\frac{x + 1}{x + 2} = \\frac12$, aber „L'Hospital“ würde fälschlich $\\frac11 = 1$ liefern. Und es ist der Quotient der Ableitungen, **nicht** die Ableitung des Quotienten.

## Zusammenfassung

- Notwendig für ein inneres Extremum: $f'(x_0) = 0$; hinreichend: Vorzeichenwechsel von $f'$ oder $f''(x_0) \\neq 0$.
- Ränder und nicht differenzierbare Stellen gehören immer zu den Kandidaten.
- $f'' > 0$: konvex, $f'' < 0$: konkav; Wendepunkte wechseln die Krümmung.
- Optimierung: Zielfunktion + Nebenbedingung → eine Variable → Extremum. L'Hospital nur bei $\\tfrac00$ und $\\tfrac\\infty\\infty$.
`;export{e as default};
