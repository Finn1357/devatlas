const e=`---
id: praedikatenlogik
title: Prädikatenlogik und Quantoren
module: grundlagen
order: 2
difficulty: einsteiger
minutes: 30
summary: Aussageformen, All- und Existenzquantor, das korrekte Verneinen quantifizierter Aussagen und warum die Reihenfolge der Quantoren alles ändert.
tags: [Quantoren, Allquantor, Existenzquantor, Negation, Formalisierung]
requires: [aussagenlogik]
---

## Von Aussagen zu Aussageformen

Die Aussagenlogik behandelt Aussagen als unteilbare Blöcke. Mathematische Sätze sprechen aber fast immer über *viele* Objekte: „Jede durch 4 teilbare Zahl ist gerade“, „Es gibt eine Primzahl größer als 1000“. Dafür braucht man Variablen und [[Quantor|Quantoren]].

> [!DEFINITION] Aussageform (Prädikat)
> Eine **Aussageform** $P(x)$ ist ein Ausdruck mit einer freien Variablen $x$ aus einer Grundmenge $M$, der für jedes eingesetzte $a \\in M$ zu einer Aussage $P(a)$ wird. Allgemeiner hat ein Prädikat $P(x_1, \\dots, x_n)$ mehrere Variablen.

Beispiel: $P(x)$: „$x^2 > 4$“ über $\\R$. Dann ist $P(3)$ wahr und $P(1)$ falsch, aber $P(x)$ selbst hat keinen Wahrheitswert. Ein zweistelliges Prädikat ist etwa $T(a, b)$: „$a$ teilt $b$“, geschrieben $a \\mid b$.

## All- und Existenzquantor

> [!DEFINITION] Quantoren
> Für eine Aussageform $P(x)$ über einer Menge $M$ ist
> - $\\forall x \\in M: P(x)$ („für alle $x$ aus $M$ gilt $P(x)$“) genau dann wahr, wenn $P(a)$ für **jedes** $a \\in M$ wahr ist;
> - $\\exists x \\in M: P(x)$ („es gibt ein $x$ aus $M$ mit $P(x)$“) genau dann wahr, wenn $P(a)$ für **mindestens ein** $a \\in M$ wahr ist;
> - $\\exists! x \\in M: P(x)$ („es gibt genau ein …“) genau dann wahr, wenn es genau ein solches $a$ gibt.

Durch das Quantifizieren wird die Variable **gebunden**, und aus der Aussageform entsteht eine Aussage.

> [!BEISPIEL] Wahr oder falsch?
> - $\\forall n \\in \\N: n^2 \\ge n$ ist wahr, denn für $n \\ge 1$ ist $n^2 = n \\cdot n \\ge n$ und für $n = 0$ gilt $0 \\ge 0$.
> - $\\exists x \\in \\R: x^2 = -1$ ist falsch; über $\\C$ wäre sie wahr ($x = \\ii$). Die **Grundmenge** gehört also zur Aussage.
> - $\\forall x \\in \\emptyset: P(x)$ ist **immer wahr** (es gibt kein Gegenbeispiel), $\\exists x \\in \\emptyset: P(x)$ immer falsch.

> [!TIP] Quantoren als Schleifen
> Über einer endlichen Menge ist $\\forall$ ein \`every\` / \`all(...)\` und $\\exists$ ein \`some\` / \`any(...)\`:
> \`xs.every(x => x * x >= x)\` bzw. \`any(x * x == -1 for x in xs)\`. Auch die Konvention für die leere Menge stimmt: \`[].every(...)\` ist \`true\`, \`[].some(...)\` ist \`false\`.

### Verkürzte Schreibweisen

Statt $\\forall x \\in \\R: (x > 0 \\to x^2 > 0)$ schreibt man oft $\\forall x > 0: x^2 > 0$. Die Bedingung beim Allquantor ist eine versteckte **Implikation**, beim Existenzquantor dagegen eine **Konjunktion**: $\\exists x > 0: x^2 = 2$ bedeutet $\\exists x \\in \\R: (x > 0 \\land x^2 = 2)$.

## Quantoren verneinen

Die wichtigste Rechenregel der Prädikatenlogik ist die Verneinung. Sie verallgemeinert De Morgan: Ein Allquantor ist eine (eventuell unendliche) Konjunktion, ein Existenzquantor eine Disjunktion.

> [!SATZ] Negation von Quantoren
> $$
> \\lnot\\big(\\forall x \\in M: P(x)\\big) \\equiv \\exists x \\in M: \\lnot P(x), \\qquad \\lnot\\big(\\exists x \\in M: P(x)\\big) \\equiv \\forall x \\in M: \\lnot P(x).
> $$

> [!BEWEIS]
> „Nicht alle $x$ erfüllen $P$“ ist genau dann wahr, wenn mindestens ein $x$ die Eigenschaft $P$ nicht hat – das ist die rechte Seite der ersten Äquivalenz. Die zweite folgt, indem man die erste auf $\\lnot P$ anwendet: $\\lnot(\\forall x: \\lnot P(x)) \\equiv \\exists x: P(x)$; beide Seiten negiert ergibt die Behauptung.

**Faustregel:** Beim Verneinen wandert das $\\lnot$ von links nach rechts durch die Formel; jeder Quantor, den es passiert, kippt ($\\forall \\leftrightarrow \\exists$), und am Ende wird die innere Aussage verneint. Bedingungen in verkürzten Quantoren bleiben stehen:

$$
\\lnot\\big(\\forall x > 0: x^2 > x\\big) \\equiv \\exists x > 0: x^2 \\le x.
$$

Das ist wahr – etwa $x = \\tfrac12$. Ein einziges solches Gegenbeispiel widerlegt die Allaussage.

> [!MISTAKE] Falsche Verneinung
> Die Verneinung von „Alle Tests sind grün“ ist **nicht** „Alle Tests sind rot“, sondern „Mindestens ein Test ist nicht grün“. Und die Verneinung von $x > 0$ ist $x \\le 0$, nicht $x < 0$.

## Mehrere Quantoren und ihre Reihenfolge

Gleichartige Quantoren dürfen vertauscht werden: $\\forall x \\, \\forall y: P(x,y) \\equiv \\forall y \\, \\forall x: P(x,y)$, ebenso für $\\exists$. **Verschiedene** Quantoren dagegen nicht.

> [!BEISPIEL] Die Reihenfolge entscheidet
> Über $\\N$ sei $P(x, y)$: „$y > x$“.
> - $\\forall x \\, \\exists y: y > x$ – „Zu jeder Zahl gibt es eine größere“. **Wahr** (nimm $y = x + 1$). Hier darf $y$ von $x$ abhängen.
> - $\\exists y \\, \\forall x: y > x$ – „Es gibt eine Zahl, die größer ist als alle“. **Falsch** (für $x = y$ gilt $y > x$ nicht). Hier muss *ein* $y$ für alle $x$ funktionieren.

Allgemein gilt nur die Richtung
$$
\\exists y \\, \\forall x: P(x, y) \\;\\Longrightarrow\\; \\forall x \\, \\exists y: P(x, y),
$$
nicht die Umkehrung. Merkhilfe: Was weiter links steht, wird zuerst gewählt; alles weiter rechts darf davon abhängen.

### Ein Ausblick: die Grenzwertdefinition

Die Analysis lebt von verschachtelten Quantoren. Eine Folge $(a_n)$ konvergiert gegen $a$, wenn
$$
\\forall \\varepsilon > 0 \\;\\; \\exists N \\in \\N \\;\\; \\forall n \\ge N: \\; \\abs{a_n - a} < \\varepsilon .
$$
„Für jede noch so kleine Toleranz $\\varepsilon$ gibt es einen Index $N$, ab dem alle Folgenglieder näher als $\\varepsilon$ an $a$ liegen.“ Hier hängt $N$ von $\\varepsilon$ ab. Die Verneinung – „$(a_n)$ konvergiert **nicht** gegen $a$“ – erhält man mechanisch:
$$
\\exists \\varepsilon > 0 \\;\\; \\forall N \\in \\N \\;\\; \\exists n \\ge N: \\; \\abs{a_n - a} \\ge \\varepsilon .
$$
Es gibt also eine Toleranz, die unendlich oft verletzt wird. Mehr dazu in [Folgen und Grenzwerte](#/mathe/analysis-1/folgen-grenzwerte).

## Formalisieren üben

Umgangssprache in Formeln zu übersetzen ist eine Kernkompetenz – in Beweisen ebenso wie beim Schreiben von Spezifikationen und Tests.

| Umgangssprache | Formel |
|---|---|
| Jede gerade Zahl ist Summe zweier ungerader Zahlen. | $\\forall n \\in 2\\Z \\;\\exists a, b \\in \\Z: n = (2a+1) + (2b+1)$ |
| Es gibt eine kleinste natürliche Zahl. | $\\exists m \\in \\N \\; \\forall n \\in \\N: m \\le n$ |
| Keine Quadratzahl endet auf 2. | $\\lnot \\exists n \\in \\N: n^2 \\bmod 10 = 2$, also $\\forall n \\in \\N: n^2 \\bmod 10 \\neq 2$ |
| $f$ ist beschränkt. | $\\exists C \\in \\R \\; \\forall x \\in D: \\abs{f(x)} \\le C$ |
| Die Liste $a$ ist sortiert. | $\\forall i \\in \\set{0, \\dots, n-2}: a_i \\le a_{i+1}$ |
| Das Element $z$ kommt in $a$ vor. | $\\exists i \\in \\set{0, \\dots, n-1}: a_i = z$ |

> [!BEISPIEL] Spezifikation einer Suche
> Eine Funktion \`index(a, z)\` soll den **kleinsten** Index liefern, an dem \`z\` vorkommt. Als Nachbedingung für das Ergebnis $k$:
> $$
> a_k = z \\;\\land\\; \\forall i < k: a_i \\neq z .
> $$
> Ein Property-Based-Test kann genau diese Formel für zufällige Arrays prüfen.

## Typische Stolperstellen

- **Freie und gebundene Variablen:** In $\\forall x: P(x, y)$ ist $x$ gebunden, $y$ frei – die Formel ist erst eine Aussage, wenn $y$ feststeht.
- **Grundmenge vergessen:** $\\forall x: x^2 \\ge 0$ ist über $\\R$ wahr, über $\\C$ nicht einmal sinnvoll (komplexe Zahlen sind nicht angeordnet).
- **Implikation vs. Konjunktion:** „Alle Primzahlen größer 2 sind ungerade“ heißt $\\forall p: (p \\text{ prim} \\land p > 2) \\to p \\text{ ungerade}$. Schreibt man $\\land$ statt $\\to$, behauptet man, *alle* Zahlen seien prim, größer 2 und ungerade.
- **Existenz heißt nicht Eindeutigkeit:** $\\exists x: x^2 = 4$ ist wahr, obwohl es zwei Lösungen gibt. Für Eindeutigkeit braucht man $\\exists!$ oder einen zusätzlichen Beweis: Sind $x_1$ und $x_2$ Lösungen, dann $x_1 = x_2$.

## Zusammenfassung

- Aussageformen werden durch Einsetzen oder Quantifizieren zu Aussagen; die Grundmenge gehört dazu.
- $\\lnot\\forall \\equiv \\exists\\lnot$ und $\\lnot\\exists \\equiv \\forall\\lnot$ – beim Verneinen kippt jeder Quantor.
- Gleichartige Quantoren sind vertauschbar, verschiedene nicht: $\\exists y\\,\\forall x$ ist stärker als $\\forall x\\,\\exists y$.
- Eine Allaussage widerlegt ein einziges Gegenbeispiel; eine Existenzaussage belegt ein einziges Beispiel.
`;export{e as default};
