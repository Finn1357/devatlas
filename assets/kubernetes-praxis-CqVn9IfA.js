const e=`---
id: kubernetes-praxis
title: Kubernetes in der Praxis: Ingress, Helm, Autoscaling & Operators
area: devops
difficulty: profi
minutes: 22
order: 20.5
summary: Von „es läuft im Cluster“ zum echten Betrieb – wie du Anwendungen von außen erreichbar machst (Ingress & TLS), Updates ohne Ausfall ausrollst, automatisch skalierst, Ressourcen korrekt setzt und Kubernetes mit Helm und Operators erweiterst.
tags: [Kubernetes, Ingress, Helm, Autoscaling, HPA, Operator, Rolling Update, GitOps]
related: [kubernetes-grundlagen, ci-cd, monitoring-observability]
---

## Von den Grundlagen zum Betrieb

Die [Kubernetes-Grundlagen](#/artikel/kubernetes-grundlagen) erklären, *was* Pods, Deployments und Services sind. Dieser Artikel zeigt, wie man damit eine Anwendung **zuverlässig betreibt**: erreichbar von außen, aktualisierbar ohne Ausfall, automatisch skalierend und mit klaren Ressourcengrenzen.

Der rote Faden ist immer derselbe **Abgleich (reconcile)**: Du beschreibst einen Soll-Zustand, Controller stellen ihn her und halten ihn. Dieser Simulator zeigt das Prinzip – skaliere die Replicas, löse ein Rolling Update aus oder lass einen Pod abstürzen:

\`\`\`widget
k8s
\`\`\`

> [!BEGINNER]
> Du sagst nicht „starte einen Pod“, sondern „ich will dauerhaft drei davon in Version v2“. Fällt einer aus, startet Kubernetes von selbst Ersatz – du musst nichts tun. Das ist der ganze Trick.

## Erreichbarkeit von außen: Service und Ingress

Ein [[Kubernetes Service]] gibt einer Gruppe von [[Pod|Pods]] eine stabile, cluster-interne Adresse. Für Zugriff aus dem Internet fehlt aber noch HTTP-Routing nach Hostname und Pfad – das übernimmt der [[Ingress]].

\`\`\`yaml title="ingress.yaml"
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: shop
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: nginx
  tls:
    - hosts: [shop.example.de]
      secretName: shop-tls          # Zertifikat, von cert-manager automatisch befüllt
  rules:
    - host: shop.example.de
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: shop          # verweist auf den Service, nicht direkt auf Pods
                port: { number: 80 }
\`\`\`

Ein Ingress-Objekt allein tut nichts – es braucht einen **Ingress-Controller** (z. B. ingress-nginx oder Traefik), der die Regeln liest und als [Reverse Proxy](#/artikel/linux-server-nginx) umsetzt. TLS-Zertifikate holt man heute meist automatisch per **cert-manager** von Let's Encrypt.

> [!NOTE] Gateway API
> Die **Gateway API** (\`gateway.networking.k8s.io\`) ist der moderne Nachfolger von Ingress: ausdrucksstärker, mit klarer Rollentrennung zwischen Cluster-Betrieb (\`Gateway\`) und App-Teams (\`HTTPRoute\`). Für neue Cluster lohnt der Blick; Ingress bleibt vorerst weit verbreitet.

## Updates ohne Ausfall: Rolling Update & Rollback

Ein [[Deployment]] aktualisiert per [[Rolling Update]]: Es baut eine neue [[ReplicaSet]] auf und die alte ab – gesteuert durch \`maxSurge\` (wie viele Pods zusätzlich starten dürfen) und \`maxUnavailable\` (wie viele fehlen dürfen).

\`\`\`yaml title="Strategie im Deployment" hl=4-8
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1          # höchstens 1 Pod über das Soll hinaus
      maxUnavailable: 0    # nie weniger als 4 verfügbar → kein Kapazitätsverlust
\`\`\`

\`\`\`bash title="Ausrollen, beobachten, notfalls zurück"
kubectl set image deploy/shop app=registry.example.de/shop:2.4.0
kubectl rollout status deploy/shop        # wartet, bis alle neuen Pods bereit sind
kubectl rollout undo deploy/shop          # letztes funktionierendes Release wiederherstellen
kubectl rollout history deploy/shop
\`\`\`

Damit ein Rolling Update **wirklich** ausfallfrei ist, muss Kubernetes erkennen, wann ein neuer Pod echten Traffic verträgt. Dafür sorgen Probes.

> [!TIP] Rolling Update vs. Blue-Green vs. Canary
> **Rolling** mischt kurz alte und neue Version – einfach und der Standard. [[Blue-Green Deployment]] hält zwei komplette Umgebungen und schaltet schlagartig um. **Canary** leitet erst wenige Prozent des Traffics auf die neue Version (oft mit einem Service Mesh oder Argo Rollouts). Mehr Sicherheit kostet mehr Komplexität.

## Health Probes richtig einsetzen

Kubernetes kennt drei [[Health Probe|Probes]], und der häufigste Betriebsfehler ist, sie zu verwechseln:

| Probe | Frage | Fehlschlag → |
|---|---|---|
| **Liveness** | Hängt der Prozess? | Container wird **neu gestartet** |
| **Readiness** | Kann er jetzt Traffic? | Pod wird **aus dem Service genommen** (kein Neustart) |
| **Startup** | Läuft der Start noch? | schützt langsame Starts vor verfrühter Liveness |

\`\`\`yaml title="deployment.yaml (Ausschnitt)"
readinessProbe:
  httpGet: { path: /healthz/ready, port: 8080 }
  initialDelaySeconds: 3
  periodSeconds: 5
livenessProbe:
  httpGet: { path: /healthz/live, port: 8080 }
  periodSeconds: 10
  failureThreshold: 3
\`\`\`

> [!MISTAKE] Liveness prüft die Datenbank
> Ist die Datenbank kurz weg, lässt eine datenbankabhängige Liveness-Probe **alle** Pods gleichzeitig neu starten – und verschlimmert den Ausfall. Regel: **Liveness** prüft nur den eigenen Prozess, **Readiness** darf Abhängigkeiten einbeziehen.

## Ressourcen: Requests & Limits

Ohne [[Resource Requests & Limits]] weiß der Scheduler nicht, wie viel ein Pod braucht, und ein einzelner Container kann einen ganzen Node lahmlegen.

\`\`\`yaml title="resources im Container"
resources:
  requests: { cpu: "100m", memory: "128Mi" }   # garantiert, Basis fürs Scheduling
  limits:   { cpu: "500m", memory: "256Mi" }    # Obergrenze
\`\`\`

- **CPU** ist komprimierbar: Über dem Limit wird der Container nur **gedrosselt**.
- **Memory** ist es nicht: Über dem Limit wird er per **OOMKill beendet**.
- \`100m\` = 100 Millicores = 1/10 CPU-Kern.

> [!EXPERT] Requests = Limits für kritische Dienste
> Sind Request und Limit gleich, erhält der Pod die QoS-Klasse **Guaranteed** und wird bei Knappheit zuletzt verdrängt. Für Memory gilt heute oft: Request = Limit setzen (kein Überbuchen), bei CPU dagegen ein Limit sparsam oder gar nicht setzen, um unnötiges Throttling zu vermeiden.

## Automatisch skalieren: der HPA

Der [[Horizontal Pod Autoscaler]] passt die Replica-Zahl automatisch an die Last an. Er braucht gesetzte **Requests**, weil die CPU-Auslastung relativ dazu gemessen wird, und den \`metrics-server\` im Cluster.

\`\`\`yaml title="hpa.yaml"
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata: { name: shop }
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: shop
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target: { type: Utilization, averageUtilization: 70 }
\`\`\`

Die Zielzahl berechnet sich grob als \`ceil(aktuelleReplicas × istAuslastung / zielAuslastung)\` – bei 4 Pods zu je 90 % und Ziel 70 % also \`ceil(4 × 90/70) = 6\`. Probiere das Hoch- und Herunterskalieren oben im Simulator oder im [Kubernetes-Deployment-Simulator](#/labor/kubernetes) aus.

> [!INFO]
> Der HPA ändert **nur die Pod-Zahl**. Reichen die Nodes nicht, fügt der **Cluster Autoscaler** (bzw. Karpenter) neue Knoten hinzu. Für Metriken jenseits von CPU/Memory – etwa Queue-Länge – nutzt man KEDA.

## Paketieren mit Helm

Eine reale App besteht aus vielen YAML-Dateien (Deployment, Service, Ingress, HPA, ConfigMap …). [[Helm]] fasst sie zu einem parametrisierbaren **Chart** zusammen: Templates plus eine \`values.yaml\` mit den Stellschrauben.

\`\`\`yaml title="templates/deployment.yaml (Ausschnitt)"
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
        - name: app
          image: "{{ .Values.image.repo }}:{{ .Values.image.tag }}"
\`\`\`

\`\`\`bash title="Installieren und aktualisieren"
helm install shop ./shop-chart -n prod --create-namespace \\
  --set image.tag=2.4.0 --set replicaCount=4
helm upgrade shop ./shop-chart -n prod --set image.tag=2.5.0
helm rollback shop 1 -n prod          # auf Revision 1 zurück
\`\`\`

So installierst du auch fremde Software mit einem Befehl – etwa einen Monitoring-Stack:

\`\`\`bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
\`\`\`

> [!WARNING] \`helm upgrade --install\` statt Handarbeit
> In CI/CD nutzt man \`helm upgrade --install\` (idempotent) und prüft mit \`helm diff\` vorab die Änderung. Vermeide es, Objekte, die Helm verwaltet, nebenbei per \`kubectl edit\` zu ändern – der nächste Upgrade überschreibt sie.

## Kubernetes erweitern: CRDs & Operators

Kubernetes lässt sich um **eigene Objektarten** erweitern. Eine [[Custom Resource Definition]] bringt dem API-Server ein neues Vokabel bei (z. B. \`kind: PostgresCluster\`), ein [[Kubernetes Operator]] gibt ihm Verhalten: Er beobachtet solche Objekte und gleicht den Cluster laufend an deren Soll-Zustand an – inklusive Betriebswissen wie Backups und Failover.

\`\`\`bash title="Eine Custom Resource anlegen"
kubectl apply -f - <<'EOF'
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata: { name: shop-db }
spec:
  instances: 3
  storage: { size: 20Gi }
EOF
kubectl get clusters            # neue Objektart, wie eingebaut nutzbar
\`\`\`

So verwaltet man zustandsbehaftete Systeme (Datenbanken, Message-Broker) deklarativ. Für eigene, einfache Deployments sind CRDs dagegen überflüssig – ein [[StatefulSet]] oder Deployment genügt.

## Alles aus Git: GitOps

Statt Befehle von Hand auszuführen, legt man bei [[GitOps]] **alle** Manifeste in ein Repository. Ein Agent (Argo CD, Flux) gleicht den Cluster laufend daran an.

\`\`\`widget
flow:k8s-deployment
\`\`\`

Vorteile: jede Änderung ist ein nachvollziehbarer Commit, Rollback heißt \`git revert\`, und niemand braucht direkten \`kubectl\`-Zugriff auf Produktion. GitOps ist die konsequente Fortsetzung von [CI/CD](#/artikel/ci-cd) für den Cluster-Betrieb.

## Fehlersuche: die ersten Befehle

\`\`\`bash
kubectl get pods -n prod                     # Übersicht: Status, Restarts, Alter
kubectl describe pod <name> -n prod          # Events am Ende – oft steht hier die Ursache
kubectl logs <name> -n prod --previous       # Logs des abgestürzten Vorgänger-Containers
kubectl get events -n prod --sort-by=.lastTimestamp
\`\`\`

Typische Statuswerte: **ImagePullBackOff** (Image/Zugang falsch), **CrashLoopBackOff** (Container startet und stirbt sofort – Logs prüfen), **Pending** (kein Node mit genug Ressourcen – Requests zu hoch oder Cluster voll), **OOMKilled** (Memory-Limit zu niedrig).

## Wie geht es weiter?

Mach den Cluster beobachtbar mit [Monitoring & Observability](#/artikel/monitoring-observability), automatisiere Rollouts über [CI/CD](#/artikel/ci-cd) und übe die wichtigsten Befehle im [Kubernetes-Cheatsheet](#/cheatsheets/kubernetes). Teste dein Wissen:

\`\`\`widget
quiz:Kubernetes 3
\`\`\`
`;export{e as default};
