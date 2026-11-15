const e=`---
id: caching-queues
title: Caching, Rate Limiting, Queues & Background Jobs
area: backend
difficulty: fortgeschritten
minutes: 18
order: 17
summary: Wie Backends schnell und robust bleiben – Caching-Strategien und Invalidierung, Rate Limiting mit Token Bucket, Message Queues und Hintergrundjobs mit Wiederholungen.
tags: [Caching, Redis, Rate Limiting, Queue, Background Jobs, Skalierung]
related: [api-stile, web-performance, architekturstile, indizes-transaktionen, message-broker-events, system-design]
---

## Caching: Ergebnisse wiederverwenden

Ein [[Cache]] speichert Ergebnisse teurer Operationen (Datenbankabfragen, API-Aufrufe, Berechnungen), damit die nächste Anfrage sie schneller bekommt. Caches gibt es auf vielen Ebenen:

| Ebene | Beispiel |
|---|---|
| Browser | \`Cache-Control\`-Header, Service Worker |
| [[CDN]] | statische Dateien, gecachte HTML-Seiten am Rand des Netzes |
| Reverse Proxy | Nginx \`proxy_cache\` |
| Anwendung | In-Memory-Cache, [[Redis]] |
| Datenbank | Buffer Pool, materialisierte Views |

### Cache-Aside (Lazy Loading)

Das häufigste Muster: Erst im Cache schauen, bei einem Fehltreffer aus der Datenbank laden und im Cache ablegen.

\`\`\`python title="Cache-Aside mit Redis"
import json
import redis

r = redis.Redis(host="cache", port=6379, decode_responses=True)

def produkt(produkt_id: int) -> dict:
    schluessel = f"produkt:{produkt_id}"
    treffer = r.get(schluessel)
    if treffer is not None:
        return json.loads(treffer)                 # Cache-Hit
    daten = db.lade_produkt(produkt_id)            # Cache-Miss → Datenbank
    r.set(schluessel, json.dumps(daten), ex=300)   # 5 Minuten TTL
    return daten

def aktualisiere_produkt(produkt_id: int, aenderung: dict) -> None:
    db.aktualisiere(produkt_id, aenderung)
    r.delete(f"produkt:{produkt_id}")              # invalidieren statt veraltet ausliefern
\`\`\`

> [!BEGINNER]
> „There are only two hard things in Computer Science: cache invalidation and naming things.“ – Phil Karlton. Die Schwierigkeit ist nicht das Speichern, sondern zu wissen, **wann** ein gespeichertes Ergebnis nicht mehr stimmt.

### Strategien zur Invalidierung

- **TTL (Time to Live):** Einträge verfallen nach Zeit. Einfach, aber Daten sind bis zu TTL-lang veraltet.
- **Explizites Löschen** bei Änderung (wie oben).
- **Versionierte Schlüssel:** \`produkt:42:v7\` – eine neue Version macht alte Einträge irrelevant.
- **Write-Through:** Beim Schreiben wird auch der Cache aktualisiert.

> [!WARNING] Cache Stampede
> Läuft ein beliebter Eintrag ab, schlagen plötzlich Hunderte Anfragen gleichzeitig auf die Datenbank durch. Gegenmittel: zufällige TTL-Streuung (Jitter), Sperre beim Neuladen („nur einer lädt“), vorzeitiges Auffrischen.

### Was nicht in den Cache gehört

Personalisierte Daten in gemeinsamen Caches (ein falscher Schlüssel zeigt Nutzer A die Daten von Nutzer B), sensible Daten ohne Ablaufzeit und Daten, die immer exakt aktuell sein müssen (Kontostand bei einer Überweisung).

## Rate Limiting

[[Rate Limiting]] begrenzt, wie viele Anfragen ein Client in einem Zeitraum stellen darf – gegen Missbrauch, [[Brute Force]], Scraping und Überlast.

| Algorithmus | Prinzip |
|---|---|
| Fixed Window | Zähler pro Minute; einfach, aber Spitzen an Fenstergrenzen |
| Sliding Window | gleitendes Fenster; gleichmäßiger |
| **Token Bucket** | Eimer füllt sich mit konstanter Rate; jede Anfrage kostet ein Token – erlaubt kurze Bursts |
| Leaky Bucket | Anfragen fließen mit konstanter Rate ab |

\`\`\`python title="Fixed Window mit Redis (atomar)"
def erlaubt(client_id: str, limit: int = 100, fenster_s: int = 60) -> bool:
    schluessel = f"rate:{client_id}:{int(time.time()) // fenster_s}"
    anzahl = r.incr(schluessel)          # atomar, auch bei vielen Server-Instanzen
    if anzahl == 1:
        r.expire(schluessel, fenster_s)
    return anzahl <= limit
\`\`\`

Bei Überschreitung antwortet der Server mit \`429 Too Many Requests\` und einem \`Retry-After\`-Header. Limits gehören pro Nutzer/API-Key und zusätzlich pro IP; besonders streng für Login und Passwort-Reset.

## Message Queues

Eine [[Message Queue]] entkoppelt Systeme: Ein **Produzent** legt Nachrichten ab, ein oder mehrere **Konsumenten** verarbeiten sie, wenn sie Zeit haben.

**Warum?**
- **Schnelle Antworten:** Die API bestätigt die Bestellung sofort; E-Mail, Rechnung und Lagerbuchung passieren danach.
- **Lastspitzen abfedern:** Die Queue puffert, Worker arbeiten im eigenen Tempo.
- **Ausfallsicherheit:** Ist der E-Mail-Dienst kurz weg, warten die Nachrichten.
- **Entkopplung:** Neue Konsumenten (z. B. Analytics) kommen hinzu, ohne den Produzenten zu ändern ([[Event-Driven Architecture]]).

| System | Modell | Typisch für |
|---|---|---|
| RabbitMQ | klassischer Broker, Routing über Exchanges | Aufgabenverteilung, komplexes Routing |
| Apache Kafka | verteiltes, persistentes Log | Event-Streaming, hohe Durchsätze, Replays |
| Redis Streams / Listen | leichtgewichtig | einfache Job-Queues |
| Cloud-Dienste (SQS, Service Bus, Pub/Sub) | verwaltet | ohne eigenen Betrieb |

## Background Jobs

\`\`\`javascript title="BullMQ (Node.js, Redis-basiert)"
import { Queue, Worker } from 'bullmq';
const verbindung = { host: 'cache', port: 6379 };

// Produzent (z. B. im API-Handler)
const mails = new Queue('mails', { connection: verbindung });
await mails.add('bestellbestaetigung', { bestellungId: 4711 }, {
  attempts: 5,
  backoff: { type: 'exponential', delay: 2000 },   // 2 s, 4 s, 8 s …
  jobId: 'bestellbestaetigung-4711',                // verhindert doppelte Jobs
});

// Konsument (eigener Prozess/Container)
new Worker('mails', async (job) => {
  await sendeBestaetigung(job.data.bestellungId);
}, { connection: verbindung, concurrency: 10 });
\`\`\`

Regeln für robuste [[Background Job|Hintergrundjobs]]:

1. **Idempotent** gestalten – die meisten Queues garantieren „mindestens einmal“, ein Job kann also doppelt laufen.
2. **Wiederholungen mit exponentiellem Backoff** und einer Obergrenze.
3. **Dead Letter Queue** für endgültig fehlgeschlagene Jobs – mit Alarm.
4. Jobs **klein halten** und nur IDs übergeben, nicht ganze Objekte (die sich zwischenzeitlich ändern können).
5. **Transaktionsgrenze beachten:** Erst die Datenbank-Transaktion committen, dann den Job einreihen – sonst verarbeitet der Worker Daten, die es (noch) nicht gibt. Robuste Lösung: das Outbox-Pattern.

## Wie geht es weiter?

Wie Caching im Browser wirkt, zeigt [Web-Performance](#/artikel/web-performance); wie Ereignisse ganze Architekturen prägen, [Architekturstile](#/artikel/architekturstile).
`;export{e as default};
