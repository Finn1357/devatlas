const e=`---
id: hashing-hashtabellen
title: Hashing & Hashtabellen: Wie Dictionaries in O(1) arbeiten
area: algorithmen
difficulty: fortgeschritten
minutes: 17
order: 15
summary: Was Hashfunktionen leisten, wie Hashtabellen Kollisionen auflösen und wachsen, warum Schlüssel unveränderlich sein müssen – und wo Hashing sonst überall steckt, von Git bis zur Passwortspeicherung.
tags: [Hashing, Hashtabelle, Dictionary, HashMap, Kollision, Bloom-Filter]
related: [datenstrukturen, big-o, passwoerter-kryptografie, replikation-sharding-backups]
---

## Das Versprechen: Suchen ohne Suchen

Eine Liste muss man durchsuchen: O(n). Ein sortiertes Array mit binärer Suche: O(log n). Eine **[[Hashtabelle]]** findet einen Eintrag im Durchschnitt in **O(1)** – egal ob sie zehn oder zehn Millionen Einträge hat. Deshalb sind Pythons \`dict\` und \`set\`, JavaScripts \`Map\`, Javas \`HashMap\`, Gos \`map\` und Rusts \`HashMap\` die vielleicht meistgenutzten Datenstrukturen überhaupt.

Der Trick: Statt zu suchen, **berechnet** man, wo ein Eintrag liegen muss.

## Hashfunktionen

Eine **[[Hashfunktion]]** bildet beliebige Daten auf eine Zahl fester Größe ab. Für Hashtabellen muss sie:

1. **deterministisch** sein – gleiche Eingabe, gleicher Hash,
2. **schnell** sein,
3. **gleichmäßig streuen** – ähnliche Schlüssel sollen weit auseinanderliegende Hashes erhalten.

Aus dem Hash wird mit \`hash % anzahl_buckets\` der Index im internen Array.

\`\`\`python
print(hash("Ada"))      # große Ganzzahl – ändert sich bei jedem Programmstart (siehe unten)
print(hash(42))         # 42 – kleine Ganzzahlen hashen in CPython auf sich selbst
print(hash((1, 2)))     # Tupel sind hashbar
# hash([1, 2])          # TypeError: unhashable type: 'list'
\`\`\`

## Kollisionen

Weil unendlich viele mögliche Schlüssel auf wenige Buckets verteilt werden, landen zwangsläufig manchmal zwei Schlüssel im selben Bucket – eine **Kollision**. Zwei Strategien:

| Strategie | Idee | Verwendet in |
|---|---|---|
| **Verkettung** (Chaining) | Jeder Bucket hält eine kleine Liste; Kollisionen werden angehängt | Java \`HashMap\` (ab vielen Einträgen pro Bucket sogar ein Baum), Go |
| **Offene Adressierung** | Bei Kollision nach festem Muster den nächsten freien Platz suchen (Probing) | Python \`dict\`, Rust \`HashMap\` (SwissTable) |

Probiere es aus: Füge Schlüssel ein, bis eine Kollision entsteht – und beobachte, was passiert, wenn die Tabelle zu voll wird.

\`\`\`widget
datastructures:hash
\`\`\`

## Ladefaktor und Wachstum

Der **Ladefaktor** ist Einträge ÷ Buckets. Wird die Tabelle zu voll, werden Kollisionen häufiger und Operationen langsamer. Deshalb **vergrößert** sich eine Hashtabelle ab einem Schwellwert (oft 0,75, bei Python etwa 2/3) – typischerweise auf das Doppelte – und verteilt alle Einträge neu (**Rehashing**).

Ein einzelnes Rehashing kostet O(n). Weil es aber nur selten passiert (nach jeder Verdopplung erst wieder, wenn sich die Menge verdoppelt hat), bleibt der Durchschnitt pro Einfügen **amortisiert O(1)**.

| Operation | Durchschnitt | Schlimmster Fall |
|---|---|---|
| Einfügen | O(1) amortisiert | O(n) |
| Suchen | O(1) | O(n) |
| Löschen | O(1) | O(n) |
| Sortiert durchlaufen | – (nicht vorgesehen) | O(n log n) nach Sortieren |

Der schlimmste Fall tritt ein, wenn (fast) alle Schlüssel kollidieren.

## Hash-Flooding und Zufall

Kennt ein Angreifer die Hashfunktion, kann er gezielt Tausende kollidierende Schlüssel senden – etwa als Formularfelder oder JSON-Schlüssel – und den Server mit O(n²)-Aufwand lahmlegen (**Hash-Flooding**, 2011 in vielen Web-Frameworks demonstriert). Moderne Sprachen verwenden deshalb für Strings **zufällig initialisierte** Hashfunktionen wie SipHash. Darum ändert sich \`hash("Ada")\` in Python bei jedem Start (steuerbar über \`PYTHONHASHSEED\`).

## Die wichtigste Regel: Hash und Gleichheit

Für jede Hashtabelle gilt der Vertrag: **Sind zwei Objekte gleich, müssen ihre Hashes gleich sein.** (Umgekehrt nicht – gleiche Hashes bei ungleichen Objekten sind Kollisionen.)

\`\`\`java title="Java: equals und hashCode immer gemeinsam überschreiben"
public final class Punkt {
    private final int x, y;
    public Punkt(int x, int y) { this.x = x; this.y = y; }

    @Override public boolean equals(Object o) {
        return o instanceof Punkt p && p.x == x && p.y == y;
    }
    @Override public int hashCode() {
        return Objects.hash(x, y);
    }
}
// Seit Java 16 einfacher: record Punkt(int x, int y) {} – erzeugt beides automatisch
\`\`\`

> [!MISTAKE] Veränderliche Schlüssel
> Ändert sich ein Schlüssel, nachdem er in die Tabelle eingefügt wurde, ändert sich sein Hash – er liegt dann im „falschen“ Bucket und ist nicht mehr auffindbar. Deshalb erlaubt Python nur unveränderliche (hashbare) Schlüssel: \`str\`, \`int\`, \`tuple\`, \`frozenset\` – aber nicht \`list\` oder \`dict\`. In Java gilt: Felder, die in \`hashCode\` eingehen, sollten \`final\` sein.

## Hashtabellen in der Praxis

\`\`\`python title="Klassische Muster"
# 1. Zählen
from collections import Counter
woerter = "der hund und der ball".split()
print(Counter(woerter).most_common(1))          # [('der', 2)]

# 2. Duplikate entfernen (Reihenfolge bleibt seit Python 3.7 erhalten)
print(list(dict.fromkeys([3, 1, 3, 2, 1])))     # [3, 1, 2]

# 3. Two Sum in O(n) statt O(n²)
def two_sum(zahlen, ziel):
    gesehen = {}                                 # Wert → Index
    for i, z in enumerate(zahlen):
        if ziel - z in gesehen:
            return gesehen[ziel - z], i
        gesehen[z] = i

# 4. Gruppieren
from collections import defaultdict
nach_laenge = defaultdict(list)
for w in woerter:
    nach_laenge[len(w)].append(w)
\`\`\`

> [!TIP] Mitgliedschaft prüfen
> \`if x in liste\` ist O(n), \`if x in menge\` ist O(1). Wer in einer Schleife wiederholt prüft, ob etwas „schon gesehen“ wurde, sollte ein \`set\` verwenden – das macht aus O(n²) oft O(n).

## Hashing jenseits von Dictionaries

| Einsatz | Wie Hashing hilft |
|---|---|
| **Git** | Jedes Objekt (Datei, Verzeichnis, Commit) wird über den Hash seines Inhalts adressiert. Gleicher Inhalt = gleicher Hash = nur einmal gespeichert. |
| **Prüfsummen** | Download-Integrität prüfen (\`sha256sum datei.iso\`) |
| **Caching** | Cache-Schlüssel aus Anfrageparametern; Dateinamen mit Inhalts-Hash (\`app.3f9a1c.js\`) für langes Browser-Caching |
| **Passwörter** | Speicherung als langsamer, gesalzener Hash – [Argon2, bcrypt](#/artikel/passwoerter-kryptografie), nie SHA-256 pur |
| **Sharding** | Datensätze per Hash des Schlüssels auf Server verteilen; **Consistent Hashing** minimiert Umverteilungen beim Hinzufügen von Servern – siehe [Replikation & Sharding](#/artikel/replikation-sharding-backups) |
| **Bloom-Filter** | Platzsparend prüfen, ob ein Element *vielleicht* oder *sicher nicht* in einer Menge ist – genutzt in Datenbanken, um unnötige Plattenzugriffe zu vermeiden |
| **Deduplizierung** | Backups speichern identische Blöcke nur einmal |

### Kryptografische vs. normale Hashfunktionen

| | Für Hashtabellen (z. B. SipHash, xxHash, MurmurHash) | Kryptografisch (z. B. SHA-256, SHA-3, BLAKE3) |
|---|---|---|
| Ziel | Geschwindigkeit, gute Streuung | Unumkehrbarkeit, Kollisionsresistenz |
| Kollisionen absichtlich finden | möglich (SipHash erschwert es mit geheimem Schlüssel) | praktisch unmöglich |
| Geschwindigkeit | sehr schnell | schnell, aber langsamer |

> [!DANGER]
> MD5 und SHA-1 gelten als gebrochen: Kollisionen lassen sich gezielt erzeugen. Für Signaturen, Zertifikate und Integritätsprüfungen gegen Angreifer SHA-256 oder besser verwenden. Git wechselt deshalb schrittweise von SHA-1 zu SHA-256.

## Wie geht es weiter?

Wenn Daten **sortiert** bleiben müssen oder Bereichsabfragen nötig sind, sind [Bäume](#/artikel/baeume-heaps) die bessere Wahl – deshalb nutzen Datenbankindizes B-Bäume statt Hashtabellen.
`;export{e as default};
