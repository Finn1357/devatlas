const e=`---
id: http-grundlagen
title: HTTP verstehen: Anfragen, Antworten, Methoden & Statuscodes
area: backend
difficulty: einsteiger
minutes: 16
order: 10
summary: Das Protokoll des Webs von Grund auf – Aufbau von Request und Response, Methoden, Statuscodes, Header, Cookies, Caching und die Unterschiede zwischen HTTP/1.1, HTTP/2 und HTTP/3.
tags: [HTTP, HTTPS, REST, Statuscodes, Header, Netzwerk]
related: [rest-api-design, authentifizierung, netzwerke-tcp-ip-dns, web-performance]
---

## Was ist HTTP?

[[HTTP]] (Hypertext Transfer Protocol) ist das Protokoll, mit dem Browser, Apps und Server kommunizieren. Es folgt dem [[Client-Server-Modell]]: Der Client schickt eine **Anfrage** (Request), der Server eine **Antwort** (Response). HTTP ist **zustandslos** – jede Anfrage steht für sich; Zustand (z. B. „angemeldet“) wird über [[Cookie|Cookies]] oder Tokens transportiert.

Was alles passiert, bevor die erste HTTP-Anfrage überhaupt rausgeht – DNS, TCP, TLS –, zeigt dieser Ablauf:

\`\`\`widget
flow:url-eingabe
\`\`\`

## Aufbau einer Anfrage

\`\`\`http
POST /api/bestellungen HTTP/1.1
Host: shop.example
Content-Type: application/json
Authorization: Bearer eyJhbGciOi…
Accept: application/json

{"produktId": 7, "menge": 2}
\`\`\`

1. **Startzeile:** [[HTTP-Methode|Methode]], Pfad (+ [[Query-Parameter]]), Protokollversion
2. **[[Header]]:** Metadaten als \`Name: Wert\`
3. **Leerzeile**
4. **Body** (optional): die Nutzdaten ([[Payload]]), z. B. [[JSON]]

## Aufbau einer Antwort

\`\`\`http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/bestellungen/4711
Cache-Control: no-store

{"id": 4711, "status": "offen"}
\`\`\`

Startzeile mit **[[Statuscode]]**, dann Header, Leerzeile und Body.

## Methoden

| Methode | Bedeutung | Safe | [[Idempotenz|Idempotent]] | Body |
|---|---|---|---|---|
| \`GET\` | Ressource lesen | ✓ | ✓ | nein |
| \`HEAD\` | wie GET, nur Header | ✓ | ✓ | nein |
| \`POST\` | neue Ressource anlegen / Aktion auslösen | – | – | ja |
| \`PUT\` | Ressource vollständig ersetzen | – | ✓ | ja |
| \`PATCH\` | Ressource teilweise ändern | – | – (meist) | ja |
| \`DELETE\` | Ressource löschen | – | ✓ | selten |
| \`OPTIONS\` | erlaubte Methoden erfragen (CORS-Preflight) | ✓ | ✓ | nein |

**Safe** heißt: keine Zustandsänderung. **Idempotent** heißt: mehrfaches Ausführen hat denselben Effekt wie einmaliges – wichtig, damit Clients nach einem Timeout gefahrlos wiederholen können.

> [!MISTAKE] Zustand per GET ändern
> \`GET /konto/loeschen?id=5\` ist gefährlich: Links werden von Browsern vorgeladen, von Crawlern besucht und sind anfällig für [[CSRF]]. Änderungen immer mit POST/PUT/PATCH/DELETE.

## Statuscodes

| Bereich | Bedeutung | Wichtige Codes |
|---|---|---|
| 1xx | Information | 101 Switching Protocols ([[WebSocket]]) |
| 2xx | Erfolg | 200 OK, 201 Created, 204 No Content |
| 3xx | Umleitung | 301 dauerhaft, 302/307 vorübergehend, 304 Not Modified |
| 4xx | Fehler des Clients | 400, 401, 403, 404, 409, 422, 429 |
| 5xx | Fehler des Servers | 500, 502, 503, 504 |

Die vollständige Liste mit Verwendungshinweisen steht im [HTTP-Cheatsheet](#/cheatsheets/http).

> [!TIP] 401 oder 403?
> **401 Unauthorized** heißt eigentlich „nicht authentifiziert“ – wer bist du? **403 Forbidden** heißt „ich weiß, wer du bist, aber du darfst das nicht“.

## Wichtige Header

| Header | Richtung | Zweck |
|---|---|---|
| \`Content-Type\` | beide | Format des Bodys (\`application/json; charset=utf-8\`) |
| \`Accept\` | Request | gewünschtes Antwortformat |
| \`Authorization\` | Request | Zugangsdaten, z. B. \`Bearer <token>\` |
| \`Cookie\` / \`Set-Cookie\` | Request / Response | Sitzungsdaten |
| \`Cache-Control\`, \`ETag\` | Response | Caching steuern |
| \`Location\` | Response | Ziel einer Umleitung oder URL der neuen Ressource |
| \`Origin\`, \`Access-Control-*\` | beide | [[CORS]] |
| \`Strict-Transport-Security\`, \`Content-Security-Policy\` | Response | Sicherheit (HSTS, CSP) |

## Caching mit HTTP

\`\`\`http
HTTP/1.1 200 OK
Cache-Control: max-age=300
ETag: "v42"
\`\`\`

Nach fünf Minuten fragt der Browser nach: \`If-None-Match: "v42"\`. Hat sich nichts geändert, antwortet der Server mit **304 Not Modified** ohne Body – das spart Bandbreite.

## Mit HTTP experimentieren

\`\`\`bash
curl -i https://example.com                                   # Antwort mit Headern
curl -s https://api.github.com/repos/nodejs/node | jq .stargazers_count
curl -X POST -H "Content-Type: application/json" -d '{"name":"Ada"}' https://httpbin.org/post
\`\`\`

Im Browser zeigt der **Network-Tab** der DevTools jede Anfrage mit Headern, Timing und Body.

## HTTP/1.1, HTTP/2, HTTP/3

| Version | Transport | Besonderheiten |
|---|---|---|
| HTTP/1.1 | [[TCP]] | Textprotokoll, eine Anfrage gleichzeitig pro Verbindung |
| HTTP/2 | TCP + TLS | binär, Multiplexing vieler Anfragen über eine Verbindung, Header-Kompression |
| HTTP/3 | QUIC über [[UDP]] | schnellerer Verbindungsaufbau, kein Head-of-Line-Blocking auf Transportebene |

Für Anwendungsentwickler bleibt die Semantik (Methoden, Header, Statuscodes) gleich.

## HTTPS

[[HTTPS]] ist HTTP über eine [[TLS]]-verschlüsselte Verbindung. Ohne HTTPS kann jeder im selben WLAN Passwörter mitlesen und Inhalte manipulieren. Heute ist HTTPS Pflicht – Browser markieren HTTP-Seiten als unsicher, und viele APIs (Service Worker, Geolocation, Passkeys) funktionieren nur darüber. Wie die Verschlüsselung ausgehandelt wird, zeigt der [TLS-Handshake](#/how-it-works/tls-handshake).

## Wie geht es weiter?

Entwirf saubere Schnittstellen mit [REST-API-Design](#/artikel/rest-api-design) und baue sie mit [Node.js](#/artikel/node-express-api) oder [FastAPI](#/artikel/fastapi-tutorial).

\`\`\`widget
quiz:Web & HTTP 3
\`\`\`
`;export{e as default};
