const e=`---
id: react-native
title: Tutorial: React Native mit Expo – und WebView-Apps mit Capacitor
area: mobile
difficulty: fortgeschritten
minutes: 24
order: 5
summary: Wie React Native funktioniert (native Komponenten, neue Architektur mit JSI, Fabric und TurboModules), eine Todo-App mit Expo und TypeScript, Styling, Listen, dateibasierte Navigation mit Expo Router, Speicherung und Builds mit EAS – plus der hybride Ansatz mit Capacitor und WebView, mit dem auch DevAtlas als Android-App läuft.
tags: [React Native, Expo, TypeScript, Expo Router, Capacitor, WebView, Cross-Platform]
related: [mobile-entwicklung, react-grundlagen, typescript-praxis, flutter-dart, mobile-architektur-navigation, mobile-deployment]
---

## Das Prinzip

**[React Native](#/tech/react-native)** bringt das Programmiermodell von [React](#/artikel/react-grundlagen) auf Smartphones: Komponenten, Props, State und Hooks – aber statt HTML-Elementen erzeugt es **echte native Bedienelemente** (\`View\` wird auf Android zu einer \`android.view.View\`, auf iOS zu einer \`UIView\`). Die App-Logik läuft in JavaScript bzw. TypeScript auf der Engine **Hermes**.

| Begriff | Bedeutung |
|---|---|
| **JSI** (JavaScript Interface) | direkte Aufrufe zwischen JavaScript und C++/nativem Code, ohne serialisierende „Bridge“ |
| **Fabric** | neues Rendering-System, das Layout-Berechnung und Darstellung synchron und priorisiert ausführen kann |
| **TurboModules** | native Module, die erst bei Bedarf geladen und über JSI typisiert aufgerufen werden |
| **Hermes** | für React Native optimierte JavaScript-Engine mit vorab kompiliertem Bytecode (schnellerer Start) |

> [!NOTE] Neue Architektur
> Seit React Native 0.76 (Ende 2024) ist die neue Architektur standardmäßig aktiv. Ältere Anleitungen, die von „der Bridge“ als zentralem Engpass sprechen, beschreiben den früheren Stand.

## Expo: der empfohlene Einstieg

**Expo** ist ein Framework und eine Werkzeugsammlung rund um React Native. Die React-Native-Dokumentation empfiehlt, neue Apps mit einem Framework wie Expo zu starten. Es liefert fertige Module (Kamera, Dateien, sichere Speicherung, Benachrichtigungen), dateibasierte Navigation und Cloud-Builds.

\`\`\`bash title="Projekt anlegen und starten"
npx create-expo-app@latest todo-app
cd todo-app
npx expo start          # QR-Code mit der App „Expo Go“ scannen oder Emulator mit „a“ starten
\`\`\`

In **Expo Go** läuft die App sofort auf dem Smartphone, ohne Android Studio oder Xcode. Für eigene native Module erstellt man später einen **Development Build**.

## Komponenten statt HTML

| Web (React DOM) | React Native |
|---|---|
| \`<div>\` | \`<View>\` |
| \`<span>\`, \`<p>\` | \`<Text>\` – **jeder** Text muss in \`<Text>\` stehen |
| \`<input>\` | \`<TextInput>\` |
| \`<button>\` | \`<Pressable>\` oder \`<Button>\` |
| \`<ul>\` mit \`map()\` | \`<FlatList>\` (virtualisiert lange Listen) |
| CSS-Dateien | \`StyleSheet.create({...})\`, Flexbox mit \`flexDirection: 'column'\` als Standard |

## Die Todo-App

\`\`\`tsx title="app/index.tsx"
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Todo = { id: string; titel: string; erledigt: boolean };

export default function TodoScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [eingabe, setEingabe] = useState('');

  const hinzufuegen = () => {
    const titel = eingabe.trim();
    if (!titel) return;
    setTodos((alt) => [...alt, { id: String(Date.now()), titel, erledigt: false }]);
    setEingabe('');
  };

  const umschalten = (id: string) =>
    setTodos((alt) => alt.map((t) => (t.id === id ? { ...t, erledigt: !t.erledigt } : t)));

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titel}>Meine Aufgaben</Text>
      <View style={styles.zeile}>
        <TextInput
          style={styles.eingabe}
          value={eingabe}
          onChangeText={setEingabe}
          placeholder="Neue Aufgabe"
          returnKeyType="done"
          onSubmitEditing={hinzufuegen}
          accessibilityLabel="Neue Aufgabe"
        />
        <Pressable style={styles.knopf} onPress={hinzufuegen} accessibilityRole="button">
          <Text style={styles.knopfText}>Hinzufügen</Text>
        </Pressable>
      </View>
      <FlatList
        data={todos}
        keyExtractor={(t) => t.id}
        ListEmptyComponent={<Text style={styles.leer}>Noch keine Aufgaben.</Text>}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => umschalten(item.id)}
            style={styles.eintrag}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: item.erledigt }}
          >
            <Text style={[styles.eintragText, item.erledigt && styles.erledigt]}>{item.titel}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  titel: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  zeile: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  eingabe: { flex: 1, borderWidth: 1, borderColor: '#888', borderRadius: 8, paddingHorizontal: 12, minHeight: 48 },
  knopf: { backgroundColor: '#4f5bd5', borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center' },
  knopfText: { color: 'white', fontWeight: '600' },
  eintrag: { paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#ccc' },
  eintragText: { fontSize: 16 },
  erledigt: { textDecorationLine: 'line-through', color: '#888' },
  leer: { color: '#888', marginTop: 24, textAlign: 'center' },
});
\`\`\`

> [!MISTAKE] Text außerhalb einer Text-Komponente
> \`<View>Hallo</View>\` führt in React Native zu einem Fehler. Anders als im Browser gibt es keine „nackten“ Textknoten.

## Navigation mit Expo Router

Expo Router bildet Routen aus der **Ordnerstruktur** ab – ähnlich wie Next.js:

\`\`\`text title="app/-Ordner"
app/
├── _layout.tsx        Stack- oder Tab-Navigation für die Unterseiten
├── index.tsx          /            (Liste)
└── todo/[id].tsx      /todo/42     (Detailseite mit Parameter)
\`\`\`

\`\`\`tsx title="app/todo/[id].tsx"
import { Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function TodoDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ padding: 16 }}>
      <Stack.Screen options={{ title: \`Aufgabe \${id}\` }} />
      <Text>Details zu Aufgabe {id}</Text>
    </View>
  );
}
\`\`\`

Verlinkt wird mit \`<Link href={\`/todo/\${item.id}\`}>\` oder \`router.push(...)\`. Jede Route ist automatisch auch als [[Deep Link]] erreichbar; die Android-Zurück-Taste funktioniert ohne Zusatzcode.

## Daten speichern und laden

| Bedarf | Paket |
|---|---|
| kleine Einstellungen, einfache Listen | \`@react-native-async-storage/async-storage\` (unverschlüsselt) |
| Tokens und Geheimnisse | \`expo-secure-store\` (nutzt [[Keychain]] bzw. [[Android Keystore]]) |
| strukturierte Daten, Abfragen | \`expo-sqlite\` |
| Server-Daten mit Cache und Wiederholungen | \`fetch\` + TanStack Query |

\`\`\`tsx title="Aufgaben dauerhaft speichern"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

// laden beim Start …
useEffect(() => {
  AsyncStorage.getItem('todos').then((json) => json && setTodos(JSON.parse(json)));
}, []);

// … und bei jeder Änderung speichern
useEffect(() => {
  AsyncStorage.setItem('todos', JSON.stringify(todos));
}, [todos]);
\`\`\`

> [!WARNING] Reihenfolge beim Laden
> Im Beispiel kann der Speicher-Effekt beim ersten Rendern die leere Liste schreiben, bevor das Laden fertig ist. In echten Apps ein \`geladen\`-Flag einführen und erst danach speichern – oder eine Bibliothek mit eingebauter Persistenz verwenden.

## Builds mit EAS

Für eine installierbare App baut **EAS Build** (Expo Application Services) in der Cloud oder lokal:

\`\`\`bash title="APK für Tests, AAB für Google Play"
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview      # Profil mit "buildType": "apk" in eas.json → installierbare APK
eas build -p android --profile production   # Android App Bundle für den Play Store
\`\`\`

Für Builds ohne Cloud lassen sich mit \`npx expo prebuild\` die nativen Projekte erzeugen und dann mit Android Studio bzw. Xcode bauen.

## Der hybride Weg: Capacitor und WebView

Neben nativem Rendering (Kotlin/Swift), eigenem Rendering (Flutter) und nativen Komponenten (React Native) gibt es einen vierten Weg: Eine **Web-App läuft in einer [[WebView]]** innerhalb einer nativen Hülle. **Capacitor** (vom Ionic-Team) stellt dafür ein natives Android- und iOS-Projekt bereit und macht Gerätefunktionen über Plugins für JavaScript zugänglich.

**DevAtlas selbst ist so gebaut:** Die React-Web-App wird mit Vite gebaut und von Capacitor in ein Android-Projekt kopiert. Die App enthält alle Inhalte lokal, funktioniert dadurch offline und nutzt native Plugins für die Zurück-Taste, den Splashscreen und eine Sicherung des Lernstands.

\`\`\`bash title="Eine bestehende Web-App mit Capacitor verpacken"
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli
npx cap init "Meine App" de.beispiel.app --web-dir dist
npm run build && npx cap add android
npx cap sync android      # nach jedem Web-Build ausführen
npx cap open android      # in Android Studio öffnen und bauen
\`\`\`

| | Capacitor (WebView) | React Native | Flutter | Nativ |
|---|---|---|---|---|
| Oberfläche | HTML/CSS | native Komponenten | eigene Engine | native Komponenten |
| Wiederverwendung einer Web-App | sehr hoch | gering | keine | keine |
| Natürliches Plattform-Gefühl | mittel (Gestaltung nötig) | hoch | hoch (nachgebildet) | am höchsten |
| Performance bei komplexen Animationen | mittel | hoch | sehr hoch | sehr hoch |
| Gut für | Inhalts-Apps, Formulare, bestehende Web-Apps | App-Teams mit React-Wissen | konsistente UI auf allen Plattformen | maximale Integration und Performance |

> [!EXPERT] Sicherheit bei WebView-Apps
> Die WebView sollte nur **eigene, gebündelte Inhalte** mit Zugriff auf native Plugins laden. Externe Seiten gehören in den System-Browser oder Custom Tabs. Eine Content Security Policy, keine unverschlüsselten Verbindungen und keine Geheimnisse im JavaScript-Bundle sind Pflicht – siehe [Sicherheit, Testing & Performance](#/artikel/mobile-sicherheit-testing).

> [!TIP] Übungen
> 1. Speichere die Todos mit AsyncStorage und behebe das im Warnhinweis beschriebene Problem mit einem \`geladen\`-Flag.
> 2. Lege mit Expo Router eine Detailseite an und navigiere beim Tippen auf ein Todo dorthin.
> 3. Vergleiche: Welche der vier Ansätze aus der Tabelle würdest du für eine Lern-App mit vielen Texten wählen, welchen für ein Spiel?

\`\`\`widget
quiz:Mobile 3
\`\`\`
`;export{e as default};
