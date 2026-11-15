const e=`---
id: teilbarkeit-euklid
title: Teilbarkeit, Primzahlen und der euklidische Algorithmus
module: zahlentheorie
order: 1
difficulty: einsteiger
minutes: 45
summary: Division mit Rest, Teilbarkeitsregeln, größter gemeinsamer Teiler, der (erweiterte) euklidische Algorithmus mit Bézout-Identität, Primzahlen und der Fundamentalsatz der Arithmetik.
tags: [Teilbarkeit, Division mit Rest, ggT, kgV, Euklidischer Algorithmus, Bézout, Primfaktorzerlegung]
requires: [beweistechniken, vollstaendige-induktion]
---

## Division mit Rest

Die Zahlentheorie untersucht die ganzen Zahlen – scheinbar die einfachste Struktur der Mathematik, tatsächlich die Grundlage moderner Kryptografie. Ausgangspunkt ist die Division mit Rest, die jede Programmiersprache als \`/\` und \`%\` (bzw. \`//\` und \`%\`) kennt.

> [!SATZ] Division mit Rest
> Zu $a \\in \\Z$ und $b \\in \\N$, $b \\ge 1$, gibt es eindeutig bestimmte $q, r \\in \\Z$ mit
> $$
> a = q \\cdot b + r \\qquad\\text{und}\\qquad 0 \\le r < b .
> $$
> $q = \\lfloor a / b \\rfloor$ heißt Quotient, $r = a \\bmod b$ der Rest.

> [!BEWEIS]
> **Existenz:** Die Menge $\\set{a - qb \\mid q \\in \\Z} \\cap \\N$ ist nichtleer (für sehr kleines $q$ wird $a - qb$ groß). Sie hat also ein kleinstes Element $r = a - qb \\ge 0$. Wäre $r \\ge b$, so wäre $r - b = a - (q+1)b$ ein noch kleineres Element – Widerspruch. Also $0 \\le r < b$.
>
> **Eindeutigkeit:** Aus $qb + r = q'b + r'$ folgt $(q - q')b = r' - r$. Die rechte Seite liegt in $(-b, b)$, die linke ist ein Vielfaches von $b$, also beide $0$.

> [!WARNING] Negative Zahlen im Code
> Mathematisch ist $-7 \\bmod 3 = 2$ (denn $-7 = -3 \\cdot 3 + 2$). In C, Java und JavaScript liefert \`-7 % 3\` aber \`-1\`, weil dort Richtung null abgerundet wird. Python (\`-7 % 3 == 2\`) folgt der mathematischen Konvention. Für Hashtabellen- oder Ringpuffer-Indizes nutzt man daher \`((a % n) + n) % n\`.

## Teilbarkeit

> [!DEFINITION] Teiler
> $a$ **teilt** $b$, geschrieben $a \\mid b$, wenn es ein $k \\in \\Z$ gibt mit $b = k a$ – also wenn $b \\bmod a = 0$.

Rechenregeln (alle direkt aus der Definition beweisbar, siehe [Beweistechniken](#/mathe/grundlagen/beweistechniken)):

- $a \\mid b$ und $b \\mid c$ $\\Rightarrow$ $a \\mid c$ (Transitivität)
- $a \\mid b$ und $a \\mid c$ $\\Rightarrow$ $a \\mid (xb + yc)$ für alle $x, y \\in \\Z$ (Linearkombinationen)
- $a \\mid b$ und $b \\neq 0$ $\\Rightarrow$ $\\abs a \\le \\abs b$
- Jede Zahl teilt $0$; $1$ und $-1$ teilen jede Zahl.

Die zweite Regel ist die wichtigste: Gemeinsame Teiler von $b$ und $c$ teilen auch jede Linearkombination. Daraus entstehen die Teilbarkeitsregeln des Dezimalsystems: Wegen $10 \\equiv 1 \\pmod 9$ ist eine Zahl genau dann durch 9 (und durch 3) teilbar, wenn ihre Quersumme es ist.

## Größter gemeinsamer Teiler

> [!DEFINITION] ggT und kgV
> Der **größte gemeinsame Teiler** $\\ggT(a, b)$ zweier nicht beide verschwindender ganzer Zahlen ist die größte natürliche Zahl, die beide teilt. Das **kleinste gemeinsame Vielfache** $\\kgV(a, b)$ ist die kleinste positive Zahl, die von beiden geteilt wird. $a$ und $b$ heißen **teilerfremd**, wenn $\\ggT(a, b) = 1$.

Für positive $a, b$ gilt $\\ggT(a, b) \\cdot \\kgV(a, b) = a \\cdot b$ – so berechnet man das kgV, etwa beim Hauptnenner von Brüchen.

### Der euklidische Algorithmus

Den ggT über die Teiler beider Zahlen zu suchen ist für große Zahlen hoffnungslos. Euklid (um 300 v. Chr.) fand einen besseren Weg:

> [!SATZ] Kernlemma
> Für $a \\in \\Z$ und $b \\ge 1$ gilt $\\ggT(a, b) = \\ggT(b, a \\bmod b)$.

> [!BEWEIS]
> Mit $a = qb + r$ teilt jeder gemeinsame Teiler von $a$ und $b$ auch $r = a - qb$; jeder gemeinsame Teiler von $b$ und $r$ teilt auch $a = qb + r$. Die beiden Paare haben also **dieselben** gemeinsamen Teiler und damit denselben größten.

Man ersetzt also wiederholt $(a, b)$ durch $(b, a \\bmod b)$, bis der Rest $0$ ist. Der letzte von null verschiedene Rest ist der ggT.

> [!BEISPIEL] ggT(240, 46)
> $$
> \\begin{aligned}
> 240 &= 5 \\cdot 46 + 10\\\\
> 46 &= 4 \\cdot 10 + 6\\\\
> 10 &= 1 \\cdot 6 + 4\\\\
> 6 &= 1 \\cdot 4 + 2\\\\
> 4 &= 2 \\cdot 2 + 0
> \\end{aligned}
> $$
> Also $\\ggT(240, 46) = 2$.

\`\`\`python title="Euklidischer Algorithmus"
def ggt(a, b):
    while b != 0:
        a, b = b, a % b
    return a

print(ggt(240, 46))   # 2
print(ggt(1071, 1029)) # 21
\`\`\`

Der Algorithmus ist extrem schnell: Nach je zwei Schritten halbiert sich der kleinere Wert mindestens. Die Anzahl der Schritte ist also $O(\\log \\min(a, b))$ – selbst für Zahlen mit Tausenden Stellen nur einige Tausend Divisionen. Der ungünstigste Fall sind aufeinanderfolgende Fibonacci-Zahlen (Satz von Lamé).

### Der erweiterte Algorithmus und Bézout

> [!SATZ] Lemma von Bézout
> Zu $a, b \\in \\Z$ (nicht beide 0) gibt es ganze Zahlen $x, y$ mit
> $$
> a x + b y = \\ggT(a, b) .
> $$
> Insbesondere: $a$ und $b$ sind genau dann teilerfremd, wenn es $x, y$ mit $ax + by = 1$ gibt.

Die Koeffizienten liefert der **erweiterte euklidische Algorithmus**: Man rechnet die Gleichungskette rückwärts und drückt jeden Rest durch die vorherigen aus.

> [!BEISPIEL] Bézout-Koeffizienten für 240 und 46
> Aus den Zeilen oben, von unten nach oben ($2$ ist der ggT):
> $$
> \\begin{aligned}
> 2 &= 6 - 1\\cdot 4\\\\
> &= 6 - 1\\cdot(10 - 1\\cdot 6) = 2 \\cdot 6 - 10\\\\
> &= 2\\cdot(46 - 4 \\cdot 10) - 10 = 2 \\cdot 46 - 9 \\cdot 10\\\\
> &= 2 \\cdot 46 - 9\\cdot(240 - 5 \\cdot 46) = 47 \\cdot 46 - 9 \\cdot 240 .
> \\end{aligned}
> $$
> Also $240 \\cdot (-9) + 46 \\cdot 47 = 2$. Probe: $-2160 + 2162 = 2$. ✓

Der [Zahlentheorie-Rechner](#/mathe/labor/zahlentheorie) zeigt die vollständige Tabelle für beliebige Zahlen. Bézout ist der Schlüssel zu modularen Inversen – und damit zu RSA.

## Primzahlen

> [!DEFINITION] Primzahl
> Eine natürliche Zahl $p \\ge 2$ heißt **Primzahl**, wenn ihre einzigen positiven Teiler $1$ und $p$ sind. Zahlen $\\ge 2$, die nicht prim sind, heißen zusammengesetzt.

Die ersten Primzahlen sind $2, 3, 5, 7, 11, 13, 17, 19, 23, 29, \\dots$ Dass es unendlich viele gibt, bewies schon Euklid (siehe [Beweistechniken](#/mathe/grundlagen/beweistechniken)).

> [!SATZ] Lemma von Euklid
> Ist $p$ prim und $p \\mid ab$, so gilt $p \\mid a$ oder $p \\mid b$.

> [!BEWEIS]
> Angenommen $p \\nmid a$. Da $p$ prim ist, folgt $\\ggT(p, a) = 1$, nach Bézout also $px + ay = 1$ für gewisse $x, y$. Multiplikation mit $b$: $pbx + aby = b$. Beide Summanden links sind durch $p$ teilbar ($p \\mid ab$), also auch $b$.

> [!SATZ] Fundamentalsatz der Arithmetik
> Jede natürliche Zahl $n \\ge 2$ lässt sich als Produkt von Primzahlen schreiben, und diese Darstellung ist bis auf die Reihenfolge der Faktoren **eindeutig**:
> $$
> n = p_1^{e_1} p_2^{e_2} \\cdots p_k^{e_k} .
> $$

Die Existenz haben wir per starker Induktion gezeigt ([Vollständige Induktion](#/mathe/grundlagen/vollstaendige-induktion)); die Eindeutigkeit folgt aus dem Lemma von Euklid. Mit den Zerlegungen lassen sich ggT und kgV ablesen: Beim ggT nimmt man jede Primzahl mit dem **kleineren**, beim kgV mit dem **größeren** Exponenten. Etwa $360 = 2^3 \\cdot 3^2 \\cdot 5$ und $84 = 2^2 \\cdot 3 \\cdot 7$ ergibt $\\ggT = 2^2 \\cdot 3 = 12$ und $\\kgV = 2^3\\cdot 3^2 \\cdot 5 \\cdot 7 = 2520$.

### Primzahlen finden

- **Probedivision:** $n$ ist prim, wenn keine Primzahl $p \\le \\sqrt n$ teilt (denn ein Teiler $> \\sqrt n$ hätte einen Partner $< \\sqrt n$).
- **Sieb des Eratosthenes:** Alle Primzahlen bis $N$ in $O(N \\log\\log N)$ – Vielfache jeder gefundenen Primzahl streichen.
- **Miller-Rabin-Test:** Für die riesigen Zahlen der Kryptografie (über 300 Stellen) testet man probabilistisch; der Rechner im Labor nutzt eine deterministische Variante.

> [!EXPERT] Faktorisieren ist schwer
> Zwei 1000-stellige Primzahlen zu multiplizieren dauert Millisekunden. Das Produkt wieder zu zerlegen, ist mit bekannten Verfahren (Zahlkörpersieb) praktisch unmöglich. Diese **Asymmetrie** ist die Grundlage von RSA. Ein ausreichend großer Quantencomputer könnte mit dem Shor-Algorithmus effizient faktorisieren – deshalb wird an Post-Quanten-Kryptografie gearbeitet.

Als Faustregel gilt der **Primzahlsatz**: Unter den Zahlen bis $N$ ist etwa jede $\\ln N$-te prim – unter 300-stelligen Zahlen also etwa jede 690-te. Zufällig gewählte große Zahlen sind daher oft genug prim, um für RSA schnell geeignete Primzahlen zu finden. Wie man mit Resten rechnet, zeigt die nächste Lektion, [Modulare Arithmetik](#/mathe/zahlentheorie/modulare-arithmetik).

## Zusammenfassung

- Division mit Rest: $a = qb + r$, $0 \\le r < b$ – Vorsicht bei negativen Zahlen im Code.
- $\\ggT(a, b) = \\ggT(b, a \\bmod b)$ – Euklids Algorithmus braucht nur $O(\\log)$ Schritte.
- Bézout: $ax + by = \\ggT(a, b)$ mit dem erweiterten Algorithmus.
- Jede Zahl $\\ge 2$ hat eine eindeutige Primfaktorzerlegung; Faktorisieren großer Zahlen ist praktisch schwer.
`;export{e as default};
