const e=`---
id: mobile-daten-api
title: Lokale Datenspeicherung und API-Kommunikation in mobilen Apps
area: mobile
difficulty: fortgeschritten
minutes: 22
order: 7
summary: Welche Speicher es auf Android, iOS, Flutter und React Native gibt und wofür, Room als Beispiel für eine lokale Datenbank, Offline-First mit Repository, robuste Netzwerkzugriffe mit Timeouts, Wiederholungen und Fehlerzuständen, Pagination, Synchronisation und Konflikte sowie Hintergrundarbeit mit WorkManager.
tags: [Room, SQLite, Offline-First, Repository, Ktor, Synchronisation, WorkManager, Mobile]
related: [mobile-architektur-navigation, android-kotlin-compose, mobile-sicherheit-testing, rest-api-design, caching-queues]
---

## Welcher Speicher wofür?

| Art der Daten | Android | iOS | Flutter | React Native |
|---|---|---|---|---|
| kleine Einstellungen (Theme, Sprache) | DataStore (Preferences) | \`UserDefaults\` / \`@AppStorage\` | \`shared_preferences\` | AsyncStorage |
| strukturierte Daten, Abfragen | Room (SQLite) | SwiftData / Core Data | drift, sqflite | expo-sqlite |
| Dateien (Bilder, Exporte) | interner App-Speicher | App-Container (Documents, Caches) | \`path_provider\` | expo-file-system |
| Geheimnisse (Tokens, Schlüssel) | [[Android Keystore]] | [[Keychain]] | \`flutter_secure_storage\` | expo-secure-store |

> [!WARNING] Keine Geheimnisse in Einstellungen
> SharedPreferences, \`UserDefaults\` und AsyncStorage sind **unverschlüsselte** Dateien in der App-Sandbox. Auf gerooteten Geräten, in Backups oder bei Fehlkonfigurationen sind sie lesbar. Tokens gehören in Keystore bzw. Keychain. Die frühere Android-Empfehlung \`EncryptedSharedPreferences\` (Jetpack Security) ist inzwischen als veraltet markiert; stattdessen Schlüssel im Android Keystore verwalten und Daten z. B. mit Tink verschlüsseln oder plattformfertige Wrapper nutzen.

## Room: eine lokale Datenbank für Android

Room ist eine Abstraktion über SQLite, die SQL-Abfragen beim Kompilieren prüft und Ergebnisse als \`Flow\` liefert – die Oberfläche aktualisiert sich automatisch, wenn sich Daten ändern.

\`\`\`kotlin title="Entity, DAO und Datenbank"
@Entity(tableName = "todos")
data class TodoEntity(
    @PrimaryKey val id: String,                 // UUID: auch offline eindeutig erzeugbar
    val titel: String,
    val erledigt: Boolean = false,
    val geaendertAm: Long = System.currentTimeMillis(),
    val synchronisiert: Boolean = false,        // lokale Änderung noch nicht beim Server?
)

@Dao
interface TodoDao {
    @Query("SELECT * FROM todos ORDER BY geaendertAm DESC")
    fun beobachteAlle(): Flow<List<TodoEntity>>

    @Query("SELECT * FROM todos WHERE synchronisiert = 0")
    suspend fun unsynchronisierte(): List<TodoEntity>

    @Upsert
    suspend fun speichern(todo: TodoEntity)

    @Upsert
    suspend fun speichernAlle(todos: List<TodoEntity>)
}

@Database(entities = [TodoEntity::class], version = 1)
abstract class AppDatenbank : RoomDatabase() {
    abstract fun todoDao(): TodoDao
}

// einmal pro App erzeugen (z. B. in einer Application-Klasse oder per Dependency Injection)
val db = Room.databaseBuilder(context, AppDatenbank::class.java, "todo.db").build()
\`\`\`

> [!EXPERT] Schema-Migrationen
> Ändert sich die Tabellenstruktur, muss die \`version\` steigen und eine **Migration** angegeben werden – sonst stürzt die App beim Update ab oder (mit \`fallbackToDestructiveMigration()\`) verliert alle Daten. Room unterstützt automatische Migrationen für einfache Fälle und exportiert Schemas zum Testen. Dasselbe Problem stellt sich in jeder App mit lokalem Speicher; DevAtlas versioniert seinen Lernstand ebenfalls und migriert alte Formate beim Start.

## Offline-First mit einem Repository

Bei [[Offline-First]] ist die **lokale Datenbank die einzige Quelle der Wahrheit** für die Oberfläche. Das Netz aktualisiert die Datenbank im Hintergrund:

\`\`\`text title="Datenfluss Offline-First"
UI ◀── Flow ── Room ◀── speichern ── Repository ── refresh() ──▶ API
                 ▲                                        │
                 └──── lokale Änderung sofort ◀───────────┘ (später synchronisieren)
\`\`\`

\`\`\`kotlin title="TodoRepository.kt"
class TodoRepository(
    private val dao: TodoDao,
    private val api: TodoApi,
) {
    // Die Oberfläche liest NUR aus der Datenbank
    val todos: Flow<List<TodoEntity>> = dao.beobachteAlle()

    // Lokale Änderung: sofort speichern, als „nicht synchronisiert“ markieren
    suspend fun umschalten(todo: TodoEntity) {
        dao.speichern(todo.copy(erledigt = !todo.erledigt, geaendertAm = System.currentTimeMillis(), synchronisiert = false))
    }

    // Server-Stand holen und lokal ablegen
    suspend fun aktualisieren() {
        val remote = api.ladeTodos()
        dao.speichernAlle(remote.map { it.alsEntity(synchronisiert = true) })
    }

    // ausstehende lokale Änderungen hochladen
    suspend fun synchronisieren() {
        for (todo in dao.unsynchronisierte()) {
            api.speichere(todo.alsDto())
            dao.speichern(todo.copy(synchronisiert = true))
        }
    }
}
\`\`\`

Vorteile: Die App startet sofort mit Daten, funktioniert im Funkloch und zeigt nie einen leeren Bildschirm nur wegen eines Timeouts. Der Preis ist die Frage nach **Konflikten** (siehe unten).

## API-Kommunikation

### Ein HTTP-Client mit Timeouts

\`\`\`kotlin title="Ktor-Client mit JSON und Zeitlimits"
@Serializable
data class TodoDto(val id: String, val titel: String, val erledigt: Boolean, val geaendertAm: Long)

class TodoApi(private val basisUrl: String) {
    private val client = HttpClient(OkHttp) {
        install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) }  // neue Server-Felder brechen die App nicht
        install(HttpTimeout) {
            connectTimeoutMillis = 5_000
            requestTimeoutMillis = 15_000
        }
        expectSuccess = true      // Statuscodes ≥ 300 als Exception
    }

    suspend fun ladeTodos(): List<TodoDto> = client.get("$basisUrl/todos").body()

    suspend fun speichere(todo: TodoDto) {
        client.put("$basisUrl/todos/\${todo.id}") {
            contentType(ContentType.Application.Json)
            setBody(todo)
        }
    }
}
\`\`\`

Alternativen: **Retrofit** (Android, deklarative Interfaces), **URLSession** (iOS, siehe [SwiftUI-Tutorial](#/artikel/swiftui-ios)), **http**/**dio** (Flutter), **fetch** mit TanStack Query (React Native). Die Prinzipien sind überall gleich:

| Prinzip | Umsetzung |
|---|---|
| **Zeitlimits** | Verbindungs- und Gesamt-[[Timeout]] setzen – Standardwerte sind oft zu lang oder unbegrenzt |
| **Nicht auf dem UI-Thread** | Coroutines mit \`Dispatchers.IO\`, \`async/await\`; sonst droht ein [[ANR]] |
| **Abbruch** | Anfragen an den Lebenszyklus binden (\`viewModelScope\`, \`.task {}\` in SwiftUI) |
| **Wiederholen mit Bedacht** | nur bei Netzwerkfehlern und 5xx, mit [[Exponential Backoff]]; schreibende Anfragen idempotent machen ([[Idempotenz]]) |
| **Tolerantes Parsen** | unbekannte Felder ignorieren, damit neue Server-Versionen alte Apps nicht brechen |
| **Fehler unterscheiden** | offline, Timeout, 401 (neu anmelden), 4xx (Eingabe), 5xx (später erneut) |
| **Nur HTTPS** | Klartext-HTTP ist auf Android (ab API 28) und iOS standardmäßig gesperrt |

> [!TIP] Anfragen vorher ausprobieren
> Statuscodes, Header und JSON-Bodys lassen sich im [HTTP-Request-Builder](#/labor/http) testen – mit einer lokalen Übungs-API, die auch 401, 404, 422 und 429 liefert.

### Lade- und Fehlerzustände in der Oberfläche

Jede Netzwerkanfrage hat mindestens drei Ausgänge – die Oberfläche muss alle darstellen: **Laden** (Fortschrittsanzeige, besser: vorhandene Daten weiter zeigen), **Erfolg**, **Fehler** (verständliche Meldung und „Erneut versuchen“). Bei Offline-First zeigt man zusätzlich an, ob Daten **veraltet** oder Änderungen **noch nicht synchronisiert** sind.

> [!MISTAKE] „Bin ich online?“ vorab prüfen
> Ein Verbindungscheck vor jeder Anfrage ist unzuverlässig: Das Gerät kann mit einem WLAN ohne Internet verbunden sein, oder das Netz bricht direkt nach dem Check weg. Besser: Anfrage einfach senden, Fehler sauber behandeln und Netzwerkstatus nur als Hinweis anzeigen.

### Pagination

Lange Listen lädt man seitenweise. **Cursor-basierte** Pagination (\`?after=abc123&limit=50\`) ist robuster als Seitennummern, weil neu eingefügte Einträge keine Duplikate oder Lücken verursachen. Auf Android übernimmt die Bibliothek **Paging 3** das Nachladen beim Scrollen, inklusive Kombination aus Datenbank-Cache und Netzwerk (\`RemoteMediator\`).

## Synchronisation und Konflikte

Ändert ein Nutzer dieselbe Aufgabe offline auf dem Handy und gleichzeitig im Browser, entsteht ein **Konflikt**. Strategien:

| Strategie | Funktionsweise | Geeignet für |
|---|---|---|
| **Last Write Wins** | der Zeitstempel entscheidet | einfache Daten, Konflikte selten und unkritisch |
| **Versionsnummern** | Server lehnt Änderungen an veralteten Versionen ab (HTTP \`412\` bzw. \`409\`), Client fragt nach | wichtige Daten, z. B. Formulare |
| **Feldweises Zusammenführen** | nur geänderte Felder übernehmen | Profile, Einstellungen |
| **CRDTs** | mathematisch konfliktfreie Datenstrukturen | kollaborative Editoren, Notizen |

Für die Auslieferung lokaler Änderungen bewährt sich eine **Warteschlange** (ähnlich dem [[Outbox-Muster]]): Jede Änderung wird zuerst lokal gespeichert und als „ausstehend“ markiert; ein Synchronisationsjob arbeitet die Liste ab, sobald Netz verfügbar ist.

## Hintergrundarbeit

Apps dürfen im Hintergrund nicht beliebig laufen – Android und iOS beschränken das zum Schutz des Akkus stark.

\`\`\`kotlin title="Synchronisation mit WorkManager planen"
class SyncWorker(context: Context, params: WorkerParameters) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result = try {
        repository.synchronisieren()
        Result.success()
    } catch (e: IOException) {
        Result.retry()                 // WorkManager wiederholt mit Backoff
    }
}

val anfrage = PeriodicWorkRequestBuilder<SyncWorker>(1, TimeUnit.HOURS)
    .setConstraints(Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build())
    .build()
WorkManager.getInstance(context).enqueueUniquePeriodicWork("sync", ExistingPeriodicWorkPolicy.KEEP, anfrage)
\`\`\`

WorkManager führt Arbeit **garantiert** aus, auch nach einem Neustart des Geräts, und respektiert Bedingungen wie „nur mit Netz“ oder „nur beim Laden“. Das kürzeste Intervall für periodische Arbeit beträgt 15 Minuten. Auf iOS übernimmt das Framework **BackgroundTasks** eine ähnliche Rolle – mit noch weniger Garantien, wann das System die Aufgabe tatsächlich ausführt. Für Echtzeit-Updates sind [[Push-Benachrichtigung|Push-Nachrichten]] der richtige Weg.

> [!TIP] Übungen
> 1. Erweitere \`TodoEntity\` um ein Feld \`faellig: Long?\`. Welche Änderungen sind in Room nötig, damit bestehende Nutzer ihre Daten behalten?
> 2. Entwirf die Fehlermeldungen für: kein Netz, Timeout, 401, 422 (Titel zu lang), 503. Welche bieten „Erneut versuchen“ an?
> 3. Zwei Geräte ändern dasselbe Todo offline. Simuliere auf Papier, was bei „Last Write Wins“ mit Gerätezeitstempeln passiert, wenn die Uhr eines Geräts zehn Minuten nachgeht.

\`\`\`widget
quiz:Mobile 3
\`\`\`
`;export{e as default};
