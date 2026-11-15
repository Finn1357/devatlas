const e=`---
id: docker-volumes-netzwerke
title: Docker Volumes, Netzwerke & Port-Mapping
area: devops
difficulty: fortgeschritten
minutes: 15
order: 13
summary: Wo Container ihre Daten dauerhaft speichern, wie sie miteinander und mit der Außenwelt kommunizieren und warum localhost im Container etwas anderes bedeutet.
tags: [Docker, Volumes, Netzwerk, Ports, Bind Mount]
related: [docker-grundlagen, docker-compose, docker-sicherheit, netzwerke-tcp-ip-dns]
---

## Das Problem: Container sind vergänglich

Ein Container bekommt beim Start eine eigene, beschreibbare Schicht über dem unveränderlichen Image. Alles, was er schreibt, landet dort. **Löschst du den Container, ist diese Schicht weg.** Für eine Datenbank, hochgeladene Dateien oder Logs, die bleiben sollen, brauchst du also Speicher außerhalb des Containers.

## Drei Arten von Mounts

| Typ | Syntax | Wo liegen die Daten? | Typischer Einsatz |
|---|---|---|---|
| **Named Volume** | \`-v pgdata:/var/lib/postgresql/data\` | Von Docker verwaltet | Datenbanken, persistente App-Daten |
| **Bind Mount** | \`-v "$(pwd)/src":/app/src\` | Beliebiges Host-Verzeichnis | Entwicklung (Code live), Konfigurationsdateien |
| **tmpfs** | \`--tmpfs /tmp\` | Nur im RAM | Temporäre, sensible Daten |

\`\`\`bash title="Volumes verwalten"
docker volume create pgdata
docker volume ls
docker volume inspect pgdata      # zeigt u. a. den Speicherort
docker run -d -v pgdata:/var/lib/postgresql/data -e POSTGRES_PASSWORD=geheim postgres:17
docker volume rm pgdata           # nur möglich, wenn kein Container es nutzt
\`\`\`

> [!BEGINNER]
> Ein **Volume** ist wie ein USB-Stick, den Docker für dich verwaltet. Ein **Bind Mount** ist wie ein Ordner deines Rechners, den du in den Container hineinreichst – Änderungen sieht man auf beiden Seiten sofort.

> [!TIP] Lesend einhängen
> Konfigurationsdateien solltest du schreibgeschützt einhängen: \`-v ./nginx.conf:/etc/nginx/nginx.conf:ro\`.

### Backups von Volumes

Volumes sind keine Backups. Eine einfache Sicherung erstellst du mit einem Hilfscontainer:

\`\`\`bash
docker run --rm -v pgdata:/daten -v "$(pwd)":/backup alpine \\
  tar czf /backup/pgdata-$(date +%F).tar.gz -C /daten .
\`\`\`

Für Datenbanken ist ein **logisches Backup** mit dem passenden Werkzeug zuverlässiger, weil es einen konsistenten Zustand garantiert:

\`\`\`bash
docker exec pg pg_dump -U postgres -Fc shop > shop.dump
\`\`\`

## Netzwerke

Docker richtet virtuelle Netzwerke ein, damit Container kommunizieren können:

| Treiber | Verhalten |
|---|---|
| \`bridge\` (Standard) | Privates Netz auf dem Host; Container erhalten eigene IPs |
| benutzerdefiniertes \`bridge\` | Wie bridge, **plus DNS-Auflösung per Containername** |
| \`host\` | Container teilt den Netzwerk-Stack des Hosts (kein Port-Mapping nötig, keine Isolation) |
| \`none\` | Kein Netzwerk |
| \`overlay\` | Netz über mehrere Hosts (Swarm) |

Das wichtigste Detail: Im **Standard**-Bridge-Netz können sich Container nur über IP-Adressen finden. In einem **selbst erstellten** Netzwerk lösen sie sich über Namen auf. Docker Compose erstellt so ein Netzwerk automatisch.

\`\`\`bash title="Zwei Container über ein eigenes Netzwerk verbinden"
docker network create appnetz
docker run -d --name db --network appnetz -e POSTGRES_PASSWORD=geheim postgres:17
docker run --rm --network appnetz postgres:17 \\
  psql "postgresql://postgres:geheim@db:5432/postgres" -c "SELECT version();"
\`\`\`

## Port-Mapping

Container-Ports sind von außen standardmäßig nicht erreichbar. Mit [[Port-Mapping]] (\`-p HOST:CONTAINER\`) leitest du einen Port des Hosts in den Container weiter.

\`\`\`bash
docker run -p 8080:80 nginx              # alle Interfaces des Hosts, Port 8080
docker run -p 127.0.0.1:8080:80 nginx    # nur lokal erreichbar – sicherer
docker run -p 80 nginx                   # zufälliger Host-Port (siehe docker port)
docker port <container>
\`\`\`

> [!WARNING] Docker und Firewalls
> Unter Linux schreibt Docker eigene iptables-Regeln für veröffentlichte Ports. Ein mit \`-p 5432:5432\` veröffentlichter Datenbank-Port kann dadurch **trotz aktiver ufw-Firewall** aus dem Internet erreichbar sein. Veröffentliche interne Dienste nicht oder binde sie an \`127.0.0.1\`.

## Warum „localhost“ im Container nicht funktioniert

Jeder Container hat seinen eigenen Netzwerk-Namespace – und damit sein eigenes [[localhost]]. Diese Verwechslung ist eine der häufigsten Fehlerquellen:

| Du willst … | aus … | verwende |
|---|---|---|
| einen anderen Container erreichen | einem Container | den **Servicenamen**, z. B. \`db:5432\` |
| einen Dienst auf deinem Rechner erreichen | einem Container | \`host.docker.internal\` (Docker Desktop; unter Linux mit \`--add-host=host.docker.internal:host-gateway\`) |
| einen Container erreichen | deinem Rechner | \`localhost:<veröffentlichter Port>\` |

Und umgekehrt: Lauscht deine App im Container nur auf \`127.0.0.1\`, kommt auch über ein Port-Mapping nichts an. Server im Container müssen auf **\`0.0.0.0\`** binden:

\`\`\`bash
# Flask/FastAPI/Vite-Dev-Server im Container
flask run --host 0.0.0.0
uvicorn main:app --host 0.0.0.0 --port 8000
vite --host 0.0.0.0
\`\`\`

## Fehlersuche bei Netzwerkproblemen

\`\`\`bash
docker network ls
docker network inspect appnetz                 # welche Container hängen dran, welche IPs?
docker exec -it web sh -c "getent hosts db"    # löst der Name auf?
docker exec -it web sh -c "wget -qO- http://api:3000/health"
docker run --rm -it --network appnetz nicolaka/netshoot   # Werkzeugkasten-Container
\`\`\`

## Wie geht es weiter?

Jetzt fehlt noch der Blick auf [Sicherheit, Logs und Troubleshooting](#/artikel/docker-sicherheit). Für Netzwerkgrundlagen wie Ports, TCP und DNS siehe [Netzwerke, TCP/IP & DNS](#/artikel/netzwerke-tcp-ip-dns).
`;export{e as default};
