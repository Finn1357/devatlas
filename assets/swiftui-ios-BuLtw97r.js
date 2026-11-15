const e=`---
id: swiftui-ios
title: Tutorial: iOS-Apps mit Swift und SwiftUI
area: mobile
difficulty: fortgeschritten
minutes: 24
order: 4
summary: Was man für iOS-Entwicklung braucht, Swift-Grundlagen für Umsteiger, der Aufbau einer SwiftUI-App, Views und Modifier, Zustand mit @State, @Binding und @Observable, Listen und Navigation mit NavigationStack, Netzwerkzugriffe mit async/await, Persistenz mit SwiftData und Tests.
tags: [iOS, Swift, SwiftUI, Observation, SwiftData, Xcode, Tutorial]
related: [mobile-entwicklung, android-kotlin-compose, flutter-dart, mobile-architektur-navigation, mobile-deployment]
---

## Voraussetzungen

Für native iOS-Entwicklung braucht man einen **Mac mit Xcode** (kostenlos im Mac App Store). Xcode enthält Compiler, SDKs und den iOS-Simulator. Zum Ausprobieren auf einem eigenen iPhone genügt eine kostenlose Apple-ID; für die Veröffentlichung im App Store ist das kostenpflichtige **Apple Developer Program** nötig (siehe [Deployment](#/artikel/mobile-deployment)).

> [!NOTE] Ohne Mac?
> Unter Windows oder Linux lassen sich iOS-Apps nicht nativ bauen. Plattformübergreifende Frameworks ([Flutter](#/artikel/flutter-dart), [React Native](#/artikel/react-native)) können den eigentlichen iOS-Build an Cloud-Dienste auslagern (z. B. Codemagic, EAS Build). Die Konzepte dieses Artikels lassen sich trotzdem lesen und auf Compose oder Flutter übertragen.

## Swift in Kürze

[Swift](#/sprachen/swift) ist statisch typisiert, sicher bei \`nil\` (Optionals) und unterscheidet **Werttypen** (\`struct\`, \`enum\`) von **Referenztypen** (\`class\`).

\`\`\`swift title="Swift-Grundlagen"
let name = "Ada"                 // Konstante
var zaehler = 0                  // Variable
var spitzname: String? = nil     // Optional: kann nil sein

if let s = spitzname {           // Optional sicher entpacken
    print("Hallo, \\(s)")
} else {
    print("Hallo, \\(name)")
}

struct Todo: Identifiable {      // Werttyp: wird beim Zuweisen kopiert
    let id = UUID()
    var titel: String
    var erledigt = false
}

var a = Todo(titel: "Swift lernen")
var b = a                        // Kopie!
b.erledigt = true
print(a.erledigt, b.erledigt)    // false true
\`\`\`

## Aufbau einer SwiftUI-App

In Xcode: *File → New → Project → iOS → App*, Interface **SwiftUI**, Sprache **Swift**.

\`\`\`swift title="TodoApp.swift"
import SwiftUI

@main
struct TodoApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
\`\`\`

SwiftUI ist **deklarativ** wie Jetpack Compose und Flutter: Eine \`View\` beschreibt mit ihrer Eigenschaft \`body\`, wie sie für den aktuellen Zustand aussieht. **Modifier** (\`.padding()\`, \`.font(...)\`, \`.foregroundStyle(...)\`) erzeugen jeweils eine neue, veränderte View – ihre Reihenfolge ist wichtig.

\`\`\`swift title="Views und Modifier"
struct Begruessung: View {
    let name: String
    var body: some View {
        VStack(spacing: 8) {                   // untereinander; HStack = nebeneinander, ZStack = übereinander
            Image(systemName: "hand.wave")
                .font(.largeTitle)
            Text("Hallo, \\(name)!")
                .font(.title2.bold())
        }
        .padding()
    }
}

#Preview {
    Begruessung(name: "Ada")
}
\`\`\`

## Zustand: @State, @Binding und @Observable

| Werkzeug | Zweck |
|---|---|
| \`@State\` | lokaler Zustand, den eine View besitzt (Werttypen oder ein beobachtbares Objekt) |
| \`@Binding\` | Lese- und Schreibzugriff auf Zustand, der einer anderen View gehört |
| \`@Observable\` (iOS 17+) | Klasse, deren Eigenschaften SwiftUI automatisch beobachtet |
| \`@Environment\` | Werte aus der Umgebung (Farbschema, Schriftgröße, eigene Objekte) |

\`\`\`swift title="TodoStore.swift"
import Observation

@Observable
final class TodoStore {
    var todos: [Todo] = []

    var offen: Int { todos.filter { !$0.erledigt }.count }

    func hinzufuegen(_ titel: String) {
        let t = titel.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !t.isEmpty else { return }
        todos.append(Todo(titel: t))
    }
}
\`\`\`

> [!EXPERT] Observation statt ObservableObject
> Seit iOS 17 ersetzt das Makro \`@Observable\` den älteren Weg mit \`ObservableObject\` und \`@Published\`. Vorteil: SwiftUI verfolgt, **welche Eigenschaften** eine View tatsächlich liest, und aktualisiert nur betroffene Views. Für iOS 16 und älter bleibt \`ObservableObject\` nötig.

## Die Todo-Liste

\`\`\`swift title="ContentView.swift"
import SwiftUI

struct ContentView: View {
    @State private var store = TodoStore()
    @State private var eingabe = ""

    var body: some View {
        NavigationStack {
            List {
                ForEach($store.todos) { $todo in              // Bindings auf die einzelnen Elemente
                    NavigationLink(value: todo.id) {
                        Toggle(todo.titel, isOn: $todo.erledigt)
                    }
                }
                .onDelete { store.todos.remove(atOffsets: $0) }   // Wischen zum Löschen
            }
            .navigationTitle("Aufgaben (\\(store.offen) offen)")
            .navigationDestination(for: UUID.self) { id in
                if let index = store.todos.firstIndex(where: { $0.id == id }) {
                    DetailView(todo: $store.todos[index])
                }
            }
            .safeAreaInset(edge: .bottom) {
                HStack {
                    TextField("Neue Aufgabe", text: $eingabe)
                        .textFieldStyle(.roundedBorder)
                        .onSubmit(hinzufuegen)
                    Button("Hinzufügen", action: hinzufuegen)
                        .buttonStyle(.borderedProminent)
                }
                .padding()
                .background(.bar)
            }
        }
    }

    private func hinzufuegen() {
        store.hinzufuegen(eingabe)
        eingabe = ""
    }
}

struct DetailView: View {
    @Binding var todo: Todo
    var body: some View {
        Form {
            TextField("Titel", text: $todo.titel)
            Toggle("Erledigt", isOn: $todo.erledigt)
        }
        .navigationTitle(todo.titel)
    }
}
\`\`\`

- **\`NavigationStack\`** mit \`navigationDestination(for:)\` ist die wertbasierte Navigation (iOS 16+): Links schieben einen Wert (hier die ID) auf den Stapel; die Zurück-Geste funktioniert automatisch.
- **\`safeAreaInset\`** platziert die Eingabezeile über dem Home-Indikator und hebt sie mit der Tastatur an.
- Änderungen in der \`DetailView\` wirken über das **Binding** direkt im Store.

## Netzwerk mit async/await

\`\`\`swift title="Beiträge laden"
struct Beitrag: Decodable, Identifiable {
    let id: Int
    let title: String
}

func ladeBeitraege() async throws -> [Beitrag] {
    let url = URL(string: "https://jsonplaceholder.typicode.com/posts")!
    let (daten, antwort) = try await URLSession.shared.data(from: url)
    guard let http = antwort as? HTTPURLResponse, http.statusCode == 200 else {
        throw URLError(.badServerResponse)
    }
    return try JSONDecoder().decode([Beitrag].self, from: daten)
}

struct BeitragsListe: View {
    @State private var beitraege: [Beitrag] = []
    @State private var fehler: String?

    var body: some View {
        List(beitraege) { Text($0.title) }
            .overlay { if let fehler { ContentUnavailableView("Fehler", systemImage: "wifi.slash", description: Text(fehler)) } }
            .task {                                   // startet beim Erscheinen, wird beim Verschwinden abgebrochen
                do { beitraege = try await ladeBeitraege() }
                catch { fehler = error.localizedDescription }
            }
            .refreshable { beitraege = (try? await ladeBeitraege()) ?? beitraege }   // Ziehen zum Aktualisieren
    }
}
\`\`\`

> [!WARNING] App Transport Security
> iOS erlaubt standardmäßig nur HTTPS-Verbindungen. Ausnahmen für HTTP müssen in der \`Info.plist\` ausdrücklich eingetragen werden – für Produktions-APIs sollte man das nicht tun.

## Daten speichern mit SwiftData

SwiftData (iOS 17+) speichert Modellklassen dauerhaft mit wenig Code:

\`\`\`swift title="Persistente Todos"
import SwiftData

@Model
final class GespeichertesTodo {
    var titel: String
    var erledigt: Bool
    var erstellt: Date

    init(titel: String, erledigt: Bool = false) {
        self.titel = titel
        self.erledigt = erledigt
        self.erstellt = .now
    }
}

// In der App: .modelContainer(for: GespeichertesTodo.self) an WindowGroup hängen
struct PersistenteListe: View {
    @Environment(\\.modelContext) private var context
    @Query(sort: \\GespeichertesTodo.erstellt) private var todos: [GespeichertesTodo]

    var body: some View {
        List(todos) { todo in Text(todo.titel) }
            .toolbar {
                Button("Neu") { context.insert(GespeichertesTodo(titel: "Aufgabe \\(todos.count + 1)")) }
            }
    }
}
\`\`\`

Für kleine Einstellungen gibt es \`@AppStorage\` (basierend auf \`UserDefaults\`); Geheimnisse wie Tokens gehören in die [[Keychain]] – siehe [Sicherheit](#/artikel/mobile-sicherheit-testing).

## Lebenszyklus und Systemintegration

\`\`\`swift title="Auf Vorder- und Hintergrund reagieren"
struct RootView: View {
    @Environment(\\.scenePhase) private var phase
    var body: some View {
        ContentView()
            .onChange(of: phase) { _, neu in
                if neu == .background { /* Zustand sichern, Timer stoppen */ }
            }
    }
}
\`\`\`

SwiftUI unterstützt automatisch **Dynamic Type** (Schriftgröße aus den Einstellungen), den **Dark Mode**, VoiceOver für Standard-Bedienelemente und die Safe Areas. Eigene Icons und Bilder brauchen \`accessibilityLabel\`.

## Testen

\`\`\`swift title="Unit-Test mit Swift Testing (Xcode 16+)"
import Testing
@testable import TodoApp

@Test func leereTitelWerdenIgnoriert() {
    let store = TodoStore()
    store.hinzufuegen("   ")
    #expect(store.todos.isEmpty)
    store.hinzufuegen("Milch")
    #expect(store.offen == 1)
}
\`\`\`

Daneben gibt es **XCTest** (ältere, weiterhin unterstützte Test-API) und **XCUITest** für Oberflächentests.

> [!TIP] Übungen
> 1. Ersetze den In-Memory-\`TodoStore\` durch SwiftData, sodass Aufgaben einen Neustart überstehen.
> 2. Füge einen \`Picker\` mit „Alle / Offen / Erledigt“ hinzu. Wo speicherst du die Auswahl?
> 3. Lies die Beiträge aus der Netzwerkübung nur einmal pro App-Start, auch wenn die View mehrfach erscheint.

\`\`\`widget
quiz:Mobile 3
\`\`\`
`;export{e as default};
