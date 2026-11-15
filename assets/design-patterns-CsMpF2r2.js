const e=`---
id: design-patterns
title: Design Patterns in der Praxis
area: architektur
difficulty: fortgeschritten
minutes: 20
order: 11
summary: Die wichtigsten Entwurfsmuster – Strategy, Observer, Factory, Adapter, Decorator, Builder, Singleton und Dependency Injection – mit modernem Code, Einsatzzweck und Fallstricken.
tags: [Design Patterns, Entwurfsmuster, OOP, Strategy, Observer, Factory]
related: [clean-code-solid, architekturstile, testing]
---

## Was sind Design Patterns?

[[Design Pattern|Entwurfsmuster]] sind bewährte Lösungsschablonen für wiederkehrende Probleme im Softwareentwurf. Bekannt wurden sie durch das Buch der „Gang of Four“ (1994) mit 23 Mustern in drei Gruppen:

- **Erzeugungsmuster:** Wie entstehen Objekte? (Factory, Builder, Singleton)
- **Strukturmuster:** Wie werden Objekte zusammengesetzt? (Adapter, Decorator, Facade)
- **Verhaltensmuster:** Wie arbeiten Objekte zusammen? (Strategy, Observer, Command)

> [!BEGINNER]
> Ein Pattern ist kein fertiger Code zum Kopieren, sondern ein **gemeinsames Vokabular**: „Hier nehmen wir ein Strategy-Pattern“ erklärt einem Team in einem Satz die Struktur.

> [!WARNING] Patterns sind Werkzeuge, kein Ziel
> In Sprachen mit First-Class-Funktionen (JavaScript, Python, Kotlin) werden viele klassische Muster zu wenigen Zeilen – oder überflüssig. Setze ein Muster ein, wenn es ein konkretes Problem löst, nicht weil es „professionell“ aussieht.

## Strategy: austauschbare Algorithmen

**Problem:** Eine Berechnung hat mehrere Varianten (Versandkosten, Rabatte, Sortierung), und \`if/else\`-Ketten wachsen unkontrolliert.

\`\`\`typescript
interface VersandStrategie {
  kosten(bestellung: { gewichtKg: number; summe: number }): number;
}

const standard: VersandStrategie = { kosten: (b) => (b.summe >= 50 ? 0 : 4.9) };
const express: VersandStrategie = { kosten: (b) => 9.9 + b.gewichtKg * 0.5 };
const abholung: VersandStrategie = { kosten: () => 0 };

function checkout(bestellung: { gewichtKg: number; summe: number }, versand: VersandStrategie) {
  return bestellung.summe + versand.kosten(bestellung);
}

checkout({ gewichtKg: 2, summe: 40 }, express);
\`\`\`

In funktionalen Sprachen ist eine Strategy oft einfach eine übergebene Funktion – wie der Vergleichsparameter von \`sort\`. Siehe [[Strategy]].

## Observer: auf Ereignisse reagieren

**Problem:** Mehrere Teile des Systems sollen reagieren, wenn etwas passiert – ohne dass der Auslöser sie alle kennt.

\`\`\`python
from collections import defaultdict
from typing import Callable

class EventBus:
    def __init__(self) -> None:
        self._abonnenten: dict[str, list[Callable[[dict], None]]] = defaultdict(list)

    def abonniere(self, ereignis: str, handler: Callable[[dict], None]) -> None:
        self._abonnenten[ereignis].append(handler)

    def veroeffentliche(self, ereignis: str, daten: dict) -> None:
        for handler in self._abonnenten[ereignis]:
            handler(daten)

bus = EventBus()
bus.abonniere("bestellung_aufgegeben", lambda d: print("Mail an", d["email"]))
bus.abonniere("bestellung_aufgegeben", lambda d: print("Lager reservieren:", d["id"]))
bus.veroeffentliche("bestellung_aufgegeben", {"id": 4711, "email": "ada@example.org"})
\`\`\`

[[Observer]] steckt in DOM-Events (\`addEventListener\`), reaktiven Bibliotheken (RxJS, Signals) und – im Großen – in [[Event-Driven Architecture|ereignisgesteuerten Architekturen]] mit Message Brokern.

## Factory: Erzeugung kapseln

**Problem:** Der Aufrufer soll nicht wissen müssen, welche konkrete Klasse er braucht.

\`\`\`java
sealed interface Benachrichtigung permits Email, Sms, Push {}
record Email(String adresse) implements Benachrichtigung {}
record Sms(String nummer) implements Benachrichtigung {}
record Push(String geraeteToken) implements Benachrichtigung {}

final class BenachrichtigungsFactory {
    static Benachrichtigung fuer(Kunde k) {
        return switch (k.kanal()) {
            case EMAIL -> new Email(k.email());
            case SMS -> new Sms(k.telefon());
            case PUSH -> new Push(k.geraeteToken());
        };
    }
}
\`\`\`

## Builder: komplexe Objekte Schritt für Schritt

**Problem:** Ein Objekt hat viele optionale Parameter, und Konstruktoren mit zwölf Argumenten sind unlesbar.

\`\`\`typescript
class AnfrageBuilder {
  private url = '';
  private methode: 'GET' | 'POST' = 'GET';
  private header: Record<string, string> = {};
  private timeoutMs = 10_000;

  an(url: string) { this.url = url; return this; }
  post() { this.methode = 'POST'; return this; }
  mitHeader(k: string, v: string) { this.header[k] = v; return this; }
  timeout(ms: number) { this.timeoutMs = ms; return this; }
  baue() { return { url: this.url, methode: this.methode, header: this.header, timeoutMs: this.timeoutMs }; }
}

const anfrage = new AnfrageBuilder().an('/api/x').post().mitHeader('Accept', 'application/json').timeout(5000).baue();
\`\`\`

In Sprachen mit benannten und Default-Parametern (Python, Kotlin, C#) oder Objekt-Literalen (JS) ist ein Builder oft unnötig.

## Adapter: inkompatible Schnittstellen verbinden

**Problem:** Du willst eine Bibliothek (oder ein Altsystem) nutzen, deren Schnittstelle nicht zu deiner passt.

\`\`\`python
class ZahlungsAnbieter(Protocol):
    def belaste(self, betrag_cent: int, referenz: str) -> str: ...

class AltesPaymentSdkAdapter:
    """Passt das alte SDK (Euro als float, andere Methodennamen) an unsere Schnittstelle an."""
    def __init__(self, sdk): self._sdk = sdk
    def belaste(self, betrag_cent: int, referenz: str) -> str:
        antwort = self._sdk.makePayment(amount_eur=betrag_cent / 100, ref=referenz)
        return antwort["transactionId"]
\`\`\`

[[Adapter]] sind das Herzstück der [hexagonalen Architektur](#/artikel/architekturstile): Die Fachlogik definiert Schnittstellen (Ports), Adapter binden Datenbanken, APIs und Frameworks an.

## Decorator: Verhalten hinzufügen, ohne zu ändern

\`\`\`python title="Retry-Decorator in Python"
import functools, time

def wiederhole(versuche: int = 3, wartezeit: float = 0.5):
    def decorator(funktion):
        @functools.wraps(funktion)
        def wrapper(*args, **kwargs):
            for versuch in range(1, versuche + 1):
                try:
                    return funktion(*args, **kwargs)
                except ConnectionError:
                    if versuch == versuche:
                        raise
                    time.sleep(wartezeit * 2 ** (versuch - 1))   # exponentieller Backoff
        return wrapper
    return decorator

@wiederhole(versuche=4)
def lade_wechselkurse() -> dict: ...
\`\`\`

Das Decorator-Pattern umhüllt ein Objekt mit gleichem Interface und ergänzt Verhalten (Logging, Caching, Retry). Python-[[Decorator|Decorators]] und HTTP-Middleware sind verwandte Ideen.

## Singleton – und warum er oft vermieden wird

Ein [[Singleton]] stellt sicher, dass es genau eine Instanz einer Klasse gibt. Klingt praktisch für Konfiguration oder Datenbankverbindungen, ist aber **versteckter globaler Zustand**: schwer zu testen, schwer auszutauschen, problematisch bei Nebenläufigkeit. Besser: **eine** Instanz beim Start erzeugen und per [[Dependency Injection]] weiterreichen. DI-Container (Spring, ASP.NET Core, NestJS) verwalten solche „Singleton-Lebensdauern“ kontrolliert.

## Weitere häufige Muster

| Muster | Kurz erklärt | Typisch in |
|---|---|---|
| Facade | einfache Schnittstelle vor komplexem Subsystem | SDKs, Service-Schichten |
| Command | Aktion als Objekt (rückgängig machen, in Queue legen) | Undo/Redo, Job-Queues |
| Repository | Datenzugriff hinter Collection-artiger Schnittstelle | DDD, ORMs |
| Template Method | Ablauf fest, Schritte überschreibbar | Frameworks |
| State | Verhalten abhängig vom Zustand, ohne riesige switch-Blöcke | Workflows, Bestellstatus |
| Proxy | Platzhalter mit Zusatzlogik (Lazy Loading, Zugriffskontrolle) | ORMs, Vue-Reaktivität |

## Wie geht es weiter?

Die Prinzipien hinter den Mustern erklärt [Clean Code & SOLID](#/artikel/clean-code-solid); wie Muster ganze Systeme strukturieren, [Architekturstile](#/artikel/architekturstile).
`;export{e as default};
