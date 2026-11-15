const e=`---
id: algebraische-strukturen
title: Gruppen, Ringe und Körper
module: algebra
order: 5
difficulty: profi
minutes: 50
summary: Verknüpfungen und ihre Eigenschaften, Gruppen mit Untergruppen und dem Satz von Lagrange, Ringe und Körper, die Restklassenringe Z_n, endliche Körper und Anwendungen in Kryptografie und fehlerkorrigierenden Codes.
tags: [Gruppe, Ring, Körper, Restklassenring, Satz von Lagrange, Endlicher Körper, Homomorphismus]
requires: [relationen, modulare-arithmetik]
---

## Struktur statt Einzelfälle

Ganze Zahlen mit $+$, Restklassen modulo $n$, invertierbare Matrizen mit $\\cdot$, Drehungen eines Quadrats, Permutationen, Bitstrings mit XOR – sehr verschiedene Objekte, die sich beim Rechnen ähnlich verhalten. Die **Algebra** fasst diese Ähnlichkeiten in Axiomen zusammen. Ein Satz, einmal für alle [[Gruppe (Algebra)|Gruppen]] bewiesen, gilt dann für jedes dieser Beispiele.

> [!DEFINITION] Verknüpfung
> Eine **Verknüpfung** auf einer Menge $G$ ist eine Abbildung $G \\times G \\to G$, $(a, b) \\mapsto a \\ast b$. Sie heißt **assoziativ**, wenn $(a \\ast b) \\ast c = a \\ast (b \\ast c)$, und **kommutativ**, wenn $a \\ast b = b \\ast a$ für alle $a, b, c \\in G$.

„Abbildung nach $G$“ heißt insbesondere: Das Ergebnis liegt wieder in $G$ (**Abgeschlossenheit**). Die Subtraktion ist eine Verknüpfung auf $\\Z$, aber nicht auf $\\N$ ($2 - 5 \\notin \\N$).

## Gruppen

> [!DEFINITION] Gruppe
> Eine **Gruppe** $(G, \\ast)$ ist eine Menge $G$ mit einer assoziativen Verknüpfung, sodass
> 1. es ein **neutrales Element** $e$ gibt mit $e \\ast a = a \\ast e = a$ für alle $a$,
> 2. jedes $a$ ein **inverses Element** $a^{-1}$ hat mit $a \\ast a^{-1} = a^{-1} \\ast a = e$.
>
> Ist die Verknüpfung zusätzlich kommutativ, heißt die Gruppe **abelsch**.

| Gruppe | Verknüpfung | neutral | invers | abelsch |
|---|---|---|---|---|
| $(\\Z, +)$ | Addition | $0$ | $-a$ | ja |
| $(\\Q \\setminus \\set0, \\cdot)$ | Multiplikation | $1$ | $\\frac1a$ | ja |
| $(\\Z_n, +)$ | Addition mod $n$ | $0$ | $(n - a) \\bmod n$ | ja |
| $(\\set{0,1}^k, \\oplus)$ | bitweises XOR | $00\\dots0$ | $a$ selbst | ja |
| invertierbare $n \\times n$-Matrizen | Matrixmultiplikation | $I_n$ | $A^{-1}$ | nein ($n \\ge 2$) |
| Permutationen von $\\set{1, \\dots, n}$ | Verkettung | Identität | Umkehrabbildung | nein ($n \\ge 3$) |

Keine Gruppen sind $(\\N, +)$ (keine Inversen) und $(\\Z, \\cdot)$ (nur $\\pm 1$ invertierbar).

> [!SATZ] Grundlegende Eigenschaften
> In jeder Gruppe gilt:
> 1. Das neutrale Element ist eindeutig, ebenso das Inverse jedes Elements.
> 2. $(a \\ast b)^{-1} = b^{-1} \\ast a^{-1}$ und $(a^{-1})^{-1} = a$.
> 3. **Kürzungsregel:** Aus $a \\ast x = a \\ast y$ folgt $x = y$. Insbesondere hat $a \\ast x = b$ genau eine Lösung $x = a^{-1} \\ast b$.

> [!BEWEIS]
> 1. Sind $e, e'$ neutral, so ist $e = e \\ast e' = e'$. Sind $b, c$ invers zu $a$, so ist $b = b \\ast e = b \\ast (a \\ast c) = (b \\ast a) \\ast c = e \\ast c = c$.
> 2. $(a \\ast b) \\ast (b^{-1} \\ast a^{-1}) = a \\ast (b \\ast b^{-1}) \\ast a^{-1} = a \\ast a^{-1} = e$; wegen der Eindeutigkeit ist das das Inverse.
> 3. Von links mit $a^{-1}$ verknüpfen und Assoziativität nutzen.

Regel 2 kennst du schon von Matrizen: $(AB)^{-1} = B^{-1}A^{-1}$ ([Matrizen](#/mathe/lineare-algebra/matrizen)). Die Kürzungsregel bedeutet: In der **Verknüpfungstafel** einer endlichen Gruppe kommt jedes Element in jeder Zeile und Spalte genau einmal vor – wie bei einem Sudoku.

### Untergruppen und der Satz von Lagrange

> [!DEFINITION] Untergruppe, Ordnung
> $U \\subseteq G$ heißt **Untergruppe**, wenn $U$ mit derselben Verknüpfung selbst eine Gruppe ist. Die **Ordnung** einer endlichen Gruppe ist ihre Elementanzahl $\\abs G$; die Ordnung eines Elements $a$ ist das kleinste $k \\ge 1$ mit $a^k = e$.

> [!SATZ] Satz von Lagrange
> Ist $G$ endlich und $U$ eine Untergruppe, so teilt $\\abs U$ die Gruppenordnung $\\abs G$. Insbesondere teilt die Ordnung jedes Elements die Gruppenordnung, und es gilt $a^{\\abs G} = e$.

> [!BEWEIS] Skizze
> Die Mengen $a \\ast U = \\set{a \\ast u \\mid u \\in U}$ (Nebenklassen) haben alle $\\abs U$ Elemente (Kürzungsregel) und sind die Klassen der Äquivalenzrelation $a \\sim b :\\iff a^{-1} \\ast b \\in U$ ([Relationen](#/mathe/grundlagen/relationen)). Sie zerlegen $G$ also in gleich große Teile; daher ist $\\abs G$ ein Vielfaches von $\\abs U$. Die Potenzen eines Elements $a$ bilden eine Untergruppe der Ordnung $\\operatorname{ord}(a)$.

Wendet man Lagrange auf die Gruppe der invertierbaren Restklassen modulo $n$ an – sie hat $\\varphi(n)$ Elemente –, erhält man sofort den **Satz von Euler** $a^{\\varphi(n)} \\equiv 1 \\pmod n$ ([Modulare Arithmetik](#/mathe/zahlentheorie/modulare-arithmetik)). Hier zeigt sich der Nutzen der Abstraktion: Ein allgemeiner Satz über Gruppen liefert einen zahlentheoretischen Satz als Spezialfall.

> [!TIP] Zyklische Gruppen in der Kryptografie
> Diffie-Hellman arbeitet in einer **zyklischen** Gruppe, die von einem Element $g$ erzeugt wird: Jedes Element ist eine Potenz $g^k$. Die Sicherheit hängt an der Gruppenordnung: Ist sie ein Produkt kleiner Primzahlen, lässt sich der diskrete Logarithmus über den chinesischen Restsatz schnell berechnen (Pohlig-Hellman). Deshalb verwendet man Untergruppen großer **Primzahlordnung** – nach Lagrange haben diese keine echten Untergruppen außer $\\set e$.

## Ringe und Körper

Zahlen kann man addieren **und** multiplizieren. Strukturen mit zwei Verknüpfungen heißen Ringe.

> [!DEFINITION] Ring
> Ein **Ring** $(R, +, \\cdot)$ ist eine Menge mit zwei Verknüpfungen, sodass
> 1. $(R, +)$ eine abelsche Gruppe ist (neutral: $0$),
> 2. $\\cdot$ assoziativ ist und ein Einselement $1$ besitzt,
> 3. die **Distributivgesetze** $a(b + c) = ab + ac$ und $(a + b)c = ac + bc$ gelten.
>
> Ist $\\cdot$ kommutativ, heißt der Ring kommutativ.

Beispiele: $\\Z$, $\\Z_n$, Polynome $\\R[x]$, die $n\\times n$-Matrizen (nicht kommutativ). In Ringen kann es **Nullteiler** geben: In $\\Z_6$ ist $2 \\cdot 3 = 0$, obwohl keiner der Faktoren $0$ ist – deshalb darf man dort nicht kürzen.

> [!DEFINITION] Körper
> Ein **Körper** ist ein kommutativer Ring mit $1 \\neq 0$, in dem jedes Element außer $0$ ein multiplikatives Inverses hat – also $(K \\setminus \\set0, \\cdot)$ eine abelsche Gruppe ist.

$\\Q$, $\\R$ und $\\C$ sind Körper, $\\Z$ ist keiner ($2$ hat kein Inverses in $\\Z$). In einem Körper gibt es keine Nullteiler: Aus $ab = 0$ und $a \\neq 0$ folgt $b = a^{-1}ab = 0$. Lineare Algebra – Gauß-Verfahren, Determinanten, Basis, Dimension – funktioniert über **jedem** Körper, weil sie nur die Körperaxiome benutzt.

> [!SATZ] Wann ist Z_n ein Körper?
> Der Restklassenring $\\Z_n$ ist genau dann ein Körper, wenn $n$ eine Primzahl ist.

> [!BEWEIS]
> Ist $n = p$ prim, ist jedes $a \\in \\set{1, \\dots, p - 1}$ zu $p$ teilerfremd und nach dem Lemma von Bézout invertierbar ([Teilbarkeit](#/mathe/zahlentheorie/teilbarkeit-euklid)). Ist $n = ab$ mit $1 < a, b < n$, so ist $a \\cdot b \\equiv 0$ in $\\Z_n$; $a$ ist ein Nullteiler und damit nicht invertierbar.

## Endliche Körper in der Praxis

Neben $\\Z_p$ gibt es für jede Primzahlpotenz $q = p^k$ genau einen Körper mit $q$ Elementen, $\\mathbb F_q$ (auch $\\mathrm{GF}(q)$, „Galois-Feld“). Für $k > 1$ ist er **nicht** $\\Z_q$, sondern entsteht aus Polynomen über $\\Z_p$ modulo eines irreduziblen Polynoms – analog zu $\\Z_p$ aus ganzen Zahlen modulo einer Primzahl.

Der Körper $\\mathbb F_{2^8} = \\mathrm{GF}(256)$ ist in der Informatik allgegenwärtig, weil seine Elemente genau die **Bytes** sind:
- **Addition** ist bitweises XOR – schnell und ohne Überträge.
- **Multiplikation** ist Polynommultiplikation modulo eines festen Polynoms vom Grad 8 (bei AES: $x^8 + x^4 + x^3 + x + 1$).

> [!TIP] Wo GF(256) steckt
> - **AES** nutzt die Inversion in $\\mathrm{GF}(256)$ für die S-Box und Matrixmultiplikationen über $\\mathrm{GF}(256)$ in „MixColumns“.
> - **Reed-Solomon-Codes** (QR-Codes, CDs/DVDs, RAID 6, Datenübertragung von Raumsonden) fassen Daten als Polynom über $\\mathrm{GF}(256)$ auf. Weil ein Polynom vom Grad $k - 1$ durch $k$ Werte eindeutig bestimmt ist ([Polynome](#/mathe/algebra/polynome)), lassen sich aus redundant gespeicherten Werten verlorene oder verfälschte Bytes rekonstruieren.
> - **CRC-Prüfsummen** sind Reste der Polynomdivision über $\\mathrm{GF}(2)$.

## Strukturerhaltende Abbildungen

> [!DEFINITION] Homomorphismus
> Eine Abbildung $f\\colon G \\to H$ zwischen Gruppen heißt **Homomorphismus**, wenn $f(a \\ast b) = f(a) \\circ f(b)$ für alle $a, b$. Ist sie zusätzlich bijektiv, heißt sie **Isomorphismus**; die Gruppen sind dann „bis auf Umbenennung gleich“.

Beispiele: $\\exp\\colon (\\R, +) \\to (\\R_{>0}, \\cdot)$ ist ein Isomorphismus, denn $\\e^{a + b} = \\e^a\\e^b$ – genau das macht Logarithmentafeln möglich ([Potenzen & Logarithmen](#/mathe/algebra/potenzen-logarithmen)). $\\det$ ist ein Homomorphismus von den invertierbaren Matrizen nach $(\\R\\setminus\\set0, \\cdot)$, denn $\\det(AB) = \\det A \\det B$. Und $a \\mapsto a \\bmod n$ ist ein Ringhomomorphismus $\\Z \\to \\Z_n$ – deshalb darf man beim Rechnen modulo $n$ jederzeit reduzieren.

## Zusammenfassung

- Gruppe: assoziativ, neutrales Element, Inverse; abelsch, wenn kommutativ. Inverse sind eindeutig, $(ab)^{-1} = b^{-1}a^{-1}$.
- Satz von Lagrange: Untergruppenordnungen teilen $\\abs G$; daraus folgen Fermat und Euler.
- Ring: zwei Verknüpfungen mit Distributivgesetz; Körper: zusätzlich Inverse für alle Elemente $\\neq 0$.
- $\\Z_n$ ist genau für Primzahlen $n$ ein Körper; $\\mathrm{GF}(256)$ (Bytes mit XOR) steckt in AES, Reed-Solomon und CRC.
`;export{e as default};
