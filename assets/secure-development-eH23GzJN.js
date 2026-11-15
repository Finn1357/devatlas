const e=`---
id: secure-development
title: Sicherheit im Entwicklungsprozess: Threat Modeling, SAST, SCA & Secrets
area: security
difficulty: fortgeschritten
minutes: 19
order: 16
summary: Sicherheit von Anfang an einplanen statt am Ende prüfen – Bedrohungsmodellierung mit STRIDE, Sicherheitsanforderungen, Code-Review, statische Analyse, Abhängigkeits- und Container-Scans, Secret-Scanning, SBOM, Umgang mit Schwachstellen und Incident Response.
tags: [Secure SDLC, Threat Modeling, STRIDE, SAST, SCA, Secrets, SBOM, DevSecOps]
related: [owasp-top-10, ci-cd, paketmanager-buildtools, docker-sicherheit]
---

## Shift Left

Ein Sicherheitsfehler, der im Entwurf auffällt, kostet ein Gespräch. Derselbe Fehler in Produktion kostet Notfall-Patches, Datenpannen-Meldungen und Vertrauen. **Shift Left** heißt: Sicherheit so früh wie möglich in den Entwicklungsprozess einbauen – und so weit wie möglich **automatisieren**, damit sie nicht von einzelnen Personen abhängt.

\`\`\`text
Planen ──► Entwerfen ──► Entwickeln ──► Testen ──► Ausliefern ──► Betreiben
  │            │              │             │            │             │
Sicherheits-  Threat       Secure Coding,  SAST, SCA,   signierte    Monitoring,
anforderungen Modeling     Code Review,    DAST,        Artefakte,   Patches,
(ASVS)                     Pre-Commit      Secrets-Scan SBOM         Incident Response
\`\`\`

## Threat Modeling

**[[Threat Modeling]]** beantwortet systematisch vier Fragen (nach Adam Shostack):

1. **Woran arbeiten wir?** – Datenflussdiagramm: Komponenten, Datenspeicher, Datenflüsse, **Vertrauensgrenzen** (wo kommen nicht vertrauenswürdige Daten herein?).
2. **Was kann schiefgehen?** – Bedrohungen sammeln, z. B. mit STRIDE.
3. **Was tun wir dagegen?** – Gegenmaßnahmen festlegen oder Risiken bewusst akzeptieren.
4. **Haben wir gute Arbeit geleistet?** – überprüfen, nachbessern.

### STRIDE

| Bedrohung | Verletzt | Beispiel | Gegenmaßnahme |
|---|---|---|---|
| **S**poofing (Identität vortäuschen) | Authentizität | gestohlene Session, gefälschte E-Mail | starke Authentifizierung, MFA, Passkeys |
| **T**ampering (Manipulation) | Integrität | Preis im Request geändert | serverseitige Validierung, Signaturen, TLS |
| **R**epudiation (Abstreiten) | Nachweisbarkeit | „Diese Überweisung war ich nicht“ | Audit-Logs, manipulationssichere Protokolle |
| **I**nformation Disclosure | Vertraulichkeit | Stacktrace mit DB-Passwort, IDOR | Zugriffskontrolle, Verschlüsselung, generische Fehlermeldungen |
| **D**enial of Service | Verfügbarkeit | riesige Uploads, teure Abfragen | Rate Limiting, Größen- und Zeitlimits |
| **E**levation of Privilege | Autorisierung | normaler Nutzer wird Admin | [Zugriffskontrolle](#/artikel/zugriffskontrolle), Least Privilege |

> [!TIP] Klein anfangen
> Threat Modeling muss kein mehrtägiger Workshop sein. 30 Minuten mit Whiteboard bei jedem neuen Feature („Wo kommen fremde Daten rein? Was ist das Schlimmste, was passieren kann?“) finden erstaunlich viele Probleme.

## Sicherheitsanforderungen

Der **OWASP Application Security Verification Standard (ASVS)** ist ein Katalog prüfbarer Anforderungen in drei Stufen – etwa „Passwörter werden mit einem anerkannten, langsamen Hashverfahren gespeichert“ oder „Alle Zugriffsentscheidungen werden serverseitig getroffen“. Er eignet sich als Checkliste für Entwurf, Review und Tests. Ergänzend: die [OWASP Top 10](#/artikel/owasp-top-10) als Überblick der häufigsten Risiken und die OWASP Cheat Sheet Series mit konkreten Anleitungen.

## Code Review mit Sicherheitsblick

Fragen, die in jedem Review gestellt werden sollten:

- Wird **jede Eingabe** von außen validiert (Typ, Länge, Format, Wertebereich)?
- Werden Daten **kontextgerecht ausgegeben** (SQL-Parameter, HTML-Escaping, Shell-Argumente als Liste)?
- Prüft jeder neue Endpunkt **Authentifizierung und Berechtigung** – auch auf Objektebene?
- Landen **Secrets oder personenbezogene Daten** in Logs, Fehlermeldungen oder dem Repository?
- Werden **neue Abhängigkeiten** eingeführt? Sind sie vertrauenswürdig und gepflegt?
- Verhalten sich Fehlerfälle sicher („fail closed“ statt „fail open“)?

## Automatisierte Prüfungen

| Prüfung | Findet | Werkzeuge (Auswahl) |
|---|---|---|
| **SAST** – statische Codeanalyse | Injection-Muster, unsichere Funktionen, fest verdrahtete Passwörter | CodeQL, Semgrep, SonarQube, Bandit (Python), ESLint-Sicherheitsregeln |
| **SCA** – Abhängigkeitsanalyse | bekannte Schwachstellen (CVEs) in Bibliotheken | \`npm audit\`, \`pip-audit\`, OWASP Dependency-Check, Dependabot, Renovate, Snyk |
| **Secret-Scanning** | API-Schlüssel, Passwörter, private Schlüssel im Code und in der Git-Historie | gitleaks, TruffleHog, GitHub Secret Scanning mit Push Protection |
| **Container-/Image-Scan** | verwundbare Pakete im Image, Fehlkonfigurationen | Trivy, Grype, Docker Scout |
| **IaC-Scan** | unsichere Terraform-/Kubernetes-Konfiguration (öffentliche Buckets, privilegierte Pods) | Checkov, Trivy, tfsec |
| **DAST** – dynamische Tests | Schwachstellen in der laufenden Anwendung | OWASP ZAP, Burp Suite |

\`\`\`bash title="Beispiele für die Kommandozeile"
semgrep scan --config auto              # Regeln passend zu den erkannten Sprachen
pip-audit                               # Python-Abhängigkeiten gegen bekannte Schwachstellen prüfen
npm audit --audit-level=high            # nur ab Schweregrad "high" fehlschlagen
trivy image shop-api:1.4.0              # Container-Image scannen
trivy fs --scanners vuln,secret,misconfig .   # Projektverzeichnis scannen
\`\`\`

\`\`\`yaml title="GitHub Actions: Sicherheitsprüfungen bei jedem Pull Request"
name: security
on: [pull_request]
permissions:
  contents: read
jobs:
  scans:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Abhängigkeiten prüfen
        run: npm ci && npm audit --audit-level=high
      - name: Statische Analyse
        run: pipx run semgrep scan --config auto --error
      - name: Dateisystem-Scan (Schwachstellen, Secrets, Fehlkonfiguration)
        run: |
          curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
          trivy fs --exit-code 1 --severity HIGH,CRITICAL .
\`\`\`

> [!WARNING] Werkzeuge erzeugen Rauschen
> Automatische Scanner melden auch Falschpositive und Schwachstellen in Code, der gar nicht erreichbar ist. Ohne Triage werden Meldungen ignoriert. Regeln: Schweregrade sinnvoll filtern, Ausnahmen begründet dokumentieren, neue Funde blockieren statt den gesamten Altbestand auf einmal.

Auch das Installationsskript im Beispiel oben ist Code aus dem Internet: In sicherheitskritischen Pipelines Werkzeuge über verifizierte Pakete oder gepinnte, geprüfte Versionen beziehen.

## Secrets richtig behandeln

> [!DANGER] Ein committetes Secret ist kompromittiert
> Wurde ein API-Schlüssel gepusht – auch in ein privates Repository, auch nur für Minuten –, muss er **widerrufen und neu erzeugt** werden. Ihn aus dem nächsten Commit zu löschen reicht nicht: Er steht in der Historie, in Forks und eventuell in CI-Logs. Automatisierte Bots durchsuchen öffentliche Repositories innerhalb von Minuten.

- Secrets gehören in einen **Secret-Store**: HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, Google Secret Manager, Kubernetes Secrets (mit Verschlüsselung), CI-Secrets.
- Lokal: \`.env\`-Dateien in \`.gitignore\`; eine \`.env.example\` ohne echte Werte dokumentiert, was gebraucht wird.
- **Pre-Commit-Hook** mit einem Secret-Scanner verhindert das Problem, bevor es entsteht.
- Wo möglich **kurzlebige Zugangsdaten** statt dauerhafter Schlüssel: OIDC-Föderation von CI zur Cloud, Workload Identity, automatische Rotation.

## Lieferkette und SBOM

Moderne Anwendungen bestehen zu großen Teilen aus Fremdcode. Eine **SBOM** (Software Bill of Materials) listet alle enthaltenen Komponenten mit Version – im Format CycloneDX oder SPDX. Wird eine neue Schwachstelle bekannt, weiß man sofort, welche Produkte betroffen sind.

\`\`\`bash
syft dir:. -o cyclonedx-json > sbom.json      # SBOM aus dem Projektverzeichnis erzeugen
grype sbom:./sbom.json                         # SBOM gegen Schwachstellendatenbanken prüfen
\`\`\`

Weitere Bausteine: **signierte Artefakte und Images** (Sigstore/cosign), **Provenienz-Nachweise** nach dem SLSA-Framework, gepinnte Versionen von CI-Aktionen (idealerweise per Commit-Hash), Lockfiles – siehe [Paketmanager](#/artikel/paketmanager-buildtools). In der EU verpflichtet der **Cyber Resilience Act** Hersteller von Produkten mit digitalen Elementen schrittweise zu Schwachstellenmanagement und Sicherheitsupdates.

## Schwachstellen managen

- **CVE**: eindeutige Kennung einer öffentlich bekannten Schwachstelle (z. B. CVE-2021-44228 – Log4Shell).
- **CVSS**: Schweregrad von 0 bis 10. Wichtig ist zusätzlich der **Kontext**: Ist die Funktion bei uns überhaupt erreichbar? Ist die Lücke aktiv ausgenutzt (CISA-Liste „Known Exploited Vulnerabilities“, EPSS-Wahrscheinlichkeit)?
- **Patch-Fristen** nach Schweregrad festlegen (z. B. kritisch: Tage, hoch: Wochen) und einhalten.
- Eine **\`SECURITY.md\`** bzw. \`/.well-known/security.txt\` erklärt Sicherheitsforschenden, wie sie Lücken verantwortungsvoll melden können (Coordinated Disclosure).

## Wenn es doch passiert: Incident Response

Vorbereitet sein heißt: Bevor etwas passiert, ist geklärt,

1. **wer** entscheidet und wer informiert wird (Rufbereitschaft, Kontaktliste, Rechtsabteilung, Datenschutz),
2. **wie** man Systeme isoliert, Zugangsdaten rotiert und Beweise sichert (Logs nicht überschreiben!),
3. welche **Meldepflichten** gelten – nach DSGVO innerhalb von **72 Stunden** an die Aufsichtsbehörde bei Datenpannen mit Risiko für Betroffene; für bestimmte Einrichtungen zusätzlich nach NIS2,
4. wie man **danach** lernt: ein Post-Mortem ohne Schuldzuweisung, das die Ursachen behebt.

## Wie geht es weiter?

Wie die Prüfungen in die Auslieferung eingebaut werden, zeigt [CI/CD](#/artikel/ci-cd); Containersicherheit im Detail [Docker-Sicherheit](#/artikel/docker-sicherheit).
`;export{e as default};
