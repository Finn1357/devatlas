const e=`---
id: fourier-reihen
title: Fourier-Reihen
module: analysis-2
order: 6
difficulty: fortgeschritten
minutes: 75
summary: Periodische Funktionen als Überlagerung von Sinus- und Kosinusschwingungen – Orthogonalität, Fourier-Koeffizienten, Symmetrien, Rechteck, Sägezahn und Dreieck, Konvergenz und Gibbs-Phänomen, Parseval, komplexe Darstellung sowie der Weg zu DFT, FFT und Abtasttheorem.
tags: [Fourier-Reihe, Fourier-Koeffizient, Harmonische, Gibbs-Phänomen, Parseval, Frequenzspektrum, DFT, FFT, Aliasing]
requires: [integrationstechniken, komplexe-zahlen, orthogonalitaet]
---

## Schwingungen als Bausteine

Eine Funktion heißt **periodisch** mit Periode $T > 0$, wenn $f(t + T) = f(t)$ für alle $t$ gilt. Die **Frequenz** $f_0 = \\frac1T$ zählt die Perioden pro Sekunde (Hertz), die **Kreisfrequenz** $\\omega_0 = \\frac{2\\pi}{T}$ den Winkel pro Sekunde. Die einfachste periodische Funktion ist die Schwingung
$$
A\\sin(\\omega_0 t + \\varphi) = a\\cos(\\omega_0 t) + b\\sin(\\omega_0 t), \\qquad A = \\sqrt{a^2 + b^2},
$$
mit **Amplitude** $A$ und **Phase** $\\varphi$; die Umrechnung folgt aus dem Additionstheorem $\\sin(u + v) = \\sin u\\cos v + \\cos u\\sin v$ mit $a = A\\sin\\varphi$, $b = A\\cos\\varphi$.

Der Kammerton a′ ist eine Schwingung mit $440$ Hz. Eine Geige, die denselben Ton spielt, klingt trotzdem anders als eine Stimmgabel: Ihr Signal ist zwar ebenfalls periodisch mit $f_0 = 440$ Hz, enthält aber zusätzlich Schwingungen mit $880$, $1320$, $1760$ … Hz. Die Schwingung mit $f_0$ heißt **Grundschwingung**, die mit $n f_0$ heißen **[[Harmonische]]** oder Oberschwingungen. Ihr Mischungsverhältnis bestimmt die Klangfarbe.

Die Grundidee von Joseph Fourier (1807): **Jede** hinreichend vernünftige periodische Funktion lässt sich als Summe solcher Schwingungen schreiben. Statt den Verlauf $f(t)$ im **Zeitbereich** anzugeben, kann man ebenso gut die Liste der Amplituden und Phasen angeben – das **[[Frequenzspektrum]]** im **Frequenzbereich**. Das Signal $3\\sin(2\\pi \\cdot 50\\,t) + \\sin(2\\pi \\cdot 150\\,t)$ ist im Zeitbereich eine verbeulte Welle, im Frequenzbereich zwei Striche: Höhe $3$ bei der **[[Grundfrequenz]]** $50$ Hz und Höhe $1$ bei der dritten Harmonischen $150$ Hz.

Im Folgenden rechnen wir meist mit der Periode $2\\pi$, also $\\omega_0 = 1$; die allgemeine Periode folgt danach durch Umskalieren.

## Orthogonalität trigonometrischer Funktionen

Wie findet man heraus, wie viel einer bestimmten Schwingung in einer Funktion steckt? Dieselbe Frage stellt sich in der [linearen Algebra](#/mathe/lineare-algebra/orthogonalitaet): Ist $\\vec q_1, \\dots, \\vec q_n$ eine [[Orthonormalbasis]], so ist der Anteil von $\\vec q_k$ in $\\vec v$ einfach das Skalarprodukt $\\langle \\vec v, \\vec q_k\\rangle$. Für Funktionen auf $[-\\pi, \\pi]$ definiert man ein Skalarprodukt durch ein Integral:
$$
\\langle f, g\\rangle = \\frac1\\pi\\int_{-\\pi}^{\\pi} f(x)\\,g(x)\\,\\mathrm dx .
$$

> [!SATZ] Orthogonalitätsrelationen
> Für ganze Zahlen $m, n \\ge 1$ gilt
> $$
> \\frac1\\pi\\int_{-\\pi}^{\\pi} \\cos(mx)\\cos(nx)\\,\\mathrm dx = \\frac1\\pi\\int_{-\\pi}^{\\pi} \\sin(mx)\\sin(nx)\\,\\mathrm dx = \\begin{cases} 1 & m = n \\\\ 0 & m \\neq n \\end{cases}, \\qquad \\int_{-\\pi}^{\\pi} \\sin(mx)\\cos(nx)\\,\\mathrm dx = 0 .
> $$
> Außerdem ist $\\int_{-\\pi}^{\\pi} \\cos(nx)\\,\\mathrm dx = \\int_{-\\pi}^{\\pi} \\sin(nx)\\,\\mathrm dx = 0$ für $n \\ge 1$.

> [!BEWEIS]
> Mit $\\cos u\\cos v = \\frac12\\big(\\cos(u - v) + \\cos(u + v)\\big)$ wird das erste Integral zu $\\frac{1}{2\\pi}\\int_{-\\pi}^{\\pi} \\big(\\cos((m - n)x) + \\cos((m + n)x)\\big)\\,\\mathrm dx$. Über eine volle Periode integriert ergibt $\\cos(kx)$ für $k \\neq 0$ null, für $k = 0$ aber $2\\pi$. Bei $m \\neq n$ verschwinden also beide Summanden, bei $m = n$ bleibt $\\frac{1}{2\\pi} \\cdot 2\\pi = 1$. Die Sinusrelation folgt ebenso aus $\\sin u\\sin v = \\frac12\\big(\\cos(u - v) - \\cos(u + v)\\big)$. Das gemischte Integral verschwindet, weil $\\sin(mx)\\cos(nx)$ ungerade ist und über ein symmetrisches Intervall integriert wird.

Die Funktionen $\\frac{1}{\\sqrt2}, \\cos x, \\sin x, \\cos 2x, \\sin 2x, \\dots$ bilden also ein **[[Orthogonales Funktionensystem]]** – bezüglich dieses Skalarprodukts sogar ein orthonormales. Das ist der ganze Trick der Fourier-Analyse.

## Die Fourier-Reihe

> [!DEFINITION] Fourier-Koeffizienten und Fourier-Reihe (Periode 2π)
> Für eine $2\\pi$-periodische, über eine Periode integrierbare Funktion $f$ heißen
> $$
> a_n = \\frac1\\pi\\int_{-\\pi}^{\\pi} f(x)\\cos(nx)\\,\\mathrm dx \\quad (n \\ge 0), \\qquad b_n = \\frac1\\pi\\int_{-\\pi}^{\\pi} f(x)\\sin(nx)\\,\\mathrm dx \\quad (n \\ge 1)
> $$
> die **[[Fourier-Koeffizient]]en** von $f$ und
> $$
> f(x) \\sim \\frac{a_0}{2} + \\sum_{n=1}^{\\infty}\\big(a_n\\cos(nx) + b_n\\sin(nx)\\big)
> $$
> ihre **[[Fourier-Reihe]]**. Das Zeichen $\\sim$ sagt: Das ist die zu $f$ gehörende Reihe – ob und wo sie gegen $f$ konvergiert, ist eine eigene Frage.

**Herleitung.** Angenommen, $f$ ist bereits als solche Reihe gegeben und man darf gliedweise integrieren. Multipliziert man mit $\\cos(kx)$, $k \\ge 1$, und bildet $\\frac1\\pi\\int_{-\\pi}^{\\pi}$, verschwinden nach den Orthogonalitätsrelationen alle Summanden außer $a_k\\cos(kx)\\cos(kx)$, dessen Integral $a_k$ ergibt. Genauso liefert Multiplikation mit $\\sin(kx)$ den Koeffizienten $b_k$. Integriert man $f$ selbst, bleibt nur der konstante Term: $\\frac1\\pi\\int_{-\\pi}^{\\pi} f\\,\\mathrm dx = \\frac1\\pi \\cdot \\frac{a_0}{2} \\cdot 2\\pi = a_0$.

> [!MERKE] Konvention für den konstanten Term
> In dieser Lektion steht der konstante Term als $\\frac{a_0}{2}$. So gilt dieselbe Formel für $a_n$ auch bei $n = 0$, und $\\frac{a_0}{2} = \\frac{1}{2\\pi}\\int_{-\\pi}^{\\pi} f\\,\\mathrm dx$ ist genau der **Mittelwert** von $f$. Manche Bücher schreiben stattdessen $a_0$ als konstanten Term und definieren ihn mit $\\frac{1}{2\\pi}$ – vor dem Vergleich von Ergebnissen immer die Konvention prüfen, sonst entstehen Faktor-2-Fehler.

### Symmetrie spart Arbeit

> [!SATZ] Gerade und ungerade Funktionen
> - Ist $f$ **gerade** ($f(-x) = f(x)$), so ist $b_n = 0$ für alle $n$ und $a_n = \\frac2\\pi\\int_0^{\\pi} f(x)\\cos(nx)\\,\\mathrm dx$ – eine reine Kosinusreihe.
> - Ist $f$ **ungerade** ($f(-x) = -f(x)$), so ist $a_n = 0$ für alle $n$ und $b_n = \\frac2\\pi\\int_0^{\\pi} f(x)\\sin(nx)\\,\\mathrm dx$ – eine reine Sinusreihe.

Grund: Das Produkt aus gerader und ungerader Funktion ist ungerade, sein Integral über $[-\\pi, \\pi]$ also null; das Produkt zweier gerader oder zweier ungerader Funktionen ist gerade, sein Integral das Doppelte des Integrals über $[0, \\pi]$.

## Durchgerechnete Beispiele

> [!BEISPIEL] Trigonometrisches Polynom
> Für $f(x) = \\sin^2 x$ braucht man kein Integral: Nach $\\sin^2 x = \\frac12 - \\frac12\\cos(2x)$ ist das schon eine Fourier-Reihe mit $\\frac{a_0}{2} = \\frac12$, also $a_0 = 1$, $a_2 = -\\frac12$, alle anderen Koeffizienten $0$. Weil die Koeffizienten eindeutig sind, ist jedes trigonometrische Polynom seine eigene Fourier-Reihe.

> [!BEISPIEL] Rechtecksignal
> $f(x) = -1$ auf $(-\\pi, 0)$ und $f(x) = 1$ auf $(0, \\pi)$, $2\\pi$-periodisch fortgesetzt. $f$ ist ungerade, also $a_n = 0$ und
> $$
> b_n = \\frac2\\pi\\int_0^\\pi \\sin(nx)\\,\\mathrm dx = \\frac{2}{n\\pi}\\big(1 - \\cos(n\\pi)\\big) = \\frac{2}{n\\pi}\\big(1 - (-1)^n\\big) = \\begin{cases} \\frac{4}{n\\pi} & n \\text{ ungerade} \\\\ 0 & n \\text{ gerade} \\end{cases}
> $$
> $$
> f(x) \\sim \\frac4\\pi\\left(\\sin x + \\frac{\\sin 3x}{3} + \\frac{\\sin 5x}{5} + \\dots\\right) .
> $$
> Gerade Harmonische fehlen, weil das Signal zusätzlich **halbwellensymmetrisch** ist: $f(x + \\pi) = -f(x)$. Bei $x = \\frac\\pi2$ steht links $1$, rechts $\\frac4\\pi\\left(1 - \\frac13 + \\frac15 - \\dots\\right)$ – das liefert die Leibniz-Reihe $1 - \\frac13 + \\frac15 - \\dots = \\frac\\pi4$.

> [!BEISPIEL] Sägezahn
> $f(x) = x$ auf $(-\\pi, \\pi)$, periodisch fortgesetzt. Wieder ungerade, also $a_n = 0$; partielle Integration gibt
> $$
> b_n = \\frac2\\pi\\int_0^\\pi x\\sin(nx)\\,\\mathrm dx = \\frac2\\pi\\left[-\\frac{x\\cos(nx)}{n} + \\frac{\\sin(nx)}{n^2}\\right]_0^\\pi = -\\frac{2\\cos(n\\pi)}{n} = \\frac{2(-1)^{n+1}}{n} ,
> $$
> $$
> x \\sim 2\\left(\\sin x - \\frac{\\sin 2x}{2} + \\frac{\\sin 3x}{3} - \\dots\\right) \\quad\\text{auf } (-\\pi, \\pi) .
> $$
> Hier kommen alle Harmonischen vor; die Koeffizienten fallen wie $\\frac1n$ – langsam, weil $f$ bei $\\pm\\pi$ springt.

> [!BEISPIEL] Dreieck
> $f(x) = \\abs x$ auf $[-\\pi, \\pi]$ ist gerade, also $b_n = 0$. $a_0 = \\frac2\\pi\\int_0^\\pi x\\,\\mathrm dx = \\pi$, und für $n \\ge 1$
> $$
> a_n = \\frac2\\pi\\int_0^\\pi x\\cos(nx)\\,\\mathrm dx = \\frac2\\pi\\left[\\frac{x\\sin(nx)}{n} + \\frac{\\cos(nx)}{n^2}\\right]_0^\\pi = \\frac{2\\big((-1)^n - 1\\big)}{\\pi n^2} = \\begin{cases} -\\frac{4}{\\pi n^2} & n \\text{ ungerade} \\\\ 0 & n \\text{ gerade} \\end{cases}
> $$
> $$
> \\abs x \\sim \\frac\\pi2 - \\frac4\\pi\\left(\\cos x + \\frac{\\cos 3x}{9} + \\frac{\\cos 5x}{25} + \\dots\\right) .
> $$
> Die periodische Fortsetzung ist stetig, nur geknickt – die Koeffizienten fallen wie $\\frac{1}{n^2}$, und die Reihe konvergiert schnell. Bei $x = 0$ folgt $\\frac{\\pi^2}{8} = 1 + \\frac19 + \\frac1{25} + \\dots$

> [!BEISPIEL] Periodische Fortsetzung von x²
> $f(x) = x^2$ auf $[-\\pi, \\pi]$ wird ohne Sprung fortgesetzt, weil $f(-\\pi) = f(\\pi)$. Es ist gerade, $a_0 = \\frac2\\pi\\int_0^\\pi x^2\\,\\mathrm dx = \\frac{2\\pi^2}{3}$, und mit zweimaliger partieller Integration $a_n = \\frac{4(-1)^n}{n^2}$:
> $$
> x^2 \\sim \\frac{\\pi^2}{3} + 4\\sum_{n=1}^\\infty \\frac{(-1)^n}{n^2}\\cos(nx) .
> $$
> Bei $x = \\pi$ ist $\\cos(n\\pi) = (-1)^n$, also $\\pi^2 = \\frac{\\pi^2}{3} + 4\\sum \\frac{1}{n^2}$ und damit $\\sum_{n=1}^\\infty \\frac1{n^2} = \\frac{\\pi^2}{6}$ – das Basler Problem, gelöst mit einer Fourier-Reihe.

### Allgemeine Periodenlänge

Für eine Funktion mit Periode $T$ und $\\omega_0 = \\frac{2\\pi}{T}$ lautet alles gleich, nur umskaliert:
$$
f(t) \\sim \\frac{a_0}{2} + \\sum_{n=1}^\\infty \\big(a_n\\cos(n\\omega_0 t) + b_n\\sin(n\\omega_0 t)\\big), \\qquad a_n = \\frac2T\\int_0^T f(t)\\cos(n\\omega_0 t)\\,\\mathrm dt, \\quad b_n = \\frac2T\\int_0^T f(t)\\sin(n\\omega_0 t)\\,\\mathrm dt .
$$
Integriert wird über ein beliebiges Intervall der Länge $T$. Die $n$-te Harmonische hat die Frequenz $\\frac nT$.

> [!BEISPIEL] Sägezahn mit Periode 1
> $f(t) = t$ auf $(0, 1)$, periodisch mit $T = 1$, $\\omega_0 = 2\\pi$. Dann $a_0 = 2\\int_0^1 t\\,\\mathrm dt = 1$, $a_n = 2\\int_0^1 t\\cos(2\\pi nt)\\,\\mathrm dt = 0$ und $b_n = 2\\int_0^1 t\\sin(2\\pi nt)\\,\\mathrm dt = -\\frac{1}{\\pi n}$:
> $$
> f(t) \\sim \\frac12 - \\frac1\\pi\\sum_{n=1}^\\infty \\frac{\\sin(2\\pi n t)}{n} .
> $$
> Der Mittelwert $\\frac12$ erscheint als konstanter Term $\\frac{a_0}{2}$, nicht als $a_0$.

## Konvergenz und Gibbs-Phänomen

Die **Partialsumme** $S_N(x) = \\frac{a_0}{2} + \\sum_{n=1}^N \\big(a_n\\cos(nx) + b_n\\sin(nx)\\big)$ ist die Näherung mit den ersten $N$ Harmonischen. Wann gilt $S_N(x) \\to f(x)$?

> [!SATZ] Satz von Dirichlet (hinreichende Bedingung)
> Ist $f$ $2\\pi$-periodisch und stückweise stetig differenzierbar (endlich viele Sprünge und Knicke pro Periode), so konvergiert die Fourier-Reihe in **jedem** Punkt, und zwar gegen
> $$
> \\frac{f(x^+) + f(x^-)}{2},
> $$
> den Mittelwert der einseitigen Grenzwerte. An Stetigkeitsstellen ist das $f(x)$. Ist $f$ zusätzlich überall stetig, konvergiert die Reihe sogar **gleichmäßig**.

Beim Rechtecksignal liefert die Reihe an der Sprungstelle $x = 0$ den Wert $\\frac{1 + (-1)}{2} = 0$ – und tatsächlich ist dort jeder Summand $\\sin(0) = 0$. Beim Sägezahn konvergiert die Reihe bei $x = \\pi$ gegen $\\frac{\\pi + (-\\pi)}{2} = 0$, nicht gegen $\\pi$.

> [!WARNING] Keine pauschale Konvergenz
> Stetigkeit allein genügt nicht: Es gibt stetige periodische Funktionen, deren Fourier-Reihe an einzelnen Punkten divergiert (du Bois-Reymond, 1873). Positiv ist dagegen: Für jede über eine Periode quadratintegrierbare Funktion konvergiert die Fourier-Reihe im **quadratischen Mittel**, $\\int_{-\\pi}^{\\pi} (f - S_N)^2\\,\\mathrm dx \\to 0$. Und die arithmetischen Mittel der Partialsummen (Fejér-Mittel) konvergieren für jede stetige periodische Funktion gleichmäßig.

### Das Gibbs-Phänomen

Nahe einer Sprungstelle schießen die Partialsummen über. Beim Rechtecksignal (Sprung von $-1$ auf $1$, Höhe $2$):

| höchste Harmonische $N$ | $1$ | $5$ | $9$ | $25$ | $49$ |
|---|---|---|---|---|---|
| Maximum von $S_N$ | $1{,}2732$ | $1{,}1884$ | $1{,}1823$ | $1{,}1795$ | $1{,}1791$ |
| Lage des ersten Maximums | $1{,}571$ | $0{,}524$ | $0{,}314$ | $0{,}121$ | $0{,}063$ |

Das erste Maximum liegt bei $x = \\frac{\\pi}{N + 1}$ und wandert zur Sprungstelle; die Überschwingzone wird also beliebig **schmal**. Ihre **Höhe** verschwindet aber nicht, sondern strebt gegen
$$
\\frac2\\pi\\,\\mathrm{Si}(\\pi) = \\frac2\\pi\\int_0^\\pi \\frac{\\sin t}{t}\\,\\mathrm dt \\approx 1{,}17898 ,
$$
also rund $9\\,\\%$ der Sprunghöhe über dem Zielwert. Das ist das **[[Gibbs-Phänomen]]**. Es widerspricht der punktweisen Konvergenz nicht – an jedem festen Punkt $x \\neq 0$ liegt das Maximum irgendwann links von $x$ –, zeigt aber, dass die Konvergenz nahe Sprüngen nicht gleichmäßig ist. In der Praxis erscheint es als „Ringing“: Säume um scharfe Kanten in stark komprimierten JPEG-Bildern oder Vorschwinger bei steil gefilterten Audiosignalen. Im [Fourier-Labor](#/mathe/labor/fourier?signal=rechteck) lässt sich das Überschwingen für jede Zahl von Harmonischen messen.

## Energie und beste Approximation

> [!SATZ] Parseval-Identität
> Ist $f$ über eine Periode quadratintegrierbar, so gilt
> $$
> \\frac1\\pi\\int_{-\\pi}^{\\pi} f(x)^2\\,\\mathrm dx = \\frac{a_0^2}{2} + \\sum_{n=1}^\\infty \\big(a_n^2 + b_n^2\\big) .
> $$

Für eine endliche Summe ist das der Satz des Pythagoras in einem Orthonormalsystem: Quadriert man $S_N$ und integriert, fallen nach den Orthogonalitätsrelationen alle gemischten Produkte weg. Die volle Aussage braucht zusätzlich die Konvergenz im quadratischen Mittel. Physikalisch: Die **mittlere Leistung** $\\frac{1}{2\\pi}\\int f^2$ eines Signals ist die Summe der Leistungen seiner Harmonischen, $\\frac{a_n^2 + b_n^2}{2}$ je Harmonische.

> [!BEISPIEL] Basler Problem und Energieanteile
> Sägezahn $x$: links $\\frac1\\pi\\int_{-\\pi}^{\\pi} x^2\\,\\mathrm dx = \\frac{2\\pi^2}{3}$, rechts $\\sum \\frac{4}{n^2}$. Also $\\sum \\frac{1}{n^2} = \\frac{\\pi^2}{6}$ – zum zweiten Mal, diesmal aus Parseval.
>
> Rechteck: links $2$, rechts $\\frac{16}{\\pi^2}\\sum_{n \\text{ ungerade}} \\frac{1}{n^2}$. Die erste Harmonische trägt $\\frac{16}{\\pi^2} / 2 = \\frac{8}{\\pi^2} \\approx 81{,}1\\,\\%$ der Energie, bis $N = 5$ sind es $93{,}3\\,\\%$, bis $N = 19$ $98{,}0\\,\\%$, bis $N = 99$ $99{,}6\\,\\%$. Der Effektivwert des Fehlers fällt dabei von $0{,}435$ auf $0{,}064$ – trotz des unverändert hohen Gibbs-Überschwingers.

> [!SATZ] Beste Approximation im quadratischen Mittel
> Unter allen trigonometrischen Polynomen vom Grad höchstens $N$ minimiert die Partialsumme $S_N$ den mittleren quadratischen Fehler $\\int_{-\\pi}^{\\pi}(f - p)^2\\,\\mathrm dx$. Der verbleibende Fehler ist
> $$
> \\frac1\\pi\\int_{-\\pi}^{\\pi}(f - S_N)^2\\,\\mathrm dx = \\frac1\\pi\\int_{-\\pi}^{\\pi} f^2\\,\\mathrm dx - \\frac{a_0^2}{2} - \\sum_{n=1}^N \\big(a_n^2 + b_n^2\\big) \\ge 0 .
> $$

$S_N$ ist also die **orthogonale Projektion** von $f$ auf den Raum der trigonometrischen Polynome vom Grad $\\le N$ – dieselbe Idee wie bei der [linearen Regression](#/mathe/optimierung/regression) und der QR-Zerlegung, nur in einem Funktionenraum. Die Ungleichung rechts heißt Besselsche Ungleichung; sie zeigt nebenbei, dass $a_n, b_n \\to 0$.

## Komplexe Fourier-Reihe

Mit der Euler-Formel $\\e^{\\mathrm i x} = \\cos x + \\mathrm i\\sin x$ ([komplexe Zahlen](#/mathe/algebra/komplexe-zahlen)) ist $\\cos(nx) = \\frac{\\e^{\\mathrm inx} + \\e^{-\\mathrm inx}}{2}$ und $\\sin(nx) = \\frac{\\e^{\\mathrm inx} - \\e^{-\\mathrm inx}}{2\\mathrm i}$. Sortiert man die Reihe nach $\\e^{\\mathrm inx}$, entsteht eine kompaktere Form.

> [!DEFINITION] Komplexe Fourier-Reihe
> $$
> f(x) \\sim \\sum_{n=-\\infty}^{\\infty} c_n\\,\\e^{\\mathrm inx}, \\qquad c_n = \\frac{1}{2\\pi}\\int_{-\\pi}^{\\pi} f(x)\\,\\e^{-\\mathrm inx}\\,\\mathrm dx .
> $$
> Zusammenhang mit der reellen Form: $c_0 = \\frac{a_0}{2}$, $c_n = \\frac{a_n - \\mathrm i\\,b_n}{2}$, $c_{-n} = \\frac{a_n + \\mathrm i\\,b_n}{2}$ für $n \\ge 1$. Umgekehrt $a_n = c_n + c_{-n}$ und $b_n = \\mathrm i\\,(c_n - c_{-n})$. Für reelles $f$ ist $c_{-n} = \\overline{c_n}$.

Die Funktionen $\\e^{\\mathrm inx}$ sind orthonormal bezüglich $\\frac{1}{2\\pi}\\int f\\,\\overline g$, und Parseval lautet $\\frac{1}{2\\pi}\\int_{-\\pi}^{\\pi}\\abs{f}^2\\,\\mathrm dx = \\sum_{n} \\abs{c_n}^2$. Beim Rechtecksignal ist $c_n = -\\frac{2\\mathrm i}{n\\pi}$ für ungerade $n > 0$, $c_{-n} = \\frac{2\\mathrm i}{n\\pi}$ und sonst $0$; probe: $\\sum \\abs{c_n}^2 = 2 \\cdot \\frac{4}{\\pi^2}\\cdot\\frac{\\pi^2}{8} = 1 = \\frac{1}{2\\pi}\\int 1\\,\\mathrm dx$. Das **zweiseitige Spektrum** $\\abs{c_n}$ verteilt jede Amplitude $A_n = \\sqrt{a_n^2 + b_n^2}$ je zur Hälfte auf $n$ und $-n$: $\\abs{c_n} = \\frac{A_n}{2}$. In der Signalverarbeitung ist die komplexe Form Standard, weil Verschiebungen zu Phasenfaktoren und Ableitungen zu Faktoren $\\mathrm in$ werden.

## Von der Reihe zu DFT und FFT

Fourier-Reihen gehören zu **periodischen** Funktionen und liefern ein diskretes Spektrum (Vielfache von $f_0$). Drei verwandte Werkzeuge werden oft verwechselt:

| Werkzeug | Eingabe | Ausgabe |
|---|---|---|
| Fourier-Reihe | periodische Funktion | Koeffizienten $c_n$ zu den Frequenzen $\\frac nT$ |
| [[Fourier-Transformation]] | nichtperiodische Funktion auf $\\R$ | kontinuierliches Spektrum $\\hat f(\\omega) = \\int f(t)\\,\\e^{-\\mathrm i\\omega t}\\,\\mathrm dt$ |
| [[Diskrete Fourier-Transformation]] (DFT) | $M$ Abtastwerte $x_0, \\dots, x_{M-1}$ | $M$ Werte $X_k = \\sum_{m=0}^{M-1} x_m\\,\\e^{-2\\pi\\mathrm i\\,km/M}$ |
| [[FFT]] | wie DFT | dasselbe Ergebnis, berechnet in $O(M\\log M)$ statt $O(M^2)$ Schritten |

Die Fourier-Transformation entsteht anschaulich als Grenzfall $T \\to \\infty$: Die Frequenzen $\\frac nT$ rücken immer dichter zusammen, aus der Summe wird ein Integral. Die DFT ist das, was ein Computer tatsächlich rechnet. Tastet man **eine** Periode einer Funktion an $M$ gleichabständigen Punkten ab, so ist $\\frac{X_k}{M}$ die Trapezregel für $c_k$ – exakt für trigonometrische Polynome vom Grad kleiner $\\frac M2$, sonst eine Näherung. Die FFT (Cooley und Tukey, 1965) ist kein neues Transformationskonzept, sondern ein Algorithmus, der die DFT durch rekursives Halbieren berechnet. Bei $M = 2^{20}$ Werten spart das etwa den Faktor $50\\,000$. Fourier-Transformation und FFT verdienen eine eigene Lektion; hier geht es um die Verbindung.

### Abtastung und Aliasing (Ausblick)

Wer ein Signal nur zu den Zeitpunkten $\\frac{m}{f_s}$ kennt, kann Frequenzen nicht beliebig unterscheiden: Wegen $\\e^{2\\pi\\mathrm i(f + f_s)m/f_s} = \\e^{2\\pi\\mathrm i f m/f_s}$ sind $f$ und $f + f_s$ an allen Abtastpunkten gleich. Eine zu hohe Frequenz erscheint deshalb als falsche, niedrigere Frequenz – **[[Aliasing]]**. Ein reeller Ton mit $7000$ Hz, abgetastet mit $f_s = 8000$ Hz, ist von einem Ton mit $1000$ Hz nicht zu unterscheiden. Das **Abtasttheorem** von Nyquist und Shannon besagt in einer gängigen Form: Enthält ein Signal nur Frequenzen **unterhalb** von $B$, so ist es durch Abtastwerte mit $f_s > 2B$ eindeutig bestimmt und rekonstruierbar. Deshalb arbeiten Audio-CDs mit $44{,}1$ kHz für einen Hörbereich bis etwa $20$ kHz, und vor jedem Analog-Digital-Wandler sitzt ein Tiefpassfilter, das höhere Frequenzen vorher entfernt.

## Anwendungen in der Informatik

- **Audio:** Equalizer verstärken oder dämpfen Frequenzbänder; Filter multiplizieren das Spektrum mit einer Kennlinie. Stimmgeräte und Spektrogramme (Eingabe vieler Spracherkenner) beruhen auf FFTs kurzer Signalabschnitte.
- **Kompression:** MP3 und AAC zerlegen Audio mit einer verwandten Kosinustransformation (MDCT) und speichern leise, schlecht hörbare Anteile gröber. JPEG transformiert $8 \\times 8$-Pixelblöcke mit der diskreten Kosinustransformation und quantisiert hohe Frequenzen stark – daher das Ringing an Kanten.
- **Bildverarbeitung:** Weichzeichnen ist ein Tiefpass, Kantenbetonung ein Hochpass; große Faltungen rechnet man über die FFT schneller.
- **Numerik:** Spektralmethoden lösen Differentialgleichungen im Frequenzbereich. Für die Wärmeleitungsgleichung $u_t = u_{xx}$ auf einem Ring klingt die $n$-te Harmonische wie $\\e^{-n^2 t}$ ab – genau mit dieser Rechnung hat Fourier seine Reihen erfunden. Polynommultiplikation großer Zahlen gelingt mit der FFT in $O(n\\log n)$.
- **Datenanalyse:** Wochen- und Tageszyklen in Zeitreihen (Serverlast, Verkäufe) zeigen sich als Spitzen im Spektrum.

## Programmieren

\`\`\`python title="Partialsummen, Fehler und Koeffizienten"
import numpy as np

def rechteck_partialsumme(x, N):
    s = np.zeros_like(x)
    for n in range(1, N + 1, 2):              # nur ungerade Harmonische
        s += 4 / (np.pi * n) * np.sin(n * x)
    return s

x = np.linspace(-np.pi, np.pi, 2001)
f = np.sign(x)
for N in (1, 5, 25, 125):
    S = rechteck_partialsumme(x, N)
    rms = np.sqrt(np.mean((f - S) ** 2))
    print(N, round(S.max(), 4), round(rms, 4))
# 1 1.2732 0.4351
# 5 1.1884 0.2587
# 25 1.1793 0.1249     ← Maximum bleibt nahe 1.179 (Gibbs), der Fehler sinkt
# 125 1.1789 0.0574

def koeffizienten(f, n, M=4096):
    """a_n, b_n numerisch mit der Mittelpunktregel über eine Periode."""
    x = -np.pi + (np.arange(M) + 0.5) * 2 * np.pi / M
    return 2 * np.mean(f(x) * np.cos(n * x)), 2 * np.mean(f(x) * np.sin(n * x))

print(koeffizienten(lambda x: x, 3))   # ≈ (0.0, 0.6667) – exakt b_3 = 2/3

# Frequenzanalyse: zwei Töne, eine Sekunde mit 1000 Hz abgetastet
fs = 1000
t = np.arange(fs) / fs
signal = np.sin(2 * np.pi * 50 * t) + 0.5 * np.sin(2 * np.pi * 120 * t)
X = np.fft.rfft(signal)
amplitude = 2 * np.abs(X) / len(signal)    # einseitiges Amplitudenspektrum
freq = np.fft.rfftfreq(len(signal), 1 / fs)
print(freq[amplitude > 0.1], amplitude[amplitude > 0.1].round(3))   # [ 50. 120.] [1.  0.5]
\`\`\`

\`\`\`javascript title="Partialsumme im Browser"
// Sägezahn x auf (−π, π): b_n = 2·(−1)^(n+1)/n
const saegezahn = (x, N) => {
  let s = 0;
  for (let n = 1; n <= N; n++) s += (2 * (n % 2 ? 1 : -1) / n) * Math.sin(n * x);
  return s;
};
console.log(saegezahn(Math.PI / 2, 1000)); // 1.5698…, nahe π/2 ≈ 1.5708 (Fehler ≈ 1/N)
\`\`\`

## Typische Fehler

- **$a_0$ statt $\\frac{a_0}{2}$** als konstanten Term verwendet – oder umgekehrt bei einer anderen Konvention.
- **Falscher Vorfaktor** bei allgemeiner Periode: $\\frac2T$ statt $\\frac1\\pi$, und $n\\omega_0$ statt $n$ im Argument.
- **Über das falsche Intervall integriert**, etwa über eine halbe Periode ohne Symmetrieargument.
- **Funktion und Fortsetzung verwechselt:** Die Reihe von $x$ auf $(-\\pi, \\pi)$ beschreibt einen Sägezahn und springt bei $\\pm\\pi$.
- **Wert an der Sprungstelle** als $f(x)$ statt als Mittelwert der einseitigen Grenzwerte angegeben.
- **Gibbs falsch gedeutet:** Das Überschwingen bedeutet nicht, dass die Reihe divergiert; es wird schmaler, aber nicht niedriger.
- **DFT-Skalierung vergessen:** Amplituden erhält man erst nach Division durch $M$ (und Faktor $2$ im einseitigen Spektrum).

\`\`\`widget
quiz:Mathe: Fourier-Reihen 5
\`\`\`

## Zusammenfassung

- Periodische Signale sind Überlagerungen von Harmonischen mit Frequenzen $\\frac nT$; Amplitude $A_n = \\sqrt{a_n^2 + b_n^2}$.
- Sinus und Kosinus sind orthogonal; daraus folgen $a_n = \\frac1\\pi\\int f\\cos(nx)$, $b_n = \\frac1\\pi\\int f\\sin(nx)$, konstanter Term $\\frac{a_0}{2}$ = Mittelwert.
- Gerade Funktionen haben Kosinus-, ungerade Sinusreihen. Rechteck: $\\frac{4}{n\\pi}$ für ungerade $n$; Sägezahn $x$: $\\frac{2(-1)^{n+1}}{n}$; Dreieck $\\abs x$: $-\\frac{4}{\\pi n^2}$ für ungerade $n$.
- Dirichlet: Bei stückweise glatten Funktionen Konvergenz gegen $\\frac{f(x^+) + f(x^-)}{2}$. Gibbs: rund $9\\,\\%$ Überschwingen der Sprunghöhe, das schmaler, aber nicht niedriger wird.
- Parseval: Energie $=$ Summe der Koeffizientenquadrate; $S_N$ ist die beste Approximation im quadratischen Mittel (orthogonale Projektion).
- Komplex: $c_n = \\frac{a_n - \\mathrm i b_n}{2}$. Fourier-Transformation für nichtperiodische Funktionen, DFT für Abtastwerte, FFT als schneller Algorithmus; Abtastung braucht $f_s > 2B$.
`;export{e as default};
