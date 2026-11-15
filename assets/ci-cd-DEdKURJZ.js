const e=`---
id: ci-cd
title: CI/CD: Automatisch testen, bauen und ausliefern
area: devops
difficulty: fortgeschritten
minutes: 16
order: 21
summary: Was Continuous Integration, Delivery und Deployment unterscheidet, wie eine gute Pipeline aufgebaut ist und wie du sie mit GitHub Actions umsetzt – inklusive Deployment-Strategien.
tags: [CI/CD, GitHub Actions, Pipeline, Deployment, DevOps]
related: [git-grundlagen, testing, docker-sicherheit, kubernetes-grundlagen, secure-development]
---

## Was ist CI/CD?

[[CI/CD]] beschreibt die Automatisierung des Weges von einer Codeänderung bis zur laufenden Software:

- **Continuous Integration (CI):** Jede Änderung wird sofort und automatisch gebaut und getestet. Ziel: Integrationsprobleme früh entdecken, solange sie klein sind.
- **Continuous Delivery:** Jede Änderung, die die Pipeline besteht, *kann* jederzeit per Knopfdruck ausgeliefert werden.
- **Continuous Deployment:** Jede bestandene Änderung *wird* automatisch in Produktion ausgerollt.

> [!BEGINNER]
> Ein Fließband für Software: Du legst deine Änderung oben drauf, und Roboter prüfen, bauen, verpacken und liefern sie aus. Fällt eine Prüfung durch, hält das Band an, bevor etwas Kaputtes beim Kunden ankommt.

## Warum CI/CD?

- **Schnelles Feedback:** Fehler fallen Minuten nach dem Commit auf, nicht Wochen später.
- **Kleine, risikoarme Releases** statt seltener „Big Bang“-Deployments.
- **Reproduzierbarkeit:** Gebaut wird immer gleich, nicht auf irgendeinem Entwicklerlaptop.
- **Messbar besser:** Die DORA-Forschung verknüpft häufige Deployments und kurze Durchlaufzeiten mit stabileren Systemen.

## Aufbau einer Pipeline

\`\`\`widget
pipeline:cicd-stages
\`\`\`

Den gesamten Weg vom \`git push\` bis zum Rolling Update im Cluster zeigt dieser Ablauf:

\`\`\`widget
flow:ci-cd
\`\`\`

## GitHub Actions in der Praxis

Workflows liegen als YAML unter \`.github/workflows/\`. Fahre über die markierten Zeilen:

\`\`\`widget
annotated:github-actions-ci
\`\`\`

### Matrix-Builds

Mit einer Matrix testest du gleichzeitig gegen mehrere Versionen oder Betriebssysteme:

\`\`\`yaml
jobs:
  test:
    strategy:
      matrix:
        node: [20, 22]
        os: [ubuntu-latest, windows-latest]
    runs-on: \${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "\${{ matrix.node }}" }
      - run: npm ci && npm test
\`\`\`

### Datenbanken in CI

Integrationstests mit echter Datenbank nutzen **Service-Container**:

\`\`\`yaml
    services:
      postgres:
        image: postgres:17
        env: { POSTGRES_PASSWORD: test }
        ports: ["5432:5432"]
        options: >-
          --health-cmd "pg_isready" --health-interval 5s --health-retries 10
\`\`\`

## Deployment-Strategien

| Strategie | Ablauf | Vorteil | Nachteil |
|---|---|---|---|
| **Recreate** | Alte Version stoppen, neue starten | Einfach | Downtime |
| **Rolling Update** | Instanzen schrittweise ersetzen | Keine Downtime | Kurz zwei Versionen parallel |
| **[[Blue-Green Deployment|Blue-Green]]** | Neue Umgebung daneben, dann umschalten | Sofortiger Rollback | Doppelte Ressourcen |
| **Canary** | Kleiner Traffic-Anteil auf neue Version | Risiko minimal, echte Messung | Monitoring nötig |
| **Feature Flags** | Code ausliefern, Funktion später freischalten | Entkoppelt Deploy und Release | Flag-Pflege |

> [!WARNING] Datenbankmigrationen und Rollbacks
> Während eines Rolling Updates laufen alte und neue Version gleichzeitig gegen dieselbe Datenbank. Migrationen müssen deshalb **abwärtskompatibel** sein (Expand → Code umstellen → Contract). Mehr dazu unter [ORMs & Migrationen](#/artikel/orm-migrationen).

## Sicherheit in der Pipeline

- Secrets nur über den Secret-Store der Plattform, nie im Repository oder in Logs.
- \`permissions:\` des automatischen Tokens minimal halten.
- Fremde Actions **per Commit-SHA pinnen** – Tags können umgehängt werden ([[Supply-Chain-Angriff]]).
- Pull Requests aus Forks nicht mit Zugriff auf Secrets ausführen.
- Abhängigkeits- und Image-Scans als blockierende Schritte.
- Bevorzugt kurzlebige Zugangsdaten per OpenID Connect zur Cloud statt langlebiger Access Keys.

## Typische Fehler

> [!MISTAKE] Flaky Tests ignorieren
> Tests, die mal grün und mal rot sind, zerstören das Vertrauen in die Pipeline – irgendwann klickt jeder auf „Re-run“. Flaky Tests sofort reparieren oder in Quarantäne nehmen.

> [!MISTAKE] Langsame Pipelines
> Eine Pipeline, die 45 Minuten braucht, wird umgangen. Caches nutzen, schnelle Checks zuerst, Jobs parallelisieren, teure E2E-Tests gezielt einsetzen.

## Wie geht es weiter?

Lerne, was in die Pipeline gehört, im Artikel [Testing](#/artikel/testing), und wohin ausgeliefert wird, in [Kubernetes](#/artikel/kubernetes-grundlagen) oder [Linux-Server & Nginx](#/artikel/linux-server-nginx).
`;export{e as default};
