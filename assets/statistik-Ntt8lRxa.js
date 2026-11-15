const e=`---
id: statistik
title: Schätzen und Testen
module: stochastik
order: 4
difficulty: fortgeschritten
minutes: 50
summary: Stichproben und Schätzer, Erwartungstreue und Standardfehler, Konfidenzintervalle für Mittelwerte und Anteile, Hypothesentests mit p-Wert, Fehler 1. und 2. Art, A/B-Tests und typische Fallstricke wie multiples Testen.
tags: [Statistik, Schätzer, Konfidenzintervall, Hypothesentest, p-Wert, A/B-Test, Standardfehler]
requires: [verteilungen]
---

## Von der Wahrscheinlichkeit zur Statistik

Die Wahrscheinlichkeitsrechnung geht vom Modell zu den Daten: Wenn eine Münze fair ist, wie wahrscheinlich sind 60 Mal Kopf in 100 Würfen? Die **Statistik** geht den umgekehrten Weg: Wir haben 60 Mal Kopf gesehen – was sagt das über die Münze? In der Softwareentwicklung stellen sich solche Fragen ständig: Ist die neue Version schneller? Erhöht der neue Button die Klickrate? Ist die Fehlerrate gestiegen oder schwankt sie nur zufällig?

> [!DEFINITION] Stichprobe und Schätzer
> Eine **Stichprobe** sind Beobachtungen $X_1, \\dots, X_n$, die wir als unabhängige, identisch verteilte Zufallsvariablen modellieren. Ein **Schätzer** ist eine Funktion der Stichprobe, die einen unbekannten Parameter der Verteilung annähern soll, etwa
> $$
> \\bar X = \\frac1n\\sum_{i=1}^n X_i \\quad(\\text{für } \\mu), \\qquad S^2 = \\frac{1}{n - 1}\\sum_{i=1}^{n}(X_i - \\bar X)^2 \\quad(\\text{für } \\sigma^2) .
> $$

## Gute Schätzer

> [!DEFINITION] Erwartungstreu und Standardfehler
> Ein Schätzer $\\hat\\theta$ für $\\theta$ heißt **erwartungstreu**, wenn $\\E[\\hat\\theta] = \\theta$. Seine Standardabweichung heißt **Standardfehler**.

> [!SATZ] Eigenschaften des Stichprobenmittels
> $\\bar X$ ist erwartungstreu für $\\mu$ und hat den Standardfehler $\\frac{\\sigma}{\\sqrt n}$.

> [!BEWEIS]
> Mit der Linearität des [Erwartungswerts](#/mathe/stochastik/zufallsvariablen): $\\E[\\bar X] = \\frac1n\\sum\\E[X_i] = \\mu$. Wegen der Unabhängigkeit addieren sich die Varianzen: $\\Var(\\bar X) = \\frac{1}{n^2}\\sum\\Var(X_i) = \\frac{\\sigma^2}{n}$.

Der Faktor $\\frac{1}{\\sqrt n}$ ist das wichtigste Gesetz der Statistik: **Viermal so viele Daten halbieren die Unsicherheit.** Für eine zehnmal genauere Messung braucht man hundertmal so viele Messungen.

> [!TIP] Warum n − 1?
> Bei $S^2$ teilt man durch $n - 1$, nicht durch $n$. Weil $\\bar X$ aus denselben Daten berechnet wird, liegen die Daten im Mittel näher an $\\bar X$ als am wahren $\\mu$; die Division durch $n$ würde $\\sigma^2$ systematisch unterschätzen. Mit $n - 1$ ist $S^2$ erwartungstreu (Bessel-Korrektur). In NumPy ist das \`np.var(x, ddof=1)\`, in Pandas der Standard von \`Series.var()\`.

## Konfidenzintervalle

Ein einzelner Schätzwert verschweigt seine Unsicherheit. Ein **[[Konfidenzintervall]]** gibt einen Bereich an, der den wahren Wert mit hoher Sicherheit überdeckt.

> [!SATZ] Konfidenzintervall für den Mittelwert
> Für großes $n$ (Faustregel $n \\ge 30$) ist
> $$
> \\left[\\bar x - z\\,\\frac{s}{\\sqrt n},\\;\\; \\bar x + z\\,\\frac{s}{\\sqrt n}\\right]
> $$
> ein Konfidenzintervall zum Niveau $95\\,\\%$ mit $z = 1{,}96$ (für $99\\,\\%$: $z = 2{,}576$).

Begründung: Nach dem [zentralen Grenzwertsatz](#/mathe/stochastik/verteilungen) ist $\\bar X$ näherungsweise $N\\!\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$, und $95\\,\\%$ der Masse einer Normalverteilung liegen innerhalb von $\\pm 1{,}96$ Standardabweichungen. Für kleine Stichproben aus Normalverteilungen ersetzt man $z$ durch ein Quantil der $t$-Verteilung, die etwas breiter ist.

> [!BEISPIEL] Antwortzeiten
> $n = 100$ Messungen haben $\\bar x = 212$ ms und $s = 40$ ms. Standardfehler $\\frac{40}{\\sqrt{100}} = 4$ ms. 95-%-Intervall: $212 \\pm 1{,}96 \\cdot 4 = [204{,}2;\\; 219{,}8]$ ms.

> [!MISTAKE] Falsch gedeutet
> „Der wahre Mittelwert liegt mit 95 % Wahrscheinlichkeit in diesem Intervall“ ist streng genommen falsch – $\\mu$ ist eine feste Zahl, zufällig ist das Intervall. Richtig: **Das Verfahren** liefert in 95 % aller Wiederholungen ein Intervall, das $\\mu$ enthält. Und: Ein Konfidenzintervall sagt nichts darüber, wo **einzelne** Messwerte liegen – dafür braucht man die Standardabweichung oder Perzentile.

Für einen **Anteil** $p$ (Klickrate, Fehlerquote) verwendet man $\\hat p = \\frac{\\text{Treffer}}{n}$ und den Standardfehler $\\sqrt{\\frac{\\hat p(1 - \\hat p)}{n}}$, also das Intervall $\\hat p \\pm 1{,}96\\sqrt{\\hat p(1-\\hat p)/n}$.

## Hypothesentests

Ein [[Hypothesentest|Test]] entscheidet zwischen zwei Aussagen über die Verteilung:
- **Nullhypothese** $H_0$: „kein Effekt“ (die Münze ist fair, die neue Version ist nicht schneller),
- **Alternative** $H_1$: der Effekt, den man nachweisen möchte.

Man nimmt $H_0$ an und fragt: Wie überraschend sind die Daten unter dieser Annahme?

> [!DEFINITION] p-Wert und Signifikanzniveau
> Der **p-Wert** ist die Wahrscheinlichkeit, unter $H_0$ ein mindestens so extremes Ergebnis wie das beobachtete zu erhalten. Ist er kleiner als ein vorher festgelegtes **Signifikanzniveau** $\\alpha$ (meist $0{,}05$), lehnt man $H_0$ ab: Das Ergebnis heißt **statistisch signifikant**.

> [!BEISPIEL] Ist die Münze fair?
> 100 Würfe, 61 Mal Kopf. Unter $H_0$ ($p = \\frac12$) ist die Anzahl $X \\sim B(100;\\, 0{,}5)$ mit $\\mu = 50$, $\\sigma = 5$. Mit Normalnäherung (Stetigkeitskorrektur) ist
> $$
> z = \\frac{60{,}5 - 50}{5} = 2{,}1, \\qquad P(X \\ge 61) \\approx 1 - \\Phi(2{,}1) \\approx 0{,}018 .
> $$
> Zweiseitig (auch 39 oder weniger wäre „extrem“) ist $p \\approx 0{,}036 < 0{,}05$: $H_0$ wird abgelehnt. Mit dem [Verteilungsrechner](#/mathe/labor/verteilungen) lässt sich der exakte Binomialwert nachrechnen.

### Zwei Arten von Fehlern

| | $H_0$ wahr | $H_0$ falsch |
|---|---|---|
| $H_0$ abgelehnt | **Fehler 1. Art** (falscher Alarm), Wahrscheinlichkeit $\\alpha$ | richtig |
| $H_0$ beibehalten | richtig | **Fehler 2. Art** (Effekt übersehen), Wahrscheinlichkeit $\\beta$ |

$1 - \\beta$ heißt **Teststärke** (Power). Sie wächst mit der Stichprobengröße und mit der Größe des Effekts. Vor einem Experiment rechnet man aus, wie viele Daten man braucht, um einen relevanten Effekt mit hoher Power (üblich $80\\,\\%$) zu entdecken.

> [!WARNING] Was ein p-Wert nicht ist
> - Er ist **nicht** die Wahrscheinlichkeit, dass $H_0$ wahr ist (das wäre eine Bayes-Frage, siehe [Satz von Bayes](#/mathe/stochastik/wahrscheinlichkeitsraeume)).
> - „Nicht signifikant“ heißt **nicht** „kein Effekt“, sondern „nicht genug Evidenz“ – oft schlicht zu wenig Daten.
> - Signifikant heißt **nicht** relevant: Mit Millionen Nutzern wird auch eine Verbesserung um 0,01 % signifikant.

## A/B-Tests

Ein A/B-Test vergleicht zwei Varianten, indem Nutzer **zufällig** einer Variante zugewiesen werden. Die Randomisierung ist entscheidend: Sie sorgt dafür, dass sich die Gruppen nur in der Variante unterscheiden – nur so lässt sich ein Unterschied **kausal** auf die Variante zurückführen (anders als bei einer [Regression](#/mathe/optimierung/regression) auf Beobachtungsdaten).

> [!BEISPIEL] Klickraten vergleichen
> Variante A: 200 Klicks bei 5 000 Besuchen ($\\hat p_A = 4{,}0\\,\\%$), Variante B: 250 Klicks bei 5 000 Besuchen ($\\hat p_B = 5{,}0\\,\\%$). Unter $H_0$ (gleiche Rate) schätzt man die gemeinsame Rate $\\hat p = \\frac{450}{10\\,000} = 0{,}045$ und den Standardfehler der Differenz
> $$
> \\sqrt{\\hat p(1 - \\hat p)\\left(\\tfrac{1}{5000} + \\tfrac1{5000}\\right)} \\approx 0{,}00415 .
> $$
> $z = \\frac{0{,}05 - 0{,}04}{0{,}00415} \\approx 2{,}41$, zweiseitiger p-Wert $\\approx 0{,}016$: signifikant auf dem 5-%-Niveau.

### Fallstricke

- **Multiples Testen:** Wer 20 Metriken prüft, findet bei $\\alpha = 0{,}05$ im Mittel eine „signifikante“ – auch ohne jeden Effekt. Abhilfe: eine primäre Metrik vorher festlegen oder das Niveau korrigieren (Bonferroni: $\\frac{\\alpha}{m}$).
- **Vorzeitiges Abbrechen („Peeking“):** Den Test täglich anschauen und stoppen, sobald $p < 0{,}05$, erhöht die Fehlerrate drastisch. Die Stichprobengröße wird vorher festgelegt – oder man nutzt sequentielle Verfahren.
- **Ungleiche Gruppen:** Verteilt ein Fehler im Code Nutzer ungleich auf die Varianten (Sample Ratio Mismatch), sind die Ergebnisse wertlos – ein Chi-Quadrat-Test auf die Gruppengrößen deckt das auf.

## Zusammenfassung

- $\\bar X$ ist erwartungstreu mit Standardfehler $\\frac{\\sigma}{\\sqrt n}$; $S^2$ teilt durch $n - 1$.
- 95-%-Konfidenzintervall: $\\bar x \\pm 1{,}96\\,\\frac{s}{\\sqrt n}$; für Anteile $\\hat p \\pm 1{,}96\\sqrt{\\hat p(1 - \\hat p)/n}$.
- p-Wert = Wahrscheinlichkeit so extremer Daten unter $H_0$; $p < \\alpha$ ⇒ $H_0$ ablehnen; Fehler 1. und 2. Art.
- A/B-Tests brauchen Randomisierung, eine vorher festgelegte Metrik und Stichprobengröße.
`;export{e as default};
