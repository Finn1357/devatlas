const e=`---
id: docker-grundlagen
title: Docker-Grundlagen: Container verstehen
area: devops
difficulty: einsteiger
minutes: 18
order: 10
summary: Was Container sind, welches Problem sie lösen, wie sie sich von virtuellen Maschinen unterscheiden und wie Images, Container, Registries und die Docker Engine zusammenspielen.
tags: [Docker, Container, Images, Registry, Grundlagen]
related: [dockerfile, docker-compose, docker-volumes-netzwerke, docker-sicherheit, kubernetes-grundlagen]
---

## Was ist Docker?

[[Docker]] ist eine Plattform, mit der du Anwendungen samt allem, was sie zum Laufen brauchen – Laufzeitumgebung, Bibliotheken, Systemwerkzeuge, Konfiguration –, in ein standardisiertes Paket schnürst: ein **[[Image]]**. Aus diesem Image startest du beliebig viele **[[Container]]**: isolierte Prozesse, die auf jedem Rechner mit Docker gleich laufen – auf deinem Laptop, in der CI-Pipeline und in der Cloud.

> [!BEGINNER]
> Stell dir eine Lunchbox vor. Darin liegt nicht nur das Essen (deine App), sondern auch Besteck, Serviette und Gewürze (Python-Version, Bibliotheken, Einstellungen). Egal wo du die Box öffnest – es ist alles da und schmeckt gleich.

## Welches Problem löst Docker?

Ohne Container sieht die Realität oft so aus:

- „**Bei mir läuft es!**“ – auf dem Server fehlt aber eine Bibliothek oder es ist eine andere Version installiert.
- Neue Teammitglieder brauchen einen Tag, um PostgreSQL, Redis und die richtige Node-Version lokal einzurichten.
- Zwei Anwendungen auf demselben Server brauchen unterschiedliche Versionen derselben Abhängigkeit.
- Deployments sind manuelle Schritt-für-Schritt-Anleitungen, die irgendwann niemand mehr versteht.

Docker löst das, indem die **Umgebung selbst zum versionierten Artefakt** wird. Ein Image mit dem Tag \`shop:4f2a9c1\` enthält exakt das, was getestet wurde – und läuft in Produktion genauso.

## Container vs. virtuelle Maschinen

Container werden oft mit [[Virtuelle Maschine|virtuellen Maschinen]] verwechselt. Beide isolieren Anwendungen – aber auf völlig unterschiedlichen Ebenen:

\`\`\`widget
layers:container-vs-vm
\`\`\`

| | Virtuelle Maschine | Container |
|---|---|---|
| Was wird virtualisiert? | Hardware | Betriebssystem (Prozesse) |
| Eigener [[Kernel]]? | Ja, jede VM bootet ein eigenes OS | Nein, alle teilen den Host-Kernel |
| Startzeit | Sekunden bis Minuten | Millisekunden bis Sekunden |
| Größe | Gigabytes | Megabytes |
| Isolation | Sehr stark (Hypervisor) | Stark, aber gemeinsamer Kernel |
| Typischer Einsatz | Verschiedene Betriebssysteme, harte Mandantentrennung | Anwendungen paketieren und skalieren |

> [!EXPERT]
> Technisch ist ein Container ein ganz normaler Linux-[[Prozess]], dem der Kernel eine eingeschränkte Sicht gibt: **Namespaces** isolieren Prozess-IDs, Netzwerk, Mounts, Hostnamen und Benutzer; **cgroups** begrenzen CPU, RAM und I/O. Auf Windows und macOS läuft Docker Desktop deshalb in einer schlanken Linux-VM – Linux-Container brauchen einen Linux-Kernel.

## Die Bausteine

### Image

Ein Image ist eine **unveränderliche Vorlage**, bestehend aus übereinanderliegenden Dateisystem-Schichten ([[Layer]]) und Metadaten (Startbefehl, Umgebungsvariablen, freigegebene Ports). Images werden über Name und Tag adressiert, z. B. \`python:3.13-slim\` oder \`postgres:17\`. Ein Tag ist ein veränderlicher Zeiger – der **Digest** (\`postgres@sha256:…\`) identifiziert dagegen exakt einen Inhalt.

### Container

Ein Container ist eine **laufende (oder gestoppte) Instanz** eines Images. Docker legt über die schreibgeschützten Image-Layer eine dünne, beschreibbare Schicht. Alles, was der Container schreibt, landet dort – und ist weg, wenn der Container gelöscht wird. Dauerhafte Daten gehören deshalb in [[Volume|Volumes]].

### Registry

Eine [[Registry]] speichert und verteilt Images – wie ein App-Store. Bekannte Registries sind Docker Hub, die GitHub Container Registry (\`ghcr.io\`) oder die Registries der Cloud-Anbieter. Mit \`docker pull\` lädst du ein Image, mit \`docker push\` lädst du deines hoch.

### Docker Engine

Die Engine besteht aus mehreren Teilen: Die **CLI** (\`docker\`) ist nur ein Client, der Befehle per API an den **Daemon** (\`dockerd\`) schickt. Dieser delegiert das eigentliche Starten an **containerd** und die OCI-Runtime **runc**. So sieht der Weg vom Befehl zum laufenden Container aus:

\`\`\`widget
flow:docker-run
\`\`\`

## Der Lebenszyklus

\`\`\`widget
pipeline:docker-lifecycle
\`\`\`

## Erste Schritte in der Praxis

Nach der Installation (Docker Desktop auf Windows/macOS, Docker Engine auf Linux) prüfst du die Installation:

\`\`\`bash
docker --version
docker run --rm hello-world
\`\`\`

Einen Webserver starten – ohne irgendetwas zu installieren:

\`\`\`bash title="Nginx im Container"
# -d: im Hintergrund, -p: Host-Port 8080 → Container-Port 80, --name: lesbarer Name
docker run -d --name web -p 8080:80 nginx:1.27

docker ps                 # läuft er?
docker logs -f web        # Logs live verfolgen (Strg+C beendet nur das Mitlesen)
docker exec -it web sh    # Shell im Container öffnen
docker stop web && docker rm web
\`\`\`

Öffne danach \`http://localhost:8080\` – die Nginx-Startseite erscheint. Eine Datenbank für die Entwicklung ist genauso schnell gestartet:

\`\`\`bash title="PostgreSQL für lokale Entwicklung"
docker run -d --name pg \\
  -e POSTGRES_PASSWORD=geheim \\
  -p 5432:5432 \\
  -v pgdata:/var/lib/postgresql/data \\
  postgres:17
\`\`\`

Das [[Port-Mapping]] \`-p 5432:5432\` macht die Datenbank auf deinem Rechner erreichbar, das Named Volume \`pgdata\` sorgt dafür, dass die Daten einen Neustart überleben.

\`\`\`widget
cheats:docker Container ausführen
\`\`\`

## Wann solltest du Docker einsetzen?

- Du willst **reproduzierbare Umgebungen** für Entwicklung, Tests und Produktion.
- Du betreibst **mehrere Dienste** (App, Datenbank, Cache) und willst sie mit einem Befehl starten – siehe [Docker Compose](#/artikel/docker-compose).
- Du willst Anwendungen in **CI/CD** bauen und als Artefakt ausliefern – siehe [CI/CD](#/artikel/ci-cd).
- Du planst den Betrieb mit [[Kubernetes]] oder Container-Diensten der Cloud.

## Wann eher nicht?

- **Desktop-Apps mit GUI** oder Software, die tief mit dem Host-System verzahnt ist.
- Wenn ein **einzelnes statisches Binary** (z. B. ein Go-Programm) auf einem Server reicht – Container bringen dann vor allem zusätzliche Komplexität.
- Für **harte Sicherheitsgrenzen** zwischen nicht vertrauenswürdigen Mandanten: Der gemeinsame Kernel ist eine größere Angriffsfläche als ein Hypervisor (Alternativen: VMs, gVisor, Firecracker).

## Typische Fehler

> [!MISTAKE] Daten im Container speichern
> Eine Datenbank ohne Volume verliert beim \`docker rm\` alle Daten. Lege Daten immer in ein Volume oder einen Bind Mount.

> [!MISTAKE] \`latest\` in Produktion
> \`image: myapp:latest\` sagt nicht, welche Version läuft, und macht Rollbacks unmöglich. Verwende eindeutige Tags (z. B. Git-Commit-SHA) oder Digests.

> [!MISTAKE] \`localhost\` zwischen Containern
> In einem Container bedeutet \`localhost\` der Container selbst. Container erreichen sich über Servicenamen in einem gemeinsamen Netzwerk – Details im Artikel [Volumes & Netzwerke](#/artikel/docker-volumes-netzwerke).

## Best Practices auf einen Blick

1. **Ein Prozess pro Container** – Web-App, Datenbank und Cache in getrennten Containern.
2. **Konfiguration über [[Umgebungsvariable|Umgebungsvariablen]]**, nicht im Image einbacken.
3. **Kleine, offizielle Basis-Images** mit fester Version (\`node:22-alpine\`, \`python:3.13-slim\`).
4. **Logs nach stdout/stderr** schreiben – Docker sammelt sie automatisch.
5. **Nicht als root laufen** und nur nötige Ports veröffentlichen – siehe [Container-Sicherheit](#/artikel/docker-sicherheit).

## Wie geht es weiter?

Im nächsten Schritt baust du eigene Images mit einem [Dockerfile](#/artikel/dockerfile), danach orchestrierst du mehrere Container mit [Docker Compose](#/artikel/docker-compose).

\`\`\`widget
quiz:Docker 3
\`\`\`
`;export{e as default};
