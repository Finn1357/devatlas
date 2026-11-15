const e=`---
id: mobile-architektur-navigation
title: App-Architektur, Navigation und Lebenszyklus mobiler Apps
area: mobile
difficulty: fortgeschritten
minutes: 22
order: 6
summary: Schichtenarchitektur mit UI, State Holder und Datenschicht, unidirektionaler Datenfluss und Single Source of Truth, Dependency Injection, Navigationsmuster (Stack, Tabs, Modals), Zurück-Verhalten und Predictive Back, Deep Links und App Links, Zustandserhalt bei Prozessende, Lebenszyklen im Plattformvergleich sowie Bildschirmgrößen, Insets und Barrierefreiheit.
tags: [Architektur, MVVM, Navigation, Lebenszyklus, Deep Links, Edge-to-Edge, Mobile]
related: [android-kotlin-compose, flutter-dart, swiftui-ios, react-native, mobile-daten-api, clean-code-solid]
---

## Warum Architektur auf dem Smartphone besonders zählt

Mobile Apps leben in einer feindseligen Umgebung: Das System kann sie jederzeit pausieren oder **beenden**, das Netz bricht weg, das Gerät wird gedreht, Schriftgrößen ändern sich, und Nutzer wechseln mitten im Vorgang die App. Eine gute Architektur sorgt dafür, dass die App in all diesen Fällen **vorhersehbar** bleibt – und dass sich Logik ohne Oberfläche testen lässt.

## Die empfohlene Schichtung

Googles Architekturleitfaden für Android, aber sinngemäß auch SwiftUI- und Flutter-Projekte, trennen drei Schichten:

\`\`\`text title="Schichten einer App"
┌─────────────────────────────────────────────┐
│ UI-Schicht                                   │
│  Composables / SwiftUI-Views / Widgets       │  zeigen Zustand, melden Ereignisse
│  State Holder (ViewModel)                    │  hält UI-Zustand, verarbeitet Ereignisse
├─────────────────────────────────────────────┤
│ Domain-Schicht (optional)                    │  wiederverwendbare Geschäftslogik (Use Cases)
├─────────────────────────────────────────────┤
│ Datenschicht                                 │
│  Repositories                                │  eine Quelle der Wahrheit pro Datenart
│  Datenquellen: lokale DB, Netzwerk, Sensoren │
└─────────────────────────────────────────────┘
\`\`\`

| Prinzip | Bedeutung |
|---|---|
| **[[Unidirektionaler Datenfluss]]** | Zustand fließt nach unten in die UI, Ereignisse fließen nach oben |
| **Single Source of Truth** | Jede Datenart hat genau einen Besitzer (meist das [[Repository-Muster|Repository]] mit lokaler DB) |
| **UI ist eine Funktion des Zustands** | \`UI = f(State)\` – kein Zustand, der nur in Widgets „versteckt“ ist |
| **Abhängigkeiten nach innen** | UI kennt ViewModel, ViewModel kennt Repository – nie umgekehrt |

### Der UI-Zustand als ein Objekt

Statt vieler einzelner Variablen modelliert man den Zustand eines Bildschirms als **unveränderliches Objekt** – oft mit klaren Fällen für Laden, Fehler und Daten:

\`\`\`kotlin title="UI-Zustand modellieren (Kotlin)"
sealed interface TodoListUiState {
    data object Laden : TodoListUiState
    data class Fehler(val nachricht: String, val erneutVersuchen: Boolean) : TodoListUiState
    data class Daten(val todos: List<Todo>, val filter: Filter, val synchronisiert: Boolean) : TodoListUiState
}
\`\`\`

So kann die Oberfläche nicht gleichzeitig „lädt“ und „Fehler“ anzeigen – unmögliche Zustände sind gar nicht darstellbar. In Swift erreicht man dasselbe mit einem \`enum\` mit assoziierten Werten, in Dart mit \`sealed class\`.

### Dependency Injection

Ein ViewModel sollte sein Repository nicht selbst erzeugen, sondern **übergeben bekommen**. Dann lässt es sich im Test mit einer Fake-Implementierung prüfen.

| Plattform | Übliche Lösung |
|---|---|
| Android | Hilt (auf Dagger basierend) oder Koin; einfach: manuelle Übergabe über eine \`AppContainer\`-Klasse |
| iOS | Initialisierer-Injektion, \`@Environment\` für app-weite Objekte |
| Flutter | Riverpod-Provider, \`get_it\` |
| React Native | React Context, Props |

## Navigation

### Muster

| Muster | Wann? | Beispiel |
|---|---|---|
| **Stack** (Vor/Zurück) | Hierarchie: Liste → Detail → Bearbeiten | fast jede App |
| **Bottom Navigation / Tab Bar** | 3–5 gleichrangige Hauptbereiche | Start, Suche, Profil |
| **Navigation Drawer** | viele Bereiche, seltener gewechselt | Einstellungen, Hilfe |
| **Modal / Bottom Sheet** | abgeschlossene Teilaufgabe | Filter, „Neue Aufgabe“ |

> [!TIP] Jeder Tab hat seinen eigenen Stack
> Wechselt man zwischen Tabs, erwarten Nutzer, dass jeder Bereich seinen Verlauf behält. Material-Richtlinien und Apples Human Interface Guidelines beschreiben dieses Verhalten; Navigationsbibliotheken unterstützen es (Navigation Compose mit \`saveState\`/\`restoreState\`, mehrere \`NavigationStack\`s in einer \`TabView\`).

### Navigation in Compose (typsicher)

\`\`\`kotlin title="Navigation Compose mit typsicheren Routen (ab Version 2.8)"
@Serializable object TodoListe
@Serializable data class TodoDetail(val id: Long)

@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    NavHost(navController, startDestination = TodoListe) {
        composable<TodoListe> {
            TodoListScreen(onOeffnen = { id -> navController.navigate(TodoDetail(id)) })
        }
        composable<TodoDetail> { eintrag ->
            val ziel: TodoDetail = eintrag.toRoute()
            TodoDetailScreen(id = ziel.id, onZurueck = { navController.popBackStack() })
        }
    }
}
\`\`\`

Übergeben werden **IDs**, nicht ganze Objekte: Die Zielseite lädt die Daten selbst aus dem Repository. So bleibt die Navigation auch nach einem Prozessende oder über einen Deep Link korrekt.

### Zurück-Verhalten und Predictive Back

- **Android**: Die Zurück-Taste bzw. -Geste geht im Stack zurück; auf der Startseite verlässt sie die App. Eigene Logik (z. B. „Ungespeicherte Änderungen verwerfen?“) registriert man über \`OnBackPressedDispatcher\` bzw. \`BackHandler { … }\` in Compose. Das Überschreiben von \`onBackPressed()\` ist seit Android 13 veraltet.
- **Predictive Back**: Seit Android 13 vorbereitet und in neueren Versionen mit Systemanimationen sichtbar – die Geste zeigt eine Vorschau des Ziels. Apps müssen Zurück-Logik deshalb **vorher** anmelden statt erst im Moment des Tastendrucks zu entscheiden.
- **iOS**: Wischen vom linken Rand geht zurück; es gibt keine systemweite Zurück-Taste. Modale Ansichten brauchen eine sichtbare „Fertig“/„Abbrechen“-Schaltfläche.

> [!NOTE] Beispiel DevAtlas
> In der Android-App von DevAtlas schließt die Zurück-Taste zuerst ein geöffnetes Menü oder einen Dialog, geht dann im Verlauf zurück (mit wiederhergestellter Scrollposition) und minimiert die App auf der Startseite.

### Deep Links, App Links und Universal Links

Ein [[Deep Link]] öffnet direkt einen bestimmten Bildschirm, etwa \`https://beispiel.de/todo/42\`.

| Plattform | Verifizierte Web-Links | Nachweis auf der Website |
|---|---|---|
| Android | **App Links** (\`autoVerify\` im Intent-Filter) | \`/.well-known/assetlinks.json\` |
| iOS | **Universal Links** (Associated Domains) | \`/.well-known/apple-app-site-association\` |

Deep-Link-Parameter sind **Benutzereingaben**: Die App muss sie validieren und Berechtigungen prüfen, als kämen sie aus einem Formular.

## Lebenszyklus und Zustandserhalt

### Lebenszyklen im Vergleich

| Situation | Android | iOS (SwiftUI) | Flutter | React Native |
|---|---|---|---|---|
| sichtbar und aktiv | \`onResume\` / \`RESUMED\` | \`scenePhase == .active\` | \`AppLifecycleState.resumed\` | \`AppState\` \`active\` |
| verdeckt, z. B. Benachrichtigungsleiste | \`onPause\` | \`.inactive\` | \`inactive\` | \`inactive\` (iOS) |
| im Hintergrund | \`onStop\` | \`.background\` | \`hidden\` → \`paused\` | \`background\` |

### Prozessende überstehen

Im Hintergrund kann das System den App-Prozess beenden, ohne dass die App benachrichtigt wird. Kehrt der Nutzer zurück, startet die App neu – und soll trotzdem **dort weitermachen, wo er war**.

| Was | Wo speichern |
|---|---|
| Navigationsstapel, Eingaben in Formularen, Scrollposition | \`rememberSaveable\` / \`SavedStateHandle\` (Android), \`@SceneStorage\` (iOS), \`RestorationMixin\` (Flutter) |
| Fachliche Daten (Aufgaben, Notizen) | lokale Datenbank – sofort beim Ändern, nicht erst beim Schließen |
| Lange Hintergrundarbeit (Upload, Synchronisation) | \`WorkManager\` (Android), \`BackgroundTasks\` (iOS) |

> [!MISTAKE] Erst in onDestroy speichern
> \`onDestroy\` wird bei einem Prozessende durch das System **nicht** aufgerufen. Daten spätestens in \`onStop\` bzw. beim Wechsel in den Hintergrund sichern – besser sofort bei jeder Änderung.

**Testen:** In den Entwickleroptionen „Aktivitäten nicht speichern“ aktivieren oder per \`adb shell am kill <paketname>\` den Prozess im Hintergrund beenden und zur App zurückkehren.

## Bildschirme, Insets und Barrierefreiheit

- **[[Edge-to-Edge]]**: Apps zeichnen hinter Status- und Navigationsleiste. Inhalte brauchen Abstand zu Kamera-Ausschnitt, Statusleiste und Gestenleiste (Insets bzw. Safe Area). Web-Inhalte nutzen \`viewport-fit=cover\` und \`env(safe-area-inset-*)\`.
- **Größenklassen**: Android unterscheidet Fensterbreiten *compact* (< 600 dp), *medium* (600–840 dp) und *expanded* (≥ 840 dp). Ab *medium* bieten sich Navigation Rail und zweispaltige Layouts an – wichtig für Tablets, Foldables und Querformat.
- **Pixeldichte**: Größen in **dp** (Android) bzw. Punkten (iOS) angeben, nie in Pixeln. Ein Galaxy S24 Ultra hat eine sehr hohe Dichte; 48 dp sind dort physisch genauso groß wie auf einem einfachen Gerät.
- **Schriftgröße**: Systemeinstellung respektieren (\`sp\`, Dynamic Type). Layouts mit 200 % Schriftgröße testen – Texte dürfen umbrechen, aber nicht abgeschnitten werden.
- **Touch-Ziele** mindestens 48 × 48 dp (Android) bzw. 44 × 44 pt (iOS).
- **Tastatur**: Eingabefelder dürfen nicht von der Bildschirmtastatur verdeckt werden (\`imePadding()\`, \`windowSoftInputMode="adjustResize"\`, \`safeAreaInset\`).
- **Screenreader**: TalkBack bzw. VoiceOver brauchen Beschriftungen für Icons und sinnvolle Gruppierungen. Mehr in [Barrierefreiheit](#/artikel/barrierefreiheit).

> [!TIP] Übungen
> 1. Modelliere den Zustand eines Login-Bildschirms als \`sealed interface\` mit den Fällen Eingabe, Laden, Fehler und Erfolg.
> 2. Deine App zeigt nach dem Prozessende eine leere Detailseite. Woran liegt das vermutlich, und wie behebst du es?
> 3. Entwirf die Navigation für eine Fitness-App: Welche Bereiche kommen in die Bottom Navigation, was wird als Stack, was als Bottom Sheet umgesetzt?

\`\`\`widget
quiz:Mobile 3
\`\`\`
`;export{e as default};
