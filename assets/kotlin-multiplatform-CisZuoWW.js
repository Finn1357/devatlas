const e=`---
id: kotlin-multiplatform
title: Kotlin Multiplatform: Eine Logik für Android und iOS
area: mobile
difficulty: profi
minutes: 18
order: 10
summary: Geschäftslogik, Netzwerk und Datenbank einmal in Kotlin schreiben und sowohl in einer nativen Android- als auch iOS-App nutzen – bei komplett nativer Oberfläche. Projektstruktur, expect/actual, geteiltes ViewModel und wann sich der Ansatz lohnt.
tags: [Kotlin, KMP, Multiplatform, Android, iOS, Compose Multiplatform]
related: [android-kotlin-compose, swiftui-ios, mobile-architektur-navigation]
---

## Die Idee: teilen, was sich lohnt

Native Apps bedeuten doppelte Arbeit: dieselbe Login-Logik, dieselben API-Aufrufe, dieselben Validierungsregeln – einmal in [Kotlin für Android](#/artikel/android-kotlin-compose), einmal in [Swift für iOS](#/artikel/swiftui-ios). [[Kotlin Multiplatform]] (KMP) teilt genau diesen Teil: **Logik einmal in Kotlin**, Oberfläche weiterhin **nativ je Plattform**.

\`\`\`widget
layers:kmp-sharing
\`\`\`

Das ist der entscheidende Unterschied zu [Flutter](#/artikel/flutter-dart) oder [React Native](#/artikel/react-native): Dort wird auch die UI geteilt (und ist damit nicht vollständig nativ). KMP teilt bewusst nur die Schichten, bei denen sich das Teilen lohnt, und lässt die UI nativ – also SwiftUI auf iOS und Jetpack Compose auf Android.

> [!BEGINNER]
> Stell dir eine App als Haus vor: Das Fundament und die Leitungen (Logik, Daten) sind überall gleich und werden einmal gebaut. Fassade und Innenausbau (die Oberfläche) macht jede Plattform in ihrem eigenen Stil.

## Projektstruktur

Ein KMP-Modul teilt seinen Code in **Source Sets**. \`commonMain\` enthält den plattformunabhängigen Code; \`androidMain\` und \`iosMain\` ergänzen das Plattformspezifische.

\`\`\`text
shared/src/
├── commonMain/kotlin/   gemeinsame Logik: Modelle, Repository, Use-Cases, ViewModel
├── androidMain/kotlin/   Android-spezifische Umsetzungen (JVM-APIs)
└── iosMain/kotlin/       iOS-spezifische Umsetzungen (Kotlin/Native)
\`\`\`

\`\`\`kotlin title="shared/build.gradle.kts (Ausschnitt)"
kotlin {
  androidTarget()
  listOf(iosArm64(), iosSimulatorArm64()).forEach {
    it.binaries.framework { baseName = "Shared" }   // wird als Framework für Xcode gebaut
  }
  sourceSets {
    commonMain.dependencies {
      implementation("io.ktor:ktor-client-core:3.0.0")          // HTTP, plattformunabhängig
      implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.9.0")
    }
    androidMain.dependencies { implementation("io.ktor:ktor-client-okhttp:3.0.0") }
    iosMain.dependencies { implementation("io.ktor:ktor-client-darwin:3.0.0") }
  }
}
\`\`\`

Beachte: Der HTTP-Client ist in \`commonMain\` nur die abstrakte Schnittstelle; die **Engine** (OkHttp auf Android, Darwin/NSURLSession auf iOS) kommt je Plattform dazu. Dieses Muster – gemeinsame API, plattformspezifische Umsetzung – zieht sich durch KMP.

## expect/actual: plattformspezifisches im gemeinsamen Code

Manchmal braucht gemeinsamer Code etwas, das es nur plattformspezifisch gibt (sichere Ablage, Gerätename, Datum). Dafür gibt es [[expect/actual]]: Im \`commonMain\` erwartet man eine Deklaration, jede Plattform liefert sie.

\`\`\`kotlin title="commonMain/Platform.kt"
expect class SettingsStore() {
  fun putString(key: String, value: String)
  fun getString(key: String): String?
}
\`\`\`

\`\`\`kotlin title="androidMain/Platform.kt"
actual class SettingsStore {
  private val prefs = appContext.getSharedPreferences("app", Context.MODE_PRIVATE)
  actual fun putString(key: String, value: String) { prefs.edit().putString(key, value).apply() }
  actual fun getString(key: String) = prefs.getString(key, null)
}
\`\`\`

\`\`\`kotlin title="iosMain/Platform.kt"
actual class SettingsStore {
  actual fun putString(key: String, value: String) { NSUserDefaults.standardUserDefaults.setObject(value, key) }
  actual fun getString(key: String) = NSUserDefaults.standardUserDefaults.stringForKey(key)
}
\`\`\`

> [!TIP] Interface statt expect/actual
> \`expect/actual\` bindet fest an die Plattform. Oft ist ein **Interface im \`commonMain\` plus Dependency Injection** flexibler und testbarer: Im Test übergibt man eine In-Memory-Implementierung. Nutze \`expect/actual\` für echte Plattform-APIs, Interfaces für austauschbares Verhalten.

## Geteilte Logik: ein Repository und ein ViewModel

Der eigentliche Gewinn: Netzwerk, Parsing und Zustand liegen **einmal** in \`commonMain\`. Mit \`kotlinx.coroutines\` und einem \`StateFlow\` funktioniert sogar ein gemeinsames [ViewModel](#/artikel/mobile-architektur-navigation) für beide Plattformen.

\`\`\`kotlin title="commonMain/ProductRepository.kt"
class ProductRepository(private val client: HttpClient) {
  suspend fun ladeProdukte(): List<Product> =
    client.get("https://api.example.de/produkte").body()
}

class ProductViewModel(private val repo: ProductRepository) {
  private val _state = MutableStateFlow<UiState>(UiState.Loading)
  val state: StateFlow<UiState> = _state.asStateFlow()

  fun laden(scope: CoroutineScope) = scope.launch {
    _state.value = runCatching { UiState.Data(repo.ladeProdukte()) }
      .getOrElse { UiState.Error(it.message ?: "Fehler") }
  }
}
\`\`\`

Android beobachtet \`state\` direkt mit \`collectAsState()\` in Compose. iOS konsumiert dasselbe ViewModel über das generierte \`Shared\`-Framework.

## Wie iOS den gemeinsamen Code nutzt

Kotlin/Native kompiliert \`shared\` zu einem **Objective-C-kompatiblen Framework**, das Swift importiert:

\`\`\`swift title="iOS: ContentView.swift"
import Shared

struct ProductList: View {
  @StateObject private var model = ObservableProductModel()   // dünne Swift-Hülle um das KMP-ViewModel
  var body: some View {
    List(model.produkte, id: \\.id) { p in Text(p.name) }
      .task { model.laden() }
  }
}
\`\`\`

Die native UI (SwiftUI) bleibt vollständig in Swift – sie ruft nur die geteilte Logik auf. Für \`suspend\`-Funktionen und \`Flow\` erzeugt KMP Swift-freundliche Signaturen (mit \`completionHandler\` bzw. über Bibliotheken wie SKIE/KMP-NativeCoroutines für \`async/await\`).

## Optional: auch die UI teilen mit Compose Multiplatform

Wer sogar die Oberfläche teilen will, kann [[Compose Multiplatform]] nutzen – Jetpack Compose auf iOS, Desktop und Web. Der Preis: Die UI wird dann mit Skia gezeichnet statt mit nativen UIKit-Controls, was Bedienung, Look und Barrierefreiheit beeinflussen kann.

| Ansatz | UI | Typischer Code-Anteil geteilt |
|---|---|---|
| KMP (nur Logik) | nativ je Plattform | ~40–70 % (Logik, Daten, Netzwerk) |
| KMP + Compose Multiplatform | geteilt (Skia) | ~80–95 % |
| [Flutter](#/artikel/flutter-dart) / [React Native](#/artikel/react-native) | geteilt | ~90 % |

## Wann lohnt sich KMP – und wann nicht?

**Sinnvoll**, wenn du eine App bereits nativ auf beiden Plattformen baust (oder bauen willst), aber Logik-Dopplung vermeiden möchtest, und ein Team Kotlin kann. KMP lässt sich **schrittweise** in bestehende Apps einführen – erst ein Modul (z. B. Netzwerk) teilen.

**Weniger sinnvoll**, wenn eine Plattform klar im Fokus steht, das Team kein Kotlin kann, oder die App fast nur UI ist (dann teilt KMP wenig). Für reine Content-Apps kann auch eine [hybride Lösung](#/artikel/react-native) genügen.

> [!MISTAKE] KMP mit Flutter verwechseln
> KMP ist **kein UI-Framework** und kein direkter Flutter-Konkurrent. Es ersetzt nicht SwiftUI/Compose, sondern räumt darunter auf. Wer „eine Oberfläche für alle“ erwartet, meint Flutter/React Native oder Compose Multiplatform.

## Wie geht es weiter?

Vertiefe die native Grundlage auf beiden Seiten: [Android mit Compose](#/artikel/android-kotlin-compose) und [iOS mit SwiftUI](#/artikel/swiftui-ios). Die geteilte Architektur (ViewModel, Repository, Zustand) erklärt der Artikel zu [App-Architektur und Navigation](#/artikel/mobile-architektur-navigation).
`;export{e as default};
