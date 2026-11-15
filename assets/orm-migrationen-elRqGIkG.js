const e=`---
id: orm-migrationen
title: ORMs, das N+1-Problem & Datenbankmigrationen
area: datenbanken
difficulty: fortgeschritten
minutes: 15
order: 14
summary: Wie ORMs Tabellen auf Objekte abbilden, warum sie manchmal tausende Abfragen erzeugen, wie Migrationen Schemaänderungen versionieren und wie man ohne Downtime migriert.
tags: [ORM, Migration, SQLAlchemy, Prisma, N+1, Zero Downtime]
related: [sql-grundlagen, indizes-transaktionen, ci-cd, fastapi-tutorial]
---

## Was ist ein ORM?

Ein **[[ORM]]** (Object-Relational Mapper) übersetzt zwischen Tabellen und Objekten der Programmiersprache. Statt SQL-Strings schreibst du Code wie \`Kunde.objects.filter(stadt="Berlin")\`, und das ORM erzeugt das passende SQL.

| Sprache | Verbreitete ORMs |
|---|---|
| Python | SQLAlchemy, Django ORM, SQLModel |
| JavaScript/TypeScript | Prisma, Drizzle, TypeORM, Sequelize |
| Java/Kotlin | Hibernate/JPA, Exposed, jOOQ (SQL-Builder) |
| C# | Entity Framework Core, Dapper (Micro-ORM) |
| PHP | Eloquent (Laravel), Doctrine |
| Ruby | ActiveRecord (Rails) |

## Vorteile und Grenzen

**Vorteile:** weniger Boilerplate, Typsicherheit, Schutz vor [[SQL Injection]] (Parameter werden automatisch gebunden), datenbankunabhängiger Code, integrierte Migrationen.

**Grenzen:** Das ORM ist eine „undichte Abstraktion“ – wer nicht versteht, welches SQL entsteht, schreibt unbemerkt langsame Abfragen. Komplexe Auswertungen (Window Functions, CTEs) sind oft in reinem SQL klarer. Viele ORMs erlauben deshalb, bei Bedarf rohes, parametrisiertes SQL zu verwenden.

## Das N+1-Problem

Das häufigste ORM-Performanceproblem:

\`\`\`python title="SQLAlchemy: N+1 Abfragen"
bestellungen = session.scalars(select(Bestellung).limit(100)).all()   # 1 Abfrage
for b in bestellungen:
    print(b.kunde.name)       # pro Bestellung eine weitere Abfrage → 100 zusätzliche!
\`\`\`

Die Beziehung \`kunde\` wird **lazy** geladen – erst beim Zugriff, und zwar einzeln. Aus einer Seite mit 100 Bestellungen werden 101 Abfragen ([[N+1-Problem]]).

\`\`\`python title="Lösung: Eager Loading"
from sqlalchemy.orm import selectinload, joinedload

bestellungen = session.scalars(
    select(Bestellung).options(joinedload(Bestellung.kunde)).limit(100)
).all()                       # 1 Abfrage mit JOIN
\`\`\`

| ORM | Eager Loading |
|---|---|
| Django | \`select_related("kunde")\` (JOIN), \`prefetch_related("positionen")\` (2. Abfrage) |
| SQLAlchemy | \`joinedload\`, \`selectinload\` |
| Prisma | \`include: { kunde: true }\` |
| EF Core | \`.Include(b => b.Kunde)\` |
| ActiveRecord / Eloquent | \`.includes(:kunde)\` / \`with('kunde')\` |
| GraphQL-Resolver | DataLoader (Batching) |

> [!TIP] Sichtbar machen
> Aktiviere in der Entwicklung das SQL-Logging des ORMs (z. B. \`echo=True\` bei SQLAlchemy, Django Debug Toolbar) und schaue, wie viele Abfragen eine Seite auslöst.

## Migrationen

Das Datenbankschema entwickelt sich mit der Anwendung. Eine **[[Migration]]** ist eine versionierte Datei, die eine Schemaänderung beschreibt – im Repository gespeichert, reviewbar und in allen Umgebungen in derselben Reihenfolge ausgeführt.

\`\`\`python title="Alembic-Migration (SQLAlchemy)"
"""telefon zu kunden hinzufügen

Revision ID: 7c1f2a9b3d4e
Revises: 3a9e8d7c6b5a
"""
from alembic import op
import sqlalchemy as sa

revision = "7c1f2a9b3d4e"
down_revision = "3a9e8d7c6b5a"

def upgrade() -> None:
    op.add_column("kunden", sa.Column("telefon", sa.String(30), nullable=True))
    op.create_index("ix_kunden_telefon", "kunden", ["telefon"])

def downgrade() -> None:
    op.drop_index("ix_kunden_telefon", table_name="kunden")
    op.drop_column("kunden", "telefon")
\`\`\`

\`\`\`bash
alembic revision --autogenerate -m "telefon zu kunden"   # aus Model-Änderungen erzeugen (prüfen!)
alembic upgrade head                                      # anwenden
\`\`\`

Entsprechungen: \`prisma migrate dev\`, \`python manage.py makemigrations && migrate\`, \`dotnet ef migrations add\`, \`php artisan migrate\`, Flyway/Liquibase für Java.

## Migrationen ohne Downtime: Expand & Contract

Bei einem Rolling Update laufen alte und neue Version der App **gleichzeitig** gegen dieselbe Datenbank. Eine Migration darf die alte Version daher nicht brechen. Beispiel: Spalte \`name\` in \`vorname\` und \`nachname\` aufteilen.

1. **Expand:** Neue Spalten hinzufügen (nullable). Alte Version ignoriert sie.
2. **Doppelt schreiben:** Neue App-Version schreibt in alte *und* neue Spalten.
3. **Backfill:** Bestehende Daten in Batches migrieren.
4. **Umstellen:** App liest nur noch die neuen Spalten.
5. **Contract:** Alte Spalte in einem späteren Release entfernen.

> [!WARNING] Gefährliche Operationen
> Spalten umbenennen oder löschen, \`NOT NULL\` ohne Default auf großen Tabellen hinzufügen oder Indizes ohne \`CONCURRENTLY\` (PostgreSQL) anlegen kann Tabellen lange sperren oder laufende Versionen brechen. Große Datenmigrationen in Batches ausführen.

## Best Practices

- Migrationen **nie nachträglich ändern**, wenn sie schon irgendwo gelaufen sind – stattdessen eine neue Migration.
- Automatisch generierte Migrationen immer lesen.
- Migrationen in CI gegen eine Testdatenbank ausführen.
- [[Backup]] vor riskanten Migrationen in Produktion.
- Das ORM für 90 % der Fälle nutzen, für komplexe Auswertungen gezielt SQL schreiben.

## Wie geht es weiter?

Wende das im [FastAPI-Tutorial](#/artikel/fastapi-tutorial) an und rolle Migrationen automatisiert per [CI/CD](#/artikel/ci-cd) aus.
`;export{e as default};
