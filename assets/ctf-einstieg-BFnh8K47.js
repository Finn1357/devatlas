const e=`---
id: ctf-einstieg
title: CTF & Hack The Box: legal üben und richtig anfangen
area: security
difficulty: einsteiger
minutes: 16
order: 17
summary: Was Capture-the-Flag-Rätsel sind, welche Plattformen sich für den Einstieg eignen, wo die rechtliche Grenze verläuft, in welcher Reihenfolge du lernst und wie du dir eine sichere Übungsumgebung einrichtest.
tags: [CTF, Hack The Box, Ethik, Recht, Übungsumgebung, Lernpfad]
related: [security-methodik, linux-security-grundlagen, kodierungen-hashes-erkennen, logs-forensik-einstieg, dienste-ports-angriffsflaeche]
---

## Worum es bei CTFs geht

Ein [[Capture the Flag]] (CTF) ist ein Rätsel aus der IT-Sicherheit. Irgendwo in einer Aufgabe steckt eine „Flagge“ – ein Text wie \`picoCTF{…}\` oder \`HTB{…}\`. Wer sie findet und abgibt, beweist, dass er die Aufgabe gelöst hat. Das Entscheidende: Alles findet in einer **dafür gebauten und freigegebenen Umgebung** statt. Niemand wird geschädigt, und du darfst ausprobieren, was in der echten Welt verboten wäre.

CTFs trainieren genau die Fähigkeiten, die auch Verteidiger brauchen: Systeme verstehen, Fehler erkennen, sauber dokumentieren. Viele Sicherheitsfachleute sind über CTFs in den Beruf gekommen.

| Form | Was du bekommst | Typische Kategorien |
|---|---|---|
| **Jeopardy** | einzelne Aufgaben mit Punkten | Web, Kryptografie, Forensik, Reverse Engineering, „Misc“ |
| **Maschinen / Boxen** | ein ganzes Übungssystem im Netz der Plattform | Dienste verstehen, Fehlkonfigurationen finden, Rechte |
| **Defensive Aufgaben** | Logs, Netzwerkmitschnitte, Speicherabbilder | Vorfälle rekonstruieren, Spuren deuten |
| **Attack-Defense** | eigene Dienste verteidigen, fremde prüfen | Teamwettbewerbe für Fortgeschrittene |

> [!BEGINNER] Du musst kein „Hacker“ sein, um anzufangen
> Die meisten Einstiegsaufgaben verlangen nur Grundlagen: Kommandozeile, ein bisschen Netzwerk, HTTP und die Fähigkeit, Dinge nachzuschlagen. Genau diese Grundlagen findest du in DevAtlas – der Lernpfad [CTF-Einstieg](#/lernpfade/ctf-einstieg) bündelt sie in einer sinnvollen Reihenfolge.

## Die rechtliche Grenze

Das Wichtigste vorweg: **Du testest nur Systeme, die dir gehören oder für die du eine ausdrückliche Erlaubnis hast.** In Deutschland stellen unter anderem § 202a StGB (Ausspähen von Daten), § 202b (Abfangen von Daten), § 202c (Vorbereiten des Ausspähens und Abfangens) sowie § 303a und § 303b StGB (Datenveränderung, Computersabotage) unbefugte Zugriffe unter Strafe. Andere Länder haben vergleichbare Gesetze.

Eine CTF-Plattform gibt dir diese Erlaubnis – aber nur für **ihre** Übungsziele und nur nach **ihren** Regeln. Das bedeutet:

- Ziele sind ausschließlich die Systeme, die die Aufgabe nennt bzw. die im Übungsnetz der Plattform liegen (meist per [[VPN]] erreichbar).
- Die Website der Plattform selbst, andere Teilnehmende und fremde Netze sind tabu.
- Keine Last- oder Überlastungstests, wenn die Regeln sie nicht ausdrücklich erlauben.

> [!DANGER] „Nur mal schauen“ ist nicht erlaubt
> Das Schul-, Uni- oder Firmennetz, der Router der Nachbarn oder eine fremde Website sind keine Übungsziele – auch nicht „nur zum Ausprobieren“ oder um jemandem zu helfen. Wer eine echte Lücke findet, meldet sie vertraulich (siehe [Methodik: Responsible Disclosure](#/artikel/security-methodik)). Dieser Artikel ist keine Rechtsberatung; im Zweifel gilt: nicht ohne schriftliche Erlaubnis.

## Plattformen für den Einstieg

| Plattform | Schwerpunkt | Gut für |
|---|---|---|
| **OverTheWire – Bandit** | Linux-Kommandozeile in aufeinander aufbauenden Stufen, per SSH | den allerersten Einstieg |
| **picoCTF** | Jeopardy-Aufgaben in allen Kategorien, mit Übungsarchiv | Schülerinnen, Schüler und Studierende |
| **TryHackMe** | geführte Lernräume mit Erklärungen und Übungsmaschinen | strukturiertes Lernen mit viel Anleitung |
| **Hack The Box** | Academy (Kurse), „Starting Point“ (geführte Einstiegsmaschinen), Maschinen, Challenges, „Sherlocks“ (defensive Untersuchungen) | den Schritt von geführt zu selbstständig |

Angebote, Preise und kostenlose Bereiche ändern sich – schau auf den Seiten der Anbieter nach dem aktuellen Stand. Für den Anfang reichen die kostenlosen Bereiche völlig.

> [!TIP] Bandit zuerst
> OverTheWire Bandit bringt dir in kleinen Schritten genau die Linux-Befehle bei, die in fast jedem CTF vorkommen: Dateien finden, Inhalte durchsuchen, Kodierungen umwandeln, Rechte verstehen. Parallel dazu hilft [Linux für Security-Einsteiger](#/artikel/linux-security-grundlagen).

## Eine Reihenfolge, die funktioniert

1. **Kommandozeile:** Navigieren, Dateien finden, Text durchsuchen, Pipes. → [Linux für Security-Einsteiger](#/artikel/linux-security-grundlagen), [Bash-Scripting](#/artikel/bash-scripting)
2. **Netzwerke und HTTP:** Was ist ein Port, was passiert bei einer Webanfrage? → [Netzwerke: TCP/IP & DNS](#/artikel/netzwerke-tcp-ip-dns), [HTTP verstehen](#/artikel/http-grundlagen), [Dienste & Angriffsfläche](#/artikel/dienste-ports-angriffsflaeche)
3. **Kodierungen und Kryptografie-Grundlagen:** Base64, Hex, Hashes erkennen. → [Kodierungen, Hashes & Chiffren erkennen](#/artikel/kodierungen-hashes-erkennen)
4. **Web-Sicherheit verstehen:** die typischen Fehlerklassen und ihre Abwehr. → [OWASP Top 10](#/artikel/owasp-top-10), [Injection](#/artikel/injection), [XSS, CSRF & CORS](#/artikel/xss-csrf-cors)
5. **Geführte Maschinen:** mit Anleitung, dann mit Hinweisen, dann allein.
6. **Die defensive Seite:** Logs lesen, Vorfälle rekonstruieren. → [Logs & Forensik](#/artikel/logs-forensik-einstieg)

Zwischendurch kannst du im [Rätsel-Labor](#/labor/raetsel) üben – kleine CTF-Aufgaben, die vollständig in DevAtlas laufen.

## Eine sichere Übungsumgebung

Für Maschinen-Aufgaben arbeitest du in einer eigenen, abgeschotteten Umgebung – nicht auf deinem Alltagssystem.

- **Virtuelle Maschine:** Eine [[Virtuelle Maschine]] (z. B. mit VirtualBox, VMware oder Hyper-V) mit einem Linux. Distributionen wie Kali Linux oder Parrot OS bringen viele Werkzeuge schon mit; ein normales Ubuntu tut es für den Anfang ebenso. Lege vor größeren Änderungen einen **Snapshot** an.
- **Keine privaten Daten** in der Übungs-VM: kein Passwortmanager, keine privaten Konten, keine Firmenzugänge.
- **VPN nur beim Üben:** Die Plattform gibt dir eine VPN-Konfiguration für ihr Übungsnetz. Verbinde dich nur, wenn du übst, und trenne danach.
- **Eigene Passwörter** für jede Plattform; keine Wiederverwendung.
- **Werkzeuge nur aus offiziellen Quellen** – auch Sicherheitswerkzeuge können gefälscht sein.
- **Notizen** in Markdown, Obsidian oder einem ähnlichen Werkzeug – dazu mehr in der [Methodik](#/artikel/security-methodik).

> [!INFO] Warum eine VM?
> Übungsziele sind absichtlich unsicher, und du lädst dort mitunter fremde Dateien herunter. In einer VM bleibt das von deinem eigentlichen System getrennt, und ein Snapshot setzt alles in Sekunden zurück.

## Spielregeln der Community

- **Keine Lösungen zu aktiven Aufgaben veröffentlichen.** Bei Hack The Box etwa sind Writeups erst erlaubt, wenn eine Aufgabe in den Ruhestand („retired“) gegangen ist. Andere Plattformen haben ähnliche Regeln.
- **Flaggen nicht weitergeben.** Sie zu teilen, verdirbt anderen das Rätsel und verstößt gegen die Regeln.
- **Hinweise sind in Ordnung.** Foren und Community-Chats geben gern einen Anstoß („Nudge“) – ohne die Lösung zu verraten. Frag so, dass erkennbar ist, was du schon versucht hast.
- **Fair bleiben:** keine Angriffe auf andere Teilnehmende, keine Störung der Infrastruktur, keine automatisierten Massenanfragen, wo sie nicht erwünscht sind.

## Typische Fehler am Anfang

> [!MISTAKE] Werkzeuge vor Verständnis
> Wer Werkzeuge startet, ohne zu verstehen, was sie tun, findet zwar manchmal eine Flagge – lernt aber wenig und steckt bei der nächsten Aufgabe fest. Frag bei jedem Schritt: Was passiert hier technisch, und warum hat es funktioniert?

- **Zu schwere Aufgaben zu früh:** Einsteigeraufgaben sind kein Umweg, sondern das Fundament.
- **Keine Notizen:** Nach einer Woche weißt du nicht mehr, was du schon probiert hast.
- **Sofort in die Lösung schauen:** Erst eine feste Zeit selbst probieren, dann einen Hinweis holen, erst ganz am Ende eine Lösung lesen – und sie dann nachbauen.
- **Unsauber getrennt:** Übungsumgebung und Alltagssystem vermischt, Passwörter wiederverwendet.

\`\`\`widget
quiz:CTF-Grundlagen 4
\`\`\`

## Übungsfragen

> 1. Du findest beim Surfen auf einer fremden Website einen Hinweis auf eine Lücke. Darfst du sie „nur kurz“ testen? Wie gehst du stattdessen vor?
> 2. Welche Systeme sind bei einer Maschinen-Aufgabe auf einer CTF-Plattform erlaubte Ziele – und welche nicht?
> 3. Warum lohnt es sich, eine Aufgabe nach dem Lösen mit einem veröffentlichten Writeup zu vergleichen?

## Wie geht es weiter?

Lies als Nächstes die [Methodik für Sicherheitsrätsel](#/artikel/security-methodik) und arbeite parallel die Kommandozeilen-Grundlagen in [Linux für Security-Einsteiger](#/artikel/linux-security-grundlagen) durch. Erste kleine Aufgaben findest du im [Rätsel-Labor](#/labor/raetsel).
`;export{e as default};
