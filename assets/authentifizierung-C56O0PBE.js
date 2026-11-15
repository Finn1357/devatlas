const e=`---
id: authentifizierung
title: Authentifizierung: Was passiert beim Login?
area: backend
difficulty: fortgeschritten
minutes: 20
order: 12
summary: Der komplette Login-Ablauf zwischen Browser, Backend, Datenbank und Session-Store – Sessions vs. JWT, sichere Cookies, Passwort-Hashing, MFA, Passkeys und die häufigsten Fehler.
tags: [Authentifizierung, Login, Session, JWT, Cookies, Security]
related: [oauth-oidc, passwoerter-kryptografie, xss-csrf-cors, owasp-top-10, zugriffskontrolle]
---

## Authentifizierung vs. Autorisierung

- **[[Authentifizierung]]** beantwortet: *Wer bist du?* (Login)
- **[[Autorisierung]]** beantwortet: *Was darfst du?* (Rechteprüfung bei jeder Aktion)

Beides wird oft verwechselt – und beides muss **auf dem Server** passieren. Was im Browser läuft, kann ein Angreifer beliebig verändern.

## Der Login Schritt für Schritt

Was technisch passiert, wenn du auf „Anmelden“ klickst – vom Formular bis zur geschützten Profilseite:

\`\`\`widget
flow:login-session
\`\`\`

## Sessions: der bewährte Standard

Bei der **[[Session]]**-basierten Anmeldung erzeugt der Server nach erfolgreichem Login eine zufällige Session-ID, speichert dazu serverseitig den Zustand (Nutzer-ID, Ablaufzeit) und schickt die ID als [[Cookie]] an den Browser. Der Browser sendet das Cookie bei jeder weiteren Anfrage automatisch mit.

\`\`\`http
Set-Cookie: sid=9f2c41…e1; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600
\`\`\`

| Attribut | Schützt vor |
|---|---|
| \`HttpOnly\` | Auslesen per JavaScript – Diebstahl bei [[XSS]] |
| \`Secure\` | Übertragung ohne HTTPS |
| \`SameSite=Lax\` (oder \`Strict\`) | Mitsenden bei Cross-Site-Anfragen – [[CSRF]] |
| \`Max-Age\` / \`Expires\` | Endlos gültigen Sitzungen |
| Präfix \`__Host-\` im Namen | Überschreiben durch Subdomains |

**Vorteile:** Sofort widerrufbar (Logout, „alle Geräte abmelden“), kleine Cookies, keine Geheimnisse im Browser. **Nachteil:** Der Server braucht einen gemeinsamen Session-Speicher (z. B. [[Redis]]), wenn mehrere Instanzen laufen.

## JWT: zustandslose Tokens

Ein **[[JWT]]** enthält die Nutzerinformationen selbst – signiert, damit niemand sie verändern kann. Der Server muss nichts nachschlagen, sondern nur die Signatur prüfen.

\`\`\`text
eyJhbGciOiJIUzI1NiJ9 . eyJzdWIiOiI0MiIsInJvbGxlIjoiYWRtaW4iLCJleHAiOjE3NjcyMjk2MDB9 . <signatur>
      Header                              Payload (lesbar!)                                Signatur
\`\`\`

Probiere es im [JWT-Labor](#/labor/jwt) aus: Ändere ein Zeichen der Payload – die Signatur wird ungültig.

> [!WARNING] JWTs sind nicht verschlüsselt
> Der Payload ist nur Base64URL-kodiert. Jeder, der das Token hat, kann ihn lesen. Nie Geheimnisse hineinschreiben.

### Sessions oder JWT?

| | Session | JWT |
|---|---|---|
| Zustand | auf dem Server | im Token |
| Widerruf | sofort | schwierig (bis \`exp\`) |
| Skalierung | gemeinsamer Store nötig | Signaturprüfung genügt |
| Typischer Einsatz | Web-Anwendungen mit eigenem Backend | Service-zu-Service, OAuth/OIDC-Access-Tokens, APIs für viele Clients |

> [!TIP] Faustregel
> Für eine klassische Web-App mit eigenem Backend sind **Sessions mit HttpOnly-Cookies** meist die sicherere und einfachere Wahl. JWTs spielen ihre Stärken bei verteilten Systemen und bei [OAuth/OpenID Connect](#/artikel/oauth-oidc) aus. Tokens im Browser nicht in \`localStorage\` ablegen – dort sind sie bei XSS auslesbar.

## Passwörter richtig speichern

Passwörter werden **nie** im Klartext oder verschlüsselt gespeichert, sondern mit einem langsamen, gesalzenen Verfahren [[Hashing|gehasht]] – heute [[Argon2]]id, alternativ bcrypt oder scrypt.

\`\`\`python title="Registrierung und Login mit argon2-cffi"
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

ph = PasswordHasher()                       # sichere Standardparameter

def registriere(email: str, passwort: str) -> None:
    db.speichere_nutzer(email, ph.hash(passwort))   # Hash enthält Salt und Parameter

def login(email: str, passwort: str) -> int | None:
    nutzer = db.finde_nutzer(email)
    if nutzer is None:
        ph.hash(passwort)                    # ähnliche Laufzeit, um Konten nicht zu verraten
        return None
    try:
        ph.verify(nutzer.password_hash, passwort)
    except VerifyMismatchError:
        return None
    if ph.check_needs_rehash(nutzer.password_hash):  # Parameter seit Registrierung erhöht?
        db.aktualisiere_hash(nutzer.id, ph.hash(passwort))
    return nutzer.id
\`\`\`

Details zu Hashing, Salt und Verschlüsselung: [Passwörter & Kryptografie](#/artikel/passwoerter-kryptografie).

## Mehr als ein Passwort: MFA und Passkeys

- **[[MFA]]** verlangt einen zweiten Faktor (TOTP-App, Hardware-Key). Selbst ein geleaktes Passwort reicht dann nicht.
- **[[Passkey|Passkeys]]** (WebAuthn/FIDO2) ersetzen Passwörter durch Schlüsselpaare auf dem Gerät. Sie sind **phishing-resistent**, weil die Signatur an die Domain gebunden ist.

## Sicherheits-Checkliste für den Login

- [x] Nur über HTTPS, HSTS aktiv
- [x] Passwörter mit Argon2id/bcrypt, Mindestlänge statt komplizierter Regeln, Abgleich mit geleakten Passwörtern
- [x] Einheitliche Fehlermeldung „E-Mail oder Passwort falsch“
- [x] [[Rate Limiting]] und Schutz vor [[Brute Force]]
- [x] Session-ID nach dem Login neu erzeugen (Session Fixation)
- [x] Cookies mit \`HttpOnly\`, \`Secure\`, \`SameSite\`
- [x] Logout invalidiert die Session serverseitig
- [x] Passwort-Reset mit einmaligen, kurzlebigen, zufälligen Tokens
- [x] MFA bzw. Passkeys anbieten
- [x] Anmeldeereignisse protokollieren – ohne Passwörter zu loggen

## Typische Fehler

> [!MISTAKE] Autorisierung nur im Frontend
> Den „Löschen“-Button für Nicht-Admins auszublenden, schützt nichts. Jede API-Anfrage muss serverseitig prüfen, ob der Nutzer die Aktion für **genau dieses Objekt** ausführen darf.

> [!MISTAKE] Eigene Krypto oder Token-Formate
> Selbst erfundene „Verschlüsselung“ der Nutzer-ID im Cookie wird gebrochen. Nutze bewährte Bibliotheken und Framework-Funktionen.

## Wie geht es weiter?

Lerne „Anmelden mit Google/Microsoft“ und Single Sign-On mit [OAuth 2.0 & OpenID Connect](#/artikel/oauth-oidc) und schütze dich vor [XSS und CSRF](#/artikel/xss-csrf-cors).

\`\`\`widget
quiz:Security 3
\`\`\`
`;export{e as default};
