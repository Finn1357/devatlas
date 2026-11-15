const e=`---
id: architekturstile
title: Architekturstile: Monolith, Microservices, Event-Driven, Hexagonal & Clean Architecture
area: architektur
difficulty: profi
minutes: 22
order: 12
summary: Wie man Systeme strukturiert – von Schichten und MVC über den modularen Monolithen bis zu Microservices und ereignisgesteuerten Architekturen – und wie man begründet zwischen ihnen entscheidet.
tags: [Architektur, Microservices, Monolith, DDD, Hexagonal, Clean Architecture, MVC]
related: [clean-code-solid, design-patterns, api-stile, caching-queues, system-design, domain-driven-design]
---

## Was ist Software-Architektur?

[[Software-Architektur]] umfasst die grundlegenden Entscheidungen über die Struktur eines Systems – die, die **später teuer zu ändern** sind: Wie wird das System in Bausteine zerlegt? Wie kommunizieren sie? Wo liegen die Daten? Gute Architektur ermöglicht es, die wichtigsten Qualitätsziele zu erreichen (Änderbarkeit, Skalierbarkeit, Verfügbarkeit, Sicherheit, Kosten) – und zwar für **dieses** Team und **diesen** Kontext.

> [!TIP] Architekturentscheidungen dokumentieren
> Halte wichtige Entscheidungen in kurzen **Architecture Decision Records (ADRs)** fest: Kontext, Entscheidung, Alternativen, Konsequenzen. In zwei Jahren weiß sonst niemand mehr, *warum* etwas so ist.

## Schichten und MVC

Die klassische **[[Schichtenarchitektur]]** trennt Präsentation, Geschäftslogik und Datenzugriff. Jede Schicht spricht nur mit der darunter. Webframeworks setzen das meist als **[[MVC]]** um:

| Teil | Aufgabe | Beispiel |
|---|---|---|
| **Model** | Daten und Geschäftsregeln | \`Bestellung\`, \`Produkt\` |
| **View** | Darstellung | Template, JSON-Ausgabe, React-Komponente |
| **Controller** | nimmt Anfragen an, koordiniert | \`BestellController.anlegen()\` |

Verwandt ist **[[MVVM]]** (Model-View-ViewModel) in UI-Frameworks mit Data Binding.

## Der Monolith

Ein [[Monolith]] wird als **eine Einheit** gebaut, getestet und deployt. Das ist kein Schimpfwort: Für die meisten Projekte ist er der richtige Start.

**Vorteile:** einfache Entwicklung und Fehlersuche, Transaktionen über alle Daten, ein Deployment, keine Netzwerklatenz zwischen Modulen. **Nachteile bei Wachstum:** lange Builds, Teams behindern sich gegenseitig, alles skaliert nur gemeinsam, Gefahr eines „Big Ball of Mud“.

### Der modulare Monolith

Ein **modularer Monolith** hat klare interne Grenzen: Module mit eigener Verantwortung, eigenen Tabellen und expliziten Schnittstellen – aber ein gemeinsames Deployment. Er vereint viele Vorteile beider Welten und lässt sich später gezielt in Services zerlegen, falls nötig.

\`\`\`text
src/
├── bestellung/      # öffentliche API: BestellService; intern: Repository, Regeln
├── katalog/
├── zahlung/
├── versand/
└── gemeinsam/       # nur wirklich generische Bausteine
\`\`\`

Regeln: Module greifen nur über öffentliche Schnittstellen aufeinander zu (nicht auf fremde Tabellen!), Abhängigkeiten sind gerichtet, Grenzen werden mit Architekturtests (z. B. ArchUnit, dependency-cruiser) automatisch geprüft.

## Microservices

Bei [[Microservices]] besteht das System aus **kleinen, unabhängig deploybaren Diensten**, die jeweils eine fachliche Fähigkeit verantworten und **ihre eigenen Daten besitzen**. Sie kommunizieren über das Netzwerk – synchron ([REST, gRPC](#/artikel/api-stile)) oder asynchron (Events).

| Vorteile | Kosten |
|---|---|
| Teams arbeiten und deployen unabhängig | Netzwerk ist unzuverlässig (Timeouts, Retries, [[Circuit Breaker]]) |
| Gezielte Skalierung einzelner Teile | Keine Transaktionen über Dienste hinweg (Sagas, [[Eventual Consistency]]) |
| Technologiefreiheit je Dienst | Betrieb: viele Deployments, [[Observability]], Service Discovery |
| Fehler bleiben eher lokal | Testen über Dienstgrenzen hinweg ist schwer |

> [!WARNING] Der verteilte Monolith
> Das häufigste Scheitern: Dienste, die sich eine Datenbank teilen, synchron in langen Ketten aufrufen oder nur gemeinsam deployt werden können. Man hat dann die Kosten verteilter Systeme ohne deren Vorteile. Microservices lösen vor allem **organisatorische** Skalierungsprobleme – bei einem Team von fünf Personen sind sie selten die richtige Wahl.

## Event-Driven Architecture

In einer [[Event-Driven Architecture]] veröffentlichen Komponenten **Ereignisse** über etwas, das passiert ist („BestellungAufgegeben“), und andere reagieren darauf – ohne dass der Sender die Empfänger kennt. Infrastruktur sind [[Message Queue|Message Broker]] wie Kafka oder RabbitMQ.

\`\`\`text
Bestellservice ──(BestellungAufgegeben)──▶ Broker ──▶ Zahlungsservice
                                                 ├──▶ Lagerservice
                                                 ├──▶ E-Mail-Service
                                                 └──▶ Analytics (später hinzugefügt, ohne Änderung am Bestellservice)
\`\`\`

**Stärken:** lose Kopplung, gute Erweiterbarkeit, Lastpufferung. **Herausforderungen:** Abläufe sind schwerer nachzuvollziehen, Reihenfolge und doppelte Zustellung müssen behandelt werden ([[Idempotenz]]), Ereignisformate müssen versioniert werden.

Verwandte Muster: **Saga** (verteilter Geschäftsprozess mit Kompensationsschritten statt globaler Transaktion), **Outbox-Pattern** (Event zuverlässig zusammen mit der DB-Änderung speichern), **[[Event Sourcing]]** und **CQRS**.

## Domain-Driven Design

[[Domain-Driven Design]] (DDD) richtet die Software an der Fachlichkeit aus:

- **Ubiquitous Language:** Fachleute und Entwickler verwenden dieselben Begriffe – auch im Code.
- **Bounded Contexts:** Ein Begriff kann in verschiedenen Kontexten Unterschiedliches bedeuten („Produkt“ im Katalog ≠ „Produkt“ im Lager). Jeder Kontext hat sein eigenes Modell – und ist ein natürlicher Kandidat für ein Modul oder einen Service.
- **Taktische Bausteine:** Entities (mit Identität), Value Objects (unveränderliche Werte wie \`Geld\`, \`Adresse\`), Aggregates (Konsistenzgrenzen), Domain Events, Repositories.

## Hexagonale und Clean Architecture

Beide Stile verfolgen dasselbe Ziel: **Die Fachlogik ist unabhängig von Technik.** Datenbank, Web-Framework und externe Dienste sind austauschbare Details.

\`\`\`widget
layers:clean-architecture
\`\`\`

In der **[[Hexagonale Architektur|hexagonalen Architektur]]** (Ports & Adapters) definiert der Kern **Ports** (Schnittstellen) – z. B. \`BestellRepository\` oder \`ZahlungsGateway\`. **Adapter** implementieren sie: ein PostgreSQL-Adapter, ein Stripe-Adapter, ein REST-Controller, ein CLI-Adapter, ein Fake für Tests.

\`\`\`typescript title="Port im Kern, Adapter außen"
// kern/ports.ts – kennt keine Datenbank, kein Framework
export interface BestellRepository {
  speichere(b: Bestellung): Promise<void>;
  finde(id: BestellId): Promise<Bestellung | null>;
}

// kern/bestellung-aufgeben.ts – Use Case
export class BestellungAufgeben {
  constructor(private repo: BestellRepository, private zahlung: ZahlungsGateway) {}
  async ausfuehren(befehl: { kundeId: string; positionen: Position[] }) {
    const bestellung = Bestellung.neu(befehl.kundeId, befehl.positionen);   // Geschäftsregeln im Modell
    await this.zahlung.reserviere(bestellung.summe());
    await this.repo.speichere(bestellung);
    return bestellung.id;
  }
}

// adapter/postgres-bestell-repository.ts – implementiert den Port
export class PostgresBestellRepository implements BestellRepository { /* SQL … */ }
\`\`\`

Die **[[Clean Architecture]]** formuliert das als konzentrische Kreise mit der *Dependency Rule*: Abhängigkeiten zeigen immer nach innen. Der Gewinn: Geschäftslogik ist ohne Datenbank testbar, Technologiewechsel betreffen nur Adapter. Der Preis: mehr Indirektion – für einfache CRUD-Anwendungen oft übertrieben.

## Entscheidungshilfe

| Situation | Guter Ausgangspunkt |
|---|---|
| Neues Produkt, kleines Team, Anforderungen noch unklar | modularer Monolith |
| Viele Teams, klar getrennte Fachbereiche, unterschiedliche Skalierungsbedürfnisse | Microservices entlang von Bounded Contexts |
| Viele Systeme reagieren auf dieselben Geschäftsereignisse | Event-Driven (zusätzlich) |
| Komplexe Fachlogik, lange Lebensdauer | DDD + hexagonale/Clean Architecture im Kern |
| Einfache Datenpflege (Formular → Tabelle) | Schichten/MVC mit einem guten Framework |

> [!EXPERT] Conway’s Law
> „Organisationen entwerfen Systeme, die ihre Kommunikationsstrukturen abbilden.“ Architektur und Teamstruktur gehören zusammen: Wer unabhängige Services will, braucht Teams, die sie unabhängig verantworten.

## Wie geht es weiter?

Die Kommunikation zwischen Bausteinen vertieft [API-Stile](#/artikel/api-stile), asynchrone Verarbeitung [Caching, Rate Limiting & Queues](#/artikel/caching-queues). Probiere im [Stack Builder](#/stack-builder), wie Technologien in einer Architektur zusammenspielen.
`;export{e as default};
