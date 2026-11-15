const e=`---
id: message-broker-events
title: Message Broker & Event-Driven Architecture: RabbitMQ, Kafka & Outbox
area: backend
difficulty: profi
minutes: 22
order: 18
summary: Warum Systeme über Nachrichten kommunizieren, Queue vs. Pub/Sub vs. Log, RabbitMQ und Kafka im Vergleich, Zustellgarantien, idempotente Consumer, das Outbox-Muster, Reihenfolge, Dead Letter Queues und Schema-Evolution.
tags: [Message Broker, Kafka, RabbitMQ, Events, Outbox, Idempotenz, Pub/Sub]
related: [caching-queues, domain-driven-design, system-design, architekturstile]
---

## Warum Nachrichten?

Ruft ein Dienst einen anderen **synchron** auf (HTTP, gRPC), sind beide gekoppelt: Ist der Empfänger langsam oder ausgefallen, wartet bzw. scheitert der Aufrufer. Ein **[[Message Broker]]** entkoppelt Sender und Empfänger zeitlich: Der Sender legt eine Nachricht ab und arbeitet weiter; der Empfänger verarbeitet sie, wenn er bereit ist.

| Vorteil | Beispiel |
|---|---|
| **Lastspitzen abfedern** | 10.000 Bestellungen in einer Minute – Worker arbeiten die Queue im eigenen Tempo ab |
| **Ausfallsicherheit** | Der E-Mail-Dienst ist eine Stunde down – Nachrichten warten und werden danach zugestellt |
| **Lose Kopplung** | Neue Dienste (Analytics, Empfehlungen) abonnieren Ereignisse, ohne dass der Sender geändert wird |
| **Skalierung** | Mehr Consumer starten, wenn die Queue wächst |

Der Preis: **eventual consistency** (Ergebnisse sind nicht sofort sichtbar), schwierigeres Debugging über Systemgrenzen und neue Fehlerklassen (doppelte Nachrichten, falsche Reihenfolge).

## Drei Kommunikationsmuster

| Muster | Funktionsweise | Typisch für |
|---|---|---|
| **Queue** (Point-to-Point) | Jede Nachricht wird von **genau einem** Consumer verarbeitet und dann entfernt | Aufgaben verteilen: E-Mails senden, Bilder skalieren |
| **Publish/Subscribe** | Jede Nachricht geht an **alle** Abonnenten | Ereignis „Bestellung aufgegeben“ an Lager, Rechnung, Analytics |
| **Log / Stream** | Nachrichten werden **dauerhaft in Reihenfolge** gespeichert; jeder Consumer merkt sich seine Position | Event-Streaming, Datenpipelines, Wiedereinspielen der Historie |

## RabbitMQ und Kafka

| | **RabbitMQ** | **Apache Kafka** |
|---|---|---|
| Modell | Broker mit Exchanges und Queues (AMQP) | verteiltes, partitioniertes Log |
| Nach dem Verarbeiten | Nachricht wird gelöscht (nach Ack) | bleibt gemäß Aufbewahrungsdauer erhalten |
| Routing | flexibel: direct, topic, fanout, headers | über Topics und Partitionen |
| Reihenfolge | pro Queue | pro Partition |
| Durchsatz | hoch | sehr hoch (Millionen Nachrichten/s im Cluster) |
| Erneut lesen | nein | ja – Offset zurücksetzen |
| Stärken | Aufgaben-Queues, komplexes Routing, Prioritäten | Event-Streaming, Event Sourcing, Datenintegration |

Weitere Optionen: **NATS** (leichtgewichtig, sehr schnell), **Redis Streams**, verwaltete Cloud-Dienste wie **Amazon SQS/SNS**, **Google Pub/Sub**, **Azure Service Bus**.

### RabbitMQ in Python

\`\`\`yaml title="compose.yaml – RabbitMQ lokal mit Weboberfläche"
services:
  rabbitmq:
    image: rabbitmq:4-management
    ports:
      - "5672:5672"     # AMQP
      - "15672:15672"   # Management-UI (nur lokal veröffentlichen!)
\`\`\`

\`\`\`python title="Producer (Bibliothek pika)"
import json
import pika

verbindung = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
kanal = verbindung.channel()
kanal.queue_declare(queue="emails", durable=True)          # Queue übersteht Broker-Neustart

kanal.basic_publish(
    exchange="",
    routing_key="emails",
    body=json.dumps({"an": "ada@example.org", "vorlage": "willkommen"}),
    properties=pika.BasicProperties(delivery_mode=2),       # 2 = Nachricht persistent speichern
)
verbindung.close()
\`\`\`

\`\`\`python title="Consumer mit manueller Bestätigung"
def verarbeite(kanal, methode, eigenschaften, body):
    auftrag = json.loads(body)
    sende_email(auftrag["an"], auftrag["vorlage"])
    kanal.basic_ack(delivery_tag=methode.delivery_tag)       # erst NACH erfolgreicher Arbeit bestätigen

kanal.basic_qos(prefetch_count=10)                          # höchstens 10 unbestätigte Nachrichten
kanal.basic_consume(queue="emails", on_message_callback=verarbeite)
kanal.start_consuming()
\`\`\`

### Kafka in Node.js

Kafka speichert Nachrichten in **Topics**, die in **Partitionen** aufgeteilt sind. Nachrichten mit demselben **Schlüssel** landen in derselben Partition – und behalten damit ihre Reihenfolge. Consumer einer **Consumer Group** teilen sich die Partitionen.

\`\`\`javascript title="Producer und Consumer (Bibliothek kafkajs)"
import { Kafka } from 'kafkajs';

const kafka = new Kafka({ clientId: 'shop', brokers: ['localhost:9092'] });

// Producer
const producer = kafka.producer();
await producer.connect();
await producer.send({
  topic: 'bestellungen',
  messages: [{ key: 'kunde-42', value: JSON.stringify({ typ: 'BestellungAufgegeben', bestellungId: 'B-1001' }) }],
});

// Consumer – mehrere Instanzen mit gleicher groupId teilen sich die Arbeit
const consumer = kafka.consumer({ groupId: 'lager' });
await consumer.connect();
await consumer.subscribe({ topic: 'bestellungen', fromBeginning: true });
await consumer.run({
  eachMessage: async ({ partition, message }) => {
    const ereignis = JSON.parse(message.value.toString());
    console.log(partition, message.offset, ereignis.typ);
  },
});
\`\`\`

## Zustellgarantien

| Garantie | Bedeutung | Risiko |
|---|---|---|
| **At-most-once** | höchstens einmal – bestätigen vor dem Verarbeiten | Nachrichten können verloren gehen |
| **At-least-once** | mindestens einmal – bestätigen nach dem Verarbeiten | **Duplikate** (Absturz zwischen Verarbeitung und Bestätigung) |
| **Exactly-once** | genau einmal | in verteilten Systemen nur eingeschränkt erreichbar (Kafka-Transaktionen innerhalb von Kafka) |

In der Praxis gilt: **At-least-once + idempotente Consumer** ergibt effektiv „genau einmal“ – und ist der Standardansatz.

### Idempotente Consumer

Ein Consumer ist [[Idempotenz|idempotent]], wenn die mehrfache Verarbeitung derselben Nachricht dasselbe Ergebnis hat wie die einmalige.

\`\`\`python title="Duplikate erkennen – in derselben Transaktion wie die eigentliche Arbeit"
def verarbeite_zahlung(nachricht, db):
    with db.transaction():
        neu = db.execute(
            "INSERT INTO verarbeitete_nachrichten (nachricht_id) VALUES (%s) ON CONFLICT DO NOTHING",
            (nachricht["id"],),
        ).rowcount
        if neu == 0:
            return                                   # schon verarbeitet – ignorieren
        db.execute("UPDATE konten SET saldo = saldo + %s WHERE id = %s",
                   (nachricht["betrag"], nachricht["konto_id"]))
\`\`\`

Alternativ sind manche Operationen von Natur aus idempotent: „setze Status auf versendet“ statt „erhöhe Zähler“.

## Das Outbox-Muster

Ein klassisches Problem: Eine Bestellung wird in der Datenbank gespeichert **und** ein Ereignis an den Broker gesendet. Was, wenn das eine gelingt und das andere nicht?

- Erst speichern, dann senden → Absturz dazwischen: Bestellung existiert, Ereignis fehlt.
- Erst senden, dann speichern → Ereignis für eine Bestellung, die es nie gab.

Das **[[Outbox-Muster]]** löst das: Das Ereignis wird in **derselben Datenbanktransaktion** in eine Tabelle \`outbox\` geschrieben. Ein separater Prozess liest die Outbox und veröffentlicht die Ereignisse beim Broker.

\`\`\`sql title="Fachliche Änderung und Ereignis atomar speichern" norun
BEGIN;
INSERT INTO bestellungen (id, kunde_id, status) VALUES ('B-1001', 42, 'aufgegeben');
INSERT INTO outbox (id, topic, schluessel, inhalt)
VALUES (gen_random_uuid(), 'bestellungen', 'kunde-42',
        '{"typ": "BestellungAufgegeben", "bestellungId": "B-1001"}');
COMMIT;
\`\`\`

\`\`\`python title="Outbox-Relay (vereinfacht)"
while True:
    with db.transaction():
        zeilen = db.query("SELECT * FROM outbox ORDER BY erstellt_am LIMIT 100 FOR UPDATE SKIP LOCKED")
        for z in zeilen:
            broker.publish(z["topic"], key=z["schluessel"], value=z["inhalt"])
            db.execute("DELETE FROM outbox WHERE id = %s", (z["id"],))
    time.sleep(0.5)
\`\`\`

Stürzt das Relay nach dem Senden, aber vor dem Löschen ab, wird das Ereignis erneut gesendet – deshalb brauchen Consumer Idempotenz. Statt Polling kann **Change Data Capture** (z. B. Debezium) die Outbox direkt aus dem Datenbank-Log lesen.

## Reihenfolge, Fehler und Dead Letter Queues

- **Reihenfolge** ist nur innerhalb einer Queue bzw. Partition garantiert – und auch dort nur, solange nur ein Consumer gleichzeitig verarbeitet. Wähle den Partitionsschlüssel so, dass zusammengehörige Ereignisse (alle einer Bestellung) zusammen bleiben.
- **Vorübergehende Fehler** (Timeout eines Drittsystems): mit Verzögerung erneut versuchen.
- **Dauerhafte Fehler** (ungültige Daten): Eine „Giftnachricht“ darf die Queue nicht endlos blockieren. Nach einigen Versuchen wandert sie in eine **Dead Letter Queue** (DLQ), wird überwacht und manuell geprüft.

> [!WARNING] Queues überwachen
> Die wichtigste Metrik ist die **Queue-Länge bzw. der Consumer-Lag** (wie weit hinkt die Verarbeitung hinterher?). Wächst sie stetig, kommen die Consumer nicht hinterher – lange bevor Nutzer etwas merken.

## Ereignisse gut entwerfen

- **Vergangenheitsform** und fachliche Namen: \`BestellungAufgegeben\`, nicht \`UpdateOrderTable\`.
- **Eindeutige ID** und **Zeitstempel** in jedem Ereignis (für Idempotenz und Nachvollziehbarkeit); der Standard **CloudEvents** definiert ein gemeinsames Format.
- **Event Notification** (nur IDs: „Bestellung B-1001 wurde aufgegeben“ – Empfänger fragt Details ab) vs. **Event-carried State Transfer** (alle relevanten Daten im Ereignis – Empfänger braucht keinen Rückruf).
- **Schema-Evolution:** Felder nur hinzufügen, nie umdeuten oder entfernen, ohne Versionswechsel. Schema-Registries mit Avro, Protobuf oder JSON Schema prüfen die Kompatibilität automatisch.
- **Keine sensiblen Daten** in Ereignisse, die viele Systeme lesen und die lange aufbewahrt werden.

## Wie geht es weiter?

Einfache Hintergrundjobs mit Redis-basierten Queues zeigt [Caching, Rate Limiting & Queues](#/artikel/caching-queues). Wie Ereignisse Bounded Contexts verbinden, erklärt [Domain-Driven Design](#/artikel/domain-driven-design).
`;export{e as default};
