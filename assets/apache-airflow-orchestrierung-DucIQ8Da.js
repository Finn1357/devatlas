const e=`---
id: apache-airflow-orchestrierung
title: Orchestrierung mit Apache Airflow: DAGs, Zeitpläne, Backfills und dbt
area: data
difficulty: fortgeschritten
minutes: 20
order: 5
summary: Warum Pipelines einen Orchestrator brauchen, wie Airflow mit DAGs, Tasks und Datenintervallen arbeitet, ein vollständiges TaskFlow-Beispiel für Airflow 3, Wiederholungen, Idempotenz und Backfills, typische Fehler sowie dbt für versionierte SQL-Transformationen und Alternativen wie Dagster und Prefect.
tags: [Airflow, Orchestrierung, DAG, Backfill, dbt, Scheduling, Data Pipeline]
related: [data-engineering-grundlagen, datenqualitaet-monitoring, data-pipeline-praxisprojekt, automatisierung, graphen]
---

## Warum nicht einfach Cron?

Ein [[Cron]]-Job startet ein Skript zu festen Zeiten. Für eine einzelne Aufgabe genügt das. Eine echte Datenplattform hat aber Dutzende voneinander abhängige Schritte: Erst Bestellungen und Kunden laden, dann bereinigen, dann das Sternschema bauen, dann Qualität prüfen, dann den Bericht aktualisieren. Ein **Orchestrator** übernimmt:

| Aufgabe | Was Cron allein nicht kann |
|---|---|
| **Abhängigkeiten** | „B startet erst, wenn A und C erfolgreich waren“ |
| **Wiederholungen** | automatisch erneut versuchen, mit Wartezeit |
| **Übersicht** | welcher Lauf ist fehlgeschlagen, wie lange dauern Schritte? |
| **Nachholen (Backfill)** | einen Monat Vergangenheit Tag für Tag neu berechnen |
| **Parametrisierung** | jeder Lauf kennt sein Datenintervall |
| **Alarmierung** | Benachrichtigung bei Fehlern |

## Konzepte von Airflow

**[Apache Airflow](#/tech/apache-airflow)** beschreibt Pipelines als Python-Code.

| Begriff | Bedeutung |
|---|---|
| **DAG** | Workflow als gerichteter azyklischer Graph ([[DAG]]) aus Tasks |
| **Task** | ein Schritt, z. B. Python-Funktion, SQL-Abfrage, Shell-Befehl |
| **Operator** | Vorlage für einen Task-Typ (\`BashOperator\`, \`SQLExecuteQueryOperator\`, Provider für Cloud-Dienste) |
| **DAG Run** | eine Ausführung des DAG für ein bestimmtes Datenintervall |
| **Datenintervall / logisches Datum** | der Zeitraum, den der Lauf verarbeitet – nicht der Startzeitpunkt |
| **XCom** | kleiner Datenaustausch zwischen Tasks (Pfade, IDs – keine großen Datenmengen!) |
| **Scheduler / Executor** | plant Läufe bzw. führt Tasks aus (lokal, Celery, Kubernetes) |

> [!BEGINNER] Datenintervall verstehen
> Ein täglicher DAG für den Zeitraum **4. Mai 00:00 – 5. Mai 00:00** startet erst **nach** dem Ende dieses Intervalls, also am 5. Mai kurz nach Mitternacht – denn erst dann sind alle Daten des 4. Mai vorhanden. Der Lauf „gehört“ trotzdem zum 4. Mai (logisches Datum). Wer stattdessen „heute“ mit \`datetime.now()\` berechnet, verarbeitet bei Wiederholungen und Backfills den falschen Tag.

## Ein vollständiger DAG (Airflow 3, TaskFlow-API)

\`\`\`python title="dags/shop_umsatz.py"
from datetime import datetime, timedelta

from airflow.sdk import dag, task


@dag(
    schedule="@daily",
    start_date=datetime(2026, 1, 1),
    catchup=False,                       # beim ersten Aktivieren keine alten Läufe nachholen
    default_args={"retries": 2, "retry_delay": timedelta(minutes=5)},
    tags=["shop", "umsatz"],
)
def shop_umsatz():

    @task
    def bestellungen_laden(ds=None) -> str:
        """Bestellungen des Datenintervalls aus der Shop-API in den Rohbereich schreiben."""
        pfad = f"/data/raw/bestellungen/datum={ds}/teil.parquet"
        lade_bestellungen_von_api(tag=ds, ziel=pfad)     # überschreibt die Partition → idempotent
        return pfad                                        # landet als XCom beim nächsten Task

    @task
    def kunden_laden(ds=None) -> str:
        pfad = f"/data/raw/kunden/datum={ds}/teil.parquet"
        lade_kunden_snapshot(ziel=pfad)
        return pfad

    @task
    def umsatz_berechnen(bestellungen: str, kunden: str, ds=None) -> int:
        zeilen = berechne_tagesumsatz(bestellungen, kunden, tag=ds)   # z. B. DuckDB- oder Spark-Job
        return zeilen

    @task
    def qualitaet_pruefen(zeilen: int, ds=None):
        if zeilen == 0:
            raise ValueError(f"Keine Umsatzzeilen für {ds} – Quelle prüfen!")

    b = bestellungen_laden()
    k = kunden_laden()
    qualitaet_pruefen(umsatz_berechnen(b, k))   # Abhängigkeiten ergeben sich aus den Datenflüssen


shop_umsatz()
\`\`\`

Airflow erkennt aus den Funktionsaufrufen den Graphen: \`bestellungen_laden\` und \`kunden_laden\` laufen parallel, danach \`umsatz_berechnen\`, dann \`qualitaet_pruefen\`. Der Parameter \`ds\` wird von Airflow mit dem logischen Datum (\`YYYY-MM-DD\`) befüllt.

> [!NOTE] Airflow 2 vs. 3
> Airflow 3 (2025) importiert die Autoren-API aus \`airflow.sdk\`; in Airflow 2 lautet der Import \`from airflow.decorators import dag, task\`. Außerdem ist in Airflow 3 \`catchup\` standardmäßig deaktiviert, „Datasets“ heißen jetzt „Assets“, und Tasks sprechen über eine API mit dem Server statt direkt mit der Metadatenbank. Das Parameter-Paar \`schedule_interval\` gibt es nicht mehr – nur noch \`schedule\`.

### Lokal starten

\`\`\`bash title="Airflow lokal zum Ausprobieren"
python -m venv .venv && source .venv/bin/activate
# Airflow empfiehlt Constraint-Dateien für reproduzierbare Installationen (siehe Installationsanleitung)
pip install "apache-airflow"
export AIRFLOW_HOME=~/airflow
airflow standalone          # startet alle Komponenten und gibt Zugangsdaten für die Oberfläche aus
\`\`\`

DAG-Dateien gehören in den \`dags/\`-Ordner unter \`AIRFLOW_HOME\`. In Teams läuft Airflow meist per Docker Compose, Helm-Chart in Kubernetes oder als verwalteter Dienst.

## Idempotenz und Backfills

Airflow wiederholt Tasks automatisch – und Menschen starten fehlgeschlagene Läufe neu. Jeder Task muss daher **[[Idempotenz|idempotent]]** sein:

| Nicht idempotent | Idempotent |
|---|---|
| \`INSERT INTO umsatz SELECT … WHERE datum = CURRENT_DATE - 1\` | \`DELETE FROM umsatz WHERE datum = :ds; INSERT …\` in einer Transaktion |
| an eine Datei anhängen | Partition \`datum=:ds\` vollständig überschreiben |
| \`datetime.now()\` im Code | Datenintervall aus dem Kontext verwenden |
| E-Mail bei jedem Lauf | Benachrichtigung nur, wenn noch nicht gesendet |

Sind Tasks idempotent und parametrisiert, ist ein [[Backfill]] trivial:

\`\`\`bash title="Vergangene Zeiträume neu berechnen"
# Airflow 3
airflow backfill create --dag-id shop_umsatz --from-date 2026-04-01 --to-date 2026-04-30

# Airflow 2
airflow dags backfill -s 2026-04-01 -e 2026-04-30 shop_umsatz
\`\`\`

> [!WARNING] Backfills belasten Quellen
> Ein Backfill über ein Jahr startet 365 Läufe. Mit \`max_active_runs\` am DAG und Pools für knappe Ressourcen (z. B. „höchstens 2 gleichzeitige Abfragen auf die Produktionsdatenbank“) begrenzen.

## Typische Fehler

> [!MISTAKE] Große Daten über XCom
> XComs liegen in der Airflow-Metadatenbank. DataFrames oder große JSON-Listen dort abzulegen, macht Airflow langsam. Daten gehören in den Speicher (Objektspeicher, Datenbank); per XCom wird nur der **Pfad** weitergegeben.

> [!MISTAKE] Teure Arbeit auf DAG-Ebene
> Code außerhalb von Tasks (Top-Level-Code) wird beim regelmäßigen Einlesen der DAG-Dateien ausgeführt – auch Datenbankabfragen oder API-Aufrufe. Solche Arbeit gehört **in** Tasks.

> [!MISTAKE] Airflow als Rechenmaschine
> Airflow **steuert** Arbeit. Schwere Berechnungen laufen besser im Warehouse (SQL), in Spark oder in Containern (\`KubernetesPodOperator\`) – nicht im Worker-Prozess von Airflow selbst.

## Transformationen mit dbt

**[dbt](#/tech/dbt)** (data build tool) ist das Standardwerkzeug für den „T“-Teil von ELT. Jedes Modell ist eine SQL-Datei mit einer \`SELECT\`-Abfrage; dbt erzeugt daraus Tabellen oder Views, berechnet die Reihenfolge aus \`ref()\`-Abhängigkeiten und führt Tests aus.

\`\`\`sql title="models/marts/fakt_tagesumsatz.sql" norun
{{ config(materialized='incremental', unique_key=['tag', 'kategorie']) }}

select
    cast(b.datum as date)                 as tag,
    p.kategorie,
    sum(pos.menge * pos.einzelpreis)      as umsatz,
    count(distinct b.id)                  as bestellungen
from {{ ref('stg_bestellungen') }} b
join {{ ref('stg_positionen') }}  pos on pos.bestellung_id = b.id
join {{ ref('stg_produkte') }}    p   on p.id = pos.produkt_id
where b.status <> 'storniert'
{% if is_incremental() %}
  and cast(b.datum as date) >= (select max(tag) - interval 3 day from {{ this }})   -- späte Änderungen mitnehmen
{% endif %}
group by 1, 2
\`\`\`

\`\`\`yaml title="models/marts/schema.yml"
models:
  - name: fakt_tagesumsatz
    description: "Umsatz je Tag und Produktkategorie, ohne Stornos."
    columns:
      - name: tag
        data_tests: [not_null]
      - name: umsatz
        data_tests: [not_null]
\`\`\`

\`dbt build\` führt Modelle und Tests in der richtigen Reihenfolge aus. dbt erzeugt außerdem Dokumentation mit [[Data Lineage]]-Graph. In Airflow startet ein Task einfach \`dbt build --select marts.fakt_tagesumsatz\`.

> [!NOTE] Syntax prüfen
> Die SQL-Funktionen im Beispiel (\`interval 3 day\`) hängen vom Warehouse-Dialekt ab. In älteren dbt-Versionen heißt der Testschlüssel \`tests\` statt \`data_tests\`.

## Alternativen

| Werkzeug | Ansatz | Gut für |
|---|---|---|
| **Airflow** | Tasks und Zeitpläne, riesiges Provider-Ökosystem | etablierte Plattformen, viele Integrationen |
| **Dagster** | „Software-defined Assets“: Datenbestände statt Tasks im Mittelpunkt | Lineage, Tests, lokale Entwicklung |
| **Prefect** | Python-Funktionen als Flows, dynamische Workflows | Python-lastige Teams, schnelle Einführung |
| **Cron + Skript** | Zeitplan ohne Abhängigkeiten | eine einzelne, unkritische Aufgabe |

> [!TIP] Übung
> 1. Ein DAG mit \`schedule="@daily"\` und \`start_date=2026-05-01\` wird am 3. Mai um 10 Uhr aktiviert, \`catchup=True\`. Welche Läufe startet Airflow, und welche Datenintervalle verarbeiten sie?
> 2. Mache diesen Task idempotent: \`INSERT INTO log_tag SELECT * FROM events WHERE ts::date = current_date - 1\`.
> 3. Zeichne den DAG des Beispiels: Welche Tasks laufen parallel?

\`\`\`widget
quiz:Data Engineering 4
\`\`\`
`;export{e as default};
