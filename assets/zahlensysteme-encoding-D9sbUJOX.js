const e=`---
id: zahlensysteme-encoding
title: Zahlensysteme, Gleitkommazahlen & Zeichenkodierung
area: grundlagen
difficulty: einsteiger
minutes: 15
order: 12
summary: Binär und Hexadezimal, Zweierkomplement und Überlauf, warum 0.1 + 0.2 nicht 0.3 ist, und wie Unicode und UTF-8 jedes Zeichen der Welt in Bytes verwandeln.
tags: [Binär, Hexadezimal, Unicode, UTF-8, Float, Encoding]
related: [wie-computer-funktionieren, compiler-interpreter-runtime]
---

## Alles sind Bits

Ein Computer speichert alles – Zahlen, Text, Bilder, Programme – als Folgen von [[Bit|Bits]] (0 und 1). Acht Bits ergeben ein [[Byte]] mit 256 möglichen Werten. Was diese Bits *bedeuten*, hängt allein von der Interpretation ab: Das Byte \`01000001\` ist die Zahl 65 – oder der Buchstabe „A“.

Probiere alles in diesem Artikel interaktiv im [Encoding-Labor](#/labor/encoding) aus.

## Das Binärsystem

Im Dezimalsystem ist jede Stelle eine Zehnerpotenz, im [[Binärsystem]] eine Zweierpotenz:

| Stelle | 2⁷ | 2⁶ | 2⁵ | 2⁴ | 2³ | 2² | 2¹ | 2⁰ |
|---|---|---|---|---|---|---|---|---|
| Wert | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
| Bits für 202 | 1 | 1 | 0 | 0 | 1 | 0 | 1 | 0 |

128 + 64 + 8 + 2 = **202**. Mit n Bits lassen sich 2ⁿ Werte darstellen: 8 Bit → 256, 32 Bit → ~4,3 Milliarden, 64 Bit → ~1,8 × 10¹⁹.

## Hexadezimal

Lange Binärzahlen sind unhandlich. Das [[Hexadezimalsystem]] (Basis 16, Ziffern 0–9 und A–F) fasst je **4 Bit zu einer Ziffer** zusammen:

\`\`\`text
1100 1010   (binär)
   C    A   (hex)  → 0xCA = 202
\`\`\`

Du begegnest Hex bei Farben (\`#4F46E5\`), Speicheradressen, Hashes (\`sha256: 9f86d0…\`), Unicode-Codepoints (\`U+00E4\`) und Byte-Dumps.

\`\`\`python
print(bin(202), hex(202), oct(202))     # 0b11001010 0xca 0o312
print(int("ca", 16), int("11001010", 2)) # 202 202
print(f"{202:08b} {202:02X}")            # 11001010 CA
\`\`\`

## Negative Zahlen: Zweierkomplement

Vorzeichenbehaftete Ganzzahlen werden fast überall im **Zweierkomplement** gespeichert: Das höchste Bit hat einen *negativen* Wert. Bei 8 Bit: −128 bis +127.

\`\`\`text
 0000 0101  =   5
 1111 1011  =  −5   (alle Bits invertieren, +1)
 1111 1111  =  −1
\`\`\`

### Überlauf

Feste Breiten haben Grenzen. Was passiert beim Überschreiten, unterscheidet sich je nach Sprache:

\`\`\`java
int max = Integer.MAX_VALUE;   // 2147483647
System.out.println(max + 1);   // -2147483648 – stiller Überlauf (Wraparound)
\`\`\`

| Sprache | Verhalten bei Überlauf |
|---|---|
| Java, C#, Go | Wraparound (C#: optional \`checked\`-Kontext mit Exception) |
| C, C++ | vorzeichenbehaftet: **undefiniertes Verhalten** |
| Rust | Debug-Build: Panic; Release: Wraparound; explizit \`checked_add\` & Co. |
| Python | kein Überlauf – \`int\` wächst beliebig |
| JavaScript | \`number\` ist ein Float; ab 2⁵³ gehen Ganzzahlen verloren → \`BigInt\` |

## Gleitkommazahlen: warum 0.1 + 0.2 ≠ 0.3

[[Float|Gleitkommazahlen]] (IEEE 754) speichern Zahlen wie in wissenschaftlicher Notation: Vorzeichen, Exponent, Mantisse – aber **binär**. Und so wie 1/3 im Dezimalsystem unendlich viele Stellen hat (0,333…), hat 1/10 im Binärsystem unendlich viele: 0,0001100110011…₂. Die gespeicherte Zahl ist also nur eine Näherung.

\`\`\`javascript
0.1 + 0.2                    // 0.30000000000000004
0.1 + 0.2 === 0.3            // false
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON   // true – mit Toleranz vergleichen
\`\`\`

> [!DANGER] Geld nie als Float
> Rundungsfehler summieren sich. Für Beträge Dezimaltypen (\`Decimal\` in Python, \`BigDecimal\` in Java, \`decimal\` in C#, \`NUMERIC\` in SQL) oder Ganzzahlen in Cent verwenden.

## Zeichenkodierung

Text muss ebenfalls zu Zahlen werden. Eine [[Encoding|Zeichenkodierung]] legt fest, welche Bytes welches Zeichen bedeuten.

### ASCII

[[ASCII]] (1963) kodiert 128 Zeichen in 7 Bit: lateinische Buchstaben, Ziffern, Satz- und Steuerzeichen. \`A\` = 65, \`a\` = 97, \`0\` = 48. Umlaute fehlen – was zu Dutzenden inkompatiblen Erweiterungen führte (ISO 8859-1, Windows-1252 …).

### Unicode

[[Unicode]] löst das Chaos, indem es **jedem Zeichen aller Schriften eine eindeutige Nummer** (Codepoint) gibt – über 150.000 Zeichen, von \`A\` (U+0041) über \`ä\` (U+00E4) und \`€\` (U+20AC) bis \`👋\` (U+1F44B). Unicode ist aber nur die Nummernliste; wie diese Nummern als Bytes gespeichert werden, regelt das Encoding.

### UTF-8

[[UTF-8]] ist das dominierende Encoding im Web. Es nutzt **1 bis 4 Bytes** pro Zeichen und ist für die ersten 128 Zeichen identisch mit ASCII.

| Zeichen | Codepoint | UTF-8-Bytes |
|---|---|---|
| A | U+0041 | \`41\` |
| ä | U+00E4 | \`C3 A4\` |
| € | U+20AC | \`E2 82 AC\` |
| 👋 | U+1F44B | \`F0 9F 91 8B\` |

\`\`\`python
text = "Grüße 👋"
print(len(text))                    # 7 Codepoints
print(len(text.encode("utf-8")))    # 13 Bytes
print(text.encode("utf-8"))         # b'Gr\\xc3\\xbc\\xc3\\x9fe \\xf0\\x9f\\x91\\x8b'
\`\`\`

\`\`\`javascript
'Grüße 👋'.length                     // 8 – JavaScript zählt UTF-16-Einheiten (Emoji = 2)
[...'Grüße 👋'].length                // 7 – Codepoints
new TextEncoder().encode('Grüße 👋').length   // 13 Bytes
\`\`\`

> [!MISTAKE] Mojibake
> Wird UTF-8-Text als Windows-1252 gelesen, wird aus „ä“ ein „Ã¤“. Immer explizit UTF-8 angeben: beim Öffnen von Dateien (\`encoding="utf-8"\`), in HTML (\`<meta charset="UTF-8">\`), in HTTP-Headern (\`charset=utf-8\`) und in der Datenbank (\`utf8mb4\` in MySQL).

## Base64

Base64 stellt beliebige Bytes mit 64 druckbaren Zeichen dar – nützlich, um Binärdaten in Text (E-Mail, JSON, [[JWT|JWTs]], Data-URLs) zu transportieren. Es vergrößert die Daten um ein Drittel und ist **keine Verschlüsselung**.

\`\`\`bash
echo -n "Hallo" | base64        # SGFsbG8=
echo "SGFsbG8=" | base64 -d     # Hallo
\`\`\`

## Wie geht es weiter?

Experimentiere im [Encoding-Labor](#/labor/encoding) mit Bits, Zweierkomplement und UTF-8-Bytes, und lies, wie Daten übers Netz reisen, in [Netzwerke, TCP/IP & DNS](#/artikel/netzwerke-tcp-ip-dns).
`;export{e as default};
