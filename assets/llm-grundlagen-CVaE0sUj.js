const e=`---
id: llm-grundlagen
title: LLMs verstehen: Tokens, Kontextfenster, Prompting & Evals
area: ki
difficulty: fortgeschritten
minutes: 18
order: 11
summary: Wie große Sprachmodelle Text erzeugen, was Tokens und Kontextfenster bedeuten, wie man gute Prompts schreibt, warum Modelle halluzinieren und wie man Qualität mit Evals misst.
tags: [LLM, Tokens, Prompt Engineering, Kontextfenster, Halluzination, Evals]
related: [ki-grundlagen, embeddings-rag, tool-calling-agents-mcp]
---

## Was ist ein LLM?

Ein **[[LLM]]** (Large Language Model) ist ein [[Transformer]]-Modell mit Milliarden Parametern, trainiert auf riesigen Textmengen. Seine Grundaufgabe ist erstaunlich einfach: **das nächste Token vorhersagen**. Wiederholt man das – Token anhängen, nächstes vorhersagen, anhängen … –, entsteht Text. Weil gute Vorhersagen Verständnis von Grammatik, Fakten, Logik und Code erfordern, lernen die Modelle dabei erstaunlich viel davon.

Moderne Assistenzmodelle werden nach diesem **Pretraining** zusätzlich trainiert, Anweisungen zu befolgen und hilfreich, ehrlich und sicher zu antworten (Instruction Tuning, Training mit menschlichem und KI-Feedback).

## Tokens

Modelle verarbeiten keine Buchstaben oder Wörter, sondern **[[Token|Tokens]]** – häufige Zeichenfolgen, oft Wortteile:

\`\`\`text
„Programmierung ist spannend“  →  [Program] [mier] [ung] [ ist] [ sp] [annend]   (Beispiel, je nach Tokenizer)
\`\`\`

- Häufige Wörter sind ein Token, seltene werden zerlegt. Deutsch und Code brauchen oft mehr Tokens pro Wort als Englisch.
- **Kosten** und **Grenzen** werden in Tokens gemessen – für Eingabe und Ausgabe getrennt.
- Weil Modelle Tokens statt Buchstaben sehen, sind Aufgaben wie „Zähle die r in Erdbeere“ überraschend schwierig.

## Das Kontextfenster

Das **[[Kontextfenster]]** ist die maximale Menge an Tokens, die ein Modell in einer Anfrage verarbeiten kann – System-Anweisungen, bisheriger Verlauf, eingefügte Dokumente und die Antwort zusammen. Aktuelle große Modelle verarbeiten Hunderttausende bis rund eine Million Tokens.

> [!BEGINNER]
> Das Modell hat **kein Gedächtnis zwischen Anfragen**. Ein Chat „erinnert“ sich nur, weil die Anwendung bei jeder Nachricht den bisherigen Verlauf mitschickt. Was nicht im Kontext steht, weiß das Modell in diesem Moment nicht.

Mehr Kontext ist nicht automatisch besser: Er kostet mehr, dauert länger, und relevante Details können in irrelevanten untergehen. Gezielt auswählen, was das Modell braucht ([RAG](#/artikel/embeddings-rag)), ist oft wirksamer als „alles hineinwerfen“.

## Wie Text erzeugt wird

Für jede Position berechnet das Modell eine **Wahrscheinlichkeitsverteilung** über alle Tokens. Daraus wird gezogen (**Sampling**). Parameter wie [[Temperatur]] steuern bei vielen Modellen, wie stark der Zufall wirkt. Neuere Modelle bieten stattdessen oft andere Stellschrauben, etwa wie viel „Nachdenken“ (Reasoning) vor der Antwort investiert wird.

## Prompt Engineering

[[Prompt Engineering]] ist die Kunst, einem Modell klar zu sagen, was man will. Die wirksamsten Grundsätze:

1. **Kontext und Ziel erklären:** Wer ist die Zielgruppe? Wofür wird das Ergebnis genutzt? Was macht eine gute Antwort aus?
2. **Klar und konkret formulieren** statt vage („Schreib was über Docker“ vs. „Erkläre einer Junior-Entwicklerin in 5 Sätzen, warum Container-Daten in Volumes gehören“).
3. **Beispiele zeigen** (Few-Shot), wenn ein bestimmtes Format oder ein Stil gewünscht ist.
4. **Struktur geben:** Eingaben klar abgrenzen (z. B. mit XML-artigen Tags), gewünschtes Ausgabeformat beschreiben.
5. **Komplexe Aufgaben zerlegen** oder das Modell vor der Antwort überlegen lassen.
6. **Erlauben, „Ich weiß es nicht“ zu sagen.**

\`\`\`text title="Ein strukturierter Prompt"
Du bist Reviewer für Python-Code in einem Team, das Wert auf Lesbarkeit legt.

Prüfe den Code im Abschnitt <code> auf:
1. Fehler, die zu falschen Ergebnissen führen
2. Sicherheitsprobleme
3. Verstöße gegen PEP 8 (nur, wenn sie die Lesbarkeit deutlich beeinträchtigen)

Antworte als Liste. Für jeden Fund: Zeile, Problem, Vorschlag.
Wenn du nichts findest, schreibe „Keine Befunde“.

<code>
def teile(a, b):
    return a / b
</code>
\`\`\`

> [!TIP] Strukturierte Ausgaben
> Wenn Programme die Antwort weiterverarbeiten, nutze die Möglichkeit vieler APIs, ein **JSON-Schema** für die Ausgabe vorzugeben (Structured Outputs). Das ist zuverlässiger, als nur im Prompt „antworte in JSON“ zu schreiben.

## Halluzinationen

Modelle erzeugen *plausiblen* Text – nicht zwingend *wahren*. Fehlen Informationen, kann ein Modell überzeugend klingende, aber erfundene Details liefern: [[Halluzination|Halluzinationen]].

Gegenmittel:
- **Quellen mitgeben** ([RAG](#/artikel/embeddings-rag)) und Antworten mit Zitaten verlangen.
- **Werkzeuge** für Fakten, Berechnungen und aktuelle Daten ([Tool Calling](#/artikel/tool-calling-agents-mcp)).
- **Unsicherheit erlauben** und Ausgaben prüfen – automatisch (Schema, Tests) und bei wichtigen Entscheidungen durch Menschen.

## Qualität messen: Evals

Ob ein neuer Prompt oder ein anderes Modell **wirklich besser** ist, lässt sich nicht an drei Beispielen beurteilen. [[Evals]] sind für KI-Anwendungen, was [Tests](#/artikel/testing) für klassischen Code sind:

1. **Testfälle sammeln:** echte, repräsentative Eingaben – inklusive schwieriger Randfälle.
2. **Bewertungskriterien festlegen:** exakte Übereinstimmung, Schema-Validierung, Regex, Code ausführen – oder ein Modell als Bewerter mit klarer Rubrik („LLM-as-a-Judge“), stichprobenartig von Menschen geprüft.
3. **Automatisch ausführen** bei jeder Änderung und Ergebnisse vergleichen.

\`\`\`python title="Ein minimales Eval-Gerüst"
faelle = [
    {"eingabe": "Wie viele Bytes hat 'ä' in UTF-8?", "erwartet": "2"},
    {"eingabe": "Welcher HTTP-Status bedeutet 'nicht gefunden'?", "erwartet": "404"},
]

def bewerte(antwort: str, erwartet: str) -> bool:
    return erwartet in antwort

ergebnisse = [bewerte(frage_modell(f["eingabe"]), f["erwartet"]) for f in faelle]
print(f"{sum(ergebnisse)}/{len(faelle)} bestanden")
\`\`\`

## Datenschutz und Sicherheit

- Keine sensiblen Daten an Dienste senden, deren Verarbeitung (Speicherung, Training, Standort) nicht geklärt ist – DSGVO und Unternehmensrichtlinien beachten.
- Modellausgaben sind **nicht vertrauenswürdige Eingaben**: Generierten Code, SQL oder HTML vor der Ausführung prüfen.
- Eingeschleuste Anweisungen in Dokumenten oder Webseiten ([[Prompt Injection]]) einkalkulieren.
- Für besonders sensible Daten kommen [[Lokale KI-Modelle|lokale Modelle]] infrage.

## Wie geht es weiter?

Wie man Modelle mit eigenem Wissen verbindet, zeigt [Embeddings & RAG](#/artikel/embeddings-rag); wie sie Werkzeuge nutzen, [Tool Calling, Agents & MCP](#/artikel/tool-calling-agents-mcp).
`;export{e as default};
