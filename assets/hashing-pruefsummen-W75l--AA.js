const e=`---
id: hashing-pruefsummen
title: Prüfziffern, CRC und Hashfunktionen
module: zahlentheorie
order: 4
difficulty: fortgeschritten
minutes: 45
summary: Prüfziffern mit modularer Arithmetik (ISBN, IBAN, Luhn), welche Fehler sie erkennen, CRC als Polynomdivision über GF(2), Hashfunktionen für Hashtabellen mit Kollisionen und Geburtstagsparadoxon sowie kryptografische Hashfunktionen.
tags: [Prüfziffer, ISBN, IBAN, Luhn, CRC, Hashfunktion, Geburtstagsparadoxon, Kollision]
requires: [modulare-arithmetik, polynome]
---

## Fehler erkennen mit Resten

Beim Abtippen von Nummern passieren typische Fehler: eine falsche Ziffer, zwei vertauschte Nachbarziffern. Eine **[[Prüfsumme|Prüfziffer]]** ist eine zusätzliche Ziffer, die aus den übrigen nach einer festen Regel berechnet wird. Stimmt sie nicht, ist sicher etwas falsch. Fast alle Verfahren beruhen auf [modularer Arithmetik](#/mathe/zahlentheorie/modulare-arithmetik).

### ISBN-10

> [!DEFINITION] ISBN-10-Prüfziffer
> Für die Ziffern $d_1, \\dots, d_{10}$ einer ISBN-10 muss gelten
> $$
> \\sum_{i=1}^{10} i \\cdot d_i \\equiv 0 \\pmod{11} .
> $$
> Die letzte Stelle kann den Wert $10$ annehmen und wird dann als \`X\` geschrieben.

> [!SATZ] Was ISBN-10 erkennt
> Die ISBN-10 erkennt **jeden** Fehler in einer einzelnen Ziffer und **jede** Vertauschung zweier (auch nicht benachbarter) Ziffern.

> [!BEWEIS]
> Ändert sich Ziffer $d_j$ um $e \\neq 0$ (mit $\\abs e \\le 9$), ändert sich die Summe um $j \\cdot e$. Da $11$ prim ist und weder $j$ ($1 \\le j \\le 10$) noch $e$ durch 11 teilbar sind, ist auch $je$ nicht durch 11 teilbar ([Lemma von Euklid](#/mathe/zahlentheorie/teilbarkeit-euklid)) – die Prüfbedingung schlägt fehl. Vertauscht man $d_j$ und $d_k$ mit $d_j \\neq d_k$, ändert sich die Summe um $(k - j)(d_j - d_k)$; beide Faktoren liegen betragsmäßig zwischen 1 und 10, also wieder nicht durch 11 teilbar.

Dass der Modul **prim** ist, ist der Schlüssel: In $\\Z_{11}$ gibt es keine Nullteiler ([Gruppen, Ringe, Körper](#/mathe/algebra/algebraische-strukturen)). Die seit 2007 übliche ISBN-13 rechnet dagegen modulo 10 mit den Gewichten $1, 3, 1, 3, \\dots$ und übersieht deshalb manche Vertauschungen – etwa wenn zwei benachbarte Ziffern sich um 5 unterscheiden.

### Der Luhn-Algorithmus

Kreditkartennummern verwenden den **Luhn-Algorithmus**: Von rechts beginnend wird jede zweite Ziffer verdoppelt; ist das Ergebnis zweistellig, nimmt man die Quersumme (also $-9$). Die Summe aller so bearbeiteten Ziffern muss durch 10 teilbar sein.

\`\`\`python title="Luhn-Prüfung"
def luhn_gueltig(nummer: str) -> bool:
    ziffern = [int(c) for c in nummer if c.isdigit()]
    summe = 0
    for i, d in enumerate(reversed(ziffern)):
        if i % 2 == 1:          # jede zweite Ziffer von rechts
            d *= 2
            if d > 9:
                d -= 9
        summe += d
    return summe % 10 == 0

print(luhn_gueltig("4539 1488 0343 6467"))   # True
print(luhn_gueltig("4539 1488 0343 6476"))   # False – letzte zwei Ziffern vertauscht
\`\`\`

Luhn erkennt alle Einzelfehler und fast alle Vertauschungen benachbarter Ziffern (außer $09 \\leftrightarrow 90$).

### IBAN

Die IBAN prüft mit **modulo 97**: Man stellt die ersten vier Zeichen ans Ende, ersetzt Buchstaben durch Zahlen ($A = 10, \\dots, Z = 35$) und prüft, ob die entstehende große Zahl modulo 97 den Rest $1$ lässt. Weil $97$ prim und groß ist, werden alle Einzelfehler, alle Vertauschungen benachbarter Zeichen und die meisten anderen Fehler erkannt. Die riesige Zahl muss man dabei nicht als Ganzes bilden: Man reduziert stückweise modulo 97 – genau wie beim [Horner-Schema](#/mathe/algebra/polynome).

## CRC: Prüfsummen als Polynomdivision

Für Netzwerkpakete, ZIP-Dateien, Ethernet und Festplatten reicht eine einzelne Prüfziffer nicht. Die **zyklische Redundanzprüfung** (CRC) fasst die Bits einer Nachricht als Koeffizienten eines Polynoms über $\\mathrm{GF}(2) = \\set{0, 1}$ auf (Addition = XOR) und berechnet den Rest bei Division durch ein festes **Generatorpolynom** $g(x)$.

> [!DEFINITION] CRC
> Sei $m(x)$ das Nachrichtenpolynom und $g(x)$ das Generatorpolynom vom Grad $r$. Die Prüfsumme ist der Rest
> $$
> c(x) = \\big(m(x)\\cdot x^{r}\\big) \\bmod g(x) .
> $$
> Gesendet wird $m(x)\\,x^r + c(x)$ – dieses Polynom ist durch $g(x)$ teilbar. Der Empfänger dividiert und prüft, ob der Rest $0$ ist.

> [!BEISPIEL] CRC von Hand
> Nachricht \`1101\`, Generator $g(x) = x^3 + x + 1$ (Bits \`1011\`, also $r = 3$). Man hängt drei Nullen an und dividiert mit XOR (Polynomdivision über $\\mathrm{GF}(2)$): Unter jede führende \`1\` schreibt man den Generator und bildet das XOR.
> \`\`\`text
> 1101000
> 1011           XOR an Stelle 1
> -------
> 0110000
>  1011          XOR an Stelle 2
> -------
> 0011100
>   1011         XOR an Stelle 3
> -------
> 0001010
>    1011        XOR an Stelle 4
> -------
> 0000001        → Rest 001
> \`\`\`
> Gesendet wird \`1101001\`. Der Empfänger teilt \`1101001\` durch \`1011\` und erhält Rest \`000\` ✓. Kippt bei der Übertragung ein Bit, etwa zu \`1111001\`, ist der Rest nicht null, und der Fehler fällt auf.

Ein Übertragungsfehler entspricht der Addition eines Fehlerpolynoms $e(x)$; er bleibt nur unentdeckt, wenn $g(x)$ auch $e(x)$ teilt. Mit gut gewählten Generatoren (etwa dem 32-Bit-Polynom von CRC-32) werden alle Einzel- und Doppelbitfehler, alle Fehler mit ungerader Bitzahl und alle **Bündelfehler** bis zur Länge 32 erkannt. Hardware berechnet CRCs mit Schieberegistern und XOR-Gattern ([Boolesche Algebra](#/mathe/diskrete-mathematik/boolesche-algebra)) im Takt der Datenübertragung.

> [!WARNING] CRC ist kein Schutz gegen Angriffe
> CRC erkennt **zufällige** Fehler. Wer absichtlich Daten verändert, kann die Prüfsumme passend neu berechnen – CRC ist linear: $\\mathrm{crc}(a \\oplus b) = \\mathrm{crc}(a) \\oplus \\mathrm{crc}(b)$ (bei Initialwert 0). Gegen Manipulation braucht man kryptografische Verfahren (HMAC, Signaturen).

## Hashfunktionen für Hashtabellen

Eine [Hashfunktion](#/artikel/hashing-hashtabellen) bildet Schlüssel beliebiger Größe auf Indizes $0, \\dots, m - 1$ ab. Eine klassische Konstruktion ist die **Polynom-Hashfunktion** für Strings $s = c_0c_1\\dots c_{n-1}$:
$$
h(s) = \\left(\\sum_{i=0}^{n-1} c_i\\, b^{\\,n-1-i}\\right) \\bmod m,
$$
mit einer Basis $b$ (etwa 31) und einem Modul $m$, idealerweise einer Primzahl. Ausgewertet wird sie mit dem Horner-Schema; Javas \`String.hashCode\` rechnet genau so mit $b = 31$ (modulo $2^{32}$ durch Überlauf).

Weil unendlich viele Schlüssel auf $m$ Werte abgebildet werden, gibt es nach dem [Schubfachprinzip](#/mathe/diskrete-mathematik/kombinatorik) zwangsläufig **Kollisionen**. Überraschend ist, wie früh sie auftreten:

> [!SATZ] Geburtstagsparadoxon
> Werden $n$ Schlüssel unabhängig und gleichverteilt auf $m$ Werte gehasht, so ist die Wahrscheinlichkeit, dass **keine** Kollision auftritt,
> $$
> P = \\prod_{k=0}^{n-1}\\left(1 - \\frac km\\right) \\approx \\e^{-\\frac{n(n-1)}{2m}} .
> $$
> Eine Kollision wird ab etwa $n \\approx \\sqrt{2m\\ln 2} \\approx 1{,}18\\sqrt m$ Schlüsseln wahrscheinlicher als nicht.

> [!BEWEIS] Der Produktterm
> Der erste Schlüssel ist frei; der zweite darf den ersten Wert nicht treffen (Wahrscheinlichkeit $1 - \\frac1m$), der dritte keinen der beiden (Wahrscheinlichkeit $1 - \\frac2m$) usw. Die Näherung folgt aus $1 - x \\approx \\e^{-x}$ für kleine $x$ und der [Gaußsumme](#/mathe/grundlagen/vollstaendige-induktion) $0 + 1 + \\dots + (n - 1) = \\frac{n(n-1)}{2}$.

Mit $m = 365$ Tagen genügen 23 Personen für eine Wahrscheinlichkeit über 50 %, dass zwei am selben Tag Geburtstag haben. Für Hashtabellen heißt das: Kollisionen sind normal und müssen behandelt werden (Verkettung, offene Adressierung). Für Hashwerte mit $k$ Bit ($m = 2^k$) werden Kollisionen ab etwa $2^{k/2}$ Werten wahrscheinlich – deshalb hat ein sicherer kryptografischer Hash mindestens 256 Bit.

## Kryptografische Hashfunktionen

Für Passwortspeicherung, Signaturen, Git-Commits und Blockchains braucht man Hashfunktionen mit zusätzlichen Eigenschaften:
- **Einwegfunktion:** Aus $h(x)$ lässt sich $x$ praktisch nicht berechnen.
- **Kollisionsresistenz:** Es ist praktisch unmöglich, $x \\neq y$ mit $h(x) = h(y)$ zu finden.
- **Lawineneffekt:** Ein geändertes Bit der Eingabe ändert etwa die Hälfte der Ausgabebits.

SHA-256 erfüllt das nach heutigem Stand; MD5 und SHA-1 gelten als gebrochen, weil Kollisionen gezielt erzeugt werden können. Für Passwörter verwendet man zusätzlich **langsame** Verfahren mit Salt (Argon2, bcrypt), damit Brute Force teuer wird – mehr im Artikel [Passwörter & Kryptografie](#/artikel/passwoerter-kryptografie).

## Zusammenfassung

- Prüfziffern sind Kongruenzen: ISBN-10 modulo 11 erkennt alle Einzelfehler und Vertauschungen, weil 11 prim ist; Luhn modulo 10, IBAN modulo 97.
- CRC = Rest einer Polynomdivision über $\\mathrm{GF}(2)$; erkennt Bündelfehler, schützt aber nicht vor Manipulation.
- Polynom-Hashes werten mit Horner modulo $m$ aus; Kollisionen ab etwa $\\sqrt m$ Schlüsseln (Geburtstagsparadoxon).
- Kryptografische Hashes brauchen Einweg-Eigenschaft und Kollisionsresistenz (SHA-256, nicht MD5/SHA-1).
`;export{e as default};
