const e=`---
id: differentialrechnung
title: Differentialrechnung
module: analysis-1
order: 4
difficulty: fortgeschritten
minutes: 50
summary: Die Ableitung als Grenzwert des Differenzenquotienten und als beste lineare Näherung, Ableitungsregeln mit Beweisen, Ableitungen der Standardfunktionen, Umkehrfunktionen und der Mittelwertsatz.
tags: [Ableitung, Differenzenquotient, Produktregel, Kettenregel, Quotientenregel, Mittelwertsatz, Tangente]
requires: [folgen-grenzwerte]
---

## Von der Sekante zur Tangente

Wie schnell ändert sich eine Größe *in diesem Moment*? Die mittlere Änderungsrate von $f$ zwischen $x_0$ und $x_0 + h$ ist der **Differenzenquotient**
$$
\\frac{f(x_0 + h) - f(x_0)}{h},
$$
die Steigung der Sekante durch die Punkte $(x_0, f(x_0))$ und $(x_0 + h, f(x_0 + h))$. Lässt man $h$ gegen $0$ gehen, wird die Sekante zur Tangente.

> [!DEFINITION] Ableitung
> $f\\colon D \\to \\R$ heißt an der Stelle $x_0 \\in D$ **differenzierbar**, wenn der Grenzwert
> $$
> f'(x_0) = \\lim_{h \\to 0} \\frac{f(x_0 + h) - f(x_0)}{h}
> $$
> existiert. Er heißt **[[Ableitung]]** von $f$ in $x_0$. Ist $f$ überall differenzierbar, ist $f'\\colon x \\mapsto f'(x)$ die Ableitungsfunktion; andere Schreibweisen sind $\\frac{\\mathrm df}{\\mathrm dx}$ und $\\dot f$ (nach der Zeit).

Die **Tangente** an den Graphen in $x_0$ ist die Gerade $t(x) = f(x_0) + f'(x_0)(x - x_0)$.

> [!BEISPIEL] Ableitung aus der Definition
> Für $f(x) = x^2$:
> $$
> \\frac{(x + h)^2 - x^2}{h} = \\frac{2xh + h^2}{h} = 2x + h \\xrightarrow{h \\to 0} 2x .
> $$
> Also $f'(x) = 2x$. Für $f(x) = \\tfrac1x$ ($x \\neq 0$): $\\frac{\\frac{1}{x+h} - \\frac1x}{h} = \\frac{-1}{x(x+h)} \\to -\\frac{1}{x^2}$.

Im Plotter kannst du die Tangente entlang des Graphen schieben:

\`\`\`widget
plot: x^3 - 3x | -3 3 -4 4
\`\`\`

### Die beste lineare Näherung

Differenzierbarkeit bedeutet: In der Nähe von $x_0$ sieht $f$ aus wie eine Gerade.
$$
f(x_0 + h) = f(x_0) + f'(x_0)\\, h + r(h) \\qquad\\text{mit}\\qquad \\frac{r(h)}{h} \\xrightarrow{h\\to0} 0 .
$$
Der Fehler $r(h)$ geht schneller gegen $0$ als $h$ selbst. Diese Sicht verallgemeinert sich auf mehrere Variablen (Gradient, Jacobi-Matrix) und ist die Grundlage von Newton-Verfahren und Gradientenabstieg.

> [!SATZ] Differenzierbar ⇒ stetig
> Ist $f$ in $x_0$ differenzierbar, so ist $f$ in $x_0$ stetig.

> [!BEWEIS]
> $f(x_0 + h) - f(x_0) = \\frac{f(x_0 + h) - f(x_0)}{h} \\cdot h \\to f'(x_0) \\cdot 0 = 0$ für $h \\to 0$.

Die Umkehrung gilt nicht: $f(x) = \\abs x$ ist in $0$ stetig, aber die Differenzenquotienten sind $+1$ für $h > 0$ und $-1$ für $h < 0$ – der Graph hat einen Knick.

## Ableitungsregeln

> [!SATZ] Ableitungsregeln
> Sind $f, g$ differenzierbar und $c \\in \\R$, so gilt:
> $$
> \\begin{aligned}
> (f + g)' &= f' + g', \\qquad (cf)' = c f' && \\text{(Linearität)}\\\\
> (fg)' &= f'g + fg' && \\text{(Produktregel)}\\\\
> \\left(\\frac fg\\right)' &= \\frac{f'g - fg'}{g^2} \\quad (g \\neq 0) && \\text{(Quotientenregel)}\\\\
> (f \\circ g)'(x) &= f'(g(x)) \\cdot g'(x) && \\text{(Kettenregel)}
> \\end{aligned}
> $$

> [!BEWEIS] Produktregel
> Wir schieben eine geschickte Null ein:
> $$
> \\frac{f(x+h)g(x+h) - f(x)g(x)}{h} = \\frac{f(x+h) - f(x)}{h}\\, g(x+h) + f(x)\\, \\frac{g(x+h) - g(x)}{h} .
> $$
> Für $h \\to 0$ geht der erste Bruch gegen $f'(x)$, $g(x + h)$ wegen der Stetigkeit gegen $g(x)$ und der letzte Bruch gegen $g'(x)$.

Die Kettenregel liest man als „äußere Ableitung mal innere Ableitung“. Für verschachtelte Funktionen wird sie mehrfach angewandt – genau das tut **Backpropagation** beim Training neuronaler Netze, Schicht für Schicht von außen nach innen (siehe [Modul Optimierung & KI](#/mathe/optimierung)).

> [!BEISPIEL] Regeln kombinieren
> - $\\left(x^2 \\sin x\\right)' = 2x \\sin x + x^2 \\cos x$ (Produktregel)
> - $\\left(\\e^{-x^2}\\right)' = \\e^{-x^2} \\cdot (-2x)$ (Kettenregel: außen $\\e^u$, innen $u = -x^2$)
> - $\\left(\\frac{x}{x^2 + 1}\\right)' = \\frac{1 \\cdot (x^2+1) - x \\cdot 2x}{(x^2+1)^2} = \\frac{1 - x^2}{(x^2+1)^2}$ (Quotientenregel)
> - $\\left(\\sqrt{1 + \\cos^2 x}\\right)' = \\frac{1}{2\\sqrt{1 + \\cos^2 x}} \\cdot 2\\cos x \\cdot (-\\sin x)$ (Kettenregel zweimal)

## Ableitungen der Standardfunktionen

| $f(x)$ | $f'(x)$ | Bemerkung |
|---|---|---|
| $x^r$ | $r x^{r-1}$ | $r \\in \\R$, z. B. $\\sqrt x = x^{1/2}$ ergibt $\\frac{1}{2\\sqrt x}$ |
| $\\e^x$ | $\\e^x$ | die einzige Funktion (bis auf Vielfache), die ihre eigene Ableitung ist |
| $a^x$ | $a^x \\ln a$ | wegen $a^x = \\e^{x \\ln a}$ |
| $\\ln x$ | $\\frac1x$ | $x > 0$; allgemeiner $(\\ln\\abs x)' = \\frac1x$ |
| $\\sin x$ | $\\cos x$ | |
| $\\cos x$ | $-\\sin x$ | |
| $\\tan x$ | $\\frac{1}{\\cos^2 x} = 1 + \\tan^2 x$ | |
| $\\arctan x$ | $\\frac{1}{1 + x^2}$ | |
| $\\arcsin x$ | $\\frac{1}{\\sqrt{1 - x^2}}$ | $\\abs x < 1$ |

> [!SATZ] Ableitung der Umkehrfunktion
> Ist $f$ streng monoton und differenzierbar mit $f'(x_0) \\neq 0$, so ist die Umkehrfunktion in $y_0 = f(x_0)$ differenzierbar mit
> $$
> \\left(f^{-1}\\right)'(y_0) = \\frac{1}{f'(x_0)} = \\frac{1}{f'\\!\\left(f^{-1}(y_0)\\right)} .
> $$

Damit folgt etwa $(\\ln y)' = \\frac{1}{\\e^{\\ln y}} = \\frac1y$ aus $(\\e^x)' = \\e^x$. Geometrisch: Der Graph der Umkehrfunktion ist an der Winkelhalbierenden gespiegelt, und Steigungen werden zu Kehrwerten.

## Der Mittelwertsatz

> [!SATZ] Mittelwertsatz der Differentialrechnung
> Ist $f$ auf $[a, b]$ stetig und auf $(a, b)$ differenzierbar, so gibt es ein $\\xi \\in (a, b)$ mit
> $$
> f'(\\xi) = \\frac{f(b) - f(a)}{b - a} .
> $$

Anschaulich: Irgendwo ist die Tangente parallel zur Sekante durch die Endpunkte. Wer auf der Autobahn in einer Stunde 130 km zurücklegt, war mindestens einmal genau 130 km/h schnell. Der Spezialfall $f(a) = f(b)$ (dann $f'(\\xi) = 0$) heißt **Satz von Rolle**.

Der Mittelwertsatz ist das Werkzeug, um aus Informationen über $f'$ auf $f$ zu schließen:

> [!SATZ] Folgerungen
> Auf einem Intervall $I$ gilt für differenzierbares $f$:
> 1. $f' = 0$ auf $I$ $\\Rightarrow$ $f$ ist konstant.
> 2. $f' \\ge 0$ auf $I$ $\\Rightarrow$ $f$ ist monoton wachsend; $f' > 0$ $\\Rightarrow$ streng monoton wachsend.
> 3. $\\abs{f'} \\le L$ auf $I$ $\\Rightarrow$ $\\abs{f(x) - f(y)} \\le L \\abs{x - y}$ (Lipschitz-Abschätzung).

> [!BEWEIS] Punkt 2
> Für $x < y$ in $I$ gibt es nach dem Mittelwertsatz ein $\\xi$ zwischen $x$ und $y$ mit $f(y) - f(x) = f'(\\xi)(y - x)$. Mit $f'(\\xi) \\ge 0$ und $y - x > 0$ folgt $f(y) \\ge f(x)$.

> [!MISTAKE] Intervall vergessen
> $f(x) = -\\tfrac1x$ hat $f'(x) = \\tfrac{1}{x^2} > 0$ überall auf $\\R\\setminus\\set0$, ist dort aber **nicht** monoton wachsend: $f(-1) = 1 > -1 = f(1)$. Der Satz gilt nur auf Intervallen, und $\\R\\setminus\\set0$ ist keines.

## Höhere Ableitungen

Ist $f'$ wieder differenzierbar, heißt $f'' = (f')'$ zweite Ableitung, allgemein $f^{(n)}$. In der Physik ist bei einer Ortsfunktion $s(t)$ die erste Ableitung die Geschwindigkeit, die zweite die Beschleunigung. Geometrisch beschreibt $f''$ die **Krümmung**: $f'' > 0$ heißt linksgekrümmt (konvex), $f'' < 0$ rechtsgekrümmt. Wie man damit Extrema und Wendepunkte findet, behandelt die [Kurvendiskussion](#/mathe/analysis-1/kurvendiskussion).

> [!TIP] Numerisch ableiten
> Der Plotter berechnet $f'$ mit dem **zentralen Differenzenquotienten** $\\frac{f(x+h) - f(x-h)}{2h}$. Sein Fehler ist proportional zu $h^2$ statt $h$ wie beim einseitigen Quotienten. Zu kleines $h$ ist aber schädlich: Bei $h = 10^{-12}$ löscht die Subtraktion fast gleicher Gleitkommazahlen die gültigen Stellen aus (siehe [Gleitkommazahlen](#/mathe/numerik/gleitkomma)). Ein guter Kompromiss ist $h \\approx 10^{-5}$.

## Zusammenfassung

- $f'(x_0) = \\lim_{h\\to0}\\frac{f(x_0+h) - f(x_0)}{h}$ ist die Tangentensteigung und die beste lineare Näherung.
- Differenzierbar ⇒ stetig, aber nicht umgekehrt ($\\abs x$).
- Linearität, Produkt-, Quotienten- und Kettenregel; $(f^{-1})' = \\frac{1}{f' \\circ f^{-1}}$.
- Mittelwertsatz: $f'(\\xi) = \\frac{f(b) - f(a)}{b - a}$ – daraus folgen Monotonie- und Konstanzkriterien auf Intervallen.
`;export{e as default};
