const e=`---
id: mehrfachintegrale
title: Mehrfachintegrale
module: analysis-2
order: 5
difficulty: fortgeschritten
minutes: 75
summary: Doppel- und Dreifachintegrale von der zweidimensionalen Riemann-Summe bis zum Transformationssatz – Satz von Fubini und Tonelli, Grenzen nicht rechteckiger Gebiete, Polar-, Zylinder- und Kugelkoordinaten, Schwerpunkte, Wahrscheinlichkeiten und Monte-Carlo-Integration.
tags: [Doppelintegral, Dreifachintegral, Satz von Fubini, Jacobi-Determinante, Polarkoordinaten, Kugelkoordinaten, Schwerpunkt, Monte Carlo]
requires: [integralrechnung, mehrere-variablen, determinanten]
---

## Warum ein Integral nicht reicht

Das [Integral](#/mathe/analysis-2/integralrechnung) $\\int_a^b f(x)\\,\\mathrm dx$ summiert eine Größe entlang einer Strecke: Fläche unter einer Kurve, zurückgelegter Weg, Arbeit. Viele Fragen leben aber in der Ebene oder im Raum. Wie schwer ist eine Platte, deren Dichte sich von Punkt zu Punkt ändert? Wie viel Wasser fasst ein Becken mit gewölbtem Boden? Mit welcher Wahrscheinlichkeit landen **zwei** Zufallszahlen in einem bestimmten Bereich? Wie hell ist ein Pixel, wenn Licht aus allen Richtungen eines Halbraums einfällt?

In all diesen Fällen hängt die Größe von mehreren Variablen ab, und man muss über ein zwei- oder dreidimensionales Gebiet summieren. Das leistet das **[[Mehrfachintegral]]**. Erstaunlich ist, dass man dafür kaum neue Rechentechnik braucht: Mehrfachintegrale werden auf mehrere gewöhnliche Integrale nacheinander zurückgeführt. Die eigentliche Arbeit liegt darin, das Gebiet richtig zu beschreiben – und manchmal in geschickt gewählten Koordinaten.

## Vom Riemann-Integral zum Doppelintegral

Sei $f(x, y)$ eine Funktion auf dem Rechteck $R = [a, b] \\times [c, d]$. Man zerlegt $[a, b]$ in $n$ Teilintervalle der Breite $\\Delta x$ und $[c, d]$ in $m$ Teilintervalle der Breite $\\Delta y$. So entsteht ein Gitter aus $nm$ kleinen Rechtecken $R_{ij}$ mit Fläche $\\Delta A = \\Delta x\\,\\Delta y$. In jedem wählt man einen Punkt $(x_i^*, y_j^*)$, etwa den Mittelpunkt.

> [!DEFINITION] Doppelintegral über einem Rechteck
> $f$ heißt integrierbar über $R$, wenn die **zweidimensionalen Riemann-Summen**
> $$
> S = \\sum_{i=1}^{n}\\sum_{j=1}^{m} f(x_i^*, y_j^*)\\,\\Delta A
> $$
> für immer feinere Zerlegungen (größte Seitenlänge gegen $0$) unabhängig von der Wahl der Punkte gegen denselben Wert streben. Dieser Grenzwert heißt **Doppelintegral** $\\iint_R f(x, y)\\,\\mathrm dA$. Jede auf $R$ stetige Funktion ist integrierbar.

Für $f \\ge 0$ ist jeder Summand $f(x_i^*, y_j^*)\\,\\Delta A$ das Volumen einer schmalen Säule mit Grundfläche $R_{ij}$ und Höhe $f$. Das Doppelintegral ist dann das **Volumen** zwischen der Ebene $z = 0$ und der Fläche $z = f(x, y)$ über $R$. Nimmt $f$ auch negative Werte an, zählen Teile unterhalb der Ebene negativ: Das Integral ist ein **orientiertes** Volumen. So ist $\\iint_{[0, 2\\pi] \\times [0, 1]} \\sin x\\,\\mathrm dA = 0$, obwohl zwischen Fläche und Ebene das Volumen $\\iint \\abs{\\sin x}\\,\\mathrm dA = 4$ liegt.

> [!BEISPIEL] Mittelpunktsumme von Hand
> Für $f(x, y) = x^2 + y$ auf $[0, 2] \\times [0, 1]$ und ein $2 \\times 2$-Gitter ist $\\Delta A = 1 \\cdot \\frac12$, die Mittelpunkte haben $x \\in \\{0{,}5;\\ 1{,}5\\}$ und $y \\in \\{0{,}25;\\ 0{,}75\\}$:
> $$
> S = \\tfrac12\\big(0{,}5 + 1 + 2{,}5 + 3\\big) = 3{,}5 .
> $$
> Mit $4 \\times 4$ Zellen ergibt sich $3{,}625$, mit $8 \\times 8$ Zellen $3{,}65625$. Der exakte Wert ist $\\frac{11}{3} \\approx 3{,}6667$; der Fehler $\\frac16,\\ \\frac1{24},\\ \\frac1{96}$ viertelt sich bei jeder Verdopplung – die Mittelpunktregel hat wie in einer Dimension Ordnung $2$ (siehe [numerische Integration](#/mathe/numerik/numerische-integration)).

Im [Mehrfachintegral-Labor](#/mathe/labor/mehrfachintegral) lässt sich diese Summe für beliebige Funktionen und Gebiete zeichnen und verfeinern.

## Iterierte Integrale und der Satz von Fubini

Riemann-Summen definieren das Integral, rechnen will man damit nicht. Die Idee: Man summiert zuerst entlang jeder Spalte und dann über die Spalten. Im Grenzfall wird daraus ein **iteriertes Integral** – zwei gewöhnliche Integrale nacheinander.

> [!MERKE] Schreibweise lesen
> In $\\displaystyle\\int_a^b \\int_c^d f(x, y)\\,\\mathrm dy\\,\\mathrm dx$ gehört das **innere** Integralzeichen zum **inneren** Differential: Zuerst wird nach $y$ von $c$ bis $d$ integriert, wobei $x$ wie eine Konstante behandelt wird. Das Ergebnis ist eine Funktion von $x$, die anschließend von $a$ bis $b$ integriert wird. Die Grenzen stehen also von innen nach außen in derselben Reihenfolge wie die Differentiale.

> [!SATZ] Satz von Fubini
> Ist $f$ stetig auf $R = [a, b] \\times [c, d]$, so gilt
> $$
> \\iint_R f\\,\\mathrm dA = \\int_a^b\\!\\left(\\int_c^d f(x, y)\\,\\mathrm dy\\right)\\mathrm dx = \\int_c^d\\!\\left(\\int_a^b f(x, y)\\,\\mathrm dx\\right)\\mathrm dy .
> $$
> Allgemeiner gilt die Gleichheit für jede Funktion mit $\\iint_R \\abs f\\,\\mathrm dA < \\infty$ (absolut integrierbar), auch auf unbeschränkten Gebieten.

Der **[[Satz von Fubini]]** erlaubt also, ein Doppelintegral in beliebiger Reihenfolge iteriert auszurechnen – vorausgesetzt, $f$ ist absolut integrierbar.

> [!BEWEIS]
> Für stetiges $f$ auf dem kompakten Rechteck: Die Funktion $F(x) = \\int_c^d f(x, y)\\,\\mathrm dy$ ist stetig. Wählt man in der Riemann-Summe die Punkte $y_j^*$ so, dass $\\sum_j f(x_i^*, y_j^*)\\Delta y$ eine Riemann-Summe von $F(x_i^*)$ ist, so ist die Doppelsumme $\\sum_i \\big(\\sum_j f(x_i^*, y_j^*)\\Delta y\\big)\\Delta x$ zugleich Riemann-Summe des Doppelintegrals und – wegen gleichmäßiger Stetigkeit von $f$ – beliebig nahe an $\\sum_i F(x_i^*)\\,\\Delta x$, einer Riemann-Summe von $\\int_a^b F(x)\\,\\mathrm dx$. Beide Grenzwerte stimmen daher überein. Vertauscht man die Rollen von $x$ und $y$, folgt die zweite Reihenfolge.

> [!BEISPIEL] Beide Reihenfolgen
> Für $\\iint_{[0, 2] \\times [0, 1]} (x^2 + y)\\,\\mathrm dA$:
> - erst $y$: $\\int_0^1 (x^2 + y)\\,\\mathrm dy = x^2 + \\frac12$, dann $\\int_0^2 \\left(x^2 + \\frac12\\right)\\mathrm dx = \\frac83 + 1 = \\frac{11}3$;
> - erst $x$: $\\int_0^2 (x^2 + y)\\,\\mathrm dx = \\frac83 + 2y$, dann $\\int_0^1 \\left(\\frac83 + 2y\\right)\\mathrm dy = \\frac83 + 1 = \\frac{11}3$.
>
> Zerfällt der Integrand in ein Produkt $g(x)\\,h(y)$, zerfällt auch das Integral über einem Rechteck: $\\iint_{[0, \\pi] \\times [0, 1]} y \\sin x\\,\\mathrm dA = \\int_0^\\pi \\sin x\\,\\mathrm dx \\cdot \\int_0^1 y\\,\\mathrm dy = 2 \\cdot \\frac12 = 1$.

> [!SATZ] Satz von Tonelli
> Ist $f \\ge 0$ (und messbar), so stimmen beide iterierten Integrale immer überein – möglicherweise sind beide $+\\infty$. Die Reihenfolge darf also bei nichtnegativen Funktionen ohne weitere Voraussetzung getauscht werden.

Der **[[Satz von Tonelli]]** ist das Werkzeug, um die Voraussetzung von Fubini zu prüfen: Man rechnet $\\iint \\abs f$ in einer bequemen Reihenfolge aus. Ist das Ergebnis endlich, darf man $f$ selbst in jeder Reihenfolge integrieren.

> [!WARNING] Unbedachtes Vertauschen
> Für $f(x, y) = \\dfrac{x^2 - y^2}{(x^2 + y^2)^2}$ auf $(0, 1] \\times (0, 1]$ ist $f = \\frac{\\partial}{\\partial y}\\frac{y}{x^2 + y^2}$, also
> $$
> \\int_0^1\\!\\int_0^1 f\\,\\mathrm dy\\,\\mathrm dx = \\int_0^1 \\frac{\\mathrm dx}{1 + x^2} = \\frac\\pi4, \\qquad \\int_0^1\\!\\int_0^1 f\\,\\mathrm dx\\,\\mathrm dy = -\\frac\\pi4 ,
> $$
> denn $f(x, y) = -f(y, x)$. Fubini ist nicht verletzt, sondern nicht anwendbar: Nahe dem Ursprung wächst $\\abs f$ wie $\\frac{1}{r^2}$, und $\\iint \\abs f\\,\\mathrm dA = \\infty$. Positive und negative Anteile sind beide unendlich, und je nach Reihenfolge „gewinnt“ ein anderer.

## Nicht rechteckige Gebiete

Meist ist das **[[Integrationsgebiet]]** kein Rechteck, sondern ein Dreieck, ein Kreis oder der Bereich zwischen zwei Kurven. Man setzt $f$ außerhalb des Gebiets $D$ gleich $0$ und integriert über ein umschließendes Rechteck. Praktisch rechnet man mit Gebieten, die sich durch zwei Ungleichungsketten beschreiben lassen.

> [!DEFINITION] Normalbereiche
> - **Typ I** (senkrechte Streifen): $D = \\{(x, y) : a \\le x \\le b,\\ g_1(x) \\le y \\le g_2(x)\\}$, dann $\\displaystyle\\iint_D f\\,\\mathrm dA = \\int_a^b \\int_{g_1(x)}^{g_2(x)} f(x, y)\\,\\mathrm dy\\,\\mathrm dx$.
> - **Typ II** (waagerechte Streifen): $D = \\{(x, y) : c \\le y \\le d,\\ h_1(y) \\le x \\le h_2(y)\\}$, dann $\\displaystyle\\iint_D f\\,\\mathrm dA = \\int_c^d \\int_{h_1(y)}^{h_2(y)} f(x, y)\\,\\mathrm dx\\,\\mathrm dy$.
>
> Die inneren Grenzen dürfen von der äußeren Variablen abhängen, die äußeren Grenzen sind immer Zahlen.

> [!MERKE] Grenzen aus einer Skizze gewinnen
> 1. Gebiet skizzieren und die Randkurven beschriften; Schnittpunkte ausrechnen.
> 2. Äußere Variable wählen, etwa $x$. Ihr Bereich $[a, b]$ ist die Projektion des Gebiets auf die $x$-Achse.
> 3. Für ein festes $x$ eine senkrechte Linie durch das Gebiet ziehen: Wo tritt sie ein ($y = g_1(x)$), wo tritt sie aus ($y = g_2(x)$)?
> 4. Ändert sich die Eintritts- oder Austrittskurve unterwegs, das Gebiet an dieser Stelle aufteilen und die Teilintegrale addieren.

> [!BEISPIEL] Dreieck in beiden Richtungen
> $D$ sei das Dreieck mit den Ecken $(0, 0)$, $(1, 0)$, $(1, 1)$, also unter der Diagonalen $y = x$.
> - **Typ I:** $x$ läuft von $0$ bis $1$; eine senkrechte Linie bei $x$ tritt bei $y = 0$ ein und bei $y = x$ aus:
> $$
> \\iint_D xy\\,\\mathrm dA = \\int_0^1\\!\\int_0^x xy\\,\\mathrm dy\\,\\mathrm dx = \\int_0^1 \\frac{x^3}{2}\\,\\mathrm dx = \\frac18 .
> $$
> - **Typ II:** $y$ läuft von $0$ bis $1$; eine waagerechte Linie bei $y$ tritt bei $x = y$ ein und bei $x = 1$ aus:
> $$
> \\int_0^1\\!\\int_y^1 xy\\,\\mathrm dx\\,\\mathrm dy = \\int_0^1 \\frac{y(1 - y^2)}{2}\\,\\mathrm dy = \\frac12\\left(\\frac12 - \\frac14\\right) = \\frac18 .
> $$

> [!BEISPIEL] Zwischen zwei Graphen
> Die Kurven $y = x^2$ und $y = x$ schneiden sich bei $x = 0$ und $x = 1$; dazwischen liegt $y = x$ oben. Die Fläche ist $\\int_0^1\\!\\int_{x^2}^{x} 1\\,\\mathrm dy\\,\\mathrm dx = \\int_0^1 (x - x^2)\\,\\mathrm dx = \\frac16$ – das bekannte Integral „obere minus untere Funktion“ ist ein Doppelintegral mit $f = 1$. Ebenso folgt $\\iint_D y\\,\\mathrm dA = \\int_0^1 \\frac{x^2 - x^4}{2}\\,\\mathrm dx = \\frac1{15}$.

Ein Kreis ist ebenfalls ein Normalbereich: Die Einheitskreisscheibe ist $\\{-1 \\le x \\le 1,\\ -\\sqrt{1 - x^2} \\le y \\le \\sqrt{1 - x^2}\\}$. Ihre Fläche $\\int_{-1}^1 2\\sqrt{1 - x^2}\\,\\mathrm dx = \\pi$ verlangt aber eine trigonometrische Substitution – ein Hinweis, dass kartesische Koordinaten hier nicht die natürliche Wahl sind. Komplizierte Gebiete, etwa ein L-förmiges Blech oder der Bereich zwischen einem Quadrat und einem eingeschriebenen Kreis, zerlegt man in Normalbereiche oder schreibt sie als Differenz zweier einfacher Gebiete.

### Reihenfolge tauschen

Manchmal ist nur eine Reihenfolge ausrechenbar. Dann beschreibt man dasselbe Gebiet als Normalbereich des anderen Typs.

> [!BEISPIEL] Unmögliche Stammfunktion umgehen
> $\\displaystyle\\int_0^1\\!\\int_y^1 \\e^{x^2}\\,\\mathrm dx\\,\\mathrm dy$ ist so nicht auszurechnen: $\\e^{x^2}$ hat keine elementare Stammfunktion.
> 1. Gebiet ablesen: $0 \\le y \\le 1$ und $y \\le x \\le 1$ – das Dreieck unter der Diagonalen mit den Ecken $(0, 0)$, $(1, 0)$, $(1, 1)$.
> 2. Als Typ I beschreiben: $0 \\le x \\le 1$, $0 \\le y \\le x$.
> 3. Neu integrieren (im [Labor](#/mathe/labor/mehrfachintegral?beispiel=exp-tausch) lassen sich beide Beschreibungen umschalten):
> $$
> \\int_0^1\\!\\int_0^x \\e^{x^2}\\,\\mathrm dy\\,\\mathrm dx = \\int_0^1 x\\,\\e^{x^2}\\,\\mathrm dx = \\left[\\tfrac12\\e^{x^2}\\right]_0^1 = \\frac{\\e - 1}{2} \\approx 0{,}8591 .
> $$
> Der Faktor $x$ aus dem inneren Integral liefert genau die innere Ableitung, die vorher fehlte. Erlaubt ist der Tausch nach Fubini, weil $\\e^{x^2}$ auf dem kompakten Dreieck stetig ist.

## Koordinatentransformationen

### Polarkoordinaten

Kreise, Ringe und Sektoren beschreibt man einfacher mit Abstand $r$ und Winkel $\\varphi$:
$$
x = r\\cos\\varphi, \\qquad y = r\\sin\\varphi, \\qquad r \\ge 0,\\ 0 \\le \\varphi < 2\\pi .
$$
In **[[Polarkoordinaten]]** ist die Kreisscheibe vom Radius $R$ das Rechteck $[0, R] \\times [0, 2\\pi]$. Doch Vorsicht: Ein Rechteck im $(r, \\varphi)$-Gitter ist in der $(x, y)$-Ebene ein **Ringsektor**, und dessen Fläche hängt vom Radius ab.

> [!SATZ] Flächenelement in Polarkoordinaten
> Die Zelle $[r, r + \\Delta r] \\times [\\varphi, \\varphi + \\Delta\\varphi]$ hat die Fläche
> $$
> \\frac{\\Delta\\varphi}{2}\\Big((r + \\Delta r)^2 - r^2\\Big) = \\Big(r + \\frac{\\Delta r}{2}\\Big)\\,\\Delta r\\,\\Delta\\varphi \\approx r\\,\\Delta r\\,\\Delta\\varphi ,
> $$
> im Grenzfall also $\\mathrm dA = r\\,\\mathrm dr\\,\\mathrm d\\varphi$.

> [!BEWEIS]
> Ein Kreissektor mit Radius $\\rho$ und Öffnungswinkel $\\Delta\\varphi$ hat die Fläche $\\frac{\\Delta\\varphi}{2\\pi}\\pi\\rho^2 = \\frac{\\Delta\\varphi}2\\rho^2$. Die Zelle ist die Differenz der Sektoren mit Radius $r + \\Delta r$ und $r$. Ausmultiplizieren ergibt $(r + \\frac{\\Delta r}2)\\Delta r\\,\\Delta\\varphi$. Anschaulich: Die Zelle ist fast ein Rechteck mit der Breite $\\Delta r$ und der Bogenlänge $r\\,\\Delta\\varphi$ als Höhe.

Dasselbe liefert die Analysis: Die [Jacobi-Matrix](#/mathe/analysis-2/mehrere-variablen) der Abbildung $(r, \\varphi) \\mapsto (r\\cos\\varphi, r\\sin\\varphi)$ hat die [Determinante](#/mathe/lineare-algebra/determinanten) $\\cos\\varphi \\cdot r\\cos\\varphi - (-r\\sin\\varphi)\\sin\\varphi = r$, und die Determinante ist der lokale Flächen-Streckfaktor einer linearen Abbildung.

> [!WARNING] Bloßes Ersetzen reicht nicht
> Wer nur $x$ und $y$ ersetzt und $\\mathrm dx\\,\\mathrm dy$ durch $\\mathrm dr\\,\\mathrm d\\varphi$, erhält für die Fläche der Einheitskreisscheibe $\\int_0^{2\\pi}\\!\\int_0^1 1\\,\\mathrm dr\\,\\mathrm d\\varphi = 2\\pi$ statt $\\pi$. Ohne den Faktor $r$ würden die Zellen am Rand genauso stark gewichtet wie die winzigen Zellen nahe der Mitte. Richtig: $\\int_0^{2\\pi}\\!\\int_0^1 r\\,\\mathrm dr\\,\\mathrm d\\varphi = 2\\pi \\cdot \\frac12 = \\pi$.

### Der Transformationssatz

> [!SATZ] Transformationssatz
> Sei $T\\colon U \\to V$ eine bijektive, stetig differenzierbare Abbildung zwischen offenen Mengen des $\\R^n$ mit stetig differenzierbarer Umkehrung, und sei $f$ auf $V$ integrierbar. Dann gilt
> $$
> \\int_V f(\\vec x)\\,\\mathrm d\\vec x = \\int_U f\\big(T(\\vec u)\\big)\\,\\abs{\\det J_T(\\vec u)}\\,\\mathrm d\\vec u .
> $$
> Ränder und andere Mengen vom Inhalt null dürfen dabei ausgenommen werden – etwa $r = 0$ und $\\varphi = 0$ bei Polarkoordinaten, wo $T$ nicht umkehrbar ist.

Der **[[Transformationssatz]]** ist die mehrdimensionale Substitutionsregel. Die **[[Jacobi-Determinante]]** $\\det J_T$ misst, wie stark $T$ kleine Flächen- oder Volumenstücke streckt; ihr **Betrag** steht im Integral, weil Flächen positiv sind. Ein negatives Vorzeichen bedeutet nur, dass $T$ die Orientierung umkehrt (wie eine Spiegelung). Die Voraussetzungen sorgen dafür, dass kein Gebietsteil doppelt gezählt oder auf eine Linie zusammengedrückt wird.

> [!BEISPIEL] Kreise, Ringe und Sektoren
> - Kreisscheibe vom Radius $R$: $\\int_0^{2\\pi}\\!\\int_0^R r\\,\\mathrm dr\\,\\mathrm d\\varphi = \\pi R^2$.
> - Kreisring $1 \\le r \\le 2$, Integrand $x^2 + y^2 = r^2$: $\\int_0^{2\\pi}\\!\\int_1^2 r^2 \\cdot r\\,\\mathrm dr\\,\\mathrm d\\varphi = 2\\pi \\cdot \\frac{16 - 1}{4} = \\frac{15\\pi}{2}$.
> - Viertelkreis im ersten Quadranten, Integrand $xy$: $\\int_0^{\\pi/2}\\!\\int_0^1 r^2\\cos\\varphi\\sin\\varphi \\cdot r\\,\\mathrm dr\\,\\mathrm d\\varphi = \\frac14 \\cdot \\frac12 = \\frac18$.

> [!BEISPIEL] Das Gaußsche Integral
> Für $I = \\int_{-\\infty}^{\\infty} \\e^{-x^2}\\,\\mathrm dx$ gibt es keine elementare Stammfunktion. Aber nach Tonelli (der Integrand ist positiv) ist
> $$
> I^2 = \\int_{-\\infty}^{\\infty}\\!\\int_{-\\infty}^{\\infty} \\e^{-(x^2 + y^2)}\\,\\mathrm dx\\,\\mathrm dy = \\int_0^{2\\pi}\\!\\int_0^\\infty \\e^{-r^2}\\,r\\,\\mathrm dr\\,\\mathrm d\\varphi = 2\\pi \\cdot \\frac12 = \\pi ,
> $$
> also $I = \\sqrt\\pi$. Daraus folgt der Vorfaktor $\\frac{1}{\\sigma\\sqrt{2\\pi}}$ der [[Normalverteilung]] – der Faktor $r$ macht das Integral erst lösbar.

### Andere Transformationen

> [!BEISPIEL] Gedrehtes Quadrat
> Gesucht ist $\\iint_D (x^2 - y^2)\\,\\mathrm dA$ über dem Quadrat $D$ mit $0 \\le x + y \\le 2$ und $0 \\le x - y \\le 2$ (Ecken $(0, 0)$, $(1, 1)$, $(2, 0)$, $(1, -1)$). Mit $u = x + y$, $v = x - y$ wird $D$ zum Achsenquadrat $[0, 2]^2$. Umgekehrt ist $x = \\frac{u + v}2$, $y = \\frac{u - v}2$ und
> $$
> J = \\begin{pmatrix} \\frac12 & \\frac12 \\\\[2pt] \\frac12 & -\\frac12 \\end{pmatrix}, \\qquad \\det J = -\\frac12, \\qquad \\abs{\\det J} = \\frac12 .
> $$
> Wegen $x^2 - y^2 = (x + y)(x - y) = uv$ ist $\\iint_D (x^2 - y^2)\\,\\mathrm dA = \\int_0^2\\!\\int_0^2 uv \\cdot \\frac12\\,\\mathrm du\\,\\mathrm dv = \\frac12 \\cdot 2 \\cdot 2 = 2$. Probe mit $f = 1$: Fläche $\\frac12 \\cdot 4 = 2$, und tatsächlich hat das Quadrat die Seitenlänge $\\sqrt 2$.

Für die Ellipse $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} \\le 1$ nimmt man **elliptische Koordinaten** $x = a\\,r\\cos\\varphi$, $y = b\\,r\\sin\\varphi$ mit $\\abs{\\det J} = ab\\,r$; die Fläche ist $\\int_0^{2\\pi}\\!\\int_0^1 ab\\,r\\,\\mathrm dr\\,\\mathrm d\\varphi = \\pi ab$. Allgemein multipliziert eine [lineare Abbildung](#/mathe/lineare-algebra/lineare-abbildungen) mit Matrix $A$ alle Flächen mit $\\abs{\\det A}$; der Transformationssatz überträgt das auf nichtlineare Abbildungen, die im Kleinen fast linear sind.

## Dreifachintegrale

Alles überträgt sich auf drei Dimensionen. Über einem Quader zerfällt das Integral in drei gewöhnliche Integrale, etwa $\\iiint_{[0,1] \\times [0,2] \\times [0,3]} xyz\\,\\mathrm dV = \\frac12 \\cdot 2 \\cdot \\frac92 = \\frac92$. Mit $f = 1$ liefert das Dreifachintegral das Volumen.

> [!BEISPIEL] Tetraeder
> Das Gebiet $x, y, z \\ge 0$, $x + y + z \\le 1$ wird von außen nach innen beschrieben: $x$ von $0$ bis $1$; bei festem $x$ läuft $y$ von $0$ bis $1 - x$; bei festen $x, y$ läuft $z$ vom Boden $0$ bis zur Ebene $1 - x - y$:
> $$
> V = \\int_0^1\\!\\int_0^{1-x}\\!\\int_0^{1-x-y} 1\\,\\mathrm dz\\,\\mathrm dy\\,\\mathrm dx = \\int_0^1 \\frac{(1 - x)^2}{2}\\,\\mathrm dx = \\frac16 .
> $$

**[[Zylinderkoordinaten]]** ergänzen Polarkoordinaten um die Höhe: $x = r\\cos\\varphi$, $y = r\\sin\\varphi$, $z = z$ mit $\\mathrm dV = r\\,\\mathrm dr\\,\\mathrm d\\varphi\\,\\mathrm dz$. Das Volumen zwischen dem Paraboloid $z = x^2 + y^2$ und der Ebene $z = 4$ ist
$$
\\int_0^{2\\pi}\\!\\int_0^2\\!\\int_{r^2}^{4} r\\,\\mathrm dz\\,\\mathrm dr\\,\\mathrm d\\varphi = 2\\pi\\int_0^2 (4 - r^2)\\,r\\,\\mathrm dr = 2\\pi\\left[2r^2 - \\frac{r^4}{4}\\right]_0^2 = 8\\pi .
$$

> [!DEFINITION] Kugelkoordinaten (Konvention dieser Lektion)
> $$
> x = \\rho\\sin\\theta\\cos\\varphi, \\qquad y = \\rho\\sin\\theta\\sin\\varphi, \\qquad z = \\rho\\cos\\theta
> $$
> mit Abstand $\\rho \\ge 0$, **Polarwinkel** $\\theta \\in [0, \\pi]$ gemessen von der positiven $z$-Achse und **Azimut** $\\varphi \\in [0, 2\\pi)$ in der $xy$-Ebene (Physik-Konvention nach ISO 80000-2). Das Volumenelement ist
> $$
> \\mathrm dV = \\rho^2\\sin\\theta\\,\\mathrm d\\rho\\,\\mathrm d\\theta\\,\\mathrm d\\varphi .
> $$

Viele Mathematikbücher vertauschen die Namen $\\theta$ und $\\varphi$; vor jeder Rechnung mit **[[Kugelkoordinaten]]** sollte man deshalb nachsehen, welcher Winkel von der $z$-Achse aus gemessen wird. Anschaulich ist die Zelle ein fast quaderförmiges Stück mit den Kanten $\\Delta\\rho$ (nach außen), $\\rho\\,\\Delta\\theta$ (entlang eines Längenkreises) und $\\rho\\sin\\theta\\,\\Delta\\varphi$ (entlang eines Breitenkreises vom Radius $\\rho\\sin\\theta$). Die Kugel vom Radius $R$ hat das Volumen
$$
\\int_0^{2\\pi}\\!\\int_0^{\\pi}\\!\\int_0^R \\rho^2\\sin\\theta\\,\\mathrm d\\rho\\,\\mathrm d\\theta\\,\\mathrm d\\varphi = 2\\pi \\cdot 2 \\cdot \\frac{R^3}{3} = \\frac43\\pi R^3 ,
$$
und über die Einheitskugel ist $\\iiint (x^2 + y^2 + z^2)\\,\\mathrm dV = 4\\pi\\int_0^1 \\rho^4\\,\\mathrm d\\rho = \\frac{4\\pi}{5}$.

> [!MERKE] Warum die Volumenelemente verschieden sind
> In kartesischen Koordinaten sind alle Gitterzellen gleich groß, also $\\mathrm dV = \\mathrm dx\\,\\mathrm dy\\,\\mathrm dz$. In Zylinderkoordinaten werden Zellen mit wachsendem Abstand $r$ von der Achse breiter, in Kugelkoordinaten zusätzlich mit $\\rho$ in zwei Richtungen größer und zu den Polen hin ($\\sin\\theta \\to 0$) schmaler. Die Faktoren $1$, $r$ und $\\rho^2\\sin\\theta$ sind genau die Jacobi-Determinanten der drei Koordinatenabbildungen.

## Anwendungen

### Masse und Schwerpunkt

Hat eine Platte $D$ die Flächendichte $\\delta(x, y)$, so ist ihre Masse $M = \\iint_D \\delta\\,\\mathrm dA$ und ihr **[[Schwerpunkt]]**
$$
\\bar x = \\frac1M\\iint_D x\\,\\delta\\,\\mathrm dA, \\qquad \\bar y = \\frac1M\\iint_D y\\,\\delta\\,\\mathrm dA .
$$
Die obere Hälfte der Einheitskreisscheibe mit konstanter Dichte hat aus Symmetriegründen $\\bar x = 0$ und, in Polarkoordinaten, $\\iint y\\,\\mathrm dA = \\int_0^\\pi\\!\\int_0^1 r\\sin\\varphi \\cdot r\\,\\mathrm dr\\,\\mathrm d\\varphi = \\frac13 \\cdot 2 = \\frac23$; mit der Fläche $\\frac\\pi2$ folgt $\\bar y = \\frac{4}{3\\pi} \\approx 0{,}424$. Eine quadratische Platte $[0, 1]^2$ mit Dichte $\\delta = x + y$ hat die Masse $1$ und den Schwerpunkt $\\left(\\frac7{12}, \\frac7{12}\\right)$ – er ist zur schweren Ecke $(1, 1)$ hin verschoben. Das Trägheitsmoment einer Kreisscheibe um ihren Mittelpunkt, $\\iint r^2\\,\\mathrm dA = \\frac{\\pi R^4}{2} = \\frac12 M R^2$, bestimmt in Physik-Engines, wie schwer sich ein Rad andrehen lässt.

### Wahrscheinlichkeiten

Haben zwei [Zufallsvariablen](#/mathe/stochastik/zufallsvariablen) $X, Y$ eine gemeinsame Dichte $f(x, y) \\ge 0$ mit $\\iint f = 1$, dann ist
$$
P\\big((X, Y) \\in A\\big) = \\iint_A f(x, y)\\,\\mathrm dA, \\qquad \\mathbb E[g(X, Y)] = \\iint g(x, y)\\,f(x, y)\\,\\mathrm dA .
$$
Sind $X$ und $Y$ unabhängig und gleichverteilt auf $[0, 1]$, ist $f = 1$ auf dem Einheitsquadrat, und Wahrscheinlichkeiten sind Flächen: $P(X + Y \\le 1) = \\frac12$ (Dreieck) und $P(X^2 + Y^2 \\le 1) = \\frac\\pi4$ (Viertelkreis). Die zweite Gleichung ist das klassische Monte-Carlo-Verfahren zur Bestimmung von $\\pi$.

### Computergrafik und Physik

Die Helligkeit eines Pixels in einem Raytracer ist ein Integral über alle Einfallsrichtungen des Halbraums über der Oberfläche (die Rendering-Gleichung). Richtungen sind Punkte $(\\theta, \\varphi)$ der Einheitskugel, das Raumwinkelelement ist $\\mathrm d\\omega = \\sin\\theta\\,\\mathrm d\\theta\\,\\mathrm d\\varphi$. So ergibt sich $\\int_{\\text{Halbraum}} \\cos\\theta\\,\\mathrm d\\omega = 2\\pi\\int_0^{\\pi/2}\\cos\\theta\\sin\\theta\\,\\mathrm d\\theta = \\pi$ – der Grund für den Faktor $\\frac1\\pi$ im Lambert-Modell matter Oberflächen. Path Tracing schätzt diese Integrale mit Monte Carlo; Physik-Engines berechnen Masse, Schwerpunkt und Trägheitstensor eines Körpers als Volumenintegrale.

## Numerisch in mehreren Dimensionen

Die Regeln der [numerischen Integration](#/mathe/numerik/numerische-integration) übertragen sich als **Tensorprodukt**: Mit $n$ Punkten pro Achse braucht man in $d$ Dimensionen $N = n^d$ Funktionsauswertungen. Die Mittelpunktregel hat den Fehler $O(h^2) = O(N^{-2/d})$ – in einer Dimension mit $10^6$ Auswertungen etwa $10^{-12}$, in zwei Dimensionen $10^{-6}$, in zehn Dimensionen nur noch etwa $10^{-1}$. Dieser [[Fluch der Dimensionalität]] macht Gitterverfahren ab etwa fünf Dimensionen unbrauchbar.

Die **[[Monte-Carlo-Integration]]** zieht stattdessen $N$ zufällige Punkte und mittelt: Ihr Standardfehler ist $\\frac{\\sigma}{\\sqrt N}$, **unabhängig** von der Dimension. Für niedrige Dimensionen ist sie langsam, für hohe oft das einzige brauchbare Verfahren – von der Finanzmathematik bis zur Teilchenphysik.

\`\`\`python title="Doppelintegrale numerisch: SciPy und Monte Carlo"
import numpy as np
from scipy.integrate import dblquad

# ∫_0^1 ∫_0^x x·y dy dx – Achtung: dblquad erwartet f(y, x) und Grenzen der inneren Variablen als Funktionen
wert, fehler = dblquad(lambda y, x: x * y, 0, 1, lambda x: 0, lambda x: x)
print(wert)                        # 0.125

# Monte Carlo: Anteil der Punkte im Viertelkreis ≈ π/4
rng = np.random.default_rng(1)
N = 1_000_000
p = rng.random((N, 2))
drin = (p ** 2).sum(axis=1) <= 1
schaetzung = 4 * drin.mean()
standardfehler = 4 * drin.std() / np.sqrt(N)
print(schaetzung, standardfehler)   # etwa 3.14 ± 0.0016
\`\`\`

Gekrümmte Ränder sind auch für Gitter tückisch. Zählt man auf einem $n \\times n$-Gitter über $[-1, 1]^2$ alle Zellen, deren Mittelpunkt in der Einheitskreisscheibe liegt, erhält man für $n = 10, 20, 40, 80$ die Werte $3{,}20$; $3{,}16$; $3{,}16$; $3{,}14$ – die Treppenkante konvergiert unregelmäßig und langsam. In Polarkoordinaten ist dagegen jede Zelle exakt ein Ringsektor, und die Mittelpunktsumme $\\sum r_i\\,\\Delta r\\,\\Delta\\varphi$ liefert für jedes Gitter genau $\\pi$. Gute Koordinaten sind auch numerisch ein Gewinn.

## Typische Fehler

- **Faktor $r$ vergessen** beim Wechsel zu Polar- oder Zylinderkoordinaten, $\\rho^2\\sin\\theta$ bei Kugelkoordinaten.
- **Äußere Grenzen mit Variablen:** Nur die inneren Grenzen dürfen von den äußeren Variablen abhängen. $\\int_0^x\\!\\int_0^1 \\ldots\\,\\mathrm dy\\,\\mathrm dx$ ergibt keine Zahl.
- **Grenzen beim Tauschen einfach mitgetauscht:** Beim Wechsel der Reihenfolge muss das Gebiet neu beschrieben werden; $\\int_0^1\\!\\int_0^x \\ldots\\,\\mathrm dy\\,\\mathrm dx$ wird zu $\\int_0^1\\!\\int_y^1 \\ldots\\,\\mathrm dx\\,\\mathrm dy$, nicht zu $\\int_0^x\\!\\int_0^1 \\ldots$.
- **Vorzeichen der Jacobi-Determinante** übernommen statt ihres Betrags.
- **Winkelkonventionen** bei Kugelkoordinaten verwechselt.
- **Orientiertes Integral mit Volumen verwechselt**, wenn $f$ das Vorzeichen wechselt.
- **Ohne Prüfung vertauscht**, obwohl $\\iint \\abs f = \\infty$ ist – siehe das Gegenbeispiel zu Fubini.

\`\`\`widget
quiz:Mathe: Mehrfachintegrale 5
\`\`\`

## Zusammenfassung

- Das Doppelintegral ist der Grenzwert zweidimensionaler Riemann-Summen; für $f \\ge 0$ ein Volumen, sonst ein orientiertes Volumen.
- Fubini: Für stetige Funktionen auf Rechtecken und allgemein für absolut integrierbare Funktionen ist das Integral ein iteriertes Integral in beliebiger Reihenfolge. Tonelli: Für $f \\ge 0$ immer.
- Normalbereiche Typ I und II: innere Grenzen als Funktionen der äußeren Variablen, aus einer Skizze mit Ein- und Austrittskurve ablesen. Ein Reihenfolgentausch kann unlösbare innere Integrale lösbar machen.
- Transformationssatz: $\\mathrm d\\vec x = \\abs{\\det J_T}\\,\\mathrm d\\vec u$; Polar $r\\,\\mathrm dr\\,\\mathrm d\\varphi$, Zylinder $r\\,\\mathrm dr\\,\\mathrm d\\varphi\\,\\mathrm dz$, Kugel $\\rho^2\\sin\\theta\\,\\mathrm d\\rho\\,\\mathrm d\\theta\\,\\mathrm d\\varphi$.
- Anwendungen: Flächen, Volumen, Masse, Schwerpunkt, Trägheitsmoment, Wahrscheinlichkeiten, Erwartungswerte, Rendering.
- Numerisch: Gitterverfahren leiden unter dem Fluch der Dimensionalität, Monte Carlo konvergiert mit $\\frac{1}{\\sqrt N}$ unabhängig von der Dimension.
`;export{e as default};
