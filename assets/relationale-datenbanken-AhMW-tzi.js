const e=`---
id: relationale-datenbanken
title: Relationale Datenbanken & Datenmodellierung
area: datenbanken
difficulty: einsteiger
minutes: 16
order: 10
summary: Tabellen, Primär- und Fremdschlüssel, Beziehungen (1:1, 1:n, n:m), Normalisierung und wie man von einer fachlichen Anforderung zu einem sauberen Schema kommt.
tags: [Datenbanken, SQL, Normalisierung, ER-Modell, Schema]
related: [sql-grundlagen, indizes-transaktionen, nosql, orm-migrationen, datenmodellierung-normalisierung]
---

## Was ist eine relationale Datenbank?

Eine [[Relationale Datenbank]] speichert Daten in **[[Tabelle|Tabellen]]** (Relationen) aus Zeilen und Spalten. Jede Spalte hat einen Datentyp, jede Zeile ist ein Datensatz. Tabellen werden über **Schlüssel** miteinander verknüpft. Abgefragt wird mit [[SQL]]. Das Modell stammt von Edgar F. Codd (1970) und ist bis heute die Grundlage der meisten Geschäftsanwendungen – PostgreSQL, MySQL, SQLite, SQL Server, Oracle.

> [!BEGINNER]
> Wie mehrere ordentlich geführte Excel-Tabellen – aber mit strengen Regeln: Jede Spalte hat einen festen Typ, jede Zeile eine eindeutige Nummer, und Verweise zwischen Tabellen müssen gültig sein.

## Schlüssel

- **[[Primary Key]] (Primärschlüssel):** identifiziert jede Zeile eindeutig. Meist eine automatisch vergebene Zahl oder eine UUID.
- **[[Foreign Key]] (Fremdschlüssel):** verweist auf den Primärschlüssel einer anderen Tabelle und stellt so eine Beziehung her. Die Datenbank garantiert, dass der Verweis gültig ist (**referenzielle Integrität**).

## Beziehungen

| Kardinalität | Beispiel | Umsetzung |
|---|---|---|
| **1:1** | Nutzer – Profil | Fremdschlüssel mit \`UNIQUE\` (oder gleiche Tabelle) |
| **1:n** | Kunde – Bestellungen | Fremdschlüssel auf der „n“-Seite (\`bestellungen.kunde_id\`) |
| **n:m** | Bestellungen – Produkte | Zwischentabelle (\`bestellpositionen\`) mit zwei Fremdschlüsseln |

Unser Beispielshop aus dem [SQL-Labor](#/labor/sql) als [[Datenmodellierung|ER-Diagramm]]:

\`\`\`widget
er
\`\`\`

\`\`\`sql title="Das Schema in SQL"
CREATE TABLE kunden (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT UNIQUE,
  stadt       TEXT,
  registriert DATE NOT NULL
);

CREATE TABLE bestellungen (
  id       INTEGER PRIMARY KEY,
  kunde_id INTEGER NOT NULL REFERENCES kunden(id),
  datum    DATE NOT NULL,
  status   TEXT NOT NULL CHECK (status IN ('offen', 'bezahlt', 'versendet', 'storniert'))
);

CREATE TABLE produkte (
  id    INTEGER PRIMARY KEY,
  name  TEXT NOT NULL,
  preis NUMERIC(10, 2) NOT NULL CHECK (preis >= 0)
);

-- n:m zwischen Bestellungen und Produkten
CREATE TABLE bestellpositionen (
  id            INTEGER PRIMARY KEY,
  bestellung_id INTEGER NOT NULL REFERENCES bestellungen(id) ON DELETE CASCADE,
  produkt_id    INTEGER NOT NULL REFERENCES produkte(id),
  menge         INTEGER NOT NULL CHECK (menge > 0),
  einzelpreis   NUMERIC(10, 2) NOT NULL
);
\`\`\`

> [!TIP] Warum \`einzelpreis\` in der Position?
> Der Produktpreis ändert sich mit der Zeit. Die Bestellung muss aber den Preis **zum Kaufzeitpunkt** festhalten. Das ist keine Redundanz, sondern fachlich notwendige Information.

## Constraints: Regeln in der Datenbank

[[Constraint|Constraints]] sorgen dafür, dass ungültige Daten gar nicht erst entstehen – egal, welche Anwendung oder welches Skript schreibt:

| Constraint | Wirkung |
|---|---|
| \`PRIMARY KEY\` | eindeutig und nicht NULL |
| \`FOREIGN KEY … REFERENCES\` | Verweis muss existieren |
| \`UNIQUE\` | keine Duplikate (z. B. E-Mail) |
| \`NOT NULL\` | Pflichtfeld |
| \`CHECK (…)\` | beliebige Bedingung (\`preis >= 0\`) |
| \`DEFAULT\` | Standardwert |

\`ON DELETE CASCADE\` löscht abhängige Zeilen mit, \`RESTRICT\` verhindert das Löschen, \`SET NULL\` setzt den Verweis auf NULL.

## Normalisierung

[[Normalisierung]] heißt, Redundanz so zu vermeiden, dass jede Information an genau **einer** Stelle steht. Sonst drohen **Anomalien**: Ändert ein Kunde seine E-Mail und sie steht in 50 Bestellzeilen, muss man 50 Stellen ändern – und vergisst garantiert eine.

**Unnormalisiert:**

| bestellung | kunde | kunde_email | produkte |
|---|---|---|---|
| 1 | Ada | ada@example.org | Tastatur, Notizbuch ×3 |
| 3 | Ada | ada@example.org | Monitor, Maus |

Probleme: Mehrere Werte in einer Zelle, Kundendaten doppelt.

- **1. Normalform:** Nur atomare Werte – keine Listen in Zellen. → Positionen in eigene Zeilen.
- **2. Normalform:** Jedes Nicht-Schlüssel-Attribut hängt vom **ganzen** Schlüssel ab. → Produktname gehört zum Produkt, nicht zur Position.
- **3. Normalform:** Keine Abhängigkeiten zwischen Nicht-Schlüssel-Attributen. → Kunden-E-Mail gehört in die Kundentabelle, nicht in die Bestellung.

Das Ergebnis ist genau das Schema oben.

> [!EXPERT] Gezielte Denormalisierung
> Für leselastige Auswertungen kann es sinnvoll sein, bewusst Redundanz einzuführen (z. B. eine vorab berechnete \`bestellsumme\`). Das ist eine Performance-Entscheidung mit Preis: Du musst die Konsistenz selbst sicherstellen (Trigger, Transaktionen, materialisierte Views).

## Vom Anwendungsfall zum Schema

1. **Substantive sammeln:** Kunde, Bestellung, Produkt, Adresse, Zahlung → Kandidaten für Tabellen.
2. **Beziehungen klären:** Hat ein Kunde mehrere Adressen? Kann ein Produkt in mehreren Kategorien sein? (→ n:m)
3. **Attribute und Typen festlegen:** Geld als \`NUMERIC\`, nicht \`FLOAT\`; Zeitpunkte als \`TIMESTAMPTZ\`.
4. **Schlüssel und Constraints definieren.**
5. **Abfragen durchspielen:** Lassen sich die wichtigsten Fragen einfach beantworten? Wo braucht es [Indizes](#/artikel/indizes-transaktionen)?

## Typische Fehler

> [!MISTAKE] Kommagetrennte Listen in einer Spalte
> \`tags = 'neu,angebot,technik'\` lässt sich weder effizient durchsuchen noch per Fremdschlüssel absichern. Verwende eine Zwischentabelle (oder, in PostgreSQL bewusst, einen Array-Typ).

> [!MISTAKE] \`FLOAT\` für Geld
> Gleitkommazahlen runden binär ([[Float]]). Für Beträge \`NUMERIC/DECIMAL\` oder Cent-Ganzzahlen verwenden.

> [!MISTAKE] Keine Fremdschlüssel „aus Performancegründen“
> Ohne Fremdschlüssel entstehen verwaiste Datensätze, die niemand bemerkt. Die Prüfung kostet meist sehr wenig – mit einem Index auf der Fremdschlüsselspalte.

## Wie geht es weiter?

Übe Abfragen auf genau diesem Schema in den [SQL-Grundlagen](#/artikel/sql-grundlagen) und im [SQL-Labor](#/labor/sql).
`;export{e as default};
