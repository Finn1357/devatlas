const e=`---
id: replikation-sharding-backups
title: Replikation, Sharding & Backups
area: datenbanken
difficulty: profi
minutes: 21
order: 15
summary: Wie Datenbanken mit wachsender Last und Ausfällen umgehen – Replikation und Failover, Replikationsverzögerung, Partitionierung und Sharding, das CAP-Theorem und eine Backup-Strategie, die im Ernstfall wirklich funktioniert.
tags: [Replikation, Sharding, Partitionierung, CAP, Backup, Failover, PostgreSQL]
related: [indizes-transaktionen, nosql, system-design, hashing-hashtabellen]
---

## Wenn ein Server nicht mehr reicht

Eine einzelne Datenbank hat zwei Grenzen: **Leistung** (zu viele Anfragen, zu viele Daten) und **Verfügbarkeit** (fällt sie aus, steht alles). Bevor man verteilt, lohnt sich ein ehrlicher Blick: Ein gut indizierter PostgreSQL- oder MySQL-Server auf aktueller Hardware bewältigt Tausende Abfragen pro Sekunde und Terabytes an Daten. Verteilung bringt erhebliche Komplexität – sie sollte eine Antwort auf ein gemessenes Problem sein.

| Ansatz | Löst | Kosten |
|---|---|---|
| **Vertikal skalieren** (größerer Server) | Leistung | teurer, irgendwann am Limit, ein Ausfallpunkt |
| **Replikation** | Verfügbarkeit, Leselast | Verzögerung, Failover-Logik |
| **Partitionierung** | große Tabellen handhabbar | Planung des Partitionsschlüssels |
| **Sharding** | Schreiblast, Datenmenge | sehr hohe Komplexität |
| **Caching** | Leselast | Invalidierung – siehe [Caching & Queues](#/artikel/caching-queues) |

## Replikation

Bei der **[[Replikation]]** halten mehrere Server Kopien derselben Daten.

### Primary–Replica

Der häufigste Aufbau: Ein **Primary** nimmt alle Schreibvorgänge an und überträgt Änderungen an ein oder mehrere **Replicas**, die Leseanfragen beantworten können. In PostgreSQL wird dafür das Write-Ahead Log (WAL) gestreamt, in MySQL das Binary Log.

\`\`\`text
          Schreiben + Lesen
 App ───────────────────────►  Primary ──WAL──►  Replica 1  ◄── Lesen (Berichte, Suche)
                                       └──WAL──►  Replica 2  ◄── Lesen / Standby für Failover
\`\`\`

\`\`\`bash title="PostgreSQL: Replica aus einem Basis-Backup aufsetzen"
# Auf dem Replica-Server (Benutzer "replicator" mit REPLICATION-Recht auf dem Primary)
pg_basebackup -h primary.intern -U replicator -D /var/lib/postgresql/data -X stream -R -P
# -R schreibt standby.signal und primary_conninfo → der Server startet als Replica
\`\`\`

### Synchron oder asynchron?

| | Asynchron | Synchron |
|---|---|---|
| Bestätigung an die App | sobald der Primary geschrieben hat | erst, wenn mindestens ein Replica bestätigt hat |
| Latenz | gering | höher (Netzwerk-Roundtrip) |
| Datenverlust bei Ausfall des Primary | die letzten Transaktionen können fehlen | keiner (für bestätigte Transaktionen) |

### Replikationsverzögerung

Bei asynchroner Replikation hinken Replicas Millisekunden bis Sekunden hinterher (**Replication Lag**). Typischer Fehler: Ein Nutzer speichert sein Profil (Primary), die nächste Seite liest vom Replica – und zeigt den alten Stand.

> [!TIP] Read-your-writes
> Lies nach eigenen Schreibvorgängen für kurze Zeit vom Primary, oder route alle Lesezugriffe des schreibenden Nutzers dorthin. Replicas eignen sich gut für Auswertungen, Suche und Daten, bei denen Sekunden Verzögerung egal sind.

### Failover

Fällt der Primary aus, wird ein Replica **befördert** (Promotion). Werkzeuge wie Patroni (PostgreSQL) oder verwaltete Cloud-Datenbanken automatisieren das. Die schwierigen Fragen:
- Ist der Primary wirklich tot – oder nur kurz nicht erreichbar? Zwei Primaries gleichzeitig (**Split Brain**) führen zu widersprüchlichen Daten. Gegenmittel: Quorum-Entscheidungen (etcd, Consul) und das Abschotten des alten Primary (Fencing).
- Wie erfahren Anwendungen von der neuen Adresse? Über einen virtuellen Endpunkt, DNS oder einen Proxy (PgBouncer, HAProxy).

**Multi-Primary**-Replikation (mehrere Server nehmen Schreibvorgänge an) erfordert Konfliktauflösung und ist deutlich komplexer – sinnvoll vor allem bei geografisch verteilten Systemen.

## Partitionierung

**Partitionierung** teilt eine große Tabelle innerhalb **eines** Datenbankservers in kleinere physische Teile – meist nach Zeit:

\`\`\`sql title="PostgreSQL: deklarative Partitionierung nach Monat" norun
CREATE TABLE messwerte (
  zeit      TIMESTAMPTZ NOT NULL,
  sensor_id INTEGER     NOT NULL,
  wert      DOUBLE PRECISION
) PARTITION BY RANGE (zeit);

CREATE TABLE messwerte_2026_10 PARTITION OF messwerte FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
CREATE TABLE messwerte_2026_11 PARTITION OF messwerte FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');

-- Abfragen mit Zeitbedingung lesen nur die passenden Partitionen (Partition Pruning)
SELECT avg(wert) FROM messwerte WHERE zeit >= '2026-11-01';

-- Alte Daten entfernen: Partition abhängen statt Millionen DELETEs
ALTER TABLE messwerte DETACH PARTITION messwerte_2026_10;
DROP TABLE messwerte_2026_10;
\`\`\`

## Sharding

Beim **[[Sharding]]** werden die Daten auf **mehrere Server** verteilt; jeder Shard hält nur einen Teil. Damit skalieren auch Schreiblast und Datenmenge horizontal – um den Preis erheblicher Komplexität.

### Der Shard-Schlüssel entscheidet alles

| Strategie | Funktionsweise | Vorteil | Nachteil |
|---|---|---|---|
| **Bereich** | Kunden A–F auf Shard 1, G–M auf Shard 2 … | Bereichsabfragen effizient | ungleiche Verteilung, „heiße“ Shards |
| **Hash** | \`hash(kunde_id) % anzahl\` | gleichmäßige Verteilung | Bereichsabfragen über alle Shards; Umverteilung beim Hinzufügen |
| **Consistent Hashing** | Schlüssel und Server auf einem Ring | beim Hinzufügen wandert nur ein Bruchteil der Daten | aufwendiger |
| **Verzeichnis** | Lookup-Tabelle: Mandant → Shard | flexibel, einzelne Mandanten verschiebbar | zusätzlicher Dienst |

Ein guter Shard-Schlüssel sorgt dafür, dass **die meisten Abfragen nur einen Shard betreffen** – bei einer SaaS-Anwendung etwa die Mandanten-ID: Alle Daten eines Kunden liegen zusammen.

> [!WARNING] Was Sharding schwer macht
> JOINs und Transaktionen über Shards hinweg, eindeutige IDs ohne zentrale Vergabe, Umverteilung (Rebalancing) im laufenden Betrieb, Schemaänderungen auf allen Shards, Backups mit konsistentem Gesamtzustand. Werkzeuge wie Citus (PostgreSQL), Vitess (MySQL) oder von Grund auf verteilte Datenbanken (CockroachDB, YugabyteDB, Spanner) nehmen einen Teil dieser Arbeit ab.

## CAP-Theorem

Das **[[CAP-Theorem]]** besagt: Bei einer **Netzwerkpartition** (P) – Server können sich nicht mehr erreichen – muss ein verteiltes System wählen zwischen

- **Konsistenz (C):** Alle sehen denselben, aktuellen Stand – notfalls werden Anfragen abgelehnt.
- **Verfügbarkeit (A):** Jede Anfrage bekommt eine Antwort – notfalls mit veralteten Daten.

Da Netzwerkfehler in verteilten Systemen unvermeidlich sind, ist die eigentliche Wahl **CP oder AP** im Fehlerfall. Die Erweiterung **PACELC** ergänzt: Auch **ohne** Partition (Else) gibt es einen Zielkonflikt zwischen **Latenz** und **Konsistenz**.

| System | Typische Ausrichtung |
|---|---|
| PostgreSQL mit synchroner Replikation, etcd, ZooKeeper | CP |
| Cassandra, DynamoDB (Standard), DNS | AP mit „eventual consistency“ |
| MongoDB | konfigurierbar (Write/Read Concern) |

## Backups: Die Versicherung, die man testen muss

> [!DANGER] Replikation ist kein Backup
> Ein versehentliches \`DELETE FROM kunden;\` oder ein fehlerhaftes Migrationsskript wird in Millisekunden auf alle Replicas übertragen. Nur Backups schützen vor Bedienfehlern, Softwarefehlern und Ransomware.

### Zwei Kennzahlen

- **RPO** (Recovery Point Objective): Wie viele Daten dürfen maximal verloren gehen? (z. B. 5 Minuten)
- **RTO** (Recovery Time Objective): Wie lange darf die Wiederherstellung dauern? (z. B. 1 Stunde)

### Backup-Arten

| Art | Beispiel | Eigenschaften |
|---|---|---|
| **Logisch** | \`pg_dump\`, \`mysqldump\` | SQL/Archiv der Daten, versionsübergreifend, langsam bei großen Datenbanken |
| **Physisch** | \`pg_basebackup\`, Snapshots | Kopie der Datendateien, schnell, gleiche Hauptversion nötig |
| **Point-in-Time Recovery** | Basis-Backup + archivierte WAL-Dateien (z. B. mit pgBackRest, WAL-G) | Wiederherstellung auf jeden beliebigen Zeitpunkt – „kurz vor dem fatalen DELETE“ |

\`\`\`bash title="Logisches Backup und Wiederherstellung (PostgreSQL)"
pg_dump -Fc -h db.intern -U backup shop > shop_$(date +%F).dump    # komprimiertes Custom-Format
pg_restore --list shop_2026-11-05.dump | head                       # Inhalt prüfen
createdb -h test-db.intern shop_restore_test
pg_restore -h test-db.intern -d shop_restore_test --no-owner shop_2026-11-05.dump
\`\`\`

### Die 3-2-1-Regel

- **3** Kopien der Daten,
- auf **2** unterschiedlichen Medien bzw. Systemen,
- davon **1** an einem anderen Ort (anderes Rechenzentrum, andere Cloud-Region oder anderes Konto).

Ergänzend: mindestens eine Kopie **unveränderlich** (Object Lock / WORM) oder offline, damit ein kompromittierter Server die Backups nicht mitlöschen kann.

> [!TIP] Ein Backup gilt erst als Backup, wenn die Wiederherstellung getestet wurde
> Automatisiere regelmäßige Test-Wiederherstellungen in eine separate Umgebung und prüfe das Ergebnis (Zeilenzahlen, Stichproben, Anwendung startet). Miss dabei die tatsächliche Dauer – das ist dein realistisches RTO.

Backups enthalten alle Daten im Klartext der Datenbank: **verschlüsseln**, Zugriff streng beschränken, Aufbewahrungsfristen (auch DSGVO-Löschpflichten) festlegen.

## Verwaltete Datenbanken

Amazon RDS/Aurora, Google Cloud SQL/AlloyDB, Azure Database, Neon, Supabase und andere übernehmen Replikation, Failover, Backups und Point-in-Time Recovery per Konfiguration. Das spart viel Betriebsaufwand – die Verantwortung für **getestete Wiederherstellungen**, sinnvolle RPO/RTO-Ziele und Zugriffsrechte bleibt trotzdem bei dir.

## Wie geht es weiter?

Wie diese Bausteine in ein Gesamtsystem passen, zeigt [System Design](#/artikel/system-design). Grundlagen zu Transaktionen und Isolation stehen in [Indizes & Transaktionen](#/artikel/indizes-transaktionen).

\`\`\`widget
quiz:Datenbanken 3
\`\`\`
`;export{e as default};
