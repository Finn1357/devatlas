const e=`---
id: docker-compose
title: Docker Compose: Mehrere Container als ein System
area: devops
difficulty: fortgeschritten
minutes: 16
order: 12
summary: Mit einer compose.yaml App, Datenbank und Cache deklarativ beschreiben, gemeinsam starten, Abhängigkeiten steuern, Konfiguration und Secrets sauber trennen.
tags: [Docker, Compose, YAML, Entwicklung, Orchestrierung]
related: [docker-grundlagen, dockerfile, docker-volumes-netzwerke, kubernetes-grundlagen]
---

## Was ist Docker Compose?

Reale Anwendungen bestehen selten aus einem einzigen Container: Eine Web-App braucht eine Datenbank, oft einen Cache, vielleicht einen Worker für Hintergrundjobs. [[Docker Compose]] beschreibt all diese **Services** in einer einzigen [[YAML]]-Datei (\`compose.yaml\`) – inklusive Ports, Umgebungsvariablen, [[Volume|Volumes]] und Netzwerken – und startet sie mit einem Befehl.

> [!BEGINNER]
> Statt fünf lange \`docker run\`-Befehle auswendig zu kennen, schreibst du einmal eine Einkaufsliste. \`docker compose up\` erledigt den Rest – für jedes Teammitglied identisch.

## Warum Compose?

- **Reproduzierbare Entwicklungsumgebungen:** Neue Kolleginnen klonen das Repository und führen \`docker compose up\` aus.
- **Dokumentation als Code:** Die Datei zeigt, welche Dienste die App braucht und wie sie verbunden sind.
- **Integrationstests in CI** mit echten Datenbanken.
- **Einfache Produktion auf einem Server:** Für viele kleine bis mittlere Anwendungen genügt Compose auf einer VM – [[Kubernetes]] wäre überdimensioniert.

## Ein vollständiges Beispiel

Fahre über die markierten Zeilen, um zu sehen, was jede Einstellung bewirkt:

\`\`\`widget
annotated:compose-webapp
\`\`\`

Dazu gehört eine \`.env\`-Datei neben der \`compose.yaml\` (die **nicht** ins Repository kommt):

\`\`\`ini title=".env"
DB_PASSWORD=bitte-lokal-ein-starkes-passwort-setzen
\`\`\`

## Wie funktioniert das Netzwerk?

Compose legt automatisch ein eigenes [[Docker-Netzwerk]] für das Projekt an. Jeder Service ist darin unter seinem **Namen** erreichbar – Docker betreibt dafür einen eingebauten DNS-Server. Deshalb verbindet sich \`web\` mit \`db:5432\` und nicht mit \`localhost:5432\`.

Nach außen (auf deinen Rechner) gelangen nur Ports, die du unter \`ports:\` veröffentlichst. In unserem Beispiel ist nur die Web-App unter \`localhost:8080\` erreichbar; Datenbank und Redis bleiben intern – gut für die Sicherheit.

## Die wichtigsten Befehle

\`\`\`widget
cheats:docker Compose
\`\`\`

Ein typischer Entwicklungsablauf:

\`\`\`bash
docker compose up -d --build     # bauen und im Hintergrund starten
docker compose ps                # läuft alles? (Status, Health, Ports)
docker compose logs -f web       # Logs der App verfolgen
docker compose exec db psql -U app   # in die Datenbank schauen
docker compose down              # alles stoppen (Volumes bleiben!)
\`\`\`

## Startreihenfolge und Healthchecks

\`depends_on\` allein sorgt nur dafür, dass die Datenbank **zuerst gestartet** wird – nicht, dass sie **bereit** ist. PostgreSQL braucht nach dem Start einige Sekunden, bis Verbindungen angenommen werden. Mit einem \`healthcheck\` und \`condition: service_healthy\` wartet Compose, bis der Healthcheck grün ist.

> [!TIP]
> Baue deine App trotzdem so, dass sie Verbindungsfehler beim Start mit Wiederholungen (Retry mit Backoff) toleriert. In Produktion können Datenbanken jederzeit kurz nicht erreichbar sein.

## Entwicklung vs. Produktion

Für die Entwicklung willst du Code-Änderungen sofort sehen, in Produktion ein fertig gebautes Image. Compose erlaubt, Dateien zu **überlagern**: \`compose.yaml\` enthält die Basis, \`compose.override.yaml\` (wird automatisch geladen) die Entwicklungseinstellungen.

\`\`\`yaml title="compose.override.yaml (nur lokal)"
services:
  web:
    build:
      target: deps          # Stufe mit Dev-Abhängigkeiten
    command: npm run dev    # Dev-Server mit Hot Reload
    volumes:
      - ./src:/app/src      # Bind Mount: Codeänderungen sofort im Container
    environment:
      NODE_ENV: development
\`\`\`

Für Produktion startest du explizit nur die Basisdatei: \`docker compose -f compose.yaml up -d\`. Seit Compose v2.22 gibt es außerdem \`develop.watch\`, das Dateien bei Änderungen automatisch synchronisiert oder Images neu baut (\`docker compose watch\`).

## Konfiguration und Secrets

| Mechanismus | Wofür | Hinweis |
|---|---|---|
| \`environment:\` | Nicht geheime Konfiguration | Im YAML sichtbar |
| \`\${VAR}\` + \`.env\` | Werte pro Umgebung | \`.env\` in \`.gitignore\` |
| \`env_file:\` | Viele Variablen aus Datei | Landet als Env im Container |
| \`secrets:\` | Passwörter, Schlüssel | Als Datei unter \`/run/secrets/<name>\` eingehängt |

Viele offizielle Images unterstützen \`*_FILE\`-Variablen, um Secrets aus Dateien zu lesen, z. B. \`POSTGRES_PASSWORD_FILE: /run/secrets/db_password\`.

## Typische Fehler

> [!MISTAKE] \`docker compose down -v\` aus Gewohnheit
> Das \`-v\` löscht auch die Named Volumes – und damit die Datenbank. Nur verwenden, wenn du bewusst bei null anfangen willst.

> [!MISTAKE] Ports ohne Anführungszeichen
> \`- 22:22\` kann von YAML-1.1-Parsern als Zahl im Sexagesimalsystem gelesen werden. Ports immer als String schreiben: \`- "22:22"\`.

> [!MISTAKE] Veraltete Syntax
> \`docker-compose\` (mit Bindestrich, Python-basiertes Compose v1) und das \`version:\`-Feld sind veraltet. Aktuell ist \`docker compose\` (Plugin, v2) mit \`compose.yaml\`.

## Wann reicht Compose nicht mehr?

Compose läuft auf **einem Host**. Brauchst du automatische Verteilung über mehrere Server, Selbstheilung bei Hardwareausfällen, Rolling Updates ohne Downtime und Autoscaling, ist ein Orchestrator wie [Kubernetes](#/artikel/kubernetes-grundlagen) oder ein verwalteter Container-Dienst der Cloud der nächste Schritt.

## Wie geht es weiter?

Vertiefe [Volumes & Netzwerke](#/artikel/docker-volumes-netzwerke) und lerne, wie du Container [sicher betreibst und Fehler findest](#/artikel/docker-sicherheit).
`;export{e as default};
