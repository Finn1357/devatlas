const e=`---
id: grpc-streaming
title: gRPC-Streaming: Unary, Server-, Client- und bidirektionales Streaming
area: backend
difficulty: fortgeschritten
minutes: 20
order: 21
summary: Die vier Aufrufarten von gRPC mit .proto-Definition, Server- und Client-Code in Python und Go, Flusskontrolle und Backpressure, Abbruch, Deadlines bei langlebigen Streams, Wiederaufnahme nach Verbindungsabbrüchen und typische Fehler.
tags: [gRPC, Streaming, HTTP/2, Backpressure, Python, Go]
related: [grpc-grundlagen, grpc-praxis, websockets-echtzeit, message-broker-events]
---

## Vier Arten von Aufrufen

Weil gRPC auf [[HTTP/2]]-Streams aufsetzt, können beide Seiten nicht nur **eine** Nachricht senden, sondern beliebig viele. In der \`.proto\`-Datei entscheidet das Schlüsselwort \`stream\`:

\`\`\`protobuf title="todo/v1/todo.proto"
service TodoService {
  // 1. Unary: 1 Anfrage → 1 Antwort
  rpc GetTodo(GetTodoRequest) returns (Todo);

  // 2. Server-Streaming: 1 Anfrage → viele Antworten
  rpc WatchTodos(WatchTodosRequest) returns (stream TodoEvent);

  // 3. Client-Streaming: viele Anfragen → 1 Antwort
  rpc ImportTodos(stream CreateTodoRequest) returns (ImportSummary);

  // 4. Bidirektional: viele Anfragen ↔ viele Antworten, unabhängig voneinander
  rpc Chat(stream ChatMessage) returns (stream ChatMessage);
}

message WatchTodosRequest { bool include_done = 1; }

message TodoEvent {
  enum Kind { KIND_UNSPECIFIED = 0; KIND_CREATED = 1; KIND_UPDATED = 2; KIND_DELETED = 3; }
  Kind kind = 1;
  Todo todo = 2;
  int64 sequence = 3;   // fortlaufende Nummer – wichtig für die Wiederaufnahme
}

message ImportSummary { int32 imported = 1; int32 rejected = 2; }

message ChatMessage { string user = 1; string text = 2; }
\`\`\`

| Art | Beispiel aus der Praxis | Vergleichbar mit |
|---|---|---|
| **Unary** | Todo laden, Bestellung anlegen | normaler REST-Aufruf |
| **Server-Streaming** | Live-Kurse, Fortschritt eines Jobs, Änderungen beobachten, großen Export in Teilen liefern | [[Server-Sent Events]] |
| **Client-Streaming** | Datei oder Messwerte hochladen, Massenimport | Chunked Upload |
| **Bidirektional** | Chat, Multiplayer, interaktive Sprachverarbeitung, Synchronisation | [[WebSocket]] |

> [!BEGINNER] Was ist ein Stream?
> Stell dir ein Telefonat statt eines Briefwechsels vor: Die Leitung bleibt offen, und es können nacheinander beliebig viele Sätze in eine oder beide Richtungen fließen. Die Reihenfolge innerhalb einer Richtung bleibt dabei erhalten.

## Server-Streaming

Der Server schickt eine Folge von Nachrichten und beendet den Stream mit einem Status.

### Python: Generator als Antwort

\`\`\`python title="server.py (Ausschnitt)"
import queue
import grpc
from todo.v1 import todo_pb2, todo_pb2_grpc


class TodoService(todo_pb2_grpc.TodoServiceServicer):
    def __init__(self, events):
        self.events = events  # z. B. ein Pub/Sub-Mechanismus, der pro Abonnent eine Queue liefert

    def WatchTodos(self, request, context):
        q = self.events.subscribe()
        # Abonnement aufräumen, sobald der Aufruf endet (auch bei Abbruch durch den Client)
        context.add_callback(lambda: self.events.unsubscribe(q))
        while context.is_active():
            try:
                event = q.get(timeout=1.0)
            except queue.Empty:
                continue  # regelmäßig prüfen, ob der Client noch da ist
            if event.todo.done and not request.include_done:
                continue
            yield event   # jede yield-Anweisung = eine Nachricht an den Client
\`\`\`

### Python: Client liest einen Iterator

\`\`\`python title="client.py (Ausschnitt)"
call = stub.WatchTodos(todo_pb2.WatchTodosRequest(include_done=False))
try:
    for event in call:                       # blockiert, bis die nächste Nachricht kommt
        print(event.sequence, todo_pb2.TodoEvent.Kind.Name(event.kind), event.todo.title)
        if event.sequence >= 100:
            call.cancel()                    # Stream bewusst beenden → Server sieht is_active() == False
except grpc.RpcError as err:
    if err.code() != grpc.StatusCode.CANCELLED:
        raise
\`\`\`

### Go: dieselbe Methode im Server

\`\`\`go title="server.go (Ausschnitt)"
func (s *server) WatchTodos(req *pb.WatchTodosRequest, stream pb.TodoService_WatchTodosServer) error {
	sub := s.events.Subscribe()
	defer s.events.Unsubscribe(sub)

	for {
		select {
		case <-stream.Context().Done(): // Client hat abgebrochen oder Deadline erreicht
			return stream.Context().Err()
		case ev := <-sub:
			if ev.GetTodo().GetDone() && !req.GetIncludeDone() {
				continue
			}
			if err := stream.Send(ev); err != nil { // blockiert bei vollem Flusskontroll-Fenster
				return err
			}
		}
	}
}
\`\`\`

Das Ende der Methode beendet den Stream: \`return nil\` sendet \`OK\`, ein Fehler den entsprechenden Status.

## Client-Streaming

Der Client sendet viele Nachrichten; der Server antwortet **einmal**, typischerweise wenn der Client fertig ist.

\`\`\`python title="Server: Massenimport"
def ImportTodos(self, request_iterator, context):
    imported = rejected = 0
    for req in request_iterator:            # endet, wenn der Client seinen Stream schließt
        if not req.title.strip():
            rejected += 1
            continue
        self.repo.create(req.title, req.priority)
        imported += 1
    return todo_pb2.ImportSummary(imported=imported, rejected=rejected)
\`\`\`

\`\`\`python title="Client: Generator als Anfrage"
def lese_csv(pfad):
    with open(pfad, encoding="utf-8") as f:
        for zeile in f:
            yield todo_pb2.CreateTodoRequest(title=zeile.strip())

summary = stub.ImportTodos(lese_csv("todos.csv"), timeout=30)
print(f"{summary.imported} importiert, {summary.rejected} abgelehnt")
\`\`\`

> [!TIP] Große Dateien in Stücken
> gRPC-Implementierungen begrenzen die Größe einer **einzelnen Nachricht** standardmäßig (empfangsseitig häufig auf 4 MB). Große Dateien daher als Client-Stream in Blöcken von z. B. 64 KB senden – statt das Limit hochzusetzen. So bleibt auch der Speicherbedarf auf beiden Seiten konstant.

## Bidirektionales Streaming

Beide Seiten senden **unabhängig** voneinander. Es gibt keine feste „Frage–Antwort“-Reihenfolge: Der Server kann auf jede Nachricht antworten, mehrere sammeln oder spontan senden.

\`\`\`python title="Server: einfacher Chat-Relay"
def Chat(self, request_iterator, context):
    for msg in request_iterator:
        # Echo mit Verarbeitung – in einem echten Chat würde man an alle Teilnehmer verteilen
        yield todo_pb2.ChatMessage(user="bot", text=f"{msg.user} schrieb: {msg.text}")
\`\`\`

\`\`\`python title="Client: senden und empfangen"
import threading, queue

ausgang = queue.Queue()

def nachrichten():
    while True:
        msg = ausgang.get()
        if msg is None:          # None = Senden beenden (half-close)
            return
        yield msg

antworten = stub.Chat(nachrichten())

def empfangen():
    for antwort in antworten:
        print(f"[{antwort.user}] {antwort.text}")

t = threading.Thread(target=empfangen)
t.start()
ausgang.put(todo_pb2.ChatMessage(user="ada", text="Hallo!"))
ausgang.put(todo_pb2.ChatMessage(user="ada", text="Wie geht's?"))
ausgang.put(None)
t.join()
\`\`\`

> [!EXPERT] Half-Close
> Jede Richtung wird separat geschlossen. Schließt der Client seine Senderichtung, kann der Server noch antworten – erst wenn der Server den Status sendet, ist der Aufruf beendet. Für Python mit \`asyncio\` gibt es \`grpc.aio\`, das Streams als asynchrone Iteratoren anbietet und ohne Threads auskommt.

## Flusskontrolle und Backpressure

HTTP/2 hat pro Stream und pro Verbindung ein **Flusskontroll-Fenster**: Der Empfänger erlaubt dem Sender, nur so viele Bytes zu schicken, wie er puffern kann. Liest der Empfänger nicht weiter, füllt sich das Fenster, und \`stream.Send()\` (Go) bzw. das Weiterlaufen des Generators (Python) **blockiert**. Das ist [[Backpressure]] – der langsame Teilnehmer bremst den schnellen, statt dass Speicher überläuft.

Daraus folgt:

- Eine Stream-Methode sollte nicht unbegrenzt Daten in eigene Puffer schreiben, wenn \`Send\` blockiert.
- Ein Client, der Nachrichten nicht abholt, bremst den Server – das ist gewollt.
- Für Fan-out an viele langsame Clients (z. B. Kursdaten) entscheidet man bewusst: Nachrichten verwerfen (nur der neueste Stand zählt), zusammenfassen oder langsame Clients trennen.

## Deadlines, Abbruch und langlebige Streams

- **Abbruch** ist ein normaler Vorgang: Der Client schließt die App, wechselt den Bildschirm oder ruft \`cancel()\`. Der Server sieht das über \`context.is_active()\` (Python) bzw. \`stream.Context().Done()\` (Go) und muss Ressourcen freigeben.
- **Deadlines** gelten für den gesamten Aufruf. Für einen Watch-Stream, der stundenlang offen sein soll, setzt man entweder eine lange Deadline und baut den Stream danach neu auf oder verzichtet bewusst darauf und verlässt sich auf Abbruch und Keepalive.
- **Keepalive-Pings** auf HTTP/2-Ebene erkennen tote Verbindungen (z. B. Mobilfunk-Funkloch), die sonst erst nach Minuten auffallen. Server begrenzen zulässige Ping-Raten – zu aggressive Client-Pings führen zum Verbindungsabbruch (\`GOAWAY\`, „too_many_pings“).
- **Proxys und Load Balancer** haben oft Leerlauf-Timeouts. Lange Pausen ohne Nachrichten können den Stream beenden; regelmäßige Heartbeat-Nachrichten helfen.

## Wiederaufnahme nach Verbindungsabbruch

Ein Stream ist **keine dauerhafte Zustellgarantie**. Bricht die Verbindung ab, sind Nachrichten „unterwegs“ verloren. Robuste Clients:

1. merken sich die zuletzt verarbeitete **Sequenznummer** (\`sequence\` im \`TodoEvent\`),
2. verbinden sich mit [[Exponential Backoff]] neu,
3. senden die Nummer im Request mit (\`resume_after = 1234\`),
4. und der Server liefert ab dort weiter – oder schickt einen vollständigen Stand, wenn die Historie nicht mehr reicht.

Wer echte Zustellgarantien, Persistenz und Wiederholung braucht, kombiniert gRPC mit einem [Message Broker](#/artikel/message-broker-events) wie Kafka.

## Typische Fehler

> [!MISTAKE] Streams für alles
> Ein Server-Stream, der nur eine Nachricht liefert, ist ein komplizierter Unary-Aufruf. Streams bringen Zustand, Wiederverbindungslogik und schwierigeres Load Balancing mit. Nur einsetzen, wenn wirklich mehrere Nachrichten über Zeit fließen.

> [!MISTAKE] Ressourcen bei Abbruch nicht freigeben
> Abonnements, Datenbank-Cursor oder Goroutinen, die nach einem Client-Abbruch weiterlaufen, sind ein klassisches Speicherleck. In Python \`context.add_callback()\`, in Go \`defer\` und \`ctx.Done()\` nutzen.

> [!MISTAKE] Auf Reihenfolge über Streams hinweg verlassen
> Reihenfolge ist **pro Stream und Richtung** garantiert. Zwei parallele Streams oder ein Stream plus Unary-Aufrufe haben keine gemeinsame Ordnung.

## Zusammenfassung

| | Anfrage | Antwort | Server-Code (Python) | Client-Code (Python) |
|---|---|---|---|---|
| Unary | 1 | 1 | \`return msg\` | \`stub.M(req)\` |
| Server-Streaming | 1 | n | \`yield msg\` | \`for r in stub.M(req)\` |
| Client-Streaming | n | 1 | \`for r in request_iterator\` … \`return\` | \`stub.M(generator())\` |
| Bidirektional | n | n | \`for r in request_iterator: yield …\` | \`for r in stub.M(generator())\` |

> [!TIP] Übung
> 1. Erweitere \`WatchTodosRequest\` um \`int64 resume_after = 2;\` und liefere im Server nur Ereignisse mit größerer Sequenznummer.
> 2. Baue einen Client-Stream \`UploadAttachment(stream Chunk) returns (UploadResult)\`, der eine Datei in 64-KB-Blöcken überträgt und am Ende die Größe und einen SHA-256-Hash zurückgibt.
> 3. Was passiert in deinem Server, wenn der Client mitten im Upload abbricht? Prüfe es, indem du den Client nach drei Blöcken mit \`call.cancel()\` stoppst.

\`\`\`widget
quiz:gRPC 4
\`\`\`
`;export{e as default};
