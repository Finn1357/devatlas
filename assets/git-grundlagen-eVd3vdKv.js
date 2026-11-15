const e=`---
id: git-grundlagen
title: Git verstehen: Commits, Branches, Merge & Rebase
area: tools
difficulty: einsteiger
minutes: 20
order: 10
summary: Wie Git Änderungen speichert, was Arbeitsverzeichnis, Staging Area und Repository sind, wie Branches, Merges und Rebases funktionieren und wie Teams mit Pull Requests zusammenarbeiten.
tags: [Git, Versionskontrolle, Branch, Merge, Rebase, Pull Request]
related: [ci-cd, paketmanager-buildtools, testing]
---

## Warum Versionskontrolle?

Ohne Versionskontrolle entstehen Ordner wie \`projekt_final_v2_wirklich_final\`. [[Git]] löst das sauber: Jede Änderung wird mit Autor, Zeitpunkt und Beschreibung gespeichert, jeder Stand lässt sich wiederherstellen, und mehrere Personen können gleichzeitig am selben Code arbeiten, ohne sich gegenseitig zu überschreiben.

Git ist **verteilt**: Jede Kopie eines [[Repository|Repositorys]] enthält die vollständige Historie. Du kannst offline committen, Branches anlegen und die Historie durchsuchen. Dienste wie [GitHub](#/tech/github) oder [GitLab](#/tech/gitlab) sind nur ein gemeinsamer Treffpunkt (Remote) – nicht Git selbst.

## Die drei Bereiche

\`\`\`widget
pipeline:git-bereiche
\`\`\`

\`\`\`bash title="Der tägliche Ablauf"
git status                      # Was hat sich geändert?
git diff                        # Änderungen im Arbeitsverzeichnis ansehen
git add src/login.ts            # gezielt vormerken
git diff --staged               # prüfen, was committet wird
git commit -m "Login: Fehlermeldung bei gesperrtem Konto anzeigen"
git push                        # zum Remote übertragen
\`\`\`

> [!BEGINNER]
> Die Staging Area ist wie ein Einkaufskorb: Du legst gezielt hinein, was in den nächsten Commit soll. So kannst du mehrere unabhängige Änderungen in getrennte, verständliche Commits aufteilen – auch wenn du sie gleichzeitig gemacht hast.

## Was ein Commit wirklich ist

Ein [[Commit]] ist ein **Schnappschuss des gesamten Projekts** (nicht nur ein Diff) plus Metadaten: Autor, Datum, Nachricht und ein Verweis auf den Vorgänger-Commit. Identifiziert wird er durch einen Hash wie \`a3f9c2e\`. Weil jeder Commit auf seinen Vorgänger zeigt, entsteht eine Kette – die Historie.

\`\`\`text
A ← B ← C ← D      (main)
\`\`\`

### Gute Commit-Nachrichten

\`\`\`text
Kurze Zusammenfassung im Imperativ (max. ~50 Zeichen)

Optional nach einer Leerzeile: WARUM die Änderung nötig war,
nicht WAS geändert wurde – das zeigt der Diff.

Closes #142
\`\`\`

Viele Teams nutzen **Conventional Commits** (\`feat:\`, \`fix:\`, \`docs:\`, \`refactor:\`), aus denen sich Changelogs und [Versionsnummern](#/lexikon/semantic-versioning) automatisch ableiten lassen.

## Branches

Ein [[Branch]] ist nur ein **beweglicher Zeiger auf einen Commit** – billig anzulegen, schnell zu wechseln. Damit entwickelst du Features isoliert, ohne den Hauptzweig zu gefährden.

\`\`\`bash
git switch -c feature/passwort-reset   # neuen Branch anlegen und wechseln
# … arbeiten, committen …
git switch main                         # zurück zum Hauptzweig
git branch                              # lokale Branches anzeigen
\`\`\`

\`\`\`text
            E ← F      (feature/passwort-reset)
           /
A ← B ← C ← D          (main)
\`\`\`

\`HEAD\` zeigt an, wo du gerade stehst – meist auf einen Branch.

## Merge und Rebase

Zwei Wege, Änderungen eines Branches in einen anderen zu übernehmen:

| | **Merge** | **Rebase** |
|---|---|---|
| Was passiert | Erzeugt einen Merge-Commit mit zwei Eltern | Spielt die eigenen Commits neu auf einen anderen Stand auf |
| Historie | Bleibt exakt erhalten, verzweigt | Linear, „aufgeräumt“ |
| Commit-Hashes | unverändert | **neue** Hashes für die umgeschriebenen Commits |
| Risiko | gering | bei bereits geteilten Commits problematisch |

\`\`\`bash
# Merge: Feature in main übernehmen
git switch main
git merge feature/passwort-reset

# Rebase: eigenen Branch auf den neuesten main-Stand setzen
git switch feature/passwort-reset
git fetch origin
git rebase origin/main
\`\`\`

\`\`\`text
Nach Merge:                         Nach Rebase:
            E ← F                                       E' ← F'   (feature)
           /     \\                                     /
A ← B ← C ← D  ←  M   (main)       A ← B ← C ← D       (main)
\`\`\`

> [!DANGER] Goldene Regel des Rebase
> Schreibe keine Historie um, die andere bereits haben. Rebase nur **lokale** oder ausschließlich eigene Branches. Musst du einen umgeschriebenen Branch pushen, nutze \`git push --force-with-lease\` statt \`--force\` – es bricht ab, wenn jemand anderes inzwischen gepusht hat.

### Selbst ausprobieren

Tippe im Simulator echte Befehle wie \`git switch -c feature\`, \`git commit\`, \`git merge\` oder \`git rebase main\` und beobachte, wie sich Branch-Zeiger und HEAD bewegen. Der Simulator bildet Commits und Branches nach, aber keine Dateiinhalte – Konflikte entstehen hier daher nicht.

\`\`\`widget
git
\`\`\`

## Merge-Konflikte

Ein [[Merge-Konflikt]] entsteht, wenn beide Seiten **dieselben Zeilen** unterschiedlich geändert haben. Git markiert die Stelle:

\`\`\`text
<<<<<<< HEAD
const MAX_VERSUCHE = 5;
=======
const MAX_VERSUCHE = 3;
>>>>>>> feature/passwort-reset
\`\`\`

So löst du ihn:
1. Datei öffnen, gewünschten Stand herstellen, Markierungen entfernen.
2. \`git add datei\` – als gelöst markieren.
3. \`git commit\` (bei Merge) bzw. \`git rebase --continue\` (bei Rebase).
4. Im Zweifel abbrechen: \`git merge --abort\` bzw. \`git rebase --abort\`.

> [!TIP]
> Konflikte werden seltener, wenn Branches kurzlebig sind und regelmäßig mit \`main\` abgeglichen werden. Editoren wie [VS Code](#/tech/vscode) zeigen Konflikte übersichtlich mit Buttons für „aktuelle“ und „eingehende“ Änderung.

## Mit anderen zusammenarbeiten

\`\`\`bash
git clone https://github.com/team/shop.git   # Repository kopieren (Remote heißt "origin")
git fetch                                     # neue Commits holen, nichts ändern
git pull                                      # fetch + in den aktuellen Branch integrieren
git push -u origin feature/passwort-reset     # Branch erstmals veröffentlichen
\`\`\`

### Pull Requests

Ein [[Pull Request]] (bei GitLab: Merge Request) ist kein Git-Befehl, sondern eine Funktion der Plattform: Du schlägst vor, einen Branch in \`main\` zu übernehmen. Dort passiert:
- **[[Code Review]]** durch Kolleginnen und Kollegen,
- automatische Prüfungen per [CI](#/artikel/ci-cd) (Tests, Linter, Build),
- Diskussion und Nachbesserung, bevor gemergt wird.

Verbreitete Arbeitsweise (**Trunk-based** mit kurzlebigen Feature-Branches): Branch von \`main\` → kleine Commits → Pull Request → Review + grüne CI → Merge → Branch löschen.

## Fehler rückgängig machen

| Situation | Befehl |
|---|---|
| Änderung in Datei verwerfen (nicht gestaged) | \`git restore datei\` |
| Datei aus der Staging Area nehmen | \`git restore --staged datei\` |
| Letzte Commit-Nachricht korrigieren (noch nicht gepusht) | \`git commit --amend\` |
| Gepushten Commit rückgängig machen – sicher | \`git revert <hash>\` (neuer Gegen-Commit) |
| Lokale Commits verwerfen | \`git reset --hard <hash>\` ⚠️ verwirft Änderungen |
| „Verlorenen“ Commit wiederfinden | \`git reflog\` |
| Arbeit kurz beiseitelegen | \`git stash\` / \`git stash pop\` |

> [!WARNING]
> \`git reset --hard\` und \`git clean -fd\` löschen nicht committete Arbeit unwiderruflich. \`git reflog\` rettet nur, was einmal committet war.

## .gitignore und Secrets

In eine [[.gitignore]] gehören Abhängigkeiten, Build-Ergebnisse und lokale Konfiguration:

\`\`\`text title=".gitignore"
node_modules/
dist/
__pycache__/
.venv/
.env
*.log
.DS_Store
\`\`\`

> [!DANGER] Secrets nie committen
> Ein versehentlich gepushter API-Schlüssel ist kompromittiert – auch wenn du ihn im nächsten Commit löschst, steht er in der Historie. Sofort **den Schlüssel widerrufen und neu erzeugen**. Vorbeugung: \`.env\` ignorieren, Secret-Scanning der Plattform aktivieren, Pre-Commit-Hooks.

## Wie geht es weiter?

Alle wichtigen Befehle kompakt im [Git-Cheatsheet](#/cheatsheets/git). Was nach dem Push automatisch passiert, zeigt [CI/CD](#/artikel/ci-cd).

\`\`\`widget
quiz:Git 3
\`\`\`
`;export{e as default};
