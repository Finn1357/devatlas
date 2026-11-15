const e=`---
id: nosql
title: NoSQL: Dokumente, Key-Value, Wide-Column & Graphen
area: datenbanken
difficulty: fortgeschritten
minutes: 16
order: 13
summary: Welche nicht-relationalen Datenbankmodelle es gibt, wie man für sie modelliert, was das CAP-Theorem bedeutet und wann PostgreSQL trotzdem die bessere Wahl ist.
tags: [NoSQL, MongoDB, Redis, Cassandra, Neo4j, CAP]
related: [relationale-datenbanken, indizes-transaktionen, caching-queues, embeddings-rag]
---

## Was ist NoSQL?

[[NoSQL]] („Not only SQL“) ist ein Sammelbegriff für Datenbanken, die **nicht** auf dem relationalen Tabellenmodell basieren. Sie entstanden in den 2000ern, als Web-Unternehmen Datenmengen und Zugriffszahlen erreichten, bei denen klassische Datenbanken auf einzelnen Servern an Grenzen stießen. Ihre Stärken sind meist **flexible Schemas**, **horizontale Skalierung** und auf bestimmte **Zugriffsmuster optimierte** Datenmodelle.

## Die vier Hauptkategorien

| Modell | Daten als … | Beispiele | Stark bei |
|---|---|---|---|
| **[[Dokumentdatenbank|Dokument]]** | JSON-ähnliche Dokumente in Collections | MongoDB, Couchbase, Firestore | variierende Strukturen, verschachtelte Objekte |
| **[[Key-Value-Store|Key-Value]]** | Schlüssel → Wert | Redis, Valkey, DynamoDB, etcd | Caches, Sessions, extrem schnelle Zugriffe |
| **Wide-Column** | Zeilen mit flexiblen Spalten, nach Partition Key verteilt | Cassandra, ScyllaDB, Bigtable | sehr hohe Schreiblast, Zeitreihen |
| **[[Graphdatenbank|Graph]]** | Knoten und Kanten | Neo4j, Neptune | stark vernetzte Daten, Pfadabfragen |

Dazu kommen spezialisierte Systeme: Suchmaschinen (Elasticsearch/OpenSearch), Zeitreihen-DBs (InfluxDB, TimescaleDB) und [[Vektordatenbank|Vektordatenbanken]] für KI-Anwendungen.

## Dokumentdatenbanken am Beispiel MongoDB

Statt eine Bestellung auf vier Tabellen zu verteilen, speichert man sie als **ein Dokument**:

\`\`\`json title="Eine Bestellung als Dokument"
{
  "_id": "6730f1a2c3e4",
  "kunde": { "id": 1, "name": "Ada Lovelace" },
  "datum": "2026-01-05",
  "status": "versendet",
  "positionen": [
    { "produkt": "Mechanische Tastatur", "menge": 1, "einzelpreis": 89.90 },
    { "produkt": "Notizbuch", "menge": 3, "einzelpreis": 7.90 }
  ]
}
\`\`\`

\`\`\`javascript title="Abfragen in der MongoDB-Shell"
db.bestellungen.find({ status: 'versendet', 'positionen.produkt': 'Notizbuch' });

db.bestellungen.aggregate([
  { $unwind: '$positionen' },
  { $group: { _id: '$positionen.produkt', stueck: { $sum: '$positionen.menge' } } },
  { $sort: { stueck: -1 } },
]);

db.bestellungen.createIndex({ status: 1, datum: -1 });
\`\`\`

### Modellieren nach Zugriffsmustern

Die zentrale Frage lautet nicht „Wie sind die Daten strukturiert?“, sondern **„Wie werden sie gelesen?“**

- **Einbetten**, wenn Daten zusammen gelesen werden und zum Elternteil gehören (Positionen einer Bestellung).
- **Referenzieren**, wenn Daten unabhängig existieren, oft geändert werden oder unbegrenzt wachsen (Kundenstammdaten, Kommentare).

> [!WARNING] „Schemalos“ heißt nicht „ohne Schema“
> Das Schema steckt dann im Anwendungscode – und jede Version der Anwendung muss alle jemals gespeicherten Formen verstehen. Nutze Schema-Validierung (MongoDB unterstützt JSON Schema) und versioniere Dokumentformate.

## Key-Value am Beispiel Redis

\`\`\`bash
SET session:9f2c '{"userId":42}' EX 3600   # Wert mit Ablaufzeit
GET session:9f2c
INCR seitenaufrufe:2026-11-05               # atomarer Zähler
ZADD rangliste 1520 "ada" 1310 "linus"      # Sorted Set
ZREVRANGE rangliste 0 2 WITHSCORES          # Top 3
\`\`\`

[[Redis]] hält Daten im RAM – Zugriffe in Mikrosekunden. Ideal für [Caching, Sessions, Rate Limiting und Queues](#/artikel/caching-queues).

## Wide-Column am Beispiel Cassandra

Tabellen werden **pro Abfrage** entworfen; Joins gibt es nicht.

\`\`\`sql title="CQL: Sensordaten, partitioniert nach Sensor und Tag"
CREATE TABLE messwerte (
  sensor_id text,
  tag       date,
  zeit      timestamp,
  wert      double,
  PRIMARY KEY ((sensor_id, tag), zeit)
) WITH CLUSTERING ORDER BY (zeit DESC);

SELECT zeit, wert FROM messwerte
WHERE sensor_id = 'halle-3' AND tag = '2026-11-05' LIMIT 100;
\`\`\`

Der Partition Key \`(sensor_id, tag)\` bestimmt, auf welchem Knoten die Daten liegen; innerhalb der Partition sind sie nach Zeit sortiert.

## Graphdatenbanken am Beispiel Neo4j

\`\`\`cypher
MATCH (ich:Person {name: 'Ada'})-[:KENNT]->(:Person)-[:KENNT]->(vorschlag:Person)
WHERE NOT (ich)-[:KENNT]->(vorschlag) AND ich <> vorschlag
RETURN vorschlag.name, count(*) AS gemeinsame_kontakte
ORDER BY gemeinsame_kontakte DESC LIMIT 5;
\`\`\`

„Freunde von Freunden“ über mehrere Ebenen ist in SQL eine Kette teurer Joins – in einer Graphdatenbank eine natürliche Traversierung.

## CAP und Konsistenzmodelle

Verteilte Datenbanken müssen bei einer Netzwerkpartition wählen: **Konsistenz** (alle sehen denselben Stand, notfalls Fehler) oder **Verfügbarkeit** (jeder bekommt eine Antwort, notfalls veraltet) – das [[CAP-Theorem]]. Viele NoSQL-Systeme setzen standardmäßig auf Verfügbarkeit und **[[Eventual Consistency]]**, bieten aber einstellbare Konsistenz pro Abfrage (z. B. \`QUORUM\` in Cassandra).

## SQL oder NoSQL?

| Anforderung | Tendenz |
|---|---|
| Komplexe Beziehungen, Ad-hoc-Abfragen, Transaktionen über viele Datensätze | relational |
| Stark variierende Dokumentstrukturen, Lesen ganzer Aggregate | Dokument |
| Cache, Sessions, Zähler | Key-Value |
| Gigantische Schreiblast, Multi-Region | Wide-Column |
| Pfade und Beziehungen über viele Ebenen | Graph |

> [!TIP] PostgreSQL kann viel davon
> Mit JSONB-Spalten (inkl. GIN-Index), Volltextsuche, pgvector und Partitionierung deckt PostgreSQL viele „NoSQL“-Anwendungsfälle ab – mit Transaktionen und SQL. Für viele Projekte ist „ein PostgreSQL plus Redis“ eine hervorragende Ausgangsbasis. Spezialisierte Systeme lohnen sich, wenn ein klares Zugriffsmuster oder eine Größenordnung sie erfordert.

## Wie geht es weiter?

Vergleiche die Systeme im [Technologie-Katalog](#/katalog?kind=datenbank) und lerne, wie Vektordatenbanken KI-Suche ermöglichen, in [Embeddings & RAG](#/artikel/embeddings-rag).
`;export{e as default};
