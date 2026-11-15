const e=`---
id: indizes-transaktionen
title: Indizes, Abfrageoptimierung & Transaktionen
area: datenbanken
difficulty: profi
minutes: 20
order: 12
summary: Warum Indizes Abfragen von Sekunden auf Millisekunden bringen, wie du Ausführungspläne liest, was ACID garantiert und welche Anomalien Isolationslevel verhindern.
tags: [Index, EXPLAIN, Transaktion, ACID, Isolation, Performance]
related: [sql-grundlagen, relationale-datenbanken, orm-migrationen, caching-queues, replikation-sharding-backups, baeume-heaps]
---

## Warum sind Abfragen langsam?

Ohne Hilfsstruktur muss die Datenbank für \`WHERE kunde_id = 42\` **jede Zeile** der Tabelle lesen (Sequential Scan) – bei 100 Millionen Bestellungen dauert das. Ein **[[Index]]** ist wie das Stichwortverzeichnis eines Buches: Statt alle Seiten zu lesen, schlägt man nach und springt direkt zur richtigen Stelle.

## Wie ein Index funktioniert

Die meisten Indizes sind **B+-Bäume**: sortierte, balancierte [[Baum|Bäume]], in denen die Suche nach einem Wert O(log n) Schritte braucht. Bei einer Milliarde Zeilen sind das nur wenige Seitenzugriffe. Weil die Werte sortiert sind, helfen B-Baum-Indizes auch bei Bereichsabfragen (\`<\`, \`BETWEEN\`), \`ORDER BY\` und Präfixsuchen (\`LIKE 'abc%'\`).

\`\`\`sql
CREATE INDEX idx_bestellungen_kunde ON bestellungen (kunde_id);
\`\`\`

### Zusammengesetzte Indizes

\`\`\`sql
CREATE INDEX idx_bestellungen_kunde_datum ON bestellungen (kunde_id, datum DESC);
\`\`\`

Dieser Index hilft bei \`WHERE kunde_id = ?\`, bei \`WHERE kunde_id = ? AND datum > ?\` und bei \`WHERE kunde_id = ? ORDER BY datum DESC\` – aber **nicht** bei \`WHERE datum > ?\` allein (**Leftmost-Prefix-Regel**: Die Spalten werden von links nach rechts genutzt, wie ein Telefonbuch nach Nachname, dann Vorname sortiert ist).

> [!TIP] Reihenfolge der Spalten
> Spalten mit **Gleichheitsbedingungen** zuerst, dann Bereichs- oder Sortierspalten.

### Weitere Indexarten (PostgreSQL)

| Art | Einsatz |
|---|---|
| B-Tree | Standard: Gleichheit, Bereiche, Sortierung |
| Hash | nur Gleichheit |
| GIN | JSONB, Arrays, Volltextsuche |
| GiST / SP-GiST | Geodaten, Bereiche, Ähnlichkeit |
| BRIN | sehr große, natürlich sortierte Tabellen (Zeitreihen) |
| Partieller Index | \`WHERE status = 'offen'\` – nur relevante Zeilen |
| Covering (\`INCLUDE\`) | Zusatzspalten, damit die Tabelle gar nicht gelesen werden muss |

### Kosten eines Index

Jeder Index kostet **Speicher** und verlangsamt **Schreibvorgänge** (INSERT/UPDATE/DELETE müssen ihn pflegen). Indexiere daher gezielt für tatsächliche Abfragen – nicht „sicherheitshalber jede Spalte“.

## Ausführungspläne lesen

Der [[Query Planner]] entscheidet anhand von Statistiken, wie eine Abfrage ausgeführt wird. \`EXPLAIN\` zeigt den Plan, \`EXPLAIN ANALYZE\` führt die Abfrage aus und misst.

\`\`\`sql
EXPLAIN ANALYZE
SELECT * FROM bestellungen WHERE kunde_id = 42 ORDER BY datum DESC LIMIT 10;
\`\`\`

\`\`\`text title="PostgreSQL – vor und nach dem Index (vereinfacht)"
Limit  (actual time=212.4..212.5 rows=10)
  -> Sort  (Sort Key: datum DESC)
       -> Seq Scan on bestellungen  (rows=118 … Rows Removed by Filter: 4999882)
Execution Time: 212.6 ms

Limit  (actual time=0.03..0.05 rows=10)
  -> Index Scan using idx_bestellungen_kunde_datum on bestellungen
       Index Cond: (kunde_id = 42)
Execution Time: 0.07 ms
\`\`\`

Achte auf: **Seq Scan** auf großen Tabellen, große Abweichungen zwischen geschätzten und tatsächlichen Zeilen (veraltete Statistiken → \`ANALYZE\`), teure **Sort**-Knoten, **Nested Loops** über viele Zeilen. Im [SQL-Labor](#/labor/sql) zeigt \`EXPLAIN QUERY PLAN\` den SQLite-Plan.

### Wann ein Index nicht genutzt wird

- Funktion auf der Spalte: \`WHERE lower(email) = …\` → stattdessen einen **Ausdrucks-Index** \`CREATE INDEX … ON kunden (lower(email))\`.
- Führendes Wildcard: \`LIKE '%gmail.com'\`.
- Implizite Typumwandlung (Zahl mit Text vergleichen).
- Geringe Selektivität: Wenn ohnehin 40 % der Zeilen passen, ist ein Seq Scan oft schneller.

## Transaktionen

Eine **[[Transaktion]]** fasst mehrere Operationen zu einer unteilbaren Einheit zusammen.

\`\`\`sql
BEGIN;
UPDATE konten SET saldo = saldo - 100 WHERE id = 1;
UPDATE konten SET saldo = saldo + 100 WHERE id = 2;
COMMIT;   -- oder ROLLBACK; bei einem Fehler
\`\`\`

### ACID

| Eigenschaft | Bedeutung |
|---|---|
| **A**tomarität | Alles oder nichts – bei Fehlern wird zurückgerollt |
| **C**onsistency (Konsistenz) | Constraints gelten vorher und nachher |
| **I**solation | Gleichzeitige Transaktionen stören sich (je nach Level) nicht |
| **D**urability (Dauerhaftigkeit) | Nach COMMIT überlebt die Änderung auch einen Absturz (Write-Ahead-Log) |

### Isolationslevel und Anomalien

| Anomalie | Beschreibung |
|---|---|
| Dirty Read | Lesen nicht committeter Daten einer anderen Transaktion |
| Non-Repeatable Read | Dieselbe Zeile liefert beim zweiten Lesen einen anderen Wert |
| Phantom Read | Dieselbe Abfrage liefert beim zweiten Mal zusätzliche Zeilen |
| Lost Update | Zwei Transaktionen überschreiben sich gegenseitig |
| Write Skew | Zwei Transaktionen prüfen dieselbe Bedingung und verletzen sie gemeinsam |

| [[Isolationslevel]] | verhindert | Default in |
|---|---|---|
| Read Uncommitted | (in PostgreSQL wie Read Committed) | – |
| **Read Committed** | Dirty Reads | PostgreSQL, SQL Server, Oracle |
| **Repeatable Read** | + Non-Repeatable Reads (in PostgreSQL auch Phantoms) | MySQL/InnoDB |
| **Serializable** | alle Anomalien – als liefen Transaktionen nacheinander | – |

> [!EXPERT] Lost Updates in der Praxis verhindern
> Der Klassiker: Zwei Anfragen lesen gleichzeitig \`lagerbestand = 1\`, beide verkaufen – Bestand −1. Lösungen: **atomare Updates** (\`UPDATE produkte SET lagerbestand = lagerbestand - 1 WHERE id = 3 AND lagerbestand > 0\` und prüfen, ob eine Zeile betroffen war), **pessimistische Sperren** (\`SELECT … FOR UPDATE\`) oder **optimistisches Locking** mit einer Versionsspalte (\`UPDATE … WHERE id = ? AND version = ?\`). Das ist eine [[Race Condition]] auf Datenbankebene.

### Deadlocks

Sperren zwei Transaktionen Zeilen in unterschiedlicher Reihenfolge, warten sie ewig aufeinander ([[Deadlock]]). Datenbanken erkennen das und brechen eine Transaktion ab. Abhilfe: Zeilen stets in gleicher Reihenfolge sperren, Transaktionen kurz halten, abgebrochene Transaktionen in der Anwendung wiederholen.

## Best Practices

- Indizes aus **echten Abfragen** ableiten (Slow-Query-Log, \`pg_stat_statements\`).
- Fremdschlüsselspalten indexieren.
- Transaktionen **kurz** halten – keine Netzwerkaufrufe oder Nutzereingaben innerhalb einer Transaktion.
- Statistiken aktuell halten; Pläne nach größeren Datenänderungen erneut prüfen.
- Für hohe Leselast: Read-Replicas ([[Replikation]]) und [Caching](#/artikel/caching-queues).

## Wie geht es weiter?

Wie ORMs diese Konzepte kapseln (und wo sie Fallen stellen), zeigt [ORMs & Migrationen](#/artikel/orm-migrationen). Nicht-relationale Alternativen beschreibt [NoSQL](#/artikel/nosql).
`;export{e as default};
