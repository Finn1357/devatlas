const e=`---
id: big-o
title: Big-O-Notation: Laufzeit und Speicher einschätzen
area: algorithmen
difficulty: einsteiger
minutes: 15
order: 10
summary: Wie man den Aufwand eines Algorithmus unabhängig von Hardware beschreibt, welche Komplexitätsklassen es gibt und wie man sie im eigenen Code erkennt – mit interaktivem Diagramm.
tags: [Big-O, Komplexität, Laufzeit, Algorithmen, Performance]
related: [datenstrukturen, sortieren-suchen, rekursion-dp, graphen]
---

## Was misst Big-O?

Die [[Big-O-Notation]] beschreibt nicht, *wie schnell* ein Programm ist, sondern **wie sein Aufwand wächst, wenn die Eingabe größer wird**. Ob ein Algorithmus bei 10 Elementen 1 oder 3 Millisekunden braucht, ist meist egal. Ob er bei 10 Millionen Elementen 2 Sekunden oder 3 Tage braucht, ist entscheidend.

> [!BEGINNER]
> Du suchst einen Namen im Telefonbuch. Seite für Seite blättern dauert bei doppelt so dickem Buch doppelt so lange – **O(n)**. In der Mitte aufschlagen und die falsche Hälfte wegwerfen braucht bei doppelt so dickem Buch nur **einen** Schritt mehr – **O(log n)**.

## Die wichtigsten Klassen

\`\`\`widget
bigo
\`\`\`

| Klasse | Name | Bei n = 1.000 | Beispiel |
|---|---|---|---|
| O(1) | konstant | 1 | Array-Zugriff per Index, Hash-Lookup |
| O(log n) | logarithmisch | ~10 | [[Binäre Suche]], balancierter Baum |
| O(n) | linear | 1.000 | einmal über eine Liste laufen |
| O(n log n) | linearithmisch | ~10.000 | gute Sortierverfahren (Mergesort) |
| O(n²) | quadratisch | 1.000.000 | jedes Paar vergleichen |
| O(2ⁿ) | exponentiell | ≈ 10³⁰¹ | alle Teilmengen ausprobieren |
| O(n!) | faktoriell | unvorstellbar | alle Reihenfolgen ausprobieren |

## Regeln zum Bestimmen

1. **Konstanten fallen weg:** O(2n) = O(n). Es geht um das Wachstum, nicht um exakte Schritte.
2. **Nur der dominante Term zählt:** O(n² + n) = O(n²).
3. **Nacheinander → addieren:** zwei Schleifen hintereinander: O(n + m).
4. **Verschachtelt → multiplizieren:** Schleife in Schleife: O(n · m).
5. **Halbieren pro Schritt → logarithmisch.**

\`\`\`python title="Komplexität im Code erkennen"
def summe(zahlen):                  # O(n): jedes Element einmal
    s = 0
    for z in zahlen:
        s += z
    return s

def hat_duplikat_langsam(xs):       # O(n²): jedes Paar
    for i in range(len(xs)):
        for j in range(i + 1, len(xs)):
            if xs[i] == xs[j]:
                return True
    return False

def hat_duplikat_schnell(xs):       # O(n) Zeit, O(n) Speicher: Set-Lookup ist O(1)
    gesehen = set()
    for x in xs:
        if x in gesehen:
            return True
        gesehen.add(x)
    return False
\`\`\`

> [!TIP] Zeit gegen Speicher tauschen
> \`hat_duplikat_schnell\` ist schneller, braucht aber zusätzlichen Speicher für das Set. Solche Abwägungen zwischen [[Laufzeitkomplexität]] und [[Speicherkomplexität]] sind typisch.

## Versteckte Komplexität

Viele Operationen sehen nach O(1) aus, sind es aber nicht:

\`\`\`javascript
// O(n²)! includes() durchsucht das Array jedes Mal linear
const eindeutig = [];
for (const x of liste) if (!eindeutig.includes(x)) eindeutig.push(x);

// O(n): Set prüft in konstanter Zeit
const eindeutig2 = [...new Set(liste)];
\`\`\`

| Operation | Liste/Array | Set/Map (Hash) |
|---|---|---|
| Zugriff per Index | O(1) | – |
| „Enthält x?“ | **O(n)** | O(1) im Mittel |
| Am Ende anhängen | O(1) amortisiert | O(1) |
| Am Anfang einfügen | **O(n)** | – |
| Element entfernen | O(n) | O(1) im Mittel |

Auch \`string += …\` in Schleifen (in manchen Sprachen O(n²) durch ständiges Kopieren), \`list.pop(0)\` in Python (O(n), besser \`collections.deque\`) oder eine Datenbankabfrage pro Element ([[N+1-Problem]]) sind klassische Fallen.

## Best, Average, Worst Case

Big-O meint meist den **Worst Case**. Quicksort ist im Mittel O(n log n), im schlechtesten Fall O(n²). Hashtabellen sind im Mittel O(1), im Worst Case (viele Kollisionen) O(n). **Amortisiert** bedeutet: Eine einzelne Operation kann teuer sein, aber über viele Operationen gemittelt ist sie billig – z. B. das gelegentliche Vergrößern eines dynamischen Arrays.

## Was Big-O nicht sagt

- **Konstanten zählen in der Praxis:** Für kleine n kann ein O(n²)-Verfahren schneller sein als ein O(n log n)-Verfahren mit großem Overhead. Deshalb nutzen Standardbibliotheken für kleine Teilstücke Insertion Sort.
- **Speicherzugriffe:** Cache-freundliche Datenstrukturen (Arrays) schlagen in der Praxis oft theoretisch gleichwertige (verkettete Listen).
- **Messen schlägt Raten:** Big-O hilft bei der Wahl des Ansatzes, ein Profiler zeigt die tatsächlichen Engpässe.

## Wie geht es weiter?

Sieh dir die Klassen in Aktion an im [Sortier-Visualisierer](#/labor/algorithmen) und lerne die passenden [Datenstrukturen](#/artikel/datenstrukturen) kennen.

\`\`\`widget
quiz:Algorithmen 3
\`\`\`
`;export{e as default};
