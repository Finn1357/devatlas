const e=`---
id: cloud-grundlagen
title: Cloud-Grundlagen: IaaS, PaaS, SaaS & Serverless
area: devops
difficulty: einsteiger
minutes: 14
order: 24
summary: Was Cloud Computing ausmacht, welche Servicemodelle es gibt, welche Kerndienste AWS, Azure und Google Cloud bieten und worauf es bei Kosten, Sicherheit und Hochverfügbarkeit ankommt.
tags: [Cloud, AWS, Azure, Google Cloud, Serverless, Skalierung]
related: [infrastructure-as-code, kubernetes-grundlagen, monitoring-observability]
---

## Was ist Cloud Computing?

[[Cloud Computing]] bedeutet, IT-Ressourcen – Rechenleistung, Speicher, Datenbanken, Netzwerke, fertige Dienste – **bei Bedarf über das Internet** zu beziehen und nach Verbrauch zu bezahlen. Statt Server zu kaufen und Jahre im Voraus zu planen, startest du sie in Minuten und schaltest sie wieder ab.

Typische Eigenschaften: Selbstbedienung per API, Elastizität (hoch- und herunterskalieren), Abrechnung nach Nutzung, weltweite Rechenzentren in **Regionen** mit mehreren voneinander unabhängigen **Availability Zones**.

## Servicemodelle

| Modell | Du verwaltest | Der Anbieter verwaltet | Beispiele |
|---|---|---|---|
| **IaaS** | Betriebssystem, Laufzeit, App, Daten | Hardware, Virtualisierung, Netzwerk | VMs: EC2, Azure VMs, Compute Engine |
| **PaaS** | App und Daten | zusätzlich OS, Laufzeit, Skalierung | App Service, Cloud Run, Elastic Beanstalk, Heroku |
| **[[Serverless]] / FaaS** | Funktionscode | fast alles, Abrechnung pro Aufruf | Lambda, Azure Functions, Cloud Functions |
| **SaaS** | Nur Nutzung und Konfiguration | alles | Microsoft 365, Gmail, Salesforce |

> [!BEGINNER]
> Pizza-Vergleich: **IaaS** = du bekommst Küche und Ofen, backst selbst. **PaaS** = Teig und Ofen stehen bereit, du belegst nur noch. **SaaS** = die Pizza wird geliefert.

## Die Kerndienste im Vergleich

| Kategorie | AWS | Microsoft Azure | Google Cloud |
|---|---|---|---|
| Virtuelle Maschinen | EC2 | Virtual Machines | Compute Engine |
| Container (Managed K8s) | EKS | AKS | GKE |
| Container ohne Cluster | ECS/Fargate, App Runner | Container Apps | Cloud Run |
| Serverless-Funktionen | Lambda | Functions | Cloud Functions |
| Objektspeicher | S3 | Blob Storage | Cloud Storage |
| Relationale DB | RDS, Aurora | Azure SQL, Database for PostgreSQL | Cloud SQL, AlloyDB |
| NoSQL | DynamoDB | Cosmos DB | Firestore, Bigtable |
| Identität & Rechte | IAM | Entra ID + RBAC | IAM |
| Monitoring | CloudWatch | Azure Monitor | Cloud Monitoring |

## Shared Responsibility

Die Cloud ist nicht automatisch sicher. Es gilt das **Modell der geteilten Verantwortung**: Der Anbieter sichert die Infrastruktur („Sicherheit *der* Cloud“), du sicherst, was du hineinlegst („Sicherheit *in* der Cloud“) – Zugriffsrechte, Konfiguration, Daten, Patches deiner VMs.

> [!DANGER] Die häufigsten Cloud-Sicherheitsvorfälle
> Öffentlich lesbare Speicher-Buckets, zu weit gefasste Rechte (\`*\`), geleakte Access Keys im Git-Repository und offen erreichbare Datenbanken. Gegenmittel: [[Least Privilege]], kurzlebige Credentials (Rollen statt Keys), Secrets-Scanning, Infrastruktur als Code mit Review.

## Skalierung und Hochverfügbarkeit

- **Vertikale [[Skalierung]]:** größere Maschine. Einfach, aber begrenzt.
- **Horizontale Skalierung:** mehr Instanzen hinter einem [[Load Balancer]]. Voraussetzung: zustandslose Anwendungen (Sessions und Dateien liegen extern in Redis, Datenbank oder Objektspeicher).
- **[[Hochverfügbarkeit]]:** Instanzen über mehrere Availability Zones verteilen, Datenbanken replizieren, Health Checks und automatisches Failover.

## Serverless: Stärken und Grenzen

**Stärken:** Kein Serverbetrieb, automatische Skalierung (auch auf null), Abrechnung pro Ausführung – ideal für ereignisgesteuerte Aufgaben, unregelmäßige Last, Webhooks und Glue-Code.

**Grenzen:** Cold Starts (Verzögerung beim ersten Aufruf), Laufzeit- und Speicherlimits, schwierigeres lokales Testen und stärkere Bindung an einen Anbieter (Vendor Lock-in).

\`\`\`python title="Eine minimale AWS-Lambda-Funktion (Python)"
import json

def handler(event, context):
    name = (event.get("queryStringParameters") or {}).get("name", "Welt")
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"gruss": f"Hallo, {name}!"}),
    }
\`\`\`

## Kosten im Griff behalten

- **Budgets und Alarme** gleich zu Beginn einrichten.
- Ungenutzte Ressourcen (alte Snapshots, verwaiste Volumes, Test-VMs) regelmäßig aufräumen.
- **Datenübertragung aus der Cloud** (Egress) wird oft unterschätzt.
- Für Dauerlast Reservierungen oder Savings Plans prüfen, für unterbrechbare Arbeit Spot-Instanzen.
- Alles taggen, damit Kosten Teams und Projekten zugeordnet werden können.

## Datenschutz

Für personenbezogene Daten gilt die DSGVO: Region (z. B. Frankfurt, Westeuropa) bewusst wählen, Auftragsverarbeitungsvertrag abschließen, Verschlüsselung aktivieren und prüfen, welche Dienste Daten in andere Regionen übertragen.

## Wie geht es weiter?

Beschreibe Cloud-Ressourcen als Code mit [Infrastructure as Code](#/artikel/infrastructure-as-code) und betreibe Container mit [Kubernetes](#/artikel/kubernetes-grundlagen).
`;export{e as default};
