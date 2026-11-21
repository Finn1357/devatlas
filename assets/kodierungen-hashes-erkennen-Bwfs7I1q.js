const e=`---
id: kodierungen-hashes-erkennen
title: Kodierungen, Hashes & Chiffren erkennen
area: security
difficulty: einsteiger
minutes: 18
order: 19
summary: Base64, Hex, URL-Kodierung, ROT13, XOR und Hashes auf einen Blick erkennen und umwandeln – das Handwerkszeug für Krypto- und Misc-Aufgaben in CTFs und für den Alltag mit Tokens und Logs. Mit ausführbaren Python-Beispielen.
tags: [Kodierung, Base64, Hex, Hashes, XOR, ROT13, Kryptografie, CTF]
related: [passwoerter-kryptografie, zahlensysteme-encoding, ctf-einstieg, security-methodik]
---

## Kodierung, Hash, Verschlüsselung – der Unterschied entscheidet

In CTF-Aufgaben und im echten Leben begegnen dir ständig Zeichenketten, die „verschlüsselt aussehen“. Die erste Frage ist immer: **Was ist das?**

| | Umkehrbar? | Braucht einen Schlüssel? | Beispiel |
|---|---|---|---|
| **Kodierung** | ja, für jeden | nein | [[Base64]], Hex, URL-Kodierung |
| **[[Hashfunktion|Hash]]** | nein | nein | SHA-256, bcrypt |
| **[[Verschlüsselung]]** | ja, mit Schlüssel | ja | AES, ChaCha20 |
| **Klassische Chiffre** | ja, Schlüssel leicht zu erraten | ja (aber schwach) | [[Caesar-Chiffre|Caesar/ROT13]], Vigenère |

Kodierungen dekodierst du einfach. Hashes kannst du nicht „entschlüsseln“, nur erkennen. Und moderne Verschlüsselung ohne Schlüssel zu brechen, ist nicht die Aufgabe – in Rätseln steckt der Fehler dann fast immer woanders (schwacher Schlüssel, Schlüssel im Code, falscher Modus). Die Grundlagen dazu stehen in [Passwörter, Hashing & Kryptografie](#/artikel/passwoerter-kryptografie).

## Kodierungen am Aussehen erkennen

| Merkmal | Wahrscheinlich | Beispiel |
|---|---|---|
| A–Z, a–z, 0–9, \`+\`, \`/\`, Länge durch 4 teilbar, oft \`=\` am Ende | Base64 | \`SGFsbG8gV2VsdA==\` |
| wie Base64, aber mit \`-\` und \`_\` | Base64url (z. B. in JWTs) | \`eyJhbGciOiJIUzI1NiJ9\` |
| nur 0–9 und a–f, gerade Länge | Hex | \`48616c6c6f\` |
| \`%\` gefolgt von zwei Hexziffern | URL-Kodierung | \`Hallo%20Welt%21\` |
| Gruppen aus acht Nullen und Einsen | Binär | \`01001000 01101001\` |
| Zahlen zwischen 32 und 126 | ASCII-Dezimalwerte | \`72 105\` |
| echte Wortstruktur, aber falsche Buchstaben | Caesar/ROT13 | \`Unyyb Jryg\` |
| Punkte und Striche | Morse | \`.... .. \` |

> [!TIP] Ein Klassiker: \`eyJ\`
> Beginnt etwas mit \`eyJ\`, ist es fast immer Base64 von \`{"\` – also JSON. JSON Web Tokens ([[JWT]]) bestehen aus drei solchen Teilen, getrennt durch Punkte. Ihr Inhalt ist **nicht verschlüsselt**, sondern nur kodiert; ausprobieren kannst du das im [JWT-Labor](#/labor/jwt).

## Umwandeln: Kommandozeile und Python

\`\`\`bash title="Auf der Linux-Kommandozeile"
echo 'SGFsbG8gV2VsdA==' | base64 -d          # Base64 → Text
echo -n 'Hallo' | base64                     # Text → Base64
echo '48616c6c6f' | xxd -r -p                # Hex → Text
echo -n 'Hallo' | xxd -p                     # Text → Hex
echo 'Unyyb Jryg' | tr 'A-Za-z' 'N-ZA-Mn-za-m'   # ROT13 (hin und zurück)
\`\`\`

Dasselbe in Python – die Beispiele laufen direkt hier im Browser:

\`\`\`python title="Kodierungen in Python"
import base64, binascii, codecs
from urllib.parse import unquote

print(base64.b64decode("SGFsbG8gV2VsdA==").decode())   # Hallo Welt
print(bytes.fromhex("48616c6c6f").decode())             # Hallo
print(codecs.decode("Unyyb Jryg", "rot13"))             # Hallo Welt
print(unquote("Hallo%20Welt%21"))                       # Hallo Welt!
print(binascii.hexlify(b"Hi").decode())                 # 4869
print("".join(chr(int(b, 2)) for b in "01001000 01101001".split()))  # Hi
\`\`\`

> [!INFO] Werkzeuge mit grafischer Oberfläche
> Das [Encoding-Labor](#/labor/encoding) in DevAtlas wandelt zwischen Text, Hex, Base64 und Binär um. Für längere Ketten ist **CyberChef** verbreitet, ein freies Werkzeug, in dem du Umwandlungen wie Bausteine hintereinanderschaltest; die Funktion „Magic“ rät sogar, welche Kodierung vorliegt.

## Mehrere Schichten

In Rätseln ist eine Kodierung selten allein. Gehe Schicht für Schicht vor: dekodieren, Ergebnis ansehen, wieder fragen „Was ist das?“. Hilfreich ist ein kleines Skript, das das Ergebnis nach jedem Schritt ausgibt:

\`\`\`python title="Schicht für Schicht"
import base64, codecs

daten = "NTE0ZTdiNjY3MDc1NzY3MDc1Njc1ZjczNjg3MjY1NWY2NjcwNzU3NjcwNzU2Nzdk"
schritt1 = base64.b64decode(daten).decode()
print("1:", schritt1)            # sieht aus wie Hex
schritt2 = bytes.fromhex(schritt1).decode()
print("2:", schritt2)            # Wortstruktur, falsche Buchstaben → ROT13?
print("3:", codecs.decode(schritt2, "rot13"))
\`\`\`

## XOR: einfach, aber tückisch

[[XOR]] verknüpft Bits „entweder–oder“. Die wichtigste Eigenschaft: a ⊕ k ⊕ k = a. Wer mit demselben Schlüssel zweimal XOR anwendet, erhält die Eingabe zurück. Mit einem echt zufälligen, gleich langen und nur einmal benutzten Schlüssel ist das sogar beweisbar sicher (One-Time-Pad). Wird aber **ein einzelnes Byte** als Schlüssel wiederholt, gibt es nur 256 Möglichkeiten – und die probiert ein Rechner in Millisekunden aus:

\`\`\`python title="Ein-Byte-XOR durchprobieren (Spielzeugbeispiel)"
import string

geheim = bytes.fromhex("6e6b515245587543595e75414f4344755949425f5e5057")
erlaubt = set((string.ascii_letters + string.digits + "_{}").encode())

for schluessel in range(256):
    klartext = bytes(b ^ schluessel for b in geheim)
    if all(z in erlaubt for z in klartext):      # nur Buchstaben, Ziffern, _ { }
        print(schluessel, klartext.decode())
\`\`\`

Von 256 Schlüsseln bleiben eine Handvoll Kandidaten – und nur einer ergibt lesbaren Text. Das ist der Klartext. Die Lehre für echte Software: selbstgebaute „Verschlüsselung“ mit XOR und kurzem Schlüssel schützt nichts. Nutze geprüfte Verfahren wie AES-GCM aus einer Standardbibliothek.

## Hashes erkennen

Einen Hash kann man nicht zurückrechnen. Man kann aber erkennen, **welches Verfahren** vorliegt – meist an Länge und Präfix:

| Aussehen | Verfahren | Einordnung |
|---|---|---|
| 32 Hexzeichen | MD5 | gebrochen, nur noch für Prüfsummen ohne Sicherheitsanspruch |
| 40 Hexzeichen | SHA-1 | Kollisionen praktisch gezeigt, nicht mehr für Sicherheit |
| 64 Hexzeichen | SHA-256 | sicher als Prüfsumme, **zu schnell für Passwörter** |
| 128 Hexzeichen | SHA-512 | wie SHA-256 |
| \`$2a$\`, \`$2b$\`, \`$2y$\` + 56 Zeichen | bcrypt | geeignet für Passwörter |
| \`$argon2id$v=19$…\` | Argon2id | empfohlen für Passwörter |
| \`$6$…\` in \`/etc/shadow\` | SHA-512-crypt | Linux-Standard, langsam durch viele Runden |
| \`$y$…\` in \`/etc/shadow\` | yescrypt | neuerer Linux-Standard |

\`\`\`python title="Hashes selbst berechnen"
import hashlib
for algo in ("md5", "sha1", "sha256"):
    h = hashlib.new(algo, b"DevAtlas").hexdigest()
    print(f"{algo:7} {len(h):3} Zeichen  {h}")
\`\`\`

> [!WARNING] Warum Passwort-Hashes trotzdem „geknackt“ werden
> Angreifer rechnen den Hash nicht zurück, sondern **probieren Kandidaten aus**: Sie hashen Wörter aus Listen bekannter Passwörter und vergleichen. Gegen schnelle Hashes wie MD5 oder SHA-256 gelingen so Milliarden Versuche pro Sekunde. Darum gehören Passwörter in langsame, gesalzene Verfahren (Argon2id, bcrypt) – und darum sind lange, zufällige Passwörter aus einem Passwortmanager so wirksam. Details: [Passwörter, Hashing & Kryptografie](#/artikel/passwoerter-kryptografie).

## Klassische Chiffren

- **Caesar/ROT13:** jeder Buchstabe um *n* verschoben – nur 25 Möglichkeiten, alle durchprobieren.
- **Vigenère:** Verschiebung wechselt mit einem Schlüsselwort; bei bekannter Schlüssellänge zerfällt sie in mehrere Caesar-Chiffren.
- **Einfache Substitution:** jeder Buchstabe durch einen anderen ersetzt. Gebrochen wird sie mit **Häufigkeitsanalyse**: Im Deutschen ist E mit großem Abstand der häufigste Buchstabe, dann N, I, S, R.

\`\`\`python title="Caesar: alle Verschiebungen ausgeben"
text = "Kdoor Zhow"
for n in range(1, 26):
    print(n, "".join(
        chr((ord(c) - base - n) % 26 + base) if c.isalpha() else c
        for c in text
        for base in [65 if c.isupper() else 97]))
\`\`\`

## Typische Fehler

> [!MISTAKE] „Das ist verschlüsselt“ – ist es aber nicht
> Base64 in Cookies, Hex in URLs oder ROT13 in Konfigurationsdateien verbergen nichts. Wer sensible Daten schützen will, braucht echte Verschlüsselung oder – noch besser – speichert sie gar nicht erst beim Client.

- **Zeichensatz vergessen:** Bytes sind nicht automatisch Text. \`UnicodeDecodeError\` heißt oft: Das Ergebnis ist binär (z. B. eine Datei) oder es gibt noch eine Schicht.
- **Zeilenumbrüche mitkodiert:** \`echo\` ohne \`-n\` hängt ein \`\\n\` an – der Base64- oder Hash-Wert ändert sich dadurch.
- **Hash und Verschlüsselung verwechselt:** Einen Hash „entschlüsselt“ niemand; es wird nur geraten und verglichen.

\`\`\`widget
quiz:CTF-Grundlagen 4
\`\`\`

## Übungsfragen

> 1. Woran erkennst du, dass \`SGVsbG8=\` Base64 ist und nicht Hex?
> 2. Ein Hash hat 40 Hexzeichen. Welches Verfahren ist wahrscheinlich, und taugt es zum Speichern von Passwörtern?
> 3. Warum lässt sich ein mit einem einzelnen Byte XOR-verknüpfter Text so leicht lesen?

## Wie geht es weiter?

Übe das Erkennen im [Rätsel-Labor](#/labor/raetsel) und im [Encoding-Labor](#/labor/encoding). Die Hintergründe zu Hashes und Verschlüsselung erklären [Passwörter, Hashing & Kryptografie](#/artikel/passwoerter-kryptografie) und [Zahlensysteme & Zeichenkodierung](#/artikel/zahlensysteme-encoding).
`;export{e as default};
