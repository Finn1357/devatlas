const e=`---
id: mobile-deployment
title: Deployment und Veröffentlichung: Signieren, APK/AAB, Google Play, App Store und CI/CD
area: mobile
difficulty: fortgeschritten
minutes: 22
order: 9
summary: Wie Apps signiert werden und warum der Schlüssel so wichtig ist, APK vs. Android App Bundle, Versionierung, Google Play mit Testspuren und gestaffelten Rollouts, App Store mit TestFlight und Review, Datenschutzangaben, Sideloading, Automatisierung mit fastlane und CI sowie eine Release-Checkliste.
tags: [Deployment, Code Signing, APK, AAB, Google Play, App Store, TestFlight, fastlane, CI/CD]
related: [mobile-sicherheit-testing, android-kotlin-compose, flutter-dart, react-native, ci-cd]
---

## Signieren: der wichtigste Schritt

Jede Android- und iOS-App wird **digital signiert** ([[Code Signing]]). Die Signatur beweist, von wem die App stammt, und dass sie seit dem Signieren nicht verändert wurde. Für Android gilt zusätzlich: **Ein Update wird nur installiert, wenn es mit demselben Schlüssel signiert ist** wie die bereits installierte Version.

### Android: Keystore erstellen

\`\`\`bash title="Upload- bzw. Release-Schlüssel erzeugen (keytool gehört zum JDK)"
keytool -genkeypair -v \\
  -keystore ~/schluessel/meine-app-upload.jks \\
  -keyalg RSA -keysize 2048 -validity 10000 \\
  -alias upload
\`\`\`

\`keytool\` fragt Passwort und Angaben zum Zertifikat ab. Danach gilt:

> [!DANGER] Schlüssel schützen und sichern
> - **Niemals ins Repository einchecken** – weder die \`.jks\`-Datei noch Passwörter. In \`.gitignore\` aufnehmen.
> - **Sicher sichern** (Passwortmanager, verschlüsseltes Backup an zwei Orten). Geht der Schlüssel verloren, kannst du ohne Play App Signing **keine Updates** mehr für die App veröffentlichen.
> - In CI-Systemen als geschütztes Secret hinterlegen (z. B. Base64-kodiert) und nur im Release-Job entschlüsseln.

Gradle liest die Signaturdaten aus einer nicht eingecheckten Datei oder aus Umgebungsvariablen:

\`\`\`properties title="android/keystore.properties (nicht einchecken!)"
storeFile=C:/Users/name/schluessel/meine-app-upload.jks
storePassword=…
keyAlias=upload
keyPassword=…
\`\`\`

\`\`\`groovy title="app/build.gradle (Ausschnitt)"
def props = new Properties()
def f = rootProject.file('keystore.properties')
if (f.exists()) f.withInputStream { props.load(it) }

android {
    signingConfigs {
        release {
            storeFile file(props['storeFile'])
            storePassword props['storePassword']
            keyAlias props['keyAlias']
            keyPassword props['keyPassword']
        }
    }
    buildTypes {
        release { signingConfig signingConfigs.release }
    }
}
\`\`\`

### Play App Signing

Bei Google Play ist heute **Play App Signing** üblich: Google verwahrt den eigentlichen **App-Signaturschlüssel** und signiert die ausgelieferten APKs. Du signierst Uploads mit deinem **Upload-Schlüssel**. Geht der Upload-Schlüssel verloren, kann er über den Play-Support zurückgesetzt werden – die App bleibt aktualisierbar.

## APK oder AAB?

| | APK | [[Android App Bundle|AAB (Android App Bundle)]] |
|---|---|---|
| Installierbar | direkt auf dem Gerät | nein – Google Play erzeugt daraus APKs |
| Inhalt | alle Ressourcen für alle Geräte | Play liefert pro Gerät nur passende Teile (Sprache, Dichte, CPU) |
| Einsatz | Tests, Verteilung außerhalb von Play (Sideloading) | Pflicht für neue Apps in Google Play (seit August 2021) |

Debug-APKs sind mit einem automatisch erzeugten **Debug-Schlüssel** signiert, nicht optimiert und debugbar – nur für Entwicklung und Tests.

### Installation außerhalb des Play Stores

1. APK auf das Gerät übertragen (USB, Cloud-Speicher, Download).
2. Beim Öffnen fragt Android, ob die Quelle (z. B. „Eigene Dateien“ oder der Browser) Apps installieren darf: **„Unbekannte Apps installieren“** für diese Quelle erlauben.
3. Google Play Protect prüft die App und warnt ggf. bei unbekannten Entwicklern.

Für Entwickler geht es auch per Kabel: \`adb install app-release.apk\`. Google hat zudem eine **Entwicklerverifizierung** auch für Apps außerhalb des Play Stores angekündigt, die schrittweise eingeführt wird – vor der Verteilung an andere Nutzer den aktuellen Stand prüfen.

## Versionierung

| | Android | iOS | Bedeutung |
|---|---|---|---|
| Für Menschen | \`versionName\` | \`CFBundleShortVersionString\` | z. B. \`1.4.2\` (semantische Versionierung) |
| Für den Store | \`versionCode\` | \`CFBundleVersion\` (Build-Nummer) | muss bei jedem Upload **steigen** |

Eine verbreitete Konvention leitet beides aus einer Quelle ab (z. B. aus der \`package.json\` wie bei DevAtlas: \`1.2.3\` → \`versionCode\` 10203).

## Google Play

1. **Entwicklerkonto** (einmalige Gebühr) anlegen und Identität bestätigen.
2. App in der **Play Console** erstellen; **Store-Eintrag** mit Beschreibung, Screenshots, Icon, Kategorie.
3. Pflichtangaben: **Datenschutzerklärung** (URL), **Datensicherheitsformular** („Data safety“: welche Daten erhoben, geteilt, verschlüsselt werden), Altersfreigabe-Fragebogen, Zielgruppe.
4. **Target-API-Level**: Google Play verlangt jährlich ein höheres \`targetSdk\` (für neue Apps und Updates seit August 2025: mindestens Android 15 / API 35).
5. AAB in eine **Testspur** hochladen:

| Spur | Zweck |
|---|---|
| **Interner Test** | bis zu 100 Tester, sofort verfügbar, ohne vollständige Prüfung |
| **Geschlossener Test** | ausgewählte Tester per E-Mail-Liste/Google-Gruppe |
| **Offener Test** | jeder kann über den Store-Eintrag beitreten |
| **Produktion** | alle Nutzer – optional **gestaffelt** (z. B. 5 % → 20 % → 100 %) |

> [!NOTE] Neue private Entwicklerkonten
> Für private Konten, die nach November 2023 erstellt wurden, verlangt Google vor der ersten Produktionsfreigabe einen geschlossenen Test mit einer Mindestzahl an Testern über mindestens 14 Tage. Details stehen in der Play Console.

**Gestaffelte Rollouts** begrenzen den Schaden fehlerhafter Versionen: Steigen Absturz- oder [[ANR]]-Raten in den **Android Vitals**, wird der Rollout angehalten.

## Apple App Store

1. **Apple Developer Program** (jährliche Gebühr) – Voraussetzung für TestFlight und App Store.
2. In **App Store Connect** die App anlegen (Bundle-ID muss zum Xcode-Projekt passen).
3. Signierung: Xcode verwaltet **Zertifikate** und **Provisioning Profiles** mit „Automatically manage signing“; Teams nutzen oft fastlane \`match\`, das Zertifikate verschlüsselt in einem Repository teilt.
4. Build in Xcode: *Product → Archive* → *Distribute App* → App Store Connect.
5. **TestFlight**: interne Tester (bis 100 Teammitglieder) sofort; externe Tester (bis 10.000) nach einer kurzen Beta-Prüfung.
6. Angaben: **App-Datenschutz** („Nutrition Labels“), **Privacy Manifest** (\`PrivacyInfo.xcprivacy\`) für bestimmte APIs und SDKs, Screenshots für alle geforderten Gerätegrößen.
7. **App Review**: Apple prüft jede Version nach den App Review Guidelines; Ablehnungen kommen mit Begründung.

## Automatisieren: CI/CD und fastlane

Manuelle Releases sind fehleranfällig. Eine Pipeline baut, testet, signiert und lädt hoch – siehe [CI/CD](#/artikel/ci-cd).

\`\`\`yaml title=".github/workflows/android-release.yml (vereinfacht)"
name: Android Release
on:
  push:
    tags: ['v*']
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: '21' }
      - name: Keystore aus Secret wiederherstellen
        run: echo "\${{ secrets.UPLOAD_KEYSTORE_BASE64 }}" | base64 -d > upload.jks
      - name: Bauen und signieren
        env:
          DEVATLAS_KEYSTORE: \${{ github.workspace }}/upload.jks
          DEVATLAS_KEYSTORE_PASSWORD: \${{ secrets.KEYSTORE_PASSWORD }}
          DEVATLAS_KEY_ALIAS: upload
          DEVATLAS_KEY_PASSWORD: \${{ secrets.KEY_PASSWORD }}
        run: ./gradlew bundleRelease
      - uses: actions/upload-artifact@v4
        with: { name: app-bundle, path: app/build/outputs/bundle/release/*.aab }
\`\`\`

**fastlane** automatisiert die Store-Schritte: \`supply\` lädt AABs und Store-Texte zu Google Play hoch, \`pilot\` verteilt über TestFlight, \`deliver\` reicht für den App Store ein, \`match\` verwaltet iOS-Zertifikate. Für Flutter und React Native gibt es zusätzlich Codemagic bzw. **EAS Build/Submit** (Expo).

## Nach dem Release

- **Absturzberichte**: Android Vitals, Firebase Crashlytics, Sentry – mit hochgeladenen Mapping-Dateien (R8) bzw. dSYMs, damit Stacktraces lesbar sind.
- **In-App-Updates** (Android) bzw. ein Hinweis auf eine Mindestversion, wenn alte Versionen nicht mehr mit der API funktionieren.
- **Rückwärtskompatible APIs**: Alte App-Versionen bleiben monatelang im Umlauf – der Server muss sie weiter bedienen (siehe [gRPC](#/artikel/grpc-grundlagen) zu Schema-Evolution).
- **Datenmigrationen** testen: Update von der vorigen Version mit echten Daten installieren.

## Release-Checkliste

- [ ] \`versionCode\`/Build-Nummer erhöht, \`versionName\` gesetzt, Änderungsnotizen geschrieben
- [ ] Release-Build mit R8/Optimierungen getestet (nicht nur Debug)
- [ ] Keine Debug-Logs mit sensiblen Daten, keine Test-Endpunkte, WebView-Debugging aus
- [ ] Nur nötige Berechtigungen im Manifest bzw. in der \`Info.plist\`
- [ ] Datenschutzangaben aktuell (Data Safety, Nutrition Labels, Privacy Manifest)
- [ ] Update über die vorige Version installiert – Daten bleiben erhalten
- [ ] Auf kleinem und großem Gerät, mit großer Schrift, im Dark Mode und offline geprüft
- [ ] Gestaffelter Rollout mit Beobachtung von Absturz- und ANR-Raten
- [ ] Signaturschlüssel gesichert, Zugangsdaten nur in Secrets

> [!TIP] Übungen
> 1. Erzeuge mit \`keytool\` einen Test-Keystore und signiere einen Release-Build deiner Übungs-App. Prüfe die Signatur mit \`apksigner verify --print-certs app-release.apk\` (aus den Android Build-Tools).
> 2. Warum lässt sich eine mit einem anderen Schlüssel signierte APK nicht als Update über eine installierte App installieren? Was müsste ein Nutzer stattdessen tun – und was passiert dann mit seinen Daten?
> 3. Entwirf eine Rollout-Strategie für eine Version mit einer Datenbankmigration.

\`\`\`widget
quiz:Mobile 3
\`\`\`
`;export{e as default};
