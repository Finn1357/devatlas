const e=`---
id: flutter-dart
title: Tutorial: Plattformübergreifende Apps mit Flutter und Dart
area: mobile
difficulty: fortgeschritten
minutes: 26
order: 3
summary: Dart für Umsteiger (Null Safety, async/await, Klassen), Flutter installieren, der Widget-Baum, Stateless- und StatefulWidgets, eine Todo-App mit Material 3, Layout, Listen, Navigation, Daten aus dem Netz mit http und FutureBuilder, State Management im Überblick, Hot Reload und Plattformkanäle.
tags: [Flutter, Dart, Widgets, Cross-Platform, State Management, Tutorial]
related: [mobile-entwicklung, android-kotlin-compose, react-native, mobile-architektur-navigation, mobile-daten-api]
---

## Warum Flutter?

**[Flutter](#/tech/flutter)** ist ein UI-Framework von Google für Android, iOS, Web, Windows, macOS und Linux aus **einer Codebasis**. Anders als Frameworks, die native Bedienelemente ansteuern, **zeichnet Flutter jedes Pixel selbst** mit seiner eigenen Rendering-Engine (Impeller). Dadurch sieht die App überall gleich aus und Animationen laufen flüssig – dafür muss Flutter das Aussehen der Plattformen nachbilden.

| Stärken | Schwächen |
|---|---|
| eine Codebasis, sehr konsistentes Aussehen | eigene Sprache Dart lernen |
| [[Hot Reload]] in Sekundenbruchteilen | App-Größe meist größer als bei rein nativen Apps |
| hohe Rendering-Performance | neue Plattform-APIs erst über Plugins verfügbar |
| großes Paket-Ökosystem (pub.dev) | Web-Ausgabe für textlastige Websites (SEO) weniger geeignet |

## Dart in 10 Minuten

[Dart](#/sprachen/dart) ist statisch typisiert, objektorientiert und hat **Null Safety**: Ein Typ ohne \`?\` kann nie \`null\` sein.

\`\`\`dart title="Dart-Grundlagen"
void main() {
  final name = 'Ada';            // final: einmal zuweisen (Typ String wird abgeleitet)
  const pi = 3.14159;            // const: Konstante zur Kompilierzeit
  String? spitzname;             // darf null sein
  print('Hallo, \${spitzname ?? name}!');   // ?? = Ersatzwert bei null

  final zahlen = [3, 1, 4, 1, 5];
  final gerade = zahlen.where((z) => z.isEven).toList();
  print(gerade);                 // [4]

  final todo = Todo('Dart lernen');
  todo.erledigen();
  print(todo);                   // Todo(Dart lernen, erledigt: true)
}

class Todo {
  Todo(this.titel, {this.erledigt = false});   // benannter Parameter mit Standardwert
  final String titel;
  bool erledigt;

  void erledigen() => erledigt = true;

  @override
  String toString() => 'Todo($titel, erledigt: $erledigt)';
}
\`\`\`

Asynchroner Code nutzt \`Future\` und \`async\`/\`await\` – ähnlich wie in JavaScript:

\`\`\`dart title="Asynchron mit Future"
Future<String> ladeBenutzer() async {
  await Future.delayed(const Duration(seconds: 1));   // simuliert eine Netzwerkanfrage
  return 'Ada';
}

Future<void> main() async {
  try {
    final name = await ladeBenutzer();
    print('Geladen: $name');
  } catch (e) {
    print('Fehler: $e');
  }
}
\`\`\`

## Installation und erstes Projekt

1. Flutter SDK nach Anleitung auf flutter.dev installieren (bringt Dart mit).
2. Für Android: Android Studio mit SDK; für iOS: macOS mit Xcode.
3. Prüfen und Projekt anlegen:

\`\`\`bash title="Erste Schritte"
flutter doctor            # prüft SDKs, Lizenzen, angeschlossene Geräte
flutter create todo_app
cd todo_app
flutter run               # startet auf Emulator oder angeschlossenem Gerät
\`\`\`

Während \`flutter run\` läuft, übernimmt **\`r\`** Codeänderungen per Hot Reload (Zustand bleibt erhalten), **\`R\`** startet die App neu (Hot Restart).

## Alles ist ein Widget

Eine Flutter-Oberfläche ist ein **Baum aus [[Flutter-Widget|Widgets]]**: \`MaterialApp\` → \`Scaffold\` → \`Column\` → \`Text\`, \`TextField\`, \`ListView\` … Widgets sind unveränderliche Beschreibungen; Flutter vergleicht sie bei Änderungen und aktualisiert nur, was nötig ist.

| Widget-Art | Wann? |
|---|---|
| \`StatelessWidget\` | Darstellung hängt nur von den übergebenen Parametern ab |
| \`StatefulWidget\` + \`State\` | eigener veränderlicher Zustand; \`setState()\` löst einen Neuaufbau aus |

Wichtige Layout-Widgets: \`Row\`, \`Column\`, \`Expanded\` (restlichen Platz füllen), \`Padding\`, \`SizedBox\`, \`Stack\`, \`ListView.builder\` (lange Listen, baut nur sichtbare Einträge), \`SafeArea\` (Abstand zu Kamera-Ausschnitt und Systemleisten).

## Die Todo-App

\`\`\`dart title="lib/main.dart"
import 'package:flutter/material.dart';

void main() => runApp(const TodoApp());

class TodoApp extends StatelessWidget {
  const TodoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Todos',
      theme: ThemeData(colorSchemeSeed: Colors.indigo),
      darkTheme: ThemeData(colorSchemeSeed: Colors.indigo, brightness: Brightness.dark),
      home: const TodoSeite(),
    );
  }
}

class Todo {
  Todo(this.titel);
  final String titel;
  bool erledigt = false;
}

class TodoSeite extends StatefulWidget {
  const TodoSeite({super.key});

  @override
  State<TodoSeite> createState() => _TodoSeiteState();
}

class _TodoSeiteState extends State<TodoSeite> {
  final _todos = <Todo>[];
  final _eingabe = TextEditingController();

  @override
  void dispose() {
    _eingabe.dispose();      // Controller freigeben, sonst Speicherleck
    super.dispose();
  }

  void _hinzufuegen() {
    final titel = _eingabe.text.trim();
    if (titel.isEmpty) return;
    setState(() => _todos.add(Todo(titel)));
    _eingabe.clear();
  }

  @override
  Widget build(BuildContext context) {
    final offen = _todos.where((t) => !t.erledigt).length;
    return Scaffold(
      appBar: AppBar(title: Text('Meine Aufgaben ($offen offen)')),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _eingabe,
                      decoration: const InputDecoration(labelText: 'Neue Aufgabe'),
                      textInputAction: TextInputAction.done,
                      onSubmitted: (_) => _hinzufuegen(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  FilledButton(onPressed: _hinzufuegen, child: const Text('Hinzufügen')),
                ],
              ),
            ),
            Expanded(
              child: ListView.builder(
                itemCount: _todos.length,
                itemBuilder: (context, i) {
                  final todo = _todos[i];
                  return Dismissible(                     // wischen zum Löschen
                    key: ObjectKey(todo),
                    onDismissed: (_) => setState(() => _todos.removeAt(i)),
                    child: CheckboxListTile(
                      value: todo.erledigt,
                      title: Text(todo.titel),
                      onChanged: (wert) => setState(() => todo.erledigt = wert ?? false),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
\`\`\`

> [!MISTAKE] setState vergessen
> Ändert man \`_todos\` ohne \`setState\`, ändert sich zwar die Liste, aber Flutter baut die Oberfläche nicht neu auf – auf dem Bildschirm passiert nichts.

> [!TIP] const nutzen
> \`const Text('Hinzufügen')\` erzeugt das Widget nur einmal. Flutter kann solche Teilbäume beim Neuaufbau überspringen. Der Linter (\`flutter analyze\`) weist auf fehlende \`const\` hin.

## Navigation

Für wenige Seiten genügt der eingebaute \`Navigator\`:

\`\`\`dart title="Zur Detailseite und zurück"
Navigator.of(context).push(
  MaterialPageRoute(builder: (_) => DetailSeite(todo: todo)),
);

// auf der Detailseite: zurück, optional mit Ergebnis
Navigator.of(context).pop(true);
\`\`\`

Für größere Apps mit Deep Links und Web-URLs ist das Paket **go_router** verbreitet, das Routen deklarativ beschreibt (\`/todos/:id\`). Die Android-Zurück-Taste und die Zurück-Geste funktionieren mit beiden automatisch.

## Daten aus dem Netz

\`\`\`dart title="Laden mit dem http-Paket (flutter pub add http)"
import 'dart:convert';
import 'package:http/http.dart' as http;

class Beitrag {
  Beitrag({required this.id, required this.titel});
  final int id;
  final String titel;

  factory Beitrag.fromJson(Map<String, dynamic> json) =>
      Beitrag(id: json['id'] as int, titel: json['title'] as String);
}

Future<List<Beitrag>> ladeBeitraege() async {
  final antwort = await http
      .get(Uri.parse('https://jsonplaceholder.typicode.com/posts'))
      .timeout(const Duration(seconds: 10));
  if (antwort.statusCode != 200) {
    throw Exception('HTTP \${antwort.statusCode}');
  }
  final liste = jsonDecode(antwort.body) as List<dynamic>;
  return liste.map((e) => Beitrag.fromJson(e as Map<String, dynamic>)).toList();
}
\`\`\`

\`\`\`dart title="Lade-, Fehler- und Datenzustand mit FutureBuilder"
class BeitragsListe extends StatefulWidget {
  const BeitragsListe({super.key});
  @override
  State<BeitragsListe> createState() => _BeitragsListeState();
}

class _BeitragsListeState extends State<BeitragsListe> {
  late final Future<List<Beitrag>> _zukunft = ladeBeitraege();   // einmal starten, nicht in build()!

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Beitrag>>(
      future: _zukunft,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          return Center(child: Text('Laden fehlgeschlagen: \${snapshot.error}'));
        }
        final beitraege = snapshot.data!;
        return ListView.builder(
          itemCount: beitraege.length,
          itemBuilder: (_, i) => ListTile(title: Text(beitraege[i].titel)),
        );
      },
    );
  }
}
\`\`\`

> [!WARNING] Future nicht in build() erzeugen
> \`FutureBuilder(future: ladeBeitraege(), …)\` startet die Anfrage bei **jedem** Neuaufbau erneut – also bei jedem Tastendruck oder jeder Animation. Den Future einmal im \`State\` anlegen.

Unter Android muss die App zudem die Berechtigung \`INTERNET\` im Manifest haben (Release-Builds; Debug-Builds enthalten sie im Flutter-Template automatisch).

## State Management im Überblick

\`setState\` reicht für Zustand **innerhalb eines Widgets**. Teilen sich mehrere Bildschirme Daten, braucht es ein Konzept – Flutter schreibt keines vor:

| Ansatz | Kurzbeschreibung |
|---|---|
| **InheritedWidget / ChangeNotifier** | eingebaut; Grundlage vieler Bibliotheken |
| **Provider** | einfacher Wrapper um InheritedWidget; früher offizielle Empfehlung |
| **Riverpod** | typsicher, testbar, unabhängig vom Widget-Baum |
| **Bloc / Cubit** | Ereignisse rein, Zustände raus – strikt [[Unidirektionaler Datenfluss|unidirektional]] |

Für Einsteiger: erst \`setState\`, dann **Provider** oder **Riverpod**, wenn Zustand geteilt werden muss. Die Architekturprinzipien beschreibt [App-Architektur & Navigation](#/artikel/mobile-architektur-navigation).

## Native Funktionen: Plugins und Plattformkanäle

Kamera, Standort, Biometrie & Co. kommen über **Plugins** von pub.dev (z. B. \`camera\`, \`geolocator\`, \`local_auth\`). Gibt es keins, ruft man mit einem **MethodChannel** eigenen Kotlin- bzw. Swift-Code auf. Jede Berechtigung muss zusätzlich im Android-Manifest bzw. in der iOS-\`Info.plist\` deklariert und zur Laufzeit erfragt werden – nur, wenn die Funktion sie wirklich braucht.

## Testen und veröffentlichen

\`\`\`dart title="test/todo_test.dart – Widget-Test"
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:todo_app/main.dart';

void main() {
  testWidgets('Aufgabe hinzufügen', (tester) async {
    await tester.pumpWidget(const TodoApp());
    await tester.enterText(find.byType(TextField), 'Milch kaufen');
    await tester.tap(find.text('Hinzufügen'));
    await tester.pump();
    expect(find.text('Milch kaufen'), findsOneWidget);
    expect(find.text('Meine Aufgaben (1 offen)'), findsOneWidget);
  });
}
\`\`\`

\`\`\`bash title="Tests ausführen und Release bauen"
flutter test
flutter build appbundle      # Android App Bundle für Google Play
flutter build apk --release  # APK zum direkten Installieren
flutter build ipa            # iOS (nur auf macOS)
\`\`\`

Signieren und Veröffentlichen beschreibt [Deployment & Veröffentlichung](#/artikel/mobile-deployment).

> [!TIP] Übungen
> 1. Speichere die Aufgaben mit dem Paket \`shared_preferences\` als JSON-Liste, sodass sie einen Neustart überstehen.
> 2. Lagere \`_todos\` in einen \`ChangeNotifier\` aus und stelle ihn mit \`ChangeNotifierProvider\` bereit. Welche Widgets bauen sich jetzt bei einer Änderung neu auf?
> 3. Ersetze \`Navigator.push\` durch go_router mit der Route \`/todo/:index\`.

\`\`\`widget
quiz:Mobile 4
\`\`\`
`;export{e as default};
