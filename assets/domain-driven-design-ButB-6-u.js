const e=`---
id: domain-driven-design
title: Domain-Driven Design & Hexagonale Architektur
area: architektur
difficulty: profi
minutes: 20
order: 14
summary: Software nach der Fachlichkeit strukturieren – gemeinsame Sprache, Bounded Contexts, Entitäten und Value Objects, Aggregate mit Invarianten, Domain Events und Ports & Adapters, damit Geschäftslogik unabhängig von Frameworks und Datenbanken bleibt.
tags: [DDD, Domain-Driven Design, Bounded Context, Aggregat, Hexagonale Architektur, Clean Architecture]
related: [architekturstile, clean-code-solid, design-patterns, message-broker-events]
---

## Die Idee

Viele Projekte scheitern nicht an Technik, sondern daran, dass der Code die Fachlichkeit nicht widerspiegelt: Begriffe werden unterschiedlich verwendet, Geschäftsregeln sind über Controller, Datenbank-Trigger und Frontend verstreut. **[[Domain-Driven Design]]** (DDD, Eric Evans 2003) stellt die **Fachdomäne** in den Mittelpunkt – und gibt Werkzeuge an die Hand, um große Systeme sinnvoll zu schneiden.

DDD hat zwei Teile:
- **Strategisches Design:** Wie teilt man ein großes System in Bereiche auf?
- **Taktisches Design:** Wie modelliert man innerhalb eines Bereichs?

## Ubiquitous Language

Entwicklung und Fachabteilung verwenden **dieselben Begriffe** – in Gesprächen, Dokumentation, Tests und im Code. Wenn die Buchhaltung von „Gutschrift“ spricht, heißt die Klasse nicht \`NegativeInvoice\`.

> [!TIP]
> Führe ein Glossar der Fachbegriffe im Repository. Wenn ein Begriff im Gespräch unklar ist, ist er es im Code erst recht.

## Bounded Contexts

Derselbe Begriff bedeutet in verschiedenen Teilen eines Unternehmens Verschiedenes. Ein „Produkt“ im **Katalog** hat Beschreibung, Bilder und Kategorien; im **Lager** Lagerplatz und Bestand; in der **Buchhaltung** Steuersatz und Kostenstelle. Ein einziges Klasse \`Produkt\` mit allen Feldern wird zum unwartbaren Monstrum.

Ein **[[Bounded Context]]** ist ein abgegrenzter Bereich, in dem ein Modell und seine Sprache eindeutig gelten. Zwischen Contexts wird explizit übersetzt.

\`\`\`text
┌────────────── Katalog ──────────────┐      ┌────────────── Lager ───────────────┐
│ Produkt: Name, Beschreibung, Bilder │      │ Artikel: SKU, Lagerplatz, Bestand  │
│ Kategorie, Preis                    │ ───► │ Reservierung, Wareneingang         │
└─────────────────────────────────────┘ SKU  └────────────────────────────────────┘
                 │                                          │
                 │ ProduktVerkauft (Event)                  │ BestandNiedrig (Event)
                 ▼                                          ▼
┌──────────── Bestellung ─────────────┐      ┌────────────── Einkauf ─────────────┐
│ Bestellung, Position, Kunde         │      │ Lieferant, Nachbestellung          │
└─────────────────────────────────────┘      └────────────────────────────────────┘
\`\`\`

Bounded Contexts sind gute Kandidaten für Module eines **modularen Monolithen** oder – wenn nötig – für eigenständige Microservices. Eine **Context Map** dokumentiert, wie sie zusammenhängen (wer liefert, wer konsumiert, wo übersetzt eine *Anti-Corruption Layer* ein fremdes Modell).

### Subdomänen

| Art | Bedeutung | Strategie |
|---|---|---|
| **Core Domain** | Was das Unternehmen besonders macht (z. B. Preisberechnung eines Versicherers) | selbst entwickeln, beste Leute, sorgfältiges Modell |
| **Supporting** | notwendig, aber nicht differenzierend | einfach entwickeln |
| **Generic** | überall gleich (Login, E-Mail-Versand, Rechnungen) | kaufen, Standardlösungen nutzen |

## Taktische Bausteine

### Entitäten und Value Objects

- Eine **Entität** hat eine **Identität**, die über die Zeit gleich bleibt – auch wenn sich alle Attribute ändern (ein Kunde bleibt derselbe Kunde nach Umzug und Namensänderung).
- Ein **[[Value Object]]** ist durch seine **Werte** definiert, hat keine Identität und ist **unveränderlich**: Geldbetrag, Adresse, Zeitraum, E-Mail-Adresse.

\`\`\`typescript title="Value Object: Geld"
export class Geld {
  private constructor(readonly cent: number, readonly waehrung: 'EUR' | 'USD') {
    if (!Number.isInteger(cent)) throw new Error('Betrag muss in ganzen Cent angegeben werden');
  }
  static eur(betrag: number) { return new Geld(Math.round(betrag * 100), 'EUR'); }

  plus(anderes: Geld): Geld {
    if (anderes.waehrung !== this.waehrung) throw new Error('Unterschiedliche Währungen');
    return new Geld(this.cent + anderes.cent, this.waehrung);    // neues Objekt statt Änderung
  }
  mal(faktor: number): Geld { return new Geld(Math.round(this.cent * faktor), this.waehrung); }
  equals(o: Geld) { return o.cent === this.cent && o.waehrung === this.waehrung; }
  toString() { return \`\${(this.cent / 100).toFixed(2)} \${this.waehrung}\`; }
}
\`\`\`

Value Objects beseitigen **Primitive Obsession**: Statt überall \`number\` für Geld (in welcher Währung? Euro oder Cent?) gibt es einen Typ, der seine Regeln selbst durchsetzt.

### Aggregate

Ein **[[Aggregat]]** ist eine Gruppe von Objekten, die als Einheit behandelt wird und deren **Invarianten** (Geschäftsregeln, die immer gelten müssen) gemeinsam geschützt werden. Zugriff von außen nur über die **Aggregatwurzel**.

\`\`\`typescript title="Aggregat Bestellung schützt seine Regeln"
type Status = 'entwurf' | 'aufgegeben' | 'storniert';

export class Bestellung {
  private positionen: { produktId: string; menge: number; einzelpreis: Geld }[] = [];
  private status: Status = 'entwurf';
  private ereignisse: object[] = [];

  constructor(readonly id: string, readonly kundeId: string) {}

  fuegeHinzu(produktId: string, menge: number, einzelpreis: Geld) {
    if (this.status !== 'entwurf') throw new Error('Nur Entwürfe können geändert werden');
    if (menge <= 0) throw new Error('Menge muss positiv sein');
    this.positionen.push({ produktId, menge, einzelpreis });
  }

  summe(): Geld {
    return this.positionen.reduce((s, p) => s.plus(p.einzelpreis.mal(p.menge)), Geld.eur(0));
  }

  aufgeben() {
    if (this.positionen.length === 0) throw new Error('Leere Bestellung kann nicht aufgegeben werden');
    this.status = 'aufgegeben';
    this.ereignisse.push({ typ: 'BestellungAufgegeben', bestellungId: this.id, summeCent: this.summe().cent });
  }

  entnehmeEreignisse() { const e = this.ereignisse; this.ereignisse = []; return e; }
}
\`\`\`

Regeln für Aggregate:
1. **Klein halten** – nur, was gemeinsam konsistent sein muss.
2. **Eine Transaktion ändert ein Aggregat.** Konsistenz zwischen Aggregaten wird über Domain Events und eventual consistency hergestellt.
3. Andere Aggregate nur **per ID** referenzieren (\`kundeId\`), nicht als Objekt.

### Domain Events, Repositories, Services

- **Domain Events** beschreiben fachlich relevante Vorgänge in der Vergangenheitsform: \`BestellungAufgegeben\`, \`ZahlungEingegangen\`. Andere Teile reagieren darauf – lose gekoppelt. Wie man sie zuverlässig veröffentlicht, zeigt das Outbox-Muster in [Message Broker & Events](#/artikel/message-broker-events).
- **Repositories** laden und speichern Aggregate und verbergen, *wie* das geschieht (\`bestellungen.finde(id)\`, \`bestellungen.speichere(b)\`).
- **Domain Services** enthalten Logik, die zu keinem einzelnen Objekt passt (z. B. Preisberechnung über mehrere Aggregate).

## Hexagonale Architektur (Ports & Adapters)

Die Fachlogik soll nicht wissen, ob Daten aus PostgreSQL oder einer Datei kommen und ob sie per REST oder Kommandozeile aufgerufen wird. Die **[[Hexagonale Architektur]]** (Alistair Cockburn) – verwandt mit *Onion* und *Clean Architecture* – ordnet den Code in Ringe: **Abhängigkeiten zeigen immer nach innen**.

\`\`\`text
            ┌───────────────────────────────────────────┐
  REST ───► │ Adapter (Controller)                      │
  CLI  ───► │    ┌─────────────────────────────────┐    │
            │    │ Anwendung (Use Cases)           │    │
            │    │    ┌───────────────────────┐    │    │
            │    │    │ Domäne                │    │    │
            │    │    │ Bestellung, Geld, …   │    │    │
            │    │    └───────────────────────┘    │    │
            │    │  Port: BestellRepository ◄──────┼────┼─── Adapter: PostgresBestellRepository
            │    │  Port: Zahlungsdienst    ◄──────┼────┼─── Adapter: StripeZahlung / FakeZahlung
            │    └─────────────────────────────────┘    │
            └───────────────────────────────────────────┘
\`\`\`

- **Ports** sind Schnittstellen, die die Anwendung definiert („ich brauche etwas, das Bestellungen speichert“).
- **Adapter** implementieren sie für eine konkrete Technik.

\`\`\`typescript title="Port und Use Case – ohne Framework- oder Datenbankabhängigkeit"
export interface BestellRepository {           // Port (gehört zur Anwendung)
  finde(id: string): Promise<Bestellung | null>;
  speichere(b: Bestellung): Promise<void>;
}

export class BestellungAufgeben {               // Use Case
  constructor(private repo: BestellRepository, private veroeffentliche: (e: object) => Promise<void>) {}

  async ausfuehren(bestellungId: string) {
    const b = await this.repo.finde(bestellungId);
    if (!b) throw new Error('Bestellung nicht gefunden');
    b.aufgeben();                                // Geschäftsregel steckt im Aggregat
    await this.repo.speichere(b);
    for (const e of b.entnehmeEreignisse()) await this.veroeffentliche(e);
  }
}
\`\`\`

Der Gewinn: Die Fachlogik lässt sich mit einem **In-Memory-Repository** in Millisekunden [testen](#/artikel/testing), Frameworks und Datenbanken lassen sich austauschen, und der Code liest sich wie die Fachlichkeit. Das ist das **Dependency Inversion Principle** aus [SOLID](#/artikel/clean-code-solid) auf Architekturebene.

## Wann lohnt sich DDD?

> [!WARNING] Nicht für jedes Projekt
> Für eine einfache CRUD-Anwendung (Formulare rein, Daten raus) ist taktisches DDD mit Aggregaten, Repositories und Events Überengineering. Es lohnt sich bei **komplexer, sich ändernder Fachlogik** und großen Systemen mit mehreren Teams. Strategisches Design – gemeinsame Sprache und klare Grenzen – hilft dagegen fast immer.

## Wie geht es weiter?

Bounded Contexts sind die natürliche Grundlage für Modulgrenzen – mehr dazu in [Architekturstile](#/artikel/architekturstile). Wie Contexts über Ereignisse kommunizieren, zeigt [Message Broker & Events](#/artikel/message-broker-events).

\`\`\`widget
quiz:Architektur 3
\`\`\`
`;export{e as default};
