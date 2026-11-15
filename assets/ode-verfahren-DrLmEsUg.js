const e=`---
id: ode-verfahren
title: Differentialgleichungen numerisch lösen
module: numerik
order: 6
difficulty: fortgeschritten
minutes: 50
summary: Einschrittverfahren für Anfangswertprobleme – Euler, Heun und klassisches Runge-Kutta, lokaler und globaler Fehler, Konvergenzordnung, Stabilität und steife Probleme, implizite und symplektische Verfahren sowie Schrittweitensteuerung.
tags: [Differentialgleichung, Euler-Verfahren, Heun-Verfahren, Runge-Kutta, Konvergenzordnung, Stabilität, Steife Probleme]
requires: [differentialgleichungen, numerische-integration, taylor]
---

## Vom Richtungsfeld zur Zahlenfolge

Eine [[Differentialgleichung]] beschreibt, wie sich ein Zustand ändert: Position und Geschwindigkeit eines Körpers, Ladung eines Kondensators, Zahl der Infizierten in einer Epidemie. Ein **Anfangswertproblem** fragt nach der Lösung zu einem bekannten Startwert:
$$
y'(t) = f\\big(t, y(t)\\big), \\qquad y(t_0) = y_0 .
$$
Ist $f$ stetig und in $y$ Lipschitz-stetig, gibt es nach dem Satz von Picard-Lindelöf genau eine Lösung (siehe [Gewöhnliche Differentialgleichungen](#/mathe/analysis-2/differentialgleichungen)). Eine Formel für sie gibt es aber fast nie. Numerische Verfahren berechnen stattdessen Näherungen $y_k \\approx y(t_k)$ auf einem Gitter $t_k = t_0 + kh$ mit **Schrittweite** $h$. Dabei darf $y$ auch ein Vektor sein – jedes System und jede Gleichung höherer Ordnung lässt sich so schreiben.

Diese Lektion vertieft das Euler-Verfahren aus der Analysis-Lektion: Warum ist es so ungenau, wie macht man es besser, und warum explodieren manche Rechnungen trotz winziger Schritte?

## Einschrittverfahren

Alle Verfahren dieser Lektion berechnen $y_{k+1}$ nur aus $y_k$ und einigen Auswertungen von $f$ – daher der Name **Einschrittverfahren**.

> [!DEFINITION] Euler, Heun und Runge-Kutta
> - **Explizites Euler-Verfahren:** $y_{k+1} = y_k + h\\,f(t_k, y_k)$.
> - **Heun-Verfahren:** $k_1 = f(t_k, y_k)$, $k_2 = f(t_k + h,\\ y_k + h k_1)$, $y_{k+1} = y_k + \\frac h2 (k_1 + k_2)$.
> - **Klassisches [[Runge-Kutta-Verfahren]] (RK4):**
> $$
> \\begin{aligned}
> k_1 &= f(t_k, y_k), & k_2 &= f\\big(t_k + \\tfrac h2,\\ y_k + \\tfrac h2 k_1\\big),\\\\
> k_3 &= f\\big(t_k + \\tfrac h2,\\ y_k + \\tfrac h2 k_2\\big), & k_4 &= f(t_k + h,\\ y_k + h k_3),
> \\end{aligned}
> $$
> $$
> y_{k+1} = y_k + \\frac h6\\,(k_1 + 2k_2 + 2k_3 + k_4) .
> $$

Euler folgt der Tangente im Startpunkt. Heun macht erst einen Euler-Schritt als Probe, misst dort die Steigung noch einmal und geht mit dem Mittelwert beider Steigungen. RK4 mittelt vier Steigungen, die beiden aus der Intervallmitte doppelt gewichtet.

> [!MERKE] Verwandtschaft mit der Quadratur
> Hängt $f$ nur von $t$ ab, ist $y(t_{k+1}) = y(t_k) + \\int_{t_k}^{t_{k+1}} f(t)\\,\\mathrm dt$ ein Integral. Dann wird Euler zur linken Riemann-Summe, Heun zur Trapezregel und RK4 wegen $k_2 = k_3$ zur Simpsonregel – mit denselben Ordnungen $1$, $2$ und $4$ wie in der [numerischen Integration](#/mathe/numerik/numerische-integration). Im Labor [Riemann-Summen & Quadratur](#/mathe/labor/integration) lässt sich das direkt nachmessen.

> [!BEISPIEL] Ein Schritt von Hand
> Für $y' = t + y$, $y(0) = 1$ und $h = 0{,}1$:
> - Euler: $y_1 = 1 + 0{,}1 \\cdot (0 + 1) = 1{,}1$.
> - Heun: $k_1 = 1$, Probe $1{,}1$ bei $t = 0{,}1$, also $k_2 = 0{,}1 + 1{,}1 = 1{,}2$ und $y_1 = 1 + 0{,}05 \\cdot 2{,}2 = 1{,}11$.
>
> Die exakte Lösung ist $y(t) = 2\\e^t - t - 1$ mit $y(0{,}1) = 1{,}110342$. Euler liegt um $0{,}0103$ daneben, Heun nur um $0{,}00034$.

## Lokaler und globaler Fehler

Zwei Fehlerbegriffe sind zu unterscheiden. Der **lokale Fehler** ist der Fehler eines einzelnen Schritts, wenn man auf der exakten Lösung startet. Der **globale Fehler** $\\abs{y_n - y(T)}$ am Ende eines Intervalls $[t_0, T]$ sammelt die lokalen Fehler aller $n = \\frac{T - t_0}{h}$ Schritte – und deren Fortpflanzung.

> [!DEFINITION] Konsistenz- und Konvergenzordnung
> Ein Verfahren hat **Konsistenzordnung** $p$, wenn der lokale Fehler für glattes $f$ durch $C h^{p+1}$ beschränkt ist. Es hat **Konvergenzordnung** $p$, wenn der globale Fehler auf einem festen Intervall durch $C h^p$ beschränkt ist.

> [!SATZ] Konvergenz von Einschrittverfahren
> Ist $f$ in $y$ Lipschitz-stetig mit Konstante $L$ und hat ein Einschrittverfahren Konsistenzordnung $p$, so hat es auch Konvergenzordnung $p$:
> $$
> \\abs{y_n - y(T)} \\le \\frac{C h^p}{L}\\left(\\e^{L(T - t_0)} - 1\\right) .
> $$
> Euler hat Ordnung $1$, Heun Ordnung $2$, RK4 Ordnung $4$.

> [!BEWEIS]
> Für Euler: Nach [Taylor](#/mathe/analysis-1/taylor) ist $y(t + h) = y(t) + h\\,y'(t) + \\frac{h^2}2 y''(\\xi)$, der lokale Fehler also höchstens $\\frac{h^2}{2}\\max\\abs{y''}$ – Konsistenzordnung $1$. Allgemein gilt für den globalen Fehler $e_k$ wegen der Lipschitz-Bedingung $e_{k+1} \\le (1 + hL)\\,e_k + C h^{p+1}$: Der alte Fehler wird pro Schritt höchstens um den Faktor $1 + hL \\le \\e^{hL}$ verstärkt, und ein neuer lokaler Fehler kommt hinzu. Summiert man die geometrische Reihe über $n$ Schritte, entsteht die Schranke. Aus $n \\propto \\frac 1h$ lokalen Fehlern der Größe $h^{p+1}$ wird ein globaler Fehler der Größe $h^p$.

Die Ordnung sagt, was eine kleinere Schrittweite bringt: Halbiert man $h$, sinkt der Fehler bei Euler etwa auf die Hälfte, bei Heun auf ein Viertel, bei RK4 auf ein Sechzehntel.

> [!BEISPIEL] Fehler für y' = y auf [0, 1]
> Gesucht ist $y(1) = \\e \\approx 2{,}718282$.
>
> | $n$ | Euler | Heun | RK4 |
> |---|---|---|---|
> | $10$ | $1{,}2\\cdot10^{-1}$ | $4{,}2\\cdot10^{-3}$ | $2{,}1\\cdot10^{-6}$ |
> | $20$ | $6{,}5\\cdot10^{-2}$ | $1{,}1\\cdot10^{-3}$ | $1{,}4\\cdot10^{-7}$ |
> | $40$ | $3{,}3\\cdot10^{-2}$ | $2{,}8\\cdot10^{-4}$ | $8{,}7\\cdot10^{-9}$ |
>
> Die Quotienten aufeinanderfolgender Zeilen liegen bei etwa $2$, $4$ und $16$. Noch aussagekräftiger ist der Vergleich bei **gleichem Aufwand**: Euler braucht eine, Heun zwei, RK4 vier Auswertungen von $f$ pro Schritt. Mit je $40$ Auswertungen (Euler $n = 40$, Heun $n = 20$, RK4 $n = 10$) liegen die Fehler bei $3{,}3\\cdot10^{-2}$, $1{,}1\\cdot10^{-3}$ und $2{,}1\\cdot10^{-6}$ – in diesem Beispiel ist RK4 bei gleichem Aufwand, gemessen in Auswertungen von $f$, rund $16\\,000$-mal genauer als Euler. Das ist keine allgemeine Konstante: Der Vorteil wächst mit der geforderten Genauigkeit und schrumpft, wenn die Lösung nicht glatt ist (Knicke, Sprünge in $f$) oder wenn die Stabilität statt der Genauigkeit die Schrittweite bestimmt.

## Stabilität und steife Probleme

Genauigkeit ist nicht alles. Die **Testgleichung** $y' = \\lambda y$ mit $\\lambda < 0$ hat die abklingende Lösung $y_0\\e^{\\lambda t}$. Jedes Einschrittverfahren macht daraus $y_{k+1} = R(h\\lambda)\\,y_k$ mit einer **Stabilitätsfunktion** $R$:
$$
R_{\\text{Euler}}(z) = 1 + z, \\qquad R_{\\text{Heun}}(z) = 1 + z + \\frac{z^2}{2}, \\qquad R_{\\text{RK4}}(z) = 1 + z + \\frac{z^2}{2} + \\frac{z^3}{6} + \\frac{z^4}{24} .
$$
Die Näherung klingt nur ab, wenn $\\abs{R(h\\lambda)} \\le 1$. Für Euler und Heun heißt das auf der reellen Achse $-2 \\le h\\lambda \\le 0$, für RK4 etwa $-2{,}785 \\le h\\lambda \\le 0$.

> [!BEISPIEL] Wenn die Rechnung explodiert
> Für $y' = -20\\,y$ ist explizites Euler nur für $h \\le \\frac{2}{20} = 0{,}1$ stabil. Mit $h = 0{,}15$ ist $R = 1 - 3 = -2$: Die Näherung wechselt das Vorzeichen und verdoppelt sich in jedem Schritt, obwohl die exakte Lösung in $0{,}15$ Zeiteinheiten auf $\\e^{-3} \\approx 5\\,\\%$ abfällt. Mit $h = 0{,}1$ ist $R = -1$, die Näherung springt ewig zwischen $\\pm y_0$.

Ein Problem heißt **steif**, wenn es sehr unterschiedliche Zeitskalen enthält – etwa eine Reaktion, die in Mikrosekunden abklingt, neben einer, die Stunden dauert. Dann erzwingt die schnelle Komponente winzige Schritte, obwohl sie längst abgeklungen ist: Die Stabilität begrenzt $h$, nicht die Genauigkeit.

> [!DEFINITION] Implizites Euler-Verfahren
> $$
> y_{k+1} = y_k + h\\,f(t_{k+1}, y_{k+1}) .
> $$
> Die unbekannte Größe $y_{k+1}$ steht auf beiden Seiten; in jedem Schritt ist eine Gleichung zu lösen, im Allgemeinen mit dem [Newton-Verfahren](#/mathe/numerik/nullstellen).

Für die Testgleichung ist $y_{k+1} = y_k + h\\lambda\\,y_{k+1}$, also $R(z) = \\frac{1}{1 - z}$, und das ist für **jedes** $z < 0$ kleiner als $1$. Das Verfahren ist A-stabil: Im Beispiel $y' = -20y$ mit $h = 0{,}15$ liefert es den Faktor $\\frac{1}{1 + 3} = 0{,}25$ – nicht genau, aber abklingend wie die Lösung. Programme zur Schaltungssimulation (SPICE) und Chemie-Codes verwenden deshalb implizite Verfahren, in Python etwa \`solve_ivp(..., method="Radau")\` oder \`"BDF"\`.

## Systeme und Energieerhaltung

Eine Gleichung zweiter Ordnung wird zum System erster Ordnung, indem man die Ableitung als eigene Unbekannte führt. Der ungedämpfte Oszillator $x'' = -x$ wird mit $v = x'$ zu
$$
\\begin{pmatrix} x \\\\ v \\end{pmatrix}' = \\begin{pmatrix} v \\\\ -x \\end{pmatrix}, \\qquad E = x^2 + v^2 \\text{ bleibt konstant.}
$$
Explizites Euler multipliziert $(x, v)$ in jedem Schritt mit $\\begin{pmatrix} 1 & h \\\\ -h & 1 \\end{pmatrix}$, deren Determinante $1 + h^2$ ist: Die Energie wächst pro Schritt genau um den Faktor $1 + h^2$. Mit $h = 0{,}1$ ist sie nach einer Periode ($63$ Schritte) von $1$ auf $1{,}87$ gestiegen – die simulierte Feder schwingt immer weiter auf.

Das **symplektische Euler-Verfahren** rechnet erst die neue Geschwindigkeit und mit ihr die neue Position:
$$
v_{k+1} = v_k - h\\,x_k, \\qquad x_{k+1} = x_k + h\\,v_{k+1} .
$$
Seine Matrix $\\begin{pmatrix} 1 - h^2 & h \\\\ -h & 1 \\end{pmatrix}$ hat Determinante $1$; es erhält Flächen im Phasenraum. Die Energie $x^2 + v^2$ erhält es **nicht** exakt: Mit $h = 0{,}1$ schwankt sie zwischen etwa $0{,}952$ und $1{,}053$ (nach einer Periode liegt sie zufällig bei $0{,}998$). Entscheidend ist, dass sie nicht wegdriftet – auch nach $100\\,000$ Schritten bleibt sie in diesem Band. Exakt erhalten bleibt eine leicht veränderte Größe, die **modifizierte Energie** $x^2 + v^2 - h\\,x\\,v$; wegen $\\abs{xv} \\le \\frac12(x^2 + v^2)$ folgt daraus die Schranke $\\frac{1}{1 + h/2} \\le x^2 + v^2 \\le \\frac{1}{1 - h/2}$ für den Start $(1, 0)$. Diese gute Langzeitstabilität ist der Grund, warum Physik-Engines in Spielen dieses Verfahren oder das verwandte Verlet-Verfahren nutzen – trotz Ordnung $1$.

## Schrittweitensteuerung

Feste Schrittweiten verschwenden Rechenzeit, wo die Lösung glatt ist, und sind zu grob, wo sie sich schnell ändert. Moderne Löser schätzen den lokalen Fehler in jedem Schritt und passen $h$ an. **Eingebettete Verfahren** wie Dormand-Prince (RK45) berechnen aus denselben Steigungen zwei Näherungen der Ordnungen $4$ und $5$; ihre Differenz $\\varepsilon$ schätzt den Fehler. Ist $\\varepsilon$ größer als die Toleranz, wird der Schritt mit kleinerem $h$ wiederholt, sonst wird $h$ für den nächsten Schritt vergrößert, typischerweise mit
$$
h_{\\text{neu}} = 0{,}9\\,h\\left(\\frac{\\text{tol}}{\\varepsilon}\\right)^{1/5} .
$$

\`\`\`python title="RK4 von Hand und mit SciPy"
import numpy as np
from scipy.integrate import solve_ivp

def rk4(f, t0, y0, h, n):
    t, y = t0, np.asarray(y0, dtype=float)
    for _ in range(n):
        k1 = f(t, y)
        k2 = f(t + h/2, y + h/2 * k1)
        k3 = f(t + h/2, y + h/2 * k2)
        k4 = f(t + h, y + h * k3)
        y = y + h/6 * (k1 + 2*k2 + 2*k3 + k4)
        t += h
    return y

oszillator = lambda t, y: np.array([y[1], -y[0]])
print(rk4(oszillator, 0, [1, 0], 0.1, 63))      # nahe (cos 6,3; −sin 6,3)

# adaptive Schrittweite (RK45); für steife Probleme method="Radau" oder "BDF"
loesung = solve_ivp(oszillator, (0, 2*np.pi), [1, 0], rtol=1e-8, atol=1e-10)
print(loesung.y[:, -1], loesung.t.size, "Schritte")
\`\`\`

## Differentialgleichungen in der Informatik

- **Spiele und Animation:** Federn, Stoffe und Partikel mit symplektischem Euler oder Verlet; zu große Zeitschritte lassen Simulationen „explodieren“.
- **Schaltungs- und Systemsimulation:** SPICE, Modelica und Regelungstechnik lösen steife Systeme implizit.
- **Epidemiologie und Ökonomie:** SIR-Modelle und Wachstumsmodelle sind kleine nichtlineare Systeme.
- **Machine Learning:** Gradientenabstieg ist ein Euler-Verfahren für den Gradientenfluss $\\theta' = -\\nabla L(\\theta)$ – die Lernrate ist die Schrittweite, und eine zu große Lernrate divergiert aus demselben Stabilitätsgrund wie oben (siehe [Gradientenverfahren](#/mathe/optimierung/gradientenverfahren)). Neural ODEs verwenden Runge-Kutta-Löser direkt im Netz.

## Zusammenfassung

- Anfangswertproblem $y' = f(t, y)$, $y(t_0) = y_0$; Einschrittverfahren berechnen $y_{k+1}$ aus $y_k$.
- Euler (Ordnung $1$), Heun (Ordnung $2$), RK4 (Ordnung $4$) mit $1$, $2$ und $4$ Auswertungen pro Schritt. Halbieren von $h$ teilt den Fehler durch $2^p$.
- Lokaler Fehler $O(h^{p+1})$, globaler Fehler $O(h^p)$; die Lipschitz-Konstante bestimmt, wie stark sich Fehler fortpflanzen.
- Stabilität: $\\abs{R(h\\lambda)} \\le 1$. Explizites Euler braucht $h \\le \\frac{2}{\\abs\\lambda}$; implizites Euler ist für jedes $h$ stabil und daher die Basis für steife Probleme.
- Für Schwingungen hält symplektisches Euler die Energie dauerhaft in einem schmalen Band ohne Drift (exakt erhalten bleibt nur eine modifizierte Energie); explizites Euler pumpt mit jedem Schritt Energie hinein.
- Praxis: adaptive Löser wie RK45 für normale, Radau oder BDF für steife Probleme.
`;export{e as default};
