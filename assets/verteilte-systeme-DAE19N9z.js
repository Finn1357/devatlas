const e=`---
id: verteilte-systeme
title: Verteilte Systeme: Konsistenz, Replikation und Konsens
area: architektur
difficulty: profi
minutes: 22
order: 16
summary: Warum verteilte Systeme anders funktionieren als ein einzelner Server – Teilausfälle, Replikation, Konsistenzmodelle, logische Uhren, Quoren und der Konsensalgorithmus Raft, mit typischen Denkfehlern aus der Praxis.
tags: [Verteilte Systeme, Konsistenz, Replikation, Raft, Konsens, CAP, Quorum]
related: [system-design, replikation-sharding-backups, message-broker-events, resilienz-muster, architekturstile, kubernetes-grundlagen]
---

## Warum „verteilt“ alles verändert

Auf einem einzelnen Rechner gilt: Ein Funktionsaufruf kehrt zurück oder das Programm stürzt ab. Zwischen zwei Rechnern gibt es einen dritten Zustand: **Man weiß es nicht.** Eine Anfrage kann verloren gehen, die Antwort kann verloren gehen, der andere Rechner kann abgestürzt, überlastet oder durch eine Netzwerkstörung abgeschnitten sein – und von außen sehen alle diese Fälle gleich aus: Es kommt keine Antwort.

> [!BEGINNER] Ein Bild dazu
> Du schickst einer Kollegin eine Nachricht: „Kannst du die Rechnung bezahlen?“ Es kommt keine Antwort. Hat sie die Nachricht nicht bekommen? Hat sie bezahlt und vergessen zu antworten? Ist ihr Handy aus? Wenn du jetzt selbst bezahlst, wurde die Rechnung vielleicht doppelt bezahlt. Genau dieses Dilemma lösen verteilte Systeme ständig.

Die klassischen **Irrtümer über verteilte Systeme** (Peter Deutsch und Kollegen bei Sun) fassen zusammen, was Entwickler unbewusst annehmen und was nicht stimmt: Das Netz ist zuverlässig, die Latenz ist null, die Bandbreite ist unbegrenzt, das Netz ist sicher, die Topologie ändert sich nicht, es gibt genau einen Administrator, Transport kostet nichts, das Netz ist homogen.

Daraus folgen drei Grundtatsachen, auf denen alles Weitere aufbaut:

1. **Teilausfälle sind normal.** Ein Teil des Systems funktioniert, ein anderer nicht – oft nur für einige Sekunden.
2. **Langsam und tot sind nicht unterscheidbar.** Ein [[Timeout]] ist immer nur eine Vermutung.
3. **Es gibt keine gemeinsame Uhr.** Jeder Rechner hat seine eigene, und die Uhren laufen unterschiedlich schnell.

## Replikation: Daten mehrfach halten

[[Replikation]] bedeutet, dieselben Daten auf mehreren Knoten zu speichern – für Ausfallsicherheit, für Lesegeschwindigkeit nahe am Nutzer oder für Skalierung. Die Schwierigkeit liegt bei den **Änderungen**: Wie gelangen sie zuverlässig auf alle Kopien?

| Verfahren | Wer nimmt Schreibzugriffe an? | Stärke | Schwäche |
|---|---|---|---|
| **Leader–Follower** (Primary–Replica) | genau ein Leader | einfach, klare Reihenfolge | Leader-Ausfall erfordert Umschalten (Failover) |
| **Multi-Leader** | mehrere Leader (z. B. je Rechenzentrum) | schreiben auch bei getrennten Standorten | Konflikte zwischen gleichzeitigen Änderungen |
| **Leaderlos** (Dynamo-Stil) | jeder Knoten | sehr verfügbar | Konflikte und Quoren müssen sauber gelöst werden |

Zusätzlich entscheidet man, ob der Leader auf die Bestätigung der Follower **wartet** (synchron: sicher, aber langsamer und anfällig für langsame Follower) oder nicht (asynchron: schnell, aber bei Leader-Ausfall gehen die letzten Änderungen eventuell verloren). Viele Datenbanken nutzen einen Mittelweg: mindestens ein Follower synchron, der Rest asynchron. Details zu PostgreSQL-Replikation und Backups stehen in [Replikation, Sharding & Backups](#/artikel/replikation-sharding-backups).

### Quoren: Mehrheiten statt Einstimmigkeit

Bei leaderloser Replikation mit *N* Kopien gilt ein Schreibvorgang als erfolgreich, wenn *W* Knoten ihn bestätigen; ein Lesevorgang fragt *R* Knoten. Ist **W + R > N**, überschneiden sich Lese- und Schreibmenge immer in mindestens einem Knoten – der Leser sieht also mindestens eine aktuelle Kopie. Man spricht von einem [[Quorum]].

\`\`\`python title="Überschneiden sich Lese- und Schreibquorum?"
from itertools import combinations

def quorum_ok(n: int, w: int, r: int) -> bool:
    knoten = range(n)
    # Gibt es eine Schreibmenge und eine Lesemenge OHNE gemeinsamen Knoten?
    for schreib in combinations(knoten, w):
        for lese in combinations(knoten, r):
            if not set(schreib) & set(lese):
                return False
    return True

for n, w, r in [(3, 2, 2), (3, 1, 1), (5, 3, 3), (5, 2, 3)]:
    print(f"N={n} W={w} R={r}: W+R>N? {w + r > n}  überschneidend? {quorum_ok(n, w, r)}")
\`\`\`

Die Ausgabe bestätigt die Regel: Nur wenn *W + R > N* ist, gibt es keine Lesemenge, die alle frischen Kopien verpasst.

## Konsistenzmodelle: Was sieht ein Leser?

„Konsistenz“ ist in verteilten Systemen kein Ja/Nein, sondern ein Versprechen mit verschiedenen Stärken. Die wichtigsten von stark nach schwach:

| Modell | Versprechen | Beispiel |
|---|---|---|
| Linearisierbarkeit | Das System verhält sich, als gäbe es nur **eine** Kopie; nach einem bestätigten Schreiben sehen alle Leser den neuen Wert | Sperren, eindeutige Benutzernamen, Kontostand-Prüfung |
| **Kausale Konsistenz** | Was voneinander abhängt, sieht jeder in derselben Reihenfolge (Antwort nie vor der Frage) | Kommentare und Antworten |
| **Read-your-writes** | Du siehst immer deine eigenen Änderungen | Profil speichern und neu laden |
| **Monotone Reads** | Du siehst nie einen älteren Stand als vorher | Feed springt nicht „zurück“ |
| [[Eventual Consistency]] | Ohne neue Änderungen werden irgendwann alle Kopien gleich | DNS, Like-Zähler, Caches |

> [!MISTAKE] Lesen vom Replikat direkt nach dem Schreiben
> Ein Nutzer ändert seinen Namen (Schreiben auf den Leader), die nächste Seite liest von einem asynchronen Replikat – und zeigt den alten Namen. Abhilfe: Lesezugriffe des Nutzers kurz nach einem eigenen Schreiben an den Leader leiten oder auf eine Replikationsposition warten, die mindestens so neu ist wie das eigene Schreiben.

### CAP und PACELC richtig verstehen

Das [[CAP-Theorem]] wird oft als „wähle zwei aus drei“ zitiert. Präziser: **Während einer Netzwerkpartition** muss sich ein System entscheiden, ob es weiter antwortet (Verfügbarkeit, mit eventuell veralteten Daten) oder Anfragen ablehnt, bis die Kopien sich wieder abstimmen können (Konsistenz im Sinne von Linearisierbarkeit). Ohne Partition stellt sich die Frage nicht.

**PACELC** ergänzt den Normalfall: *If Partition → Availability or Consistency; Else → Latency or Consistency.* Auch ohne Störung kostet starke Konsistenz Latenz, weil auf Bestätigungen anderer Knoten gewartet werden muss – besonders über Rechenzentrumsgrenzen hinweg.

## Zeit und Reihenfolge

Uhren verschiedener Rechner weichen voneinander ab, NTP-Korrekturen können eine Uhr sogar **rückwärts** springen lassen. Wer Ereignisse auf verschiedenen Rechnern nach Zeitstempel ordnet, ordnet sie deshalb manchmal falsch.

> [!DANGER] „Last write wins“ mit Uhrzeit
> Zwei Knoten speichern gleichzeitig verschiedene Werte; gewinnen soll der neuere. Läuft die Uhr von Knoten A 300 ms vor, gewinnt A immer – auch wenn B tatsächlich später geschrieben hat. Die Änderung von B verschwindet still.

**Logische Uhren** ordnen Ereignisse ohne echte Zeit. Eine [[Lamport-Uhr]] ist ein Zähler pro Knoten mit zwei Regeln: Vor jedem Ereignis erhöhen; beim Empfang einer Nachricht auf \`max(eigener, empfangener) + 1\` setzen. Damit gilt: Wenn A ursächlich vor B passiert ist, hat A den kleineren Zeitstempel.

\`\`\`python title="Lamport-Uhren: Nachrichten zwischen zwei Knoten"
class Knoten:
    def __init__(self, name):
        self.name, self.uhr = name, 0

    def ereignis(self, was):
        self.uhr += 1
        print(f"{self.name} @{self.uhr}: {was}")

    def senden(self, was):
        self.ereignis(f"sendet {was!r}")
        return (was, self.uhr)

    def empfangen(self, nachricht):
        was, zeit = nachricht
        self.uhr = max(self.uhr, zeit)
        self.ereignis(f"empfängt {was!r}")

a, b = Knoten("A"), Knoten("B")
for _ in range(5):
    b.ereignis("lokale Arbeit")           # B ist "weiter" als A
m = a.senden("Bestellung 17")
b.empfangen(m)                            # B springt NICHT zurück
antwort = b.senden("Bestätigung 17")
a.empfangen(antwort)                      # A springt nach vorn: Antwort liegt hinter der Bestellung
\`\`\`

Lamport-Uhren erkennen allerdings nicht, ob zwei Ereignisse **gleichzeitig** (unabhängig) waren. Dafür gibt es Vektoruhren: ein Zähler pro Knoten, mit dem sich „vorher“, „nachher“ und „nebenläufig“ unterscheiden lassen – nebenläufige Schreibzugriffe sind dann echte Konflikte, die man auflösen oder dem Nutzer zeigen muss.

## Konsens: Sich auf eine Sache einigen

Viele Aufgaben brauchen eine Entscheidung, die alle Knoten teilen: Wer ist der Leader? Welcher Eintrag steht an Position 42 des Logs? Wurde die Sperre vergeben? Ein [[Konsensalgorithmus]] löst das, solange eine **Mehrheit** der Knoten erreichbar ist. Bekannte Verfahren sind Paxos und **Raft**; eingesetzt werden sie z. B. in etcd (dem Datenspeicher von Kubernetes), Consul oder in replizierten Datenbanken.

### Raft in drei Schritten

1. **Leader-Wahl.** Jeder Knoten ist Follower und erwartet regelmäßige Lebenszeichen (Heartbeats) des Leaders. Bleiben sie aus, wird er nach einer **zufälligen** Wartezeit Kandidat, erhöht die Amtszeit (*Term*) und bittet um Stimmen. Wer die Mehrheit bekommt, ist Leader. Die zufälligen Zeiten verhindern, dass ständig mehrere gleichzeitig kandidieren.
2. **Log-Replikation.** Alle Schreibzugriffe gehen an den Leader. Er hängt sie an sein Log und schickt sie an die Follower.
3. **Commit bei Mehrheit.** Hat eine Mehrheit den Eintrag gespeichert, gilt er als festgeschrieben und wird angewendet. Ein neuer Leader kann nur gewählt werden, wenn sein Log alle festgeschriebenen Einträge enthält – deshalb geht nichts Bestätigtes verloren.

\`\`\`text title="Mehrheiten: Wie viele Ausfälle verkraftet ein Cluster?"
Knoten   Mehrheit   tolerierte Ausfälle
  3         2              1
  4         3              1      ← kein Gewinn gegenüber 3 Knoten!
  5         3              2
  7         4              3
Allgemein: 2f + 1 Knoten tolerieren f Ausfälle.
\`\`\`

> [!TIP] Warum Mehrheit?
> Zwei Mehrheiten derselben Gruppe überschneiden sich immer in mindestens einem Knoten. Dieser Knoten „erinnert“ sich an die letzte Entscheidung – so können zwei getrennte Hälften nie gleichzeitig unterschiedliche Leader wählen ([[Split Brain]]). Die kleinere Seite einer Partition bleibt dafür handlungsunfähig: Das ist die „C“-Entscheidung aus CAP.

Konsens ist teuer: Jede Entscheidung braucht mindestens eine Netzwerkrunde zur Mehrheit. Deshalb nutzt man ihn für **Koordinationsdaten** (Konfiguration, Leader, Sperren, Metadaten), nicht für jeden einzelnen Klick.

## Verteilte Transaktionen und „genau einmal“

Soll eine Bestellung im Bestellservice **und** die Zahlung im Zahlungsservice gespeichert werden, gibt es keine gemeinsame Datenbanktransaktion. Zwei Ansätze:

- **Zwei-Phasen-Commit (2PC):** Ein Koordinator fragt alle Teilnehmer „Kannst du festschreiben?“ und sendet erst nach allen Zusagen „Festschreiben!“. Korrekt, aber blockierend: Fällt der Koordinator zwischen beiden Phasen aus, warten die Teilnehmer mit gesperrten Daten.
- **Saga-Muster:** Eine Folge lokaler Transaktionen, jede mit einer **Ausgleichsaktion** (Zahlung erstatten, Bestellung stornieren). Keine globalen Sperren, dafür sind Zwischenzustände sichtbar und müssen fachlich sinnvoll sein.

Nachrichtensysteme liefern in der Praxis **mindestens einmal** (at-least-once): Nach einem Timeout wird erneut gesendet, und eine Nachricht kann doppelt ankommen. „Genau einmal“ entsteht erst durch die Kombination aus Wiederholung und **[[Idempotenz|idempotenter]] Verarbeitung**, etwa über eine eindeutige Nachrichten-ID, die der Empfänger in derselben Transaktion wie das Ergebnis speichert. Das [[Outbox-Muster]] sorgt auf der Senderseite dafür, dass Datenbankänderung und Nachricht nicht auseinanderlaufen.

\`\`\`sql title="Idempotente Verarbeitung: Duplikat erkennen, in derselben Transaktion"
BEGIN;
INSERT INTO verarbeitete_nachrichten (nachricht_id) VALUES ('b7c1-…');  -- PRIMARY KEY
-- schlägt bei einem Duplikat mit einer Eindeutigkeitsverletzung fehl → ROLLBACK, Nachricht bestätigen
UPDATE konten SET saldo = saldo - 25 WHERE id = 42;
COMMIT;
\`\`\`

## Typische Fehler

> [!MISTAKE] Gerade Knotenzahl „für mehr Sicherheit“
> Vier Knoten tolerieren wie drei nur einen Ausfall, brauchen aber mehr Stimmen pro Entscheidung. Konsens-Cluster haben deshalb 3, 5 oder 7 Mitglieder.

- **Timeouts als Wahrheit behandeln:** Nach einem Timeout ist der Zustand *unbekannt*, nicht „fehlgeschlagen“. Vor einer Wiederholung muss klar sein, dass sie nichts doppelt ausführt.
- **Wanduhren für Reihenfolgen oder Sperrfristen** verwenden, ohne Toleranzen für abweichende Uhren einzuplanen.
- **Exactly-once vom Broker erwarten**, statt Empfänger idempotent zu bauen.
- **Konsens für alles** einsetzen und sich über Latenz wundern – oder umgekehrt Leader-Wahl selbst mit Heartbeats „basteln“, statt etcd, Consul, ZooKeeper oder die Mechanismen der Datenbank zu nutzen.
- **Replikationsverzögerung ignorieren:** Asynchrone Replikate können Sekunden (bei Last auch länger) hinterherhinken; Dashboards und Tests sollten das sichtbar machen.

## Übungsfragen

> 1. Ein leaderloses System hat N = 5 Kopien. Welche Kombinationen aus W und R garantieren, dass ein Leser einen bestätigten Schreibvorgang sieht? Welche davon ist für einen schreibintensiven Dienst günstig?
> 2. Ein Raft-Cluster mit 5 Knoten wird in zwei Gruppen (3 und 2) getrennt. Was passiert auf jeder Seite mit Lese- und Schreibzugriffen?
> 3. Warum reicht es nicht, Nachrichten nach ihrem Sende-Zeitstempel zu sortieren, um die richtige Reihenfolge von Kontobewegungen zu bestimmen?

\`\`\`widget
quiz:Verteilte Systeme 5
\`\`\`

## Wie geht es weiter?

Wie man mit Fehlern rechnet, ohne den Gesamtdienst zu gefährden, zeigt [Resilienz-Muster](#/artikel/resilienz-muster). Ereignisgetriebene Kommunikation zwischen Diensten behandelt [Message Broker & Events](#/artikel/message-broker-events), den Gesamtentwurf großer Systeme [System Design](#/artikel/system-design).
`;export{e as default};
