const n=`---
id: vollstaendige-induktion
title: Vollständige Induktion
module: grundlagen
order: 5
difficulty: fortgeschritten
minutes: 45
summary: Summen- und Produktzeichen, das Induktionsprinzip mit Anfang, Annahme und Schritt, Standardbeispiele (Gaußsumme, geometrische Summe, Bernoulli, Teilbarkeit), starke Induktion und typische Fehler.
tags: [Induktion, Summenzeichen, Gaußsumme, Geometrische Summe, Bernoulli-Ungleichung, Starke Induktion]
requires: [beweistechniken]
---

## Summen- und Produktzeichen

Induktion beweist meist Formeln mit Summen. Statt $a_1 + a_2 + \\dots + a_n$ schreibt man
$$
\\sum_{k=1}^{n} a_k \\qquad\\text{und analog}\\qquad \\prod_{k=1}^{n} a_k = a_1 \\cdot a_2 \\cdots a_n .
$$
$k$ ist der **Laufindex** (beliebig umbenennbar), $1$ und $n$ sind die Grenzen. Eine Summe mit oberer Grenze kleiner als die untere ist **leer** und hat den Wert $0$; das leere Produkt ist $1$ – daher $0! = 1$.

Die wichtigsten Rechenregeln:

| Regel | Formel |
|---|---|
| Linearität | $\\sum_{k=1}^{n} (\\alpha a_k + \\beta b_k) = \\alpha \\sum_{k=1}^{n} a_k + \\beta \\sum_{k=1}^{n} b_k$ |
| Letzten Summanden abspalten | $\\sum_{k=1}^{n+1} a_k = \\sum_{k=1}^{n} a_k + a_{n+1}$ |
| Indexverschiebung | $\\sum_{k=1}^{n} a_k = \\sum_{j=0}^{n-1} a_{j+1}$ |
| Teleskopsumme | $\\sum_{k=1}^{n} (a_{k+1} - a_k) = a_{n+1} - a_1$ |
| Konstante Summanden | $\\sum_{k=1}^{n} c = n \\cdot c$ |

> [!TIP] Summen sind Schleifen
> $\\sum_{k=1}^{n} a_k$ ist exakt \`s = 0; for (k = 1; k <= n; k++) s += a(k);\`. Das Abspalten des letzten Summanden entspricht dem letzten Schleifendurchlauf – und genau diesen Schritt braucht man im Induktionsbeweis.

## Das Induktionsprinzip

> [!SATZ] Prinzip der vollständigen Induktion
> Sei $A(n)$ eine Aussageform über $n \\in \\N$ und $n_0 \\in \\N$. Gilt
> 1. **Induktionsanfang:** $A(n_0)$ ist wahr, und
> 2. **Induktionsschritt:** für jedes $n \\ge n_0$ folgt aus $A(n)$ auch $A(n+1)$,
>
> dann ist $A(n)$ für **alle** $n \\ge n_0$ wahr.

Anschaulich: Der erste Dominostein fällt, und jeder fallende Stein reißt den nächsten um. Die Annahme $A(n)$ im Schritt heißt **Induktionsvoraussetzung** (IV) oder Induktionsannahme; sie wird nicht für alle $n$ behauptet, sondern nur benutzt, um $A(n+1)$ zu zeigen.

> [!EXPERT] Warum gilt das Prinzip?
> Es ist äquivalent zur **Wohlordnung** von $\\N$: Jede nichtleere Teilmenge hat ein kleinstes Element. Gäbe es Gegenbeispiele, gäbe es ein kleinstes $m > n_0$ mit $\\lnot A(m)$; dann wäre $A(m-1)$ wahr und der Induktionsschritt lieferte $A(m)$ – Widerspruch. In der axiomatischen Konstruktion der natürlichen Zahlen (Peano-Axiome) ist das Induktionsprinzip selbst ein Axiom.

## Das Standardbeispiel: die Gaußsumme

> [!SATZ] Gaußsche Summenformel
> Für alle $n \\in \\N$ gilt
> $$
> \\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}.
> $$

> [!BEWEIS]
> **Induktionsanfang** ($n = 0$): Links steht die leere Summe $0$, rechts $\\tfrac{0 \\cdot 1}{2} = 0$. ✓
>
> **Induktionsvoraussetzung:** Für ein festes $n \\in \\N$ gelte $\\sum_{k=1}^{n} k = \\tfrac{n(n+1)}{2}$.
>
> **Induktionsschritt** ($n \\to n+1$): Zu zeigen ist $\\sum_{k=1}^{n+1} k = \\tfrac{(n+1)(n+2)}{2}$. Wir spalten den letzten Summanden ab und benutzen die IV:
> $$
> \\sum_{k=1}^{n+1} k = \\sum_{k=1}^{n} k + (n+1) \\overset{\\text{IV}}{=} \\frac{n(n+1)}{2} + (n+1) = \\frac{n(n+1) + 2(n+1)}{2} = \\frac{(n+1)(n+2)}{2}.
> $$
> Damit gilt die Formel für alle $n \\in \\N$.

Das Muster ist immer gleich: **Abspalten – IV einsetzen – auf die Zielform umformen.** Es lohnt sich, die Zielform $A(n+1)$ vorher explizit hinzuschreiben.

> [!TIP] Laufzeit verschachtelter Schleifen
> Zwei Schleifen \`for i in range(n): for j in range(i): ...\` führen den inneren Rumpf $\\sum_{i=0}^{n-1} i = \\tfrac{(n-1)n}{2}$-mal aus – das ist $\\Theta(n^2)$, wie bei Bubble Sort oder dem Vergleich aller Paare.

## Weitere Klassiker

### Geometrische Summe

> [!SATZ] Geometrische Summenformel
> Für $q \\neq 1$ und alle $n \\in \\N$ gilt
> $$
> \\sum_{k=0}^{n} q^k = \\frac{q^{n+1} - 1}{q - 1}.
> $$

> [!BEWEIS]
> **Anfang** ($n = 0$): $q^0 = 1 = \\tfrac{q - 1}{q - 1}$. ✓
>
> **Schritt:** Unter der IV gilt
> $$
> \\sum_{k=0}^{n+1} q^k = \\frac{q^{n+1} - 1}{q - 1} + q^{n+1} = \\frac{q^{n+1} - 1 + q^{n+2} - q^{n+1}}{q - 1} = \\frac{q^{n+2} - 1}{q - 1}.
> $$

Für $q = 2$: $1 + 2 + 4 + \\dots + 2^n = 2^{n+1} - 1$. Deshalb hat ein vollständiger Binärbaum der Höhe $n$ genau $2^{n+1} - 1$ Knoten, und ein vorzeichenloser $n$-Bit-Integer reicht bis $2^n - 1$.

### Eine Ungleichung: Bernoulli

> [!SATZ] Bernoulli-Ungleichung
> Für alle reellen $x \\ge -1$ und alle $n \\in \\N$ gilt $(1 + x)^n \\ge 1 + nx$.

> [!BEWEIS]
> **Anfang** ($n = 0$): $(1+x)^0 = 1 \\ge 1 + 0$. ✓
>
> **Schritt:** Wegen $x \\ge -1$ ist $1 + x \\ge 0$; daher darf die IV mit $(1+x)$ multipliziert werden, ohne dass sich das Ungleichheitszeichen umdreht:
> $$
> (1 + x)^{n+1} = (1+x)^n (1 + x) \\overset{\\text{IV}}{\\ge} (1 + nx)(1 + x) = 1 + (n+1)x + nx^2 \\ge 1 + (n+1)x .
> $$
> Im letzten Schritt wurde $nx^2 \\ge 0$ weggelassen.

Bei Ungleichungen ist der Schritt typischerweise „IV einsetzen und dann großzügig abschätzen“. Man muss nur sicherstellen, dass jede Abschätzung in die richtige Richtung geht.

### Teilbarkeit

> [!SATZ]
> Für alle $n \\in \\N$ ist $n^3 - n$ durch $6$ teilbar.

> [!BEWEIS]
> **Anfang:** $0^3 - 0 = 0 = 6 \\cdot 0$. ✓
>
> **Schritt:** Es gelte $6 \\mid n^3 - n$. Dann ist
> $$
> (n+1)^3 - (n+1) = n^3 + 3n^2 + 3n + 1 - n - 1 = (n^3 - n) + 3n(n+1).
> $$
> Der erste Summand ist nach IV durch 6 teilbar. Im zweiten ist $n(n+1)$ gerade (siehe [Beweistechniken](#/mathe/grundlagen/beweistechniken)), also ist $3n(n+1)$ durch $6$ teilbar. Damit ist die Summe durch 6 teilbar.

## Starke Induktion

Manchmal braucht der Schritt nicht nur $A(n)$, sondern auch kleinere Fälle.

> [!SATZ] Starke (verallgemeinerte) Induktion
> Gilt $A(n_0)$ und folgt für jedes $n \\ge n_0$ aus „$A(k)$ für alle $n_0 \\le k \\le n$“ die Aussage $A(n+1)$, dann gilt $A(n)$ für alle $n \\ge n_0$.

> [!SATZ] Existenz der Primfaktorzerlegung
> Jede natürliche Zahl $n \\ge 2$ ist ein Produkt von Primzahlen.

> [!BEWEIS]
> **Anfang:** $2$ ist prim, also ein Produkt aus einem Faktor.
>
> **Schritt:** Alle $k$ mit $2 \\le k \\le n$ seien Produkte von Primzahlen. Ist $n+1$ prim, sind wir fertig. Sonst ist $n + 1 = a \\cdot b$ mit $2 \\le a, b \\le n$. Nach IV sind $a$ und $b$ Produkte von Primzahlen, also auch $n+1$.

Die einfache Induktion hätte hier nicht gereicht: Über $n$ selbst wissen wir nichts Nützliches für $n + 1$, wohl aber über die Faktoren $a$ und $b$.

> [!BEISPIEL] Rekursiv definierte Folgen
> Die Fibonacci-Zahlen $F_0 = 0$, $F_1 = 1$, $F_{n+1} = F_n + F_{n-1}$ erfüllen $F_n < 2^n$. Hier braucht der Schritt die beiden Vorgänger und daher **zwei** Induktionsanfänge ($n = 0$ und $n = 1$): $F_{n+1} = F_n + F_{n-1} < 2^n + 2^{n-1} < 2^n + 2^n = 2^{n+1}$.

## Typische Fehler

> [!MISTAKE] Induktionsanfang vergessen
> „Aus $n^2 + n$ ungerade folgt $(n+1)^2 + (n+1) = (n^2 + n) + 2(n+1)$ ungerade.“ Der Schritt ist korrekt – aber die Aussage ist für jedes $n$ falsch, weil es keinen Anfang gibt. Ohne Anfang beweist der Schritt nichts.

> [!MISTAKE] Schritt, der nicht für alle n funktioniert
> „Alle Pferde haben dieselbe Farbe“: Aus einer Herde von $n+1$ Pferden nimmt man einmal das erste, einmal das letzte heraus; beide Teilherden sind nach IV einfarbig und überlappen sich. Das Argument scheitert genau bei $n + 1 = 2$, wo die Teilherden **nicht** überlappen. Ein Schritt muss für jedes $n \\ge n_0$ gelten.

> [!MISTAKE] Die Behauptung voraussetzen
> Im Schritt darf man nur $A(n)$ benutzen, nicht $A(n+1)$. Wer mit der zu zeigenden Gleichung beginnt und sie zu einer wahren Aussage umformt, hat nur gezeigt, dass $A(n+1)$ etwas Wahres impliziert – das beweist $A(n+1)$ nicht (es sei denn, alle Schritte sind Äquivalenzen und das wird gesagt).

## Induktion und Programme

Induktion ist das Beweisprinzip hinter **Rekursion** und **Schleifen**:

- Eine rekursive Funktion ist korrekt, wenn der Basisfall stimmt (Anfang) und jeder rekursive Aufruf unter der Annahme korrekter Teilergebnisse das richtige Ergebnis liefert (Schritt).
- Eine **Schleifeninvariante** ist eine Aussage, die vor der Schleife gilt (Anfang) und von jedem Durchlauf erhalten bleibt (Schritt). Bei \`s = 0; for k in 1..n: s += k\` lautet sie „nach $i$ Durchläufen ist $s = \\sum_{k=1}^{i} k$“ – zusammen mit der Gaußformel folgt $s = \\tfrac{n(n+1)}{2}$.

## Zusammenfassung

- Schema: Anfang $A(n_0)$ zeigen, IV formulieren, Schritt $A(n) \\Rightarrow A(n+1)$ für beliebiges $n \\ge n_0$ beweisen.
- Bei Summen: letzten Summanden abspalten, IV einsetzen, auf die Zielform bringen.
- Bei Ungleichungen: IV einsetzen und in die richtige Richtung abschätzen.
- Starke Induktion darf alle kleineren Fälle benutzen; rekursive Folgen brauchen ggf. mehrere Anfänge.
`;export{n as default};
