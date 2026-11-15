const e=`---
id: gleitkomma
title: Gleitkommazahlen, Rundungsfehler und Kondition
module: numerik
order: 1
difficulty: fortgeschritten
minutes: 45
summary: Wie IEEE 754 reelle Zahlen speichert, Maschinengenauigkeit, absolute und relative Fehler, Auslöschung, Kondition eines Problems und Stabilität eines Algorithmus – mit Gegenmaßnahmen für die Praxis.
tags: [Gleitkomma, IEEE 754, Maschinengenauigkeit, Rundungsfehler, Auslöschung, Kondition, Stabilität]
requires: [folgen-grenzwerte]
---

## Warum 0.1 + 0.2 ≠ 0.3

In fast jeder Programmiersprache ergibt \`0.1 + 0.2 == 0.3\` den Wert \`false\`; ausgegeben wird \`0.30000000000000004\`. Das ist kein Fehler der Sprache, sondern eine Folge davon, wie Computer reelle Zahlen speichern: mit endlich vielen **Binärstellen**. $0{,}1$ ist im Zweiersystem ein unendlicher periodischer Bruch $0{,}0\\overline{0011}_2$ – genauso wie $\\tfrac13 = 0{,}333\\ldots$ im Zehnersystem – und muss gerundet werden.

Die Numerik untersucht, wie sich solche Rundungsfehler durch Rechnungen fortpflanzen und wie man Verfahren baut, die trotzdem verlässliche Ergebnisse liefern.

## Das Format IEEE 754

> [!DEFINITION] Gleitkommazahl
> Eine normalisierte binäre **[[Gleitkommazahl]]** hat die Form
> $$
> x = (-1)^s \\cdot 1{,}m_1 m_2 \\dots m_t{}_{(2)} \\cdot 2^{e},
> $$
> mit Vorzeichenbit $s$, $t$ Mantissenbits $m_i$ und einem Exponenten $e$ aus einem festen Bereich. Die führende $1$ wird nicht gespeichert („hidden bit“).

| Format | Bits gesamt | Mantisse $t$ | Exponent | Dezimalstellen | Bereich ca. |
|---|---|---|---|---|---|
| binary32 (\`float\`) | 32 | 23 | 8 Bit | ca. 7 | $10^{\\pm 38}$ |
| binary64 (\`double\`, JS \`number\`) | 64 | 52 | 11 Bit | ca. 16 | $10^{\\pm 308}$ |

Dazu kommen Sonderwerte: $\\pm 0$, $\\pm\\infty$ (etwa bei \`1/0.0\`), \`NaN\` („not a number“, etwa \`0/0\` oder \`sqrt(-1)\`) und **subnormale** Zahlen nahe null.

> [!TIP] Gleitkomma heißt „gleitendes Komma“
> Der Exponent verschiebt das Komma. Dadurch ist der **relative** Abstand benachbarter Zahlen überall etwa gleich: Zwischen 1 und 2 liegen genauso viele \`double\`-Werte ($2^{52}$) wie zwischen $2^{100}$ und $2^{101}$. Der **absolute** Abstand wächst mit der Größe – ab $2^{53} \\approx 9 \\cdot 10^{15}$ sind nicht einmal mehr alle ganzen Zahlen darstellbar (\`Number.MAX_SAFE_INTEGER\` in JavaScript).

## Maschinengenauigkeit und Rundung

> [!DEFINITION] Maschinengenauigkeit
> Die **Maschinengenauigkeit** $\\varepsilon_{\\text{mach}}$ ist der Abstand von $1$ zur nächstgrößeren Gleitkommazahl: $\\varepsilon_{\\text{mach}} = 2^{-t}$. Für \`double\` ist $\\varepsilon_{\\text{mach}} = 2^{-52} \\approx 2{,}22 \\cdot 10^{-16}$.

Beim Runden zur nächsten Gleitkommazahl gilt für jede Zahl $x$ im darstellbaren Bereich
$$
\\mathrm{fl}(x) = x(1 + \\delta) \\quad\\text{mit}\\quad \\abs\\delta \\le \\tfrac12\\varepsilon_{\\text{mach}} = u .
$$
Der **relative** Rundungsfehler ist also höchstens $u \\approx 1{,}1 \\cdot 10^{-16}$. IEEE 754 garantiert dasselbe für die Grundrechenarten: Das Ergebnis von $x \\oplus y$ ist das exakte Ergebnis, korrekt gerundet.

> [!DEFINITION] Fehlermaße
> Ist $\\tilde x$ eine Näherung für $x$, so heißt $\\abs{\\tilde x - x}$ der **absolute** und $\\frac{\\abs{\\tilde x - x}}{\\abs x}$ (für $x \\neq 0$) der **relative Fehler**.

Der relative Fehler ist das sinnvolle Maß für Gleitkommarechnung: Ein Fehler von $1$ mm ist bei der Länge einer Brücke irrelevant, bei einem Mikrochip katastrophal.

> [!MISTAKE] Gleitkommazahlen auf Gleichheit prüfen
> \`if (a == b)\` ist bei berechneten Werten fast immer falsch. Richtig ist ein Vergleich mit Toleranz, am besten relativ: \`abs(a - b) <= tol * max(abs(a), abs(b))\`. Python bietet \`math.isclose\`, NumPy \`np.isclose\`. (Auch der Mathe-Campus prüft Zahlenantworten so.)

> [!DANGER] Geldbeträge
> Beträge niemals als \`float\`/\`double\` speichern. $0{,}10$ € ist nicht exakt darstellbar; über Millionen Buchungen summieren sich die Fehler. Stattdessen ganze Cent-Beträge (\`long\`) oder Dezimaltypen (\`BigDecimal\`, \`decimal.Decimal\`, SQL \`NUMERIC\`) verwenden.

## Auslöschung

Die gefährlichste Fehlerquelle ist die **Subtraktion fast gleicher Zahlen**. Die führenden Stellen heben sich auf, und übrig bleiben die durch Rundung verfälschten hinteren Stellen – der relative Fehler explodiert.

> [!BEISPIEL] Auslöschung in der Mitternachtsformel
> Die kleinere Nullstelle von $x^2 - 10^8 x + 1 = 0$ ist ungefähr $10^{-8}$. Die Formel
> $$
> x_2 = \\frac{10^8 - \\sqrt{10^{16} - 4}}{2}
> $$
> subtrahiert zwei fast gleiche Zahlen; in \`double\` ergibt sie etwa $7{,}45 \\cdot 10^{-9}$ – ein relativer Fehler von **25 %**. Stabil ist der Satz von Vieta: Die größere Wurzel $x_1 = \\frac{10^8 + \\sqrt{10^{16} - 4}}{2}$ ist unproblematisch (Addition), und wegen $x_1 x_2 = 1$ ist $x_2 = \\frac{1}{x_1} \\approx 1{,}0000 \\cdot 10^{-8}$, korrekt auf alle Stellen.

Weitere typische Fälle und ihre Abhilfen:

| instabil | stabil umgeformt |
|---|---|
| $\\sqrt{x + 1} - \\sqrt x$ für großes $x$ | $\\dfrac{1}{\\sqrt{x + 1} + \\sqrt x}$ |
| $1 - \\cos x$ für kleines $x$ | $2\\sin^2\\frac x2$ |
| $\\e^x - 1$ für kleines $x$ | \`expm1(x)\` |
| $\\ln(1 + x)$ für kleines $x$ | \`log1p(x)\` |
| Varianz $\\frac1n\\sum x_i^2 - \\bar x^2$ | zweipassig $\\frac1n\\sum (x_i - \\bar x)^2$ oder Welford-Algorithmus |

> [!TIP] Summation
> Beim Aufsummieren vieler Zahlen geht Genauigkeit verloren, wenn kleine Summanden zu einer großen Teilsumme addiert werden. Abhilfen: zuerst die kleinen Zahlen addieren, paarweise (Baum-)Summation wie in NumPy oder die **Kahan-Summation**, die den Rundungsfehler jedes Schritts in einer Korrekturvariable mitführt. Python bietet \`math.fsum\` für korrekt gerundete Summen.

## Kondition: Wie empfindlich ist das Problem?

Manche Probleme sind von Natur aus empfindlich gegenüber kleinen Änderungen der Eingabe – unabhängig vom Algorithmus.

> [!DEFINITION] Konditionszahl
> Für eine differenzierbare Funktion $f$ misst die (relative) **Konditionszahl**
> $$
> \\kappa_f(x) = \\left\\lvert \\frac{x\\, f'(x)}{f(x)} \\right\\rvert,
> $$
> wie stark sich ein relativer Eingabefehler auf den relativen Ausgabefehler auswirkt: relativer Fehler im Ergebnis $\\approx \\kappa \\cdot$ relativer Fehler in $x$.

Ist $\\kappa$ klein (etwa $\\le 10$), heißt das Problem **gut konditioniert**, bei großem $\\kappa$ **schlecht konditioniert**.

> [!BEISPIEL] Kondition elementarer Operationen
> - $f(x) = \\sqrt x$: $\\kappa = \\left\\lvert\\frac{x \\cdot \\frac{1}{2\\sqrt x}}{\\sqrt x}\\right\\rvert = \\frac12$ – sehr gut konditioniert.
> - $f(x) = x - a$ (Subtraktion einer festen Zahl): $\\kappa = \\left\\lvert\\frac{x}{x - a}\\right\\rvert$ – für $x \\approx a$ beliebig groß. Das ist die Auslöschung, mathematisch gefasst.
> - $f(x) = \\e^x$: $\\kappa = \\abs x$ – für große $\\abs x$ schlecht konditioniert.

Bei linearen Gleichungssystemen $A\\vec x = \\vec b$ spielt die Konditionszahl der Matrix $\\kappa(A) = \\norm{A}\\,\\norm{A^{-1}}$ diese Rolle. Faustregel: Mit \`double\` verliert man etwa $\\log_{10}\\kappa(A)$ der 16 gültigen Dezimalstellen. Die Hilbert-Matrix $H_{ij} = \\frac{1}{i + j - 1}$ der Größe $12$ hat $\\kappa \\approx 10^{16}$ – das Ergebnis ist praktisch wertlos, egal wie sorgfältig man rechnet.

## Stabilität: Wie gut ist der Algorithmus?

> [!DEFINITION] Stabilität
> Ein Algorithmus heißt (rückwärts-)**stabil**, wenn sein berechnetes Ergebnis das exakte Ergebnis für eine **leicht gestörte Eingabe** ist – mit einer Störung in der Größenordnung von $\\varepsilon_{\\text{mach}}$.

Kondition und Stabilität ergänzen sich:

$$
\\text{Fehler im Ergebnis} \\;\\lesssim\\; \\text{Kondition des Problems} \\times \\text{Stabilitätsfehler des Algorithmus} .
$$

Ein stabiler Algorithmus auf einem gut konditionierten Problem liefert ein genaues Ergebnis. Ein schlecht konditioniertes Problem bleibt auch mit dem besten Algorithmus ungenau; ein instabiler Algorithmus (wie die naive Mitternachtsformel) macht selbst gut konditionierte Probleme ungenau.

Das Gauß-Verfahren **ohne** Pivotisierung ist instabil: Ein winziges Pivotelement wie $10^{-20}$ erzeugt riesige Multiplikatoren. Mit **Spaltenpivotisierung** (betragsgrößtes Element als Pivot) ist es in der Praxis stabil – deshalb tun das alle Bibliotheken (siehe [LGS und Gauß](#/mathe/lineare-algebra/lgs-gauss)).

## Zusammenfassung

- \`double\` speichert etwa 16 Dezimalstellen; Rundung erzeugt relative Fehler bis $u \\approx 1{,}1\\cdot10^{-16}$.
- Nie auf exakte Gleichheit prüfen; Geldbeträge nicht als Gleitkommazahl speichern.
- Auslöschung bei der Subtraktion fast gleicher Zahlen durch Umformen vermeiden (Vieta, \`expm1\`, \`log1p\`).
- Kondition ist eine Eigenschaft des Problems, Stabilität eine des Algorithmus; zusammen bestimmen sie die Genauigkeit.
`;export{e as default};
