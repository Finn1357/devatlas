const e=`---
id: lagrange
title: Optimierung mit Nebenbedingungen
module: optimierung
order: 3
difficulty: profi
minutes: 50
summary: Extrema unter Gleichungsnebenbedingungen mit Lagrange-Multiplikatoren, geometrische Deutung über parallele Gradienten, Bedeutung des Multiplikators als Schattenpreis, Ungleichungen und KKT-Bedingungen sowie lineare Programmierung.
tags: [Lagrange-Multiplikator, Nebenbedingung, KKT, Schattenpreis, Lineare Programmierung, Constrained Optimization]
requires: [mehrere-variablen, konvexitaet]
---

## Optimieren mit Einschränkungen

Selten darf man frei optimieren: Ein Budget ist begrenzt, eine Fläche fest, eine Wahrscheinlichkeitsverteilung muss sich zu 1 summieren, ein Server hat eine maximale Kapazität. Gesucht sind dann Extrema einer Funktion $f$ unter **Nebenbedingungen**:
$$
\\min f(\\vec x) \\quad\\text{unter}\\quad g(\\vec x) = 0 .
$$

Manchmal lässt sich die Nebenbedingung nach einer Variablen auflösen und einsetzen – wie bei der Dose in der [Kurvendiskussion](#/mathe/analysis-1/kurvendiskussion). Das ist aber oft unmöglich oder unübersichtlich, und es verschleiert die Symmetrie des Problems. Joseph-Louis Lagrange fand 1788 einen eleganteren Weg: den [[Lagrange-Multiplikator]].

## Die geometrische Idee

> [!BEISPIEL] Wo berührt die Höhenlinie die Nebenbedingung?
> Maximiere $f(x, y) = xy$ unter $x + y = 10$. Die Nebenbedingung ist eine Gerade. Wandert man entlang dieser Geraden, durchquert man die Höhenlinien $xy = c$ (Hyperbeln). Solange man eine Höhenlinie **schneidet**, kann man auf der Geraden noch höhere Werte erreichen. Im Optimum **berührt** die Gerade eine Höhenlinie: Dort zeigen der Gradient von $f$ und der Gradient von $g$ in dieselbe (oder entgegengesetzte) Richtung.

Weil der Gradient senkrecht auf Höhenlinien steht ([Funktionen mehrerer Variablen](#/mathe/analysis-2/mehrere-variablen)), heißt „Höhenlinie berührt Nebenbedingung“ genau: **$\\nabla f$ und $\\nabla g$ sind parallel.**

> [!SATZ] Lagrange-Multiplikatoren
> Seien $f, g\\colon \\R^n \\to \\R$ stetig differenzierbar, und $\\vec x^*$ sei ein lokales Extremum von $f$ unter der Nebenbedingung $g(\\vec x) = 0$ mit $\\nabla g(\\vec x^*) \\neq \\vec 0$. Dann gibt es eine Zahl $\\lambda$ (den **Lagrange-Multiplikator**) mit
> $$
> \\nabla f(\\vec x^*) = \\lambda\\, \\nabla g(\\vec x^*) .
> $$

Praktisch fasst man das in der **Lagrange-Funktion** zusammen:
$$
\\mathcal L(\\vec x, \\lambda) = f(\\vec x) - \\lambda\\, g(\\vec x) .
$$
Die Bedingungen $\\nabla_{\\vec x}\\mathcal L = \\vec 0$ und $\\frac{\\partial\\mathcal L}{\\partial\\lambda} = -g(\\vec x) = 0$ sind genau „Gradienten parallel“ und „Nebenbedingung erfüllt“: $n + 1$ Gleichungen für $n + 1$ Unbekannte.

> [!BEISPIEL] Das Rechteck mit maximaler Fläche
> Maximiere $f(x, y) = xy$ unter $g(x, y) = x + y - 10 = 0$.
> $$
> \\mathcal L = xy - \\lambda(x + y - 10), \\qquad \\mathcal L_x = y - \\lambda = 0, \\quad \\mathcal L_y = x - \\lambda = 0, \\quad x + y = 10 .
> $$
> Aus den ersten beiden Gleichungen $x = y = \\lambda$, eingesetzt $x = y = 5$, $\\lambda = 5$. Maximale Fläche $25$: Das Quadrat ist das flächengrößte Rechteck mit festem Umfang.

> [!WARNING] Nur notwendig
> Wie $\\nabla f = \\vec 0$ im freien Fall liefert die Lagrange-Bedingung nur **Kandidaten**. Ob ein Maximum, Minimum oder keins von beiden vorliegt, entscheidet man durch Vergleich der Funktionswerte (bei kompakter zulässiger Menge nach dem Extremwertsatz), durch Konvexitätsargumente oder mit einer geränderten Hesse-Matrix.

> [!BEISPIEL] Abstand eines Punktes von einer Ebene
> Welcher Punkt der Ebene $x + 2y + 2z = 9$ liegt dem Ursprung am nächsten? Minimiere $f = x^2 + y^2 + z^2$ (das Quadrat des Abstands – gleiche Minimalstelle, einfachere Ableitung).
> $$
> 2x = \\lambda, \\quad 2y = 2\\lambda, \\quad 2z = 2\\lambda \\quad\\Longrightarrow\\quad (x, y, z) = \\left(\\tfrac\\lambda2, \\lambda, \\lambda\\right).
> $$
> Einsetzen: $\\frac\\lambda2 + 2\\lambda + 2\\lambda = 9 \\Rightarrow \\lambda = 2$, also $(1, 2, 2)$ mit Abstand $\\sqrt{1 + 4 + 4} = 3$. Das stimmt mit der Abstandsformel $\\frac{\\abs{0 - 9}}{\\norm{(1, 2, 2)}} = \\frac93 = 3$ aus der Lektion [Vektoren](#/mathe/lineare-algebra/vektoren) überein. Der optimale Punkt ist ein Vielfaches des Normalenvektors – genau das sagt „$\\nabla f \\parallel \\nabla g$“.

## Was bedeutet λ?

Der Multiplikator ist nicht nur ein Hilfsmittel. Ändert man die Nebenbedingung zu $g(\\vec x) = c$, so verschiebt sich der optimale Wert näherungsweise um
$$
\\frac{\\mathrm d f^*}{\\mathrm dc} = \\lambda .
$$
$\\lambda$ ist der **Schattenpreis** der Nebenbedingung: Wie viel mehr Zielwert bringt eine Einheit mehr Ressource? Im Rechteckbeispiel ist $\\lambda = 5$: Mit Umfang 22 statt 20 (also $x + y = 11$) steigt die Maximalfläche von 25 auf $30{,}25$ – näherungsweise um $5 \\cdot 1$. In der Ökonomie ist das der Grenznutzen, in der Ressourcenplanung zeigt ein großes $\\lambda$ an, welche Kapazität sich zu erweitern lohnt.

## Mehrere Nebenbedingungen

Bei $m$ Nebenbedingungen $g_1 = \\dots = g_m = 0$ führt man je einen Multiplikator ein:
$$
\\mathcal L = f - \\sum_{j=1}^{m} \\lambda_j\\, g_j, \\qquad \\nabla f = \\sum_j \\lambda_j\\, \\nabla g_j .
$$
Der Gradient von $f$ muss dann im Spann der Gradienten der Nebenbedingungen liegen.

> [!BEISPIEL] Maximale Entropie
> Welche Wahrscheinlichkeitsverteilung $p_1, \\dots, p_n$ hat maximale Entropie $H = -\\sum p_i \\ln p_i$ unter $\\sum p_i = 1$? Aus $\\frac{\\partial\\mathcal L}{\\partial p_i} = -\\ln p_i - 1 - \\lambda = 0$ folgt $p_i = \\e^{-1-\\lambda}$ – für alle $i$ derselbe Wert, also $p_i = \\frac1n$. Die Gleichverteilung ist die „unsicherste“ Verteilung. Mit einer zusätzlichen Nebenbedingung an den Erwartungswert erhält man die exponentielle Familie, aus der die Softmax-Funktion neuronaler Netze stammt.

## Ungleichungen: die KKT-Bedingungen

Oft sind Nebenbedingungen Ungleichungen: $h(\\vec x) \\le 0$ (Budget höchstens …, Last höchstens …). Im Optimum ist eine solche Bedingung entweder **inaktiv** ($h < 0$, sie spielt keine Rolle) oder **aktiv** ($h = 0$, man liegt am Rand). Die Karush-Kuhn-Tucker-Bedingungen fassen beides zusammen:

> [!SATZ] KKT-Bedingungen (für min f unter h_j ≤ 0)
> Unter Regularitätsannahmen gibt es im Optimum $\\mu_j \\ge 0$ mit
> $$
> \\nabla f + \\sum_j \\mu_j \\nabla h_j = \\vec 0, \\qquad h_j(\\vec x) \\le 0, \\qquad \\mu_j\\, h_j(\\vec x) = 0 .
> $$
> Die letzte Gleichung (**komplementärer Schlupf**) besagt: Entweder ist die Bedingung aktiv oder ihr Multiplikator ist null. Für konvexe Probleme sind die KKT-Bedingungen auch **hinreichend**.

Support Vector Machines werden über genau diese Bedingungen gelöst: Die Datenpunkte mit $\\mu_j > 0$ – die aktiven Nebenbedingungen – sind die namensgebenden **Stützvektoren**.

## Lineare Programmierung

Sind Zielfunktion und alle Nebenbedingungen **linear**, spricht man von linearer Programmierung:
$$
\\max\\; \\vec c \\cdot \\vec x \\quad\\text{unter}\\quad A\\vec x \\le \\vec b, \\quad \\vec x \\ge \\vec 0 .
$$
Die zulässige Menge ist ein [konvexes](#/mathe/optimierung/konvexitaet) Polyeder, und ein Optimum (falls es existiert) wird in einer **Ecke** angenommen. Das Simplex-Verfahren wandert von Ecke zu Ecke; Innere-Punkte-Verfahren laufen durch das Innere. LP ist eines der am meisten eingesetzten Werkzeuge der angewandten Mathematik: Produktionsplanung, Logistik, Schichtpläne, Netzwerkflüsse, Portfolio-Optimierung.

> [!BEISPIEL] Produktionsplanung
> Produkt A bringt 3 €, Produkt B 5 € Gewinn. A braucht 1 h Maschine, B 2 h; verfügbar sind 8 h. Material: A 3 kg, B 2 kg bei 12 kg Vorrat. Maximiere $3a + 5b$ unter $a + 2b \\le 8$, $3a + 2b \\le 12$, $a, b \\ge 0$. Die Ecken sind $(0, 0)$, $(4, 0)$, $(0, 4)$ und der Schnittpunkt $(2, 3)$ mit Gewinnen $0$, $12$, $20$ und $21$. Optimal: 2 Stück A und 3 Stück B.

## Zusammenfassung

- Im Optimum unter $g = 0$ sind $\\nabla f$ und $\\nabla g$ parallel: $\\nabla f = \\lambda\\nabla g$; Lagrange-Funktion $\\mathcal L = f - \\lambda g$.
- Die Bedingung liefert nur Kandidaten – Funktionswerte vergleichen oder Konvexität nutzen.
- $\\lambda$ ist der Schattenpreis: die Änderung des Optimums pro Einheit Lockerung der Nebenbedingung.
- Ungleichungen: KKT mit $\\mu_j \\ge 0$ und komplementärem Schlupf; lineare Programme haben ihr Optimum in einer Ecke.
`;export{e as default};
