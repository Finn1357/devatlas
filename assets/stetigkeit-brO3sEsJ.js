const e=`---
id: stetigkeit
title: Grenzwerte von Funktionen und Stetigkeit
module: analysis-1
order: 3
difficulty: fortgeschritten
minutes: 45
summary: Grenzwerte von Funktionen, einseitige und uneigentliche Grenzwerte, Stetigkeit mit Folgen- und Epsilon-Delta-Definition, Unstetigkeitsarten, Zwischenwertsatz mit Bisektion, Extremwertsatz und gleichmäßige Stetigkeit.
tags: [Stetigkeit, Grenzwert, Zwischenwertsatz, Extremwertsatz, Epsilon-Delta, Unstetigkeit]
requires: [folgen-grenzwerte]
---

## Grenzwerte von Funktionen

Bei Folgen fragt man, wohin $a_n$ für $n \\to \\infty$ läuft. Bei Funktionen fragt man, wohin $f(x)$ läuft, wenn $x$ sich einer Stelle $x_0$ nähert – auch wenn $f$ dort gar nicht definiert ist, wie bei $\\frac{\\sin x}{x}$ in $0$.

> [!DEFINITION] Grenzwert einer Funktion
> $f$ hat in $x_0$ den **Grenzwert** $L$, geschrieben $\\lim_{x \\to x_0} f(x) = L$, wenn für **jede** Folge $x_n \\to x_0$ mit $x_n \\neq x_0$ (im Definitionsbereich) gilt: $f(x_n) \\to L$.

Die Definition führt Funktionsgrenzwerte auf [Folgengrenzwerte](#/mathe/analysis-1/folgen-grenzwerte) zurück; alle Rechenregeln (Summe, Produkt, Quotient, Sandwich) übertragen sich.

> [!BEISPIEL] Kürzen einer Definitionslücke
> $\\lim\\limits_{x\\to 2}\\frac{x^2 - 4}{x - 2} = \\lim\\limits_{x \\to 2}(x + 2) = 4$. Für $x \\neq 2$ sind beide Ausdrücke gleich, und der Grenzwert schaut nur auf $x \\neq x_0$.

**Einseitige Grenzwerte** betrachten nur Folgen von links ($x_n < x_0$) bzw. rechts ($x_n > x_0$): $\\lim_{x \\to 0^+}\\frac{1}{x} = +\\infty$, $\\lim_{x \\to 0^-}\\frac1x = -\\infty$. Der (beidseitige) Grenzwert existiert genau dann, wenn beide einseitigen existieren und übereinstimmen.

> [!BEISPIEL] Ein Grenzwert, der nicht existiert
> $f(x) = \\sin\\frac1x$ für $x \\neq 0$: Für $x_n = \\frac{1}{2\\pi n}$ ist $f(x_n) = 0$, für $y_n = \\frac{1}{2\\pi n + \\pi/2}$ ist $f(y_n) = 1$. Beide Folgen gehen gegen $0$, die Funktionswerte aber gegen verschiedene Zahlen – kein Grenzwert in $0$. Der Graph oszilliert immer schneller.

## Stetigkeit

Anschaulich ist eine Funktion [[Stetigkeit|stetig]], wenn man ihren Graphen „ohne abzusetzen“ zeichnen kann. Präzise:

> [!DEFINITION] Stetigkeit
> $f\\colon D \\to \\R$ heißt **stetig in $x_0 \\in D$**, wenn
> $$
> \\lim_{x \\to x_0} f(x) = f(x_0),
> $$
> also wenn für jede Folge $x_n \\to x_0$ in $D$ gilt $f(x_n) \\to f(x_0)$. $f$ heißt **stetig**, wenn sie in jedem Punkt ihres Definitionsbereichs stetig ist.

Gleichwertig ist die **$\\varepsilon$-$\\delta$-Definition**:
$$
\\forall\\varepsilon > 0\\;\\;\\exists\\delta > 0\\;\\;\\forall x \\in D: \\;\\abs{x - x_0} < \\delta \\;\\Rightarrow\\; \\abs{f(x) - f(x_0)} < \\varepsilon .
$$
„Kleine Änderungen der Eingabe bewirken kleine Änderungen der Ausgabe.“ Genau das erwartet man von einer physikalischen Messung oder einer numerischen Berechnung – unstetige Stellen sind empfindlich gegenüber Rundungsfehlern ([Kondition](#/mathe/numerik/gleitkomma)).

> [!SATZ] Stetige Bausteine
> Polynome, rationale Funktionen (auf ihrem Definitionsbereich), $\\e^x$, $\\ln x$, $\\sin x$, $\\cos x$, $\\sqrt x$ und $\\abs x$ sind stetig. Summen, Produkte, Quotienten (mit Nenner $\\ne 0$) und **Verkettungen** stetiger Funktionen sind stetig.

Deshalb sind fast alle Funktionen aus Formeln automatisch stetig; Unstetigkeiten entstehen an Definitionslücken, bei Fallunterscheidungen und bei Rundungsfunktionen.

### Arten von Unstetigkeiten

| Art | Beispiel in $x_0 = 0$ | Beschreibung |
|---|---|---|
| hebbar | $f(x) = \\frac{\\sin x}{x}$, $f(0) := 0$ | Grenzwert existiert ($=1$), stimmt aber nicht mit $f(0)$ überein; Abhilfe: $f(0) := 1$ |
| Sprung | $\\operatorname{sgn}(x)$, \`floor(x)\` | beide einseitigen Grenzwerte existieren, sind aber verschieden |
| Polstelle | $\\frac1x$ | Funktionswerte wachsen über alle Grenzen |
| Oszillation | $\\sin\\frac1x$ | kein einseitiger Grenzwert |

> [!TIP] Unstetigkeiten im Code
> Rundungsfunktionen (\`floor\`, \`round\`), Vergleiche (\`if x > 0\`) und Ganzzahldivision erzeugen Sprungstellen. Liegt ein Eingabewert nahe einer solchen Stelle, kann ein winziger Rundungsfehler das Ergebnis komplett ändern – etwa wenn \`round(2.675, 2)\` in Python \`2.67\` statt \`2.68\` liefert, weil $2{,}675$ in Binärdarstellung knapp unter dem Wert liegt.

## Der Zwischenwertsatz

> [!SATZ] Zwischenwertsatz
> Ist $f\\colon [a, b] \\to \\R$ stetig und liegt $c$ zwischen $f(a)$ und $f(b)$, so gibt es ein $\\xi \\in [a, b]$ mit $f(\\xi) = c$. Insbesondere hat $f$ eine Nullstelle, wenn $f(a)$ und $f(b)$ verschiedene Vorzeichen haben.

> [!BEWEIS] Durch Bisektion
> Sei $f(a) < 0 < f(b)$ (sonst betrachte $-f$; der allgemeine Fall folgt mit $f - c$). Halbiere das Intervall, $m = \\frac{a+b}{2}$; ist $f(m) \\le 0$, ersetze $a$ durch $m$, sonst $b$ durch $m$. So entstehen eine wachsende Folge $(a_n)$ mit $f(a_n) \\le 0$ und eine fallende Folge $(b_n)$ mit $f(b_n) > 0$, deren Abstand $\\frac{b - a}{2^n}$ gegen $0$ geht. Nach dem Monotoniekriterium konvergieren beide gegen dasselbe $\\xi$. Wegen der Stetigkeit gilt $f(\\xi) = \\lim f(a_n) \\le 0$ und $f(\\xi) = \\lim f(b_n) \\ge 0$, also $f(\\xi) = 0$.

Der Beweis ist zugleich ein Algorithmus: das [Bisektionsverfahren](#/mathe/numerik/nullstellen). Er nutzt die **Vollständigkeit** von $\\R$ – über $\\Q$ ist der Satz falsch: $x^2 - 2$ wechselt auf $[1, 2]$ das Vorzeichen, hat aber keine rationale Nullstelle.

> [!BEISPIEL] Existenz ohne Formel
> $x^5 - x - 1 = 0$ hat keine Lösungsformel. Aber $f(1) = -1 < 0$ und $f(2) = 29 > 0$, also gibt es eine Lösung in $[1, 2]$. Weil $f'(x) = 5x^4 - 1 > 0$ für $x \\ge 1$, ist sie dort sogar eindeutig.

> [!BEISPIEL] Der Wackeltisch
> Ein Tisch mit vier gleich langen Beinen wackelt auf unebenem Boden. Dreht man ihn um seine Mitte, ändert sich der Höhenunterschied der Beine stetig und wechselt nach einer Vierteldrehung das Vorzeichen – irgendwo dazwischen steht der Tisch nach dem Zwischenwertsatz stabil (bei nicht zu wildem Boden).

## Der Extremwertsatz

> [!SATZ] Satz vom Maximum und Minimum
> Jede auf einem **abgeschlossenen, beschränkten** Intervall $[a, b]$ stetige Funktion ist beschränkt und nimmt ihr Maximum und Minimum an: Es gibt $x_{\\min}, x_{\\max} \\in [a, b]$ mit $f(x_{\\min}) \\le f(x) \\le f(x_{\\max})$ für alle $x$.

Beide Voraussetzungen sind nötig: $\\frac1x$ auf $(0, 1]$ (Intervall nicht abgeschlossen) ist unbeschränkt; $x$ auf $(0, 1)$ hat weder Maximum noch Minimum; eine unstetige Funktion mit Sprung kann ihr Supremum verfehlen. Der Satz garantiert, dass die Suche nach globalen Extrema in der [Kurvendiskussion](#/mathe/analysis-1/kurvendiskussion) auf einem Intervall immer eine Lösung hat.

## Gleichmäßige Stetigkeit

Bei der $\\varepsilon$-$\\delta$-Definition darf $\\delta$ von $x_0$ abhängen. Gibt es zu jedem $\\varepsilon$ ein $\\delta$, das **überall** funktioniert, heißt $f$ **gleichmäßig stetig**. Beispiel: $f(x) = x^2$ ist auf $[0, 1]$ gleichmäßig stetig, auf ganz $\\R$ aber nicht – je größer $x$, desto steiler, desto kleiner muss $\\delta$ sein.

> [!SATZ] Heine
> Jede auf einem abgeschlossenen, beschränkten Intervall stetige Funktion ist dort gleichmäßig stetig.

Das ist die Grundlage dafür, dass Riemann-Summen stetiger Funktionen konvergieren ([Integral](#/mathe/analysis-2/integralrechnung)): Auf feinen Zerlegungen schwankt $f$ in jedem Teilintervall überall gleich wenig. Eine noch stärkere Eigenschaft ist die **Lipschitz-Stetigkeit** $\\abs{f(x) - f(y)} \\le L\\abs{x - y}$, die man aus einer beschränkten Ableitung erhält ([Mittelwertsatz](#/mathe/analysis-1/differentialrechnung)).

## Zusammenfassung

- $\\lim_{x\\to x_0} f(x) = L$: für alle Folgen $x_n \\to x_0$ ($x_n \\neq x_0$) gilt $f(x_n) \\to L$; einseitige Grenzwerte müssen übereinstimmen.
- Stetig: $\\lim_{x\\to x_0} f(x) = f(x_0)$; Verkettungen stetiger Funktionen sind stetig.
- Zwischenwertsatz: Vorzeichenwechsel ⇒ Nullstelle (Beweis = Bisektion); Extremwertsatz auf $[a, b]$.
- Unstetigkeiten: hebbar, Sprung, Pol, Oszillation – im Code durch Rundung und Fallunterscheidungen.
`;export{e as default};
