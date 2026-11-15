const e=`---
id: resilienz-muster
title: Resilienz-Muster: Timeouts, Retries, Circuit Breaker und Bulkheads
area: backend
difficulty: fortgeschritten
minutes: 20
order: 23
summary: Wie ein Dienst stabil bleibt, wenn seine Abhängigkeiten langsam werden oder ausfallen – Timeouts und Zeitbudgets, Wiederholungen mit Backoff und Jitter, Idempotency Keys, Circuit Breaker, Bulkheads, Load Shedding und sinnvolle Fallbacks, jeweils mit Code und typischen Fehlern.
tags: [Resilienz, Timeout, Retry, Circuit Breaker, Bulkhead, Idempotenz, Backoff]
related: [system-design, verteilte-systeme, caching-queues, monitoring-observability, grpc-praxis, kubernetes-praxis]
---

## Wie ein kleiner Fehler alles lahmlegt

Ein Shop ruft für jede Produktseite den Empfehlungsdienst auf. Eines Abends antwortet dieser nicht mehr in 50 ms, sondern gar nicht – die Verbindungen hängen. Jeder Seitenaufruf blockiert nun einen Worker-Thread des Shops, bis irgendwann ein Standard-Timeout von 60 Sekunden greift. Nach wenigen Sekunden sind alle Threads belegt: Auch Warenkorb und Kasse, die den Empfehlungsdienst gar nicht brauchen, antworten nicht mehr. Ein unwichtiger Dienst hat den ganzen Shop mitgerissen – ein **Kaskadenausfall**.

Die Rechnung dahinter ist einfach (Littles Gesetz): **gleichzeitig belegte Ressourcen = Anfragerate × Verweildauer.** Bei 200 Anfragen pro Sekunde und 50 ms Antwortzeit sind im Mittel 10 Threads beschäftigt. Steigt die Verweildauer auf 30 Sekunden, bräuchte man 6 000 – jede Ressourcengrenze ist sofort erreicht.

> [!BEGINNER] Die Grundidee
> Resilienz heißt nicht, dass nichts ausfällt. Es heißt, dass ein Ausfall **begrenzt** bleibt: Er kostet eine Nebenfunktion, aber nicht den ganzen Dienst. Die Muster in diesem Artikel sind die Brandschutztüren dafür.

Die Übersicht der Muster steht im Abschnitt „Resilienz“ von [System Design](#/artikel/system-design). Hier geht es darum, wie man sie konkret umsetzt und wo die Fallstricke liegen.

## Timeouts und Zeitbudgets

Jeder Aufruf über das Netz braucht ein [[Timeout]]. Viele HTTP-Clients haben standardmäßig **keines** oder ein sehr langes – das ist die häufigste Ursache für hängende Dienste.

- **Verbindungs-Timeout** (Verbindungsaufbau, typisch 1–3 s) und **Lese-Timeout** (Warten auf Daten) getrennt setzen.
- Den Wert aus Messungen ableiten: etwas über dem 99. Perzentil der normalen Antwortzeit, nicht „sicherheitshalber 30 Sekunden“.
- **Zeitbudget statt Einzelwerte:** Hat die eingehende Anfrage selbst nur 2 Sekunden, dürfen alle Folgeaufrufe zusammen nicht länger dauern. Bei gRPC heißt das [[Deadline]] und wird automatisch weitergereicht, siehe [gRPC in der Praxis](#/artikel/grpc-praxis).

\`\`\`typescript title="fetch mit Timeout und Restbudget"
async function mitBudget<T>(deadline: number, aufruf: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const rest = deadline - Date.now();
  if (rest <= 0) throw new Error('Zeitbudget aufgebraucht');
  return aufruf(AbortSignal.timeout(rest));   // bricht die Anfrage nach \`rest\` ms ab
}

const deadline = Date.now() + 2000;            // gesamtes Budget dieser Anfrage
const profil = await mitBudget(deadline, (signal) => fetch('/intern/profil/42', { signal }));
const empfehlungen = await mitBudget(deadline, (signal) => fetch('/intern/empfehlungen/42', { signal }));
\`\`\`

## Wiederholungen richtig machen

Viele Fehler sind vorübergehend: eine kurz überlastete Instanz, ein Verbindungsabbruch beim Deployment. Eine Wiederholung (Retry) behebt sie – kann aber auch schaden.

**Wann wiederholen?**

| Wiederholen | Nicht wiederholen |
|---|---|
| Verbindungsfehler, Verbindungsabbruch | 400 Bad Request, 422 – die Anfrage ist falsch und bleibt falsch |
| 503 Service Unavailable, 502/504 vom Proxy | 401/403 – Anmeldung oder Rechte fehlen |
| 429 Too Many Requests (frühestens nach \`Retry-After\`) | 404 – außer bei bekanntem Replikationsverzug |
| Timeouts – **nur** bei idempotenten Operationen | nicht idempotente Operationen ohne Idempotency Key |

**Wie wiederholen?** Mit [[Exponential Backoff|exponentiell wachsender Wartezeit]] und **Jitter** (Zufall): Wiederholen alle Clients nach exakt 1, 2, 4 Sekunden, treffen sie den sich erholenden Dienst in synchronen Wellen. „Full Jitter“ wählt die Wartezeit gleichverteilt zwischen 0 und der Obergrenze.

\`\`\`python title="Retry mit Full Jitter und Obergrenze"
import random, time

class Voruebergehend(Exception):
    """Fehler, bei dem eine Wiederholung sinnvoll ist (z. B. 503, Verbindungsabbruch)."""

def mit_retry(aufruf, versuche=4, basis=0.1, maximum=2.0):
    for versuch in range(1, versuche + 1):
        try:
            return aufruf()
        except Voruebergehend as fehler:
            if versuch == versuche:
                raise
            grenze = min(maximum, basis * 2 ** versuch)
            pause = random.uniform(0, grenze)
            print(f"Versuch {versuch} fehlgeschlagen ({fehler}), warte {pause:.2f} s")
            time.sleep(pause)

# Simulation: die ersten beiden Aufrufe scheitern
zaehler = {"n": 0}
def wackeliger_dienst():
    zaehler["n"] += 1
    if zaehler["n"] < 3:
        raise Voruebergehend("503")
    return "OK"

print(mit_retry(wackeliger_dienst))
\`\`\`

> [!DANGER] Retry-Verstärkung über mehrere Schichten
> Wiederholen Browser, API-Gateway und Backend jeweils dreimal, erreichen den letzten Dienst im schlimmsten Fall 3 × 3 × 3 = 27 Anfragen pro Klick – genau dann, wenn er ohnehin überlastet ist. Wiederholt wird deshalb nur an **einer** Stelle (meist direkt vor dem fehlerhaften Aufruf), und ein **Retry-Budget** begrenzt den Anteil der Wiederholungen (z. B. höchstens 10 % zusätzlicher Anfragen).

### Idempotency Keys

Eine Zahlung, deren Antwort im Timeout verloren ging, ist vielleicht trotzdem ausgeführt worden. Damit eine Wiederholung sicher ist, schickt der Client einen eindeutigen Schlüssel mit (verbreitet als HTTP-Header \`Idempotency-Key\`). Der Server speichert Schlüssel und Ergebnis und liefert bei einer Wiederholung **dasselbe Ergebnis**, statt erneut zu buchen. Siehe auch [[Idempotenz]].

\`\`\`python title="Server-Seite: gleiche Anfrage, gleiche Antwort"
ergebnisse: dict[str, dict] = {}      # in echt: Tabelle mit Eindeutigkeitsbedingung + Ablaufzeit

def zahlung_ausfuehren(schluessel: str, betrag: int) -> dict:
    if schluessel in ergebnisse:
        return ergebnisse[schluessel]           # Wiederholung: nichts doppelt buchen
    ergebnis = {"status": "gebucht", "betrag": betrag, "buchung": len(ergebnisse) + 1}
    ergebnisse[schluessel] = ergebnis
    return ergebnis

print(zahlung_ausfuehren("c0ffee-1", 2500))
print(zahlung_ausfuehren("c0ffee-1", 2500))     # identisch, keine zweite Buchung
\`\`\`

In einem echten System müssen Speichern des Schlüssels und Buchung **in derselben Transaktion** passieren. Zusätzlich sollte der Server prüfen, ob eine Wiederholung mit demselben Schlüssel auch denselben Inhalt hat – sonst ist es ein Fehler des Clients.

## Circuit Breaker: Nicht gegen die Wand laufen

Ist eine Abhängigkeit eindeutig gestört, sind weitere Aufrufe sinnlos: Sie kosten Zeit und belasten den gestörten Dienst zusätzlich. Ein [[Circuit Breaker]] (Sicherung) beobachtet die Fehlerquote und schaltet zwischen drei Zuständen:

\`\`\`text title="Die drei Zustände eines Circuit Breakers"
Geschlossen: Aufrufe laufen normal; Fehler werden gezählt
Offen: Schwelle überschritten – Aufrufe scheitern sofort, ohne Netzwerk
Halb offen: nach einer Wartezeit wenige Probeaufrufe; Erfolg → geschlossen, Fehler → wieder offen
\`\`\`

\`\`\`typescript title="Minimaler Circuit Breaker"
type Zustand = 'geschlossen' | 'offen' | 'halboffen';

export class CircuitBreaker {
  private zustand: Zustand = 'geschlossen';
  private fehler = 0;
  private geoeffnetAm = 0;

  constructor(private schwelle = 5, private pauseMs = 10_000) {}

  async aufrufen<T>(fn: () => Promise<T>): Promise<T> {
    if (this.zustand === 'offen') {
      if (Date.now() - this.geoeffnetAm < this.pauseMs) throw new Error('Circuit offen – Abhängigkeit gestört');
      this.zustand = 'halboffen';                  // Probeaufruf zulassen
    }
    try {
      const ergebnis = await fn();
      this.zustand = 'geschlossen';
      this.fehler = 0;
      return ergebnis;
    } catch (e) {
      this.fehler++;
      if (this.zustand === 'halboffen' || this.fehler >= this.schwelle) {
        this.zustand = 'offen';
        this.geoeffnetAm = Date.now();
      }
      throw e;
    }
  }
}
\`\`\`

Produktionsreife Bibliotheken zählen nicht einfach Fehler, sondern bewerten ein gleitendes Zeitfenster (Fehlerquote *und* Mindestanzahl Aufrufe), lassen im halboffenen Zustand nur eine begrenzte Zahl von Probeaufrufen durch und melden Zustandswechsel als [[Metrik]]. Verbreitet sind Resilience4j (Java), Polly (.NET), tenacity (Python, für Retries) und cockatiel (TypeScript).

## Bulkheads: Schotten dicht

Ein Schiff ist in wasserdichte Abteilungen unterteilt, damit ein Leck nicht das ganze Schiff flutet. Das [[Bulkhead|Bulkhead-Muster]] überträgt das auf Ressourcen: Jede Abhängigkeit bekommt ein **eigenes, begrenztes Kontingent** an Threads, Verbindungen oder gleichzeitigen Aufrufen. Hängt der Empfehlungsdienst, sind höchstens seine 10 Plätze belegt – Warenkorb und Kasse arbeiten weiter.

\`\`\`python title="Bulkhead mit asyncio.Semaphore" norun
import asyncio

empfehlungen_slots = asyncio.Semaphore(10)   # höchstens 10 gleichzeitige Aufrufe

async def empfehlungen_laden(produkt_id: int) -> list[str]:
    if empfehlungen_slots.locked():
        return []                             # voll → sofort ohne Empfehlungen weiter
    async with empfehlungen_slots:
        await asyncio.sleep(0.05)             # Platzhalter für den echten HTTP-Aufruf (mit Timeout!)
        return [f"Zubehör zu {produkt_id}"]

async def main():
    ergebnisse = await asyncio.gather(*(empfehlungen_laden(i) for i in range(25)))
    print(sum(1 for e in ergebnisse if e), "von 25 mit Empfehlungen")

asyncio.run(main())
\`\`\`

Weitere Formen: getrennte Verbindungspools pro Datenbank, eigene Worker-Prozesse für teure Aufgaben, getrennte Kubernetes-Deployments für unterschiedlich kritische Endpunkte.

## Überlast kontrolliert abwehren

Wenn mehr Arbeit ankommt, als ein Dienst schafft, wachsen Warteschlangen – und mit ihnen die Antwortzeiten, bis jede Antwort zu spät kommt. Besser ist es, früh und billig abzulehnen:

- **Load Shedding:** Ab einer Grenze (gleichzeitige Anfragen, Warteschlangenlänge, CPU) sofort mit \`503\` und \`Retry-After\` antworten. Wichtige Anfragen (Kasse) können Vorrang vor unwichtigen (Empfehlungen) bekommen.
- **Begrenzte Warteschlangen:** Eine unbegrenzte Queue verschiebt das Problem nur in den Speicher. [[Backpressure]] gibt das Signal „langsamer“ an den Erzeuger zurück.
- **[[Rate Limiting]]** schützt vor einzelnen Verursachern (Details mit Token Bucket in [Caching, Rate Limiting & Queues](#/artikel/caching-queues)).

## Fallbacks und Graceful Degradation

Fällt eine Abhängigkeit aus, kann der Dienst oft eingeschränkt weiterarbeiten (Graceful Degradation): Empfehlungen ausblenden, zwischengespeicherte Preise mit Hinweis anzeigen, Bestellungen annehmen und die Bestätigungsmail später senden.

> [!WARNING] Fallbacks, die Fehler verstecken
> Ein Fallback, der still \`0\` als Kontostand oder eine leere Berechtigungsliste liefert, ist schlimmer als ein sichtbarer Fehler. Fallbacks gehören zu **Nebenfunktionen**; bei sicherheits- oder geldrelevanten Daten ist „lieber ablehnen“ richtig. Jeder Fallback muss in Logs und Metriken sichtbar sein.

## Gesundheit melden und Resilienz testen

- **Liveness** beantwortet „Läuft der Prozess noch?“, **Readiness** „Kann er Anfragen bedienen?“. Die Readiness-Prüfung sollte nicht von jeder Abhängigkeit abhängen – sonst nimmt der Load Balancer bei einem Datenbankschluckauf alle Instanzen gleichzeitig aus dem Verkehr. Siehe [[Health Probe]] und [Kubernetes in der Praxis](#/artikel/kubernetes-praxis).
- **Fehler gezielt einspielen:** Timeouts und Ausfälle von Abhängigkeiten in Tests und Staging simulieren (Fault Injection, z. B. mit einem Proxy, der Verzögerungen einbaut). Chaos Engineering in Produktion erst, wenn Monitoring und Rückfallpläne stehen – und mit kleinem Wirkungsbereich beginnen.
- **Beobachten:** Retries, Circuit-Breaker-Zustände, abgelehnte Anfragen und Fallbacks als Metriken erfassen; Alarme auf [[SLO]]-Verletzungen statt auf Einzelfehler. Mehr in [Monitoring & Observability](#/artikel/monitoring-observability).

## Typische Fehler

> [!MISTAKE] Kein Timeout am HTTP-Client
> Der Klassiker hinter hängenden Diensten. Jede Bibliothek dokumentiert ihre Standardwerte – nachlesen und bewusst setzen.

- **Retries auf jeder Schicht** und ohne Budget → Lastverstärkung im Störfall.
- **Nicht idempotente Operationen wiederholen** (Zahlung, E-Mail, Lagerbuchung) ohne Idempotency Key.
- **Gleiche Wartezeiten ohne Jitter** → synchronisierte Wiederholungswellen.
- **Circuit Breaker pro Anfrage neu erzeugen** – er braucht gemeinsamen Zustand pro Abhängigkeit (pro Instanz).
- **Readiness-Check prüft alle Abhängigkeiten** → ein kurzer Datenbankfehler nimmt den ganzen Dienst aus dem Load Balancer.
- **Unbegrenzte Queues und Thread-Pools** → Speicherüberlauf statt kontrollierter Ablehnung.

## Übungsfragen

> 1. Ein Dienst soll innerhalb von 1 s antworten und ruft nacheinander zwei Abhängigkeiten auf. Wie verteilst du Timeouts und Retries, ohne das Budget zu sprengen?
> 2. Ein Client bekommt bei \`POST /zahlungen\` nach 5 s ein Timeout. Was darf er tun, was nicht – und was muss der Server dafür bereitstellen?
> 3. Warum kann ein Circuit Breaker die Erholung eines überlasteten Dienstes beschleunigen?

\`\`\`widget
quiz:Resilienz 5
\`\`\`

## Wie geht es weiter?

Warum „langsam“ und „ausgefallen“ grundsätzlich nicht unterscheidbar sind und was das für Daten bedeutet, erklärt [Verteilte Systeme](#/artikel/verteilte-systeme). Asynchrone Entkopplung über Queues und Wiederholungen von Hintergrundjobs zeigt [Caching, Rate Limiting & Queues](#/artikel/caching-queues).
`;export{e as default};
