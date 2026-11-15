const e=`---
id: apache-spark
title: Apache Spark: Verteilte Datenverarbeitung mit PySpark
area: data
difficulty: fortgeschritten
minutes: 22
order: 3
summary: Architektur von Spark mit Driver, Executors und Cluster Manager, DataFrames und Spark SQL, Lazy Evaluation, Transformationen und Actions, Partitionen und Shuffles, ein vollständiges PySpark-Beispiel, Performance-Tuning (Broadcast-Join, Datenschiefe, AQE) und ein Einstieg in Structured Streaming.
tags: [Apache Spark, PySpark, Spark SQL, Big Data, Shuffle, Partitionierung, Structured Streaming]
related: [data-engineering-grundlagen, data-warehouse-lake-lakehouse, kafka-stream-processing, data-pipeline-praxisprojekt]
---

## Wofür Spark?

Passen Daten nicht mehr in den Arbeitsspeicher eines Rechners oder dauert die Verarbeitung auf einem Rechner zu lange, verteilt man die Arbeit. **[Apache Spark](#/tech/apache-spark)** ist dafür die verbreitetste Open-Source-Engine: Ein Programm beschreibt die Verarbeitung, Spark zerlegt sie in Aufgaben und führt sie parallel auf vielen Rechnern (oder CPU-Kernen) aus.

Einsatzgebiete:

- Batch-Transformationen großer Datenmengen (Terabyte und mehr) im Data Lake bzw. Lakehouse
- SQL-Abfragen auf Parquet, Iceberg oder Delta Lake
- Stream-Verarbeitung mit **Structured Streaming**
- Feature Engineering und verteiltes Machine Learning (MLlib)

> [!TIP] Brauche ich Spark überhaupt?
> Für Datenmengen bis in den zweistelligen Gigabyte-Bereich sind **DuckDB**, **Polars** oder SQL in einem Cloud-Warehouse oft schneller eingerichtet und billiger. Spark lohnt sich, wenn Daten oder Rechenaufwand wirklich verteilt werden müssen – oder die Plattform (z. B. Databricks) ohnehin darauf aufbaut.

## Architektur

\`\`\`text title="Spark-Anwendung"
                 ┌──────────────── Driver ────────────────┐
Dein Programm ──▶│ SparkSession · Planung · Scheduler      │
                 └───────┬───────────────┬────────────────┘
                         │ Tasks         │ Tasks
                ┌────────▼──────┐ ┌──────▼────────┐
                │  Executor 1   │ │  Executor 2   │   … verteilt über Cluster Manager
                │ Task Task Task│ │ Task Task Task│     (Kubernetes, YARN, Standalone)
                │  Cache        │ │  Cache        │
                └───────────────┘ └───────────────┘
\`\`\`

| Begriff | Bedeutung |
|---|---|
| **Driver** | Prozess mit deinem Programm; erstellt den Ausführungsplan und verteilt Aufgaben |
| **Executor** | Arbeitsprozesse auf den Knoten; führen Tasks aus und halten Zwischenergebnisse |
| **Cluster Manager** | stellt Ressourcen bereit: Kubernetes, YARN oder Spark Standalone; lokal \`local[*]\` |
| **Partition** | ein Teil der Daten; eine Partition = ein Task pro Stufe |
| **Job / Stage / Task** | Eine Action startet einen Job; Shuffles trennen ihn in Stages; jede Stage besteht aus Tasks |

## DataFrames und Lazy Evaluation

Moderne Spark-Programme arbeiten mit **DataFrames** – verteilten Tabellen mit Schema – oder direkt mit SQL. Beide werden vom Optimierer **Catalyst** in denselben Ausführungsplan übersetzt. Die ältere RDD-API ist nur noch für Sonderfälle nötig.

Spark unterscheidet:

- **Transformationen** (\`select\`, \`filter\`, \`join\`, \`groupBy\`, \`withColumn\`) – beschreiben, **was** passieren soll, und werden **nicht sofort** ausgeführt.
- **Actions** (\`count\`, \`show\`, \`collect\`, \`write\`) – lösen die Berechnung aus.

Diese **Lazy Evaluation** erlaubt Optimierungen über den ganzen Plan hinweg, etwa Filter möglichst früh anzuwenden (Predicate Pushdown bis in die Parquet-Dateien) und nur benötigte Spalten zu lesen (Column Pruning).

## Ein vollständiges PySpark-Beispiel

\`\`\`bash title="Lokal installieren (Java 17 oder neuer wird benötigt)"
python -m venv .venv && source .venv/bin/activate
pip install pyspark
\`\`\`

\`\`\`python title="umsatz_pro_tag.py"
from pyspark.sql import SparkSession, functions as F

spark = (
    SparkSession.builder
    .appName("umsatz-pro-tag")
    .master("local[*]")                          # lokal mit allen CPU-Kernen; im Cluster weglassen
    .getOrCreate()
)

bestellungen = spark.read.parquet("data/bestellungen/")      # id, kunde_id, datum, status
positionen = spark.read.parquet("data/positionen/")          # bestellung_id, produkt_id, menge, einzelpreis
produkte = spark.read.parquet("data/produkte/")              # id, name, kategorie

umsatz = (
    positionen
    .join(bestellungen, positionen.bestellung_id == bestellungen.id)
    .join(F.broadcast(produkte), positionen.produkt_id == produkte.id)  # kleine Tabelle an alle Executors
    .filter(F.col("status") != "storniert")
    .withColumn("tag", F.to_date("datum"))
    .groupBy("tag", "kategorie")
    .agg(
        F.round(F.sum(F.col("menge") * F.col("einzelpreis")), 2).alias("umsatz"),
        F.countDistinct("bestellung_id").alias("bestellungen"),
    )
)

umsatz.explain()          # Ausführungsplan ansehen – noch nichts berechnet

(
    umsatz.write
    .mode("overwrite")
    .partitionBy("tag")   # ein Ordner pro Tag → spätere Abfragen lesen nur benötigte Tage
    .parquet("out/umsatz_pro_tag")
)
spark.stop()
\`\`\`

Dieselbe Logik in **Spark SQL**:

\`\`\`python title="SQL statt DataFrame-API"
bestellungen.createOrReplaceTempView("bestellungen")
positionen.createOrReplaceTempView("positionen")
produkte.createOrReplaceTempView("produkte")

spark.sql("""
  SELECT to_date(b.datum) AS tag, p.kategorie,
         ROUND(SUM(pos.menge * pos.einzelpreis), 2) AS umsatz
  FROM positionen pos
  JOIN bestellungen b ON pos.bestellung_id = b.id
  JOIN produkte p ON pos.produkt_id = p.id
  WHERE b.status <> 'storniert'
  GROUP BY to_date(b.datum), p.kategorie
""").show(10)
\`\`\`

## Partitionen und Shuffles

Transformationen sind entweder **schmal** oder **breit**:

| | Schmal (narrow) | Breit (wide) |
|---|---|---|
| Beispiele | \`filter\`, \`select\`, \`withColumn\`, \`map\` | \`groupBy\`, \`join\`, \`distinct\`, \`orderBy\`, \`repartition\` |
| Datenbewegung | jede Partition für sich | Daten werden nach Schlüssel neu verteilt: **[[Shuffle]]** |
| Kosten | gering | hoch: Serialisierung, Netzwerk, Festplatte |

Ein Shuffle ist der teuerste Teil fast jedes Spark-Jobs. Typische Gegenmittel:

- **Früh filtern und Spalten reduzieren**, bevor gejoint oder gruppiert wird.
- **Broadcast-Join**: Ist eine Tabelle klein (z. B. Produkte), wird sie an alle Executors kopiert – die große Tabelle muss nicht geshuffelt werden (\`F.broadcast()\` oder automatisch unterhalb von \`spark.sql.autoBroadcastJoinThreshold\`).
- **Adaptive Query Execution (AQE)**: Seit Spark 3.2 standardmäßig aktiv; passt den Plan zur Laufzeit an, fasst kleine Shuffle-Partitionen zusammen und teilt schiefe Partitionen auf.
- **Partitionszahl** passend wählen (\`spark.sql.shuffle.partitions\`, Standard 200): zu wenige → riesige Tasks, zu viele → Verwaltungsaufwand.

> [!WARNING] Datenschiefe (Skew)
> Haben 40 % aller Bestellungen denselben Kunden (z. B. „Gastkunde“ mit ID 0), landen sie nach einem Shuffle in **einer** Partition. Ein Task braucht dann Stunden, während alle anderen nach Sekunden fertig sind. Erkennbar in der Spark-UI an einem einzelnen sehr langen Task. Abhilfe: AQE-Skew-Join, Sonderfall separat verarbeiten oder den Schlüssel künstlich aufteilen („Salting“).

## Caching und typische Fehler

\`\`\`python
gefiltert = df.filter(F.col("land") == "DE").cache()   # im Speicher halten, wenn mehrfach verwendet
gefiltert.count()                                       # erste Action füllt den Cache
\`\`\`

> [!MISTAKE] \`collect()\` auf großen Daten
> \`collect()\` holt **alle** Zeilen in den Driver – bei Millionen Zeilen ist der Speicher voll. Zum Ansehen \`show(20)\` oder \`limit(…)\`, für Ergebnisse \`write\`.

> [!MISTAKE] Python-UDFs für alles
> Eigene Python-Funktionen (\`@udf\`) zwingen Spark, jede Zeile zwischen JVM und Python zu übertragen. Eingebaute Funktionen aus \`pyspark.sql.functions\` laufen dagegen optimiert in der JVM. Wenn UDFs nötig sind, vektorisierte **Pandas-UDFs** (\`@pandas_udf\`) verwenden.

> [!MISTAKE] Viele kleine Dateien schreiben
> 200 Shuffle-Partitionen × 365 Tage = 73.000 kleine Dateien. Vor dem Schreiben mit \`coalesce()\` bzw. \`repartition("tag")\` zusammenfassen oder Tabellenformate mit Kompaktierung nutzen.

## Die Spark-UI lesen

Während eine Anwendung läuft, zeigt die Spark-UI (lokal unter \`http://localhost:4040\`):

- **Jobs/Stages**: Dauer, Anzahl Tasks, wie viele Daten gelesen und geshuffelt wurden
- **SQL/DataFrame**: den physischen Plan als Grafik – erkennbar sind Broadcast- vs. Sort-Merge-Join
- **Executors**: Speicher, Garbage Collection, fehlgeschlagene Tasks

Ein Blick auf die Task-Dauerverteilung einer Stage verrät Skew sofort.

## Structured Streaming

Mit derselben DataFrame-API verarbeitet Spark auch Datenströme. Der Stream wird als **unendlich wachsende Tabelle** betrachtet, die in Micro-Batches verarbeitet wird.

\`\`\`python title="Umsatz pro 5 Minuten aus Kafka (benötigt das Paket spark-sql-kafka)"
from pyspark.sql import functions as F
from pyspark.sql.types import StructType, StructField, StringType, DoubleType, TimestampType

schema = StructType([
    StructField("bestell_id", StringType()),
    StructField("kategorie", StringType()),
    StructField("betrag", DoubleType()),
    StructField("zeit", TimestampType()),
])

events = (
    spark.readStream.format("kafka")
    .option("kafka.bootstrap.servers", "localhost:9092")
    .option("subscribe", "bestellungen")
    .load()
    .select(F.from_json(F.col("value").cast("string"), schema).alias("e"))
    .select("e.*")
)

umsatz = (
    events
    .withWatermark("zeit", "10 minutes")                 # bis zu 10 Minuten Verspätung akzeptieren
    .groupBy(F.window("zeit", "5 minutes"), "kategorie")  # Tumbling Window nach Ereigniszeit
    .agg(F.sum("betrag").alias("umsatz"))
)

query = (
    umsatz.writeStream
    .outputMode("update")
    .format("console")
    .option("checkpointLocation", "/tmp/checkpoints/umsatz")   # Zustand und Offsets für Neustarts
    .start()
)
query.awaitTermination()
\`\`\`

Begriffe wie [[Watermark]], [[Zeitfenster]] und [[Event Time]] erklärt der Artikel [Kafka & Stream Processing](#/artikel/kafka-stream-processing).

> [!EXPERT] Versionen
> Spark 4.0 (2025) setzt Java 17 voraus, unterstützt ANSI-SQL-Verhalten standardmäßig und baut **Spark Connect** aus – eine Client-Server-Architektur, bei der schlanke Clients (z. B. \`pyspark-client\`) entfernt mit einem Spark-Server sprechen. Beispiele in diesem Artikel funktionieren auch mit Spark 3.5.

> [!TIP] Übung
> 1. Ergänze das Beispiel um die Kennzahl „durchschnittlicher Bestellwert pro Tag“. Achtung: Durchschnitt über Bestellungen, nicht über Positionen!
> 2. Rufe \`explain()\` mit und ohne \`F.broadcast(produkte)\` auf. Welcher Join-Typ erscheint jeweils im Plan?
> 3. Welche der folgenden Operationen lösen einen Shuffle aus: \`filter\`, \`groupBy\`, \`withColumn\`, \`join\` zweier großer Tabellen, \`distinct\`?

\`\`\`widget
quiz:Data Engineering 4
\`\`\`
`;export{e as default};
