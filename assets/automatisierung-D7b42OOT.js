const e=`---
id: automatisierung
title: Automatisierung mit Python, Node.js & Workflows
area: ki
difficulty: einsteiger
minutes: 15
order: 14
summary: Wiederkehrende Aufgaben mit Skripten, Zeitplänen, Webhooks und Workflow-Werkzeugen automatisieren – robust, nachvollziehbar und sicher, mit und ohne KI.
tags: [Automatisierung, Python, Node.js, Cron, Webhooks, Workflows]
related: [tool-calling-agents-mcp, caching-queues, ci-cd, llm-grundlagen]
---

## Warum automatisieren?

Alles, was regelmäßig, regelbasiert und fehleranfällig von Hand passiert, ist ein Kandidat: Berichte erstellen, Dateien umbenennen und sortieren, Daten zwischen Systemen abgleichen, Backups, Benachrichtigungen, Rechnungen verarbeiten. Automatisierung spart Zeit – vor allem aber verhindert sie Flüchtigkeitsfehler und macht Abläufe nachvollziehbar.

> [!TIP] Wann lohnt es sich?
> Faustregel: Wenn eine Aufgabe häufig vorkommt, klar definiert ist und Fehler teuer sind. Für einmalige Aufgaben ist ein sorgfältiger manueller Durchlauf oft schneller als ein Skript.

## Bausteine jeder Automatisierung

| Baustein | Beispiele |
|---|---|
| **Auslöser** | Zeitplan ([[Cron Job]]), [[Webhook]], neue Datei, neue E-Mail, Git-Push |
| **Aktionen** | Daten lesen, transformieren, schreiben; APIs aufrufen; Nachrichten senden |
| **Fehlerbehandlung** | Wiederholungen, Benachrichtigung bei Fehlschlag |
| **Protokollierung** | Was ist wann mit welchem Ergebnis passiert? |
| **Zustand** | Was wurde schon verarbeitet? (für [[Idempotenz]]) |

## Python: der Klassiker

\`\`\`python title="Rechnungs-PDFs sortieren und protokollieren"
import logging
import re
import shutil
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
EINGANG = Path.home() / "Downloads"
ARCHIV = Path.home() / "Dokumente" / "Rechnungen"

MUSTER = re.compile(r"rechnung[_-](?P<jahr>\\d{4})-(?P<monat>\\d{2})", re.IGNORECASE)

def sortiere(trockenlauf: bool = True) -> None:
    for datei in EINGANG.glob("*.pdf"):
        treffer = MUSTER.search(datei.name)
        if not treffer:
            continue
        ziel = ARCHIV / treffer["jahr"] / treffer["monat"] / datei.name
        if ziel.exists():
            logging.warning("Übersprungen, existiert bereits: %s", ziel)
            continue
        logging.info("%s → %s", datei.name, ziel)
        if not trockenlauf:
            ziel.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(datei, ziel)

if __name__ == "__main__":
    sortiere(trockenlauf=True)    # erst prüfen, dann mit False wirklich verschieben
\`\`\`

Bewährte Muster darin: ein **Trockenlauf-Modus**, **Logging** statt \`print\`, keine Überschreibungen, \`pathlib\` für plattformunabhängige Pfade.

### Daten aus einer API holen und als Bericht speichern

\`\`\`python
import csv
from datetime import date
import requests

res = requests.get("https://api.example.com/bestellungen", params={"seit": date.today().isoformat()}, timeout=15)
res.raise_for_status()
with open(f"bericht-{date.today()}.csv", "w", newline="", encoding="utf-8") as f:
    schreiber = csv.DictWriter(f, fieldnames=["id", "kunde", "summe"])
    schreiber.writeheader()
    for b in res.json():
        schreiber.writerow({k: b[k] for k in ("id", "kunde", "summe")})
\`\`\`

## Node.js: ideal für Web und JSON

\`\`\`javascript title="Fehlgeschlagene Healthchecks an einen Chat-Webhook melden"
const DIENSTE = ['https://shop.example/health', 'https://api.example/health'];
const WEBHOOK = process.env.CHAT_WEBHOOK_URL;          // Secret aus der Umgebung

async function pruefe(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    return { url, ok: res.ok, status: res.status };
  } catch (err) {
    return { url, ok: false, status: err.name };
  }
}

const ergebnisse = await Promise.all(DIENSTE.map(pruefe));
const fehler = ergebnisse.filter((e) => !e.ok);
if (fehler.length > 0) {
  await fetch(WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: \`⚠️ \${fehler.map((f) => \`\${f.url} (\${f.status})\`).join(', ')}\` }),
  });
}
console.log(ergebnisse);
\`\`\`

## Zeitgesteuert ausführen

\`\`\`bash title="crontab -e (Linux/macOS)"
# Minute Stunde Tag Monat Wochentag  Befehl
0 7 * * 1-5   /usr/bin/python3 /opt/skripte/bericht.py >> /var/log/bericht.log 2>&1
*/5 * * * *   /usr/bin/node /opt/skripte/healthcheck.mjs
\`\`\`

Alternativen: **systemd-Timer** (Linux, mit besserem Logging), die **Aufgabenplanung** unter Windows (\`Register-ScheduledTask\` in [PowerShell](#/sprachen/powershell)), **GitHub Actions** mit \`schedule\` (ohne eigenen Server) oder Kubernetes-CronJobs.

Cron-Ausdrücke sind kompakt, aber leicht falsch zu lesen. Prüfe hier, was ein Ausdruck bedeutet und wann er das nächste Mal ausgelöst wird:

\`\`\`widget
cron
\`\`\`

## Workflow-Werkzeuge

Für Abläufe über viele Dienste hinweg gibt es [[Workflow-Automatisierung|Workflow-Plattformen]] mit visuellen Editoren und Hunderten fertiger Integrationen: **n8n** und **Node-RED** (selbst hostbar), **Zapier** und **Make** (Cloud). Sie eignen sich gut für Integrationen ohne viel eigene Logik; komplexe Geschäftslogik, Tests und Versionierung sind in Code meist besser aufgehoben.

## Automatisierung mit KI

Sprachmodelle erweitern Automatisierung um Aufgaben mit unstrukturierten Daten: E-Mails klassifizieren, Informationen aus Rechnungen extrahieren, Tickets zusammenfassen, Antworten entwerfen.

\`\`\`python title="Muster: Extraktion mit festem Schema und Prüfung"
from pydantic import BaseModel, ValidationError

class Rechnung(BaseModel):
    rechnungsnummer: str
    datum: str
    betrag_eur: float

def verarbeite(text: str) -> Rechnung | None:
    roh = ki_extraktion(text, schema=Rechnung.model_json_schema())   # z. B. per Structured Outputs
    try:
        rechnung = Rechnung.model_validate_json(roh)                   # nie ungeprüft übernehmen
    except ValidationError:
        return None                                                     # → manuelle Prüfung
    if rechnung.betrag_eur > 10_000:
        markiere_fuer_freigabe(rechnung)                                # Mensch entscheidet bei hohen Beträgen
    return rechnung
\`\`\`

Regeln für KI in Automatisierungen: **Ausgaben validieren** (Schema), **Unsicheres an Menschen übergeben**, **keine folgenreichen Aktionen ohne Freigabe**, Kosten und Fehlerraten überwachen ([[Evals]]), Datenschutz beachten. Wie Modelle selbst Werkzeuge nutzen, zeigt [Tool Calling & Agents](#/artikel/tool-calling-agents-mcp).

## Robuste Automatisierung

- **Idempotent:** Ein zweiter Lauf darf nichts doppelt tun – merke dir, was verarbeitet wurde.
- **Fehler sichtbar machen:** Bei Fehlschlag benachrichtigen, nicht still scheitern ([[Exit Code]] ≠ 0).
- **Secrets** aus der Umgebung oder einem Secret-Store, nie im Skript.
- **Trockenlauf** und **Logging** für Nachvollziehbarkeit.
- **Zeitzonen** beachten (UTC in Logs und Zeitplänen).
- **Versionieren** – auch Skripte gehören in [Git](#/artikel/git-grundlagen).

## Wie geht es weiter?

Für komplexere Abläufe mit Warteschlangen siehe [Caching, Rate Limiting & Queues](#/artikel/caching-queues); für Automatisierung rund um Code [CI/CD](#/artikel/ci-cd).
`;export{e as default};
