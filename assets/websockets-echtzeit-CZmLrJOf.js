const e=`---
id: websockets-echtzeit
title: Echtzeit im Web: WebSockets, Server-Sent Events & Polling
area: backend
difficulty: fortgeschritten
minutes: 18
order: 19
summary: Wie Server Daten ohne Neuladen an den Browser schicken – Polling, Long Polling, Server-Sent Events und WebSockets im Vergleich, mit Client- und Servercode, Skalierung über mehrere Server, Proxy-Konfiguration und den wichtigsten Sicherheitsregeln.
tags: [WebSocket, Server-Sent Events, Echtzeit, Long Polling, Socket.IO]
related: [http-grundlagen, node-express-api, fastapi-tutorial, message-broker-events]
---

## Das Problem

HTTP folgt dem Muster **Anfrage → Antwort**: Der Client fragt, der Server antwortet. Für Chats, Live-Dashboards, Benachrichtigungen, Kollaborations-Editoren, Börsenkurse oder Multiplayer-Spiele muss aber der **Server** Daten senden können, sobald etwas passiert.

## Vier Ansätze

| | **Polling** | **Long Polling** | **Server-Sent Events** | **WebSocket** |
|---|---|---|---|---|
| Prinzip | alle n Sekunden fragen | Anfrage bleibt offen, bis es Neues gibt | dauerhafte HTTP-Antwort als Ereignisstrom | dauerhafte, bidirektionale Verbindung |
| Richtung | Client → Server | Client → Server | **Server → Client** | **beide Richtungen** |
| Verzögerung | bis zu n Sekunden | gering | gering | sehr gering |
| Overhead | hoch (viele leere Anfragen) | mittel | gering | sehr gering |
| Wiederverbindung | – | selbst bauen | **automatisch eingebaut** | selbst bauen |
| Infrastruktur | normales HTTP | normales HTTP | normales HTTP | Upgrade-fähige Proxys nötig |
| Gut für | seltene Updates | Fallback | Feeds, Benachrichtigungen, Fortschritt, LLM-Antworten | Chat, Spiele, Kollaboration |

> [!TIP] Nicht immer gleich WebSockets
> Wenn nur der Server Daten schickt (Benachrichtigungen, Live-Ticker, Fortschrittsanzeigen, gestreamte KI-Antworten), sind **Server-Sent Events** einfacher: normales HTTP, automatische Wiederverbindung, funktioniert mit bestehender Authentifizierung und Proxys.

## Server-Sent Events

Der Server hält die Antwort offen und schreibt Ereignisse im Format \`text/event-stream\`:

\`\`\`text
event: bestellung
id: 42
data: {"id": "B-1001", "status": "versendet"}

data: Eine einfache Nachricht ohne Ereignistyp

\`\`\`

Jede Nachricht endet mit einer Leerzeile. \`id\` ermöglicht es, nach einer Unterbrechung fortzusetzen: Der Browser sendet beim Wiederverbinden den Header \`Last-Event-ID\`.

\`\`\`javascript title="Server (Node.js mit Express)"
app.get('/ereignisse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const timer = setInterval(() => {
    res.write(\`event: zeit\\ndata: \${JSON.stringify({ jetzt: new Date().toISOString() })}\\n\\n\`);
  }, 1000);

  req.on('close', () => clearInterval(timer));   // Client hat die Verbindung geschlossen
});
\`\`\`

\`\`\`javascript title="Client (Browser)"
const quelle = new EventSource('/ereignisse');
quelle.addEventListener('zeit', (e) => {
  const { jetzt } = JSON.parse(e.data);
  document.querySelector('#uhr').textContent = jetzt;
});
quelle.onerror = () => console.log('Verbindung unterbrochen – Browser verbindet automatisch neu');
\`\`\`

## WebSockets

Eine **[[WebSocket]]**-Verbindung beginnt als normale HTTP-Anfrage mit der Bitte, das Protokoll zu wechseln:

\`\`\`http
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
Origin: https://example.com

HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
\`\`\`

Danach ist die TCP-Verbindung ein **bidirektionaler Kanal** für kleine Nachrichten (Frames) – Text oder Binärdaten, ohne HTTP-Header bei jeder Nachricht.

\`\`\`javascript title="Client mit automatischer Wiederverbindung"
function verbinde(versuch = 0) {
  const ws = new WebSocket('wss://example.com/chat');     // wss = verschlüsselt (wie https)

  ws.addEventListener('open', () => {
    versuch = 0;
    ws.send(JSON.stringify({ typ: 'beitreten', raum: 'allgemein' }));
  });
  ws.addEventListener('message', (e) => {
    const nachricht = JSON.parse(e.data);
    zeigeAn(nachricht);
  });
  ws.addEventListener('close', () => {
    const warte = Math.min(30_000, 1000 * 2 ** versuch) * (0.5 + Math.random() / 2);   // Backoff + Jitter
    setTimeout(() => verbinde(versuch + 1), warte);
  });
  return ws;
}
\`\`\`

\`\`\`javascript title="Server (Node.js, Bibliothek ws)"
import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080, maxPayload: 64 * 1024 });   // Nachrichten max. 64 KB

wss.on('connection', (ws, req) => {
  ws.on('message', (daten) => {
    let nachricht;
    try {
      nachricht = JSON.parse(daten.toString());
    } catch {
      return ws.close(1003, 'Ungültiges Format');
    }
    // an alle verbundenen Clients weiterleiten (Broadcast)
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ text: String(nachricht.text).slice(0, 500), zeit: Date.now() }));
      }
    }
  });
});
\`\`\`

\`\`\`python title="Server (Python, FastAPI)"
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()
verbunden: set[WebSocket] = set()

@app.websocket("/chat")
async def chat(websocket: WebSocket):
    await websocket.accept()
    verbunden.add(websocket)
    try:
        while True:
            text = await websocket.receive_text()
            for ws in list(verbunden):
                await ws.send_text(text[:500])
    except WebSocketDisconnect:
        verbunden.discard(websocket)
\`\`\`

### Verbindungen am Leben halten

Proxys, Load Balancer und NAT-Router schließen Verbindungen, über die eine Weile nichts läuft. WebSockets haben dafür **Ping/Pong-Frames**: Der Server sendet regelmäßig ein Ping und schließt Verbindungen, die nicht antworten. So werden auch „tote“ Clients (Funkloch) erkannt.

## Hinter einem Reverse Proxy

\`\`\`nginx title="Nginx: WebSocket-Upgrade weiterreichen"
location /chat {
    proxy_pass http://app:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_read_timeout 3600s;          # sonst schließt Nginx inaktive Verbindungen nach 60 s
}
\`\`\`

## Skalierung über mehrere Server

Eine WebSocket-Verbindung hängt an **einem** Serverprozess. Schickt Nutzerin A über Server 1 eine Nachricht an Nutzer B, der mit Server 2 verbunden ist, weiß Server 1 nichts von ihm. Lösung: ein gemeinsamer **Pub/Sub-Kanal** (Backplane), über den alle Server Nachrichten austauschen – typischerweise Redis Pub/Sub, NATS oder ein [Message Broker](#/artikel/message-broker-events).

\`\`\`text
Client A ── Server 1 ──┐                    ┌── Server 2 ── Client B
                       └──► Redis Pub/Sub ◄─┘
\`\`\`

Weitere Punkte:
- Jede offene Verbindung belegt Speicher und einen Dateideskriptor – Limits (\`ulimit -n\`) anpassen.
- Bei Deployments brechen alle Verbindungen ab: Clients müssen sauber wiederverbinden (mit Jitter, damit nicht alle gleichzeitig kommen).
- Mehrere Instanzen hinter einem Load Balancer brauchen für Long Polling oder Socket.IO-Fallbacks **Sticky Sessions**.

## Sicherheit

> [!DANGER] Cross-Site WebSocket Hijacking
> Browser senden beim WebSocket-Handshake Cookies mit – aber die Same-Origin Policy schützt WebSockets **nicht** wie normale \`fetch\`-Anfragen. Eine fremde Seite kann eine Verbindung zu deinem Server öffnen und mit den Cookies des Nutzers Nachrichten lesen und senden. **Prüfe den \`Origin\`-Header** beim Handshake gegen eine Liste erlaubter Herkünfte, oder authentifiziere mit einem kurzlebigen Token statt nur mit Cookies.

Weitere Regeln:
- Nur **\`wss://\`** (TLS) verwenden.
- **Authentifizieren beim Verbindungsaufbau** und **autorisieren pro Nachricht**: Darf dieser Nutzer in diesen Raum schreiben?
- Jede eingehende Nachricht **validieren** (Schema, Größe) – sie ist Benutzereingabe wie jede andere. Beim Anzeigen im Browser \`textContent\` statt \`innerHTML\` ([XSS](#/artikel/xss-csrf-cors)).
- **Rate Limiting** pro Verbindung und Nachrichtengröße begrenzen (\`maxPayload\`).

## Bibliotheken und Dienste

| Werkzeug | Beschreibung |
|---|---|
| **ws** (Node.js) | schlanke, standardkonforme WebSocket-Implementierung |
| **Socket.IO** | Räume, automatische Wiederverbindung, Fallbacks – nutzt ein **eigenes Protokoll** über WebSockets (Client und Server müssen beide Socket.IO sprechen) |
| **SignalR** (ASP.NET Core) | Echtzeit-Abstraktion mit Fallbacks, Hubs, Gruppen |
| **Phoenix Channels** (Elixir) | sehr effizient bei Millionen Verbindungen |
| Ably, Pusher, Supabase Realtime, Firebase | verwaltete Echtzeit-Dienste |

## Wie geht es weiter?

Wie HTTP-Verbindungen grundsätzlich funktionieren, steht in [HTTP verstehen](#/artikel/http-grundlagen); wie Ereignisse zwischen Backend-Diensten fließen, in [Message Broker & Events](#/artikel/message-broker-events).

\`\`\`widget
quiz:Netzwerk 3
\`\`\`
`;export{e as default};
