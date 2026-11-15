const e=`---
id: sortieren-suchen
title: Sortieren & Suchen
area: algorithmen
difficulty: fortgeschritten
minutes: 16
order: 12
summary: Bubble, Insertion, Selection, Merge und Quick Sort animiert, Stabilität und In-place-Sortierung, binäre Suche ohne Off-by-one-Fehler und warum du in der Praxis fast immer die eingebaute Sortierung nutzt.
tags: [Sortieren, Suchen, Binäre Suche, Quicksort, Mergesort]
related: [big-o, datenstrukturen, rekursion-dp]
---

## Warum Sortieren so wichtig ist

Sortierte Daten lassen sich viel schneller durchsuchen ([[Binäre Suche]] statt [[Lineare Suche]]), gruppieren, deduplizieren und zusammenführen. Sortieralgorithmen sind außerdem das Lehrbeispiel schlechthin für [[Big-O-Notation|Komplexität]], [[Rekursion]] und [[Divide and Conquer]].

## Fünf Verfahren im Vergleich

Wähle ein Verfahren und beobachte Vergleiche (cyan) und Tausch-/Schreibvorgänge (gelb):

\`\`\`widget
sorting
\`\`\`

| Verfahren | Best | Durchschnitt | Worst | Zusatzspeicher | Stabil |
|---|---|---|---|---|---|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | ja |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | ja |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | nein |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | ja |
| Quicksort | O(n log n) | O(n log n) | O(n²) | O(log n) | nein |
| Heapsort | O(n log n) | O(n log n) | O(n log n) | O(1) | nein |

> [!INFO] Untere Schranke
> Jedes Sortierverfahren, das nur durch **Vergleiche** arbeitet, braucht im Worst Case mindestens O(n log n) Vergleiche. Schneller geht es nur mit Zusatzwissen über die Daten – z. B. Counting Sort oder Radix Sort für Ganzzahlen aus einem begrenzten Bereich (O(n + k)).

## Stabilität

Ein Verfahren ist **stabil**, wenn gleiche Elemente ihre ursprüngliche Reihenfolge behalten. Das ist wichtig, wenn man nach mehreren Kriterien sortiert:

\`\`\`python
mitarbeiter = [("Ada", "IT"), ("Linus", "Ops"), ("Grace", "IT"), ("Ken", "Ops")]
nach_name = sorted(mitarbeiter)                               # erst nach Name
nach_abteilung = sorted(nach_name, key=lambda m: m[1])        # dann stabil nach Abteilung
# [('Ada', 'IT'), ('Grace', 'IT'), ('Ken', 'Ops'), ('Linus', 'Ops')] – innerhalb der Abteilung alphabetisch
\`\`\`

## Was die Standardbibliotheken nutzen

- **Python** (\`sorted\`, \`list.sort\`) und **Java** (für Objekte): **Timsort** – ein hybrides, stabiles Verfahren aus Merge und Insertion Sort, das bereits sortierte Teilfolgen („Runs“) ausnutzt. Python 3.11 hat die Merge-Strategie verfeinert (Powersort).
- **C++** \`std::sort\`: **Introsort** (Quicksort, der bei zu tiefer Rekursion auf Heapsort umschaltet, plus Insertion Sort für kleine Bereiche) – nicht stabil; \`std::stable_sort\` ist stabil.
- **JavaScript** \`Array.prototype.sort\`: seit ES2019 stabil (V8 nutzt Timsort).
- **Rust**: \`sort\` stabil, \`sort_unstable\` schneller und in-place.

> [!TIP] In der Praxis
> Schreibe Sortierverfahren zum Lernen selbst – in Produktionscode nutzt du die eingebaute Sortierung mit einer Schlüssel- oder Vergleichsfunktion. Sie ist gründlich getestet und hochoptimiert.

\`\`\`javascript
// Achtung: ohne Vergleichsfunktion sortiert JS nach Strings!
[10, 1, 3].sort();                  // [1, 10, 3]
[10, 1, 3].sort((a, b) => a - b);   // [1, 3, 10]

produkte.sort((a, b) => a.preis - b.preis || a.name.localeCompare(b.name, 'de'));
\`\`\`

## Suchen

### Lineare Suche – O(n)

Element für Element prüfen. Funktioniert immer, auch auf unsortierten Daten, und ist bei kleinen Mengen völlig ausreichend.

### Binäre Suche – O(log n)

Auf **sortierten** Daten halbiert jeder Schritt den Suchbereich. Bei einer Milliarde Elementen genügen rund 30 Vergleiche.

\`\`\`python title="Binäre Suche – sorgfältig mit den Grenzen"
def binaere_suche(a: list[int], ziel: int) -> int:
    lo, hi = 0, len(a) - 1            # geschlossenes Intervall [lo, hi]
    while lo <= hi:                   # <=, sonst wird das letzte Element übersehen
        mitte = (lo + hi) // 2
        if a[mitte] == ziel:
            return mitte
        if a[mitte] < ziel:
            lo = mitte + 1            # +1, sonst Endlosschleife
        else:
            hi = mitte - 1
    return -1
\`\`\`

> [!MISTAKE] Off-by-one
> Die häufigsten Fehler sind \`<\` statt \`<=\`, \`lo = mitte\` statt \`mitte + 1\` und – in Sprachen mit festen Integer-Breiten – der Überlauf bei \`(lo + hi) / 2\`. Sicherer: \`lo + (hi - lo) / 2\`.

Fertige Implementierungen: Pythons \`bisect\`, Javas \`Collections.binarySearch\`, C++ \`std::lower_bound\`, Rusts \`binary_search\`.

\`\`\`python
import bisect
noten = [60, 70, 80, 90]
stufen = ["F", "D", "C", "B", "A"]
def bewertung(punkte): return stufen[bisect.bisect_right(noten, punkte)]
bewertung(85)    # 'B'
\`\`\`

### Binäre Suche über Antworten

Das Prinzip funktioniert nicht nur für Arrays, sondern für jede **monotone** Bedingung: „Was ist die kleinste Serveranzahl, mit der die Last bewältigt wird?“ – lässt sich mit binärer Suche über die möglichen Antworten lösen. Auch \`git bisect\` sucht so den Commit, der einen Fehler eingeführt hat.

## Wie geht es weiter?

Merge Sort und Quicksort sind rekursiv – wie Rekursion funktioniert und wann man sie durch Dynamic Programming beschleunigt, zeigt [Rekursion & DP](#/artikel/rekursion-dp). Übe mit den [Challenges](#/quiz?tab=challenges).
`;export{e as default};
