const e=`---
id: injection
title: Injection verstehen und verhindern: SQL, Command & Co.
area: security
difficulty: fortgeschritten
minutes: 15
order: 11
summary: Warum Injection entsteht, wenn Daten und Code vermischt werden, wie SQL-, Command- und Path-Traversal-Angriffe funktionieren und welche Gegenmaßnahmen in jeder Sprache wirken.
tags: [Injection, SQL Injection, Command Injection, Path Traversal, Secure Coding]
related: [owasp-top-10, xss-csrf-cors, sql-grundlagen]
---

## Das Grundproblem

Alle Injection-Angriffe haben dieselbe Ursache: **Daten werden mit Code vermischt.** Wenn eine Anwendung Nutzereingaben per String-Verkettung in eine Abfrage, einen Shell-Befehl oder einen Dateipfad einbaut, kann eine geschickt formulierte Eingabe die Bedeutung des Befehls ändern.

> [!BEGINNER]
> Stell dir ein Formular vor: „Bitte überweise ___ Euro an Max.“ Schreibt jemand in die Lücke „100 Euro an Max. Und überweise 10.000 Euro an Eve“, und der Bankangestellte liest den Zettel als Ganzes vor, hat Eve gewonnen. Die Lösung: Die Lücke darf nur eine Zahl enthalten – und wird nie als Anweisung gelesen.

## SQL Injection

\`\`\`python title="❌ Unsicher: String-Verkettung"
def login(email: str, passwort: str):
    sql = f"SELECT * FROM nutzer WHERE email = '{email}' AND passwort_hash = '{hash(passwort)}'"
    return db.execute(sql).fetchone()
\`\`\`

Gibt ein Angreifer als E-Mail \`' OR '1'='1' -- \` ein, wird daraus:

\`\`\`sql
SELECT * FROM nutzer WHERE email = '' OR '1'='1' -- ' AND passwort_hash = '…'
\`\`\`

Die Bedingung ist immer wahr, der Rest ist ein Kommentar – der Angreifer ist als erster Nutzer der Tabelle angemeldet. Mit \`UNION SELECT\` lassen sich andere Tabellen auslesen, in manchen Konfigurationen sogar Dateien schreiben oder Befehle ausführen.

### Die Lösung: Prepared Statements

Bei [[Prepared Statement|parametrisierten Abfragen]] schickt die Anwendung SQL-Text und Werte **getrennt** an die Datenbank. Die Werte werden nie als SQL interpretiert – egal, was darin steht.

\`\`\`python title="✅ Python (sqlite3 / psycopg)"
cur.execute("SELECT id, passwort_hash FROM nutzer WHERE email = ?", (email,))     # sqlite3
cur.execute("SELECT id, passwort_hash FROM nutzer WHERE email = %s", (email,))    # psycopg
\`\`\`

\`\`\`javascript title="✅ Node.js (pg)"
await pool.query('SELECT id FROM nutzer WHERE email = $1', [email]);
\`\`\`

\`\`\`java title="✅ Java (JDBC)"
var stmt = conn.prepareStatement("SELECT id FROM nutzer WHERE email = ?");
stmt.setString(1, email);
\`\`\`

Wie das in weiteren Sprachen aussieht, zeigt die [Syntax-Bibliothek: Datenbankabfragen](#/syntax/datenbank).

> [!WARNING] Was Parameter nicht können
> Platzhalter funktionieren nur für **Werte** – nicht für Tabellen- oder Spaltennamen oder \`ORDER BY\`-Richtungen. Solche Teile nimmst du ausschließlich aus einer festen **Allowlist**:

\`\`\`python
SORTIERBAR = {"name": "name", "preis": "preis", "datum": "erstellt_am"}
spalte = SORTIERBAR.get(anfrage_sortierung, "name")          # nie direkt aus der Eingabe
richtung = "DESC" if absteigend else "ASC"
cur.execute(f"SELECT * FROM produkte ORDER BY {spalte} {richtung} LIMIT %s", (limit,))
\`\`\`

### ORMs

ORMs binden Parameter automatisch – solange du sie nicht umgehst. \`User.objects.raw(f"… {eingabe}")\` oder \`sequelize.query(\\\`… \${eingabe}\\\`)\` sind genauso anfällig wie handgeschriebenes SQL.

### Zusätzliche Schutzschichten

- Datenbanknutzer der Anwendung mit **minimalen Rechten** ([[Least Privilege]]): kein \`DROP\`, kein Zugriff auf fremde Schemas.
- Keine Datenbank-Fehlermeldungen an den Client.
- Web Application Firewall als *zusätzliche* Schicht – nie als Ersatz.

## Command Injection

\`\`\`python title="❌ Unsicher: Shell mit Nutzereingabe"
import os
def ping(host: str) -> int:
    return os.system(f"ping -c 1 {host}")      # host = "8.8.8.8; rm -rf ~"
\`\`\`

\`\`\`python title="✅ Sicher: kein Shell-Interpreter, Argumente als Liste"
import ipaddress, subprocess

def ping(host: str) -> bool:
    ipaddress.ip_address(host)                 # Allowlist-Validierung: nur gültige IP-Adressen
    ergebnis = subprocess.run(["ping", "-c", "1", host], capture_output=True, timeout=5)
    return ergebnis.returncode == 0
\`\`\`

\`\`\`javascript title="Node.js"
import { execFile } from 'node:child_process';
// ❌ exec(\`convert \${datei} out.png\`)   – startet eine Shell
// ✅ Argumente getrennt, keine Shell:
execFile('convert', [datei, 'out.png'], (err) => { /* … */ });
\`\`\`

**Regel:** Wenn es eine Bibliotheksfunktion gibt, nutze sie statt eines Shell-Befehls. Wenn ein externes Programm nötig ist, übergib Argumente als Liste ohne Shell und validiere Eingaben gegen eine Allowlist. Siehe [[Command Injection]].

## Path Traversal

\`\`\`python title="❌ Unsicher"
@app.get("/download")
def download(datei: str):
    return FileResponse(f"/srv/uploads/{datei}")   # datei = "../../etc/passwd"
\`\`\`

\`\`\`python title="✅ Sicher: Pfad auflösen und Basisverzeichnis prüfen"
from pathlib import Path
BASIS = Path("/srv/uploads").resolve()

@app.get("/download")
def download(datei: str):
    ziel = (BASIS / datei).resolve()
    if not ziel.is_relative_to(BASIS) or not ziel.is_file():
        raise HTTPException(404)
    return FileResponse(ziel)
\`\`\`

Noch besser: Dateien intern unter zufälligen IDs speichern und den Originalnamen nur in der Datenbank halten. Siehe [[Path Traversal]].

## Weitere Injection-Arten

| Art | Kontext | Schutz |
|---|---|---|
| NoSQL Injection | \`{"$gt": ""}\` statt String in MongoDB-Filtern | Typen validieren (Schema), Operatoren nicht aus Eingaben übernehmen |
| LDAP / XPath Injection | Verzeichnis-/XML-Abfragen | Escaping-Funktionen der Bibliothek |
| Template Injection (SSTI) | Nutzereingabe als Template statt als Variable | Eingaben nur als Daten an Templates übergeben |
| Header Injection | Zeilenumbrüche in HTTP-Headern | Framework-APIs, CR/LF verbieten |
| [[Prompt Injection]] | Eingaben an Sprachmodelle | Daten und Anweisungen trennen, Rechte begrenzen (siehe [Agents & MCP](#/artikel/tool-calling-agents-mcp)) |

## Wie geht es weiter?

Die Browser-Variante von Injection – XSS – erklärt [XSS, CSRF, CORS & CSP](#/artikel/xss-csrf-cors).
`;export{e as default};
