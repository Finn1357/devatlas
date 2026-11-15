const e=`---
id: owasp-top-10
title: OWASP Top 10 & Secure Coding
area: security
difficulty: fortgeschritten
minutes: 20
order: 10
summary: Die zehn kritischsten Risiken für Webanwendungen verständlich erklärt – jeweils mit Beispiel und konkreten Schutzmaßnahmen – plus Threat Modeling, Secrets Management und Security-Tests.
tags: [OWASP, Security, Secure Coding, Threat Modeling, Access Control]
related: [injection, xss-csrf-cors, authentifizierung, passwoerter-kryptografie, docker-sicherheit, zugriffskontrolle, https-security-header, secure-development]
---

## Was ist die OWASP Top 10?

Die [[OWASP Top 10]] ist eine regelmäßig aktualisierte Liste der kritischsten Sicherheitsrisiken für Webanwendungen, herausgegeben vom Open Worldwide Application Security Project auf Basis von Daten aus Hunderttausenden Anwendungen. Sie ist kein vollständiger Standard, aber der beste Startpunkt, um die häufigsten Fehler zu vermeiden. Die Übersicht unten folgt der verbreiteten Ausgabe 2021; die Ausgabe 2025 setzt neue Schwerpunkte (u. a. Supply Chain und fehlerhafte Fehlerbehandlung), die grundlegenden Schutzmaßnahmen bleiben dieselben.

> [!DANGER] Nur in eigenen Testumgebungen
> Alle Beispiele dienen dem Verständnis und der Verteidigung. Teste Sicherheitslücken ausschließlich in eigenen Systemen oder mit schriftlicher Erlaubnis.

## A01 – Broken Access Control

Nutzer können auf Daten oder Funktionen zugreifen, die ihnen nicht zustehen – das häufigste Risiko.

\`\`\`python title="Unsicher: IDOR (Insecure Direct Object Reference)"
@app.get("/api/rechnungen/{rechnung_id}")
def rechnung(rechnung_id: int, user = Depends(aktueller_nutzer)):
    return db.lade_rechnung(rechnung_id)        # jeder angemeldete Nutzer sieht JEDE Rechnung
\`\`\`

\`\`\`python title="Sicher: Besitz prüfen"
@app.get("/api/rechnungen/{rechnung_id}")
def rechnung(rechnung_id: int, user = Depends(aktueller_nutzer)):
    r = db.lade_rechnung(rechnung_id)
    if r is None or r.kunde_id != user.id:
        raise HTTPException(404)                 # 404 verrät nicht, dass die Rechnung existiert
    return r
\`\`\`

**Schutz:** [[Autorisierung]] serverseitig bei **jeder** Anfrage und für **jedes** Objekt; „Deny by default“; Rechteprüfung zentral (Policies), nicht verstreut; Tests für Zugriffsregeln.

## A02 – Cryptographic Failures

Sensible Daten werden ungeschützt übertragen oder gespeichert: kein HTTPS, Passwörter mit MD5, selbstgebaute Verschlüsselung, Schlüssel im Code.

**Schutz:** [[HTTPS]] überall (mit HSTS), Passwörter mit [[Argon2]]/bcrypt [[Hashing|hashen]], geprüfte Bibliotheken für [[Verschlüsselung]] (AES-GCM), Schlüssel im [[Secrets Management|Secret-Store]], nur nötige Daten speichern. Details: [Passwörter & Kryptografie](#/artikel/passwoerter-kryptografie).

## A03 – Injection

Nutzereingaben werden als Code interpretiert: [[SQL Injection]], [[Command Injection]], NoSQL-, LDAP-Injection und – seit 2021 hier eingeordnet – [[XSS]].

**Schutz:** parametrisierte Abfragen, keine Shell, kontextgerechtes Output-Encoding. Ausführlich: [Injection](#/artikel/injection) und [XSS, CSRF & CORS](#/artikel/xss-csrf-cors).

## A04 – Insecure Design

Sicherheitslücken im **Entwurf**, die keine Implementierung mehr retten kann – etwa ein Passwort-Reset über „Sicherheitsfragen“ oder ein Gutscheinsystem ohne Begrenzung.

**Schutz:** [[Threat Modeling]] früh im Projekt, sichere Entwurfsmuster, Missbrauchsfälle („Wie würde ich das ausnutzen?“) neben Anwendungsfällen betrachten.

## A05 – Security Misconfiguration

Standardpasswörter, offene Admin-Oberflächen, ausführliche Fehlermeldungen in Produktion, Debug-Modus aktiv, unnötige Dienste, fehlende Sicherheitsheader, öffentliche Cloud-Buckets.

**Schutz:** gehärtete, automatisierte Konfiguration ([[Infrastructure as Code]]), minimale Installation, Sicherheitsheader (CSP, HSTS, \`X-Content-Type-Options: nosniff\`), regelmäßige Konfigurationsprüfungen.

## A06 – Vulnerable and Outdated Components

Bibliotheken, Frameworks oder Basis-Images mit bekannten Sicherheitslücken ([[CVE|CVEs]]). Prominentes Beispiel: Log4Shell (CVE-2021-44228) in der Java-Bibliothek Log4j.

**Schutz:** Inventar aller Abhängigkeiten (SBOM), automatische Scans (\`npm audit\`, \`pip-audit\`, Dependabot/Renovate, Trivy), regelmäßige Updates, ungenutzte Abhängigkeiten entfernen. Siehe [[Supply-Chain-Angriff]].

## A07 – Identification and Authentication Failures

Schwache Passwortregeln, kein Schutz gegen [[Brute Force]] und Credential Stuffing, vorhersagbare Session-IDs, Sessions, die nach dem Logout weiter gelten.

**Schutz:** [[MFA]]/[[Passkey|Passkeys]], [[Rate Limiting]], Abgleich mit geleakten Passwörtern, sichere Session-Verwaltung. Siehe [Authentifizierung](#/artikel/authentifizierung).

## A08 – Software and Data Integrity Failures

Code oder Daten werden ohne Integritätsprüfung vertraut: ungeprüfte Updates, manipulierbare CI/CD-Pipelines, unsichere [[Serialisierung|Deserialisierung]] (z. B. Python \`pickle\` mit fremden Daten).

**Schutz:** Signaturen prüfen, Abhängigkeiten aus vertrauenswürdigen Quellen mit [[Lockfile|Lockfiles]], Pipelines absichern (Actions per SHA pinnen), keine Deserialisierung fremder Daten in ausführbare Objekte.

## A09 – Security Logging and Monitoring Failures

Angriffe bleiben unbemerkt, weil sicherheitsrelevante Ereignisse nicht protokolliert oder nicht ausgewertet werden.

**Schutz:** Logins, Fehlschläge, Rechteänderungen und Zugriffsverweigerungen [[Logging|loggen]] (ohne Passwörter/Tokens), Alarme bei Auffälligkeiten, Incident-Response-Plan.

## A10 – Server-Side Request Forgery (SSRF)

Der Server ruft eine vom Nutzer angegebene URL ab – und lässt sich so ins interne Netz oder zum Cloud-Metadatendienst lenken ([[SSRF]]).

\`\`\`python title="Unsicher"
@app.post("/api/vorschau")
def vorschau(url: str):
    return requests.get(url, timeout=5).text      # url = http://169.254.169.254/latest/meta-data/ …
\`\`\`

**Schutz:** Allowlist erlaubter Ziele, Ziel-IP nach DNS-Auflösung prüfen (keine privaten/link-lokalen Bereiche), Weiterleitungen nicht blind folgen, ausgehenden Netzwerkverkehr per Firewall beschränken, in der Cloud IMDSv2 erzwingen.

## Querschnittsthemen

### Threat Modeling

Stelle vier Fragen: **Was bauen wir? Was kann schiefgehen? Was tun wir dagegen? Haben wir gut gearbeitet?** Zeichne Datenflüsse mit Vertrauensgrenzen (Browser ↔ API ↔ Datenbank ↔ Drittanbieter) und gehe sie mit **STRIDE** durch: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege.

### Secrets Management

- Keine Secrets im Code oder im Repository – auch nicht „nur kurz“. \`.env\` gehört in [[.gitignore]].
- Secret-Scanning (gitleaks, GitHub Push Protection) in CI und als Pre-Commit-Hook.
- Secrets aus einem Store laden (Vault, Cloud Secret Manager) und **rotieren**.
- Geleakte Secrets sofort widerrufen – aus der Git-Historie entfernen genügt nicht, denn sie wurden längst kopiert.

### Security-Tests

| Art | Was | Werkzeuge |
|---|---|---|
| SAST | Quellcode statisch analysieren | Semgrep, CodeQL, SonarQube |
| SCA | Abhängigkeiten auf CVEs prüfen | Dependabot, Renovate, Snyk, Trivy |
| DAST | laufende Anwendung von außen testen | OWASP ZAP |
| Secrets-Scan | Geheimnisse im Code finden | gitleaks, trufflehog |
| [[Penetrationstest]] | manuelle Prüfung durch Expert:innen | mit klarem Scope und Erlaubnis |

## Grundprinzipien

1. **[[Least Privilege]]:** minimale Rechte für Nutzer, Dienste, Datenbankkonten, Container.
2. **[[Defense in Depth]]:** mehrere unabhängige Schutzschichten.
3. **Secure by Default:** sichere Standardeinstellungen; Lockerungen bewusst und dokumentiert.
4. **Eingaben validieren, Ausgaben kodieren.**
5. **Fail securely:** Fehler führen in einen sicheren Zustand und verraten keine Interna.
6. **Keep it simple:** Komplexität ist der natürliche Feind von Sicherheit.

## Wie geht es weiter?

Vertiefe [Injection](#/artikel/injection), [XSS, CSRF & CORS](#/artikel/xss-csrf-cors) und [Container-Sicherheit](#/artikel/docker-sicherheit). Teste dich im [Security-Quiz](#/quiz?cat=Security).
`;export{e as default};
