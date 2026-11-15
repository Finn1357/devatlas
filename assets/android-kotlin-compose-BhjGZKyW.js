const e=`---
id: android-kotlin-compose
title: Tutorial: Android-App mit Kotlin und Jetpack Compose
area: mobile
difficulty: fortgeschritten
minutes: 28
order: 2
summary: Von der Installation von Android Studio bis zur lauffähigen Todo-App auf dem eigenen Smartphone – Projektstruktur, Gradle, Activity und Lebenszyklus, Composables, Zustand mit remember, ViewModel und StateFlow, Listen, Material 3, Edge-to-Edge, Vorschauen und Installation per USB.
tags: [Android, Kotlin, Jetpack Compose, ViewModel, StateFlow, Material 3, Tutorial]
related: [mobile-entwicklung, mobile-architektur-navigation, mobile-daten-api, mobile-sicherheit-testing, mobile-deployment, flutter-dart]
---

## Was du baust

Eine kleine **Todo-App**: Aufgaben eingeben, abhaken, löschen. Daran lernst du die Grundbausteine jeder modernen Android-App: [[Activity]], [[Composable|Composables]], Zustand, [[ViewModel]] und [[Unidirektionaler Datenfluss|unidirektionalen Datenfluss]]. Speicherung in einer Datenbank folgt im Artikel [Lokale Daten & APIs](#/artikel/mobile-daten-api).

**Voraussetzungen:** Grundkenntnisse in Kotlin (siehe [Kotlin-Steckbrief](#/sprachen/kotlin)), ein Rechner mit Windows, macOS oder Linux und – optional – ein Android-Smartphone.

## 1. Android Studio und das erste Projekt

1. **Android Studio** von developer.android.com installieren. Es bringt das Android SDK, einen Emulator und ein passendes JDK mit.
2. *New Project* → Vorlage **Empty Activity** (die Compose-Vorlage) → Name „Todo“, Paketname z. B. \`de.beispiel.todo\`, Sprache Kotlin, Build-Konfiguration **Kotlin DSL**.
3. Ein virtuelles Gerät im **Device Manager** anlegen oder ein echtes Gerät anschließen (Schritt 8).
4. Mit ▶ starten.

### Projektstruktur

\`\`\`text title="Wichtige Dateien"
app/
├── build.gradle.kts            Modul-Konfiguration: minSdk, targetSdk, Abhängigkeiten
└── src/main/
    ├── AndroidManifest.xml     App-Name, Icon, Activities, Berechtigungen
    ├── java/de/beispiel/todo/
    │   ├── MainActivity.kt     Einstiegspunkt
    │   └── ui/theme/           Farben, Typografie, Theme
    └── res/                    Ressourcen: Icons (mipmap), Strings, …
gradle/libs.versions.toml       zentrale Versionsliste der Abhängigkeiten
\`\`\`

| Einstellung | Bedeutung |
|---|---|
| \`minSdk\` | älteste unterstützte Android-Version (z. B. 24 = Android 7.0) |
| \`targetSdk\` | Version, deren Verhalten die App erwartet; Google Play verlangt jährlich höhere Werte |
| \`compileSdk\` | SDK, gegen das kompiliert wird – meist die neueste Version |
| \`versionCode\` / \`versionName\` | interne Build-Nummer (muss bei jedem Update steigen) bzw. angezeigte Version |

## 2. Activity und Lebenszyklus

\`\`\`kotlin title="MainActivity.kt"
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()               // hinter Status- und Navigationsleiste zeichnen
        setContent {
            TodoTheme {                  // vom Projekt-Template erzeugtes Material-3-Theme
                TodoScreen()
            }
        }
    }
}
\`\`\`

Eine [[Activity]] ist ein Einstiegspunkt mit [[App-Lebenszyklus|Lebenszyklus]]: \`onCreate\` → \`onStart\` → \`onResume\` (sichtbar und bedienbar) → \`onPause\` → \`onStop\` (unsichtbar) → \`onDestroy\`. Wichtig: Beim **Drehen**, Wechsel in den Dark Mode oder einer anderen Schriftgröße wird die Activity standardmäßig **neu erzeugt**. Zustand, der das überleben soll, gehört deshalb nicht in die Activity, sondern in ein ViewModel bzw. \`rememberSaveable\`.

> [!EXPERT] Edge-to-Edge ist Pflicht
> Apps mit \`targetSdk\` 35 oder höher werden auf Android 15+ grundsätzlich randlos dargestellt. \`enableEdgeToEdge()\` sorgt für transparente Systemleisten auch auf älteren Versionen; Compose-Komponenten wie \`Scaffold\` berücksichtigen die [[Edge-to-Edge|Insets]] über ihre \`innerPadding\`.

## 3. Composables: Oberfläche als Funktion

In Jetpack Compose ist die Oberfläche eine Funktion des Zustands. Eine mit \`@Composable\` markierte Funktion **beschreibt**, wie etwas aussieht:

\`\`\`kotlin title="Ein einfaches Composable"
@Composable
fun Begruessung(name: String, modifier: Modifier = Modifier) {
    Text(
        text = "Hallo, $name!",
        style = MaterialTheme.typography.headlineSmall,
        modifier = modifier.padding(16.dp),
    )
}

@Preview(showBackground = true)
@Composable
private fun BegruessungPreview() {
    TodoTheme { Begruessung("Ada") }
}
\`\`\`

- **Layouts**: \`Column\` (untereinander), \`Row\` (nebeneinander), \`Box\` (übereinander), \`LazyColumn\` (lange, scrollbare Listen – rendert nur sichtbare Einträge).
- **Modifier** steuern Größe, Abstand, Hintergrund, Klickverhalten – die Reihenfolge zählt: \`padding\` vor \`background\` ergibt etwas anderes als umgekehrt.
- **@Preview** zeigt das Composable in Android Studio, ohne die App zu starten.

## 4. Zustand und Recomposition

Ändert sich ein Zustand, den ein Composable liest, führt Compose es erneut aus – die [[Recomposition]].

\`\`\`kotlin title="Lokaler Zustand mit remember"
@Composable
fun Zaehler() {
    var anzahl by rememberSaveable { mutableIntStateOf(0) }   // überlebt auch das Drehen des Geräts
    Button(onClick = { anzahl++ }) {
        Text("Geklickt: $anzahl")
    }
}
\`\`\`

- \`remember { … }\` behält einen Wert über Recompositions hinweg.
- \`rememberSaveable { … }\` übersteht zusätzlich Konfigurationsänderungen und das Beenden des Prozesses im Hintergrund.
- Zustand, den mehrere Composables brauchen, wird **nach oben gezogen** (*state hoisting*): Das Composable bekommt Wert und Callback als Parameter, statt den Zustand selbst zu besitzen.

> [!MISTAKE] Zustand ohne remember
> \`var anzahl = 0\` innerhalb eines Composables wird bei jeder Recomposition wieder auf 0 gesetzt – der Button scheint nicht zu funktionieren.

## 5. ViewModel und StateFlow

Für die Todo-Liste trennen wir Logik und Oberfläche. Das **ViewModel** hält den Zustand als \`StateFlow\`; die Oberfläche beobachtet ihn und meldet Ereignisse zurück.

\`\`\`kotlin title="TodoViewModel.kt"
data class Todo(val id: Long, val title: String, val done: Boolean = false)

data class TodoUiState(
    val todos: List<Todo> = emptyList(),
    val eingabe: String = "",
)

class TodoViewModel : ViewModel() {
    private val _state = MutableStateFlow(TodoUiState())
    val state: StateFlow<TodoUiState> = _state.asStateFlow()
    private var naechsteId = 1L

    fun onEingabe(text: String) = _state.update { it.copy(eingabe = text) }

    fun hinzufuegen() = _state.update { s ->
        val titel = s.eingabe.trim()
        if (titel.isEmpty()) s
        else s.copy(todos = s.todos + Todo(naechsteId++, titel), eingabe = "")
    }

    fun umschalten(id: Long) = _state.update { s ->
        s.copy(todos = s.todos.map { if (it.id == id) it.copy(done = !it.done) else it })
    }

    fun loeschen(id: Long) = _state.update { s -> s.copy(todos = s.todos.filterNot { it.id == id }) }
}
\`\`\`

Der Zustand ist **unveränderlich** (\`data class\`, \`List\`); Änderungen erzeugen mit \`copy\` einen neuen Zustand. Das macht Recomposition zuverlässig und Tests einfach.

## 6. Der Bildschirm

\`\`\`kotlin title="TodoScreen.kt"
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TodoScreen(viewModel: TodoViewModel = viewModel()) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    Scaffold(
        topBar = { TopAppBar(title = { Text("Meine Aufgaben") }) },
    ) { innerPadding ->
        Column(
            Modifier
                .padding(innerPadding)        // berücksichtigt Systemleisten und Top-Bar
                .padding(horizontal = 16.dp)
                .imePadding(),                // Platz für die Bildschirmtastatur
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                OutlinedTextField(
                    value = state.eingabe,
                    onValueChange = viewModel::onEingabe,
                    label = { Text("Neue Aufgabe") },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                    keyboardActions = KeyboardActions(onDone = { viewModel.hinzufuegen() }),
                    modifier = Modifier.weight(1f),
                )
                Spacer(Modifier.width(8.dp))
                Button(onClick = viewModel::hinzufuegen) { Text("Hinzufügen") }
            }
            Spacer(Modifier.height(8.dp))
            if (state.todos.isEmpty()) {
                Text("Noch keine Aufgaben.", style = MaterialTheme.typography.bodyMedium)
            }
            LazyColumn {
                items(state.todos, key = { it.id }) { todo ->
                    TodoZeile(
                        todo = todo,
                        onUmschalten = { viewModel.umschalten(todo.id) },
                        onLoeschen = { viewModel.loeschen(todo.id) },
                    )
                }
            }
        }
    }
}

@Composable
fun TodoZeile(todo: Todo, onUmschalten: () -> Unit, onLoeschen: () -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .clickable(onClick = onUmschalten)
            .padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Checkbox(checked = todo.done, onCheckedChange = { onUmschalten() })
        Text(
            todo.title,
            modifier = Modifier.weight(1f),
            textDecoration = if (todo.done) TextDecoration.LineThrough else null,
        )
        IconButton(onClick = onLoeschen) {
            Icon(Icons.Default.Delete, contentDescription = "„\${todo.title}“ löschen")
        }
    }
}
\`\`\`

Benötigte Abhängigkeiten (in \`libs.versions.toml\` bzw. \`build.gradle.kts\`, Versionen über den Android-Studio-Assistenten aktuell halten): \`androidx.lifecycle:lifecycle-viewmodel-compose\` für \`viewModel()\` und \`androidx.lifecycle:lifecycle-runtime-compose\` für \`collectAsStateWithLifecycle()\`.

> [!TIP] Warum collectAsStateWithLifecycle?
> Es sammelt den Flow nur, solange der Bildschirm mindestens im Zustand \`STARTED\` ist. Im Hintergrund wird keine Arbeit für eine unsichtbare Oberfläche verrichtet – das spart Akku.

Der Datenfluss ist jetzt **unidirektional**:

\`\`\`text
TodoViewModel ──(TodoUiState)──▶ TodoScreen
      ▲                              │
      └────(onEingabe, hinzufuegen, umschalten, loeschen)
\`\`\`

## 7. Material 3, Dark Mode und Barrierefreiheit

- Das Template-Theme nutzt **Material 3** und auf Android 12+ **Dynamic Color** (Farben aus dem Hintergrundbild). Dark Mode folgt automatisch der Systemeinstellung (\`isSystemInDarkTheme()\`).
- Schriftgrößen in **sp** angeben (Material-Typografie tut das) – sie folgen der in den Android-Einstellungen gewählten Schriftgröße.
- Touch-Ziele mindestens **48 × 48 dp**; Material-Komponenten halten das ein.
- \`contentDescription\` für Icons, die eine Funktion haben (wie der Löschen-Button oben) – TalkBack liest sie vor.

## 8. Auf dem eigenen Smartphone ausführen

1. **Entwickleroptionen** aktivieren: *Einstellungen → Telefoninfo → Softwareinformationen* → siebenmal auf **Buildnummer** tippen (Bezeichnungen variieren je nach Hersteller; bei Samsung genau dieser Pfad).
2. In den Entwickleroptionen **USB-Debugging** einschalten (oder **Wireless Debugging** für WLAN).
3. Gerät per USB verbinden und die Verbindung auf dem Gerät bestätigen.
4. In Android Studio das Gerät auswählen und ▶ drücken – oder im Terminal:

\`\`\`bash title="Bauen und installieren"
./gradlew installDebug          # Windows: gradlew.bat installDebug
adb devices                      # zeigt verbundene Geräte
adb logcat --pid=$(adb shell pidof -s de.beispiel.todo)   # Logausgaben der App
\`\`\`

Debug-Builds sind mit einem automatisch erzeugten Debug-Schlüssel signiert. Für die Veröffentlichung siehe [Deployment](#/artikel/mobile-deployment).

## 9. Wie geht es weiter?

| Thema | Artikel |
|---|---|
| Mehrere Bildschirme, Navigation, Architektur | [App-Architektur & Navigation](#/artikel/mobile-architektur-navigation) |
| Aufgaben dauerhaft speichern (Room), Daten aus einer API | [Lokale Daten & APIs](#/artikel/mobile-daten-api) |
| Tests, Sicherheit, Performance | [Sicherheit, Testing & Performance](#/artikel/mobile-sicherheit-testing) |
| Signieren und im Play Store veröffentlichen | [Deployment & Veröffentlichung](#/artikel/mobile-deployment) |

> [!TIP] Übungen
> 1. Zeige über der Liste „3 von 5 erledigt“ an. Berechne den Wert im Composable aus \`state.todos\` – nicht als eigenen Zustand.
> 2. Füge einen Filter (Alle / Offen / Erledigt) mit \`FilterChip\`s hinzu. Wohin gehört der ausgewählte Filter – ins ViewModel oder als \`rememberSaveable\`?
> 3. Drehe das Gerät, während Text im Eingabefeld steht. Bleibt er erhalten? Warum?

\`\`\`widget
quiz:Mobile 4
\`\`\`
`;export{e as default};
