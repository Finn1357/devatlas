const e=`---
id: betriebssysteme-prozesse
title: Betriebssysteme: Prozesse, Threads, Speicher & Dateien
area: grundlagen
difficulty: fortgeschritten
minutes: 20
order: 14
summary: Was ein Betriebssystem für Programme tut – Kernel und Systemaufrufe, Prozesse und Threads, Scheduling, virtueller Speicher, Dateideskriptoren und Signale – mit praktischen Befehlen für Linux und Windows.
tags: [Betriebssystem, Prozess, Thread, Kernel, Systemaufruf, Virtueller Speicher, Signale]
related: [wie-computer-funktionieren, speicherverwaltung, nebenlaeufigkeit, linux-server-nginx]
---

## Wozu ein Betriebssystem?

Ohne Betriebssystem müsste jedes Programm selbst wissen, wie man eine bestimmte SSD anspricht, Tastatureingaben liest oder Speicher verwaltet – und jedes Programm könnte alle anderen stören. Das **[[Betriebssystem]]** (Linux, Windows, macOS, Android, iOS) übernimmt drei Aufgaben:

1. **Abstraktion:** einheitliche Schnittstellen für Hardware – „Datei öffnen“ statt „Sektor 4711 lesen“.
2. **Ressourcenverwaltung:** CPU-Zeit, Speicher, Geräte fair auf Programme verteilen.
3. **Isolation und Schutz:** Programme können sich (und den Kernel) nicht gegenseitig beschädigen.

## Kernel und User Space

Der **[[Kernel]]** ist der Kern des Betriebssystems und läuft im privilegierten Modus der CPU: Er darf direkt auf Hardware und den gesamten Speicher zugreifen. Normale Programme laufen im **User Space** mit eingeschränkten Rechten. Brauchen sie etwas vom Kernel – eine Datei lesen, Speicher anfordern, ein Netzwerkpaket senden –, machen sie einen **[[Systemaufruf]]** (System Call).

\`\`\`text
 Programm:   open("daten.txt")   read(fd, puffer, 4096)   write(1, "Hallo\\n", 6)
     │                │                    │
─────┼────────────────┼────────────────────┼─────────── Grenze User Space / Kernel
     ▼                ▼                    ▼
 Kernel:     Dateisystem → Treiber → Datenträger      Terminal-Treiber
\`\`\`

\`\`\`bash title="Systemaufrufe beobachten (Linux)"
strace -c ls /tmp            # Zusammenfassung: welche Systemaufrufe wie oft
strace -e trace=openat cat /etc/hostname   # nur Dateizugriffe anzeigen
\`\`\`

Die Standardbibliothek deiner Sprache (\`open()\` in Python, \`fs.readFile\` in Node.js, \`File.ReadAllText\` in C#) ruft letztlich genau diese Systemaufrufe auf.

## Prozesse

Ein **[[Prozess]]** ist ein laufendes Programm mit eigenem, isoliertem Adressraum, einer Prozess-ID (PID), geöffneten Dateien, Umgebungsvariablen und mindestens einem Thread.

### Lebenszyklus

\`\`\`text
 neu ──► bereit ◄──────► laufend ──► beendet
           ▲                │
           └── blockiert ◄──┘   (wartet auf I/O, Timer, Sperre …)
\`\`\`

Ein Prozess ist meist **blockiert** – er wartet auf Festplatte, Netzwerk oder Benutzereingaben. Nur bereite Prozesse konkurrieren um die CPU.

### Prozesse erzeugen

Unter Unix entsteht ein neuer Prozess durch \`fork()\` (Kopie des aktuellen Prozesses), der dann mit \`exec()\` ein anderes Programm lädt. So startet die Shell jeden Befehl. Windows nutzt \`CreateProcess()\`. In Hochsprachen:

\`\`\`python title="Einen Kindprozess starten (Python)"
import subprocess

ergebnis = subprocess.run(
    ["git", "status", "--short"],      # Liste statt String: keine Shell, keine Injection
    capture_output=True, text=True, timeout=10,
)
print(ergebnis.returncode)             # Exit Code: 0 = Erfolg
print(ergebnis.stdout)
\`\`\`

Jeder Prozess endet mit einem **[[Exit Code]]**: 0 bedeutet Erfolg, alles andere einen Fehler. Shells, CI-Systeme und Container-Orchestrierung werten ihn aus.

### Signale

**Signale** sind kurze Nachrichten an einen Prozess:

| Signal | Bedeutung | Abfangbar? |
|---|---|---|
| \`SIGINT\` (2) | Strg+C im Terminal | ja |
| \`SIGTERM\` (15) | „Bitte sauber beenden“ – Standard von \`kill\`, \`docker stop\`, Kubernetes | ja |
| \`SIGKILL\` (9) | sofort beenden, ohne Aufräumen | **nein** |
| \`SIGHUP\` (1) | Terminal geschlossen; viele Dienste laden damit ihre Konfiguration neu | ja |

\`\`\`python title="Graceful Shutdown: auf SIGTERM reagieren"
import signal, sys

def beenden(signum, frame):
    print("SIGTERM empfangen – offene Anfragen abschließen, Verbindungen schließen …")
    sys.exit(0)

signal.signal(signal.SIGTERM, beenden)
\`\`\`

> [!WARNING] PID 1 im Container
> Im Container ist dein Programm oft Prozess 1. PID 1 ignoriert Signale ohne eigenen Handler – \`docker stop\` wartet dann 10 Sekunden und schickt \`SIGKILL\`. Lösung: Signale im Programm behandeln, die Exec-Form \`CMD ["node", "server.js"]\` statt Shell-Form verwenden oder \`docker run --init\`. Siehe [Dockerfiles](#/artikel/dockerfile).

## Threads

Ein **[[Thread]]** ist ein Ausführungsstrang innerhalb eines Prozesses. Threads eines Prozesses **teilen sich den Speicher** – das macht die Kommunikation schnell, aber auch gefährlich ([Race Conditions](#/artikel/nebenlaeufigkeit)).

| | Prozess | Thread |
|---|---|---|
| Speicher | eigener, isolierter Adressraum | gemeinsam mit anderen Threads des Prozesses |
| Erzeugen | relativ teuer | günstiger |
| Absturz | betrifft nur diesen Prozess | kann den ganzen Prozess mitreißen |
| Kommunikation | über Pipes, Sockets, Shared Memory, Dateien | direkt über gemeinsame Variablen |
| Beispiel | Chrome: ein Prozess pro Tab (Isolation) | Webserver: Thread-Pool für Anfragen |

## Scheduling

Ein CPU-Kern führt zu jedem Zeitpunkt genau einen Thread aus. Der **Scheduler** des Kernels verteilt die Rechenzeit in kurzen **Zeitscheiben** (Millisekunden) und unterbricht Threads, wenn ihre Zeit abgelaufen ist (**präemptives Multitasking**). So entsteht der Eindruck, Hunderte Programme liefen gleichzeitig.

Der Wechsel zwischen Threads (**Kontextwechsel**) kostet Zeit: Register sichern und laden, Caches werden „kalt“. Deshalb skalieren Systeme mit Tausenden blockierender Threads schlecht – ein Grund für Event-Loops und leichtgewichtige Threads (Goroutines, Java Virtual Threads).

\`\`\`bash
nice -n 10 ./backup.sh        # mit niedrigerer Priorität starten
renice -n 5 -p 4711           # Priorität eines laufenden Prozesses ändern
\`\`\`

## Virtueller Speicher

Jeder Prozess sieht einen eigenen, scheinbar riesigen und zusammenhängenden **virtuellen Adressraum**. Die **MMU** (Memory Management Unit) der CPU übersetzt virtuelle in physische Adressen – in **Seiten** (Pages) von typischerweise 4 KB, anhand von Seitentabellen, die der Kernel verwaltet.

Das ermöglicht:
- **Isolation:** Ein Prozess kann den Speicher eines anderen nicht einmal adressieren.
- **Lazy Allocation:** Speicher wird erst beim ersten Zugriff physisch belegt (Page Fault → Kernel stellt eine Seite bereit).
- **Swapping:** Selten genutzte Seiten werden auf die Festplatte ausgelagert – kostet bei Zugriff drastisch Zeit.
- **Gemeinsame Seiten:** Bibliotheken liegen nur einmal im RAM; \`fork()\` kopiert Seiten erst beim Schreiben (Copy-on-Write).

> [!INFO] Der OOM Killer
> Geht Linux der Speicher aus, beendet der **Out-of-Memory Killer** einen Prozess mit hohem Verbrauch. In Containern mit Speicherlimit sieht man dann \`OOMKilled\` und Exit Code 137 (128 + 9 = SIGKILL).

## Dateien und Dateideskriptoren

Öffnet ein Prozess eine Datei, erhält er einen **Dateideskriptor** – eine kleine Zahl, die auf einen Eintrag in einer Tabelle des Kernels verweist. Drei sind immer offen:

| Nummer | Name | Standard |
|---|---|---|
| 0 | stdin | Tastatur / Pipe-Eingabe |
| 1 | stdout | Terminal / Pipe-Ausgabe |
| 2 | stderr | Terminal (Fehlermeldungen) |

Unter Unix gilt „alles ist eine Datei“: Auch Pipes, Netzwerkverbindungen (Sockets) und Geräte (\`/dev/null\`) werden über Dateideskriptoren angesprochen. Deshalb funktionieren Umleitungen so einheitlich:

\`\`\`bash
programm > ausgabe.txt 2> fehler.txt   # stdout und stderr getrennt umleiten
programm 2>&1 | tee log.txt             # stderr auf stdout legen, beides weiterleiten
ls -l /proc/$$/fd                       # offene Deskriptoren der aktuellen Shell (Linux)
lsof -i :8080                           # welcher Prozess hält Port 8080?
\`\`\`

> [!MISTAKE] „Too many open files“
> Jeder Prozess hat ein Limit für offene Deskriptoren (\`ulimit -n\`, oft 1024). Werden Dateien oder Verbindungen nicht geschlossen, ist es irgendwann erreicht. Deshalb \`with open(...)\` in Python, \`try-with-resources\` in Java, \`using\` in C#, \`defer f.Close()\` in Go.

Dateisysteme (ext4, XFS, Btrfs, NTFS, APFS) organisieren Daten in Blöcken; unter Unix beschreibt ein **Inode** Metadaten wie Größe, Besitzer und [Rechte](#/labor/linux) – der Dateiname ist nur ein Verweis darauf.

## Werkzeuge im Alltag

| Aufgabe | Linux/macOS | Windows (PowerShell) |
|---|---|---|
| Prozesse auflisten | \`ps aux\`, \`top\`, \`htop\` | \`Get-Process\` |
| Prozess beenden | \`kill PID\`, \`kill -9 PID\` | \`Stop-Process -Id PID\` |
| Wer nutzt einen Port? | \`ss -tlnp\`, \`lsof -i :80\` | \`Get-NetTCPConnection -LocalPort 80\` |
| Speicher | \`free -h\` | \`Get-CimInstance Win32_OperatingSystem\` |
| Systemaufrufe verfolgen | \`strace\`, \`dtruss\` (macOS) | Process Monitor (Sysinternals) |
| Dienste | \`systemctl status nginx\` | \`Get-Service\` |

## Wie geht es weiter?

Wie Programme den Speicher innerhalb ihres Prozesses verwalten, erklärt [Speicherverwaltung](#/artikel/speicherverwaltung); wie mehrere Threads sicher zusammenarbeiten, [Nebenläufigkeit & Parallelität](#/artikel/nebenlaeufigkeit). Container nutzen genau diese Kernel-Funktionen (Namespaces, cgroups) zur Isolation – siehe [Docker-Grundlagen](#/artikel/docker-grundlagen).
`;export{e as default};
