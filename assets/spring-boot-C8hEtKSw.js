const e=`---
id: spring-boot
title: Spring Boot: Eine REST-API mit Java bauen
area: backend
difficulty: fortgeschritten
minutes: 24
order: 24
summary: Von start.spring.io zur getesteten REST-API – Dependency Injection, Controller, Service und Repository mit Spring Data JPA, Validierung, Fehlerantworten nach RFC 9457, Konfiguration mit Profilen, Tests mit MockMvc und die typischen JPA- und Transaktionsfallen.
tags: [Java, Spring Boot, REST, JPA, Hibernate, Backend, Testing]
related: [rest-api-design, fastapi-tutorial, node-express-api, orm-migrationen, indizes-transaktionen, testing]
---

## Was Spring Boot eigentlich ist

**Spring** ist ein Framework für Java-Anwendungen, dessen Kern ein [[Inversion of Control|IoC-Container]] ist: Er erzeugt Objekte, verdrahtet ihre Abhängigkeiten ([[Dependency Injection]]) und verwaltet ihren Lebenszyklus. **Spring Boot** setzt darauf auf und nimmt die Konfigurationsarbeit ab:

- **Starter:** Eine Abhängigkeit wie \`spring-boot-starter-web\` bringt alles für eine Web-API mit (Webserver, JSON-Bibliothek, Spring MVC).
- **Auto-Konfiguration:** Liegt eine Datenbank-Bibliothek im Klassenpfad und ist eine URL konfiguriert, richtet Boot automatisch einen [[Connection Pool]] und das ORM ein.
- **Eingebetteter Server:** Die Anwendung ist eine ausführbare JAR-Datei mit eingebautem Tomcat – kein separater Applikationsserver.

> [!INFO] Versionen
> Die Beispiele folgen dem Programmiermodell von Spring Boot 3: Java 17 oder neuer, Paketnamen \`jakarta.*\` statt \`javax.*\`. Die Grundideen sind seit Jahren stabil; prüfe beim Projektstart auf [start.spring.io](https://start.spring.io) die aktuelle Version und lies bei einem Hauptversionssprung die Migrationshinweise.

## Projekt anlegen

Auf start.spring.io (oder in IntelliJ IDEA) wählst du Build-Werkzeug, Java-Version und Abhängigkeiten. Für diese API: **Spring Web**, **Spring Data JPA**, **Validation**, **PostgreSQL Driver** (lokal reicht **H2**), **Spring Boot Actuator**. Ergebnis ist ein Gradle- oder Maven-Projekt mit einer Hauptklasse:

\`\`\`java title="src/main/java/de/beispiel/aufgaben/AufgabenApplication.java"
package de.beispiel.aufgaben;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication   // = Konfiguration + Auto-Konfiguration + Komponentensuche ab diesem Paket
public class AufgabenApplication {
    public static void main(String[] args) {
        SpringApplication.run(AufgabenApplication.class, args);
    }
}
\`\`\`

\`\`\`bash title="Starten"
./gradlew bootRun          # oder: ./mvnw spring-boot:run
curl localhost:8080/actuator/health
\`\`\`

> [!TIP] Paketstruktur
> Die Komponentensuche findet nur Klassen **im Paket der Hauptklasse und darunter**. Liegt ein Controller in \`de.beispiel.web\`, die Hauptklasse aber in \`de.beispiel.aufgaben\`, wird er nicht gefunden – ein häufiger Grund für 404 ohne Fehlermeldung.

## Die Schichten: Controller, Service, Repository

\`\`\`text title="Aufbau einer typischen Spring-Boot-API"
HTTP → Controller  (Routen, Ein-/Ausgabe-DTOs, Validierung, Statuscodes)
     → Service     (Fachlogik, Transaktionsgrenzen)
     → Repository  (Datenzugriff über Spring Data JPA)
     → Datenbank
\`\`\`

### Entity und Repository

Eine **JPA-Entity** bildet eine Tabelle ab. Spring Data erzeugt zur Laufzeit die Implementierung eines Repository-Interfaces – auch für Methoden, deren Abfrage sich aus dem **Methodennamen** ergibt.

\`\`\`java title="Aufgabe.java – die Entity"
@Entity
@Table(name = "aufgaben")
public class Aufgabe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String titel;

    private boolean erledigt;

    protected Aufgabe() {}                 // für JPA

    public Aufgabe(String titel) { this.titel = titel; }

    public Long getId() { return id; }
    public String getTitel() { return titel; }
    public boolean isErledigt() { return erledigt; }
    public void erledigen() { this.erledigt = true; }
}
\`\`\`

\`\`\`java title="AufgabenRepository.java"
public interface AufgabenRepository extends JpaRepository<Aufgabe, Long> {
    List<Aufgabe> findByErledigtFalseOrderByIdAsc();          // Abfrage aus dem Methodennamen
    boolean existsByTitelIgnoreCase(String titel);
}
\`\`\`

### Service mit Transaktionen

\`\`\`java title="AufgabenService.java"
@Service
public class AufgabenService {
    private final AufgabenRepository repo;

    public AufgabenService(AufgabenRepository repo) {   // Konstruktor-Injektion, kein @Autowired nötig
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    public List<Aufgabe> offene() {
        return repo.findByErledigtFalseOrderByIdAsc();
    }

    @Transactional
    public Aufgabe anlegen(String titel) {
        if (repo.existsByTitelIgnoreCase(titel)) {
            throw new DoppelteAufgabeException(titel);
        }
        return repo.save(new Aufgabe(titel));
    }

    @Transactional
    public Aufgabe erledigen(long id) {
        Aufgabe a = repo.findById(id).orElseThrow(() -> new AufgabeNichtGefundenException(id));
        a.erledigen();          // kein save() nötig: Änderungen an verwalteten Entities werden beim Commit geschrieben
        return a;
    }
}
\`\`\`

> [!BEGINNER] Was macht @Transactional?
> Spring legt um den Service einen **Proxy**. Beim Aufruf einer \`@Transactional\`-Methode öffnet er eine [[Transaktion]], ruft die Methode auf und schreibt beim normalen Ende alles fest (Commit). Wirft die Methode eine RuntimeException, wird alles zurückgerollt.

### Controller mit DTOs und Validierung

Die API sollte **nicht** direkt Entities ein- und ausgeben: Sonst bestimmt das Datenbankschema das API-Format, und Clients könnten Felder setzen, die sie nicht setzen dürfen (Overposting). Java-Records eignen sich gut als DTOs.

\`\`\`java title="AufgabenController.java"
@RestController
@RequestMapping("/api/aufgaben")
public class AufgabenController {

    public record NeueAufgabe(@NotBlank @Size(max = 200) String titel) {}
    public record AufgabeDto(long id, String titel, boolean erledigt) {
        static AufgabeDto von(Aufgabe a) { return new AufgabeDto(a.getId(), a.getTitel(), a.isErledigt()); }
    }

    private final AufgabenService service;

    public AufgabenController(AufgabenService service) { this.service = service; }

    @GetMapping
    public List<AufgabeDto> offene() {
        return service.offene().stream().map(AufgabeDto::von).toList();
    }

    @PostMapping
    public ResponseEntity<AufgabeDto> anlegen(@Valid @RequestBody NeueAufgabe neu) {
        Aufgabe a = service.anlegen(neu.titel());
        return ResponseEntity.created(URI.create("/api/aufgaben/" + a.getId())).body(AufgabeDto.von(a));
    }

    @PostMapping("/{id}/erledigen")
    public AufgabeDto erledigen(@PathVariable long id) {
        return AufgabeDto.von(service.erledigen(id));
    }
}
\`\`\`

\`@Valid\` prüft die Annotationen des Records (Bean Validation). Ist der Titel leer, antwortet Spring mit \`400 Bad Request\`, bevor dein Code läuft.

## Fehler als Problem Details

Für einheitliche Fehlerantworten gibt es den Standard **RFC 9457 „Problem Details for HTTP APIs“** (Nachfolger von RFC 7807). Spring unterstützt ihn mit der Klasse \`ProblemDetail\`. Eine zentrale \`@RestControllerAdvice\` übersetzt Ausnahmen in passende Antworten:

\`\`\`java title="FehlerHandler.java"
@RestControllerAdvice
public class FehlerHandler {

    @ExceptionHandler(AufgabeNichtGefundenException.class)
    ProblemDetail nichtGefunden(AufgabeNichtGefundenException e) {
        ProblemDetail p = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
        p.setTitle("Aufgabe nicht gefunden");
        return p;
    }

    @ExceptionHandler(DoppelteAufgabeException.class)
    ProblemDetail doppelt(DoppelteAufgabeException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, e.getMessage());
    }
}
\`\`\`

\`\`\`json title="Antwort auf POST /api/aufgaben/99/erledigen" norun
{
  "type": "about:blank",
  "title": "Aufgabe nicht gefunden",
  "status": 404,
  "detail": "Aufgabe 99 existiert nicht",
  "instance": "/api/aufgaben/99/erledigen"
}
\`\`\`

> [!SECURITY] Keine Interna nach außen
> Stack Traces, SQL-Fehlertexte oder Klassennamen gehören ins Log, nicht in die Antwort. Ein allgemeiner Handler für unerwartete Ausnahmen antwortet mit 500 und einer neutralen Meldung (plus einer Korrelations-ID, die im Log wiederzufinden ist).

## Konfiguration und Profile

Einstellungen stehen in \`application.yml\` (oder \`.properties\`) und lassen sich pro Umgebung über **Profile** und über Umgebungsvariablen überschreiben – Geheimnisse gehören nie ins Repository.

\`\`\`yaml title="src/main/resources/application.yml"
spring:
  datasource:
    url: \${DB_URL:jdbc:postgresql://localhost:5432/aufgaben}
    username: \${DB_USER:aufgaben}
    password: \${DB_PASSWORD}          # nur aus der Umgebung
  jpa:
    open-in-view: false               # siehe „Typische Fehler“
    hibernate:
      ddl-auto: validate              # Schema kommt aus Migrationen, nicht von Hibernate
management:
  endpoints:
    web:
      exposure:
        include: health,info          # nur, was wirklich gebraucht wird
---
spring:
  config:
    activate:
      on-profile: dev
  jpa:
    show-sql: true
\`\`\`

Das Datenbankschema verwaltest du mit einem Migrationswerkzeug wie **Flyway** oder **Liquibase** (Dateien im Repository, beim Start angewendet). \`ddl-auto: update\` ist für Experimente bequem, in Produktion aber gefährlich – siehe [ORM & Migrationen](#/artikel/orm-migrationen).

## Testen

Spring bietet „Test-Slices“, die nur einen Teil der Anwendung starten. \`@WebMvcTest\` lädt die Web-Schicht; der Service wird durch einen Mock ersetzt:

\`\`\`java title="AufgabenControllerTest.java"
@WebMvcTest(AufgabenController.class)
class AufgabenControllerTest {

    @Autowired MockMvc mvc;
    @MockitoBean AufgabenService service;     // in älteren Versionen: @MockBean

    @Test
    void leererTitelErgibt400() throws Exception {
        mvc.perform(post("/api/aufgaben").contentType(MediaType.APPLICATION_JSON).content("{\\"titel\\":\\"\\"}"))
           .andExpect(status().isBadRequest());
    }

    @Test
    void neueAufgabeErgibt201MitLocation() throws Exception {
        Aufgabe a = new Aufgabe("Steuer");
        ReflectionTestUtils.setField(a, "id", 7L);
        when(service.anlegen("Steuer")).thenReturn(a);

        mvc.perform(post("/api/aufgaben").contentType(MediaType.APPLICATION_JSON).content("{\\"titel\\":\\"Steuer\\"}"))
           .andExpect(status().isCreated())
           .andExpect(header().string("Location", "/api/aufgaben/7"))
           .andExpect(jsonPath("$.titel").value("Steuer"));
    }
}
\`\`\`

Für Repository- und Integrationstests mit einer echten Datenbank ist **Testcontainers** verbreitet: Der Test startet PostgreSQL in einem Docker-Container. So testest du gegen dieselbe Datenbank wie in Produktion statt gegen eine In-Memory-Datenbank mit anderem SQL-Dialekt. Grundlagen zur Teststrategie stehen in [Testing](#/artikel/testing).

## Typische Fehler

> [!MISTAKE] @Transactional wirkt nicht
> Ruft eine Methode **derselben Klasse** eine \`@Transactional\`-Methode auf (\`this.anlegen(...)\`), läuft der Aufruf am Proxy vorbei – es gibt keine Transaktion. Dasselbe gilt für \`private\`-Methoden. Lösung: Transaktionsgrenzen auf öffentliche Service-Methoden legen, die von außen aufgerufen werden.

- **[[N+1-Problem]]:** Eine Liste von 100 Bestellungen lädt beim Zugriff auf \`bestellung.getKunde()\` für jede einzeln den Kunden nach (Lazy Loading). Abhilfe: \`JOIN FETCH\` in der Abfrage oder \`@EntityGraph\` am Repository; im Log mit \`show-sql\` oder einem Abfragezähler sichtbar machen.
- **Open Session in View:** Spring Boot hält standardmäßig die Datenbanksitzung bis zum Ende der HTTP-Antwort offen (\`spring.jpa.open-in-view\`, beim Start mit einer Warnung gemeldet). Das verschleiert N+1-Probleme und hält Verbindungen unnötig lange. Mit \`false\` fallen fehlende Fetches früh als Fehler auf.
- **Feldinjektion** (\`@Autowired private Foo foo;\`): erschwert Tests und versteckt Abhängigkeiten. Konstruktorinjektion mit \`final\`-Feldern ist der Standard.
- **Entities als API-Format:** führt zu Overposting, Endlosschleifen bei bidirektionalen Beziehungen in JSON und \`LazyInitializationException\`.
- **\`ddl-auto: update\` in Produktion** statt versionierter Migrationen.
- **Alle Actuator-Endpunkte öffentlich**: \`env\`, \`heapdump\` oder \`configprops\` können Geheimnisse enthalten. Nur benötigte Endpunkte freigeben und absichern.

## Übungsfragen

> 1. Warum findet Spring einen \`@RestController\` nicht, obwohl er korrekt annotiert ist? Nenne die häufigste Ursache.
> 2. \`erledigen()\` ändert die Entity, ruft aber nie \`save()\` auf – warum wird die Änderung trotzdem gespeichert, und wann würde sie es nicht?
> 3. Welche Statuscodes liefert die API für: leerer Titel, doppelter Titel, unbekannte ID, erfolgreiches Anlegen?

\`\`\`widget
quiz:Spring Boot 5
\`\`\`

## Wie geht es weiter?

Wie man Ressourcen, Statuscodes und Versionierung einer API entwirft, steht in [REST-API-Design](#/artikel/rest-api-design). Dieselbe API mit Python zeigt [FastAPI-Tutorial](#/artikel/fastapi-tutorial); was beim ORM unter der Haube passiert, erklären [ORM & Migrationen](#/artikel/orm-migrationen) und [Indizes & Transaktionen](#/artikel/indizes-transaktionen).
`;export{e as default};
