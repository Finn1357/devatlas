const e=`---
id: dienste-ports-angriffsflaeche
title: Dienste, Ports & Angriffsfläche: Was ein Server nach außen zeigt
area: security
difficulty: einsteiger
minutes: 16
order: 20
summary: Welche Dienste auf welchen Ports lauschen, was „an 0.0.0.0 gebunden“ bedeutet, welche offenen Dienste riskant sind und wie du die Angriffsfläche deines eigenen Servers prüfst und verkleinerst – das Wissen, das Verteidiger und CTF-Einsteiger gleichermaßen brauchen.
tags: [Ports, Dienste, Firewall, Angriffsfläche, SSH, Härtung, Netzwerk]
related: [netzwerke-tcp-ip-dns, linux-security-grundlagen, linux-server-nginx, docker-volumes-netzwerke, ctf-einstieg]
---

## Dienste, Ports und Adressen

Ein **Dienst** ist ein Programm, das auf Anfragen wartet: ein Webserver, eine Datenbank, ein SSH-Server. Er lauscht auf einem [[Port]] – einer Nummer zwischen 1 und 65535 –, über TCP oder UDP. Zusammen mit der IP-Adresse ergibt sich die Stelle, an der man ihn erreicht. Die Grundlagen dazu erklärt [Netzwerke: TCP/IP, Ports & DNS](#/artikel/netzwerke-tcp-ip-dns).

Die **[[Angriffsfläche]]** eines Servers ist alles, was von außen erreichbar ist: jeder offene Port, jede Anmeldemaske, jede Schnittstelle. Jeder Dienst bringt eigenen Code mit – und damit mögliche Fehler. Die wirksamste Regel der Systemhärtung lautet deshalb: **Was nicht laufen muss, läuft nicht. Was nicht erreichbar sein muss, ist es nicht.**

## Häufige Dienste und ihre Standardports

| Port | Dienst | Worauf es ankommt |
|---|---|---|
| 22/tcp | SSH | nur Schlüssel-Anmeldung, kein root-Login, Updates |
| 80, 443/tcp | HTTP, HTTPS | nur HTTPS ausliefern, HTTP auf HTTPS umleiten |
| 21/tcp | FTP | überträgt Passwörter unverschlüsselt → durch SFTP ersetzen |
| 23/tcp | Telnet | unverschlüsselt, gehört nicht ins Netz |
| 25, 587/tcp | SMTP | offene Relays verhindern, Authentifizierung erzwingen |
| 53/udp+tcp | DNS | keine offenen Resolver für das ganze Internet |
| 139, 445/tcp | SMB (Windows-Freigaben) | niemals direkt ins Internet |
| 3389/tcp | RDP (Windows-Remotedesktop) | nur über VPN, mit Netzwerkauthentifizierung |
| 3306/tcp | MySQL/MariaDB | nur lokal bzw. im privaten Netz |
| 5432/tcp | PostgreSQL | nur lokal bzw. im privaten Netz |
| 6379/tcp | Redis | standardmäßig ohne Passwort – nie öffentlich |
| 27017/tcp | MongoDB | nur mit Authentifizierung, nie öffentlich |
| 8080, 8000, 3000/tcp | Entwicklungs- und Admin-Oberflächen | vergessene Testserver sind ein häufiger Fund |

Ports sind nur Konventionen: Ein Dienst kann auf jedem Port lauschen. Ein SSH-Server auf Port 2222 ist nicht sicherer, sondern nur etwas weniger laut in den Logs.

## Lokal oder für alle? Die Bind-Adresse

Ein Dienst lauscht immer an einer Adresse:

- \`127.0.0.1:5432\` – nur vom Rechner selbst erreichbar (localhost).
- \`0.0.0.0:5432\` bzw. \`[::]:5432\` – an **allen** Netzwerkschnittstellen, also potenziell aus dem Internet.
- \`10.0.0.5:5432\` – nur über diese eine Schnittstelle, etwa im privaten Netz.

Welche Dienste auf deinem System lauschen, zeigt \`ss\`:

\`\`\`bash title="Eigenes System: lauschende Dienste anzeigen"
sudo ss -tulpn
\`\`\`

\`\`\`text title="Beispielausgabe (gekürzt)"
Netid State  Local Address:Port  Process
tcp   LISTEN 0.0.0.0:22          users:(("sshd",pid=812))
tcp   LISTEN 127.0.0.1:5432      users:(("postgres",pid=901))
tcp   LISTEN 0.0.0.0:6379        users:(("redis-server",pid=955))
tcp   LISTEN 0.0.0.0:443         users:(("nginx",pid=1020))
\`\`\`

> [!WARNING] Der Fund in der Beispielausgabe
> Redis lauscht an \`0.0.0.0\` – ohne Firewall wäre die Datenbank aus dem Internet erreichbar, und Redis verlangt standardmäßig kein Passwort. Richtig wäre \`bind 127.0.0.1\` in der Redis-Konfiguration. PostgreSQL macht es vor: nur localhost.

## Die Firewall als zweite Linie

Eine [[Firewall]] lässt nur ausdrücklich erlaubten Verkehr durch. Auf Ubuntu ist \`ufw\` der einfachste Einstieg:

\`\`\`bash title="Standard: alles ablehnen, nur Nötiges erlauben"
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80,443/tcp
sudo ufw enable
sudo ufw status verbose
\`\`\`

> [!DANGER] Docker umgeht ufw
> Ein Container mit \`-p 5432:5432\` bzw. \`ports: ["5432:5432"]\` ist aus dem Internet erreichbar, **auch wenn ufw den Port blockiert** – Docker trägt eigene Regeln direkt in iptables ein. Veröffentliche Datenbank-Ports nur an localhost (\`127.0.0.1:5432:5432\`) oder gar nicht und lass Container über ein internes Docker-Netz miteinander sprechen. Mehr dazu in [Docker: Volumes, Netzwerke & Port-Mapping](#/artikel/docker-volumes-netzwerke).

## Versionen und Banner

Viele Dienste verraten beim Verbindungsaufbau ihren Namen und ihre Version, etwa ein SSH-Server mit \`SSH-2.0-OpenSSH_9.6\` oder ein Webserver im \`Server\`-Header. Für Verteidiger heißt das:

- **Aktuell bleiben:** Zu bekannten Lücken gibt es eine [[CVE]]-Kennung. Prüfe für die Versionen deiner Dienste regelmäßig die Sicherheitshinweise der Distribution.
- **Nichts Unnötiges verraten:** \`server_tokens off;\` in Nginx blendet die Versionsnummer aus. Das ersetzt keine Updates, nimmt automatisierten Scannern aber eine einfache Spur.

In CTFs ist es umgekehrt der erste Schritt, herauszufinden, welche Dienste ein **freigegebenes** Ziel anbietet und in welcher Version – um dann nachzulesen, wie diese Dienste funktionieren und welche Fehlkonfigurationen typisch sind. Werkzeuge dafür sind Portscanner wie Nmap. Sie gehören ausschließlich auf eigene Systeme oder auf Ziele, die dir ausdrücklich freigegeben sind (siehe [CTF-Einstieg](#/artikel/ctf-einstieg)).

> [!TIP] Von außen gegenprüfen
> \`ss\` zeigt, was lauscht – aber nicht, was die Firewall tatsächlich durchlässt. Prüfe deinen eigenen Server deshalb zusätzlich von einem zweiten Rechner aus (oder über den Portscan-Bericht deines Hosters), welche Ports von außen antworten.

## SSH absichern

SSH ist fast immer erreichbar und wird entsprechend ständig von automatisierten Anmeldeversuchen getroffen. Die wichtigsten Einstellungen in \`/etc/ssh/sshd_config\`:

\`\`\`text title="sshd_config – sichere Grundeinstellungen"
PasswordAuthentication no      # nur Schlüssel
PermitRootLogin no             # als normaler Benutzer anmelden, dann sudo
PubkeyAuthentication yes
MaxAuthTries 3
AllowUsers anna deploy         # nur diese Konten
\`\`\`

Danach \`sudo systemctl reload ssh\` – und **vorher** in einer zweiten Sitzung testen, dass die Schlüssel-Anmeldung funktioniert. Werkzeuge wie fail2ban sperren Adressen nach vielen Fehlversuchen; mit reiner Schlüssel-Anmeldung sind diese Versuche aber ohnehin chancenlos. Mehr in [Linux-Server, SSH & Nginx](#/artikel/linux-server-nginx).

## Checkliste: Angriffsfläche verkleinern

1. **Bestand aufnehmen:** \`ss -tulpn\`, \`systemctl list-units --type=service --state=running\`.
2. **Abschalten**, was nicht gebraucht wird: \`sudo systemctl disable --now <dienst>\`.
3. **Lokal binden**, was nur lokal gebraucht wird (Datenbanken, Caches, Admin-Oberflächen).
4. **Firewall** mit Standard-Ablehnung; nur nötige Ports öffnen.
5. **Unverschlüsselte Protokolle ersetzen:** FTP → SFTP, Telnet → SSH, HTTP → HTTPS.
6. **Admin-Zugänge** (SSH, RDP, Datenbank-Oberflächen) nur über VPN oder feste Adressen.
7. **Aktualisieren:** automatische Sicherheitsupdates, Versionen der Dienste im Blick behalten.
8. **Logs** der erreichbaren Dienste auswerten (siehe [Logs & Forensik](#/artikel/logs-forensik-einstieg)).

## Typische Fehler

> [!MISTAKE] „Der Port ist ja nicht bekannt“
> Automatisierte Scanner durchsuchen ständig das gesamte IPv4-Internet. Ein ungeschützter Dienst auf einem ungewöhnlichen Port wird nicht übersehen, sondern nur ein paar Minuten später gefunden.

- **Testserver vergessen:** Ein \`npm run dev\` oder eine Admin-Oberfläche auf \`0.0.0.0\` bleibt nach dem Ausprobieren offen.
- **Standardzugangsdaten:** Router, Datenbanken und Admin-Oberflächen mit \`admin/admin\`.
- **Firewall nur auf dem Papier:** Regel angelegt, aber nicht aktiviert – oder durch Docker umgangen.

\`\`\`widget
quiz:CTF-Grundlagen 3
\`\`\`

## Übungsfragen

> 1. \`ss -tulpn\` zeigt \`0.0.0.0:27017\`. Welcher Dienst ist das vermutlich, und was tust du?
> 2. Warum ist ein Dienst auf \`127.0.0.1\` von außen nicht erreichbar, selbst ohne Firewall?
> 3. Ein Kollege verlegt SSH auf Port 2222 „aus Sicherheitsgründen“. Was bringt das, und was wäre wirksamer?

## Wie geht es weiter?

Rechne Netze im [Subnetzrechner](#/labor/netzwerk) nach, lies, wie Webanfragen ablaufen, in [HTTP verstehen](#/artikel/http-grundlagen), und erkenne in [Logs & Forensik](#/artikel/logs-forensik-einstieg), wie Scans und Anmeldeversuche in den Logs aussehen.
`;export{e as default};
