const e=`---
id: logs-forensik-einstieg
title: Logs lesen & Vorfälle erkennen: Einstieg in Blue Team und Forensik
area: security
difficulty: fortgeschritten
minutes: 20
order: 21
summary: Wie Anmelde- und Webserver-Logs aufgebaut sind, wie du darin Anmeldeangriffe, Scans und erfolgreiche Einbrüche erkennst, eine Zeitleiste baust und Spuren sauber sicherst – die Grundlage für defensive CTF-Aufgaben wie die „Sherlocks“ bei Hack The Box und für den Betrieb eigener Server.
tags: [Logs, Forensik, Blue Team, Incident Response, SIEM, grep, awk]
related: [monitoring-observability, linux-security-grundlagen, dienste-ports-angriffsflaeche, ctf-einstieg, security-methodik]
---

## Die Verteidigerseite

Angriffe hinterlassen Spuren. Das [[Blue Team]] sucht sie: Es sammelt Logs, erkennt Muster, rekonstruiert, was passiert ist, und sorgt dafür, dass es nicht wieder geschieht. Defensive Aufgaben gibt es auch als Rätsel – etwa die „Sherlocks“ bei Hack The Box oder Plattformen wie CyberDefenders und Blue Team Labs Online. Dort bekommst du Logs, Netzwerkmitschnitte oder Datenträgerabbilder und musst Fragen beantworten wie: *Wann begann der Angriff? Über welches Konto? Was wurde verändert?*

Das Schöne daran: Alles Gelernte brauchst du genauso für deine eigenen Server.

## Wichtige Logquellen

| Quelle | Wo? | Was steht drin? |
|---|---|---|
| Anmeldungen (Linux) | \`/var/log/auth.log\`, \`/var/log/secure\`, \`journalctl -u ssh\` | SSH-Anmeldungen, \`sudo\`, Benutzeränderungen |
| Webserver | \`/var/log/nginx/access.log\`, \`error.log\` | jede Anfrage mit Adresse, Pfad, Status, User-Agent |
| Anwendung | eigene Logdateien, oft JSON | fachliche Ereignisse, Fehler |
| Windows | Ereignisanzeige (Security-Log) | z. B. 4624 erfolgreiche, 4625 fehlgeschlagene Anmeldung, 4720 Benutzer angelegt |
| Netzwerk | Firewall-Logs, PCAP-Mitschnitte | Verbindungen, übertragene Daten |

## Anmeldelogs lesen

Ein Ausschnitt aus einem SSH-Log (die Adressen stammen aus Bereichen, die für Dokumentation reserviert sind):

\`\`\`text title="auth.log (Ausschnitt)"
Nov 21 03:14:02 web01 sshd[2211]: Failed password for invalid user admin from 203.0.113.45 port 51122 ssh2
Nov 21 03:14:05 web01 sshd[2213]: Failed password for invalid user test from 203.0.113.45 port 51130 ssh2
Nov 21 03:14:09 web01 sshd[2215]: Failed password for root from 203.0.113.45 port 51141 ssh2
Nov 21 03:20:44 web01 sshd[2301]: Failed password for deploy from 198.51.100.7 port 40210 ssh2
Nov 21 03:20:51 web01 sshd[2303]: Failed password for deploy from 198.51.100.7 port 40222 ssh2
Nov 21 03:21:03 web01 sshd[2307]: Accepted password for deploy from 198.51.100.7 port 40240 ssh2
Nov 21 03:21:03 web01 sshd[2307]: pam_unix(sshd:session): session opened for user deploy
Nov 21 03:22:15 web01 sudo:   deploy : TTY=pts/0 ; PWD=/home/deploy ; USER=root ; COMMAND=/usr/bin/cat /etc/shadow
\`\`\`

Was erzählt dieses Log?

1. \`203.0.113.45\` probiert typische Benutzernamen (\`admin\`, \`test\`, \`root\`) – automatisiertes Rauschen, das jeder öffentliche SSH-Server erlebt.
2. \`198.51.100.7\` versucht es gezielt beim Konto \`deploy\`, scheitert zweimal – und ist **beim dritten Mal erfolgreich**. Das Konto nutzt also Passwort-Anmeldung mit einem erratbaren Passwort.
3. Eine Minute später liest \`deploy\` mit \`sudo\` die Passwort-Hashes. Spätestens jetzt ist klar: Das ist ein Vorfall, kein Rauschen.

> [!INFO] Das wichtigste Muster
> **Viele Fehlversuche, dann ein Erfolg – von derselben Adresse.** Genau diese Korrelation automatisiert ein [[SIEM]]. Einzelne Fehlversuche sind normal; ein Erfolg nach einer Serie ist ein Alarm.

### Mit der Kommandozeile auswerten

\`\`\`bash title="Fehlversuche pro Adresse zählen"
grep "Failed password" auth.log \\
  | grep -oE "from [0-9.]+" \\
  | sort | uniq -c | sort -rn
\`\`\`

\`\`\`bash title="Erfolgreiche Anmeldungen"
grep "Accepted" auth.log | awk '{print $1, $2, $3, $9, $11}'
\`\`\`

Das Gleiche in Python – direkt hier ausführbar:

\`\`\`python title="Fehlversuche und Erfolge pro Adresse"
import re
from collections import Counter

log = """Failed password for invalid user admin from 203.0.113.45 port 51122 ssh2
Failed password for root from 203.0.113.45 port 51141 ssh2
Failed password for deploy from 198.51.100.7 port 40210 ssh2
Failed password for deploy from 198.51.100.7 port 40222 ssh2
Accepted password for deploy from 198.51.100.7 port 40240 ssh2"""

fehl = Counter(re.findall(r"Failed password .* from ([\\d.]+)", log))
erfolg = set(re.findall(r"Accepted \\w+ for \\w+ from ([\\d.]+)", log))
for ip, n in fehl.most_common():
    hinweis = "  ← danach erfolgreich angemeldet!" if ip in erfolg else ""
    print(f"{ip:15} {n} Fehlversuche{hinweis}")
\`\`\`

## Webserver-Logs lesen

Nginx und Apache schreiben standardmäßig im *Combined Log Format*:

\`\`\`text title="access.log (Ausschnitt)"
198.51.100.23 - - [21/Nov/2026:10:02:11 +0000] "GET /wp-login.php HTTP/1.1" 404 153 "-" "Mozilla/5.0 (compatible; scanner)"
198.51.100.23 - - [21/Nov/2026:10:02:11 +0000] "GET /.git/config HTTP/1.1" 404 153 "-" "Mozilla/5.0 (compatible; scanner)"
198.51.100.23 - - [21/Nov/2026:10:02:12 +0000] "GET /.env HTTP/1.1" 200 412 "-" "Mozilla/5.0 (compatible; scanner)"
192.0.2.10 - - [21/Nov/2026:10:05:40 +0000] "GET /artikel/start HTTP/1.1" 200 5120 "https://example.org/" "Mozilla/5.0 (Android 14)"
\`\`\`

Felder: Adresse · Benutzer · Zeitpunkt · Anfrage · **Status** · Größe · Referer · User-Agent.

Die Geschichte: Ein Scanner fragt in einer Sekunde nach typischen Pfaden – \`wp-login.php\` (obwohl die Seite kein WordPress ist), \`.git/config\` und \`.env\`. Die ersten beiden ergeben 404, aber **\`/.env\` liefert 200 mit 412 Bytes**. Die Konfigurationsdatei mit Zugangsdaten liegt also öffentlich im Webverzeichnis. Sofortmaßnahmen: Datei entfernen, **alle darin enthaltenen Geheimnisse austauschen** (sie gelten als bekannt), Webserver so konfigurieren, dass er versteckte Dateien nie ausliefert.

\`\`\`bash title="Auswertungen"
awk '{print $9}' access.log | sort | uniq -c | sort -rn          # Statuscodes
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head   # aktivste Adressen
awk '$9 == 200 && $7 ~ /^\\/\\./' access.log                       # erfolgreiche Zugriffe auf versteckte Pfade
\`\`\`

> [!TIP] Muster für Scans
> Viele 404 in kurzer Zeit, Pfade typischer fremder Software, ungewöhnliche User-Agents. Interessant wird es immer dort, wo zwischen den vielen Fehlern **ein Erfolg** auftaucht.

## Eine Zeitleiste bauen

Vorfälle versteht man erst in der richtigen Reihenfolge. Sammle alle relevanten Ereignisse aus allen Quellen in einer Tabelle: Zeitpunkt, Quelle, Ereignis, Bedeutung.

| Zeit (UTC) | Quelle | Ereignis |
|---|---|---|
| 03:20:44 | auth.log | erster Fehlversuch \`deploy\` von 198.51.100.7 |
| 03:21:03 | auth.log | Anmeldung \`deploy\` erfolgreich |
| 03:22:15 | auth.log | \`sudo cat /etc/shadow\` |
| … | access.log | … |

> [!WARNING] Zeitzonen und Uhren
> Logs verschiedener Systeme verwenden oft unterschiedliche Zeitzonen – und laufende Uhren ohne NTP weichen ab. Rechne alles in UTC um und notiere, welche Uhr du für maßgeblich hältst. Viele falsche Schlüsse in Untersuchungen entstehen genau hier.

## Spuren sichern: Grundsätze der Forensik

[[Digitale Forensik]] heißt, so zu arbeiten, dass Ergebnisse nachvollziehbar und belastbar sind:

- **An Kopien arbeiten**, nie an den Originalen.
- **Integrität belegen:** Hashes der gesicherten Dateien notieren – ändert sich ein Bit, ändert sich der Hash.
- **Alles dokumentieren:** Wer hat wann was gesichert und untersucht (Chain of Custody)?
- **Flüchtiges zuerst:** Arbeitsspeicher und laufende Verbindungen verschwinden beim Neustart, Datenträger nicht.

\`\`\`bash title="Sicherung mit Prüfsumme"
cp /var/log/auth.log ./beweise/auth.log
sha256sum ./beweise/auth.log | tee ./beweise/auth.log.sha256
sha256sum -c ./beweise/auth.log.sha256   # später: unverändert?
\`\`\`

Gefundene Spuren wie Adressen, Domains oder Datei-Hashes heißen [[Indicator of Compromise|Indicators of Compromise]] (IOCs). Man sucht mit ihnen in weiteren Systemen nach demselben Angreifer und teilt sie mit anderen Verteidigern.

## Netzwerkmitschnitte

Defensive Aufgaben enthalten oft eine PCAP-Datei – einen Mitschnitt des Netzwerkverkehrs. In **Wireshark** filterst du zum Beispiel mit \`http.request\` alle Webanfragen oder mit \`ip.addr == 198.51.100.7\` den Verkehr einer Adresse; „Follow TCP Stream“ zeigt eine Verbindung als lesbaren Text. Unverschlüsselte Protokolle (HTTP, FTP, Telnet) geben dabei alles preis – ein weiterer Grund, sie im echten Betrieb nicht zu verwenden.

## Typische Fehler

> [!MISTAKE] Logs nur auf dem betroffenen Server
> Wer einen Server übernimmt, kann dessen Logs löschen oder fälschen. Schicke Logs zusätzlich an einen zentralen Ort, auf den der Server selbst nur schreiben, aber nichts löschen darf.

- **Geheimnisse im Log:** Passwörter in URLs (\`?password=…\`) oder vollständige Tokens landen im Access-Log.
- **Zu kurze Aufbewahrung:** Viele Vorfälle werden erst nach Wochen entdeckt.
- **Keine Zeitsynchronisation:** ohne NTP keine verlässliche Zeitleiste.
- **Vorschnelle Schlüsse:** Eine Adresse im Log ist nicht automatisch der Täter – sie kann gefälscht, geteilt oder selbst übernommen sein.

\`\`\`widget
quiz:CTF-Grundlagen 3
\`\`\`

## Übungsfragen

> 1. Woran erkennst du im SSH-Log den Unterschied zwischen automatisiertem Rauschen und einem erfolgreichen Angriff?
> 2. Ein Access-Log zeigt \`GET /backup.zip\` mit Status 200 und 48 MB von einer unbekannten Adresse. Was tust du als Erstes?
> 3. Warum notierst du beim Sichern von Logdateien deren SHA-256-Hash?

## Wie geht es weiter?

Im [Rätsel-Labor](#/labor/raetsel) findest du kleine Log-Aufgaben zum Üben. Wie man Logs dauerhaft und zentral sammelt, beschreibt [Monitoring & Observability](#/artikel/monitoring-observability); für reguläre Ausdrücke zum Filtern hilft der [Regex-Tester](#/labor/regex).
`;export{e as default};
