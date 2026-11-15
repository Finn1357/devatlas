const e=`---
id: docker-sicherheit
title: Container-Sicherheit, Logs & Troubleshooting
area: devops
difficulty: fortgeschritten
minutes: 17
order: 14
summary: Container sicher bauen und betreiben, Logs auswerten und die häufigsten Fehler – vom Exit-Code 137 bis zum ImagePullBackOff – systematisch finden.
tags: [Docker, Security, Logs, Debugging, Best Practices]
related: [dockerfile, docker-compose, owasp-top-10, kubernetes-grundlagen]
---

## Warum Container-Sicherheit ein eigenes Thema ist

Container isolieren gut, aber nicht perfekt: Alle Container eines Hosts teilen sich den [[Kernel]]. Läuft ein Prozess im Container als root und gelingt ein Ausbruch, ist er oft auch auf dem Host root. Dazu kommt die **Lieferkette**: Jedes Basis-Image und jede Abhängigkeit bringt potenziell bekannte Sicherheitslücken ([[CVE|CVEs]]) mit. Container-Sicherheit hat deshalb drei Ebenen: **Image**, **Laufzeit** und **Host/Plattform**.

## 1. Sichere Images

- **Minimale Basis-Images:** \`-slim\`, \`-alpine\` oder distroless enthalten weniger Pakete – weniger Pakete, weniger Lücken.
- **Feste Versionen** und regelmäßige Neubauten, damit Sicherheitsupdates der Basis ankommen.
- **Keine Secrets im Image:** Weder per \`COPY .env\`, noch \`ENV\`, noch \`ARG\`. Alles in Layern ist mit \`docker history\` bzw. durch Entpacken lesbar.
- **Scannen** in der CI-Pipeline:

\`\`\`bash
trivy image ghcr.io/acme/shop:4f2a9c1          # Open Source (Aqua)
docker scout cves ghcr.io/acme/shop:4f2a9c1    # Docker Scout
grype ghcr.io/acme/shop:4f2a9c1                # Open Source (Anchore)
\`\`\`

- **Signieren und Herkunft nachweisen** (z. B. Sigstore/cosign, SBOMs), damit nur geprüfte Images in Produktion laufen – Schutz gegen [[Supply-Chain-Angriff|Supply-Chain-Angriffe]].

## 2. Sichere Laufzeit

Das Prinzip ist [[Least Privilege]]: Ein Container bekommt nur, was er wirklich braucht.

\`\`\`bash title="Ein gehärteter docker run"
docker run -d --name api \\
  --user 10001:10001 \\
  --read-only --tmpfs /tmp \\
  --cap-drop ALL \\
  --security-opt no-new-privileges:true \\
  --memory 512m --cpus 1 --pids-limit 200 \\
  -p 127.0.0.1:3000:3000 \\
  ghcr.io/acme/api:4f2a9c1
\`\`\`

| Option | Wirkung |
|---|---|
| \`--user\` / \`USER\` im Dockerfile | Prozess läuft nicht als root |
| \`--read-only\` | Root-Dateisystem schreibgeschützt; Schreibbares explizit per tmpfs/Volume |
| \`--cap-drop ALL\` | Entzieht alle Linux-Capabilities (bei Bedarf gezielt \`--cap-add\`) |
| \`no-new-privileges\` | Verhindert Rechteausweitung über setuid-Programme |
| \`--memory\`, \`--cpus\`, \`--pids-limit\` | Schützt den Host vor Ressourcenerschöpfung (auch Fork-Bombs) |
| Port an \`127.0.0.1\` | Dienst nur lokal bzw. über Reverse Proxy erreichbar |

> [!DANGER] Niemals: Docker-Socket mounten oder \`--privileged\`
> \`-v /var/run/docker.sock:/var/run/docker.sock\` gibt dem Container volle Kontrolle über den Docker-Daemon – das entspricht root auf dem Host. \`--privileged\` hebt fast alle Isolationsmechanismen auf. Beides nur in eng begrenzten, vertrauenswürdigen Spezialfällen.

Weitere Ebenen: **Rootless Docker** oder Podman (Daemon läuft ohne root), User-Namespaces, seccomp- und AppArmor-Profile. In Kubernetes werden diese Einstellungen über den \`securityContext\` und Pod Security Standards gesetzt.

## 3. Logs: Was passiert im Container?

Container-Logs sind schlicht alles, was der Hauptprozess auf [[Stdin/Stdout|stdout und stderr]] schreibt. Deine App sollte deshalb **nicht in Dateien loggen**, sondern auf die Standardausgabe – möglichst strukturiert als JSON.

\`\`\`bash
docker logs web                   # alles
docker logs -f --tail 100 web     # letzte 100 Zeilen, dann live
docker logs --since 10m web       # die letzten 10 Minuten
docker compose logs -f            # alle Services eines Projekts
\`\`\`

> [!WARNING] Logs können die Festplatte füllen
> Der Standard-Logtreiber \`json-file\` rotiert ohne Konfiguration nicht. Setze Grenzen, z. B. in \`/etc/docker/daemon.json\`: \`{"log-driver": "json-file", "log-opts": {"max-size": "10m", "max-file": "3"}}\` – oder nutze den Treiber \`local\`. In Produktion werden Logs meist an ein zentrales System weitergeleitet (siehe [Monitoring & Observability](#/artikel/monitoring-observability)).

## 4. Troubleshooting: systematisch statt raten

Gehe bei Problemen immer von außen nach innen vor:

1. **Läuft der Container?** \`docker ps -a\` zeigt Status und Exit-Code.
2. **Was sagt er?** \`docker logs <name>\` – die Ursache steht fast immer in den letzten Zeilen.
3. **Wie ist er konfiguriert?** \`docker inspect <name>\` zeigt Env, Mounts, Netzwerke, Startbefehl.
4. **Von innen prüfen:** \`docker exec -it <name> sh\` – Dateien, Umgebung, Netzwerk testen.
5. **Ressourcen:** \`docker stats\` zeigt CPU/RAM live.
6. **Isolieren:** Läuft das Image mit einer Shell als Startbefehl? \`docker run --rm -it --entrypoint sh <image>\`.

### Häufige Fehlerbilder

| Symptom | Bedeutung | Typische Lösung |
|---|---|---|
| Exit-Code \`0\` sofort nach Start | Hauptprozess ist fertig (kein Dauerprozess) | Server im Vordergrund starten, nicht als Daemon |
| Exit-Code \`1\` | Anwendungsfehler | Logs lesen (Konfiguration, fehlende Variable) |
| Exit-Code \`137\` | SIGKILL – oft **OOMKilled** (Speicherlimit) | \`docker inspect … --format '{{.State.OOMKilled}}'\`, Limit erhöhen, Leck suchen |
| Exit-Code \`143\` | SIGTERM – regulär gestoppt | Normal bei \`docker stop\` |
| \`exec format error\` | Falsche CPU-Architektur (arm64 vs. amd64) | Multi-Arch bauen: \`docker buildx build --platform linux/amd64,linux/arm64\` |
| \`port is already allocated\` | Host-Port belegt | Anderen Port wählen oder belegenden Prozess finden |
| \`connection refused\` zwischen Containern | Falscher Host (\`localhost\`) oder App bindet an 127.0.0.1 | Servicenamen nutzen, auf \`0.0.0.0\` binden |
| \`permission denied\` bei Volumes | UID im Container passt nicht zu Dateirechten | Rechte anpassen oder passende UID verwenden |
| \`no space left on device\` | Images, Build-Cache, Logs | \`docker system df\`, \`docker system prune\`, Logrotation |

> [!TIP] Exit-Codes über 128
> Ein [[Exit Code]] über 128 bedeutet „durch Signal beendet“: Code − 128 = Signalnummer. 137 − 128 = 9 (SIGKILL), 143 − 128 = 15 (SIGTERM).

## Checkliste für Produktion

- [x] Basis-Image minimal und gepinnt, regelmäßig neu gebaut
- [x] Image-Scan in CI, kritische Funde blockieren das Deployment
- [x] Läuft als Nicht-root, Capabilities entzogen, \`no-new-privileges\`
- [x] Ressourcenlimits gesetzt
- [x] Keine Secrets im Image; Secrets aus Secret-Store
- [x] Nur nötige Ports, interne Dienste nicht veröffentlicht
- [x] Healthcheck definiert, Logs strukturiert auf stdout, Logrotation aktiv
- [x] Eindeutige Image-Tags für Rollbacks

## Wie geht es weiter?

Für den Betrieb über mehrere Server hinweg folgt [Kubernetes](#/artikel/kubernetes-grundlagen); wie Images automatisch gebaut, gescannt und ausgerollt werden, zeigt [CI/CD](#/artikel/ci-cd).
`;export{e as default};
