const e=`---
id: rsa
title: RSA und Diffie-Hellman
module: zahlentheorie
order: 3
difficulty: profi
minutes: 50
summary: Public-Key-Kryptografie mathematisch verstanden – Schlüsselerzeugung, Ver- und Entschlüsselung und Signaturen mit RSA samt Korrektheitsbeweis, der Diffie-Hellman-Schlüsseltausch und typische Fehler in der Praxis.
tags: [RSA, Public Key, Diffie-Hellman, Diskreter Logarithmus, Signatur, Kryptografie]
requires: [modulare-arithmetik]
---

## Das Problem des Schlüsselaustauschs

Symmetrische Verfahren wie AES verschlüsseln schnell, setzen aber einen gemeinsamen geheimen Schlüssel voraus. Wie vereinbaren zwei Parteien, die sich nie getroffen haben, über ein abgehörtes Netz einen solchen Schlüssel? 1976 zeigten Diffie und Hellman, dass das mathematisch möglich ist; 1977 fanden Rivest, Shamir und Adleman mit **RSA** das erste praktische Verfahren, bei dem jeder einen **öffentlichen** Schlüssel zum Verschlüsseln und einen **privaten** zum Entschlüsseln besitzt ([[Asymmetrische Verschlüsselung]]).

Beide Verfahren beruhen auf **Einwegfunktionen mit Falltür**: Rechnungen, die in eine Richtung leicht und ohne Zusatzwissen in die Gegenrichtung praktisch unmöglich sind. Bei RSA ist das Multiplizieren von Primzahlen (leicht) gegenüber dem Faktorisieren (schwer).

## RSA: Schlüsselerzeugung

> [!DEFINITION] RSA-Schlüsselpaar
> 1. Wähle zwei große, verschiedene Primzahlen $p$ und $q$ (heute je etwa 1024 Bit oder mehr).
> 2. Berechne den **Modul** $n = pq$ und $\\varphi(n) = (p - 1)(q - 1)$.
> 3. Wähle einen **öffentlichen Exponenten** $e$ mit $1 < e < \\varphi(n)$ und $\\ggT(e, \\varphi(n)) = 1$ (üblich: $e = 65537$).
> 4. Berechne den **privaten Exponenten** $d \\equiv e^{-1} \\pmod{\\varphi(n)}$ mit dem erweiterten euklidischen Algorithmus.
>
> **Öffentlicher Schlüssel:** $(n, e)$. **Privater Schlüssel:** $d$ (und $p$, $q$, $\\varphi(n)$ geheim halten oder vernichten).

> [!DEFINITION] Ver- und Entschlüsseln
> Eine Nachricht ist eine Zahl $m$ mit $0 \\le m < n$.
> $$
> \\text{Verschlüsseln: } c = m^e \\bmod n, \\qquad \\text{Entschlüsseln: } m = c^d \\bmod n .
> $$

Beide Operationen sind dank [Square-and-Multiply](#/mathe/zahlentheorie/modulare-arithmetik) schnell, auch bei 2048-Bit-Zahlen.

## Ein durchgerechnetes Beispiel

> [!BEISPIEL] RSA mit kleinen Zahlen
> - $p = 61$, $q = 53$, also $n = 3233$ und $\\varphi(n) = 60 \\cdot 52 = 3120$.
> - $e = 17$; tatsächlich ist $\\ggT(17, 3120) = 1$.
> - $d = 17^{-1} \\bmod 3120 = 2753$, denn $17 \\cdot 2753 = 46\\,801 = 15 \\cdot 3120 + 1$.
>
> **Verschlüsseln** von $m = 65$: $c = 65^{17} \\bmod 3233 = 2790$.
>
> **Entschlüsseln:** $2790^{2753} \\bmod 3233 = 65$. ✓

Im [Zahlentheorie-Rechner](#/mathe/labor/zahlentheorie) kannst du alle Schritte nachrechnen: die Inverse im Reiter „Euklid & Inverse“ (Eingabe $a = 17$, $b = 3120$) und die Potenzen unter „Modulares Potenzieren“.

## Warum RSA funktioniert

> [!SATZ] Korrektheit von RSA
> Für alle $m \\in \\set{0, \\dots, n-1}$ gilt $(m^e)^d \\equiv m \\pmod n$.

> [!BEWEIS]
> Wegen $ed \\equiv 1 \\pmod{\\varphi(n)}$ gibt es ein $k \\ge 0$ mit $ed = 1 + k(p-1)(q-1)$. Wir zeigen $m^{ed} \\equiv m$ zuerst modulo $p$:
>
> - Ist $p \\mid m$, so sind beide Seiten $\\equiv 0 \\pmod p$.
> - Sonst gilt nach dem kleinen Satz von Fermat $m^{p-1} \\equiv 1 \\pmod p$, also
> $$
> m^{ed} = m \\cdot \\left(m^{p-1}\\right)^{k(q-1)} \\equiv m \\cdot 1 = m \\pmod p .
> $$
>
> Genauso folgt $m^{ed} \\equiv m \\pmod q$. Da $p$ und $q$ verschiedene Primzahlen sind, teilen beide die Differenz $m^{ed} - m$, also auch ihr Produkt $n$ (chinesischer Restsatz). Somit $m^{ed} \\equiv m \\pmod n$.

**Warum ist es sicher?** Wer $d$ kennen will, braucht $\\varphi(n)$, und $\\varphi(n)$ aus $n$ zu berechnen ist ebenso schwer wie $n$ zu faktorisieren: Aus $n$ und $\\varphi(n)$ erhält man $p + q = n - \\varphi(n) + 1$ und damit $p, q$ als Lösungen einer quadratischen Gleichung. Die besten bekannten Faktorisierungsverfahren brauchen für 2048-Bit-Moduln eine astronomische Rechenzeit.

## Signaturen

Vertauscht man die Rollen der Schlüssel, erhält man digitale Signaturen: Die Inhaberin des privaten Schlüssels berechnet zu einem Hashwert $h = H(\\text{Nachricht})$ die Signatur $s = h^d \\bmod n$. Jeder kann mit dem öffentlichen Schlüssel prüfen, ob $s^e \\equiv h \\pmod n$. Da nur sie $d$ kennt, kann nur sie gültige Signaturen erzeugen. So funktionieren Zertifikate in TLS, signierte Software-Updates und JWTs mit dem Algorithmus RS256 (siehe [JWT-Decoder](#/labor/jwt)).

## Diffie-Hellman-Schlüsseltausch

Diffie-Hellman nutzt eine andere Einwegfunktion: das Potenzieren modulo einer Primzahl. $g^x \\bmod p$ ist leicht zu berechnen; aus dem Ergebnis $x$ zurückzugewinnen (der **diskrete Logarithmus**) gilt als schwer.

> [!DEFINITION] Diffie-Hellman
> Öffentlich festgelegt sind eine große Primzahl $p$ und eine Basis $g$.
> 1. Alice wählt geheim $a$ und sendet $A = g^a \\bmod p$.
> 2. Bob wählt geheim $b$ und sendet $B = g^b \\bmod p$.
> 3. Alice berechnet $K = B^a \\bmod p$, Bob berechnet $K = A^b \\bmod p$.
>
> Beide erhalten denselben Schlüssel $K = g^{ab} \\bmod p$.

> [!BEISPIEL] Kleine Zahlen
> $p = 23$, $g = 5$. Alice wählt $a = 6$: $A = 5^6 \\bmod 23 = 8$. Bob wählt $b = 15$: $B = 5^{15} \\bmod 23 = 19$. Alice rechnet $19^6 \\bmod 23 = 2$, Bob $8^{15} \\bmod 23 = 2$. Gemeinsamer Schlüssel: $K = 2$.

Ein Lauscher sieht $p, g, A, B$, müsste aber $a$ oder $b$ aus $A$ oder $B$ bestimmen. In TLS 1.3 ist ein (meist auf elliptischen Kurven basierender) Diffie-Hellman-Austausch Pflicht. Weil für jede Verbindung neue geheime Zahlen gewählt werden, bleiben alte Sitzungen auch dann geschützt, wenn später ein Serverschlüssel bekannt wird (**Forward Secrecy**).

> [!DANGER] Man-in-the-Middle
> Diffie-Hellman allein schützt nicht davor, dass sich ein Angreifer zwischen die Parteien setzt und mit beiden je einen eigenen Schlüssel aushandelt. Deshalb werden die ausgetauschten Werte **signiert** (etwa mit RSA oder ECDSA und einem Zertifikat), sodass Alice prüfen kann, dass $B$ wirklich von Bob stammt.

## Lehrbuch-RSA ist unsicher

Die Formeln oben heißen „Textbook-RSA“ – sie sind mathematisch korrekt, in der Praxis aber angreifbar:

- **Deterministisch:** Gleiche Nachrichten ergeben gleiche Geheimtexte. Wer die wenigen möglichen Klartexte („ja“/„nein“) kennt, verschlüsselt sie selbst und vergleicht.
- **Kleine Nachrichten:** Ist $m^e < n$ (etwa $e = 3$ und kurzes $m$), entfällt die Modulo-Reduktion, und $m = \\sqrt[e]{c}$ lässt sich direkt ziehen.
- **Multiplikativ:** $(m_1 m_2)^e = m_1^e m_2^e$ – Geheimtexte lassen sich gezielt manipulieren.

Echte Implementierungen verwenden daher **Padding-Verfahren** mit Zufall (OAEP für Verschlüsselung, PSS für Signaturen), wählen Primzahlen mit geprüften Zufallsgeneratoren und schützen sich gegen Seitenkanalangriffe über die Rechenzeit.

> [!WARNING] Niemals selbst bauen
> Diese Lektion erklärt die Mathematik. Für echte Anwendungen nutzt man geprüfte Bibliotheken (libsodium, die Web Crypto API, OpenSSL, \`cryptography\` in Python) und deren High-Level-Funktionen. Mehr zur Praxis im Artikel [Passwörter & Kryptografie](#/artikel/passwoerter-kryptografie).

## Zusammenfassung

- RSA: $n = pq$, $ed \\equiv 1 \\pmod{\\varphi(n)}$, Verschlüsseln $c = m^e$, Entschlüsseln $m = c^d$ (jeweils mod $n$).
- Korrektheit folgt aus Fermat und dem chinesischen Restsatz; Sicherheit beruht auf der Schwierigkeit des Faktorisierens.
- Signieren mit $d$, prüfen mit $e$; Diffie-Hellman vereinbart $g^{ab}$, sicher durch den diskreten Logarithmus.
- Textbook-RSA ist unsicher – in der Praxis Padding (OAEP/PSS) und geprüfte Bibliotheken.
`;export{e as default};
