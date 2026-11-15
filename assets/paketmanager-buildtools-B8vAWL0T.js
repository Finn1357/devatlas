const e=`---
id: paketmanager-buildtools
title: Paketmanager, Abhängigkeiten & Build-Tools
area: tools
difficulty: einsteiger
minutes: 16
order: 11
summary: Wie npm, pip, Maven und Co. Abhängigkeiten verwalten, warum Lockfiles und Semantic Versioning wichtig sind, was Bundler und Build-Tools tun und wie man die Lieferkette absichert.
tags: [npm, pip, uv, Maven, Lockfile, Semantic Versioning, Vite, Bundler]
related: [git-grundlagen, testing, ci-cd, dockerfile]
---

## Warum Paketmanager?

Kaum ein Projekt schreibt alles selbst: Datumsformatierung, HTTP-Clients, Test-Frameworks kommen als fertige Bibliotheken. Ein [[Paketmanager]] lädt diese [[Dependency|Abhängigkeiten]] aus einer Registry, löst **deren** Abhängigkeiten mit auf (transitive Abhängigkeiten), installiert passende Versionen und macht den Aufbau für alle im Team reproduzierbar.

## Die wichtigsten Paketmanager

| Ökosystem | Werkzeug | Manifest | Lockfile | Registry |
|---|---|---|---|---|
| JavaScript/TypeScript | [npm](#/tech/npm), [pnpm](#/tech/pnpm), [Yarn](#/tech/yarn) | \`package.json\` | \`package-lock.json\`, \`pnpm-lock.yaml\`, \`yarn.lock\` | npm Registry |
| Python | [pip](#/tech/pip), [uv](#/tech/uv), [Poetry](#/tech/poetry) | \`pyproject.toml\` (oder \`requirements.txt\`) | \`uv.lock\`, \`poetry.lock\` | PyPI |
| Java/Kotlin | [Maven](#/tech/maven), [Gradle](#/tech/gradle) | \`pom.xml\`, \`build.gradle(.kts)\` | (Gradle: optionales Locking) | Maven Central |
| C#/.NET | NuGet (\`dotnet add package\`) | \`.csproj\` | \`packages.lock.json\` (optional) | nuget.org |
| Rust | Cargo | \`Cargo.toml\` | \`Cargo.lock\` | crates.io |
| Go | Go Modules | \`go.mod\` | \`go.sum\` (Prüfsummen) | Module-Proxy |
| PHP | Composer | \`composer.json\` | \`composer.lock\` | Packagist |
| Ruby | Bundler | \`Gemfile\` | \`Gemfile.lock\` | RubyGems |

## Semantic Versioning

Die meisten Ökosysteme nutzen [[Semantic Versioning]]: \`MAJOR.MINOR.PATCH\`, z. B. \`4.2.1\`.

- **MAJOR** – inkompatible Änderungen (Code kann brechen)
- **MINOR** – neue Funktionen, abwärtskompatibel
- **PATCH** – Fehlerbehebungen, abwärtskompatibel

In \`package.json\` bestimmen Präfixe, welche Updates erlaubt sind:

| Angabe | Erlaubt | Beispiel |
|---|---|---|
| \`4.2.1\` | genau diese Version | nur 4.2.1 |
| \`~4.2.1\` | Patch-Updates | 4.2.x (≥ 4.2.1) |
| \`^4.2.1\` | Minor- und Patch-Updates | 4.x.x (≥ 4.2.1) |

> [!EXPERT] Sonderfall 0.x
> Bei Versionen unter 1.0.0 gilt alles als instabil: \`^0.4.2\` erlaubt bei npm nur \`0.4.x\`, nicht \`0.5.0\`.

## Lockfiles: reproduzierbare Installationen

Das Manifest sagt „irgendeine 4.x“, das [[Lockfile]] hält fest, **welche exakte Version** jeder direkten und transitiven Abhängigkeit installiert wurde – meist inklusive Prüfsumme. So bekommen alle Entwickler, die CI und die Produktion denselben Stand.

> [!TIP] Lockfile gehört ins Repository
> Committe das Lockfile bei Anwendungen immer. In CI und Docker-Builds die Lockfile-treue Installation nutzen: \`npm ci\`, \`pnpm install --frozen-lockfile\`, \`uv sync --locked\`. Sie scheitert, statt stillschweigend andere Versionen zu installieren.

\`\`\`bash title="JavaScript (npm)"
npm install zod                 # Laufzeit-Abhängigkeit hinzufügen
npm install -D vitest           # Entwicklungsabhängigkeit (nur für Tests/Build)
npm ci                          # exakt nach Lockfile installieren (CI)
npm outdated                    # veraltete Pakete anzeigen
npm audit                       # bekannte Schwachstellen prüfen
npm run build                   # Skript aus package.json ausführen
\`\`\`

\`\`\`bash title="Python (uv)"
uv init shop-api                # neues Projekt mit pyproject.toml
uv add fastapi                  # Abhängigkeit hinzufügen (aktualisiert uv.lock)
uv add --dev pytest             # Entwicklungsabhängigkeit
uv sync                         # Umgebung gemäß Lockfile herstellen
uv run pytest                   # Befehl in der Projektumgebung ausführen
\`\`\`

\`\`\`bash title="Python (pip + venv, klassisch)"
python -m venv .venv            # isolierte Umgebung anlegen
source .venv/bin/activate       # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
\`\`\`

> [!BEGINNER] Warum virtuelle Umgebungen?
> Ohne \`venv\` landen alle Python-Pakete global – Projekt A braucht Django 4, Projekt B Django 5, und beide stören sich. Eine virtuelle Umgebung gibt jedem Projekt seinen eigenen Paketordner. In Node.js ist das automatisch so: \`node_modules\` liegt im Projekt.

## Build-Tools und Bundler

Ein **[[Build]]** verwandelt Quellcode in etwas Auslieferbares. Je nach Sprache bedeutet das:

| Sprache | Typische Build-Schritte | Werkzeuge |
|---|---|---|
| TypeScript/Web | TS → JS ([[Transpiler|transpilieren]]), Module bündeln, minifizieren, Assets mit Hash versehen | [Vite](#/tech/vite), [webpack](#/tech/webpack), esbuild, tsc |
| Java/Kotlin | kompilieren, testen, als JAR paketieren | [Maven](#/tech/maven), [Gradle](#/tech/gradle) |
| C# | kompilieren, paketieren | \`dotnet build\`, \`dotnet publish\` |
| Go, Rust | zu einer ausführbaren Datei kompilieren | \`go build\`, \`cargo build --release\` |
| Python | meist kein Build für Anwendungen; Bibliotheken als Wheel paketieren | \`uv build\`, \`python -m build\` |

Ein **[[Bundler]]** fasst im Web viele Module zu wenigen optimierten Dateien zusammen, entfernt ungenutzten Code (Tree Shaking) und teilt große Anwendungen in nachladbare Stücke (Code Splitting). Im Entwicklungsmodus liefern moderne Tools wie Vite Module einzeln aus und aktualisieren Änderungen ohne Neuladen (Hot Module Replacement).

\`\`\`json title="package.json – Skripte als einheitliche Schnittstelle"
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "test": "vitest run",
    "lint": "eslint ."
  }
}
\`\`\`

So muss niemand wissen, welche Werkzeuge dahinterstehen: \`npm run build\` funktioniert lokal und in der CI gleich.

## Qualitätswerkzeuge

- **[[Linter]]** ([ESLint](#/tech/eslint), Ruff, Clippy) finden fehleranfällige Muster.
- **[[Formatter]]** ([Prettier](#/tech/prettier), Black, \`ruff format\`, gofmt) vereinheitlichen den Stil – Diskussionen über Einrückung entfallen.
- **Typprüfung** (\`tsc --noEmit\`, mypy, Pyright) findet Typfehler vor der Laufzeit.

## Sicherheit der Lieferkette

Jede Abhängigkeit ist fremder Code, der mit deinen Rechten läuft – und bringt eigene Abhängigkeiten mit.

> [!DANGER] Typische Angriffe
> **Typosquatting** (\`reqeusts\` statt \`requests\`), **übernommene Maintainer-Konten**, die eine bösartige Version veröffentlichen, und **Install-Skripte**, die beim Installieren Code ausführen.

Schutzmaßnahmen:
1. **Lockfiles** mit Prüfsummen nutzen und in CI lockfile-treu installieren.
2. Abhängigkeiten **bewusst auswählen**: Wird das Paket gepflegt? Wie viele Abhängigkeiten zieht es nach? Braucht es das wirklich?
3. **Automatische Schwachstellenprüfung** (\`npm audit\`, \`pip-audit\`, Dependabot, Renovate) und zeitnahe Updates.
4. **Install-Skripte einschränken**, wo das Werkzeug es erlaubt (z. B. pnpm führt Build-Skripte von Abhängigkeiten nur nach Freigabe aus; npm kennt \`--ignore-scripts\`).
5. Paketnamen vor der Installation **genau prüfen**.
6. Für interne Pakete eigene Registries mit eindeutigen Namensräumen (Scopes) nutzen.

## Wie geht es weiter?

Die npm-Befehle findest du im [npm-Cheatsheet](#/cheatsheets/npm); wie Builds automatisch laufen, in [CI/CD](#/artikel/ci-cd); wie Abhängigkeiten im Container landen, in [Dockerfiles schreiben](#/artikel/dockerfile).
`;export{e as default};
