const e=`---
id: nebenlaeufigkeit
title: Nebenläufigkeit & Parallelität: Threads, Locks, Async & Deadlocks
area: grundlagen
difficulty: profi
minutes: 22
order: 16
summary: Der Unterschied zwischen Nebenläufigkeit und Parallelität, Race Conditions und wie man sie verhindert, Locks, atomare Operationen, Deadlocks – und die Modelle der Sprachen: Threads, Event Loop, Goroutines, Actors.
tags: [Nebenläufigkeit, Parallelität, Race Condition, Mutex, Deadlock, Async, Goroutine]
related: [betriebssysteme-prozesse, async-javascript, speicherverwaltung, caching-queues]
---

## Zwei Begriffe, die oft verwechselt werden

- **[[Nebenläufigkeit]]** (Concurrency): Mehrere Aufgaben sind **gleichzeitig in Bearbeitung** und wechseln sich ab – auch auf einem einzigen CPU-Kern. Es geht um Struktur: mit vielen Dingen gleichzeitig *umgehen*.
- **Parallelität** (Parallelism): Mehrere Aufgaben werden **im selben Moment** auf mehreren Kernen ausgeführt. Es geht um Geschwindigkeit: viele Dinge gleichzeitig *tun*.

> [!BEGINNER]
> Ein Koch, der zwischen drei Töpfen hin- und herwechselt, arbeitet nebenläufig. Drei Köche an drei Töpfen arbeiten parallel.

Welche Technik passt, hängt von der Art der Arbeit ab:

| Art | Engpass | Beispiel | Passende Technik |
|---|---|---|---|
| **I/O-gebunden** | Warten auf Netzwerk, Festplatte, Datenbank | Webserver, API-Aufrufe, Crawler | Nebenläufigkeit: async/await, Threads, Goroutines |
| **CPU-gebunden** | Rechenleistung | Bildverarbeitung, Kompression, Simulationen | Parallelität: mehrere Kerne (Prozesse, Threads ohne globale Sperre) |

## Race Conditions

Eine **[[Race Condition]]** entsteht, wenn das Ergebnis davon abhängt, in welcher Reihenfolge nebenläufige Operationen zufällig ablaufen. Das klassische Beispiel: Zwei Threads erhöhen denselben Zähler. \`zaehler += 1\` sind in Wahrheit drei Schritte:

| Zeit | Thread A | Thread B | zaehler im Speicher |
|---|---|---|---|
| 1 | liest 41 | | 41 |
| 2 | | liest 41 | 41 |
| 3 | rechnet 42 | rechnet 42 | 41 |
| 4 | schreibt 42 | | 42 |
| 5 | | schreibt 42 | **42 statt 43** |

Das Tückische: Der Fehler tritt nur gelegentlich auf, verschwindet beim Debuggen („Heisenbug“) und kommt in Produktion unter Last zurück.

Race Conditions gibt es nicht nur im Speicher:
- **Check-then-act:** „Ist der Benutzername frei?“ – „Ja“ – zwei Anfragen legen gleichzeitig denselben Namen an. Lösung: \`UNIQUE\`-Constraint in der Datenbank.
- **Lost Update:** Zwei Nutzer bearbeiten denselben Datensatz; der zweite überschreibt den ersten. Lösung: Optimistic Locking (Versionsspalte) oder Transaktionen mit passender [Isolationsstufe](#/artikel/indizes-transaktionen).
- **Dateien:** Prüfen, ob eine Datei existiert, und sie dann anlegen (TOCTOU). Lösung: atomar anlegen (\`open(..., "x")\` in Python).

## Synchronisation

### Mutex / Lock

Ein **[[Mutex]]** (Mutual Exclusion) stellt sicher, dass nur ein Thread gleichzeitig einen **kritischen Abschnitt** ausführt:

\`\`\`python title="Python: Lock schützt den gemeinsamen Zähler"
import threading

zaehler = 0
sperre = threading.Lock()

def erhoehe(n: int) -> None:
    global zaehler
    for _ in range(n):
        with sperre:                  # nur ein Thread gleichzeitig
            zaehler += 1

threads = [threading.Thread(target=erhoehe, args=(100_000,)) for _ in range(4)]
for t in threads: t.start()
for t in threads: t.join()
print(zaehler)                        # zuverlässig 400000
\`\`\`

\`\`\`go title="Go: Goroutines mit WaitGroup und Mutex"
package main

import (
	"fmt"
	"sync"
)

func main() {
	var (
		mu       sync.Mutex
		wg       sync.WaitGroup
		zaehler  int
	)
	for i := 0; i < 4; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for j := 0; j < 100_000; j++ {
				mu.Lock()
				zaehler++
				mu.Unlock()
			}
		}()
	}
	wg.Wait()
	fmt.Println(zaehler) // 400000
}
\`\`\`

Go bringt mit \`go run -race\` einen **Race Detector** mit, der solche Fehler zur Laufzeit aufspürt. Ähnliches gibt es für C/C++ (ThreadSanitizer).

### Weitere Werkzeuge

| Werkzeug | Zweck |
|---|---|
| **Atomare Operationen** | einzelne Lese-Ändern-Schreib-Schritte unteilbar ausführen (\`AtomicInteger\`, \`std::atomic\`, \`sync/atomic\`) – schneller als ein Lock |
| **Read-Write-Lock** | viele Leser gleichzeitig, aber exklusive Schreiber |
| **Semaphore** | begrenzt die Anzahl gleichzeitiger Zugriffe (z. B. max. 10 parallele Downloads) |
| **Thread-sichere Collections** | \`ConcurrentHashMap\`, \`queue.Queue\`, \`ConcurrentDictionary\` |
| **Unveränderliche Daten** | was sich nicht ändert, kann nicht um die Wette geändert werden |
| **Nachrichten statt geteiltem Speicher** | Channels (Go), Actors (Erlang, Akka), Queues |

> [!TIP] Go-Motto
> „Do not communicate by sharing memory; instead, share memory by communicating.“ – Statt mehrere Goroutines auf dieselbe Variable zugreifen zu lassen, schickt man Daten über Channels von einer zur anderen.

## Deadlocks

Ein **[[Deadlock]]** entsteht, wenn Threads im Kreis aufeinander warten: A hält Sperre 1 und wartet auf Sperre 2, B hält Sperre 2 und wartet auf Sperre 1. Beide warten für immer.

\`\`\`python title="Deadlock durch unterschiedliche Sperr-Reihenfolge"
konto_a, konto_b = threading.Lock(), threading.Lock()

def ueberweise_a_nach_b():
    with konto_a:
        with konto_b:      # wartet auf B …
            ...

def ueberweise_b_nach_a():
    with konto_b:
        with konto_a:      # … während dieser Thread B hält und auf A wartet
            ...
\`\`\`

Ein Deadlock erfordert vier Bedingungen gleichzeitig (Coffman): gegenseitiger Ausschluss, Halten und Warten, keine Unterbrechbarkeit, zyklisches Warten. Bricht man eine, ist er ausgeschlossen. Praktische Regeln:

1. **Feste Sperr-Reihenfolge:** Sperren immer in derselben Reihenfolge anfordern (z. B. nach Konto-ID sortiert).
2. **Timeouts** beim Anfordern von Sperren (\`lock.acquire(timeout=1)\`).
3. **Kritische Abschnitte klein halten** – keine Netzwerkaufrufe, während eine Sperre gehalten wird.
4. Datenbanken erkennen Deadlocks selbst und brechen eine Transaktion ab – die Anwendung muss sie dann **wiederholen**.

## Modelle der Nebenläufigkeit

| Modell | Sprachen / Laufzeiten | Idee |
|---|---|---|
| **Betriebssystem-Threads** | Java, C#, C++, Rust | echte Parallelität; teuer bei Tausenden Threads |
| **Event Loop + async/await** | JavaScript/Node.js, Python asyncio, Dart | ein Thread, viele wartende Aufgaben; ideal für I/O |
| **Leichtgewichtige Threads (M:N)** | Go (Goroutines), Java 21 Virtual Threads, Erlang-Prozesse | Millionen Aufgaben auf wenigen OS-Threads; blockierender Code ohne Kosten |
| **Actor-Modell** | Erlang/Elixir, Akka | isolierte Actors mit Postfach, kein geteilter Zustand |
| **Prozesse** | Python \`multiprocessing\`, Webserver mit Worker-Prozessen | Isolation, echte Parallelität, aber teurere Kommunikation |

\`\`\`python title="Python asyncio: viele Anfragen gleichzeitig, ein Thread"
import asyncio
import httpx

async def lade(client: httpx.AsyncClient, url: str) -> int:
    antwort = await client.get(url, timeout=10)   # während des Wartens laufen andere Aufgaben
    return antwort.status_code

async def main() -> None:
    urls = [f"https://example.com/?seite={i}" for i in range(20)]
    async with httpx.AsyncClient() as client:
        ergebnisse = await asyncio.gather(*(lade(client, u) for u in urls))
    print(ergebnisse)

asyncio.run(main())
\`\`\`

\`\`\`java title="Java 21: Virtual Threads"
try (var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 10_000; i++) {
        int nr = i;
        executor.submit(() -> {
            Thread.sleep(java.time.Duration.ofSeconds(1));   // blockiert nur den virtuellen Thread
            return nr;
        });
    }
}   // wartet auf alle Aufgaben – 10.000 "Threads" in etwa einer Sekunde
\`\`\`

> [!EXPERT] Pythons GIL
> CPython hat einen **Global Interpreter Lock**: Es führt zu jedem Zeitpunkt nur einen Thread mit Python-Bytecode aus. Threads helfen daher bei I/O, nicht bei CPU-Last – dafür \`multiprocessing\` oder \`concurrent.futures.ProcessPoolExecutor\`. Seit Python 3.13 gibt es einen optionalen Build ohne GIL („free-threaded“, PEP 703); Standard ist er vorerst nicht. Ein Lock wie oben bleibt trotzdem nötig: \`zaehler += 1\` ist auch mit GIL nicht atomar.

> [!WARNING] Blockierender Code in der Event Loop
> In Node.js oder asyncio blockiert eine lange synchrone Berechnung (oder ein synchroner Datenbanktreiber) **alle** anderen Anfragen. CPU-intensive Arbeit gehört in Worker Threads (\`worker_threads\` in Node.js), einen Prozess-Pool oder eine [Queue](#/artikel/caching-queues).

## Checkliste

1. Muss das überhaupt nebenläufig sein? Einfacher Code ist leichter korrekt.
2. Geteilten, veränderlichen Zustand vermeiden – unveränderliche Daten und Nachrichten bevorzugen.
3. Wo Zustand geteilt wird: eine klare Sperre pro Datenstruktur, kurze kritische Abschnitte.
4. Feste Sperr-Reihenfolge und Timeouts gegen Deadlocks.
5. Datenbank-Constraints und Transaktionen statt „erst prüfen, dann schreiben“.
6. Race Detector bzw. Sanitizer in den Tests aktivieren.

## Wie geht es weiter?

Wie JavaScript Nebenläufigkeit mit einem einzigen Thread umsetzt, zeigt [Asynchrones JavaScript](#/artikel/async-javascript) – samt [Event-Loop-Visualisierung](#/labor/eventloop).

\`\`\`widget
quiz:Grundlagen 3
\`\`\`
`;export{e as default};
