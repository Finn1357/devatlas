const e=`---
id: rekursion-dp
title: Rekursion & Dynamic Programming
area: algorithmen
difficulty: profi
minutes: 18
order: 13
summary: Wie rekursive Funktionen denken, was Basisfall und Call Stack damit zu tun haben, und wie Memoization und Tabellen aus exponentiellen Algorithmen lineare machen.
tags: [Rekursion, Dynamic Programming, Memoization, Call Stack, Algorithmen]
related: [big-o, datenstrukturen, sortieren-suchen, compiler-interpreter-runtime]
---

## Was ist Rekursion?

Eine Funktion ist **rekursiv**, wenn sie sich selbst aufruft – mit einem kleineren Teilproblem. Jede Rekursion braucht zwei Teile:

1. **Basisfall:** ein Fall, der ohne weiteren Aufruf beantwortet wird.
2. **Rekursionsschritt:** das Problem verkleinern und die Funktion erneut aufrufen.

\`\`\`python
def fakultaet(n: int) -> int:
    if n <= 1:                     # Basisfall
        return 1
    return n * fakultaet(n - 1)    # Rekursionsschritt

fakultaet(5)   # 5 * 4 * 3 * 2 * 1 = 120
\`\`\`

> [!BEGINNER]
> Du stehst in einer Schlange und willst wissen, an welcher Stelle du bist. Du fragst die Person vor dir. Sie fragt die Person vor sich … Die erste weiß: „Ich bin Nummer 1“ (Basisfall). Die Antworten wandern zurück, jeder addiert 1.

## Was im Speicher passiert

Jeder Aufruf legt einen neuen **Frame** auf den [[Call Stack]] – mit eigenen lokalen Variablen. Erst wenn der Basisfall erreicht ist, werden die Frames in umgekehrter Reihenfolge abgebaut.

\`\`\`text
fakultaet(4)
└─ 4 * fakultaet(3)
       └─ 3 * fakultaet(2)
              └─ 2 * fakultaet(1)
                     └─ 1          ← Basisfall
              ← 2 * 1 = 2
       ← 3 * 2 = 6
← 4 * 6 = 24
\`\`\`

> [!WARNING] Stack Overflow
> Ohne Basisfall (oder bei sehr tiefer Rekursion) läuft der Stack über. Python bricht standardmäßig nach ca. 1.000 Ebenen mit \`RecursionError\` ab, JavaScript mit \`RangeError: Maximum call stack size exceeded\`. Für Tiefen von Hunderttausenden ist eine **iterative** Lösung mit explizitem [[Stack]] besser.

## Wo Rekursion glänzt

Rekursion passt natürlich zu **rekursiven Strukturen**: [[Baum|Bäume]], verschachtelte Daten, Dateisysteme, [[Divide and Conquer|Teile-und-herrsche]]-Algorithmen.

\`\`\`javascript title="Alle Dateien eines verschachtelten Ordners zählen"
function zaehleDateien(ordner) {
  let anzahl = ordner.dateien.length;
  for (const unterordner of ordner.ordner) {
    anzahl += zaehleDateien(unterordner);
  }
  return anzahl;
}
\`\`\`

\`\`\`python title="Merge Sort: Teile, herrsche, füge zusammen"
def merge_sort(a: list[int]) -> list[int]:
    if len(a) <= 1:
        return a
    mitte = len(a) // 2
    links, rechts = merge_sort(a[:mitte]), merge_sort(a[mitte:])
    ergebnis, i, j = [], 0, 0
    while i < len(links) and j < len(rechts):
        if links[i] <= rechts[j]:
            ergebnis.append(links[i]); i += 1
        else:
            ergebnis.append(rechts[j]); j += 1
    return ergebnis + links[i:] + rechts[j:]
\`\`\`

## Das Problem: wiederholte Teilprobleme

\`\`\`python title="Naive Fibonacci – O(2ⁿ)"
def fib(n: int) -> int:
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
\`\`\`

\`fib(5)\` berechnet \`fib(3)\` zweimal, \`fib(2)\` dreimal … \`fib(40)\` braucht über 300 Millionen Aufrufe. Die Teilprobleme **überlappen** – genau hier setzt Dynamic Programming an.

## Dynamic Programming

[[Dynamic Programming]] löst Probleme, die (1) sich in Teilprobleme zerlegen lassen, deren optimale Lösungen zur Gesamtlösung beitragen, und (2) **überlappende Teilprobleme** haben. Man speichert jedes Teilergebnis und berechnet es nur einmal.

### Top-down: Memoization

\`\`\`python
from functools import cache

@cache                              # Ergebnisse je Argument speichern
def fib(n: int) -> int:
    return n if n < 2 else fib(n - 1) + fib(n - 2)

fib(200)   # sofort – jeder Wert wird nur einmal berechnet: O(n)
\`\`\`

[[Memoization]] behält die rekursive Struktur bei und ergänzt einen Cache.

### Bottom-up: Tabelle

\`\`\`python
def fib(n: int) -> int:
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a                        # O(n) Zeit, O(1) Speicher, keine Rekursionstiefe
\`\`\`

## Ein echtes DP-Problem: Editierdistanz

Wie viele Einfüge-, Lösch- oder Ersetzungsoperationen braucht man, um ein Wort in ein anderes zu verwandeln? (Grundlage für Rechtschreibkorrektur und Diff-Werkzeuge.)

\`\`\`python title="Levenshtein-Distanz"
def editierdistanz(a: str, b: str) -> int:
    # d[i][j] = Distanz zwischen a[:i] und b[:j]
    d = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(len(a) + 1): d[i][0] = i          # alles löschen
    for j in range(len(b) + 1): d[0][j] = j          # alles einfügen
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            kosten = 0 if a[i - 1] == b[j - 1] else 1
            d[i][j] = min(
                d[i - 1][j] + 1,          # löschen
                d[i][j - 1] + 1,          # einfügen
                d[i - 1][j - 1] + kosten, # ersetzen (oder gleich)
            )
    return d[len(a)][len(b)]

editierdistanz("Katze", "Tatzen")   # 2
\`\`\`

Laufzeit O(n · m) statt exponentiell vieler Kombinationen.

## Vorgehen bei DP-Problemen

1. **Zustand definieren:** Was beschreibt ein Teilproblem? (z. B. \`d[i][j]\`)
2. **Übergang formulieren:** Wie ergibt sich ein Zustand aus kleineren?
3. **Basisfälle festlegen.**
4. **Reihenfolge** wählen (top-down mit Cache oder bottom-up mit Tabelle).
5. Optional **Speicher optimieren** (oft genügt die letzte Zeile der Tabelle).

Klassische DP-Probleme: Rucksackproblem, längste gemeinsame Teilfolge, Münzwechsel, kürzeste Wege (Bellman-Ford, Floyd-Warshall). Verwandt, aber anders: **[[Greedy-Algorithmus|Greedy-Algorithmen]]** treffen lokal beste Entscheidungen ohne Rückblick – schneller, aber nur bei bestimmten Problemstrukturen korrekt.

## Wie geht es weiter?

Übe mit den [Challenges](#/quiz?tab=challenges) (Fibonacci, Verschachtelte Listen glätten) und vergleiche Rekursion in verschiedenen Sprachen in der [Syntax-Bibliothek](#/syntax/funktionen).
`;export{e as default};
