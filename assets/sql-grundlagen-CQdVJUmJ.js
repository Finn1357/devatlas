const e=`---
id: sql-grundlagen
title: SQL-Grundlagen: Abfragen, Joins & Aggregation
area: datenbanken
difficulty: einsteiger
minutes: 20
order: 11
summary: SELECT, WHERE, ORDER BY, JOINs, GROUP BY und HAVING, Unterabfragen, CTEs und Window Functions – Schritt für Schritt am Beispiel eines Online-Shops, direkt im Browser ausprobierbar.
tags: [SQL, SELECT, JOIN, GROUP BY, Window Functions]
related: [relationale-datenbanken, indizes-transaktionen, orm-migrationen, sql-fortgeschritten, datenmodellierung-normalisierung]
---

## So arbeitest du mit diesem Artikel

Alle Beispiele laufen gegen die Beispieldatenbank im **[SQL-Labor](#/labor/sql)** (Kunden, Produkte, Bestellungen, Bestellpositionen). Klicke bei einem Codeblock auf „Ausführen“, um ihn direkt dort zu starten. Das Schema siehst du im Artikel [Relationale Datenbanken](#/artikel/relationale-datenbanken).

## Daten abfragen: SELECT

\`\`\`sql
SELECT name, stadt
FROM kunden;
\`\`\`

- \`SELECT\` legt fest, **welche Spalten** du siehst (\`*\` = alle – in Anwendungscode besser explizit).
- \`FROM\` legt fest, **aus welcher Tabelle**.

## Filtern: WHERE

\`\`\`sql
SELECT name, kategorie, preis
FROM produkte
WHERE kategorie = 'Technik'
  AND preis < 100
ORDER BY preis DESC;
\`\`\`

| Operator | Beispiel |
|---|---|
| Vergleich | \`=\`, \`<>\`, \`<\`, \`>=\` |
| Bereich | \`preis BETWEEN 10 AND 50\` |
| Liste | \`stadt IN ('Berlin', 'Köln')\` |
| Muster | \`name LIKE 'A%'\` (\`%\` beliebig viele, \`_\` ein Zeichen) |
| NULL | \`email IS NULL\` / \`IS NOT NULL\` |
| Logik | \`AND\`, \`OR\`, \`NOT\` (Klammern setzen!) |

> [!MISTAKE] \`= NULL\`
> \`WHERE email = NULL\` liefert **nie** Zeilen. NULL bedeutet „unbekannt“, jeder Vergleich damit ergibt UNKNOWN. Richtig: \`IS NULL\`.

## Sortieren und Begrenzen

\`\`\`sql
SELECT name, registriert
FROM kunden
ORDER BY registriert DESC, name
LIMIT 5;
\`\`\`

Ohne \`ORDER BY\` ist die Reihenfolge **nicht garantiert** – auch wenn sie zufällig stabil wirkt.

## Joins: Tabellen verbinden

\`\`\`sql
SELECT b.id AS bestellung, k.name, b.datum, b.status
FROM bestellungen AS b
JOIN kunden AS k ON k.id = b.kunde_id
ORDER BY b.datum;
\`\`\`

| Join | Ergebnis |
|---|---|
| \`INNER JOIN\` (\`JOIN\`) | nur Zeilen mit Treffer auf beiden Seiten |
| \`LEFT JOIN\` | alle Zeilen links, rechts NULL wenn kein Treffer |
| \`RIGHT JOIN\` | Spiegelbild von LEFT |
| \`FULL OUTER JOIN\` | alle Zeilen beider Seiten |
| \`CROSS JOIN\` | jede Kombination (kartesisches Produkt) |

\`\`\`sql title="Kunden ohne Bestellung (Anti-Join)"
SELECT k.name
FROM kunden k
LEFT JOIN bestellungen b ON b.kunde_id = k.id
WHERE b.id IS NULL;
\`\`\`

### JOIN-Typen im Vergleich

Welche Zeilen landen bei welchem JOIN im Ergebnis? Wähle einen Typ und vergleiche Quelltabellen, Ergebnis und Mengenbild:

\`\`\`widget
joins
\`\`\`

## Aggregation: GROUP BY und HAVING

\`\`\`sql
SELECT k.stadt,
       COUNT(*)                                  AS bestellungen,
       ROUND(SUM(bp.menge * bp.einzelpreis), 2)  AS umsatz
FROM bestellungen b
JOIN kunden k             ON k.id = b.kunde_id
JOIN bestellpositionen bp ON bp.bestellung_id = b.id
WHERE b.status <> 'storniert'
GROUP BY k.stadt
HAVING SUM(bp.menge * bp.einzelpreis) > 100
ORDER BY umsatz DESC;
\`\`\`

Aggregatfunktionen: \`COUNT\`, \`SUM\`, \`AVG\`, \`MIN\`, \`MAX\`. Jede Spalte im \`SELECT\` muss entweder in \`GROUP BY\` stehen oder aggregiert werden.

- **\`WHERE\`** filtert **Zeilen vor** der Gruppierung.
- **\`HAVING\`** filtert **Gruppen nach** der Aggregation.

Fahre über die Klauseln, um die logische Auswertungsreihenfolge zu verstehen:

\`\`\`widget
annotated:sql-report
\`\`\`

> [!EXPERT] Logische Reihenfolge
> SQL wird nicht in Schreibreihenfolge ausgewertet, sondern: \`FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT\`. Deshalb kannst du einen \`SELECT\`-Alias in \`ORDER BY\` verwenden, aber nicht in \`WHERE\`.

## Unterabfragen und CTEs

\`\`\`sql title="Produkte über dem Durchschnittspreis"
SELECT name, preis
FROM produkte
WHERE preis > (SELECT AVG(preis) FROM produkte);
\`\`\`

Eine **CTE** (\`WITH\`) benennt ein Zwischenergebnis – das macht komplexe Abfragen lesbar:

\`\`\`sql
WITH umsatz_pro_kunde AS (
  SELECT b.kunde_id, SUM(bp.menge * bp.einzelpreis) AS umsatz
  FROM bestellungen b
  JOIN bestellpositionen bp ON bp.bestellung_id = b.id
  WHERE b.status <> 'storniert'
  GROUP BY b.kunde_id
)
SELECT k.name, ROUND(u.umsatz, 2) AS umsatz
FROM umsatz_pro_kunde u
JOIN kunden k ON k.id = u.kunde_id
ORDER BY u.umsatz DESC
LIMIT 3;
\`\`\`

## Window Functions

Window Functions rechnen über eine Gruppe von Zeilen, **ohne sie zusammenzufassen** – jede Zeile bleibt erhalten.

\`\`\`sql title="Rang je Stadt und laufende Summe"
SELECT k.name, k.stadt, b.datum,
       RANK()  OVER (PARTITION BY k.stadt ORDER BY b.datum)          AS nr_in_stadt,
       COUNT(*) OVER (ORDER BY b.datum ROWS UNBOUNDED PRECEDING)      AS bestellungen_bisher
FROM bestellungen b
JOIN kunden k ON k.id = b.kunde_id
ORDER BY b.datum;
\`\`\`

Weitere nützliche Funktionen: \`ROW_NUMBER()\`, \`LAG()\`/\`LEAD()\` (vorherige/nächste Zeile), \`SUM(...) OVER (...)\`.

## Daten ändern

\`\`\`sql
INSERT INTO produkte (name, kategorie, preis, lagerbestand)
VALUES ('Webcam', 'Technik', 59.90, 20);

UPDATE produkte
SET preis = preis * 0.9
WHERE kategorie = 'Buch';

DELETE FROM bestellungen
WHERE status = 'storniert' AND datum < '2026-01-01';
\`\`\`

> [!DANGER] UPDATE und DELETE ohne WHERE
> Ein vergessenes \`WHERE\` betrifft **jede Zeile** der Tabelle. Arbeite in einer Transaktion (\`BEGIN; … ROLLBACK;\` zum Testen) und führe vorher ein \`SELECT\` mit derselben Bedingung aus.

## SQL aus Programmen

Werte kommen **immer** als Parameter in die Abfrage, nie per String-Verkettung – sonst droht [[SQL Injection]]. Wie das in 10 Sprachen aussieht, zeigt die [Syntax-Bibliothek](#/syntax/datenbank).

## Wie geht es weiter?

Löse die [Aufgaben im SQL-Labor](#/labor/sql) und lerne, warum manche Abfragen langsam sind, in [Indizes & Transaktionen](#/artikel/indizes-transaktionen). Kurzreferenz: [SQL-Cheatsheet](#/cheatsheets/sql).

\`\`\`widget
quiz:SQL 3
\`\`\`
`;export{e as default};
