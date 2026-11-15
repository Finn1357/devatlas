const e=`---
id: mobile-entwicklung
title: Mobile Entwicklung: Native, Flutter, React Native & Co.
area: mobile
difficulty: einsteiger
minutes: 22
order: 1
summary: Wie Apps für iOS und Android entstehen – native Entwicklung mit Swift und Kotlin, plattformübergreifend mit Flutter, React Native und Kotlin Multiplatform, Progressive Web Apps, dieselbe Komponente in vier Technologien sowie Lebenszyklus, Offline-Fähigkeit, Push, Sicherheit und Veröffentlichung.
tags: [Mobile, iOS, Android, Swift, Kotlin, Flutter, React Native, App Store]
related: [android-kotlin-compose, flutter-dart, swiftui-ios, react-native, mobile-architektur-navigation, mobile-deployment, barrierefreiheit, rest-api-design]
---

## Die Ausgangslage

Zwei Plattformen dominieren: **Android** (Google, weltweit größter Marktanteil) und **iOS** (Apple, in einigen Märkten wie den USA führend und oft mit höheren Umsätzen pro Nutzer). Beide haben eigene Sprachen, Werkzeuge, Designrichtlinien und Stores. Die zentrale Entscheidung lautet daher: **native für jede Plattform** oder **eine gemeinsame Codebasis**?

## Die Optionen

| Ansatz | Sprache | UI | Codebasis | Stärken |
|---|---|---|---|---|
| **Native iOS** | [Swift](#/sprachen/swift) | SwiftUI (oder UIKit) | nur iOS | volle Plattformintegration, sofort neue APIs |
| **Native Android** | [Kotlin](#/sprachen/kotlin) | Jetpack Compose (oder Views) | nur Android | dito für Android |
| **Flutter** | [Dart](#/sprachen/dart) | eigene Rendering-Engine | iOS, Android, Web, Desktop | identisches Aussehen überall, hohe Performance, schnelle Entwicklung |
| **React Native** | JavaScript/TypeScript | echte native Komponenten | iOS, Android (+ Web via React Native Web) | Web-Know-how und React nutzbar, großes Ökosystem, Expo |
| **Kotlin Multiplatform** | Kotlin | nativ pro Plattform oder Compose Multiplatform | geteilte Logik, optional geteilte UI | Logik teilen, UI nativ lassen |
| **.NET MAUI** | C# | native Steuerelemente | iOS, Android, Windows, macOS | für .NET-Teams |
| **Progressive Web App** | HTML/CSS/JS | Browser | eine Web-Anwendung | keine Stores, sofortige Updates; eingeschränkter Zugriff auf Gerätefunktionen |

## Dieselbe Komponente viermal

Ein Zähler-Button – nahezu identisch zum [Web-Vergleich](#/artikel/frontend-frameworks). Alle modernen UI-Toolkits sind **deklarativ**: Die Oberfläche ist eine Funktion des Zustands.

\`\`\`swift title="SwiftUI (iOS)"
import SwiftUI

struct ZaehlerView: View {
    @State private var anzahl = 0

    var body: some View {
        Button("Klicks: \\(anzahl)") {
            anzahl += 1
        }
        .buttonStyle(.borderedProminent)
    }
}
\`\`\`

\`\`\`kotlin title="Jetpack Compose (Android)"
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.*

@Composable
fun Zaehler() {
    var anzahl by remember { mutableIntStateOf(0) }
    Button(onClick = { anzahl++ }) {
        Text("Klicks: $anzahl")
    }
}
\`\`\`

\`\`\`dart title="Flutter"
import 'package:flutter/material.dart';

class Zaehler extends StatefulWidget {
  const Zaehler({super.key});
  @override
  State<Zaehler> createState() => _ZaehlerState();
}

class _ZaehlerState extends State<Zaehler> {
  int _anzahl = 0;

  @override
  Widget build(BuildContext context) => FilledButton(
        onPressed: () => setState(() => _anzahl++),
        child: Text('Klicks: $_anzahl'),
      );
}
\`\`\`

\`\`\`tsx title="React Native"
import { useState } from 'react';
import { Pressable, Text } from 'react-native';

export function Zaehler() {
  const [anzahl, setAnzahl] = useState(0);
  return (
    <Pressable onPress={() => setAnzahl((n) => n + 1)} accessibilityRole="button">
      <Text>Klicks: {anzahl}</Text>
    </Pressable>
  );
}
\`\`\`

## Wie entscheiden?

- **Ein Team, beide Plattformen, Fokus auf eigenes Design:** Flutter.
- **Team mit React/TypeScript-Erfahrung, ggf. gemeinsame Logik mit einer Web-App:** React Native (mit Expo für einen schnellen Start).
- **Tiefe Plattformintegration** (Widgets, Watch, CarPlay, AR, Hintergrundverarbeitung, Barrierefreiheitsdetails) oder höchste Ansprüche an „natives Gefühl“: native Entwicklung – evtl. mit Kotlin Multiplatform für geteilte Geschäftslogik.
- **Inhalte und Formulare, kein Store nötig:** Eine gut gemachte responsive Web-App oder PWA reicht oft.

> [!INFO] Plattformübergreifend heißt nicht plattformlos
> Auch mit Flutter oder React Native braucht man für Builds, Signierung, Store-Einreichung, Berechtigungen, Push und native Module Wissen über beide Plattformen – und für iOS-Builds einen Mac (oder einen Cloud-Build-Dienst).

## Architektur

Bewährt ist eine Trennung in **UI**, **Zustand/Logik** und **Daten**, mit **unidirektionalem Datenfluss**:

\`\`\`text
 UI (Views/Widgets) ──Ereignis──► ViewModel / State Holder ──► Repository ──► API / lokale Datenbank
        ▲                                │
        └──────────── neuer Zustand ─────┘
\`\`\`

Gängige Muster: **MVVM** (Android-Empfehlung, auch in SwiftUI verbreitet), **BLoC** oder Riverpod in Flutter, Redux-artige Stores. Das Repository entscheidet, ob Daten aus dem Cache, der lokalen Datenbank oder dem Netz kommen.

## Was Mobile besonders macht

### Lebenszyklus

Apps werden ständig unterbrochen: Anrufe, App-Wechsel, Bildschirmsperre. Das Betriebssystem kann eine App im Hintergrund **jederzeit beenden**, um Speicher freizugeben. Eine gute App speichert Eingaben und Zustand so, dass Nutzer nach der Rückkehr dort weitermachen, wo sie waren – auch wenn der Prozess zwischendurch beendet wurde.

### Offline-Fähigkeit

Mobile Verbindungen sind langsam, teuer oder gar nicht vorhanden (Bahn, Keller, Ausland). **Offline-first** heißt: Daten lokal speichern, sofort anzeigen, im Hintergrund synchronisieren.

| Plattform | Lokale Datenbank |
|---|---|
| Android | Room (SQLite), DataStore für Einstellungen |
| iOS | SwiftData, Core Data, SQLite (GRDB) |
| Flutter | sqflite, drift, Hive/Isar |
| React Native | SQLite (expo-sqlite), WatermelonDB, MMKV |

Synchronisierung braucht eine Strategie für **Konflikte** (zwei Geräte ändern denselben Datensatz offline) – etwa „letzte Änderung gewinnt“, Feldzusammenführung oder serverseitige Regeln.

### Berechtigungen und Datenschutz

Kamera, Standort, Kontakte, Benachrichtigungen: Nutzer müssen zustimmen, und zwar **im Kontext** („Für das Scannen des QR-Codes braucht die App die Kamera“). Beide Stores verlangen Datenschutzangaben (Apple: Privacy Nutrition Labels und Privacy Manifest; Google Play: Data Safety). Nur anfordern, was wirklich gebraucht wird.

### Push-Benachrichtigungen

Push läuft über die Dienste der Plattformen: **APNs** (Apple) und **Firebase Cloud Messaging** (Android, auch für iOS nutzbar). Der Server sendet an einen Geräte-Token; das Betriebssystem stellt zu. Benachrichtigungen sparsam einsetzen – zu viele führen zum Deaktivieren oder Deinstallieren.

### Performance und Akku

Flüssig heißt 60 oder 120 Bilder pro Sekunde – pro Frame bleiben 8–16 ms. Schwere Arbeit (Parsen großer JSON-Antworten, Bildverarbeitung) gehört nicht in den UI-Thread. Netzwerk, GPS und Hintergrundaktivität kosten Akku; beide Betriebssysteme begrenzen Hintergrundarbeit streng (WorkManager auf Android, BackgroundTasks auf iOS).

## Sicherheit

> [!DANGER] Eine App ist kein Tresor
> Alles, was in der App steckt – Code, Konfiguration, API-Schlüssel –, kann aus dem Installationspaket ausgelesen werden. **Geheime Schlüssel gehören auf den Server**, nicht in die App. Die App authentifiziert den **Nutzer** (z. B. per [OAuth mit PKCE](#/artikel/oauth-oidc)), der Server entscheidet über Berechtigungen.

- Tokens und Zugangsdaten im **Keychain** (iOS) bzw. **Android Keystore** / EncryptedSharedPreferences speichern, nicht in normalen Einstellungen.
- Nur **HTTPS**; iOS (App Transport Security) und Android (Network Security Config) blockieren Klartext-HTTP standardmäßig.
- **Deep Links** wie Benutzereingaben behandeln und validieren; für verifizierte Links Universal Links (iOS) bzw. App Links (Android) nutzen.
- Die **OWASP Mobile Top 10** und der MASVS-Standard listen die wichtigsten Risiken.

## Barrierefreiheit

Beide Plattformen haben leistungsfähige Screenreader (**VoiceOver**, **TalkBack**), dynamische Schriftgrößen und Kontrasteinstellungen. Native Komponenten bringen viel mit; eigene Komponenten brauchen Beschriftungen (\`accessibilityLabel\` in SwiftUI und React Native, \`contentDescription\`/\`semantics\` in Compose, \`Semantics\` in Flutter) und ausreichend große Tippflächen (Apple empfiehlt 44 × 44 pt, Android 48 × 48 dp). Grundlagen in [Barrierefreiheit](#/artikel/barrierefreiheit).

## Testen und Ausliefern

| Schritt | iOS | Android |
|---|---|---|
| Entwicklungsumgebung | Xcode (nur macOS) | Android Studio |
| Unit- und UI-Tests | XCTest / Swift Testing, XCUITest | JUnit, Espresso, Compose UI Tests |
| Testverteilung | TestFlight | Play Console: interne/geschlossene Tests |
| Signierung | Zertifikate & Provisioning Profiles | Keystore, Play App Signing |
| Store | App Store (Review vor jeder Veröffentlichung) | Google Play (automatisierte und teils manuelle Prüfung) |
| Automatisierung | fastlane, Xcode Cloud, Codemagic, EAS (Expo), GitHub Actions | dito |

> [!WARNING] Updates sind nicht sofort
> Anders als bei einer Web-App laufen alte App-Versionen noch Monate oder Jahre auf Geräten. Die **API muss abwärtskompatibel** bleiben (Versionierung, siehe [REST-API-Design](#/artikel/rest-api-design)), und es braucht einen Mechanismus, um bei kritischen Problemen ein Update zu erzwingen (Mindestversion vom Server abfragen).

## Wie geht es weiter?

Die Sprachen im Detail: [Swift](#/sprachen/swift), [Kotlin](#/sprachen/kotlin), [Dart](#/sprachen/dart). Die gemeinsamen Konzepte deklarativer Oberflächen erklärt [Frontend-Frameworks im Vergleich](#/artikel/frontend-frameworks).

\`\`\`widget
quiz:Mobile 3
\`\`\`
`;export{e as default};
