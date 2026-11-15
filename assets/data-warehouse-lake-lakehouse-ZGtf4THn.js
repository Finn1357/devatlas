const e=`---
id: data-warehouse-lake-lakehouse
title: Data Warehouse, Data Lake und Lakehouse – mit dimensionaler Modellierung
area: data
difficulty: fortgeschritten
minutes: 22
order: 2
summary: Wie Data Warehouses, Data Lakes und Lakehouses aufgebaut sind, wann welches Modell passt, wie man mit Sternschema, Fakten- und Dimensionstabellen modelliert, Historie mit Slowly Changing Dimensions abbildet und was offene Tabellenformate wie Apache Iceberg und Delta Lake leisten.
tags: [Data Warehouse, Data Lake, Lakehouse, Sternschema, SCD, Iceberg, Delta Lake, Medallion]
related: [data-engineering-grundlagen, apache-spark, datenmodellierung-normalisierung, sql-fortgeschritten, datenqualitaet-monitoring]
---

## Drei Speicherkonzepte im Überblick

| | [[Data Warehouse]] | [[Data Lake]] | [[Lakehouse]] |
|---|---|---|---|
| Daten | strukturiert, bereinigt | alles: Tabellen, JSON, Logs, Bilder | strukturiert und halbstrukturiert |
| Schema | beim Schreiben ([[Schema-on-Read|Schema-on-Write]]) | beim Lesen (Schema-on-Read) | beim Schreiben, mit Schema-Evolution |
| Speicher | proprietär im Warehouse | Objektspeicher (S3, ADLS, GCS) | Objektspeicher + offenes [[Tabellenformat]] |
| Transaktionen | ja | nein (nur Dateien) | ja (ACID über Metadaten) |
| Abfrage | SQL | Spark, Trino, DuckDB … | SQL und Spark auf denselben Tabellen |
| Stärken | schnell, einfach für Analysten | billig, flexibel, für ML-Rohdaten | offen, eine Kopie für viele Engines |
| Risiken | Kosten, Lock-in, Rohdaten fehlen | „Data Swamp“ ohne Ordnung | Betrieb (Kompaktierung, Wartung) |

> [!BEGINNER] Eine Analogie
> Das **Warehouse** ist eine Bibliothek: Jedes Buch ist katalogisiert, aber es kommt nur hinein, was vorher sortiert wurde. Der **Lake** ist ein Lagerhaus voller Kisten: Alles passt hinein, aber man muss wissen, was in welcher Kiste steckt. Das **Lakehouse** ist ein Lagerhaus mit Katalog und Inventur.

## Dimensionale Modellierung

Für Auswertungen modelliert man Daten anders als für eine Anwendung. Statt Normalisierung (siehe [Datenmodellierung](#/artikel/datenmodellierung-normalisierung)) steht die **Abfragbarkeit** im Vordergrund. Die verbreitetste Methode stammt von Ralph Kimball: das [[Sternschema]].

\`\`\`text title="Sternschema für Verkäufe"
                   dim_datum
                       │
   dim_kunde ── fakt_verkauf ── dim_produkt
                       │
                   dim_filiale
\`\`\`

- Die **[[Faktentabelle]]** enthält Ereignisse mit Kennzahlen (Menge, Betrag) und Fremdschlüssel auf Dimensionen.
- Die **[[Dimensionstabelle|Dimensionstabellen]]** beschreiben das „Wer, Was, Wann, Wo“ und werden bewusst nicht weiter normalisiert.

\`\`\`sql title="Sternschema anlegen (Standard-SQL)" norun
CREATE TABLE dim_datum (
  datum_key   INTEGER PRIMARY KEY,   -- z. B. 20260505
  datum       DATE NOT NULL,
  jahr        INTEGER, quartal INTEGER, monat INTEGER,
  wochentag   VARCHAR(10), ist_feiertag BOOLEAN
);

CREATE TABLE dim_kunde (
  kunde_key   INTEGER PRIMARY KEY,   -- Surrogatschlüssel des Warehouse
  kunde_id    INTEGER NOT NULL,      -- fachlicher Schlüssel aus dem Shop
  name        VARCHAR(200),
  stadt       VARCHAR(100),
  segment     VARCHAR(20),
  gueltig_von DATE NOT NULL,
  gueltig_bis DATE,                  -- NULL = aktuelle Version (SCD Typ 2)
  ist_aktuell BOOLEAN NOT NULL
);

CREATE TABLE dim_produkt (
  produkt_key INTEGER PRIMARY KEY,
  produkt_id  INTEGER NOT NULL,
  name        VARCHAR(200),
  kategorie   VARCHAR(100)
);

-- Granularität: eine Zeile pro Bestellposition
CREATE TABLE fakt_verkauf (
  datum_key   INTEGER REFERENCES dim_datum(datum_key),
  kunde_key   INTEGER REFERENCES dim_kunde(kunde_key),
  produkt_key INTEGER REFERENCES dim_produkt(produkt_key),
  bestell_id  INTEGER,               -- „degenerierte Dimension“
  menge       INTEGER,
  umsatz      DECIMAL(12, 2)
);
\`\`\`

Die zentrale Frage beim Modellieren ist die **Granularität**: Was ist eine Zeile der Faktentabelle? Eine Bestellung, eine Bestellposition oder ein Tagesumsatz je Filiale? Wählt man zu grob, lassen sich Detailfragen nicht mehr beantworten.

\`\`\`sql title="Typische Auswertung auf dem Sternschema" norun
SELECT d.jahr, d.quartal, p.kategorie, SUM(f.umsatz) AS umsatz
FROM fakt_verkauf f
JOIN dim_datum d   ON d.datum_key = f.datum_key
JOIN dim_produkt p ON p.produkt_key = f.produkt_key
WHERE d.jahr >= 2025
GROUP BY d.jahr, d.quartal, p.kategorie
ORDER BY d.jahr, d.quartal, umsatz DESC;
\`\`\`

> [!EXPERT] Andere Modellierungsansätze
> **Inmon** baut zuerst ein normalisiertes, unternehmensweites Warehouse und leitet daraus Data Marts ab. **Data Vault** (Hubs, Links, Satellites) trennt Schlüssel, Beziehungen und Attribute, um viele Quellen flexibel und auditierbar zu integrieren. In Cloud-Umgebungen sind auch breite, denormalisierte Tabellen („One Big Table“) verbreitet, weil Speicher günstig und Spaltenspeicher schnell ist.

## Historie: Slowly Changing Dimensions

Zieht Kundin Ada von Köln nach Berlin – sollen Verkäufe aus dem letzten Jahr in Köln oder in Berlin zählen? Die Antwort ist eine fachliche Entscheidung, technisch umgesetzt als [[Slowly Changing Dimension]]:

| Typ | Vorgehen | Ergebnis |
|---|---|---|
| **Typ 1** | Wert überschreiben | Alte Verkäufe zählen plötzlich für Berlin; keine Historie |
| **Typ 2** | Neue Zeile mit neuem Surrogatschlüssel, alte Zeile erhält \`gueltig_bis\` | Alte Verkäufe bleiben bei Köln, neue zählen für Berlin |
| **Typ 3** | Spalte \`vorherige_stadt\` | Nur eine Vorgängerversion |

\`\`\`sql title="SCD Typ 2: Änderung übernehmen (vereinfacht)" norun
-- 1. aktuelle Version beenden
UPDATE dim_kunde
SET gueltig_bis = DATE '2026-05-04', ist_aktuell = FALSE
WHERE kunde_id = 42 AND ist_aktuell = TRUE;

-- 2. neue Version einfügen
INSERT INTO dim_kunde (kunde_key, kunde_id, name, stadt, segment, gueltig_von, gueltig_bis, ist_aktuell)
VALUES (1043, 42, 'Ada', 'Berlin', 'Premium', DATE '2026-05-05', NULL, TRUE);
\`\`\`

Neue Fakten verweisen auf den Surrogatschlüssel der zum Ereigniszeitpunkt gültigen Version. Werkzeuge wie dbt (Snapshots) erzeugen solche Historien automatisch.

## Data Lake

Ein Data Lake speichert Dateien in einem Objektspeicher, organisiert in Ordnern – meist nach Quelle und Datum **partitioniert**:

\`\`\`text title="Typische Ordnerstruktur"
s3://firma-datalake/
  raw/shop/bestellungen/datum=2026-05-04/teil-0001.parquet
  raw/shop/bestellungen/datum=2026-05-05/teil-0001.parquet
  raw/tracking/events/datum=2026-05-05/stunde=13/…json.gz
\`\`\`

Engines wie Spark, Trino oder DuckDB lesen nur die Ordner, die zur \`WHERE\`-Bedingung passen (**Partition Pruning**). Ohne Katalog, Namenskonventionen, Datenqualitätsregeln und Zugriffskonzept entsteht jedoch schnell ein „Data Swamp“: Niemand weiß, welche Datei aktuell oder vertrauenswürdig ist.

Grundprobleme reiner Dateisammlungen:

- **Keine atomaren Änderungen**: Bricht ein Job mittendrin ab, liegen halbe Ergebnisse herum.
- **Gleichzeitiges Lesen und Schreiben** führt zu inkonsistenten Sichten.
- **Updates und Löschungen** einzelner Datensätze (z. B. für DSGVO-Löschanfragen) bedeuten, ganze Dateien neu zu schreiben.
- **Viele kleine Dateien** machen Abfragen langsam.

## Lakehouse und offene Tabellenformate

Ein [[Tabellenformat]] legt eine Metadatenschicht über die Parquet-Dateien. Sie hält fest, **welche Dateien zu welchem Zeitpunkt die Tabelle bilden**. Ein Commit ersetzt diese Liste atomar – Leser sehen entweder den alten oder den neuen Stand, nie einen halben.

| | Apache Iceberg | Delta Lake | Apache Hudi |
|---|---|---|---|
| Ursprung | Netflix, heute Apache | Databricks, heute Linux Foundation | Uber, heute Apache |
| Metadaten | Metadaten-JSON → Manifest-Listen → Manifeste (Snapshots) | Transaktionslog \`_delta_log/\` mit JSON-Commits und Checkpoints | Timeline mit Commits |
| Besonderheiten | versteckte Partitionierung, Partition Evolution, breite Engine-Unterstützung | eng mit Spark/Databricks integriert, Change Data Feed | stark bei Upserts und inkrementellem Lesen |

Gemeinsame Fähigkeiten:

- **ACID-Transaktionen** mit optimistischer Nebenläufigkeit
- **Schema-Evolution**: Spalten hinzufügen, umbenennen, Typen erweitern
- **Time Travel**: alte Snapshots abfragen
- **Upserts und Deletes** (\`MERGE INTO\`)

\`\`\`sql title="Time Travel und MERGE (Spark SQL mit Iceberg oder Delta)" norun
-- Stand der Tabelle vor dem fehlerhaften Lauf von heute Nacht
SELECT COUNT(*) FROM lake.shop.bestellungen TIMESTAMP AS OF '2026-05-05 00:00:00';

-- Änderungen aus einem Staging-Bereich einspielen (Upsert)
MERGE INTO lake.shop.kunden AS ziel
USING staging.kunden_aenderungen AS q
ON ziel.kunde_id = q.kunde_id
WHEN MATCHED AND q.geloescht THEN DELETE
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *;
\`\`\`

> [!WARNING] Wartung gehört dazu
> Jeder Commit erzeugt neue Dateien und Metadaten. Regelmäßig nötig: **Kompaktierung** kleiner Dateien, **Ablaufen alter Snapshots** (sonst wachsen Speicher und Time-Travel-Historie unbegrenzt) und **Aufräumen verwaister Dateien**. Erst danach sind gelöschte Daten auch physisch weg – wichtig für die [[DSGVO]].

## Medallion-Architektur

Die [[Medallion-Architektur]] ordnet Lakehouse-Tabellen in Schichten:

| Schicht | Inhalt | Regeln |
|---|---|---|
| **Bronze** | Rohdaten, wie geliefert, plus Ladezeitpunkt und Quelle | nur anhängen, nie verändern |
| **Silber** | bereinigt, typisiert, dedupliziert, verknüpft | Qualitätsprüfungen, einheitliche Schlüssel |
| **Gold** | fachliche Modelle: Sternschema, Kennzahlen, Feature-Tabellen | dokumentiert, mit Verantwortlichen |

Jede Schicht lässt sich aus der vorherigen neu berechnen. In dbt-Projekten heißen die Schichten oft \`staging\`, \`intermediate\` und \`marts\`.

## Welche Lösung passt?

- **Kleines Team, strukturierte Quellen, SQL-Fokus** → Cloud-Warehouse (BigQuery, Snowflake, Redshift) oder für kleine Datenmengen sogar PostgreSQL bzw. DuckDB.
- **Viele Rohdaten, ML, unterschiedliche Engines, Kostenkontrolle** → Lakehouse auf Objektspeicher mit Iceberg oder Delta.
- **Lokal lernen und prototypen** → DuckDB liest Parquet, CSV und JSON direkt und spricht SQL – siehe [Praxisprojekt](#/artikel/data-pipeline-praxisprojekt).

> [!TIP] Übung
> 1. Lege für einen Online-Kurs-Anbieter ein Sternschema an: Was ist die Granularität der Faktentabelle „Kursbuchung“, welche Dimensionen gibt es?
> 2. Ein Produkt wechselt die Kategorie. Welcher SCD-Typ passt, wenn Berichte immer die **aktuelle** Kategorie zeigen sollen? Welcher, wenn die Kategorie zum Kaufzeitpunkt zählen soll?
> 3. Warum reicht es für eine DSGVO-Löschung nicht, in einer Iceberg- oder Delta-Tabelle \`DELETE\` auszuführen?

\`\`\`widget
quiz:Data Engineering 4
\`\`\`
`;export{e as default};
