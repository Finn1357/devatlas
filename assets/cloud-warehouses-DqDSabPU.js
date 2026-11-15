const e=`---
id: cloud-warehouses
title: Cloud Data Warehouses: BigQuery, Snowflake & Redshift
area: data
difficulty: profi
minutes: 18
order: 8
summary: Wie moderne Analyse-Datenbanken in der Cloud funktionieren – spaltenorientierte Speicherung, massiv-parallele Ausführung und die Trennung von Speicher und Rechenleistung – und wie sich BigQuery, Snowflake und Redshift in Abrechnung, Skalierung und Optimierung unterscheiden.
tags: [BigQuery, Snowflake, Redshift, Data Warehouse, OLAP, MPP, Columnar]
related: [data-warehouse-lake-lakehouse, data-engineering-grundlagen, sql-fortgeschritten]
---

## Warum spezielle Datenbanken für Analysen?

Eine klassische [relationale Datenbank](#/artikel/relationale-datenbanken) wie PostgreSQL ist für viele kleine Lese- und Schreibzugriffe gebaut ([[OLTP]]) – „lege Bestellung 4711 an“, „zeige Warenkorb von Nutzer 42“. Analytische Abfragen sind das Gegenteil: Sie lesen **Millionen Zeilen, aber nur wenige Spalten** – „durchschnittlicher Umsatz je Region über drei Jahre“. Das ist [[OLAP]], und dafür gibt es das [[Data Warehouse]].

Ein **[[Cloud Data Warehouse]]** ist ein verwalteter, elastisch skalierender Warehouse-Dienst. Drei Techniken machen es schnell und bezahlbar.

## Technik 1: Spaltenorientierte Speicherung

Zeilenorientierte Datenbanken legen eine komplette Zeile zusammenhängend ab. [[Spaltenorientierte Speicherung]] dreht das: Alle Werte **einer Spalte** liegen beieinander.

\`\`\`widget
layers:columnar-vs-row
\`\`\`

Der Effekt für \`SELECT AVG(umsatz) FROM verkaeufe\`:

- **Weniger I/O:** Nur die Spalte \`umsatz\` wird gelesen, nicht die 40 anderen.
- **Bessere Kompression:** Gleichartige Werte nebeneinander lassen sich stark komprimieren (Run-Length, Dictionary, Delta) – oft Faktor 10.
- **Vektorisierung:** Die CPU verarbeitet ganze Wertblöcke auf einmal (SIMD).

> [!NOTE]
> Derselbe Grund macht spaltenorientierte Formate wie **Parquet** und **ORC** zum Standard im [[Data Lake]]. Ein [[Lakehouse]] bringt Warehouse-Funktionen direkt auf solche Dateien.

## Technik 2: Massiv-parallele Ausführung (MPP)

[[MPP]] zerlegt eine Abfrage in Teilaufgaben und verteilt sie auf viele unabhängige Knoten (shared-nothing). Jeder Knoten rechnet auf seinem Datenausschnitt, ein Koordinator fügt die Teilergebnisse zusammen.

\`\`\`sql title="Diese Abfrage läuft parallel auf allen Knoten" norun
SELECT region, DATE_TRUNC('month', bestellt_am) AS monat, SUM(umsatz) AS summe
FROM verkaeufe
WHERE bestellt_am >= '2024-01-01'
GROUP BY region, monat
ORDER BY summe DESC;
\`\`\`

Jeder Knoten aggregiert lokal (\`SUM\` je Region), danach werden die Teilsummen zusammengeführt. Mehr Daten? Mehr Knoten. Deshalb skalieren diese Systeme nahezu linear.

## Technik 3: Trennung von Speicher und Rechenleistung

Der entscheidende Cloud-Bruch mit der Vergangenheit: **Daten liegen im günstigen Objektspeicher** (S3, GCS, Azure Blob), **Rechenleistung wird getrennt und bei Bedarf** zugeschaltet.

\`\`\`widget
layers:warehouse-storage-compute
\`\`\`

Daraus folgt:

- Mehrere Teams rechnen **gleichzeitig** auf denselben Daten, ohne sich zu behindern (eigene Compute-Cluster).
- Compute lässt sich sekundengenau hoch-/herunterfahren – man zahlt nur für aktive Abfragen.
- Speicher ist billig; teuer ist das Rechnen. **Kostenoptimierung = weniger gescannte Daten.**

## Die drei großen Dienste im Vergleich

| | **BigQuery** (Google) | **Snowflake** | **Amazon Redshift** |
|---|---|---|---|
| Modell | serverless, kein Cluster sichtbar | „Virtual Warehouses“ (T-Shirt-Größen) | Cluster oder Serverless |
| Abrechnung | **pro gescanntem Byte** (on-demand) oder Slots | **pro Compute-Sekunde** je Warehouse | pro Node-Stunde / RPU |
| Cloud | nur Google Cloud | AWS, Azure, GCP | nur AWS |
| Skalierung | automatisch, unsichtbar | Warehouse resize / Multi-Cluster | resize / Concurrency Scaling |
| Stärke | kein Betrieb, Pay-per-Query | Entkopplung, Data Sharing, Multi-Cloud | enge AWS-Integration |

> [!BEGINNER]
> **BigQuery:** ein Taxi – du zahlst pro Fahrt (Abfrage), kümmerst dich um nichts. **Snowflake:** ein Mietwagen in Größen S–XL – du wählst die Motorleistung und zahlst pro Minute. **Redshift:** ein gekaufter Wagen (Cluster), der durchläuft – dafür planbar, wenn er gut ausgelastet ist.

## Kosten steuern: Partitionierung & Clustering

Weil Rechnen/Scannen das Geld kostet, ist die wichtigste Optimierung, **weniger Daten zu lesen**. Zwei Hebel:

**[[Partitionierung]]** teilt eine Tabelle physisch – meist nach Datum. Ein Filter auf das Partitionsfeld lässt den Optimizer ganze Partitionen überspringen (*partition pruning*).

\`\`\`sql title="Partitionierte Tabelle in BigQuery" norun
CREATE TABLE shop.verkaeufe (bestellt_am DATE, region STRING, umsatz NUMERIC)
PARTITION BY bestellt_am
CLUSTER BY region;
\`\`\`

\`\`\`sql title="Diese Abfrage scannt nur den Januar – nicht die ganze Historie" norun
SELECT SUM(umsatz) FROM shop.verkaeufe
WHERE bestellt_am BETWEEN '2024-01-01' AND '2024-01-31';
\`\`\`

**[[Clustering (Tabellen)|Clustering]]** sortiert die Daten innerhalb einer Partition nach ausgewählten Spalten. Block-Statistiken (min/max) lassen dann auch innerhalb einer Partition ganze Blöcke überspringen – hier beim Filter auf \`region\`.

> [!MISTAKE] \`SELECT *\` im Cloud-Warehouse
> Bei zeilenbasiertem OLTP egal, hier teuer: \`SELECT *\` liest **alle Spalten** und bei BigQuery wird jedes gescannte Byte berechnet. Wähle immer nur die gebrauchten Spalten und filtere auf das Partitionsfeld. Ein vergessener Datumsfilter kann einen vollständigen Table Scan über Terabytes auslösen.

## Laden: ELT statt ETL

Weil das Warehouse selbst so leistungsfähig ist, lädt man Rohdaten heute meist zuerst **unverändert** hinein und transformiert sie **darin** per SQL – [[ELT]] statt [[ETL]]. Werkzeuge wie **dbt** verwalten diese SQL-Transformationen als versionierte, getestete Modelle. Mehr dazu im Artikel zu [Data Engineering](#/artikel/data-engineering-grundlagen) und zur [dimensionalen Modellierung](#/artikel/data-warehouse-lake-lakehouse) mit [[Sternschema]].

## Wann welcher Dienst – und wann gar keiner?

- **Kleine Datenmengen (< ~100 GB), viele Updates:** Ein Cloud-Warehouse ist überdimensioniert. Nimm PostgreSQL – notfalls mit der Erweiterung DuckDB/\`pg_analytics\` für Analysen. Siehe das [ELT-Praxisprojekt mit DuckDB](#/artikel/data-pipeline-praxisprojekt).
- **Du bist auf einer Cloud festgelegt und willst keinen Betrieb:** BigQuery (GCP) bzw. Redshift (AWS).
- **Multi-Cloud, starke Trennung von Workloads, Data Sharing:** Snowflake.
- **Du hast bereits einen Data Lake aus Parquet-Dateien:** ein [[Lakehouse]] (Databricks, oder Query-Engines wie Trino/Athena) kann das Warehouse überflüssig machen.

> [!TIP]
> Die drei SQL-Dialekte unterscheiden sich in Details (Datumsfunktionen, \`QUALIFY\`, Fenster). Die gemeinsame Basis sind fortgeschrittene Abfragen – übe sie im [SQL-Artikel](#/artikel/sql-fortgeschritten) und im [SQL-Labor](#/labor/sql).

## Wie geht es weiter?

Vertiefe die Architekturbegriffe in [Data Warehouse, Data Lake und Lakehouse](#/artikel/data-warehouse-lake-lakehouse) und ordne Warehouses in die Gesamtsicht der [Data-Engineering-Grundlagen](#/artikel/data-engineering-grundlagen) ein.
`;export{e as default};
