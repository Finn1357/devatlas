const e=`---
id: komplexe-zahlen
title: Komplexe Zahlen
module: algebra
order: 3
difficulty: fortgeschritten
minutes: 50
summary: Die imaginäre Einheit, Rechnen in algebraischer Form, die Gaußsche Zahlenebene, Betrag und Konjugation, Polarform und Eulersche Formel, Potenzen und Wurzeln sowie der Fundamentalsatz der Algebra.
tags: [Komplexe Zahlen, Imaginäre Einheit, Polarform, Eulersche Formel, Einheitswurzeln, Fundamentalsatz der Algebra]
requires: [abbildungen]
---

## Warum komplexe Zahlen?

Die Gleichung $x^2 = -1$ hat keine reelle Lösung, weil Quadrate reeller Zahlen nie negativ sind. Im 16. Jahrhundert stießen Mathematiker beim Lösen kubischer Gleichungen trotzdem auf Wurzeln aus negativen Zahlen – und erhielten am Ende richtige, reelle Ergebnisse. Man erweitert die reellen Zahlen daher um eine neue Zahl $\\ii$ mit $\\ii^2 = -1$.

Was als Rechentrick begann, ist heute unverzichtbar: Wechselstromtechnik, Signalverarbeitung und die Fourier-Transformation (MP3, JPEG, 5G), Quantenmechanik und Quantencomputing, Regelungstechnik und Computergrafik rechnen mit [[Komplexe Zahl|komplexen Zahlen]].

> [!DEFINITION] Komplexe Zahlen
> Eine **komplexe Zahl** ist ein Ausdruck $z = a + b\\,\\ii$ mit $a, b \\in \\R$ und der **imaginären Einheit** $\\ii$, für die $\\ii^2 = -1$ gilt. $a = \\operatorname{Re} z$ heißt **Realteil**, $b = \\operatorname{Im} z$ **Imaginärteil**. Die Menge aller komplexen Zahlen ist $\\C$; die reellen Zahlen sind die mit $b = 0$.

Zwei komplexe Zahlen sind gleich, wenn Real- und Imaginärteil übereinstimmen.

## Rechnen in algebraischer Form

Man rechnet wie mit Termen und ersetzt $\\ii^2$ durch $-1$:
$$
\\begin{aligned}
(a + b\\ii) + (c + d\\ii) &= (a + c) + (b + d)\\ii,\\\\
(a + b\\ii)(c + d\\ii) &= ac + ad\\ii + bc\\ii + bd\\ii^2 = (ac - bd) + (ad + bc)\\ii .
\\end{aligned}
$$

> [!DEFINITION] Konjugation und Betrag
> Die zu $z = a + b\\ii$ **konjugierte** Zahl ist $\\bar z = a - b\\ii$. Der **Betrag** ist
> $$
> \\abs z = \\sqrt{a^2 + b^2} = \\sqrt{z\\,\\bar z} .
> $$

Denn $z\\bar z = (a + b\\ii)(a - b\\ii) = a^2 - b^2\\ii^2 = a^2 + b^2$ ist reell und nicht negativ. Damit gelingt die **Division**: Man erweitert mit dem Konjugierten des Nenners.

> [!BEISPIEL] Division
> $$
> \\frac{3 + 4\\ii}{1 - 2\\ii} = \\frac{(3 + 4\\ii)(1 + 2\\ii)}{(1 - 2\\ii)(1 + 2\\ii)} = \\frac{3 + 6\\ii + 4\\ii + 8\\ii^2}{1 + 4} = \\frac{-5 + 10\\ii}{5} = -1 + 2\\ii .
> $$
> Probe: $(-1 + 2\\ii)(1 - 2\\ii) = -1 + 2\\ii + 2\\ii - 4\\ii^2 = 3 + 4\\ii$. ✓

Rechenregeln der Konjugation: $\\overline{z + w} = \\bar z + \\bar w$, $\\overline{zw} = \\bar z\\,\\bar w$, $z + \\bar z = 2\\operatorname{Re} z$. Für den Betrag gilt $\\abs{zw} = \\abs z\\,\\abs w$ und die Dreiecksungleichung $\\abs{z + w} \\le \\abs z + \\abs w$.

Mit diesen Operationen ist $\\C$ ein **Körper**: Wie in $\\Q$ und $\\R$ gelten Kommutativ-, Assoziativ- und Distributivgesetz, und man kann durch jede Zahl außer $0$ teilen. Anders als $\\R$ ist $\\C$ aber **nicht angeordnet**: Ausdrücke wie $\\ii > 0$ ergeben keinen Sinn.

## Die Gaußsche Zahlenebene

Man stellt $z = a + b\\ii$ als Punkt $(a, b)$ der Ebene dar: Realteil nach rechts, Imaginärteil nach oben. Addition ist dann **Vektoraddition**, der Betrag ist der **Abstand zum Ursprung**, die Konjugation die **Spiegelung an der reellen Achse**. Der Abstand zweier Zahlen ist $\\abs{z - w}$; die Menge $\\set{z \\mid \\abs{z - z_0} = r}$ ist ein Kreis.

Was bedeutet Multiplikation geometrisch? Das zeigt die Polarform.

## Polarform und Eulersche Formel

Jeder Punkt $z \\neq 0$ lässt sich durch seinen Abstand $r = \\abs z$ vom Ursprung und den Winkel $\\varphi$ zur positiven reellen Achse beschreiben:
$$
z = r(\\cos\\varphi + \\ii\\sin\\varphi) .
$$
$\\varphi$ heißt **Argument** von $z$; es ist nur bis auf Vielfache von $2\\pi$ bestimmt (meist wählt man $\\varphi \\in (-\\pi, \\pi]$).

> [!SATZ] Eulersche Formel
> Für alle $\\varphi \\in \\R$ gilt
> $$
> \\e^{\\ii\\varphi} = \\cos\\varphi + \\ii\\sin\\varphi .
> $$

Begründung über die Potenzreihen $\\e^x = \\sum_{k \\ge 0}\\frac{x^k}{k!}$, $\\cos x = \\sum_{k\\ge0} \\frac{(-1)^k x^{2k}}{(2k)!}$ und $\\sin x = \\sum_{k\\ge0}\\frac{(-1)^k x^{2k+1}}{(2k+1)!}$: Setzt man $\\ii\\varphi$ in $\\e^x = \\sum \\frac{x^k}{k!}$ ein und sortiert nach geraden und ungeraden Potenzen ($\\ii^2 = -1$, $\\ii^3 = -\\ii$, $\\ii^4 = 1$), erhält man genau die Reihen von $\\cos\\varphi$ und $\\ii\\sin\\varphi$. Für $\\varphi = \\pi$ folgt die berühmte Identität $\\e^{\\ii\\pi} + 1 = 0$.

Damit wird die **Exponentialform** $z = r\\,\\e^{\\ii\\varphi}$ sehr kompakt, und die Potenzgesetze liefern sofort:

> [!SATZ] Multiplikation in Polarform
> Für $z = r\\e^{\\ii\\varphi}$ und $w = s\\e^{\\ii\\psi}$ gilt
> $$
> z \\cdot w = rs\\,\\e^{\\ii(\\varphi + \\psi)}, \\qquad \\frac zw = \\frac rs\\,\\e^{\\ii(\\varphi - \\psi)} .
> $$
> **Beträge werden multipliziert, Winkel addiert.**

Geometrisch ist die Multiplikation mit $w$ eine **Drehstreckung**: Drehung um $\\psi$, Streckung um $s$. Die Multiplikation mit $\\ii = \\e^{\\ii\\pi/2}$ ist die Drehung um $90°$. Grafik-Engines nutzen diese Idee für 2D-Rotationen und – in vier Dimensionen verallgemeinert als **Quaternionen** – für 3D-Rotationen ohne Gimbal Lock.

### Umrechnen

- Polar → algebraisch: $a = r\\cos\\varphi$, $b = r\\sin\\varphi$.
- Algebraisch → polar: $r = \\sqrt{a^2 + b^2}$, $\\varphi = \\operatorname{atan2}(b, a)$.

> [!WARNING] arctan reicht nicht
> $\\arctan\\frac ba$ liefert nur Winkel in $(-\\frac\\pi2, \\frac\\pi2)$ und verwechselt $1 + \\ii$ mit $-1 - \\ii$. Die Funktion \`atan2(b, a)\` (in fast jeder Programmiersprache vorhanden) berücksichtigt die Vorzeichen beider Komponenten und liefert den richtigen Quadranten.

> [!BEISPIEL] Polarform
> $z = -1 + \\ii\\sqrt3$: $r = \\sqrt{1 + 3} = 2$, der Punkt liegt im zweiten Quadranten mit $\\varphi = \\frac{2\\pi}{3}$. Also $z = 2\\e^{2\\pi\\ii/3}$.

## Potenzen und Wurzeln

> [!SATZ] Formel von de Moivre
> $$
> \\left(r\\e^{\\ii\\varphi}\\right)^n = r^n\\,\\e^{\\ii n\\varphi} = r^n\\big(\\cos(n\\varphi) + \\ii\\sin(n\\varphi)\\big) .
> $$

> [!BEISPIEL] Eine hohe Potenz
> $(1 + \\ii)^{10}$: Mit $1 + \\ii = \\sqrt2\\,\\e^{\\ii\\pi/4}$ ist $(1+\\ii)^{10} = 2^5 \\e^{\\ii\\,10\\pi/4} = 32\\,\\e^{\\ii\\,5\\pi/2} = 32\\,\\e^{\\ii\\pi/2} = 32\\ii$. Ausmultiplizieren mit dem binomischen Lehrsatz wäre mühsam.

> [!SATZ] n-te Wurzeln
> Die Gleichung $z^n = w$ mit $w = s\\e^{\\ii\\psi} \\neq 0$ hat genau $n$ verschiedene Lösungen
> $$
> z_k = \\sqrt[n]{s}\\;\\e^{\\ii\\frac{\\psi + 2\\pi k}{n}}, \\qquad k = 0, 1, \\dots, n - 1 .
> $$
> Sie liegen gleichmäßig verteilt auf einem Kreis mit Radius $\\sqrt[n]s$ und bilden die Ecken eines regelmäßigen $n$-Ecks.

Die Lösungen von $z^n = 1$ heißen **$n$-te Einheitswurzeln** $\\omega^k$ mit $\\omega = \\e^{2\\pi\\ii/n}$. Sie sind das Herzstück der **schnellen Fourier-Transformation (FFT)**, die ein Signal in $O(n\\log n)$ in seine Frequenzen zerlegt und unter anderem große Zahlen und Polynome schnell multipliziert.

> [!BEISPIEL] Kubikwurzeln aus 8
> $z^3 = 8 = 8\\e^{\\ii\\cdot 0}$: $z_k = 2\\e^{2\\pi\\ii k/3}$, also $z_0 = 2$, $z_1 = 2\\e^{2\\pi\\ii/3} = -1 + \\ii\\sqrt3$, $z_2 = -1 - \\ii\\sqrt3$.

## Der Fundamentalsatz der Algebra

> [!SATZ] Fundamentalsatz der Algebra
> Jedes Polynom $p(z) = a_n z^n + \\dots + a_1 z + a_0$ vom Grad $n \\ge 1$ mit komplexen Koeffizienten hat eine Nullstelle in $\\C$. Folglich zerfällt es vollständig in Linearfaktoren:
> $$
> p(z) = a_n (z - z_1)(z - z_2)\\cdots(z - z_n) .
> $$

Mit Vielfachheit gezählt hat jedes Polynom vom Grad $n$ also genau $n$ komplexe Nullstellen. Hat $p$ **reelle** Koeffizienten, treten nicht-reelle Nullstellen in **konjugierten Paaren** auf: Mit $z$ ist auch $\\bar z$ Nullstelle, denn $p(\\bar z) = \\overline{p(z)} = 0$.

> [!BEISPIEL] Quadratische Gleichung mit negativer Diskriminante
> $z^2 - 4z + 13 = 0$: $z = \\frac{4 \\pm \\sqrt{16 - 52}}{2} = \\frac{4 \\pm \\sqrt{-36}}{2} = 2 \\pm 3\\ii$. Ein konjugiertes Paar, und $z^2 - 4z + 13 = (z - 2 - 3\\ii)(z - 2 + 3\\ii)$.

Deshalb haben auch reelle Matrizen immer komplexe [Eigenwerte](#/mathe/lineare-algebra/eigenwerte) – etwa die Drehmatrix um $90°$ die Eigenwerte $\\pm\\ii$. Die Eulersche Formel ist auch die Grundlage der komplexen Darstellung von Schwingungen in den [Fourier-Reihen](#/mathe/analysis-2/fourier-reihen).

## Zusammenfassung

- $\\C = \\set{a + b\\ii \\mid a, b \\in \\R}$ mit $\\ii^2 = -1$; Division durch Erweitern mit dem Konjugierten.
- Gaußsche Ebene: Addition = Vektoraddition, $\\abs z$ = Abstand zum Ursprung.
- Polarform $z = r\\e^{\\ii\\varphi}$ (Euler): Multiplizieren heißt Beträge multiplizieren und Winkel addieren.
- $z^n = w$ hat $n$ Lösungen auf einem Kreis; jedes Polynom vom Grad $n$ hat $n$ komplexe Nullstellen.
`;export{e as default};
