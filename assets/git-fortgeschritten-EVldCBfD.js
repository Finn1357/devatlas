const e=`---
id: git-fortgeschritten
title: Git für Fortgeschrittene: Historie aufräumen, Fehler finden, alles retten
area: tools
difficulty: fortgeschritten
minutes: 20
order: 14
summary: Interaktives Rebase mit fixup und autosquash, cherry-pick, revert und die drei Arten von reset, verlorene Commits über das Reflog retten, Fehler mit git bisect automatisch eingrenzen, Konflikte souverän lösen, worktree, stash und sicheres Force-Push.
tags: [Git, Rebase, Reflog, Bisect, Cherry-Pick, Versionskontrolle]
related: [git-grundlagen, ci-cd, debugging, testing, paketmanager-buildtools]
---

## Das Modell, das alles erklärt

Fast jeder fortgeschrittene Git-Befehl wird verständlich, wenn man drei Dinge verinnerlicht hat (Details in [Git-Grundlagen](#/artikel/git-grundlagen)):

1. Ein [[Commit]] ist ein **unveränderlicher Schnappschuss** mit Verweis auf seine Eltern. „Ändern“ heißt in Git immer: einen **neuen** Commit erzeugen.
2. Ein [[Branch]] ist nur ein **beweglicher Zeiger** auf einen Commit. \`HEAD\` zeigt auf den aktuellen Branch (oder direkt auf einen Commit).
3. Git löscht nichts sofort. Commits, auf die kein Zeiger mehr zeigt, bleiben noch Wochen erreichbar – über das [[Reflog]].

Wer das im Kopf hat, verliert die Angst vor \`rebase\` und \`reset\`: Im schlimmsten Fall zeigt ein Zeiger auf den falschen Commit, und man setzt ihn zurück.

\`\`\`widget
git
\`\`\`

## Historie aufräumen mit interaktivem Rebase

Während der Arbeit entstehen Commits wie „wip“, „Tippfehler“ oder „jetzt aber wirklich“. Vor dem Pull Request lohnt es sich, daraus eine nachvollziehbare Folge zu machen. Ein **interaktiver [[Rebase]]** spielt Commits neu ab und lässt dich dabei entscheiden, was mit jedem passiert:

\`\`\`bash title="Die letzten vier Commits bearbeiten"
git rebase -i HEAD~4
\`\`\`

\`\`\`text title="Editor: Anweisungen von oben (alt) nach unten (neu)"
pick   a1b2c3d Validierung für Titel
fixup  d4e5f6a Tippfehler in Fehlermeldung     ← in den vorigen Commit einschmelzen, Nachricht verwerfen
reword 0f9e8d7 Endpunkt zum Erledigen          ← Commit behalten, Nachricht neu schreiben
drop   7c6b5a4 Debug-Ausgabe                   ← Commit entfernen
\`\`\`

| Befehl | Wirkung |
|---|---|
| \`pick\` | Commit unverändert übernehmen |
| \`reword\` | Commit übernehmen, Nachricht bearbeiten |
| \`edit\` | anhalten, um den Commit zu ändern oder aufzuteilen |
| \`squash\` | mit dem vorherigen Commit verschmelzen, Nachrichten zusammenführen |
| \`fixup\` | wie \`squash\`, aber die eigene Nachricht verwerfen |
| \`drop\` | Commit entfernen |

Zeilen lassen sich auch **umsortieren**. Bei Konflikten hält Git an: Konflikt lösen, \`git add\`, dann \`git rebase --continue\`. Mit \`git rebase --abort\` kehrst du jederzeit zum Ausgangszustand zurück.

### fixup-Commits und autosquash

Noch bequemer: Korrekturen gleich als „fixup für Commit X“ anlegen und Git das Einsortieren überlassen.

\`\`\`bash title="Korrektur gezielt einem älteren Commit zuordnen"
git add src/validierung.ts
git commit --fixup=a1b2c3d            # erzeugt „fixup! Validierung für Titel“
git rebase -i --autosquash main       # sortiert und markiert fixup-Commits automatisch
\`\`\`

> [!DANGER] Die goldene Regel
> Commits, die andere schon haben (also gepushte Commits auf gemeinsam genutzten Branches wie \`main\`), **nicht** umschreiben. Rebase erzeugt neue Commits mit neuen IDs; wer auf den alten aufgebaut hat, bekommt doppelte Commits und Konflikte. Den eigenen Feature-Branch vor dem Merge aufzuräumen ist dagegen üblich.

### Sicher force-pushen

Nach einem Rebase des eigenen, bereits gepushten Branches muss man den Remote-Branch überschreiben. Statt \`--force\` immer:

\`\`\`bash
git push --force-with-lease
\`\`\`

\`--force-with-lease\` überschreibt nur, wenn der Remote-Branch noch auf dem Stand steht, den du zuletzt gesehen hast. Hat ein Kollege inzwischen etwas gepusht, bricht der Befehl ab, statt dessen Arbeit zu löschen.

## Commits gezielt übernehmen oder zurücknehmen

- **\`git cherry-pick <commit>\`** kopiert die Änderung eines Commits als neuen Commit auf den aktuellen Branch – etwa einen Bugfix von \`main\` in einen Release-Branch. Mit \`-x\` vermerkt Git die Herkunft in der Nachricht. Siehe Cherry-Pick.
- **\`git revert <commit>\`** erzeugt einen neuen Commit, der die Änderung **umkehrt**. Die Historie bleibt erhalten – das ist der richtige Weg, um etwas auf einem gemeinsamen Branch rückgängig zu machen.

### Die drei Arten von reset

\`git reset <ziel>\` setzt den aktuellen Branch-Zeiger auf einen anderen Commit. Die Option entscheidet, was mit Staging-Bereich und Arbeitsverzeichnis passiert:

| Befehl | Branch-Zeiger | Staging-Bereich | Arbeitsverzeichnis | Typischer Zweck |
|---|---|---|---|---|
| \`git reset --soft HEAD~1\` | zurück | behält Änderungen (gestaged) | unverändert | letzten Commit „aufmachen“ und neu committen |
| \`git reset HEAD~1\` (\`--mixed\`) | zurück | geleert | unverändert | Commit auflösen, Änderungen neu sortieren |
| \`git reset --hard HEAD~1\` | zurück | geleert | **überschrieben** | alles verwerfen |

> [!WARNING] --hard verwirft nicht committete Arbeit endgültig
> Committete Stände lassen sich über das Reflog zurückholen, **ungespeicherte Änderungen im Arbeitsverzeichnis nicht**. Vor \`reset --hard\` deshalb \`git status\` lesen oder mit \`git stash\` sichern.

## Alles retten mit dem Reflog

Das Reflog protokolliert lokal jede Bewegung von \`HEAD\` – auch nach Rebase, Reset oder dem Löschen eines Branches.

\`\`\`bash title="Einen „verlorenen“ Stand wiederfinden"
git reflog
# 3f2a1b9 HEAD@{0}: reset: moving to HEAD~3
# 8c7d6e5 HEAD@{1}: commit: Endpunkt zum Erledigen
# ...
git branch rettung 8c7d6e5        # Zeiger auf den alten Stand setzen – fertig
\`\`\`

Typische Rettungen: ein versehentliches \`reset --hard\` auf frühere Commits, ein misslungenes Rebase (\`git reset --hard ORIG_HEAD\` geht unmittelbar danach auch), ein gelöschter Branch. Das Reflog ist **lokal** – auf einem frisch geklonten Rechner hilft es nicht – und alte Einträge verfallen nach einer Frist (standardmäßig 90 Tage für erreichbare, 30 Tage für unerreichbare Einträge).

## Fehler finden mit git bisect

Ein Test war vor 200 Commits grün und ist jetzt rot. [[Git Bisect]] findet den verantwortlichen Commit per **binärer Suche**: Bei 200 Kandidaten reichen etwa 8 Prüfschritte (log₂ 200 ≈ 7,6).

\`\`\`bash title="Manuell eingrenzen"
git bisect start
git bisect bad                 # aktueller Stand ist kaputt
git bisect good v1.4.0         # dieser Stand war in Ordnung
# Git checkt einen Commit in der Mitte aus → testen, dann:
git bisect good                # oder: git bisect bad
# … wiederholen, bis Git den ersten schlechten Commit meldet
git bisect reset               # zurück zum Ausgangs-Branch
\`\`\`

\`\`\`bash title="Vollautomatisch mit einem Testbefehl"
git bisect start HEAD v1.4.0
git bisect run npm test -- --run tests/preis.test.ts
# Exit-Code 0 = gut, 1–127 (außer 125) = schlecht, 125 = Commit überspringen (z. B. baut nicht)
\`\`\`

> [!TIP] Bisect braucht kleine, baubare Commits
> Bisect ist nur so genau wie die Commits: Ein Riesencommit „Refactoring“ als Ergebnis hilft wenig. Ein weiterer Grund für eine aufgeräumte Historie, in der jeder Commit baut.

## Konflikte souverän lösen

Ein [[Merge-Konflikt]] entsteht, wenn beide Seiten dieselbe Stelle geändert haben. Mehr Kontext macht Konflikte leichter verständlich:

\`\`\`bash title="Konfliktmarker mit Ausgangsversion anzeigen"
git config --global merge.conflictStyle zdiff3
\`\`\`

\`\`\`text title="zdiff3: zusätzlich der gemeinsame Ausgangsstand"
<<<<<<< HEAD
const MAX_TITEL = 120;
||||||| Ausgangsversion
const MAX_TITEL = 100;
=======
const MAX_TITEL_LAENGE = 100;
>>>>>>> feature/umbenennung
\`\`\`

Jetzt ist klar: Die eine Seite hat den Wert geändert, die andere den Namen – die richtige Lösung ist \`const MAX_TITEL_LAENGE = 120;\`, keine der beiden Seiten allein.

- \`git checkout --ours datei\` / \`--theirs datei\` übernimmt eine Seite komplett (Achtung: Bei einem Rebase sind „ours“ und „theirs“ vertauscht, weil Git deine Commits auf den Zielbranch abspielt).
- \`git config --global rerere.enabled true\` merkt sich Konfliktlösungen und wendet sie beim nächsten Mal automatisch an – praktisch bei langen Rebases.
- Nach der Lösung immer **bauen und testen**: Ein textuell konfliktfreier Merge kann trotzdem fachlich falsch sein.

## Paralleles Arbeiten: stash und worktree

- **\`git stash\`** legt unfertige Änderungen beiseite (\`git stash push -m "halbfertig"\`, zurückholen mit \`git stash pop\`). Für mehr als ein paar Minuten ist ein WIP-Commit auf einem eigenen Branch übersichtlicher.
- **\`git worktree add ../hotfix main\`** checkt einen zweiten Branch in einem **eigenen Ordner** aus, der dasselbe Repository nutzt. So kannst du einen Hotfix bauen, während im Hauptordner ein langer Test läuft – ohne stash und ohne zweiten Klon.

## Qualität automatisch sichern: Hooks

Git führt Skripte an bestimmten Stellen aus, z. B. \`pre-commit\` (vor dem Commit) oder \`commit-msg\`. Sie liegen in \`.git/hooks\` und werden **nicht** mit dem Repository verteilt; Teams nutzen dafür Werkzeuge wie pre-commit (Python) oder Husky (Node.js), die die Hooks aus einer versionierten Konfiguration installieren. Hooks sind eine Bequemlichkeit, keine Sicherheitsgrenze – die verbindliche Prüfung gehört in die [CI-Pipeline](#/artikel/ci-cd).

## Typische Fehler

> [!MISTAKE] \`git push --force\` auf einen gemeinsamen Branch
> Überschreibt die Commits anderer. Gemeinsame Branches schützen (Branch Protection), auf eigenen Branches \`--force-with-lease\` verwenden.

- **Gepushte Historie umschreiben**, auf der andere aufbauen.
- **\`reset --hard\` mit ungesicherten Änderungen** – die sind danach wirklich weg.
- **Konflikte „wegklicken“**, indem pauschal eine Seite übernommen wird, ohne den Code zu verstehen.
- **Riesige Commits**, die bisect, Review und revert erschweren.
- **Geheimnisse committen und nur im nächsten Commit löschen:** Sie stehen weiter in der Historie. Das Geheimnis sofort widerrufen bzw. rotieren; ein nachträgliches Umschreiben der Historie (z. B. mit \`git filter-repo\`) ist aufwendig und erreicht keine bereits vorhandenen Klone.

## Übungsfragen

> 1. Du hast auf deinem Feature-Branch fünf Commits, zwei davon sind Tippfehler-Korrekturen. Wie räumst du auf, und was musst du beim anschließenden Push beachten?
> 2. Nach \`git reset --hard HEAD~3\` merkst du, dass einer der drei Commits wichtig war. Wie bekommst du ihn zurück?
> 3. Ein Fehler steckt irgendwo in den letzten 1 000 Commits. Wie viele Testläufe braucht \`git bisect\` ungefähr?

\`\`\`widget
quiz:Git 4
\`\`\`

## Wie geht es weiter?

Im [Git-Simulator](#/labor/git) kannst du \`rebase\`, \`reset\` und \`merge\` gefahrlos ausprobieren. Wie Git in automatisierte Abläufe eingebunden wird, zeigt [CI/CD](#/artikel/ci-cd); systematisches Fehlersuchen allgemein behandelt [Debugging](#/artikel/debugging).
`;export{e as default};
