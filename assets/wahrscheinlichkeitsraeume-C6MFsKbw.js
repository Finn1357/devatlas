const e=`---
id: wahrscheinlichkeitsraeume
title: Wahrscheinlichkeitsräume, bedingte Wahrscheinlichkeit und Bayes
module: stochastik
order: 1
difficulty: einsteiger
minutes: 50
summary: Ergebnisraum, Ereignisse und die Axiome von Kolmogorow, Laplace-Experimente, bedingte Wahrscheinlichkeit, totale Wahrscheinlichkeit, der Satz von Bayes und stochastische Unabhängigkeit.
tags: [Wahrscheinlichkeit, Ereignis, Laplace, Bedingte Wahrscheinlichkeit, Bayes, Unabhängigkeit]
requires: [mengen]
---

## Zufallsexperimente modellieren

Ein **Zufallsexperiment** hat mehrere mögliche Ausgänge, von denen einer eintritt, ohne dass man vorher weiß, welcher. Würfeln, ein Netzwerkpaket, das verloren gehen kann, die Antwortzeit eines Servers oder die Frage, ob eine E-Mail Spam ist – die [[Wahrscheinlichkeit]]srechnung beschreibt all das mit derselben Sprache.

> [!DEFINITION] Ergebnisraum und Ereignisse
> Der **Ergebnisraum** $\\Omega$ ist die Menge aller möglichen Ausgänge (Ergebnisse) $\\omega$. Ein **Ereignis** ist eine Teilmenge $A \\subseteq \\Omega$; es tritt ein, wenn das Ergebnis in $A$ liegt. $\\Omega$ ist das sichere, $\\emptyset$ das unmögliche Ereignis.

Beim Würfeln ist $\\Omega = \\set{1, 2, \\dots, 6}$ und „gerade Augenzahl“ das Ereignis $A = \\set{2, 4, 6}$. Ereignisse werden mit den Mengenoperationen kombiniert: $A \\cup B$ („$A$ oder $B$“), $A \\cap B$ („$A$ und $B$“), $\\overline A = \\Omega \\setminus A$ (Gegenereignis). Ereignisse mit $A \\cap B = \\emptyset$ heißen **unvereinbar** (disjunkt).

> [!DEFINITION] Wahrscheinlichkeitsmaß (Kolmogorow, 1933)
> Ein **Wahrscheinlichkeitsmaß** ordnet jedem Ereignis $A$ eine Zahl $P(A)$ zu, sodass
> 1. $P(A) \\ge 0$ für alle Ereignisse $A$,
> 2. $P(\\Omega) = 1$,
> 3. für paarweise disjunkte Ereignisse $A_1, A_2, \\dots$ gilt $P\\left(\\bigcup_i A_i\\right) = \\sum_i P(A_i)$.
>
> Das Tripel aus $\\Omega$, den Ereignissen und $P$ heißt **Wahrscheinlichkeitsraum**.

Aus den drei Axiomen folgen alle Rechenregeln:

| Regel | Formel |
|---|---|
| Gegenereignis | $P(\\overline A) = 1 - P(A)$ |
| Unmögliches Ereignis | $P(\\emptyset) = 0$ |
| Monotonie | $A \\subseteq B \\Rightarrow P(A) \\le P(B)$ |
| Additionssatz | $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$ |
| Differenz | $P(A \\setminus B) = P(A) - P(A \\cap B)$ |

Der Additionssatz ist das [Inklusions-Exklusions-Prinzip](#/mathe/grundlagen/mengen) für Wahrscheinlichkeiten. Die Gegenereignis-Regel ist oft der schnellste Weg: „mindestens einmal“ berechnet man als $1 - P(\\text{keinmal})$.

## Laplace-Experimente

> [!DEFINITION] Laplace-Experiment
> Ist $\\Omega$ endlich und sind alle Ergebnisse gleich wahrscheinlich, so gilt
> $$
> P(A) = \\frac{\\abs A}{\\abs\\Omega} = \\frac{\\text{Anzahl günstiger Ergebnisse}}{\\text{Anzahl möglicher Ergebnisse}} .
> $$

Die Schwierigkeit liegt dann im **Zählen** – Werkzeuge dafür liefert die [Kombinatorik](#/mathe/diskrete-mathematik/kombinatorik).

> [!BEISPIEL] Zwei Würfel
> Beim Wurf zweier unterscheidbarer Würfel ist $\\Omega = \\set{1, \\dots, 6}^2$ mit $36$ gleich wahrscheinlichen Paaren. Augensumme 7 tritt bei $(1,6), (2,5), \\dots, (6,1)$ ein: $P = \\frac{6}{36} = \\frac16$. Augensumme 2 nur bei $(1,1)$: $P = \\frac1{36}$.

> [!MISTAKE] Nicht gleich wahrscheinliche Ergebnisse
> Wer bei zwei Würfeln den Ergebnisraum „Augensummen $2, \\dots, 12$“ wählt und jeder Summe $\\frac1{11}$ gibt, rechnet falsch – die Summen sind nicht gleich wahrscheinlich. Laplace gilt nur für einen Ergebnisraum aus **gleich wahrscheinlichen** Elementen.

> [!BEISPIEL] Mindestens eine Sechs
> Viermal würfeln. $P(\\text{keine Sechs}) = \\left(\\frac56\\right)^4 \\approx 0{,}482$, also $P(\\text{mindestens eine Sechs}) \\approx 0{,}518$. (Chevalier de Méré wettete im 17. Jahrhundert darauf – und gewann auf Dauer.)

## Bedingte Wahrscheinlichkeit

Oft weiß man schon etwas: Der Würfel zeigt eine gerade Zahl. Wie wahrscheinlich ist dann eine Sechs? Das Wissen schränkt den Ergebnisraum auf $B = \\set{2, 4, 6}$ ein.

> [!DEFINITION] Bedingte Wahrscheinlichkeit
> Für Ereignisse $A, B$ mit $P(B) > 0$ heißt
> $$
> P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}
> $$
> die **Wahrscheinlichkeit von $A$ unter der Bedingung $B$**.

Im Beispiel: $P(\\set6 \\mid \\set{2,4,6}) = \\frac{1/6}{3/6} = \\frac13$. Durch Umstellen erhält man die **Multiplikationsregel** $P(A \\cap B) = P(B)\\,P(A \\mid B)$ – die Grundlage der Pfadregeln in Baumdiagrammen.

> [!SATZ] Satz von der totalen Wahrscheinlichkeit
> Bilden $B_1, \\dots, B_n$ eine Zerlegung von $\\Omega$ (paarweise disjunkt, Vereinigung $\\Omega$, alle $P(B_i) > 0$), so gilt für jedes Ereignis $A$
> $$
> P(A) = \\sum_{i=1}^{n} P(A \\mid B_i)\\, P(B_i) .
> $$

> [!BEWEIS]
> $A$ ist die disjunkte Vereinigung der Mengen $A \\cap B_i$. Nach dem dritten Axiom ist $P(A) = \\sum_i P(A \\cap B_i)$, und jeder Summand ist nach der Multiplikationsregel $P(A \\mid B_i)P(B_i)$.

## Der Satz von Bayes

Bedingte Wahrscheinlichkeiten lassen sich **nicht** einfach umdrehen: $P(A \\mid B)$ und $P(B \\mid A)$ sind im Allgemeinen sehr verschieden. Der Zusammenhang:

> [!SATZ] Satz von Bayes
> Für Ereignisse $A, B$ mit $P(A), P(B) > 0$ gilt
> $$
> P(B \\mid A) = \\frac{P(A \\mid B)\\, P(B)}{P(A)} = \\frac{P(A \\mid B)\\,P(B)}{P(A \\mid B)\\,P(B) + P(A \\mid \\overline B)\\,P(\\overline B)} .
> $$

> [!BEWEIS]
> Nach der Multiplikationsregel ist $P(A \\cap B) = P(B \\mid A)P(A) = P(A \\mid B)P(B)$; Division durch $P(A)$ liefert die erste Form. Den Nenner zerlegt man mit der totalen Wahrscheinlichkeit über $B$ und $\\overline B$.

> [!BEISPIEL] Der medizinische Test
> Eine Krankheit hat eine Häufigkeit (Prävalenz) von $1\\,\\%$. Ein Test erkennt Erkrankte mit $99\\,\\%$ Wahrscheinlichkeit (Sensitivität) und meldet bei Gesunden mit $5\\,\\%$ Wahrscheinlichkeit fälschlich „positiv“. Wie wahrscheinlich ist man bei positivem Test krank?
>
> Mit $K$ = krank und $T$ = Test positiv:
> $$
> P(K \\mid T) = \\frac{0{,}99 \\cdot 0{,}01}{0{,}99 \\cdot 0{,}01 + 0{,}05 \\cdot 0{,}99} = \\frac{0{,}0099}{0{,}0099 + 0{,}0495} \\approx 0{,}167 .
> $$
> Nur etwa **17 %**! Anschaulich mit 10 000 Personen: 100 sind krank, davon 99 positiv getestet; von 9 900 Gesunden sind 495 positiv. Unter den 594 Positiven sind also nur 99 krank.

Die Intuition versagt hier systematisch, weil sie die **Basisrate** $P(K)$ vernachlässigt (Prävalenzfehler). Derselbe Effekt betrifft Alarmsysteme: Ein Intrusion-Detection-System mit 1 % Fehlalarmrate erzeugt bei Millionen harmlosen Ereignissen täglich Zehntausende Fehlalarme.

> [!TIP] Naiver Bayes-Spamfilter
> Ein Spamfilter schätzt $P(\\text{Spam} \\mid \\text{Wörter})$. Aus Trainingsdaten kennt er $P(\\text{Wort} \\mid \\text{Spam})$, etwa wie oft „Gewinn“ in Spam vorkommt. Mit Bayes und der (naiven) Annahme, dass Wörter unabhängig auftreten, multipliziert er die Einzelwahrscheinlichkeiten. Trotz der vereinfachenden Annahme funktioniert das erstaunlich gut und war jahrelang Standard.

## Unabhängigkeit

> [!DEFINITION] Stochastische Unabhängigkeit
> Zwei Ereignisse $A, B$ heißen **unabhängig**, wenn
> $$
> P(A \\cap B) = P(A)\\,P(B) .
> $$
> Für $P(B) > 0$ ist das gleichbedeutend mit $P(A \\mid B) = P(A)$: Das Wissen über $B$ ändert nichts an der Wahrscheinlichkeit von $A$.

Mehrere Ereignisse $A_1, \\dots, A_n$ heißen unabhängig, wenn die Produktformel für **jede** Auswahl gilt: $P(A_{i_1} \\cap \\dots \\cap A_{i_k}) = P(A_{i_1})\\cdots P(A_{i_k})$. Paarweise Unabhängigkeit reicht dafür nicht.

> [!MISTAKE] Unvereinbar ist nicht unabhängig
> Sind $A$ und $B$ disjunkt mit $P(A), P(B) > 0$, dann ist $P(A \\cap B) = 0 \\neq P(A)P(B)$ – sie sind **abhängig**: Tritt $A$ ein, ist $B$ ausgeschlossen. Das ist das Gegenteil von Unabhängigkeit.

> [!BEISPIEL] Redundanz in Systemen
> Ein Dienst läuft auf zwei Servern, die unabhängig voneinander mit Wahrscheinlichkeit $0{,}02$ pro Tag ausfallen. Der Dienst fällt nur aus, wenn beide ausfallen: $0{,}02^2 = 0{,}0004$. Die Unabhängigkeitsannahme ist dabei entscheidend – teilen sich beide Server Stromversorgung oder Rechenzentrum, ist sie verletzt, und die echte Ausfallwahrscheinlichkeit ist viel höher.

## Zusammenfassung

- Ein Wahrscheinlichkeitsraum besteht aus Ergebnisraum $\\Omega$, Ereignissen und einem Maß $P$, das die Kolmogorow-Axiome erfüllt.
- Laplace: $P(A) = \\frac{\\abs A}{\\abs\\Omega}$ – nur bei gleich wahrscheinlichen Ergebnissen.
- $P(A \\mid B) = \\frac{P(A\\cap B)}{P(B)}$; totale Wahrscheinlichkeit zerlegt nach Fällen; Bayes dreht Bedingungen um und braucht die Basisrate.
- Unabhängig: $P(A\\cap B) = P(A)P(B)$ – nicht zu verwechseln mit disjunkt.
`;export{e as default};
