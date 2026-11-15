const e=`---
id: mobile-sicherheit-testing
title: App-Sicherheit, Testing und Performance mobiler Apps
area: mobile
difficulty: profi
minutes: 26
order: 8
summary: Sicherheitsanforderungen nach OWASP MASVS – sichere Speicherung, Netzwerk, Authentifizierung mit OAuth und PKCE, Berechtigungen, WebViews, Geheimnisse und Manipulationsschutz – sowie die Testpyramide mit Unit-, UI- und Gerätetests und Performance-Themen wie Startzeit, Ruckeln, Speicher, Akku und App-Größe.
tags: [App-Sicherheit, OWASP MASVS, OAuth, Testing, Performance, Jank, ANR, Mobile]
related: [mobile-daten-api, mobile-deployment, owasp-top-10, secure-development, testing, oauth-oidc]
---

## Teil 1: Sicherheit

Die Sicherheitslage einer App unterscheidet sich von der einer Website: Die App liegt **beim Angreifer auf dem Gerät**. Er kann sie dekompilieren, ihren Speicher lesen (auf gerooteten Geräten), Netzwerkverkehr umleiten und sie verändert neu verpacken. Daraus folgt der wichtigste Grundsatz:

> [!DANGER] Der Client ist nicht vertrauenswürdig
> Jede Prüfung, die wirklich zählt – Berechtigungen, Preise, Limits, Freischaltungen – muss auf dem **Server** stattfinden. Alles in der App kann umgangen werden.

Als Leitfaden dient der **OWASP MASVS** (Mobile Application Security Verification Standard) mit dem Prüfhandbuch MASTG. Seine Kategorien:

| Kategorie | Kernfrage |
|---|---|
| **STORAGE** | Werden sensible Daten sicher und sparsam gespeichert? |
| **CRYPTO** | Wird Kryptografie korrekt eingesetzt (keine eigenen Algorithmen, Schlüssel im Keystore)? |
| **AUTH** | Sind Anmeldung und Sitzungen sicher? |
| **NETWORK** | Ist die Kommunikation verschlüsselt und authentisch? |
| **PLATFORM** | Werden Plattformfunktionen (Intents, WebViews, Berechtigungen) sicher genutzt? |
| **CODE** | Ist der Code aktuell, sind Eingaben validiert? |
| **RESILIENCE** | Erschwert die App Analyse und Manipulation (wo nötig)? |
| **PRIVACY** | Werden nur nötige Daten erhoben, transparent und kontrollierbar? |

### Daten sicher speichern

- **So wenig wie möglich** speichern. Was nicht da ist, kann nicht gestohlen werden.
- Tokens im [[Android Keystore]] bzw. der [[Keychain]]; keine Passwörter speichern.
- Sensible Daten nicht in Logs (\`Log.d\`, \`print\`), nicht in Screenshots im App-Umschalter (Android: \`FLAG_SECURE\` für besonders sensible Bildschirme), nicht in die Zwischenablage.
- **Backups bedenken**: Android-Auto-Backup und iCloud-Backup kopieren App-Daten. Mit \`dataExtractionRules\` (Android) bzw. Keychain-Schutzklassen (\`…ThisDeviceOnly\`) steuern, was mitwandert.

### Netzwerk

- Nur **HTTPS** ([[TLS]]). Android blockiert Klartext seit API 28 standardmäßig; die **Network Security Config** sollte das nicht aufweichen. iOS erzwingt es per App Transport Security.
- **[[Certificate Pinning]]** nur mit Bedacht: Es schützt vor gefälschten Zertifikaten, legt die App aber lahm, wenn sich das Server-Zertifikat unerwartet ändert. Wenn, dann den öffentlichen Schlüssel pinnen, Reserve-Pins hinterlegen und ein Ablaufdatum setzen.

\`\`\`xml title="res/xml/network_security_config.xml – Pinning mit Reserve und Ablauf"
<network-security-config>
    <base-config cleartextTrafficPermitted="false" />
    <domain-config>
        <domain includeSubdomains="true">api.beispiel.de</domain>
        <pin-set expiration="2027-06-30">
            <pin digest="SHA-256">AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=</pin>  <!-- aktueller Schlüssel -->
            <pin digest="SHA-256">BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=</pin>  <!-- Reserve-Schlüssel -->
        </pin-set>
    </domain-config>
</network-security-config>
\`\`\`

(Die Pin-Werte sind Platzhalter – echte Werte sind Base64-kodierte SHA-256-Hashes des öffentlichen Schlüssels.)

### Authentifizierung

- Anmeldung über **[[OAuth]] 2.0 / OpenID Connect mit PKCE** im **System-Browser** (Android Custom Tabs, iOS \`ASWebAuthenticationSession\`), nicht in einer eingebetteten WebView – so sieht die App nie das Passwort, und der Nutzer erkennt die echte Anmeldeseite (Best Practice nach RFC 8252). Bibliotheken: AppAuth, Credential Manager (Android), \`AuthenticationServices\` (iOS).
- **Kurzlebige Access Tokens** und Refresh Tokens; Refresh Tokens sicher speichern und bei Abmeldung serverseitig widerrufen.
- **Passkeys** (FIDO2) über Credential Manager bzw. \`AuthenticationServices\` ersetzen Passwörter phishing-resistent.
- **Biometrie** (BiometricPrompt, Face ID) entsperrt lokal einen im Keystore gebundenen Schlüssel – sie ersetzt keine serverseitige Authentifizierung.

### Berechtigungen und Plattform

- **Nur nötige Berechtigungen**, erst im Moment der Nutzung erfragen und begründen. Viele Funktionen kommen ohne Berechtigung aus: Der **Photo Picker** (Android) bzw. \`PhotosPicker\` (iOS) liefert ausgewählte Bilder ohne Zugriff auf die ganze Galerie.
- Android-Komponenten nur exportieren, wenn nötig (\`android:exported\` ist seit Android 12 Pflichtangabe). Daten aus Intents und [[Deep Link|Deep Links]] wie Benutzereingaben validieren.
- **[[WebView|WebViews]]**: nur eigene Inhalte laden; JavaScript-Schnittstellen (\`addJavascriptInterface\`, Capacitor-Plugins) nie für fremde Seiten öffnen; Dateizugriff deaktivieren, wenn nicht nötig.

### Geheimnisse und Manipulationsschutz

> [!MISTAKE] API-Schlüssel in der App
> Ein Schlüssel im Code, in \`strings.xml\` oder in \`BuildConfig\` ist mit Werkzeugen wie \`apktool\` in Minuten ausgelesen – [[Obfuskierung]] verzögert das höchstens. Schlüssel für kostenpflichtige Dienste gehören auf einen eigenen Server, der Anfragen nach Prüfung weiterleitet.

- **R8** (Android) verkleinert und verschleiert Code; hilfreich gegen Gelegenheitsanalyse und für die App-Größe.
- **Play Integrity API** (Android) und **App Attest** (iOS) lassen den Server prüfen, ob eine Anfrage von einer unveränderten App auf einem echten Gerät stammt – sinnvoll gegen Bots und Betrug.
- Root- oder Jailbreak-Erkennung ist leicht zu umgehen und eignet sich nur als zusätzliches Signal.

## Teil 2: Testing

### Die Testpyramide für Apps

\`\`\`text title="Viele schnelle Tests unten, wenige teure oben"
            ▲  manuelle Tests auf echten Geräten (Größen, Schriftgrößen, Dark Mode, schwaches Netz)
           ▲▲  End-to-End-/UI-Tests auf Emulator oder Gerätefarm
         ▲▲▲▲  Integrationstests (Repository + echte Datenbank, API mit Mock-Server)
     ▲▲▲▲▲▲▲▲  Unit-Tests (ViewModel, Validierung, Formatierung, Mapping)
\`\`\`

| Ebene | Android | iOS | Flutter | React Native |
|---|---|---|---|---|
| Unit | JUnit, Turbine (Flows) | Swift Testing, XCTest | \`test\` | Jest |
| UI | Compose UI Test, Espresso | XCUITest | Widget-Tests, \`integration_test\` | React Native Testing Library |
| End-to-End | UI Automator, Maestro | XCUITest, Maestro | \`integration_test\`, Patrol | Detox, Maestro |

\`\`\`kotlin title="ViewModel per Unit-Test prüfen"
class TodoViewModelTest {
    @Test
    fun \`leere Eingabe fügt nichts hinzu\`() {
        val vm = TodoViewModel()
        vm.onEingabe("   ")
        vm.hinzufuegen()
        assertTrue(vm.state.value.todos.isEmpty())
    }
}
\`\`\`

\`\`\`kotlin title="Compose-UI-Test"
class TodoScreenTest {
    @get:Rule val compose = createComposeRule()

    @Test
    fun aufgabeErscheintNachHinzufuegen() {
        compose.setContent { TodoScreen(viewModel = TodoViewModel()) }
        compose.onNodeWithText("Neue Aufgabe").performTextInput("Milch kaufen")
        compose.onNodeWithText("Hinzufügen").performClick()
        compose.onNodeWithText("Milch kaufen").assertIsDisplayed()
    }
}
\`\`\`

Was man **zusätzlich** testen sollte, weil es bei Apps häufig schiefgeht:

- Drehen des Geräts und **Prozessende** im Hintergrund (Zustand bleibt erhalten?)
- **Schriftgröße 200 %** und Bildschirmlupe – nichts abgeschnitten?
- **Dark Mode** – Kontraste, Icons, Bilder?
- **Schwaches oder kein Netz** – verständliche Meldungen, keine Endlos-Spinner?
- **Kleine und große Bildschirme**, Querformat, Foldables
- **Updates**: alte Datenbankversion installieren, neue App darüber – bleiben Daten erhalten?
- **Screenreader** (TalkBack, VoiceOver) – alles bedienbar?

> [!NOTE] DevAtlas als Beispiel
> Die Web-Oberfläche dieser App wird automatisch in emulierten Viewport-Breiten von 320 bis 600 px auf horizontalen Überlauf, Touch-Zielgrößen, Offline-Betrieb und die Suchnavigation getestet (Playwright) – das ersetzt aber keinen Test auf echter Hardware.

## Teil 3: Performance

### Startzeit

| Start | Situation | Ziel |
|---|---|---|
| **Kaltstart** | Prozess existiert nicht | so schnell wie möglich; Android Vitals werten Starts über 5 s als „übermäßig langsam“ |
| **Warmstart** | Prozess existiert, Activity neu | schneller |
| **Heißstart** | App kommt aus dem Hintergrund | fast sofort |

Maßnahmen: wenig Arbeit in \`Application.onCreate\`, Initialisierung verzögern, große Datenmengen nicht beim Start laden. Auf Android beschleunigen **Baseline Profiles** den Start und die ersten Interaktionen, weil kritischer Code vorab kompiliert wird.

### Flüssige Darstellung

Bei 60 Hz bleiben pro Frame etwa **16,7 ms**, bei 120 Hz (wie auf vielen aktuellen Geräten, etwa dem Galaxy S24 Ultra) nur **8,3 ms**. Wer das überschreitet, verursacht [[Jank]].

- Lange Listen **virtualisieren** (\`LazyColumn\`, \`ListView.builder\`, \`FlatList\`) und stabile Schlüssel vergeben.
- **Bilder** in Anzeigegröße laden und dekodieren (Coil, Glide, \`cached_network_image\`), nie 12-Megapixel-Fotos für Vorschaubilder.
- Keine Datenbank-, Datei- oder Netzwerkzugriffe auf dem UI-Thread – sonst droht ein [[ANR]]. \`StrictMode\` meldet Verstöße in Debug-Builds.
- Unnötige Neuaufbauten vermeiden (stabile Parameter in Compose, \`const\` in Flutter, \`React.memo\` und stabile Callbacks in React Native).

### Speicher, Akku, Größe

- **Speicherlecks** (z. B. gehaltene Activity-Referenzen) findet LeakCanary (Android) bzw. Instruments (iOS).
- **Akku**: Netzwerkanfragen bündeln, Hintergrundarbeit über WorkManager/BackgroundTasks mit Bedingungen, Standort nur mit nötiger Genauigkeit, Animationen und Sensoren im Hintergrund stoppen. Auf AMOLED-Displays spart ein dunkles Design sichtbar Energie.
- **App-Größe**: R8 und Ressourcen-Shrinking, App Bundles (Geräte laden nur passende Ressourcen), Bilder als WebP oder Vektor.

### Messen statt raten

| Werkzeug | Plattform | Zweck |
|---|---|---|
| Android Studio Profiler, Perfetto | Android | CPU, Speicher, Frames, Systemspuren |
| Macrobenchmark | Android | Start und Scrollen automatisiert messen, Baseline Profiles erzeugen |
| Instruments | iOS | Time Profiler, Allocations, Leaks, Energy |
| Flutter DevTools | Flutter | Frame-Diagramm, Rebuilds, Speicher |
| React Native DevTools | React Native | Profiler, Konsole, Netzwerk |
| Play Console „Android Vitals“ | Android | Absturz- und ANR-Raten aus echten Geräten |

> [!TIP] Übungen
> 1. Prüfe eine eigene App mit dem OWASP-MASVS-Raster: Wo liegen Tokens, was steht in Logs, welche Berechtigungen fordert sie an und warum?
> 2. Schreibe einen UI-Test, der prüft, dass eine leere Eingabe keinen Listeneintrag erzeugt.
> 3. Miss mit dem Profiler die Frame-Zeiten beim Scrollen einer Liste mit 1.000 Einträgen – einmal mit \`Column\` + \`forEach\`, einmal mit \`LazyColumn\`.

\`\`\`widget
quiz:Mobile 4
\`\`\`
`;export{e as default};
