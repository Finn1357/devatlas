const e=`---
id: api-stile
title: API-Stile im Vergleich: REST, GraphQL, gRPC, WebSockets & Webhooks
area: backend
difficulty: fortgeschritten
minutes: 14
order: 16
summary: Wann welcher Kommunikationsstil passt – von ressourcenorientiertem REST über flexible GraphQL-Abfragen und schnelles gRPC bis zu Echtzeit per WebSocket und ereignisgesteuerten Webhooks.
tags: [API, REST, GraphQL, gRPC, WebSocket, Webhook, SSE]
related: [rest-api-design, http-grundlagen, caching-queues, architekturstile, websockets-echtzeit]
---

## Die Optionen auf einen Blick

| Stil | Kommunikation | Format | Stärken | Schwächen |
|---|---|---|---|---|
| **[[REST]]** | Request/Response | meist JSON | einfach, HTTP-Caching, überall unterstützt | Over-/Underfetching, viele Roundtrips |
| **[[GraphQL]]** | Request/Response (+ Subscriptions) | JSON | Client wählt Felder, ein Endpoint, starkes Schema | Caching und Kostenkontrolle aufwendiger |
| **[[gRPC]]** | RPC, auch Streaming | Protobuf (binär) | sehr schnell, generierte Clients, Verträge | im Browser nur über gRPC-Web, schwerer zu debuggen |
| **[[WebSocket]]** | dauerhaft, bidirektional | beliebig | Echtzeit in beide Richtungen | Zustand je Verbindung, Skalierung anspruchsvoll |
| **Server-Sent Events** | dauerhaft, Server → Client | Text | einfach, über normales HTTP, automatische Wiederverbindung | nur eine Richtung |
| **[[Webhook]]** | Server ruft Server bei Ereignis | meist JSON | kein Polling, ereignisgesteuert | Empfänger muss erreichbar und abgesichert sein |

## REST

Ressourcen über URLs, Aktionen über HTTP-Methoden – der Standard für öffentliche APIs. Details: [REST-API-Design](#/artikel/rest-api-design).

\`\`\`http
GET /api/kunden/42/bestellungen?limit=3
\`\`\`

## GraphQL

Der Client beschreibt genau, welche Daten er braucht – auch über Beziehungen hinweg, in **einer** Anfrage:

\`\`\`graphql
query Startseite {
  kunde(id: 42) {
    name
    bestellungen(letzte: 3) {
      id
      summe
      positionen { produkt { name } menge }
    }
  }
}
\`\`\`

Gut geeignet, wenn viele unterschiedliche Clients (Web, iOS, Android) unterschiedliche Ausschnitte derselben Daten brauchen. Auf dem Server brauchst du Schutz vor teuren Abfragen (Tiefen-/Komplexitätslimits) und eine Lösung für das [[N+1-Problem]] (DataLoader). Mehr unter [GraphQL](#/sprachen/graphql).

## gRPC

Der Vertrag wird in einer \`.proto\`-Datei definiert; daraus erzeugen Werkzeuge Client- und Servercode für viele Sprachen.

\`\`\`text title="bestellung.proto"
syntax = "proto3";

service BestellService {
  rpc HoleBestellung (BestellAnfrage) returns (Bestellung);
  rpc BeobachteStatus (BestellAnfrage) returns (stream StatusUpdate);
}

message BestellAnfrage { int64 id = 1; }
message Bestellung { int64 id = 1; string status = 2; double summe = 3; }
message StatusUpdate { string status = 1; int64 zeit = 2; }
\`\`\`

Binär über HTTP/2 – kompakt, schnell, mit Streaming. Typisch für interne Kommunikation zwischen [[Microservices]].

## WebSockets

Eine dauerhafte, bidirektionale Verbindung – ideal für Chats, Kollaboration, Live-Spiele und Dashboards.

\`\`\`javascript title="Browser"
const ws = new WebSocket('wss://chat.example/raum/42');
ws.addEventListener('open', () => ws.send(JSON.stringify({ typ: 'hallo' })));
ws.addEventListener('message', (e) => zeige(JSON.parse(e.data)));
ws.addEventListener('close', () => setTimeout(verbinde, 2000));   // selbst wiederverbinden
\`\`\`

> [!WARNING] Authentifizierung und Origin prüfen
> Browser senden bei WebSockets Cookies mit, aber es gibt keine CORS-Prüfung wie bei fetch. Der Server muss den \`Origin\`-Header prüfen (Cross-Site WebSocket Hijacking) und den Nutzer authentifizieren.

## Server-Sent Events

Wenn nur der Server Updates schickt (Benachrichtigungen, Fortschritt, Token-Streaming von KI-Antworten), ist SSE oft die einfachere Wahl:

\`\`\`javascript
const quelle = new EventSource('/api/fortschritt/7');
quelle.onmessage = (e) => balken.value = Number(e.data);
\`\`\`

## Webhooks

Statt ständig nachzufragen („Ist die Zahlung durch?“), registrierst du eine URL, die der andere Dienst bei einem Ereignis aufruft.

\`\`\`python title="Webhook sicher empfangen (FastAPI)"
import hmac, hashlib
from fastapi import FastAPI, Header, HTTPException, Request

app = FastAPI()
GEHEIM = b"aus-dem-secret-store"

@app.post("/webhooks/zahlung")
async def zahlung(request: Request, x_signatur: str = Header()):
    body = await request.body()
    erwartet = hmac.new(GEHEIM, body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(erwartet, x_signatur):      # Signatur in konstanter Zeit prüfen
        raise HTTPException(401, "Ungültige Signatur")
    ereignis = await request.json()
    if bereits_verarbeitet(ereignis["id"]):                 # idempotent: Zustellungen können doppelt kommen
        return {"ok": True}
    in_queue_legen(ereignis)                                # schnell antworten, später verarbeiten
    return {"ok": True}
\`\`\`

Regeln: Signatur prüfen, [[Idempotenz|idempotent]] verarbeiten (Anbieter wiederholen bei Fehlern), schnell mit 2xx antworten und die eigentliche Arbeit in eine [Queue](#/artikel/caching-queues) verlagern.

## Entscheidungshilfe

- **Öffentliche API, breite Kompatibilität** → REST
- **Viele Clients mit unterschiedlichem Datenbedarf** → GraphQL
- **Interne, performante Service-Kommunikation** → gRPC
- **Echtzeit in beide Richtungen** → WebSockets
- **Server-Push in eine Richtung** → Server-Sent Events
- **Benachrichtigung über Ereignisse zwischen Systemen** → Webhooks oder Message Broker

Die Stile schließen sich nicht aus: Viele Systeme nutzen REST nach außen, gRPC intern und WebSockets für Live-Funktionen.

## Wie geht es weiter?

Wie Systeme Ereignisse asynchron über Queues austauschen, zeigt [Caching, Rate Limiting & Queues](#/artikel/caching-queues); die Architekturperspektive liefert [Architekturstile](#/artikel/architekturstile).
`;export{e as default};
