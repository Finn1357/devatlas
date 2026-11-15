const e=`---
id: reihen
title: Reihen und Konvergenzkriterien
module: analysis-1
order: 2
difficulty: fortgeschritten
minutes: 45
summary: Reihen als Folgen von Partialsummen, geometrische und harmonische Reihe, das Nullfolgenkriterium, Majoranten-, Quotienten- und Wurzelkriterium, alternierende Reihen nach Leibniz und absolute Konvergenz.
tags: [Reihe, Partialsumme, Geometrische Reihe, Harmonische Reihe, Quotientenkriterium, Leibniz-Kriterium, Absolute Konvergenz]
requires: [folgen-grenzwerte, vollstaendige-induktion]
---

## Unendliche Summen

Kann man unendlich viele Zahlen addieren? Achilles läuft einem Wettläufer hinterher, der jeweils die halbe Restdistanz voraus ist – $\\frac12 + \\frac14 + \\frac18 + \\dots$ Die Antwort der Analysis: Man addiert nicht „alle auf einmal“, sondern betrachtet die Folge der **Teilsummen** und deren [Grenzwert](#/mathe/analysis-1/folgen-grenzwerte).

> [!DEFINITION] Reihe
> Zu einer Folge $(a_k)$ heißt $s_n = \\sum_{k=0}^{n} a_k$ die $n$-te **Partialsumme**. Die Folge $(s_n)$ heißt **[[Reihe]]** $\\sum_{k=0}^\\infty a_k$. Konvergiert $(s_n)$ gegen $s$, so heißt die Reihe **konvergent** mit **Wert** $s$, und man schreibt $\\sum_{k=0}^\\infty a_k = s$. Andernfalls heißt sie divergent.

Reihen sind überall: Die Dezimaldarstellung $0{,}333\\ldots = \\sum_{k \\ge 1} 3 \\cdot 10^{-k}$, die erwartete Anzahl von Versuchen bis zum Erfolg, die Laufzeitanalyse rekursiver Algorithmen, die Berechnung von $\\e$, $\\pi$, $\\sin$ und $\\ln$ in jeder Mathebibliothek.

## Die geometrische Reihe

> [!SATZ] Geometrische Reihe
> Für $\\abs q < 1$ gilt
> $$
> \\sum_{k=0}^{\\infty} q^k = \\frac{1}{1 - q} .
> $$
> Für $\\abs q \\ge 1$ divergiert die Reihe.

> [!BEWEIS]
> Nach der [geometrischen Summenformel](#/mathe/grundlagen/vollstaendige-induktion) ist $s_n = \\frac{1 - q^{n+1}}{1 - q}$. Für $\\abs q < 1$ geht $q^{n+1} \\to 0$, also $s_n \\to \\frac{1}{1-q}$. Für $\\abs q \\ge 1$ ist $\\abs{q^k} \\ge 1$, die Summanden bilden keine Nullfolge – nach dem nächsten Satz divergiert die Reihe.

Damit: $\\frac12 + \\frac14 + \\dots = \\frac{1}{1 - 1/2} - 1 = 1$ – Achilles holt auf. Und $0{,}\\overline{9} = \\frac{9}{10}\\cdot\\frac{1}{1 - 1/10} = 1$ exakt.

> [!TIP] Erwartete Anzahl von Versuchen
> Gelingt ein Versuch mit Wahrscheinlichkeit $p$, ist die erwartete Anzahl bis zum ersten Erfolg $\\sum_{k \\ge 1} k\\,(1 - p)^{k-1}p = \\frac1p$ ([geometrische Verteilung](#/mathe/stochastik/verteilungen)). Die Summe entsteht durch Ableiten der geometrischen Reihe: $\\sum_{k\\ge1} k\\,q^{k-1} = \\frac{1}{(1-q)^2}$.

## Eine notwendige Bedingung

> [!SATZ] Nullfolgenkriterium
> Konvergiert $\\sum a_k$, so ist $(a_k)$ eine Nullfolge: $a_k \\to 0$.

> [!BEWEIS]
> $a_n = s_n - s_{n-1}$, und beide Partialsummen konvergieren gegen denselben Wert $s$. Also $a_n \\to s - s = 0$.

Die Umkehrung gilt **nicht** – das ist der wichtigste Fehler im Umgang mit Reihen.

> [!SATZ] Die harmonische Reihe divergiert
> $$
> \\sum_{k=1}^\\infty \\frac1k = 1 + \\frac12 + \\frac13 + \\frac14 + \\dots = \\infty,
> $$
> obwohl $\\frac1k \\to 0$.

> [!BEWEIS]
> Fasse Blöcke zusammen: $\\frac13 + \\frac14 \\ge \\frac14 + \\frac14 = \\frac12$, $\\frac15 + \\dots + \\frac18 \\ge 4 \\cdot \\frac18 = \\frac12$, allgemein enthält der Block von $2^{m-1} + 1$ bis $2^m$ genau $2^{m-1}$ Summanden, jeder $\\ge 2^{-m}$, zusammen also $\\ge \\frac12$. Damit ist $s_{2^m} \\ge 1 + \\frac m2$, und die Partialsummen wachsen unbeschränkt.

Die Divergenz ist extrem langsam: $s_n \\approx \\ln n + 0{,}5772$. Um die Summe 20 zu überschreiten, braucht man rund 270 Millionen Summanden. Die harmonische Zahl $H_n$ taucht in der Algorithmik oft auf: Quicksort macht im Mittel $\\approx 2n H_n \\approx 2n\\ln n$ Vergleiche, und beim Sammelbilderproblem braucht man im Mittel $nH_n$ Käufe, um alle $n$ Bilder zu haben.

> [!SATZ] Die Reihen 1/kˢ
> $\\sum_{k=1}^\\infty \\frac{1}{k^s}$ konvergiert genau dann, wenn $s > 1$.

Für $s = 2$ fand Euler den Wert $\\frac{\\pi^2}{6}$. Die Grenze $s > 1$ entspricht genau der Grenze bei den uneigentlichen Integralen $\\int_1^\\infty x^{-s}\\dd x$ ([Integrationstechniken](#/mathe/analysis-2/integrationstechniken)) – kein Zufall, das **Integralkriterium** verknüpft beide.

## Konvergenzkriterien

Meist interessiert zuerst, **ob** eine Reihe konvergiert. Dafür gibt es Kriterien, die nur die Summanden betrachten.

> [!SATZ] Majorantenkriterium
> Ist $\\abs{a_k} \\le b_k$ für alle $k$ (ab einem Index) und konvergiert $\\sum b_k$, so konvergiert auch $\\sum a_k$ (sogar absolut). Ist umgekehrt $0 \\le b_k \\le a_k$ und divergiert $\\sum b_k$, so divergiert $\\sum a_k$ (Minorante).

> [!BEISPIEL] Vergleichen
> $\\sum \\frac{1}{k^2 + k}$ konvergiert, da $\\frac{1}{k^2 + k} \\le \\frac1{k^2}$. (Ihr Wert ist sogar exakt $1$: $\\frac{1}{k(k+1)} = \\frac1k - \\frac1{k+1}$ ist eine Teleskopsumme.) $\\sum \\frac{1}{\\sqrt k}$ divergiert, da $\\frac1{\\sqrt k} \\ge \\frac1k$.

> [!SATZ] Quotientenkriterium
> Gilt $\\lim_{k\\to\\infty} \\left\\lvert\\frac{a_{k+1}}{a_k}\\right\\rvert = q$, so konvergiert $\\sum a_k$ (absolut) für $q < 1$ und divergiert für $q > 1$. Für $q = 1$ ist keine Aussage möglich.

Das Kriterium vergleicht die Reihe im Grunde mit einer geometrischen Reihe. Es ist ideal bei Fakultäten und Potenzen.

> [!BEISPIEL] Fakultät schlägt Potenz
> $\\sum \\frac{x^k}{k!}$ für festes $x$: $\\left\\lvert\\frac{a_{k+1}}{a_k}\\right\\rvert = \\frac{\\abs x}{k + 1} \\to 0 < 1$. Die Reihe konvergiert für **jedes** $x$ – ihr Wert ist $\\e^x$ (siehe [Taylor-Reihen](#/mathe/analysis-1/taylor)).
>
> $\\sum \\frac{k^2}{2^k}$: Quotient $\\frac{(k+1)^2}{2k^2} \\to \\frac12$, konvergent.

> [!WARNING] Der Fall q = 1
> Für $\\sum\\frac1k$ und $\\sum\\frac1{k^2}$ ist der Quotient in beiden Fällen $\\to 1$ – die erste divergiert, die zweite konvergiert. Bei Brüchen aus Polynomen versagt das Quotientenkriterium immer; dort hilft der Vergleich mit $\\sum\\frac{1}{k^s}$.

Verwandt ist das **Wurzelkriterium**: $\\lim \\sqrt[k]{\\abs{a_k}} = q < 1$ ⇒ konvergent, $q > 1$ ⇒ divergent. Es ist bei Ausdrücken wie $\\left(\\frac{k}{2k+1}\\right)^k$ bequemer.

## Alternierende Reihen

> [!SATZ] Leibniz-Kriterium
> Ist $(b_k)$ eine **monoton fallende Nullfolge**, so konvergiert die alternierende Reihe $\\sum_{k=0}^\\infty (-1)^k b_k$. Der Fehler beim Abbruch nach $n$ Summanden ist höchstens $b_{n+1}$: $\\abs{s - s_n} \\le b_{n+1}$.

> [!BEISPIEL] Alternierende harmonische Reihe
> $1 - \\frac12 + \\frac13 - \\frac14 + \\dots = \\ln 2 \\approx 0{,}6931$ konvergiert nach Leibniz – obwohl die harmonische Reihe ohne Vorzeichenwechsel divergiert. Für 4 Nachkommastellen Genauigkeit braucht man aber nach der Fehlerabschätzung etwa 20 000 Summanden: Leibniz-Reihen konvergieren oft sehr langsam.

## Absolute Konvergenz

> [!DEFINITION] Absolut konvergent
> $\\sum a_k$ heißt **absolut konvergent**, wenn $\\sum \\abs{a_k}$ konvergiert. Jede absolut konvergente Reihe konvergiert. Konvergente, aber nicht absolut konvergente Reihen heißen **bedingt konvergent**.

Der Unterschied ist mehr als Technik: Bei absolut konvergenten Reihen darf man die Summanden **beliebig umordnen**, der Wert bleibt gleich. Bei bedingt konvergenten Reihen nicht – nach dem **Riemannschen Umordnungssatz** kann man die alternierende harmonische Reihe so umordnen, dass sie gegen **jeden beliebigen** Wert konvergiert oder divergiert.

> [!TIP] Summationsreihenfolge im Computer
> Auch endliche Summen von Gleitkommazahlen hängen von der Reihenfolge ab ([Gleitkommazahlen](#/mathe/numerik/gleitkomma)). Wer Reihen numerisch auswertet, summiert am besten **von den kleinen zu den großen** Summanden oder nutzt die Kahan-Summation – sonst gehen die kleinen Beiträge in der großen Teilsumme unter.

## Zusammenfassung

- Reihe = Folge der Partialsummen; $\\sum q^k = \\frac1{1-q}$ für $\\abs q < 1$.
- Notwendig: $a_k \\to 0$ – aber nicht hinreichend (harmonische Reihe divergiert, $H_n \\approx \\ln n$).
- $\\sum k^{-s}$ konvergiert genau für $s > 1$; Majoranten-, Quotienten- und Wurzelkriterium vergleichen mit bekannten Reihen.
- Leibniz für alternierende Reihen mit Fehlerschranke $b_{n+1}$; nur absolut konvergente Reihen darf man umordnen.
`;export{e as default};
