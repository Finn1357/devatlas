const e=`---
id: data-pipeline-praxisprojekt
title: Praxisprojekt: Eine ELT-Pipeline mit Python und DuckDB bauen
area: data
difficulty: fortgeschritten
minutes: 30
order: 7
summary: Schritt für Schritt eine vollständige, lokal lauffähige Datenpipeline – Rohdaten idempotent laden, mit SQL bereinigen und deduplizieren, ein kleines Sternschema und Kennzahlen berechnen, Qualitätstests ausführen, Ergebnisse als Parquet exportieren, Backfills fahren und die Pipeline orchestrieren.
tags: [Praxisprojekt, DuckDB, Python, ELT, Parquet, Datenqualität, Backfill]
related: [data-engineering-grundlagen, data-warehouse-lake-lakehouse, datenqualitaet-monitoring, apache-airflow-orchestrierung, sql-fortgeschritten]
---

## Ziel des Projekts

Wir bauen eine kleine, aber vollständige [[ELT]]-Pipeline für einen Webshop – ohne Server und ohne Cloud-Konto. **[DuckDB](#/tech/duckdb)** ist eine eingebettete analytische Datenbank (wie SQLite, aber spaltenorientiert für Analysen); sie liest CSV, JSON und Parquet direkt und spricht modernes SQL.

\`\`\`text title="Aufbau"
daten/bestellungen.csv ──▶ raw.bestellungen ──▶ staging.bestellungen ──▶ marts.tagesumsatz ──▶ export/*.parquet
      (Quelle)            (Bronze: unverändert)   (Silber: bereinigt,      (Gold: Kennzahlen)
                                                    dedupliziert)
                                    ▲ Qualitätstests nach jedem Schritt
\`\`\`

Du lernst dabei die Prinzipien aus [Data-Engineering-Grundlagen](#/artikel/data-engineering-grundlagen) in der Praxis: idempotentes Laden, Schichten, Tests und Backfills.

## 1. Einrichten

\`\`\`bash title="Projekt anlegen"
mkdir shop-pipeline && cd shop-pipeline
python -m venv .venv && source .venv/bin/activate      # Windows: .venv\\Scripts\\activate
pip install duckdb
mkdir daten export
\`\`\`

Lege als Quelle eine CSV-Datei an. Sie enthält absichtlich typische Probleme: ein Duplikat (B-1002 wurde doppelt exportiert, mit geändertem Status), eine stornierte Bestellung und eine Zeile mit negativem Betrag.

\`\`\`text title="daten/bestellungen.csv"
bestell_id,kunde_id,datum,status,betrag,aktualisiert
B-1001,1,2026-05-04,bezahlt,49.90,2026-05-04T09:12:00
B-1002,2,2026-05-04,offen,19.99,2026-05-04T10:01:00
B-1002,2,2026-05-04,bezahlt,19.99,2026-05-04T10:30:00
B-1003,1,2026-05-04,storniert,120.00,2026-05-04T11:45:00
B-1004,3,2026-05-04,bezahlt,-5.00,2026-05-04T12:00:00
B-1005,4,2026-05-05,versendet,75.50,2026-05-05T08:20:00
B-1006,2,2026-05-05,bezahlt,12.00,2026-05-05T09:00:00
\`\`\`

## 2. Rohdaten idempotent laden (Bronze)

Die Ladefunktion verarbeitet genau **einen Tag** und ersetzt dessen Daten vollständig. Läuft sie zweimal, ist das Ergebnis identisch – Voraussetzung für Wiederholungen und [[Backfill|Backfills]].

\`\`\`python title="pipeline.py – Teil 1: Laden" norun
import sys
import duckdb

DB = "lager.duckdb"
QUELLE = "daten/bestellungen.csv"


def laden(con: duckdb.DuckDBPyConnection, tag: str) -> int:
    con.execute("CREATE SCHEMA IF NOT EXISTS raw")
    con.execute("""
        CREATE TABLE IF NOT EXISTS raw.bestellungen (
            bestell_id   VARCHAR,
            kunde_id     INTEGER,
            datum        DATE,
            status       VARCHAR,
            betrag       DECIMAL(10, 2),
            aktualisiert TIMESTAMP,
            geladen_am   TIMESTAMP
        )
    """)
    con.execute("BEGIN TRANSACTION")
    # Partition des Tages ersetzen statt anhängen → idempotent
    con.execute("DELETE FROM raw.bestellungen WHERE datum = ?", [tag])
    # QUELLE ist eine Konstante im Code – niemals Benutzereingaben in SQL-Text einsetzen
    con.execute(f"""
        INSERT INTO raw.bestellungen
        SELECT bestell_id, CAST(kunde_id AS INTEGER), CAST(datum AS DATE), status,
               CAST(betrag AS DECIMAL(10, 2)), CAST(aktualisiert AS TIMESTAMP), current_timestamp
        FROM read_csv('{QUELLE}', header = true, all_varchar = true)   -- alles als Text lesen, Typen selbst festlegen
        WHERE CAST(datum AS DATE) = ?
    """, [tag])
    con.execute("COMMIT")
    return con.execute("SELECT COUNT(*) FROM raw.bestellungen WHERE datum = ?", [tag]).fetchone()[0]
\`\`\`

> [!TIP] Warum \`all_varchar = true\`?
> Die automatische Typerkennung rät anhand der ersten Zeilen. Ändert sich die Quelle, ändern sich still die Typen. Wer alles als Text liest und selbst umwandelt, bemerkt Abweichungen durch Fehler beim \`CAST\` – statt falsche Werte zu speichern.

## 3. Bereinigen und deduplizieren (Silber)

Die Staging-Schicht wählt pro Bestellung die **neueste** Version und filtert ungültige Zeilen in eine Quarantäne-Sicht:

\`\`\`sql title="SQL für die Silber-Schicht (DuckDB)" norun
CREATE SCHEMA IF NOT EXISTS staging;

-- neueste Version je Bestellung (QUALIFY filtert nach dem Ergebnis einer Window Function)
CREATE OR REPLACE VIEW staging.bestellungen_alle AS
SELECT *
FROM raw.bestellungen
QUALIFY row_number() OVER (PARTITION BY bestell_id ORDER BY aktualisiert DESC) = 1;

CREATE OR REPLACE VIEW staging.bestellungen AS
SELECT * FROM staging.bestellungen_alle
WHERE betrag >= 0 AND status IN ('offen', 'bezahlt', 'versendet', 'storniert');

CREATE OR REPLACE VIEW staging.quarantaene AS
SELECT * FROM staging.bestellungen_alle
WHERE NOT (betrag >= 0 AND status IN ('offen', 'bezahlt', 'versendet', 'storniert'));
\`\`\`

Die [[Window Function]] \`row_number()\` nummeriert die Versionen jeder Bestellung; \`QUALIFY\` behält nur die jeweils erste. In Datenbanken ohne \`QUALIFY\` (z. B. SQLite, PostgreSQL) erreicht man dasselbe mit einer Unterabfrage oder [[CTE]].

## 4. Kennzahlen berechnen (Gold)

\`\`\`sql title="SQL für die Gold-Schicht" norun
CREATE SCHEMA IF NOT EXISTS marts;

CREATE OR REPLACE TABLE marts.tagesumsatz AS
SELECT
    datum                                                          AS tag,
    COUNT(*) FILTER (WHERE status <> 'storniert')                  AS bestellungen,
    COALESCE(SUM(betrag) FILTER (WHERE status <> 'storniert'), 0)  AS umsatz,
    COUNT(*) FILTER (WHERE status = 'storniert')                   AS stornos,
    COUNT(DISTINCT kunde_id)                                       AS kunden
FROM staging.bestellungen
GROUP BY datum
ORDER BY datum;
\`\`\`

> [!NOTE] Warum hier \`CREATE OR REPLACE TABLE\`?
> Bei wenigen Daten ist es am einfachsten und sichersten, die Gold-Tabelle bei jedem Lauf vollständig neu zu berechnen – das ist automatisch idempotent. Bei großen Datenmengen berechnet man inkrementell nur die betroffenen Tage (siehe dbt \`incremental\` im [Airflow-Artikel](#/artikel/apache-airflow-orchestrierung)).

## 5. Qualitätstests

Jeder Test ist eine Abfrage, die **Problemzeilen** liefert. Schlägt ein harter Test fehl, bricht die Pipeline ab.

\`\`\`python title="pipeline.py – Teil 2: Transformieren und testen" norun
TESTS = {
    "bestell_id eindeutig in staging": """
        SELECT bestell_id FROM staging.bestellungen GROUP BY bestell_id HAVING COUNT(*) > 1""",
    "kein negativer Umsatz": """
        SELECT * FROM marts.tagesumsatz WHERE umsatz < 0""",
    "Tag hat Daten": """
        SELECT 1 WHERE (SELECT COUNT(*) FROM raw.bestellungen WHERE datum = $tag) = 0""",
}
WARNUNGEN = {
    "Zeilen in Quarantäne": "SELECT bestell_id, status, betrag FROM staging.quarantaene",
}


def transformieren(con):
    with open("sql/transform.sql", encoding="utf-8") as f:   # die SQL-Blöcke aus Schritt 3 und 4
        con.execute(f.read())


def testen(con, tag: str) -> None:
    fehler = []
    for name, sql in TESTS.items():
        zeilen = con.execute(sql, {"tag": tag} if "$tag" in sql else None).fetchall()
        if zeilen:
            fehler.append(f"✗ {name}: {len(zeilen)} Problemzeile(n)")
        else:
            print(f"✓ {name}")
    for name, sql in WARNUNGEN.items():
        zeilen = con.execute(sql).fetchall()
        if zeilen:
            print(f"⚠ {name}: {len(zeilen)} – IDs: {[z[0] for z in zeilen]}")   # nur IDs, keine Inhalte
    if fehler:
        raise SystemExit("Qualitätstests fehlgeschlagen:\\n" + "\\n".join(fehler))


def exportieren(con):
    con.execute("COPY marts.tagesumsatz TO 'export/tagesumsatz.parquet' (FORMAT parquet)")


def lauf(tag: str):
    with duckdb.connect(DB) as con:
        n = laden(con, tag)
        print(f"{tag}: {n} Rohzeilen geladen")
        transformieren(con)
        testen(con, tag)
        exportieren(con)
        print(con.sql("SELECT * FROM marts.tagesumsatz"))


if __name__ == "__main__":
    lauf(sys.argv[1] if len(sys.argv) > 1 else "2026-05-04")
\`\`\`

Lege die SQL-Blöcke aus Schritt 3 und 4 in \`sql/transform.sql\` ab und starte:

\`\`\`bash title="Ausführen"
mkdir -p sql   # SQL aus Schritt 3 und 4 in sql/transform.sql speichern
python pipeline.py 2026-05-04
python pipeline.py 2026-05-04     # zweiter Lauf: gleiches Ergebnis (idempotent)
python pipeline.py 2026-05-05
\`\`\`

> [!NOTE] Getestet
> Die Code-Blöcke dieses Artikels wurden unverändert extrahiert und mit Python 3.14 und DuckDB 2.0 ausgeführt – inklusive zweitem Lauf zur Prüfung der Idempotenz.

Erwartetes Ergebnis für den 4. Mai: B-1002 erscheint nur einmal (Status „bezahlt“), B-1004 landet wegen des negativen Betrags in der Quarantäne, B-1003 zählt als Storno. Damit ergeben sich **2 Bestellungen** mit **69,89 €** Umsatz und **1 Storno**.

> [!WARNING] Häufiger Fehler beim Nachbauen
> Wer \`INSERT\` ohne vorheriges \`DELETE\` des Tages verwendet, verdoppelt beim zweiten Lauf alle Rohzeilen. Der Test „bestell_id eindeutig“ fällt das in der Staging-Schicht dank Deduplizierung **nicht** auf – erst die Zeilenzahl in \`raw\` verrät es. Deshalb: Idempotenz beim Laden sicherstellen, nicht auf spätere Deduplizierung hoffen.

## 6. Backfill

Weil jeder Lauf genau einen Tag verarbeitet, lassen sich vergangene Tage einfach nachholen:

\`\`\`bash title="Einen Zeitraum nachberechnen (bash)"
for tag in 2026-05-01 2026-05-02 2026-05-03 2026-05-04 2026-05-05; do
  python pipeline.py "$tag" || break
done
\`\`\`

## 7. Orchestrieren

Für den regelmäßigen Betrieb übernimmt ein Orchestrator Zeitplan, Wiederholungen und Übersicht. In Airflow genügt ein Task, der \`lauf(ds)\` aufruft – das logische Datum liefert der Kontext:

\`\`\`python title="dags/shop_pipeline.py (Airflow 3)" norun
from datetime import datetime, timedelta
from airflow.sdk import dag, task


@dag(schedule="@daily", start_date=datetime(2026, 5, 1), catchup=True, max_active_runs=1,
     default_args={"retries": 2, "retry_delay": timedelta(minutes=10)})
def shop_pipeline():
    @task
    def pipeline_lauf(ds=None):
        from pipeline import lauf     # das Modul aus diesem Projekt
        lauf(ds)

    pipeline_lauf()


shop_pipeline()
\`\`\`

\`max_active_runs=1\` verhindert, dass mehrere Tage gleichzeitig in dieselbe DuckDB-Datei schreiben – DuckDB erlaubt nur **einen** schreibenden Prozess.

## 8. Erweiterungen zum Weiterüben

1. **Kundendimension**: Lade \`kunden.csv\` und baue eine \`dim_kunde\` als [[Slowly Changing Dimension|SCD Typ 2]] (siehe [Warehouse, Lake & Lakehouse](#/artikel/data-warehouse-lake-lakehouse)).
2. **Parquet-Rohdaten**: Speichere die Bronze-Schicht als Parquet-Dateien je Tag (\`COPY … TO 'raw/datum=2026-05-04/teil.parquet'\`) und lies sie mit \`read_parquet('raw/*/*.parquet', hive_partitioning = true)\`.
3. **API statt CSV**: Hole Bestellungen per HTTP mit Pagination und Wiederholungen. Teste das Abfragen von APIs vorher im [HTTP-Request-Builder](#/labor/http).
4. **Monitoring**: Schreibe pro Lauf Zeilenzahlen und Laufzeit in eine Tabelle \`meta.laeufe\` und prüfe, ob die heutige Menge mehr als 50 % vom Durchschnitt der letzten 7 Tage abweicht.
5. **dbt**: Überführe Schritt 3 und 4 in ein dbt-Projekt mit dem Adapter \`dbt-duckdb\` und ersetze die Python-Tests durch dbt-Tests.

> [!TIP] Selbstkontrolle
> - Warum liest der Ladeschritt die CSV mit \`all_varchar = true\`?
> - Was würde passieren, wenn die Quelle B-1002 am 5. Mai erneut mit Status „storniert“ liefert? Berücksichtigt unsere Pipeline das für den 4. Mai? (Hinweis: Wir laden pro Tag nach \`datum\` – denk über späte Änderungen und CDC nach.)

\`\`\`widget
quiz:Data Engineering 3
\`\`\`
`;export{e as default};
