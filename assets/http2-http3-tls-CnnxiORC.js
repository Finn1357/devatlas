const e=`---
id: http2-http3-tls
title: HTTP/2, HTTP/3 und der TLS-Handshake
area: grundlagen
difficulty: fortgeschritten
minutes: 18
order: 25
summary: Warum HTTP/1.1 an Grenzen stößt, wie HTTP/2 mit Streams und Multiplexing arbeitet, was HTTP/3 mit QUIC über UDP besser macht und wie ein TLS-1.3-Handshake Schritt für Schritt abläuft – mit Befehlen zum Nachprüfen.
tags: [HTTP/2, HTTP/3, QUIC, TLS, Netzwerk, Performance]
related: [netzwerke-tcp-ip-dns, http-grundlagen, https-security-header, grpc-grundlagen, web-performance]
---

## Ausgangslage: HTTP/1.1

HTTP/1.1 (1997) ist ein **Textprotokoll**: Anfrage und Antwort bestehen aus lesbaren Zeilen. Pro TCP-Verbindung läuft zu jedem Zeitpunkt höchstens **eine** Anfrage. Will der Browser 60 Dateien laden, muss er warten oder mehrere Verbindungen öffnen – Browser erlauben dafür etwa sechs parallele Verbindungen pro Host.

Probleme:

- **Head-of-Line-Blocking**: Eine langsame Antwort blockiert alle folgenden auf derselben Verbindung.
- **Redundante Header**: Cookies und User-Agent werden bei jeder Anfrage erneut vollständig gesendet.
- **Viele Verbindungen**: Jede kostet einen TCP- und TLS-Handshake und startet mit kleinem Überlastfenster (Slow Start).

Workarounds wie Domain-Sharding, Sprite-Grafiken und das Bündeln aller Skripte entstanden genau deshalb.

## HTTP/2: Binär, gemultiplext

[[HTTP/2]] (RFC 9113) behält die **Semantik** von HTTP – Methoden, Statuscodes, Header – ändert aber die **Übertragung**:

| Konzept | Bedeutung |
|---|---|
| **Binäres Framing** | Nachrichten werden in Frames zerlegt (HEADERS, DATA, SETTINGS, WINDOW_UPDATE, RST_STREAM, GOAWAY …) |
| **Streams** | Jede Anfrage-Antwort ist ein Stream mit eigener ID; ungerade IDs startet der Client |
| **Multiplexing** | Frames vieler Streams werden auf **einer** TCP-Verbindung verschränkt übertragen |
| **HPACK** | Header-Kompression mit statischer und dynamischer Tabelle – wiederholte Header kosten fast nichts |
| **Flusskontrolle** | Empfänger steuern per WINDOW_UPDATE, wie viel pro Stream gesendet werden darf ([[Backpressure]]) |
| **Trailer** | Header nach dem Body – gRPC transportiert darin seinen Status |

\`\`\`text title="Multiplexing auf einer Verbindung"
TCP-Verbindung ──▶ [HEADERS s1][HEADERS s3][DATA s1][DATA s3][DATA s5][DATA s1]…
                     style.css   app.js     style.css app.js  bild.png  style.css
\`\`\`

> [!NOTE] Server Push ist Geschichte
> HTTP/2 sah vor, dass Server Ressourcen ungefragt mitschicken („Push“). In der Praxis brachte das wenig; Chrome hat Push 2022 deaktiviert. Stattdessen nutzt man \`103 Early Hints\` und \`<link rel="preload">\`.

**Grenze von HTTP/2:** Alle Streams teilen sich eine TCP-Verbindung. Geht **ein** TCP-Paket verloren, hält TCP alle nachfolgenden Daten zurück, bis es erneut übertragen wurde – auch die anderer Streams. Das Head-of-Line-Blocking ist von der HTTP- auf die TCP-Ebene gewandert. Auf verlustbehafteten Mobilfunkverbindungen kann HTTP/2 deshalb sogar schlechter abschneiden als mehrere HTTP/1.1-Verbindungen.

## HTTP/3: QUIC über UDP

[[HTTP/3]] (RFC 9114) ersetzt TCP durch **QUIC** (RFC 9000), ein Transportprotokoll über UDP:

- **Streams auf Transportebene**: Paketverlust blockiert nur den betroffenen Stream.
- **TLS 1.3 fest eingebaut**: Transport- und Verschlüsselungs-Handshake laufen gemeinsam – neue Verbindung nach **1 RTT**, Wiederaufnahme sogar mit **0-RTT**.
- **Connection IDs**: Wechselt ein Smartphone vom WLAN ins Mobilnetz (neue IP-Adresse), kann die Verbindung weiterlaufen.
- **Verschlüsselte Transport-Metadaten**: Auch Paketnummern und Steuerinformationen sind geschützt, was Manipulation durch Middleboxes erschwert.

> [!WARNING] 0-RTT und Replay
> Daten, die mit 0-RTT gesendet werden, können von einem Angreifer erneut abgespielt werden. Server sollten 0-RTT nur für idempotente Anfragen (z. B. GET ohne Seiteneffekte) annehmen. Der Statuscode \`425 Too Early\` signalisiert, dass eine Anfrage später erneut gesendet werden soll.

Browser lernen über den Header \`Alt-Svc: h3=":443"\` oder einen DNS-HTTPS-Record, dass ein Server HTTP/3 spricht, und versuchen dann QUIC. Ist UDP blockiert (manche Firmennetze), fallen sie auf HTTP/2 zurück.

| | HTTP/1.1 | HTTP/2 | HTTP/3 |
|---|---|---|---|
| Transport | TCP | TCP | QUIC (UDP) |
| Format | Text | binär | binär |
| Parallele Anfragen pro Verbindung | 1 | viele | viele |
| HoL-Blocking | HTTP + TCP | TCP | nein (pro Stream) |
| Header-Kompression | – | HPACK | QPACK |
| Verschlüsselung | optional (TLS) | in Browsern immer TLS | immer TLS 1.3 |

## Der TLS-1.3-Handshake

[[TLS]] sorgt für Vertraulichkeit, Integrität und Authentizität. TLS 1.3 (RFC 8446) hat den Handshake gegenüber TLS 1.2 auf **einen Roundtrip** verkürzt und unsichere Verfahren (RSA-Schlüsseltransport, CBC-Modi, SHA-1, statisches Diffie-Hellman) entfernt.

\`\`\`widget
flow:tls-handshake
\`\`\`

Schritt für Schritt:

1. **ClientHello**: Der Client nennt unterstützte Cipher Suites (z. B. \`TLS_AES_128_GCM_SHA256\`), Gruppen für den Schlüsselaustausch (z. B. X25519) und schickt gleich einen **Key Share** mit (seinen öffentlichen Diffie-Hellman-Wert). Über **SNI** (Server Name Indication) nennt er den gewünschten Hostnamen, über **ALPN** das gewünschte Protokoll (\`h2\`, \`http/1.1\`).
2. **ServerHello**: Der Server wählt Cipher Suite und Gruppe und schickt seinen Key Share. Ab jetzt können beide den gemeinsamen Schlüssel berechnen (**ECDHE**) – alles Weitere ist verschlüsselt.
3. **EncryptedExtensions, Certificate, CertificateVerify, Finished**: Der Server schickt sein [[Zertifikat]] und beweist mit einer Signatur über den bisherigen Handshake, dass er den privaten Schlüssel besitzt.
4. Der Client **prüft das Zertifikat**: Kette bis zu einer vertrauenswürdigen CA, Gültigkeitszeitraum, Hostname in den Subject Alternative Names, Widerruf (OCSP/CRL, zunehmend über kurze Laufzeiten gelöst).
5. **Client Finished** – danach fließen Anwendungsdaten.

> [!EXPERT] Forward Secrecy
> Weil für jede Verbindung neue, flüchtige Diffie-Hellman-Schlüssel entstehen, kann ein später gestohlener privater Server-Schlüssel aufgezeichneten Verkehr **nicht** nachträglich entschlüsseln. TLS 1.3 erzwingt das; bei TLS 1.2 hing es von der gewählten Cipher Suite ab.

### Mit Werkzeugen nachprüfen

\`\`\`bash title="Protokolle und Zertifikate untersuchen"
# Welche HTTP-Version wird verwendet?
curl -sI --http2 https://example.com -o /dev/null -w '%{http_version}\\n'

# TLS-Handshake, ausgehandelte Version, Cipher und Zertifikatskette anzeigen
openssl s_client -connect example.com:443 -servername example.com -alpn h2 </dev/null

# Nur Gültigkeit und Namen des Zertifikats
openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null \\
  | openssl x509 -noout -dates -subject -ext subjectAltName
\`\`\`

Im Browser zeigen die Entwicklerwerkzeuge (Netzwerk-Tab, Spalte „Protocol“) \`h2\` oder \`h3\` an.

## Was bedeutet das für Entwickler?

- **Bündeln ist weniger wichtig** als früher: Viele kleine Dateien sind mit HTTP/2 kein großes Problem mehr. Sinnvolles Code-Splitting (wie in DevAtlas) schlägt ein einziges Riesen-Bundle, weil Änderungen nur einzelne Dateien ungültig machen.
- **Domain-Sharding schadet** unter HTTP/2: Es verhindert, dass alles über eine Verbindung läuft.
- **Lange Verbindungen** (HTTP/2, gRPC) brauchen Load Balancer, die einzelne Anfragen verteilen (siehe [gRPC in der Praxis](#/artikel/grpc-praxis)).
- **TLS richtig konfigurieren**: TLS 1.2 als Minimum, besser 1.3; automatische Zertifikatserneuerung (z. B. Let’s Encrypt mit ACME); [[HSTS]] setzen (siehe [Security-Header](#/artikel/https-security-header)).

> [!TIP] Übung
> 1. Prüfe mit \`curl -w '%{http_version}'\`, welche HTTP-Version drei Websites deiner Wahl nutzen.
> 2. Lies mit \`openssl s_client\` das Ablaufdatum eines Zertifikats aus. Wie viele Tage ist es noch gültig?
> 3. Erkläre in eigenen Worten, warum HTTP/3 bei 2 % Paketverlust Vorteile gegenüber HTTP/2 hat.
`;export{e as default};
