const e=`---
id: linux-server-nginx
title: Linux-Server, SSH & Nginx als Reverse Proxy
area: devops
difficulty: fortgeschritten
minutes: 18
order: 22
summary: Einen Linux-Server sicher per SSH verwalten, Dienste mit systemd betreiben und Nginx als Reverse Proxy mit HTTPS vor eine Anwendung setzen.
tags: [Linux, SSH, Nginx, TLS, systemd, Server]
related: [docker-sicherheit, ci-cd, netzwerke-tcp-ip-dns, passwoerter-kryptografie, bash-scripting, https-security-header]
---

## Warum Linux?

Die überwiegende Mehrheit aller Server, Container und Cloud-Instanzen läuft unter Linux. Wer Software betreibt, kommt an Terminal, Dateirechten, Prozessen und Diensten nicht vorbei. Die wichtigsten Befehle findest du im [Linux-Cheatsheet](#/cheatsheets/linux).

## SSH: sicherer Fernzugang

[[SSH]] verbindet dich verschlüsselt mit einem entfernten Rechner. Statt Passwörtern verwendet man **Schlüsselpaare** ([[Asymmetrische Verschlüsselung]]): Der private Schlüssel bleibt auf deinem Rechner, der öffentliche liegt auf dem Server.

\`\`\`bash title="Schlüssel erzeugen und hinterlegen"
ssh-keygen -t ed25519 -C "ana@laptop"      # erzeugt ~/.ssh/id_ed25519 (+ .pub)
ssh-copy-id ana@203.0.113.10               # öffentlichen Schlüssel auf den Server
ssh ana@203.0.113.10
\`\`\`

\`\`\`ini title="~/.ssh/config – Kurzname für den Server"
Host shop
    HostName 203.0.113.10
    User ana
    IdentityFile ~/.ssh/id_ed25519
\`\`\`

Danach genügt \`ssh shop\`. Auf dem Server solltest du den SSH-Daemon härten:

\`\`\`ini title="/etc/ssh/sshd_config (Ausschnitt)"
PasswordAuthentication no
PermitRootLogin no
KbdInteractiveAuthentication no
\`\`\`

\`\`\`bash
sudo sshd -t && sudo systemctl reload ssh   # Konfiguration prüfen, dann neu laden
\`\`\`

> [!WARNING] Nicht aussperren
> Teste den Schlüssel-Login in einer **zweiten** Sitzung, bevor du die alte schließt. Ein Tippfehler in der Konfiguration kann dich sonst vom Server aussperren.

## Grundhärtung eines Servers

\`\`\`bash
sudo apt update && sudo apt upgrade -y                 # Updates
sudo apt install -y unattended-upgrades                # automatische Sicherheitsupdates
sudo ufw allow OpenSSH && sudo ufw allow 80,443/tcp    # Firewall: nur SSH, HTTP, HTTPS
sudo ufw enable
\`\`\`

Arbeite mit einem normalen Nutzer und \`sudo\`, nicht als root. Siehe auch [[Least Privilege]] und [[Firewall]].

### Dateirechte verstehen

Jede Datei hat Rechte für Besitzer, Gruppe und alle anderen. Konfigurationsdateien mit Passwörtern sollten nur für den Dienstbenutzer lesbar sein (\`600\`), private SSH-Schlüssel ebenso. Rechne Rechte zwischen Häkchen, Oktalzahl und \`rwx\`-Darstellung um:

\`\`\`widget
chmod
\`\`\`

## Dienste mit systemd

Langlebige Anwendungen laufen als **systemd-Service** – mit automatischem Start beim Booten und Neustart bei Abstürzen.

\`\`\`ini title="/etc/systemd/system/shop.service"
[Unit]
Description=Shop-API
After=network.target

[Service]
User=shop
WorkingDirectory=/opt/shop
EnvironmentFile=/etc/shop/env
ExecStart=/usr/bin/node /opt/shop/dist/server.js
Restart=on-failure
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
\`\`\`

\`\`\`bash
sudo systemctl daemon-reload
sudo systemctl enable --now shop     # aktivieren und starten
systemctl status shop
journalctl -u shop -f                # Logs live
\`\`\`

## Reverse Proxy mit Nginx

Die Anwendung lauscht nur lokal (z. B. auf Port 3000). Davor steht ein [[Reverse Proxy]] wie [[Nginx]], der:

- HTTPS terminiert (Zertifikate verwaltet),
- statische Dateien effizient ausliefert,
- Anfragen an eine oder mehrere Instanzen weiterleitet ([[Load Balancer|Load Balancing]]),
- Header setzt, komprimiert und Limits durchsetzt.

\`\`\`widget
annotated:nginx-proxy
\`\`\`

\`\`\`bash
sudo nginx -t                    # Syntax prüfen – immer vor dem Neuladen!
sudo systemctl reload nginx      # ohne Verbindungsabbruch neu laden
\`\`\`

### HTTPS mit Let’s Encrypt

Kostenlose, automatisch erneuerte [[Zertifikat|Zertifikate]] erhältst du per ACME-Protokoll, z. B. mit Certbot:

\`\`\`bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d app.example.de       # holt Zertifikat und passt Nginx an
sudo certbot renew --dry-run                 # Erneuerung testen (läuft automatisch per Timer)
\`\`\`

Voraussetzung: Der [[DNS]]-Eintrag der Domain zeigt auf den Server und Port 80 ist erreichbar. Alternativ erledigt der Webserver **Caddy** HTTPS vollautomatisch.

### Load Balancing über mehrere Instanzen

\`\`\`nginx
upstream shop_backend {
    least_conn;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    # … listen/ssl wie oben …
    location / {
        proxy_pass http://shop_backend;
    }
}
\`\`\`

## Typische Fehler

> [!MISTAKE] 502 Bad Gateway
> Nginx erreicht die Anwendung nicht: Läuft sie (\`systemctl status\`)? Lauscht sie auf dem erwarteten Port (\`ss -tlpn\`)? Stimmt \`proxy_pass\`? Das Nginx-Fehlerlog (\`/var/log/nginx/error.log\`) nennt meist die genaue Ursache.

> [!MISTAKE] Anwendung direkt auf Port 80 als root
> Ports unter 1024 erfordern Root-Rechte. Lass die App unprivilegiert auf einem hohen Port laufen und Nginx davor.

> [!MISTAKE] Falsche Client-IP in der App
> Ohne \`X-Forwarded-For\` sieht die App nur \`127.0.0.1\`. Vertraue dem Header aber nur, wenn die Anfrage tatsächlich von deinem Proxy kommt – sonst kann ihn jeder fälschen.

## Wie geht es weiter?

Automatisiere die Einrichtung vieler Server mit [Infrastructure as Code](#/artikel/infrastructure-as-code) und rolle Änderungen per [CI/CD](#/artikel/ci-cd) aus. Wie der TLS-Handshake funktioniert, zeigt [dieser Ablauf](#/how-it-works/tls-handshake).
`;export{e as default};
