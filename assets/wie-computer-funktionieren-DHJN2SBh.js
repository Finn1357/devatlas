const e=`---
id: wie-computer-funktionieren
title: Wie funktioniert ein Computer?
area: grundlagen
difficulty: einsteiger
minutes: 15
order: 10
summary: CPU, Arbeitsspeicher, Caches und Datenträger, Betriebssystem, Prozesse und Threads – das mentale Modell, das jede Programmiererin und jeder Programmierer braucht.
tags: [CPU, RAM, Betriebssystem, Prozess, Thread, Hardware]
related: [compiler-interpreter-runtime, zahlensysteme-encoding, netzwerke-tcp-ip-dns, big-o, betriebssysteme-prozesse]
---

## Das Grundprinzip

Ein Computer macht im Kern immer dasselbe: Er **lädt Befehle und Daten aus dem Speicher, verarbeitet sie und schreibt Ergebnisse zurück** – Milliarden Mal pro Sekunde. Alles, was du programmierst, wird am Ende zu solchen einfachen Befehlen: Zahl laden, addieren, vergleichen, springen, speichern.

## Die CPU

Die [[CPU]] (Central Processing Unit) arbeitet im **Fetch-Decode-Execute-Zyklus**:

1. **Fetch:** Den nächsten Befehl aus dem Speicher holen (die Adresse steht im Befehlszeiger).
2. **Decode:** Herausfinden, was der Befehl bedeutet.
3. **Execute:** Ausführen – rechnen, vergleichen, Daten bewegen.

Die CPU rechnet in **Registern** – winzigen, extrem schnellen Speicherplätzen direkt im Prozessor. Moderne CPUs haben mehrere **Kerne**, die unabhängig Befehle ausführen, und nutzen Tricks wie Pipelining, Sprungvorhersage und Out-of-Order-Ausführung, um pro Takt mehrere Befehle zu schaffen.

> [!BEGINNER]
> Die CPU ist wie ein extrem schneller, aber sehr wörtlich denkender Koch: Er kann nur einfache Handgriffe („nimm Zutat aus Fach 7“, „addiere“, „wenn leer, spring zu Schritt 12“) – aber davon drei Milliarden pro Sekunde.

## Speicher: schnell und klein bis langsam und groß

\`\`\`widget
layers:speicherhierarchie
\`\`\`

- **[[RAM]] (Arbeitsspeicher):** Hier liegen laufende Programme und ihre Daten. Flüchtig – beim Ausschalten weg.
- **CPU-[[Cache|Caches]] (L1–L3):** Kleine Kopien häufig genutzter RAM-Daten direkt bei der CPU. Ein Zugriff auf den RAM kostet die CPU sonst hunderte Takte Wartezeit.
- **SSD/Festplatte:** Dauerhafte Speicherung, aber um Größenordnungen langsamer.

> [!EXPERT] Warum das für Code wichtig ist
> Daten, die im Speicher **nebeneinander** liegen, lädt die CPU als ganze Cache-Line (meist 64 Byte). Darum ist das Durchlaufen eines [[Array|Arrays]] oft viel schneller als das einer [[Linked List|verketteten Liste]] – obwohl beide O(n) sind. Dieses Prinzip heißt **Lokalität**.

## Das Betriebssystem

Das [[Betriebssystem]] verwaltet die Hardware und teilt sie zwischen Programmen auf. Sein privilegierter Kern, der [[Kernel]], kümmert sich um:

- **Prozessverwaltung:** Welches Programm bekommt wann CPU-Zeit (Scheduling)?
- **Speicherverwaltung:** Jedes Programm sieht seinen eigenen, virtuellen Adressraum.
- **Dateisysteme:** Dateien und Ordner auf Datenträgern ([[Dateisystem]]).
- **Geräte und Netzwerk:** Treiber, Netzwerk-Stack.
- **Sicherheit:** Benutzer, Rechte, Isolation.

Programme sprechen den Kernel über **[[Systemaufruf|Systemaufrufe]]** an – etwa „öffne diese Datei“ oder „sende diese Daten übers Netzwerk“. Selbst ein einfaches \`print("Hallo")\` endet in einem \`write\`-Systemaufruf.

## Prozesse und Threads

Ein **[[Prozess]]** ist ein laufendes Programm mit eigenem Speicherbereich. Prozesse sind voneinander isoliert: Stürzt einer ab, laufen die anderen weiter.

Ein **[[Thread]]** ist ein Ausführungsstrang innerhalb eines Prozesses. Alle Threads eines Prozesses **teilen sich den Speicher** – das macht die Zusammenarbeit schnell, aber gefährlich: Greifen zwei Threads gleichzeitig auf dieselben Daten zu, entstehen [[Race Condition|Race Conditions]].

\`\`\`python title="Race Condition: zwei Threads, ein Zähler"
import threading

zaehler = 0

def erhoehe():
    global zaehler
    for _ in range(1_000_000):
        zaehler += 1          # lesen → addieren → schreiben: nicht atomar!

threads = [threading.Thread(target=erhoehe) for _ in range(2)]
for t in threads: t.start()
for t in threads: t.join()
print(zaehler)                # kann (je nach Python-Version und Timing) kleiner als 2.000.000 sein

# Lösung: Zugriff mit einem Lock schützen
lock = threading.Lock()
def erhoehe_sicher():
    global zaehler
    for _ in range(1_000_000):
        with lock:
            zaehler += 1
\`\`\`

| | Prozess | Thread |
|---|---|---|
| Speicher | eigener Adressraum | geteilt mit anderen Threads des Prozesses |
| Erzeugung | teurer | billiger |
| Kommunikation | über IPC (Pipes, Sockets) | über gemeinsamen Speicher (+ Synchronisation) |
| Absturz | betrifft nur diesen Prozess | kann den ganzen Prozess beenden |

[[Nebenläufigkeit]] (mehrere Aufgaben überlappend) ist nicht dasselbe wie [[Parallelität]] (wirklich gleichzeitig auf mehreren Kernen) – JavaScript ist z. B. nebenläufig, aber single-threaded (siehe [Event Loop](#/artikel/async-javascript)).

## Was passiert, wenn du ein Programm startest?

1. Die Shell bittet den Kernel per Systemaufruf, einen neuen Prozess zu erzeugen.
2. Der Kernel lädt die ausführbare Datei, richtet virtuellen Speicher ein und lädt benötigte Bibliotheken.
3. Der Scheduler gibt dem Prozess CPU-Zeit; die CPU beginnt, seine Befehle auszuführen.
4. Für jede Ein-/Ausgabe (Datei, Netzwerk, Bildschirm) ruft das Programm den Kernel auf.
5. Am Ende liefert der Prozess einen [[Exit Code]] zurück.

## Wie geht es weiter?

Wie aus deinem Quellcode überhaupt Maschinenbefehle werden, erklärt [Compiler, Interpreter & Runtime](#/artikel/compiler-interpreter-runtime). Wie Zahlen und Text als Bits gespeichert werden, zeigt [Zahlensysteme & Encoding](#/artikel/zahlensysteme-encoding).
`;export{e as default};
