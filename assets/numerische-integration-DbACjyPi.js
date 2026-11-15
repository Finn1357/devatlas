const e=`---
id: numerische-integration
title: Numerische Integration
module: numerik
order: 4
difficulty: fortgeschritten
minutes: 40
summary: Quadraturformeln aus Interpolation – Mittelpunkt-, Trapez- und Simpsonregel, zusammengesetzte Regeln mit Fehlerordnung, Richardson-Extrapolation, Gauß-Quadratur und Monte-Carlo-Integration für hohe Dimensionen.
tags: [Numerische Integration, Quadratur, Trapezregel, Simpsonregel, Fehlerordnung, Monte Carlo]
requires: [integralrechnung, interpolation]
---

## Warum numerisch integrieren?

Der [Hauptsatz](#/mathe/analysis-2/integralrechnung) berechnet $\\int_a^b f\\dd x$ über eine Stammfunktion. Oft gibt es aber keine elementare Stammfunktion ($\\e^{-x^2}$, $\\frac{\\sin x}{x}$), die Funktion ist nur als Messreihe oder Programmcode gegeben, oder das Integral ist mehrdimensional. Dann nähert man es durch eine gewichtete Summe von Funktionswerten an:
$$
\\int_a^b f(x)\\dd x \\approx \\sum_{i=0}^{n} w_i\\, f(x_i) .
$$
Solche **[[Numerische Integration|Quadraturformeln]]** stecken in jeder Wahrscheinlichkeitsberechnung mit stetigen Verteilungen, in Physik-Engines, in der Computergrafik (Rendering-Gleichung) und in Finanzmodellen.

## Einfache Regeln aus Interpolation

Die Idee: $f$ auf $[a, b]$ durch ein [Interpolationspolynom](#/mathe/numerik/interpolation) ersetzen und dieses exakt integrieren. Mit $h = b - a$:

| Regel | Polynom durch | Formel | Fehler |
|---|---|---|---|
| Mittelpunktregel | $\\left(m, f(m)\\right)$, $m = \\frac{a+b}{2}$ | $h\\,f(m)$ | $\\frac{h^3}{24}f''(\\xi)$ |
| Trapezregel | Endpunkte $a$, $b$ (Gerade) | $\\frac h2\\big(f(a) + f(b)\\big)$ | $-\\frac{h^3}{12}f''(\\xi)$ |
| Simpsonregel | $a$, $m$, $b$ (Parabel) | $\\frac h6\\big(f(a) + 4f(m) + f(b)\\big)$ | $-\\frac{h^5}{2880}f^{(4)}(\\xi)$ |

Die Simpsonregel ist überraschend genau: Sie integriert nicht nur Parabeln, sondern sogar **alle kubischen Polynome** exakt (der Fehler enthält die vierte Ableitung).

> [!BEISPIEL] Drei Regeln im Vergleich
> $\\int_0^1 \\e^{x}\\dd x = \\e - 1 \\approx 1{,}718282$.
> - Mittelpunkt: $\\e^{0{,}5} \\approx 1{,}648721$ (Fehler $\\approx -0{,}070$)
> - Trapez: $\\frac12(1 + \\e) \\approx 1{,}859141$ (Fehler $\\approx +0{,}141$)
> - Simpson: $\\frac16(1 + 4\\e^{0{,}5} + \\e) \\approx 1{,}718861$ (Fehler $\\approx +0{,}0006$)
>
> Bemerkenswert: Der Mittelpunktfehler ist etwa halb so groß wie der Trapezfehler und hat das andere Vorzeichen – Simpson ist genau die Kombination $\\frac23\\,\\text{Mittelpunkt} + \\frac13\\,\\text{Trapez}$, bei der sich die führenden Fehler aufheben.

## Zusammengesetzte Regeln

Für Genauigkeit vergrößert man nicht den Polynomgrad (Runge-Phänomen!), sondern teilt $[a, b]$ in $n$ Teilintervalle der Breite $h = \\frac{b - a}{n}$ und wendet die Regel auf jedes an.

> [!SATZ] Zusammengesetzte Trapez- und Simpsonregel
> Mit $x_i = a + ih$ und $f_i = f(x_i)$:
> $$
> T_h = h\\left(\\frac{f_0}{2} + f_1 + f_2 + \\dots + f_{n-1} + \\frac{f_n}{2}\\right), \\qquad \\abs{T_h - I} \\le \\frac{(b - a)\\,h^2}{12}\\max\\abs{f''} .
> $$
> Für gerades $n$ (Teilintervallpaare):
> $$
> S_h = \\frac h3\\big(f_0 + 4f_1 + 2f_2 + 4f_3 + \\dots + 2f_{n-2} + 4f_{n-1} + f_n\\big), \\qquad \\abs{S_h - I} \\le \\frac{(b - a)\\,h^4}{180}\\max\\abs{f^{(4)}} .
> $$

Im Labor [Riemann-Summen & Quadratur](#/mathe/labor/integration) lassen sich alle Regeln für eigene Funktionen zeichnen und ihre Fehler nebeneinander vergleichen. Die **Fehlerordnung** sagt, wie der Fehler mit der Schrittweite fällt: Bei der Trapezregel ($O(h^2)$) bringt die doppelte Anzahl Teilintervalle ein Viertel des Fehlers, bei Simpson ($O(h^4)$) ein Sechzehntel.

\`\`\`python title="Zusammengesetzte Trapez- und Simpsonregel"
import math

def trapez(f, a, b, n):
    h = (b - a) / n
    return h * (f(a) / 2 + sum(f(a + i * h) for i in range(1, n)) + f(b) / 2)

def simpson(f, a, b, n):          # n gerade
    h = (b - a) / n
    s = f(a) + f(b)
    s += 4 * sum(f(a + i * h) for i in range(1, n, 2))
    s += 2 * sum(f(a + i * h) for i in range(2, n, 2))
    return h / 3 * s

exakt = 2.0                         # Integral von sin über [0, pi]
for n in [4, 8, 16]:
    print(n, abs(trapez(math.sin, 0, math.pi, n) - exakt), abs(simpson(math.sin, 0, math.pi, n) - exakt))
# Trapez:  1.0e-1, 2.6e-2, 6.4e-3  (Faktor 4 pro Verdopplung)
# Simpson: 4.6e-3, 2.7e-4, 1.7e-5  (Faktor 16 pro Verdopplung)
\`\`\`

> [!TIP] Fehlerordnung messen
> Halbiert man $h$ und teilt den alten durch den neuen Fehler, erhält man etwa $2^p$ mit der Ordnung $p$. Das ist ein einfacher, wirkungsvoller Test für jede numerische Implementierung: Stimmt die gemessene Ordnung nicht mit der Theorie überein, steckt fast immer ein Programmierfehler im Code (etwa ein falsches Gewicht am Rand).

### Richardson-Extrapolation

Kennt man die Fehlerordnung, kann man den Fehler fast vollständig eliminieren. Für die Trapezregel gilt $T_h \\approx I + Ch^2$ und $T_{h/2} \\approx I + C\\frac{h^2}{4}$. Auflösen nach $I$:
$$
I \\approx \\frac{4\\,T_{h/2} - T_h}{3} .
$$
Das ist genau die Simpsonregel – und wiederholt angewandt das **Romberg-Verfahren**, das aus wenigen Trapezsummen sehr genaue Werte gewinnt.

## Gauß-Quadratur

Trapez und Simpson verwenden festgelegte, gleichabständige Stützstellen. Gibt man auch die **Lage** der Stützstellen frei, kann man mit $n$ Funktionsauswertungen alle Polynome bis zum Grad $2n - 1$ exakt integrieren.

> [!BEISPIEL] Zwei-Punkt-Gauß-Formel
> $$
> \\int_{-1}^{1} f(x)\\dd x \\approx f\\!\\left(-\\tfrac{1}{\\sqrt3}\\right) + f\\!\\left(\\tfrac{1}{\\sqrt3}\\right)
> $$
> ist exakt für alle Polynome bis Grad 3 – mit nur **zwei** Auswertungen, wo Simpson drei braucht. Für ein anderes Intervall $[a, b]$ transformiert man linear. Test mit $\\int_{-1}^1 x^2\\dd x = \\frac23$: $\\frac13 + \\frac13 = \\frac23$ ✓.

Gauß-Formeln sind ideal, wenn Funktionsauswertungen teuer sind und $f$ glatt ist; Bibliotheken wie \`scipy.integrate.quad\` kombinieren sie mit **adaptiver** Verfeinerung, die nur dort weitere Teilintervalle einfügt, wo der geschätzte Fehler groß ist.

## Monte-Carlo-Integration

In hohen Dimensionen versagen Gitterverfahren: Mit 10 Punkten pro Achse braucht ein 10-dimensionales Integral bereits $10^{10}$ Auswertungen ([[Fluch der Dimensionalität]], ausführlich in [Mehrfachintegrale](#/mathe/analysis-2/mehrfachintegrale)). **Monte Carlo** würfelt stattdessen:
$$
\\int_{[0,1]^d} f(\\vec x)\\dd\\vec x \\approx \\frac1N\\sum_{k=1}^{N} f(\\vec X_k), \\qquad \\vec X_k \\text{ unabhängig gleichverteilt} .
$$
Nach dem Gesetz der großen Zahlen konvergiert der Mittelwert gegen das Integral, und nach dem [zentralen Grenzwertsatz](#/mathe/stochastik/verteilungen) ist der Fehler etwa $\\frac{\\sigma}{\\sqrt N}$ – **unabhängig von der Dimension**, aber langsam: Für eine weitere Dezimalstelle braucht man hundertmal so viele Punkte.

> [!BEISPIEL] π würfeln
> Wirft man $N$ zufällige Punkte in das Einheitsquadrat und zählt den Anteil im Viertelkreis $x^2 + y^2 \\le 1$, schätzt man $\\frac\\pi4$. Mit $N = 10^6$ liegt der Fehler typischerweise bei etwa $0{,}0016$ für $\\pi$ – drei Stellen. Path Tracing in der Filmproduktion berechnet so die Beleuchtung: Jeder Pixel ist ein Integral über alle Lichtwege, geschätzt mit Zufallsstrahlen; das Bildrauschen ist der Monte-Carlo-Fehler.

## Zusammenfassung

- Quadratur = gewichtete Summe von Funktionswerten; Regeln entstehen durch exaktes Integrieren eines Interpolationspolynoms.
- Zusammengesetzte Trapezregel: Fehler $O(h^2)$; Simpson: $O(h^4)$ und exakt für kubische Polynome.
- Richardson/Romberg eliminieren bekannte Fehlerterme; Gauß-Quadratur optimiert die Stützstellen.
- Monte Carlo: Fehler $\\sim \\frac{1}{\\sqrt N}$ unabhängig von der Dimension – das Mittel der Wahl für hochdimensionale Integrale.
`;export{e as default};
