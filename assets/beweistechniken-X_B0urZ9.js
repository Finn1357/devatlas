const e=`---
id: beweistechniken
title: Beweistechniken
module: grundlagen
order: 4
difficulty: fortgeschritten
minutes: 40
summary: Direkter Beweis, Kontraposition, Widerspruchsbeweis, Fallunterscheidung, Äquivalenz- und Existenzbeweise sowie Gegenbeispiele – mit klassischen Beispielen wie der Irrationalität von Wurzel 2.
tags: [Beweis, Direkter Beweis, Kontraposition, Widerspruch, Gegenbeispiel, Irrationalität]
requires: [aussagenlogik, praedikatenlogik]
---

## Warum Beweise?

Ein Beweis ist eine lückenlose Kette logischer Schlüsse von bekannten Tatsachen (Definitionen, Axiomen, bereits bewiesenen Sätzen) zur Behauptung. Beispiele – auch sehr viele – sind kein Beweis: Die Zahl $n^2 + n + 41$ ist für $n = 0, 1, \\dots, 39$ prim, aber für $n = 40$ gilt $40^2 + 40 + 41 = 41^2$.

In der Informatik begegnen dir Beweise als Korrektheitsargumente für Algorithmen (Schleifeninvarianten), als Laufzeitabschätzungen und in der Kryptografie, wo „funktioniert in allen Tests“ nicht reicht.

Ein mathematischer Satz hat meist die Form $A \\Rightarrow B$ (Voraussetzung ⇒ Behauptung). Die Techniken unterscheiden sich darin, wie man diese Implikation herstellt.

### Bausteine: die Definitionen

Wir verwenden in den Beispielen:

- $n \\in \\Z$ heißt **gerade**, wenn es $k \\in \\Z$ mit $n = 2k$ gibt, und **ungerade**, wenn es $k \\in \\Z$ mit $n = 2k + 1$ gibt. Jede ganze Zahl ist genau eins von beidem.
- $a$ **teilt** $b$ ($a \\mid b$), wenn es $k \\in \\Z$ mit $b = k \\cdot a$ gibt.
- $x \\in \\R$ heißt **rational**, wenn $x = \\tfrac{p}{q}$ mit $p \\in \\Z$, $q \\in \\N$, $q \\ge 1$; andernfalls **irrational**.

> [!TIP] Die wichtigste Regel
> Beginne jeden Beweis damit, Voraussetzung und Behauptung **mit den Definitionen** auszuschreiben. „$n$ ist ungerade“ wird zu „$n = 2k+1$ für ein $k \\in \\Z$“. Danach ist der Weg oft offensichtlich.

## Direkter Beweis

Man nimmt $A$ an und folgert schrittweise $B$.

> [!SATZ]
> Ist $n$ ungerade, so ist auch $n^2$ ungerade.

> [!BEWEIS]
> Sei $n$ ungerade, also $n = 2k + 1$ mit $k \\in \\Z$. Dann ist
> $$
> n^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1.
> $$
> Mit $m := 2k^2 + 2k \\in \\Z$ gilt $n^2 = 2m + 1$, also ist $n^2$ ungerade.

> [!SATZ] Transitivität der Teilbarkeit
> Für ganze Zahlen gilt: Aus $a \\mid b$ und $b \\mid c$ folgt $a \\mid c$.

> [!BEWEIS]
> Nach Voraussetzung gibt es $k, l \\in \\Z$ mit $b = ka$ und $c = lb$. Einsetzen liefert $c = l(ka) = (lk)a$ mit $lk \\in \\Z$, also $a \\mid c$.

## Beweis durch Kontraposition

Statt $A \\Rightarrow B$ zeigt man die logisch äquivalente Aussage $\\lnot B \\Rightarrow \\lnot A$ (siehe [Aussagenlogik](#/mathe/grundlagen/aussagenlogik)). Das lohnt sich, wenn $\\lnot B$ eine handlichere Voraussetzung liefert als $A$.

> [!SATZ]
> Ist $n^2$ gerade, so ist $n$ gerade.

> [!BEWEIS]
> Direkt ist das unhandlich: Aus $n^2 = 2k$ lässt sich über $n$ wenig ablesen. Wir zeigen die Kontraposition „Ist $n$ ungerade, so ist $n^2$ ungerade“ – und das ist genau der Satz aus dem vorigen Abschnitt.

## Widerspruchsbeweis

Man nimmt an, die Behauptung $B$ sei falsch, und leitet daraus einen Widerspruch her – eine Aussage der Form $C \\land \\lnot C$. Da aus wahren Annahmen nichts Falsches folgen kann, muss die Annahme $\\lnot B$ falsch sein. Logisch: $(\\lnot B \\to (C \\land \\lnot C)) \\equiv B$.

> [!SATZ] Irrationalität von Wurzel 2
> $\\sqrt{2}$ ist irrational.

> [!BEWEIS]
> Angenommen, $\\sqrt{2}$ wäre rational. Dann gibt es $p, q \\in \\N$, $q \\ge 1$, mit $\\sqrt 2 = \\tfrac pq$, und wir dürfen den Bruch **vollständig gekürzt** wählen: $p$ und $q$ haben keinen gemeinsamen Teiler größer als 1.
>
> Quadrieren ergibt $p^2 = 2q^2$. Also ist $p^2$ gerade und nach dem Kontrapositionssatz auch $p$, etwa $p = 2r$. Einsetzen: $4r^2 = 2q^2$, also $q^2 = 2r^2$. Damit ist auch $q^2$ und somit $q$ gerade.
>
> Dann sind $p$ und $q$ beide durch 2 teilbar – im Widerspruch zur vollständigen Kürzung. Die Annahme war falsch, $\\sqrt 2$ ist irrational.

> [!SATZ] Euklid
> Es gibt unendlich viele Primzahlen.

> [!BEWEIS]
> Angenommen, es gäbe nur endlich viele Primzahlen $p_1, \\dots, p_n$. Betrachte $N = p_1 \\cdot p_2 \\cdots p_n + 1$. Da $N \\ge 2$, hat $N$ einen Primteiler $p$ (den kleinsten Teiler größer als 1). Nach Annahme ist $p = p_i$ für ein $i$. Dann teilt $p_i$ sowohl $N$ als auch das Produkt $p_1 \\cdots p_n$, also auch die Differenz $N - p_1 \\cdots p_n = 1$. Keine Primzahl teilt 1 – Widerspruch.

> [!MISTAKE] Beliebter Fehlschluss
> Der Beweis sagt **nicht**, dass $p_1 \\cdots p_n + 1$ selbst prim ist. Gegenbeispiel: $2 \\cdot 3 \\cdot 5 \\cdot 7 \\cdot 11 \\cdot 13 + 1 = 30031 = 59 \\cdot 509$. Es wird nur gezeigt, dass $N$ einen Primteiler außerhalb der Liste hat.

### Widerspruch oder Kontraposition?

Beide Methoden beginnen mit einer Verneinung. Bei der Kontraposition steht das Ziel ($\\lnot A$) von Anfang an fest; beim Widerspruchsbeweis darf man zusätzlich $A$ benutzen und sucht *irgendeinen* Widerspruch. Ein Widerspruchsbeweis, dessen Widerspruch einfach „$\\lnot A$“ ist, ist in Wahrheit eine Kontraposition – dann schreibt man ihn besser direkt so auf.

## Fallunterscheidung

Lässt sich die Situation in endlich viele Fälle zerlegen, die zusammen alles abdecken, beweist man die Behauptung in jedem Fall einzeln. Logisch: aus $(A_1 \\lor A_2)$, $A_1 \\to B$, $A_2 \\to B$ folgt $B$.

> [!SATZ]
> Für jedes $n \\in \\Z$ ist $n^2 + n$ gerade.

> [!BEWEIS]
> **Fall 1:** $n = 2k$ gerade. Dann ist $n^2 + n = 4k^2 + 2k = 2(2k^2 + k)$ gerade.
>
> **Fall 2:** $n = 2k + 1$ ungerade. Dann ist $n^2 + n = (2k+1)(2k+2) = 2(2k+1)(k+1)$ gerade.
>
> Jede ganze Zahl ist gerade oder ungerade, also gilt die Behauptung für alle $n$. (Eleganter: $n^2 + n = n(n+1)$ ist das Produkt zweier aufeinanderfolgender Zahlen, von denen eine gerade ist.)

Fallunterscheidungen sind typisch für Beträge: $\\abs{x} = x$ für $x \\ge 0$ und $\\abs{x} = -x$ für $x < 0$.

> [!SATZ] Dreiecksungleichung
> Für alle $x, y \\in \\R$ gilt $\\abs{x + y} \\le \\abs{x} + \\abs{y}$.

> [!BEWEIS]
> Für jede reelle Zahl gilt $-\\abs{x} \\le x \\le \\abs{x}$ (Fallunterscheidung nach dem Vorzeichen von $x$). Addition der Ungleichungen für $x$ und $y$ ergibt $-(\\abs x + \\abs y) \\le x + y \\le \\abs x + \\abs y$. Ist $x + y \\ge 0$, ist $\\abs{x+y} = x + y \\le \\abs x + \\abs y$; ist $x + y < 0$, ist $\\abs{x + y} = -(x+y) \\le \\abs x + \\abs y$.

## Äquivalenzbeweise

Eine Aussage „$A$ genau dann, wenn $B$“ zeigt man meist in zwei Richtungen: „$\\Rightarrow$“ und „$\\Leftarrow$“. Bei mehreren äquivalenten Aussagen spart ein **Ringschluss** Arbeit: $A \\Rightarrow B \\Rightarrow C \\Rightarrow A$ zeigt alle sechs Implikationen.

> [!SATZ]
> Für $n \\in \\Z$ gilt: $n$ ist gerade $\\iff$ $n^2$ ist gerade.

> [!BEWEIS]
> „$\\Rightarrow$“: Aus $n = 2k$ folgt $n^2 = 2(2k^2)$. „$\\Leftarrow$“: Das ist der Satz aus dem Abschnitt über Kontraposition.

> [!MISTAKE] Nur eine Richtung
> Eine Kette von Umformungen mit „$\\Rightarrow$“ zeigt nur die Hinrichtung. Wer $x = 2$ aus $x^2 = 4$ „herleitet“, hat die Lösung $x = -2$ verloren, denn Quadrieren ist keine Äquivalenzumformung: $x = -2 \\Rightarrow x^2 = 4$, aber nicht umgekehrt mit eindeutigem Ergebnis.

## Existenz- und Eindeutigkeitsbeweise

- **Konstruktiv:** Man gibt ein konkretes Objekt an und prüft die Eigenschaft. „Es gibt eine gerade Primzahl“: $2$.
- **Nicht konstruktiv:** Man zeigt, dass es ein Objekt geben *muss*, ohne es zu nennen – etwa per Zwischenwertsatz oder per Widerspruch.
- **Eindeutigkeit:** Man nimmt zwei Objekte mit der Eigenschaft an und zeigt, dass sie gleich sind.

> [!SATZ] Ein nicht konstruktiver Klassiker
> Es gibt irrationale Zahlen $a, b$, sodass $a^b$ rational ist.

> [!BEWEIS]
> Betrachte $x = \\sqrt2^{\\sqrt2}$. Ist $x$ rational, wähle $a = b = \\sqrt 2$. Ist $x$ irrational, wähle $a = x$ und $b = \\sqrt 2$; dann ist $a^b = \\sqrt2^{\\sqrt2 \\cdot \\sqrt2} = \\sqrt2^{2} = 2$ rational. In beiden Fällen existiert ein solches Paar – welcher Fall vorliegt, bleibt offen.

## Gegenbeispiele

Eine Allaussage $\\forall x: P(x)$ wird durch **ein** Gegenbeispiel widerlegt, denn ihre Negation ist $\\exists x: \\lnot P(x)$. Gute Kandidaten sind Randfälle: $0$, $1$, negative Zahlen, die leere Menge, gleiche Elemente.

> [!BEISPIEL] Widerlegen
> „Für alle reellen $a, b$ gilt $\\sqrt{a^2 + b^2} = a + b$“ – falsch für $a = b = 1$: $\\sqrt 2 \\neq 2$.
> „Ist $a \\mid bc$, dann $a \\mid b$ oder $a \\mid c$“ – falsch für $a = 6$, $b = 2$, $c = 3$. (Für Primzahlen $a$ ist die Aussage dagegen wahr: Lemma von Euklid.)

## Gute Beweise aufschreiben

1. **Ziel nennen:** Was wird gezeigt, mit welcher Methode? („Wir zeigen die Kontraposition …“, „Angenommen, …“)
2. **Variablen einführen:** „Sei $n \\in \\Z$ beliebig“ – nicht stillschweigend mit einem Beispiel rechnen.
3. **Jeden Schritt begründen**, besonders Umformungen, die nicht offensichtlich äquivalent sind.
4. **Abschluss markieren** – mit „$\\square$“ oder „was zu zeigen war (q. e. d.)“.

Die nächste Lektion behandelt die wichtigste Beweismethode für Aussagen über alle natürlichen Zahlen: die [vollständige Induktion](#/mathe/grundlagen/vollstaendige-induktion).

## Zusammenfassung

- Direkt: $A$ annehmen, $B$ folgern. Kontraposition: $\\lnot B$ annehmen, $\\lnot A$ folgern.
- Widerspruch: $\\lnot B$ annehmen, einen Widerspruch herleiten (Klassiker: $\\sqrt2 \\notin \\Q$, unendlich viele Primzahlen).
- Fallunterscheidung braucht vollständige Fälle; Äquivalenzen brauchen beide Richtungen.
- Ein Gegenbeispiel genügt, um eine Allaussage zu widerlegen – Beispiele genügen nie, um sie zu beweisen.
`;export{e as default};
