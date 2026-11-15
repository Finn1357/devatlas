const e=`---
id: datenqualitaet-monitoring
title: Datenqualität, Data Contracts und Monitoring von Pipelines
area: data
difficulty: fortgeschritten
minutes: 18
order: 6
summary: Dimensionen der Datenqualität, automatische Tests in SQL und dbt, Data Contracts zwischen Teams, Monitoring von Frische, Volumen und Schema, Alarmierung mit SLOs, Lineage, Quarantäne fehlerhafter Datensätze und Datenschutz in Pipelines.
tags: [Datenqualität, Data Contracts, Monitoring, Observability, dbt, SLO, Lineage, DSGVO]
related: [data-engineering-grundlagen, apache-airflow-orchestrierung, monitoring-observability, testing, data-pipeline-praxisprojekt]
---

## Warum Datenqualität ein Engineering-Thema ist

Ein Bug in einer App fällt meist sofort auf – sie stürzt ab oder zeigt eine Fehlermeldung. Ein Fehler in einer Datenpipeline ist oft **still**: Der Job läuft grün durch, aber im Bericht fehlen seit drei Tagen die Bestellungen aus Österreich, weil die Quelle ein Feld umbenannt hat. Entscheidungen werden dann auf falschen Zahlen getroffen. [[Datenqualität]] muss deshalb genauso **automatisch getestet und überwacht** werden wie Software.

## Dimensionen der Datenqualität

| Dimension | Frage | Beispiel-Prüfung |
|---|---|---|
| **Vollständigkeit** | Fehlen Werte oder Datensätze? | \`email IS NOT NULL\`, erwartete Zeilenzahl erreicht |
| **Gültigkeit** | Entsprechen Werte Format und Regeln? | Status ∈ {offen, bezahlt, versendet, storniert}, Preis ≥ 0 |
| **Eindeutigkeit** | Gibt es Duplikate? | \`bestell_id\` ist eindeutig |
| **Konsistenz** | Passen Daten zueinander? | Jede Bestellung verweist auf einen existierenden Kunden |
| **Genauigkeit** | Stimmen Werte mit der Realität überein? | Summe im Warehouse = Summe im Buchhaltungssystem |
| **Aktualität** | Sind die Daten frisch genug? | neuester Datensatz jünger als 2 Stunden |

## Tests als SQL

Jede Qualitätsregel lässt sich als Abfrage formulieren, die **fehlerhafte Zeilen** zurückgibt. Leeres Ergebnis = Test bestanden. Diese Abfragen kannst du im [SQL-Labor](#/labor/sql) direkt ausprobieren:

\`\`\`sql title="Eindeutigkeit: doppelte E-Mail-Adressen"
SELECT email, COUNT(*) AS anzahl
FROM kunden
WHERE email IS NOT NULL
GROUP BY email
HAVING COUNT(*) > 1;
\`\`\`

\`\`\`sql title="Referenzielle Integrität: Positionen ohne Bestellung"
SELECT bp.*
FROM bestellpositionen bp
LEFT JOIN bestellungen b ON b.id = bp.bestellung_id
WHERE b.id IS NULL;
\`\`\`

\`\`\`sql title="Gültigkeit und Plausibilität"
SELECT *
FROM bestellpositionen
WHERE menge <= 0
   OR einzelpreis < 0
   OR einzelpreis > 10000;   -- fachliche Obergrenze, mit dem Fachbereich abgestimmt
\`\`\`

In **dbt** werden Standardtests deklarativ an Modelle gehängt; eigene Tests sind SQL-Dateien nach demselben Prinzip:

\`\`\`yaml title="models/staging/schema.yml"
models:
  - name: stg_bestellungen
    columns:
      - name: id
        data_tests: [unique, not_null]
      - name: status
        data_tests:
          - accepted_values:
              values: ['offen', 'bezahlt', 'versendet', 'storniert']
      - name: kunde_id
        data_tests:
          - relationships:
              to: ref('stg_kunden')
              field: id
\`\`\`

Werkzeuge wie **Great Expectations** oder **Soda** bieten ähnliche Prüfungen in Python bzw. YAML, inklusive Berichten.

> [!TIP] Wo testen?
> - **Am Eingang** (nach dem Laden der Rohdaten): Schema, Pflichtfelder, Mengen – fängt Probleme der Quelle früh ab.
> - **Nach Transformationen**: Eindeutigkeit von Schlüsseln, Joins ohne Verluste oder Vervielfachung.
> - **Vor der Veröffentlichung** (Gold-Schicht): fachliche Kennzahlen, Abgleich mit Referenzsystemen.

### Was tun bei einem Fehler?

| Strategie | Wann sinnvoll |
|---|---|
| **Pipeline stoppen** | kritische Fehler, z. B. Schlüssel nicht eindeutig – lieber die Zahlen von gestern als falsche |
| **Quarantäne** | einzelne fehlerhafte Datensätze in eine eigene Tabelle verschieben, Rest verarbeiten |
| **Warnen und weiterlaufen** | weiche Regeln, z. B. ungewöhnlich wenige Zeilen am Feiertag |

## Data Contracts

Viele Qualitätsprobleme entstehen, weil das Team, das eine Quelle betreibt, nicht weiß, wer die Daten nutzt. Ein [[Data Contract]] macht die Abhängigkeit explizit – ähnlich einer API-Spezifikation:

\`\`\`yaml title="Beispiel eines Data Contracts (vereinfacht)"
datensatz: shop.bestellungen
verantwortlich: team-checkout
beschreibung: "Eine Zeile pro abgeschlossener Bestellung."
schema:
  - { name: bestell_id,  typ: string,    pflicht: true, eindeutig: true }
  - { name: kunde_id,    typ: integer,   pflicht: true }
  - { name: betrag_cent, typ: integer,   pflicht: true, minimum: 0 }
  - { name: status,      typ: string,    werte: [offen, bezahlt, versendet, storniert] }
  - { name: erstellt_am, typ: timestamp, pflicht: true, zeitzone: UTC }
qualitaet:
  frische: "neuester Datensatz < 1 Stunde alt"
  volumen: "mindestens 100 Zeilen pro Tag"
aenderungen: "Breaking Changes mit 30 Tagen Vorlauf und neuer Version"
\`\`\`

Der Vertrag wird idealerweise **automatisch geprüft**: in der CI des Quellteams (bricht die Änderung den Vertrag?) und zur Laufzeit in der Pipeline. Bei Kafka übernimmt eine Schema Registry mit Kompatibilitätsregeln einen Teil davon.

## Monitoring und Observability

Neben Tests, die bekannte Regeln prüfen, braucht man **Beobachtung**, die unbekannte Probleme sichtbar macht – die fünf klassischen Signale der Daten-Observability:

| Signal | Beispiel-Metrik | Typischer Alarm |
|---|---|---|
| **Frische** | Zeit seit letzter Aktualisierung | Tabelle seit 6 h nicht aktualisiert |
| **Volumen** | Zeilen pro Lauf/Partition | 70 % weniger Zeilen als im Wochenschnitt |
| **Schema** | Spalten, Typen | neue/fehlende Spalte in der Quelle |
| **Verteilung** | Anteil NULL, Wertebereiche, Mittelwerte | Anteil leerer Postleitzahlen springt von 1 % auf 40 % |
| **[[Data Lineage|Lineage]]** | Abhängigkeitsgraph | zeigt, welche Dashboards ein Fehler betrifft |

Dazu kommen die Betriebsmetriken der Pipelines selbst: Laufzeit, Fehlerquote, Wiederholungen, Kosten pro Lauf, bei Streams der Consumer Lag. Mit Prometheus und Grafana (siehe [Monitoring & Observability](#/artikel/monitoring-observability)) oder den Werkzeugen der Datenplattform werden sie erfasst und visualisiert.

### SLOs für Daten

Statt „die Pipeline soll funktionieren“ formuliert man messbare Ziele ([[SLO]]):

- „Die Tagesumsätze des Vortags stehen an 99 % der Tage bis 6:00 Uhr bereit.“
- „Weniger als 0,1 % der Bestellungen landen in der Quarantäne.“

[[Alerting]] orientiert sich an diesen Zielen: Ein Alarm sollte bedeuten „ein Mensch muss jetzt handeln“ und auf eine Anleitung (Runbook) verweisen. Zu viele unwichtige Alarme führen dazu, dass auch die wichtigen ignoriert werden.

## Datenschutz in Pipelines

Pipelines kopieren Daten an viele Orte – Rohdatenbereich, Zwischentabellen, Exporte, Notebooks. Die [[DSGVO]] gilt überall:

- **Datenminimierung**: nur Felder übernehmen, die für einen Zweck nötig sind.
- **Pseudonymisierung früh**: E-Mail-Adressen durch einen gesalzenen [[Hashing|Hash]] oder eine ID ersetzen, bevor sie in Analysebereiche gelangen.
- **Zugriff nach Schichten**: Rohdaten mit personenbezogenen Feldern nur für wenige; Gold-Tabellen aggregiert.
- **Löschkonzept**: Löschanfragen müssen auch Data Lake, Snapshots von Tabellenformaten und Backups erreichen.
- **Keine echten Daten in Test- und Entwicklungsumgebungen** ohne Anonymisierung.

> [!DANGER] Logs und Fehlermeldungen
> Ein Qualitätstest, der „fehlerhafte Zeile: {name: 'Ada Lovelace', email: 'ada@…'}“ in ein Chat-Tool postet, kopiert personenbezogene Daten an einen weiteren Ort. Alarme sollten IDs und Zahlen enthalten, keine Inhalte.

> [!TIP] Übung
> 1. Schreibe im SQL-Labor eine Prüfung, die Bestellungen findet, deren Datum vor dem Registrierungsdatum des Kunden liegt.
> 2. Formuliere drei Volumen- und Frische-Regeln für eine Tabelle mit Webshop-Bestellungen. Welche sollen die Pipeline stoppen, welche nur warnen?
> 3. Eine Quelle ändert \`betrag\` (Euro, Dezimalzahl) in \`betrag_cent\` (Ganzzahl). Welche Tests hätten das bemerkt, und wie hätte ein Data Contract den Ausfall verhindert?

\`\`\`widget
quiz:Data Engineering 4
\`\`\`
`;export{e as default};
