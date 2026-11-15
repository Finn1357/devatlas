const e=`---
id: data-engineering-grundlagen
title: Data Engineering: Grundlagen, ETL/ELT, Batch und Streaming
area: data
difficulty: einsteiger
minutes: 20
order: 1
summary: Was Data Engineers tun, wie Daten von operativen Systemen in Auswertungen gelangen, ETL vs. ELT, OLTP vs. OLAP, Batch- vs. Stream-Verarbeitung, Dateiformate wie CSV, JSON, Parquet und Avro sowie die Bausteine einer modernen Datenplattform.
tags: [Data Engineering, ETL, ELT, Batch, Streaming, Parquet, OLAP]
related: [data-warehouse-lake-lakehouse, apache-spark, kafka-stream-processing, apache-airflow-orchestrierung, datenqualitaet-monitoring, data-pipeline-praxisprojekt]
---

## Was macht Data Engineering?

Anwendungen erzeugen ständig Daten: Bestellungen in der Shop-Datenbank, Klicks im Web, Messwerte von Sensoren, Logs von Servern. Diese Daten liegen verstreut, in unterschiedlichen Formaten und sind für Auswertungen meist ungeeignet. **Data Engineering** baut die Systeme, die Daten **zuverlässig sammeln, bereinigen, zusammenführen und bereitstellen** – für Dashboards, Berichte, Data Science und KI.

| Rolle | Kernfrage | Typische Werkzeuge |
|---|---|---|
| **Data Engineer** | Wie kommen korrekte Daten rechtzeitig an den richtigen Ort? | SQL, Python, Spark, Airflow, Kafka, dbt |
| **Analytics Engineer** | Wie modelliere ich Daten so, dass Fachbereiche sie verstehen? | SQL, dbt, BI-Werkzeuge |
| **Data Analyst** | Was sagen die Daten über das Geschäft? | SQL, BI, Tabellenkalkulation |
| **Data Scientist / ML Engineer** | Welche Muster und Vorhersagen stecken darin? | Python, pandas, scikit-learn, PyTorch |

> [!BEGINNER] Ein Bild zum Merken
> Data Engineers sind die Wasserwerke der Datenwelt: Sie bauen Leitungen ([[Data Pipeline|Pipelines]]), Kläranlagen (Bereinigung) und Speicher ([[Data Warehouse]], [[Data Lake]]), damit am Wasserhahn – im Dashboard – sauberes Wasser ankommt.

## Operative und analytische Systeme

| | [[OLTP]] (operativ) | [[OLAP]] (analytisch) |
|---|---|---|
| Beispiel | Shop-Datenbank: Bestellung anlegen | „Umsatz je Kategorie und Monat der letzten 3 Jahre“ |
| Abfragen | viele kleine, auf einzelne Zeilen | wenige große, über Millionen Zeilen |
| Schreiben | ständig, transaktional | in Ladeläufen oder Streams |
| Datenmodell | normalisiert (3NF) | dimensional (Sternschema) oder breite Tabellen |
| Speicher | zeilenorientiert | [[Spaltenorientierte Speicherung|spaltenorientiert]] |
| Systeme | PostgreSQL, MySQL, SQL Server | BigQuery, Snowflake, Redshift, ClickHouse, DuckDB |

Warum nicht einfach die Shop-Datenbank abfragen? Große Analyseabfragen würden die Bestellungen ausbremsen, die Historie fehlt (Datensätze werden überschrieben), und Daten aus anderen Quellen (Marketing, Zahlungsanbieter, CRM) liegen woanders.

## ETL und ELT

Beide Muster beschreiben drei Schritte – unterschiedlich ist die Reihenfolge:

\`\`\`text title="ETL vs. ELT"
ETL:  Quelle ──Extract──▶ ETL-Server ──Transform──▶ ──Load──▶ Warehouse (nur bereinigte Daten)

ELT:  Quelle ──Extract──▶ ──Load──▶ Warehouse/Lake (Rohdaten) ──Transform (SQL)──▶ Modelle
\`\`\`

| | [[ETL]] | [[ELT]] |
|---|---|---|
| Transformation | vor dem Laden, außerhalb des Ziels | nach dem Laden, im Ziel (meist SQL) |
| Rohdaten im Ziel | nein | ja – Transformationen sind wiederholbar |
| Stärken | sensible Felder gelangen nie ins Ziel; kleineres Ziel | flexibel, versionierbar (dbt), skaliert mit dem Warehouse |
| Typische Ära | klassische On-Premise-Warehouses | Cloud-Warehouses und Lakehouses |

> [!TIP] In der Praxis: beides
> Viele Teams laden Rohdaten per ELT, entfernen oder pseudonymisieren aber personenbezogene Daten schon beim Extrahieren – eine kleine „T“-Stufe vor dem Laden. Entscheidend ist, bewusst festzulegen, **wo** welche Logik lebt.

### Extraktion: Wie kommen Daten heraus?

- **Vollabzug**: Jedes Mal die ganze Tabelle – einfach, aber teuer bei großen Daten.
- **Inkrementell über Zeitstempel**: \`WHERE updated_at > :letzter_lauf\` – braucht verlässliche \`updated_at\`-Spalten und erkennt Löschungen nicht.
- **[[CDC|Change Data Capture]]**: Liest das Transaktionslog der Datenbank (z. B. mit Debezium) und liefert jede Einfüge-, Änderungs- und Löschoperation als Ereignis – vollständig und mit geringer Last.
- **APIs und Dateien**: REST-APIs mit Pagination und Rate Limits, CSV-Exporte per SFTP, Ereignisse aus Webhooks.

## Batch und Streaming

| | [[Batch-Verarbeitung]] | [[Stream-Verarbeitung]] |
|---|---|---|
| Verarbeitung | gesammelte Blöcke, z. B. stündlich/nächtlich | jedes Ereignis kurz nach Eintreffen |
| Latenz | Minuten bis Stunden | Millisekunden bis Sekunden |
| Komplexität | geringer, leicht wiederholbar | höher: Zustand, Reihenfolge, Verspätungen |
| Beispiele | Tagesumsätze, Monatsberichte, ML-Training | Betrugserkennung, Live-Dashboards, Benachrichtigungen |
| Werkzeuge | SQL im Warehouse, Spark, DuckDB, Airflow | Kafka, Flink, Kafka Streams, Spark Structured Streaming |

Die Wahl folgt der Anforderung, nicht der Mode: Ein Bericht, der morgens gelesen wird, braucht keinen Stream. Viele Plattformen kombinieren beides – historisch spricht man von **Lambda-Architektur** (getrennte Batch- und Stream-Pfade) und **Kappa-Architektur** (alles als Stream, Neuberechnung durch erneutes Abspielen des Logs).

## Dateiformate

| Format | Struktur | Schema | Stärken | Schwächen |
|---|---|---|---|---|
| **CSV** | zeilenweise Text | keines | überall lesbar | keine Typen, Trennzeichen- und Kodierungsprobleme, groß |
| **JSON / JSON Lines** | Text, verschachtelt | implizit | flexibel, verbreitet in APIs | groß, langsam zu parsen, Typen ungenau |
| **[[Parquet]]** | spaltenorientiert, binär | eingebettet | kompakt, schnelle Analysen, Predicate Pushdown | nicht für Einzelzeilen-Updates |
| **Avro** | zeilenorientiert, binär | eingebettet/Registry | gut für Streams und Schema-Evolution | für Analysen langsamer als Parquet |
| **ORC** | spaltenorientiert | eingebettet | ähnlich Parquet, stark im Hive-Umfeld | weniger verbreitet außerhalb davon |

> [!MISTAKE] CSV als Austauschformat zwischen Pipeline-Schritten
> CSV verliert Typen („0049“ wird zur Zahl 49), kämpft mit Kommas in Texten und Zeichenkodierungen. Zwischen eigenen Pipeline-Schritten besser Parquet verwenden; CSV nur an den Rändern, wenn ein System es verlangt.

## Bausteine einer modernen Datenplattform

\`\`\`text title="Typischer Datenfluss"
Quellen            Erfassung             Speicher                 Transformation        Nutzung
───────            ─────────             ────────                 ──────────────        ───────
Shop-DB  ──CDC──▶  Kafka        ──┐
SaaS-APIs ───────▶ Ingestion-Job ─┼──▶  Data Lake / Lakehouse ──▶ SQL-Modelle (dbt) ──▶ Dashboards
Logs/Events ─────▶ Stream        ─┘     (Bronze → Silber → Gold)   Spark-Jobs            ML-Modelle
                                                                                         Reverse ETL
                          ▲ Orchestrierung (Airflow, Dagster)    ▲ Datenqualität, Monitoring, Lineage
\`\`\`

- **Erfassung (Ingestion)**: eigene Skripte, Konnektoren-Werkzeuge (z. B. Airbyte, Fivetran), CDC, Kafka.
- **Speicher**: [[Data Warehouse]], [[Data Lake]] oder [[Lakehouse]] – siehe [Warehouse, Lake & Lakehouse](#/artikel/data-warehouse-lake-lakehouse).
- **Verarbeitung**: SQL im Warehouse, [Apache Spark](#/artikel/apache-spark) für große Datenmengen, Streaming-Engines – siehe [Kafka & Stream Processing](#/artikel/kafka-stream-processing).
- **Orchestrierung**: Abhängigkeiten, Zeitpläne, Wiederholungen – siehe [Apache Airflow](#/artikel/apache-airflow-orchestrierung).
- **Qualität und Betrieb**: Tests, Monitoring, [[Data Lineage]] – siehe [Datenqualität & Monitoring](#/artikel/datenqualitaet-monitoring).

## Grundprinzipien guter Pipelines

1. **Idempotent**: Zweimal ausgeführt = gleiches Ergebnis. Statt „anhängen“ lieber „Partition für den 5. Mai überschreiben“ oder Upsert per Schlüssel ([[Idempotenz]]).
2. **Deterministisch und parametrisiert**: Ein Lauf verarbeitet ein festes **Datenintervall** („2026-05-05“), nicht „alles seit gestern um diese Uhrzeit“. Das macht [[Backfill|Backfills]] möglich.
3. **Rohdaten aufbewahren**: Fehler in der Transformation lassen sich dann korrigieren und neu berechnen.
4. **Schema bewusst behandeln**: Neue oder geänderte Felder der Quelle erkennen, statt still falsche Werte zu laden.
5. **Klein testen**: Logik mit wenigen Beispielzeilen prüfen, bevor sie auf Milliarden läuft.
6. **Beobachtbar**: Laufzeit, Zeilenzahl, Datenfrische und Fehlerquote messen und alarmieren.

> [!WARNING] Datenschutz von Anfang an
> Pipelines kopieren Daten an viele Orte. Personenbezogene Daten nach [[DSGVO]] nur übernehmen, wenn ein Zweck besteht, früh pseudonymisieren, Zugriffe einschränken und Löschanforderungen auch im Data Lake und in Backups umsetzen können.

## Selbst ausprobieren

Im [SQL-Labor](#/labor/sql) kannst du typische analytische Abfragen direkt im Browser ausführen, etwa Umsatz je Kunde mit einer Aggregation:

\`\`\`sql title="Analytische Abfrage im SQL-Labor"
SELECT k.name,
       COUNT(DISTINCT b.id) AS bestellungen,
       ROUND(SUM(bp.menge * bp.einzelpreis), 2) AS umsatz   -- Preis zum Bestellzeitpunkt, nicht der heutige
FROM kunden k
JOIN bestellungen b ON b.kunde_id = k.id
JOIN bestellpositionen bp ON bp.bestellung_id = b.id
WHERE b.status <> 'storniert'
GROUP BY k.name
ORDER BY umsatz DESC;
\`\`\`

Ein vollständiges kleines ELT-Projekt mit DuckDB baust du im [Praxisprojekt](#/artikel/data-pipeline-praxisprojekt).

> [!TIP] Übung
> 1. Ordne zu: Betrugserkennung bei Kartenzahlungen, Quartalsbericht, Empfehlungen „Kunden kauften auch“ (täglich neu berechnet). Batch oder Stream?
> 2. Ein Ladeprozess hängt jede Nacht alle Bestellungen von „gestern“ an eine Tabelle an. Was passiert, wenn der Job versehentlich zweimal läuft? Wie machst du ihn idempotent?
> 3. Warum ist \`updated_at > letzter_lauf\` keine vollständige Lösung für inkrementelles Laden?

\`\`\`widget
quiz:Data Engineering 4
\`\`\`
`;export{e as default};
