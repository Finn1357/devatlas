const e=`---
id: passwoerter-kryptografie
title: Passwörter, Hashing & Kryptografie für Entwickler
area: security
difficulty: fortgeschritten
minutes: 18
order: 13
summary: Der Unterschied zwischen Hashing, Verschlüsselung und Kodierung, wie man Passwörter richtig speichert, was symmetrische und asymmetrische Kryptografie leisten und wie TLS beides kombiniert.
tags: [Kryptografie, Hashing, Verschlüsselung, Passwörter, TLS, Signaturen]
related: [authentifizierung, oauth-oidc, owasp-top-10, linux-server-nginx]
---

## Drei Begriffe, die oft verwechselt werden

| | Umkehrbar? | Schlüssel? | Zweck | Beispiele |
|---|---|---|---|---|
| **Kodierung** | ja, für jeden | nein | Darstellung ändern | Base64, URL-Encoding, UTF-8 |
| **[[Hashing]]** | nein (Einweg) | nein (ggf. Salt) | Fingerabdruck, Integrität, Passwörter | SHA-256, Argon2 |
| **[[Verschlüsselung]]** | ja, mit Schlüssel | ja | Vertraulichkeit | AES-GCM, ChaCha20, RSA |

> [!DANGER] Base64 ist keine Sicherheit
> „Verschlüsselt“ mit Base64 ist ein häufiger Irrtum. Jeder kann Base64 in einer Sekunde zurückwandeln – probiere es im [Encoding-Labor](#/labor/encoding).

## Kryptografische Hashfunktionen

Eine kryptografische [[Hashfunktion]] bildet beliebige Daten auf einen Wert fester Länge ab und ist:

- **deterministisch** – gleiche Eingabe, gleicher Hash,
- **einweg** – aus dem Hash lässt sich die Eingabe praktisch nicht berechnen,
- **kollisionsresistent** – zwei Eingaben mit gleichem Hash zu finden ist praktisch unmöglich,
- mit **Lawineneffekt** – ein geändertes Bit ändert den ganzen Hash.

\`\`\`python
import hashlib
hashlib.sha256(b"Hallo").hexdigest()    # 753692ec36adb4c794c973945eb2a99c1649703ea6f76bf259abb4fb838e013e
hashlib.sha256(b"hallo").hexdigest()    # d3751d33f9cd5049c4af2b462735457e4d3baf130bcbb87f389e349fbaeb20b9
\`\`\`

Einsatz: Integrität von Downloads prüfen, Git-Objekt-IDs, digitale Signaturen, Deduplizierung. **MD5 und SHA-1 gelten als gebrochen** (Kollisionen sind praktisch erzeugbar) – verwende SHA-256 oder SHA-3.

## Passwörter richtig speichern

Für Passwörter sind schnelle Hashes wie SHA-256 **falsch**: Grafikkarten berechnen Milliarden davon pro Sekunde, und ein gestohlener Datenbankdump wäre schnell geknackt. Passwort-Hashing braucht drei Eigenschaften:

1. **[[Salt]]:** ein zufälliger Wert pro Passwort, gespeichert mit dem Hash. Gleiche Passwörter haben so unterschiedliche Hashes, und vorberechnete Tabellen (Rainbow Tables) nützen nichts.
2. **Absichtlich langsam und speicherintensiv:** Eine Prüfung dauert z. B. 50–200 ms – unmerklich beim Login, aber ein riesiger Aufwand für Angreifer.
3. **Einstellbare Kosten**, die man mit besserer Hardware erhöht.

| Verfahren | Einschätzung |
|---|---|
| **[[Argon2]]id** | empfohlen (Gewinner der Password Hashing Competition) |
| scrypt | gut |
| bcrypt | weiterhin akzeptabel; Eingaben über 72 Byte werden abgeschnitten |
| PBKDF2 | wenn FIPS-Konformität nötig ist, mit sehr hoher Iterationszahl |
| SHA-256, MD5, ungesalzen | ❌ ungeeignet |

\`\`\`python title="Python: argon2-cffi"
from argon2 import PasswordHasher
ph = PasswordHasher()
gespeichert = ph.hash("korrekt Pferd Batterie Heftklammer")
# '$argon2id$v=19$m=65536,t=3,p=4$<salt>$<hash>'  – Algorithmus, Parameter und Salt sind enthalten
ph.verify(gespeichert, "korrekt Pferd Batterie Heftklammer")   # True (sonst Exception)
\`\`\`

\`\`\`javascript title="Node.js: argon2"
import argon2 from 'argon2';
const hash = await argon2.hash(passwort);           // Argon2id ist Standard
const ok = await argon2.verify(hash, eingabe);
\`\`\`

\`\`\`php title="PHP: eingebaut"
$hash = password_hash($passwort, PASSWORD_ARGON2ID);
if (password_verify($eingabe, $hash)) { /* … */ }
\`\`\`

**Passwortrichtlinien** (nach aktuellen Empfehlungen wie NIST SP 800-63B): lieber **Mindestlänge** (z. B. 12+) als komplizierte Zeichenregeln, Passwortmanager und Einfügen erlauben, gegen Listen geleakter Passwörter prüfen, keine erzwungenen regelmäßigen Wechsel ohne Anlass – und [[MFA]] bzw. [[Passkey|Passkeys]] anbieten.

## Symmetrische Verschlüsselung

Bei [[Symmetrische Verschlüsselung|symmetrischer Verschlüsselung]] nutzen Sender und Empfänger **denselben Schlüssel**. Sie ist schnell und eignet sich für große Datenmengen. Standard ist **AES-256-GCM** – eine *authentifizierte* Verschlüsselung, die zusätzlich Manipulation erkennt.

\`\`\`python title="AES-GCM mit der cryptography-Bibliothek"
import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

schluessel = AESGCM.generate_key(bit_length=256)    # sicher verwahren (Secret-Store / KMS)!
aes = AESGCM(schluessel)
nonce = os.urandom(12)                               # NIE mit demselben Schlüssel wiederverwenden
geheim = aes.encrypt(nonce, b"IBAN DE89 3704 0044 0532 0130 00", b"kunde:42")   # + zugehörige Daten
klartext = aes.decrypt(nonce, geheim, b"kunde:42")   # wirft bei Manipulation eine Exception
\`\`\`

> [!WARNING] Nie eigene Kryptografie
> Selbst erdachte Verfahren, ECB-Modus, wiederverwendete Nonces oder \`Math.random()\` für Schlüssel sind klassische Fehler. Nutze High-Level-APIs geprüfter Bibliotheken (libsodium, \`cryptography\`, Web Crypto API, Tink) und lass Schlüssel von einem KMS verwalten.

## Asymmetrische Kryptografie

[[Asymmetrische Verschlüsselung]] nutzt ein **Schlüsselpaar**: Was mit dem öffentlichen Schlüssel verschlüsselt wird, kann nur der private entschlüsseln. Umgekehrt beweist eine mit dem privaten Schlüssel erstellte **[[Digitale Signatur]]**, wer etwas erstellt hat und dass es unverändert ist.

| Anwendung | Wie |
|---|---|
| Schlüsselaustausch (TLS) | (EC)DHE – beide Seiten berechnen ein gemeinsames Geheimnis |
| [[SSH]]-Login | Server prüft, dass du den privaten Schlüssel besitzt |
| [[JWT]] mit RS256/ES256 | Aussteller signiert, jeder kann mit dem öffentlichen Schlüssel prüfen |
| Code- und Container-Signaturen | Herkunft von Software nachweisen |
| [[Passkey|Passkeys]] | privater Schlüssel bleibt auf dem Gerät |

Verfahren: RSA (≥ 3072 Bit), elliptische Kurven (Ed25519, X25519, P-256). Asymmetrische Verfahren sind deutlich langsamer als symmetrische – deshalb werden sie in der Praxis kombiniert.

## Alles zusammen: TLS

[[TLS]] (die Verschlüsselung hinter HTTPS) kombiniert alle Bausteine:

\`\`\`widget
flow:tls-handshake
\`\`\`

1. **Asymmetrisch** (ECDHE): Schlüsselaustausch, ohne dass das Geheimnis übertragen wird.
2. **[[Zertifikat]] + Signatur:** Der Server beweist seine Identität.
3. **Symmetrisch** (AES-GCM/ChaCha20): die eigentlichen Daten, schnell und authentifiziert.
4. **Hashes:** Integrität des Handshakes.

## Zufallszahlen

Für Tokens, Session-IDs, Salts und Schlüssel brauchst du **kryptografisch sichere** Zufallszahlen:

\`\`\`python
import secrets
secrets.token_urlsafe(32)            # Session-/Reset-Token
\`\`\`

\`\`\`javascript
crypto.getRandomValues(new Uint8Array(32));   // Browser & Node.js
crypto.randomUUID();
\`\`\`

\`Math.random()\` und Pythons \`random\` sind **nicht** für Sicherheitszwecke geeignet – ihre Ausgaben sind vorhersagbar.

## Wie geht es weiter?

Wende das Gelernte beim [Login](#/artikel/authentifizierung) und bei [OAuth/OIDC](#/artikel/oauth-oidc) an und probiere Signaturen im [JWT-Labor](#/labor/jwt) aus.
`;export{e as default};
