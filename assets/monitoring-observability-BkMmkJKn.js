const e=`---
id: monitoring-observability
title: Monitoring & Observability
area: devops
difficulty: fortgeschritten
minutes: 15
order: 25
summary: Logs, Metriken und Traces – wie du erkennst, dass etwas kaputt ist, und herausfindest, warum. Mit Prometheus, Grafana, strukturiertem Logging, OpenTelemetry und sinnvollen Alerts.
tags: [Monitoring, Observability, Logging, Prometheus, Grafana, OpenTelemetry]
related: [kubernetes-grundlagen, ci-cd, docker-sicherheit]
---

## Monitoring vs. Observability

**[[Monitoring]]** beantwortet bekannte Fragen: Ist die Fehlerrate über 1 %? Ist die Festplatte voll? **[[Observability]]** geht weiter: Sie erlaubt dir, auch **unbekannte** Probleme zu untersuchen – „Warum sind Bestellungen von Mobilgeräten seit 14 Uhr langsam?“ –, ohne vorher genau diese Frage vorhergesehen zu haben.

## Die drei Säulen

| Signal | Was es ist | Stärke | Werkzeuge |
|---|---|---|---|
| **[[Logging|Logs]]** | Einzelne Ereignisse mit Kontext | Details zu einem konkreten Fall | Loki, Elasticsearch/OpenSearch, CloudWatch Logs |
| **[[Metrik|Metriken]]** | Zahlenreihen über die Zeit | Trends, Alarme, günstig zu speichern | Prometheus, Datadog, Azure Monitor |
| **Traces** | Weg einer Anfrage über alle Dienste | Wo geht die Zeit verloren? | Jaeger, Tempo, Zipkin |

**OpenTelemetry** ist der herstellerneutrale Standard, um alle drei Signale aus Anwendungen zu erfassen und an beliebige Backends zu senden.

## Was messen? Die Golden Signals

Für jeden Dienst, der Anfragen beantwortet, haben sich vier Signale bewährt:

1. **Latenz** – wie lange dauern Anfragen? (Perzentile p50/p95/p99, nicht nur Durchschnitt!)
2. **Traffic** – wie viele Anfragen pro Sekunde?
3. **Fehler** – welcher Anteil schlägt fehl?
4. **Sättigung** – wie ausgelastet sind CPU, Speicher, Verbindungspools, Queues?

> [!EXPERT] Warum Perzentile?
> Ein Durchschnitt von 120 ms kann bedeuten, dass 99 % in 50 ms antworten und 1 % in 7 Sekunden. Genau dieses eine Prozent sind oft deine wichtigsten Kunden mit den größten Warenkörben. p95/p99 machen solche Ausreißer sichtbar.

## Strukturiertes Logging

Logs sollten **maschinenlesbar** sein (JSON), einen eindeutigen Request-Kontext tragen und keine sensiblen Daten enthalten.

\`\`\`python title="Strukturiertes Logging in Python"
import json, logging, sys, time, uuid

class JsonFormatter(logging.Formatter):
    def format(self, record):
        daten = {"zeit": time.strftime("%Y-%m-%dT%H:%M:%S"), "level": record.levelname, "msg": record.getMessage()}
        daten.update(getattr(record, "kontext", {}))
        return json.dumps(daten, ensure_ascii=False)

handler = logging.StreamHandler(sys.stdout)          # nach stdout – Container sammeln das ein
handler.setFormatter(JsonFormatter())
log = logging.getLogger("shop")
log.addHandler(handler)
log.setLevel(logging.INFO)

request_id = str(uuid.uuid4())
log.info("Bestellung angelegt", extra={"kontext": {"request_id": request_id, "bestellung": 4711, "dauer_ms": 83}})
\`\`\`

> [!DANGER] Keine Geheimnisse in Logs
> Passwörter, Tokens, vollständige Kreditkartennummern und unnötige personenbezogene Daten haben in Logs nichts verloren – Logs werden breit geteilt und lange aufbewahrt.

## Metriken mit Prometheus

[Prometheus](#/tech/prometheus) fragt („scraped“) regelmäßig einen \`/metrics\`-Endpunkt deiner Anwendung ab und speichert die Werte als Zeitreihen. Bibliotheken gibt es für alle verbreiteten Sprachen.

\`\`\`javascript title="Node.js mit prom-client"
import express from 'express';
import client from 'prom-client';

const app = express();
client.collectDefaultMetrics();                       // CPU, Speicher, Event-Loop-Lag …

const dauer = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Dauer der HTTP-Anfragen',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5],
});

app.use((req, res, next) => {
  const ende = dauer.startTimer();
  res.on('finish', () => ende({ method: req.method, route: req.route?.path ?? 'unbekannt', status: res.statusCode }));
  next();
});

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});
\`\`\`

Abgefragt und visualisiert wird mit PromQL in [Grafana](#/tech/grafana) – Beispiele findest du auf der [Prometheus-Seite](#/tech/prometheus).

> [!MISTAKE] Hohe Kardinalität
> Labels wie \`user_id\` oder die vollständige URL mit IDs erzeugen Millionen Zeitreihen und legen Prometheus lahm. Labels nur für Werte mit wenigen Ausprägungen (Methode, Route-Muster, Statuscode).

## Alerting, das hilft

- **Auf Symptome alarmieren**, die Nutzer spüren (Fehlerrate, Latenz), nicht auf jede Ursache (CPU 80 %).
- Jeder Alert braucht eine **klare Handlung** und einen Link zu einem Runbook.
- **SLOs** (Service Level Objectives) definieren, was „gut genug“ ist, z. B. „99,9 % der Anfragen in < 300 ms“. Das verbleibende Fehlerbudget steuert, wie riskant ihr deployen dürft.
- Alert-Müdigkeit vermeiden: Lieber wenige, wichtige Alarme als ständiges Rauschen.

## Distributed Tracing

In einer Microservice-Architektur durchläuft eine Bestellung vielleicht fünf Dienste. Ein **Trace** verbindet alle beteiligten Schritte („Spans“) über eine gemeinsame Trace-ID, die in HTTP-Headern (\`traceparent\`, W3C Trace Context) weitergegeben wird. So siehst du auf einen Blick, dass 800 von 900 ms im Zahlungsdienst verbracht werden.

## Wie geht es weiter?

Kombiniere Monitoring mit [CI/CD](#/artikel/ci-cd), um nach jedem Deployment automatisch auf Fehlerraten zu reagieren (Canary-Analyse), und betrachte Observability als festen Teil der [Architektur](#/artikel/architekturstile).
`;export{e as default};
