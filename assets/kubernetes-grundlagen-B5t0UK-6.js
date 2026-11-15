const e=`---
id: kubernetes-grundlagen
title: Kubernetes-Grundlagen
area: devops
difficulty: profi
minutes: 20
order: 20
summary: Wie Kubernetes Container über viele Server verteilt, selbst heilt und skaliert – mit Pods, Deployments, Services, Ingress, ConfigMaps und Secrets.
tags: [Kubernetes, K8s, Orchestrierung, Container, Cloud Native]
related: [kubernetes-praxis, docker-grundlagen, ci-cd, monitoring-observability, cloud-grundlagen]
---

## Was ist Kubernetes?

[[Kubernetes]] (kurz K8s) ist eine Plattform zur [[Orchestrierung]] von Containern. Statt einzelne Container auf einzelnen Servern zu starten, beschreibst du den **gewünschten Zustand** – „drei Instanzen meines Shops in Version 4f2a9c1, erreichbar unter shop.example.de“ – und Kubernetes sorgt dauerhaft dafür, dass dieser Zustand gilt. Fällt ein Server aus, startet es die Container woanders neu.

> [!BEGINNER]
> Docker ist der Musiker, der ein Instrument spielt. Kubernetes ist der Dirigent eines Orchesters aus hunderten Musikern: Er verteilt die Stimmen, ersetzt ausgefallene Musiker sofort und holt bei Bedarf zusätzliche dazu.

## Welche Probleme löst Kubernetes?

- **Selbstheilung:** Abgestürzte Container werden neu gestartet, ausgefallene Knoten ersetzt.
- **Skalierung:** Mehr Instanzen bei Last, automatisch mit dem Horizontal Pod Autoscaler.
- **Zero-Downtime-Deployments:** Rolling Updates und Rollbacks per Befehl.
- **Service Discovery & Load Balancing:** Stabile DNS-Namen für kurzlebige Container.
- **Deklarative Konfiguration:** Alles ist YAML im Git-Repository (GitOps).

## Architektur

Ein Cluster besteht aus der **Control Plane** (Gehirn) und **Worker Nodes** (Muskeln):

| Komponente | Aufgabe |
|---|---|
| **API-Server** | Einzige Schnittstelle; alles (auch \`kubectl\`) spricht mit ihm |
| **etcd** | Konsistenter Key-Value-Store für den gesamten Cluster-Zustand |
| **Scheduler** | Entscheidet, auf welchem Node ein Pod läuft |
| **Controller Manager** | Regelkreise, die Ist- an Soll-Zustand angleichen |
| **[[Kubelet]]** (je Node) | Startet und überwacht die Container auf seinem Node |
| **kube-proxy / CNI** (je Node) | Netzwerk und Service-Routing |

Was bei \`kubectl apply\` passiert, zeigt dieser Ablauf:

\`\`\`widget
flow:k8s-deployment
\`\`\`

## Die wichtigsten Ressourcen

- **[[Pod]]:** Kleinste Einheit – ein oder mehrere Container mit gemeinsamer IP und gemeinsamen Volumes. Pods sind kurzlebig.
- **Deployment:** Verwaltet zustandslose Pods (über [[ReplicaSet|ReplicaSets]]), [[Rolling Update|Rolling Updates]] und Rollbacks.
- **[[StatefulSet]]:** Für zustandsbehaftete Anwendungen mit stabilen Namen und eigenem Speicher (z. B. Datenbanken).
- **[[Kubernetes Service|Service]]:** Stabile Adresse und Lastverteilung für eine Gruppe von Pods (Typen: ClusterIP, NodePort, LoadBalancer).
- **[[Ingress]] / Gateway API:** HTTP-Routing von außen nach Host und Pfad.
- **ConfigMap / Secret:** Konfiguration und Geheimnisse, als Umgebungsvariablen oder Dateien eingebunden.
- **Namespace:** Logische Trennung von Teams oder Umgebungen.
- **PersistentVolumeClaim:** Anforderung von dauerhaftem Speicher.

## Ein Deployment mit Service

\`\`\`widget
annotated:k8s-deployment-yaml
\`\`\`

\`\`\`bash title="Anwenden und beobachten"
kubectl apply -f deployment.yaml
kubectl get pods -l app=shop -w           # Pods beim Starten beobachten
kubectl rollout status deploy/shop
kubectl port-forward svc/shop 8080:80     # lokal testen: http://localhost:8080
\`\`\`

## Konfiguration und Secrets

\`\`\`yaml title="ConfigMap und Secret einbinden"
apiVersion: v1
kind: ConfigMap
metadata: { name: shop-config }
data:
  LOG_LEVEL: info
---
apiVersion: v1
kind: Secret
metadata: { name: shop-secrets }
type: Opaque
stringData:
  DATABASE_URL: postgres://app:…@db:5432/shop
---
# im Container des Deployments:
#   envFrom:
#     - configMapRef: { name: shop-config }
#     - secretRef: { name: shop-secrets }
\`\`\`

> [!WARNING] Secrets sind standardmäßig nur Base64-kodiert
> Kubernetes-Secrets liegen in etcd – ohne aktivierte Verschlüsselung at rest im Klartext (Base64 ist keine Verschlüsselung). Aktiviere Verschlüsselung, beschränke den Zugriff per RBAC und nutze für Produktion einen externen Secret-Store (z. B. über External Secrets Operator oder Sealed Secrets). Siehe [[Secrets Management]].

## Health Checks

Kubernetes unterscheidet drei Probes:

- **Liveness:** Lebt der Container noch? Wenn nein → Neustart.
- **Readiness:** Kann er Traffic annehmen? Wenn nein → aus dem Service entfernen (kein Neustart).
- **Startup:** Für langsam startende Apps; schützt vor zu früher Liveness-Prüfung.

> [!MISTAKE] Liveness prüft die Datenbank
> Ist die Datenbank kurz weg, starten sonst alle Pods gleichzeitig neu – und verschlimmern die Lage. Liveness sollte nur prüfen, ob der Prozess selbst funktioniert; Abhängigkeiten gehören höchstens in die Readiness.

## Helm

[[Helm]] verpackt viele YAML-Dateien zu einem parametrisierbaren „Chart“. So installierst du z. B. einen Ingress-Controller oder Monitoring-Stack mit einem Befehl und eigenen Werten:

\`\`\`bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
\`\`\`

## Wann brauchst du Kubernetes – und wann nicht?

**Sinnvoll**, wenn du viele Services betreibst, hohe Verfügbarkeit brauchst, mehrere Teams eine gemeinsame Plattform nutzen oder stark schwankende Last hast.

**Überdimensioniert** für eine einzelne Anwendung, ein kleines Team ohne Betriebserfahrung oder wenn ein verwalteter Dienst (z. B. Cloud Run, Azure Container Apps, AWS App Runner) oder [Docker Compose](#/artikel/docker-compose) auf einer VM genügt. Kubernetes bringt erhebliche Komplexität in Betrieb, Sicherheit und Fehlersuche mit.

> [!TIP]
> Zum Lernen eignen sich lokale Cluster wie **kind**, **minikube** oder **k3d**. In Produktion nutzen die meisten Teams Managed Kubernetes (EKS, AKS, GKE).

## Wie geht es weiter?

Der Betrieb in der Praxis – Ingress & TLS, Rolling Updates, Health Probes, Ressourcenlimits, Autoscaling, Helm und Operators – steht in [Kubernetes in der Praxis](#/artikel/kubernetes-praxis). Den Abgleich (Skalieren, Rollout, Selbstheilung) kannst du im [Kubernetes-Deployment-Simulator](#/labor/kubernetes) selbst ausprobieren. Automatisiere Deployments mit [CI/CD](#/artikel/ci-cd) und mache den Cluster beobachtbar mit [Monitoring & Observability](#/artikel/monitoring-observability). Die wichtigsten Befehle stehen im [Kubernetes-Cheatsheet](#/cheatsheets/kubernetes).
`;export{e as default};
