const e=`---
id: netzwerke-tcp-ip-dns
title: Netzwerke: TCP/IP, Ports, DNS & das Client-Server-Modell
area: grundlagen
difficulty: einsteiger
minutes: 17
order: 13
summary: Wie Daten durchs Internet reisen – Schichtenmodell, IP-Adressen, TCP vs. UDP, Ports, DNS-Auflösung und die Werkzeuge, mit denen du Netzwerkprobleme findest.
tags: [Netzwerk, TCP, UDP, IP, DNS, Ports, OSI]
related: [http-grundlagen, docker-volumes-netzwerke, linux-server-nginx]
---

## Das Client-Server-Modell

Fast alles im Internet folgt dem [[Client-Server-Modell]]: Ein **Client** (Browser, App, Skript) stellt eine Anfrage, ein **[[Server]]** wartet auf Anfragen und antwortet. Ein Rechner kann beides gleichzeitig sein – dein Backend ist Server für den Browser und Client für die Datenbank.

## Schichten: jede Ebene hat eine Aufgabe

Netzwerkkommunikation ist in **Schichten** organisiert. Jede Schicht nutzt die darunter und stellt der darüber einen Dienst bereit:

\`\`\`widget
layers:netzwerk-schichten
\`\`\`

Beim Senden „verpackt“ jede Schicht die Daten mit einem eigenen Header (Encapsulation): Deine HTTP-Nachricht steckt in einem TCP-Segment, das in einem IP-Paket, das in einem Ethernet-Frame. Beim Empfänger wird in umgekehrter Reihenfolge ausgepackt.

> [!BEGINNER]
> Wie bei der Post: Dein Brief (HTTP) kommt in einen Umschlag mit Sendungsnummer (TCP), der in einen Postsack mit Zieladresse (IP), der auf einen Lastwagen (Ethernet/WLAN). Jeder Beteiligte schaut nur auf „seine“ Beschriftung.

## IP-Adressen

Jedes Gerät in einem Netzwerk hat eine [[IP-Adresse]]:

- **IPv4:** 32 Bit, geschrieben als vier Zahlen: \`192.168.178.23\`. Nur ~4,3 Milliarden Adressen – deshalb nutzen Heimnetze private Bereiche, die der Router per **NAT** auf eine öffentliche Adresse übersetzt.
- **IPv6:** 128 Bit, hexadezimal: \`2001:db8:85a3::8a2e:370:7334\`. Praktisch unbegrenzt viele Adressen.

| Bereich | Bedeutung |
|---|---|
| \`127.0.0.1\`, \`::1\` | [[localhost]] – der eigene Rechner |
| \`10.0.0.0/8\`, \`172.16.0.0/12\`, \`192.168.0.0/16\` | private Netze |
| \`0.0.0.0\` | als Server-Bindung: „auf allen Interfaces lauschen“ |

Die Notation \`/24\` (CIDR) gibt an, wie viele Bits das Netz bestimmen: \`192.168.1.0/24\` umfasst \`192.168.1.0\` bis \`192.168.1.255\`.

### Subnetze berechnen

Die Zahl hinter dem Schrägstrich (CIDR-Präfix) gibt an, wie viele Bits der Adresse das Netz bestimmen – der Rest adressiert Hosts. Probiere verschiedene Präfixe aus:

\`\`\`widget
subnet
\`\`\`

## Ports

Eine IP-Adresse identifiziert einen Rechner, ein **[[Port]]** (0–65535) einen Dienst auf diesem Rechner. Die Kombination aus IP und Port heißt [[Socket]]-Adresse.

| Port | Dienst |
|---|---|
| 22 | SSH |
| 53 | DNS |
| 80 / 443 | HTTP / HTTPS |
| 5432 | PostgreSQL |
| 3306 | MySQL |
| 6379 | Redis |
| 3000, 5173, 8000, 8080 | übliche Entwicklungsserver |

## TCP vs. UDP

| | [[TCP]] | [[UDP]] |
|---|---|---|
| Verbindung | verbindungsorientiert (Handshake) | verbindungslos |
| Zuverlässigkeit | Bestätigung, Neuübertragung, richtige Reihenfolge | keine Garantien |
| Overhead | höher | gering |
| Einsatz | HTTP/1.1 und /2, SSH, Datenbanken, E-Mail | DNS, Video/VoIP, Spiele, QUIC (HTTP/3) |

TCP baut Verbindungen per **Three-Way-Handshake** auf: Client \`SYN\` → Server \`SYN-ACK\` → Client \`ACK\`. Erst danach fließen Daten. Jeder Handshake kostet eine Roundtrip-Zeit ([[Latenz]]) – deshalb sind wiederverwendete Verbindungen (Keep-Alive, Connection Pools) so wichtig.

## DNS: Namen in Adressen übersetzen

Menschen merken sich \`shop.example.de\`, Rechner brauchen IP-Adressen. Das [[DNS]] übersetzt – hierarchisch, verteilt und mit Caching:

\`\`\`widget
flow:dns-aufloesung
\`\`\`

| Record | Bedeutung | Beispiel |
|---|---|---|
| \`A\` / \`AAAA\` | IPv4 / IPv6-Adresse | \`shop A 203.0.113.10\` |
| \`CNAME\` | Alias auf anderen Namen | \`www CNAME shop.example.de.\` |
| \`MX\` | Mailserver | \`MX 10 mail.example.de.\` |
| \`TXT\` | beliebiger Text (SPF, Domain-Verifikation) | \`TXT "v=spf1 …"\` |
| \`NS\` | zuständige Nameserver | \`NS ns1.provider.net.\` |

> [!TIP] Die TTL
> Jeder Eintrag hat eine **TTL** (Time to Live) in Sekunden. So lange dürfen Resolver die Antwort cachen. Vor einem Serverumzug die TTL vorübergehend senken, damit die neue Adresse schnell überall ankommt.

## Werkzeuge zur Fehlersuche

\`\`\`bash
ping -c 4 example.com            # Erreichbarkeit und Latenz (ICMP; manchmal blockiert)
dig example.com A +short         # DNS-Auflösung (Windows: nslookup example.com)
dig @1.1.1.1 example.com         # bestimmten Resolver fragen
traceroute example.com           # Weg der Pakete (Windows: tracert)
curl -v https://example.com      # Verbindung, TLS und HTTP im Detail
ss -tlpn                         # welche Ports lauschen lokal? (Windows: netstat -ano)
nc -vz db.intern 5432            # ist ein Port erreichbar?
\`\`\`

**Systematisch vorgehen:** Löst der Name auf (DNS)? → Ist der Rechner erreichbar (Routing, Firewall)? → Lauscht der Dienst auf dem Port? → Funktioniert TLS? → Was antwortet die Anwendung (HTTP-Status, Logs)?

## Wie geht es weiter?

Die Anwendungsschicht des Webs erklärt [HTTP verstehen](#/artikel/http-grundlagen); die Verschlüsselung darunter der [TLS-Handshake](#/how-it-works/tls-handshake). Wie Netzwerke zwischen Containern funktionieren, steht in [Docker Volumes & Netzwerke](#/artikel/docker-volumes-netzwerke).
`;export{e as default};
