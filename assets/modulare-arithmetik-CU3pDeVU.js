const e=`---
id: modulare-arithmetik
title: Modulare Arithmetik, Fermat und Euler
module: zahlentheorie
order: 2
difficulty: fortgeschritten
minutes: 50
summary: Kongruenzen und Restklassen, Rechnen modulo n, modulare Inverse, schnelles Potenzieren, die Sätze von Fermat und Euler, die φ-Funktion und der chinesische Restsatz.
tags: [Kongruenz, Restklassen, Modulare Inverse, Square-and-Multiply, Fermat, Euler, Chinesischer Restsatz]
requires: [teilbarkeit-euklid, relationen]
---

## Kongruenzen

> [!DEFINITION] Kongruenz modulo n
> Für $n \\ge 1$ heißen $a, b \\in \\Z$ **kongruent modulo $n$**, geschrieben
> $$
> a \\equiv b \\pmod n,
> $$
> wenn $n \\mid (a - b)$ – gleichbedeutend: wenn $a$ und $b$ bei Division durch $n$ denselben Rest lassen.

Die [[Modulare Arithmetik|Kongruenz]] ist eine Äquivalenzrelation ([Relationen](#/mathe/grundlagen/relationen)). Ihre Klassen heißen **Restklassen** $[a]_n = \\set{a + kn \\mid k \\in \\Z}$; es gibt genau $n$ davon, repräsentiert durch $0, 1, \\dots, n - 1$. Die Menge der Restklassen heißt $\\Z/n\\Z$ oder kurz $\\Z_n$.

Alltägliche Beispiele: Uhrzeiten (modulo 12 oder 24), Wochentage (modulo 7), Winkel (modulo 360°) und jeder ganzzahlige Datentyp – ein \`uint32\` rechnet modulo $2^{32}$, deshalb läuft $4\\,294\\,967\\,295 + 1$ auf $0$ über.

## Rechnen mit Restklassen

> [!SATZ] Verträglichkeit mit + und ·
> Gilt $a \\equiv a' \\pmod n$ und $b \\equiv b' \\pmod n$, so folgt
> $$
> a + b \\equiv a' + b' \\pmod n \\qquad\\text{und}\\qquad a \\cdot b \\equiv a' \\cdot b' \\pmod n .
> $$

> [!BEWEIS]
> Mit $a' = a + kn$ und $b' = b + ln$ ist $a'b' = ab + (al + bk + kln)\\,n$, also $a'b' - ab$ durch $n$ teilbar. Für die Summe ist es noch einfacher.

Man darf also in jedem Zwischenschritt **reduzieren**. Das hält Zahlen klein:

> [!BEISPIEL] Letzte Ziffer einer Potenz
> Welche Endziffer hat $7^{2026}$? Gesucht ist $7^{2026} \\bmod 10$. Die Potenzen von $7$ modulo 10 sind $7, 9, 3, 1, 7, 9, \\dots$ – periodisch mit Länge 4. Wegen $2026 = 4 \\cdot 506 + 2$ ist $7^{2026} \\equiv 7^2 \\equiv 9 \\pmod{10}$.

**Division ist heikel:** Aus $2 \\cdot 3 \\equiv 2 \\cdot 8 \\pmod{10}$ folgt nicht $3 \\equiv 8 \\pmod{10}$. Kürzen ist nur erlaubt, wenn der gekürzte Faktor zu $n$ teilerfremd ist.

## Modulare Inverse

> [!DEFINITION] Inverses Element
> $x$ heißt **Inverses** von $a$ modulo $n$, wenn $a x \\equiv 1 \\pmod n$. Man schreibt $x \\equiv a^{-1} \\pmod n$.

> [!SATZ] Existenz der Inversen
> $a$ besitzt genau dann ein Inverses modulo $n$, wenn $\\ggT(a, n) = 1$. Es ist modulo $n$ eindeutig und lässt sich mit dem erweiterten euklidischen Algorithmus berechnen.

> [!BEWEIS]
> Ist $\\ggT(a, n) = 1$, liefert Bézout $ax + ny = 1$, also $ax \\equiv 1 \\pmod n$. Umgekehrt: Aus $ax \\equiv 1$ folgt $ax - 1 = kn$, also $ax - kn = 1$; jeder gemeinsame Teiler von $a$ und $n$ teilt $1$.

> [!BEISPIEL] 17⁻¹ mod 3120
> Der erweiterte Euklid liefert $17 \\cdot 2753 - 15 \\cdot 3120 = 1$, also $17^{-1} \\equiv 2753 \\pmod{3120}$. Probe: $17 \\cdot 2753 = 46\\,801 = 15 \\cdot 3120 + 1$. ✓ (Genau diese Rechnung kommt im RSA-Beispiel der [nächsten Lektion](#/mathe/zahlentheorie/rsa) vor.)

Ist $p$ eine Primzahl, so ist jede Zahl $1, \\dots, p - 1$ zu $p$ teilerfremd – in $\\Z_p$ kann man also durch jedes Element außer $0$ teilen. $\\Z_p$ ist ein **Körper**, wie $\\Q$ oder $\\R$. Darauf beruhen fehlerkorrigierende Codes (Reed-Solomon in QR-Codes) und elliptische Kurven.

## Schnelles Potenzieren

Kryptografie braucht Potenzen wie $a^e \\bmod n$ mit Exponenten von über 600 Stellen. $e$-mal zu multiplizieren ist unmöglich. Das **Square-and-Multiply**-Verfahren nutzt die Binärdarstellung des Exponenten:
$$
a^{13} = a^{8 + 4 + 1} = a^8 \\cdot a^4 \\cdot a^1 .
$$
Die Potenzen $a, a^2, a^4, a^8, \\dots$ entstehen durch fortgesetztes Quadrieren – modulo $n$ reduziert. Der Aufwand ist $O(\\log e)$ Multiplikationen.

\`\`\`python title="Square-and-Multiply"
def mod_pow(a, e, n):
    ergebnis = 1
    a %= n
    while e > 0:
        if e & 1:               # niedrigstes Bit gesetzt?
            ergebnis = ergebnis * a % n
        a = a * a % n           # quadrieren
        e >>= 1
    return ergebnis

print(mod_pow(4, 13, 497))      # 445 – identisch zu pow(4, 13, 497)
\`\`\`

Python bringt das Verfahren als \`pow(a, e, n)\` mit, Java als \`BigInteger.modPow\`.

## Die Sätze von Fermat und Euler

> [!SATZ] Kleiner Satz von Fermat
> Ist $p$ eine Primzahl und $p \\nmid a$, so gilt
> $$
> a^{p-1} \\equiv 1 \\pmod p .
> $$

> [!BEWEIS]
> Die Zahlen $a, 2a, \\dots, (p-1)a$ sind modulo $p$ paarweise verschieden (aus $ia \\equiv ja$ folgt durch Multiplikation mit $a^{-1}$, dass $i \\equiv j$) und alle $\\not\\equiv 0$. Sie sind also eine Umordnung von $1, 2, \\dots, p - 1$. Multipliziert man alle:
> $$
> a^{p-1} \\cdot (p-1)! \\equiv (p-1)! \\pmod p .
> $$
> Da $(p-1)!$ zu $p$ teilerfremd ist, darf man kürzen und erhält $a^{p-1} \\equiv 1$.

Anwendung: $3^{100} \\bmod 7$. Nach Fermat ist $3^6 \\equiv 1$, und $100 = 6 \\cdot 16 + 4$, also $3^{100} \\equiv 3^4 = 81 \\equiv 4 \\pmod 7$.

Für zusammengesetzte Moduln braucht man die Anzahl der invertierbaren Restklassen:

> [!DEFINITION] Eulersche φ-Funktion
> $\\varphi(n)$ ist die Anzahl der Zahlen $1 \\le k \\le n$ mit $\\ggT(k, n) = 1$. Für Primzahlen ist $\\varphi(p) = p - 1$, für Primzahlpotenzen $\\varphi(p^k) = p^k - p^{k-1}$, und für teilerfremde $m, n$ gilt $\\varphi(mn) = \\varphi(m)\\varphi(n)$.

Daraus folgt die Formel $\\varphi(n) = n \\prod_{p \\mid n}\\left(1 - \\frac1p\\right)$, etwa $\\varphi(36) = 36 \\cdot \\frac12 \\cdot \\frac23 = 12$. Für RSA wichtig: $\\varphi(pq) = (p-1)(q-1)$ für verschiedene Primzahlen $p, q$.

> [!SATZ] Satz von Euler
> Ist $\\ggT(a, n) = 1$, so gilt
> $$
> a^{\\varphi(n)} \\equiv 1 \\pmod n .
> $$

Der Beweis verläuft wie bei Fermat, nur mit den $\\varphi(n)$ invertierbaren Restklassen statt $1, \\dots, p-1$. Fermat ist der Spezialfall $n = p$.

> [!WARNING] Fermat ist kein Primzahltest
> Gilt $a^{n-1} \\not\\equiv 1 \\pmod n$, ist $n$ sicher zusammengesetzt. Die Umkehrung gilt nicht: Die **Carmichael-Zahl** $561 = 3 \\cdot 11 \\cdot 17$ erfüllt $a^{560} \\equiv 1 \\pmod{561}$ für alle zu 561 teilerfremden $a$, ist aber nicht prim. Der Miller-Rabin-Test verfeinert die Idee so, dass es keine solchen Ausnahmen gibt.

## Der chinesische Restsatz

> [!SATZ] Chinesischer Restsatz
> Sind $m_1, \\dots, m_k$ paarweise teilerfremd und $M = m_1 \\cdots m_k$, so hat das System
> $$
> x \\equiv r_1 \\pmod{m_1}, \\quad \\dots, \\quad x \\equiv r_k \\pmod{m_k}
> $$
> genau eine Lösung $x$ modulo $M$.

> [!BEISPIEL] Sunzi (3. Jh.)
> „Eine Zahl lässt beim Teilen durch 3 den Rest 2, durch 5 den Rest 3, durch 7 den Rest 2.“ Schrittweise: Aus $x \\equiv 2 \\pmod 3$ folgt $x = 2 + 3k$. Einsetzen in die zweite Bedingung: $2 + 3k \\equiv 3 \\pmod 5$, also $3k \\equiv 1$, $k \\equiv 2 \\pmod 5$ (denn $3 \\cdot 2 = 6 \\equiv 1$). Damit $x = 8 + 15j$. Dritte Bedingung: $8 + 15j \\equiv 2 \\pmod 7$, also $1 + j \\equiv 2$, $j \\equiv 1$. Ergebnis $x \\equiv 23 \\pmod{105}$.

Der Satz erlaubt, Rechnungen modulo einer großen Zahl in mehrere kleine aufzuteilen – RSA-Implementierungen beschleunigen so das Entschlüsseln etwa um den Faktor 4.

## Zusammenfassung

- $a \\equiv b \\pmod n \\iff n \\mid a - b$; Summen und Produkte darf man jederzeit reduzieren.
- $a$ ist modulo $n$ invertierbar $\\iff \\ggT(a, n) = 1$; Inverse liefert der erweiterte Euklid.
- Square-and-Multiply berechnet $a^e \\bmod n$ in $O(\\log e)$ Schritten.
- Fermat: $a^{p-1} \\equiv 1 \\pmod p$; Euler: $a^{\\varphi(n)} \\equiv 1 \\pmod n$; der chinesische Restsatz setzt Kongruenzen zusammen.
`;export{e as default};
