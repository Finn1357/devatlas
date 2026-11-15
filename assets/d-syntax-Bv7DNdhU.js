const O=["Grundlagen","Kontrollfluss","Funktionen","Typen & OOP","Fehler & Module","Asynchronität","Daten & I/O","Qualität"],u=[{id:"kommentare",title:"Kommentare",group:"Grundlagen",summary:"Erklärende Texte im Code, die nicht ausgeführt werden – plus Doku-Kommentare für Werkzeuge.",explanation:"Gute Kommentare erklären das **Warum**, nicht das **Was** – das sollte der Code selbst ausdrücken. Viele Sprachen kennen zusätzlich **Doku-Kommentare** (JSDoc, Javadoc, Docstrings, `///`), aus denen Editoren Tooltips und Werkzeuge API-Dokumentation erzeugen.",pitfalls:["Auskommentierten Code nicht liegen lassen – dafür gibt es Git.","Veraltete Kommentare sind schlimmer als keine."]},{id:"variablen",title:"Variablen",group:"Grundlagen",summary:"Benannte Speicherplätze deklarieren und Werte zuweisen.",explanation:"Sprachen unterscheiden sich darin, ob man Variablen deklarieren muss, ob der Typ angegeben oder **inferiert** wird und ob Variablen standardmäßig veränderlich sind. Rust und Kotlin (`val`) bevorzugen Unveränderlichkeit, JavaScript nutzt `let`/`const`, Python bindet Namen einfach durch Zuweisung. Siehe [[Variable]], [[Scope]] und [[Typinferenz]].",pitfalls:["JavaScript: `var` hat Function-Scope und wird gehoisted – `let`/`const` verwenden.","Go meldet ungenutzte lokale Variablen als Compilerfehler."],glossary:["Variable","Scope","Typinferenz"]},{id:"konstanten",title:"Konstanten",group:"Grundlagen",summary:"Werte, die nach der Zuweisung nicht mehr geändert werden dürfen.",explanation:"Wichtig ist der Unterschied zwischen **Compile-Zeit-Konstanten** (`const` in C#, Go, Rust, C++ `constexpr`) und **nicht neu zuweisbaren Variablen** (`final` in Java, `const` in JavaScript, `val` in Kotlin). Letztere verhindern nur die Neuzuweisung – ein referenziertes Objekt kann trotzdem verändert werden. Python kennt keine echten Konstanten, nur die Konvention `GROSSBUCHSTABEN` (und `typing.Final` für Typprüfer).",pitfalls:["`const liste = []` in JS erlaubt weiterhin `liste.push(1)`."],glossary:["Konstante","Immutability"]},{id:"datentypen",title:"Datentypen",group:"Grundlagen",summary:"Primitive Typen: Ganzzahlen, Gleitkommazahlen, Booleans, Zeichen – und wie man den Typ prüft.",explanation:"Statisch typisierte Sprachen legen Typen zur Compile-Zeit fest, dynamische prüfen zur Laufzeit. Achte auf **Ganzzahlbreiten** (Überlauf in Java, C#, Go, Rust, C++), **Gleitkommaungenauigkeit** (`0.1 + 0.2`) und **Dezimaltypen** für Geld. JavaScript kennt nur `number` (64-Bit-Float) und `bigint`. Siehe [[Datentyp]], [[Float]], [[Integer]].",pitfalls:["Geldbeträge nie als `float`/`double` speichern.","Ganzzahldivision: `7 / 2` ist in Java, C, Go `3`, in Python 3 und JS `3.5`."],glossary:["Datentyp","Float","Integer","Statische Typisierung","Dynamische Typisierung"]},{id:"strings",title:"Strings & Interpolation",group:"Grundlagen",summary:"Texte erzeugen, verketten, formatieren und bearbeiten.",explanation:'In fast allen modernen Sprachen sind Strings **unveränderlich** – Operationen erzeugen neue Strings. Für Formatierung gibt es **Interpolation**: f-Strings (Python), Template Literals (JS), `$"…"` (C#), `"${…}"` (Kotlin), `format!` (Rust). Beim Zusammenbauen vieler Teile in Schleifen sind Builder (`StringBuilder`, `strings.Builder`, `join`) effizienter. Achtung bei Unicode: Die „Länge“ kann Bytes, UTF-16-Einheiten oder Codepoints bedeuten.',pitfalls:["Go `len(s)` und Rust `s.len()` zählen Bytes, nicht Zeichen.",'JavaScript `"😀".length` ist 2 (UTF-16-Einheiten).'],glossary:["String","Unicode","UTF-8"]},{id:"arrays",title:"Arrays & Listen",group:"Grundlagen",summary:"Geordnete Sammlungen: anlegen, zugreifen, anhängen, transformieren.",explanation:"Man unterscheidet **Arrays fester Größe** (Java `int[]`, Go `[3]int`, Rust `[i32; 3]`) und **dynamische Listen** (Python `list`, JS `Array`, Java `ArrayList`, Go-Slices, Rust `Vec`). Moderne Sprachen bieten funktionale Operationen wie `map`, `filter`, `reduce` bzw. Comprehensions. Siehe [[Array]], [[Liste]].",pitfalls:["Indexzugriff außerhalb der Grenzen: Exception (Java, Python), `undefined` (JS), Panic (Go, Rust), undefiniertes Verhalten (C/C++).","Go-Slices teilen sich ggf. das zugrunde liegende Array."],glossary:["Array","Liste","Higher-Order Function"]},{id:"maps",title:"Dictionaries & Maps",group:"Grundlagen",summary:"Schlüssel-Wert-Sammlungen: einfügen, nachschlagen, iterieren.",explanation:"Meist als [[Hashtabelle]] implementiert (Zugriff im Mittel O(1)). Unterschiede gibt es bei der **Reihenfolge** (Python-`dict` und JS-`Map` behalten die Einfügereihenfolge, Go-Maps iterieren absichtlich zufällig) und beim Verhalten für **fehlende Schlüssel** (Exception, `null`, Default-Wert oder `Option`).",pitfalls:['Python: `d["x"]` wirft `KeyError` – `d.get("x")` liefert `None`.',"Go: Zugriff auf fehlenden Schlüssel liefert den Nullwert; mit `v, ok := m[k]` prüfen.","JS: Für dynamische Schlüssel `Map` statt Objekt-Literal verwenden."],glossary:["Dictionary","Hashtabelle","Set"]},{id:"bedingungen",title:"Bedingungen (if/else)",group:"Kontrollfluss",summary:"Code abhängig von Bedingungen ausführen – inklusive Ternary-Ausdrücken.",explanation:"Die Grundform ist überall gleich, die Details unterscheiden sich: Python nutzt Einrückung und `elif`, Go und Rust brauchen keine Klammern um die Bedingung, in Rust und Kotlin ist `if` ein **Ausdruck**, der einen Wert liefert. Viele Sprachen werten „truthy“/„falsy“-Werte aus – Java, C#, Go und Rust verlangen dagegen echte Booleans.",pitfalls:["JavaScript: `if (liste.length)` vs. `if (liste)` – ein leeres Array ist truthy!","Zuweisung statt Vergleich (`if (x = 5)`) – in C/C++/JS gültig und fatal."],glossary:["Bedingung","Boolean","Ausdruck"]},{id:"switch",title:"Switch & Pattern Matching",group:"Kontrollfluss",summary:"Mehrfachverzweigungen – vom klassischen switch bis zum vollständigen Musterabgleich.",explanation:"Das klassische `switch` (C, Java alt, JS) vergleicht auf Gleichheit und „fällt durch“, wenn `break` fehlt. Moderne Varianten sind **Ausdrücke** ohne Fall-Through und mit **Pattern Matching**: Rust `match`, Kotlin `when`, C# `switch`-Ausdrücke, Java 21 `switch` mit Patterns, Python 3.10 `match`. Mit [[Enum|Enums]] bzw. sealed Types prüft der Compiler auf **Vollständigkeit**.",pitfalls:["Fehlendes `break` in C/C++/JS/klassischem Java führt zum Durchfallen in den nächsten Fall.","Python `match` ist kein switch auf Werte allein – bloße Namen in `case` binden Variablen!"],glossary:["Pattern Matching","Enum"]},{id:"for",title:"For-Schleifen",group:"Kontrollfluss",summary:"Zählschleifen und das Iterieren über Sammlungen.",explanation:"Neben der klassischen C-Zählschleife `for (i = 0; i < n; i++)` bieten fast alle Sprachen eine **for-each**-Form über Iterables. Python hat nur die for-each-Form (`for x in …`) mit `range()` für Zahlenfolgen. Go hat nur ein Schleifenschlüsselwort: `for`. Index und Wert gleichzeitig: `enumerate` (Python), `entries()` (JS), `range` (Go), `iter().enumerate()` (Rust), `withIndex()` (Kotlin).",pitfalls:["JS: `for…in` iteriert über Schlüssel (auch geerbte), `for…of` über Werte.","Off-by-one: `<=` statt `<` greift über das Ende hinaus."],glossary:["Schleife","Iteration","Iterator"]},{id:"while",title:"While-Schleifen",group:"Kontrollfluss",summary:"Wiederholen, solange eine Bedingung gilt – inklusive Endlosschleifen mit break.",explanation:"`while` prüft die Bedingung vor jedem Durchlauf, `do…while` (Java, C#, JS, C++, Kotlin) erst danach, sodass der Körper mindestens einmal läuft. Go nutzt `for bedingung { }`, Rust bietet `loop` für Endlosschleifen, das sogar einen Wert per `break wert` zurückgeben kann.",pitfalls:["Endlosschleife, weil die Bedingungsvariable nie verändert wird."],glossary:["Schleife"]},{id:"funktionen",title:"Funktionen",group:"Funktionen",summary:"Funktionen definieren: Parameter, Rückgabewerte, Default- und benannte Argumente.",explanation:"Unterschiede: Typangaben (statisch vs. dynamisch), **Default-Parameter**, **benannte Argumente** (Python, Kotlin, C#, Swift), **mehrere Rückgabewerte** (Go, Python über Tupel), variadische Parameter und ob Funktionen Ausdrücke sind (in Rust und Kotlin ist der letzte Ausdruck der Rückgabewert). Siehe [[Funktion]], [[Parameter]], [[Argument]].",pitfalls:["Python: veränderliche Default-Argumente werden zwischen Aufrufen geteilt.","Rust: Ein Semikolon nach dem letzten Ausdruck macht aus dem Rückgabewert `()`."],glossary:["Funktion","Parameter","Argument","Rückgabewert"]},{id:"lambdas",title:"Lambdas & Arrow Functions",group:"Funktionen",summary:"Anonyme Funktionen, Closures und Funktionen höherer Ordnung.",explanation:"Lambdas sind kurze, oft namenlose Funktionen – typisch als Argument für `map`, `filter`, `sort` oder Event-Handler. Sie können Variablen aus dem umgebenden Scope einfangen ([[Closure]]). Unterschiede: Python-Lambdas dürfen nur einen Ausdruck enthalten; JS-Arrow-Functions binden `this` lexikalisch; Java-Lambdas dürfen nur „effectively final“-Variablen einfangen; Rust-Closures unterscheiden `Fn`, `FnMut` und `FnOnce`.",pitfalls:["C++: Capture per Referenz `[&]` auf lokale Variablen, die nicht mehr existieren → Dangling Reference."],glossary:["Lambda","Closure","Higher-Order Function"]},{id:"klassen",title:"Klassen & Objekte",group:"Typen & OOP",summary:"Datentypen mit Feldern und Methoden definieren und instanziieren.",explanation:"Klassische OOP-Sprachen (Java, C#, C++, Kotlin, PHP, Python, TS) haben Klassen mit Konstruktoren und Methoden. **Go und Rust haben keine Klassen** – dort definiert man Structs und hängt Methoden an (`func (p Person) …` bzw. `impl Person`). Viele Sprachen bieten kompakte Datenklassen: Python `@dataclass`, Java/C# `record`, Kotlin `data class`. Siehe [[Klasse]], [[Objekt]], [[Konstruktor]].",pitfalls:["Python: `self` muss als erster Parameter jeder Instanzmethode explizit stehen.","C++: Bei polymorphen Basisklassen virtuellen Destruktor nicht vergessen."],glossary:["Klasse","Objekt","Instanz","Konstruktor","Kapselung"]},{id:"interfaces",title:"Interfaces & Traits",group:"Typen & OOP",summary:"Verträge definieren, die verschiedene Typen erfüllen können.",explanation:"Interfaces beschreiben, **was** ein Typ kann, nicht **wie**. In Java, C#, PHP und Kotlin implementiert man sie explizit (`implements`, `:`), in **Go und TypeScript strukturell/implizit** – passt die Form, passt der Typ. Rust nennt das Konzept [[Trait]], Python bietet `Protocol` (strukturell) und abstrakte Basisklassen, C++ nutzt abstrakte Klassen bzw. seit C++20 Concepts.",pitfalls:["Zu große Interfaces erschweren Implementierung und Tests (Interface Segregation Principle)."],glossary:["Interface","Trait","Polymorphie","Abstrakte Klasse"]},{id:"vererbung",title:"Vererbung",group:"Typen & OOP",summary:"Klassen von anderen ableiten, Methoden überschreiben, Elternmethoden aufrufen.",explanation:"Vererbung modelliert eine „ist-ein“-Beziehung. Kotlin-Klassen sind standardmäßig `final` (Ableitung nur mit `open`), C# und Kotlin verlangen `override` explizit. **Go und Rust kennen keine Vererbung** – stattdessen Komposition, Embedding (Go) und Traits mit Default-Methoden (Rust). Leitsatz: [[Komposition]] statt Vererbung, wo möglich.",pitfalls:["Tiefe Hierarchien („fragile base class“) machen Änderungen riskant."],glossary:["Vererbung","Overriding","Polymorphie","Komposition"]},{id:"generics",title:"Generics",group:"Typen & OOP",summary:"Typsichere, wiederverwendbare Funktionen und Datenstrukturen mit Typparametern.",explanation:"Generics erlauben Code wie „eine Liste von T“, ohne für jeden Typ eine eigene Implementierung zu schreiben – und ohne Typsicherheit aufzugeben. Umsetzung: **Type Erasure** (Java, TypeScript), **reifiziert** (C#), **Monomorphisierung** (Rust, C++ Templates, Go teilweise). Constraints schränken erlaubte Typen ein. Dynamische Sprachen brauchen keine Generics; Python hat sie für Type Hints.",pitfalls:["Java: `new T()` oder `instanceof List<String>` sind wegen Type Erasure nicht möglich."],glossary:["Generics","Polymorphie"]},{id:"null",title:"Null & Optionals",group:"Typen & OOP",summary:"Mit fehlenden Werten sicher umgehen: null, None, nil, Option, Optional Chaining.",explanation:"Das Fehlen eines Werts ist eine der häufigsten Fehlerquellen. Moderne Sprachen machen es im Typ sichtbar: Kotlin `String?`, Swift Optionals, Rust `Option<T>`, C# Nullable Reference Types, TypeScript mit `strictNullChecks`. Operatoren wie **Optional Chaining** (`?.`) und **Null-Coalescing** (`??`, `?:`) machen den Umgang knapp. Siehe [[Null-Safety]] und [[Optional]].",pitfalls:['JS: `||` ersetzt auch `0` und `""` – für „nur null/undefined“ `??` verwenden.'],glossary:["Null","Null-Safety","Optional"]},{id:"exceptions",title:"Fehlerbehandlung",group:"Fehler & Module",summary:"Fehler werfen, fangen und weitergeben – Exceptions vs. Fehlerwerte.",explanation:"Zwei Philosophien: **Exceptions** (Java, Python, JS, C#, C++, PHP, Kotlin) springen aus dem normalen Kontrollfluss zum nächsten passenden `catch`. **Fehlerwerte** (Go `error`, Rust `Result<T, E>`) sind normale Rückgabewerte, die man explizit prüft – der Fehlerpfad ist sichtbar. Unabhängig davon gilt: spezifische Fehler fangen, Kontext hinzufügen, Ressourcen sicher freigeben (`finally`, `with`, `using`, `defer`, RAII). Siehe [[Exception]].",pitfalls:["Leere catch-Blöcke verschlucken Fehler.","Java: Checked Exceptions müssen deklariert oder behandelt werden."],glossary:["Exception","Stack Trace"]},{id:"module",title:"Module, Imports & Exports",group:"Fehler & Module",summary:"Code auf Dateien und Pakete aufteilen und wiederverwenden.",explanation:"Module schaffen Namensräume und Kapselung. JavaScript hat ES Modules (`import`/`export`) und das ältere CommonJS (`require`). In Python ist jede Datei ein Modul. Java und Kotlin nutzen Packages, C# Namespaces, Go Packages (Großschreibung = exportiert), Rust `mod`/`pub`/`use`, C++ klassisch Header (`#include`) und seit C++20 Module. Siehe [[Modul]], [[Paket]].",pitfalls:["Zyklische Imports führen in Python und JS zu halb initialisierten Modulen.","Go: Kleingeschriebene Namen sind außerhalb des Packages unsichtbar."],glossary:["Modul","Paket","Import","Namespace"]},{id:"async",title:"Async/Await",group:"Asynchronität",summary:"Asynchronen Code (I/O, Netzwerk) lesbar wie sequenziellen Code schreiben.",explanation:"`async` markiert eine Funktion, die pausieren kann; `await` wartet auf ein Ergebnis, **ohne den Thread zu blockieren**. Andere Aufgaben laufen währenddessen weiter (über eine [[Event Loop]] oder einen Scheduler). Ideal für viele gleichzeitige I/O-Operationen. **Go** braucht kein async/await – Goroutinen blockieren billig. **Java** setzt mit virtuellen Threads (seit 21) ebenfalls auf blockierenden Stil. Siehe [[Async/Await]].",pitfalls:["Mehrere unabhängige `await` nacheinander laufen sequenziell – parallel mit `Promise.all`, `asyncio.gather`, `Task.WhenAll`.","Blockierende Aufrufe (z. B. `time.sleep`) in async-Code frieren die Event Loop ein."],glossary:["Async/Await","Event Loop","Coroutine"]},{id:"futures",title:"Promises, Futures & Threads",group:"Asynchronität",summary:"Platzhalter für spätere Ergebnisse und parallele Ausführung.",explanation:"Unter `async/await` liegt ein Objekt, das ein zukünftiges Ergebnis repräsentiert: [[Promise]] (JS), `Task` (C#), `CompletableFuture` (Java), `Future` (Rust, Dart, Python `asyncio`), `Deferred` (Kotlin). Für echte **Parallelität** auf mehreren Kernen gibt es Threads, Thread-Pools, Goroutinen oder Prozesse. Siehe [[Future]], [[Nebenläufigkeit]], [[Parallelität]].",pitfalls:["Unbehandelte Promise-Rejections beenden in Node.js den Prozess.","Geteilte veränderliche Daten zwischen Threads → Race Conditions."],glossary:["Promise","Future","Thread","Goroutine","Race Condition"]},{id:"dateien",title:"Dateien lesen & schreiben",group:"Daten & I/O",summary:"Textdateien sicher öffnen, lesen, schreiben und wieder schließen.",explanation:"Wichtig sind drei Dinge: **Ressourcen garantiert schließen** (`with`, try-with-resources, `using`, `defer`, RAII), **Encoding explizit angeben** (UTF-8) und **Fehler behandeln** (Datei fehlt, keine Rechte). Für große Dateien zeilenweise bzw. gestreamt lesen statt alles in den Speicher zu laden.",pitfalls:["Windows: Standard-Encoding ist nicht immer UTF-8 – immer explizit angeben.","Pfade mit APIs zusammensetzen (`pathlib`, `path.join`, `Path.of`) statt mit String-Verkettung."],glossary:["Dateisystem","Pfad","Encoding"]},{id:"http",title:"HTTP-Anfragen",group:"Daten & I/O",summary:"Daten von einer Web-API abrufen und Statuscodes prüfen.",explanation:"Fast jede Sprache bringt einen HTTP-Client mit oder hat einen De-facto-Standard (Python `requests`/`httpx`, Rust `reqwest`). Gute Praxis: **Timeouts setzen**, **Statuscode prüfen** (viele Clients werfen bei 404/500 nicht automatisch!), Antworten validieren und Client-Instanzen wiederverwenden. Siehe [[HTTP]], [[Statuscode]], [[Fetch API]].",pitfalls:["JS `fetch` wirft bei HTTP-Fehlern nicht – `res.ok` prüfen.","Ohne Timeout kann eine Anfrage ewig hängen (Python `requests` hat standardmäßig keinen)."],glossary:["HTTP","Statuscode","API","JSON"]},{id:"json",title:"JSON verarbeiten",group:"Daten & I/O",summary:"Objekte in JSON serialisieren und JSON in typisierte Strukturen parsen.",explanation:"Dynamische Sprachen parsen [[JSON]] direkt in Dicts/Objekte. Statisch typisierte Sprachen bilden JSON auf Klassen/Structs ab – über Reflection oder Annotationen (Jackson, `System.Text.Json`, Go-Struct-Tags) bzw. Code-Generierung (Rust `serde`, Kotlin `kotlinx.serialization`). Externe Daten immer **validieren**: Die Struktur kann von der Erwartung abweichen.",pitfalls:["Große Ganzzahlen (> 2⁵³) verlieren in JavaScript Präzision.","Datumswerte sind in JSON nur Strings – Format (ISO 8601) vereinbaren."],glossary:["JSON","Serialisierung"]},{id:"datenbank",title:"Datenbankabfragen",group:"Daten & I/O",summary:"Parametrisierte SQL-Abfragen aus dem Code ausführen.",explanation:"Unabhängig von der Sprache gilt eine Regel: **Werte immer als Parameter übergeben**, nie per String-Verkettung ins SQL einbauen – das verhindert [[SQL Injection]]. Die Platzhalter-Syntax unterscheidet sich je Treiber (`?`, `$1`, `%s`, `:name`, `@name`). Verbindungen sollten aus einem [[Connection Pool]] kommen und sicher geschlossen werden. Für größere Projekte bieten [[ORM|ORMs]] Komfort.",pitfalls:["f-Strings/Template-Literals in SQL sind ein Sicherheitsrisiko.","Verbindungen nicht schließen erschöpft den Pool."],glossary:["Prepared Statement","SQL Injection","ORM","Connection Pool"]},{id:"regex",title:"Reguläre Ausdrücke",group:"Daten & I/O",summary:"Muster in Texten suchen, prüfen, extrahieren und ersetzen.",explanation:"Die Grundsyntax (`\\d`, `\\w`, `+`, `*`, `?`, `[…]`, `(…)`, `^`, `$`) ist weitgehend gleich, aber die **Dialekte** unterscheiden sich: Named Groups, Lookbehind, Unicode-Klassen. Go und Rust nutzen RE2-artige Engines ohne Backtracking (linear, aber ohne Rückverweise) – das schützt vor ReDoS. Probiere Muster im [Regex-Labor](#/labor/regex) aus. Siehe [[Regulärer Ausdruck]].",pitfalls:['In Strings müssen Backslashes oft doppelt geschrieben werden – Raw Strings nutzen (`r"…"`, `@"…"`, `` String.raw ``).',"Verschachtelte Quantoren wie `(a+)+` können exponentielles Backtracking auslösen."],glossary:["Regulärer Ausdruck"]},{id:"tests",title:"Unit Tests",group:"Qualität",summary:"Automatisierte Tests mit dem Standard-Test-Framework der Sprache.",explanation:"Ein guter [[Unit Test]] ist schnell, unabhängig und prüft genau ein Verhalten (Arrange–Act–Assert). Manche Sprachen bringen Testwerkzeuge mit (Go `testing`, Rust `#[test]`), andere nutzen De-facto-Standards (pytest, JUnit, Vitest/Jest, xUnit, PHPUnit). Tests laufen lokal und in jeder [[CI/CD]]-Pipeline.",pitfalls:["Tests, die von Reihenfolge, Zeit oder Netzwerk abhängen, werden „flaky“."],glossary:["Unit Test","TDD","Mocking","Testpyramide"]}],K=Object.fromEntries(u.map(e=>[e.id,e])),c={kommentare:`# Einzeiliger Kommentar

def flaeche(r: float) -> float:
    """Docstring: berechnet die Kreisfläche.

    Wird von help() und IDEs angezeigt.
    """
    return 3.14159 * r ** 2`,variablen:`name = "Ada"          # Typ wird zur Laufzeit bestimmt
alter: int = 36       # optionaler Type Hint
x, y = 10, 20         # Mehrfachzuweisung
x, y = y, x           # Tausch ohne Hilfsvariable
alter += 1`,konstanten:{code:`from typing import Final

MAX_VERSUCHE: Final = 3   # Konvention + Hinweis für Typprüfer
PI = 3.14159              # Großbuchstaben = "bitte nicht ändern"`,note:"Python kennt keine echten Konstanten. `Final` wird nur von Typprüfern wie mypy durchgesetzt, nicht zur Laufzeit."},datentypen:`ganz = 42                  # int (beliebig groß)
komma = 3.14               # float (64 Bit)
wahr = True                # bool
text = "Hallo"             # str
nichts = None              # NoneType

print(type(ganz))          # <class 'int'>
print(isinstance(komma, float))  # True
print(7 / 2, 7 // 2)       # 3.5  3  (echte vs. ganzzahlige Division)`,strings:`name = "Ada"
gruss = f"Hallo, {name}! Du hast {3 * 2} Nachrichten."
mehrzeilig = """Zeile 1
Zeile 2"""

print(name.upper(), name.lower(), len(name))
print("a,b,c".split(","))          # ['a', 'b', 'c']
print(" - ".join(["x", "y"]))      # x - y
print("Hallo"[1:4])                # all (Slicing)
print(f"{3.14159:.2f}")            # 3.14`,arrays:`zahlen = [3, 1, 4]
zahlen.append(1)            # anhängen
zahlen.insert(0, 9)         # an Position einfügen
erstes, letztes = zahlen[0], zahlen[-1]
teil = zahlen[1:3]          # Slice

quadrate = [z * z for z in zahlen]          # List Comprehension
gerade = [z for z in zahlen if z % 2 == 0]
sortiert = sorted(zahlen, reverse=True)
print(len(zahlen), sum(zahlen), max(zahlen))`,maps:`alter = {"Ada": 36, "Linus": 28}
alter["Grace"] = 45                # einfügen/ändern
print(alter.get("Tim", 0))         # Default statt KeyError
if "Ada" in alter:
    del alter["Ada"]

for name, jahre in alter.items():
    print(name, jahre)

zaehler = {w: len(w) for w in ["hi", "hallo"]}   # Dict Comprehension`,bedingungen:`temperatur = 23

if temperatur > 30:
    print("heiß")
elif temperatur > 15:
    print("angenehm")
else:
    print("kalt")

status = "volljährig" if alter >= 18 else "minderjährig"   # Ternary
if 0 < temperatur < 40:          # verkettete Vergleiche
    print("im Messbereich")`,switch:{code:`def beschreibe(befehl):
    match befehl:
        case "start":
            return "Starte …"
        case "stop" | "halt":
            return "Stoppe …"
        case {"aktion": "gehe", "ziel": ziel}:   # Dict-Pattern
            return f"Gehe nach {ziel}"
        case [x, y]:                              # Sequenz-Pattern
            return f"Koordinate {x}/{y}"
        case _:
            return "Unbekannt"`,note:"`match` gibt es seit Python 3.10. Vorsicht: Ein bloßer Name in `case` (z. B. `case wert:`) vergleicht nicht, sondern bindet eine neue Variable!"},for:`for i in range(5):              # 0, 1, 2, 3, 4
    print(i)

for frucht in ["Apfel", "Birne"]:
    print(frucht)

for i, frucht in enumerate(["Apfel", "Birne"], start=1):
    print(i, frucht)

for name, punkte in zip(["Ada", "Tim"], [90, 75]):
    print(name, punkte)`,while:`versuche = 0
while versuche < 3:
    versuche += 1

while True:                      # Endlosschleife mit Abbruch
    eingabe = input("Befehl: ")
    if eingabe == "ende":
        break
    if not eingabe:
        continue                 # nächster Durchlauf`,funktionen:`def begruesse(name: str, gruss: str = "Hallo") -> str:
    return f"{gruss}, {name}!"

begruesse("Ada")                       # Positionsargument
begruesse(gruss="Moin", name="Tim")    # benannte Argumente

def summe(*zahlen: int) -> int:        # beliebig viele Argumente
    return sum(zahlen)

def min_max(werte):
    return min(werte), max(werte)      # Tupel = mehrere Rückgabewerte

kleinster, groesster = min_max([3, 9, 1])`,lambdas:`quadrat = lambda x: x * x
print(quadrat(4))                                   # 16

namen = ["ada", "Linus", "grace"]
print(sorted(namen, key=lambda n: n.lower()))
print(list(map(lambda x: x * 2, [1, 2, 3])))        # [2, 4, 6]

def multiplikator(faktor):
    return lambda x: x * faktor                     # Closure
verdopple = multiplikator(2)`,klassen:`from dataclasses import dataclass

class Konto:
    def __init__(self, inhaber: str, saldo: float = 0.0):
        self.inhaber = inhaber
        self._saldo = saldo          # _ = "intern" (Konvention)

    def einzahlen(self, betrag: float) -> None:
        if betrag <= 0:
            raise ValueError("Betrag muss positiv sein")
        self._saldo += betrag

    @property
    def saldo(self) -> float:
        return self._saldo

@dataclass(frozen=True)              # erzeugt __init__, __eq__, __repr__
class Punkt:
    x: float
    y: float

k = Konto("Ada")
k.einzahlen(50)
print(k.saldo, Punkt(1, 2))`,interfaces:{code:`from typing import Protocol
from abc import ABC, abstractmethod

class Zeichenbar(Protocol):          # strukturell: wer zeichne() hat, passt
    def zeichne(self) -> str: ...

class Form(ABC):                     # nominal: abstrakte Basisklasse
    @abstractmethod
    def flaeche(self) -> float: ...

class Quadrat(Form):
    def __init__(self, a: float): self.a = a
    def flaeche(self) -> float: return self.a ** 2
    def zeichne(self) -> str: return "□"

def render(x: Zeichenbar) -> None:
    print(x.zeichne())

render(Quadrat(2))`,note:"Python setzt auf Duck Typing. `Protocol` macht das für Typprüfer sichtbar; `ABC` verhindert zur Laufzeit die Instanziierung unvollständiger Klassen."},vererbung:`class Tier:
    def __init__(self, name: str):
        self.name = name

    def laut(self) -> str:
        return "..."

class Hund(Tier):
    def __init__(self, name: str, rasse: str):
        super().__init__(name)         # Elternkonstruktor
        self.rasse = rasse

    def laut(self) -> str:             # überschreiben
        return "Wuff"

for t in [Tier("?"), Hund("Bello", "Mops")]:
    print(t.name, t.laut())            # Polymorphie`,generics:{code:`from typing import TypeVar, Generic, Sequence

T = TypeVar("T")

def erstes(liste: Sequence[T]) -> T | None:
    return liste[0] if liste else None

class Stapel(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []
    def push(self, x: T) -> None:
        self._items.append(x)
    def pop(self) -> T:
        return self._items.pop()

# Ab Python 3.12 kürzer:
def letztes[T](liste: list[T]) -> T:
    return liste[-1]`,note:"Generics in Python existieren nur für Typprüfer (mypy, Pyright) – zur Laufzeit wird nichts geprüft."},null:`name: str | None = None

if name is None:                     # Vergleich mit "is", nicht "=="
    print("kein Name")

laenge = len(name) if name else 0
anzeige = name or "Unbekannt"        # Achtung: ersetzt auch ""

benutzer = {"profil": None}
stadt = (benutzer.get("profil") or {}).get("stadt")   # kein ?. in Python`,exceptions:`class ZuWenigGuthaben(Exception):
    pass

def abheben(saldo: float, betrag: float) -> float:
    if betrag > saldo:
        raise ZuWenigGuthaben(f"Fehlen {betrag - saldo:.2f} €")
    return saldo - betrag

try:
    neuer_saldo = abheben(50, 80)
except ZuWenigGuthaben as e:
    print("Fehler:", e)
except (TypeError, ValueError):
    print("Ungültige Eingabe")
else:
    print("Erfolg:", neuer_saldo)
finally:
    print("wird immer ausgeführt")`,module:`# datei: geometrie.py
PI = 3.14159
def flaeche(r): return PI * r * r
__all__ = ["flaeche"]           # was "from geometrie import *" exportiert

# datei: main.py
import geometrie
from geometrie import flaeche
from math import sqrt as wurzel
import json, os

print(geometrie.flaeche(2), flaeche(2), wurzel(16))`,async:`import asyncio
import httpx

async def lade(client: httpx.AsyncClient, url: str) -> int:
    res = await client.get(url, timeout=5)
    return res.status_code

async def main():
    urls = ["https://example.com", "https://python.org"]
    async with httpx.AsyncClient() as client:
        # parallel statt nacheinander:
        codes = await asyncio.gather(*(lade(client, u) for u in urls))
    print(codes)

asyncio.run(main())`,futures:`from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

def schwer(n: int) -> int:
    return sum(i * i for i in range(n))

# Threads: gut für I/O (Netzwerk, Dateien)
with ThreadPoolExecutor(max_workers=4) as pool:
    future = pool.submit(schwer, 10_000)
    print(future.result())            # wartet auf das Ergebnis

# Prozesse: echte Parallelität für CPU-Last (umgeht den GIL)
if __name__ == "__main__":
    with ProcessPoolExecutor() as pool:
        print(list(pool.map(schwer, [10**6, 10**6, 10**6])))`,dateien:`from pathlib import Path

pfad = Path("notizen.txt")
pfad.write_text("Zeile 1\\nZeile 2\\n", encoding="utf-8")

inhalt = pfad.read_text(encoding="utf-8")

with pfad.open("a", encoding="utf-8") as f:     # anhängen
    f.write("Zeile 3\\n")

with pfad.open(encoding="utf-8") as f:          # zeilenweise (speicherschonend)
    for nr, zeile in enumerate(f, 1):
        print(nr, zeile.rstrip())

print(pfad.exists(), pfad.suffix, list(Path(".").glob("*.txt")))`,http:`import requests   # pip install requests

res = requests.get(
    "https://api.github.com/repos/python/cpython",
    headers={"Accept": "application/json"},
    timeout=10,                      # ohne Timeout wartet requests ewig!
)
res.raise_for_status()               # wirft bei 4xx/5xx
daten = res.json()
print(daten["stargazers_count"])

neu = requests.post("https://httpbin.org/post", json={"name": "Ada"}, timeout=10)
print(neu.status_code)`,json:`import json
from dataclasses import dataclass, asdict

@dataclass
class Nutzer:
    name: str
    alter: int

text = json.dumps(asdict(Nutzer("Ada", 36)), ensure_ascii=False, indent=2)
daten = json.loads('{"name": "Tim", "alter": 15}')
nutzer = Nutzer(**daten)

with open("nutzer.json", "w", encoding="utf-8") as f:
    json.dump(daten, f, ensure_ascii=False)
# Für Validierung externer Daten: pydantic`,datenbank:`import sqlite3

with sqlite3.connect("shop.db") as conn:
    conn.execute("CREATE TABLE IF NOT EXISTS kunden (id INTEGER PRIMARY KEY, name TEXT, stadt TEXT)")
    conn.execute("INSERT INTO kunden (name, stadt) VALUES (?, ?)", ("Ada", "Berlin"))

    stadt = "Berlin"
    # Parameter mit ? – NIE per f-String ins SQL!
    for row in conn.execute("SELECT id, name FROM kunden WHERE stadt = ?", (stadt,)):
        print(row)`,regex:`import re

text = "Bestellung 4711 am 2026-11-05, Bestellung 815 am 2026-11-06"

print(re.findall(r"\\d{4}-\\d{2}-\\d{2}", text))     # alle Datumswerte
m = re.search(r"Bestellung (?P<nr>\\d+)", text)
print(m.group("nr"))                                 # 4711

print(re.sub(r"\\d{4}-(\\d{2})-(\\d{2})", r"\\2.\\1.", text))   # umformatieren
plz = re.compile(r"^\\d{5}$")
print(bool(plz.match("10115")))`,tests:`# datei: test_rechner.py   –   ausführen mit: pytest
import pytest
from rechner import addiere, teile

def test_addiere():
    assert addiere(2, 3) == 5

@pytest.mark.parametrize("a,b,erwartet", [(1, 1, 2), (-1, 1, 0), (0, 0, 0)])
def test_addiere_viele(a, b, erwartet):
    assert addiere(a, b) == erwartet

def test_teilen_durch_null():
    with pytest.raises(ZeroDivisionError):
        teile(1, 0)`},d={kommentare:`// Einzeiliger Kommentar
/* Mehrzeiliger
   Kommentar */

/**
 * JSDoc: wird von Editoren als Tooltip angezeigt.
 * @param {number} r Radius
 * @returns {number} Fläche
 */
function flaeche(r) {
  return Math.PI * r ** 2;
}`,variablen:`let zaehler = 0;        // veränderlich, block-scoped
zaehler += 1;
const name = 'Ada';     // nicht neu zuweisbar
var alt = 'meiden';     // function-scoped, gehoisted – nicht mehr verwenden

let [a, b] = [1, 2];    // Destructuring
[a, b] = [b, a];        // Tausch
const { stadt, plz = '00000' } = { stadt: 'Berlin' };  // mit Default`,konstanten:{code:`const MAX_VERSUCHE = 3;
// MAX_VERSUCHE = 4;   // TypeError: Assignment to constant variable

const config = { modus: 'dev' };
config.modus = 'prod';           // erlaubt! Nur die Bindung ist konstant

const eingefroren = Object.freeze({ modus: 'dev' });
eingefroren.modus = 'prod';      // wird ignoriert (im Strict Mode: TypeError)`,note:"`const` verhindert nur die Neuzuweisung. `Object.freeze` friert flach ein – verschachtelte Objekte bleiben veränderlich."},datentypen:`const zahl = 42;              // number (64-Bit-Float, auch für Ganzzahlen)
const gross = 9007199254740993n; // bigint
const wahr = true;            // boolean
const text = 'Hallo';         // string
const nichts = null;          // bewusst "kein Wert"
let unbekannt;                // undefined
const id = Symbol('id');      // symbol

console.log(typeof zahl, typeof null);  // "number" "object" (historischer Bug)
console.log(0.1 + 0.2);                 // 0.30000000000000004
console.log(Number.isInteger(5.0));     // true`,strings:`const name = 'Ada';
const gruss = \`Hallo, \${name}! Du hast \${3 * 2} Nachrichten.\`;  // Template Literal

console.log(name.toUpperCase(), name.length);
console.log('a,b,c'.split(','));          // ['a', 'b', 'c']
console.log(['x', 'y'].join(' - '));      // 'x - y'
console.log('Hallo'.slice(1, 4));         // 'all'
console.log('  hi  '.trim(), 'abc'.includes('b'), 'ab'.repeat(3));
console.log((3.14159).toFixed(2));        // '3.14'`,arrays:`const zahlen = [3, 1, 4];
zahlen.push(1);                    // ans Ende
zahlen.unshift(9);                 // an den Anfang
const letztes = zahlen.at(-1);

const quadrate = zahlen.map((z) => z * z);
const gerade = zahlen.filter((z) => z % 2 === 0);
const summe = zahlen.reduce((acc, z) => acc + z, 0);
const sortiert = [...zahlen].sort((a, b) => a - b);   // Kopie! sort() mutiert
// Seit ES2023 auch nicht-mutierend: zahlen.toSorted((a, b) => a - b)
console.log(zahlen.includes(4), zahlen.indexOf(4));`,maps:`const alter = new Map([['Ada', 36], ['Linus', 28]]);
alter.set('Grace', 45);
console.log(alter.get('Tim') ?? 0, alter.has('Ada'), alter.size);
alter.delete('Ada');

for (const [name, jahre] of alter) {
  console.log(name, jahre);
}

// Einfache Objekte als "Dictionary" (Schlüssel sind Strings):
const preise = { apfel: 0.5, birne: 0.8 };
for (const [frucht, preis] of Object.entries(preise)) console.log(frucht, preis);`,bedingungen:`const temperatur = 23;

if (temperatur > 30) {
  console.log('heiß');
} else if (temperatur > 15) {
  console.log('angenehm');
} else {
  console.log('kalt');
}

const status = alter >= 18 ? 'volljährig' : 'minderjährig';
if ([]) console.log('Achtung: leeres Array ist truthy!');`,switch:{code:`function beschreibe(befehl) {
  switch (befehl) {
    case 'start':
      return 'Starte …';
    case 'stop':
    case 'halt':                  // bewusstes Durchfallen
      return 'Stoppe …';
    default:
      return 'Unbekannt';
  }
}

// Oft eleganter: Lookup-Objekt
const aktionen = { start: () => 'Starte …', stop: () => 'Stoppe …' };
(aktionen[befehl] ?? (() => 'Unbekannt'))();`,note:"JavaScript hat (noch) kein Pattern Matching; `switch` vergleicht mit `===`. Ohne `return`/`break` fällt die Ausführung in den nächsten Fall."},for:`for (let i = 0; i < 5; i++) {
  console.log(i);
}

for (const frucht of ['Apfel', 'Birne']) {      // Werte
  console.log(frucht);
}

for (const [i, frucht] of ['Apfel', 'Birne'].entries()) {
  console.log(i, frucht);
}

for (const schluessel in { a: 1, b: 2 }) {       // Schlüssel eines Objekts
  console.log(schluessel);
}`,while:`let versuche = 0;
while (versuche < 3) {
  versuche++;
}

let eingabe;
do {
  eingabe = Math.random();
} while (eingabe < 0.5);       // läuft mindestens einmal

while (true) {
  if (Math.random() > 0.9) break;
}`,funktionen:`function begruesse(name, gruss = 'Hallo') {
  return \`\${gruss}, \${name}!\`;
}

const summe = (...zahlen) => zahlen.reduce((a, b) => a + b, 0);   // Rest-Parameter

function minMax(werte) {
  return { min: Math.min(...werte), max: Math.max(...werte) };    // "mehrere" Werte
}
const { min, max } = minMax([3, 9, 1]);

// Benannte Argumente über Objekt-Destructuring:
function erstelle({ name, rolle = 'user' }) { return { name, rolle }; }
erstelle({ name: 'Ada' });`,lambdas:`const quadrat = (x) => x * x;
const addiere = (a, b) => a + b;
const neuesObjekt = () => ({ ok: true });     // Objekt in Klammern

['ada', 'Linus'].sort((a, b) => a.localeCompare(b));

function multiplikator(faktor) {
  return (x) => x * faktor;                   // Closure
}
const verdopple = multiplikator(2);

button.addEventListener('click', () => this.zaehle());   // "this" lexikalisch`,klassen:`class Konto {
  #saldo = 0;                        // echtes privates Feld
  static anzahl = 0;

  constructor(inhaber) {
    this.inhaber = inhaber;
    Konto.anzahl++;
  }

  einzahlen(betrag) {
    if (betrag <= 0) throw new RangeError('Betrag muss positiv sein');
    this.#saldo += betrag;
    return this;                     // Verkettung ermöglichen
  }

  get saldo() { return this.#saldo; }
}

const k = new Konto('Ada').einzahlen(50);
console.log(k.saldo, Konto.anzahl);`,interfaces:{na:!0,note:"JavaScript hat keine Interfaces. Man verlässt sich auf **Duck Typing** („hat das Objekt eine Methode `zeichne`?“) und dokumentiert Erwartungen mit JSDoc. Für echte Interfaces → TypeScript.",code:`// Duck Typing: Jedes Objekt mit zeichne() funktioniert
function render(form) {
  if (typeof form.zeichne !== 'function') throw new TypeError('nicht zeichenbar');
  console.log(form.zeichne());
}
render({ zeichne: () => '□' });`},vererbung:`class Tier {
  constructor(name) { this.name = name; }
  laut() { return '...'; }
}

class Hund extends Tier {
  constructor(name, rasse) {
    super(name);                 // muss vor "this" aufgerufen werden
    this.rasse = rasse;
  }
  laut() { return 'Wuff'; }      // überschreiben
  vorstellen() { return \`\${this.name} sagt \${super.laut()} bzw. \${this.laut()}\`; }
}

console.log(new Hund('Bello', 'Mops') instanceof Tier);   // true`,generics:{na:!0,note:"Als dynamisch typisierte Sprache braucht JavaScript keine Generics – jede Funktion akzeptiert beliebige Typen. Typsichere Generics bietet TypeScript.",code:`// Funktioniert für jeden Typ – aber ohne Prüfung
function erstes(liste) {
  return liste[0];
}
erstes([1, 2, 3]);      // 1
erstes(['a', 'b']);     // 'a'`},null:`const nutzer = { profil: null };

const stadt = nutzer.profil?.adresse?.stadt;     // Optional Chaining → undefined
const anzeige = stadt ?? 'Unbekannt';             // nur bei null/undefined
const anzahl = 0 || 10;                           // 10  (|| ersetzt auch 0, '')
const anzahl2 = 0 ?? 10;                          // 0

nutzer.einstellungen ??= {};                      // Zuweisung nur, wenn null/undefined
console.log(null == undefined, null === undefined);   // true false`,exceptions:`class ZuWenigGuthaben extends Error {
  constructor(fehlbetrag) {
    super(\`Es fehlen \${fehlbetrag} €\`);
    this.name = 'ZuWenigGuthaben';
  }
}

function abheben(saldo, betrag) {
  if (betrag > saldo) throw new ZuWenigGuthaben(betrag - saldo);
  return saldo - betrag;
}

try {
  abheben(50, 80);
} catch (err) {
  if (err instanceof ZuWenigGuthaben) console.warn(err.message);
  else throw err;                         // Unbekanntes weiterwerfen
} finally {
  console.log('immer');
}`,module:`// geometrie.js  (ES Module)
export const PI = 3.14159;
export function flaeche(r) { return PI * r * r; }
export default class Kreis { /* … */ }

// main.js
import Kreis, { flaeche, PI as KREISZAHL } from './geometrie.js';
import * as geo from './geometrie.js';
const { default: Lazy } = await import('./schwer.js');   // dynamischer Import

// CommonJS (ältere Node-Projekte):
// const fs = require('node:fs'); module.exports = { flaeche };`,async:`async function ladeNutzer(id) {
  const res = await fetch(\`/api/nutzer/\${id}\`);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}

async function main() {
  try {
    // parallel statt nacheinander:
    const [ada, tim] = await Promise.all([ladeNutzer(1), ladeNutzer(2)]);
    console.log(ada.name, tim.name);
  } catch (err) {
    console.error('Laden fehlgeschlagen:', err);
  }
}
main();`,futures:`const warte = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const p = new Promise((resolve, reject) => {
  Math.random() > 0.5 ? resolve('Glück') : reject(new Error('Pech'));
});

p.then((wert) => console.log(wert))
 .catch((err) => console.error(err.message))
 .finally(() => console.log('fertig'));

const ergebnisse = await Promise.allSettled([warte(100), Promise.reject(new Error('x'))]);
const schnellstes = await Promise.race([warte(50).then(() => 'A'), warte(10).then(() => 'B')]);
// Echte Parallelität (CPU): Web Worker bzw. worker_threads in Node.js`,dateien:`// Node.js
import { readFile, writeFile, appendFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

await writeFile('notizen.txt', 'Zeile 1\\nZeile 2\\n', 'utf8');
const inhalt = await readFile('notizen.txt', 'utf8');
await appendFile('notizen.txt', 'Zeile 3\\n');

// Große Dateien zeilenweise:
const zeilen = createInterface({ input: createReadStream('notizen.txt') });
for await (const zeile of zeilen) console.log(zeile);`,http:`const res = await fetch('https://api.github.com/repos/nodejs/node', {
  headers: { Accept: 'application/json' },
  signal: AbortSignal.timeout(10_000),     // Timeout
});
if (!res.ok) throw new Error(\`HTTP \${res.status}\`);  // fetch wirft hier NICHT von selbst
const daten = await res.json();
console.log(daten.stargazers_count);

await fetch('/api/nutzer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Ada' }),
});`,json:`const nutzer = { name: 'Ada', alter: 36, geburtstag: new Date('1990-12-10') };

const text = JSON.stringify(nutzer, null, 2);          // hübsch formatiert
const zurueck = JSON.parse(text);
console.log(typeof zurueck.geburtstag);                // "string" – Dates gehen verloren!

const mitDatum = JSON.parse(text, (key, value) =>
  key === 'geburtstag' ? new Date(value) : value);     // Reviver

try { JSON.parse('{kaputt}'); } catch (e) { console.error('Ungültiges JSON'); }`,datenbank:`// Node.js mit PostgreSQL-Treiber "pg"
import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const stadt = 'Berlin';
const { rows } = await pool.query(
  'SELECT id, name FROM kunden WHERE stadt = $1',   // Platzhalter – nie Template-Strings!
  [stadt],
);
console.log(rows);
await pool.end();`,regex:`const text = 'Bestellung 4711 am 2026-11-05, Bestellung 815 am 2026-11-06';

console.log(text.match(/\\d{4}-\\d{2}-\\d{2}/g));          // alle Datumswerte
const m = text.match(/Bestellung (?<nr>\\d+)/);
console.log(m.groups.nr);                                // '4711'

for (const treffer of text.matchAll(/Bestellung (\\d+)/g)) console.log(treffer[1]);

console.log(text.replace(/(\\d{4})-(\\d{2})-(\\d{2})/g, '$3.$2.$1'));
console.log(/^\\d{5}$/.test('10115'));                   // true`,tests:`// rechner.test.js   –   ausführen mit: npx vitest
import { describe, it, expect } from 'vitest';
import { addiere, teile } from './rechner.js';

describe('Rechner', () => {
  it('addiert zwei Zahlen', () => {
    expect(addiere(2, 3)).toBe(5);
  });

  it.each([[1, 1, 2], [-1, 1, 0]])('addiere(%i, %i) = %i', (a, b, erwartet) => {
    expect(addiere(a, b)).toBe(erwartet);
  });

  it('wirft bei Division durch 0', () => {
    expect(() => teile(1, 0)).toThrow();
  });
});`},h={kommentare:{sameAs:"javascript",note:"Identisch zu JavaScript. JSDoc-Typangaben sind in TS überflüssig, Beschreibungen (`@param`, `@returns`) bleiben nützlich."},variablen:`let zaehler: number = 0;
let name = 'Ada';                 // Typ string wird inferiert
// name = 42;                     // Fehler: number ist nicht string
let id: string | number = 'a1';   // Union Type
id = 7;

const [a, b]: [number, string] = [1, 'x'];   // Tupel`,konstanten:`const MAX_VERSUCHE = 3;               // Typ: 3 (Literal-Typ)
const RICHTUNGEN = ['N', 'O', 'S', 'W'] as const;   // readonly ['N', 'O', 'S', 'W']
type Richtung = (typeof RICHTUNGEN)[number];        // 'N' | 'O' | 'S' | 'W'

interface Config { readonly modus: 'dev' | 'prod' }
const cfg: Config = { modus: 'dev' };
// cfg.modus = 'prod';   // Fehler: readonly`,datentypen:`let zahl: number = 42;
let gross: bigint = 10n;
let wahr: boolean = true;
let text: string = 'Hallo';
let nichts: null = null;
let liste: number[] = [1, 2];
let irgendwas: unknown = JSON.parse('1');   // sicherer als any
let nie: never;                             // kein Wert möglich

type Status = 'aktiv' | 'gesperrt';         // Literal-Union statt Enum
if (typeof irgendwas === 'number') console.log(irgendwas.toFixed(1));   // Narrowing`,strings:{sameAs:"javascript",note:"Identisch zu JavaScript. Zusätzlich gibt es Template Literal Types: `` type Id = `user-${number}` ``."},arrays:`const zahlen: number[] = [3, 1, 4];
const namen: Array<string> = ['Ada'];
const nurLesen: readonly number[] = [1, 2];
// nurLesen.push(3);   // Fehler

const quadrate = zahlen.map((z) => z * z);          // number[]
const gemischt: (string | number)[] = [1, 'zwei'];
const paar: [string, number] = ['Ada', 36];         // Tupel`,maps:`const alter = new Map<string, number>([['Ada', 36]]);
alter.set('Linus', 28);
const a: number | undefined = alter.get('Tim');

const preise: Record<string, number> = { apfel: 0.5 };
type Rolle = 'admin' | 'user';
const rechte: Record<Rolle, string[]> = { admin: ['*'], user: ['lesen'] };   // alle Schlüssel Pflicht`,bedingungen:{sameAs:"javascript",note:"Wie JavaScript – zusätzlich verengt TypeScript in jedem Zweig den Typ (Control-Flow-Narrowing)."},switch:{code:`type Form =
  | { art: 'kreis'; r: number }
  | { art: 'rechteck'; b: number; h: number };

function flaeche(f: Form): number {
  switch (f.art) {
    case 'kreis':
      return Math.PI * f.r ** 2;          // f ist hier als Kreis bekannt
    case 'rechteck':
      return f.b * f.h;
    default: {
      const nie: never = f;               // Exhaustiveness-Check
      return nie;
    }
  }
}`,note:"Discriminated Unions + `never` erzwingen, dass alle Fälle behandelt werden – kommt eine neue Form hinzu, meldet der Compiler jede unvollständige Stelle."},for:{sameAs:"javascript"},while:{sameAs:"javascript"},funktionen:`function begruesse(name: string, gruss = 'Hallo'): string {
  return \`\${gruss}, \${name}!\`;
}

const summe = (...zahlen: number[]): number => zahlen.reduce((a, b) => a + b, 0);

function teile(a: number, b: number): number | undefined {
  return b === 0 ? undefined : a / b;
}

// Overloads
function laenge(x: string): number;
function laenge(x: unknown[]): number;
function laenge(x: string | unknown[]) { return x.length; }`,lambdas:`const quadrat = (x: number): number => x * x;
type Vergleich<T> = (a: T, b: T) => number;
const nachLaenge: Vergleich<string> = (a, b) => a.length - b.length;   // Typen inferiert

function multiplikator(faktor: number): (x: number) => number {
  return (x) => x * faktor;
}`,klassen:`class Konto {
  private saldo = 0;                     // TS-privat (nur Compile-Zeit); #saldo = echt privat
  static anzahl = 0;

  constructor(public readonly inhaber: string) {   // Parameter Property
    Konto.anzahl++;
  }

  einzahlen(betrag: number): this {
    if (betrag <= 0) throw new RangeError('Betrag muss positiv sein');
    this.saldo += betrag;
    return this;
  }

  get kontostand(): number { return this.saldo; }
}

const k = new Konto('Ada').einzahlen(50);`,interfaces:`interface Zeichenbar {
  zeichne(): string;
}

interface Form extends Zeichenbar {
  readonly name: string;
  flaeche(): number;
}

class Quadrat implements Form {
  readonly name = 'Quadrat';
  constructor(private a: number) {}
  flaeche() { return this.a ** 2; }
  zeichne() { return '□'; }
}

const ad: Zeichenbar = { zeichne: () => '○' };   // strukturell: passt ohne "implements"`,vererbung:`abstract class Tier {
  constructor(protected name: string) {}
  abstract laut(): string;
  vorstellen() { return \`\${this.name}: \${this.laut()}\`; }
}

class Hund extends Tier {
  constructor(name: string, private rasse: string) { super(name); }
  override laut() { return 'Wuff'; }     // "override" mit noImplicitOverride Pflicht
}

const tiere: Tier[] = [new Hund('Bello', 'Mops')];`,generics:`function erstes<T>(liste: readonly T[]): T | undefined {
  return liste[0];
}

class Stapel<T> {
  private items: T[] = [];
  push(x: T) { this.items.push(x); }
  pop(): T | undefined { return this.items.pop(); }
}

function eigenschaft<T, K extends keyof T>(obj: T, key: K): T[K] {   // Constraint
  return obj[key];
}
eigenschaft({ name: 'Ada', alter: 36 }, 'alter');   // number`,null:`function laenge(s: string | null): number {
  // return s.length;        // Fehler bei strictNullChecks
  return s?.length ?? 0;
}

interface Nutzer { profil?: { stadt?: string } }
const n: Nutzer = {};
const stadt = n.profil?.stadt ?? 'Unbekannt';

const el = document.querySelector('#app')!;   // "!" = Non-Null-Assertion (Vorsicht!)`,exceptions:{code:`class ZuWenigGuthaben extends Error {
  constructor(public fehlbetrag: number) {
    super(\`Es fehlen \${fehlbetrag} €\`);
    this.name = 'ZuWenigGuthaben';
  }
}

try {
  riskant();
} catch (err: unknown) {             // catch-Variablen sind "unknown"
  if (err instanceof ZuWenigGuthaben) console.warn(err.fehlbetrag);
  else if (err instanceof Error) console.error(err.message);
  else throw err;
}`,note:"TypeScript kennt keine Checked Exceptions. Für erwartbare Fehler sind Rückgabetypen wie `{ ok: true; wert } | { ok: false; fehler }` oft besser."},module:`// typen.ts
export interface Nutzer { id: number; name: string }
export type Rolle = 'admin' | 'user';

// main.ts
import type { Nutzer, Rolle } from './typen.js';   // reiner Typ-Import (wird entfernt)
import { ladeNutzer } from './api.js';
export * from './typen.js';                         // Re-Export`,async:`interface Nutzer { id: number; name: string }

async function ladeNutzer(id: number): Promise<Nutzer> {
  const res = await fetch(\`/api/nutzer/\${id}\`);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return (await res.json()) as Nutzer;   // besser: mit Zod validieren
}

const [ada, tim] = await Promise.all([ladeNutzer(1), ladeNutzer(2)]);`,futures:{sameAs:"javascript",note:"Wie JavaScript; Promises sind generisch typisiert: `Promise<T>`. `Awaited<T>` liefert den aufgelösten Typ."},dateien:{sameAs:"javascript"},http:{sameAs:"javascript",note:"Wie JavaScript. Tipp: Antworttypen nicht nur behaupten (`as`), sondern zur Laufzeit validieren (z. B. Zod)."},json:`import { z } from 'zod';

const Nutzer = z.object({ name: z.string(), alter: z.number().int().nonnegative() });
type Nutzer = z.infer<typeof Nutzer>;          // Typ aus Schema ableiten

const ergebnis = Nutzer.safeParse(JSON.parse('{"name":"Ada","alter":36}'));
if (ergebnis.success) {
  const n: Nutzer = ergebnis.data;
} else {
  console.error(ergebnis.error.issues);
}`,datenbank:{sameAs:"javascript",note:"Wie JavaScript. Typsichere Alternativen: Prisma, Drizzle oder Kysely."},regex:{sameAs:"javascript"},tests:{sameAs:"javascript",note:"Vitest unterstützt TypeScript ohne zusätzliche Konfiguration."}},m={kommentare:`// Einzeiliger Kommentar
/* Mehrzeiliger Kommentar */

/**
 * Javadoc: Berechnet die Kreisfläche.
 * @param r Radius
 * @return Fläche
 */
static double flaeche(double r) {
    return Math.PI * r * r;
}`,variablen:`int zaehler = 0;
zaehler += 1;
String name = "Ada";
var liste = new ArrayList<String>();   // Typinferenz für lokale Variablen (seit Java 10)
double preis = 9.99;
long gross = 9_000_000_000L;`,konstanten:`public class Config {
    public static final int MAX_VERSUCHE = 3;      // Klassenkonstante
}

final String name = "Ada";        // nicht neu zuweisbar
final List<String> liste = new ArrayList<>();
liste.add("ok");                  // Objekt bleibt veränderlich!
List<String> fest = List.of("a", "b");   // unveränderliche Liste`,datentypen:`int ganz = 42;            // 32 Bit; byte, short, long ebenso primitiv
double komma = 3.14;      // 64-Bit-Gleitkomma; float = 32 Bit
boolean wahr = true;
char zeichen = 'A';
String text = "Hallo";    // Referenztyp
Integer boxed = 42;       // Wrapper-Klasse (kann null sein)

System.out.println(7 / 2);         // 3   (Ganzzahldivision)
System.out.println(7 / 2.0);       // 3.5
System.out.println(Integer.MAX_VALUE + 1);   // -2147483648 (Überlauf!)
var geld = new java.math.BigDecimal("0.10");   // für Geld`,strings:`String name = "Ada";
String gruss = "Hallo, %s! Du hast %d Nachrichten.".formatted(name, 6);
String block = """
    Mehrzeiliger
    Text Block (Java 15+)
    """;

System.out.println(name.toUpperCase() + " " + name.length());
System.out.println(String.join(" - ", List.of("x", "y")));
System.out.println("Hallo".substring(1, 4));      // all
System.out.println("a,b,c".split(",").length);

var sb = new StringBuilder();                     // effizient in Schleifen
for (int i = 0; i < 3; i++) sb.append(i);`,arrays:`int[] fest = {3, 1, 4};                    // Array fester Größe
int erstes = fest[0];

List<Integer> zahlen = new ArrayList<>(List.of(3, 1, 4));
zahlen.add(1);
zahlen.add(0, 9);

List<Integer> quadrate = zahlen.stream().map(z -> z * z).toList();
List<Integer> gerade = zahlen.stream().filter(z -> z % 2 == 0).toList();
int summe = zahlen.stream().mapToInt(Integer::intValue).sum();
Collections.sort(zahlen);`,maps:`Map<String, Integer> alter = new HashMap<>();
alter.put("Ada", 36);
alter.put("Linus", 28);
int tim = alter.getOrDefault("Tim", 0);
alter.merge("Ada", 1, Integer::sum);           // 37
alter.remove("Linus");

for (var eintrag : alter.entrySet()) {
    System.out.println(eintrag.getKey() + ": " + eintrag.getValue());
}
Map<String, Integer> fest = Map.of("a", 1, "b", 2);   // unveränderlich`,bedingungen:`int temperatur = 23;

if (temperatur > 30) {
    System.out.println("heiß");
} else if (temperatur > 15) {
    System.out.println("angenehm");
} else {
    System.out.println("kalt");
}

String status = alter >= 18 ? "volljährig" : "minderjährig";`,switch:`// Switch-Ausdruck (Java 14+), kein Fall-Through
String text = switch (tag) {
    case SAMSTAG, SONNTAG -> "Wochenende";
    case FREITAG -> "Fast Wochenende";
    default -> "Werktag";
};

// Pattern Matching (Java 21)
sealed interface Form permits Kreis, Rechteck {}
record Kreis(double r) implements Form {}
record Rechteck(double b, double h) implements Form {}

double flaeche(Form f) {
    return switch (f) {
        case Kreis k -> Math.PI * k.r() * k.r();
        case Rechteck(double b, double h) -> b * h;   // Record Pattern
    };
}`,for:`for (int i = 0; i < 5; i++) {
    System.out.println(i);
}

for (String frucht : List.of("Apfel", "Birne")) {   // for-each
    System.out.println(frucht);
}

IntStream.range(0, 5).forEach(System.out::println);
List.of("a", "b").forEach(s -> System.out.println(s));`,while:`int versuche = 0;
while (versuche < 3) {
    versuche++;
}

do {
    eingabe = scanner.nextLine();
} while (!eingabe.equals("ende"));

aussen:
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (j == 2) continue aussen;    // Label: äußere Schleife fortsetzen
    }
}`,funktionen:`static String begruesse(String name) {
    return begruesse(name, "Hallo");        // Overloading statt Default-Parameter
}

static String begruesse(String name, String gruss) {
    return gruss + ", " + name + "!";
}

static int summe(int... zahlen) {           // Varargs
    return Arrays.stream(zahlen).sum();
}

record MinMax(int min, int max) {}           // "mehrere" Rückgabewerte
static MinMax minMax(List<Integer> w) {
    return new MinMax(Collections.min(w), Collections.max(w));
}`,lambdas:`Function<Integer, Integer> quadrat = x -> x * x;
BiFunction<Integer, Integer, Integer> addiere = (a, b) -> a + b;
Supplier<String> gruss = () -> "Hallo";
Predicate<String> leer = String::isEmpty;      // Methodenreferenz

List<String> namen = new ArrayList<>(List.of("ada", "Linus"));
namen.sort(Comparator.comparing(String::toLowerCase));

int faktor = 2;   // muss "effectively final" sein
Function<Integer, Integer> mal = x -> x * faktor;`,klassen:`public class Konto {
    private final String inhaber;
    private double saldo;
    private static int anzahl = 0;

    public Konto(String inhaber) {
        this.inhaber = inhaber;
        anzahl++;
    }

    public void einzahlen(double betrag) {
        if (betrag <= 0) throw new IllegalArgumentException("Betrag muss positiv sein");
        saldo += betrag;
    }

    public double getSaldo() { return saldo; }
}

record Punkt(double x, double y) {}   // unveränderliche Datenklasse mit equals/hashCode/toString

var k = new Konto("Ada");
k.einzahlen(50);`,interfaces:`interface Zeichenbar {
    String zeichne();

    default String rahmen() {            // Default-Methode (seit Java 8)
        return "[" + zeichne() + "]";
    }
}

interface Form { double flaeche(); }

class Quadrat implements Form, Zeichenbar {
    private final double a;
    Quadrat(double a) { this.a = a; }
    public double flaeche() { return a * a; }
    public String zeichne() { return "□"; }
}`,vererbung:`abstract class Tier {
    protected final String name;
    Tier(String name) { this.name = name; }
    abstract String laut();
    String vorstellen() { return name + ": " + laut(); }
}

class Hund extends Tier {
    Hund(String name) { super(name); }
    @Override
    String laut() { return "Wuff"; }
}

final class Dackel extends Hund {          // final: nicht weiter ableitbar
    Dackel() { super("Waldi"); }
}`,generics:`static <T> T erstes(List<T> liste) {
    return liste.isEmpty() ? null : liste.get(0);
}

class Stapel<T> {
    private final Deque<T> items = new ArrayDeque<>();
    void push(T x) { items.push(x); }
    T pop() { return items.pop(); }
}

static <T extends Comparable<T>> T max(List<T> liste) {       // Bounded Type
    return Collections.max(liste);
}

static double summe(List<? extends Number> zahlen) {          // Wildcard
    return zahlen.stream().mapToDouble(Number::doubleValue).sum();
}`,null:`Optional<String> name = Optional.ofNullable(ladeName());

String anzeige = name.map(String::toUpperCase).orElse("UNBEKANNT");
name.ifPresent(n -> System.out.println(n));

String stadt = nutzer != null && nutzer.getAdresse() != null
        ? nutzer.getAdresse().getStadt() : "–";
Objects.requireNonNull(param, "param darf nicht null sein");`,exceptions:`class ZuWenigGuthabenException extends Exception {    // checked
    ZuWenigGuthabenException(String msg) { super(msg); }
}

double abheben(double saldo, double betrag) throws ZuWenigGuthabenException {
    if (betrag > saldo) throw new ZuWenigGuthabenException("Es fehlen " + (betrag - saldo));
    return saldo - betrag;
}

try (var reader = Files.newBufferedReader(Path.of("daten.txt"))) {   // try-with-resources
    System.out.println(reader.readLine());
} catch (NoSuchFileException e) {
    System.err.println("Datei fehlt: " + e.getFile());
} catch (IOException e) {
    throw new UncheckedIOException(e);
} finally {
    System.out.println("immer");
}`,module:`// Datei: src/main/java/de/shop/geometrie/Kreis.java
package de.shop.geometrie;

public class Kreis { /* … */ }

// Datei: src/main/java/de/shop/App.java
package de.shop;

import de.shop.geometrie.Kreis;
import java.util.*;                       // alle Typen aus java.util
import static java.lang.Math.PI;          // statischer Import

// Optional: Java Platform Module System (module-info.java)
// module de.shop { exports de.shop.geometrie; }`,async:{code:`var client = HttpClient.newHttpClient();

CompletableFuture<String> a = client.sendAsync(req1, BodyHandlers.ofString()).thenApply(HttpResponse::body);
CompletableFuture<String> b = client.sendAsync(req2, BodyHandlers.ofString()).thenApply(HttpResponse::body);

CompletableFuture.allOf(a, b).join();
System.out.println(a.join().length() + b.join().length());

// Seit Java 21: virtuelle Threads – blockierender Code skaliert
try (var exec = Executors.newVirtualThreadPerTaskExecutor()) {
    exec.submit(() -> client.send(req1, BodyHandlers.ofString()));
}`,note:"Java hat kein `async/await`. Asynchronität über `CompletableFuture` – oder (moderner) einfacher blockierender Code auf virtuellen Threads."},futures:`ExecutorService pool = Executors.newFixedThreadPool(4);

Future<Integer> f = pool.submit(() -> berechne(42));
int ergebnis = f.get(5, TimeUnit.SECONDS);       // wartet (mit Timeout)

CompletableFuture.supplyAsync(() -> ladeDaten())
    .thenApply(String::trim)
    .exceptionally(ex -> "Fallback")
    .thenAccept(System.out::println);

pool.shutdown();`,dateien:`Path pfad = Path.of("notizen.txt");
Files.writeString(pfad, "Zeile 1\\nZeile 2\\n", StandardCharsets.UTF_8);
String inhalt = Files.readString(pfad);
Files.writeString(pfad, "Zeile 3\\n", StandardOpenOption.APPEND);

try (Stream<String> zeilen = Files.lines(pfad)) {     // große Dateien streamen
    zeilen.filter(z -> !z.isBlank()).forEach(System.out::println);
}
System.out.println(Files.exists(pfad));`,http:`HttpClient client = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(10))
        .build();

HttpRequest req = HttpRequest.newBuilder(URI.create("https://api.github.com/repos/openjdk/jdk"))
        .header("Accept", "application/json")
        .timeout(Duration.ofSeconds(10))
        .GET()
        .build();

HttpResponse<String> res = client.send(req, HttpResponse.BodyHandlers.ofString());
if (res.statusCode() != 200) throw new IllegalStateException("HTTP " + res.statusCode());
System.out.println(res.body());`,json:`// Jackson (com.fasterxml.jackson.databind)
record Nutzer(String name, int alter) {}

ObjectMapper mapper = new ObjectMapper();
String json = mapper.writeValueAsString(new Nutzer("Ada", 36));   // {"name":"Ada","alter":36}
Nutzer n = mapper.readValue("{\\"name\\":\\"Tim\\",\\"alter\\":15}", Nutzer.class);
JsonNode baum = mapper.readTree(json);
System.out.println(baum.get("name").asText());`,datenbank:`String sql = "SELECT id, name FROM kunden WHERE stadt = ?";

try (Connection conn = DriverManager.getConnection(url, user, passwort);   // in Apps: DataSource/Pool
     PreparedStatement stmt = conn.prepareStatement(sql)) {
    stmt.setString(1, "Berlin");                      // Parameter binden
    try (ResultSet rs = stmt.executeQuery()) {
        while (rs.next()) {
            System.out.println(rs.getInt("id") + " " + rs.getString("name"));
        }
    }
}`,regex:`String text = "Bestellung 4711 am 2026-11-05, Bestellung 815 am 2026-11-06";

Pattern p = Pattern.compile("Bestellung (?<nr>\\\\d+)");
Matcher m = p.matcher(text);
while (m.find()) {
    System.out.println(m.group("nr"));
}

String umgestellt = text.replaceAll("(\\\\d{4})-(\\\\d{2})-(\\\\d{2})", "$3.$2.$1");
boolean plz = "10115".matches("\\\\d{5}");`,tests:`// JUnit 5
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import static org.junit.jupiter.api.Assertions.*;

class RechnerTest {
    @Test
    void addiert() {
        assertEquals(5, Rechner.addiere(2, 3));
    }

    @ParameterizedTest
    @CsvSource({"1,1,2", "-1,1,0"})
    void addiertViele(int a, int b, int erwartet) {
        assertEquals(erwartet, Rechner.addiere(a, b));
    }

    @Test
    void teilenDurchNull() {
        assertThrows(ArithmeticException.class, () -> Rechner.teile(1, 0));
    }
}`},p={kommentare:`// Einzeiliger Kommentar
/* Mehrzeiliger Kommentar */

/// <summary>Berechnet die Kreisfläche.</summary>
/// <param name="r">Radius</param>
/// <returns>Fläche</returns>
static double Flaeche(double r) => Math.PI * r * r;`,variablen:`int zaehler = 0;
zaehler++;
string name = "Ada";
var liste = new List<string>();   // Typinferenz
decimal preis = 9.99m;            // decimal für Geld
(int a, int b) = (1, 2);          // Tupel-Dekonstruktion
(a, b) = (b, a);                  // Tausch`,konstanten:`public class Config
{
    public const int MaxVersuche = 3;                 // Compile-Zeit-Konstante
    public static readonly DateTime Start = DateTime.UtcNow;   // zur Laufzeit, einmalig
}

readonly struct Punkt { /* … */ }
var fest = new[] { 1, 2 }.AsReadOnly();`,datentypen:`int ganz = 42;               // System.Int32
long gross = 9_000_000_000;
double komma = 3.14;
decimal geld = 0.10m;        // exakte Dezimalarithmetik
bool wahr = true;
char zeichen = 'A';
string text = "Hallo";
int? vielleicht = null;      // Nullable Value Type

Console.WriteLine(7 / 2);           // 3
Console.WriteLine(0.1 + 0.2);       // 0.30000000000000004
Console.WriteLine(0.1m + 0.2m);     // 0.3
Console.WriteLine(ganz.GetType());  // System.Int32`,strings:`string name = "Ada";
string gruss = $"Hallo, {name}! Du hast {3 * 2} Nachrichten.";
string pfad = @"C:\\Daten\\datei.txt";          // Verbatim String
string roh = """
    Raw String Literal (C# 11)
    mit "Anführungszeichen"
    """;

Console.WriteLine(name.ToUpper() + " " + name.Length);
Console.WriteLine(string.Join(" - ", new[] { "x", "y" }));
Console.WriteLine("Hallo"[1..4]);                  // all (Range)
Console.WriteLine($"{3.14159:F2}");                // 3.14`,arrays:`int[] fest = { 3, 1, 4 };
var zahlen = new List<int> { 3, 1, 4 };
zahlen.Add(1);
zahlen.Insert(0, 9);
int letztes = zahlen[^1];                  // Index vom Ende

var quadrate = zahlen.Select(z => z * z).ToList();      // LINQ
var gerade = zahlen.Where(z => z % 2 == 0).ToList();
int summe = zahlen.Sum();
zahlen.Sort();
int[] kollektion = [1, 2, 3];              // Collection Expression (C# 12)`,maps:`var alter = new Dictionary<string, int>
{
    ["Ada"] = 36,
    ["Linus"] = 28,
};
alter["Grace"] = 45;
if (alter.TryGetValue("Tim", out int jahre)) Console.WriteLine(jahre);
int sicher = alter.GetValueOrDefault("Tim", 0);
alter.Remove("Linus");

foreach (var (n, j) in alter)
    Console.WriteLine($"{n}: {j}");`,bedingungen:`int temperatur = 23;

if (temperatur > 30)
    Console.WriteLine("heiß");
else if (temperatur > 15)
    Console.WriteLine("angenehm");
else
    Console.WriteLine("kalt");

string status = alter >= 18 ? "volljährig" : "minderjährig";
if (obj is string s && s.Length > 0) Console.WriteLine(s);   // Typprüfung + Bindung`,switch:`string Beschreibe(object o) => o switch
{
    int n when n < 0      => "negative Zahl",
    int n                 => $"Zahl {n}",
    string { Length: 0 }  => "leerer Text",          // Property Pattern
    string s              => $"Text: {s}",
    null                  => "nichts",
    _                     => "etwas anderes",
};

var tarif = (alter, istStudent) switch
{
    (< 18, _) => "Jugend",
    (_, true) => "Student",
    _         => "Normal",
};`,for:`for (int i = 0; i < 5; i++)
{
    Console.WriteLine(i);
}

foreach (var frucht in new[] { "Apfel", "Birne" })
    Console.WriteLine(frucht);

foreach (var (frucht, i) in new[] { "Apfel", "Birne" }.Select((f, i) => (f, i)))
    Console.WriteLine($"{i}: {frucht}");

foreach (var i in Enumerable.Range(0, 5)) Console.WriteLine(i);`,while:`int versuche = 0;
while (versuche < 3)
{
    versuche++;
}

string? eingabe;
do
{
    eingabe = Console.ReadLine();
} while (eingabe != "ende");`,funktionen:`static string Begruesse(string name, string gruss = "Hallo")
    => $"{gruss}, {name}!";

Begruesse("Ada");
Begruesse(gruss: "Moin", name: "Tim");     // benannte Argumente

static int Summe(params int[] zahlen) => zahlen.Sum();

static (int Min, int Max) MinMax(IEnumerable<int> w) => (w.Min(), w.Max());
var (min, max) = MinMax(new[] { 3, 9, 1 });

static bool Teile(int a, int b, out int ergebnis)
{
    ergebnis = b == 0 ? 0 : a / b;
    return b != 0;
}`,lambdas:`Func<int, int> quadrat = x => x * x;
Func<int, int, int> addiere = (a, b) => a + b;
Action<string> drucke = s => Console.WriteLine(s);
Predicate<string> leer = string.IsNullOrEmpty;

var namen = new List<string> { "ada", "Linus" };
namen.Sort((a, b) => string.Compare(a, b, StringComparison.OrdinalIgnoreCase));

Func<int, int> Multiplikator(int faktor) => x => x * faktor;    // Closure
var quadratNeu = (int x) => x * x;                               // natürlicher Lambda-Typ (C# 10)`,klassen:`public class Konto
{
    private decimal _saldo;
    public string Inhaber { get; }               // nur lesbar
    public static int Anzahl { get; private set; }

    public Konto(string inhaber)
    {
        Inhaber = inhaber;
        Anzahl++;
    }

    public decimal Saldo => _saldo;

    public void Einzahlen(decimal betrag)
    {
        if (betrag <= 0) throw new ArgumentOutOfRangeException(nameof(betrag));
        _saldo += betrag;
    }
}

public record Punkt(double X, double Y);       // unveränderlich, Wertgleichheit
var p2 = new Punkt(1, 2) with { Y = 5 };       // nicht-destruktive Kopie`,interfaces:`public interface IZeichenbar
{
    string Zeichne();
    string Rahmen() => $"[{Zeichne()}]";       // Default Interface Method (C# 8)
}

public interface IForm { double Flaeche(); }

public class Quadrat(double a) : IForm, IZeichenbar    // Primärkonstruktor (C# 12)
{
    public double Flaeche() => a * a;
    public string Zeichne() => "□";
}`,vererbung:`public abstract class Tier(string name)
{
    public string Name { get; } = name;
    public abstract string Laut();
    public virtual string Vorstellen() => $"{Name}: {Laut()}";
}

public class Hund(string name) : Tier(name)
{
    public override string Laut() => "Wuff";
    public override string Vorstellen() => base.Vorstellen() + "!";
}

public sealed class Dackel() : Hund("Waldi");   // sealed: nicht weiter ableitbar`,generics:`static T? Erstes<T>(IList<T> liste) => liste.Count > 0 ? liste[0] : default;

public class Stapel<T>
{
    private readonly Stack<T> _items = new();
    public void Push(T x) => _items.Push(x);
    public T Pop() => _items.Pop();
}

static T Max<T>(IEnumerable<T> werte) where T : IComparable<T>    // Constraint
    => werte.Aggregate((a, b) => a.CompareTo(b) >= 0 ? a : b);

// Generics sind reifiziert: typeof(T) ist zur Laufzeit bekannt`,null:`#nullable enable
string? name = LadeName();          // darf null sein
string sicher = "Ada";              // Compiler warnt bei null-Zuweisung

int laenge = name?.Length ?? 0;     // Null-Conditional + Null-Coalescing
name ??= "Unbekannt";               // Zuweisung, falls null
string stadt = nutzer?.Adresse?.Stadt ?? "–";
ArgumentNullException.ThrowIfNull(param);`,exceptions:`public class ZuWenigGuthabenException(decimal fehlbetrag)
    : Exception($"Es fehlen {fehlbetrag} €")
{
    public decimal Fehlbetrag { get; } = fehlbetrag;
}

try
{
    using var datei = File.OpenRead("daten.txt");     // wird automatisch freigegeben
    Abheben(50, 80);
}
catch (ZuWenigGuthabenException ex) when (ex.Fehlbetrag > 10)   // Exception-Filter
{
    Console.WriteLine(ex.Message);
}
catch (IOException ex)
{
    Console.Error.WriteLine(ex.Message);
    throw;                       // weiterwerfen, Stack Trace bleibt erhalten
}
finally
{
    Console.WriteLine("immer");
}`,module:`// Datei: Geometrie/Kreis.cs
namespace Shop.Geometrie;          // File-scoped Namespace (C# 10)

public class Kreis { /* … */ }
internal class Hilfe { }           // nur innerhalb der Assembly sichtbar

// Datei: Program.cs
using Shop.Geometrie;
using static System.Math;          // statische Member direkt nutzen
using Json = System.Text.Json.JsonSerializer;   // Alias

// global using System.Linq;       // projektweit (z. B. in GlobalUsings.cs)`,async:`using var http = new HttpClient();   // in Apps: IHttpClientFactory

async Task<string> LadeAsync(string url, CancellationToken ct = default)
{
    var res = await http.GetAsync(url, ct);
    res.EnsureSuccessStatusCode();
    return await res.Content.ReadAsStringAsync(ct);
}

// parallel:
var ergebnisse = await Task.WhenAll(LadeAsync("https://example.com"), LadeAsync("https://dot.net"));
Console.WriteLine(ergebnisse.Sum(s => s.Length));

await foreach (var zeile in LeseZeilenAsync()) Console.WriteLine(zeile);   // async Streams`,futures:`Task<int> t = Task.Run(() => Berechne(42));     // auf dem Thread-Pool
int ergebnis = await t;

var tcs = new TaskCompletionSource<string>();   // manuell erfülltes "Promise"
_ = Task.Delay(100).ContinueWith(_ => tcs.SetResult("fertig"));
Console.WriteLine(await tcs.Task);

Parallel.For(0, 100, i => Verarbeite(i));       // Datenparallelität
var schnellster = await Task.WhenAny(t1, t2);`,dateien:`string pfad = Path.Combine("daten", "notizen.txt");
Directory.CreateDirectory("daten");

await File.WriteAllTextAsync(pfad, "Zeile 1\\nZeile 2\\n");
string inhalt = await File.ReadAllTextAsync(pfad);
await File.AppendAllTextAsync(pfad, "Zeile 3\\n");

foreach (var zeile in File.ReadLines(pfad))      // lazy, speicherschonend
    Console.WriteLine(zeile);

Console.WriteLine(File.Exists(pfad));`,http:`using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(10) };
http.DefaultRequestHeaders.UserAgent.ParseAdd("DevAtlas-Demo");

var res = await http.GetAsync("https://api.github.com/repos/dotnet/runtime");
res.EnsureSuccessStatusCode();                     // wirft bei 4xx/5xx
var repo = await res.Content.ReadFromJsonAsync<Repo>();
Console.WriteLine(repo?.StargazersCount);

var neu = await http.PostAsJsonAsync("https://httpbin.org/post", new { Name = "Ada" });

record Repo([property: JsonPropertyName("stargazers_count")] int StargazersCount);`,json:`using System.Text.Json;

public record Nutzer(string Name, int Alter);

var optionen = new JsonSerializerOptions { WriteIndented = true, PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
string json = JsonSerializer.Serialize(new Nutzer("Ada", 36), optionen);
Nutzer? n = JsonSerializer.Deserialize<Nutzer>("{\\"name\\":\\"Tim\\",\\"alter\\":15}", optionen);

using var doc = JsonDocument.Parse(json);
Console.WriteLine(doc.RootElement.GetProperty("name").GetString());`,datenbank:`// Microsoft.Data.Sqlite (ADO.NET) – analog für SQL Server/PostgreSQL
await using var conn = new SqliteConnection("Data Source=shop.db");
await conn.OpenAsync();

await using var cmd = conn.CreateCommand();
cmd.CommandText = "SELECT id, name FROM kunden WHERE stadt = $stadt";
cmd.Parameters.AddWithValue("$stadt", "Berlin");

await using var reader = await cmd.ExecuteReaderAsync();
while (await reader.ReadAsync())
    Console.WriteLine($"{reader.GetInt32(0)} {reader.GetString(1)}");
// Komfortabler: Dapper oder Entity Framework Core`,regex:`using System.Text.RegularExpressions;

string text = "Bestellung 4711 am 2026-11-05, Bestellung 815 am 2026-11-06";

foreach (Match m in Regex.Matches(text, @"Bestellung (?<nr>\\d+)"))
    Console.WriteLine(m.Groups["nr"].Value);

string umgestellt = Regex.Replace(text, @"(\\d{4})-(\\d{2})-(\\d{2})", "$3.$2.$1");
bool plz = Regex.IsMatch("10115", @"^\\d{5}$");

// Zur Compile-Zeit generiert (schneller, AOT-freundlich):
// [GeneratedRegex(@"^\\d{5}$")] private static partial Regex Plz();`,tests:`// xUnit
public class RechnerTests
{
    [Fact]
    public void Addiert()
    {
        Assert.Equal(5, Rechner.Addiere(2, 3));
    }

    [Theory]
    [InlineData(1, 1, 2)]
    [InlineData(-1, 1, 0)]
    public void AddiertViele(int a, int b, int erwartet)
        => Assert.Equal(erwartet, Rechner.Addiere(a, b));

    [Fact]
    public void TeilenDurchNull()
        => Assert.Throws<DivideByZeroException>(() => Rechner.Teile(1, 0));
}`},g={kommentare:`// Einzeiliger Kommentar
/* Mehrzeiliger /* verschachtelbarer */ Kommentar */

/**
 * KDoc: Berechnet die Kreisfläche.
 * @param r Radius
 */
fun flaeche(r: Double) = Math.PI * r * r`,variablen:`var zaehler = 0          // veränderlich
zaehler += 1
val name = "Ada"         // unveränderlich (bevorzugt)
val preis: Double = 9.99
val (a, b) = Pair(1, 2)  // Destructuring`,konstanten:`const val MAX_VERSUCHE = 3        // Compile-Zeit-Konstante (top-level oder object)

object Config {
    const val VERSION = "1.0"
}

val liste = listOf(1, 2)            // unveränderliche Liste
val veraenderlich = mutableListOf(1, 2)
veraenderlich += 3`,datentypen:`val ganz: Int = 42
val gross: Long = 9_000_000_000
val komma: Double = 3.14
val wahr: Boolean = true
val zeichen: Char = 'A'
val text: String = "Hallo"
val vielleicht: Int? = null       // nullable

println(7 / 2)                    // 3
println(7 / 2.0)                  // 3.5
println(ganz is Int)              // Typprüfung
val d = "42".toInt()              // Konvertierung (toIntOrNull() ist sicherer)`,strings:`val name = "Ada"
val gruss = "Hallo, $name! Du hast \${3 * 2} Nachrichten."
val roh = """
    |Mehrzeilig
    |ohne Escapes: C:\\Daten
""".trimMargin()

println(name.uppercase() + " " + name.length)
println(listOf("x", "y").joinToString(" - "))
println("Hallo".substring(1, 4))         // all
println("%.2f".format(3.14159))          // 3.14
val text = buildString { repeat(3) { append(it) } }`,arrays:`val zahlen = mutableListOf(3, 1, 4)
zahlen.add(1)
zahlen.add(0, 9)
val letztes = zahlen.last()

val quadrate = zahlen.map { it * it }
val gerade = zahlen.filter { it % 2 == 0 }
val summe = zahlen.sum()
val sortiert = zahlen.sorted()

val fest = arrayOf(1, 2, 3)          // Array fester Größe
val ints = IntArray(5) { it * 2 }    // [0, 2, 4, 6, 8]`,maps:`val alter = mutableMapOf("Ada" to 36, "Linus" to 28)
alter["Grace"] = 45
println(alter["Tim"] ?: 0)            // null-sicher mit Elvis
println(alter.getOrDefault("Tim", 0))
alter.remove("Linus")

for ((name, jahre) in alter) println("$name: $jahre")

val nachLaenge = listOf("hi", "hallo", "ok").groupBy { it.length }`,bedingungen:`val temperatur = 23

if (temperatur > 30) {
    println("heiß")
} else if (temperatur > 15) {
    println("angenehm")
} else {
    println("kalt")
}

val status = if (alter >= 18) "volljährig" else "minderjährig"   // if ist ein Ausdruck
if (temperatur in 0..40) println("im Messbereich")`,switch:`fun beschreibe(x: Any): String = when (x) {
    0 -> "Null"
    in 1..9 -> "einstellig"
    is String -> "Text der Länge \${x.length}"   // Smart Cast
    else -> "etwas anderes"
}

sealed interface Form
data class Kreis(val r: Double) : Form
data class Rechteck(val b: Double, val h: Double) : Form

fun flaeche(f: Form) = when (f) {          // vollständig, kein else nötig
    is Kreis -> Math.PI * f.r * f.r
    is Rechteck -> f.b * f.h
}`,for:`for (i in 0 until 5) println(i)        // 0..4
for (i in 10 downTo 0 step 2) println(i)

for (frucht in listOf("Apfel", "Birne")) println(frucht)

for ((i, frucht) in listOf("Apfel", "Birne").withIndex()) println("$i: $frucht")

repeat(3) { println("Durchlauf $it") }
listOf(1, 2).forEach { println(it) }`,while:`var versuche = 0
while (versuche < 3) {
    versuche++
}

do {
    val eingabe = readln()
} while (eingabe != "ende")

aussen@ for (i in 1..3) {
    for (j in 1..3) if (j == 2) continue@aussen   // Labels
}`,funktionen:`fun begruesse(name: String, gruss: String = "Hallo"): String = "$gruss, $name!"

begruesse("Ada")
begruesse(gruss = "Moin", name = "Tim")

fun summe(vararg zahlen: Int) = zahlen.sum()

fun minMax(w: List<Int>): Pair<Int, Int> = w.min() to w.max()
val (min, max) = minMax(listOf(3, 9, 1))

fun String.schreie() = uppercase() + "!"    // Extension Function
println("hallo".schreie())`,lambdas:`val quadrat = { x: Int -> x * x }
val addiere: (Int, Int) -> Int = { a, b -> a + b }

listOf("ada", "Linus").sortedBy { it.lowercase() }
listOf(1, 2, 3).map { it * 2 }                  // "it" = einziger Parameter

fun multiplikator(faktor: Int): (Int) -> Int = { it * faktor }

fun messe(block: () -> Unit) { val t = System.nanoTime(); block(); println(System.nanoTime() - t) }
messe { Thread.sleep(10) }                     // Trailing Lambda`,klassen:`class Konto(val inhaber: String) {          // Primärkonstruktor
    var saldo: Double = 0.0
        private set                             // nur intern änderbar

    fun einzahlen(betrag: Double) {
        require(betrag > 0) { "Betrag muss positiv sein" }
        saldo += betrag
    }

    companion object {                          // statische Member
        var anzahl = 0
    }

    init { anzahl++ }
}

data class Punkt(val x: Double, val y: Double)  // equals/hashCode/toString/copy
val p2 = Punkt(1.0, 2.0).copy(y = 5.0)`,interfaces:`interface Zeichenbar {
    fun zeichne(): String
    fun rahmen() = "[\${zeichne()}]"            // Default-Implementierung
}

interface Form { val name: String; fun flaeche(): Double }

class Quadrat(private val a: Double) : Form, Zeichenbar {
    override val name = "Quadrat"
    override fun flaeche() = a * a
    override fun zeichne() = "□"
}`,vererbung:`open class Tier(val name: String) {           // open: ableitbar (Standard ist final)
    open fun laut() = "..."
    fun vorstellen() = "$name: \${laut()}"
}

class Hund(name: String) : Tier(name) {
    override fun laut() = "Wuff"
}

abstract class Form { abstract fun flaeche(): Double }

class Logger(private val ziel: Appendable) : Appendable by ziel   // Delegation statt Vererbung`,generics:`fun <T> erstes(liste: List<T>): T? = liste.firstOrNull()

class Stapel<T> {
    private val items = ArrayDeque<T>()
    fun push(x: T) = items.addLast(x)
    fun pop(): T = items.removeLast()
}

fun <T : Comparable<T>> maximum(liste: List<T>): T = liste.max()

inline fun <reified T> nurTyp(liste: List<Any>): List<T> = liste.filterIsInstance<T>()   // Typ zur Laufzeit verfügbar`,null:`var name: String? = ladeName()      // nullable
val sicher: String = "Ada"           // nie null

val laenge = name?.length ?: 0       // Safe Call + Elvis
name?.let { println(it) }            // nur ausführen, wenn nicht null
val stadt = nutzer?.adresse?.stadt ?: "–"

if (name != null) println(name.length)   // Smart Cast nach Prüfung
// name!!.length  → wirft NullPointerException, wenn null: vermeiden`,exceptions:`class ZuWenigGuthaben(val fehlbetrag: Double) : Exception("Es fehlen $fehlbetrag €")

fun abheben(saldo: Double, betrag: Double): Double {
    if (betrag > saldo) throw ZuWenigGuthaben(betrag - saldo)
    return saldo - betrag
}

val ergebnis = try {                      // try ist ein Ausdruck
    abheben(50.0, 80.0)
} catch (e: ZuWenigGuthaben) {
    println(e.message); 0.0
} finally {
    println("immer")
}

val zahl = runCatching { "abc".toInt() }.getOrDefault(0)   // Result-Typ`,module:`// Datei: src/main/kotlin/de/shop/geometrie/Kreis.kt
package de.shop.geometrie

class Kreis(val r: Double)
internal fun hilfe() {}        // nur im selben Modul sichtbar
private fun geheim() {}        // nur in dieser Datei

// Datei: Main.kt
import de.shop.geometrie.Kreis
import kotlin.math.PI as KREISZAHL`,async:`import kotlinx.coroutines.*

suspend fun lade(url: String): String {
    delay(100)                         // nicht-blockierendes Warten
    return "Daten von $url"
}

fun main() = runBlocking {
    val a = async { lade("/api/1") }   // parallel starten
    val b = async { lade("/api/2") }
    println(a.await() + b.await())

    withTimeout(2_000) { lade("/langsam") }
}`,futures:`val scope = CoroutineScope(Dispatchers.Default)

val deferred: Deferred<Int> = scope.async { berechne(42) }   // "Future"
val job: Job = scope.launch { arbeite() }                    // ohne Ergebnis

runBlocking {
    println(deferred.await())
    job.cancelAndJoin()
}

withContext(Dispatchers.IO) { leseDatei() }   // blockierendes I/O auf passendem Pool`,dateien:`import java.io.File

val datei = File("notizen.txt")
datei.writeText("Zeile 1\\nZeile 2\\n", Charsets.UTF_8)
val inhalt = datei.readText()
datei.appendText("Zeile 3\\n")

datei.useLines { zeilen ->                 // schließt automatisch
    zeilen.filter { it.isNotBlank() }.forEach(::println)
}
println(datei.exists())`,http:`// Mit dem Java-HttpClient (ohne Zusatzbibliothek); Alternativen: Ktor Client, OkHttp
import java.net.URI
import java.net.http.*
import java.time.Duration

val client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build()
val req = HttpRequest.newBuilder(URI("https://api.github.com/repos/JetBrains/kotlin"))
    .header("Accept", "application/json").GET().build()
val res = client.send(req, HttpResponse.BodyHandlers.ofString())
check(res.statusCode() == 200) { "HTTP \${res.statusCode()}" }
println(res.body().take(100))`,json:`import kotlinx.serialization.*
import kotlinx.serialization.json.Json

@Serializable
data class Nutzer(val name: String, val alter: Int)

val json = Json { prettyPrint = true; ignoreUnknownKeys = true }
val text = json.encodeToString(Nutzer("Ada", 36))
val n = json.decodeFromString<Nutzer>("""{"name":"Tim","alter":15}""")`,datenbank:`// JDBC (wie in Java); Kotlin-Alternativen: Exposed, jOOQ, Spring Data
DriverManager.getConnection(url, user, passwort).use { conn ->
    conn.prepareStatement("SELECT id, name FROM kunden WHERE stadt = ?").use { stmt ->
        stmt.setString(1, "Berlin")
        stmt.executeQuery().use { rs ->
            while (rs.next()) println("\${rs.getInt("id")} \${rs.getString("name")}")
        }
    }
}`,regex:`val text = "Bestellung 4711 am 2026-11-05, Bestellung 815 am 2026-11-06"

val muster = Regex("""Bestellung (?<nr>\\d+)""")
muster.findAll(text).forEach { println(it.groups["nr"]?.value) }

val umgestellt = text.replace(Regex("""(\\d{4})-(\\d{2})-(\\d{2})"""), "$3.$2.$1")
val plz = Regex("""\\d{5}""").matches("10115")`,tests:`import kotlin.test.*

class RechnerTest {
    @Test
    fun addiert() {
        assertEquals(5, addiere(2, 3))
    }

    @Test
    fun teilenDurchNull() {
        assertFailsWith<ArithmeticException> { teile(1, 0) }
    }
}`},f={kommentare:`// Einzeiliger Kommentar
/* Blockkommentar */

// Flaeche berechnet die Kreisfläche.
// Doku-Kommentare stehen direkt über der Deklaration und beginnen mit deren Namen (go doc).
func Flaeche(r float64) float64 {
	return math.Pi * r * r
}`,variablen:`var zaehler int = 0
zaehler++
name := "Ada"            // Kurzdeklaration mit Typinferenz (nur in Funktionen)
var preis float64        // Nullwert: 0
a, b := 1, 2
a, b = b, a              // Tausch
// Ungenutzte lokale Variablen sind ein Compilerfehler!`,konstanten:`const MaxVersuche = 3
const Pi = 3.14159

type Wochentag int
const (
	Montag Wochentag = iota   // 0
	Dienstag                  // 1
	Mittwoch                  // 2
)`,datentypen:`var ganz int = 42          // plattformabhängig 32/64 Bit; int8…int64, uint…
var komma float64 = 3.14
var wahr bool = true
var r rune = 'ä'           // Unicode-Codepoint (int32)
var b byte = 'A'           // uint8
var text string = "Hallo"

fmt.Println(7 / 2, 7.0/2)            // 3 3.5
fmt.Printf("%T\\n", komma)            // float64
x := float64(ganz) * komma           // keine implizite Umwandlung!`,strings:`name := "Ada"
gruss := fmt.Sprintf("Hallo, %s! Du hast %d Nachrichten.", name, 6)
roh := \`Raw String: C:\\Daten, keine Escapes\`

fmt.Println(strings.ToUpper(name), len(name))             // len = Bytes!
fmt.Println(utf8.RuneCountInString("Grüße"))              // 5 Zeichen
fmt.Println(strings.Split("a,b,c", ","))
fmt.Println(strings.Join([]string{"x", "y"}, " - "))
fmt.Println(strings.Contains("Hallo", "all"))

var sb strings.Builder                                    // effizient in Schleifen
sb.WriteString("abc")`,arrays:`fest := [3]int{3, 1, 4}          // Array: Größe ist Teil des Typs
zahlen := []int{3, 1, 4}         // Slice: dynamisch
zahlen = append(zahlen, 1)
teil := zahlen[1:3]              // teilt sich den Speicher mit zahlen!
kopie := slices.Clone(zahlen)

quadrate := make([]int, 0, len(zahlen))
for _, z := range zahlen {
	quadrate = append(quadrate, z*z)
}
slices.Sort(zahlen)
fmt.Println(len(zahlen), cap(zahlen), slices.Contains(zahlen, 4), fest, teil, kopie)`,maps:`alter := map[string]int{"Ada": 36, "Linus": 28}
alter["Grace"] = 45

if jahre, ok := alter["Tim"]; ok {    // "comma ok"-Idiom
	fmt.Println(jahre)
} else {
	fmt.Println("nicht gefunden")      // alter["Tim"] allein liefert 0
}
delete(alter, "Linus")

for name, jahre := range alter {      // Reihenfolge ist absichtlich zufällig!
	fmt.Println(name, jahre)
}`,bedingungen:`temperatur := 23

if temperatur > 30 {
	fmt.Println("heiß")
} else if temperatur > 15 {
	fmt.Println("angenehm")
} else {
	fmt.Println("kalt")
}

if n, err := strconv.Atoi("42"); err == nil {   // Init-Statement im if
	fmt.Println(n)
}
// Go hat keinen Ternary-Operator.`,switch:`switch tag {
case "Sa", "So":
	fmt.Println("Wochenende")
case "Fr":
	fmt.Println("Fast Wochenende")
	fallthrough                    // explizites Durchfallen (selten)
default:
	fmt.Println("Werktag")
}

switch {                           // switch ohne Ausdruck = if-else-Kette
case temperatur > 30:
	fmt.Println("heiß")
}

switch v := x.(type) {             // Type Switch
case int:
	fmt.Println("int", v)
case string:
	fmt.Println("string", v)
}`,for:`for i := 0; i < 5; i++ {
	fmt.Println(i)
}

for i := range 5 {                 // seit Go 1.22
	fmt.Println(i)
}

for i, frucht := range []string{"Apfel", "Birne"} {
	fmt.Println(i, frucht)
}

for _, r := range "Grüße" {        // iteriert über Runes (Zeichen)
	fmt.Printf("%c ", r)
}`,while:`versuche := 0
for versuche < 3 {        // Go hat kein "while" – for mit Bedingung
	versuche++
}

for {                     // Endlosschleife
	if rand.Intn(10) == 0 {
		break
	}
}`,funktionen:`func begruesse(name, gruss string) string {
	return gruss + ", " + name + "!"
}

func teile(a, b float64) (float64, error) {      // mehrere Rückgabewerte
	if b == 0 {
		return 0, errors.New("Division durch null")
	}
	return a / b, nil
}

func summe(zahlen ...int) (gesamt int) {         // variadisch + benannter Rückgabewert
	for _, z := range zahlen {
		gesamt += z
	}
	return
}
// Keine Default- oder benannten Argumente – stattdessen Options-Structs.`,lambdas:`quadrat := func(x int) int { return x * x }
fmt.Println(quadrat(4))

namen := []string{"ada", "Linus"}
sort.Slice(namen, func(i, j int) bool {
	return strings.ToLower(namen[i]) < strings.ToLower(namen[j])
})

func multiplikator(faktor int) func(int) int {
	return func(x int) int { return x * faktor }    // Closure
}`,klassen:{code:`type Konto struct {
	Inhaber string        // Großbuchstabe = exportiert
	saldo   float64       // klein = paketintern
}

func NeuesKonto(inhaber string) *Konto {          // Konstruktor-Konvention
	return &Konto{Inhaber: inhaber}
}

func (k *Konto) Einzahlen(betrag float64) error {  // Methode mit Pointer-Receiver
	if betrag <= 0 {
		return fmt.Errorf("ungültiger Betrag: %v", betrag)
	}
	k.saldo += betrag
	return nil
}

func (k Konto) Saldo() float64 { return k.saldo }  // Value-Receiver

k := NeuesKonto("Ada")
_ = k.Einzahlen(50)`,note:"Go hat keine Klassen. Structs plus Methoden (Receiver) übernehmen ihre Rolle; Kapselung erfolgt auf Paketebene über Groß-/Kleinschreibung."},interfaces:`type Form interface {
	Flaeche() float64
}

type Quadrat struct{ A float64 }
func (q Quadrat) Flaeche() float64 { return q.A * q.A }

type Kreis struct{ R float64 }
func (k Kreis) Flaeche() float64 { return math.Pi * k.R * k.R }

// Kein "implements": Quadrat und Kreis erfüllen Form implizit
func gesamt(formen ...Form) (s float64) {
	for _, f := range formen {
		s += f.Flaeche()
	}
	return
}`,vererbung:{na:!0,code:`type Tier struct{ Name string }
func (t Tier) Vorstellen() string { return "Ich bin " + t.Name }

type Hund struct {
	Tier            // Embedding: Felder und Methoden werden "befördert"
	Rasse string
}

h := Hund{Tier: Tier{Name: "Bello"}, Rasse: "Mops"}
fmt.Println(h.Vorstellen(), h.Name)`,note:"Go hat keine Vererbung. **Embedding** (Komposition) befördert Felder und Methoden des eingebetteten Typs; Polymorphie entsteht ausschließlich über Interfaces."},generics:`func Erstes[T any](liste []T) (T, bool) {
	var null T
	if len(liste) == 0 {
		return null, false
	}
	return liste[0], true
}

type Stapel[T any] struct{ items []T }
func (s *Stapel[T]) Push(x T) { s.items = append(s.items, x) }

func Max[T cmp.Ordered](a, b T) T {     // Constraint
	if a > b {
		return a
	}
	return b
}`,null:`var p *Nutzer            // Nullwert für Pointer, Maps, Slices, Interfaces, Channels: nil
if p == nil {
	fmt.Println("kein Nutzer")
}

var namen []string        // nil-Slice: len 0, append funktioniert trotzdem
namen = append(namen, "Ada")

// Statt null oft "comma ok" oder Fehlerwerte:
nutzer, ok := cache["ada"]`,exceptions:`var ErrZuWenig = errors.New("zu wenig Guthaben")   // Sentinel-Fehler

func abheben(saldo, betrag float64) (float64, error) {
	if betrag > saldo {
		return saldo, fmt.Errorf("abheben %.2f: %w", betrag, ErrZuWenig)   // Kontext + Wrapping
	}
	return saldo - betrag, nil
}

neu, err := abheben(50, 80)
if errors.Is(err, ErrZuWenig) {
	fmt.Println("Fehler:", err)
}

f, err := os.Open("daten.txt")
if err != nil { log.Fatal(err) }
defer f.Close()              // läuft beim Verlassen der Funktion
// panic/recover nur für echte Programmierfehler`,module:`// go.mod:  module example.com/shop

// Datei: geometrie/kreis.go
package geometrie

const Pi = 3.14159                      // exportiert (Großbuchstabe)
func Flaeche(r float64) float64 { return Pi * r * r }
func hilfe() {}                         // nicht exportiert

// Datei: main.go
package main

import (
	"fmt"
	"example.com/shop/geometrie"
	str "strings"                        // Alias
)

func main() { fmt.Println(geometrie.Flaeche(2), str.ToUpper("ok")) }`,async:{na:!0,code:`func lade(url string) string {
	res, err := http.Get(url)          // blockiert nur diese Goroutine
	if err != nil { return err.Error() }
	defer res.Body.Close()
	return res.Status
}

ergebnisse := make(chan string)
for _, u := range []string{"https://go.dev", "https://example.com"} {
	go func() { ergebnisse <- lade(u) }()
}
fmt.Println(<-ergebnisse, <-ergebnisse)`,note:"Go hat kein `async/await`. Man schreibt normalen, blockierenden Code und startet ihn mit `go` in einer Goroutine; der Scheduler blockiert dabei keine OS-Threads."},futures:`var wg sync.WaitGroup
var mu sync.Mutex
summe := 0

for i := 1; i <= 10; i++ {
	wg.Add(1)
	go func() {
		defer wg.Done()
		mu.Lock()
		summe += i
		mu.Unlock()
	}()
}
wg.Wait()

// Channel als "Future":
ergebnis := make(chan int, 1)
go func() { ergebnis <- berechne() }()
select {
case v := <-ergebnis:
	fmt.Println(v)
case <-time.After(2 * time.Second):
	fmt.Println("Timeout")
}`,dateien:`err := os.WriteFile("notizen.txt", []byte("Zeile 1\\nZeile 2\\n"), 0o644)
daten, err := os.ReadFile("notizen.txt")
fmt.Println(string(daten))

f, err := os.OpenFile("notizen.txt", os.O_APPEND|os.O_WRONLY, 0o644)
if err != nil { log.Fatal(err) }
defer f.Close()
f.WriteString("Zeile 3\\n")

datei, _ := os.Open("notizen.txt")
defer datei.Close()
scanner := bufio.NewScanner(datei)       // zeilenweise
for scanner.Scan() {
	fmt.Println(scanner.Text())
}`,http:`client := &http.Client{Timeout: 10 * time.Second}   // Default-Client hat KEIN Timeout

req, _ := http.NewRequest(http.MethodGet, "https://api.github.com/repos/golang/go", nil)
req.Header.Set("Accept", "application/json")

res, err := client.Do(req)
if err != nil { log.Fatal(err) }
defer res.Body.Close()
if res.StatusCode != http.StatusOK {
	log.Fatalf("HTTP %d", res.StatusCode)
}
var repo struct{ Stars int \`json:"stargazers_count"\` }
json.NewDecoder(res.Body).Decode(&repo)`,json:`type Nutzer struct {
	Name  string \`json:"name"\`
	Alter int    \`json:"alter"\`
	Email string \`json:"email,omitempty"\`   // weglassen, wenn leer
	pw    string                             // klein = wird ignoriert
}

daten, _ := json.MarshalIndent(Nutzer{Name: "Ada", Alter: 36}, "", "  ")
fmt.Println(string(daten))

var n Nutzer
if err := json.Unmarshal([]byte(\`{"name":"Tim","alter":15}\`), &n); err != nil {
	log.Fatal(err)
}`,datenbank:`db, err := sql.Open("pgx", os.Getenv("DATABASE_URL"))   // db ist ein Pool
if err != nil { log.Fatal(err) }
defer db.Close()

rows, err := db.QueryContext(ctx, "SELECT id, name FROM kunden WHERE stadt = $1", "Berlin")
if err != nil { log.Fatal(err) }
defer rows.Close()

for rows.Next() {
	var id int
	var name string
	if err := rows.Scan(&id, &name); err != nil { log.Fatal(err) }
	fmt.Println(id, name)
}
if err := rows.Err(); err != nil { log.Fatal(err) }`,regex:`text := "Bestellung 4711 am 2026-11-05, Bestellung 815 am 2026-11-06"

re := regexp.MustCompile(\`Bestellung (?P<nr>\\d+)\`)
for _, m := range re.FindAllStringSubmatch(text, -1) {
	fmt.Println(m[re.SubexpIndex("nr")])
}

datum := regexp.MustCompile(\`(\\d{4})-(\\d{2})-(\\d{2})\`)
fmt.Println(datum.ReplaceAllString(text, "$3.$2.$1"))
fmt.Println(regexp.MustCompile(\`^\\d{5}$\`).MatchString("10115"))
// RE2-Engine: garantiert linear, aber ohne Lookbehind/Rückverweise`,tests:`// rechner_test.go   –   ausführen mit: go test ./...
package rechner

import "testing"

func TestAddiere(t *testing.T) {
	faelle := []struct{ a, b, erwartet int }{
		{2, 3, 5},
		{-1, 1, 0},
	}
	for _, f := range faelle {
		if got := Addiere(f.a, f.b); got != f.erwartet {
			t.Errorf("Addiere(%d, %d) = %d, erwartet %d", f.a, f.b, got, f.erwartet)
		}
	}
}`},b={kommentare:`// Einzeiliger Kommentar
/* Blockkommentar */

/// Doku-Kommentar (Markdown) – wird von \`cargo doc\` zu HTML.
///
/// # Beispiel
/// \`\`\`
/// assert_eq!(meincrate::verdopple(2), 4);
/// \`\`\`
pub fn verdopple(x: i32) -> i32 {
    x * 2
}`,variablen:`let name = "Ada";            // unveränderlich (Standard)
let mut zaehler = 0;         // veränderlich nur mit mut
zaehler += 1;
let preis: f64 = 9.99;
let (a, b) = (1, 2);         // Destructuring

let x = 5;
let x = x * 2;               // Shadowing: neue Variable mit gleichem Namen`,konstanten:`const MAX_VERSUCHE: u32 = 3;               // Compile-Zeit-Konstante, Typ Pflicht
static BEGRUESSUNG: &str = "Hallo";        // feste Speicheradresse, 'static Lebensdauer

fn main() {
    let fest = vec![1, 2, 3];              // ohne mut nicht veränderbar
    // fest.push(4);                       // Fehler
    println!("{MAX_VERSUCHE} {BEGRUESSUNG} {fest:?}");
}`,datentypen:`let ganz: i32 = 42;          // i8…i128, u8…u128, isize/usize
let komma: f64 = 3.14;
let wahr: bool = true;
let zeichen: char = 'ä';     // 4 Byte Unicode-Scalar
let text: &str = "Hallo";    // String-Slice; String = besitzender String
let tupel: (i32, f64) = (1, 2.0);

println!("{} {}", 7 / 2, 7.0 / 2.0);          // 3 3.5
let y = ganz as f64 * komma;                    // explizite Umwandlung
let ueberlauf = 255u8.checked_add(1);           // None statt stillem Überlauf`,strings:`let name = "Ada";
let gruss = format!("Hallo, {name}! Du hast {} Nachrichten.", 3 * 2);
let mut s = String::from("Hallo");
s.push_str(", Welt");

println!("{} {}", name.to_uppercase(), name.len());   // len = Bytes
println!("{}", "Grüße".chars().count());              // 5 Zeichen
let teile: Vec<&str> = "a,b,c".split(',').collect();
println!("{}", ["x", "y"].join(" - "));
println!("{:.2}", 3.14159);                          // 3.14
let roh = r"C:\\Daten\\ohne\\Escapes";`,arrays:`let fest = [3, 1, 4];                  // Array: [i32; 3]
let mut zahlen = vec![3, 1, 4];        // Vec<i32>
zahlen.push(1);
zahlen.insert(0, 9);
let letztes = zahlen.last();           // Option<&i32>

let quadrate: Vec<i32> = zahlen.iter().map(|z| z * z).collect();
let gerade: Vec<i32> = zahlen.iter().copied().filter(|z| z % 2 == 0).collect();
let summe: i32 = zahlen.iter().sum();
zahlen.sort();
let teil = &zahlen[1..3];              // Slice (geliehen)
println!("{fest:?} {letztes:?} {quadrate:?} {gerade:?} {summe} {teil:?}");`,maps:`use std::collections::HashMap;

let mut alter: HashMap<&str, u32> = HashMap::new();
alter.insert("Ada", 36);
alter.insert("Linus", 28);

match alter.get("Tim") {                       // Option<&u32>
    Some(j) => println!("{j}"),
    None => println!("nicht gefunden"),
}
*alter.entry("Ada").or_insert(0) += 1;         // Entry-API
alter.remove("Linus");

for (name, jahre) in &alter {
    println!("{name}: {jahre}");
}`,bedingungen:`let temperatur = 23;

if temperatur > 30 {
    println!("heiß");
} else if temperatur > 15 {
    println!("angenehm");
} else {
    println!("kalt");
}

let status = if alter >= 18 { "volljährig" } else { "minderjährig" };   // if ist ein Ausdruck
if let Some(n) = "42".parse::<i32>().ok() {
    println!("{n}");
}`,switch:`enum Form {
    Kreis { r: f64 },
    Rechteck { b: f64, h: f64 },
}

fn flaeche(f: &Form) -> f64 {
    match f {                                   // muss vollständig sein
        Form::Kreis { r } => std::f64::consts::PI * r * r,
        Form::Rechteck { b, h } => b * h,
    }
}

let text = match zahl {
    0 => "null",
    1..=9 => "einstellig",
    n if n < 0 => "negativ",                    // Guard
    _ => "groß",
};`,for:`for i in 0..5 {                     // 0 bis 4
    println!("{i}");
}
for i in (0..=10).rev().step_by(2) {
    println!("{i}");
}

let fruechte = vec!["Apfel", "Birne"];
for frucht in &fruechte {           // leiht aus, fruechte bleibt nutzbar
    println!("{frucht}");
}
for (i, frucht) in fruechte.iter().enumerate() {
    println!("{i}: {frucht}");
}`,while:`let mut versuche = 0;
while versuche < 3 {
    versuche += 1;
}

let mut n = 0;
let ergebnis = loop {          // Endlosschleife …
    n += 1;
    if n == 10 {
        break n * 2;           // … die einen Wert zurückgibt
    }
};

while let Some(top) = stapel.pop() {
    println!("{top}");
}`,funktionen:`fn begruesse(name: &str, gruss: &str) -> String {
    format!("{gruss}, {name}!")          // letzter Ausdruck = Rückgabewert (kein ;)
}

fn teile(a: f64, b: f64) -> Option<f64> {
    if b == 0.0 { None } else { Some(a / b) }
}

fn min_max(werte: &[i32]) -> (i32, i32) {
    (*werte.iter().min().unwrap(), *werte.iter().max().unwrap())
}
let (min, max) = min_max(&[3, 9, 1]);
// Keine Default-/benannten Parameter – stattdessen Builder-Muster oder Option<T>.`,lambdas:`let quadrat = |x: i32| x * x;
let addiere = |a, b| a + b;
println!("{}", quadrat(4) + addiere(1, 2));

let mut namen = vec!["ada", "Linus"];
namen.sort_by_key(|n| n.to_lowercase());

fn multiplikator(faktor: i32) -> impl Fn(i32) -> i32 {
    move |x| x * faktor          // move: faktor in die Closure verschieben
}
// Closure-Traits: Fn (liest), FnMut (verändert), FnOnce (verbraucht)`,klassen:{code:`#[derive(Debug, Clone, PartialEq)]
pub struct Konto {
    pub inhaber: String,
    saldo: f64,                     // privat (modulintern)
}

impl Konto {
    pub fn new(inhaber: impl Into<String>) -> Self {      // Konvention: new
        Self { inhaber: inhaber.into(), saldo: 0.0 }
    }

    pub fn einzahlen(&mut self, betrag: f64) -> Result<(), String> {
        if betrag <= 0.0 {
            return Err("Betrag muss positiv sein".into());
        }
        self.saldo += betrag;
        Ok(())
    }

    pub fn saldo(&self) -> f64 { self.saldo }
}

let mut k = Konto::new("Ada");
k.einzahlen(50.0).unwrap();`,note:"Rust hat keine Klassen: Daten (`struct`) und Verhalten (`impl`) sind getrennt. `#[derive]` erzeugt Standardverhalten wie Debug-Ausgabe, Kopieren und Vergleich."},interfaces:`trait Form {
    fn flaeche(&self) -> f64;
    fn beschreibe(&self) -> String {               // Default-Methode
        format!("Fläche: {:.2}", self.flaeche())
    }
}

struct Quadrat { a: f64 }
impl Form for Quadrat {
    fn flaeche(&self) -> f64 { self.a * self.a }
}

fn drucke(f: &impl Form) { println!("{}", f.beschreibe()); }   // statischer Dispatch
fn alle(formen: &[Box<dyn Form>]) -> f64 {                      // dynamischer Dispatch
    formen.iter().map(|f| f.flaeche()).sum()
}`,vererbung:{na:!0,code:`trait Tier {
    fn name(&self) -> &str;
    fn laut(&self) -> String { "...".into() }          // Default
    fn vorstellen(&self) -> String { format!("{}: {}", self.name(), self.laut()) }
}

struct Hund { name: String }
impl Tier for Hund {
    fn name(&self) -> &str { &self.name }
    fn laut(&self) -> String { "Wuff".into() }          // "überschreiben"
}

trait Haustier: Tier { fn kuscheln(&self) {} }          // Supertrait`,note:"Rust hat keine Klassenvererbung. Gemeinsames Verhalten entsteht über **Traits mit Default-Methoden**, Supertraits und Komposition."},generics:`fn erstes<T>(liste: &[T]) -> Option<&T> {
    liste.first()
}

struct Stapel<T> { items: Vec<T> }
impl<T> Stapel<T> {
    fn push(&mut self, x: T) { self.items.push(x); }
    fn pop(&mut self) -> Option<T> { self.items.pop() }
}

fn maximum<T: PartialOrd + Copy>(liste: &[T]) -> Option<T> {   // Trait Bounds
    liste.iter().copied().fold(None, |m, x| match m {
        Some(v) if v >= x => Some(v),
        _ => Some(x),
    })
}`,null:`// Rust hat kein null – stattdessen Option<T>
let name: Option<&str> = None;

match name {
    Some(n) => println!("Hallo {n}"),
    None => println!("kein Name"),
}

let laenge = name.map(|n| n.len()).unwrap_or(0);
let anzeige = name.unwrap_or("Unbekannt");
if let Some(n) = name { println!("{n}"); }

fn stadt(n: &Nutzer) -> Option<&str> {
    Some(n.adresse.as_ref()?.stadt.as_str())     // ? bricht bei None früh ab
}`,exceptions:`use std::fmt;

#[derive(Debug)]
enum KontoFehler { ZuWenig { fehlt: f64 } }

impl fmt::Display for KontoFehler {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self { KontoFehler::ZuWenig { fehlt } => write!(f, "Es fehlen {fehlt:.2} €") }
    }
}
impl std::error::Error for KontoFehler {}

fn abheben(saldo: f64, betrag: f64) -> Result<f64, KontoFehler> {
    if betrag > saldo { return Err(KontoFehler::ZuWenig { fehlt: betrag - saldo }); }
    Ok(saldo - betrag)
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let inhalt = std::fs::read_to_string("daten.txt")?;   // ? reicht Fehler weiter
    match abheben(50.0, 80.0) {
        Ok(s) => println!("{s}"),
        Err(e) => eprintln!("{e}"),
    }
    Ok(())
}`,module:`// src/geometrie.rs  (oder src/geometrie/mod.rs)
pub const PI: f64 = 3.14159;
pub fn flaeche(r: f64) -> f64 { PI * r * r }
fn hilfe() {}                       // privat

// src/main.rs
mod geometrie;                      // Modul einbinden
use geometrie::flaeche;
use std::collections::{HashMap, HashSet};
use serde::Deserialize;             // externes Crate (Cargo.toml)

fn main() { println!("{}", flaeche(2.0)); }`,async:`// Cargo.toml: tokio = { version = "1", features = ["full"] }, reqwest = "0.12"
async fn lade(url: &str) -> Result<u16, reqwest::Error> {
    let res = reqwest::get(url).await?;
    Ok(res.status().as_u16())
}

#[tokio::main]
async fn main() {
    let (a, b) = tokio::join!(lade("https://example.com"), lade("https://www.rust-lang.org"));
    println!("{a:?} {b:?}");
}
// Futures sind "lazy": Ohne .await (oder spawn) passiert nichts.`,futures:`use std::sync::{Arc, Mutex};
use std::thread;

let summe = Arc::new(Mutex::new(0));
let mut handles = vec![];

for i in 1..=10 {
    let summe = Arc::clone(&summe);
    handles.push(thread::spawn(move || {
        *summe.lock().unwrap() += i;
    }));
}
for h in handles { h.join().unwrap(); }
println!("{}", *summe.lock().unwrap());     // 55

// Der Compiler verhindert Data Races: ohne Mutex kompiliert das nicht.`,dateien:`use std::fs::{self, OpenOptions};
use std::io::{BufRead, BufReader, Write};

fs::write("notizen.txt", "Zeile 1\\nZeile 2\\n")?;
let inhalt = fs::read_to_string("notizen.txt")?;

let mut f = OpenOptions::new().append(true).open("notizen.txt")?;
writeln!(f, "Zeile 3")?;

let datei = fs::File::open("notizen.txt")?;
for zeile in BufReader::new(datei).lines() {      // zeilenweise
    println!("{}", zeile?);
}
// Dateien werden automatisch geschlossen, wenn sie out of scope gehen (RAII).`,http:`// reqwest (blocking-Feature) – async-Variante analog mit .await
let client = reqwest::blocking::Client::builder()
    .timeout(std::time::Duration::from_secs(10))
    .user_agent("devatlas-demo")
    .build()?;

let res = client.get("https://api.github.com/repos/rust-lang/rust").send()?;
let res = res.error_for_status()?;                // Fehler bei 4xx/5xx
let repo: serde_json::Value = res.json()?;
println!("{}", repo["stargazers_count"]);`,json:`use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
struct Nutzer {
    name: String,
    alter: u32,
    #[serde(skip_serializing_if = "Option::is_none")]
    email: Option<String>,
}

let text = serde_json::to_string_pretty(&Nutzer { name: "Ada".into(), alter: 36, email: None })?;
let n: Nutzer = serde_json::from_str(r#"{"name":"Tim","alter":15}"#)?;
println!("{text}\\n{n:?}");`,datenbank:`// sqlx mit PostgreSQL (async, Tokio)
let pool = sqlx::PgPool::connect(&std::env::var("DATABASE_URL")?).await?;

let kunden: Vec<(i32, String)> = sqlx::query_as(
    "SELECT id, name FROM kunden WHERE stadt = $1",
)
.bind("Berlin")                      // Parameter binden
.fetch_all(&pool)
.await?;

for (id, name) in kunden { println!("{id} {name}"); }
// sqlx::query! prüft SQL sogar zur Compile-Zeit gegen die Datenbank.`,regex:`use regex::Regex;   // Crate "regex"

let text = "Bestellung 4711 am 2026-11-05, Bestellung 815 am 2026-11-06";

let re = Regex::new(r"Bestellung (?<nr>\\d+)").unwrap();
for caps in re.captures_iter(text) {
    println!("{}", &caps["nr"]);
}

let datum = Regex::new(r"(\\d{4})-(\\d{2})-(\\d{2})").unwrap();
println!("{}", datum.replace_all(text, "$3.$2.$1"));
println!("{}", Regex::new(r"^\\d{5}$").unwrap().is_match("10115"));`,tests:`pub fn addiere(a: i32, b: i32) -> i32 { a + b }

#[cfg(test)]
mod tests {                       // ausführen mit: cargo test
    use super::*;

    #[test]
    fn addiert() {
        assert_eq!(addiere(2, 3), 5);
    }

    #[test]
    #[should_panic(expected = "division")]
    fn teilen_durch_null() {
        panic!("division by zero");
    }
}`},k={kommentare:`// Einzeiliger Kommentar
/* Mehrzeiliger Kommentar */

/**
 * @brief Berechnet die Kreisfläche (Doxygen-Stil).
 * @param r Radius
 */
double flaeche(double r) { return 3.14159 * r * r; }`,variablen:`int zaehler = 0;
++zaehler;
std::string name = "Ada";
auto preis = 9.99;              // Typinferenz: double
int a{1}, b{2};                 // Uniform Initialization
std::swap(a, b);
auto [x, y] = std::pair{1, 2};  // Structured Bindings (C++17)`,konstanten:`constexpr int MAX_VERSUCHE = 3;         // Compile-Zeit-Konstante
const std::string name = "Ada";         // zur Laufzeit, nicht änderbar

constexpr int quadrat(int x) { return x * x; }
static_assert(quadrat(4) == 16);       // zur Compile-Zeit geprüft

void drucke(const std::vector<int>& v); // const-Referenz: lesen ohne Kopie`,datentypen:`int ganz = 42;                 // meist 32 Bit
long long gross = 9'000'000'000;
std::int64_t fest = 42;        // <cstdint>: feste Breiten
double komma = 3.14;
bool wahr = true;
char zeichen = 'A';
std::string text = "Hallo";

std::cout << 7 / 2 << ' ' << 7 / 2.0 << '\\n';     // 3 3.5
auto y = static_cast<double>(ganz) * komma;       // expliziter Cast
// Signed-Overflow ist undefiniertes Verhalten!`,strings:`#include <format>   // C++20
std::string name = "Ada";
std::string gruss = std::format("Hallo, {}! Du hast {} Nachrichten.", name, 6);
std::string roh = R"(C:\\Daten\\ohne Escapes)";

std::cout << name.size() << ' ' << name.substr(1, 2) << '\\n';
name += " Lovelace";
bool enthaelt = name.find("Love") != std::string::npos;
bool start = name.starts_with("Ada");             // C++20
std::string_view sicht = name;                     // nicht-besitzende Sicht`,arrays:`#include <vector>
#include <algorithm>
#include <numeric>

std::array<int, 3> fest{3, 1, 4};            // feste Größe
std::vector<int> zahlen{3, 1, 4};
zahlen.push_back(1);
zahlen.insert(zahlen.begin(), 9);

std::vector<int> quadrate;
std::ranges::transform(zahlen, std::back_inserter(quadrate), [](int z) { return z * z; });
int summe = std::accumulate(zahlen.begin(), zahlen.end(), 0);
std::ranges::sort(zahlen);
int sicher = zahlen.at(0);                    // mit Grenzprüfung (wirft); [] prüft nicht`,maps:`#include <unordered_map>
#include <map>

std::unordered_map<std::string, int> alter{{"Ada", 36}, {"Linus", 28}};
alter["Grace"] = 45;                          // Achtung: [] legt fehlende Einträge an!

if (auto it = alter.find("Tim"); it != alter.end())
    std::cout << it->second;
bool da = alter.contains("Ada");              // C++20
alter.erase("Linus");

for (const auto& [name, jahre] : alter)
    std::cout << name << ": " << jahre << '\\n';

std::map<std::string, int> sortiert;          // geordnet (Baum)`,bedingungen:`int temperatur = 23;

if (temperatur > 30) {
    std::cout << "heiß\\n";
} else if (temperatur > 15) {
    std::cout << "angenehm\\n";
} else {
    std::cout << "kalt\\n";
}

auto status = alter >= 18 ? "volljährig" : "minderjährig";
if (auto n = parse(eingabe); n.has_value()) { /* Init-Statement (C++17) */ }`,switch:{code:`switch (tag) {
    case 6:
    case 7:
        std::cout << "Wochenende\\n";
        break;                 // ohne break: Durchfallen!
    case 5:
        std::cout << "Fast Wochenende\\n";
        [[fallthrough]];       // bewusstes Durchfallen kennzeichnen
    default:
        std::cout << "Werktag\\n";
}

// "Pattern Matching" über std::variant:
std::variant<int, std::string> v = "hallo";
std::visit([](const auto& x) { std::cout << x << '\\n'; }, v);`,note:"C++ `switch` funktioniert nur mit Ganzzahlen und Enums. Echtes Pattern Matching ist (Stand C++23) noch nicht Teil des Standards."},for:`for (int i = 0; i < 5; ++i) {
    std::cout << i << '\\n';
}

std::vector<std::string> fruechte{"Apfel", "Birne"};
for (const auto& frucht : fruechte) {        // Range-based for
    std::cout << frucht << '\\n';
}

for (std::size_t i = 0; i < fruechte.size(); ++i)
    std::cout << i << ": " << fruechte[i] << '\\n';`,while:`int versuche = 0;
while (versuche < 3) {
    ++versuche;
}

std::string eingabe;
do {
    std::getline(std::cin, eingabe);
} while (eingabe != "ende");`,funktionen:`std::string begruesse(const std::string& name, const std::string& gruss = "Hallo") {
    return gruss + ", " + name + "!";
}

int summe(std::initializer_list<int> zahlen) {
    return std::accumulate(zahlen.begin(), zahlen.end(), 0);
}

std::pair<int, int> minMax(const std::vector<int>& w) {
    auto [mi, ma] = std::ranges::minmax(w);
    return {mi, ma};
}

void verdopple(int& x) { x *= 2; }         // Referenzparameter verändert das Original`,lambdas:`auto quadrat = [](int x) { return x * x; };
auto addiere = [](auto a, auto b) { return a + b; };   // generisches Lambda

std::vector<std::string> namen{"ada", "Linus"};
std::ranges::sort(namen, [](const auto& a, const auto& b) { return a.size() < b.size(); });

int faktor = 2;
auto mal = [faktor](int x) { return x * faktor; };     // Capture per Wert
auto zaehle = [&faktor]() { ++faktor; };               // per Referenz (Lebensdauer beachten!)
std::function<int(int)> f = mal;`,klassen:`class Konto {
public:
    explicit Konto(std::string inhaber) : inhaber_(std::move(inhaber)) { ++anzahl; }

    void einzahlen(double betrag) {
        if (betrag <= 0) throw std::invalid_argument("Betrag muss positiv sein");
        saldo_ += betrag;
    }

    double saldo() const { return saldo_; }       // const: verändert nichts
    static inline int anzahl = 0;                 // C++17

private:
    std::string inhaber_;
    double saldo_ = 0.0;
};

struct Punkt { double x, y; };                    // struct = Klasse mit public-Default
Konto k{"Ada"};
k.einzahlen(50);`,interfaces:{code:`class Form {                                // abstrakte Klasse als Interface
public:
    virtual ~Form() = default;              // virtueller Destruktor Pflicht
    virtual double flaeche() const = 0;     // rein virtuell
};

class Quadrat : public Form {
public:
    explicit Quadrat(double a) : a_(a) {}
    double flaeche() const override { return a_ * a_; }
private:
    double a_;
};

template <typename T>
concept HatFlaeche = requires(const T& t) { { t.flaeche() } -> std::convertible_to<double>; };   // C++20`,note:"C++ hat kein `interface`-Schlüsselwort. Man nutzt abstrakte Klassen mit rein virtuellen Methoden – oder für statische Polymorphie Concepts (C++20)."},vererbung:`class Tier {
public:
    explicit Tier(std::string name) : name_(std::move(name)) {}
    virtual ~Tier() = default;
    virtual std::string laut() const { return "..."; }
    std::string vorstellen() const { return name_ + ": " + laut(); }
protected:
    std::string name_;
};

class Hund final : public Tier {            // final: nicht weiter ableitbar
public:
    using Tier::Tier;                       // Konstruktor erben
    std::string laut() const override { return "Wuff"; }
};

std::unique_ptr<Tier> t = std::make_unique<Hund>("Bello");
std::cout << t->vorstellen();               // Polymorphie über Zeiger/Referenz`,generics:`template <typename T>
T maximum(const T& a, const T& b) { return a > b ? a : b; }

template <typename T>
class Stapel {
public:
    void push(T x) { items_.push_back(std::move(x)); }
    T pop() { T x = std::move(items_.back()); items_.pop_back(); return x; }
private:
    std::vector<T> items_;
};

template <std::integral T>                  // Concept als Constraint (C++20)
T verdopple(T x) { return x * 2; }

Stapel<std::string> s;
s.push("hallo");`,null:`int* p = nullptr;                          // statt NULL oder 0
if (p == nullptr) std::cout << "kein Ziel\\n";

std::optional<std::string> name = ladeName();   // C++17
std::cout << name.value_or("Unbekannt");
if (name) std::cout << name->size();

std::unique_ptr<Nutzer> n = findeNutzer(42);    // leer = kein Nutzer
if (n) std::cout << n->name;`,exceptions:`class ZuWenigGuthaben : public std::runtime_error {
public:
    explicit ZuWenigGuthaben(double fehlt)
        : std::runtime_error("Es fehlen " + std::to_string(fehlt) + " EUR") {}
};

double abheben(double saldo, double betrag) {
    if (betrag > saldo) throw ZuWenigGuthaben(betrag - saldo);
    return saldo - betrag;
}

try {
    abheben(50, 80);
} catch (const ZuWenigGuthaben& e) {       // per const-Referenz fangen
    std::cerr << e.what() << '\\n';
} catch (const std::exception& e) {
    std::cerr << "Fehler: " << e.what() << '\\n';
}
// Kein finally: Aufräumen erledigt RAII (Destruktoren). Alternative: std::expected (C++23)`,module:`// geometrie.hpp
#pragma once
namespace geometrie {
    constexpr double PI = 3.14159;
    double flaeche(double r);
}

// geometrie.cpp
#include "geometrie.hpp"
double geometrie::flaeche(double r) { return PI * r * r; }

// main.cpp
#include <iostream>
#include "geometrie.hpp"
using geometrie::flaeche;
int main() { std::cout << flaeche(2); }
// C++20-Module: export module geometrie; … import geometrie;`,async:{na:!0,code:`#include <future>

auto f1 = std::async(std::launch::async, [] { return lade("a"); });
auto f2 = std::async(std::launch::async, [] { return lade("b"); });
std::cout << f1.get() << f2.get();       // get() wartet

// Coroutines (C++20) existieren als Sprachfeature (co_await, co_return),
// erfordern aber eine Bibliothek (z. B. Boost.Asio, cppcoro) für den Alltag.`,note:"Die Standardbibliothek hat kein komfortables `async/await`. Coroutinen sind seit C++20 im Sprachkern, die nötigen Task-Typen kommen aus Bibliotheken."},futures:`#include <thread>
#include <mutex>
#include <future>

std::mutex mu;
int summe = 0;
std::vector<std::jthread> threads;              // C++20: joint automatisch
for (int i = 1; i <= 10; ++i)
    threads.emplace_back([&, i] {
        std::lock_guard lock(mu);               // RAII-Lock
        summe += i;
    });
threads.clear();                                // alle beendet

std::promise<int> versprechen;
std::future<int> zukunft = versprechen.get_future();
std::thread([&] { versprechen.set_value(42); }).detach();
std::cout << zukunft.get();`,dateien:`#include <fstream>
#include <filesystem>

{
    std::ofstream out("notizen.txt");            // schließt am Blockende (RAII)
    out << "Zeile 1\\nZeile 2\\n";
}
std::ofstream("notizen.txt", std::ios::app) << "Zeile 3\\n";

std::ifstream in("notizen.txt");
if (!in) throw std::runtime_error("Datei nicht lesbar");
for (std::string zeile; std::getline(in, zeile);)
    std::cout << zeile << '\\n';

std::cout << std::filesystem::exists("notizen.txt");`,http:{code:`// Beispiel mit der Bibliothek cpr (basiert auf libcurl)
#include <cpr/cpr.h>

cpr::Response r = cpr::Get(
    cpr::Url{"https://api.github.com/repos/llvm/llvm-project"},
    cpr::Header{{"Accept", "application/json"}},
    cpr::Timeout{10000});

if (r.status_code != 200) throw std::runtime_error("HTTP " + std::to_string(r.status_code));
std::cout << r.text.substr(0, 100);`,note:"Die C++-Standardbibliothek enthält keinen HTTP-Client. Übliche Bibliotheken: libcurl, cpr, Boost.Beast."},json:`// nlohmann/json – De-facto-Standard
#include <nlohmann/json.hpp>
using json = nlohmann::json;

struct Nutzer { std::string name; int alter; };
NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(Nutzer, name, alter)

json j = Nutzer{"Ada", 36};
std::string text = j.dump(2);
auto n = json::parse(R"({"name":"Tim","alter":15})").get<Nutzer>();`,datenbank:`// SQLite C-API aus C++
sqlite3* db;
sqlite3_open("shop.db", &db);

sqlite3_stmt* stmt;
sqlite3_prepare_v2(db, "SELECT id, name FROM kunden WHERE stadt = ?", -1, &stmt, nullptr);
sqlite3_bind_text(stmt, 1, "Berlin", -1, SQLITE_TRANSIENT);   // Parameter binden

while (sqlite3_step(stmt) == SQLITE_ROW) {
    std::cout << sqlite3_column_int(stmt, 0) << ' '
              << reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1)) << '\\n';
}
sqlite3_finalize(stmt);
sqlite3_close(db);
// Komfortabler: SQLiteCpp, libpqxx (PostgreSQL), SOCI`,regex:`#include <regex>

std::string text = "Bestellung 4711 am 2026-11-05, Bestellung 815 am 2026-11-06";

std::regex re(R"(Bestellung (\\d+))");
for (std::sregex_iterator it(text.begin(), text.end(), re), ende; it != ende; ++it)
    std::cout << (*it)[1] << '\\n';

std::regex datum(R"((\\d{4})-(\\d{2})-(\\d{2}))");
std::cout << std::regex_replace(text, datum, "$3.$2.$1") << '\\n';
bool plz = std::regex_match("10115", std::regex(R"(\\d{5})"));
// std::regex ist langsam; Alternativen: RE2, CTRE`,tests:`// GoogleTest
#include <gtest/gtest.h>
#include "rechner.hpp"

TEST(Rechner, Addiert) {
    EXPECT_EQ(addiere(2, 3), 5);
}

TEST(Rechner, TeilenDurchNullWirft) {
    EXPECT_THROW(teile(1, 0), std::domain_error);
}`},z={kommentare:`<?php
// Einzeiliger Kommentar
# auch möglich
/* Mehrzeiliger Kommentar */

/**
 * PHPDoc: Berechnet die Kreisfläche.
 * @param float $r Radius
 * @return float
 */
function flaeche(float $r): float {
    return M_PI * $r ** 2;
}`,variablen:`<?php
$zaehler = 0;           // Variablen beginnen mit $
$zaehler++;
$name = "Ada";
[$a, $b] = [1, 2];      // Destructuring
[$a, $b] = [$b, $a];    // Tausch
$preis = 9.99;`,konstanten:`<?php
const MAX_VERSUCHE = 3;
define('APP_NAME', 'Shop');

class Config {
    public const VERSION = '1.0';
    public function __construct(public readonly string $modus) {}   // readonly (PHP 8.1)
}
echo Config::VERSION;`,datentypen:`<?php
declare(strict_types=1);   // keine stillen Typumwandlungen bei Funktionsaufrufen

$ganz = 42;          // int
$komma = 3.14;       // float
$wahr = true;        // bool
$text = "Hallo";     // string
$nichts = null;      // null
$liste = [1, 2];     // array

var_dump(7 / 2, intdiv(7, 2));        // float(3.5) int(3)
echo gettype($komma), get_debug_type($ganz);   // double int
var_dump("10" == "1e1");              // true (!) – daher ===`,strings:`<?php
$name = "Ada";
$gruss = "Hallo, $name! Du hast {$anzahl} Nachrichten.";   // nur in "…"
$roh = 'Keine $interpolation in einfachen Anführungszeichen';
$text = <<<EOT
    Heredoc mit $name
    EOT;

echo strtoupper($name), strlen($name), mb_strlen("Grüße");   // mb_ für Unicode
echo implode(" - ", ["x", "y"]), str_contains($name, "d");
print_r(explode(",", "a,b,c"));
echo sprintf("%.2f", 3.14159), substr("Hallo", 1, 3);`,arrays:`<?php
$zahlen = [3, 1, 4];
$zahlen[] = 1;                         // anhängen
array_unshift($zahlen, 9);
$letztes = $zahlen[array_key_last($zahlen)];

$quadrate = array_map(fn($z) => $z * $z, $zahlen);
$gerade = array_filter($zahlen, fn($z) => $z % 2 === 0);   // Schlüssel bleiben erhalten!
$summe = array_sum($zahlen);
sort($zahlen);                          // sortiert in-place
echo count($zahlen), in_array(4, $zahlen, true);`,maps:`<?php
// PHP-Arrays sind geordnete Maps
$alter = ["Ada" => 36, "Linus" => 28];
$alter["Grace"] = 45;
$tim = $alter["Tim"] ?? 0;               // Null-Coalescing statt Warnung
unset($alter["Linus"]);

foreach ($alter as $name => $jahre) {
    echo "$name: $jahre\\n";
}
echo array_key_exists("Ada", $alter) ? "ja" : "nein";`,bedingungen:`<?php
$temperatur = 23;

if ($temperatur > 30) {
    echo "heiß";
} elseif ($temperatur > 15) {
    echo "angenehm";
} else {
    echo "kalt";
}

$status = $alter >= 18 ? "volljährig" : "minderjährig";
$name = $eingabe ?: "Standard";        // Elvis: bei "falsy" Wert`,switch:`<?php
// match (PHP 8): Ausdruck, strikter Vergleich (===), kein Fall-Through
$text = match ($tag) {
    'Sa', 'So' => 'Wochenende',
    'Fr' => 'Fast Wochenende',
    default => 'Werktag',
};

$kategorie = match (true) {
    $alter < 13 => 'Kind',
    $alter < 18 => 'Jugend',
    default => 'Erwachsen',
};

enum Status: string { case Aktiv = 'aktiv'; case Gesperrt = 'gesperrt'; }`,for:`<?php
for ($i = 0; $i < 5; $i++) {
    echo $i;
}

foreach (["Apfel", "Birne"] as $frucht) {
    echo $frucht;
}

foreach (["Apfel", "Birne"] as $i => $frucht) {
    echo "$i: $frucht";
}

foreach (range(1, 10, 2) as $n) echo $n;   // 1 3 5 7 9`,while:`<?php
$versuche = 0;
while ($versuche < 3) {
    $versuche++;
}

do {
    $zahl = random_int(1, 10);
} while ($zahl !== 7);`,funktionen:`<?php
function begruesse(string $name, string $gruss = "Hallo"): string {
    return "$gruss, $name!";
}

begruesse("Ada");
begruesse(gruss: "Moin", name: "Tim");      // Named Arguments (PHP 8)

function summe(int ...$zahlen): int {        // variadisch
    return array_sum($zahlen);
}

function minMax(array $w): array {
    return [min($w), max($w)];
}
[$min, $max] = minMax([3, 9, 1]);`,lambdas:`<?php
$quadrat = fn(int $x): int => $x * $x;          // Arrow Function: fängt automatisch ein
$faktor = 2;
$mal = function (int $x) use ($faktor) {         // Closure: Variablen explizit mit use
    return $x * $faktor;
};

$namen = ["ada", "Linus"];
usort($namen, fn($a, $b) => strcasecmp($a, $b));
$laenge = strlen(...);                           // First-Class Callable (PHP 8.1)`,klassen:`<?php
final class Konto
{
    private float $saldo = 0.0;
    private static int $anzahl = 0;

    public function __construct(public readonly string $inhaber)   // Constructor Promotion
    {
        self::$anzahl++;
    }

    public function einzahlen(float $betrag): static
    {
        if ($betrag <= 0) {
            throw new InvalidArgumentException('Betrag muss positiv sein');
        }
        $this->saldo += $betrag;
        return $this;
    }

    public function saldo(): float { return $this->saldo; }
}

$k = (new Konto('Ada'))->einzahlen(50);`,interfaces:`<?php
interface Form
{
    public function flaeche(): float;
}

interface Zeichenbar
{
    public function zeichne(): string;
}

final class Quadrat implements Form, Zeichenbar
{
    public function __construct(private float $a) {}
    public function flaeche(): float { return $this->a ** 2; }
    public function zeichne(): string { return '□'; }
}

trait Loggt { public function log(string $m): void { echo $m; } }   // Traits: Code-Wiederverwendung`,vererbung:`<?php
abstract class Tier
{
    public function __construct(protected string $name) {}
    abstract public function laut(): string;
    public function vorstellen(): string { return "{$this->name}: {$this->laut()}"; }
}

class Hund extends Tier
{
    #[\\Override]                         // PHP 8.3: prüft, dass wirklich überschrieben wird
    public function laut(): string { return 'Wuff'; }

    public function vorstellen(): string { return parent::vorstellen() . '!'; }
}`,generics:{na:!0,code:`<?php
/**
 * @template T
 * @param list<T> $liste
 * @return T|null
 */
function erstes(array $liste): mixed {
    return $liste[0] ?? null;
}`,note:"PHP hat keine Generics im Sprachkern. Statische Analysewerkzeuge wie PHPStan und Psalm unterstützen sie über PHPDoc-Annotationen (`@template`)."},null:`<?php
function laenge(?string $s): int {           // ?string = string oder null
    return $s === null ? 0 : strlen($s);
}

$stadt = $nutzer?->adresse?->stadt;          // Nullsafe-Operator (PHP 8)
$anzeige = $stadt ?? 'Unbekannt';
$config['modus'] ??= 'dev';`,exceptions:`<?php
class ZuWenigGuthaben extends RuntimeException {}

function abheben(float $saldo, float $betrag): float {
    if ($betrag > $saldo) {
        throw new ZuWenigGuthaben(sprintf('Es fehlen %.2f €', $betrag - $saldo));
    }
    return $saldo - $betrag;
}

try {
    abheben(50, 80);
} catch (ZuWenigGuthaben $e) {
    echo $e->getMessage();
} catch (TypeError | ValueError $e) {
    echo 'Ungültige Eingabe';
} finally {
    echo 'immer';
}`,module:`<?php
// src/Geometrie/Kreis.php   (PSR-4-Autoloading über Composer)
namespace App\\Geometrie;

final class Kreis { /* … */ }

// public/index.php
require __DIR__ . '/../vendor/autoload.php';

use App\\Geometrie\\Kreis;
use function App\\Hilfen\\formatiere;

$k = new Kreis();`,async:{na:!0,code:`<?php
// Fibers (PHP 8.1) sind die Grundlage für Async-Bibliotheken wie Amp oder ReactPHP
use function Amp\\async;
use function Amp\\Future\\await;

$futures = [
    async(fn() => file_get_contents('https://example.com')),
    async(fn() => file_get_contents('https://php.net')),
];
[$a, $b] = await($futures);`,note:"PHP hat kein natives `async/await`. Klassisch läuft jede Anfrage synchron in einem eigenen Prozess; Nebenläufigkeit bieten Fibers mit Bibliotheken wie Amp, ReactPHP oder Swoole."},futures:{na:!0,note:"Keine Promises/Futures im Sprachkern. Parallele Arbeit erfolgt typischerweise über Queues (Laravel Queues, Symfony Messenger) und Worker-Prozesse oder über Async-Bibliotheken (Amp, ReactPHP)."},dateien:`<?php
file_put_contents('notizen.txt', "Zeile 1\\nZeile 2\\n");
$inhalt = file_get_contents('notizen.txt');
file_put_contents('notizen.txt', "Zeile 3\\n", FILE_APPEND | LOCK_EX);

$datei = new SplFileObject('notizen.txt');
foreach ($datei as $zeile) {             // zeilenweise
    echo trim($zeile), PHP_EOL;
}
var_dump(file_exists('notizen.txt'));`,http:`<?php
// Mit Guzzle (composer require guzzlehttp/guzzle)
$client = new GuzzleHttp\\Client(['timeout' => 10]);

$res = $client->get('https://api.github.com/repos/php/php-src', [
    'headers' => ['Accept' => 'application/json', 'User-Agent' => 'devatlas'],
]);                                       // wirft bei 4xx/5xx standardmäßig

$daten = json_decode((string) $res->getBody(), true, flags: JSON_THROW_ON_ERROR);
echo $daten['stargazers_count'];`,json:`<?php
$nutzer = ['name' => 'Ada', 'alter' => 36];
$json = json_encode($nutzer, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);

$daten = json_decode('{"name":"Tim","alter":15}', associative: true, flags: JSON_THROW_ON_ERROR);
echo $daten['name'];

$objekt = json_decode('{"name":"Tim"}');     // stdClass
echo $objekt->name;`,datenbank:`<?php
$pdo = new PDO('pgsql:host=localhost;dbname=shop', 'app', getenv('DB_PASSWORD'), [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);

$stmt = $pdo->prepare('SELECT id, name FROM kunden WHERE stadt = :stadt');
$stmt->execute(['stadt' => 'Berlin']);         // Parameter – nie per String verketten

foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
    echo $row['id'], ' ', htmlspecialchars($row['name']), PHP_EOL;
}`,regex:`<?php
$text = 'Bestellung 4711 am 2026-11-05, Bestellung 815 am 2026-11-06';

preg_match_all('/Bestellung (?<nr>\\d+)/', $text, $treffer);
print_r($treffer['nr']);                         // ['4711', '815']

echo preg_replace('/(\\d{4})-(\\d{2})-(\\d{2})/', '$3.$2.$1', $text);
var_dump(preg_match('/^\\d{5}$/', '10115') === 1);`,tests:`<?php
// PHPUnit   –   ausführen mit: vendor/bin/phpunit
use PHPUnit\\Framework\\TestCase;
use PHPUnit\\Framework\\Attributes\\DataProvider;

final class RechnerTest extends TestCase
{
    public function testAddiert(): void
    {
        $this->assertSame(5, addiere(2, 3));
    }

    public static function faelle(): array { return [[1, 1, 2], [-1, 1, 0]]; }

    #[DataProvider('faelle')]
    public function testAddiertViele(int $a, int $b, int $erwartet): void
    {
        $this->assertSame($erwartet, addiere($a, $b));
    }

    public function testTeilenDurchNull(): void
    {
        $this->expectException(DivisionByZeroError::class);
        teile(1, 0);
    }
}`},S={kommentare:`// Einzeiliger Kommentar (seit C99)
/* Klassischer Blockkommentar */`,variablen:`int zaehler = 0;
zaehler++;
double preis = 9.99;
const char *name = "Ada";
int a = 1, b = 2, tmp;
tmp = a; a = b; b = tmp;      /* Tausch über Hilfsvariable */`,strings:`#include <stdio.h>
#include <string.h>

char name[32] = "Ada";
char gruss[64];
snprintf(gruss, sizeof gruss, "Hallo, %s! (%d)", name, 6);   /* sicher formatieren */
printf("%s %zu\\n", gruss, strlen(name));
strncat(name, " Lovelace", sizeof name - strlen(name) - 1);
int gleich = strcmp(name, "Ada") == 0;   /* Strings nie mit == vergleichen */`,arrays:`int zahlen[] = {3, 1, 4};
size_t n = sizeof zahlen / sizeof zahlen[0];   /* Länge nur bei echten Arrays */

int *dyn = malloc(10 * sizeof *dyn);           /* dynamisch */
if (dyn == NULL) return 1;
for (size_t i = 0; i < 10; i++) dyn[i] = (int)(i * i);
free(dyn);

int cmp(const void *a, const void *b) { return *(const int *)a - *(const int *)b; }
qsort(zahlen, n, sizeof zahlen[0], cmp);`,maps:{na:!0,note:"C hat keine eingebauten Maps. Man implementiert eine Hashtabelle selbst oder nutzt Bibliotheken (z. B. uthash, GLib `GHashTable`). Für kleine, feste Schlüsselmengen reichen Arrays von Structs."},bedingungen:`int temperatur = 23;

if (temperatur > 30) {
    puts("heiß");
} else if (temperatur > 15) {
    puts("angenehm");
} else {
    puts("kalt");
}

const char *status = alter >= 18 ? "volljährig" : "minderjährig";`,switch:`switch (tag) {
    case 6:
    case 7:
        puts("Wochenende");
        break;            /* ohne break: Durchfallen */
    default:
        puts("Werktag");
}`,for:`for (int i = 0; i < 5; i++) {
    printf("%d\\n", i);
}

const char *fruechte[] = {"Apfel", "Birne"};
for (size_t i = 0; i < sizeof fruechte / sizeof fruechte[0]; i++)
    printf("%zu: %s\\n", i, fruechte[i]);`,while:`int versuche = 0;
while (versuche < 3) {
    versuche++;
}

int c;
while ((c = getchar()) != EOF) {   /* Zeichenweise einlesen */
    putchar(c);
}`,funktionen:`#include <stdbool.h>

int addiere(int a, int b) {
    return a + b;
}

bool teile(int a, int b, int *ergebnis) {   /* "Rückgabe" über Zeiger */
    if (b == 0) return false;
    *ergebnis = a / b;
    return true;
}

int erg;
if (teile(7, 2, &erg)) printf("%d\\n", erg);`,klassen:{na:!0,code:`typedef struct {
    char inhaber[32];
    double saldo;
} Konto;

void konto_einzahlen(Konto *k, double betrag) {   /* "Methode" = Funktion mit Zeiger */
    if (betrag > 0) k->saldo += betrag;
}

Konto k = { .inhaber = "Ada", .saldo = 0 };
konto_einzahlen(&k, 50);`,note:"C hat keine Klassen. Structs bündeln Daten, Funktionen mit einem Zeiger auf das Struct ersetzen Methoden."},exceptions:{na:!0,code:`FILE *f = fopen("daten.txt", "r");
if (f == NULL) {
    perror("fopen");          /* Fehlertext aus errno */
    return 1;
}
/* … */
fclose(f);`,note:"C hat keine Exceptions. Fehler werden über Rückgabewerte und `errno` signalisiert und müssen nach jedem Aufruf geprüft werden."}},v={kommentare:`# Einzeiliger Kommentar
=begin
Mehrzeiliger Kommentar (selten genutzt)
=end`,variablen:`zaehler = 0
zaehler += 1
name = "Ada"
a, b = 1, 2
a, b = b, a           # Tausch
$global = "meiden"    # globale Variable
KONSTANTE = 3         # Großbuchstabe = Konstante (Warnung bei Änderung)`,strings:`name = "Ada"
gruss = "Hallo, #{name}! Du hast #{3 * 2} Nachrichten."   # nur in "…"
puts name.upcase, name.length, name.reverse
puts "a,b,c".split(",").inspect
puts %w[x y].join(" - ")
puts format("%.2f", 3.14159)
puts "Hallo"[1..3]                 # "all"`,arrays:`zahlen = [3, 1, 4]
zahlen << 1                 # anhängen
zahlen.unshift(9)
puts zahlen.first, zahlen.last

quadrate = zahlen.map { |z| z * z }
gerade = zahlen.select(&:even?)
summe = zahlen.sum
sortiert = zahlen.sort.reverse
puts zahlen.include?(4)`,maps:`alter = { "Ada" => 36, "Linus" => 28 }
optionen = { modus: "dev", debug: true }      # Symbol-Schlüssel
alter["Grace"] = 45
puts alter.fetch("Tim", 0)                    # Default
alter.delete("Linus")

alter.each { |name, jahre| puts "#{name}: #{jahre}" }
puts alter.key?("Ada")`,bedingungen:`temperatur = 23

if temperatur > 30
  puts "heiß"
elsif temperatur > 15
  puts "angenehm"
else
  puts "kalt"
end

status = alter >= 18 ? "volljährig" : "minderjährig"
puts "Warnung" unless temperatur.between?(0, 40)   # unless + Modifier`,switch:`text = case tag
       when "Sa", "So" then "Wochenende"
       when "Fr" then "Fast Wochenende"
       else "Werktag"
       end

case [1, 2]
in [x, y] then puts "Paar #{x}/#{y}"     # Pattern Matching (Ruby 3)
end`,for:`5.times { |i| puts i }
(1..10).step(2) { |i| puts i }

["Apfel", "Birne"].each { |frucht| puts frucht }
["Apfel", "Birne"].each_with_index { |frucht, i| puts "#{i}: #{frucht}" }

for i in 0...5 do puts i end    # möglich, aber unüblich`,while:`versuche = 0
while versuche < 3
  versuche += 1
end

until versuche.zero?            # Gegenstück zu while
  versuche -= 1
end

loop do
  break if rand > 0.9
end`,funktionen:`def begruesse(name, gruss: "Hallo")      # Keyword-Argument mit Default
  "#{gruss}, #{name}!"                       # letzter Ausdruck = Rückgabewert
end

begruesse("Ada")
begruesse("Tim", gruss: "Moin")

def summe(*zahlen) = zahlen.sum            # Endless Method (Ruby 3)
def min_max(w) = [w.min, w.max]
min, max = min_max([3, 9, 1])`,lambdas:`quadrat = ->(x) { x * x }
puts quadrat.(4)

namen = ["ada", "Linus"].sort_by(&:downcase)
[1, 2, 3].map { |x| x * 2 }

def mit_messung
  start = Time.now
  yield                        # Block ausführen
  puts Time.now - start
end
mit_messung { sleep 0.1 }`,klassen:`class Konto
  attr_reader :inhaber, :saldo

  @@anzahl = 0

  def initialize(inhaber)
    @inhaber = inhaber          # @ = Instanzvariable
    @saldo = 0
    @@anzahl += 1
  end

  def einzahlen(betrag)
    raise ArgumentError, "Betrag muss positiv sein" unless betrag.positive?
    @saldo += betrag
    self
  end
end

k = Konto.new("Ada").einzahlen(50)
Punkt = Struct.new(:x, :y)        # schnelle Datenklasse (oder Data.define)`,vererbung:`class Tier
  def initialize(name) = @name = name
  def laut = "..."
  def vorstellen = "#{@name}: #{laut}"
end

class Hund < Tier
  def laut = "Wuff"
  def vorstellen = super + "!"
end

module Schwimmfaehig            # Mixin statt Mehrfachvererbung
  def schwimme = "#{@name} schwimmt"
end
class Hund; include Schwimmfaehig; end`,exceptions:`class ZuWenigGuthaben < StandardError; end

def abheben(saldo, betrag)
  raise ZuWenigGuthaben, "Es fehlen #{betrag - saldo} €" if betrag > saldo
  saldo - betrag
end

begin
  abheben(50, 80)
rescue ZuWenigGuthaben => e
  puts e.message
rescue ArgumentError, TypeError
  puts "Ungültig"
else
  puts "Erfolg"
ensure
  puts "immer"
end`},w={kommentare:`// Einzeiliger Kommentar
/* Mehrzeilig /* verschachtelbar */ */

/// Doku-Kommentar (Markdown, in Xcode als Quick Help sichtbar)
func flaeche(r: Double) -> Double { .pi * r * r }`,variablen:`var zaehler = 0          // veränderlich
zaehler += 1
let name = "Ada"         // Konstante (bevorzugt)
let preis: Double = 9.99
var (a, b) = (1, 2)
(a, b) = (b, a)`,strings:`let name = "Ada"
let gruss = "Hallo, \\(name)! Du hast \\(3 * 2) Nachrichten."
let mehrzeilig = """
    Zeile 1
    Zeile 2
    """

print(name.uppercased(), name.count)          // count = Zeichen (Grapheme)
print("a,b,c".split(separator: ","))
print(["x", "y"].joined(separator: " - "))
print(String(format: "%.2f", 3.14159))
print(name.hasPrefix("A"), name.contains("d"))`,arrays:`var zahlen = [3, 1, 4]
zahlen.append(1)
zahlen.insert(9, at: 0)
let letztes = zahlen.last             // Optional

let quadrate = zahlen.map { $0 * $0 }
let gerade = zahlen.filter { $0 % 2 == 0 }
let summe = zahlen.reduce(0, +)
let sortiert = zahlen.sorted(by: >)
print(zahlen.contains(4), zahlen.count)`,maps:`var alter: [String: Int] = ["Ada": 36, "Linus": 28]
alter["Grace"] = 45
print(alter["Tim", default: 0])
alter["Linus"] = nil                       // entfernen

if let ada = alter["Ada"] { print(ada) }   // Zugriff liefert Optional
for (name, jahre) in alter.sorted(by: { $0.key < $1.key }) {
    print("\\(name): \\(jahre)")
}`,bedingungen:`let temperatur = 23

if temperatur > 30 {
    print("heiß")
} else if temperatur > 15 {
    print("angenehm")
} else {
    print("kalt")
}

let status = alter >= 18 ? "volljährig" : "minderjährig"
guard let zahl = Int(eingabe) else { return }   // früh aussteigen`,switch:`enum Form {
    case kreis(r: Double)
    case rechteck(b: Double, h: Double)
}

func flaeche(_ f: Form) -> Double {
    switch f {                                   // muss vollständig sein
    case .kreis(let r): return .pi * r * r
    case let .rechteck(b, h): return b * h
    }
}

switch alter {
case 0..<13: print("Kind")
case 13..<18: print("Jugend")
default: print("Erwachsen")
}`,for:`for i in 0..<5 { print(i) }
for i in stride(from: 10, through: 0, by: -2) { print(i) }

for frucht in ["Apfel", "Birne"] { print(frucht) }
for (i, frucht) in ["Apfel", "Birne"].enumerated() { print(i, frucht) }`,while:`var versuche = 0
while versuche < 3 {
    versuche += 1
}

repeat {                        // do-while
    versuche -= 1
} while versuche > 0`,funktionen:`func begruesse(_ name: String, gruss: String = "Hallo") -> String {
    "\\(gruss), \\(name)!"           // Einzeiler: implizites return
}

begruesse("Ada")
begruesse("Tim", gruss: "Moin")   // Argument-Labels sind Pflicht

func minMax(_ w: [Int]) -> (min: Int, max: Int)? {
    guard let mi = w.min(), let ma = w.max() else { return nil }
    return (mi, ma)
}

func verdopple(_ x: inout Int) { x *= 2 }`,lambdas:`let quadrat = { (x: Int) -> Int in x * x }
let namen = ["ada", "Linus"].sorted { $0.lowercased() < $1.lowercased() }
let doppelt = [1, 2, 3].map { $0 * 2 }

func multiplikator(_ faktor: Int) -> (Int) -> Int {
    { $0 * faktor }
}`,klassen:`final class Konto {
    let inhaber: String
    private(set) var saldo: Double = 0       // nur intern änderbar
    static var anzahl = 0

    init(inhaber: String) {
        self.inhaber = inhaber
        Konto.anzahl += 1
    }

    func einzahlen(_ betrag: Double) throws {
        guard betrag > 0 else { throw KontoFehler.ungueltig }
        saldo += betrag
    }
}

struct Punkt: Equatable { var x: Double; var y: Double }   // Werttyp, bevorzugt
enum KontoFehler: Error { case ungueltig }`,vererbung:`class Tier {
    let name: String
    init(name: String) { self.name = name }
    func laut() -> String { "..." }
}

class Hund: Tier {
    override func laut() -> String { "Wuff" }
}

protocol Zeichenbar { func zeichne() -> String }
extension Zeichenbar { func rahmen() -> String { "[\\(zeichne())]" } }   // Protokoll-Erweiterung`,null:`var name: String? = nil

if let name { print("Hallo \\(name)") }       // Kurzform (Swift 5.7)
let laenge = name?.count ?? 0
let stadt = nutzer?.adresse?.stadt ?? "–"
guard let n = name else { return }
// name!  → Absturz, wenn nil: vermeiden`},y={variablen:`var zaehler = 0;         // Typ inferiert
zaehler++;
final name = 'Ada';      // einmal zuweisbar (zur Laufzeit)
const pi = 3.14159;      // Compile-Zeit-Konstante
String? spitzname;       // nullable
late String spaeter;     // wird später initialisiert`,strings:`final name = 'Ada';
final gruss = 'Hallo, $name! Du hast \${3 * 2} Nachrichten.';
final mehrzeilig = '''
Zeile 1
Zeile 2''';

print(name.toUpperCase());
print('a,b,c'.split(','));
print(['x', 'y'].join(' - '));
print(3.14159.toStringAsFixed(2));`,arrays:`final zahlen = [3, 1, 4];
zahlen.add(1);
zahlen.insert(0, 9);

final quadrate = zahlen.map((z) => z * z).toList();
final gerade = zahlen.where((z) => z.isEven).toList();
final summe = zahlen.reduce((a, b) => a + b);
zahlen.sort();
final mitBedingung = [1, if (true) 2, for (final x in [3, 4]) x];   // Collection if/for`,maps:`final alter = <String, int>{'Ada': 36, 'Linus': 28};
alter['Grace'] = 45;
print(alter['Tim'] ?? 0);
alter.remove('Linus');

alter.forEach((name, jahre) => print('$name: $jahre'));
for (final MapEntry(:key, :value) in alter.entries) print('$key $value');   // Dart 3`,bedingungen:`final temperatur = 23;

if (temperatur > 30) {
  print('heiß');
} else if (temperatur > 15) {
  print('angenehm');
} else {
  print('kalt');
}

final status = alter >= 18 ? 'volljährig' : 'minderjährig';`,for:`for (var i = 0; i < 5; i++) {
  print(i);
}

for (final frucht in ['Apfel', 'Birne']) {
  print(frucht);
}

['Apfel', 'Birne'].asMap().forEach((i, f) => print('$i: $f'));`,while:`var versuche = 0;
while (versuche < 3) {
  versuche++;
}

do {
  versuche--;
} while (versuche > 0);`,funktionen:`String begruesse(String name, {String gruss = 'Hallo'}) =>   // benannter Parameter
    '$gruss, $name!';

begruesse('Ada');
begruesse('Tim', gruss: 'Moin');

int summe(List<int> zahlen) => zahlen.fold(0, (a, b) => a + b);

(int, int) minMax(List<int> w) => (w.reduce(min), w.reduce(max));   // Record (Dart 3)
final (kleinster, groesster) = minMax([3, 9, 1]);`,klassen:`class Konto {
  final String inhaber;
  double _saldo = 0;              // _ = bibliotheksprivat
  static int anzahl = 0;

  Konto(this.inhaber) { anzahl++; }

  double get saldo => _saldo;

  void einzahlen(double betrag) {
    if (betrag <= 0) throw ArgumentError('Betrag muss positiv sein');
    _saldo += betrag;
  }
}

final k = Konto('Ada')..einzahlen(50);   // Kaskaden-Operator`,async:`Future<String> lade(String url) async {
  await Future.delayed(const Duration(milliseconds: 100));
  return 'Daten von $url';
}

Future<void> main() async {
  final ergebnisse = await Future.wait([lade('/a'), lade('/b')]);
  print(ergebnisse);

  await for (final wert in Stream.periodic(const Duration(seconds: 1), (i) => i).take(3)) {
    print(wert);
  }
}`},x={variablen:`var zaehler = 0         // veränderlich
zaehler += 1
val name = "Ada"        // unveränderlich (bevorzugt)
val preis: Double = 9.99
val (a, b) = (1, 2)`,strings:`val name = "Ada"
val gruss = s"Hallo, $name! Du hast \${3 * 2} Nachrichten."
val formatiert = f"\${3.14159}%.2f"
val roh = raw"C:\\Daten"

println(name.toUpperCase + " " + name.length)
println(List("x", "y").mkString(" - "))`,arrays:`val zahlen = List(3, 1, 4)              // unveränderlich
val mehr = zahlen :+ 1                   // neue Liste
val quadrate = zahlen.map(z => z * z)
val gerade = zahlen.filter(_ % 2 == 0)
val summe = zahlen.sum
val sortiert = zahlen.sorted

val puffer = scala.collection.mutable.ArrayBuffer(1, 2)
puffer += 3`,maps:`val alter = Map("Ada" -> 36, "Linus" -> 28)
val neu = alter + ("Grace" -> 45)
println(alter.getOrElse("Tim", 0))
alter.get("Ada") match
  case Some(j) => println(j)
  case None    => println("nicht gefunden")

for (name, jahre) <- alter do println(s"$name: $jahre")`,bedingungen:`val temperatur = 23

val text =
  if temperatur > 30 then "heiß"
  else if temperatur > 15 then "angenehm"
  else "kalt"                     // if ist ein Ausdruck

println(text)`,for:`for i <- 0 until 5 do println(i)

for frucht <- List("Apfel", "Birne") do println(frucht)

val paare = for
  x <- 1 to 3
  y <- 1 to 3
  if x < y
yield (x, y)                       // for-Comprehension`,while:`var versuche = 0
while versuche < 3 do
  versuche += 1`,funktionen:`def begruesse(name: String, gruss: String = "Hallo"): String =
  s"$gruss, $name!"

begruesse("Ada")
begruesse(gruss = "Moin", name = "Tim")

def summe(zahlen: Int*): Int = zahlen.sum
def minMax(w: Seq[Int]): (Int, Int) = (w.min, w.max)`,klassen:`class Konto(val inhaber: String):
  private var saldo = 0.0

  def einzahlen(betrag: Double): Unit =
    require(betrag > 0, "Betrag muss positiv sein")
    saldo += betrag

  def kontostand: Double = saldo

case class Punkt(x: Double, y: Double)     // unveränderlich, equals, copy, Pattern Matching
val p2 = Punkt(1, 2).copy(y = 5)`,switch:`enum Form:
  case Kreis(r: Double)
  case Rechteck(b: Double, h: Double)

def flaeche(f: Form): Double = f match
  case Form.Kreis(r)       => math.Pi * r * r
  case Form.Rechteck(b, h) => b * h`},T={kommentare:`-- Einzeiliger Kommentar
--[[ Mehrzeiliger
     Kommentar ]]`,variablen:`local zaehler = 0        -- local verwenden!
zaehler = zaehler + 1    -- kein += in Standard-Lua
local name = "Ada"
local a, b = 1, 2
a, b = b, a`,strings:`local name = "Ada"
local gruss = string.format("Hallo, %s! Du hast %d Nachrichten.", name, 6)
local verkettet = "Hallo, " .. name     -- Verkettung mit ..

print(name:upper(), #name)              -- # = Länge in Bytes
print(("Hallo"):sub(2, 4))              -- "all" (1-basiert, inklusiv)
for teil in ("a,b,c"):gmatch("[^,]+") do print(teil) end`,arrays:`local zahlen = {3, 1, 4}            -- Tables als Arrays (Index ab 1!)
table.insert(zahlen, 1)             -- anhängen
table.insert(zahlen, 1, 9)          -- an Position 1 einfügen
print(zahlen[1], #zahlen)

table.sort(zahlen)
print(table.concat(zahlen, ", "))`,maps:`local alter = { Ada = 36, Linus = 28 }   -- Tables als Dictionaries
alter["Grace"] = 45
alter.Tim = nil                          -- nil entfernt den Eintrag
print(alter.Ada, alter.Unbekannt or 0)

for name, jahre in pairs(alter) do       -- Reihenfolge nicht garantiert
  print(name, jahre)
end`,bedingungen:`local temperatur = 23

if temperatur > 30 then
  print("heiß")
elseif temperatur > 15 then
  print("angenehm")
else
  print("kalt")
end

local status = alter >= 18 and "volljährig" or "minderjährig"   -- Ternary-Idiom
-- Nur nil und false sind falsy – 0 und "" sind truthy!`,for:`for i = 1, 5 do print(i) end              -- 1 bis 5 (inklusiv)
for i = 10, 0, -2 do print(i) end

for i, frucht in ipairs({"Apfel", "Birne"}) do
  print(i, frucht)
end`,while:`local versuche = 0
while versuche < 3 do
  versuche = versuche + 1
end

repeat                          -- wie do-while
  versuche = versuche - 1
until versuche == 0`,funktionen:`local function begruesse(name, gruss)
  gruss = gruss or "Hallo"           -- Default-Idiom
  return gruss .. ", " .. name .. "!"
end

local function minMax(...)           -- variadisch
  return math.min(...), math.max(...)   -- mehrere Rückgabewerte
end
local mi, ma = minMax(3, 9, 1)`,klassen:{code:`local Konto = {}
Konto.__index = Konto

function Konto.new(inhaber)
  return setmetatable({ inhaber = inhaber, saldo = 0 }, Konto)
end

function Konto:einzahlen(betrag)     -- ":" übergibt self implizit
  assert(betrag > 0, "Betrag muss positiv sein")
  self.saldo = self.saldo + betrag
end

local k = Konto.new("Ada")
k:einzahlen(50)`,note:"Lua hat keine Klassen. Objekte entstehen aus Tables, Methoden und Vererbung über **Metatables** (`__index`)."}},A={kommentare:`# Kommentar
: '
Mehrzeiliger "Kommentar" (eigentlich ein ignorierter String)
'`,variablen:`name="Ada"              # keine Leerzeichen um =
zaehler=0
((zaehler++))           # Arithmetik
echo "$name hat $zaehler Nachrichten"   # immer quoten!
readonly MAX=3
heute="$(date +%F)"      # Kommandosubstitution
export PORT=8080         # an Kindprozesse vererben`,strings:'name="Ada"\necho "Hallo, ${name}!"\necho "${#name}"                 # Länge\necho "${name^^}" "${name,,}"   # GROSS/klein (Bash 4+)\ndatei="bericht.final.txt"\necho "${datei%.txt}"            # Suffix entfernen → bericht.final\necho "${datei##*.}"             # Endung → txt\necho "${name:1:2}"              # Teilstring → da',arrays:`fruechte=("Apfel" "Birne")
fruechte+=("Kirsche")
echo "\${fruechte[0]}"            # erstes Element
echo "\${#fruechte[@]}"           # Anzahl
for f in "\${fruechte[@]}"; do    # mit Quotes iterieren
  echo "$f"
done`,maps:`declare -A alter               # assoziatives Array (Bash 4+)
alter[Ada]=36
alter[Linus]=28
echo "\${alter[Ada]}"
echo "\${alter[Tim]:-0}"        # Default, falls leer
unset 'alter[Linus]'

for name in "\${!alter[@]}"; do
  echo "$name: \${alter[$name]}"
done`,bedingungen:`temperatur=23

if (( temperatur > 30 )); then
  echo "heiß"
elif (( temperatur > 15 )); then
  echo "angenehm"
else
  echo "kalt"
fi

if [[ -f "config.yml" && "$MODUS" == "prod" ]]; then echo "Produktion"; fi
[[ -d /tmp ]] && echo "Verzeichnis existiert" || echo "fehlt"`,switch:`case "$1" in
  start)        echo "Starte …" ;;
  stop|halt)    echo "Stoppe …" ;;
  *.txt)        echo "Textdatei" ;;     # Glob-Muster
  *)            echo "Aufruf: $0 {start|stop}"; exit 1 ;;
esac`,for:`for i in {1..5}; do echo "$i"; done

for ((i = 0; i < 5; i++)); do echo "$i"; done

for datei in ./*.log; do            # Globbing
  [[ -e "$datei" ]] || continue
  echo "Verarbeite $datei"
done`,while:`versuche=0
while (( versuche < 3 )); do
  ((versuche++))
done

while IFS= read -r zeile; do        # Datei zeilenweise lesen
  echo "> $zeile"
done < eingabe.txt`,funktionen:`begruesse() {
  local name="$1"                   # Parameter: $1, $2, …
  local gruss="\${2:-Hallo}"         # Default
  echo "$gruss, $name!"             # "Rückgabe" über stdout
}

ergebnis="$(begruesse "Ada")"

ist_gerade() {
  (( $1 % 2 == 0 ))                 # Exit-Code 0 = wahr
}
if ist_gerade 4; then echo "gerade"; fi`,klassen:{na:!0,note:"Bash hat keine Klassen oder Objekte. Für strukturierte Daten nutzt man assoziative Arrays, JSON mit `jq` – oder wechselt zu Python."},exceptions:{na:!0,code:`set -euo pipefail                   # bei Fehlern abbrechen
trap 'echo "Fehler in Zeile $LINENO" >&2' ERR

if ! cp quelle.txt ziel.txt; then
  echo "Kopieren fehlgeschlagen" >&2
  exit 1
fi`,note:"Keine Exceptions: Jeder Befehl liefert einen Exit-Code (`$?`). `set -e` bricht bei Fehlern ab, `trap` reagiert darauf."}},E={kommentare:`# Einzeiliger Kommentar
<#
  Mehrzeiliger Kommentar / Comment-Based Help
  .SYNOPSIS
  Kurzbeschreibung der Funktion
#>`,variablen:`$zaehler = 0
$zaehler++
$name = "Ada"
[int]$alter = 36              # optional typisiert
$a, $b = 1, 2
$a, $b = $b, $a
Set-Variable -Name MAX -Value 3 -Option ReadOnly
$env:PORT = "8080"            # Umgebungsvariable`,strings:`$name = "Ada"
$gruss = "Hallo, $name! Du hast $(3 * 2) Nachrichten."   # nur in "…"
$roh = 'Kein $name hier'
$here = @"
Mehrzeilig mit $name
"@

$name.ToUpper(); $name.Length
"a,b,c" -split ","
("x", "y") -join " - "
"{0:N2}" -f 3.14159`,arrays:`$zahlen = @(3, 1, 4)
$zahlen += 1                       # erzeugt neues Array
$liste = [System.Collections.Generic.List[int]]::new()   # effizient bei vielen Elementen
$liste.Add(5)

$quadrate = $zahlen | ForEach-Object { $_ * $_ }
$gerade = $zahlen | Where-Object { $_ % 2 -eq 0 }
($zahlen | Measure-Object -Sum).Sum
$zahlen | Sort-Object -Descending`,maps:`$alter = @{ Ada = 36; Linus = 28 }
$alter["Grace"] = 45
$alter.Remove("Linus")
$alter.ContainsKey("Ada")

foreach ($eintrag in $alter.GetEnumerator()) {
    "$($eintrag.Key): $($eintrag.Value)"
}
$geordnet = [ordered]@{ a = 1; b = 2 }`,bedingungen:`$temperatur = 23

if ($temperatur -gt 30) {
    "heiß"
} elseif ($temperatur -gt 15) {
    "angenehm"
} else {
    "kalt"
}
# Vergleichsoperatoren: -eq -ne -gt -lt -ge -le -like -match -contains
$status = $alter -ge 18 ? "volljährig" : "minderjährig"   # PowerShell 7+`,switch:`switch ($befehl) {
    "start"           { "Starte …" }
    { $_ -in "stop", "halt" } { "Stoppe …" }
    default           { "Unbekannt" }
}

switch -Wildcard ($datei) {
    "*.log" { "Logdatei" }
    "*.txt" { "Textdatei" }
}`,for:`for ($i = 0; $i -lt 5; $i++) { $i }

foreach ($frucht in "Apfel", "Birne") { $frucht }

1..5 | ForEach-Object { "Nummer $_" }

Get-ChildItem *.log | ForEach-Object { $_.Name }`,while:`$versuche = 0
while ($versuche -lt 3) {
    $versuche++
}

do {
    $eingabe = Read-Host "Befehl"
} until ($eingabe -eq "ende")`,funktionen:`function Get-Gruss {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$Name,
        [string]$Gruss = "Hallo"
    )
    "$Gruss, $Name!"            # Ausgabe = Rückgabewert
}

Get-Gruss -Name "Ada"
Get-Gruss -Name "Tim" -Gruss "Moin"`,klassen:`class Konto {
    [string]$Inhaber
    hidden [double]$Saldo = 0

    Konto([string]$inhaber) { $this.Inhaber = $inhaber }

    [void] Einzahlen([double]$betrag) {
        if ($betrag -le 0) { throw "Betrag muss positiv sein" }
        $this.Saldo += $betrag
    }
}

$k = [Konto]::new("Ada")
$k.Einzahlen(50)`,exceptions:`try {
    Get-Content "fehlt.txt" -ErrorAction Stop     # Fehler "terminierend" machen
}
catch [System.Management.Automation.ItemNotFoundException] {
    Write-Warning "Datei nicht gefunden"
}
catch {
    Write-Error $_.Exception.Message
}
finally {
    "immer"
}`},$={kommentare:`# Kommentar (R kennt nur einzeilige Kommentare)
#' roxygen2-Doku-Kommentar für Paketfunktionen
#' @param r Radius`,variablen:`zaehler <- 0           # <- ist die übliche Zuweisung
zaehler <- zaehler + 1
name <- "Ada"
preis = 9.99           # = funktioniert auch
x <- c(1, 2, 3)        # Vektoren sind der Grundtyp`,strings:`name <- "Ada"
gruss <- sprintf("Hallo, %s! Du hast %d Nachrichten.", name, 6L)
paste("Hallo", name)               # mit Leerzeichen
paste0("Hallo", name)              # ohne

toupper(name); nchar(name)
strsplit("a,b,c", ",")[[1]]
substr("Hallo", 2, 4)              # "all"
format(3.14159, nsmall = 2)`,arrays:`zahlen <- c(3, 1, 4)           # Vektor (Index ab 1!)
zahlen <- c(zahlen, 1)
zahlen[1]; length(zahlen)

quadrate <- zahlen^2           # vektorisiert, keine Schleife nötig
gerade <- zahlen[zahlen %% 2 == 0]
sum(zahlen); mean(zahlen); sort(zahlen, decreasing = TRUE)

liste <- list(1, "zwei", TRUE)  # Listen können gemischte Typen enthalten`,maps:`alter <- list(Ada = 36, Linus = 28)       # benannte Liste
alter$Grace <- 45
alter[["Ada"]]
alter$Linus <- NULL                       # entfernen
"Ada" %in% names(alter)

for (n in names(alter)) cat(n, ":", alter[[n]], "\\n")

benannt <- c(apfel = 0.5, birne = 0.8)    # benannter Vektor`,bedingungen:`temperatur <- 23

if (temperatur > 30) {
  print("heiß")
} else if (temperatur > 15) {
  print("angenehm")
} else {
  print("kalt")
}

status <- ifelse(alter >= 18, "volljährig", "minderjährig")   # vektorisiert`,for:`for (i in 1:5) print(i)

for (frucht in c("Apfel", "Birne")) print(frucht)

for (i in seq_along(x)) cat(i, x[i], "\\n")     # sicherer als 1:length(x)

sapply(1:5, function(i) i^2)                    # oft besser als Schleifen`,while:`versuche <- 0
while (versuche < 3) {
  versuche <- versuche + 1
}

repeat {
  if (runif(1) > 0.9) break
}`,funktionen:`begruesse <- function(name, gruss = "Hallo") {
  paste0(gruss, ", ", name, "!")       # letzter Ausdruck = Rückgabewert
}

begruesse("Ada")
begruesse(gruss = "Moin", name = "Tim")

min_max <- function(w) list(min = min(w), max = max(w))
quadrat <- \\(x) x^2                    # Kurz-Lambda (R 4.1)`,klassen:{code:`# S3: einfaches, verbreitetes Klassensystem
konto <- function(inhaber) structure(list(inhaber = inhaber, saldo = 0), class = "konto")

print.konto <- function(x, ...) cat("Konto von", x$inhaber, ":", x$saldo, "€\\n")

k <- konto("Ada")
print(k)
# Weitere Systeme: S4 (formal), R6 (referenzbasiert, wie klassische OOP)`,note:"R kennt mehrere OOP-Systeme. S3 nutzt generische Funktionen mit Dispatch über das `class`-Attribut."}},P={variablen:`zaehler = 0
zaehler += 1
name = "Ada"
preis::Float64 = 9.99      # Typannotation (global seit Julia 1.8)
a, b = 1, 2
a, b = b, a
const MAX = 3`,strings:`name = "Ada"
gruss = "Hallo, $name! Du hast $(3 * 2) Nachrichten."
println(uppercase(name), " ", length(name))
println(split("a,b,c", ","))
println(join(["x", "y"], " - "))
using Printf; @printf("%.2f\\n", 3.14159)`,arrays:`zahlen = [3, 1, 4]            # Index ab 1
push!(zahlen, 1)              # ! = verändert das Argument (Konvention)
pushfirst!(zahlen, 9)
zahlen[end]                   # letztes Element

quadrate = zahlen .^ 2        # Broadcasting
gerade = filter(iseven, zahlen)
sum(zahlen); sort(zahlen; rev = true)
[x^2 for x in 1:5 if isodd(x)]   # Comprehension`,maps:`alter = Dict("Ada" => 36, "Linus" => 28)
alter["Grace"] = 45
get(alter, "Tim", 0)
delete!(alter, "Linus")
haskey(alter, "Ada")

for (name, jahre) in alter
    println("$name: $jahre")
end`,bedingungen:`temperatur = 23

if temperatur > 30
    println("heiß")
elseif temperatur > 15
    println("angenehm")
else
    println("kalt")
end

status = alter >= 18 ? "volljährig" : "minderjährig"`,for:`for i in 1:5
    println(i)
end

for (i, frucht) in enumerate(["Apfel", "Birne"])
    println(i, ": ", frucht)
end`,while:`versuche = 0
while versuche < 3
    global versuche += 1     # im globalen Scope nötig
end`,funktionen:`function begruesse(name; gruss = "Hallo")    # Keyword-Argument nach ;
    "$gruss, $name!"
end

begruesse("Ada")
begruesse("Tim"; gruss = "Moin")

quadrat(x) = x^2                              # Kurzform
flaeche(r::Real) = π * r^2                    # Multiple Dispatch nach Typ
flaeche(b::Real, h::Real) = b * h`,klassen:{code:`mutable struct Konto
    inhaber::String
    saldo::Float64
end
Konto(inhaber) = Konto(inhaber, 0.0)        # äußerer Konstruktor

function einzahlen!(k::Konto, betrag)       # Funktion statt Methode
    betrag > 0 || throw(ArgumentError("Betrag muss positiv sein"))
    k.saldo += betrag
    k
end

k = Konto("Ada")
einzahlen!(k, 50)`,note:"Julia hat keine Klassen mit Methoden. Daten (`struct`) und Funktionen sind getrennt; welche Methode läuft, entscheidet Multiple Dispatch anhand der Argumenttypen."}},_={konstanten:{code:`#define MAX_NUTZER 100            // Präprozessor-Makro: reine Textersetzung, kein Typ
const double PI = 3.14159;        // typisierte, schreibgeschützte Variable
enum Farbe { ROT, GRUEN, BLAU };  // Aufzählungskonstanten (0, 1, 2)

// const und Zeiger:
// const int *p   → Wert über p nicht änderbar, p selbst schon
// int *const p   → p nicht änderbar, Wert schon`,note:"Seit C23 gibt es zusätzlich `constexpr` für echte Compile-Zeit-Konstanten. In älterem Code dominieren `#define` und `enum`."},datentypen:{code:`#include <stdint.h>
#include <stdbool.h>
#include <stdio.h>

int ganz = 42;                 // mindestens 16 Bit, meist 32
long gross = 123456789L;
double kommazahl = 3.14;
char zeichen = 'A';            // genau 1 Byte
bool aktiv = true;             // <stdbool.h>, ab C23 eingebaut
uint8_t byte = 255;            // exakte Breite aus <stdint.h>
int64_t id = 9007199254740993;

printf("%zu Bytes\\n", sizeof(int));   // Größe ist plattformabhängig!`,note:"Die Größen von `int`, `long` usw. sind nur als Mindestgrößen festgelegt. Für Dateiformate und Protokolle immer die exakten Typen aus `<stdint.h>` verwenden."},lambdas:{na:!0,code:`int verdopple(int x) { return x * 2; }
int (*f)(int) = verdopple;              // Funktionszeiger statt Lambda
printf("%d\\n", f(21));                  // 42

// Callback für qsort
int vergleiche(const void *a, const void *b) {
    int x = *(const int *)a, y = *(const int *)b;
    return (x > y) - (x < y);           // vermeidet Überlauf von x - y
}
qsort(zahlen, n, sizeof(int), vergleiche);`,note:"Standard-C kennt keine anonymen Funktionen oder Closures. Funktionszeiger plus ein zusätzlicher `void *`-Kontextparameter sind das übliche Muster."},interfaces:{na:!0,code:`typedef struct Form {
    double (*flaeche)(const struct Form *self);   // "Interface" als Funktionszeiger
} Form;

typedef struct { Form basis; double r; } Kreis;   // basis muss erstes Feld sein

double kreis_flaeche(const Form *f) {
    const Kreis *k = (const Kreis *)f;
    return 3.14159 * k->r * k->r;
}

Kreis k = { { kreis_flaeche }, 2.0 };
printf("%.2f\\n", k.basis.flaeche(&k.basis));`,note:"Keine Interfaces in der Sprache. Structs mit Funktionszeigern (V-Tables) bilden das Muster nach – so arbeiten z. B. Linux-Kernel-Treiber."},vererbung:{na:!0,code:`typedef struct { char name[32]; } Tier;
typedef struct { Tier basis; int lautstaerke; } Hund;   // "erbt" durch Einbettung

void tier_vorstellen(const Tier *t) { printf("Ich bin %s\\n", t->name); }

Hund h = { { "Rex" }, 7 };
tier_vorstellen(&h.basis);          // Hund als Tier verwenden
tier_vorstellen((Tier *)&h);        // erlaubt, weil basis das erste Feld ist`,note:"C hat keine Vererbung. Komposition mit der „Basis“ als erstem Struct-Feld erlaubt es, einen Zeiger auf das abgeleitete Struct als Zeiger auf die Basis zu verwenden."},generics:{na:!0,code:`#define MAX(a, b) ((a) > (b) ? (a) : (b))   // typunabhängig, aber: Argumente werden ggf. doppelt ausgewertet!

// C11: Auswahl nach Typ zur Compilezeit
#define TYPNAME(x) _Generic((x), int: "int", double: "double", char *: "string", default: "anderer")
printf("%s\\n", TYPNAME(3.0));    // double

// Generische Container arbeiten mit void* und Elementgröße – wie qsort:
void qsort(void *basis, size_t anzahl, size_t groesse, int (*cmp)(const void *, const void *));`,note:"Keine Generics. Ersatz: Makros, `_Generic` (C11) und `void *` mit Größenangabe – auf Kosten der Typsicherheit."},null:{code:`#include <stdlib.h>

int *p = malloc(sizeof *p);
if (p == NULL) {                  // malloc kann fehlschlagen
    perror("malloc");
    return 1;
}
*p = 42;
free(p);
p = NULL;                         // vermeidet "Dangling Pointer"

// NULL zu dereferenzieren ist undefiniertes Verhalten (meist Absturz)`,note:"C23 führt `nullptr` mit eigenem Typ ein. Rückgabewerte von `malloc`, `fopen` usw. immer auf `NULL` prüfen."},module:{code:`/* mathe.h – Schnittstelle */
#ifndef MATHE_H
#define MATHE_H
int addiere(int a, int b);
#endif

/* mathe.c – Implementierung */
#include "mathe.h"
int addiere(int a, int b) { return a + b; }
static int hilfsfunktion(void) { return 0; }   // static = nur in dieser Datei sichtbar

/* main.c */
#include <stdio.h>
#include "mathe.h"
int main(void) { printf("%d\\n", addiere(2, 3)); }

/* Übersetzen: gcc main.c mathe.c -o app */`,note:"Header-Dateien deklarieren, `.c`-Dateien implementieren. Include-Guards (oder `#pragma once`) verhindern doppeltes Einbinden."},async:{na:!0,note:"Kein async/await. Nebenläufigkeit über Threads (`pthread`, C11 `<threads.h>`) oder ereignisgesteuert mit Bibliotheken wie libuv (die Basis von Node.js) bzw. `select`/`epoll`."},futures:{code:`#include <pthread.h>
#include <stdio.h>

static int zaehler = 0;
static pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

void *arbeite(void *arg) {
    int id = *(int *)arg;
    pthread_mutex_lock(&lock);       // gemeinsamen Zustand schützen
    zaehler++;
    pthread_mutex_unlock(&lock);
    printf("Thread %d fertig\\n", id);
    return NULL;
}

int main(void) {
    pthread_t t[3];
    int ids[3] = {1, 2, 3};
    for (int i = 0; i < 3; i++) pthread_create(&t[i], NULL, arbeite, &ids[i]);
    for (int i = 0; i < 3; i++) pthread_join(t[i], NULL);
    printf("Zähler: %d\\n", zaehler);
}
/* gcc app.c -pthread */`,note:"POSIX-Threads (Linux, macOS). C11 definiert mit `<threads.h>` eine portable, aber seltener unterstützte Alternative."},dateien:`#include <stdio.h>

FILE *out = fopen("notizen.txt", "w");
if (!out) { perror("fopen"); return 1; }
fprintf(out, "Zeile %d\\n", 1);
fclose(out);

FILE *in = fopen("notizen.txt", "r");
if (!in) { perror("fopen"); return 1; }
char zeile[256];
while (fgets(zeile, sizeof zeile, in)) {    // liest höchstens 255 Zeichen + '\\0'
    printf("%s", zeile);
}
fclose(in);`,http:{code:`#include <curl/curl.h>
#include <stdio.h>

int main(void) {
    CURL *curl = curl_easy_init();
    if (!curl) return 1;
    curl_easy_setopt(curl, CURLOPT_URL, "https://api.example.com/produkte");
    curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
    CURLcode res = curl_easy_perform(curl);       // Antwort geht standardmäßig nach stdout
    if (res != CURLE_OK) fprintf(stderr, "Fehler: %s\\n", curl_easy_strerror(res));
    curl_easy_cleanup(curl);
}
/* gcc app.c -lcurl */`,note:"Die Standardbibliothek enthält kein HTTP. libcurl ist der De-facto-Standard; die Antwort fängt man mit `CURLOPT_WRITEFUNCTION` in einem eigenen Puffer auf."},json:{code:`#include <cjson/cJSON.h>
#include <stdio.h>
#include <stdlib.h>

const char *text = "{\\"name\\":\\"Ada\\",\\"alter\\":36}";
cJSON *obj = cJSON_Parse(text);
if (!obj) return 1;
const cJSON *name = cJSON_GetObjectItemCaseSensitive(obj, "name");
if (cJSON_IsString(name)) printf("%s\\n", name->valuestring);

cJSON *neu = cJSON_CreateObject();
cJSON_AddNumberToObject(neu, "punkte", 42);
char *ausgabe = cJSON_PrintUnformatted(neu);
printf("%s\\n", ausgabe);
free(ausgabe);                 // Speicher gehört dem Aufrufer
cJSON_Delete(neu);
cJSON_Delete(obj);`,note:"Kein JSON in der Standardbibliothek. Verbreitet: cJSON (klein), Jansson, json-c. Speicher muss explizit freigegeben werden."},datenbank:{code:`#include <sqlite3.h>
#include <stdio.h>

sqlite3 *db;
if (sqlite3_open("shop.db", &db) != SQLITE_OK) return 1;

sqlite3_stmt *stmt;
sqlite3_prepare_v2(db, "SELECT name, preis FROM produkte WHERE preis < ?", -1, &stmt, NULL);
sqlite3_bind_double(stmt, 1, 50.0);              // Parameter binden – keine SQL-Injection
while (sqlite3_step(stmt) == SQLITE_ROW) {
    printf("%s: %.2f\\n", (const char *)sqlite3_column_text(stmt, 0), sqlite3_column_double(stmt, 1));
}
sqlite3_finalize(stmt);
sqlite3_close(db);`,note:"Die SQLite-C-API ist die Originalschnittstelle von SQLite. Für PostgreSQL entsprechend libpq mit `PQexecParams`."},regex:{code:`#include <regex.h>
#include <stdio.h>

regex_t re;
if (regcomp(&re, "^[a-z]+@[a-z]+\\\\.[a-z]{2,}$", REG_EXTENDED | REG_NOSUB) != 0) return 1;
int gueltig = regexec(&re, "ada@example.com", 0, NULL, 0) == 0;
printf("%s\\n", gueltig ? "gültig" : "ungültig");
regfree(&re);`,note:"POSIX-Regex (`<regex.h>`) gibt es unter Linux und macOS, nicht mit MSVC unter Windows. Leistungsfähiger und portabel: PCRE2."},tests:{code:`#include <assert.h>
#include <stdio.h>
#include "mathe.h"

int main(void) {
    assert(addiere(2, 3) == 5);
    assert(addiere(-1, 1) == 0);
    puts("Alle Tests bestanden");
    return 0;
}
/* Achtung: assert entfällt bei -DNDEBUG. Für echte Testsuiten: Unity, CMocka oder Check. */`,note:"Kein eingebautes Test-Framework. `assert` reicht für Kleinigkeiten; Frameworks bieten Testberichte, Fixtures und Mocks."}},R={konstanten:`MAX_VERSUCHE = 3                # Großbuchstabe am Anfang = Konstante
FARBEN = %w[rot gruen].freeze   # freeze verhindert Änderungen am Objekt selbst

MAX_VERSUCHE = 5                # nur Warnung: "already initialized constant"

module Konfig
  TIMEOUT = 30
end
puts Konfig::TIMEOUT`,datentypen:{code:`42.class            # Integer (beliebig groß)
3.14.class          # Float
"Text".class        # String
:symbol.class       # Symbol – unveränderlicher Bezeichner
true.class          # TrueClass
nil.class           # NilClass
[1, 2].class        # Array
{ a: 1 }.class      # Hash
(1..5).class        # Range

"42".to_i + 1       # 43 – explizite Umwandlung
Integer("abc") rescue puts "kein Integer"`,note:"In Ruby ist alles ein Objekt – auch Zahlen, `nil` und Klassen. `to_i` ist tolerant („abc“ → 0), `Integer()` wirft bei ungültiger Eingabe."},interfaces:{code:`# Duck Typing: Es zählt, welche Methoden ein Objekt hat, nicht seine Klasse
def ausgeben(quelle)
  quelle.each { |x| puts x }     # funktioniert mit Array, Range, eigenen Klassen …
end

# Mixins: Module als wiederverwendbare Verhaltensbausteine
class Produkt
  include Comparable
  attr_reader :preis

  def initialize(preis)
    @preis = preis
  end

  def <=>(anderes)               # einzige Pflichtmethode für Comparable
    preis <=> anderes.preis
  end
end

Produkt.new(5) < Produkt.new(9)  # true – <, >, between?, clamp kommen aus Comparable`,note:"Ruby hat keine formalen Interfaces. Stattdessen Duck Typing und Module, die per `include` Methoden beisteuern (z. B. `Comparable`, `Enumerable`)."},generics:{na:!0,code:`# Dynamisch typisiert: Collections nehmen beliebige Objekte auf
stapel = []
stapel.push(1, "zwei", :drei)

# Optionale Typsignaturen in separaten RBS-Dateien (sig/stapel.rbs):
# class Stapel[T]
#   def push: (T element) -> void
#   def pop: () -> T?
# end`,note:"Keine Generics zur Laufzeit. Typprüfung optional mit RBS + Steep oder mit Sorbet."},null:`daten = { adresse: { stadt: "Köln" } }
nutzer = nil

puts nutzer.nil?                     # true
name = nutzer&.name                  # Safe Navigation: nil statt NoMethodError
name ||= "Gast"                      # zuweisen, wenn nil oder false
puts name

stadt = daten.dig(:adresse, :stadt)  # verschachtelt und nil-sicher
plz = daten.fetch(:plz, "unbekannt") # Standardwert statt nil`,module:`# lib/mathe.rb
module Mathe
  PI = 3.14159
  def self.quadrat(x) = x * x        # Modulmethode (Endless Method, Ruby 3)
end

# app.rb
require_relative "lib/mathe"         # eigene Datei relativ einbinden
require "json"                       # Standardbibliothek oder Gem
puts Mathe.quadrat(4)
puts Mathe::PI

# Gems im Projekt: Gemfile + "bundle install"`,async:{code:`# Gem "async" – nutzt den Fiber Scheduler von Ruby 3
require "async"
require "net/http"

Async do |task|
  urls = %w[https://example.com https://example.org]
  aufgaben = urls.map do |url|
    task.async { Net::HTTP.get(URI(url)) }    # läuft nebenläufig
  end
  puts aufgaben.map(&:wait).map(&:size).inspect
end`,note:"Ruby hat keine async/await-Schlüsselwörter. Seit Ruby 3 machen Fiber Scheduler (z. B. im Gem `async`) blockierende I/O-Aufrufe nebenläufig."},futures:{code:`threads = [1, 2, 3].map do |i|
  Thread.new(i) do |n|
    sleep 0.1
    n * n
  end
end
p threads.map(&:value)          # [1, 4, 9] – value wartet auf das Ergebnis

zaehler = 0
lock = Mutex.new
10.times.map { Thread.new { lock.synchronize { zaehler += 1 } } }.each(&:join)
puts zaehler                    # 10`,note:"Wegen des Global VM Lock (GVL) laufen Ruby-Threads nicht parallel auf mehreren Kernen – sie helfen bei I/O. Für echte Parallelität: Prozesse oder Ractors (experimentell)."},dateien:`File.write("notizen.txt", "Erste Zeile\\n")
File.open("notizen.txt", "a") { |f| f.puts "Zweite Zeile" }   # Block schließt automatisch

inhalt = File.read("notizen.txt")
File.foreach("notizen.txt") { |zeile| puts zeile.chomp }
puts File.exist?("notizen.txt")
Dir.glob("*.txt").each { |pfad| puts pfad }`,http:`require "net/http"
require "json"

uri = URI("https://api.example.com/produkte?limit=5")
antwort = Net::HTTP.get_response(uri)
if antwort.is_a?(Net::HTTPSuccess)
  produkte = JSON.parse(antwort.body)
  puts produkte.length
else
  warn "HTTP #{antwort.code}"
end

# POST mit JSON
Net::HTTP.post(URI("https://api.example.com/produkte"),
               { name: "Maus" }.to_json,
               "Content-Type" => "application/json")`,json:`require "json"

daten = JSON.parse('{"name": "Ada", "sprachen": ["Ruby", "C"]}', symbolize_names: true)
puts daten[:name]
puts daten[:sprachen].first

json = { name: "Grace", aktiv: true }.to_json
puts JSON.pretty_generate({ a: 1, b: [1, 2] })`,datenbank:{code:`require "sqlite3"

db = SQLite3::Database.new("shop.db")
db.results_as_hash = true
db.execute("CREATE TABLE IF NOT EXISTS produkte (name TEXT, preis REAL)")
db.execute("INSERT INTO produkte (name, preis) VALUES (?, ?)", ["Tastatur", 49.9])   # Platzhalter!
db.execute("SELECT * FROM produkte WHERE preis < ?", [100]) do |zeile|
  puts "#{zeile['name']}: #{zeile['preis']}"
end

# Rails / ActiveRecord:
# Produkt.where("preis < ?", 100).order(:name)`,note:"In Rails-Anwendungen übernimmt ActiveRecord (ORM) die Datenbankarbeit. Werte nie per String-Interpolation ins SQL einsetzen."},regex:`text = "Bestellung 2024-03-15, Lieferung 2024-03-18"

if text =~ /(\\d{4})-(\\d{2})-(\\d{2})/
  puts "Jahr: #{$1}"                          # erste Gruppe
end
alle = text.scan(/\\d{4}-\\d{2}-\\d{2}/)       # alle Treffer als Array
m = text.match(/(?<jahr>\\d{4})-(?<monat>\\d{2})/)
puts m[:monat]
puts text.gsub(/\\d{4}/) { |j| (j.to_i + 1).to_s }
puts "ada@example.com".match?(/\\A[^@\\s]+@[^@\\s]+\\z/)   # \\A und \\z statt ^ und $`,tests:{code:`require "minitest/autorun"
require_relative "preise"

class PreiseTest < Minitest::Test
  def test_rabatt
    assert_equal 80.0, preis_mit_rabatt(100, 20)
  end

  def test_ungueltiger_rabatt
    assert_raises(ArgumentError) { preis_mit_rabatt(100, 120) }
  end
end

# RSpec-Stil:
# RSpec.describe "preis_mit_rabatt" do
#   it("zieht Rabatt ab") { expect(preis_mit_rabatt(100, 20)).to eq(80.0) }
# end`,note:"Minitest ist in Ruby enthalten; RSpec ist besonders in Rails-Projekten verbreitet."}},C={konstanten:`let maxVersuche = 3            // let = unveränderlich (bevorzugt)
var zaehler = 0                // var nur, wenn sich der Wert ändert
let farben = ["rot", "grün"]   // let-Array: auch der Inhalt ist unveränderlich

enum Konfig {                  // caseless enum als Namensraum
    static let timeout = 30.0
}
print(Konfig.timeout)`,datentypen:{code:`let ganz: Int = 42              // 64 Bit auf aktuellen Plattformen
let kommazahl: Double = 3.14
let einfach: Float = 2.5
let text: String = "Hallo"
let zeichen: Character = "A"
let aktiv: Bool = true
let tupel: (String, Int) = ("Ada", 36)

let summe = Double(ganz) + kommazahl   // keine implizite Umwandlung!
let zahl = Int("42")                   // Int? – die Umwandlung kann scheitern
print(type(of: summe))                 // Double`,note:"Swift wandelt Zahlentypen nie implizit um. `String`, `Array` und `Dictionary` sind Werttypen (Copy-on-Write)."},interfaces:`protocol Form {
    var name: String { get }
    func flaeche() -> Double
}

extension Form {                       // Standardimplementierung per Protocol Extension
    func beschreibung() -> String { "\\(name): \\(flaeche())" }
}

struct Kreis: Form {
    let r: Double
    var name: String { "Kreis" }
    func flaeche() -> Double { .pi * r * r }
}

let formen: [any Form] = [Kreis(r: 2)]
formen.forEach { print($0.beschreibung()) }`,generics:`func groesstes<T: Comparable>(_ werte: [T]) -> T? {
    werte.max()
}

struct Stapel<Element> {
    private var elemente: [Element] = []
    mutating func push(_ e: Element) { elemente.append(e) }
    mutating func pop() -> Element? { elemente.popLast() }
}

var s = Stapel<Int>()
s.push(1)
print(groesstes([3, 7, 2]) ?? 0)   // 7`,exceptions:`enum BestellFehler: Error {
    case nichtVorraetig(produkt: String)
    case ungueltigeMenge
}

func bestelle(_ produkt: String, menge: Int) throws -> String {
    guard menge > 0 else { throw BestellFehler.ungueltigeMenge }
    if produkt == "Monitor" { throw BestellFehler.nichtVorraetig(produkt: produkt) }
    return "Bestellt: \\(menge)× \\(produkt)"
}

do {
    print(try bestelle("Monitor", menge: 1))
} catch BestellFehler.nichtVorraetig(let p) {
    print("\\(p) ist ausverkauft")
} catch {
    print("Fehler: \\(error)")
}

let ergebnis = try? bestelle("Maus", menge: 2)   // nil bei Fehler`,module:{code:`// Jedes Swift-Package-Target ist ein Modul; Dateien desselben Moduls sehen sich automatisch.
import Foundation          // Systemframework
import ShopKern            // eigenes Modul aus einem Swift Package

// Sichtbarkeit: private < fileprivate < internal (Standard) < public < open
public struct Produkt {
    public let name: String
    public init(name: String) { self.name = name }
}

// Package.swift (Auszug):
// .target(name: "ShopKern"),
// .executableTarget(name: "App", dependencies: ["ShopKern"])`,note:"Ohne `public` ist ein Typ nur innerhalb seines Moduls sichtbar (`internal`). Abhängigkeiten verwaltet der Swift Package Manager."},async:`func ladeProdukt(id: Int) async throws -> String {
    try await Task.sleep(for: .milliseconds(100))   // simuliert Netzwerkzugriff
    return "Produkt \\(id)"
}

// Nacheinander
let a = try await ladeProdukt(id: 1)

// Parallel mit async let
async let b = ladeProdukt(id: 2)
async let c = ladeProdukt(id: 3)
let beide = try await [b, c]
print(a, beide)`,futures:{code:`let summe = await withTaskGroup(of: Int.self) { gruppe in
    for i in 1...5 {
        gruppe.addTask { i * i }           // Kind-Tasks laufen parallel
    }
    var gesamt = 0
    for await wert in gruppe { gesamt += wert }
    return gesamt
}

actor Zaehler {                             // Actor schützt seinen Zustand vor Data Races
    private var wert = 0
    func erhoehe() -> Int { wert += 1; return wert }
}
let z = Zaehler()
print(await z.erhoehe())`,note:"Structured Concurrency: Task Groups, `async let` und Actors. Swift 6 prüft Data Races zur Compilezeit (Strict Concurrency)."},dateien:`import Foundation

let url = URL(fileURLWithPath: "notizen.txt")
try "Erste Zeile\\n".write(to: url, atomically: true, encoding: .utf8)

let inhalt = try String(contentsOf: url, encoding: .utf8)
for zeile in inhalt.split(separator: "\\n") {
    print(zeile)
}
print(FileManager.default.fileExists(atPath: url.path))`,http:`import Foundation

struct Produkt: Decodable { let id: Int; let name: String }

let url = URL(string: "https://api.example.com/produkte")!
let (daten, antwort) = try await URLSession.shared.data(from: url)
guard let http = antwort as? HTTPURLResponse, http.statusCode == 200 else {
    throw URLError(.badServerResponse)
}
let produkte = try JSONDecoder().decode([Produkt].self, from: daten)
print(produkte.count)`,json:`import Foundation

struct Nutzer: Codable {
    let name: String
    let sprachen: [String]
}

let json = #"{"name": "Ada", "sprachen": ["Swift", "C"]}"#.data(using: .utf8)!
let nutzer = try JSONDecoder().decode(Nutzer.self, from: json)
print(nutzer.name)

let encoder = JSONEncoder()
encoder.outputFormatting = .prettyPrinted
print(String(data: try encoder.encode(nutzer), encoding: .utf8)!)`,datenbank:{code:`import GRDB    // verbreitete SQLite-Bibliothek

let dbQueue = try DatabaseQueue(path: "shop.sqlite")
try dbQueue.write { db in
    try db.execute(sql: "CREATE TABLE IF NOT EXISTS produkt (name TEXT, preis REAL)")
    try db.execute(sql: "INSERT INTO produkt (name, preis) VALUES (?, ?)", arguments: ["Maus", 19.9])
}
let namen = try dbQueue.read { db in
    try String.fetchAll(db, sql: "SELECT name FROM produkt WHERE preis < ?", arguments: [50])
}`,note:"In Apps auf Apple-Plattformen sind auch SwiftData bzw. Core Data üblich; auf dem Server z. B. Fluent (Vapor) oder PostgresNIO."},regex:{code:`let text = "Bestellung 2024-03-15"

if let treffer = text.firstMatch(of: #/(\\d{4})-(\\d{2})-(\\d{2})/#) {
    print("Jahr: \\(treffer.1)")             // typisierte Capture-Gruppen
}
let alle = text.matches(of: #/\\d+/#).map { String($0.output) }
let ersetzt = text.replacing(#/\\d{4}/#, with: "JJJJ")`,note:"Regex-Literale gibt es ab Swift 5.7. Die Form `#/…/#` funktioniert immer; das kürzere `/…/` ist im Swift-6-Sprachmodus standardmäßig aktiv. Ältere Alternative: `NSRegularExpression`."},tests:{code:`import Testing
@testable import Shop

@Test func rabattWirdAbgezogen() {
    #expect(preisMitRabatt(100, prozent: 20) == 80)
}

@Test(arguments: [0, 50, 100])
func rabattImGueltigenBereich(prozent: Int) {
    #expect(preisMitRabatt(100, prozent: prozent) >= 0)
}

// Klassisch mit XCTest:
// final class PreisTests: XCTestCase {
//     func testRabatt() { XCTAssertEqual(preisMitRabatt(100, prozent: 20), 80) }
// }`,note:"Swift Testing (`@Test`, `#expect`) ist seit Swift 6 / Xcode 16 enthalten; XCTest bleibt weiterhin unterstützt."}},F={kommentare:`// Einzeiliger Kommentar
/* Mehrzeiliger
   Kommentar */

/// Dokumentationskommentar für "dart doc" – unterstützt Markdown.
/// Verweise wie [Produkt] werden automatisch verlinkt.
int verdopple(int x) => x * 2;`,konstanten:`const maxVersuche = 3;               // Compile-Zeit-Konstante
final start = DateTime.now();        // genau einmal zuweisbar, Wert zur Laufzeit
const farben = ['rot', 'grün'];      // tief unveränderlich

class Konfig {
  static const timeout = Duration(seconds: 30);
}
// start = DateTime.now();           // Fehler: final kann nicht neu zugewiesen werden`,datentypen:{code:`int ganz = 42;
double kommazahl = 3.14;
num zahl = 7;                      // Obertyp von int und double
String text = 'Hallo';
bool aktiv = true;
List<int> liste = [1, 2, 3];
Map<String, int> alter = {'Ada': 36};
Set<String> tags = {'neu'};
var abgeleitet = 'Typ String';     // Typinferenz
dynamic beliebig = 1;              // schaltet die Typprüfung ab – sparsam einsetzen

print(int.parse('42') + 1);
print(ganz.runtimeType);           // int`,note:"Dart ist statisch typisiert mit Typinferenz und „Sound Null Safety“. Alles ist ein Objekt, auch `int` und `null`."},switch:`String tagTyp(String tag) => switch (tag) {
      'Sa' || 'So' => 'Wochenende',
      'Fr' => 'Fast Wochenende',
      _ => 'Werktag',
    };

sealed class Form {}
class Kreis extends Form { Kreis(this.r); final double r; }
class Rechteck extends Form { Rechteck(this.b, this.h); final double b, h; }

double flaeche(Form f) => switch (f) {       // Compiler prüft Vollständigkeit (sealed)
      Kreis(r: var r) => 3.14159 * r * r,
      Rechteck(b: var b, h: var h) => b * h,
    };`,lambdas:`final verdopple = (int x) => x * 2;        // Arrow-Funktion
final addiere = (int a, int b) {           // anonyme Funktion mit Block
  return a + b;
};

final zahlen = [3, 1, 4, 1, 5];
final quadrate = zahlen.map((z) => z * z).toList();
final gerade = zahlen.where((z) => z.isEven);
zahlen.sort((a, b) => b.compareTo(a));
zahlen.forEach(print);                     // Tear-off: Funktion als Wert übergeben`,interfaces:{code:`abstract interface class Speicher {          // Dart 3: reines Interface
  Future<void> speichere(String schluessel, String wert);
  Future<String?> lade(String schluessel);
}

class SpeicherImRam implements Speicher {
  final _daten = <String, String>{};

  @override
  Future<void> speichere(String s, String w) async => _daten[s] = w;

  @override
  Future<String?> lade(String s) async => _daten[s];
}

mixin Protokoll {                            // Mixin: Verhalten wiederverwenden
  void log(String m) => print('[\${runtimeType}] $m');
}
class Dienst with Protokoll {}`,note:"Jede Dart-Klasse ist implizit auch ein Interface (`implements`). Dart 3 ergänzt Klassenmodifikatoren wie `interface`, `base`, `final` und `sealed`."},vererbung:`class Tier {
  Tier(this.name);
  final String name;
  String laut() => '…';
  String vorstellen() => '$name sagt \${laut()}';
}

class Hund extends Tier {
  Hund(super.name);                 // Super-Parameter (seit Dart 2.17)
  @override
  String laut() => 'Wuff';
}

void main() {
  print(Hund('Rex').vorstellen());  // Rex sagt Wuff
}`,generics:`class Stapel<T> {
  final _elemente = <T>[];
  void push(T e) => _elemente.add(e);
  T? pop() => _elemente.isEmpty ? null : _elemente.removeLast();
}

// Comparable<dynamic>, weil int nur Comparable<num> implementiert
T groesstes<T extends Comparable<dynamic>>(List<T> werte) =>
    werte.reduce((a, b) => a.compareTo(b) >= 0 ? a : b);

final s = Stapel<int>()..push(1)..push(2);   // Kaskaden-Operator ..
print(groesstes([3, 7, 2]));                 // 7`,null:`void main() {
  String? name;                      // ? = darf null sein (Sound Null Safety)
  print(name?.length);               // null statt Absturz
  print(name ?? 'Gast');             // Standardwert
  name ??= 'Ada';                    // zuweisen, wenn null

  if (name != null) {
    print(name.toUpperCase());       // Type Promotion: hier ist name ein String
  }
  String sicher = name!;             // ! = "ist nicht null" – wirft sonst zur Laufzeit
}

late final String config;            // wird später, aber vor dem ersten Lesen gesetzt`,exceptions:`class BestellFehler implements Exception {
  BestellFehler(this.nachricht);
  final String nachricht;
  @override
  String toString() => 'BestellFehler: $nachricht';
}

void bestelle(int menge) {
  if (menge <= 0) throw BestellFehler('Menge muss positiv sein');
}

void main() {
  try {
    bestelle(0);
  } on BestellFehler catch (e) {
    print(e);
  } on FormatException {
    print('Ungültiges Format');
  } catch (e, stack) {
    print('Unerwartet: $e\\n$stack');
  } finally {
    print('aufräumen');
  }
}`,module:`// lib/mathe.dart
const pi = 3.14159;
int quadrat(int x) => x * x;
int _intern() => 0;                          // _ = privat für diese Bibliothek (Datei)

// bin/main.dart
import 'package:shop/mathe.dart';            // eigenes Paket
import 'package:http/http.dart' as http;     // Paket mit Präfix
import 'dart:math' show max;                 // nur bestimmte Namen importieren
import 'dart:convert';                       // Kernbibliothek

void main() => print(quadrat(max(2, 3)));

// Abhängigkeiten: pubspec.yaml + "dart pub add http"`,futures:{code:`import 'dart:isolate';

Future<int> berechne(int x) =>
    Future.delayed(const Duration(milliseconds: 100), () => x * x);

Future<void> main() async {
  final ergebnisse = await Future.wait([berechne(2), berechne(3)]);   // gleichzeitig warten
  print(ergebnisse);                                                  // [4, 9]

  berechne(4).then(print).catchError((e) => print('Fehler: $e'));

  await for (final wert in Stream.periodic(const Duration(milliseconds: 50), (i) => i).take(3)) {
    print('Stream: $wert');
  }

  // CPU-intensive Arbeit in einem eigenen Isolate (eigener Speicher, echte Parallelität)
  final summe = await Isolate.run(() => List.generate(1000000, (i) => i).reduce((a, b) => a + b));
  print(summe);
}`,note:"`Future` = ein späterer Wert, `Stream` = viele Werte über die Zeit. Isolates teilen keinen Speicher und kommunizieren über Nachrichten."},dateien:{code:`import 'dart:io';

Future<void> main() async {
  final datei = File('notizen.txt');
  await datei.writeAsString('Erste Zeile\\n');
  await datei.writeAsString('Zweite Zeile\\n', mode: FileMode.append);

  final zeilen = await datei.readAsLines();
  for (final z in zeilen) {
    print(z);
  }
  print(await datei.exists());
}`,note:"`dart:io` steht auf Server, Desktop und Mobile zur Verfügung, nicht im Web."},http:`import 'dart:convert';
import 'package:http/http.dart' as http;

Future<void> main() async {
  final antwort = await http.get(Uri.parse('https://api.example.com/produkte'));
  if (antwort.statusCode != 200) throw Exception('HTTP \${antwort.statusCode}');
  final produkte = jsonDecode(antwort.body) as List<dynamic>;
  print(produkte.length);

  await http.post(
    Uri.https('api.example.com', '/produkte'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({'name': 'Maus'}),
  );
}`,json:{code:`import 'dart:convert';

class Nutzer {
  Nutzer(this.name, this.sprachen);
  final String name;
  final List<String> sprachen;

  factory Nutzer.fromJson(Map<String, dynamic> j) =>
      Nutzer(j['name'] as String, List<String>.from(j['sprachen'] as List));

  Map<String, dynamic> toJson() => {'name': name, 'sprachen': sprachen};
}

void main() {
  final daten = jsonDecode('{"name": "Ada", "sprachen": ["Dart"]}') as Map<String, dynamic>;
  final nutzer = Nutzer.fromJson(daten);
  print(jsonEncode(nutzer));            // ruft toJson() automatisch auf
}`,note:"Für größere Modelle generiert `json_serializable` (oder `freezed`) die fromJson/toJson-Methoden per Build-Runner."},datenbank:{code:`import 'package:sqflite/sqflite.dart';

Future<void> main() async {
  final db = await openDatabase('shop.db', version: 1, onCreate: (db, version) {
    return db.execute('CREATE TABLE produkte (id INTEGER PRIMARY KEY, name TEXT, preis REAL)');
  });
  await db.insert('produkte', {'name': 'Maus', 'preis': 19.9});
  final zeilen = await db.query('produkte', where: 'preis < ?', whereArgs: [50]);
  final roh = await db.rawQuery('SELECT name FROM produkte WHERE preis < ?', [50]);
  print('$zeilen $roh');
}`,note:"`sqflite` ist das Standard-SQLite-Plugin für Flutter. Alternativen: `drift` (typsicher, reaktiv) und für Server z. B. das Paket `postgres`."},regex:`final text = 'Bestellung 2024-03-15, Lieferung 2024-03-18';
final datum = RegExp(r'(\\d{4})-(\\d{2})-(\\d{2})');     // r'…' = Raw String

print(datum.firstMatch(text)?.group(1));              // 2024
print(datum.allMatches(text).map((m) => m[0]).toList());
print(text.replaceAll(RegExp(r'\\d{4}'), 'JJJJ'));
print(RegExp(r'^[^@\\s]+@[^@\\s]+$').hasMatch('ada@example.com'));`,tests:`import 'package:test/test.dart';
import 'package:shop/preise.dart';

void main() {
  group('preisMitRabatt', () {
    test('zieht Rabatt ab', () {
      expect(preisMitRabatt(100, 20), equals(80));
    });

    test('wirft bei ungültigem Rabatt', () {
      expect(() => preisMitRabatt(100, 120), throwsArgumentError);
    });
  });
}
// Ausführen: dart test   (Flutter: flutter test, Widget-Tests mit testWidgets)`},L={kommentare:`// Einzeiliger Kommentar
/* Mehrzeiliger
   Kommentar */

/** Scaladoc-Kommentar
  * @param x Eingabewert
  * @return das Doppelte
  */
def verdopple(x: Int): Int = x * 2`,konstanten:`val maxVersuche = 3              // val = unveränderliche Referenz (Standard)
var zaehler = 0                  // var nur, wenn wirklich nötig
val farben = List("rot", "grün") // unveränderliche Collection

object Konfig:
  final val Timeout = 30         // Konstante im Singleton-Objekt
  inline val Version = "1.0"     // Scala 3: wird zur Compilezeit eingesetzt`,datentypen:{code:`val ganz: Int = 42
val gross: Long = 9_000_000_000L
val kommazahl: Double = 3.14
val zeichen: Char = 'A'
val text: String = "Hallo"
val aktiv: Boolean = true
val tupel: (String, Int) = ("Ada", 36)
val nichts: Unit = ()               // entspricht void

val zahl = "42".toInt               // wirft NumberFormatException bei ungültiger Eingabe
val sicher = "abc".toIntOption      // None`,note:"Typhierarchie: `Any` → `AnyVal` (Int, Double …) und `AnyRef` (Objekte). `Nothing` ist Untertyp aller Typen – der Typ von `throw`."},lambdas:`val verdopple = (x: Int) => x * 2
val addiere: (Int, Int) => Int = _ + _       // Platzhalter-Syntax

val zahlen = List(3, 1, 4, 1, 5)
val quadrate = zahlen.map(z => z * z)
val gerade = zahlen.filter(_ % 2 == 0)
val summe = zahlen.foldLeft(0)(_ + _)
val absteigend = zahlen.sortWith(_ > _)

def wiederhole(n: Int)(f: Int => Unit): Unit = (1 to n).foreach(f)
wiederhole(3) { i => println(i) }             // Funktion als Block übergeben`,interfaces:`trait Form:
  def name: String
  def flaeche: Double
  def beschreibung: String = s"$name: $flaeche"   // Trait mit Implementierung

trait Protokoll:
  def log(msg: String): Unit = println(s"[LOG] $msg")

class Kreis(r: Double) extends Form, Protokoll:   // mehrere Traits mischen
  val name = "Kreis"
  def flaeche = math.Pi * r * r

val k = Kreis(2)
k.log(k.beschreibung)`,vererbung:`abstract class Tier(val name: String):
  def laut: String
  def vorstellen: String = s"$name sagt $laut"

class Hund(name: String) extends Tier(name):
  override def laut = "Wuff"

open class Basis          // Scala 3: open markiert Klassen, die zum Erben gedacht sind
final class Endgueltig    // final verbietet Vererbung

println(Hund("Rex").vorstellen)   // Rex sagt Wuff`,generics:`class Stapel[T]:
  private var elemente = List.empty[T]
  def push(e: T): Unit = elemente = e :: elemente
  def pop(): Option[T] = elemente match
    case kopf :: rest =>
      elemente = rest
      Some(kopf)
    case Nil => None

def groesstes[T](werte: List[T])(using Ordering[T]): T = werte.max

val s = Stapel[Int]()
s.push(1)
println(groesstes(List(3, 7, 2)))   // 7

// Varianz: List[+A] ist kovariant – eine List[Hund] ist auch eine List[Tier]`,null:`val name: Option[String] = Some("Ada")
val leer: Option[String] = None

println(name.map(_.toUpperCase).getOrElse("Gast"))
name match
  case Some(n) => println(s"Hallo $n")
  case None    => println("Kein Name")

val ausJava = Option(System.getenv("HOME"))   // null aus Java-APIs → None
for n <- name do println(n.length)`,exceptions:`import scala.util.{Try, Success, Failure}

def teile(a: Int, b: Int): Int =
  if b == 0 then throw IllegalArgumentException("Division durch 0") else a / b

try teile(1, 0)
catch
  case e: IllegalArgumentException => println(e.getMessage)
finally println("fertig")

Try(teile(10, 2)) match              // funktional: Fehler als Wert
  case Success(v) => println(v)
  case Failure(e) => println(s"Fehler: \${e.getMessage}")

def parse(s: String): Either[String, Int] =
  s.toIntOption.toRight(s"'$s' ist keine Zahl")`,module:`// src/main/scala/shop/mathe.scala
package shop.mathe

def quadrat(x: Int): Int = x * x        // Scala 3: Top-Level-Definitionen
private[shop] val intern = 42           // nur im Paket shop sichtbar

// src/main/scala/shop/Main.scala
package shop

import shop.mathe.quadrat
import scala.collection.mutable          // Paket importieren
import java.time.{LocalDate, Duration}   // mehrere Namen auf einmal

@main def start(): Unit = println(quadrat(4))`,async:{na:!0,code:`import scala.concurrent.{Future, Await}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.*

def ladeNutzer(id: Int): Future[String] = Future { s"Nutzer $id" }
def ladeBestellungen(n: String): Future[Int] = Future { 3 }

val ergebnis = for                       // liest sich wie async/await
  nutzer <- ladeNutzer(1)
  anzahl <- ladeBestellungen(nutzer)
yield s"$nutzer hat $anzahl Bestellungen"

println(Await.result(ergebnis, 2.seconds))   // blockieren nur in Beispielen und Tests`,note:"Scala hat keine async/await-Schlüsselwörter. For-Comprehensions über `Future` – oder Effektsysteme wie Cats Effect (`IO`) und ZIO – erfüllen denselben Zweck."},futures:`import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global
import scala.util.{Success, Failure}

val f1 = Future { Thread.sleep(100); 2 }
val f2 = Future { Thread.sleep(100); 3 }

val summe = Future.sequence(List(f1, f2)).map(_.sum)   // parallel, dann kombinieren
summe.onComplete {
  case Success(s) => println(s"Summe: $s")
  case Failure(e) => println(s"Fehler: $e")
}`,dateien:`import java.nio.file.{Files, Paths}
import scala.io.Source
import scala.util.Using

val pfad = Paths.get("notizen.txt")
Files.writeString(pfad, "Erste Zeile\\nZweite Zeile\\n")

Using(Source.fromFile("notizen.txt")) { quelle =>   // schließt die Datei automatisch
  quelle.getLines().foreach(println)
}

// Bibliothek os-lib: os.write(os.pwd / "a.txt", "Hallo"); os.read(os.pwd / "a.txt")`,http:{code:`// sttp (Teil des Scala Toolkit)
import sttp.client4.quick.*

val antwort = quickRequest.get(uri"https://api.example.com/produkte").send()
println(antwort.code)
println(antwort.body)

// Ohne Bibliothek: java.net.http.HttpClient
import java.net.URI
import java.net.http.{HttpClient, HttpRequest, HttpResponse}
val anfrage = HttpRequest.newBuilder(URI.create("https://api.example.com/produkte")).build()
val roh = HttpClient.newHttpClient().send(anfrage, HttpResponse.BodyHandlers.ofString())`,note:"Scala kann jede Java-Bibliothek direkt nutzen – auch den eingebauten `HttpClient` seit Java 11."},json:`import upickle.default.*

case class Nutzer(name: String, sprachen: List[String]) derives ReadWriter

val nutzer = read[Nutzer]("""{"name": "Ada", "sprachen": ["Scala"]}""")
println(nutzer.name)
val json = write(Nutzer("Grace", List("COBOL")))

val dynamisch = ujson.read("""{"a": [1, 2]}""")
println(dynamisch("a")(0).num)`,datenbank:{code:`import java.sql.DriverManager
import scala.util.Using

Using.resource(DriverManager.getConnection("jdbc:postgresql://localhost/shop", "app", sys.env("DB_PASSWORT"))) { conn =>
  val stmt = conn.prepareStatement("SELECT name, preis FROM produkte WHERE preis < ?")
  stmt.setBigDecimal(1, java.math.BigDecimal("50"))
  val rs = stmt.executeQuery()
  while rs.next() do println(s"\${rs.getString("name")}: \${rs.getBigDecimal("preis")}")
}`,note:'Funktionale Alternativen: Doobie (`sql"… $wert".query[…]` – Werte werden automatisch als Parameter gebunden), Slick, Quill oder Magnum.'},regex:`val datum = """(\\d{4})-(\\d{2})-(\\d{2})""".r
val text = "Bestellung 2024-03-15, Lieferung 2024-03-18"

datum.findFirstMatchIn(text).foreach(m => println(m.group(1)))   // 2024
val alle = datum.findAllIn(text).toList
val ersetzt = datum.replaceAllIn(text, m => s"\${m.group(3)}.\${m.group(2)}.\${m.group(1)}")

"2024-03-15" match
  case datum(j, m, t) => println(s"Tag $t, Monat $m, Jahr $j")   // Regex als Extraktor
  case _ => println("kein Datum")`,tests:`// munit
class PreiseTest extends munit.FunSuite:
  test("zieht Rabatt ab") {
    assertEquals(preisMitRabatt(100, 20), 80.0)
  }
  test("wirft bei ungültigem Rabatt") {
    intercept[IllegalArgumentException](preisMitRabatt(100, 120))
  }

// Ausführen: sbt test   (Alternativen: ScalaTest, ZIO Test)`},D={konstanten:`local MAX_VERSUCHE <const> = 3     -- Lua 5.4: Neuzuweisung = Compilefehler
local PI = 3.14159                 -- Konvention GROSSBUCHSTABEN, aber änderbar

-- Schreibgeschützte Tabelle per Metatable
local function schreibgeschuetzt(t)
  return setmetatable({}, {
    __index = t,
    __newindex = function() error("Konstante darf nicht geändert werden", 2) end,
  })
end
local Konfig = schreibgeschuetzt({ timeout = 30 })
print(Konfig.timeout)`,datentypen:{code:`print(type(42))                       -- number
print(math.type(42), math.type(4.2))  -- integer  float (Lua 5.3+)
print(type("Text"))                   -- string
print(type(true))                     -- boolean
print(type(nil))                      -- nil
print(type({}))                       -- table – DIE Datenstruktur (Array, Map, Objekt)
print(type(print))                    -- function
-- außerdem: userdata (C-Daten) und thread (Coroutine)

print(tonumber("42") + 1, tostring(7) .. "!")
print("10" + 5)                       -- 15: Strings werden bei Arithmetik umgewandelt`,note:"Lua hat nur acht Grundtypen. Tabellen sind die einzige zusammengesetzte Datenstruktur."},switch:{na:!0,code:`local function tagtyp(tag)
  if tag == "Sa" or tag == "So" then
    return "Wochenende"
  elseif tag == "Fr" then
    return "Fast Wochenende"
  else
    return "Werktag"
  end
end

-- Lookup-Tabelle als Dispatch
local aktionen = {
  start = function() print("starte") end,
  stopp = function() print("stoppe") end,
}
local f = aktionen["start"] or function() print("unbekannt") end
f()`,note:"Lua hat weder `switch` noch Pattern Matching. Üblich sind `if`/`elseif`-Ketten oder Tabellen mit Funktionen."},lambdas:`local verdopple = function(x) return x * 2 end   -- Funktionen sind normale Werte

local zahlen = { 3, 1, 4, 1, 5 }
table.sort(zahlen, function(a, b) return a > b end)

local function map(t, f)
  local ergebnis = {}
  for i, v in ipairs(t) do ergebnis[i] = f(v) end
  return ergebnis
end
local quadrate = map(zahlen, function(z) return z * z end)

local function zaehler()                 -- Closure: merkt sich n
  local n = 0
  return function() n = n + 1; return n end
end
local naechster = zaehler()
print(naechster(), naechster())          -- 1  2`,interfaces:{na:!0,code:`-- Kein Interface-Konzept: Jede Tabelle mit passenden Funktionen "passt" (Duck Typing)
local function gesamtflaeche(formen)
  local summe = 0
  for _, f in ipairs(formen) do
    summe = summe + f:flaeche()           -- erwartet nur eine Methode flaeche
  end
  return summe
end

local kreis = { r = 2, flaeche = function(self) return math.pi * self.r ^ 2 end }
local quadrat = { a = 3, flaeche = function(self) return self.a ^ 2 end }
print(gesamtflaeche({ kreis, quadrat }))`,note:"Keine Interfaces – Lua setzt auf Duck Typing. Typprüfung optional mit Luau (Roblox) oder Teal."},vererbung:{code:`local Tier = {}
Tier.__index = Tier

function Tier.new(name)
  return setmetatable({ name = name }, Tier)
end
function Tier:laut() return "…" end
function Tier:vorstellen() return self.name .. " sagt " .. self:laut() end

local Hund = setmetatable({}, { __index = Tier })   -- fehlende Methoden in Tier suchen
Hund.__index = Hund

function Hund.new(name)
  return setmetatable(Tier.new(name), Hund)
end
function Hund:laut() return "Wuff" end

print(Hund.new("Rex"):vorstellen())   -- Rex sagt Wuff`,note:"Klassen und Vererbung entstehen aus Metatables: Findet Lua einen Schlüssel nicht, schaut es in `__index` nach – das ergibt eine Prototyp-Kette."},generics:{na:!0,note:"Lua ist dynamisch typisiert; jede Tabelle kann Werte beliebigen Typs enthalten. Generische Typparameter bieten erst Dialekte wie Luau oder Teal."},null:`local nutzer = nil
print(nutzer == nil)                         -- true
local name = nutzer and nutzer.name or "Gast"  -- übliches Muster (Vorsicht bei false)
print(name)

local t = { a = 1 }
t.a = nil                                    -- nil entfernt den Eintrag aus der Tabelle
print(t.b)                                   -- nil: fehlende Schlüssel sind kein Fehler

-- Fehler: nutzer.name bei nutzer == nil → "attempt to index a nil value"`,exceptions:`local function teile(a, b)
  if b == 0 then error("Division durch 0") end
  return a / b
end

local ok, ergebnis = pcall(teile, 10, 0)     -- "geschützter" Aufruf
if not ok then
  print("Fehler: " .. ergebnis)
end

-- Fehlerobjekt als Tabelle mit Zusatzinformationen
local ok2, err = pcall(function() error({ code = 404 }) end)
print(err.code)

-- xpcall mit Traceback-Handler
print(xpcall(teile, debug.traceback, 1, 0))`,module:`-- mathe.lua
local M = {}
M.PI = 3.14159
function M.quadrat(x) return x * x end
local function intern() end          -- nicht exportiert
return M

-- main.lua
local mathe = require("mathe")       -- sucht über package.path; Ergebnis wird gecacht
print(mathe.quadrat(4))
local json = require("dkjson")       -- Bibliothek, z. B. per LuaRocks installiert`,async:{na:!0,code:`local function zahlen_bis(n)
  return coroutine.wrap(function()
    for i = 1, n do
      coroutine.yield(i)             -- pausiert und gibt einen Wert zurück
    end
  end)
end

for wert in zahlen_bis(3) do print(wert) end   -- 1 2 3`,note:"Kein async/await. Coroutines ermöglichen kooperatives Multitasking; Event-Loops kommen von außen, z. B. luv (libuv) oder OpenResty in Nginx."},futures:{na:!0,code:`local co = coroutine.create(function(a, b)
  local c = coroutine.yield(a + b)     -- gibt a+b an resume zurück und wartet
  return c * 2
end)

print(coroutine.resume(co, 1, 2))      -- true  3
print(coroutine.resume(co, 10))        -- true  20
print(coroutine.status(co))            -- dead`,note:"Die Standardbibliothek kennt keine Betriebssystem-Threads. Parallelität über Bibliotheken wie Lua Lanes oder mehrere Lua-States im Host-Programm."},dateien:`local f = assert(io.open("notizen.txt", "w"))
f:write("Erste Zeile\\n", "Zweite Zeile\\n")
f:close()

for zeile in io.lines("notizen.txt") do
  print(zeile)
end

local datei = assert(io.open("notizen.txt", "r"))
local inhalt = datei:read("a")         -- "a" = alles (Lua 5.3+; früher "*a")
datei:close()`,http:{code:`-- LuaSocket (HTTP) und LuaSec (HTTPS), z. B. per LuaRocks
local https = require("ssl.https")

local body, code = https.request("https://api.example.com/produkte")
if code == 200 then
  print(#body .. " Bytes empfangen")
else
  print("Fehler: " .. tostring(code))
end`,note:"Lua bringt kein HTTP mit. In eingebetteten Umgebungen stellt meist der Host die API bereit (z. B. `ngx.location.capture` in OpenResty, `HttpService` in Roblox)."},json:`local json = require("dkjson")

local daten = json.decode('{"name": "Ada", "sprachen": ["Lua", "C"]}')
print(daten.name, daten.sprachen[1])    -- Arrays beginnen bei Index 1

local text = json.encode({ name = "Grace", aktiv = true }, { indent = true })
print(text)`,datenbank:{code:`local sqlite3 = require("lsqlite3")
local db = sqlite3.open("shop.db")
db:exec("CREATE TABLE IF NOT EXISTS produkte (name TEXT, preis REAL)")

local stmt = db:prepare("INSERT INTO produkte (name, preis) VALUES (?, ?)")
stmt:bind_values("Maus", 19.9)          -- Parameter binden statt String-Verkettung
stmt:step()
stmt:finalize()

for name, preis in db:urows("SELECT name, preis FROM produkte") do
  print(name, preis)
end
db:close()`,note:"lsqlite3 bindet SQLite an Lua. Für MySQL/PostgreSQL gibt es LuaSQL bzw. in OpenResty `lua-resty-mysql`."},regex:{code:`local text = "Bestellung 2024-03-15, Lieferung 2024-03-18"

local j, m, t = text:match("(%d+)%-(%d+)%-(%d+)")   -- erster Treffer mit Captures
print(j, m, t)

for datum in text:gmatch("%d+%-%d+%-%d+") do print(datum) end
print((text:gsub("%d%d%d%d", "JJJJ")))            -- Klammern: nur der 1. Rückgabewert
print(("ada@example.com"):find("^[%w._]+@[%w.]+$") ~= nil)`,note:"Lua nutzt eigene „Patterns“ statt regulärer Ausdrücke: `%d` statt `\\d`, `%` als Escape-Zeichen, keine Alternation `|` und keine Quantoren wie `{4}`. Für echte Regex: lrexlib (PCRE)."},tests:`-- spec/preise_spec.lua  (Framework: busted)
local preise = require("preise")

describe("preis_mit_rabatt", function()
  it("zieht Rabatt ab", function()
    assert.are.equal(80, preise.preis_mit_rabatt(100, 20))
  end)

  it("wirft bei ungültigem Rabatt", function()
    assert.has_error(function() preise.preis_mit_rabatt(100, 120) end)
  end)
end)
-- Ausführen: busted`},N={konstanten:`readonly MAX_VERSUCHE=3
declare -r BASIS_URL="https://api.example.com"
MAX_VERSUCHE=5            # Fehler: MAX_VERSUCHE: readonly variable

# Umgebungsvariable mit Standardwert setzen, falls leer oder ungesetzt
: "\${PORT:=8080}"
echo "Port: $PORT"`,datentypen:{code:`# Bash kennt im Kern nur Strings – Zahlen werden bei Bedarf interpretiert
zahl=42
summe=$(( zahl + 8 ))             # Ganzzahl-Arithmetik
echo "$summe"

declare -i zaehler=5              # Integer-Attribut
zaehler+=1                        # jetzt arithmetisch: 6
declare -a liste=(a b c)          # indiziertes Array
declare -A alter=([Ada]=36)       # assoziatives Array (Bash 4+)

echo "scale=2; 10 / 3" | bc       # Kommazahlen nur über externe Tools wie bc oder awk`,note:"Bash rechnet nur mit Ganzzahlen. Für Gleitkomma `bc` oder `awk` – oder bei mehr Logik zu Python wechseln."},lambdas:{na:!0,code:`verdopple() { echo $(( $1 * 2 )); }

anwenden() {                      # "Funktion als Parameter" über ihren Namen
  local funktion=$1; shift
  for x in "$@"; do "$funktion" "$x"; done
}
anwenden verdopple 1 2 3

# Kleine Transformationen in Pipelines: awk oder xargs
printf '%s\\n' 1 2 3 | awk '{ print $1 * 2 }'`,note:"Bash hat keine anonymen Funktionen. Funktionen werden über ihren Namen weitergegeben."},interfaces:{na:!0,note:"Bash kennt keine Typen, Klassen oder Interfaces. Absprachen zwischen Skripten laufen über Kommandozeilenargumente, Umgebungsvariablen, Exit-Codes und Textformate (z. B. JSON mit `jq`)."},vererbung:{na:!0,note:"Keine Objektorientierung in Bash. Gemeinsame Funktionen lagert man in eine Datei aus und bindet sie per `source` ein."},generics:{na:!0,note:"Nicht anwendbar – alle Werte sind Strings."},null:`name=""
if [[ -z "$name" ]]; then echo "leer oder nicht gesetzt"; fi
if [[ -v name ]]; then echo "gesetzt (auch wenn leer)"; fi   # Bash 4.2+

echo "\${name:-Gast}"              # Standardwert, wenn leer oder ungesetzt
echo "\${API_KEY:?API_KEY fehlt}"  # Abbruch mit Meldung, wenn leer oder ungesetzt

set -u                            # Zugriff auf ungesetzte Variablen = Fehler`,module:`# lib/log.sh
log() { printf '[%s] %s\\n' "$(date +%T)" "$*" >&2; }

# skript.sh
#!/usr/bin/env bash
set -euo pipefail
SKRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
source "$SKRIPT_DIR/lib/log.sh"      # Funktionen in die aktuelle Shell laden
log "Start"`,async:{code:`lade() { curl -fsS "https://example.com/$1" -o "$1.html"; }

lade seite1 &          # & = im Hintergrund starten
pid1=$!                # PID des letzten Hintergrundprozesses
lade seite2 &
pid2=$!

wait "$pid1" "$pid2"   # auf beide warten
echo "fertig"`,note:"Kein async/await – Bash startet Hintergrundprozesse mit `&` und wartet mit `wait` auf sie."},futures:`# Bis zu 4 Downloads parallel
xargs -P 4 -n 1 curl -fsSO < urls.txt

# Exit-Code eines Hintergrundjobs auswerten
langer_job & pid=$!
if wait "$pid"; then
  echo "ok"
else
  echo "fehlgeschlagen mit Code $?"
fi`,dateien:`echo "Erste Zeile" > notizen.txt        # überschreiben
echo "Zweite Zeile" >> notizen.txt      # anhängen

while IFS= read -r zeile; do            # zeilenweise – sicher bei Leerzeichen und Backslashes
  echo "→ $zeile"
done < notizen.txt

inhalt=$(<notizen.txt)                  # ganze Datei in eine Variable
[[ -f notizen.txt ]] && echo "existiert"

cat > config.ini <<'EOF'
[server]
port=8080
EOF`,http:`# GET: -f = Fehler bei HTTP ≥ 400, -sS = keine Fortschrittsanzeige, Fehler aber zeigen
curl -fsS "https://api.example.com/produkte?limit=5"

# POST mit JSON
curl -fsS -X POST "https://api.example.com/produkte" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $TOKEN" \\
  -d '{"name": "Maus", "preis": 19.9}'

# Nur den Statuscode ermitteln
status=$(curl -s -o /dev/null -w '%{http_code}' https://example.com)`,json:{code:`echo '{"name": "Ada", "sprachen": ["Bash", "C"]}' | jq -r '.name'     # Ada
curl -fsS https://api.example.com/produkte | jq '.[] | select(.preis < 50) | .name'
jq -n --arg name "Grace" '{name: $name, aktiv: true}'                # JSON sicher erzeugen
jq '.version = "2.0"' package.json > tmp.json && mv tmp.json package.json`,note:"`jq` ist das Standardwerkzeug für JSON in der Shell. JSON nie per String-Verkettung bauen – `--arg` escapt korrekt."},datenbank:`# SQLite
sqlite3 shop.db "SELECT name, preis FROM produkte WHERE preis < 50;"

# PostgreSQL – Passwort über ~/.pgpass oder PGPASSWORD, nie im Skript
psql "postgresql://app@localhost/shop" -At -c "SELECT count(*) FROM bestellungen;"

# Werte sicher übergeben: psql-Variable statt String-Verkettung
psql -v kunde="$KUNDE_ID" <<'SQL'
SELECT * FROM bestellungen WHERE kunde_id = :'kunde';
SQL`,regex:`datum="2024-03-15"
if [[ $datum =~ ^([0-9]{4})-([0-9]{2})-([0-9]{2})$ ]]; then
  echo "Jahr: \${BASH_REMATCH[1]}"
fi

grep -E '^[^@]+@[^@]+$' adressen.txt           # Zeilen filtern
grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}' log.txt   # nur die Treffer ausgeben
sed -E 's/([0-9]{4})-([0-9]{2})-([0-9]{2})/\\3.\\2.\\1/' daten.txt`,tests:{code:`# test/preise.bats  (bats-core)
setup() { source "$BATS_TEST_DIRNAME/../lib/preise.sh"; }

@test "zieht Rabatt ab" {
  run preis_mit_rabatt 100 20
  [ "$status" -eq 0 ]
  [ "$output" = "80" ]
}

@test "lehnt ungültigen Rabatt ab" {
  run preis_mit_rabatt 100 120
  [ "$status" -ne 0 ]
}
# Ausführen: bats test/`,note:"Neben Tests gehört ShellCheck (statische Analyse) in jede CI für Shell-Skripte."}},I={konstanten:`Set-Variable -Name MaxVersuche -Value 3 -Option Constant        # für die Sitzung unveränderlich
Set-Variable -Name BasisUrl -Value 'https://api.example.com' -Option ReadOnly  # mit -Force änderbar
$MaxVersuche = 5      # Fehler: Die Variable ist schreibgeschützt oder konstant

[Math]::PI            # .NET-Konstanten direkt nutzen`,datentypen:{code:`$ganz = 42                    # [int]
$kommazahl = 3.14             # [double]
$text = 'Hallo'               # [string]
$aktiv = $true                # [bool]
$liste = @(1, 2, 3)           # [object[]]
$tabelle = @{ Name = 'Ada' }  # [hashtable]
$datum = Get-Date             # [datetime]

[int]$alter = '36'            # Typ festlegen und umwandeln
$ganz.GetType().FullName      # System.Int32
'42abc' -as [int]             # sichere Umwandlung: $null bei Fehler`,note:"PowerShell arbeitet mit .NET-Objekten, nicht mit Text – jeder Wert hat einen .NET-Typ mit Eigenschaften und Methoden."},lambdas:`$verdopple = { param($x) $x * 2 }      # Scriptblock
& $verdopple 21                          # aufrufen → 42

1..5 | ForEach-Object { $_ * $_ }        # $_ = aktuelles Pipeline-Element
Get-Process | Where-Object { $_.CPU -gt 100 } | Sort-Object CPU -Descending
$summe = (1..10 | Measure-Object -Sum).Sum`,interfaces:{code:`class Produkt : System.IComparable {
    [string]$Name
    [decimal]$Preis
    Produkt([string]$n, [decimal]$p) { $this.Name = $n; $this.Preis = $p }
    [int] CompareTo([object]$anderes) { return $this.Preis.CompareTo($anderes.Preis) }
}

$liste = [Produkt]::new('Tastatur', 49), [Produkt]::new('Maus', 19)
$liste | Sort-Object | ForEach-Object Name     # Maus, Tastatur`,note:"PowerShell-Klassen können .NET-Interfaces implementieren, aber keine eigenen Interfaces definieren."},vererbung:`class Tier {
    [string]$Name
    Tier([string]$name) { $this.Name = $name }
    [string] Laut() { return '…' }
    [string] Vorstellen() { return "$($this.Name) sagt $($this.Laut())" }
}

class Hund : Tier {
    Hund([string]$name) : base($name) { }
    [string] Laut() { return 'Wuff' }       # überschreibt die Basismethode
}

[Hund]::new('Rex').Vorstellen()             # Rex sagt Wuff`,generics:{code:`$liste = [System.Collections.Generic.List[int]]::new()
$liste.Add(3); $liste.Add(1)
$liste.Sort()

$woerterbuch = [System.Collections.Generic.Dictionary[string, int]]::new()
$woerterbuch['Ada'] = 36
# $liste.Add('Text')   → Fehler: Wert kann nicht in Int32 konvertiert werden`,note:"Generische .NET-Typen lassen sich nutzen, eigene generische Klassen kann PowerShell nicht definieren."},null:`$name = $null
if ($null -eq $name) { 'nicht gesetzt' }     # $null links: korrekt auch bei Arrays

$anzeige = $name ?? 'Gast'                   # PowerShell 7+
$name ??= 'Ada'                              # PowerShell 7+
$laenge = \${name}?.Length                    # PowerShell 7+: geschweifte Klammern nötig,
                                             # weil ? in Variablennamen erlaubt ist
[string]::IsNullOrWhiteSpace($name)`,module:`# Werkzeuge.psm1
function Get-Gruss { param([string]$Name) "Hallo, $Name" }
function Hilfsfunktion { }                        # wird nicht exportiert
Export-ModuleMember -Function Get-Gruss

# Verwendung
Import-Module ./Werkzeuge.psm1
Get-Gruss -Name 'Ada'

Install-Module -Name Pester -Scope CurrentUser    # aus der PowerShell Gallery
. ./hilfen.ps1                                    # Dot-Sourcing: Skript in den aktuellen Scope laden`,async:{code:`$job = Start-Job { Start-Sleep 2; 'fertig' }   # Hintergrundjob in eigenem Prozess
# … weiterarbeiten …
Receive-Job $job -Wait

$t = Start-ThreadJob { Invoke-RestMethod https://example.com }   # leichter: Thread (PS 7)
Wait-Job $t | Receive-Job`,note:"Kein async/await. Jobs (Prozess oder Thread) und `ForEach-Object -Parallel` ermöglichen Nebenläufigkeit."},futures:`# PowerShell 7+: parallele Verarbeitung in Runspaces
$urls = 'https://example.com', 'https://example.org'
$ergebnisse = $urls | ForEach-Object -Parallel {
    $antwort = Invoke-WebRequest $_
    [pscustomobject]@{ Url = $_; Status = $antwort.StatusCode }
} -ThrottleLimit 4
$ergebnisse | Format-Table`,dateien:`Set-Content -Path notizen.txt -Value 'Erste Zeile' -Encoding utf8
Add-Content -Path notizen.txt -Value 'Zweite Zeile'

Get-Content notizen.txt | ForEach-Object { "→ $_" }
$inhalt = Get-Content notizen.txt -Raw            # als ein einziger String
Test-Path notizen.txt
Get-ChildItem *.txt -Recurse | Select-Object FullName, Length`,http:`# Invoke-RestMethod wandelt JSON-Antworten automatisch in Objekte um
$produkte = Invoke-RestMethod -Uri 'https://api.example.com/produkte'
$produkte | Where-Object preis -lt 50 | Select-Object name, preis

$params = @{
    Uri         = 'https://api.example.com/produkte'
    Method      = 'Post'
    ContentType = 'application/json'
    Body        = @{ name = 'Maus'; preis = 19.9 } | ConvertTo-Json
    Headers     = @{ Authorization = "Bearer $env:TOKEN" }
}
Invoke-RestMethod @params                          # Splatting statt langer Zeilen`,json:{code:`$daten = '{"name": "Ada", "sprachen": ["PowerShell", "C#"]}' | ConvertFrom-Json
$daten.name
$daten.sprachen[0]

$objekt = [pscustomobject]@{ Name = 'Grace'; Aktiv = $true; Tags = @{ Rolle = 'Admin' } }
$objekt | ConvertTo-Json -Depth 5
Get-Content config.json -Raw | ConvertFrom-Json -AsHashtable   # PowerShell 7+`,note:"Achtung: `ConvertTo-Json` serialisiert standardmäßig nur 2 Ebenen tief – tiefer verschachtelte Daten werden sonst als Text abgeschnitten. `-Depth` setzen."},datenbank:{code:`# Modul PSSQLite (PowerShell Gallery) – Parameter statt String-Verkettung
Import-Module PSSQLite
Invoke-SqliteQuery -DataSource shop.db -Query 'SELECT name, preis FROM produkte WHERE preis < @max' -SqlParameters @{ max = 50 }

# SQL Server über .NET (Microsoft.Data.SqlClient), $verbindung ist bereits geöffnet
$cmd = $verbindung.CreateCommand()
$cmd.CommandText = 'SELECT name FROM produkte WHERE preis < @max'
$null = $cmd.Parameters.AddWithValue('@max', 50)
$leser = $cmd.ExecuteReader()`,note:"Vorsicht bei `Invoke-Sqlcmd -Variable`: Das ist Textersetzung im SQL, keine Parametrisierung – und damit anfällig für SQL-Injection."},regex:`$text = 'Bestellung 2024-03-15, Lieferung 2024-03-18'
if ($text -match '(?<jahr>\\d{4})-(?<monat>\\d{2})') {
    $Matches.jahr                                     # Treffer landen in $Matches
}
[regex]::Matches($text, '\\d{4}-\\d{2}-\\d{2}') | ForEach-Object Value
$text -replace '(\\d{4})-(\\d{2})-(\\d{2})', '$3.$2.$1'  # einfache Anführungszeichen!
'ada@example.com' -match '^[^@\\s]+@[^@\\s]+$'
Select-String -Path *.log -Pattern 'ERROR'           # wie grep`,tests:`# Preise.Tests.ps1 (Pester 5)
BeforeAll { . $PSScriptRoot/Preise.ps1 }

Describe 'Get-PreisMitRabatt' {
    It 'zieht Rabatt ab' {
        Get-PreisMitRabatt -Preis 100 -Rabatt 20 | Should -Be 80
    }
    It 'wirft bei ungültigem Rabatt' {
        { Get-PreisMitRabatt -Preis 100 -Rabatt 120 } | Should -Throw
    }
}
# Ausführen: Invoke-Pester`},M={konstanten:`MAX_VERSUCHE <- 3            # Konvention – technisch änderbar
lockBinding("MAX_VERSUCHE", globalenv())
# MAX_VERSUCHE <- 5          # Fehler: cannot change value of locked binding

pi; LETTERS; month.name      # eingebaute Konstanten`,datentypen:{code:`class(42)          # "numeric" (double)
class(42L)         # "integer"
class("Text")      # "character"
class(TRUE)        # "logical"
class(3+2i)        # "complex"
class(NA)          # "logical" – fehlender Wert
class(factor(c("klein", "gross")))   # "factor" – kategoriale Daten

length(42)         # 1 – auch eine einzelne Zahl ist ein Vektor
as.numeric("3.5") + 1
str(list(a = 1, b = "x"))            # Struktur eines Objekts anzeigen`,note:"Grundbaustein in R ist der Vektor. Tabellen sind `data.frame`s (bzw. tibbles im tidyverse), also Listen gleich langer Spaltenvektoren."},switch:`tag_typ <- function(tag) {
  switch(tag,
    "Sa" = , "So" = "Wochenende",    # leere Werte fallen zum nächsten durch
    "Fr" = "Fast Wochenende",
    "Werktag"                         # Standardfall
  )
}
tag_typ("So")

# Vektorisiert mit dplyr::case_when
temperaturen <- c(5, 18, 32)
dplyr::case_when(temperaturen > 30 ~ "heiß", temperaturen > 15 ~ "angenehm", .default = "kalt")`,lambdas:`verdopple <- function(x) x * 2
quadrat <- \\(x) x^2                  # Kurzschreibweise seit R 4.1

sapply(1:5, \\(x) x^2)                # 1 4 9 16 25
Filter(\\(x) x %% 2 == 0, 1:10)
Reduce("+", 1:5)                     # 15
purrr::map_dbl(1:3, ~ .x * 10)       # Formel-Lambda aus purrr`,interfaces:{code:`# S3: generische Funktion + Methoden je Klasse – Polymorphie ohne formale Interfaces
flaeche <- function(form, ...) UseMethod("flaeche")
flaeche.kreis <- function(form, ...) pi * form$r^2
flaeche.quadrat <- function(form, ...) form$a^2

formen <- list(structure(list(r = 2), class = "kreis"),
               structure(list(a = 3), class = "quadrat"))
sapply(formen, flaeche)`,note:"R hat mehrere OOP-Systeme: S3 (informell, am häufigsten), S4 (formale Klassen und virtuelle Klassen), R6 (referenzbasiert) und seit Kurzem S7."},vererbung:`library(R6)    # R6: klassische OOP mit Referenzsemantik und Vererbung

Tier <- R6Class("Tier",
  public = list(
    name = NULL,
    initialize = function(name) self$name <- name,
    laut = function() "…",
    vorstellen = function() paste(self$name, "sagt", self$laut())
  )
)
Hund <- R6Class("Hund", inherit = Tier,
  public = list(laut = function() "Wuff")
)
Hund$new("Rex")$vorstellen()   # "Rex sagt Wuff"`,generics:{na:!0,note:"R ist dynamisch typisiert; Typparameter gibt es nicht. Der Begriff „generische Funktion“ bezeichnet in R etwas anderes: Funktionen wie `print` oder `summary`, die per S3/S4 an die passende Methode verteilen."},null:`x <- NULL            # "nichts" – Länge 0
is.null(x)           # TRUE

werte <- c(4, NA, 7) # NA = fehlender Wert (wichtig in der Statistik)
is.na(werte)         # FALSE TRUE FALSE
mean(werte)          # NA
mean(werte, na.rm = TRUE)   # 5.5

name <- NULL
anzeige <- name %||% "Gast" # Base R ab 4.4 (vorher aus rlang)`,exceptions:`ergebnis <- tryCatch({
  wert <- log(-1)                     # erzeugt eine Warnung (NaN)
  stop("Etwas ist schiefgelaufen")
}, warning = function(w) {
  message("Warnung: ", conditionMessage(w))
  NA
}, error = function(e) {
  message("Fehler: ", conditionMessage(e))
  NULL
}, finally = {
  message("aufräumen")
})

stopifnot(is.numeric(42), 1 < 2)      # einfache Zusicherungen`,module:`install.packages("dplyr")     # aus CRAN installieren
library(dplyr)                # Paket laden und anhängen
jsonlite::toJSON(1:3)         # Funktion ohne library() über :: aufrufen
if (requireNamespace("jsonlite", quietly = TRUE)) message("jsonlite verfügbar")

source("hilfsfunktionen.R")   # eigenes Skript ausführen

# Für Projekte: eigene Pakete (usethis::create_package) und renv für feste Versionen`,async:{na:!0,note:"Kein async/await. Für asynchrone Abläufe (z. B. in Shiny) gibt es die Pakete `promises` und `future`; siehe „Promises, Futures & Threads“."},futures:`library(future)
plan(multisession, workers = 4)          # parallele R-Sitzungen im Hintergrund

f <- future({ Sys.sleep(1); sum(1:1e6) })
value(f)                                 # wartet auf das Ergebnis

library(furrr)
ergebnisse <- future_map_dbl(1:8, \\(i) { Sys.sleep(0.5); i^2 })   # parallele map

# Base R: parallel::mclapply (nur Unix), parallel::parLapply (alle Plattformen)`,dateien:`writeLines(c("Erste Zeile", "Zweite Zeile"), "notizen.txt")
cat("Dritte Zeile\\n", file = "notizen.txt", append = TRUE)
zeilen <- readLines("notizen.txt")

daten <- read.csv("verkaeufe.csv")              # Base R
write.csv(daten, "kopie.csv", row.names = FALSE)
daten <- readr::read_csv("verkaeufe.csv")       # schneller, tidyverse
file.exists("notizen.txt")`,http:`library(httr2)

antwort <- request("https://api.example.com/produkte") |>
  req_url_query(limit = 5) |>
  req_perform()                               # wirft bei HTTP-Fehlern

resp_status(antwort)
produkte <- resp_body_json(antwort)

request("https://api.example.com/produkte") |>
  req_body_json(list(name = "Maus", preis = 19.9)) |>
  req_perform()`,json:`library(jsonlite)

daten <- fromJSON('{"name": "Ada", "sprachen": ["R", "C"]}')
daten$sprachen

df <- fromJSON('[{"name": "Ada", "alter": 36}, {"name": "Grace", "alter": 45}]')
class(df)                        # "data.frame" – Arrays von Objekten werden zu Tabellen

toJSON(list(name = "Grace", aktiv = TRUE), auto_unbox = TRUE, pretty = TRUE)`,datenbank:`library(DBI)
con <- dbConnect(RSQLite::SQLite(), "shop.db")

dbWriteTable(con, "produkte",
             data.frame(name = c("Maus", "Tastatur"), preis = c(19.9, 49.9)),
             overwrite = TRUE)
dbGetQuery(con, "SELECT name FROM produkte WHERE preis < ?", params = list(30))   # Parameter!

library(dplyr)
tbl(con, "produkte") |> filter(preis < 30) |> collect()   # dbplyr übersetzt in SQL
dbDisconnect(con)`,regex:{code:`text <- c("Bestellung 2024-03-15", "keine Angabe", "Lieferung 2024-03-18")

grepl("\\\\d{4}-\\\\d{2}-\\\\d{2}", text)              # TRUE FALSE TRUE
regmatches(text, regexpr("\\\\d{4}", text))        # Treffer extrahieren
sub("(\\\\d{4})-(\\\\d{2})-(\\\\d{2})", "\\\\3.\\\\2.\\\\1", text)

library(stringr)
str_extract(text, "\\\\d{4}-\\\\d{2}-\\\\d{2}")
str_detect("ada@example.com", "^[^@\\\\s]+@[^@\\\\s]+$")`,note:'In R-Strings muss der Backslash verdoppelt werden (`"\\\\d"`). Seit R 4.0 gehen auch Raw Strings: `r"(\\d{4})"`.'},tests:`# tests/testthat/test-preise.R
test_that("Rabatt wird abgezogen", {
  expect_equal(preis_mit_rabatt(100, 20), 80)
})

test_that("ungültiger Rabatt wirft Fehler", {
  expect_error(preis_mit_rabatt(100, 120), "zwischen 0 und 100")
})
# Ausführen: devtools::test() oder testthat::test_dir("tests/testthat")`},j={kommentare:`# Einzeiliger Kommentar
#=
   Mehrzeiliger Kommentar
   (verschachtelbar)
=#

"""
    verdopple(x)

Docstring direkt über der Funktion – in der REPL mit ?verdopple abrufbar.
"""
verdopple(x) = 2x`,konstanten:`const MAX_VERSUCHE = 3        # globale Konstante: fester Typ, wichtig für Performance
const FARBEN = ["rot", "grün"]
push!(FARBEN, "blau")         # erlaubt: const schützt die Bindung, nicht den Inhalt

pi, ℯ                         # eingebaute Konstanten (π und ℯ als Unicode-Namen)`,datentypen:{code:`typeof(42)            # Int64 (auf 64-Bit-Systemen)
typeof(3.14)          # Float64
typeof(1//3)          # Rational{Int64} – exakte Brüche
typeof("Text")        # String
typeof('A')           # Char
typeof(true)          # Bool
typeof(nothing)       # Nothing
typeof([1, 2, 3])     # Vector{Int64}
typeof((1, "a"))      # Tuple{Int64, String}

parse(Int, "42") + 1
big(2)^100            # BigInt für beliebig große Zahlen`,note:"Julia ist dynamisch typisiert, kompiliert aber für jede Kombination von Argumenttypen spezialisierten Maschinencode (JIT) – daher die Geschwindigkeit."},switch:{na:!0,code:`function tagtyp(tag)
    if tag in ("Sa", "So")
        "Wochenende"
    elseif tag == "Fr"
        "Fast Wochenende"
    else
        "Werktag"
    end
end

# Multiple Dispatch ersetzt oft Fallunterscheidungen nach Typ
beschreibe(x::Integer) = "Ganzzahl"
beschreibe(x::AbstractString) = "Text"
beschreibe(x) = "etwas anderes"`,note:"Julia hat kein `switch`. Üblich sind `if`/`elseif`, der ternäre Operator und Multiple Dispatch; Pattern Matching bieten Pakete wie Match.jl."},lambdas:`verdopple = x -> 2x
addiere = (a, b) -> a + b

map(x -> x^2, 1:5)
filter(iseven, 1:10)
reduce(+, 1:5)
sort([3, 1, 2], by = x -> -x)

# do-Block: Funktion als erstes Argument übergeben
map(1:3) do x
    x * 10
end`,interfaces:{code:`abstract type Form end               # abstrakter Typ als "Schnittstelle"
flaeche(f::Form) = error("flaeche nicht implementiert für $(typeof(f))")

struct Kreis <: Form
    r::Float64
end
flaeche(k::Kreis) = π * k.r^2

# Informelle Interfaces: Wer Base.iterate implementiert, funktioniert in for-Schleifen
struct Countdown
    n::Int
end
Base.iterate(c::Countdown, i = c.n) = i < 1 ? nothing : (i, i - 1)

for i in Countdown(3)
    print(i, " ")                    # 3 2 1
end`,note:"Julia hat keine formalen Interfaces. Verträge entstehen aus abstrakten Typen und dokumentierten Methoden (z. B. Iteration, Indexierung, Arrays)."},vererbung:{code:`abstract type Tier end
laut(::Tier) = "…"
vorstellen(t::Tier) = "$(t.name) sagt $(laut(t))"

struct Hund <: Tier                   # Untertyp eines abstrakten Typs
    name::String
end
laut(::Hund) = "Wuff"                 # Multiple Dispatch statt Überschreiben

vorstellen(Hund("Rex"))               # "Rex sagt Wuff"`,note:"Nur abstrakte Typen können Untertypen haben; konkrete Typen (structs) sind final. Gemeinsame Felder teilt man per Komposition."},generics:`struct Paar{T}
    a::T
    b::T
end
Paar(1, 2)                 # Paar{Int64}
Paar(1.0, 2.5)             # Paar{Float64}

function groesstes(werte::Vector{T}) where {T<:Real}
    maximum(werte)
end
groesstes([3, 7, 2])       # 7`,null:`x = nothing                     # "kein Wert" (Programmlogik)
isnothing(x)                    # true
something(x, "Standard")        # erster Wert, der nicht nothing ist

werte = [4, missing, 7]         # missing = fehlender Datenwert (Statistik)
sum(skipmissing(werte))         # 11
ismissing(werte[2])             # true

finde(id)::Union{String, Nothing} = id == 1 ? "Ada" : nothing`,exceptions:`function teile(a, b)
    b == 0 && throw(DomainError(b, "Division durch 0"))
    a / b
end

try
    teile(1, 0)
catch e
    if e isa DomainError
        println("Ungültig: ", e.msg)
    else
        rethrow()
    end
finally
    println("aufräumen")
end

struct BestellFehler <: Exception
    nachricht::String
end`,module:`module Mathe
export quadrat              # öffentliche Namen
quadrat(x) = x^2
intern() = 0                # nur als Mathe.intern erreichbar
end

using .Mathe                # lokales Modul laden
quadrat(4)

using Statistics            # Paket: exportierte Namen direkt verfügbar
import JSON3                # nur der Modulname: JSON3.read(…)
# Pakete installieren: ] add JSON3   (Pkg-Modus in der REPL)`,async:{code:`t = @async begin            # Task (Coroutine) starten
    sleep(1)
    "fertig"
end
println("läuft weiter …")
fetch(t)                    # auf das Ergebnis warten

@sync begin                 # wartet auf alle enthaltenen Tasks
    @async (sleep(0.5); println("A"))
    @async (sleep(0.2); println("B"))
end`,note:"Kein async/await-Schlüsselwort: Tasks mit `@async` (nebenläufig, ideal für I/O) oder `Threads.@spawn` (parallel auf mehreren Threads)."},futures:`# Julia mit mehreren Threads starten: julia --threads=auto
ergebnisse = zeros(Int, 8)
Threads.@threads for i in 1:8
    ergebnisse[i] = i^2                 # jede Iteration schreibt einen eigenen Index
end

t = Threads.@spawn sum(rand(10^7))      # Task auf einem beliebigen Thread
fetch(t)

ch = Channel{Int}(10)                    # Kanal zwischen Tasks
@async begin
    for i in 1:3
        put!(ch, i)
    end
    close(ch)
end
for wert in ch
    println(wert)
end`,dateien:`write("notizen.txt", "Erste Zeile\\n")
open("notizen.txt", "a") do io          # do-Block schließt die Datei automatisch
    println(io, "Zweite Zeile")
end

inhalt = read("notizen.txt", String)
for zeile in eachline("notizen.txt")
    println(zeile)
end
isfile("notizen.txt")

using CSV, DataFrames
df = CSV.read("verkaeufe.csv", DataFrame)`,http:`using HTTP, JSON3

# HTTP.jl wirft standardmäßig bei Statuscodes ≥ 400 (HTTP.StatusError)
antwort = HTTP.get("https://api.example.com/produkte"; query = ["limit" => "5"])
antwort.status
produkte = JSON3.read(antwort.body)

HTTP.post("https://api.example.com/produkte",
          ["Content-Type" => "application/json"],
          JSON3.write((name = "Maus", preis = 19.9)))`,json:`using JSON3, StructTypes

daten = JSON3.read("""{"name": "Ada", "sprachen": ["Julia", "C"]}""")
daten.name                       # "Ada"
daten.sprachen[1]                # Index ab 1

struct Nutzer
    name::String
    aktiv::Bool
end
StructTypes.StructType(::Type{Nutzer}) = StructTypes.Struct()

JSON3.write(Nutzer("Grace", true))                   # {"name":"Grace","aktiv":true}
JSON3.read("""{"name":"Ada","aktiv":false}""", Nutzer)`,datenbank:`using SQLite, DBInterface, DataFrames

db = SQLite.DB("shop.db")
DBInterface.execute(db, "CREATE TABLE IF NOT EXISTS produkte (name TEXT, preis REAL)")
DBInterface.execute(db, "INSERT INTO produkte VALUES (?, ?)", ["Maus", 19.9])   # Parameter

df = DBInterface.execute(db, "SELECT * FROM produkte WHERE preis < ?", [50]) |> DataFrame`,regex:`text = "Bestellung 2024-03-15, Lieferung 2024-03-18"

m = match(r"(\\d{4})-(\\d{2})-(\\d{2})", text)
m[1]                                                   # "2024"
[x.match for x in eachmatch(r"\\d{4}-\\d{2}-\\d{2}", text)]
replace(text, r"(\\d{4})-(\\d{2})-(\\d{2})" => s"\\3.\\2.\\1")
occursin(r"^[^@\\s]+@[^@\\s]+$", "ada@example.com")
match(r"(?<jahr>\\d{4})", text)[:jahr]`,tests:`using Test

@testset "Preise" begin
    @test preis_mit_rabatt(100, 20) == 80
    @test preis_mit_rabatt(19.99, 10) ≈ 17.991      # ≈ (isapprox) für Gleitkommazahlen
    @test_throws ArgumentError preis_mit_rabatt(100, 120)
end
# In Paketen: test/runtests.jl, ausführen mit ] test`},a={python:c,javascript:d,typescript:h,java:m,csharp:p,go:f,rust:b,cpp:k,php:z,kotlin:g,c:{...S,..._},ruby:{...v,...R},swift:{...w,...C},dart:{...y,...F},scala:{...x,...L},lua:{...T,...D},bash:{...A,...N},powershell:{...E,...I},r:{...$,...M},julia:{...P,...j}},B=["python","javascript","typescript","java","csharp","go","rust","cpp","php","kotlin","swift","ruby","c","dart","scala","lua","r","julia","bash","powershell"];function H(e,i){var s,l;const n=(s=a[e])==null?void 0:s[i];if(n===void 0)return{status:"missing",from:e};const t=typeof n=="string"?{code:n}:n;if(t.sameAs){const r=(l=a[t.sameAs])==null?void 0:l[i],o=typeof r=="string"?{code:r}:r??{};return{...o,note:t.note??o.note,sameAs:t.sameAs,status:"ok",from:t.sameAs}}return{...t,status:t.na?"na":"ok",from:e}}function G(e){return Object.keys(a[e]??{}).length}export{u as a,O as b,G as c,K as d,a as e,H as g,B as s};
