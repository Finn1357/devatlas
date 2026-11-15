const e=`---
id: grpc-grundlagen
title: gRPC-Grundlagen: Architektur, Protocol Buffers & Service-Definitionen
area: backend
difficulty: fortgeschritten
minutes: 22
order: 20
summary: Was gRPC ist und wann es sich lohnt, wie HTTP/2 und Protocol Buffers zusammenspielen, wie man Nachrichten und Services in .proto-Dateien definiert, Code generiert und einen ersten Unary-RPC in Python baut – inklusive Regeln für kompatible Schema-Änderungen.
tags: [gRPC, Protocol Buffers, Protobuf, HTTP/2, RPC, API, Microservices]
related: [grpc-streaming, grpc-praxis, api-stile, rest-api-design, http2-http3-tls]
---

## Worum geht es?

**[[gRPC]]** ist ein Open-Source-Framework für **[[RPC|Remote Procedure Calls]]**, ursprünglich von Google entwickelt und heute ein Projekt der Cloud Native Computing Foundation. Statt Ressourcen per URL und HTTP-Methode anzusprechen wie bei [[REST]], ruft ein Client **Methoden eines Dienstes** auf – etwa \`TodoService.CreateTodo(request)\` – als wäre es eine lokale Funktion. Dahinter stehen drei Bausteine:

| Baustein | Aufgabe |
|---|---|
| **[[Protocol Buffers]]** (Protobuf) | Beschreibt Nachrichten und Services in einer \`.proto\`-Datei und serialisiert Daten kompakt binär |
| **Code-Generierung** | Erzeugt aus der \`.proto\`-Datei Client-Stubs und Server-Basisklassen für viele Sprachen (Go, Java, Kotlin, Python, C#, C++, Dart, Swift, Node.js, Rust …) |
| **[[HTTP/2]]** als Transport | Mehrere parallele Aufrufe über eine Verbindung, Streams in beide Richtungen, Header-Kompression |

> [!BEGINNER] Das Prinzip in einem Satz
> Man schreibt einen **Vertrag** (welche Funktionen gibt es, welche Daten gehen hinein und heraus), lässt sich daraus Code erzeugen und ruft entfernte Funktionen dann typsicher wie lokale auf.

## Wann lohnt sich gRPC?

**Gut geeignet:**

- **Kommunikation zwischen Microservices** im eigenen Rechenzentrum oder Cluster – hohe Aufrufraten, viele Sprachen, klarer Vertrag.
- **Streaming** in eine oder beide Richtungen (Live-Daten, große Uploads, Chat, Telemetrie) – siehe [gRPC-Streaming](#/artikel/grpc-streaming).
- **Mobile Clients zu eigenen Backends**, wenn kompakte Nachrichten und generierte Clients wichtig sind.
- **Polyglotte Teams**: Ein \`.proto\` erzeugt konsistente Typen für alle Sprachen.

**Weniger geeignet:**

- **Öffentliche APIs für beliebige Entwickler:innen** – REST/JSON ist mit \`curl\` und Browser sofort nutzbar, gRPC braucht Werkzeuge.
- **Direkt aus dem Browser**: Browser können die von gRPC benötigten HTTP/2-Trailer nicht auslesen. Dafür gibt es **gRPC-Web** bzw. das Connect-Protokoll mit einem Proxy oder speziellem Server (Details in [gRPC in der Praxis](#/artikel/grpc-praxis)).
- **Wenn Menschen den Datenverkehr lesen müssen** (Debugging mit Browser-DevTools, Logs): Binärdaten brauchen Werkzeuge wie \`grpcurl\`.

## Architektur: Was passiert bei einem Aufruf?

\`\`\`text title="Ablauf eines Unary-RPC"
Client-Code            Client-Stub              HTTP/2              Server              Service-Implementierung
    │  stub.GetTodo(req)   │                       │                   │                         │
    │─────────────────────>│ serialisiert req       │                   │                         │
    │                      │ (Protobuf, binär)      │                   │                         │
    │                      │── HEADERS + DATA ─────>│── Stream 1 ──────>│ deserialisiert          │
    │                      │   :path /todo.v1.TodoService/GetTodo       │────────────────────────>│
    │                      │                        │                   │      Antwort-Objekt     │
    │                      │<── DATA + TRAILERS ────│<──────────────────│<────────────────────────│
    │<─────────────────────│ grpc-status: 0 (OK)    │                   │                         │
\`\`\`

1. Der **Client-Stub** (generierter Code) serialisiert die Anfrage mit Protobuf.
2. Er sendet sie als **HTTP/2-POST** an den Pfad \`/{paket}.{Service}/{Methode}\` mit \`content-type: application/grpc\`. Jede Nachricht hat einen 5-Byte-Präfix (Komprimierungs-Flag + Länge).
3. Der Server ruft die passende Methode auf und schickt die Antwort zurück.
4. Der **Status** des Aufrufs steht nicht im HTTP-Statuscode (der ist meist 200), sondern in den **Trailern** \`grpc-status\` und \`grpc-message\` – deshalb braucht gRPC HTTP/2-Trailer.

> [!EXPERT] Eine Verbindung, viele Aufrufe
> Ein gRPC-**Channel** hält langlebige HTTP/2-Verbindungen. Hunderte Aufrufe laufen parallel als Streams über dieselbe Verbindung. Das spart Verbindungsaufbau und TLS-Handshakes – erschwert aber Lastverteilung mit klassischen L4-Load-Balancern: Sie verteilen Verbindungen, nicht Aufrufe. Mehr dazu im Praxis-Artikel.

## Protocol Buffers: Nachrichten definieren

Eine \`.proto\`-Datei beschreibt Datentypen und Services. Aktuell üblich ist die Syntax **proto3** (neuere Protobuf-Versionen führen zusätzlich „Editions“ ein, die proto3 schrittweise ablösen; die Konzepte bleiben gleich).

\`\`\`protobuf title="todo/v1/todo.proto"
syntax = "proto3";

package todo.v1;

import "google/protobuf/timestamp.proto";

// Eine Aufgabe
message Todo {
  int64 id = 1;
  string title = 2;
  bool done = 3;
  Priority priority = 4;
  repeated string tags = 5;                   // Liste
  google.protobuf.Timestamp created_at = 6;   // „Well-known type“
  optional string note = 7;                   // explizit: gesetzt oder nicht gesetzt?
}

enum Priority {
  PRIORITY_UNSPECIFIED = 0;  // erster Wert muss 0 sein – der Standardwert
  PRIORITY_LOW = 1;
  PRIORITY_HIGH = 2;
}
\`\`\`

Die wichtigsten Regeln:

| Element | Bedeutung |
|---|---|
| \`= 1\`, \`= 2\` … | **Feldnummer** – identifiziert das Feld im Binärformat. Der Name wird nicht übertragen. |
| Skalare Typen | \`int32\`, \`int64\`, \`uint32\`, \`uint64\`, \`sint32/64\` (effizient für negative Zahlen), \`fixed32/64\`, \`float\`, \`double\`, \`bool\`, \`string\` (UTF-8), \`bytes\` |
| \`repeated\` | Liste beliebig vieler Werte |
| \`map<string, int32>\` | Schlüssel-Wert-Zuordnung |
| \`oneof\` | höchstens eines der Felder ist gesetzt (z. B. \`email\` oder \`phone\`) |
| \`optional\` | macht „nicht gesetzt“ von „Standardwert“ unterscheidbar |
| Standardwerte | Nicht gesetzte Felder lesen sich als \`0\`, \`""\`, \`false\`, leere Liste, erster Enum-Wert |

> [!MISTAKE] „0“ und „nicht gesetzt“ verwechseln
> Ohne \`optional\` kann der Empfänger bei \`int32 rabatt = 3;\` nicht unterscheiden, ob der Rabatt **0** ist oder **gar nicht angegeben** wurde – beides kommt als \`0\` an. Für Felder, bei denen das wichtig ist, \`optional\` oder einen Wrapper-Typ (\`google.protobuf.Int32Value\`) verwenden.

### Warum ist Protobuf kompakt?

Jedes Feld wird als **Tag** (Feldnummer und Wire-Type) plus Wert kodiert. Ganzzahlen nutzen **Varints**: kleine Zahlen brauchen nur ein Byte. Ein Todo \`{id: 150, title: "Milch", done: true}\` belegt in Protobuf etwa 12 Bytes, als JSON \`{"id":150,"title":"Milch","done":true}\` rund 38 Bytes. Wichtiger als die Größe ist oft die **schnellere Verarbeitung** und das **erzwungene Schema**.

## Services definieren

\`\`\`protobuf title="todo/v1/todo.proto (Fortsetzung)"
service TodoService {
  // Unary: eine Anfrage → eine Antwort
  rpc GetTodo(GetTodoRequest) returns (Todo);
  rpc CreateTodo(CreateTodoRequest) returns (Todo);
  rpc ListTodos(ListTodosRequest) returns (ListTodosResponse);
}

message GetTodoRequest { int64 id = 1; }

message CreateTodoRequest {
  string title = 1;
  Priority priority = 2;
}

message ListTodosRequest {
  int32 page_size = 1;
  string page_token = 2;   // Cursor-Pagination
}

message ListTodosResponse {
  repeated Todo todos = 1;
  string next_page_token = 2;
}
\`\`\`

> [!TIP] Eigene Request- und Response-Nachrichten
> Auch wenn \`GetTodo\` nur eine ID braucht: Eine eigene \`GetTodoRequest\`-Nachricht kostet nichts, erlaubt aber später neue Felder (z. B. \`field_mask\`) ohne Bruch der API. Diese Konvention empfehlen auch die Google API Design Guidelines.

## Code generieren

Für Python liefert das Paket \`grpcio-tools\` den Compiler \`protoc\` gleich mit:

\`\`\`bash title="Abhängigkeiten installieren und Code erzeugen"
python -m venv .venv && source .venv/bin/activate     # Windows: .venv\\Scripts\\activate
pip install grpcio grpcio-tools

# erzeugt todo/v1/todo_pb2.py (Nachrichten) und todo/v1/todo_pb2_grpc.py (Stubs/Servicer)
python -m grpc_tools.protoc -I . \\
  --python_out=. --pyi_out=. --grpc_python_out=. \\
  todo/v1/todo.proto
\`\`\`

Für andere Sprachen wird \`protoc\` mit dem jeweiligen Plugin aufgerufen (z. B. \`protoc-gen-go\` und \`protoc-gen-go-grpc\` für Go). Viele Teams nutzen stattdessen **[Buf](#/tech/buf)**: Es verwaltet Abhängigkeiten, prüft Stilregeln (\`buf lint\`) und erkennt inkompatible Änderungen (\`buf breaking\`).

## Der erste Unary-RPC in Python

### Server

\`\`\`python title="server.py"
from concurrent import futures
import grpc

from todo.v1 import todo_pb2, todo_pb2_grpc


class TodoService(todo_pb2_grpc.TodoServiceServicer):
    def __init__(self):
        self._todos: dict[int, todo_pb2.Todo] = {}
        self._next_id = 1

    def CreateTodo(self, request, context):
        if not request.title.strip():
            # Fehler mit Statuscode statt Exception-Text
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, "title darf nicht leer sein")
        todo = todo_pb2.Todo(id=self._next_id, title=request.title, priority=request.priority)
        self._todos[todo.id] = todo
        self._next_id += 1
        return todo

    def GetTodo(self, request, context):
        todo = self._todos.get(request.id)
        if todo is None:
            context.abort(grpc.StatusCode.NOT_FOUND, f"Todo {request.id} nicht gefunden")
        return todo


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    todo_pb2_grpc.add_TodoServiceServicer_to_server(TodoService(), server)
    server.add_insecure_port("[::]:50051")   # nur lokal! In Produktion TLS verwenden
    server.start()
    print("gRPC-Server läuft auf Port 50051")
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
\`\`\`

\`context.abort()\` beendet den Aufruf mit Statuscode und Meldung – der Client erhält einen strukturierten Fehler statt eines Stacktraces.

### Client

\`\`\`python title="client.py"
import grpc
from todo.v1 import todo_pb2, todo_pb2_grpc

with grpc.insecure_channel("localhost:50051") as channel:
    stub = todo_pb2_grpc.TodoServiceStub(channel)

    created = stub.CreateTodo(
        todo_pb2.CreateTodoRequest(title="gRPC lernen", priority=todo_pb2.PRIORITY_HIGH),
        timeout=2.0,   # Deadline: spätestens nach 2 Sekunden abbrechen
    )
    print("angelegt:", created.id, created.title)

    try:
        stub.GetTodo(todo_pb2.GetTodoRequest(id=999), timeout=2.0)
    except grpc.RpcError as err:
        print("Fehler:", err.code().name, "-", err.details())   # NOT_FOUND - Todo 999 nicht gefunden
\`\`\`

> [!WARNING] Immer eine Deadline setzen
> Ohne \`timeout\` wartet ein Client im Zweifel unbegrenzt. In verteilten Systemen ist eine [[Deadline]] pro Aufruf Pflicht – mehr dazu in [gRPC in der Praxis](#/artikel/grpc-praxis).

### Ausprobieren mit grpcurl

\`grpcurl\` ist wie \`curl\` für gRPC. Mit aktivierter **Server Reflection** kennt es die Schnittstelle ohne \`.proto\`-Datei, sonst gibt man sie mit \`-proto\` an:

\`\`\`bash
grpcurl -plaintext -proto todo/v1/todo.proto -import-path . \\
  -d '{"title": "Milch kaufen"}' \\
  localhost:50051 todo.v1.TodoService/CreateTodo
\`\`\`

Die Ausgabe erscheint als JSON – Protobuf hat eine definierte JSON-Abbildung (Feldnamen in lowerCamelCase, 64-Bit-Zahlen als Strings).

## Schemas weiterentwickeln, ohne Clients zu brechen

Server und Clients werden selten gleichzeitig aktualisiert – mobile Apps erst recht nicht. Protobuf ist auf Kompatibilität ausgelegt, wenn man diese Regeln einhält:

| Änderung | Kompatibel? |
|---|---|
| Neues Feld mit **neuer** Nummer hinzufügen | ✅ Alte Clients ignorieren es, neue sehen bei alten Daten den Standardwert |
| Feld **umbenennen** | ✅ im Binärformat (Nummer zählt) – ❌ aber für die JSON-Abbildung und generierten Code |
| Feld löschen | ✅ wenn Nummer **und** Name mit \`reserved\` gesperrt werden |
| **Feldnummer ändern** oder wiederverwenden | ❌ Daten werden falsch interpretiert |
| Typ ändern (z. B. \`int32\` → \`string\`) | ❌ (wenige Ausnahmen wie \`int32\` ↔ \`int64\` sind wire-kompatibel, aber riskant) |
| Enum-Wert hinzufügen | ✅ Alte Clients sehen einen unbekannten Wert – Code muss damit umgehen |
| Methode zum Service hinzufügen | ✅ |

\`\`\`protobuf title="Gelöschtes Feld sperren"
message Todo {
  reserved 4, 7;                // Nummern nie wieder verwenden
  reserved "priority", "note";  // Namen ebenfalls sperren
  int64 id = 1;
  string title = 2;
  bool done = 3;
}
\`\`\`

Für **inkompatible** Änderungen erhält das Paket eine neue Version (\`todo.v2\`), und beide Versionen laufen eine Zeit lang parallel.

## Zusammenfassung

- gRPC = **Protobuf-Vertrag** + **generierter Code** + **HTTP/2**.
- Felder werden über **Nummern** identifiziert – Nummern nie ändern oder wiederverwenden, gelöschte mit \`reserved\` sperren.
- Fehler laufen über **Statuscodes** (\`NOT_FOUND\`, \`INVALID_ARGUMENT\` …), nicht über HTTP-Statuscodes.
- Jeder Aufruf braucht eine **Deadline**.
- Weiter geht es mit den vier Aufrufarten in [gRPC-Streaming](#/artikel/grpc-streaming).

> [!TIP] Übung
> 1. Ergänze \`rpc DeleteTodo(DeleteTodoRequest) returns (google.protobuf.Empty);\` (Import \`google/protobuf/empty.proto\`) und implementiere die Methode so, dass ein unbekanntes Todo \`NOT_FOUND\` liefert.
> 2. Füge \`Todo\` ein Feld \`due_date\` hinzu. Welche Feldnummer wählst du, wenn 4 und 7 \`reserved\` sind?
> 3. Rufe \`CreateTodo\` mit leerem Titel auf. Welchen Statuscode und welche Meldung erhält der Client?

\`\`\`widget
quiz:gRPC 4
\`\`\`
`;export{e as default};
