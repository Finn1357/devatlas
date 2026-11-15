const e=`---
id: datenmodellierung-normalisierung
title: Datenmodellierung & Normalisierung
area: datenbanken
difficulty: fortgeschritten
minutes: 19
order: 14
summary: Vom fachlichen Modell zum Schema – Entitäten, Beziehungen, Schlüssel, die Normalformen an einem durchgehenden Beispiel, passende Datentypen und Constraints sowie bewusste Denormalisierung.
tags: [Datenmodellierung, Normalisierung, ER-Modell, Primärschlüssel, Fremdschlüssel, Constraints]
related: [relationale-datenbanken, sql-fortgeschritten, orm-migrationen, indizes-transaktionen]
---

## Warum Modellierung so wichtig ist

Code lässt sich refaktorieren – ein Datenmodell mit Millionen Datensätzen und vielen abhängigen Anwendungen nur mühsam. Ein gutes Schema verhindert widersprüchliche Daten **durch seine Struktur**, statt sich auf die Disziplin jeder Anwendung zu verlassen.

## Entitäten, Attribute, Beziehungen

1. **Entitäten** finden: die „Dinge“ der Fachlichkeit – Kunde, Produkt, Bestellung.
2. **Attribute** bestimmen: Eigenschaften – Name, Preis, Datum.
3. **Beziehungen** und ihre **Kardinalität** klären: Wie viele von A gehören zu einem B?

| Kardinalität | Beispiel | Umsetzung |
|---|---|---|
| **1:1** | Nutzer – Profil | Fremdschlüssel mit \`UNIQUE\` (oder dieselbe Tabelle) |
| **1:n** | Kunde – Bestellungen | Fremdschlüssel auf der n-Seite (\`bestellungen.kunde_id\`) |
| **n:m** | Bestellung – Produkte | Zwischentabelle (\`bestellpositionen\`) mit zwei Fremdschlüsseln |

Das [[ER-Modell|Entity-Relationship-Diagramm]] des Beispielshops – klicke auf eine Tabelle, um ihre Beziehungen hervorzuheben:

\`\`\`widget
er
\`\`\`

> [!TIP] Zwischentabellen tragen oft eigene Daten
> Die n:m-Beziehung zwischen Bestellung und Produkt hat eigene Attribute: Menge und **Einzelpreis zum Kaufzeitpunkt**. Den Preis aus \`produkte\` zu lesen wäre falsch – er ändert sich später, die Rechnung nicht.

## Schlüssel

- **[[Primärschlüssel]]:** identifiziert eine Zeile eindeutig und unveränderlich.
- **[[Fremdschlüssel]]:** verweist auf den Primärschlüssel einer anderen Tabelle und sichert die **referenzielle Integrität**.
- **Natürlicher Schlüssel** (E-Mail, ISBN, Steuernummer) vs. **Surrogatschlüssel** (künstliche ID ohne Bedeutung).

> [!WARNING] Natürliche Schlüssel ändern sich
> E-Mail-Adressen, Kennzeichen und sogar „unveränderliche“ Nummern ändern sich in der Realität. Verwende als Primärschlüssel einen Surrogatschlüssel und sichere natürliche Schlüssel zusätzlich mit \`UNIQUE\`.

| Surrogatschlüssel | Vorteile | Nachteile |
|---|---|---|
| Fortlaufende Ganzzahl (\`bigint\` / \`IDENTITY\`) | klein, schnell, gut für B-Baum-Indizes | erratbar (IDOR-Gefahr bei öffentlichen URLs), zentral vergeben |
| UUID v4 (zufällig) | überall erzeugbar, nicht erratbar | 16 Byte, zufällige Verteilung belastet Indizes |
| UUID v7 (zeitbasiert, RFC 9562) | überall erzeugbar, zeitlich sortiert – indexfreundlich | gibt den Erstellungszeitpunkt preis |

## Normalisierung an einem Beispiel

**[[Normalisierung]]** entfernt Redundanz, damit jede Information genau einmal gespeichert ist. Ausgangspunkt ist eine typische „Excel-Tabelle“:

| bestell_nr | datum | kunde | kunde_stadt | produkte |
|---|---|---|---|---|
| 1 | 2026-01-05 | Ada Lovelace | Berlin | Tastatur (1× 89,90), Maus (2× 24,50) |
| 2 | 2026-01-11 | Alan Turing | Hamburg | Monitor (1× 329,00) |
| 3 | 2026-02-02 | Ada Lovelace | Berlin | Maus (1× 24,50) |

Probleme (**Anomalien**):
- **Änderungsanomalie:** Zieht Ada um, muss die Stadt in jeder ihrer Bestellungen geändert werden – vergisst man eine, widersprechen sich die Daten.
- **Einfügeanomalie:** Ein neuer Kunde ohne Bestellung lässt sich nicht speichern.
- **Löschanomalie:** Löscht man Alans einzige Bestellung, verschwindet Alan komplett.

### 1. Normalform: atomare Werte

Jede Zelle enthält **einen** Wert, keine Listen. Die Spalte \`produkte\` wird in eigene Zeilen aufgeteilt:

| bestell_nr | datum | kunde | kunde_stadt | produkt | menge | preis |
|---|---|---|---|---|---|---|
| 1 | 2026-01-05 | Ada Lovelace | Berlin | Tastatur | 1 | 89,90 |
| 1 | 2026-01-05 | Ada Lovelace | Berlin | Maus | 2 | 24,50 |

### 2. Normalform: keine Teilabhängigkeiten

Der Schlüssel ist jetzt (bestell_nr, produkt). Aber \`datum\` und \`kunde\` hängen nur von \`bestell_nr\` ab – nur von einem **Teil** des Schlüssels. Also: Bestelldaten in eine eigene Tabelle.

\`\`\`text
bestellungen(bestell_nr, datum, kunde, kunde_stadt)
bestellpositionen(bestell_nr, produkt, menge, preis)
\`\`\`

### 3. Normalform: keine transitiven Abhängigkeiten

\`kunde_stadt\` hängt nicht von der Bestellung ab, sondern vom **Kunden** (bestell_nr → kunde → stadt). Kunden bekommen eine eigene Tabelle – und Produkte ebenso:

\`\`\`sql title="Das normalisierte Schema (PostgreSQL)" norun
CREATE TABLE kunden (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT UNIQUE,
  stadt       TEXT
);

CREATE TABLE produkte (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT NOT NULL,
  preis_cent  INTEGER NOT NULL CHECK (preis_cent >= 0)
);

CREATE TABLE bestellungen (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kunde_id    BIGINT NOT NULL REFERENCES kunden(id) ON DELETE RESTRICT,
  erstellt_am TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE bestellpositionen (
  bestellung_id BIGINT NOT NULL REFERENCES bestellungen(id) ON DELETE CASCADE,
  produkt_id    BIGINT NOT NULL REFERENCES produkte(id),
  menge         INTEGER NOT NULL CHECK (menge > 0),
  einzelpreis_cent INTEGER NOT NULL,          -- Preis zum Kaufzeitpunkt
  PRIMARY KEY (bestellung_id, produkt_id)
);
CREATE INDEX ON bestellungen (kunde_id);        -- Fremdschlüssel indizieren!
\`\`\`

(PostgreSQL-Syntax; \`GENERATED ALWAYS AS IDENTITY\` ist der SQL-Standard für automatische IDs.)

> [!BEGINNER] Merksatz
> Jedes Nicht-Schlüssel-Attribut hängt ab „vom Schlüssel (1NF), vom ganzen Schlüssel (2NF) und von nichts als dem Schlüssel (3NF)“.

Die **Boyce-Codd-Normalform (BCNF)** verschärft die 3NF für Sonderfälle mit mehreren überlappenden Schlüsselkandidaten. In der Praxis ist ein Schema in 3NF meist ausreichend.

## Datentypen bewusst wählen

| Daten | Empfehlung | Vermeiden |
|---|---|---|
| Geldbeträge | \`NUMERIC(12,2)\` oder Ganzzahl in Cent | \`FLOAT\`/\`REAL\` – Rundungsfehler (0,1 + 0,2 ≠ 0,3) |
| Zeitpunkte | \`TIMESTAMPTZ\` (PostgreSQL), in UTC speichern | Zeit als Text, Zeitstempel ohne Zeitzone für Ereignisse |
| Kalenderdaten (Geburtstag) | \`DATE\` | Zeitstempel |
| Status mit festen Werten | \`TEXT\` + \`CHECK\`, Enum-Typ oder Referenztabelle | freie Texte ohne Prüfung |
| Wahrheitswerte | \`BOOLEAN\` | \`'J'/'N'\`-Strings |
| Flexible Zusatzdaten | \`JSONB\` (PostgreSQL) – für wirklich variable Felder | JSON für Daten, die man filtert und verknüpft |

## Constraints: Die Datenbank als letzte Verteidigungslinie

\`\`\`sql norun
ALTER TABLE produkte ADD CONSTRAINT preis_positiv CHECK (preis_cent > 0);
ALTER TABLE kunden ALTER COLUMN name SET NOT NULL;
ALTER TABLE kunden ADD CONSTRAINT email_eindeutig UNIQUE (email);
\`\`\`

\`NOT NULL\`, \`UNIQUE\`, \`CHECK\` und Fremdschlüssel gelten für **jede** Anwendung, jedes Skript und jeden manuellen Eingriff – Validierung im Code allein kann umgangen werden oder Race Conditions haben (zwei gleichzeitige Registrierungen mit derselben E-Mail).

| \`ON DELETE\` | Wirkung beim Löschen des referenzierten Datensatzes |
|---|---|
| \`RESTRICT\` / \`NO ACTION\` (Standard) | Löschen wird verhindert, solange Verweise existieren |
| \`CASCADE\` | abhängige Zeilen werden mitgelöscht (z. B. Positionen einer Bestellung) |
| \`SET NULL\` | Fremdschlüssel wird auf NULL gesetzt |

## Bewusste Denormalisierung

Normalisierung optimiert für **Korrektheit beim Schreiben**. Für Lesezugriffe kann gezielte Redundanz sinnvoll sein:

- **Berechnete Summen** (z. B. \`bestellungen.gesamtbetrag\`), wenn sie ständig gebraucht werden – per Trigger oder in derselben Transaktion gepflegt.
- **Materialized Views** für teure Auswertungen, regelmäßig aktualisiert.
- **Data Warehouses** nutzen bewusst denormalisierte Sternschemata für Analysen.
- **Dokumentdatenbanken** speichern oft zusammen, was zusammen gelesen wird – siehe [NoSQL](#/artikel/nosql).

> [!EXPERT] Erst messen
> Denormalisieren ist eine Optimierung mit Preis: Jede Kopie muss synchron gehalten werden. Erst normalisiert modellieren, mit [Indizes](#/artikel/indizes-transaktionen) optimieren – und nur dort denormalisieren, wo Messungen es rechtfertigen.

## Weitere Muster

- **Audit-Spalten:** \`erstellt_am\`, \`geaendert_am\`, ggf. \`erstellt_von\`.
- **Soft Delete:** \`geloescht_am\` statt \`DELETE\` – erhält Historie, verlangt aber, dass jede Abfrage filtert (und kollidiert mit \`UNIQUE\`). Für personenbezogene Daten beachten: Die DSGVO verlangt echtes Löschen, wenn kein Grund zur Aufbewahrung besteht.
- **Historisierung:** Gültigkeitszeiträume (\`gueltig_von\`, \`gueltig_bis\`) für Preise oder Verträge.
- **Benennung:** einheitlich (z. B. Plural für Tabellen, \`snake_case\`, Fremdschlüssel \`<tabelle>_id\`).

## Wie geht es weiter?

Wie Schemaänderungen kontrolliert ausgerollt werden, zeigt [ORMs & Migrationen](#/artikel/orm-migrationen). Abfragen über das Schema übst du in [SQL für Fortgeschrittene](#/artikel/sql-fortgeschritten).

\`\`\`widget
quiz:Datenbanken 3
\`\`\`
`;export{e as default};
