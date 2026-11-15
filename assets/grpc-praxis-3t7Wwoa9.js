const e=`---
id: grpc-praxis
title: gRPC in der Praxis: Fehler, Authentifizierung, Deadlines und gRPC vs. REST vs. GraphQL
area: backend
difficulty: profi
minutes: 24
order: 22
summary: Statuscodes richtig wählen und detaillierte Fehler senden, TLS, mTLS und Token-Authentifizierung über Metadaten und Interceptoren, Deadlines weitergeben, Retries per Service Config, Load Balancing, Health Checks, Reflection, gRPC im Browser und eine ehrliche Entscheidungshilfe gegenüber REST und GraphQL.
tags: [gRPC, Fehlerbehandlung, Authentifizierung, mTLS, Interceptor, Load Balancing, REST, GraphQL]
related: [grpc-grundlagen, grpc-streaming, api-stile, rest-api-design, authentifizierung, system-design]
---

## Fehler: Statuscodes statt HTTP-Codes

Jeder gRPC-Aufruf endet mit einem **Status** aus Code und Meldung. Die 17 Codes sind sprachübergreifend gleich:

| Code | Nr. | Wann verwenden? | Wiederholen sinnvoll? |
|---|---|---|---|
| \`OK\` | 0 | Erfolg | – |
| \`CANCELLED\` | 1 | Aufrufer hat abgebrochen | nein |
| \`UNKNOWN\` | 2 | unbekannter Fehler (z. B. unbehandelte Exception) | eher nein |
| \`INVALID_ARGUMENT\` | 3 | Eingabe ungültig, unabhängig vom Systemzustand (leerer Titel) | nein |
| \`DEADLINE_EXCEEDED\` | 4 | Deadline abgelaufen – Operation evtl. trotzdem ausgeführt! | nur wenn idempotent |
| \`NOT_FOUND\` | 5 | Ressource existiert nicht | nein |
| \`ALREADY_EXISTS\` | 6 | Ressource gibt es schon | nein |
| \`PERMISSION_DENIED\` | 7 | authentifiziert, aber nicht berechtigt | nein |
| \`RESOURCE_EXHAUSTED\` | 8 | Quota/Rate Limit erschöpft, Nachricht zu groß | ja, mit Backoff |
| \`FAILED_PRECONDITION\` | 9 | Systemzustand passt nicht (Konto gesperrt, Ordner nicht leer) | erst nach Zustandsänderung |
| \`ABORTED\` | 10 | Konflikt, z. B. Transaktionsabbruch, optimistische Sperre | ja, ganze Sequenz neu |
| \`OUT_OF_RANGE\` | 11 | Wert außerhalb des gültigen Bereichs (z. B. Seite hinter dem Ende) | nein |
| \`UNIMPLEMENTED\` | 12 | Methode nicht implementiert/unterstützt | nein |
| \`INTERNAL\` | 13 | interner Fehler, Invariante verletzt | nein |
| \`UNAVAILABLE\` | 14 | Dienst vorübergehend nicht erreichbar | **ja**, mit Backoff |
| \`DATA_LOSS\` | 15 | unwiederbringlicher Datenverlust/-beschädigung | nein |
| \`UNAUTHENTICATED\` | 16 | keine oder ungültige Anmeldedaten | nach erneuter Anmeldung |

> [!MISTAKE] Alles als INTERNAL oder UNKNOWN melden
> Clients entscheiden anhand des Codes, ob sie wiederholen, neu anmelden oder einen Fehler anzeigen. Ein Validierungsfehler als \`INTERNAL\` führt zu sinnlosen Retries und falschen Alarmen. Faustregel: \`INVALID_ARGUMENT\` hängt nur von der Anfrage ab, \`FAILED_PRECONDITION\` vom Zustand des Systems.

### Detaillierte Fehler mit google.rpc.Status

Für Formularvalidierung reicht ein Text nicht – der Client will wissen, **welches Feld** falsch ist. gRPC unterstützt dafür das „Richer Error Model“: Fehlerdetails als Protobuf-Nachrichten (\`BadRequest\`, \`ErrorInfo\`, \`RetryInfo\`, \`QuotaFailure\` aus \`google/rpc/error_details.proto\`). In Python mit dem Paket \`grpcio-status\`:

\`\`\`python title="Server: Validierungsfehler mit Feldangaben"
from google.protobuf import any_pb2
from google.rpc import code_pb2, error_details_pb2, status_pb2
from grpc_status import rpc_status

def CreateTodo(self, request, context):
    verletzungen = []
    if not request.title.strip():
        verletzungen.append(error_details_pb2.BadRequest.FieldViolation(field="title", description="darf nicht leer sein"))
    if len(request.title) > 200:
        verletzungen.append(error_details_pb2.BadRequest.FieldViolation(field="title", description="höchstens 200 Zeichen"))
    if verletzungen:
        detail = any_pb2.Any()
        detail.Pack(error_details_pb2.BadRequest(field_violations=verletzungen))
        status = status_pb2.Status(code=code_pb2.INVALID_ARGUMENT, message="Ungültige Eingabe", details=[detail])
        context.abort_with_status(rpc_status.to_status(status))
    ...
\`\`\`

\`\`\`python title="Client: Details auslesen"
try:
    stub.CreateTodo(todo_pb2.CreateTodoRequest(title=""), timeout=2)
except grpc.RpcError as err:
    status = rpc_status.from_call(err)
    for d in status.details if status else []:
        if d.Is(error_details_pb2.BadRequest.DESCRIPTOR):
            br = error_details_pb2.BadRequest()
            d.Unpack(br)
            for v in br.field_violations:
                print(f"{v.field}: {v.description}")
\`\`\`

> [!DANGER] Keine internen Details nach außen
> Stacktraces, SQL-Fehler oder interne Hostnamen gehören ins Log, nicht in \`grpc-message\`. Die Meldung erreicht jeden Client – auch Angreifer.

## Deadlines richtig einsetzen

Eine [[Deadline]] ist ein absoluter Zeitpunkt. Ruft ein Dienst A mit 2 s Deadline Dienst B auf, und B ruft C auf, sollte C nicht wieder volle 2 s bekommen – sonst arbeitet C noch, wenn A längst aufgegeben hat.

\`\`\`python title="Restzeit an Folgeaufrufe weitergeben"
def GetTodoDetails(self, request, context):
    rest = context.time_remaining()          # Sekunden bis zur Deadline des Aufrufers (oder None)
    budget = min(rest - 0.05, 1.0) if rest else 1.0
    if budget <= 0:
        context.abort(grpc.StatusCode.DEADLINE_EXCEEDED, "keine Zeit mehr für Folgeaufrufe")
    benutzer = self.users_stub.GetUser(users_pb2.GetUserRequest(id=request.owner_id), timeout=budget)
    ...
\`\`\`

In **Go** passiert die Weitergabe automatisch, wenn man den eingehenden \`ctx\` an ausgehende Aufrufe übergibt – ein guter Grund, \`context.Context\` konsequent durchzureichen.

> [!WARNING] DEADLINE_EXCEEDED heißt nicht „nicht passiert“
> Der Server kann die Operation abgeschlossen haben, kurz bevor die Antwort zu spät kam. Schreibende Aufrufe daher **idempotent** gestalten (z. B. mit einem vom Client erzeugten \`request_id\`), bevor man sie automatisch wiederholt.

## Retries per Service Config

gRPC-Clients können fehlgeschlagene Aufrufe selbst wiederholen. Die Regeln stehen in der **Service Config**:

\`\`\`python title="Client mit Retry-Policy"
import json

service_config = {
    "methodConfig": [{
        "name": [{"service": "todo.v1.TodoService"}],
        "timeout": "2s",
        "retryPolicy": {
            "maxAttempts": 4,
            "initialBackoff": "0.1s",
            "maxBackoff": "1s",
            "backoffMultiplier": 2,
            "retryableStatusCodes": ["UNAVAILABLE"],
        },
    }]
}

channel = grpc.secure_channel(
    "todo.example.internal:443",
    grpc.ssl_channel_credentials(),
    options=[("grpc.service_config", json.dumps(service_config)), ("grpc.enable_retries", 1)],
)
\`\`\`

Nur \`UNAVAILABLE\` automatisch zu wiederholen ist ein sicherer Standard. \`DEADLINE_EXCEEDED\` oder \`ABORTED\` nur, wenn die Methode idempotent ist. Ergänzend schützt ein [[Circuit Breaker]] davor, einen überlasteten Dienst mit Wiederholungen weiter zu belasten.

## Authentifizierung und Verschlüsselung

### 1. TLS – immer

In Produktion läuft gRPC über [[TLS]]. Die \`insecure\`-Varianten sind nur für lokale Tests gedacht.

\`\`\`python title="TLS-Server und -Client"
# Server
with open("server.key", "rb") as f: key = f.read()
with open("server.crt", "rb") as f: cert = f.read()
creds = grpc.ssl_server_credentials([(key, cert)])
server.add_secure_port("[::]:50051", creds)

# Client (vertraut den System-CAs; für eine eigene CA root_certificates=… angeben)
channel = grpc.secure_channel("todo.example.com:50051", grpc.ssl_channel_credentials())
\`\`\`

### 2. mTLS für Dienst-zu-Dienst

Bei [[mTLS]] weist sich auch der Client mit einem Zertifikat aus:

\`\`\`python
creds = grpc.ssl_server_credentials([(key, cert)], root_certificates=ca_cert, require_client_auth=True)
\`\`\`

Das Zertifikat identifiziert den **aufrufenden Dienst**. In Kubernetes übernimmt das oft ein [[Service Mesh]] (Istio, Linkerd) automatisch inklusive Zertifikatsrotation.

### 3. Tokens über Metadaten

Für **Benutzer** (z. B. mobile App → Backend) überträgt man ein Token – meist ein [[JWT]] aus einem [[OAuth]]-/OIDC-Login – als **Metadaten** (das gRPC-Gegenstück zu HTTP-Headern; Schlüssel kleingeschrieben):

\`\`\`python title="Client: Token mitsenden"
stub.GetTodo(req, metadata=[("authorization", f"Bearer {access_token}")], timeout=2)

# oder einmalig für den Channel (funktioniert nur zusammen mit TLS):
call_creds = grpc.access_token_call_credentials(access_token)
channel = grpc.secure_channel(host, grpc.composite_channel_credentials(grpc.ssl_channel_credentials(), call_creds))
\`\`\`

### 4. Prüfen im Server-Interceptor

Ein [[Interceptor]] prüft das Token zentral für alle Methoden, statt es in jeder Methode zu wiederholen:

\`\`\`python title="Authentifizierungs-Interceptor (für Unary-Methoden)"
class AuthInterceptor(grpc.ServerInterceptor):
    OFFEN = {"/grpc.health.v1.Health/Check"}   # Methoden ohne Anmeldung

    def __init__(self, verify_token):
        self._verify = verify_token
        def ablehnen(request, context):
            context.abort(grpc.StatusCode.UNAUTHENTICATED, "Token fehlt oder ist ungültig")
        self._deny = grpc.unary_unary_rpc_method_handler(ablehnen)

    def intercept_service(self, continuation, handler_call_details):
        if handler_call_details.method in self.OFFEN:
            return continuation(handler_call_details)
        meta = dict(handler_call_details.invocation_metadata)
        auth = meta.get("authorization", "")
        if auth.startswith("Bearer ") and self._verify(auth[7:]):
            return continuation(handler_call_details)
        return self._deny

server = grpc.server(futures.ThreadPoolExecutor(max_workers=10), interceptors=[AuthInterceptor(verify_jwt)])
\`\`\`

> [!NOTE] Autorisierung bleibt Aufgabe der Methode
> Der Interceptor beantwortet „**Wer** ruft an?“ ([[Authentifizierung]]). Ob dieser Benutzer **dieses** Todo lesen darf, prüft die Methode selbst – sonst entstehen [[IDOR]]-Lücken (siehe [Zugriffskontrolle](#/artikel/zugriffskontrolle)).

## Load Balancing

Weil ein gRPC-Channel eine langlebige [[HTTP/2]]-Verbindung nutzt, landet bei einem klassischen L4-[[Load Balancer]] (TCP) **jeder Aufruf eines Clients auf demselben Server**. Neue Server-Instanzen bekommen keine Last ab. Lösungen:

| Ansatz | Funktionsweise |
|---|---|
| **Client-seitig** | Client löst alle Adressen per DNS auf (\`dns:///todo.svc:50051\`, in Kubernetes mit Headless Service) und verteilt mit \`round_robin\` |
| **L7-Proxy** | Envoy, NGINX oder ein Ingress, der HTTP/2 versteht, verteilt einzelne Aufrufe |
| **Service Mesh** | Sidecar-Proxys übernehmen L7-Balancing transparent |
| **Lookaside / xDS** | Clients beziehen Endpunkte und Gewichte dynamisch von einer Steuerungsebene |

## Betrieb: Health Checks, Reflection, Observability

- **Health Checking**: Das Standardprotokoll \`grpc.health.v1.Health\` meldet \`SERVING\`/\`NOT_SERVING\`. Kubernetes unterstützt es direkt als \`grpc\`-Probe (stabil seit Kubernetes 1.27).
- **Server Reflection** (\`grpcio-reflection\`) erlaubt Werkzeugen wie \`grpcurl\` oder Postman, Services ohne \`.proto\`-Datei zu erkunden. In öffentlichen Umgebungen abwägen, ob die Schnittstelle offengelegt werden soll.
- **Observability**: Interceptoren für [[Logging]], Metriken (Latenz, Fehlerrate je Methode und Statuscode) und [[Tracing]] mit OpenTelemetry; die Trace-ID reist in den Metadaten mit.
- **Tests**: Server im Testprozess auf einem freien Port starten und mit einem echten Stub aufrufen – das testet Serialisierung und Statuscodes mit.

\`\`\`python title="Reflection aktivieren"
from grpc_reflection.v1alpha import reflection

namen = (todo_pb2.DESCRIPTOR.services_by_name["TodoService"].full_name, reflection.SERVICE_NAME)
reflection.enable_server_reflection(namen, server)
# grpcurl -plaintext localhost:50051 list   → zeigt todo.v1.TodoService
\`\`\`

## gRPC im Browser

Browser-JavaScript hat keinen Zugriff auf HTTP/2-Frames und -Trailer. Optionen:

- **gRPC-Web**: Variante des Protokolls, die ein Proxy (z. B. Envoy) oder der Server selbst in echtes gRPC übersetzt. Unterstützt Unary und Server-Streaming, **kein** Client- oder bidirektionales Streaming.
- **Connect** (connectrpc.com): Protokoll und Bibliotheken, die gRPC, gRPC-Web und ein einfaches HTTP/JSON-Format von einem Server aus anbieten.
- **Transcoding / gRPC-Gateway**: \`google.api.http\`-Annotationen in der \`.proto\`-Datei erzeugen zusätzlich eine REST/JSON-Schnittstelle – praktisch, wenn intern gRPC und extern REST gewünscht ist.

## gRPC vs. REST vs. GraphQL

| Kriterium | REST (JSON) | GraphQL | gRPC |
|---|---|---|---|
| Vertrag | optional (OpenAPI) | Schema verpflichtend | \`.proto\` verpflichtend |
| Datenformat | JSON (Text) | JSON | Protobuf (binär) |
| Transport | HTTP/1.1 oder 2 | meist HTTP POST | HTTP/2 (HTTP/3 experimentell) |
| Client-Code | optional generiert | generierbar | immer generiert, stark typisiert |
| Datenmenge steuern | Endpunkte/Parameter | Client wählt Felder | feste Nachrichten (Field Masks möglich) |
| Streaming | SSE, WebSocket separat | Subscriptions | eingebaut, alle Richtungen |
| Browser | nativ | nativ | nur über gRPC-Web/Connect |
| HTTP-Caching | ✅ GET mit Cache-Headern | ❌ kaum (POST) | ❌ |
| Debugging | curl, Browser | GraphiQL, Browser | grpcurl, Postman |
| Typischer Einsatz | öffentliche APIs, Web | flexible Frontends mit vielen Datenquellen | interne Microservices, Mobile, Streaming |

**Entscheidungshilfe:**

- Öffentliche API für viele, unbekannte Konsumenten → **REST** (plus OpenAPI).
- Viele unterschiedliche Frontends mit sehr verschiedenen Datenbedürfnissen → **GraphQL**.
- Interne Dienst-zu-Dienst-Kommunikation, hohe Last, Streaming, viele Sprachen → **gRPC**.
- Gemischt ist normal: intern gRPC, am Rand ein REST- oder GraphQL-Gateway.

Weitere Hintergründe zu den API-Stilen findest du in [API-Stile im Vergleich](#/artikel/api-stile).

## Checkliste für produktive gRPC-Dienste

- [ ] \`.proto\`-Dateien versioniert (\`paket.v1\`), mit \`buf lint\` und \`buf breaking\` in CI geprüft
- [ ] Gelöschte Felder mit \`reserved\` gesperrt
- [ ] Jeder Client-Aufruf mit Deadline; Server reicht Restzeit weiter
- [ ] Passende Statuscodes, Fehlerdetails ohne interne Informationen
- [ ] TLS überall, mTLS oder Tokens zur Authentifizierung, Autorisierung in jeder Methode
- [ ] Retries nur für sichere Fälle, schreibende Methoden idempotent
- [ ] L7-Load-Balancing oder client-seitiges Balancing statt reinem TCP-Balancing
- [ ] Health-Check-Service, Metriken und Tracing pro Methode
- [ ] Nachrichtengrößen begrenzt, große Daten als Stream

> [!TIP] Übung
> 1. Ordne zu: Ein Benutzer will ein Todo löschen, das einem anderen gehört. Welcher Statuscode? Und wenn er gar nicht angemeldet ist?
> 2. Schreibe eine Service Config, die nur für \`GetTodo\` und \`ListTodos\` bei \`UNAVAILABLE\` bis zu dreimal wiederholt, aber nicht für \`CreateTodo\`.
> 3. Begründe, warum ein Kubernetes-Service vom Typ ClusterIP allein nicht für gleichmäßige Lastverteilung von gRPC-Aufrufen sorgt.

\`\`\`widget
quiz:gRPC 5
\`\`\`
`;export{e as default};
