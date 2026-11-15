const e=`---
id: rest-api-design
title: REST-API-Design: Ressourcen, Fehler, Paginierung & Versionierung
area: backend
difficulty: fortgeschritten
minutes: 16
order: 11
summary: Konventionen für verständliche, stabile Web-APIs – von der Benennung der Ressourcen über Statuscodes und Fehlerformate bis zu Paginierung, Filtern, Idempotenz und Versionierung.
tags: [REST, API, Design, OpenAPI, Versionierung]
related: [http-grundlagen, api-stile, node-express-api, fastapi-tutorial]
---

## Was macht eine gute API aus?

Eine [[API]] ist ein Vertrag. Gute APIs sind **vorhersagbar** (gleiche Muster überall), **konsistent** (Benennung, Fehler, Formate), **gut dokumentiert** und **stabil** – bestehende Clients dürfen nicht unerwartet brechen. [[REST]] liefert dafür bewährte Konventionen auf Basis von HTTP.

## Ressourcen statt Aktionen

REST modelliert **Ressourcen** (Substantive) mit URLs; die [[HTTP-Methode]] sagt, was passieren soll.

| Ziel | ✅ So | ❌ Nicht so |
|---|---|---|
| Alle Bestellungen | \`GET /bestellungen\` | \`GET /getAllOrders\` |
| Eine Bestellung | \`GET /bestellungen/4711\` | \`GET /bestellung?id=4711\` |
| Anlegen | \`POST /bestellungen\` | \`POST /createOrder\` |
| Teilweise ändern | \`PATCH /bestellungen/4711\` | \`POST /updateOrder\` |
| Löschen | \`DELETE /bestellungen/4711\` | \`GET /deleteOrder/4711\` |
| Unterressource | \`GET /kunden/42/bestellungen\` | \`GET /bestellungenVonKunde?k=42\` |

Konventionen: Plural für Sammlungen, Kleinschreibung mit Bindestrichen (\`/bestell-positionen\`), maximal zwei Ebenen Verschachtelung. Für Aktionen, die nicht in CRUD passen, sind Unterressourcen üblich: \`POST /bestellungen/4711/stornierung\`.

## Statuscodes konsistent verwenden

| Situation | Code |
|---|---|
| Erfolgreich gelesen | \`200 OK\` |
| Angelegt | \`201 Created\` + \`Location\`-Header |
| Erfolgreich, kein Inhalt (z. B. DELETE) | \`204 No Content\` |
| Asynchron angenommen | \`202 Accepted\` |
| Kaputtes JSON / falsches Format | \`400 Bad Request\` |
| Nicht angemeldet | \`401 Unauthorized\` |
| Keine Berechtigung | \`403 Forbidden\` |
| Existiert nicht | \`404 Not Found\` |
| Konflikt (z. B. doppelte E-Mail, veraltete Version) | \`409 Conflict\` |
| Fachlich ungültig (Validierung) | \`422 Unprocessable Content\` |
| Zu viele Anfragen | \`429 Too Many Requests\` |

## Ein einheitliches Fehlerformat

Clients brauchen maschinenlesbare Fehler. Der Standard **RFC 9457 „Problem Details“** definiert ein Format mit \`Content-Type: application/problem+json\`:

\`\`\`json
{
  "type": "https://api.example.de/probleme/validierung",
  "title": "Eingabe ungültig",
  "status": 422,
  "detail": "Die Menge muss mindestens 1 sein.",
  "instance": "/bestellungen",
  "fehler": [{ "feld": "positionen[0].menge", "meldung": "muss ≥ 1 sein" }]
}
\`\`\`

> [!DANGER] Keine internen Details nach außen
> Stack Traces, SQL-Fehlermeldungen oder Dateipfade in Fehlerantworten helfen Angreifern. Logge Details intern mit einer Request-ID und gib nach außen nur die ID und eine neutrale Meldung zurück.

## Paginierung, Filtern, Sortieren

\`\`\`http
GET /produkte?kategorie=technik&preis_max=100&sort=-preis&limit=20&cursor=eyJpZCI6MTIwfQ
\`\`\`

- **Offset-Paginierung** (\`?page=3&limit=20\`): einfach, aber bei großen Tabellen langsam und inkonsistent, wenn sich Daten währenddessen ändern.
- **Cursor-Paginierung** (\`?cursor=…\`): stabil und performant („alles nach ID 120“) – für große oder sich schnell ändernde Daten die bessere Wahl.

\`\`\`json title="Antwort mit Paginierungs-Metadaten"
{
  "daten": [{ "id": 121, "name": "Funkmaus" }],
  "naechster_cursor": "eyJpZCI6MTQwfQ",
  "hat_mehr": true
}
\`\`\`

Setze immer ein **Maximum für \`limit\`**, sonst kann ein Client mit \`limit=1000000\` den Server lahmlegen.

## Idempotenz für sichere Wiederholungen

Netzwerke sind unzuverlässig: Ein Client sendet \`POST /zahlungen\`, die Verbindung bricht ab – wurde die Zahlung ausgeführt? Mit einem **Idempotency-Key** kann der Client gefahrlos wiederholen:

\`\`\`http
POST /zahlungen
Idempotency-Key: 6f1c3b2e-9a1d-4f5e-8c7b-2d9e0f1a3b4c
\`\`\`

Der Server speichert das Ergebnis pro Schlüssel und liefert bei Wiederholung dieselbe Antwort, statt doppelt zu buchen. Siehe [[Idempotenz]].

## Versionierung

Breaking Changes (Felder entfernen, umbenennen, Bedeutung ändern) brechen Clients. Strategien ([[Versionierung (API)]]):

- **Am besten vermeiden:** additiv erweitern (neue optionale Felder), alte Felder als veraltet markieren.
- **URL-Version:** \`/v2/bestellungen\` – einfach, sichtbar, gut cachebar.
- **Header-Version:** \`Accept: application/vnd.shop.v2+json\` – „sauberer“, aber unsichtbarer.

Kommuniziere Abkündigungen frühzeitig (z. B. mit \`Deprecation\`- und \`Sunset\`-Headern) und mit klaren Fristen.

## Dokumentation mit OpenAPI

Beschreibe die API mit [[OpenAPI]] – idealerweise automatisch aus dem Code generiert (FastAPI, NestJS, Spring). Daraus entstehen interaktive Doku (Swagger UI), Client-SDKs und Contract-Tests.

## Sicherheit

- Authentifizierung bei jedem Endpunkt, [[Autorisierung]] **pro Objekt** prüfen („darf Nutzer 42 Bestellung 4711 sehen?“) – fehlende Objektprüfungen (IDOR) sind eine der häufigsten API-Lücken.
- Eingaben validieren (Schema), Ausgaben auf nötige Felder beschränken (keine internen Felder wie \`password_hash\`).
- [[Rate Limiting]], Größenlimits für Bodies, HTTPS überall.

## Wie geht es weiter?

Setze die Konventionen praktisch um mit [Node.js & Express](#/artikel/node-express-api) oder [FastAPI](#/artikel/fastapi-tutorial). Alternativen zu REST vergleicht [API-Stile](#/artikel/api-stile).
`;export{e as default};
