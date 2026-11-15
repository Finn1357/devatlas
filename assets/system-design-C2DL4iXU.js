const e=`---
id: system-design
title: System Design: Skalierbare Systeme entwerfen
area: architektur
difficulty: profi
minutes: 24
order: 13
summary: Wie man große Systeme strukturiert angeht – Anforderungen und Größenabschätzungen, Load Balancer, Caches, Datenbanken, Queues, Verfügbarkeit in Zahlen, Timeouts, Retries und Circuit Breaker – durchgespielt am Beispiel eines URL-Kürzers.
tags: [System Design, Skalierung, Load Balancer, Caching, Verfügbarkeit, Resilienz]
related: [architekturstile, replikation-sharding-backups, caching-queues, monitoring-observability]
---

## Vorgehen

System Design beginnt nicht mit Technologien, sondern mit Fragen. Ein bewährter Ablauf – im Berufsalltag wie im Vorstellungsgespräch:

1. **Funktionale Anforderungen:** Was muss das System können?
2. **Nicht-funktionale Anforderungen:** Wie viele Nutzer? Welche Antwortzeit? Wie verfügbar? Wie konsistent? Welche Datenmenge?
3. **Grobe Abschätzung** der Last und des Speicherbedarfs.
4. **API und Datenmodell** skizzieren.
5. **Grundarchitektur** zeichnen – zuerst einfach.
6. **Engpässe** identifizieren und gezielt beheben.
7. **Zielkonflikte** benennen: Was kostet jede Entscheidung?

> [!TIP] Einfach anfangen
> Die meisten Anwendungen kommen sehr lange mit einem Monolithen, einer PostgreSQL-Datenbank und einem Cache aus. Komplexität sollte durch gemessene Anforderungen begründet sein, nicht durch die Architektur bekannter Großkonzerne.

## Größenordnungen abschätzen

Grobe Rechnungen verhindern Fehlentscheidungen in beide Richtungen.

\`\`\`text
10 Millionen aktive Nutzer pro Tag × 20 Anfragen pro Nutzer = 200 Mio. Anfragen/Tag
200.000.000 ÷ 86.400 s ≈ 2.300 Anfragen/s im Mittel
Spitzenlast oft 2–5 × Mittel → Ziel: ~10.000 Anfragen/s

Speicher: 1 Mio. neue Datensätze/Tag × 1 KB = 1 GB/Tag ≈ 365 GB/Jahr
\`\`\`

### Latenzen, die man kennen sollte (Größenordnungen)

| Vorgang | ungefähre Dauer |
|---|---|
| Zugriff auf CPU-Cache | ~1 ns |
| Zugriff auf Arbeitsspeicher | ~100 ns |
| Zufälliger Lesezugriff SSD | ~20–100 µs |
| Roundtrip im selben Rechenzentrum | ~0,5 ms |
| Einfache, indizierte Datenbankabfrage | ~1 ms |
| Roundtrip Europa ↔ USA | ~80–150 ms |

Daraus folgt: Arbeitsspeicher ist um Größenordnungen schneller als Netzwerk – deshalb sind [Caches](#/artikel/caching-queues) so wirksam, und deshalb sind viele kleine Netzwerkaufrufe (N+1-Abfragen, „chatty“ Microservices) so teuer.

## Verfügbarkeit in Zahlen

| Verfügbarkeit | Ausfall pro Jahr | pro Monat (30 Tage) |
|---|---|---|
| 99 % („zwei Neunen“) | 3,65 Tage | 7,2 Stunden |
| 99,9 % | 8,77 Stunden | 43 Minuten |
| 99,99 % | 52,6 Minuten | 4,3 Minuten |
| 99,999 % | 5,3 Minuten | 26 Sekunden |

> [!WARNING] Abhängigkeiten multiplizieren sich
> Ruft ein Dienst nacheinander drei andere auf, die jeweils 99,9 % verfügbar sind, ist die Kette höchstens 0,999³ ≈ 99,7 % verfügbar. Redundanz erhöht die Verfügbarkeit, serielle Abhängigkeiten senken sie.

## Die Bausteine

\`\`\`text
                    ┌──────────┐
 Nutzer ──► DNS ──► │   CDN    │  statische Dateien, Bilder, gecachte Antworten
                    └────┬─────┘
                         ▼
                 ┌──────────────┐
                 │ Load Balancer│  verteilt Anfragen, TLS-Terminierung, Health Checks
                 └──┬────┬────┬─┘
                    ▼    ▼    ▼
                 [App] [App] [App]   zustandslos → beliebig skalierbar
                    │    │    │
        ┌───────────┼────┴────┼────────────┐
        ▼           ▼         ▼            ▼
   ┌─────────┐ ┌─────────┐ ┌────────┐ ┌──────────┐
   │  Cache  │ │ Primary │ │ Queue  │ │ Object   │
   │ (Redis) │ │   DB    │ │        │ │ Storage  │
   └─────────┘ └────┬────┘ └───┬────┘ └──────────┘
                    ▼          ▼
                Replicas    Worker (E-Mails, Bilder, Berichte)
\`\`\`

### Load Balancer

Ein **[[Load Balancer]]** verteilt Anfragen auf mehrere Server und nimmt ausgefallene Instanzen anhand von **Health Checks** aus der Rotation.

| Ebene | arbeitet mit | kann |
|---|---|---|
| **Layer 4** (TCP/UDP) | IP-Adressen und Ports | sehr schnell, protokollunabhängig |
| **Layer 7** (HTTP) | URLs, Header, Cookies | Routing nach Pfad (\`/api\` → API-Server), TLS-Terminierung, Kompression |

Verfahren: Round Robin, Least Connections, gewichtete Verteilung, Hash über Client-IP (für „Sticky Sessions“). Beispiele: Nginx, HAProxy, Envoy, Traefik, Cloud-Load-Balancer, Kubernetes Ingress.

### Zustandslose Anwendungsserver

Damit beliebig viele Instanzen hinter dem Load Balancer laufen können, dürfen sie **keinen lokalen Zustand** halten: Sessions gehören in Redis oder die Datenbank (oder in signierte Tokens), hochgeladene Dateien in Object Storage (S3 und kompatible Dienste), nicht auf die lokale Festplatte. Dann ist **horizontale Skalierung** trivial – und ein Absturz einer Instanz harmlos.

### Datenbank

Meist der schwierigste Teil. Die Stufen der Skalierung: Indizes und Abfragen optimieren → Caching → Lese-Replicas → Partitionierung → Sharding. Details in [Replikation, Sharding & Backups](#/artikel/replikation-sharding-backups).

### Asynchrone Verarbeitung

Alles, was der Nutzer nicht sofort braucht, gehört in eine **Queue**: E-Mails, Bildverarbeitung, PDF-Erzeugung, Benachrichtigungen, Datenexporte. Die Anfrage wird schnell beantwortet, Worker arbeiten im eigenen Tempo, Lastspitzen werden abgefedert. Siehe [Message Broker & Events](#/artikel/message-broker-events).

## Resilienz: Mit Fehlern rechnen

In verteilten Systemen fällt ständig irgendetwas aus. Robuste Systeme begrenzen den Schaden:

| Muster | Zweck |
|---|---|
| **Timeouts** | Jeder Netzwerkaufruf braucht ein Zeitlimit – sonst blockieren hängende Abhängigkeiten alle Threads |
| **Retries mit exponentiellem Backoff und Jitter** | vorübergehende Fehler abfangen, ohne den gestörten Dienst durch synchrone Wiederholungswellen zu überlasten |
| **Idempotenz** | Wiederholungen dürfen nichts doppelt ausführen (Idempotency Keys bei Zahlungen) |
| **Circuit Breaker** | nach vielen Fehlern Aufrufe eine Weile sofort ablehnen, statt weiter zu warten |
| **Bulkheads** | getrennte Ressourcen-Pools, damit ein langsamer Dienst nicht alles lahmlegt |
| **Graceful Degradation** | Kernfunktion erhalten, Nebenfunktionen abschalten (Empfehlungen ausblenden, wenn ihr Dienst ausfällt) |
| **Rate Limiting** | Schutz vor Überlast und Missbrauch |

\`\`\`python title="Retry mit exponentiellem Backoff und Jitter"
import random
import time

def mit_wiederholung(aufruf, versuche: int = 5, basis: float = 0.2, maximum: float = 5.0):
    for versuch in range(versuche):
        try:
            return aufruf()
        except (TimeoutError, ConnectionError):
            if versuch == versuche - 1:
                raise
            wartezeit = min(maximum, basis * 2 ** versuch)
            time.sleep(random.uniform(0, wartezeit))      # "Full Jitter" verteilt die Wiederholungen
\`\`\`

> [!DANGER] Retries nur für idempotente Operationen
> Eine Zahlung, deren Antwort im Timeout verloren ging, wurde vielleicht trotzdem ausgeführt. Ohne Idempotency Key bucht der Retry ein zweites Mal ab.

## Beispiel: Ein URL-Kürzer

**Anforderungen:** Lange URL → kurzer Link (\`https://kurz.example/aZ3kP9\`); Aufruf leitet weiter; optional Klickstatistik. 100 Mio. neue Links pro Monat, Leseverhältnis 100:1.

**Abschätzung:**
- Schreiben: 100 Mio. ÷ (30 × 86.400 s) ≈ **40 pro Sekunde**.
- Lesen: ≈ **4.000 Weiterleitungen pro Sekunde** im Mittel.
- Speicher: 100 Mio. × 12 Monate × ~500 Byte ≈ **600 GB pro Jahr**.

**API:**

\`\`\`http
POST /api/links
Content-Type: application/json

{"url": "https://example.com/ein/sehr/langer/pfad?mit=parametern"}

→ 201 Created
{"kurz": "https://kurz.example/aZ3kP9"}

GET /aZ3kP9
→ 302 Found
Location: https://example.com/ein/sehr/langer/pfad?mit=parametern
\`\`\`

**Kurz-IDs:** 7 Zeichen aus \`[a-zA-Z0-9]\` ergeben 62⁷ ≈ 3,5 Billionen Kombinationen – genug für Jahrhunderte. Zwei Ansätze:
- **Zähler + Base62-Kodierung:** eindeutig und kurz, aber erratbar (aufeinanderfolgende Links lassen sich durchprobieren).
- **Zufällige ID** mit Eindeutigkeitsprüfung per \`UNIQUE\`-Constraint: nicht erratbar; bei Kollision einfach neu würfeln.

**Weiterleitung:** \`301\` (permanent) wird von Browsern dauerhaft gecacht – weniger Last, aber keine Klickzählung und keine spätere Änderung. \`302\`/\`307\` erlaubt beides.

**Architektur:** Eine relationale Datenbank (\`kurz_id\` als Primärschlüssel) reicht für 40 Schreibvorgänge pro Sekunde mühelos. Die Leselast fängt ein **Cache** ab – beliebte Links werden extrem häufig aufgerufen. Klicks werden nicht synchron gezählt, sondern als Ereignis in eine Queue geschrieben und gebündelt ausgewertet.

**Sicherheit:** Ziel-URLs auf bekannte Phishing- und Malware-Domains prüfen, Rate Limiting beim Anlegen, nur \`http\`/\`https\` als Schema zulassen (kein \`javascript:\`).

## Wie geht es weiter?

Die Grundsatzentscheidung Monolith oder Microservices behandelt [Architekturstile](#/artikel/architekturstile); wie man sieht, was im laufenden System passiert, zeigt [Monitoring & Observability](#/artikel/monitoring-observability).

\`\`\`widget
quiz:Architektur 3
\`\`\`
`;export{e as default};
