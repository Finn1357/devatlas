const e=`---
id: kafka-stream-processing
title: Apache Kafka & Stream Processing: Topics, Fenster, Watermarks und Exactly-once
area: data
difficulty: profi
minutes: 24
order: 4
summary: Kafka als Rückgrat für Datenströme – Topics, Partitionen, Offsets, Consumer Groups und Zustellgarantien mit Python-Beispielen – sowie die Konzepte der Stream-Verarbeitung: Ereigniszeit, Zeitfenster, Watermarks, Zustand, Stream-Joins und Exactly-once mit Apache Flink und Kafka Streams.
tags: [Kafka, Stream Processing, Flink, Watermark, Windowing, Exactly-once, Event Time]
related: [message-broker-events, data-engineering-grundlagen, apache-spark, datenqualitaet-monitoring, grpc-streaming]
---

## Kafka als Datenrückgrat

**[Apache Kafka](#/tech/kafka)** ist ein verteiltes, dauerhaftes **Log**: Producer hängen Ereignisse an, Consumer lesen sie in ihrem eigenen Tempo – auch Stunden oder Tage später und beliebig oft. Für die Architektursicht (Queue vs. Pub/Sub, Outbox-Muster) siehe [Message Broker & Events](#/artikel/message-broker-events); hier geht es um Kafka als Quelle und Ziel von Datenpipelines.

| Begriff | Bedeutung |
|---|---|
| **[[Topic]]** | benannter Ereignisstrom, z. B. \`bestellungen\` |
| **Partition** | Teil eines Topics; ein geordnetes, unveränderliches Log. Parallelität = Anzahl Partitionen |
| **Schlüssel** | bestimmt die Partition (Hash) – gleiche Schlüssel landen in derselben Partition, ihre Reihenfolge bleibt erhalten |
| **[[Offset]]** | Position einer Nachricht in ihrer Partition |
| **[[Consumer Group]]** | Consumer mit gleicher \`group.id\` teilen sich die Partitionen; jede Partition liest genau ein Mitglied |
| **Broker / Replikation** | Server des Clusters; jede Partition hat einen Leader und Replikate (Replication Factor, typischerweise 3) |
| **Retention** | Nachrichten bleiben nach Zeit oder Größe erhalten – oder per **Log Compaction** nur der letzte Wert je Schlüssel |

> [!NOTE] KRaft statt ZooKeeper
> Seit Kafka 4.0 (2025) verwaltet Kafka seine Metadaten ausschließlich selbst über das Raft-basierte **KRaft**; ZooKeeper wird nicht mehr unterstützt. Ältere Anleitungen mit ZooKeeper-Containern sind veraltet.

### Lokal ausprobieren

\`\`\`bash title="Kafka im Container (ein Knoten, nur zum Lernen)"
docker run -d --name kafka -p 9092:9092 apache/kafka:4.0.0

docker exec kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 \\
  --create --topic bestellungen --partitions 3 --replication-factor 1

# Nachrichten von Hand senden und lesen
docker exec -it kafka /opt/kafka/bin/kafka-console-producer.sh --bootstrap-server localhost:9092 --topic bestellungen
docker exec -it kafka /opt/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic bestellungen --from-beginning
\`\`\`

### Producer und Consumer in Python

\`\`\`python title="producer.py (pip install confluent-kafka)"
import json
from confluent_kafka import Producer

producer = Producer({
    "bootstrap.servers": "localhost:9092",
    "acks": "all",                  # erst bestätigen, wenn alle synchronen Replikate geschrieben haben
    "enable.idempotence": True,     # keine Duplikate durch interne Wiederholungen des Producers
})

def gemeldet(err, msg):
    if err:
        print("Fehler:", err)

bestellung = {"bestell_id": "B-1001", "kunde_id": 42, "kategorie": "Bücher", "betrag": 29.90, "zeit": "2026-05-05T13:04:12Z"}
producer.produce("bestellungen", key=str(bestellung["kunde_id"]), value=json.dumps(bestellung), callback=gemeldet)
producer.flush()   # wartet, bis alles gesendet ist
\`\`\`

\`\`\`python title="consumer.py"
import json
from confluent_kafka import Consumer

consumer = Consumer({
    "bootstrap.servers": "localhost:9092",
    "group.id": "umsatz-service",
    "auto.offset.reset": "earliest",   # ohne gespeicherten Offset am Anfang beginnen
    "enable.auto.commit": False,       # Offset erst nach erfolgreicher Verarbeitung festschreiben
})
consumer.subscribe(["bestellungen"])

try:
    while True:
        msg = consumer.poll(1.0)
        if msg is None:
            continue
        if msg.error():
            print("Fehler:", msg.error())
            continue
        ereignis = json.loads(msg.value())
        speichere_idempotent(ereignis)              # z. B. Upsert nach bestell_id
        consumer.commit(message=msg, asynchronous=False)
finally:
    consumer.close()
\`\`\`

> [!WARNING] At-least-once heißt: Duplikate einplanen
> Stürzt der Consumer nach \`speichere_idempotent()\`, aber vor \`commit()\` ab, liest er die Nachricht nach dem Neustart erneut. Die Verarbeitung muss deshalb [[Idempotenz|idempotent]] sein – etwa per Upsert mit der Bestell-ID als Schlüssel.

## Von Nachrichten zur Stream-Verarbeitung

Ein Consumer, der jede Nachricht einzeln in eine Datenbank schreibt, ist einfach. Interessant wird es bei Fragen wie **„Umsatz pro Kategorie in den letzten 5 Minuten“**, **„Warnung, wenn eine Karte in 10 Minuten in drei Ländern genutzt wird“** oder **„Bestellung mit Zahlung verknüpfen“**. Dafür braucht es [[Stream-Verarbeitung]] mit Zustand und Zeitbegriffen.

### Ereigniszeit vs. Verarbeitungszeit

Ein Smartphone im Funkloch sendet seine Ereignisse erst Minuten später. Wer nach **Verarbeitungszeit** gruppiert, rechnet sie dem falschen Zeitraum zu. Korrekte Auswertungen nutzen die **[[Event Time]]** – den Zeitpunkt im Ereignis selbst.

\`\`\`text title="Ereignisse kommen nicht in Reihenfolge an"
Ereigniszeit:      13:00:05   13:00:20   12:59:58   13:00:40   13:00:12
Ankunft:           13:00:06   13:00:21   13:00:25   13:00:41   13:01:30   ← sehr spät
\`\`\`

### Zeitfenster

[[Zeitfenster]] schneiden den unendlichen Strom in endliche Stücke:

| Fenster | Beschreibung | Beispiel |
|---|---|---|
| **Tumbling** | feste Länge, lückenlos, ohne Überlappung | Umsatz pro 5 Minuten: 13:00–13:05, 13:05–13:10 … |
| **Hopping / Sliding** | feste Länge, überlappend | „letzte 10 Minuten“, jede Minute neu berechnet |
| **Session** | endet nach einer Inaktivitätslücke | Besuchssitzung, die nach 30 min ohne Klick endet |

### Watermarks: Wann ist ein Fenster fertig?

Wenn Ereignisse verspätet eintreffen können, weiß das System nie sicher, ob das Fenster 13:00–13:05 vollständig ist. Ein [[Watermark]] ist die Annahme: „Ereignisse älter als *T* kommen nicht mehr.“ Typisch: höchste bisher gesehene Ereigniszeit minus erlaubte Verspätung.

- Erreicht das Watermark das Fensterende, wird das Ergebnis ausgegeben und der Zustand des Fensters kann gelöscht werden.
- Später eintreffende Ereignisse werden verworfen, in einen Seitenausgang geleitet oder führen zu einer Korrektur – je nach Konfiguration.
- **Kompromiss**: Großzügige Verspätung → vollständigere Ergebnisse, aber höhere Latenz und mehr Speicher.

Probier es aus: Spiele die Ereignisse ab und vergleiche erlaubte Verspätung 0 s mit 5 s. Bei 0 s gehen die verspäteten Ereignisse verloren, die Summen der betroffenen Fenster sind zu klein. Bei 5 s stimmen sie, dafür erscheint jedes Ergebnis später. Die Vollansicht gibt es im [Labor](#/labor/stream-fenster).

\`\`\`widget
streamwindow
\`\`\`

### Zustand und Fehlertoleranz

Fenster, Zähler und Joins brauchen **Zustand**. Engines wie Flink speichern ihn lokal (z. B. in RocksDB) und sichern ihn regelmäßig in **Checkpoints** zusammen mit den Kafka-Offsets. Nach einem Absturz setzen sie beim letzten Checkpoint wieder auf und lesen ab den dazugehörigen Offsets weiter.

### Stream-Joins

- **Stream–Tabelle** (Anreicherung): Jede Bestellung wird um Kundendaten aus einer Tabelle ergänzt, die selbst aus einem Changelog-Topic gepflegt wird.
- **Stream–Stream** mit Zeitgrenze: Bestellung und Zahlung werden verknüpft, wenn die Zahlung höchstens 30 Minuten nach der Bestellung eintrifft. Ohne Zeitgrenze müsste der Zustand unbegrenzt wachsen.

## Ein Beispiel mit Flink SQL

[Apache Flink](#/tech/apache-flink) ist eine Engine, die speziell für zustandsbehaftete Stream-Verarbeitung mit Event Time gebaut wurde. Mit Flink SQL lassen sich viele Aufgaben ohne Java- oder Python-Code lösen:

\`\`\`sql title="Flink SQL: Umsatz pro Kategorie und 5 Minuten" norun
CREATE TABLE bestellungen (
  bestell_id STRING,
  kategorie  STRING,
  betrag     DOUBLE,
  zeit       TIMESTAMP(3),
  WATERMARK FOR zeit AS zeit - INTERVAL '10' SECOND   -- bis zu 10 s Verspätung
) WITH (
  'connector' = 'kafka',
  'topic' = 'bestellungen',
  'properties.bootstrap.servers' = 'localhost:9092',
  'properties.group.id' = 'flink-umsatz',
  'scan.startup.mode' = 'earliest-offset',
  'format' = 'json'
);

SELECT window_start, window_end, kategorie, SUM(betrag) AS umsatz, COUNT(*) AS anzahl
FROM TABLE(
  TUMBLE(TABLE bestellungen, DESCRIPTOR(zeit), INTERVAL '5' MINUTES)
)
GROUP BY window_start, window_end, kategorie;
\`\`\`

Dasselbe ließe sich mit [Spark Structured Streaming](#/artikel/apache-spark) (Micro-Batches) oder **Kafka Streams** (Java-Bibliothek, die direkt in der eigenen Anwendung läuft) umsetzen.

| Engine | Modell | Stärken |
|---|---|---|
| **Apache Flink** | echtes Streaming, Ereignis für Ereignis | Event Time, großer Zustand, niedrige Latenz, SQL und APIs |
| **Kafka Streams** | Bibliothek in der Anwendung | kein eigener Cluster nötig, eng mit Kafka verzahnt |
| **Spark Structured Streaming** | Micro-Batches | gleiche API wie Batch-Spark, gut in Lakehouses |

## Verarbeitungsgarantien

| Garantie | Bedeutung | Entsteht, wenn … |
|---|---|---|
| **At-most-once** | Nachrichten können verloren gehen | Offset vor der Verarbeitung festgeschrieben wird |
| **At-least-once** | keine Verluste, Duplikate möglich | Offset nach der Verarbeitung festgeschrieben wird |
| **[[Exactly-once]]** | jede Nachricht wirkt sich genau einmal aus | Zustand, Offsets und Ausgaben atomar zusammenhängen |

Exactly-once erreicht man **Ende-zu-Ende** nur, wenn alle Glieder mitspielen:

- **Innerhalb von Kafka**: Kafka-Transaktionen schreiben Ausgaben und Consumer-Offsets atomar (Read–Process–Write); Leser nutzen \`isolation.level=read_committed\`.
- **Flink**: Checkpoints plus transaktionale Senken (Zwei-Phasen-Commit).
- **Externe Systeme**: idempotente Schreibvorgänge (Upsert mit eindeutigem Schlüssel) – oft der pragmatischste Weg.

> [!EXPERT] „Exactly-once“ ist ein Ergebnis, kein Zustellversprechen
> Auch mit Exactly-once werden Nachrichten intern mehrfach **verarbeitet** (z. B. nach einem Neustart vom letzten Checkpoint). Garantiert ist, dass sich das **Ergebnis** so verhält, als wäre jede Nachricht genau einmal verarbeitet worden. Seiteneffekte nach außen (E-Mails versenden, fremde APIs aufrufen) fallen nicht automatisch darunter.

## Schemas und Betrieb

- **Schema Registry**: Nachrichten in Avro, Protobuf oder JSON Schema mit zentral verwalteten Schemas; Kompatibilitätsregeln verhindern, dass ein Producer Consumer bricht – ein [[Data Contract]] für Streams.
- **Consumer Lag** überwachen: Abstand zwischen neuestem Offset und verarbeitetem Offset. Wachsender Lag bedeutet, dass die Verarbeitung nicht hinterherkommt.
- **Partitionen planen**: Mehr Partitionen erlauben mehr parallele Consumer, ändern aber bei nachträglicher Erhöhung die Zuordnung Schlüssel → Partition.
- **Fehlerhafte Nachrichten** („Poison Pills“) in eine [[Dead Letter Queue]] umleiten, statt den ganzen Stream anzuhalten.
- **Retention bewusst wählen**: Lange Retention erlaubt Neuberechnungen durch erneutes Abspielen (Kappa-Architektur), kostet aber Speicher.

> [!TIP] Übung
> 1. Ein Topic hat 6 Partitionen, eine Consumer Group 8 Consumer. Wie viele Consumer arbeiten tatsächlich?
> 2. Ereignisse treffen bis zu 2 Minuten verspätet ein. Wie wählst du das Watermark für ein 1-Minuten-Fenster, und welche Latenz entsteht dadurch?
> 3. Ein Consumer schreibt jede Bestellung per \`INSERT\` in eine Datenbank und committet danach den Offset. Was passiert bei einem Absturz zwischen beiden Schritten, und wie behebst du das?

\`\`\`widget
quiz:Data Engineering 4
\`\`\`
`;export{e as default};
