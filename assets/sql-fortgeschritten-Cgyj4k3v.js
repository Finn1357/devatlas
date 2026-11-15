const e=`---
id: sql-fortgeschritten
title: SQL für Fortgeschrittene: JOINs, Aggregation, CTEs & Window Functions
area: datenbanken
difficulty: fortgeschritten
minutes: 24
order: 13
summary: JOIN-Typen im Detail, GROUP BY und HAVING, Unterabfragen und EXISTS, Common Table Expressions (auch rekursiv), Window Functions, NULL-Fallen, Upserts und Ausführungspläne – alle Beispiele laufen direkt im SQL-Labor.
tags: [SQL, JOIN, GROUP BY, CTE, Window Functions, NULL, EXPLAIN]
related: [sql-grundlagen, indizes-transaktionen, datenmodellierung-normalisierung, relationale-datenbanken]
---

## Vorbereitung

Alle Abfragen beziehen sich auf die Beispieldatenbank des [SQL-Labors](#/labor/sql): \`kunden\`, \`produkte\`, \`bestellungen\` und \`bestellpositionen\`. Über **Ausführen** an jedem Codeblock öffnest du die Abfrage dort direkt. Die Grundlagen (\`SELECT\`, \`WHERE\`, \`ORDER BY\`, einfache JOINs) stehen in [SQL-Grundlagen](#/artikel/sql-grundlagen).

## JOINs im Detail

Ein [[JOIN]] verknüpft Zeilen aus zwei Tabellen über eine Bedingung. Welche Zeilen ohne Partner trotzdem im Ergebnis landen, entscheidet der JOIN-Typ:

\`\`\`widget
joins
\`\`\`

\`\`\`sql title="Kunden mit Anzahl ihrer Bestellungen – auch Kunden ohne Bestellung"
SELECT k.name, COUNT(b.id) AS bestellungen
FROM kunden k
LEFT JOIN bestellungen b ON b.kunde_id = k.id
GROUP BY k.id, k.name
ORDER BY bestellungen DESC, k.name;
\`\`\`

> [!MISTAKE] COUNT(*) bei LEFT JOIN
> \`COUNT(*)\` zählt Zeilen – auch die mit NULL aufgefüllte Zeile eines Kunden ohne Bestellung, er bekäme also 1. \`COUNT(b.id)\` zählt nur Werte, die nicht NULL sind, und liefert korrekt 0.

> [!MISTAKE] Filter im WHERE macht aus LEFT einen INNER JOIN
> \`LEFT JOIN bestellungen b ON … WHERE b.status = 'offen'\` entfernt alle Kunden ohne Bestellung wieder, weil \`NULL = 'offen'\` nicht wahr ist. Bedingungen für die rechte Tabelle gehören bei LEFT JOINs in die \`ON\`-Klausel: \`LEFT JOIN bestellungen b ON b.kunde_id = k.id AND b.status = 'offen'\`.

### Mehrere JOINs und Self-Joins

\`\`\`sql title="Umsatz je Bestellung über drei Tabellen"
SELECT b.id, k.name, b.datum,
       ROUND(SUM(p.menge * p.einzelpreis), 2) AS summe
FROM bestellungen b
JOIN kunden k            ON k.id = b.kunde_id
JOIN bestellpositionen p ON p.bestellung_id = b.id
WHERE b.status <> 'storniert'
GROUP BY b.id, k.name, b.datum
ORDER BY summe DESC
LIMIT 5;
\`\`\`

Ein **Self-Join** verbindet eine Tabelle mit sich selbst – etwa Kunden aus derselben Stadt:

\`\`\`sql
SELECT a.name, b.name, a.stadt
FROM kunden a
JOIN kunden b ON a.stadt = b.stadt AND a.id < b.id   -- a.id < b.id: jedes Paar nur einmal
ORDER BY a.stadt;
\`\`\`

## Aggregation: GROUP BY und HAVING

[[Aggregatfunktion|Aggregatfunktionen]] (\`COUNT\`, \`SUM\`, \`AVG\`, \`MIN\`, \`MAX\`) fassen viele Zeilen zu einer zusammen. \`GROUP BY\` bildet Gruppen, \`HAVING\` filtert **nach** der Aggregation:

\`\`\`sql title="Kategorien mit Durchschnittspreis über 30 €"
SELECT kategorie,
       COUNT(*)              AS anzahl,
       ROUND(AVG(preis), 2)  AS durchschnitt,
       MAX(preis)            AS teuerstes
FROM produkte
WHERE lagerbestand > 0          -- WHERE filtert Zeilen VOR dem Gruppieren
GROUP BY kategorie
HAVING AVG(preis) > 30          -- HAVING filtert Gruppen NACH dem Gruppieren
ORDER BY durchschnitt DESC;
\`\`\`

### Die logische Reihenfolge einer Abfrage

SQL wird nicht in der Reihenfolge ausgewertet, in der man es schreibt:

\`\`\`text
1. FROM / JOIN    → Tabellen zusammenführen
2. WHERE          → Zeilen filtern
3. GROUP BY       → Gruppen bilden
4. HAVING         → Gruppen filtern
5. SELECT         → Spalten berechnen, Aliase vergeben
6. DISTINCT
7. ORDER BY       → sortieren (hier sind SELECT-Aliase verfügbar)
8. LIMIT / OFFSET
\`\`\`

Deshalb kann man einen Alias aus \`SELECT\` in \`ORDER BY\` verwenden, im Standard-SQL aber nicht in \`WHERE\`.

### Bedingte Aggregation mit CASE

\`\`\`sql title="Bestellungen je Status als Spalten (Pivot)"
SELECT strftime('%Y-%m', datum) AS monat,
       SUM(CASE WHEN status = 'versendet' THEN 1 ELSE 0 END) AS versendet,
       SUM(CASE WHEN status = 'offen'     THEN 1 ELSE 0 END) AS offen,
       SUM(CASE WHEN status = 'storniert' THEN 1 ELSE 0 END) AS storniert
FROM bestellungen
GROUP BY monat
ORDER BY monat;
\`\`\`

\`strftime\` ist SQLite-spezifisch; in PostgreSQL entspricht das \`to_char(datum, 'YYYY-MM')\` oder \`date_trunc('month', datum)\`. PostgreSQL bietet außerdem die Kurzform \`COUNT(*) FILTER (WHERE status = 'offen')\`.

## Unterabfragen und EXISTS

\`\`\`sql title="Produkte, die teurer als der Durchschnitt sind"
SELECT name, preis
FROM produkte
WHERE preis > (SELECT AVG(preis) FROM produkte)   -- skalare Unterabfrage
ORDER BY preis DESC;
\`\`\`

\`\`\`sql title="Kunden, die noch nie bestellt haben"
SELECT k.name
FROM kunden k
WHERE NOT EXISTS (
  SELECT 1 FROM bestellungen b WHERE b.kunde_id = k.id   -- korrelierte Unterabfrage
);
\`\`\`

> [!DANGER] Die NOT-IN-Falle
> \`WHERE id NOT IN (SELECT kunde_id FROM …)\` liefert **gar keine Zeilen**, sobald die Unterabfrage auch nur ein \`NULL\` enthält – denn \`x NOT IN (1, NULL)\` ist nie wahr, sondern „unbekannt“. \`NOT EXISTS\` hat dieses Problem nicht und ist meist gleich schnell oder schneller.

## Common Table Expressions (CTEs)

Eine **[[CTE]]** (\`WITH … AS\`) gibt einer Unterabfrage einen Namen. Komplexe Abfragen werden so lesbar wie ein Programm mit Zwischenschritten:

\`\`\`sql title="Umsatz je Kunde und Anteil am Gesamtumsatz"
WITH umsatz_je_bestellung AS (
  SELECT b.id, b.kunde_id, SUM(p.menge * p.einzelpreis) AS summe
  FROM bestellungen b
  JOIN bestellpositionen p ON p.bestellung_id = b.id
  WHERE b.status <> 'storniert'
  GROUP BY b.id, b.kunde_id
),
umsatz_je_kunde AS (
  SELECT kunde_id, SUM(summe) AS umsatz
  FROM umsatz_je_bestellung
  GROUP BY kunde_id
)
SELECT k.name,
       ROUND(u.umsatz, 2) AS umsatz,
       ROUND(100.0 * u.umsatz / (SELECT SUM(umsatz) FROM umsatz_je_kunde), 1) AS prozent
FROM umsatz_je_kunde u
JOIN kunden k ON k.id = u.kunde_id
ORDER BY u.umsatz DESC;
\`\`\`

### Rekursive CTEs

Mit \`WITH RECURSIVE\` lassen sich Hierarchien (Kategoriebäume, Organigramme, Stücklisten) und Zahlenfolgen abfragen:

\`\`\`sql title="Zahlenfolge und Kalender erzeugen"
WITH RECURSIVE tage(tag) AS (
  SELECT date('2026-11-01')
  UNION ALL
  SELECT date(tag, '+1 day') FROM tage WHERE tag < '2026-11-07'
)
SELECT tag FROM tage;
\`\`\`

\`\`\`sql title="Hierarchie durchlaufen (Schema-Beispiel, nicht im Labor)" norun
WITH RECURSIVE kette AS (
  SELECT id, name, vorgesetzter_id, 1 AS ebene
  FROM mitarbeitende WHERE vorgesetzter_id IS NULL          -- Startpunkt: die Spitze
  UNION ALL
  SELECT m.id, m.name, m.vorgesetzter_id, k.ebene + 1
  FROM mitarbeitende m
  JOIN kette k ON m.vorgesetzter_id = k.id                  -- rekursiver Schritt
)
SELECT * FROM kette ORDER BY ebene, name;
\`\`\`

## Window Functions

**[[Window Function|Window Functions]]** rechnen über eine Gruppe verwandter Zeilen, **ohne sie zusammenzufassen** – jede Zeile bleibt erhalten und bekommt einen zusätzlichen Wert. Das ist der wichtigste Unterschied zu \`GROUP BY\`.

\`\`\`sql title="Ranking und laufende Summe"
SELECT name, kategorie, preis,
       RANK()       OVER (PARTITION BY kategorie ORDER BY preis DESC) AS rang_in_kategorie,
       ROUND(AVG(preis) OVER (PARTITION BY kategorie), 2)            AS schnitt_kategorie,
       SUM(preis)   OVER (ORDER BY preis ROWS UNBOUNDED PRECEDING)    AS laufende_summe
FROM produkte
ORDER BY kategorie, rang_in_kategorie;
\`\`\`

\`\`\`sql title="Abstand zur vorherigen Bestellung desselben Kunden (LAG)"
SELECT kunde_id, id, datum,
       LAG(datum) OVER (PARTITION BY kunde_id ORDER BY datum) AS vorherige,
       julianday(datum) - julianday(LAG(datum) OVER (PARTITION BY kunde_id ORDER BY datum)) AS tage_dazwischen
FROM bestellungen
ORDER BY kunde_id, datum;
\`\`\`

\`\`\`sql title="Top-N pro Gruppe: das teuerste Produkt je Kategorie"
WITH bewertet AS (
  SELECT name, kategorie, preis,
         ROW_NUMBER() OVER (PARTITION BY kategorie ORDER BY preis DESC) AS nr
  FROM produkte
)
SELECT kategorie, name, preis FROM bewertet WHERE nr = 1;
\`\`\`

| Funktion | Liefert |
|---|---|
| \`ROW_NUMBER()\` | fortlaufende Nummer (eindeutig) |
| \`RANK()\` / \`DENSE_RANK()\` | Rang mit Lücken / ohne Lücken bei Gleichstand |
| \`LAG(x)\` / \`LEAD(x)\` | Wert der vorherigen / nächsten Zeile |
| \`FIRST_VALUE(x)\` / \`LAST_VALUE(x)\` | erster / letzter Wert im Fenster |
| \`SUM(x) OVER (…)\`, \`AVG(x) OVER (…)\` | laufende oder gruppenweise Aggregate |
| \`NTILE(n)\` | Aufteilung in n gleich große Gruppen (Quartile …) |

## NULL: dreiwertige Logik

[[NULL]] bedeutet „unbekannt“, nicht „leer“ oder „0“. Vergleiche mit NULL ergeben weder wahr noch falsch, sondern **unbekannt** – und \`WHERE\` behält nur wahre Zeilen.

\`\`\`sql
SELECT name FROM kunden WHERE email = NULL;      -- liefert NICHTS (immer unbekannt)
SELECT name FROM kunden WHERE email IS NULL;     -- richtig: Ken Thompson
SELECT name, COALESCE(email, '(keine E-Mail)') AS kontakt FROM kunden;
SELECT COUNT(*), COUNT(email) FROM kunden;       -- 12 und 11: COUNT(spalte) ignoriert NULL
\`\`\`

## Daten ändern: Upsert und Transaktionen

\`\`\`sql title="Einfügen oder aktualisieren (SQLite und PostgreSQL)"
INSERT INTO produkte (id, name, kategorie, preis, lagerbestand)
VALUES (4, 'USB-C-Hub', 'Technik', 39.99, 20)
ON CONFLICT (id) DO UPDATE
  SET lagerbestand = produkte.lagerbestand + excluded.lagerbestand;   -- excluded = der abgelehnte neue Wert

SELECT * FROM produkte WHERE id = 4;
\`\`\`

MySQL nutzt stattdessen \`INSERT … ON DUPLICATE KEY UPDATE\`, der SQL-Standard \`MERGE\` (PostgreSQL ab 15, SQL Server, Oracle).

Mehrere zusammengehörige Änderungen gehören in eine [Transaktion](#/artikel/indizes-transaktionen) – entweder alle oder keine:

\`\`\`sql
BEGIN;
UPDATE produkte SET lagerbestand = lagerbestand - 1 WHERE id = 1 AND lagerbestand > 0;
INSERT INTO bestellungen (id, kunde_id, datum, status) VALUES (21, 4, '2026-11-05', 'offen');
INSERT INTO bestellpositionen (bestellung_id, produkt_id, menge, einzelpreis) VALUES (21, 1, 1, 89.90);
COMMIT;      -- oder ROLLBACK, wenn etwas schiefging
\`\`\`

## Ausführungspläne lesen

Warum ist eine Abfrage langsam? Der **Ausführungsplan** zeigt, wie die Datenbank sie abarbeiten will – ob ein [[Index]] genutzt wird oder die ganze Tabelle gelesen wird.

\`\`\`sql
EXPLAIN QUERY PLAN
SELECT * FROM bestellungen WHERE kunde_id = 3;
-- SEARCH bestellungen USING INDEX idx_bestellungen_kunde (kunde_id=?)

EXPLAIN QUERY PLAN
SELECT * FROM bestellungen WHERE status = 'offen';
-- SCAN bestellungen   ← kein Index auf status: vollständiger Tabellenscan
\`\`\`

In PostgreSQL zeigt \`EXPLAIN ANALYZE\` zusätzlich die **tatsächlichen** Laufzeiten und Zeilenzahlen. Warnsignale: \`Seq Scan\` auf großen Tabellen trotz selektiver Bedingung, stark abweichende geschätzte und tatsächliche Zeilenzahlen, \`Sort\` mit Auslagerung auf die Festplatte.

> [!TIP] Funktionen auf Indexspalten
> \`WHERE lower(email) = 'ada@example.org'\` oder \`WHERE strftime('%Y', datum) = '2026'\` können einen normalen Index auf der Spalte nicht nutzen. Besser: Bereichsbedingungen (\`datum >= '2026-01-01' AND datum < '2027-01-01'\`) oder ein Index auf dem Ausdruck.

## Übungen

1. Welche drei Produkte wurden (nach Menge) am häufigsten verkauft?
2. Welcher Kunde hat den höchsten durchschnittlichen Bestellwert?
3. Zeige für jeden Monat 2026 den Umsatz und die Veränderung zum Vormonat (Tipp: CTE + \`LAG\`).

Die automatisch geprüften Aufgaben findest du im [SQL-Labor](#/labor/sql).

\`\`\`widget
quiz:SQL 3
\`\`\`
`;export{e as default};
