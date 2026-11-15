const e=`---
id: bash-scripting
title: Bash-Scripting: Robuste Shell-Skripte schreiben
area: devops
difficulty: fortgeschritten
minutes: 22
order: 20
summary: Shell-Skripte, die nicht beim ersten Leerzeichen im Dateinamen zerbrechen – strikter Modus, Quoting, Parameter, Bedingungen und Schleifen, Funktionen, Exit-Codes, trap zum Aufräumen, getopts, ein vollständiges Backup-Skript mit Cron-Zeitplan und ShellCheck.
tags: [Bash, Shell, Scripting, Linux, Automatisierung, Cron, ShellCheck]
related: [linux-server-nginx, automatisierung, ci-cd, betriebssysteme-prozesse]
---

## Wann Bash – und wann nicht?

[Bash](#/sprachen/bash) ist ideal, um **Programme zu verbinden**: Befehle aufrufen, Dateien verschieben, Ausgaben weiterleiten, Server einrichten, CI-Schritte ausführen. Für komplexe Logik, Datenstrukturen, Fehlerbehandlung und Berechnungen ist eine Programmiersprache wie Python besser geeignet.

> [!TIP] Faustregel
> Ab etwa 100 Zeilen, bei verschachtelten Datenstrukturen oder wenn du Arrays von Arrays brauchst: zu Python wechseln.

## Das Grundgerüst

\`\`\`bash title="vorlage.sh"
#!/usr/bin/env bash
set -euo pipefail          # strikter Modus (siehe unten)
IFS=$'\\n\\t'                # Wörter nur an Zeilenumbrüchen und Tabs trennen

readonly SKRIPT_NAME="$(basename "$0")"

log()    { printf '[%s] %s\\n' "$(date +%H:%M:%S)" "$*" >&2; }   # Logs nach stderr
abbruch() { log "FEHLER: $*"; exit 1; }

main() {
  log "Start von $SKRIPT_NAME"
  # … eigentliche Arbeit …
}

main "$@"
\`\`\`

Ausführbar machen und starten:

\`\`\`bash
chmod +x vorlage.sh
./vorlage.sh
\`\`\`

### Der strikte Modus

| Option | Wirkung | Ohne sie … |
|---|---|---|
| \`set -e\` | Skript bricht ab, wenn ein Befehl fehlschlägt | läuft nach einem Fehler einfach weiter – evtl. mit fatalen Folgen |
| \`set -u\` | Zugriff auf ungesetzte Variablen ist ein Fehler | \`rm -rf "$VERZEICHNIS/"*\` wird bei Tippfehler im Namen zu \`rm -rf /*\` |
| \`set -o pipefail\` | eine Pipeline schlägt fehl, wenn **irgendein** Teil fehlschlägt | \`fehlerhaft \\| sort\` gilt als Erfolg, weil \`sort\` erfolgreich war |

> [!WARNING] set -e hat Ausnahmen
> In Bedingungen (\`if befehl\`), bei \`befehl || true\` und in einigen anderen Konstellationen greift \`set -e\` bewusst nicht. Es ist ein Sicherheitsnetz, kein Ersatz dafür, kritische Schritte explizit zu prüfen.

## Variablen und Quoting

\`\`\`bash
name="Ada Lovelace"            # keine Leerzeichen um das =
echo "Hallo, $name"             # doppelte Anführungszeichen: Variablen werden ersetzt
echo 'Hallo, $name'             # einfache: alles wörtlich
echo "Heute: $(date +%F)"       # Befehlsersetzung
echo "\${name}s Notizbuch"       # geschweifte Klammern grenzen den Namen ab
\`\`\`

> [!DANGER] Variablen immer quoten
> Ohne Anführungszeichen wird der Inhalt an Leerzeichen getrennt und Platzhalter wie \`*\` werden expandiert. \`rm $datei\` mit \`datei="Mein Bericht.pdf"\` versucht, die Dateien \`Mein\` und \`Bericht.pdf\` zu löschen. Richtig: \`rm -- "$datei"\` (\`--\` beendet die Optionsliste, falls der Name mit \`-\` beginnt).

### Nützliche Parameter-Erweiterungen

\`\`\`bash
echo "\${PORT:-8080}"            # Standardwert, falls leer oder ungesetzt
: "\${API_URL:?API_URL muss gesetzt sein}"   # Abbruch mit Meldung, falls fehlt

datei="bericht.final.pdf"
echo "\${datei%.pdf}"            # bericht.final        (kürzestes Suffix entfernen)
echo "\${datei%%.*}"             # bericht              (längstes Suffix entfernen)
echo "\${datei##*.}"             # pdf                  (Dateiendung)
echo "\${datei/final/v2}"        # bericht.v2.pdf       (ersetzen)
echo "\${#datei}"                # 17                   (Länge)
\`\`\`

## Argumente

| Variable | Bedeutung |
|---|---|
| \`$0\` | Name des Skripts |
| \`$1\`, \`$2\`, … | Positionsparameter |
| \`$#\` | Anzahl der Argumente |
| \`"$@"\` | alle Argumente, **jedes einzeln gequotet** – fast immer das Richtige |
| \`$?\` | Exit Code des letzten Befehls |
| \`$$\` | PID des Skripts |

\`\`\`bash title="Optionen mit getopts"
usage() { echo "Verwendung: $0 [-n] [-t ziel] quelle…" >&2; exit 2; }

trockenlauf=false
ziel="/backup"
while getopts ":nt:h" opt; do
  case "$opt" in
    n) trockenlauf=true ;;
    t) ziel="$OPTARG" ;;
    h) usage ;;
    :) abbruch "Option -$OPTARG braucht einen Wert" ;;
    \\?) abbruch "Unbekannte Option: -$OPTARG" ;;
  esac
done
shift $((OPTIND - 1))            # verarbeitete Optionen entfernen
[[ $# -ge 1 ]] || usage          # mindestens eine Quelle nötig
\`\`\`

## Bedingungen

\`\`\`bash
if [[ -f "$datei" ]]; then echo "Datei existiert"; fi
if [[ -d "$verzeichnis" && -w "$verzeichnis" ]]; then echo "Verzeichnis beschreibbar"; fi
if [[ "$umgebung" == "prod" ]]; then echo "Vorsicht!"; fi
if [[ "$version" =~ ^v[0-9]+\\.[0-9]+$ ]]; then echo "gültige Version"; fi
if (( anzahl > 10 )); then echo "mehr als zehn"; fi

# Befehl als Bedingung: if prüft den Exit Code
if grep -q "ERROR" app.log; then echo "Fehler im Log gefunden"; fi
if ! command -v docker >/dev/null; then abbruch "docker ist nicht installiert"; fi
\`\`\`

| Test | wahr, wenn … |
|---|---|
| \`-f pfad\` / \`-d pfad\` / \`-e pfad\` | reguläre Datei / Verzeichnis / existiert |
| \`-r\` / \`-w\` / \`-x\` | lesbar / schreibbar / ausführbar |
| \`-s pfad\` | Datei existiert und ist nicht leer |
| \`-z "$s"\` / \`-n "$s"\` | String leer / nicht leer |
| \`a -nt b\` | a ist neuer als b |

Verwende in Bash \`[[ … ]]\` statt \`[ … ]\`: Es ist robuster beim Quoting und kann \`&&\`, \`||\` und reguläre Ausdrücke.

## Schleifen

\`\`\`bash
for datei in *.log; do                 # Glob – sicher auch bei Leerzeichen im Namen
  [[ -e "$datei" ]] || continue        # falls kein Treffer: Muster bleibt sonst wörtlich stehen
  gzip -- "$datei"
done

for i in {1..5}; do echo "Versuch $i"; done
for ((i = 0; i < 3; i++)); do echo "$i"; done

while IFS= read -r zeile; do           # Datei zeilenweise lesen
  echo "→ $zeile"
done < hosts.txt

# Ausgabe eines Befehls sicher verarbeiten (auch mit Leerzeichen und Zeilenumbrüchen)
find . -name '*.tmp' -print0 | while IFS= read -r -d '' f; do rm -- "$f"; done
\`\`\`

> [!MISTAKE] for über ls-Ausgabe
> \`for f in $(ls)\` zerbricht an Leerzeichen in Dateinamen. Verwende Globs (\`for f in *\`) oder \`find … -print0\` mit \`read -d ''\`.

## Funktionen und Exit Codes

\`\`\`bash
pruefe_url() {
  local url="$1"                       # local: Variable nur in der Funktion
  local status
  status=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$url") || return 2
  [[ "$status" == "200" ]]             # Rückgabewert = Exit Code des letzten Befehls
}

if pruefe_url "https://example.com"; then
  log "erreichbar"
else
  log "nicht erreichbar (Code $?)"
fi
\`\`\`

Funktionen geben **Exit Codes** zurück (0 = Erfolg, 1–255 = Fehler), keine Werte. Ergebnisse gibt man per \`echo\` aus und fängt sie mit \`$(…)\` auf.

## Aufräumen mit trap

\`trap\` führt Code aus, wenn das Skript endet – egal ob erfolgreich, mit Fehler oder durch Strg+C:

\`\`\`bash
tmpdir="$(mktemp -d)"                  # sicheres, eindeutiges temporäres Verzeichnis
trap 'rm -rf -- "$tmpdir"' EXIT        # wird IMMER beim Beenden ausgeführt

curl -fsSL "https://example.com/daten.tar.gz" -o "$tmpdir/daten.tar.gz"
tar -xzf "$tmpdir/daten.tar.gz" -C "$tmpdir"
\`\`\`

## Praxisbeispiel: Backup mit Aufbewahrung

\`\`\`bash title="backup.sh – Verzeichnis sichern, alte Sicherungen löschen"
#!/usr/bin/env bash
set -euo pipefail

usage() { echo "Verwendung: $0 [-n] [-k tage] quelle ziel" >&2; exit 2; }
log() { printf '[%s] %s\\n' "$(date '+%F %T')" "$*" >&2; }

trockenlauf=false
behalten=7
while getopts ":nk:" opt; do
  case "$opt" in
    n) trockenlauf=true ;;
    k) behalten="$OPTARG" ;;
    *) usage ;;
  esac
done
shift $((OPTIND - 1))
[[ $# -eq 2 ]] || usage

quelle="$1"
ziel="$2"
[[ -d "$quelle" ]] || { log "Quelle '$quelle' existiert nicht"; exit 1; }
[[ "$behalten" =~ ^[0-9]+$ ]] || { log "-k erwartet eine Zahl"; exit 1; }
mkdir -p -- "$ziel"

archiv="$ziel/backup-$(basename "$quelle")-$(date +%Y%m%d-%H%M%S).tar.gz"
tmp="$(mktemp "$ziel/.backup.XXXXXX")"
trap 'rm -f -- "$tmp"' EXIT

if $trockenlauf; then
  log "[Trockenlauf] würde $quelle nach $archiv sichern"
else
  tar -czf "$tmp" -C "$(dirname "$quelle")" "$(basename "$quelle")"
  mv -- "$tmp" "$archiv"              # erst nach Erfolg umbenennen: kein halbes Backup
  log "Gesichert: $archiv ($(du -h "$archiv" | cut -f1))"
fi

# Sicherungen älter als N Tage entfernen
find "$ziel" -maxdepth 1 -name 'backup-*.tar.gz' -mtime +"$behalten" -print | while IFS= read -r alt; do
  if $trockenlauf; then log "[Trockenlauf] würde löschen: $alt"; else rm -- "$alt"; log "Gelöscht: $alt"; fi
done
\`\`\`

Täglich um 2:30 Uhr ausführen (Eintrag mit \`crontab -e\`):

\`\`\`bash
30 2 * * * /opt/skripte/backup.sh -k 14 /var/www /srv/backups >> /var/log/backup.log 2>&1
\`\`\`

Teste Cron-Ausdrücke und Dateirechte interaktiv:

\`\`\`widget
cron
\`\`\`

\`\`\`widget
chmod
\`\`\`

> [!WARNING] Ein Backup auf derselben Festplatte ist kein Backup
> Das Skript oben ist ein Baustein. Für echte Datensicherheit gehört mindestens eine Kopie auf ein anderes System – siehe die 3-2-1-Regel in [Replikation, Sharding & Backups](#/artikel/replikation-sharding-backups).

## ShellCheck und Portabilität

**ShellCheck** findet typische Fehler (fehlende Anführungszeichen, falsche Tests, nicht portable Syntax) und erklärt sie:

\`\`\`bash
shellcheck backup.sh
# SC2086: Double quote to prevent globbing and word splitting.
\`\`\`

Bash ist nicht überall die Standard-Shell: In Debian/Ubuntu ist \`/bin/sh\` die schlankere \`dash\`, in Alpine-Containern \`ash\` (BusyBox). Skripte mit \`#!/bin/sh\` dürfen keine Bash-Erweiterungen wie \`[[ ]]\`, Arrays oder \`{1..5}\` verwenden. macOS liefert aus Lizenzgründen nur Bash 3.2 mit; die Standard-Shell ist dort \`zsh\`.

## Sicherheit

- **Keine Secrets** im Skript – aus Umgebungsvariablen oder einem Secret-Store lesen, nie per Kommandozeilenargument (in \`ps\` für alle sichtbar).
- **Eingaben nie mit \`eval\` ausführen** und nicht ungeprüft in Befehle einsetzen ([Command Injection](#/artikel/injection)).
- **\`curl … | bash\`** nur bei vertrauenswürdigen Quellen – lieber herunterladen, ansehen, dann ausführen.
- Temporäre Dateien immer mit **\`mktemp\`** anlegen, nie mit festen Namen in \`/tmp\`.

## Wie geht es weiter?

Die wichtigsten Befehle stehen im [Linux-Cheatsheet](#/cheatsheets/linux); wie Skripte in Pipelines laufen, zeigt [CI/CD](#/artikel/ci-cd).

\`\`\`widget
quiz:Linux & Bash 4
\`\`\`
`;export{e as default};
