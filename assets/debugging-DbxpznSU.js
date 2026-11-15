const e=`---
id: debugging
title: Debugging: Fehler systematisch finden
area: tools
difficulty: einsteiger
minutes: 16
order: 13
summary: Eine systematische Methode zur Fehlersuche, Stack Traces lesen, Debugger mit Breakpoints nutzen, Browser-DevTools, Logging und Strategien für schwer reproduzierbare Fehler.
tags: [Debugging, Debugger, Breakpoint, Stack Trace, DevTools, Logging]
related: [testing, git-grundlagen, monitoring-observability]
---

## Debugging ist eine Methode, kein Raten

Ein Fehler ist eine Abweichung zwischen dem, was du **erwartest**, und dem, was **passiert**. [[Debugging]] heißt, diese Lücke systematisch zu schließen – nicht wahllos Dinge zu ändern, bis es „irgendwie“ funktioniert.

1. **Reproduzieren:** Unter welchen genauen Bedingungen tritt der Fehler auf? Ohne Reproduktion keine Gewissheit, dass er behoben ist.
2. **Fehlermeldung vollständig lesen** – inklusive Stack Trace.
3. **Hypothese bilden:** „Ich vermute, \`user\` ist hier \`None\`, weil …“
4. **Hypothese prüfen** mit Debugger, Logging oder einem Test – nur **eine** Variable gleichzeitig ändern.
5. **Ursache beheben**, nicht das Symptom.
6. **Absichern:** Einen Test schreiben, der den Fehler reproduziert ([Regressionstest](#/artikel/testing)).

> [!BEGINNER] Rubber Duck Debugging
> Erkläre das Problem Zeile für Zeile jemandem – notfalls einer Gummiente. Beim Formulieren fällt dir oft selbst auf, wo deine Annahme nicht stimmt. Klingt albern, funktioniert erstaunlich gut.

## Stack Traces lesen

Ein [[Stack Trace]] zeigt die Kette der Funktionsaufrufe bis zum Fehler. Er ist die wichtigste Informationsquelle – und wird oft nicht gelesen.

\`\`\`text title="Python-Traceback"
Traceback (most recent call last):
  File "app.py", line 18, in <module>
    print(begruessung(lade_nutzer(42)))
  File "app.py", line 12, in begruessung
    return f"Hallo {nutzer['name'].title()}"
TypeError: 'NoneType' object is not subscriptable
\`\`\`

- In Python steht der **Fehler ganz unten**, die Aufrufkette läuft von oben (Einstieg) nach unten (Fehlerstelle).
- Die Meldung sagt: \`nutzer\` ist \`None\`. Die eigentliche Frage ist also: **Warum** liefert \`lade_nutzer(42)\` \`None\`? Die Ursache liegt oft eine Ebene über der Fehlerzeile.
- In Java, JavaScript und C# steht die Fehlermeldung **oben**, die innerste Stelle zuerst.
- Zeilen aus fremden Bibliotheken überspringen und nach der **ersten Zeile im eigenen Code** suchen.

\`\`\`text title="JavaScript im Browser"
Uncaught TypeError: Cannot read properties of undefined (reading 'map')
    at ProduktListe (ProduktListe.tsx:8:22)
    at renderWithHooks (react-dom.development.js:…)
\`\`\`

## Der Debugger

Ein Debugger hält das Programm an einer gewünschten Stelle an. Dann siehst du **alle Variablen** und kannst Zeile für Zeile weitergehen – viel mächtiger als \`print\`.

| Funktion | Bedeutung |
|---|---|
| **[[Breakpoint]]** | Hier anhalten |
| **Bedingter Breakpoint** | Nur anhalten, wenn z. B. \`id == 42\` |
| **Logpoint** | Nachricht ausgeben, ohne Code zu ändern oder anzuhalten |
| **Step Over** | Nächste Zeile, Funktionsaufrufe nicht betreten |
| **Step Into** | In die aufgerufene Funktion hineingehen |
| **Step Out** | Bis zum Ende der aktuellen Funktion laufen |
| **Continue** | Bis zum nächsten Breakpoint weiterlaufen |
| **Watch / Call Stack** | Ausdrücke beobachten, Aufrufkette ansehen |

\`\`\`python title="Python: Debugger direkt im Code starten"
def berechne_summe(posten):
    gesamt = 0
    for p in posten:
        breakpoint()            # startet pdb (oder den IDE-Debugger)
        gesamt += p["preis"] * p["menge"]
    return gesamt
\`\`\`

Wichtige \`pdb\`-Befehle: \`n\` (nächste Zeile), \`s\` (hineinspringen), \`c\` (weiter), \`p ausdruck\` (ausgeben), \`l\` (Code anzeigen), \`q\` (beenden).

\`\`\`javascript title="JavaScript: Haltepunkt im Browser oder in Node.js"
function berechneSumme(posten) {
  let gesamt = 0;
  for (const p of posten) {
    debugger;                   // hält an, wenn DevTools bzw. Debugger aktiv sind
    gesamt += p.preis * p.menge;
  }
  return gesamt;
}
\`\`\`

In [VS Code](#/tech/vscode), [IntelliJ](#/tech/intellij) und [PyCharm](#/tech/pycharm) setzt du Breakpoints per Klick neben die Zeilennummer. Node.js lässt sich mit \`node --inspect app.js\` für Debugger öffnen.

> [!WARNING]
> \`breakpoint()\`, \`debugger;\` und Debug-Ausgaben vor dem Commit entfernen. Ein [[Linter]] kann das automatisch prüfen (z. B. ESLint-Regel \`no-debugger\`).

## Browser-DevTools

Mit F12 öffnen die [DevTools](#/tech/devtools) im Browser:

- **Elements:** HTML und berechnetes CSS live inspizieren und ändern – ideal für Layout-Probleme.
- **Console:** Fehler und Ausgaben; JavaScript direkt ausführen.
- **Sources:** Breakpoints in JavaScript setzen, auch bei Ereignissen („Pause bei Klick“).
- **Network:** Jede Anfrage mit Status, Headern, Body und Dauer – die erste Anlaufstelle bei API-Problemen (falsche URL, 401, CORS-Fehler).
- **Application:** Cookies, localStorage, Service Worker.
- **Performance / Lighthouse:** Ladezeiten und Rendering analysieren.

## Logging

Für Fehler in Produktion, in Hintergrundjobs oder bei zeitabhängigen Abläufen ist ein Debugger oft keine Option. Dann helfen gute Logs ([[Logging]]):

\`\`\`python
import logging

logger = logging.getLogger(__name__)

def zahlung_verarbeiten(bestellung_id: int, betrag: float) -> None:
    logger.info("Zahlung gestartet", extra={"bestellung_id": bestellung_id, "betrag": betrag})
    try:
        zahlungsanbieter.belaste(bestellung_id, betrag)
    except ZahlungsFehler:
        logger.exception("Zahlung fehlgeschlagen", extra={"bestellung_id": bestellung_id})
        raise
\`\`\`

- **Log-Level** bewusst wählen: \`DEBUG\` (Details), \`INFO\` (normale Ereignisse), \`WARNING\`, \`ERROR\`.
- **Kontext mitloggen:** IDs von Anfrage, Bestellung, Nutzer – so lassen sich Abläufe verfolgen.
- **Strukturiert** (z. B. JSON) loggen, damit Logs durchsuchbar sind – siehe [Monitoring & Observability](#/artikel/monitoring-observability).

> [!DANGER] Keine sensiblen Daten in Logs
> Passwörter, Tokens, vollständige Kreditkartennummern und unnötige personenbezogene Daten gehören nicht in Logs. Logs werden oft breit geteilt und lange aufbewahrt.

## Strategien für harte Fälle

| Strategie | Wann |
|---|---|
| **Problem verkleinern** | Minimalbeispiel bauen: alles entfernen, was für den Fehler nicht nötig ist |
| **Binäre Suche im Code** | Hälfte auskommentieren/umgehen – tritt der Fehler noch auf? |
| **\`git bisect\`** | „Gestern ging es noch“: Git findet per binärer Suche den Commit, der den Fehler eingeführt hat |
| **Annahmen prüfen** | Ist das wirklich die Version/Konfiguration/Datei, die ich glaube? Läuft der Code überhaupt? |
| **Umgebungen vergleichen** | Lokal geht’s, auf dem Server nicht: Versionen, Umgebungsvariablen, Rechte, Zeitzonen |
| **Pause machen** | Nach einer Stunde ohne Fortschritt hilft frischer Blick mehr als die zweite Stunde |

\`\`\`bash title="git bisect: den schuldigen Commit finden"
git bisect start
git bisect bad                  # aktueller Stand ist fehlerhaft
git bisect good v2.3.0          # dieser Stand war noch in Ordnung
# Git checkt einen Commit in der Mitte aus → testen → markieren:
git bisect good                 # oder: git bisect bad
# … wiederholen, bis Git den ersten fehlerhaften Commit meldet
git bisect reset                # zurück zum Ausgangszustand
\`\`\`

## Typische Fehlerquellen

- **Off-by-one:** \`<\` statt \`<=\`, Index 0 vs. 1.
- **\`null\`/\`undefined\`/\`None\`** dort, wo ein Wert erwartet wird.
- **Veränderte geteilte Daten:** Zwei Variablen zeigen auf dasselbe Objekt.
- **Asynchronität:** Ergebnis wird benutzt, bevor es da ist (fehlendes \`await\`).
- **Gleitkommazahlen:** \`0.1 + 0.2 !== 0.3\` – siehe [Zahlensysteme & Encoding](#/artikel/zahlensysteme-encoding).
- **Encoding und Zeitzonen.**
- **Caching:** Alter Stand im Browser, CDN oder Build-Cache.

Mehr typische Stolperfallen sammelt die Seite [Häufige Fehler](#/fehler).
`;export{e as default};
