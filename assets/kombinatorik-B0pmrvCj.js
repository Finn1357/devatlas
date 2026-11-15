const e=`---
id: kombinatorik
title: Kombinatorik
module: diskrete-mathematik
order: 1
difficulty: einsteiger
minutes: 45
summary: Summen- und Produktregel, Permutationen, Variationen und Kombinationen mit und ohne Wiederholung, Binomialkoeffizienten mit Pascalschem Dreieck und binomischem Lehrsatz sowie das Schubfachprinzip.
tags: [Kombinatorik, Permutation, Kombination, Binomialkoeffizient, Pascalsches Dreieck, Schubfachprinzip]
requires: [mengen, vollstaendige-induktion]
---

## Zählen als Werkzeug

Wie viele Passwörter gibt es mit 8 Zeichen? Wie viele Vergleiche braucht ein Sortierverfahren mindestens? Wie wahrscheinlich ist ein Sechser im Lotto? Die **Kombinatorik** beantwortet solche Fragen, indem sie Abzählprobleme auf wenige Grundmuster zurückführt. Sie ist die Grundlage der Laplace-Wahrscheinlichkeit ([Wahrscheinlichkeitsräume](#/mathe/stochastik/wahrscheinlichkeitsraeume)) und der Laufzeitanalyse von Brute-Force-Algorithmen.

## Summen- und Produktregel

> [!SATZ] Summenregel
> Lässt sich eine Menge in disjunkte Teile $A_1, \\dots, A_k$ zerlegen, so gilt $\\abs{A_1 \\cup \\dots \\cup A_k} = \\abs{A_1} + \\dots + \\abs{A_k}$. Überlappen die Teile, hilft [Inklusion-Exklusion](#/mathe/grundlagen/mengen).

> [!SATZ] Produktregel
> Besteht eine Auswahl aus $k$ aufeinanderfolgenden Entscheidungen mit $n_1, n_2, \\dots, n_k$ Möglichkeiten (wobei die Anzahl jeder Stufe nicht von den vorherigen Entscheidungen abhängt), so gibt es $n_1 \\cdot n_2 \\cdots n_k$ Gesamtmöglichkeiten. Formal: $\\abs{A_1 \\times \\dots \\times A_k} = \\abs{A_1}\\cdots\\abs{A_k}$.

> [!BEISPIEL] Passwörter
> Ein Passwort aus 8 Zeichen mit 26 Klein-, 26 Großbuchstaben, 10 Ziffern und 32 Sonderzeichen (94 Zeichen): $94^8 \\approx 6{,}1 \\cdot 10^{15}$ Möglichkeiten. Mit $10^{10}$ Versuchen pro Sekunde (eine GPU gegen einen schnellen Hash) dauert das Durchprobieren gut 7 Tage. Mit 12 Zeichen: $94^{12} \\approx 4{,}8 \\cdot 10^{23}$, rund 1,5 Millionen Jahre. Länge schlägt Komplexität – siehe auch [Passwörter & Kryptografie](#/artikel/passwoerter-kryptografie).

## Die vier Grundmuster

Aus $n$ unterscheidbaren Objekten werden $k$ ausgewählt. Entscheidend sind zwei Fragen: **Kommt es auf die Reihenfolge an?** und **Darf ein Objekt mehrfach gewählt werden?**

| | mit Reihenfolge | ohne Reihenfolge |
|---|---|---|
| **mit Wiederholung** | $n^k$ | $\\binom{n + k - 1}{k}$ |
| **ohne Wiederholung** | $\\dfrac{n!}{(n-k)!}$ | $\\binom{n}{k} = \\dfrac{n!}{k!\\,(n-k)!}$ |

### Mit Reihenfolge

- **Mit Wiederholung** (Variation): Jede der $k$ Positionen hat $n$ Möglichkeiten, also $n^k$. Beispiele: PINs ($10^4$), Bitstrings der Länge $k$ ($2^k$), Wörter über einem Alphabet.
- **Ohne Wiederholung:** $n$ Möglichkeiten für die erste Position, $n - 1$ für die zweite, …: $n(n-1)\\cdots(n-k+1) = \\frac{n!}{(n-k)!}$. Beispiel: Gold, Silber, Bronze unter 10 Läufern: $10 \\cdot 9 \\cdot 8 = 720$.

Der Spezialfall $k = n$ sind die **Permutationen**: $n!$ Anordnungen von $n$ Objekten. $n!$ wächst rasant: $10! = 3\\,628\\,800$, $20! \\approx 2{,}4 \\cdot 10^{18}$. Ein Brute-Force-Algorithmus für das Problem des Handlungsreisenden mit 20 Städten ist deshalb hoffnungslos.

> [!TIP] Untere Schranke für Sortieren
> Ein vergleichsbasierter Sortieralgorithmus muss jede der $n!$ möglichen Anordnungen unterscheiden. Jeder Vergleich hat zwei Ausgänge, also braucht er im schlechtesten Fall mindestens $\\log_2(n!)$ Vergleiche. Wegen $\\log_2(n!) \\approx n\\log_2 n - 1{,}44\\,n$ kann **kein** vergleichsbasiertes Sortierverfahren schneller als $\\Theta(n\\log n)$ sein – Mergesort und Heapsort sind also optimal.

### Ohne Reihenfolge: Binomialkoeffizienten

> [!DEFINITION] Binomialkoeffizient
> Für $0 \\le k \\le n$ ist der **[[Binomialkoeffizient]]**
> $$
> \\binom nk = \\frac{n!}{k!\\,(n - k)!}
> $$
> die Anzahl der $k$-elementigen Teilmengen einer $n$-elementigen Menge („$n$ über $k$“).

**Begründung:** Es gibt $\\frac{n!}{(n-k)!}$ geordnete Auswahlen. Jede ungeordnete Auswahl entsteht dabei $k!$-mal (in jeder Reihenfolge ihrer Elemente). Also gibt es $\\frac{n!}{(n-k)!\\,k!}$ ungeordnete.

> [!BEISPIEL] Lotto
> 6 aus 49: $\\binom{49}{6} = \\frac{49 \\cdot 48 \\cdot 47 \\cdot 46 \\cdot 45 \\cdot 44}{6!} = 13\\,983\\,816$. Die Wahrscheinlichkeit für einen Sechser mit einem Tipp ist also etwa $1 : 14$ Millionen. Für **genau 3 Richtige** wählt man 3 der 6 Gewinnzahlen und 3 der 43 Nieten: $\\frac{\\binom63\\binom{43}{3}}{\\binom{49}6} = \\frac{20 \\cdot 12\\,341}{13\\,983\\,816} \\approx 1{,}77\\,\\%$.

### Ohne Reihenfolge, mit Wiederholung

Wie viele Möglichkeiten gibt es, $k$ gleiche Kugeln auf $n$ Fächer zu verteilen (oder $k$ Kugeln aus $n$ Sorten zu ziehen, nur die Anzahlen zählen)? Mit dem **Stars-and-Bars**-Trick: Man schreibt die $k$ Kugeln als Sterne und trennt die $n$ Fächer durch $n - 1$ Striche, etwa \`**|*||***\` für $k = 6$, $n = 4$. Jede Anordnung von $k$ Sternen und $n - 1$ Strichen entspricht genau einer Verteilung:
$$
\\binom{n + k - 1}{k} .
$$
Beispiel: 3 Kugeln Eis aus 5 Sorten (Becher, Reihenfolge egal, Sorten dürfen sich wiederholen): $\\binom{7}{3} = 35$.

## Eigenschaften der Binomialkoeffizienten

> [!SATZ] Rechenregeln
> $$
> \\binom n0 = \\binom nn = 1, \\qquad \\binom nk = \\binom{n}{n - k}, \\qquad \\binom nk = \\binom{n-1}{k-1} + \\binom{n-1}{k} .
> $$

> [!BEWEIS] Rekursionsformel durch Abzählen
> Betrachte ein festes Element $x$ einer $n$-elementigen Menge. Eine $k$-elementige Teilmenge enthält $x$ entweder (dann wählt man die übrigen $k - 1$ Elemente aus den restlichen $n - 1$: $\\binom{n-1}{k-1}$ Möglichkeiten) oder nicht (dann alle $k$ aus den restlichen $n-1$: $\\binom{n-1}{k}$). Die Summenregel liefert die Formel.

Die Rekursion erzeugt das **Pascalsche Dreieck**, in dem jede Zahl die Summe der beiden darüber ist:
$$
\\begin{array}{ccccccccccc}
&&&&& 1 &&&&& \\\\
&&&& 1 && 1 &&&& \\\\
&&& 1 && 2 && 1 &&& \\\\
&& 1 && 3 && 3 && 1 && \\\\
& 1 && 4 && 6 && 4 && 1 & \\\\
1 && 5 && 10 && 10 && 5 && 1
\\end{array}
$$

> [!TIP] Binomialkoeffizienten berechnen
> Nicht über Fakultäten rechnen – $50!$ läuft in 64-Bit-Ganzzahlen über, obwohl $\\binom{50}{25} \\approx 1{,}26\\cdot10^{14}$ noch passt. Stattdessen schrittweise: \`r = 1; for i in 1..k: r = r * (n - k + i) / i\` – jedes Zwischenergebnis ist selbst ein Binomialkoeffizient und damit ganzzahlig. Python hat \`math.comb(n, k)\`.

> [!SATZ] Binomischer Lehrsatz
> Für alle Zahlen $a, b$ und $n \\in \\N$ gilt
> $$
> (a + b)^n = \\sum_{k=0}^{n} \\binom nk a^k b^{n-k} .
> $$

Beim Ausmultiplizieren von $(a + b)(a + b)\\cdots(a + b)$ wählt man aus jedem Faktor $a$ oder $b$; der Term $a^k b^{n-k}$ entsteht so oft, wie man $k$ der $n$ Faktoren für $a$ auswählen kann. Folgerungen: Mit $a = b = 1$ ist $\\sum_k \\binom nk = 2^n$ (die Anzahl aller Teilmengen), mit $a = -1$, $b = 1$ ist $\\sum_k (-1)^k \\binom nk = 0$.

## Das Schubfachprinzip

> [!SATZ] Schubfachprinzip
> Werden $m$ Objekte auf $n$ Schubfächer verteilt und ist $m > n$, so enthält mindestens ein Fach mindestens zwei Objekte. Allgemeiner enthält ein Fach mindestens $\\left\\lceil \\frac mn \\right\\rceil$ Objekte.

So einfach das klingt, so mächtig ist es:
- Unter 367 Personen haben zwei am selben Tag Geburtstag.
- Jede verlustfreie Kompression muss manche Dateien **vergrößern**: Es gibt $2^n$ Dateien der Länge $n$, aber nur $2^n - 1$ kürzere.
- Jede Hashfunktion von langen Eingaben auf feste Länge hat Kollisionen (siehe [Abbildungen](#/mathe/grundlagen/abbildungen)).

> [!BEISPIEL] Teilsummen
> Unter beliebigen 10 ganzen Zahlen gibt es stets einige (aufeinanderfolgende), deren Summe durch 10 teilbar ist. Betrachte die Präfixsummen $s_0 = 0, s_1, \\dots, s_{10}$ – das sind 11 Zahlen, aber es gibt nur 10 Reste modulo 10. Also haben zwei denselben Rest, $s_i \\equiv s_j$ mit $i < j$, und die Summe der Zahlen $i+1$ bis $j$ ist $s_j - s_i \\equiv 0$.

## Zusammenfassung

- Summenregel für disjunkte Fälle, Produktregel für unabhängige Stufen.
- Mit Reihenfolge: $n^k$ bzw. $\\frac{n!}{(n-k)!}$; ohne Reihenfolge: $\\binom nk$ bzw. $\\binom{n+k-1}{k}$.
- $\\binom nk = \\binom{n-1}{k-1} + \\binom{n-1}{k}$ (Pascal), $(a+b)^n = \\sum\\binom nk a^kb^{n-k}$.
- Schubfachprinzip: mehr Objekte als Fächer erzwingt eine Doppelbelegung.
`;export{e as default};
